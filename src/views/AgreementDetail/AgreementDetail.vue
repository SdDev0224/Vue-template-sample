<template>
  <section class="section" id="AgreementDetail">
    <div class="container" v-if="!isFetching">
<!--       <nav class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <div class="level-item">
            <CTAButton v-if="cruise.locked && cruise.write_access" text="Unlock" color="orange" icon="unlock" @click.native="handleUnlock" />
            <CTAButton v-if="!cruise.locked && cruise.write_access" text="Lock" color="orange" icon="lock" @click.native="handleLock"/>
          </div>
        </div>
      </nav> -->
      <div class="section-box">
        <div class="tab-bar">
          <router-link class="tab-bar__item" :to="{ name: 'AgreementDetail'}">
            <tick-tab text="Quick view" />
          </router-link>
          <router-link class="tab-bar__item" :to="{ name: 'ContractSection'}">
            <tick-tab text="Contract" />
          </router-link>
          <router-link class="tab-bar__item" :to="{ name: 'MappingSection'}">
            <tick-tab text="Cruise" />
          </router-link>
          <router-link class="tab-bar__item" :to="{ name: 'YachtSection'}">
            <tick-tab text="Yacht" />
          </router-link>
          <router-link class="tab-bar__item" :to="{ name: 'BrokersSection'}">
            <tick-tab text="Brokers" />
          </router-link>
          <router-link class="tab-bar__item" :to="{ name: 'ClientsSection'}">
            <tick-tab text="Clients" />
          </router-link>
          <span class="tab-bar__item">
            <tick-tab text="Add. Services" />
          </span>
          <span class="tab-bar__item">
            <tick-tab text="Price" />
          </span>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </section>
</template>

<script>
import TickTab from '@/components/UI/TickTab'
import CTAButton from '@/components/UI/CTAButton'

export default {
  name: 'ContractDetails',
  components: {
    TickTab,
    CTAButton
  },
  data () {
    return {
      activeTab: 0,
      isFetching: false
    }
  },
  computed: {
    cruise () {
      return this.$store.state.cruise.cruise
    }
  },
  created () {
    this.fetchCruise()
  },
  methods: {
    fetchCruise () {
      this.isFetching = true
      this.$store.dispatch('getCruise', this.$route.params.cruiseId)
        .then(() => {
          this.isFetching = false
        })
        .catch(err => {
          console.error(err)
          this.$router.replace({name: 'AgreementList'}, () => {
            alert('You don\'t have the permissions to edit this cruise.')
          })
        })
    }
    // handleLock () {
    //   lockCruise(this.cruise.id, {
    //     'user_id': this.$store.state.auth.user.id
    //   })
    //     .then(({data: cruise}) => {
    //       this.$store.commit('toggleCruiseLock')
    //     })
    //     .catch(error => {
    //       console.error('cruise lock error', error)
    //     })
    // },
    // handleUnlock () {
    //   unlockCruise(this.cruise.id)
    //     .then(({data: cruise}) => {
    //       this.$store.commit('toggleCruiseLock')
    //     })
    //     .catch(error => {
    //       console.error('cruise unlock error', error)
    //     })
    // }
  }
}
</script>

<style lang="scss">
.tab-bar {
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 2rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;

  &__item {
    display: flex;
    justify-content: center;
    color: lightgrey;
    outline: none;
    flex: 0 0 calc((1136px / 8) - 1rem);
    width: 0;
    margin-right: 1rem;
    padding-bottom: .5rem;

    &:hover {
      color: #43a9e3;
    }

    &.router-link-exact-active {
      border-bottom: 3px solid #43a9e3;
      color: black;
    }
  }
}
</style>
