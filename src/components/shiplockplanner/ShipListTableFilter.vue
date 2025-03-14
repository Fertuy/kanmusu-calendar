<script
  setup
  lang="ts"
>
  import { FilterOptions, LANDING_EQUIP_FILTER_OPTIONS, SHIP_TYPE, useShiplist } from '@/stores/shiplist'
  import { storeToRefs } from 'pinia'
  import { Ref } from 'vue'

  const { tags } = storeToRefs(useShiplist())
  const shipList = useShiplist()
  const aFilter = shipList.applyFilter
  const rFilter = shipList.resetFilter
  const dialog = ref(false)
  const filterOptions: Ref<FilterOptions> = computed(() => shipList.shipFilter)

  function applyFilter () {
    aFilter(filterOptions.value)
    dialog.value = false
  }
  function resetFilter () {
    rFilter()
    dialog.value = false
  }

</script>
<template>
  <VDialog v-model="dialog" max-width="800px" persistent>
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
          @click="dialog = false"
        />
      </VCardActions>
      <!--TAG FILTER SECTION-->
      <VContainer class="w-auto mx-0 pt-0">
        <div class="d-flex align-center w-auto">
          <VCardSubtitle class="pl-0">Tag</VCardSubtitle>
          <VDivider class="border-opacity-50" />
        </div>

        <div class="d-flex flex-wrap ml-4">
          <VCheckbox
            v-for="tag in tags"
            :key="tag.id"
            v-model="filterOptions.tags"
            density="comfortable"
            hide-details
            :value="tag.id"
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
          <VCheckbox
            v-model="filterOptions.tags"
            density="comfortable"
            hide-details
            :value="0"
          >
            <template #label>
              <span>None</span>
              <VIcon
                class="ml-2"
                icon="mdi-tag-hidden"
              />
            </template>
          </VCheckbox>
        </div>
      </VContainer>

      <!--SHIP TYPE FILTER SECTION-->
      <VContainer class="w-auto mx-0">
        <div class="d-flex align-center">
          <VCardSubtitle class="pl-0">Ship type</VCardSubtitle>
          <VDivider class="border-opacity-50" />
        </div>
        <div class="d-flex flex-wrap ml-4">
          <VCheckbox
            v-for="type in Object.keys(SHIP_TYPE)"
            :key="SHIP_TYPE[type as keyof typeof SHIP_TYPE]"
            v-model="filterOptions.stype"
            density="comfortable"
            hide-details
            :label="type"
            :value="SHIP_TYPE[type as keyof typeof SHIP_TYPE]"
          />
        </div>
      </VContainer>

      <!--LANDING EQUIP FILTER SECTION-->
      <VContainer class="w-auto mx-0 pt-0">
        <div class="d-flex align-center">
          <VCardSubtitle class="pl-0">Landing equipment</VCardSubtitle>
          <VDivider class="border-opacity-50" />
        </div>
        <div class="d-flex flex-wrap ml-4">
          <VRadioGroup
            v-model="filterOptions.landingEquip"
            density="comfortable"
            hide-details
            inline
          >
            <VRadio label="Daihatsu" :value="LANDING_EQUIP_FILTER_OPTIONS.DLC" />
            <VRadio label="Daihatsu-only" :value="LANDING_EQUIP_FILTER_OPTIONS.DLC_ONLY" />
            <VRadio label="Tank" :value="LANDING_EQUIP_FILTER_OPTIONS.TANK" />
            <VRadio label="Tank-only" :value="LANDING_EQUIP_FILTER_OPTIONS.TANK_ONLY" />
            <VRadio label="Either" :value="LANDING_EQUIP_FILTER_OPTIONS.EITHER" />
            <VRadio label="Neither" :value="LANDING_EQUIP_FILTER_OPTIONS.NEITHER" />
            <VRadio label="Whatever" :value="LANDING_EQUIP_FILTER_OPTIONS.WHATEVER" />
          </VRadioGroup>
        </div>
      </VContainer>

      <!--OTHER FILTER-->
      <VContainer class="w-auto mx-0 pt-0">
        <div class="d-flex align-center">
          <VCardSubtitle class="pl-0">Other</VCardSubtitle>
          <VDivider class="border-opacity-50" />
        </div>
        <div class="d-flex flex-wrap ml-4">
          <VCheckbox v-model="filterOptions.spf" label="SPF" :value="true" />
          <VCheckbox v-model="filterOptions.midgetSub" label="Midget Submarine" :value="true" />
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
</template>
<style
  scoped
  lang="scss"
>
.dialog{
  min-height: 90vh;
}
</style>
