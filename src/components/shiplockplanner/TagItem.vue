<script
  setup
  lang="ts"
>
  const isEditing = ref(false)
  defineProps({
    tag: { required: true, type: Object },
  })
</script>
<template>
  <VCard

    class="d-flex align-center pl-2 "
    variant="outlined"
  >
    <VIcon icon="mdi-tag" :style="{color: tag.color}" />
    <VCardTitle v-if="isEditing===false">{{ tag.name }}</VCardTitle>
    <div v-else class="d-flex wrapper">
      <VTextField
        v-model="tag.name"
        class="pa-0 pl-2"
        hide-details
      />
      <VTextField
        v-model="tag.color"
        class="pa-0 pl-2"
        hide-details
      />
    </div>
    <VSpacer />
    <VBtn v-if="isEditing===false" icon @click="isEditing=!isEditing">
      <VIcon>mdi-pencil</VIcon>
    </VBtn>
    <VBtn v-else class="save" icon @click="isEditing=!isEditing">
      <VIcon>mdi-content-save</VIcon>
    </VBtn>
    <VBtn class="delete" icon variant="text" @click="$emit('delete', tag?.id)">
      <VIcon>mdi-delete</VIcon>
    </VBtn>
  </VCard>
</template>
<style
  scoped
  lang="scss"
>
.wrapper{
  min-width: 500px;
}
.delete{
  color: lightcoral;
}
.save {
  color: lightgreen;
}
</style>
