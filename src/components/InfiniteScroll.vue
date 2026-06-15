<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Loading from '@/components/Loaders/Loading.vue'

const emit = defineEmits(['load'])

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: true
  }
})

const trigger = ref(null)

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
      ([entry]) => {
        if (
            entry.isIntersecting &&
            props.hasMore &&
            !props.loading
        ) {
          emit('load')
        }
      },
      {
        threshold: 0.3
      }
  )

  if (trigger.value) {
    observer.observe(trigger.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="col-span-full py-8">
    <div ref="trigger" class="flex flex-col items-center justify-center gap-3">
      <Loading v-if="loading" :size="8" />
      <div v-else-if="hasMore" class="flex items-center gap-2 text-zinc-400 text-sm">
        <div class="h-px w-8 bg-zinc-200"/>
        <span>Прокрутите ниже</span>
        <div class="h-px w-8 bg-zinc-200"/>
      </div>
      <div v-else class="text-sm text-zinc-400">
        Больше видео нет
      </div>
    </div>

  </div>
</template>