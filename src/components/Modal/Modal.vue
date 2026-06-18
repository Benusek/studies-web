<script setup>
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['exit'])
defineProps({
  label: String
})
</script>

<template>
  <div class="fixed flex justify-center sm:items-center top-25 sm:top-0 bottom-0 right-0 left-0 z-50">
    <div class="flex items-center justify-center fixed bg-black/30 top-0 right-0 left-0 bottom-0"
         @click="$emit('exit')" />
    <div class="relative sm:rounded-xl bg-white w-full md:w-auto h-fit overflow-auto p-4">
      <span class="text-lg font-semibold select-none">{{ label }}</span>

      <div class="flex flex-col gap-3">
        <slot>Modal body</slot>
        <button @click.prevent="emit('exit')"
                class="w-full bg-zinc-900 rounded-lg py-1.5 text-white font-medium cursor-pointer hover:bg-zinc-800">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>