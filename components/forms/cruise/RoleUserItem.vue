<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title has-text-weight-normal">{{ user.full_name }}</p>
      <a class="card-header-icon" @click="toggleForm">{{ isFormShown ? 'Close' : 'Edit' }}</a>
      <a class="card-header-icon has-text-danger" @click="handleRemove(user.id)">Remove</a>
    </header>
    <div v-if="isFormShown" class="card-content">
      <profile-form :role="role" @close="toggleForm" :profile-id="user.id"></profile-form>
    </div>
  </div>
</template>

<script>
import ProfileForm from '@/components/forms/profile/ProfileForm'
import {
  deleteCruiseUserByRoleByProfile
} from '@/api/cruise'

export default {
  name: 'RoleUserItem',
  components: {
    ProfileForm
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isFormShown: false
    }
  },
  methods: {
    toggleForm () {
      this.isFormShown = !this.isFormShown
    },
    handleRemove (id) {
      if (confirm('Are you sure you want to remove this contact ?')) {
        deleteCruiseUserByRoleByProfile(
          this.$store.state.cruise.cruise.id,
          this.role,
          id
        )
          .then(() => {
            this.$emit('deleted-user', id)
          })
          .catch(error => {
            // TODO Handle this in UI
            console.log(error)
          })
      }
    }
  }
}
</script>
