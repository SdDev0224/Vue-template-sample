import Vue from 'vue'
import Vuex from 'vuex'
// Modules
import authModule from './modules/auth'
import profileModule from './modules/profile'
import cruiseModule from './modules/cruise'
import yachtModule from './modules/yacht'
import geoModule from './modules/geo'
import contactModule from './modules/contact'
import waypointModule from './modules/waypoint'

Vue.use(Vuex)

const store = new Vuex.Store({
  actions: {
    resetAppState ({commit}) {
      commit('resetAuthState')
      commit('resetContactState')
      commit('resetCruiseState')
      commit('resetProfileState')
      commit('resetYachtState')
    }
  },
  modules: {
    auth: authModule,
    profile: profileModule,
    cruise: cruiseModule,
    yacht: yachtModule,
    geo: geoModule,
    contact: contactModule,
    waypoint: waypointModule
  }
})

export default store
