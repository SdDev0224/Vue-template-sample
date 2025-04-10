<template>
  <div>
    <request-error :error="requestError" />
    <form
      v-if="!isFetching"
      @submit.prevent="send"
      @change.capture="handleChange"
      novalidate
    >
          <div class="columns">
            <div class="column">
              <b-field :type="$v.profileData.profile_name.$error ? 'is-warning' : null">
                <p class="control">
                  <span class="button is-static">Profile name</span>
                </p>
                <b-input
                  expanded
                  :disabled="isFormInactive"
                  v-model="profileData.profile_name"
                  @blur="$v.profileData.profile_name.$touch()"
                />
              </b-field>
            </div>
            <div class="column is-narrow" v-if="!isNewProfile && !profileData.is_main">
              <button @click="setProfileAsDefault" type="button" class="button is-info">Set as default profile</button>
            </div>
          </div>

          <fieldset>
            <legend>Identity</legend>
            <div class="columns">
              <div class="column">
                <b-field
                  :type="$v.profileData.first_name.$error ? 'is-warning' : null"
                >
                  <p class="control">
                    <span class="button is-static">First name</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    autocomplete="given-name"
                    v-model="profileData.first_name"
                    placeholder="John"
                    @blur="$v.profileData.first_name.$touch()"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field
                  :type="$v.profileData.last_name.$error ? 'is-warning' : null"
                >
                  <p class="control">
                    <span class="button is-static">Last name</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    autocomplete="family-name"
                    v-model="profileData.last_name"
                    placeholder="Doe"
                    @blur="$v.profileData.last_name.$touch()"
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
                  <v-date-picker
                    v-model="profileData.date_of_birth"
                    v-bind="datepickerAttrs"
                    @input="handleChange"
                  >
                      <b-input
                        slot-scope="props"
                        type="text"
                        :value='props.inputValue'
                        @change.native='props.updateValue($event.target.value)'
                        expanded
                        >
                      </b-input>
                  </v-date-picker>
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
                    v-model="profileData.place_of_birth"
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
                v-model="profileData.address"
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
                    placeholder="Type country"
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
                    v-model="profileData.main_phone"
                  />
                </b-field>
              </div>
            </div>

          </fieldset>

          <fieldset>
            <legend>Documents</legend>

            <div class="columns">
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Passport number</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="profileData.passport_num"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">Passport country</span>
                  </p>
                  <multi-select
                    :class="{'multiselect--menu-hidden': passportCountrySearchText.length <= 1}"
                    :disabled="isFormInactive"
                    v-model="passportCountry"
                    @select="send"
                    placeholder="Type country"
                    selectLabel=""
                    :allowEmpty="false"
                    label="name"
                    track-by="iso"
                    :options="countries"
                    :showNoResults="false"
                    @search-change="passportCountrySearchText = $event"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Expiration date</span>
                  </p>
                  <v-date-picker
                    v-model="profileData.passport_expiration"
                    v-bind="datepickerAttrs"
                    @input="handleChange"
                  >
                      <b-input
                        slot-scope="props"
                        type="text"
                        :value='props.inputValue'
                        @change.native='props.updateValue($event.target.value)'
                        expanded
                        >
                      </b-input>
                  </v-date-picker>
                </b-field>
              </div>
            </div>
          </fieldset>

          <fieldset v-if="!role || (role && ['carriers', 'central_agents', 'brokers', 'stakeholders'].includes(role))">
            <legend>Company</legend>
            <div class="columns">
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Name</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="profileData.company_name"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Registration Number</span>
                  </p>
                  <b-input
                    :disabled="isFormInactive"
                    expanded
                    v-model="profileData.company_reg_num"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">VAT number</span>
                  </p>
                  <b-input
                    expanded
                    :disabled="isFormInactive"
                    v-model="profileData.company_vat_num"
                  />
                </b-field>
              </div>
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
                    v-model="profileData.company_reg_address"
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
                    placeholder="Type country"
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
                    v-model="profileData.company_insurance_pol"
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
                    v-model="profileData.financial_guarantee"
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
                    v-model="profileData.capacity"
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
                    v-model="profileData.myba_num"
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
                    v-model="profileData.bank_name"
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
                    v-model="profileData.account_num"
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
                    v-model="profileData.bank_address"
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
                    placeholder="Type country"
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
                  v-model="profileData.iban"
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
                  v-model="profileData.swiftbic"
                />
              </b-field>
            </div>
          </div>

        </fieldset>
        <div v-if="role" class="has-text-centered">
          <a class="button is-info is-outlined" @click="$emit('close')">Hide profile info</a>
        </div>
        <b-field v-if="isNewProfile">
          <submit-button :is-loading="isSending" :is-disabled="$v.profileData.$invalid || isSending" :buttonText="buttonText" />
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
import { getUserProfileById } from '@/api/profile'
import SubmitButton from '@/components/UI/SubmitButton'
import { required } from 'vuelidate/lib/validators'
import MultiSelect from 'vue-multiselect'
import RequestError from '@/components/UI/RequestError'
import { singleDatepickerAttrs } from '@/helpers/datepickers'

