<template>
  <div>
    <Categories />
    <div class="ui two stackable cards">
      <AppDetail
        v-for="item in appsByFilter"
        :key="item.id"
        :icon="item.icon"
        :name="item.name"
        :category="item.category.name"
        :score="item.score"
        :description="item.description"
        :packages="item.packages_to_install"
        :level="item.level.id"
      />
    </div>
  </div>
</template>

<script>
import AppDetail from '@/components/AppDetail.vue'
import Categories from '@/components/Categories.vue'

export default {
  name: 'Apps',
  components: {
    AppDetail,
    Categories
  },
  data() {
    return {
      apps: []
    }
  },
  computed: {
    appsByFilter() {
      let results = this.apps

      if (this.$store.state.filters.selectedCategory > 0)
        results = results.filter(
          app => app.category.id == this.$store.state.filters.selectedCategory
        )
      if (this.$store.state.filters.searchApp)
        results = results.filter(
          app =>
            app.name
              .toLowerCase()
              .includes(this.$store.state.filters.searchApp) ||
            app.description
              .toLowerCase()
              .includes(this.$store.state.filters.searchApp)
        )
      if (this.$store.state.filters.onlyInstalledApps)
        results = results.filter(
          app =>
            app.packages_to_install.length > 0 &&
            app.packages_to_install.filter(
              x => !this.$store.state.packages.installed.includes(x)
            ).length === 0
        )

      return results
    }
  },
  mounted() {
    this.apps = this.$store.state.apps
  }
}
</script>
