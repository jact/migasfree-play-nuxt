<template>
  <Info />
</template>

<script>
import Info from '@/components/Info.vue'

export default {
  components: {
    Info
  },
  head() {
    return {
      title: this.$t('menu.info')
    }
  }
}
</script>
