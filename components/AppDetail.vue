<template>
  <div class="fluid card">
    <div class="content">
      <img class="right floated tiny ui image" :src="icon" @error="defaultIcon" />
      <div class="header">{{ name }}</div>
      <div class="meta">{{ category }}</div>
      <star-rating
        :rating="score"
        :read-only="true"
        :show-rating="false"
        :max-rating="5"
        :star-size="15"
      ></star-rating>
      <details v-if="moreInfo">
        <summary>{{ truncatedDescription }}</summary>
        <div class="more-info" v-html="$md.render(moreInfo)"></div>
      </details>
      <div v-else v-html="$md.render(truncatedDescription)" class="details"></div>
      <div class="extra content">
        <button
          v-if="isInstallable"
          class="ui icon positive button"
          data-tooltip="Instalar"
          data-position="bottom center"
          @click="installApp($event, name, packages)"
        >
          <i class="download icon" />
        </button>
        <button
          v-if="isRemovable"
          class="ui icon negative button"
          data-tooltip="Desinstalar"
          data-position="bottom center"
          @click="removeApp($event, name, packages)"
        >
          <i class="trash alternate icon" />
        </button>
        <button
          v-if="isPrivileged"
          class="ui icon orange button"
          data-tooltip="Instalar con privilegios"
          data-position="bottom center"
          @click="modalLogin"
        >
          <i class="hat wizard icon" />
        </button>
        <button
          v-if="!isAvailable"
          class="ui icon brown button"
          data-tooltip="Bloqueado"
          data-position="bottom center"
        >
          <i class="lock icon" />
        </button>
        <span v-if="isInstalled" class="ui blue basic tag label">Instalado</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
details,
.details {
  margin: 10px 0;
}

.more-info {
  margin: 5px;
}
</style>

<script>
import StarRating from 'vue-star-rating'
const os = require('os')
const spawn = require('child_process').spawn

export default {
  name: 'AppDetail',
  props: {
    icon: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    score: { type: Number, required: false, default: 0 },
    description: { type: String, required: false },
    level: { type: String, required: false, default: 'U' },
    packages: { type: Array, required: false }
  },
  components: {
    StarRating
  },
  computed: {
    truncatedDescription() {
      return this.description.split('\n')[0]
    },
    moreInfo() {
      let items = this.description.split('\n')
      items.shift()
      return items.join('\n')
    },
    isInstalled() {
      return (
        this.packages.length > 0 &&
        this.packages.filter(
          x => !this.$store.state.packages.installed.includes(x)
        ).length === 0
      )
    },
    isAvailable() {
      return this.packages.filter(
        x => !this.$store.state.packages.available.includes(x)
      )
    },
    isInstallable() {
      return (
        (this.level === 'U' || this.$store.state.user.isPrivileged) &&
        this.isAvailable &&
        !this.isInstalled &&
        this.packages.length > 0
      )
    },
    isRemovable() {
      return (
        this.isInstalled &&
        (this.level === 'U' || this.$store.state.user.isPrivileged)
      )
    },
    isPrivileged() {
      return (
        this.isAvailable &&
        this.level === 'A' &&
        !this.$store.state.user.isPrivileged
      )
    }
  },
  methods: {
    installApp(event, name, packages) {
      const packagesToInstall = packages.join(' ')
      let cmd

      event.srcElement.parentElement.disabled = true
      this.$toast.info(`Installing ${name}...`)

      if (os.type() === 'Linux') {
        cmd = 'LANG_ALL=C echo "y" | migasfree install ' + packagesToInstall
      } else if (os.type() === 'Window_NT') {
        cmd = 'migasfree install ' + packagesToInstall
      }

      this.$store.dispatch('run', {
        cmd,
        text: `Install ${name}`,
        element: event.srcElement.parentElement
      })
    },
    removeApp(event, name, packages) {
      const packagesToRemove = packages.join(' ')
      let cmd

      event.srcElement.parentElement.disabled = true
      this.$toast.info(`Removing ${name}...`)

      if (os.type() === 'Linux') {
        cmd = 'LANG_ALL=C echo "y" | migasfree purge ' + packagesToRemove
      } else if (os.type() === 'Window_NT') {
        cmd = 'migasfree purge ' + packagesToRemove
      }

      this.$store.dispatch('run', {
        cmd,
        text: `Remove ${name}`,
        element: event.srcElement.parentElement
      })
    },
    defaultIcon(event) {
      event.target.src = '/img/migasfree-play.svg'
    },
    modalLogin() {
      this.$modal.show('login')
    }
  }
}
</script>
