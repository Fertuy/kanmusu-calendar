<script
  setup
  lang="ts"
>
  import { Phase, useShiplist } from '@/stores/shiplist'

  const { beforePhaseDelete, doFilter } = useShiplist()
  const props = defineProps({
    phases: { type: Array<Phase>, required: true },
  })

  function deletePhase (id:number) {
    const index:number = props.phases?.findIndex(phase => phase.id === id)
    if (index !== -1) {
      beforePhaseDelete(props.phases[index])
      doFilter()
      props.phases?.splice(index, 1)
    }
  }
</script>
<template>
  <div>
    <ShiplockPhaseItem v-for="phase in phases" :key="phase.id" :phase="phase" @delete="deletePhase" />
  </div>
</template>
<style
  scoped
  lang="scss"
>
</style>
