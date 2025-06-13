<script setup>

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import { ref } from 'vue'

const progress = ref('0')

const emit = defineEmits(['update'])
defineProps({
  text: '',
  icon: Object,
})

let interval = setInterval(() => {
  progress.value = 'full'
  if (progress.value) {
    clearInterval(interval)
  }
}, 900)

setInterval(() => {
  emit('update')
}, 2850)

const onClick = () => {
  emit('update')
}

</script>


<template>

  <div class="flex justify-center items-center fixed bottom-5 right-5 bg-white shadow-xl border border-gray-300 rounded-md p-2 gap-2 text-green-600 cursor-pointer" @click="onClick">
    <FontAwesomeIcon :icon="icon" class="p-2" /> {{text}}
    <div class="absolute rounded-bl-md transition-all bottom-0 duration-1000 ease-linear delay-1000 left-0 bg-green-600 h-1 " :class="`w-${progress}`"></div>
  </div>

</template>

<style scoped>

</style>