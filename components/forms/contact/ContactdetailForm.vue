<template>
  <div>
    <request-error :error="requestError" />
    <div class="columns">
        <div class="column is-1"></div>
        <div class="column is-1 card-leftname">
            <div class="qv-card__left">
              <div class="pictogram">
                <span><b>{{namepictogram(contactData.first_name, contactData.last_name)}}</b></span>
              </div>
            </div>
        </div>
        <div class="column is-8 contact-name">&nbsp;&nbsp;&nbsp; <span>{{contactData.first_name}}&nbsp;&nbsp;{{contactData.last_name}}</span></div>
        <div class="column is-2"></div>
    </div>
    <form
      v-if="!isFetching"
      @submit.prevent="send"
      @change.capture="handleChange"
      novalidate
    >
          <fieldset>
            <legend>Identity</legend>
            <div class="columns">
              <div class="column">
                <b-field
                  :type="$v.contactData.first_name.$error ? 'is-warning' : null"
                >
                  <p class="control">
                    <span class="button is-static">First name</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    autocomplete="given-name"
                    v-model="contactData.first_name"
                    placeholder="John"
                    @blur="$v.contactData.first_name.$touch()"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field
                  :type="$v.contactData.last_name.$error ? 'is-warning' : null"
                >
                  <p class="control">
                    <span class="button is-static">Last name</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    autocomplete="family-name"
                    v-model="contactData.last_name"
                    placeholder="Doe"
                    @blur="$v.contactData.last_name.$touch()"
                  />
                </b-field>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Date of birth</span>
                  </p>
                  <b-datepicker
                    expanded
                    :disabled="isFormInactive"
                    v-model="contactData.date_of_birth"
                    @input="handleChange"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Place of birth</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="contactData.place_of_birth"
                  />
                </b-field>
              </div>
            </div>

          </fieldset>

          <fieldset>
            <legend>Contact</legend>

            <b-field>
              <p class="control">
                <span class="button is-static">Address</span>
              </p>
              <b-input
                expanded
                :disabled="isFormInactive"
                v-model="contactData.address"
              />
            </b-field>

            <div class="columns">
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">Address country</span>
                  </p>
                  <multi-select
                    :disabled="isFormInactive"
                    :class="{'multiselect--menu-hidden': addressCountrySearchText.length <= 1}"
                    v-model="addressCountry"
                    @select="send"
                    placeholder="country"
                    selectLabel=""
                    :allowEmpty="false"
                    label="name"
                    track-by="iso"
                    :options="countries"
                    :showNoResults="false"
                    @search-change="addressCountrySearchText = $event"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Main phone</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="contactData.main_phone"
                  />
                </b-field>
              </div>
            </div>

          </fieldset>
          <fieldset>
            <legend>Documents</legend>

            <div class="bv-docinfo">
              <b-row>
                    <b-col lg="4" md="12" sm="12">
                        <b-field class="table-spacing">
                          <p class="control">
                            <span class="button is-static">Passport number</span>
                          </p>
                          <b-input
                            expanded
                            :disabled="isFormInactive"
                            v-model="contactData.passport_num"
                          />
                        </b-field>
                    </b-col>
                  <b-col lg="5" md="12" sm="12">
                    <b-field expanded class="table-spacing">
                      <p class="control">
                        <span class="button is-static">Passport country</span>
                      </p>
                      <multi-select
                        :class="{'multiselect--menu-hidden': passportCountrySearchText.length <= 1}"
                        :disabled="isFormInactive"
                        v-model="passportCountry"
                        @select="send"
                        placeholder="country"
                        selectLabel=""
                        :allowEmpty="false"
                        label="name"
                        track-by="iso"
                        :options="countries"
                        :showNoResults="false"
                        @search-change="passportCountrySearchText = $event"
                      />
                    </b-field>
                  </b-col>
                  <b-col lg="3" md="12" sm="12">
                    <b-field class="table-spacing">
                      <p class="control">
                        <span class="button is-static">Expiration date</span>
                      </p>
                      <b-datepicker
                        expanded
                        :disabled="isFormInactive"
                        v-model="contactData.passport_expiration"
                        @input="handleChange"
                      />
                    </b-field>
                  </b-col>
              </b-row>
            </div>
          </fieldset>

          <fieldset v-if="!role || (role && ['carriers', 'central_agents', 'brokers', 'stakeholders'].includes(role))">
            <legend>Company</legend>
            <div class="b-companyinfo">
               <b-row>
                 <b-col lg="4" md="12" sm="12">
                    <b-field class="table-spacing">
                      <p class="control">
                        <span class="button is-static">Name</span>
                      </p>
                      <b-input
                        expanded
                        :disabled="isFormInactive"
                        v-model="contactData.company_name"
                      />
                    </b-field>
                  </b-col>
                  <b-col lg="4" md="12" sm="12">
                    <b-field class="table-spacing">
                      <p class="control">
                        <span class="button is-static">Registration Number</span>
                      </p>
                      <b-input
                        :disabled="isFormInactive"
                        expanded
                        v-model="contactData.company_reg_num"
                      />
                    </b-field>
                   </b-col>
                  <b-col lg="4" md="12" sm="12">
                    <b-field class="table-spacing">
                      <p class="control">
                        <span class="button is-static">VAT number</span>
                      </p>
                      <b-input
                        expanded
                        :disabled="isFormInactive"
                        v-model="contactData.company_vat_num"
                      />
                    </b-field>
                  </b-col>
              </b-row>
            </div>

            <div class="columns">
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Registration address</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="contactData.company_reg_address"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">Registration country</span>
                  </p>
                  <multi-select
                    :class="{'multiselect--menu-hidden': companyRegistrationCountrySearchText.length <= 1}"
                    :disabled="isFormInactive"
                    v-model="companyRegistrationCountry"
                    @select="send"
                    placeholder="country"
                    selectLabel=""
                    :allowEmpty="false"
                    label="name"
                    track-by="iso"
                    :options="countries"
                    :showNoResults="false"
                    @search-change="companyRegistrationCountrySearchText = $event"
                  />
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Insurance policy</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="contactData.company_insurance_pol"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Financial guarantee</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="contactData.financial_guarantee"
                    placeholder="Amount secured"
                  />
                </b-field>
              </div>
            </div>

            <div class="columns">
              <div class="column is-6">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Capacity</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="contactData.capacity"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">MYBA number</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="contactData.myba_num"
                  />
                </b-field>
              </div>
            </div>

          </fieldset>

          <fieldset v-if="!role || (role && ['carriers', 'central_agents', 'brokers', 'stakeholders'].includes(role))">
            <legend>Bank details</legend>

            <div class="columns">
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Name</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="contactData.bank_name"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Account number</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="contactData.account_num"
                  />
                </b-field>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Address</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="contactData.bank_address"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">Country</span>
                  </p>
                  <multi-select
                    :class="{'multiselect--menu-hidden': bankCountrySearchText.length <= 1}"
                    :disabled="isFormInactive"
                    v-model="bankCountry"
                    @select="send"
                    placeholder="country"
                    selectLabel=""
                    :allowEmpty="false"
                    label="name"
                    track-by="iso"
                    :options="countries"
                    :showNoResults="false"
                    @search-change="bankCountrySearchText = $event"
                  />
                </b-field>
              </div>
            </div>

          <div class="columns">
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static">IBAN</span>
                </p>
                <b-input
                  expanded
                  :disabled="isFormInactive"
                  v-model="contactData.iban"
                />
              </b-field>
            </div>
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static">SWIFT/BIC</span>
                </p>
                <b-input
                  expanded
                  :disabled="isFormInactive"
                  v-model="contactData.swiftbic"
                />
              </b-field>
            </div>
          </div>

        </fieldset>
        <div v-if="role" class="has-text-centered">
          <a class="button is-info is-outlined" @click="$emit('close')">Hide profile info</a>
        </div>
        <b-field v-if="isNewProfile">
          <submit-button :is-loading="isSending" :is-disabled="$v.contactData.$invalid || isSending" :buttonText="buttonText" />
        </b-field>
    </form>
    <div v-else>
      <div class="columns">
        <div class="column has-text-centered">
          <b-icon
            icon="circle-notch"
            type="is-grey"
            size="is-large"
            custom-class="fa-spin"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { getUserProfileById } from '@/api/profile'
