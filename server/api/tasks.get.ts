import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler(() => {
  const dbPath = resolve(process.cwd(), 'data/db.json')
  const raw = readFileSync(dbPath, 'utf-8')
  const db = JSON.parse(raw)
  return {
    tasks: db.tasks,
    projects: db.projects,
    activities: db.activities,
  }
})
