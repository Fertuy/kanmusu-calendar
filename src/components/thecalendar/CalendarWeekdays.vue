<script
  setup
  lang="ts"
>
// weekdays
  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>
<template>
  <ol class="day-of-week">
    <li
      v-for="weekday in WEEKDAYS"
      :key="weekday"
      class="text-h5 d-flex align-center justify-center weekday"
    >{{ weekday }}
    </li>
  </ol>
</template>
<style
  scoped
  lang="scss"
>
.day-of-week {
  display: grid;
  grid-template-columns: repeat(7, minmax(200px, 1fr));
}
.weekday {
  border-right: 1px solid #FFF;
  border-bottom: 1px solid #FFF;
  border-left: 1px solid #FFF;
}
</style>
