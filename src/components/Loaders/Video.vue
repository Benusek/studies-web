<script setup>

</script>

<template>
  <div class="rounded-lg shadow-sm p-1 min-w-25 cursor-pointer animate-pulse" v-for="i in 30">
    <div class="bg-contain rounded-lg w-full bg-gray-300 bg-no-repeat relative pt-[56%]"></div>
    <div class="p-2 grid grid-cols-6 gap-1">
      <div class="flex justify-center py-1.5">
        <div class="py-1.5 col-span-1 aspect-square w-10 rounded-full bg-gray-300" />
      </div>
      <div class="col-span-5">
        <p
          class="text-xs sm:text-sm h-2 opacity-10 bg-current text-lg font-semibold leading-6 break-words line-clamp-2 mb-3"></p>
        <p class="h-2 opacity-10 bg-current text-lg font-semibold leading-6 break-words line-clamp-2"></p>
      </div>
    </div>
  </div>
</template>

