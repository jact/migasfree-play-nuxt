<template>
  <div>
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
          <div class="description" :data-tooltip="$t('info.lastSync')">
            <i class="calendar check outline icon" />
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
          <div class="description" :data-tooltip="$t('info.hardware')">
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
          <div class="description" :data-tooltip="$t('info.networkData')">
            <p>
              <i class="at icon" />
              {{ $store.state.computer.data.ip_address }}
              / {{ $store.state.computer.mask }}
              ({{ $store.state.computer.network }})
            </p>
            <p>
              <i class="exchange alternate rotated icon" />
              {{ computerMac }}
            </p>
          </div>
        </div>
      </div>

      <div class="ui horizontal centered card">
        <div class="content">
          <div class="header">
            <i class="server icon" />
            {{ $store.state.host }}
          </div>
          <div class="description" :data-tooltip="$t('info.migasfreeData')">
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

    <div id="qr" class="ui grid">
      <div class="two wide column"></div>
      <div class="three wide column bordered">
        <div class="image">
          <qrcode :value="qrCode" :options="{ width: 140, errorCorrectionLevel: 'low' }"></qrcode>
        </div>
      </div>
      <div class="nine wide column bordered">
        <div class="item">
          <div class="content">
            <div class="header">{{ $store.state.computer.name }}</div>
            <div class="description">
              <p>{{ $store.state.computer.uuid }}</p>
              <p>{{ $store.state.host }}</p>
              <p>{{ $store.state.computer.helpdesk }}</p>
            </div>
            <div class="extra">
              <button
                class="ui icon positive button right floated"
                :data-tooltip="$t('info.print')"
                data-position="top center"
                @click="printLabel"
              >
                <i class="print icon" />
              </button>
            </div>
          </div>
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

#qr {
  margin: 14px 0;
}

.three.bordered {
  border: 1px solid #000;
  border-right: 0;
}

.nine.bordered {
  border: 1px solid #000;
  border-left: 0;
}

.nine .item {
  padding-top: 18px;
}
</style>

<script>
import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
const app = require('../package.json')
const dateFormat = require('dateformat')

Vue.component(VueQrcode.name, VueQrcode)

export default {
  name: 'Info',
  components: {
    VueQrcode
  },
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
        ' ' +
        this.$t('info.disks') +
        ')'
      )
    },
    computerMac() {
      const ret = []
      let tmp = ''
      for (
        let i = 0;
        i < this.$store.state.computer.data.mac_address.length;
        i += 12
      ) {
        tmp = this.$store.state.computer.data.mac_address.substring(i, i + 12)
        ret.push(tmp.replace(/(.{2})/g, '$1:').slice(0, -1))
      }

      return ret.join(', ')
    },
    computerId() {
      return `CID-${this.$store.state.computer.cid}`
    },
    qrCode() {
      let info = {
        model: 'Computer',
        id: this.$store.state.computer.cid,
        server: this.$store.state.host
      }

      return JSON.stringify(info)
    }
  },
  methods: {
    bytesToGigas(value) {
      return (value / 1024 / 1024 / 1024).toFixed(1)
    },
    printLabel() {
      window.print()
    }
  }
}
</script>
