<template>
  <div class="min-w-25 animate-pulse">
    <div class="relative w-full aspect-video overflow-visible">
      <div class="absolute inset-0 translate-y-3 scale-[0.92] rounded-2xl bg-zinc-200"/>
      <div class="absolute inset-0 translate-y-1.5 scale-[0.96] rounded-2xl bg-zinc-300"/>
      <div class="relative h-full rounded-2xl bg-zinc-200">
        <div class="absolute bottom-3 right-3 h-6 w-16 rounded-lg bg-zinc-300"/>
      </div>
    </div>
    <div class="relative flex gap-3 pt-5">
      <div class="hidden sm:block h-10 w-10 rounded-full bg-zinc-200 shrink-0"/>
      <div class="flex-1">
        <div class="h-5 w-full rounded-lg bg-zinc-200"/>
        <div class="mt-2 h-5 w-4/5 rounded-lg bg-zinc-200"/>
        <div class="mt-3 h-4 w-28 rounded-lg bg-zinc-200"/>
        <div class="mt-3 h-6 w-20 rounded-full bg-zinc-200"/>
        <div class="mt-3 h-3 w-24 rounded-lg bg-zinc-200"/>
      </div>
    </div>
  </div>
</template>