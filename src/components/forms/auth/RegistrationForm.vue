<template>
  <form @submit.prevent="register" novalidate autocomplete="on">
        <b-field
          label="First name"
          :type="$v.registrationData.first_name.$error ? 'is-warning' : null"
        >
          <b-input
            autocomplete="given-name"
            v-model="registrationData.first_name"
            placeholder="John"
            @blur="$v.registrationData.first_name.$touch()"
          />
        </b-field>
        <b-field
          label="Last name"
          :type="$v.registrationData.last_name.$error ? 'is-warning' : null"
        >
          <b-input
            autocomplete="family-name"
            v-model="registrationData.last_name"
            placeholder="Doe"
            @blur="$v.registrationData.last_name.$touch()"
          />
        </b-field>

        <b-field
          label="Email"
          :type="$v.registrationData.email.$error ? 'is-warning' : null"
        >
          <b-input
            type="email"
            autocomplete="email"
            v-model="registrationData.email"
            placeholder="john.doe@example.xyz"
            @blur="$v.registrationData.email.$touch()"
          />
        </b-field>
        <b-field
          label="Password"
          :type="$v.registrationData.password.$error ? 'is-warning' : null"
        >
          <b-input
            type="password"
            autocomplete="new-password"
            v-model="registrationData.password"
            placeholder="Password"
            @blur="$v.registrationData.password.$touch()"
          />
        </b-field>
        <b-field>
          <submit-button :is-loading="isSending" :is-disabled="$v.registrationData.$invalid || isSending" buttonText="Create account" />
        </b-field>
        <div class="level">
          <span class="level-item has-text-grey">Already have an account ?&nbsp;<router-link :to="{name : 'Login'}" class="has-text-link has-text-weight-semibold">Log in</router-link></span>
        </div>
  </form>
</template>

<script>
import SubmitButton from '@/components/UI/SubmitButton'
import { required, email, minLength } from 'vuelidate/lib/validators'
import { register } from '@/api/auth'

export default {
  name: 'RegistrationForm',
  components: {
    'submit-button': SubmitButton
  },
  data () {
    return {
      registrationData: {
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      },
      isSending: false
    }
  },
  validations: {
    registrationData: {
      first_name: {
        required
      },
      last_name: {
        required
      },
      email: {
        required,
        email
      },
      password: {
        minLength: minLength(8),
        required
      }
    }
  },
  methods: {
    register () {
      this.isSending = true
      register(this.registrationData)
        .then(({data}) => {
          this.$store.dispatch('login', {
            email: this.registrationData.email,
            password: this.registrationData.password
          }).then(() => {
            this.isSending = false
            this.$router.push({name: 'AgreementList'})
          })
        })
        .catch(error => {
          this.isSending = false
          console.error(error)
        })
    }
  }
}
</script>
