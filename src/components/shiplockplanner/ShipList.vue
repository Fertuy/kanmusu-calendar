<script
  setup
  lang="ts"
>
  import ShipListTable from '@/components/shiplockplanner/ShipListTable.vue'
</script>
<template>
  <div class="shiplist-wrapper">
    <ShipListImport />
    <ShipListTable />
  </div>
</template>
<style scoped lang="scss">
.shiplist-wrapper {
  width: 35vw;
  min-height: 100vh;
  flex-shrink: 1;
  flex-grow: 0;
}
</style>
