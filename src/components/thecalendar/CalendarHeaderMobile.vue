<script
  setup
  lang="ts"
>
  defineProps({
    prevWeek: { type: Function, required: true },
    nextWeek: { type: Function, required: true },
  })
</script>
<template>
  <VRow class="d-flex justify-center align-center my-2">
    <VBtn prepend-icon="mdi-menu-left" text="Prev Week" variant="text" @click="prevWeek" />
    <VBtn append-icon="mdi-menu-right" text="Next Week" variant="text" @click="nextWeek" />
  </VRow>
</template>
<style scoped>
</style>
