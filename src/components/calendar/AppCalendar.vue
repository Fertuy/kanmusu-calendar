<script
  setup
  lang="ts"
>
  import kanmusuList from '@/assets/kcbirthday.json'
  import { Ref } from 'vue'
  import { Dayjs } from 'dayjs'

  type Event = {
    title: string | null,
    allDay: boolean,
    start: Date | null,
    end: Date | null,
    color: any,
    img: any
  }

  export type CalendarEvent = {
    title: string,
    day: number|null,
    month: number|null,
    year: number|null,
    img: any
  }

  export type WeekItem = {
    day: Dayjs,
    events: Array<CalendarEvent>
  }

  export type MonthDays = {
    date: Date|string,
    isCurrentMonth: boolean,
  }

  export type MonthDaysWithEvents = {
    date: Date | string,
    isCurrentMonth: boolean,
    events: Array<CalendarEvent>
  }

  const date = ref([new Date()])
  const events = ref<Array<Event>>([])
  const calendarEvents:Ref<Array<CalendarEvent>> = ref([])
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

  function createCalendarEvents () {
    calendarEvents.value = []
    kanmusuList.forEach(item => {
      const cEvent:CalendarEvent = {
        title: item.name,
        day: item.day,
        month: item.month,
        year: item.year,
        img: null,
      }
      if (imgUrls.hasOwnProperty(`/src/assets/icons/calendar/${item.name}.png`)) {
        cEvent.img = imgUrls[`/src/assets/icons/calendar/${item.name}.png`]
      } else {
        cEvent.img = imgUrls[`/src/assets/icons/calendar/_rensouhou.png`]
      }
      calendarEvents.value?.push(cEvent)
    })
  }

  onBeforeMount(() => {
    createEvents()
    createCalendarEvents()
  })
  watch(date, () => {
    createEvents()
  }, { deep: true })

</script>
<template>
  <div class="pa-6">
    <h1>Kanmusu birthday</h1>
    <TheCalendar :calendar-events="calendarEvents" />
  </div>
</template>
<style scoped>
</style>
