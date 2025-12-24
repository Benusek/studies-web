<script setup>
import { ref } from 'vue'

const dragover = ref(false)
defineEmits(['change'])
defineProps({
  file: Object,
  type: String,
  name: String
})

</script>

<template>
  <label :for="type" @dragover.prevent="dragover = true" @dragleave.prevent="dragover = false"
         @drop.prevent="$emit('change', $event, type, 'dataTransfer'); dragover = false">
    <span class="select-none text-xs">{{ name }}</span>
    <template class="cursor-pointer border rounded-lg bg-gray-100/20 flex flex-col"
              :class="{'border-green-500 animate-pulse':dragover, 'border-gray-300':!dragover}">
      <input type="file" :id="type" :name="type" class="hidden" ref="input"
             :accept="['avatar','thumbnail'].includes(type) ? 'image/*' : 'video/*'"
             @change="$emit('change', $event, type, 'target')">
      <template v-if="file[type + 'blob']">
        <img v-if="['thumbnail'].includes(type)" class="w-full rounded-t-lg object-cover h-30"
             :src="file ? file[type + 'blob'] : null" alt="thumbnail">
        <video v-else-if="type.includes('video')" :key="file[type + 'blob']"
               class="w-full rounded-t-lg object-contain h-30" controls>
          <source :src="file ? file[type + 'blob'] : null" />
        </video>
        <div v-else-if="['avatar'].includes(type)"
             class="relative flex flex-row items-end gap-4 justify-center p-2">
          <img v-for="i in 3"
               :src="file[type + 'name'] ? file[type + 'blob'] : '/src/assets/default.png'"
               alt="avatar"
               class="rounded-full aspect-square object-cover border border-gray-200 shadow-md
               hover:brightness-80 bg-gray-300" :class="`w-${20 - 5 * i} h-${20 - 5 * i}`" />
        </div>
      </template>

      <p v-if="file[type + 'name']" :class="{'text-green-500': dragover, 'text-gray-500': !dragover}"
         class="flex justify-center text-gray-700 w-50 line-clamp-1 break-words p-2">
        {{ file[type + 'name'] }}
      </p>
      <p v-else :class="{'text-green-500': dragover, 'text-gray-500': !dragover}"
         class="flex justify-center text-gray-500 p-1.5 select-none">Файл не выбран</p>
    </template>
  </label>
</template>