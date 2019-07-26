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
      <div v-html="$md.render(description)"></div>
    </div>
    <div class="extra content">
      <button class="ui icon positive button" data-tooltip="Instalar" data-position="bottom center">
        <i class="download icon"></i>
      </button>
      <button
        class="ui icon negative button"
        data-tooltip="Desinstalar"
        data-position="bottom center"
      >
        <i class="trash alternate icon"></i>
      </button>
      <button
        class="ui icon orange button"
        data-tooltip="Instalar con privilegios"
        data-position="bottom center"
      >
        <i class="hat wizard icon"></i>
      </button>
      <button class="ui icon brown button" data-tooltip="Bloqueado" data-position="bottom center">
        <i class="lock icon"></i>
      </button>
      <span class="ui blue basic tag label">Instalado</span>
    </div>
  </div>
</template>

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
    level: { type: String, required: false, default: 'U' }
  },
  components: {
    StarRating
  }
}
</script>
