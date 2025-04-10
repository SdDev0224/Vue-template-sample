import {
  getCruiseWaypoints
} from '@/api/cruise'
import cloneDeep from 'lodash/cloneDeep'
import maxBy from 'lodash/maxBy'
import dayjs from 'dayjs'
import {
  putCruiseWaypoint,
  postCruiseWaypoint,
  deleteCruiseWaypoint
} from '../../api/cruise'

const _ = {maxBy, cloneDeep}

const blankWaypoint = {
  call_location_str: '',
  latitude: '',
  longitude: '',
  is_call: false
}

function initialState () {
  return {
    waypoints: [],
    current: false,
    createNew: false,
    waiting: false,
    markerSelect: false
  }
}

const waypointModule = {
  state: initialState,
  mutations: {
    setCreateNew (state, payload) {
      state.createNew = payload
    },
    setWaypoints (state, waypoints) {
      state.waypoints = waypoints
    },
    setWaypoint (state, index, waypoint) {
      state.waypoints[index] = waypoint
    },
    addWaypoint (state, payload) {
      state.waypoints.push(payload)
    },
    deleteWaypoint (state, id) {
      let index = state.waypoints.findIndex(item => item.id === id)
      state.waypoints.splice(index, 1)
    },
    setCurrent (state, payload) {
      state.current = payload
    },
    setWaiting (state, payload) {
      state.waiting = payload
    },
    setMarkerSelect (state, value) {
      state.markerSelect = value
    }
  },
  actions: {
    setWaypoints ({commit}, payload) {
      commit('setWaypoints', payload)
    },
    /**
     * Action add new WP
     * @param commit
     * @param state
     * @param fields
     * @returns {Promise<any>}
     */
    addNewWaypoint ({commit, state, dispatch, rootState}, fields) {
      return new Promise((resolve, reject) => {
        let newPoint = _.cloneDeep(blankWaypoint)
        for (let key in fields) {
          newPoint[key] = fields[key]
        }
        if (state.waypoints.length === 0) {
          newPoint.is_call = true
        }
        newPoint.arr_date = dayjs().add(1, 'second').toDate()
        // newPoint.arr_date = new Date()
        newPoint.dep_date = newPoint.arr_date
        // dispatch('updateDateTime')
        console.log('API call: postCruiseWaypoint')
        let len = state.waypoints.length
        let selectedWpId = 0
        if (len > 0 && state.current) {
          selectedWpId = state.current.id
        } else if (len > 0 && !state.current) {
          selectedWpId = state.waypoints[state.waypoints.length - 1].id
        }
        postCruiseWaypoint(rootState.cruise.cruise.id, newPoint, selectedWpId).then((response) => {
          var ids = state.waypoints.map(wp => wp.id)
          var newWPs = response.data.filter(function (wp) {
            return ids.indexOf(wp.id) === -1
          })
          commit('setWaypoints', response.data)
          if (newWPs.length > 0) { commit('setCurrent', newWPs[0]) }
          resolve()
        })
      })
    },
    setCurrent ({commit}, payload) {
      commit('setCurrent', payload)
    },
    setCreateNew ({commit, state}, createNew) {
      commit('setCreateNew', createNew)
    },

    /**
     * Load WP list
     * @param commit
     * @param state
     * @param rootState
     * @returns {Promise<any>}
     */
    getCruiseWaypoints ({state, commit, rootState}) {
      commit('setWaiting', true)
      console.log('API call: getCruiseWaypoints')
      return new Promise((resolve, reject) => {
        getCruiseWaypoints(rootState.cruise.cruise.id)
          .then(resp => {
            let waypoints = resp.data.map((item, index) => {
              item.arr_date = dayjs(item.arr_date).toDate()
              item.dep_date = dayjs(item.dep_date).toDate()
              item.lat = item.latitude
              item.lng = item.longitude
              item.sn = index + 1
              return item
            })
            resolve(waypoints)
            commit('setWaiting', false)
          })
          .catch(error => {
            console.log(`Unable to get cruise waypoints: ${error}.`)
            reject(error)
          })
      })
    },

    /**
     * Action update existing WP
     * @param commit
     * @param rootState
     * @param waypoint
     * @param dispatch
     * @returns {Promise<any>}
     */
    saveWaypoint ({commit, state, rootState, dispatch}, waypoint) {
      return new Promise((resolve, reject) => {
        putCruiseWaypoint(rootState.cruise.cruise.id, waypoint)
          .then((response) => {
            // let index = response.data.findIndex(item => item.id === waypoint.id)
            // commit('setWaypoint', index, response.data[index])
            commit('setWaypoints', response.data)
            console.log('API call: putCruiseWaypoint')
          })
          .catch(error => {
            console.log(`Unable to save WP: ${error}.`)
            reject(error)
          })
      })
    },

    /**
     * Action create new WP
     * @param commit
     * @param rootState
     * @param payload
     * @returns {Promise<any>}
     */
    postCruiseWaypoint ({commit, rootState}, payload) {
      return new Promise((resolve, reject) => {
        postCruiseWaypoint(rootState.cruise.cruise.id, payload)
          .then(() => {
            console.log('API call: post WP')
            resolve()
          })
          .catch(error => {
            console.log(`Unable to add WP: ${error}.`)
            reject(error)
          })
      })
    },

    /**
     * Action Update existing waypoint
     * @param commit
     * @param rootState
     * @param payload
     * @returns {Promise<any>}
     */
    putCruiseWaypoint ({commit, rootState}, payload) {
      return new Promise((resolve, reject) => {
        putCruiseWaypoint(rootState.cruise.cruise.id, payload)
          .then(() => {
            console.log('API call: putCruiseWaypoint')
            resolve()
          })
          .catch(error => {
            console.log(`Unable to add WP: ${error}.`)
            reject(error)
          })
      })
    },

    /**
     * Delete WP
     * @param commit
     * @param id
     * @returns {Promise<any>}
     */
    deleteWaypoint ({commit, rootState}, id) {
      return new Promise((resolve, reject) => {
        deleteCruiseWaypoint(rootState.cruise.cruise.id, id)
          .then(() => {
            commit('deleteWaypoint', id)
            console.log('API call: deleteWaypoint')
            resolve()
          })
          .catch(error => {
            console.log(`Unable to remove WP: ${error}.`)
            reject(error)
          })
      })
    },
    setWaiting ({commit}, waiting) {
      commit('setWaiting', waiting)
    },
    setMarkerSelect ({commit}, value) {
      commit('setMarkerSelect', value)
    }
  },
  getters: {
    waypoints: (state) => {
      return [...state.waypoints].sort((a, b) => {
        return dayjs(a.arr_date).unix() - dayjs(b.arr_date).unix()
      }).map((item, index) => {
        item.sn = index + 1
        item.arr_date = dayjs(item.arr_date).toDate()
        item.dep_date = dayjs(item.dep_date).toDate()
        return item
      })
    },
    createNew: (state) => {
      return state.createNew
    },
    current: (state) => {
      return state.current
    },
    waiting: (state) => {
      return state.waiting
    },
    markerSelect: state => state.markerSelect
  }
}

export default waypointModule
