<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTasksStore, type TaskStatus, type Priority } from '~/stores/tasks'

const store = useTasksStore()
const isOpen = ref(false)

const newTask = ref({
  title: '',
  description: '',
  projectId: '',
  priority: 'medium' as Priority,
  status: 'todo' as TaskStatus,
})

const canSubmit = computed(() => newTask.value.title.trim().length > 0)

function resetForm() {
  newTask.value = {
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    status: 'todo',
  }
}

function handleSubmit() {
  if (!canSubmit.value) return
  
  store.addTask({
    title: newTask.value.title,
    description: newTask.value.description,
    projectId: newTask.value.projectId || 'clea-core',
    priority: newTask.value.priority,
    status: newTask.value.status,
  })
  
  resetForm()
  isOpen.value = false
}

function openModal() {
  resetForm()
  isOpen.value = true
}

defineExpose({ openModal })
</script>

<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-lg' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Nouvelle tâche</h3>
          <UButton color="gray" variant="ghost" icon="i-lucide-x" @click="isOpen = false" />
        </div>
      </template>

      <UForm class="space-y-4" @submit="handleSubmit">
        <UFormGroup label="Titre" required>
          <UInput v-model="newTask.title" placeholder="Nom de la tâche..." />
        </UFormGroup>

        <UFormGroup label="Description">
          <UTextarea v-model="newTask.description" placeholder="Description détaillée..." :rows="3" />
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Projet">
            <USelect v-model="newTask.projectId" :options="[
              { label: 'Sélectionner...', value: '' },
              ...store.projects.map(p => ({ label: p.name, value: p.id }))
            ]" />
          </UFormGroup>

          <UFormGroup label="Priorité">
            <USelect v-model="newTask.priority" :options="[
              { label: 'Basse', value: 'low' },
              { label: 'Moyenne', value: 'medium' },
              { label: 'Haute', value: 'high' },
            ]" />
          </UFormGroup>
        </div>

        <UFormGroup label="Statut">
          <USelect v-model="newTask.status" :options="[
            { label: 'Backlog', value: 'backlog' },
            { label: 'À faire', value: 'todo' },
            { label: 'En cours', value: 'in_progress' },
            { label: 'Terminé', value: 'done' },
          ]" />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" label="Annuler" @click="isOpen = false" />
          <UButton color="primary" label="Créer la tâche" :disabled="!canSubmit" @click="handleSubmit" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
