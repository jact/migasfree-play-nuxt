<template>
  <div class="ui two column centered grid">
    <div class="column">
      <form class="ui form">
        <div class="field">
          <select @change="setLanguage" v-model="language">
            <option
              v-for="item in availableLocales"
              :key="item.code"
              :value="item.code"
              :selected="item.code === $store.state.preferences.language"
            >{{ item.name }}</option>
          </select>
        </div>
        <div class="inline field">
          <el-switch
            v-model="showSyncDetails"
            :active-text="$t('preferences.showSyncDetails')"
            @change="setShowSyncDetails"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Preferences',
  data() {
    return {
      language: this.$store.state.preferences.language,
      showSyncDetails: this.$store.state.preferences.showSyncDetails
    }
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales
    }
  },
  methods: {
    setLanguage() {
      this.$store.commit('preferences/setLanguage', this.language)
      this.$store.dispatch('preferences/savePreferences')
      this.switchLocalePath(this.language)
    },
    setShowSyncDetails(value) {
      this.$store.commit('preferences/setShowSyncDetails', value)
      this.showSyncDetails = this.$store.state.preferences.showSyncDetails
      this.$store.dispatch('preferences/savePreferences')
    }
  }
}
</script>
