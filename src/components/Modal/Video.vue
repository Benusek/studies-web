<script setup>
defineEmits(['change'])
defineProps({
  file: Object,
  type: String,
  name: String
})
</script>

<template>
  <label for="video">
    <span class="text-gray-500 select-none text-xs">Видео</span>
    <template class="cursor-pointer border border-gray-300 rounded-lg p-1.5 bg-gray-100/20 flex flex-col gap-2">
      <input type="file" id="video" class="hidden" accept="video/*" @change="$emit('change', $event, type)">
      <video v-if="file[type + 'blob']" class="w-full object-cover h-30 border border-gray-300" disablePictureInPicture
             autoplay controls>
        <source :src="file ? file[type + 'blob'] : null" />
      </video>
      <p v-if="file[type + 'name']"
         class="flex justify-center text-gray-700 w-50 line-clamp-1 break-words">
        {{ file[type + 'name'] }}
      </p>
      <p v-else class="flex justify-center text-gray-500">
        Файл не выбран
      </p>
    </template>
  </label>
</template>