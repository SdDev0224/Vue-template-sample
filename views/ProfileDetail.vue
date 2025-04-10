<template>
  <div>
    <profile-form @profile-created="handleProfileCreated" :profile-id="profileId"></profile-form>
  </div>
</template>

<script>
import ProfileForm from '@/components/forms/profile/ProfileForm'

export default {
  name: 'ProfileDetail',
  data () {
    return {
      profileId: null
    }
  },
  created () {
    this.defineProfile()
  },
  watch: {
    $route () {
      this.defineProfile()
    }
  },
  components: {
    'profile-form': ProfileForm
  },
  methods: {
    defineProfile () {
      if (this.$route.name === 'ProfileDetail') {
        this.profileId = Number(this.$route.params.profileId)
      } else {
        this.profileId = null
      }
    },
    handleProfileCreated () {
      this.$router.replace({ name: 'ProfileDetail', params: {profileId: this.$store.state.profile.profiles[this.$store.state.profile.profiles.length - 1].id} })
    }
  }
}
</script>
