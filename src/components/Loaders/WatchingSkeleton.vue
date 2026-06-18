<template>
  <div class="flex flex-col lg:flex-row p-2 animate-pulse">

    <div class="px-2 flex flex-1 grow-[2.5] flex-col gap-4">

      <div class="overflow-hidden rounded-3xl bg-zinc-200 aspect-video"/>

      <div class="h-8 w-3/4 rounded-xl bg-zinc-200"/>

      <section class="rounded-3xl border border-zinc-200 bg-white p-5">

        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div class="flex items-center gap-4">

            <div class="size-14 rounded-full bg-zinc-200"/>

            <div class="space-y-2">

              <div class="h-4 w-36 rounded bg-zinc-200"/>

              <div class="h-3 w-24 rounded bg-zinc-200"/>

            </div>

            <div class="h-11 w-32 rounded-2xl bg-zinc-200"/>

          </div>

          <div class="flex gap-2">

            <div class="h-11 w-32 rounded-2xl bg-zinc-200"/>

            <div class="h-11 w-28 rounded-2xl bg-zinc-200"/>

          </div>

        </div>

      </section>

      <section class="rounded-3xl border border-zinc-200 bg-white p-5">

        <div class="flex gap-3 mb-5">

          <div class="h-5 w-24 rounded-full bg-zinc-200"/>

          <div class="h-5 w-20 rounded-full bg-zinc-200"/>

        </div>

        <div class="space-y-3">

          <div class="h-4 w-full rounded bg-zinc-200"/>

          <div class="h-4 w-full rounded bg-zinc-200"/>

          <div class="h-4 w-4/5 rounded bg-zinc-200"/>

        </div>

        <div class="mt-5 flex flex-wrap gap-2">

          <div class="h-8 w-20 rounded-full bg-zinc-200"/>

          <div class="h-8 w-24 rounded-full bg-zinc-200"/>

          <div class="h-8 w-28 rounded-full bg-zinc-200"/>

        </div>

      </section>

      <section class="rounded-3xl border border-zinc-200 bg-white p-5">

        <div class="flex items-center justify-between mb-5">

          <div class="h-6 w-40 rounded bg-zinc-200"/>

          <div class="h-4 w-10 rounded bg-zinc-200"/>

        </div>

        <div class="flex gap-3">

          <div class="size-12 rounded-full bg-zinc-200"/>

          <div class="flex-1 space-y-3">

            <div class="h-16 rounded-2xl bg-zinc-200"/>

            <div class="flex justify-end gap-2">

              <div class="h-10 w-24 rounded-xl bg-zinc-200"/>

              <div class="h-10 w-28 rounded-xl bg-zinc-200"/>

            </div>

          </div>

        </div>

      </section>

      <div class="space-y-4">

        <div v-for="i in 4" :key="i" class="rounded-3xl border border-zinc-200 bg-white p-5">

          <div class="flex gap-3">

            <div class="size-10 rounded-full bg-zinc-200"/>

            <div class="flex-1">

              <div class="flex items-center gap-2 mb-3">

                <div class="h-4 w-28 rounded bg-zinc-200"/>

                <div class="h-3 w-16 rounded bg-zinc-200"/>

              </div>

              <div class="space-y-2">

                <div class="h-4 w-full rounded bg-zinc-200"/>

                <div class="h-4 w-5/6 rounded bg-zinc-200"/>

              </div>

              <div class="mt-4 flex gap-2">

                <div class="h-8 w-24 rounded-full bg-zinc-200"/>

                <div class="h-8 w-32 rounded-full bg-zinc-200"/>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

    <div class="w-full lg:max-w-md xl:max-w-lg flex flex-col gap-4 px-2">

      <div
          v-for="i in 8"
          :key="i"
          class="rounded-3xl border border-zinc-200 bg-white p-3">

        <div class="flex gap-3">

          <div class="w-40 aspect-video rounded-2xl bg-zinc-200 shrink-0"/>

          <div class="flex-1 space-y-2">

            <div class="h-4 rounded bg-zinc-200"/>

            <div class="h-4 w-5/6 rounded bg-zinc-200"/>

            <div class="h-3 w-24 rounded bg-zinc-200"/>

            <div class="h-3 w-20 rounded bg-zinc-200"/>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>