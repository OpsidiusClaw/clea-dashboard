<script setup lang="ts">
import { ref } from 'vue'
import { useTasksStore, type Task } from '~/stores/tasks'

const store = useTasksStore()
const addTaskModalRef = ref<InstanceType<typeof AddTaskModal>>()
const editingTaskId = ref<string | null>(null)

function openAddTaskModal() {
  addTaskModalRef.value?.openModal()
}

function handleEditTask(task: Task) {
  editingTaskId.value = task.id
}

function handleDeleteTask(taskId: string) {
  if (confirm('Supprimer cette tâche ?')) {
    store.deleteTask(taskId)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Cléa Dashboard
            </h1>
            <StatusIndicator />
          </div>
          <div class="flex items-center gap-3">
            <UButton
              icon="i-lucide-plus"
              label="Nouvelle tâche"
              color="primary"
              @click="openAddTaskModal"
            />
            <ProjectSelector />
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <MetricsPanel />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <KanbanBoard @edit-task="handleEditTask" @delete-task="handleDeleteTask" />
        </div>
        <div>
          <Timeline />
        </div>
      </div>
    </main>

    <!-- Modals -->
    <AddTaskModal ref="addTaskModalRef" />
    <EditTaskModal :task-id="editingTaskId" />
  </div>
</template>
