import cloneDeep from 'lodash/cloneDeep'
import {
  getUserContacts,
  postUserContact
} from '@/api/contact'

let _ = { cloneDeep }

function initialState () {
  return {
    contacts: [],
    contact: null,
    contactWorkingCopy: null
  }
}

const contactModule = {
  state: initialState,
  mutations: {
    setContacts (state, contacts) {
      state.contacts = contacts
    },
    addContact (state, contact) {
      state.contacts = [...state.contacts, {contacts: [{...contact, full_name: `${contact.first_name} ${contact.last_name}`}]}]
    },
    setCurrentContact (state, contact) {
      state.contact = contact
      state.contactWorkingCopy = _.cloneDeep(contact)
    },
    deleteContact (state, contactId) {
      state.contacts = state.contacts.filter(contact => Number(contact.id) !== Number(contactId))
    },
    resetCurrentContact (state) {
      const s = initialState()
      state.contact = s.contact
      state.contactWorkingCopy = s.contactWorkingCopy
    },
    resetContactState (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }
  },
  actions: {
    getUserContacts ({commit, state, rootState}) {
      if (state.contacts.length) {
        console.info('User contacts are already loaded in state, no need to refetch.')
        return Promise.resolve()
      } else {
        return new Promise((resolve, reject) => {
          getUserContacts(rootState.auth.user.id)
            .then(({data: contacts}) => {
              commit('setContacts', contacts)
              console.info('Contacts are now in store.')
              resolve()
            })
            .catch(error => {
              reject(error)
            })
        })
      }
    },
    createUserContact ({commit, state, watch, rootState}, contactData) {
      return new Promise((resolve, reject) => {
        postUserContact(rootState.auth.user.id, contactData)
          .then(({data: contact}) => {
            commit('addContact', contact)
            resolve(contact)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
    getContactById: (state) => (id) => {
      return state.contacts.find(contact => contact.id === Number(id))
    }
  }
}

export default contactModule
