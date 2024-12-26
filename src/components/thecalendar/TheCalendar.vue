<script
  setup
  lang="ts"
>
  import { CalendarEvent, MonthDays, MonthDaysWithEvents, WeekItem } from '@/components/calendar/AppCalendar.vue'
  import CalendarHeader from '@/components/thecalendar/CalendarHeader.vue'
  import CalendarWeekdays from '@/components/thecalendar/CalendarWeekdays.vue'
  import CalendarHeaderMobile from '@/components/thecalendar/CalendarHeaderMobile.vue'
  import dayjs from 'dayjs'
  import weekdays from 'dayjs/plugin/weekday'
  import { Ref } from 'vue'

  dayjs.extend(weekdays)

  const calendarDate = ref(new Date())
  const numberOfDaysInMonth: Ref<number | null> = ref(null)
  const currentMonthDays: Ref<Array<MonthDays>> = ref([])
  const year: Ref<number> = ref(0)
  const month: Ref<number> = ref(0)
  const days: Ref<Array<MonthDaysWithEvents> | null> = ref(null)
  const week: Ref<Array<WeekItem>> = ref([])
  const today: any = ref(null)
  const props = defineProps({
    calendarEvents: {
      type: Array<CalendarEvent>,
      required: true,
    },
  })

  function nextMonth () {
    calendarDate.value = dayjs(calendarDate.value).add(1, 'month').toDate()
  }

  function prevMonth () {
    calendarDate.value = dayjs(calendarDate.value).subtract(1, 'month').toDate()
  }

  function nextWeek () {
    calendarDate.value = dayjs(calendarDate.value).add(1, 'week').toDate()
  }

  function prevWeek () {
    calendarDate.value = dayjs(calendarDate.value).subtract(1, 'week').toDate()
  }

  function getWeekday (date:any) {
    return dayjs(date).weekday()
  }

  function getCurrentMonthDays () {
    return [...Array(numberOfDaysInMonth.value)]
      .map((day, index) => {
        const monthDay:MonthDays = {
          date: dayjs(`${year.value}-${month.value}-${index + 1}`).format('YYYY-MM-DD'),
          isCurrentMonth: true,
        }
        return monthDay
      })
  }

  function getPrevMonthDays () {
    const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays.value[0].date)
    const prevMonth = dayjs(`${year.value}-${month.value + 1}-01`).subtract(1, 'month')

    const visibleNumberOfDaysFromPrevMonth =
      firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6

    const previousMonthLastMondayDayOfMonth =
      dayjs(currentMonthDays.value[0].date)
        .subtract(visibleNumberOfDaysFromPrevMonth, 'day')
        .date()

    return [...Array(visibleNumberOfDaysFromPrevMonth)].map((day, index) => {
      return {
        date: dayjs(`${prevMonth.year()}-${prevMonth.month()}-${previousMonthLastMondayDayOfMonth + index}`).format('YYYY-MM-DD'),
        isCurrentMonth: false,
      }
    })
  }

  function getNextMonthDays () {
    const lastDayOfTheMonthWeekday = getWeekday(`${year.value}-${month.value}-${currentMonthDays.value?.length}`)
    const nextMonth = dayjs(`${year.value}-${month.value}-01`).add(1, 'month')

    const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday ? 7 - lastDayOfTheMonthWeekday : lastDayOfTheMonthWeekday

    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
      return {
        date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format('YYYY-MM-DD'),
        isCurrentMonth: false,
      }
    })
  }

  function getDays () {
    return [...getPrevMonthDays(), ...getCurrentMonthDays(), ...getNextMonthDays()].map((day, index) => {
      const monthDayWithEvents: MonthDaysWithEvents = {
        date: day.date,
        isCurrentMonth: day.isCurrentMonth,
        events: props.calendarEvents.filter(event => {
          return dayjs(day.date).date() === event.day && dayjs(day.date).month() + 1 === event.month
        }),
      }

      return monthDayWithEvents
    })
  }

  function getWeek () {
    const dayOfWeek = dayjs(calendarDate.value).day()
    const monday = dayjs(calendarDate.value).subtract(dayOfWeek ? dayOfWeek - 1 : 6, 'days')
    return [...Array(7)]
      .map((day, index) => {
        if (index === 0) {
          return {
            day: monday,
            events: props.calendarEvents.filter(event => {
              return dayjs(monday).date() === event.day && dayjs(monday).month() + 1 === event.month
            }),
          }
        } else {
          return {
            day: monday.add(index, 'days'),
            events: props.calendarEvents.filter(event => {
              return dayjs(monday.add(index, 'days')).date() === event.day && dayjs(monday.add(index, 'days')).month() + 1 === event.month
            }),
          }
        }
      })
  }

  function getToday () {
    return dayjs().format('YYYY-MM-DD')
  }

  function isMobile () {
    if (screen.width <= 760) {
      return true
    }
    return false
  }

  onBeforeMount(() => {
    today.value = getToday()
    week.value = getWeek()
    console.log(week.value)
  })

  watch(calendarDate, () => {
    year.value = calendarDate.value.getFullYear()
    month.value = calendarDate.value.getMonth() + 1
    numberOfDaysInMonth.value = dayjs(calendarDate.value).daysInMonth()
    currentMonthDays.value = getCurrentMonthDays()
    week.value = getWeek()
    days.value = getDays()

    console.log(week.value)
  }, { deep: true, immediate: true })
</script>
<template>
  <div v-if="isMobile()">
    <CalendarHeaderMobile
      :next-week="nextWeek"
      :prev-week="prevWeek"
    />
    <div class="days-grid-mobile">
      <CalendarWeekdaysMobile :week="week" />
    </div>
  </div>
  <div
    v-else
    class="border"
  >
    <CalendarHeader
      :date="calendarDate"
      :next-month="nextMonth"
      :prev-month="prevMonth"
    />
    <CalendarWeekdays />
    <ol class="days-grid">
      <CalendarMonthDayItem
        v-for="day in days"
        :key="day.date.toString"
        :day="day"
        :is-today="day.date===today"
      />
    </ol>
  </div>
</template>
<style
  scoped
  lang="scss"
>
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(100px, 1fr));
}

.days-grid-mobile {
  display: flex;
  flex-direction: column;
}

.days-grid-mobile-weekdays {
  display: block;
  min-height: 100px;
}
</style>
