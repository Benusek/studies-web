<script setup>
import VideoSkeleton from "@/components/Loaders/VideoSkeleton.vue";
</script>

<template>
  <div class="mx-auto w-full max-w-[1800px] p-3 lg:p-6 animate-pulse">
    <section class="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-4">
          <div class="size-20 md:size-24 rounded-full bg-zinc-200"/>
          <div class="flex flex-col gap-3">
            <div class="h-8 w-48 rounded-lg bg-zinc-200"/>
            <div class="h-4 w-32 rounded-lg bg-zinc-200" />
          </div>
        </div>
        <div class="h-11 w-36 rounded-xl bg-zinc-200" />

      </div>
    </section>

    <section class="mt-6">
      <div class="inline-flex gap-2 rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
        <div class="h-10 w-24 rounded-xl bg-zinc-200"/>
        <div class="h-10 w-28 rounded-xl bg-zinc-200"/>
      </div>
    </section>

    <section class="mt-6">
      <div class="rounded-3xl border border-zinc-200 bg-white p-4 lg:p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          <VideoSkeleton  v-for="index in 8" :key="index"/>
        </div>
      </div>
    </section>

  </div>
</template>