<template>
  <Apps />
</template>

<script>
import Apps from '@/components/Apps.vue'

export default {
  components: {
    Apps
  },
  head() {
    return {
      title: 'Aplicaciones'
    }
  }
}
</script>
