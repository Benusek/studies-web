<script setup>

import { faFaceFrown, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const props = defineProps({
  text: String,
  isEmpty: Boolean
})
</script>

<template>
  <div v-if="props.isEmpty" class="col-span-full flex items-center justify-center py-12 sm:py-20">
    <div class="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div class="flex justify-center">
        <div class="flex size-20 items-center justify-center rounded-full bg-zinc-100">
          <FontAwesomeIcon :icon="faFaceFrown" class="text-4xl text-zinc-400" />
        </div>
      </div>
      <div class="mt-6 text-center">
        <h2 class="text-xl font-semibold text-zinc-900">
          Ничего не найдено
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-zinc-500">
          {{ props.text }}
        </p>
      </div>
      <RouterLink to="/" class="mt-6 flex h-11 w-full items-center
      justify-center gap-2 rounded-xl bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-800">
        <FontAwesomeIcon :icon="faHome" />
        <span>Вернуться на главную</span>
      </RouterLink>
    </div>
  </div>
</template>