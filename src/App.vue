<template>
  <div id="app">
    <template v-if="hasCheckedAuth">
      <navbar v-if="navDisplayed"/>
      <router-view class="main"/>
    </template>
  </div>
</template>

<script>
import NavBar from './components/NavBar'

export default {
  name: 'App',
  components: {
    'navbar': NavBar
  },
  computed: {
    navDisplayed () {
      return this.$store.state.auth.isAuthenticated &&
              this.$route.name !== 'Login' &&
              this.$route.name !== 'Registration' &&
              this.$route.name !== 'Home'
    }
  },
  data () {
    return {
      hasCheckedAuth: false
    }
  },
  beforeCreate () {
    this.$store.dispatch('checkAuth')
      .then((message) => {
        console.info(message)
      })
      .catch(error => {
        if (this.$route.name !== 'Home' && this.$route.name !== 'Login' && this.$route.name !== 'Registration') {
          this.$router.replace({name: 'Login'})
        }
        console.warn(error)
      })
      .finally(() => {
        this.hasCheckedAuth = true
      })
  }
}
</script>

<style lang="scss">
#app {
  display: flex;
  flex-flow: column nowrap;
  flex: 1 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

.main {
  flex: 1;
  min-width: 480px;
}
</style>
