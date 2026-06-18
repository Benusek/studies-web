<script setup>


defineProps({
  data: Object
})
</script>

<template>
  <div class="rounded-3xl border border-zinc-200 bg-white p-6">
    <h2 class="text-lg font-semibold mb-5">
      Публикация
    </h2>
    <div class="space-y-3">
      <label class="flex items-start gap-3 p-4 rounded-2xl border border-zinc-200 cursor-pointer transition"
             :class="{'bg-zinc-50': data.public}">
        <input v-model="data.public" :value="true" type="radio">
        <div>
          <div class="font-medium">
            Публичное видео
          </div>

          <div class="text-sm text-zinc-500 mt-1">
            Видео доступно всем пользователям
          </div>
        </div>
      </label>
      <label class="flex items-start gap-3 p-4 rounded-2xl border border-zinc-200 cursor-pointer transition"
             :class="{'bg-zinc-50': !data.public}">
        <input v-model="data.public" :value="false" type="radio">
        <div>
          <div class="font-medium">
            Ограниченный доступ
          </div>

          <div class="text-sm text-zinc-500 mt-1">
            Видео доступно только вам
          </div>
        </div>
      </label>
    </div>
  </div>
</template>