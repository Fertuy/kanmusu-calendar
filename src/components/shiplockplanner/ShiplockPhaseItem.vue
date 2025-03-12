<script
  setup
  lang="ts"
>
  import { Phase, useShiplist } from '@/stores/shiplist'
  import { storeToRefs } from 'pinia'
  import { PropType } from 'vue'

  const props = defineProps({
    phase: { type: Object as PropType<Phase>, required: true },
  })

  const localPhase = computed(() => props.phase)

  const isEditing = ref(false)
  const { tags } = storeToRefs(useShiplist())
  const { setShipTag, doFilter, deletePhase } = useShiplist()

  const onDrop = (event:any) => {
    const data = JSON.parse(event.dataTransfer.getData('text/plain'))

    // If kanmusu already in list return
    const index = localPhase.value.ships.findIndex(ship => ship.uniqueId === data.uniqueId)
    if (index !== -1) {
      return
    }

    // If phase haven't tag return
    if (localPhase.value.tag === null) {
      return
    }

    // If kanmusu not locked yet
    if (!data.tag) {
      data.tag = localPhase.value.tag
      setShipTag(data.uniqueId, localPhase.value.tag)
    }

    // If kanmusu have not allowed tag return
    const tagCheck = localPhase.value.allowedTags.findIndex(tag => tag.id === data.tag.id)
    if (tagCheck === -1) {
      return
    }

    localPhase.value.ships.push(data)
    doFilter()
  }

  watch(
    () => props.phase.tag,
    state => {
      localPhase.value.allowedTags = []
      if (state) { localPhase.value.allowedTags.push(state) }
    },
  )

  function dPhase () {
    deletePhase(props.phase)
  }
</script>
<template>
  <VCard class="phase-item">
    <VToolbar
      :class="{edit:isEditing}"
      density="compact"
      :extended="isEditing||localPhase.description!==''"
      extension-height="auto"
    >
      <VToolbarTitle v-if="isEditing===false">{{ localPhase.name }}</VToolbarTitle>
      <VTextField
        v-else
        v-model="localPhase.name"
        class="pa-0 pl-2"
        hide-details
      />
      <template
        v-if="isEditing===true||localPhase.description.length>0||localPhase.allowedTags.length>0 "
        #extension
      >
        <div class="py-2">
          <div
            v-if="isEditing===true"
            class="input-wrapper"
          >
            <div>
              <VTextarea
                v-model="localPhase.description"
                class="pa-0 pl-2 description-input"
                hide-details
                placeholder="Add a description here..."
              />
            </div>
            <div class="main-tag-radio-select">
              <VRadioGroup
                v-model="localPhase.tag"
                label="Select main tag"
              >
                <VRadio
                  v-for="tag in tags"
                  :key="tag.id"
                  :value="tag"
                >
                  <template #label>
                    <span>{{ tag.name }}</span>
                    <VIcon
                      class="ml-2"
                      icon="mdi-tag"
                      :style="{color: tag.color}"
                    />
                  </template>
                </VRadio>
              </VRadioGroup>
            </div>
            <div class="ml-2">
              <p>Select all allowed tags</p>
              <VCheckbox
                v-for="tag in tags"
                :key="tag.id"
                v-model="localPhase.allowedTags"
                :disabled="localPhase.tag!==null && localPhase.tag.id === tag.id"
                hide-details
                :value="tag"
              >
                <template #label>
                  <span>{{ tag.name }}</span>
                  <VIcon
                    class="ml-2"
                    icon="mdi-tag"
                    :style="{color: tag.color}"
                  />
                </template>
              </VCheckbox>
            </div>
          </div>
          <div class="d-flex pl-5">
            <VCardText
              v-if="localPhase.description.length>0&&!isEditing"
              class="description-text pl-0"
            > {{ localPhase.description }}
            </VCardText>
            <div v-if="localPhase.allowedTags.length>0&&!isEditing">
              <div
                v-for="tag in localPhase.allowedTags"
                :key="tag.id"
              >
                <span>{{ tag.name }}</span>
                <VIcon
                  class="ml-2"
                  icon="mdi-tag"
                  :style="{color: tag.color}"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <VSpacer />
      <VBtn
        v-if="isEditing===false"
        icon
        @click="isEditing=!isEditing"
      >
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
          @click="dPhase"
        >
          <VIcon>mdi-delete</VIcon>
        </VBtn>
      </div>
    </VToolbar>
    <div
      class="content"
      @dragenter.prevent
      @dragover.prevent
      @drop="onDrop($event)"
    >
      <ShipCard
        v-for="ship in phase.ships"
        :key="ship.uniqueId"
        class="ship-card"
        :ship="ship"
      />
    </div>
  </VCard>
</template>
<style
  scoped
  lang="scss"
>
.ship-card {
  flex: 0 0 calc(25% - 8px);
  margin: 4px;
}

.description-input, .description-text {
  max-width: 300px;
}

.input-wrapper {
  display: flex;
}

.description-text {
  white-space: pre-wrap;
}

.details-wrapper {
  margin-left: 20px;
}

.content {
  min-height: 140px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: -4px;
  padding: 4px;
}

.phase-item {
  margin: 4px;
  border: solid 1px #424242;
}

.delete {
  color: lightcoral;
}

.save {
  color: lightgreen;
}

</style>
