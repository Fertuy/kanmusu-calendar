<script
  setup
  lang="ts"
>
  import { useShiplist } from '@/stores/shiplist'

  const { addLockMap } = useShiplist()

</script>
<template>
  <VBtn append-icon="mdi-map" text="Add map" variant="flat" @click="addLockMap" />
</template>
<style
  scoped
  lang="scss"
>
</style>
