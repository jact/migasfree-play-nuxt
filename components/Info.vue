<template>
  <div class="no-print">
    <center>
      <p>
        <img src="/img/migasfree-play.svg" id="logo" />
      </p>

      <p>{{ appName }} {{ appVersion }}</p>

      <p>{{ appDescription }}</p>

      <p>{{ appAuthors }}</p>
    </center>
  </div>
</template>

<style scoped>
#logo {
  width: 20%;
}
</style>

<script>
const app = require('../package.json')

export default {
  name: 'Info',
  data() {
    return {
      appName: app.name,
      appVersion: app.version,
      appDescription: app.description,
      appAuthors: app.author
    }
  }
}
</script>
