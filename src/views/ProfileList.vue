<template>
  <section class="section">
    <div class="container">
      <nav class="level">
        <div class="level-left">
          <h1 class="title">Profiles</h1>
        </div>
      </nav>

      <div class="tab-box section-box" v-if="!isFetching">
        <div>
          <nav class="tab-box__tabs">
            <router-link
              v-for="profile in profiles"
              :key="profile.id"
              :to="{name: 'ProfileDetail', params: {'profileId': profile.id }}"
              class="tab-box__tab"
              activeClass="tab-box__tab--active"
            >{{ profile.profile_name }}</router-link>
            <router-link
              :to="{name: 'ProfileCreate'}"
              class="tab-box__tab"
              activeClass="tab-box__tab--active"
            >
              <b-icon icon="plus" />
            </router-link>
          </nav>
        </div>
        <div class="tab-box__tab-content">
          <router-view/>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import TablePlaceholder from '@/components/UI/TablePlaceholder'
import ProfileForm from '@/components/forms/profile/ProfileForm'

export default {
  name: 'ProfileList',
  components: {
    TablePlaceholder,
    ProfileForm
  },
  data () {
    return {
      isFetching: false
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'ProfileList') {
        this.$router.replace({name: 'ProfileDetail', params: {profileId: this.$store.state.auth.user.main_profile.id}})
      }
    }
  },
  created () {
    this.isFetching = true
    this.$store.dispatch('getUserProfiles')
      .then(() => {
        if (this.$route.name === 'ProfileList') {
          this.$router.replace({name: 'ProfileDetail', params: {profileId: this.$store.state.auth.user.main_profile.id}})
        }
      })
      .finally(() => {
        this.isFetching = false
      })
  },
  computed: {
    profiles () {
      return this.$store.state.profile.profiles
    }
  },
  methods: {
    handleDelete (id) {
      if (confirm('Are you sure you want to delete this profile ?')) {
        this.$store.dispatch('deleteUserProfile', id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tab-box {
    padding-top: 0;
    &__tabs {
      display: flex;
      flex-flow: nowrap;
      background-color: white;
      margin-bottom: 1.5rem;
    }
    &__tab {
      display: flex;
      height: 5rem;
      flex-flow: column nowrap;
      justify-content: center;
      padding: 1rem .75rem;
      color: lightgrey;
      font-weight: 600;
      border-bottom: 3px solid transparent;
      transition: all .2s ease;

      &--active {
        border-bottom: 3px solid #43a9e3;
        color: black !important;
      }
    }
    &__tab-content {
      background-color: white;
    }
  }
</style>
