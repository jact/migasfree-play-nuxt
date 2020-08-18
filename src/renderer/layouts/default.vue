<template>
  <div id="app">
    <div id="nav">
      <Menu
        :computer="$store.state.computer.name"
        :computer-link="$store.state.computer.link"
      />
    </div>

    <div id="main">
      <nuxt />
      <button
        id="sync"
        ref="sync"
        class="ui circular positive icon button"
        :data-tooltip="$t('sync.action')"
        data-position="top center"
        @click="synchronize($event)"
      >
        <i class="play icon" />
      </button>
      <Login />
    </div>
  </div>
</template>

<style scoped>
#main {
  top: 5em;
  position: absolute;
  margin: 0 2%;
  width: 96%;
}

#sync {
  position: fixed;
  bottom: 30px;
  right: 30px;
  font-size: 150%;
}
</style>

<script>
import Menu from '@/components/Menu.vue'
import Login from '@/components/Login.vue'
import { setInterval } from 'timers'
const { remote } = require('electron')

export default {
  components: {
    Menu,
    Login
  },
  mounted() {
    if (remote.process.argv[1] === 'sync') {
      this.$refs.sync.click()
      setInterval(this.$refs.sync.click(), 24 * 60 * 60 * 1000)
    }
  },
  methods: {
    synchronize(event) {
      event.srcElement.parentElement.disabled = true
      this.$toast.info(this.$t('sync.doing'))

      if (this.$store.state.preferences.showSyncDetails)
        this.$router.push('/details')

      this.$store.dispatch('executions/run', {
        cmd: 'migasfree sync',
        text: this.$t('sync.name'),
        element: event.srcElement.parentElement
      })
    }
  },
  head: {
    titleTemplate: '%s - Migasfree Play'
  }
}
</script>
