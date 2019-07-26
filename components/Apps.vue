<template>
  <div>
    <Categories />
    <div class="ui two stackable cards">
      <div v-if="isLoading" class="ui active inverted dimmer">
        <div class="ui big loader"></div>
      </div>
      <template v-else>
        <AppDetail
          v-for="item in appsByFilter"
          :key="item.id"
          :icon="item.icon"
          :name="item.name"
          :category="item.category.name"
          :score="item.score"
          :description="item.description"
        />
      </template>
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
      isLoading: false,
      apps: []
    }
  },
  computed: {
    appsByFilter() {
      let results = this.apps

      if (this.$store.state.selectedCategory > 0)
        results = results.filter(
          app => app.category.id == this.$store.state.selectedCategory
        )
      if (this.$store.state.searchApp)
        results = results.filter(
          app =>
            app.name.toLowerCase().includes(this.$store.state.searchApp) ||
            app.description.toLowerCase().includes(this.$store.state.searchApp)
        )
      // if only installed apps...

      return results
    }
  },
  mounted() {
    this.apps = this.$store.state.apps
  }
}
</script>
