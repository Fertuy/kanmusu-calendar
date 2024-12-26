<script
  setup
  lang="ts"
>
  import dayjs from 'dayjs'

  const props = defineProps({
    day: { type: Object, required: true },
    isToday: { type: Boolean, default: false },
  })
  const label = computed(() => {
    return dayjs(props.day.date).format('DD')
  })
</script>
<template>
  <li
    class="calendar-day d-flex flex-column"
    :class="{
      'calendar-day--not-current': !day.isCurrentMonth,
      'calendar-day--today': isToday
    }"
  >
    <span class="align-self-center text-h5">{{ label }}</span>
    <div v-if="day.events.length!==0">
      <VCard
        v-for="event in day.events"
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
  </li>
</template>
<style
  scoped
  lang="scss"
>
.calendar-day {
  position: relative;
  border: solid 1px #ffffff;
  min-height: 200px;
  font-size: 16px;
  background-color: rgba(70, 70, 70, 0.2);
  padding: 5px;
}

.calendar-day--not-current {
  background-color: rgba(10, 10, 10, 0.7);
  div {
   opacity: 0.8;
  }
}
.calendar-day--today {
  span {
    padding: 0 15px 0 15px;
    display: inline-block;
    background-color: rgba(255, 0, 0, 0.7);
    border-radius: 50%;
  }
}
</style>
