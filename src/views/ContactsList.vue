<template>
    <section class="section">
        <div class="container">
            <div class="section-box">
                <div class="section-box__header">
                    <template>
                        <div class="contact-cards">
                            <template>
                              <div class="columns contact-card" v-for="profileData in profileDatas" :key="profileData.contactsuserid">
                                <div class="column is-2 card-leftname">
                                    <div class="qv-card__left">
                                      <div class="pictogram" v-on:click="onclickEvent(profileData.contactsuserid)" >
                                        <span><b>{{namepictogram(profileData.first_name, profileData.last_name)}}</b></span>
                                      </div>
                                    </div>
                                </div>
                                <div class="column is-4 card-details-left">
                                  <div class="details-left" v-on:click="onclickEvent(profileData.contactsuserid)">
                                    <span class="card-name">{{profileData.full_name}}</span>
                                  </div>
                                  <div>
                                    <span class="card-company">Company&nbsp;:&nbsp;&nbsp;{{profileData.company_name}}</span>
                                  </div>
                                </div>
                                <div class="column is-3 card-details-right">
                                   <div class="details-right">
                                     Country&nbsp;:&nbsp;&nbsp;{{profileData.address_country}}US
                                   </div>
                                   <div>
                                     Date of Birth&nbsp;:&nbsp;&nbsp;{{ profileData.date_of_birth | moment("MMMM Do YYYY") }}
                                   </div>
                                </div>
                                <div class="column is-3 card-btn">
                                  <router-link :to="{name: 'ContactDetail', params: {id: profileData.contactsuserid }, props: true}">
                                    <button @click="areDetailsShown(profileData.contactsuserid)" type="button" class="button is-info is-outlined detail-btn">Detailed info</button>
                                  </router-link>
                                </div>
                              </div>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Vue from 'vue'
import Modal from '@/components/UI/Modal'
import { getUserProfileById } from '@/api/profile'
import moment from 'vue-moment'
Vue.use(moment)
export default {
  name: 'ContactsList',
  components: {
    Modal
  },
  data () {
    return {
      contactsUsersInfo: [],
      contacts: [],
      selectedContactUserId: null,
      isFetching: false,
      requestError: null,
      profileDatas: [],
      contactId: ''
    }
  },
  validations: {},
  created () {
    this.$store.dispatch('getUserContacts')
      .finally(() => {
        this.getContactsUsersId()
      })
  },
  methods: {
    getContactsUsersId () {
      this.$store.state.contact.contacts[0].contacts.forEach((contactsUser, key) => {
        this.isFetching = true
        getUserProfileById(contactsUser.id)
          .then(({data: profileToEdit}) => {
            let profileData = {}
            profileData.contactsuserid = contactsUser.id
            profileData.full_name = profileToEdit.full_name
            profileData.first_name = profileToEdit.first_name
            profileData.last_name = profileToEdit.last_name
            profileData.date_of_birth = profileToEdit.date_of_birth === null ? null : new Date(profileToEdit.date_of_birth)
            profileData.company_name = profileToEdit.company_name
            profileData.address_country = profileToEdit.address_country
            this.profileDatas.push(profileData)
          })
          .catch(error => {
            this.requestError = error
          })
          .finally(() => {
            this.isFetching = false
          })
      })
    },
    namepictogram (fname, lname) {
      return (fname.charAt(0).toUpperCase() + lname.charAt(0).toUpperCase())
    },
    areDetailsShown (contactsuserid) {
    },
    onclickEvent (contactid) {
      this.$router.push({name: 'ContactDetail', params: {id: contactid}})
    }
  }
}
</script>

<style lang="scss">
.contact-title{
  color: #4a4a4a;
  font-size: 20px;
}
.contact-card{
  border: 2px #dbdbdb solid;
  padding: 4px 2px;
  margin-bottom: calc(2rem - 0.75rem) !important;
  .pictogram {
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4rem;
    height: 4rem;
    border-radius:50%;
    background-color: #e4e4e4;
    color: #6f6f6f;
    cursor: pointer;
  }
  .details-left{
    margin-top: 8px;
  }
  .details-right{
    margin-top: 8px;
  }
  .card-btn{
    margin-top: 12px;
    a:hover {
    text-decoration: none;
  }
  }
  .card-name{
    font-weight: 600;
    font-size: 1.1rem;
    padding-bottom: 1.5rem;
    cursor: pointer;
  }
}

</style>
