<script
  setup
  lang="ts"
>
  import { FilterOptions, LANDING_EQUIP_FILTER_OPTIONS, SHIP_TYPE, useShiplist } from '@/stores/shiplist'
  import { storeToRefs } from 'pinia'
  import { Ref } from 'vue'

  const landingEquipSelectors = ['Any',
                                 'Daihatsu',
                                 'Daihatsu-only',
                                 'Tank',
                                 'Tank-only',
                                 'Either',
                                 'Neither']

  const { tags } = storeToRefs(useShiplist())
  const shipList = useShiplist()
  const aFilter = shipList.applyFilter
  const rFilter = shipList.resetFilter
  const dialog = ref(false)
  const filterOptions: Ref<FilterOptions> = ref(JSON.parse(shipList.getFilterOptions()))

  function applyFilter () {
    aFilter(filterOptions.value)
    dialog.value = false
  }

  function resetFilter () {
    rFilter()
    filterOptions.value = JSON.parse(shipList.getFilterOptions())
    dialog.value = false
  }

  function closeDialog () {
    filterOptions.value = JSON.parse(shipList.getFilterOptions())
    dialog.value = false
  }
</script>
<template>
  <VDialog
    v-model="dialog"
    max-width="800px"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <VBtn
        append-icon="mdi-filter"
        class="flex-1-1-100 mb-2"
        text="Filter"
        variant="flat"
        v-bind="activatorProps"
      />
    </template>
    <VCard
      class="dialog"
      prepend-icon="mdi-filter"
      title="Filter"
    >
      <!--ACTION BUTTONS-->
      <VCardActions class="justify-space-between">
        <div>
          <VBtn
            text="Apply filters"
            variant="text"
            @click="applyFilter"
          />
          <VBtn
            text="Reset filters"
            variant="text"
            @click="resetFilter"
          />
        </div>
        <VBtn
          text="Close"
          variant="text"
          @click="closeDialog"
        />
      </VCardActions>

      <!--TAG FILTER SECTION-->
      <VContainer class="w-auto mx-0 pt-0">
        <div class="d-flex align-center w-auto">
          <VCardSubtitle class="pl-0">Tag</VCardSubtitle>
          <VDivider class="border-opacity-50" />
        </div>
        <div class="d-flex flex-wrap ml-4">
          <VBtnToggle
            v-model="filterOptions.tags"
            class="d-flex flex-wrap h-auto"
            multiple
          >
            <VBtn
              v-for="tag in tags"
              :key="tag.id"
              class="ship-tag-btn"
              density="comfortable"
              hide-details
              :value="tag.id"
            >
              <span class="hidden-sm-and-down">{{ tag.name }}</span>
              <VIcon
                end
                icon="mdi-tag"
                :style="{color: tag.color}"
              />
            </VBtn>
            <VBtn
              class="ship-tag-btn"
              density="comfortable"
              hide-details
              :value="0"
            >
              <span class="hidden-sm-and-down">None</span>
              <VIcon
                end
                icon="mdi-tag-hidden"
              />
            </VBtn>
          </VBtnToggle>
        </div>
      </VContainer>

      <!--SHIP TYPE FILTER SECTION-->
      <VContainer class="w-auto mx-0">
        <div class="d-flex align-center">
          <VCardSubtitle class="pl-0">Ship type</VCardSubtitle>
          <VDivider class="border-opacity-50" />
        </div>
        <div class="d-flex flex-wrap ml-4">
          <VBtnToggle
            v-model="filterOptions.stype"
            class="d-flex flex-wrap h-auto"
            multiple
          >
            <VBtn
              v-for="type in Object.keys(SHIP_TYPE)"
              :key="SHIP_TYPE[type as keyof typeof SHIP_TYPE]"
              class="ship-type-btn"
              :text="type"
              :value="SHIP_TYPE[type as keyof typeof SHIP_TYPE]"
            />
          </VBtnToggle>
        </div>
      </VContainer>

      <!--LANDING EQUIP FILTER SECTION-->
      <VContainer class="w-auto mx-0 pt-0">
        <div class="d-flex align-center">
          <VCardSubtitle class="pl-0">Landing equipment</VCardSubtitle>
          <VDivider class="border-opacity-50" />
        </div>
        <div class="d-flex flex-wrap ml-4">
          <VBtnToggle
            v-model="filterOptions.landingEquip"
            class="d-flex flex-wrap h-auto"
          >
            <VBtn
              v-for="num in 7"
              :key="num-1"
              class="ship-tag-btn"
              :text="landingEquipSelectors[num-1]"
              :value="LANDING_EQUIP_FILTER_OPTIONS[num-1 as unknown as keyof typeof LANDING_EQUIP_FILTER_OPTIONS]"
            />
          </VBtnToggle>
        </div>
      </VContainer>

      <!--OTHER FILTER-->
      <VContainer class="w-auto mx-0 pt-0">
        <div class="d-flex align-center">
          <VCardSubtitle class="pl-0">Other</VCardSubtitle>
          <VDivider class="border-opacity-50" />
        </div>
        <div class="d-flex flex-wrap ml-4">
          <VBtnToggle v-model="filterOptions.spf">
            <VBtn text="SPF" :value="true" />
          </VBtnToggle>
          <VBtnToggle v-model="filterOptions.midgetSub">
            <VBtn text="Midget Submarine" :value="true" />
          </VBtnToggle>
          <VBtnToggle v-model="filterOptions.exSlot">
            <VBtn text="Ex slot open" :value="true" />
          </VBtnToggle>
        </div>
      </VContainer>

      <!-- template
      <VContainer class="w-auto mx-0">
        <div class="d-flex align-center">
          <VCardSubtitle class="pl-0"> Tag</VCardSubtitle>
          <VDivider class="border-opacity-50" />
        </div>
      </VContainer>
      -->
    </VCard>
  </VDialog>
  <VTextField
    v-model="filterOptions.name"
    append-inner-icon="mdi-magnify"
    class="mb-4 flex-1-0-100"
    density="compact"
    hide-details
    variant="outlined"
    @input="applyFilter"
  />
</template>
<style
  scoped
  lang="scss"
>
.dialog {
  min-height: 90vh;
}

.ship-type-btn {
  min-height: 36px;
}

.ship-tag-btn {
  min-height: 46px;
}
</style>
