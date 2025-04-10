import cloneDeep from 'lodash/cloneDeep'
import {
  getUserYachts,
  getYachtById,
  postUserYacht,
  putYacht,
  deleteYacht
} from '../../api/yacht'

let _ = { cloneDeep }

function initialState () {
  return {
    yachts: [],
    yacht: null,
    yachtWorkingCopy: null
  }
}

const yachtModule = {
  state: initialState,
  mutations: {
    setYachts (state, yachts) {
      state.yachts = yachts
    },
    addYacht (state, yacht) {
      state.yachts = [...state.yachts, yacht]
    },
    setCurrentYacht (state, yacht) {
      state.yacht = yacht
      state.yachtWorkingCopy = _.cloneDeep(yacht)
    },
    updateYacht (state, updatedYacht) {
      state.yachts.map(yacht => Number(yacht.id) === Number(updatedYacht.id) ? updatedYacht : yacht)
    },
    deleteYacht (state, yachtId) {
      state.yachts = state.yachts.filter(yacht => Number(yacht.id) !== Number(yachtId))
    },
    resetCurrentYacht (state) {
      const s = initialState()
      state.yacht = s.yacht
      state.yachtWorkingCopy = s.yachtWorkingCopy
    },
    resetYachtState (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }

  },
  actions: {
    getUserYachts ({commit, state, rootState}) {
      return new Promise((resolve, reject) => {
        getUserYachts(rootState.auth.user.id)
          .then(({data: yachts}) => {
            commit('setYachts', yachts)
            console.info('Yachts are now in store.')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getYachtById ({commit, state}, yachtId) {
      return new Promise((resolve, reject) => {
        getYachtById(yachtId)
          .then(({data: yacht}) => {
            commit('setCurrentYacht', yacht)
            console.info('Currently edited yacht is set in store.')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    createUserYacht ({commit, state, watch, rootState}, yachtData) {
      return new Promise((resolve, reject) => {
        postUserYacht(rootState.auth.user.id, yachtData)
          .then(({data: yacht}) => {
            commit('addYacht', yacht)
            resolve(yacht)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateYacht ({commit, state, watch, rootState}, {yachtId, yachtData}) {
      return new Promise((resolve, reject) => {
        putYacht(yachtId, yachtData)
          .then(({data: updatedYacht}) => {
            commit('updateYacht', updatedYacht)
            resolve(updatedYacht)
          })
          .catch(error => {
            console.log(`Unable to update user yacht: ${error}.`)
            reject(error)
          })
      })
    },
    deleteYacht ({commit, state, watch, rootState}, yachtId) {
      return new Promise((resolve, reject) => {
        deleteYacht(yachtId)
          .then(() => {
            commit('deleteYacht', yachtId)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
    getYachtById: state => id => {
      return state.yachts.find(yacht => yacht.id === Number(id))
    },
    yachtReadOnlyStatus: (state) => {
      if (state.yacht) {
        return state.yacht.write_access ? state.yacht.locked : true
      } else {
        return true
      }
    }
  }
}

export default yachtModule
