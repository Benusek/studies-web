<script setup>

import PlaylistSkeleton from "@/components/Loaders/PlaylistSkeleton.vue";
</script>
<template>
  <div class="w-full p-2 animate-in fade-in duration-300">

    <section class="mb-4">
      <div class="inline-flex gap-2 rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
        <div class="h-10 w-24 rounded-xl bg-zinc-200"/>
        <div class="h-10 w-28 rounded-xl bg-zinc-200"/>
      </div>
    </section>

    <section class="mt-4">
      <div class="rounded-3xl border border-zinc-200 bg-white p-4 lg:p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <PlaylistSkeleton v-for="index in 8" :key="index" />
        </div>
      </div>
    </section>
  </div>
</template>