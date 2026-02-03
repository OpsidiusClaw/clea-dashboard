<script setup lang="ts">
import type { Task, TaskStatus, Priority } from '~/stores/tasks'

const store = useTasksStore()

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ task: Task | null }>()

const form = reactive({
  title: '',
  description: '',
  status: 'todo' as TaskStatus,
  priority: 'medium' as Priority,
  projectId: '',
  assignee: '',
})

const statusOptions = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'À faire', value: 'todo' },
  { label: 'En cours', value: 'in_progress' },
  { label: 'Terminé', value: 'done' },
]

const priorityOptions = [
  { label: 'Basse', value: 'low' },
  { label: 'Moyenne', value: 'medium' },
  { label: 'Haute', value: 'high' },
]

const projectOptions = computed(() =>
  store.projects.map(p => ({ label: p.name, value: p.id }))
)

watch(() => props.task, (task) => {
  if (task) {
    form.title = task.title
    form.description = task.description
    form.status = task.status
    form.priority = task.priority
    form.projectId = task.projectId
    form.assignee = task.assignee
  }
}, { immediate: true })

async function submit() {
  if (!props.task || !form.title.trim()) return
  await store.updateTask(props.task.id, { ...form })
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open">
    <template #header>
      <h3 class="text-lg font-semibold">Modifier la tâche</h3>
    </template>
    <template #body>
      <div class="space-y-4">
        <UFormField label="Titre">
          <UInput v-model="form.title" placeholder="Titre de la tâche" class="w-full" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea v-model="form.description" placeholder="Description" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Statut">
            <USelectMenu v-model="form.status" :items="statusOptions" value-key="value" class="w-full" />
          </UFormField>
          <UFormField label="Priorité">
            <USelectMenu v-model="form.priority" :items="priorityOptions" value-key="value" class="w-full" />
          </UFormField>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Projet">
            <USelectMenu v-model="form.projectId" :items="projectOptions" value-key="value" class="w-full" />
          </UFormField>
          <UFormField label="Assigné à">
            <UInput v-model="form.assignee" class="w-full" />
          </UFormField>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="open = false">Annuler</UButton>
        <UButton color="primary" :disabled="!form.title.trim()" @click="submit">Sauvegarder</UButton>
      </div>
    </template>
  </UModal>
</template>
