<script
  setup
  lang="ts"
>
  defineProps({
    date: { type: Date, required: true },
    prevMonth: { type: Function, required: true },
    nextMonth: { type: Function, required: true },
  })

  // for displaying name of month
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
</script>
<template>
  <VRow class="d-flex justify-center align-center my-2">
    <VBtn icon="mdi-menu-left" variant="text" @click="prevMonth" />
    <VCardTitle class="text-h4">{{ formatter.format(date) }}</VCardTitle>
    <VBtn icon="mdi-menu-right" variant="text" @click="nextMonth" />
  </VRow>
</template>
<style scoped>
</style>
