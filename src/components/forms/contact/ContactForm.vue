<template>
  <form @submit.prevent="send">

    <b-field
      label="First name"
      :type="$v.contactData.first_name.$error ? 'is-warning' : null"
    >
      <b-input
        autocomplete="given-name"
        v-model="contactData.first_name"
        placeholder="John"
        @blur="$v.contactData.first_name.$touch()"
      />
    </b-field>
    <b-field
      label="Last name"
      :type="$v.contactData.last_name.$error ? 'is-warning' : null"
    >
      <b-input
        autocomplete="family-name"
        v-model="contactData.last_name"
        placeholder="Doe"
        @blur="$v.contactData.last_name.$touch()"
      />
    </b-field>

    <b-field
      label="Email"
      :type="$v.contactData.email.$error ? 'is-warning' : null"
      :message="[
        ($v.contactData.email.$dirty && !$v.contactData.email.required) ? 'This field is required.' : null,
        ($v.contactData.email.$dirty && !$v.contactData.email.email) ? 'Please enter a valid email.' : null
      ]"
    >
      <b-input
        type="email"
        autocomplete="email"
        v-model="contactData.email"
        placeholder="john.doe@example.xyz"
        @blur="$v.contactData.email.$touch()"
      />
    </b-field>

    <b-field label="Phone number">
      <b-input
        type="tel"
        autocomplete="tel"
        v-model="contactData.main_phone"
        placeholder=""
      />
    </b-field>

    <b-field>
      <submit-button :is-loading="isSending" :is-disabled="isSending || $v.$invalid" buttonText="Add contact" />
    </b-field>

  </form>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import SubmitButton from '@/components/UI/SubmitButton'

export default {
  name: 'ContactForm',
  components: {
    SubmitButton
  },
  data () {
    return {
      contactData: {
        first_name: '',
        last_name: '',
        main_phone: '',
        email: ''
      },
      isSending: false
    }
  },
  validations: {
    contactData: {
      first_name: {
        required
      },
      last_name: {
        required
      },
      email: {
        required,
        email
      }
    }
  },
  methods: {
    send () {
      this.isSending = true
      this.$store.dispatch('createUserContact', this.contactData)
        .then(contact => {
          this.$emit('contact-created', contact)
        })
        .finally(() => {
          this.isSending = false
        })
    }
  }
}
</script>
