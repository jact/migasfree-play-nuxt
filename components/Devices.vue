<template>
  <div>
    <DeviceFilter />
    <div class="ui stackable cards">
      <DeviceDetail
        v-for="item in devicesByFilter"
        :key="item.id"
        :icon="icon(item.connection.name)"
        :name="name(item)"
        :id="item.name"
        :connection="item.connection.name"
        :description="description(item.data)"
        :ip="ipAddress(item.data)"
        :logical="item.logical"
      />
    </div>
  </div>
</template>

<script>
import DeviceFilter from '@/components/DeviceFilter.vue'
import DeviceDetail from '@/components/DeviceDetail.vue'

export default {
  name: 'Devices',
  components: {
    DeviceFilter,
    DeviceDetail
  },
  data() {
    return {
      devices: []
    }
  },
  computed: {
    devicesByFilter() {
      let results = this.devices

      if (this.$store.state.filters.searchDevice)
        results = results.filter(
          device =>
            device.model.name
              .toLowerCase()
              .includes(this.$store.state.filters.searchDevice) ||
            JSON.parse(device.data)
              .NAME.toLowerCase()
              .includes(this.$store.state.filters.searchDevice)
        )

      if (this.$store.state.filters.onlyAssignedDevices)
        results = results.filter(
          device =>
            this.$store.state.devices.assigned.filter(x => {
              console.log(x, x.device.id, device.id)
              x.device.id === device.id
            }).length === 0
        ) // FIXME

      return results
    }
  },
  methods: {
    name(item) {
      let data = JSON.parse(item.data)
      if (data.NAME) return data.NAME
      else return `${item.model.manufacturer.name} ${item.model.name}`
    },
    icon(connection) {
      if (connection === 'TCP') return '/img/printer-net.png'
      else return '/img/printer-local.png'
    },
    ipAddress(value) {
      let data = JSON.parse(value)
      return data.IP || ''
    },
    description(value) {
      let data = JSON.parse(value)
      return data.LOCATION || ''
    }
  },
  mounted() {
    this.devices = this.$store.state.devices.available
  }
}
</script>
