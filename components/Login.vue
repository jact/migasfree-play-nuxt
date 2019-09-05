<template>
  <modal name="login" :width="380" :height="220" @opened="toggleModal" @closed="toggleModal">
    <center>
      <form class="ui form" @submit.prevent="login">
        <legend>{{ $t('login.title') }}</legend>
        <div class="required field ui left icon input">
          <i class="user icon" />
          <input
            type="text"
            v-model="username"
            :placeholder="$t('login.username')"
            autocomplete="off"
            ref="username"
            autofocus
          />
        </div>
        <div class="required field ui left icon input">
          <i class="lock icon" />
          <input
            type="password"
            v-model="password"
            :placeholder="$t('login.password')"
            autocomplete="off"
          />
        </div>
        <div>
          <button class="large ui positive button" type="submit">{{ $t('login.action') }}</button>
        </div>
      </form>
    </center>
  </modal>
</template>

<style scoped>
legend {
  font-size: 150%;
  margin: 20px 0;
}

.v--modal {
  padding: 20px !important;
}
</style>

<script>
import Vue from 'vue'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      modal: false
    }
  },
  methods: {
    login() {
      this.$modal.hide('login')
      if (this.username && this.password) {
        this.$store.dispatch('checkUser', {
          user: this.username,
          password: this.password
        })
      }
    },
    toggleModal() {
      this.modal = !this.modal
    }
  },
  watch: {
    modal() {
      if (this.modal) {
        Vue.nextTick().then(() => this.$refs.username.focus())
      }
    }
  }
}
</script>
