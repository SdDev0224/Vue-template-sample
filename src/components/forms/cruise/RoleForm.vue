<template>
  <div style="margin: 1em 0">
    <template v-if="!isFetching">
      <div class="columns is-vcentered">
        <div class="column">
          <span class="has-text-grey has-text-weight-semibold is-centered">{{ roleFriendlyNamePlural }}</span>
        </div>
        <template v-if="!this.$store.getters.cruiseReadOnlyStatus">
          <template v-if="multiple">
            <div class="column">
              <multi-select
                label="full_name"
                track-by="id"
                :placeholder="users.length ? `Add another ${roleFriendlyNameSingular}` : `Add ${roleFriendlyNameSingular}`"
                :options="contacts"
                v-model="selectedContact"
                @input="assignRole"
                :loading="isSending"
                ref="userSelectionBox"
              >
                <template slot="beforeList">
                  <div style="padding: .75rem;">
                    <a class="is-italic" @click="enableContactCreation">Add a new contact</a>
                  </div>
                </template>
              </multi-select>
            </div>
          </template>
          <template v-else>
            <div class="column">
              <multi-select
                label="full_name"
                track-by="id"
                :placeholder="`Set ${roleFriendlyNameSingular}`"
                :options="contacts"
                v-model="selectedContact"
                @input="assignRole"
                @remove="handleRemoveRole"
                ref="userSelectionBox"
              >
                <template slot="beforeList">
                  <div style="padding: .75rem;">
                    <a class="is-italic" @click="enableContactCreation">Add a new contact</a>
                  </div>
                </template>
              </multi-select>
            </div>
          </template>
        </template>

      </div>

      <!-- <template v-if="multiple"> -->
        <template v-if="users.length">
          <div v-for="user in users" :key="user.id" style="margin-top: 2rem;">
            <role-user-item :user="user" :role="role" @deleted-user="removeUserFromRole($event)"/>
          </div>
        </template>
      <!-- </template> -->
    </template>

    <modal @modal-close="isContactCreationModalShown = false" v-if="isContactCreationModalShown">
      <div slot="body">
        <contact-form @contact-created="handleContactCreated($event)"></contact-form>
      </div>
    </modal>

  </div>
</template>

<script>
import {
  getCruiseUsersByRole,
  postCruiseUserByRole,
  deleteCruiseUserByRoleByProfile
} from '@/api/cruise'
import MultiSelect from 'vue-multiselect'
import SubmitButton from '@/components/UI/SubmitButton'
import Modal from '@/components/UI/Modal'
import ContactForm from '@/components/forms/contact/ContactForm'
import RoleUserItem from '@/components/forms/cruise/RoleUserItem'

export default {
  name: 'RoleForm',
  components: {
    SubmitButton,
    MultiSelect,
    ContactForm,
    RoleUserItem,
    Modal
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      required: true
    },
    roleFriendlyNamePlural: {
      type: String,
      required: true
    },
    roleFriendlyNameSingular: {
      type: String,
      required: true
    },
    emptyText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      users: [],
      isFetching: false,
      isSending: false,
      userAddData: {
        profile_id: null
      },
      selectedContact: null,
      isContactCreationModalShown: false
    }
  },
  created () {
    this.$store.dispatch('getUserContacts')
    this.getUsersByRole()
  },
  computed: {
    // Contacts that appear in the
    contacts () {
      // Make a "usable" array of contacts...
      let flattenedContacts = this.$store.state.contact.contacts.reduce((accumulator, contact) => {
        accumulator.push(...contact.contacts)
        return accumulator
      }, [])
      if (this.multiple) {
        // if role accepts multiple users, remove the ones that are already selected
        return flattenedContacts.filter(contact => !this.users.some(alreadySetUser => contact.id === alreadySetUser.id))
      }
      return flattenedContacts
    }
  },
  methods: {
    getUsersByRole () {
      this.isFetching = true
      getCruiseUsersByRole(this.$route.params.cruiseId, this.role)
        .then(({data: users}) => {
          this.users = users
          if (!this.multiple && users.length) {
            this.selectedContact = this.contacts.find(contact => Number(contact.id) === Number(users[0].id))
            if (users.length > 1) {
              console.warn('Multiple users are set for this role, this should not be the case.')
            }
          }
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    send () {
      this.isSending = true
      postCruiseUserByRole(this.$store.state.cruise.cruise.id, this.role, this.userAddData)
        .then(({data: users}) => {
          this.users = users
          this.userAddData.profile_id = null
        })
        .finally(() => {
          this.isSending = false
        })
    },
    assignRole () {
      if (this.selectedContact) {
        this.isSending = true
        // If only one user can have this role
        // Fetch the current ones and delete them all
        if (!this.multiple) {
          getCruiseUsersByRole(this.$store.state.cruise.cruise.id, this.role)
            .then(({data: users}) => {
              Promise.all(users.map(user => deleteCruiseUserByRoleByProfile(
                this.$store.state.cruise.cruise.id,
                this.role,
                user.id
              )))
                .then(() => {
                  // All existing users for this role have been unset.
                  // We can now safely add the newly chosen user
                  postCruiseUserByRole(this.$store.state.cruise.cruise.id, this.role, {
                    profile_id: this.selectedContact.id
                  })
                    .then(({data: users}) => {
                      this.users = users
                      if (this.multiple) {
                        this.selectedContact = null
                      }
                    })
                    .finally(() => {
                      this.isSending = false
                    })
                })
            })
        } else {
          postCruiseUserByRole(this.$store.state.cruise.cruise.id, this.role, {
            profile_id: this.selectedContact.id
          })
            .then(({data: users}) => {
              this.users = users
              if (this.multiple) {
                this.selectedContact = null
              }
            })
            .finally(() => {
              this.isSending = false
            })
        }
      }
    },
    removeUserFromRole (id) {
      this.users = this.users.filter(user => Number(user.id) !== Number(id))
      if (!this.users.length) {
        this.selectedContact = null
      }
    },
    // From dropdown...
    handleRemoveRole (removedOption, id) {
      console.log('removing')
      console.log(removedOption)
      deleteCruiseUserByRoleByProfile(
        this.$store.state.cruise.cruise.id,
        this.role,
        removedOption.id)
        .then(() => {
          this.removeUserFromRole(id)
        })
        .catch(() => {

        })
    },
    handleDeleteUser (profileId) {
      if (confirm('Are you sure you want to remove this user from this role ?')) {
        deleteCruiseUserByRoleByProfile(this.$store.state.cruise.cruise.id, this.role, profileId)
          .then(() => {
            this.removeUserFromRole(profileId)
          })
      }
    },
    enableContactCreation () {
      this.isContactCreationModalShown = true
      this.$refs.userSelectionBox.$refs.search.blur()
    },
    handleContactCreated (createdContact) {
      this.isContactCreationModalShown = false
      this.selectedContact = this.contacts.find(contact => contact.id === createdContact.id)
      this.assignRole()
    }
  }
}
</script>
