<script setup lang="ts">
const store = useTasksStore()

const columns = computed(() => [
  { key: 'backlog' as const, title: 'Backlog', color: 'bg-gray-400' },
  { key: 'todo' as const, title: 'À faire', color: 'bg-blue-500' },
  { key: 'in_progress' as const, title: 'En cours', color: 'bg-yellow-500' },
  { key: 'done' as const, title: 'Terminé', color: 'bg-green-500' },
])
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-4">
    <KanbanColumn
      v-for="col in columns"
      :key="col.key"
      :title="col.title"
      :tasks="store.tasksByStatus[col.key]"
      :color="col.color"
    />
  </div>
</template>
