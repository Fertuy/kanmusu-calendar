<script
  setup
  lang="ts"
>
  import { useShiplist } from '@/stores/shiplist'
  import ShipListTableFilter from '@/components/shiplockplanner/ShipListTableFilter.vue'

  const shiplist = useShiplist()
  const displayFilteredShipList = computed(() => shiplist.filteredShiplist)

</script>
<template>
  <VContainer class="w-auto d-flex flex-wrap">
    <ShipListTableFilter />
    <div
      v-if="displayFilteredShipList.length > 0"
      class="w-auto d-flex flex-wrap content"
    >
      <ShipCard
        v-for="ship in displayFilteredShipList"
        :key="ship.uniqueId"
        :ship="ship"
      />
    </div>
  </VContainer>
</template>
<style scoped lang="scss">
.content {
  margin: -4px;
  flex-grow: 1;
}
</style>
