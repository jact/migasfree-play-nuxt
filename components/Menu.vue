<template>
  <div class="ui teal inverted borderless top fixed menu">
    <a class="header item" :href="computerLink">
      <span class="ui big text">{{ computer }}</span>
    </a>
    <div class="right menu">
      <router-link
        to="/apps"
        class="item"
        data-tooltip="Apps"
        data-position="bottom center"
      >
        <i class="large th icon"></i>
      </router-link>
      <router-link
        to="/devices"
        class="item"
        data-tooltip="Devices"
        data-position="bottom center"
      >
        <i class="large print icon"></i>
      </router-link>
      <router-link
        to="/details"
        class="item"
        data-tooltip="Details"
        data-position="bottom center"
      >
        <i class="large tasks icon"></i>
      </router-link>
      <router-link
        to="/preferences"
        class="item"
        data-tooltip="Preferences"
        data-position="bottom center"
      >
        <i class="large cog icon"></i>
      </router-link>
      <router-link
        to="/info"
        class="item"
        data-tooltip="Info"
        data-position="bottom center"
      >
        <i class="large info circle icon"></i>
      </router-link>
      <a class="item" data-tooltip="Help" data-position="bottom center">
        <i class="large question circle icon"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    computer: { type: String, required: true },
    computerLink: { type: String, required: true }
  }
}
</script>
