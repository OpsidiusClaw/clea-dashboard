<script setup lang="ts">
import type { Task } from '~/stores/tasks'

const props = defineProps<{
  task: Task
}>()

const store = useTasksStore()

const project = computed(() =>
  store.projects.find(p => p.id === props.task.projectId)
)

const priorityConfig = {
  high: { color: 'error' as const, label: 'Haute' },
  medium: { color: 'warning' as const, label: 'Moyenne' },
  low: { color: 'neutral' as const, label: 'Basse' },
}
</script>

<template>
  <UCard class="cursor-grab hover:ring-1 hover:ring-primary-500 transition-all">
    <div class="space-y-2">
      <div class="flex items-start justify-between gap-2">
        <p class="text-sm font-medium leading-tight">{{ task.title }}</p>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
        {{ task.description }}
      </p>
      <div class="flex items-center gap-2 flex-wrap">
        <UBadge
          v-if="project"
          :color="project.color as any"
          variant="subtle"
          size="xs"
        >
          {{ project.name }}
        </UBadge>
        <UBadge
          :color="priorityConfig[task.priority].color"
          variant="outline"
          size="xs"
        >
          {{ priorityConfig[task.priority].label }}
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
