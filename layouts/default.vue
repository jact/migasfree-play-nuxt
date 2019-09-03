<template>
  <div id="app">
    <div id="nav">
      <Menu :computer="$store.state.computer.name" :computerLink="$store.state.computer.link" />
    </div>

    <div id="main">
      <nuxt />
      <button
        id="sync"
        class="ui circular positive icon button"
        data-tooltip="Sincronizar equipo"
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

export default {
  components: {
    Menu,
    Login
  },
  methods: {
    synchronize(event) {
      event.srcElement.parentElement.disabled = true
      this.$toast.info('Sincronizando...')

      if (this.$store.state.preferences.showSyncDetails)
        this.$router.push('/details')

      this.$store.dispatch('run', {
        cmd: 'migasfree sync',
        text: 'Synchronization',
        element: event.srcElement.parentElement
      })
    }
  },
  head: {
    titleTemplate: '%s - Migasfree Play'
  }
}
</script>
