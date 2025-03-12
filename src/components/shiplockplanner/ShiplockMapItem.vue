<script
  setup
  lang="ts"
>
  import { LockMap, useShiplist } from '@/stores/shiplist'
  import ShiplockPhaseTable from '@/components/shiplockplanner/ShiplockPhaseTable.vue'
  import { PropType } from 'vue'

  const props = defineProps({
    map: { type: Object as PropType<LockMap>, required: true },
  })

  const { addPhaseToMap, deleteLockMap } = useShiplist()
  const isEditing = ref(false)
  const localMap = computed(() => props.map)

  function addPhase () {
    addPhaseToMap(props.map)
  }

  function dMap () {
    deleteLockMap(props.map)
  }
</script>
<template>
  <VCard class="map-card" variant="outlined">
    <VToolbar density="compact">
      <VToolbarTitle v-if="isEditing===false">{{ map?.name }}</VToolbarTitle>
      <VTextField
        v-else
        v-model="localMap.name"
        class="pa-0 pl-2"
        hide-details
      />
      <VSpacer />
      <VBtn v-if="isEditing===false" icon @click="isEditing=!isEditing">
        <VIcon>mdi-pencil</VIcon>
      </VBtn>
      <div v-else>
        <VBtn
          class="save"
          icon
          @click="isEditing=!isEditing"
        >
          <VIcon>mdi-content-save</VIcon>
        </VBtn>
        <VBtn
          class="delete"
          icon
          variant="text"
          @click="dMap"
        >
          <VIcon>mdi-delete</VIcon>
        </VBtn>
      </div>
    </VToolbar>
    <div v-if="isEditing" class="map-content">
      <VBtn
        icon="mdi-plus-circle-outline"
        variant="text"
        @click="addPhase"
      />

    </div>
    <ShiplockPhaseTable :phases="map?.phases" />

  </VCard>
</template>
<style
  scoped
  lang="scss"
>
.map-card {
  min-height: 150px;
  border-color: #424242;
}
.map-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.delete{
  color: lightcoral;
}
.save {
  color: lightgreen;
}
</style>
