<template>
  <div class="ui two column centered grid">
    <div class="column">
      <form class="ui form">
        <div class="field">
          <select>
            <option
              v-for="item in languages"
              :key="item.code"
              :value="item.code"
              >{{ item.name }}</option
            >
          </select>
        </div>
        <div class="inline field">
          <div class="ui toggle checkbox">
            <input type="checkbox" tabindex="0" class="hidden" />
            <label>Mostrar detalles al sincronizar</label>
          </div>
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
      ]
    }
  },
  created() {},
  methods: {},
  mounted() {
    // document.querySelectorAll('.checkbox').checkbox()
  }
}
</script>
