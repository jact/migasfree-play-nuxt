<template>
  <div>
    <ExecutionDetail
      v-for="(item, name, index) in this.$store.state.executions.log"
      :key="index"
      :id="name"
      :command="item.command"
      :text="item.text"
    />
  </div>
</template>

<script>
import ExecutionDetail from '@/components/ExecutionDetail.vue'

export default {
  name: 'Executions',
  components: {
    ExecutionDetail
  }
}
</script>
