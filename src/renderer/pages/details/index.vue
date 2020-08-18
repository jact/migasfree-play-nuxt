<template>
  <Executions />
</template>

<script>
import Executions from '@/components/Executions.vue'

export default {
  components: {
    Executions
  },
  head() {
    return {
      title: this.$t('menu.details')
    }
  }
}
</script>
