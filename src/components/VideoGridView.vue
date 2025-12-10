<script setup>
import VideoPreview from '@/components/VideoPreview.vue'
import NotFound from '@/components/Loaders/NotFound.vue'

const props = defineProps({
  videos: Array,
  isEmpty: Boolean,
  isResponse: Boolean,
  isProcessing: Boolean,
  text: String
})
// window.onbeforeunload = function() {
//   window.scrollTo(0, 0)
// }

</script>

<template>


</template>