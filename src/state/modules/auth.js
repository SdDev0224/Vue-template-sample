import localforage from 'localforage'
import router from '../../router'
import { login, getUser } from '../../api/auth'
import jwtDecode from 'jwt-decode'

function initialState () {
  return {
    user: null,
    isAuthenticated: false
  }
}

const authModule = {
  state: initialState,
  mutations: {
    setUser (state, user) {
      state.user = user
      state.isAuthenticated = true
    },
    resetAuthState (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }
  },
  actions: {
    checkAuth ({commit, dispatch, state}) {
      return new Promise((resolve, reject) => {
        localforage.getItem('jwt_token')
          .then(token => {
            let decodedToken = jwtDecode(token)
            let tokenExpirationDate = new Date(decodedToken.exp * 1000)
            // Checks if token expiration date is in the past.
            if (tokenExpirationDate <= Date.now()) {
              reject(Error(`Token is expired since ${tokenExpirationDate.toLocaleString()}.`))
              dispatch('logout')
                .then(() => {
                  console.info('User has been logged out.')
                })
                .catch(error => { console.error(`Error logging out: ${error}`) })
            } else {
              dispatch('getUser')
                .then(() => {
                  resolve(`Token is valid until ${tokenExpirationDate.toLocaleString()}.`)
                })
                .catch(error => { reject(error) })
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(error => {
            reject(Error('No token in state, user is anonymous.'))
            dispatch('resetAppState')
          })
      })
    },
    getUser ({commit, state}) {
      return new Promise((resolve, reject) => {
        getUser()
          .then(({data}) => {
            commit('setUser', data)
            resolve()
          })
          .catch(error => {
            console.error(`Unable to retrieve user: ${error}`)
            reject(error)
          })
      })
    },
    login ({commit, dispatch, state}, credentials) {
      return new Promise((resolve, reject) => {
        login(credentials)
          .then(({data: {access_token}}) => {
            localforage.setItem('jwt_token', access_token)
              .then(() => {
                dispatch('checkAuth').then(() => {
                  resolve()
                })
              })
              .catch(error => {
                reject(error)
              })
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    logout ({commit, state, dispatch}) {
      return new Promise((resolve, reject) => {
        localforage.removeItem('jwt_token')
          .then(token => {
            dispatch('resetAppState')
            router.push('/')
            resolve()
          })
          .catch(error => {
            console.error(`Error removing token from browser storage. ${error}`)
            reject(error)
          })
      })
    }
  }
}

export default authModule
