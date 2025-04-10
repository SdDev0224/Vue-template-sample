<template>
  <header class="header">
    <div class="header-main">
      <div class="header__logo">
        <router-link class="" :to="{name: 'AgreementList'}">
          <img src="../assets/img/logo@1x.svg" width="45">
        </router-link>
      </div>
      <div class="header__nav">
        <router-link
            class="header__nav-item"
            active-class="header__nav-item--active"
            :to="{name: 'AgreementList'}"
        >Agreements</router-link>
        <router-link
          class="header__nav-item"
          active-class="header__nav-item--active"
          :to="{name: 'YachtList'}"
        >Yachts</router-link>
        <router-link
          class="header__nav-item"
          active-class="header__nav-item--active"
          :to="{name: 'ContactsList'}"
        >contacts</router-link>
      </div>
      <div class="header__actions">
        <template v-if="isAuthenticated">
          <router-link class="has-text-grey" active-class="is-active" :to="{name: 'ProfileList'}">{{ $store.state.auth.user.main_profile.full_name }}</router-link>
          <a @click="handleLogout">
            <span class="has-text-danger">Log out</span>
          </a>
        </template>
      </div>
    </div>
    <div class="header-secondary">
      <div class="header__nav">
        <router-link
            class="header__nav-item"
            active-class="header__nav-item--active"
            :to="{name: 'AgreementList'}"
        >Agreements</router-link>
        <router-link
          class="header__nav-item"
          active-class="header__nav-item--active"
          :to="{name: 'YachtList'}"
        >Yachts</router-link>
        <router-link
          class="header__nav-item"
          active-class="header__nav-item--active"
          :to="{name: 'ContactsList'}"
        >contacts</router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      isMenuShown: false,
      isUserDropdownShown: false
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.state.auth.isAuthenticated
    }
  },
  methods: {
    toggleMenu () {
      this.isMenuShown = !this.isMenuShown
    },
    toggleUserDropdown () {
      this.isUserDropdownShown = !this.isUserDropdownShown
    },
    handleLogout () {
      if (confirm('Are you sure you want to log out ?')) {
        this.$store.dispatch('logout')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    display: flex;
    flex-flow: column nowrap;
    background-color: white;
    flex: 0 0 auto;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.05);

    &__nav {
      display: flex;
      flex: 1 0 auto;
      height: 100%;
      align-items: center;

      &-item {
        display: flex;
        align-items: center;
        height: 100%;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: .75rem;
        color: #9AA7B4;
        font-weight: 600;
        border-bottom: 3px solid transparent;
        padding: 0 .25rem;
        margin: 0 .5rem;
        outline: none;

        &--active {
          border-bottom: 3px solid #43a9e3;
          color: black;
        }
      }
    }

    &-main {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      height: 80px;
      padding: 0 1rem;

      .header__nav {
        justify-content: center;
        @media (max-width: 769px) {
          display: none;
        }
      }

    }

    &-secondary {
      display: flex;
      flex-flow: row nowrap;

      .header__nav {
        @media (min-width: 769px) {
          display: none;
        }

        &-item {
          flex: 1;
          padding: 1rem 0;
          justify-content: center;
        }

      }

    }

    &__logo,
    &__actions {
      display: flex;
      flex: 1 0 0;

      & > * {
        display: inline-flex;
        outline: none;
      }
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      font-size: 14px;

      & > *:not(:last-child) {
        margin-right: 1rem;
      }

    }

  }
</style>
