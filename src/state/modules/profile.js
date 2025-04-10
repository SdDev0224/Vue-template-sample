import {
  getUserProfiles,
  getUserProfileById,
  postUserProfile,
  putUserProfile,
  deleteUserProfile
} from '../../api/profile'

function initialState () {
  return {
    profiles: [],
    editedProfile: null,
    editedProfileWorkingCopy: null,
    mainProfile: null
  }
}

const profileModule = {
  state: initialState,
  mutations: {
    setProfiles (state, profiles) {
      state.profiles = profiles
    },
    setProfile (state, profile) {
      state.profile = profile
    },
    addProfile (state, profile) {
      state.profiles.push(profile)
    },
    updateProfile (state, {profileId, updatedProfile}) {
      let profileToUpdate = state.profiles.findIndex(profile => profile.id === profileId)
      state.profiles[profileToUpdate] = updatedProfile
    },
    deleteProfile (state, profileId) {
      state.profiles = state.profiles.filter(profile => Number(profile.id) !== Number(profileId))
    },
    resetProfileState (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }
  },
  actions: {
    getUserProfiles ({commit, state, watch, rootState}) {
      return new Promise((resolve, reject) => {
        getUserProfiles(rootState.auth.user.id)
          .then(({data}) => {
            commit('setProfiles', data)
            console.info('Profiles are now in store.')
            resolve()
          })
          .catch(error => {
            console.log(`Unable to get user profiles: ${error}.`)
            reject(error)
          })
      })
    },
    getUserProfile ({commit, state, watch, rootState}, profileId) {
      return new Promise((resolve, reject) => {
        getUserProfileById(profileId)
          .then(({data: profile}) => {
            commit('setProfile', profile)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    createUserProfile ({commit, state, watch, rootState}, profileData) {
      return new Promise((resolve, reject) => {
        postUserProfile(rootState.auth.user.id, profileData)
          .then(({data: {profiles}}) => {
            // commit('addProfile', data) // Creation enpoint return user object instead of profiles
            commit('setProfiles', profiles)
            resolve()
          })
          .catch(error => {
            console.log(`Unable to create user profile: ${error}.`)
            reject(error)
          })
      })
    },
    editUserProfile ({commit, state, watch, rootState}, {profileId, profileData}) {
      return new Promise((resolve, reject) => {
        putUserProfile(profileId, profileData)
          .then(({data}) => {
            commit('updateProfile', {
              profileId,
              updatedProfile: data
            })
            resolve()
          })
          .catch(error => {
            console.log(`Unable to update user profile: ${error}.`)
            reject(error)
          })
      })
    },
    deleteUserProfile ({commit, state, watch, rootState}, profileId) {
      return new Promise((resolve, reject) => {
        deleteUserProfile(rootState.auth.user.id, profileId)
          .then(() => {
            commit('deleteProfile', profileId)
            resolve()
          })
          .catch(error => {
            console.log(`Unable to delete user profile: ${error}.`)
            reject(error)
          })
      })
    }
  },
  getters: {
    getProfileById: (state) => (id) => {
      return state.profiles.find(profile => profile.id === Number(id))
    }
  }
}

export default profileModule
