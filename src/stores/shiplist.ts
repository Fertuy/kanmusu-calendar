import { defineStore } from 'pinia'
import { Ref, watch } from 'vue'

import rawdata from '@/assets/rawdata.json'
import rawshipaswdata from '@/assets/rawshipaswdata.json'
import shipnames from '@/assets/shipnames.json'
import shipnamesuffixes from '@/assets/shipnamesuffixes.json'

const SPF = 45
const DLC = 24
const TANK = 46
const MIDGEDSUB = 22

export const LANDING_EQUIP_FILTER_OPTIONS = {
  WHATEVER: 0,
  DLC: 1,
  DLC_ONLY: 2,
  TANK: 3,
  TANK_ONLY: 4,
  EITHER: 5,
  NEITHER: 6,
}

export const SHIP_TYPE = {
  DE: 1,
  DD: 2,
  CL: 3,
  CLT: 4,
  CA: 5,
  CAV: 6,
  CVL: 7,
  FBB: 8,
  BB: 9,
  BBV: 10,
  CV: 11,
  // BBB: 12,
  SS: 13,
  SSV: 14,
  // AO_2: 15,
  AV: 16,
  LHA: 17,
  CVB: 18,
  AR: 19,
  AS: 20,
  CT: 21,
  AO: 22,
}

type ShipStatData = {
  name:string,
  modIndex:number,
}

const SHIP_STAT: {[key:string]:ShipStatData} = {
  FP: {
    name: 'api_houg',
    modIndex: 0,
  },
  TORP: {
    name: 'api_raig',
    modIndex: 1,
  },
  AA: {
    name: 'api_tyku',
    modIndex: 2,
  },
  ARMOR: {
    name: 'api_souk',
    modIndex: 3,
  },
  LUCK: {
    name: 'api_luck',
    modIndex: 4,
  },
  ASW: {
    name: '~',
    modIndex: 6,
  },
}

type ImportShipData = {
  rosterId:number,
  masterId:number,
  level:number,
  exp: [],
  hp: [],
  afterHp:[],
  fp:[],
  tp:[],
  aa:[],
  ar:[],
  ev:[],
  as:[],
  ls:[],
  lk:[],
  range:number,
  items:[],
  ex_item:number,
  slots:[],
  slotnum:number,
  speed:number,
  mod:[],
  spitems:[],
  fuel:number,
  ammo:number,
  repair:[],
  stars:number,
  morale:number,
  cond:number,
  lock:number,
  sally: number,
  akashiMark: number,
  preExpedCond: [],
  pendingConsumption: {},
  lastSortie: [],
}

export type FilterOptions = {
  tags: Array<number>,
  stype: Array<number>,
  name: string,
  spf: boolean,
  landingEquip: number,
  midgetSub: boolean,
  exSlot: boolean
}

export type Tag = {
  id: number
  name: string,
  color: string
}

export type Kanmusu = {
  id: number,
  uniqueId: number,
  name: string,
  level: number,
  stype: number,
  exSlot: boolean,
  spf: boolean,
  midgetSub: boolean,
  dlc: boolean,
  tank: boolean,
  tag: Tag | string,
  fp: number,
  aa: number,
  armor: number,
  torp: number,
  luck: number,
  asw: number,
}

export type Phase = {
  id: number
  name: string,
  description: string,
  tag: Tag | null,
  allowedTags: Array<Tag>
  ships: Array<Kanmusu>,
}

export type LockMap = {
  id: number
  name: string,
  phases: Array<Phase>
}

