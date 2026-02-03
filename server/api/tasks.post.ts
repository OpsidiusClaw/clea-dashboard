import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

function readDb() {
  const dbPath = resolve(process.cwd(), 'data/db.json')
  const raw = readFileSync(dbPath, 'utf-8')
  return JSON.parse(raw)
}

function writeDb(db: any) {
  const dbPath = resolve(process.cwd(), 'data/db.json')
  writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = readDb()

  if (body.action === 'add') {
    const now = new Date().toISOString()
    const maxId = db.tasks.reduce((max: number, t: any) => Math.max(max, parseInt(t.id) || 0), 0)
    const newTask = {
      id: String(maxId + 1),
      ...body.task,
      createdAt: now,
      updatedAt: now,
    }
    db.tasks.push(newTask)
    db.activities.unshift({
      id: `a${Date.now()}`,
      message: `Tâche "${newTask.title}" ajoutée`,
      timestamp: now,
      type: 'success',
    })
    writeDb(db)
    return newTask
  }

  if (body.action === 'update') {
    const index = db.tasks.findIndex((t: any) => t.id === body.id)
    if (index === -1) throw createError({ statusCode: 404, message: 'Tâche non trouvée' })
    const now = new Date().toISOString()
    db.tasks[index] = { ...db.tasks[index], ...body.updates, updatedAt: now }
    db.activities.unshift({
      id: `a${Date.now()}`,
      message: `Tâche "${db.tasks[index].title}" mise à jour`,
      timestamp: now,
      type: 'info',
    })
    writeDb(db)
    return db.tasks[index]
  }

  if (body.action === 'delete') {
    const index = db.tasks.findIndex((t: any) => t.id === body.id)
    if (index === -1) throw createError({ statusCode: 404, message: 'Tâche non trouvée' })
    const deleted = db.tasks.splice(index, 1)[0]
    const now = new Date().toISOString()
    db.activities.unshift({
      id: `a${Date.now()}`,
      message: `Tâche "${deleted.title}" supprimée`,
      timestamp: now,
      type: 'warning',
    })
    writeDb(db)
    return { success: true }
  }

  throw createError({ statusCode: 400, message: 'Action non reconnue' })
})
