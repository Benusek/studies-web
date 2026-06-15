<script setup>
import { ref } from 'vue'
import {
  faCloudArrowUp,
  faTrash,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const dragover = ref(false)

defineEmits(['change', 'remove'])

defineProps({
  file: Object,
  type: String,
  name: String
})
</script>

<template>
  <label
      :for="type"
      @dragover.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      @drop.prevent="$emit('change', $event, type, 'dataTransfer'); dragover = false">

    <div class="mb-2 text-sm font-medium text-zinc-700">
      {{ name }}
    </div>

    <div
        class="relative overflow-hidden rounded-2xl border bg-white transition-all duration-200"
        :class="dragover
          ? 'border-indigo-500 ring-4 ring-indigo-100'
          : 'border-zinc-200 hover:border-zinc-300'">

      <input
          type="file"
          :id="type"
          :name="type"
          class="hidden"
          :accept="['avatar','thumbnail'].includes(type) ? 'image/*' : 'video/*'"
          @change="$emit('change', $event, type, 'target')">

      <template v-if="file[type + 'blob']">

        <button
            type="button"
            @click.prevent="$emit('remove', type)"
            class="absolute top-3 right-3 z-20 size-8 rounded-full bg-black/70 text-white
            hover:bg-red-500 transition cursor-pointer">
          <FontAwesomeIcon :icon="faXmark"/>
        </button>

        <img
            v-if="type === 'thumbnail'"
            :src="file[type + 'blob']"
            class="h-64 w-full object-cover" />

        <video
            v-else-if="type === 'video'"
            :key="file[type + 'blob']"
            class="h-64 w-full bg-black object-contain"
            controls>
          <source :src="file[type + 'blob']">
        </video>

        <div
            v-else-if="type === 'avatar'"
            class="flex justify-center py-8">

          <img
              :src="file[type + 'blob']"
              class="size-32 rounded-full object-cover border border-zinc-200 shadow-sm" />
        </div>

        <div
            class="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-3">

          <div class="min-w-0">
            <div class="truncate text-sm font-medium text-zinc-800">
              {{ file[type + 'name'] }}
            </div>
            <div class="text-xs text-zinc-500">
              Файл готов к загрузке
            </div>
          </div>

          <button
              type="button"
              @click.prevent="$emit('remove', type)"
              class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500
              hover:bg-red-50 transition cursor-pointer">

            <FontAwesomeIcon :icon="faTrash"/>
            <span>Удалить</span>

          </button>

        </div>

      </template>

      <div
          v-else
          class="flex flex-col items-center justify-center gap-4 p-4 text-center">

        <div>
          <div class="font-medium text-zinc-800">
            Перетащите файл сюда
          </div>

          <div class="mt-1 text-sm text-zinc-500">
            или нажмите для выбора
          </div>
        </div>

        <div
            class="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">

          <FontAwesomeIcon :icon="faCloudArrowUp"/>

          <span>
            {{
              type.includes('video')
                  ? 'MP4, MOV, WEBM'
                  : 'PNG, JPG, WEBP'
            }}
          </span>

        </div>

      </div>

    </div>

  </label>
</template>