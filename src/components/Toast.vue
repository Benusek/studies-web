<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {faClose} from "@fortawesome/free-solid-svg-icons";

const emit = defineEmits(['exit'])
defineProps({
  text: '',
  icon: Object
})

setInterval(() => {
  emit('exit')
}, 2850)
</script>


<template>
  <div class="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white/95
  backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl cursor-pointer
  transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      @click="$emit('exit')">
    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 text-green-600 shrink-0">
      <FontAwesomeIcon :icon="icon" />
    </div>
    <div class="flex flex-col">
    <span class="text-xs font-medium uppercase tracking-wide text-green-600">
      Успешно
    </span>
    <span class="text-sm font-medium text-gray-800">
      {{ text }}
    </span>
    </div>

    <button class="ml-2 text-gray-400 hover:text-gray-600 transition">
      <FontAwesomeIcon :icon="faClose" />
    </button>
  </div>
</template>