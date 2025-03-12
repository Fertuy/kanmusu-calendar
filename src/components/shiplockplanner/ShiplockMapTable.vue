<script
  setup
  lang="ts"
>
  import { useShiplist } from '@/stores/shiplist'
  import { storeToRefs } from 'pinia'
  import ShiplockMapItem from '@/components/shiplockplanner/ShiplockMapItem.vue'

  const { lockMap } = storeToRefs(useShiplist())

</script>
<template>
  <div class="map-wrapper">
    <ShiplockMapItem v-for="map in lockMap" :key="map.id" :map="map" />
  </div>
</template>
<style
  scoped
  lang="scss"
>
.map-wrapper{
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
</style>
