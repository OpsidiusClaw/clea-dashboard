import type { Pinia } from 'pinia'

export default defineNuxtPlugin(({ $pinia }) => {
  const pinia = $pinia as Pinia

  pinia.use(({ store }) => {
    const storageKey = `pinia-${store.$id}`

    // Charger les données depuis localStorage au démarrage
    if (import.meta.client) {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          const data = JSON.parse(saved)
          store.$patch(data)
        } catch (e) {
          console.warn(`Erreur lors du chargement de ${storageKey}:`, e)
        }
      }
    }

    // Sauvegarder à chaque mutation
    store.$subscribe((_mutation, state) => {
      if (import.meta.client) {
        localStorage.setItem(storageKey, JSON.stringify(state))
      }
    })
  })
})
