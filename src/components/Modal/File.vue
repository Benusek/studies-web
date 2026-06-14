<script setup>
import { ref } from 'vue'
import {faCloudArrowUp, faFileVideo, faImage} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

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
    <template class="cursor-pointer border rounded-lg bg-gray-100/20 flex flex-col p-2"
              :class="{'border-green-500 animate-pulse':dragover, 'border-gray-300':!dragover}">
      <input type="file" :id="type" :name="type" class="hidden" ref="input"
             :accept="['avatar','thumbnail'].includes(type) ? 'image/*' : 'video/*'"
             @change="$emit('change', $event, type, 'target')">
      <template v-if="file[type + 'blob']">
        <img v-if="['thumbnail'].includes(type)" class="w-full rounded-t-lg object-contain h-30"
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
      <div v-else class="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center border-dashed"
           :class="{'border-green-500': dragover, 'border-gray-500': !dragover}">
        <FontAwesomeIcon :icon="type.includes('video') ? faFileVideo : faImage" class="text-4xl text-gray-500"/>
        <div>
          <p class="text-gray-400">Перетащите файл сюда</p>
          <p class="text-sm text-gray-500">или нажмите для выбора</p>
        </div>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <FontAwesomeIcon :icon="faCloudArrowUp" />
          <span> {{ type.includes('video') ? 'Видео MP4, MOV' : 'PNG, JPG, WEBP'}}</span>
        </div>
      </div>
    </template>
  </label>
</template>