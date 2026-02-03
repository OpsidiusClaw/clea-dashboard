<script setup lang="ts">
const store = useTasksStore()

const items = computed(() => [
  { label: 'Tous les projets', value: null },
  ...store.projects.map(p => ({ label: p.name, value: p.id })),
])

const selected = ref(items.value[0])

watch(selected, (val) => {
  store.selectProject(val.value)
})
</script>

<template>
  <USelectMenu
    v-model="selected"
    :items="items"
    value-key="value"
    class="w-56"
  />
</template>
