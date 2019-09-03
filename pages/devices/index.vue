<template>
  <Devices />
</template>

<script>
import Devices from '@/components/Devices.vue'

export default {
  components: {
    Devices
  },
  head() {
    return {
      title: 'Dispositivos'
    }
  }
}
</script>
