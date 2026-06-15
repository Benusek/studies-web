<script setup>

import VideoSkeleton from "@/components/Loaders/VideoSkeleton.vue";
</script>

<template>
  <div class="mx-auto w-full max-w-[1800px] p-3 lg:p-6 animate-pulse">

    <section class="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col xl:flex-row gap-6">
        <div class="w-full xl:max-w-lg shrink-0">
          <div class="relative aspect-video overflow-visible">
            <div class="absolute inset-0 translate-y-3 scale-[0.92] rounded-2xl bg-zinc-200" />
            <div class="absolute inset-0 translate-y-1.5 scale-[0.96] rounded-2xl bg-zinc-300" />
            <div class="relative h-full rounded-2xl bg-zinc-200">
              <div class="absolute bottom-4 right-4 h-8 w-20 rounded-xl bg-zinc-300"/>
            </div>
          </div>
        </div>
        <div class="flex flex-col flex-1">
          <div class="h-9 w-3/4 rounded-xl bg-zinc-200"/>
          <div class="mt-4 flex items-center gap-3">
            <div class="size-12 rounded-full bg-zinc-200"/>
            <div class="flex flex-col gap-2">
              <div class="h-4 w-32 rounded-lg bg-zinc-200"/>
              <div class="h-3 w-24 rounded-lg bg-zinc-200"/>
            </div>
          </div>
          <div class="mt-6 rounded-2xl bg-zinc-100 p-4">
            <div class="space-y-3">
              <div class="h-4 rounded-lg bg-zinc-200" />
              <div class="h-4 rounded-lg bg-zinc-200" />
              <div class="h-4 w-4/5 rounded-lg bg-zinc-200" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-2xl border border-zinc-200 bg-white p-4">
        <div class="h-3 w-16 rounded bg-zinc-200" />
        <div class="mt-3 h-7 w-10 rounded bg-zinc-200" />
      </div>
      <div class="rounded-2xl border border-zinc-200 bg-white p-4">
        <div class="h-3 w-16 rounded bg-zinc-200" />
        <div class="mt-3 h-7 w-24 rounded bg-zinc-200" />
      </div>
    </section>

    <section class="mt-6 rounded-3xl border border-zinc-200 bg-white p-4 lg:p-5">
      <div class="mb-5">
        <div class="h-7 w-48 rounded-xl bg-zinc-200"/>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        <VideoSkeleton v-for="index in 8" :key="index"/>
      </div>
    </section>

  </div>
</template>