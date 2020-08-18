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
      title: this.$t('menu.devices')
    }
  }
}
</script>
