<template>
  <div class="ui two column centered grid">
    <div class="column">
      <form class="ui form">
        <div class="field">
          <select @change="setLanguage" v-model="language">
            <option
              v-for="item in languages"
              :key="item.code"
              :value="item.code"
              :selected="item.code === $store.state.preferences.language"
            >{{ item.name }}</option>
          </select>
        </div>
        <div class="inline field">
          <el-switch
            v-model="showSyncDetails"
            active-text="Mostrar detalles al sincronizar"
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
      languages: [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' }
      ],
      showSyncDetails: this.$store.state.preferences.showSyncDetails
    }
  },
  methods: {
    setLanguage() {
      this.$store.commit('setLanguage', this.language)
      this.$store.dispatch('savePreferences')
    },
    setShowSyncDetails(value) {
      this.$store.commit('setShowSyncDetails', value)
      this.showSyncDetails = this.$store.state.preferences.showSyncDetails
      this.$store.dispatch('savePreferences')
    }
  }
}
</script>
