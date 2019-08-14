<template>
  <div class="ui two column centered grid">
    <div class="column">
      <form class="ui form">
        <div class="field">
          <select>
            <option v-for="item in languages" :key="item.code" :value="item.code">{{ item.name }}</option>
          </select>
        </div>
        <div class="inline field">
          <el-switch
            v-model="showDetails"
            active-text="Mostrar detalles al sincronizar"
            @change="setShowDetails"
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
      languages: [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' }
      ],
      showDetails: false
    }
  },
  methods: {
    setShowDetails(value) {
      this.showDetails = value
    }
  }
}
</script>