import SubmitButton from '@/components/UI/SubmitButton'
import { required } from 'vuelidate/lib/validators'
import MultiSelect from 'vue-multiselect'
import RequestError from '@/components/UI/RequestError'
import { Layout } from 'bootstrap-vue/es/components'
Vue.use(Layout)

export default {
  name: 'ContactdetailForm',
  components: {
    SubmitButton,
    MultiSelect,
    RequestError
  },
  props: {
    profileId: {
      type: Number,
      default: 0
    },
    role: {
      type: String
    }
  },
  computed: {
    buttonText () {
      return this.profileId ? 'Update profile' : 'Create profile'
    },
    countries () {
      return this.$store.state.geo.countries
    },
    isFormInactive () {
      if ((this.isLocked === false) && (this.hasWriteAccess === true)) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    profileId: function (newProfileId, oldProfileId) {
      this.setCurrentProfile()
    }
  },
  data () {
    return {
      contactData: {
        first_name: '',
        last_name: '',
        full_name: '',
        date_of_birth: null,
        place_of_birth: '',
        address: '',
        passport_num: '',
        passport_expiration: null,
        main_phone: '',
        is_company: false,
        company_name: '',
        company_reg_num: '',
        company_reg_address: '',
        company_vat_num: '',
        company_insurance_pol: '',
        myba_num: '',
        travel_agent_id: '',
        financial_guarantee: '',
        capacity: '',
        bank_name: '',
        bank_address: '',
        account_num: '',
        iban: '',
        swiftbic: '',
        is_main: false
      },
      passportCountry: null,
      passportCountrySearchText: '',
      addressCountry: null,
      addressCountrySearchText: '',
      companyRegistrationCountry: null,
      companyRegistrationCountrySearchText: '',
      bankCountry: null,
      bankCountrySearchText: '',
      isSending: false,
      isFetching: false,
      requestError: null,
      isNewProfile: false,
      isLocked: false,
      hasWriteAccess: true
    }
  },
  validations: {
    contactData: {
      first_name: {
        required
      },
      last_name: {
        required
      },
      passport_num: {}
    }
  },
  created () {
    this.$store.dispatch('getCountries')
      .then(() => {
        this.setCurrentProfile()
      })
  },
  methods: {
    setProfileAsDefault () {
      this.contactData.is_main = true
      this.$store.dispatch('editUserProfile', {
        profileId: this.profileId,
        contactData: {
          ...{...this.contactData, is_main: true},
          passport_country_iso: this.passportCountry ? this.passportCountry.iso : null,
          address_country_iso: this.addressCountry ? this.addressCountry.iso : null,
          company_reg_country_iso: this.companyRegistrationCountry ? this.companyRegistrationCountry.iso : null,
          bank_country_iso: this.bankCountry ? this.bankCountry.iso : null
        }
      })
        .catch(error => {
          this.requestError = error
        })
        .finally(() => {
          this.isSending = false
        })
      this.send()
    },
    handleChange () {
      if (!this.isNewProfile) {
        this.send()
      }
    },
    send () {
      this.isSending = true
      if (!this.profileId) {
        // If we're creating a profile
        this.$store.dispatch('createUserProfile', this.contactData)
          .then(() => {
            this.$emit('profile-created')
          })
          .catch(error => {
            this.requestError = error
          })
          .finally(() => {
            this.isSending = false
          })
      } else {
        // If profile already exists
        this.$store.dispatch('editUserProfile', {
          profileId: this.profileId,
          profileData: {
            ...this.contactData,
            passport_country_iso: this.passportCountry ? this.passportCountry.iso : null,
            address_country_iso: this.addressCountry ? this.addressCountry.iso : null,
            company_reg_country_iso: this.companyRegistrationCountry ? this.companyRegistrationCountry.iso : null,
            bank_country_iso: this.bankCountry ? this.bankCountry.iso : null
          }})
          .catch(error => {
            this.requestError = error
          })
          .finally(() => {
            this.isSending = false
          })
      }
    },
    setCurrentProfile () {
      if (this.profileId) {
        this.isFetching = true
        this.isNewProfile = false
        getUserProfileById(this.profileId)
          .then(({data: profileToEdit}) => {
            this.isLocked = profileToEdit.locked
            this.hasWriteAccess = profileToEdit.write_access
            this.contactData.first_name = profileToEdit.first_name
            this.contactData.last_name = profileToEdit.last_name
            this.contactData.is_main = profileToEdit.is_main
            this.contactData.passport_num = profileToEdit.passport_num
            this.contactData.date_of_birth = profileToEdit.date_of_birth === null ? null : new Date(profileToEdit.date_of_birth)
            this.contactData.main_phone = profileToEdit.main_phone
            this.contactData.passport_expiration = profileToEdit.passport_expiration === null ? null : new Date(profileToEdit.passport_expiration)
            this.contactData.place_of_birth = profileToEdit.place_of_birth
            this.contactData.address = profileToEdit.address
            this.contactData.is_company = profileToEdit.is_company
            this.contactData.company_name = profileToEdit.company_name
            this.contactData.company_reg_num = profileToEdit.company_reg_num
            this.contactData.company_reg_address = profileToEdit.company_reg_address
            this.contactData.company_vat_num = profileToEdit.company_vat_num
            this.contactData.company_insurance_pol = profileToEdit.company_insurance_pol
            this.contactData.myba_num = profileToEdit.myba_num
            this.contactData.travel_agent_id = profileToEdit.travel_agent_id
            this.contactData.financial_guarantee = profileToEdit.financial_guarantee
            this.contactData.capacity = profileToEdit.capacity
            this.contactData.bank_name = profileToEdit.bank_name
            this.contactData.bank_address = profileToEdit.bank_address
            this.contactData.account_num = profileToEdit.account_num
            this.contactData.iban = profileToEdit.iban
            this.contactData.swiftbic = profileToEdit.swiftbic
            if (profileToEdit.passport_country) {
              this.passportCountry = this.countries.find(country => country.iso === profileToEdit.passport_country.iso)
            }
            if (profileToEdit.company_reg_country) {
              this.companyRegistrationCountry = this.countries.find(country => country.iso === profileToEdit.company_reg_country.iso)
            }
            if (profileToEdit.address_country) {
              this.addressCountry = this.countries.find(country => country.iso === profileToEdit.address_country.iso)
            }
            if (profileToEdit.bank_country) {
              this.bankCountry = this.countries.find(country => country.iso === profileToEdit.bank_country.iso)
            }
          })
          .catch(error => {
            this.requestError = error
          })
          .finally(() => {
            this.isFetching = false
          })
      } else {
        // Reset component data
        Object.assign(this.$data, this.$options.data.apply(this))
        this.isNewProfile = true
      }
    },
    namepictogram (fname, lname) {
      return (fname.charAt(0).toUpperCase() + lname.charAt(0).toUpperCase())
    }
  }
}
</script>
<style lang="scss" scoped>
.contact-name{
    font-size: 24px;
    margin-top: 17px;
}
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
  }
  .table-spacing{
    margin-bottom: 20px;
  }
  .form-control{
  padding: 0rem 0.75rem;
}
</style>
