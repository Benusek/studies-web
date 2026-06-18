<template>
  <div class="max-w-7xl mx-auto p-6 animate-pulse">

    <div class="mb-8">
      <div class="h-9 w-72 rounded-xl bg-zinc-200"></div>
      <div class="mt-2 h-4 w-96 rounded-lg bg-zinc-100"></div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

      <div class="xl:col-span-8 space-y-6">

        <div class="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
          <div class="aspect-video bg-zinc-200"></div>

          <div class="border-t border-zinc-200 p-6">

            <div class="flex items-center justify-between">

              <div>
                <div class="h-5 w-32 rounded bg-zinc-200"></div>
                <div class="mt-2 h-4 w-56 rounded bg-zinc-100"></div>
              </div>

              <div class="h-10 w-28 rounded-2xl bg-zinc-200"></div>

            </div>

          </div>

        </div>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <div class="h-6 w-48 rounded bg-zinc-200 mb-5"></div>

          <div class="space-y-5">

            <div>
              <div class="h-4 w-24 rounded bg-zinc-200 mb-2"></div>
              <div class="h-12 rounded-2xl bg-zinc-100"></div>
            </div>

            <div>
              <div class="h-4 w-24 rounded bg-zinc-200 mb-2"></div>
              <div class="h-48 rounded-2xl bg-zinc-100"></div>
            </div>

          </div>

        </div>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <div class="h-6 w-32 rounded bg-zinc-200 mb-5"></div>

          <div class="grid sm:grid-cols-2 gap-4">

            <div class="rounded-2xl bg-zinc-100 p-4">
              <div class="h-4 w-24 rounded bg-zinc-200"></div>
              <div class="mt-3 h-5 w-20 rounded bg-zinc-300"></div>
            </div>

            <div class="rounded-2xl bg-zinc-100 p-4">
              <div class="h-4 w-24 rounded bg-zinc-200"></div>
              <div class="mt-3 h-5 w-32 rounded bg-zinc-300"></div>
            </div>

          </div>

        </div>

      </div>

      <div class="xl:col-span-4 space-y-6">

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <div class="h-6 w-32 rounded bg-zinc-200 mb-5"></div>

          <div class="h-12 rounded-2xl bg-zinc-100"></div>

        </div>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <div class="flex items-center justify-between mb-5">

            <div class="h-6 w-16 rounded bg-zinc-200"></div>
            <div class="h-4 w-6 rounded bg-zinc-100"></div>

          </div>

          <div class="flex flex-wrap gap-2">

            <div v-for="i in 12" :key="i" class="h-9 w-24 rounded-full bg-zinc-100"></div>

          </div>

        </div>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <div class="h-6 w-32 rounded bg-zinc-200 mb-5"></div>

          <div class="flex items-start justify-between">
            <div>
              <div class="h-5 w-32 rounded bg-zinc-200"></div>
              <div class="mt-2 h-4 w-48 rounded bg-zinc-100"></div>
            </div>

            <div class="size-5 rounded bg-zinc-200"></div>
          </div>

        </div>

        <div class="rounded-3xl border border-red-100 bg-red-50 p-6">

          <div class="h-6 w-32 rounded bg-red-200 mb-3"></div>

          <div class="h-4 w-full rounded bg-red-100"></div>
          <div class="h-4 w-4/5 rounded bg-red-100 mt-2 mb-5"></div>

          <div class="h-12 rounded-2xl bg-red-200"></div>

        </div>

        <div class="h-12 rounded-2xl bg-zinc-200"></div>

      </div>

    </div>

  </div>
</template>