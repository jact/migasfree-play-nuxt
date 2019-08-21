<template>
  <div class="no-print">
    <center>
      <p>
        <img src="/img/migasfree-play.svg" id="logo" />
      </p>
      <p id="app-name">{{ appName }} {{ appVersion }}</p>
      <p>{{ appDescription }}</p>
      <p>{{ appCopyright }}</p>
      <p>{{ appAuthors }}</p>
    </center>

    <div class="ui horizontal centered card">
      <div class="content">
        <div class="header">
          <i class="user icon" />
          {{ $store.state.computer.user }}
        </div>
        <div class="description" data-tooltip="Última sincronización">
          <i class="calendar check outline icon"></i>
          {{ syncEndDate }}
        </div>
      </div>
    </div>

    <div class="ui horizontal centered card">
      <div class="content">
        <div class="header">
          <i :class="computerIcon" />
          {{ $store.state.computer.data.product }}
        </div>
        <div class="description" data-tooltip="Hardware">
          <p>
            <i class="microchip icon" />
            {{ $store.state.computer.data.cpu }}
          </p>
          <p>
            <i class="memory icon" />
            {{ computerRam }}
          </p>
          <p>
            <i class="hdd icon" />
            {{ computerStorage }}
          </p>
        </div>
      </div>
    </div>

    <div class="ui horizontal centered card">
      <div class="content">
        <div class="header">
          <i class="info circle icon" />
          {{ $store.state.computer.data.fqdn }}
        </div>
        <div class="description" data-tooltip="Datos de red">
          <p>
            <i class="at icon" />
            {{ $store.state.computer.data.ip_address }}
          </p>
          <p>{{ $store.state.computer.mask }} ({{ $store.state.computer.network }})</p>
          <p>{{ computerMac }}</p>
        </div>
      </div>
    </div>

    <div class="ui horizontal centered card">
      <div class="content">
        <div class="header">
          <i class="server icon" />
          {{ $store.state.host }}
        </div>
        <div class="description" data-tooltip="Datos de migasfree">
          <p>
            <i class="sitemap icon" />
            {{ $store.state.computer.project }}
          </p>
          <p>
            <i class="hashtag icon" />
            {{ computerId }}
          </p>
          <p>
            <i class="flag icon" />
            {{ $store.state.computer.data.status }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#logo {
  width: 20%;
}

#app-name {
  font-size: 150%;
}
</style>

<script>
const app = require('../package.json')
const dateFormat = require('dateformat')

export default {
  name: 'Info',
  data() {
    return {
      appName: app.name,
      appVersion: app.version,
      appDescription: app.description,
      appAuthors: app.author,
      appCopyright: app.copyright
    }
  },
  computed: {
    syncEndDate() {
      return dateFormat(
        this.$store.state.computer.data.sync_end_date,
        'yyyy-mm-dd HH:MM:ss'
      )
    },
    computerIcon() {
      if (this.$store.state.computer.data.machine === 'P') return 'laptop icon'
      else return 'dice d6 icon'
    },
    computerRam() {
      return this.bytesToGigas(this.$store.state.computer.data.ram) + ' GB RAM'
    },
    computerStorage() {
      return (
        this.bytesToGigas(this.$store.state.computer.data.storage) +
        ' GB (' +
        this.$store.state.computer.data.disks +
        ' Disks)'
      )
    },
    computerMac() {
      return this.$store.state.computer.data.mac_address
        .replace(/(.{2})/g, '$1:')
        .slice(0, -1)
    },
    computerId() {
      return `CID-${this.$store.state.computer.cid}`
    }
  },
  methods: {
    bytesToGigas(value) {
      return (value / 1024 / 1024 / 1024).toFixed(1)
    }
  }
}
</script>
