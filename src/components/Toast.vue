<script setup>

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import { ref } from 'vue'

const progress = ref('0')
const close = ref(false)

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
}, 500)

setInterval(() => {
  emit('update')
}, 2500)

const onClick = () => {
  emit('update')
}

</script>


<template>
  <div class="flex justify-center items-center absolute bottom-5 right-5 bg-white shadow-xl border border-gray-300 rounded-t-lg p-2 gap-2 text-green-600 cursor-pointer" @click="onClick">
    <FontAwesomeIcon :icon="icon" class="p-2" /> {{text}}
    <div class="absolute transition-all bottom-0 left-0 bg-green-600 h-1 duration-1000 delay-1000 ease-linear" :class="`w-${progress}`"></div>
  </div>
</template>

<style scoped>

</style>