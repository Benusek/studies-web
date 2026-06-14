<script setup>

</script>

<template>
  <div class="flex flex-2 flex-col lg:flex-row py-2 animate-pulse">
    <div class="flex-1 flex flex-col gap-4">
      <div class="w-full aspect-video rounded-2xl bg-gray-200"></div>

      <div class="space-y-3">
        <div class="h-8 w-3/4 bg-gray-200 rounded-lg"></div>

        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="size-12 rounded-full bg-gray-200"></div>

            <div class="space-y-2">
              <div class="h-4 w-32 bg-gray-200 rounded"></div>
              <div class="h-3 w-24 bg-gray-100 rounded"></div>
            </div>
          </div>

          <div class="h-10 w-32 rounded-xl bg-gray-200"></div>
        </div>

        <div class="rounded-2xl bg-gray-100 p-4">
          <div class="h-3 w-40 bg-gray-200 rounded mb-3"></div>
          <div class="h-3 w-full bg-gray-200 rounded mb-2"></div>
          <div class="h-3 w-5/6 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div class="space-y-4 mt-2">
        <div class="h-6 w-36 bg-gray-200 rounded"></div>

        <div class="flex gap-3 items-center">
          <div class="size-10 rounded-full bg-gray-200"></div>
          <div class="h-10 flex-1 bg-gray-100 rounded-full"></div>
        </div>

        <div v-for="n in 4" :key="n" class="flex gap-3">
          <div class="size-10 rounded-full bg-gray-200"></div>
          <div class="flex-1">
            <div class="h-3 w-32 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 w-full bg-gray-100 rounded mb-2"></div>
            <div class="h-3 w-2/3 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-[380px] px-4 flex flex-col gap-4">
      <div  v-for="n in 6" :key="n" class="flex gap-3">
        <div class="w-40 aspect-video rounded-xl bg-gray-200 shrink-0"></div>
        <div class="flex-1">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 w-5/6 bg-gray-200 rounded mb-3"></div>
          <div class="h-3 w-24 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>