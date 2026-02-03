import { defineStore } from 'pinia'
import tasksData from '~/data/tasks.json'

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
  const tasks = ref<Task[]>(tasksData.tasks as Task[])
  const projects = ref<Project[]>(tasksData.projects as Project[])
  const activities = ref<Activity[]>(tasksData.activities as Activity[])
  const selectedProjectId = ref<string | null>(null)

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

  function moveTask(taskId: string, newStatus: TaskStatus) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = newStatus
      task.updatedAt = new Date().toISOString()
    }
  }

  function selectProject(projectId: string | null) {
    selectedProjectId.value = projectId
  }

  return {
    tasks,
    projects,
    activities,
    selectedProjectId,
    filteredTasks,
    tasksByStatus,
    metrics,
    moveTask,
    selectProject,
  }
})
