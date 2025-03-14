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

  function setImg (ship:Kanmusu) {
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
    <VAvatar
      rounded
      size="86"
    >
      <!--      <VImg :src="`@/assets/icons/shiplock/${props.ship.id}.png`" />-->
      <VImg :src="sImg" />
    </VAvatar>
    <div class="d-flex flex-column align-start">
      <div class="d-flex">
        <VCardTitle class="pa-0 pl-2">{{ showShipType(ship.stype) }}</VCardTitle>
        <VCardTitle class="pa-0 pl-2">Lvl: {{ ship.level }}</VCardTitle>
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
      <VIcon color="red" icon="mdi-close-circle-outline" size="30" />
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
  width: 30px;
  height: 30px;
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

.tag {
  width: 15px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
}

.tag-color {
  background: repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 2px, transparent 2px, transparent 5px);
}
</style>
