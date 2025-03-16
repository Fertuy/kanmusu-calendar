<script
  setup
  lang="ts"
>
  import { Kanmusu, useShiplist } from '@/stores/shiplist'
  import { PropType } from 'vue'

  const imgUrls = import.meta.glob('@/assets/icons/shiplock/*.png', {
    import: 'default',
    eager: true,
  })

  const EQUIP_ICON_SIZE = 22
  const { showShipType } = useShiplist()

  const props = defineProps({
    ship: { type: Object as PropType<Kanmusu>, required: true },
    removeBtn: { type: Function },
  })

  const onDragStart = (event: any, item: Kanmusu) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(item))
  }

  const style = computed(() => ({
    backgroundColor: typeof props.ship.tag !== 'string' &&
      props.ship.tag.color !== '' ? props.ship.tag.color : '',
  }))

  const sImg = ref()

  setImg(props.ship)

  function setImg (ship: Kanmusu) {
    if (imgUrls.hasOwnProperty(`/src/assets/icons/shiplock/${ship.id}.png`)) {
      sImg.value = imgUrls[`/src/assets/icons/shiplock/${ship.id}.png`]
    }
    return ''
  }

</script>
<template>
  <VCard
    class="ship-card"
    draggable="true"
    @dragstart="onDragStart($event,ship as any)"
  >
    <div class="position-relative">
      <VAvatar
        size="86"
      >
        <!--      <VImg :src="`@/assets/icons/shiplock/${props.ship.id}.png`" />-->
        <!--bg-deep-orange-accent-4    bg-green-darken-1-->
        <VImg :src="sImg" />
      </VAvatar>
      <VAvatar
        v-if="ship.exSlot"
        class="exslot position-absolute blue-lighten-2
         rounded-circle overflow-hidden"
        height="24"
        rounded
        size="24"
        width="24"
      >
        <VImg
          src="@/assets/icons/equipicons/exslot.png"
        />
      </VAvatar>
    </div>
    <div class="d-flex flex-column align-start flex-0-1-100 w-25">
      <div class="ship-name-wrapper">
        <VCardTitle class="pa-0 pl-2 ship-name ">{{ ship.name }}</VCardTitle>
      </div>
      <div class="d-flex">
        <VCardSubtitle class="pa-0 pl-2 ship-info">{{ showShipType(ship.stype) }}</VCardSubtitle>
        <VCardSubtitle class="pa-0 pl-2 ship-info">Lvl: {{ ship.level }}</VCardSubtitle>
      </div>
      <VContainer class="pl-2 py-0 d-flex">
        <!--SHIP STATS-->
        <div class="d-flex align-center ship-stat-wrapper">
          <!--FP-->
          <div class="d-flex align-center ship-stat-container">
            <VAvatar
              rounded
              size="12"
            >
              <VImg src="@/assets/icons/equipicons/fp.png" />
            </VAvatar>
            <VCardSubtitle class="pa-0 ship-stat">
              {{ ship.fp }}
            </VCardSubtitle>
          </div>
          <!--TORP-->
          <div class="d-flex align-center ship-stat-container">
            <VAvatar
              rounded
              size="12"
            >
              <VImg src="@/assets/icons/equipicons/torp.png" />
            </VAvatar>
            <VCardSubtitle class="pa-0 ship-stat">
              {{ ship.torp }}
            </VCardSubtitle>
          </div>
          <!--ARMOR-->
          <div class="d-flex align-center ship-stat-container">
            <VAvatar
              rounded
              size="12"
            >
              <VImg src="@/assets/icons/equipicons/armor.png" />
            </VAvatar>
            <VCardSubtitle class="pa-0 ship-stat">
              {{ ship.armor }}
            </VCardSubtitle>
          </div>
          <!--AA-->
          <div class="d-flex align-center ship-stat-container">
            <VAvatar
              rounded
              size="12"
            >
              <VImg src="@/assets/icons/equipicons/aa.png" />
            </VAvatar>
            <VCardSubtitle class="pa-0 ship-stat">
              {{ ship.aa }}
            </VCardSubtitle>
          </div>
          <!--ASW-->
          <div class="d-flex align-center ship-stat-container">
            <VAvatar
              rounded
              size="12"
            >
              <VImg src="@/assets/icons/equipicons/asw.png" />
            </VAvatar>
            <VCardSubtitle class="pa-0 ship-stat">
              {{ ship.asw }}
            </VCardSubtitle>
          </div>
          <!--LUCK-->
          <div class="d-flex align-center ship-stat-container">
            <VAvatar
              rounded
              size="12"
            >
              <VImg src="@/assets/icons/equipicons/luck.png" />
            </VAvatar>
            <VCardSubtitle class="pa-0 ship-stat">
              {{ ship.luck }}
            </VCardSubtitle>
          </div>
        </div>
        <!--SHIP EQUIP-->
        <div class="d-flex align-start ship-equip-wrapper">
          <!--SPF-->
          <VAvatar
            v-if="ship.spf"
            class="ship-equip"
            rounded
            :size="EQUIP_ICON_SIZE"
          >
            <VImg
              aspect-ratio="1/1"
              class="w-auto h-auto"
              src="@/assets/icons/equipicons/spf.png"
            />
          </VAvatar>
          <!--DLC-->
          <VAvatar
            v-if="ship.dlc"
            class="ship-equip"
            rounded
            :size="EQUIP_ICON_SIZE"
          >
            <VImg
              aspect-ratio="1/1"
              class="w-auto h-auto"
              src="@/assets/icons/equipicons/dlc.png"
            />
          </VAvatar>
          <!--TANK-->
          <VAvatar
            v-if="ship.tank"
            class="ship-equip"
            rounded
            :size="EQUIP_ICON_SIZE"
          >
            <VImg
              aspect-ratio="1/1"
              class="w-auto h-auto"
              src="@/assets/icons/equipicons/tank.png"
            />
          </VAvatar>
          <!--MIDGETSUB-->
          <VAvatar
            v-if="ship.midgetSub"
            class="ship-equip"
            rounded
            :size="EQUIP_ICON_SIZE"
          >
            <VImg
              aspect-ratio="1/1"
              class="w-auto h-auto"
              src="@/assets/icons/equipicons/midgetsub.png"
            />
          </VAvatar>
        </div>
      </VContainer>

    </div>
    <VBtn
      v-if="typeof removeBtn !== 'undefined'"
      class="pa-0 pt-1 pr-1 ma-0 remove"
      icon
      variant="text"
      @click="removeBtn(ship.id)"
    >
      <!--        icon="mdi-close-circle-outline"-->
      <VIcon
        color="red"
        icon="mdi-share"
        size="20"
      />
    </VBtn>
    <div
      class="tag"
      :class="{'tag-color':!ship.tag}"
      :style="style"
    />
  </VCard>
