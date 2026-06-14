<script setup>
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['exit'])
defineProps({
  label: String
})
</script>

<template>
  <div class="fixed flex justify-center sm:items-center top-0 bottom-0 right-0 left-0 z-4">
    <div class="flex items-center justify-center fixed bg-black/30 top-0 right-0 left-0 bottom-0"
         @click="$emit('exit')" />
    <div class="relative sm:rounded-xl bg-white w-full sm:w-auto h-fit overflow-auto p-2 ">
      <div v-if="label" class="flex justify-between items-center p-3 text-lg font-semibold gap-2">
        <span class="select-none">{{ label }}</span>
        <FontAwesomeIcon :icon="faXmark" class="cursor-pointer hover:text-black/60 text-end"
                         @click="$emit('exit')" />
      </div>
      <div class="flex flex-col p-1 gap-3">
        <slot>Тело модального окна</slot>
        <button @click.prevent="emit('exit')"
                class="w-full bg-zinc-600 rounded-lg min-w-50 py-1.5 text-white font-medium cursor-pointer hover:bg-zinc-700">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>