export const useShiplist = defineStore('shiplist', () => {
  const shiplist: Ref<Array<Kanmusu>> = ref([])
  const filteredShiplist: Ref<Array<Kanmusu>> = ref([])
  const lockMap: Ref<Array<LockMap>> = ref([])
  const tags: Ref<Array<Tag>> = ref([])
  const shipFilter: Ref<FilterOptions> = ref({
    tags: [],
    stype: [],
    name: '',
    spf: false,
    landingEquip: 0,
    midgetSub: false,
    exSlot: false,
  })

  const shipData = rawdata.ship
  const equipShip = Object.keys(rawdata.equip_ship)
    .map(key => rawdata.equip_ship[key as unknown as keyof typeof rawdata.equip_ship])
  const rawStype = rawdata.stype

  // LOAD DATA FROM USER LOCALSTORAGE
  const tagsInLocalStorage = localStorage.getItem('tags')
  if (tagsInLocalStorage) {
    tags.value = JSON.parse(tagsInLocalStorage)
  }
  const mapsInLocalStorage = localStorage.getItem('maps')
  if (mapsInLocalStorage) {
    lockMap.value = JSON.parse(mapsInLocalStorage)
  }
  const shipsInLocalStorage = localStorage.getItem('ships')
  if (shipsInLocalStorage) {
    shiplist.value = JSON.parse(shipsInLocalStorage)
    filteredShiplist.value = shiplist.value
    doFilter()
  }

  // WATCHERS FOR SAVING DATA TO LOCALSTORAGE
  watch(
    () => tags,
    state => {
      console.log(state.value)
      localStorage.setItem('tags', JSON.stringify(state.value))
    },
    { deep: true },
  )
  watch(
    () => lockMap,
    state => {
      localStorage.setItem('maps', JSON.stringify(state.value))
    },
    { deep: true }
  )
  watch(
    () => shiplist,
    state => {
      localStorage.setItem('ships', JSON.stringify(state.value))
    },
    { deep: true }
  )

  // Check if ship can equip specific type of equipment
  function isShipCanUseIt (itemId:number, shipId:number, shipTypeId: number): boolean {
    return equipShip
      .findIndex(i =>
        i.api_ship_id === shipId && i.api_equip_type.indexOf(itemId) !== -1) > 0 || rawStype[shipTypeId as unknown as keyof typeof rawStype]
      .api_equip_type[itemId as unknown as keyof typeof rawStype] === 1
  }

  function getBaseStat (stat:ShipStatData, ship:ImportShipData): number {
    const _rawShip = shipData[ship.masterId as unknown as keyof typeof shipData]
    const _rawStat = _rawShip[stat.name as unknown as keyof typeof _rawShip]
    if (Array.isArray(_rawStat)) {
      return Number.parseInt(ship.mod[stat.modIndex] + _rawStat[0])
    }
    return 0
  }

  function getAswStat (stat:ShipStatData, ship: ImportShipData):number {
    const shipFromRawShipAswData = rawshipaswdata.find(_ship => _ship.id === ship.masterId)
    if (shipFromRawShipAswData) {
      return shipFromRawShipAswData.min_asw +
        Math.floor((shipFromRawShipAswData.asw - shipFromRawShipAswData.min_asw) *
          ship.level / 99.0) + ship.mod[stat.modIndex]
    }
    return 0
  }

  function sortList () {
    filteredShiplist.value.sort((a, b) => b.level - a.level)
  }

  // Import ship list from noro6 Aerial combat simulator
  function importShiplist (rawShiplist: string) {
    const shList:Array<ImportShipData> = Object.values(JSON.parse(rawShiplist))

    shiplist.value = shList.map(ship => {
      const _stype = shipData[ship.masterId as unknown as keyof typeof shipData].api_stype
      let _name = shipData[ship.masterId as unknown as keyof typeof shipData].api_name
      const _spf = isShipCanUseIt(SPF, ship.masterId, _stype)
      const _dlc = isShipCanUseIt(DLC, ship.masterId, _stype)
      const _tank = isShipCanUseIt(TANK, ship.masterId, _stype)
      const _midgetSub = isShipCanUseIt(MIDGEDSUB, ship.masterId, _stype)
      const _fp = getBaseStat(SHIP_STAT.FP, ship)
      const _torp = getBaseStat(SHIP_STAT.TORP, ship)
      const _armor = getBaseStat(SHIP_STAT.ARMOR, ship)
      const _aa = getBaseStat(SHIP_STAT.AA, ship)
      const _luck = getBaseStat(SHIP_STAT.LUCK, ship)
      const _asw = getAswStat(SHIP_STAT.ASW, ship)
      _name = addShipSuffix(_name)

      return {
        id: ship.masterId,
        uniqueId: ship.rosterId,
        name: _name,
        level: ship.level,
        stype: _stype,
        spf: _spf,
        midgetSub: _midgetSub,
        dlc: _dlc,
        tank: _tank,
        exSlot: ship.ex_item !== 0,
        tag: '',
        fp: _fp,
        torp: _torp,
        asw: _asw,
        aa: _aa,
        armor: _armor,
        luck: _luck,
      }
    })
    resetFilter()
  }

  function addShipSuffix (shipName: string):string {
    // Create a regular expression pattern from the keys of the replacements object
    const shipSuffixPattern = new RegExp(Object.keys(shipnamesuffixes).join('|'), 'g')

    // Create a regular expression pattern from the keys of the replacements object
    const shipNamePattern = new RegExp(Object.keys(shipnames).join('|'), 'g')

    // Replace occurrences of the keys in the input string with their corresponding values
    let transformedString = shipName
      .replace(shipSuffixPattern, match => shipnamesuffixes[match as keyof typeof shipnamesuffixes])

    transformedString = transformedString
      .replace(shipNamePattern, match => shipnames[match as keyof typeof shipnames])

    return transformedString
  }

  function doFilter () {
    const {
      name, tags, stype,
      landingEquip, spf, midgetSub
      , exSlot,
    } = shipFilter.value

    filteredShiplist.value = shiplist.value.filter(ship => {
      // Filter by name
      const matchesName = !name || ship.name.toLowerCase().includes(name.toLowerCase())

      // Filter by tags
      const matchesTags = tags.length === 0 || (
        typeof ship.tag === 'string' ? tags.includes(0) : tags.includes(ship.tag.id)
      )

      // Filter by stype
      const matchesStype = stype.length === 0 || stype.includes(ship.stype)

      // Filter by landing equipment
      const matchesLandingEquip = landingEquip ===
        LANDING_EQUIP_FILTER_OPTIONS.WHATEVER || (
        landingEquip === LANDING_EQUIP_FILTER_OPTIONS.DLC ? ship.dlc
          : landingEquip === LANDING_EQUIP_FILTER_OPTIONS.DLC_ONLY ? ship.dlc && !ship.tank
            : landingEquip === LANDING_EQUIP_FILTER_OPTIONS.TANK ? ship.tank
              : landingEquip === LANDING_EQUIP_FILTER_OPTIONS.TANK_ONLY ? ship.tank && !ship.dlc
                : landingEquip === LANDING_EQUIP_FILTER_OPTIONS.EITHER ? ship.tank || ship.dlc
                  : landingEquip === LANDING_EQUIP_FILTER_OPTIONS.NEITHER ? !ship.tank && !ship.dlc
                    : true
      )

      // Filter by special flags
      const matchesSpf = !spf || ship.spf
      const matchesMidgetSub = !midgetSub || ship.midgetSub
      const matchesExSlot = !exSlot || ship.exSlot

      // Combine all conditions
      return matchesName && matchesTags && matchesStype &&
        matchesLandingEquip && matchesSpf && matchesMidgetSub &&
        matchesExSlot
    })

    sortList()
  }

  function applyFilter (_shipFilter:FilterOptions) {
    // Not readonly
    // shipFilter.value = _shipFilter
    //
    // readonly!!!
    shipFilter.value = JSON.parse(JSON.stringify(_shipFilter))

    doFilter()
  }

  function resetFilter () {
    shipFilter.value = {
      tags: [],
      stype: [],
      name: '',
      spf: false,
      landingEquip: 0,
      midgetSub: false,
      exSlot: false,
    }
    doFilter()
  }

  function addLockMap () {
    lockMap.value.push({
      id: (new Date()).getTime(),
      name: 'New Map',
      phases: [],
    })
  }

  function addPhaseToMap (map:LockMap) {
    const mapIndex = lockMap.value.findIndex(_map => _map.id === map.id)
    if (mapIndex > -1) {
      lockMap.value[mapIndex].phases.push({
        id: (new Date()).getTime(),
        name: 'New Phase',
        tag: null,
        allowedTags: [],
        description: '',
        ships: [],
      })
    }
  }

  function deleteLockMap (map: LockMap) {
    // Delete all phases in map to remove shiplock if needed
    for (let i = 0; i !== map.phases.length;) {
      deletePhase(map.phases[i])
    }
    const mapIndex = lockMap.value.findIndex(_map => _map.id === map.id)
    if (mapIndex > -1) {
      lockMap.value.splice(mapIndex, 1)
    }
  }

  function deletePhase (phase: Phase) {
    // Find the map index from which the phase will be deleted
    const mapIndex:number|undefined = lockMap.value
      .findIndex(_map => _map.phases.find(_phase => _phase.id === phase.id))

    // If can't find throw error
    if (mapIndex === undefined) {
      console.error(`Error, can't find the map with phase id ${phase.id}`)
      return
    }

    // Find phase index
    const phaseIndex:number|undefined = lockMap.value[mapIndex]
      .phases.findIndex(_phase => _phase.id === phase.id)

    // If can't find throw error
    if (phaseIndex === undefined) {
      console.error(`Error, can't find the phase with id ${phase.id}`)
      return
    }

    // Clear shiplock if needed
    beforePhaseDelete(phase)
    // Filter
    doFilter()
    // Delete
    lockMap.value[mapIndex].phases.splice(phaseIndex, 1)
  }

  // Remove ship from phase
  function removeShipFromPhase (phaseId: number, shipId:number) {
    console.log(shipFilter.value)
    const mapIndex = lockMap.value
      .findIndex(_map => _map.phases.findIndex(_phase => _phase.id === phaseId) !== -1)
    if (mapIndex === -1) {
      return
    }
    const phaseIndex = lockMap.value[mapIndex].phases
      .findIndex(_phase => _phase.id === phaseId)
    if (phaseIndex === -1) {
      return
    }
    const shipIndex = lockMap.value[mapIndex].phases[phaseIndex]
      .ships.findIndex(_ship => _ship.id === shipId)
    if (shipIndex === -1) {
      return
    }
    lockMap.value[mapIndex].phases[phaseIndex]
      .ships.splice(shipIndex, 1)

    if (checkIfRemovingShipNotInAnyOtherPhases(phaseId, shipId)) {
      const shipTagIndex = shiplist.value
        .findIndex(_ship => _ship.id === shipId)
      if (shipTagIndex === -1) {
        return
      }
      shiplist.value[shipTagIndex].tag = ''
    }
  }

  function checkIfRemovingShipNotInAnyOtherPhases (phaseId:number, shipId:number) {
    for (const map of lockMap.value) {
      for (const p of map.phases) {
        // Skip the deleted phase
        if (p.id === phaseId) continue

        if (p.ships.findIndex(_ship => _ship.id === shipId) !== -1) {
          return false
        }
      }
    }
    return true
  }

  function setShipTag (uniqueId: number, tag: Tag): void {
    const index = shiplist.value.findIndex(ship => ship.uniqueId === uniqueId)
    shiplist.value[index].tag = tag
  }

  // Function to check if kanmusu can lose a tag when a phase is deleted
  function beforePhaseDelete (phase: Phase): void {
    // Get all Kanmusu uniqueIds from the deleted phase
    const deletedKanmusuIds = new Set(phase.ships.map(ship => ship.uniqueId))

    // Create a map to track if each Kanmusu is used in other phases
    const kanmusuUsage: Record<number, boolean> = {}

    for (const map of lockMap.value) {
      for (const p of map.phases) {
        // Skip the deleted phase
        if (p.id === phase.id) continue

        for (const ship of p.ships) {
          if (deletedKanmusuIds.has(ship.uniqueId)) {
            kanmusuUsage[ship.uniqueId] = true // Mark as used in another phase
          }
        }
      }
    }

    // Initialize usage for all deleted Kanmusu (default to false if not found in other phases)
    for (const uniqueId of deletedKanmusuIds) {
      if (!kanmusuUsage[uniqueId]) {
        const index = shiplist.value.findIndex(ship => ship.uniqueId === uniqueId)
        shiplist.value[index].tag = ''
      }
    }
  }

  // Show type of ship
  function showShipType (stype: number): string {
    switch (stype) {
      case 1:
        return 'DE'
      case 2:
        return 'DD'
      case 3:
        return 'CL'
      case 4:
        return 'CLT'
      case 5:
        return 'CA'
      case 6:
        return 'CAV'
      case 7:
        return 'CVL'
      case 8:
        return 'FBB'
      case 9:
        return 'BB'
      case 10:
        return 'BBV'
      case 11:
        return 'CV'
      case 12:
        return 'BBB'
      case 13:
        return 'SS'
      case 14:
        return 'SSV'
      case 16:
        return 'AV'
      case 17:
        return 'LHA'
      case 18:
        return 'CVB'
      case 19:
        return 'AR'
      case 20:
        return 'AS'
      case 21:
        return 'CT'
      case 15:
      case 22:
        return 'AO'
      default:
        return 'Unknown'
    }
  }

  function getFilterOptions () {
    return JSON.stringify(shipFilter.value)
  }
  return {
    lockMap,
    shiplist,
    filteredShiplist,
    tags,
    shipFilter,
    showShipType,
    importShiplist,
    addLockMap,
    addPhaseToMap,
    beforePhaseDelete,
    deleteLockMap,
    deletePhase,
    setShipTag,
    applyFilter,
    doFilter,
    resetFilter,
    removeShipFromPhase,
    getFilterOptions,
  }
})
