<script setup lang="ts">
const store = useTasksStore()

const sortedActivities = computed(() =>
  [...store.activities].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
)

const iconMap: Record<string, string> = {
  success: 'i-lucide-circle-check',
  info: 'i-lucide-info',
  warning: 'i-lucide-triangle-alert',
  error: 'i-lucide-circle-x',
}

const colorMap: Record<string, string> = {
  success: 'text-green-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-activity" />
        <h3 class="font-semibold">Activité récente</h3>
      </div>
    </template>

    <div class="space-y-4">
      <div
        v-for="activity in sortedActivities"
        :key="activity.id"
        class="flex items-start gap-3"
      >
        <UIcon
          :name="iconMap[activity.type]"
          :class="colorMap[activity.type]"
          class="mt-0.5 text-lg flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm">{{ activity.message }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">
            {{ formatDate(activity.timestamp) }}
          </p>
        </div>
      </div>
    </div>
  </UCard>
</template>