export default {
  name: 'ProfileForm',
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
      return this.isLocked || !this.hasWriteAccess
    }
  },
  watch: {
    profileId: function (newProfileId, oldProfileId) {
      this.setCurrentProfile()
    }
  },
  data () {
    return {
      profileData: {
        profile_name: '',
        first_name: '',
        last_name: '',
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
      hasWriteAccess: true,
      datepickerAttrs: singleDatepickerAttrs
    }
  },
  validations: {
    profileData: {
      profile_name: {
        required
      },
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
    this.isFetching = true
    this.$store.dispatch('getCountries')
      .then(() => {
        this.setCurrentProfile()
      })
  },
  methods: {
    setProfileAsDefault () {
      this.profileData.is_main = true
      this.$store.dispatch('editUserProfile', {
        profileId: this.profileId,
        profileData: {
          ...{...this.profileData, is_main: true},
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
        this.$store.dispatch('createUserProfile', this.profileData)
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
            ...this.profileData,
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
        this.isNewProfile = false
        this.isFetching = true
        getUserProfileById(this.profileId)
          .then(({data: profileToEdit}) => {
            this.isLocked = profileToEdit.locked
            this.hasWriteAccess = profileToEdit.write_access
            this.profileData.profile_name = profileToEdit.profile_name
            this.profileData.first_name = profileToEdit.first_name
            this.profileData.last_name = profileToEdit.last_name
            this.profileData.is_main = profileToEdit.is_main
            this.profileData.passport_num = profileToEdit.passport_num
            this.profileData.date_of_birth = profileToEdit.date_of_birth === null ? null : new Date(profileToEdit.date_of_birth)
            this.profileData.main_phone = profileToEdit.main_phone
            this.profileData.passport_expiration = profileToEdit.passport_expiration === null ? null : new Date(profileToEdit.passport_expiration)
            this.profileData.place_of_birth = profileToEdit.place_of_birth
            this.profileData.address = profileToEdit.address
            this.profileData.is_company = profileToEdit.is_company
            this.profileData.company_name = profileToEdit.company_name
            this.profileData.company_reg_num = profileToEdit.company_reg_num
            this.profileData.company_reg_address = profileToEdit.company_reg_address
            this.profileData.company_vat_num = profileToEdit.company_vat_num
            this.profileData.company_insurance_pol = profileToEdit.company_insurance_pol
            this.profileData.myba_num = profileToEdit.myba_num
            this.profileData.travel_agent_id = profileToEdit.travel_agent_id
            this.profileData.financial_guarantee = profileToEdit.financial_guarantee
            this.profileData.capacity = profileToEdit.capacity
            this.profileData.bank_name = profileToEdit.bank_name
            this.profileData.bank_address = profileToEdit.bank_address
            this.profileData.account_num = profileToEdit.account_num
            this.profileData.iban = profileToEdit.iban
            this.profileData.swiftbic = profileToEdit.swiftbic
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
        this.isFetching = false
      }
    }
  }
}
</script>
