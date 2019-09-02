<template>
  <div class="fluid card">
    <div class="content">
      <img class="right floated tiny ui image" :src="icon" />
      <div class="header" :data-tooltip="tooltip" data-position="bottom left">{{ name }}</div>
      <div class="meta">{{ id }}</div>
      <div class="description">{{ description }}</div>
    </div>
    <div class="extra content" v-if="logical">
      <p v-for="item in visibleLogicalDevices" :key="item.id">
        <span class="feature">{{ featureName(item) }}</span>
        <template v-if="isAssigned(item.id)">
          <span class="ui blue basic tag label">Asignado</span>
          <button
            class="ui icon negative button right floated"
            data-tooltip="Desinstalar"
            data-position="bottom center"
            @click="removeDevice(item)"
          >
            <i class="trash alternate icon" />
          </button>
        </template>
        <button
          v-else
          class="ui icon positive button right floated"
          data-tooltip="Instalar"
          data-position="bottom center"
          @click="installDevice(item)"
        >
          <i class="download icon" />
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.extra p {
  padding: 4px 0;
  line-height: 2.5em;
}

.feature {
  font-size: 120%;
  color: #000;
}
</style>

<script>
export default {
  name: 'DeviceDetail',
  props: {
    icon: { type: String, required: true },
    name: { type: String, required: true },
    id: { type: String, required: true },
    connection: { type: String, required: true },
    description: { type: String, required: false },
    ip: { type: String, required: false },
    logical: { type: Array, required: false }
  },
  computed: {
    tooltip() {
      if (this.ip) return `${this.connection} (${this.ip})`
      else return this.connection
    },
    visibleLogicalDevices() {
      if (!this.$store.state.filters.onlyAssignedDevices) return this.logical
      else
        return this.logical.filter(item => {
          return this.isAssigned(item.id)
        })
    }
  },
  methods: {
    featureName(item) {
      if (item.alternative_feature_name) return item.alternative_feature_name
      else return item.feature.name
    },
    isAssigned(id) {
      return (
        this.$store.state.devices.assigned.find(item => {
          return item.id === id
        }) ||
        this.$store.state.devices.inflicted.find(item => {
          return item.id === id
        })
      )
    },
    installDevice(item) {
      let attributes = item.attributes
      if (!attributes.includes(this.$store.state.computer.attribute)) {
        attributes.push(this.$store.state.computer.attribute)
      }
      this.$store.dispatch('changeDeviceAttributes', {
        id: item.id,
        attributes
      })
    },
    removeDevice(item) {
      let attributes = item.attributes
      attributes = attributes.filter(x => {
        return x !== this.$store.state.computer.attribute
      })
      this.$store.dispatch('changeDeviceAttributes', {
        id: item.id,
        attributes
      })
    }
  }
}
</script>
