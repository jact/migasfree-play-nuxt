<template>
  <div class="ui two column centered grid">
    <div class="column">
      <keep-alive>
        <el-form ref="form" @submit.prevent>
          <div class="field">
            <el-select
              v-model="category"
              placeholder="Categoría"
              @change="setCategory"
              size="large"
              data-tooltip="Categoría"
              data-position="bottom center"
            >
              <el-option
                v-for="(item, index) in categories"
                :key="index"
                :value="index"
                :selected="index == selectedCategory"
                :label="item"
              ></el-option>
            </el-select>
          </div>
          <div class="field">
            <el-input
              placeholder="buscar"
              v-model="searchApp"
              @input="setSearchApp"
              clearable
              prefix-icon="el-icon-search"
            ></el-input>
          </div>
          <div class="inline field">
            <el-switch
              v-model="onlyInstalledApps"
              active-text="Aplicaciones instaladas"
              inactive-text="Todas las aplicaciones"
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
      category: this.$store.state.selectedCategory || 'All',
      searchApp: '',
      onlyInstalledApps: false
    }
  },
  computed: {
    selectedCategory() {
      return this.$store.state.selectedCategory
    },
    categories() {
      return this.$store.state.categories
    }
  },
  methods: {
    setCategory() {
      this.$store.commit('setSelectedCategory', this.category)
    },
    setSearchApp() {
      this.$store.commit('setSearchApp', this.searchApp)
    },
    setOnlyInstalledApps() {
      this.$store.commit('setOnlyInstalledApps', this.onlyInstalledApps)
    }
  }
}
</script>
