<template>
  <div class="max-w-7xl mx-auto p-6 animate-pulse">

    <div class="mb-8">
      <div class="h-9 w-80 rounded-xl bg-zinc-200"></div>
      <div class="mt-2 h-4 w-64 rounded-lg bg-zinc-100"></div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

      <div class="xl:col-span-8 space-y-6">

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <div class="h-6 w-32 rounded bg-zinc-200 mb-5"></div>

          <div>
            <div class="h-4 w-24 rounded bg-zinc-200 mb-2"></div>
            <div class="h-12 rounded-2xl bg-zinc-100"></div>
          </div>

        </div>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <div class="h-6 w-24 rounded bg-zinc-200 mb-5"></div>

          <div class="space-y-3">

            <div v-for="i in 5" :key="i" class="flex items-center gap-4 rounded-2xl bg-zinc-50 p-3">

              <div class="size-20 rounded-xl bg-zinc-200 shrink-0"></div>

              <div class="flex-1">

                <div class="h-5 w-4/5 rounded bg-zinc-200"></div>

                <div class="h-4 w-32 rounded bg-zinc-100 mt-3"></div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div class="xl:col-span-4 space-y-6">

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <div class="h-6 w-28 rounded bg-zinc-200 mb-5"></div>

          <div class="flex items-start justify-between">

            <div>

              <div class="h-5 w-36 rounded bg-zinc-200"></div>

              <div class="h-4 w-48 rounded bg-zinc-100 mt-2"></div>

            </div>

            <div class="size-5 rounded bg-zinc-200"></div>

          </div>

        </div>

        <div class="rounded-3xl border border-zinc-200 bg-white p-6">

          <div class="h-6 w-20 rounded bg-zinc-200 mb-5"></div>

          <div class="flex items-center gap-3">

            <div class="size-12 rounded-full bg-zinc-200"></div>

            <div class="flex-1">

              <div class="h-5 w-28 rounded bg-zinc-200"></div>

              <div class="h-4 w-24 rounded bg-zinc-100 mt-2"></div>

            </div>

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