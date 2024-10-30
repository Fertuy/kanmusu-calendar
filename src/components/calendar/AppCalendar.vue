<script
  setup
  lang="ts"
>
  import { VCalendar } from 'vuetify/labs/VCalendar'
  import kanmusuList from '@/assets/kcbirthday.json'

  type Event = {
    title: string | null,
    allDay: boolean,
    start: Date | null,
    end: Date | null,
    color: any,
    img: string|null
  }

  const date = ref([new Date()])
  const events = ref<Array<Event>>([])
  const imgUrls = import.meta.glob('@/assets/icons/calendar/*.png', {
    import: 'default',
    eager: true,
  })

  async function createEvents () {
    events.value = []
    kanmusuList.forEach(item => {
      const event:Event = { title: null, allDay: true, start: null, end: null, color: null, img: null }
      event.title = item.name
      event.allDay = true
      event.color = 'orange'
      event.start = new Date(date.value[0].getFullYear(), item.month - 1, item.day)
      event.end = event.start
      // event.img = '@/assets/icons/calendar/' + item.name + '.png'
      // event.img = imgUrls.has('')

      if (imgUrls.hasOwnProperty(`/src/assets/icons/calendar/${item.name}.png`)) {
        event.img = imgUrls[`/src/assets/icons/calendar/${item.name}.png`]
      } else {
        event.img = imgUrls[`/src/assets/icons/calendar/_rensouhou.png`]
      }
      events.value.push(event)
    })
  }

  onMounted(() => {
    createEvents()
  })
  watch(date, () => {
    createEvents()
  }, { deep: true })

</script>
<template>
  <VContainer>
    <h1>Kanmusu birthday</h1>
    <VCalendar
      v-model="date"
      :events="events"
    >
      <template #event="{event}">
        <VCard class="d-flex align-center px-2 pb-1" variant="text">
          <VAvatar size="64">
            <VImg :src="event.img" />
          </VAvatar>
          <VCardTitle class="flex-shrink-1">{{ event.title }}</VCardTitle>
        </VCard>
      </template>
    </VCalendar>
  </VContainer>
</template>
<style scoped>
</style>
