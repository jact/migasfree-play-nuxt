<template>
  <Preferences />
</template>

<script>
import Preferences from '@/components/Preferences.vue'

export default {
  components: {
    Preferences
  },
  head() {
    return {
      title: this.$t('menu.preferences')
    }
  }
}
</script>
