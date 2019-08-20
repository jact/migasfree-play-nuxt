<template>
  <div class="fluid card">
    <div class="content">
      <img
        class="right floated tiny ui image"
        :src="icon"
        :data-tooltip="connection"
        data-position="bottom center"
      />
      <div class="header">{{ name }}</div>
      <div class="meta">{{ id }}</div>
      <div class="description">{{ description }}</div>
    </div>
    <div class="extra content">
      <p>
        <span class="feature">BN</span>
        <button
          class="ui icon positive button"
          data-tooltip="Instalar"
          data-position="bottom center"
        >
          <i class="download icon"></i>
        </button>
      </p>
      <p>
        <span class="feature">Color</span>
        <button
          class="ui icon negative button"
          data-tooltip="Desinstalar"
          data-position="bottom center"
        >
          <i class="trash alternate icon"></i>
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.extra p {
  padding: 4px 0;
  line-height: 2.5em;
}

.feature {
  font-size: 120%;
  color: #000;
}

.extra p button {
  float: right;
}
</style>

<script>
export default {
  name: 'DeviceDetail',
  props: {
    icon: { type: String, required: true },
    name: { type: String, required: true },
    id: { type: String, required: true },
    connection: { type: String, required: true },
    description: { type: String, required: false }
  }
}
</script>
