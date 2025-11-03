<script setup>

import { faHome, faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const props = defineProps({
  text: String,
  isEmpty: Boolean
})
</script>

<template>
  <div class="flex flex-col gap-4 p-10 col-span-full flex justify-center items-center text-gray-500"
       v-if="props.isEmpty">
    <FontAwesomeIcon :icon="faPhotoFilm" class="text-4xl " />
    <span class="text-lg">{{props.text}}</span>
    <RouterLink to="/" class="flex flex-row gap-2 items-center text-blue-600">
      <FontAwesomeIcon :icon="faHome" />
      <span>Вернуться на главную</span>
    </RouterLink>
  </div>
</template>

<style scoped>

</style>