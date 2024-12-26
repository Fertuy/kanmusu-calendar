<script
  setup
  lang="ts"
>
// weekdays
  import dayjs from 'dayjs'
  import { WeekItem } from '@/components/calendar/AppCalendar.vue'

  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  defineProps({
    week: { type: Array<WeekItem>, required: true },
  })
</script>
<template>
  <div
    v-for="(weekday, index) in WEEKDAYS"
    :key="weekday"
    class="text-h5 d-flex align-center weekday"
  >
    <div
      class="weekday-name"
      :class="{'is-today':dayjs(week[index].day).format('YYYY-MM-DD')===dayjs().format('YYYY-MM-DD')}"
    >
      <span>{{ weekday }}</span>
      <span>{{ dayjs(week[index].day).format("DD-MMM") }}</span>
    </div>
    <div class="weekday-events">
      <div v-if="week[index].events.length!==0">
        <VCard
          v-for="event in week[index].events"
          :key="event.title"
          class="d-flex align-center px-2 pb-1"
          variant="text"
        >
          <VAvatar size="64">
            <VImg :src="event.img" />
          </VAvatar>
          <VCardTitle class="flex-shrink-1">{{ event.title }}</VCardTitle>
        </VCard>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.weekday {
  border-right: 1px solid #FFF;
  border-bottom: 1px solid #FFF;
  border-top: 1px solid #FFF;

}
.weekday-name {
  margin-right: 20px;
  align-content: center;
  min-width: 100px;
  min-height: 100px;
  align-self: stretch;
  border-right: 1px solid #FFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 0 1 auto;
}

.weekday-events {
  display: block;
}
.is-today {
  background-color: #0d47a1;
}
</style>
