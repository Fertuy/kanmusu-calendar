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

  const EQUIP_ICON_SIZE = 34
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
        <VCardTitle class="pa-0 pl-2 ship-name">{{ ship.name }}</VCardTitle>
      </div>
      <div class="d-flex">
        <VCardSubtitle class="pa-0 pl-2">{{ showShipType(ship.stype) }}</VCardSubtitle>
        <VCardSubtitle class="pa-0 pl-2">Lvl: {{ ship.level }}</VCardSubtitle>
      </div>
      <div class="d-flex align-start">
        <VImg
          v-if="ship.spf"
          aspect-ratio="1/1"
          :max-height="EQUIP_ICON_SIZE"
          src="@/assets/icons/equipicons/spf.png"
          :width="EQUIP_ICON_SIZE"
        />
        <VImg
          v-if="ship.dlc"
          aspect-ratio="1/1"
          :max-height="EQUIP_ICON_SIZE"
          src="@/assets/icons/equipicons/dlc.png"
          :width="EQUIP_ICON_SIZE"
        />
        <VImg
          v-if="ship.tank"
          aspect-ratio="1/1"
          :max-height="EQUIP_ICON_SIZE"
          src="@/assets/icons/equipicons/tank.png"
          :width="EQUIP_ICON_SIZE"
        />
        <VImg
          v-if="ship.midgetSub"
          aspect-ratio="1/1"
          :max-height="EQUIP_ICON_SIZE"
          src="@/assets/icons/equipicons/midgetsub.png"
          :width="EQUIP_ICON_SIZE"
        />
      </div>
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
