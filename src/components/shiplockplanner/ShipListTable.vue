<script
  setup
  lang="ts"
>
  import { Kanmusu, useShiplist } from '@/stores/shiplist'
  import ShipListTableFilter from '@/components/shiplockplanner/ShipListTableFilter.vue'
  import { Ref } from 'vue'

  const shiplist = useShiplist()
  const displayFilteredShipList = computed(() => shiplist.filteredShiplist)

  const loadIndex = ref(20)
  const displayedShipList: Ref<Array<Kanmusu>> = ref([])

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  onMounted(() => {
    displayedShipList.value = displayFilteredShipList.value.slice(0, 20)
  })

  watch(displayFilteredShipList, async () => {
    displayedShipList.value = []
    await delay(10)
    loadIndex.value = 20
    displayedShipList.value = displayFilteredShipList.value.slice(0, 20)
  })

  function loadMoreShips ({ done }:any) {
    console.log(`displayedShipList: ${displayedShipList.value.length}`)
    console.log(`displayFilteredShipList: ${displayFilteredShipList.value.length}`)
    if (displayedShipList.value.length < displayFilteredShipList.value.length) {
      const nextShips = displayFilteredShipList.value.slice(loadIndex.value, loadIndex.value + 10)
      displayedShipList.value.push(...nextShips)
      loadIndex.value += 10
      done('ok')
      return
    }
    done('empty')
  }

</script>
<template>
  <VContainer class="w-auto d-flex flex-wrap position-sticky top-0">
    <ShipListTableFilter />
    <VInfiniteScroll
      v-if="displayedShipList.length > 0"
      class="w-100 ship-list"
      direction="vertical"
      :items="displayedShipList"
      @load="loadMoreShips"
    >
      <div class="w-auto d-flex flex-wrap content">
        <template
          v-for="ship in displayedShipList"
          :key="ship.uniqueId"
        >
          <ShipCard
            :ship="ship"
          />
        </template>
      </div>
    </VInfiniteScroll>
  </VContainer>
</template>
<style scoped lang="scss">
.content {
  flex-grow: 1;
}

.ship-list {
  height: 70vh!important;
}
</style>
