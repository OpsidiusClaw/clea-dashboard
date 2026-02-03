<script setup lang="ts">
import type { Task } from '~/stores/tasks'

defineProps<{
  title: string
  tasks: Task[]
  color: string
}>()
</script>

<template>
  <div class="flex flex-col min-w-[280px] flex-1">
    <div class="flex items-center gap-2 mb-3 px-1">
      <span class="w-2 h-2 rounded-full" :class="color" />
      <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {{ title }}
      </h3>
      <UBadge variant="subtle" color="neutral" size="xs">
        {{ tasks.length }}
      </UBadge>
    </div>
    <div class="flex flex-col gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 min-h-[200px]">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
      />
      <p
        v-if="tasks.length === 0"
        class="text-xs text-gray-400 dark:text-gray-600 text-center py-8"
      >
        Aucune tâche
      </p>
    </div>
  </div>
</template>
