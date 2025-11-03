<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

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
  <div
    class="flex justify-center items-center fixed bottom-5 right-5 bg-white shadow-xl border border-gray-300 rounded-md p-2 gap-2 text-green-600 cursor-pointer"
    @click="$emit('exit')">
    <FontAwesomeIcon :icon="icon" class="p-2" />
    {{ text }}
  </div>
</template>