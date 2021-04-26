<template>
  <details
    :id="id"
    :open="id === $store.state.executions.lastId ? true : false"
  >
    <summary>
      {{ command }}
      <div class="date">
        {{ displayDate }}
      </div>
    </summary>
    <div
      class="text"
      v-html="text"
    >
    </div>
  </details>
</template>

<style scoped>
details {
  margin-bottom: 1em;
}

summary {
  font-size: 180%;
  border: 1px solid #d4d4d5;
  border-radius: 0.29rem;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  padding: 15px 10px;
  background: #fff;
}

.date {
  color: rgba(0, 0, 0, 0.4);
  font-size: 60%;
  padding-left: 32px;
  padding-top: 5px;
}

.text {
  background: #fafafa;
  padding: 10px 15px;
  border: 1px solid #d4d4d5;
  border-radius: 0.29rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 0;
}
</style>

<script>
const dateFormat = require('dateformat')

export default {
  name: 'ExecutionDetail',
  props: {
    id: { type: String, required: true },
    command: { type: String, required: true },
    text: { type: String, required: false, default: '' }
  },
  computed: {
    displayDate() {
      return dateFormat(this.id, 'yyyy-mm-dd HH:MM:ss')
    }
  },
  watch: {
    text: function () {
      window.scrollTo(0, document.getElementById('main').scrollHeight)
    }
  }
}
</script>
