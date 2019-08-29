<template>
  <div class="ui two column centered grid">
    <div class="column">
      <keep-alive>
        <el-form ref="form" @submit.prevent>
          <div class="field">
            <el-input
              placeholder="buscar"
              v-model="searchDevice"
              @input="setSearchDevice"
              clearable
              prefix-icon="el-icon-search"
            ></el-input>
          </div>
          <div class="inline field">
            <el-switch
              v-model="onlyAssignedDevices"
              active-text="Dispositivos asignados"
              inactive-text="Todos los disponibles"
              @change="setOnlyAssignedDevices"
            />
          </div>
        </el-form>
      </keep-alive>
    </div>
  </div>
</template>

<style scoped>
.field {
  margin: 10px 0;
}
</style>

<script>
export default {
  name: 'DeviceFilter',
  data() {
    return {
      searchDevice: '',
      onlyAssignedDevices: false
    }
  },
  methods: {
    setSearchDevice() {
      this.$store.commit('setSearchDevice', this.searchDevice)
    },
    setOnlyAssignedDevices() {
      this.$store.commit('setOnlyAssignedDevices', this.onlyAssignedDevices)
    }
  }
}
</script>
