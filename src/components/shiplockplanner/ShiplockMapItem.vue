<script
  setup
  lang="ts"
>
  import { LockMap, useShiplist } from '@/stores/shiplist'
  import ShiplockPhaseTable from '@/components/shiplockplanner/ShiplockPhaseTable.vue'
  import { PropType } from 'vue'

  const isHidden = ref(false)

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
  <VCard class="map-border" :class="{hide:isHidden, mapCard:!isHidden}" variant="outlined">
    <VToolbar :class="{hide:isHidden}" density="compact">
      <VToolbarTitle v-if="isEditing===false">{{ map?.name }}</VToolbarTitle>
      <VTextField
        v-else
        v-model="localMap.name"
        class="pa-0 pl-2"
        hide-details
      />
      <VSpacer />
      <VBtn v-if="!isHidden" icon @click="isHidden = !isHidden">
        <VIcon>mdi-chevron-down</VIcon>
      </VBtn>
      <VBtn v-else icon @click="isHidden = !isHidden">
        <VIcon>mdi-chevron-up</VIcon>
      </VBtn>
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
.map-border{
  border-color: #424242;
}

.map-card {
  min-height: 150px;
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

.hide {
  max-height: 48px !important;
  overflow: hidden;
}
</style>
