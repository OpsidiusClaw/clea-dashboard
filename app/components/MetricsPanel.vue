<script setup lang="ts">
const store = useTasksStore()

const cards = computed(() => [
  { label: 'Total', value: store.metrics.total, icon: 'i-lucide-layers', color: 'primary' as const },
  { label: 'En cours', value: store.metrics.inProgress, icon: 'i-lucide-loader', color: 'warning' as const },
  { label: 'À faire', value: store.metrics.todo, icon: 'i-lucide-circle-dot', color: 'info' as const },
  { label: 'Terminées', value: store.metrics.done, icon: 'i-lucide-circle-check', color: 'success' as const },
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <UCard v-for="card in cards" :key="card.label">
      <div class="flex items-center gap-3">
        <UIcon :name="card.icon" class="text-2xl" :class="`text-${card.color}-500`" />
        <div>
          <p class="text-2xl font-bold">{{ card.value }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ card.label }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>
