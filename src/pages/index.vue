<script
  lang="ts"
  setup
>
</script>
<template>
  <VContainer class="d-flex align-center justify-center wrapper py-0 ga-4">
    <VCard class="link" to="tools/calendar">
      <VCardTitle>Calendar</VCardTitle>
    </VCard>
    <VCard class="link" to="tools/shiplock-planner">
      <VCardTitle>Shiplock planner</VCardTitle>
    </VCard>
  </VContainer>
</template>
<style
  lang="scss"
  scoped
>
.wrapper {
  height: 100vh;
}

.link{
  height: 150px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
