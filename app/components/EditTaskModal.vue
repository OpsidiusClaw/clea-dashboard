<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTasksStore, type TaskStatus, type Priority } from '~/stores/tasks'

const props = defineProps<{
  taskId: string | null
}>()

const store = useTasksStore()
const isOpen = ref(false)

const editedTask = ref({
  title: '',
  description: '',
  projectId: '',
  priority: 'medium' as Priority,
  status: 'todo' as TaskStatus,
})

const originalTask = computed(() => 
  store.tasks.find(t => t.id === props.taskId)
)

const canSubmit = computed(() => editedTask.value.title.trim().length > 0)

watch(() => props.taskId, (newId) => {
  if (newId && originalTask.value) {
    editedTask.value = {
      title: originalTask.value.title,
      description: originalTask.value.description,
      projectId: originalTask.value.projectId,
      priority: originalTask.value.priority,
      status: originalTask.value.status,
    }
    isOpen.value = true
  }
}, { immediate: true })

function handleSubmit() {
  if (!canSubmit.value || !props.taskId) return
  
  store.updateTask(props.taskId, {
    title: editedTask.value.title,
    description: editedTask.value.description,
    projectId: editedTask.value.projectId,
    priority: editedTask.value.priority,
    status: editedTask.value.status,
  })
  
  isOpen.value = false
}

function handleDelete() {
  if (!props.taskId) return
  
  if (confirm('Supprimer cette tâche ?')) {
    store.deleteTask(props.taskId)
    isOpen.value = false
  }
}

defineExpose({ isOpen })
</script>

<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-lg' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Modifier la tâche</h3>
          <UButton color="gray" variant="ghost" icon="i-lucide-x" @click="isOpen = false" />
        </div>
      </template>

      <UForm class="space-y-4" @submit="handleSubmit">
        <UFormGroup label="Titre" required>
          <UInput v-model="editedTask.title" placeholder="Nom de la tâche..." />
        </UFormGroup>

        <UFormGroup label="Description">
          <UTextarea v-model="editedTask.description" placeholder="Description détaillée..." :rows="3" />
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Projet">
            <USelect v-model="editedTask.projectId" :options="[
              { label: 'Sélectionner...', value: '' },
              ...store.projects.map(p => ({ label: p.name, value: p.id }))
            ]" />
          </UFormGroup>

          <UFormGroup label="Priorité">
            <USelect v-model="editedTask.priority" :options="[
              { label: 'Basse', value: 'low' },
              { label: 'Moyenne', value: 'medium' },
              { label: 'Haute', value: 'high' },
            ]" />
          </UFormGroup>
        </div>

        <UFormGroup label="Statut">
          <USelect v-model="editedTask.status" :options="[
            { label: 'Backlog', value: 'backlog' },
            { label: 'À faire', value: 'todo' },
            { label: 'En cours', value: 'in_progress' },
            { label: 'Terminé', value: 'done' },
          ]" />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div class="flex justify-between">
          <UButton color="red" variant="ghost" icon="i-lucide-trash-2" label="Supprimer" @click="handleDelete" />
          <div class="flex gap-2">
            <UButton color="gray" variant="ghost" label="Annuler" @click="isOpen = false" />
            <UButton color="primary" label="Enregistrer" :disabled="!canSubmit" @click="handleSubmit" />
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
