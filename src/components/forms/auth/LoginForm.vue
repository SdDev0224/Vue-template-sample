<template>
  <form @submit.prevent="login" autocomplete="on" novalidate>
    <b-field
      label="Email"
      :type="$v.loginData.email.$error ? 'is-warning' : null"
      :message="[
        ($v.loginData.email.$dirty && !$v.loginData.email.required) ? 'This field is required.' : null,
        ($v.loginData.email.$dirty && !$v.loginData.email.email) ? 'Please enter a valid email.' : null
      ]"
    >
      <b-input
        type="email"
        autocomplete="email"
        v-model="loginData.email"
        placeholder="john.doe@example.xyz"
        @blur="$v.loginData.email.$touch()"
      />
    </b-field>

    <b-field label="Password"
      :type="$v.loginData.password.$error ? 'is-warning' : null"
      :message="($v.loginData.password.$dirty && !$v.loginData.password.required) ? 'This field is required' : ''"
    >
      <b-input
        type="password"
        autocomplete="current-password"
        v-model="loginData.password"
        placeholder="Password"
        @blur="$v.loginData.password.$touch()"
      />
    </b-field>
    <div class="message is-danger" v-if="serverError">
      <div class="message-body">
        <p>{{ serverError }}</p>
      </div>
    </div>
    <b-field>
      <submit-button :is-loading="isSending" :is-disabled="$v.loginData.$invalid || isSending" buttonText="Log in" />
    </b-field>
    <div class="level">
      <span class="level-item has-text-grey">Don't have an account yet ?&nbsp;<router-link :to="{name: 'Registration'}" class="has-text-link has-text-weight-semibold">Register</router-link></span>
    </div>
  </form>
</template>

<script>
import SubmitButton from '@/components/UI/SubmitButton'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'LoginForm',
  components: {
    'submit-button': SubmitButton
  },
  data () {
    return {
      loginData: {
        email: '',
        password: ''
      },
      isSending: false,
      serverError: null
    }
  },
  validations: {
    loginData: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  },
  methods: {
    login () {
      this.serverError = null
      this.isSending = true
      this.$store.dispatch('login', this.loginData)
        .then(() => {
          this.$router.push({name: 'AgreementList'})
        })
        .catch(error => {
          if (error.response) {
            this.serverError = error.response.data.message
          } else if (error.request) {
            this.serverError = 'Unable to contact the server'
          }
        })
        .finally(() => {
          this.isSending = false
        })
    }
  }
}
</script>
