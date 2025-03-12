<script
  setup
  lang="ts"
>
  import ShiplockMapTable from '@/components/shiplockplanner/ShiplockMapTable.vue'
  import ManageTags from '@/components/shiplockplanner/ManageTags.vue'
</script>
<template>
  <VContainer class="wrapper ga-2">
    <div class="lock-table">
      <div class="mb-2 d-flex ga-4">
        <NewLockMap />
        <ManageTags />
      </div>
      <ShiplockMapTable />
    </div>
    <ShipList />
  </VContainer>
</template>
<style scoped lang="scss">
.wrapper{
  display: flex;
}
.lock-table {
  flex: 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;

}
</style>
