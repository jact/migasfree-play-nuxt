<template>
  <div class="ui two column centered grid">
    <div class="column">
      <keep-alive>
        <el-form
          ref="form"
          @submit.prevent
        >
          <div class="field">
            <el-input
              :placeholder="$t('devices.filter.search')"
              v-model="searchDevice"
              @input="setSearchDevice"
              clearable
              prefix-icon="el-icon-search"
            />
          </div>
          <div class="inline field">
            <el-switch
              v-model="onlyAssignedDevices"
              :active-text="$t('devices.filter.assigned')"
              :inactive-text="$t('devices.filter.all')"
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
  mounted() {
    this.searchDevice = this.$store.state.filters.searchDevice
    this.onlyAssignedDevices = this.$store.state.filters.onlyAssignedDevices
  },
  methods: {
    setSearchDevice() {
      this.$store.commit('filters/setSearchDevice', this.searchDevice)
    },
    setOnlyAssignedDevices() {
      this.$store.commit(
        'filters/setOnlyAssignedDevices',
        this.onlyAssignedDevices
      )
    }
  }
}
</script>
