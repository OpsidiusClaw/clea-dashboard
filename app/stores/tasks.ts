import { defineStore } from 'pinia'

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Project {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  projectId: string
  assignee: string
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  message: string
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const projects = ref<Project[]>([])
  const activities = ref<Activity[]>([])
  const selectedProjectId = ref<string | null>(null)
  const loading = ref(false)

  const filteredTasks = computed(() => {
    if (!selectedProjectId.value) return tasks.value
    return tasks.value.filter(t => t.projectId === selectedProjectId.value)
  })

  const tasksByStatus = computed(() => {
    const statuses: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'done']
    return statuses.reduce((acc, status) => {
      acc[status] = filteredTasks.value.filter(t => t.status === status)
      return acc
    }, {} as Record<TaskStatus, Task[]>)
  })

  const metrics = computed(() => ({
    total: filteredTasks.value.length,
    done: filteredTasks.value.filter(t => t.status === 'done').length,
    inProgress: filteredTasks.value.filter(t => t.status === 'in_progress').length,
    todo: filteredTasks.value.filter(t => t.status === 'todo').length,
    backlog: filteredTasks.value.filter(t => t.status === 'backlog').length,
  }))

  async function fetchTasks() {
    loading.value = true
    try {
      const data = await $fetch('/api/tasks')
      tasks.value = data.tasks
      projects.value = data.projects
      activities.value = data.activities
    } catch (e) {
      console.error('Erreur lors du chargement des tâches:', e)
    } finally {
      loading.value = false
    }
  }

  async function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newTask = await $fetch('/api/tasks', {
        method: 'POST',
        body: { action: 'add', task },
      })
      tasks.value.push(newTask as Task)
    } catch (e) {
      console.error('Erreur lors de l\'ajout:', e)
    }
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    try {
      const updated = await $fetch('/api/tasks', {
        method: 'POST',
        body: { action: 'update', id, updates },
      })
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) tasks.value[index] = updated as Task
    } catch (e) {
      console.error('Erreur lors de la mise à jour:', e)
    }
  }

  async function deleteTask(id: string) {
    try {
      await $fetch('/api/tasks', {
        method: 'POST',
        body: { action: 'delete', id },
      })
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (e) {
      console.error('Erreur lors de la suppression:', e)
    }
  }

  function moveTask(taskId: string, newStatus: TaskStatus) {
    updateTask(taskId, { status: newStatus })
  }

  function selectProject(projectId: string | null) {
    selectedProjectId.value = projectId
  }

  return {
    tasks,
    projects,
    activities,
    selectedProjectId,
    loading,
    filteredTasks,
    tasksByStatus,
    metrics,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    selectProject,
  }
})