</template>
<style
  scoped
  lang="scss"
>
.remove {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 15px;
}

.ship-card {
  display: flex;
  flex: 0 0 calc(50% - 8px);
  margin: 4px;
  position: relative;
  overflow: hidden;
}

.ship-name-wrapper {
  max-width: 100%;
}

.ship-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 0 0 100%;
  padding-right: 40px !important;
  line-height: 22px!important;
}
.ship-info {
  line-height: 16px!important;
}

.ship-stat-wrapper {
  margin: -2px;
  flex-wrap: wrap;
  max-width: 80px;
}

.ship-stat-container {
  margin: 1px;
  flex: 0 0 calc(50% - 2px);
}

.ship-stat{
  padding-left: 2px!important;
  line-height: 14px!important;
  font-size: 12px!important;
}

.ship-equip-wrapper{
  width: 100%;
  flex-wrap: wrap;
  max-width: 60px;
  padding-left: 8px;
  margin: 0 -4px;
}
.ship-equip{
  margin: 0 4px;
}

.tag {
  width: 15px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
}

.exslot {
  //box-shadow: 0 0 5px 2px greenyellow;
  box-shadow: 0 0 5px 2px #64B5F6;
  border: 2px solid rgba(0, 166, 255);
  bottom: 2px;
  left: 2px;
}

.tag-color {
  background: repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 2px, transparent 2px, transparent 5px);
}
</style>
