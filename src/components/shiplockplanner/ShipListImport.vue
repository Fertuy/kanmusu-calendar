<script
  setup
  lang="ts"
>
  import { useShiplist } from '@/stores/shiplist'

  const { importShiplist } = useShiplist()
  const rawdata = ref('')
  function importList () {
    importShiplist(rawdata.value)
  }

</script>
<template>
  <VContainer class="w-auto">
    <VTextarea
      v-model="rawdata"
      placeholder="Put your data here..."
      variant="outlined"
    />
    <VBtn append-icon="mdi-check" text="Import" @click="importList" />
  </VContainer>
</template>
<style scoped>
</style>
