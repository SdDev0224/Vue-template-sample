import {
  getUserCruises,
  postUserCruise,
  putCruise,
  getCruiseById,
  deleteCruise,
  getCruiseRoleStatuses
} from '@/api/cruise'
import { getYachtById } from '@/api/yacht'

function initialState () {
  return {
    cruises: [],
    cruise: null, /* current cruise */
    yacht: null, /* current cruise yacht (to circumvent missing fields on cruise object from API (pictures and type)) */
    roleStatuses: [] /* current cruise list of approvals (user/role/profile) */
  }
}

const cruiseModule = {
  state: initialState,
  mutations: {
    setCruises (state, cruises) {
      state.cruises = cruises
    },
    addCruise (state, cruise) {
      state.cruises.push(cruise)
    },
    setCruise (state, cruise) {
      state.cruise = cruise
    },
    toggleCruiseLock (state) {
      state.cruise.locked = !state.cruise.locked
    },
    updateCruiseYacht (state, yacht) {
      state.cruise.yacht = yacht
    },
    setCruiseYacht (state, yacht) {
      state.yacht = yacht
    },
    resetCruiseYacht (state) {
      const s = initialState()
      state.yacht = s.yacht
    },
    setRoleStatuses (state, roleStatuses) {
      state.roleStatuses = roleStatuses
    },
    updateCruise (state, {cruiseId, updatedCruise}) {
      let cruiseToUpdate = state.cruises.findIndex(cruise => Number(cruise.id) === Number(cruiseId))
      state.cruises[cruiseToUpdate] = updatedCruise
      state.cruise = updatedCruise
    },
    deleteCruise (state, cruiseId) {
      state.cruises = state.cruises.filter(cruise => Number(cruise.id) !== Number(cruiseId))
    },
    resetCurrentCruise (state) {
      const s = initialState()
      state.cruise = s.cruise
      state.yacht = s.yacht
    },
    resetCruiseState (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }

  },
  actions: {
    getUserCruises ({commit, state, watch, rootState}) {
      return new Promise((resolve, reject) => {
        getUserCruises(rootState.auth.user.id)
          .then(({data: cruises}) => {
            commit('setCruises', cruises)
            console.info('Cruises are now in store.')
            resolve()
          })
          .catch(error => {
            console.log('cruise get error')
            reject(error)
          })
      })
    },
    getCruiseRoleStatuses ({commit, state, rootState}) {
      return new Promise((resolve, reject) => {
        getCruiseRoleStatuses(state.cruise.id)
          .then(({data: roleStatuses}) => {
            commit('setRoleStatuses', roleStatuses)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getCruiseYacht ({commit, state, rootState}, yachtId) {
      return new Promise((resolve, reject) => {
        getYachtById(yachtId)
          .then(({data: yacht}) => {
            commit('setCruiseYacht', yacht)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getCruise ({commit, dispatch, state, rootState}, cruiseId) {
      return new Promise((resolve, reject) => {
        getCruiseById(cruiseId)
          .then(({data: cruise}) => {
            commit('setCruise', cruise)
            commit('resetCruiseYacht')
            if (cruise.yacht && cruise.yacht.id) {
              dispatch('getCruiseYacht', cruise.yacht.id)
                .then(() => {
                  resolve()
                })
                .catch(error => {
                  reject(error)
                })
            } else {
              console.info('Cruise has no yacht yet.')
              resolve()
            }
          })
          .catch(error => {
            console.log(`Unable to get user cruise: ${error}.`)
            reject(error)
          })
      })
    },
    createUserCruise ({commit, state, rootState}, cruiseData) {
      return new Promise((resolve, reject) => {
        postUserCruise(rootState.auth.user.id, cruiseData)
          .then(({data}) => {
            commit('addCruise', data)
            resolve()
          })
          .catch(error => {
            console.log(`Unable to create user cruise: ${error}.`)
            reject(error)
          })
      })
    },
    updateCruise ({commit, dispatch, state, rootState}) {
      return new Promise((resolve, reject) => {
        putCruise(state.cruise.id, {
          yacht_id: state.cruise.yacht.id
        })
          .then(({data: cruise}) => {
            commit('updateCruise', {
              cruiseId: state.cruise.id,
              updatedCruise: cruise
            })
            if (cruise.yacht && cruise.yacht.id) {
              dispatch('getCruiseYacht', cruise.yacht.id)
                .then(() => {
                  resolve()
                })
                .catch(error => {
                  reject(error)
                })
            } else {
              commit('resetCruiseYacht')
              resolve()
            }
          })
          .catch(error => {
            console.log(`Unable to update user cruise: ${error}.`)
            reject(error)
          })
      })
    },
    deleteCruise ({commit, state, watch, rootState}, cruiseId) {
      return new Promise((resolve, reject) => {
        deleteCruise(cruiseId)
          .then(() => {
            commit('deleteCruise', cruiseId)
            resolve()
          })
          .catch(error => {
            if (error.response) {
              reject(error.response.data.message)
            }
          })
      })
    }
  },
  getters: {
    getCruiseById: (state) => (id) => {
      return state.cruises.find(cruise => cruise.id === Number(id))
    },
    cruiseId: (state) => {
      return state.cruise ? state.cruise.id : null
    },
    cruiseReadOnlyStatus: (state) => {
      if (state.cruise) {
        return state.cruise.write_access ? state.cruise.locked : true
      } else {
        return true
      }
    }
  }
}

export default cruiseModule
