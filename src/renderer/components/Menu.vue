<template>
  <div class="ui teal inverted borderless top fixed menu">
    <a
      class="header item"
      :href="link"
      :style="link"
    >
      <span class="ui big text">{{ $store.state.computer.name }}</span>
    </a>
    <div class="right menu">
      <router-link
        v-if="$store.state.preferences.showApps"
        to="/apps"
        class="item"
        :data-tooltip="$t('menu.apps')"
        data-position="bottom center"
      >
        <i class="large th icon" />
      </router-link>
      <router-link
        v-if="$store.state.preferences.showDevices"
        to="/devices"
        class="item"
        :data-tooltip="$t('menu.devices')"
        data-position="bottom center"
      >
        <i class="large print icon" />
      </router-link>
      <router-link
        v-if="$store.state.preferences.showDetails"
        to="/details"
        class="item"
        :data-tooltip="$t('menu.details')"
        data-position="bottom center"
      >
        <i class="large tasks icon" />
      </router-link>
      <router-link
        to="/preferences"
        class="item"
        :data-tooltip="$t('menu.preferences')"
        data-position="bottom center"
      >
        <i class="large cog icon" />
      </router-link>
      <router-link
        v-if="$store.state.preferences.showInfo"
        to="/info"
        class="item"
        :data-tooltip="$t('menu.info')"
        data-position="bottom center"
      >
        <i class="large info circle icon" />
      </router-link>
      <a
        v-if="$store.state.preferences.showHelp"
        class="item"
        :data-tooltip="$t('menu.help')"
        data-position="bottom center"
        href="https://fun-with-migasfree.readthedocs.io/es/master/chapter10.html#migasfree-play"
      >
        <i class="large question circle icon" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  computed: {
    link () {
      return this.$store.state.computer.link
    }
  }
}
</script>
