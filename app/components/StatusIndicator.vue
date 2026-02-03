<script setup lang="ts">
const statuses = [
  { label: 'Actif', icon: 'i-lucide-circle-check', color: 'success' as const },
  { label: 'En réflexion', icon: 'i-lucide-brain', color: 'warning' as const },
  { label: 'En veille', icon: 'i-lucide-moon', color: 'neutral' as const },
]

const currentStatus = ref(0)

onMounted(() => {
  setInterval(() => {
    currentStatus.value = Math.random() > 0.3 ? 0 : 1
  }, 8000)
})
</script>

<template>
  <div class="flex items-center gap-2">
    <UBadge
      :color="statuses[currentStatus].color"
      variant="subtle"
      size="lg"
    >
      <UIcon :name="statuses[currentStatus].icon" class="mr-1" />
      Cléa — {{ statuses[currentStatus].label }}
    </UBadge>
  </div>
</template>
