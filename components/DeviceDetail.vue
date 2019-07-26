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
    <div class="extra content"></div>
  </div>
</template>

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
