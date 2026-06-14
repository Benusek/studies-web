<template>
    <div class="max-w-6xl w-full mx-auto p-4 md:p-6 animate-pulse">
      <div class="rounded-3xl border border-gray-100 bg-white shadow-lg p-6 md:p-8">
        <div class="flex flex-col lg:flex-row items-center gap-6">
          <div class="w-32 h-32 rounded-full bg-gray-200 shrink-0"></div>

          <div class="flex-1 w-full">
            <div class="h-8 w-56 bg-gray-200 rounded-lg mb-3"></div>
            <div class="h-4 w-32 bg-gray-100 rounded mb-2"></div>
            <div class="h-4 w-48 bg-gray-100 rounded mb-4"></div>

            <div class="h-8 w-64 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>

      <div class="mt-6 rounded-3xl border border-gray-100 bg-white shadow-lg p-6">
        <div class="h-6 w-32 bg-gray-200 rounded mb-6"></div>
        <div class="grid md:grid-cols-2 gap-5">
          <div v-for="n in 4" :key="n" class="max-w-xs">
            <div class="h-4 w-20 bg-gray-100 rounded mb-2"></div>
            <div class="h-11 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>

      <div class="mt-6 rounded-3xl border border-gray-100 bg-white shadow-lg p-6">
        <div class="h-6 w-36 bg-gray-200 rounded mb-4"></div>
        <div class="h-11 max-w-xs bg-gray-200 rounded-xl"></div>
      </div>

      <div class="mt-6 rounded-3xl border border-gray-100 bg-white shadow-lg p-6">
        <div class="h-6 w-24 bg-gray-200 rounded mb-4"></div>
        <div class="h-11 max-w-xs bg-gray-200 rounded-xl"></div>
      </div>

      <div class="mt-6 flex justify-between">
        <div class="w-[220px] h-12 bg-gray-200 rounded-2xl"></div>
        <div class="w-[220px] h-12 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
</template>