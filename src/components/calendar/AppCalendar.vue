<script
  setup
  lang="ts"
>
import {VCalendar} from 'vuetify/labs/VCalendar'
import kanmusuList from '@/assets/kcbirthday.json'
import {orange} from 'vuetify/util/colors'

type Event = {
  title: string | null,
  allDay: boolean,
  start: Date | null,
  end: Date | null,
  color: any
}

const date = ref([new Date()])
const events = ref([])

function createEvents() {
  events.value = []
  kanmusuList.forEach(item => {
    const event = <Event>{}
    event.title = item.name
    event.allDay = true
    event.color = "orange"
    event.start = new Date(date.value[0].getFullYear(), item.month - 1, item.day)
    event.end = event.start
    events.value.push(event)
  })
}

onMounted(() => {
  createEvents()
})
watch(date, () => {
  createEvents()
}, {deep: true})
</script>
<template>
  <VContainer>
    <h1>Kanmusu birthday</h1>
    <VCalendar
      v-model="date"
      :events="events"
    />
  </VContainer>
</template>
<style scoped>
</style>
