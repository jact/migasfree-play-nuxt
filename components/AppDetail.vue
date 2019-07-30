<template>
  <div class="fluid card">
    <div class="content">
      <img class="right floated tiny ui image" :src="icon" />
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
          v-if="level === 'U' && isAvailable && !isInstalled && packages.length > 0"
          class="ui icon positive button"
          data-tooltip="Instalar"
          data-position="bottom center"
          @click="installApp(name, packages)"
        >
          <i class="download icon"></i>
        </button>
        <button
          v-if="isInstalled"
          class="ui icon negative button"
          data-tooltip="Desinstalar"
          data-position="bottom center"
          @click="removeApp(name, packages)"
        >
          <i class="trash alternate icon"></i>
        </button>
        <button
          v-if="isAvailable && level == 'A'"
          class="ui icon orange button"
          data-tooltip="Instalar con privilegios"
          data-position="bottom center"
        >
          <i class="hat wizard icon"></i>
        </button>
        <button
          v-if="!isAvailable"
          class="ui icon brown button"
          data-tooltip="Bloqueado"
          data-position="bottom center"
        >
          <i class="lock icon"></i>
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
    }
  },
  methods: {
    installApp(name, packages) {
      console.log(name, packages)
      this.$toast.info('probando...')
    },
    removeApp(name, packages) {
      console.log(name, packages)
    }
  }
}
</script>
