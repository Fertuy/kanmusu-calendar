<script
  setup
  lang="ts"
>
  import { useShiplist } from '@/stores/shiplist'

  const { importShiplist } = useShiplist()
  const rawdata = ref('')
  const showImport = ref(true)
  function importList () {
    importShiplist(rawdata.value)
  }

</script>
<template>
  <VContainer v-if="showImport" class="w-auto">
    <VTextarea
      v-model="rawdata"
      placeholder="Put your data here..."
      variant="outlined"
    />
    <div class="d-flex justify-space-between">
      <VBtn
        append-icon="mdi-check"
        text="Import"
        @click="importList"
      />
      <VBtn
        append-icon="mdi-close"
        text="Close"
        @click="showImport = !showImport"
      />
    </div>
  </VContainer>
</template>
<style scoped>
</style>
