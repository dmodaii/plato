<template>
  <div class="signup">
    <c-form
      :submit="signup"
      :columns="columns"
      :items="items"
      :actions="actions"></c-form>
  </div>
</template>

<script>
import CForm from 'duo/c-form'
import md5 from 'utils/md5'
import { createUser } from 'vx/actions'
import { username, password } from 'utils/userFields'
export default {
  data () {
    return {
      columns: {
        username,
        password
      },
      items: {
        username: '',
        password: ''
      }
    }
  },

  computed: {
    actions () {
      return [null, {
        submit: {
          type: 'submit',
          class: 'primary',
          // string or function
          label: this.progress ? '提交注册中...' : '提交注册',
          disabled: !!this.progress,
          mutation (ctx, modal) {
            modal.show = true
            modal.body = '确定注册？'
            return false
          }
        }
      }]
    }
  },

  // methods
  methods: {
    signup ($validation, $payload) {
      if ($validation.errors.length) {
        return
      }
      $payload.password = md5($payload.password)
      this.createUser($payload)
    }
  },

  // validator: {
  // },

  vuex: {
    actions: {
      createUser
    }
  },

  watch: {
    auth (value) {
      this.$nextTick(() => {
        if (value) {
          this.$route.router.go('/user')
        } else {
          this.$route.router.go('/login')
        }
      })
    }
  },

  components: {
    CForm
  }
}
</script>
