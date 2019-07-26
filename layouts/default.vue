<template>
  <div id="app">
    <div id="nav">
      <Menu :computer="$store.state.computer.name" :computerLink="$store.state.computer.link" />
    </div>

    <div id="main">
      <nuxt />
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
</style>

<script>
import Menu from '@/components/Menu.vue'

export default {
  components: {
    Menu
  }
}
</script>
