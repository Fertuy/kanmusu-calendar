<script
  setup
  lang="ts"
>
  import { useShiplist } from '@/stores/shiplist'
  import { storeToRefs } from 'pinia'
  import TagItem from '@/components/shiplockplanner/TagItem.vue'

  const { tags } = storeToRefs(useShiplist())
  const dialog = ref(false)

  function addNewTag () {
    tags.value.push({ name: 'New Tag', color: '#006400', id: (new Date()).getTime() })
  }

  function deleteTag (id:number) {
    const index = tags.value.findIndex(t => t.id === id)
    if (index > -1) {
      tags.value.splice(index, 1)
    }
  }

</script>
<template>
  <VDialog v-model="dialog" max-width="800px">
    <template #activator="{ props: activatorProps }">
      <VBtn
        append-icon="mdi-tag"
        text="Manage tags"
        variant="flat"
        v-bind="activatorProps"
      />
    </template>
    <VCard
      class="dialog"
      prepend-icon="mdi-tag"
      title="Tags"
    >
      <VCardActions class="justify-space-between">
        <VBtn
          class="w-auto"
          text="Add new tag"
          variant="text"
          @click="addNewTag"
        />
        <VBtn
          text="Close"
          variant="text"
          @click="dialog = false"
        />
      </VCardActions>
      <VContainer max-width="700px">
        <VRow class="flex-column ga-2">
          <TagItem
            v-for="tag in tags"
            :key="tag.id"
            :tag="tag"
            @delete="deleteTag"
          />
        </VRow>
      </VContainer>
    </VCard>
  </VDialog>

</template>
<style
  scoped
  lang="scss"
>
.dialog{
  min-height: 90vh;
}
</style>
