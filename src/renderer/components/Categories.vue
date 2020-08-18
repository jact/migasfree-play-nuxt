<template>
  <div class="ui two column centered grid">
    <div class="column">
      <keep-alive>
        <el-form
          ref="form"
          @submit.prevent
        >
          <div class="field">
            <el-select
              v-model="category"
              :placeholder="$t('apps.filter.category')"
              @change="setCategory"
              size="large"
              :data-tooltip="$t('apps.filter.category')"
              data-position="bottom center"
            >
              <el-option
                v-for="(item, index) in categories"
                :key="index"
                :value="index"
                :selected="index === selectedCategory"
                :label="item"
              />
            </el-select>
          </div>
          <div class="field">
            <el-input
              :placeholder="$t('apps.filter.search')"
              v-model="searchApp"
              @input="setSearchApp"
              clearable
              prefix-icon="el-icon-search"
            />
          </div>
          <div class="inline field">
            <el-switch
              v-model="onlyInstalledApps"
              :active-text="$t('apps.filter.installed')"
              :inactive-text="$t('apps.filter.all')"
              @change="setOnlyInstalledApps"
            />
          </div>
        </el-form>
      </keep-alive>
    </div>
  </div>
</template>

<style scoped>
.field {
  margin: 10px 0;
}
</style>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      category: '',
      searchApp: '',
      onlyInstalledApps: false
    }
  },
  mounted() {
    this.category =
      this.$store.state.filters.selectedCategory ||
      this.$t('apps.filter.defaultCategory')
    this.searchApp = this.$store.state.filters.searchApp
    this.onlyInstalledApps = this.$store.state.filters.onlyInstalledApps
  },
  computed: {
    selectedCategory() {
      return this.$store.state.filters.selectedCategory
    },
    categories() {
      let results = Object.assign(
        {},
        this.$store.getters['filters/getCategories']
      )
      results[0] = this.$t('apps.filter.defaultCategory')

      return results
    }
  },
  methods: {
    setCategory() {
      this.$store.commit('filters/setSelectedCategory', this.category)
    },
    setSearchApp() {
      this.$store.commit('filters/setSearchApp', this.searchApp)
    },
    setOnlyInstalledApps() {
      this.$store.commit('filters/setOnlyInstalledApps', this.onlyInstalledApps)
    }
  }
}
</script>
