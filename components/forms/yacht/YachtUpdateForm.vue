<template>
    <div>
    <form @submit.prevent="send" @change.capture="send" v-if="!isFetching">
        <request-error :error="requestError"/>
        <fieldset>
          <legend>General</legend>
          <div class="columns">
            <div class="column">
              <b-field
                expanded
                :type="$v.yachtData.name.$error ? 'is-danger' : null"
                :message="$v.yachtData.name.$error
                  ? (!$v.yachtData.name.required ? 'This field is required' : null)
                  : null">
                  <p class="control">
                    <span class="button is-static">Yacht</span>
                  </p>
                <b-input
                  expanded
                  :disabled="readOnlyStatus"
                  v-model="yachtData.name"
                  @blur="$v.yachtData.name.$touch()"
                  type="text"
                  placeholder="Name of the yacht"
                />
              </b-field>
            </div>

            <div class="column">
              <b-field expanded>
                <p class="control">
                    <span class="button is-static">Flag</span>
                </p>
                  <multi-select
                    :disabled="readOnlyStatus"
                    :class="{'multiselect--menu-hidden': countrySearchText.length <= 1}"
                    v-model="selectedCountry"
                    :placeholder="readOnlyStatus ? '' : 'Type flag'"
                    @input="$v.selectedCountry.$touch()"
                    @close="$v.selectedCountry.$touch()"
                    @select="send"
                    label="name"
                    track-by="iso"
                    :options="countries"
                    :showNoResults="false"
                    @search-change="countrySearchText = $event"
                    selectLabel=""
                  />
              </b-field>
            </div>
            <div class="column">
              <b-field expanded :type="$v.selectedPort.$error ? 'is-danger' : null">
                <p class="control">
                  <span class="button is-static">Port</span>
                </p>
                <multi-select
                  :disabled="readOnlyStatus"
                  :class="{'multiselect--menu-hidden': portSearchText.length <= 1}"
                  v-model="selectedPort"
                  @input="$v.selectedPort.$touch()"
                  @close="$v.selectedPort.$touch()"
                  @select="send"
                  :allowEmpty="false"
                  :hideSelected="true"
                  label="city_name"
                  trackBy="geoname_id"
                  :placeholder="readOnlyStatus ? '' : 'Type port'"
                  :internal-search="false"
                  selectLabel=""
                  @search-change="portSearchText = $event"
                  :options="ports"
                  :showNoResults="false"
                />
              </b-field>
            </div>
          </div>

          <div class="columns">

            <div class="column">
              <b-field
                expanded
                :type="$v.yachtData.type.$error ? 'is-danger' : null"
                :message="$v.yachtData.type.$error
                  ? (!$v.yachtData.type.required ? 'This field is required' : null)
                  : null">
                  <p class="control">
                      <span class="button is-static">Type</span>
                  </p>
                  <div class="control is-expanded">
                    <div class="select is-fullwidth">
                      <select
                        v-model="yachtData.type"
                        :disabled="readOnlyStatus"
                        @blur="$v.yachtData.type.$touch()"
                        placeholder="Select a yacht type"
                      >
                        <option value="MOTOR">Motor Yacht</option>
                        <option value="SAIL">Sail Yacht</option>
                      </select>
                    </div>
                  </div>
              </b-field>
            </div>
            <div class="column">
              <b-field expanded>
                <p class="control">
                  <span class="button is-static">IMO</span>
                </p>
                <b-input
                  expanded
                  placeholder="IMO number"
                  :disabled="readOnlyStatus"
                  v-model.number="yachtData.imo_nb"
                  type="number"
                  step="0.5"
                  min="0"
                />
              </b-field>
            </div>
            <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">LOA</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    placeholder="Yacht total length"
                    v-model.number="yachtData.loa"
                    type="number"
                    step="0.5"
                    min="0"
                    expanded
                  />
                  <p class="control">
                    <span class="button is-static">m</span>
                  </p>
                </b-field>
            </div>
          </div>
        </fieldset>

        <div class="columns" v-if="!areDetailsShown">
          <div class="column has-text-centered">
            <button @click="areDetailsShown = true" type="button" class="button is-info is-outlined">Detailed info</button>
          </div>
        </div>
        <div v-show="areDetailsShown">

          <fieldset>
            <legend>Speed</legend>
            <!-- Max Speed Fuel consumption  -->
          <div class="columns">
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static">Max speed</span>
                </p>
                <b-input
                  :disabled="readOnlyStatus"
                  expanded
                  placeholder="Max speed"
                  v-model.number="yachtData.max_spd"
                  type="number"
                  step="0.5"
                  min="0"
                />
                <p class="control">
                  <span class="button is-static">kt</span>
                </p>
              </b-field>
            </div>
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static">Consumption</span>
                </p>
                <b-input
                  :disabled="readOnlyStatus"
                  expanded
                  v-model.number="yachtData.max_spd_cons"
                  type="number"
                  step="0.5"
                  min="0"
                  max="99"
                />
                <p class="control">
                  <span class="button is-static">L/h</span>
                </p>
              </b-field>
            </div>
          </div>

          <!-- Cruising speed fuel consumption -->
          <div class="columns">
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static">Cruising speed</span>
                </p>
                <b-input
                  :disabled="readOnlyStatus"
                  expanded
                  placeholder="Cruising speed"
                  v-model.number="yachtData.cruis_spd"
                  type="number"
                  step="0.5"
                  min="0"
                />
                <p class="control">
                  <span class="button is-static">kt</span>
                </p>
              </b-field>
            </div>
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static">Consumption</span>
                </p>
                <b-input
                  :disabled="readOnlyStatus"
                  expanded
                  v-model.number="yachtData.cruis_spd_cons"
                  type="number"
                  step="0.5"
                  min="0"
                  max="99"
                />
                <p class="control">
                  <span class="button is-static">L/h</span>
                </p>
              </b-field>
            </div>
          </div>

          <!-- Eco speed fuel consumption -->
            <div class="columns">
              <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static">Eco speed</span>
                </p>
                <b-input
                  :disabled="readOnlyStatus"
                  expanded
                  placeholder="Eco speed"
                  v-model.number="yachtData.eco_spd"
                  type="number"
                  step="0.5"
                  min="0"
                />
                <p class="control">
                  <span class="button is-static">kt</span>
                </p>
              </b-field>
            </div>
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static">Consumption</span>
                </p>
                <b-input
                  :disabled="readOnlyStatus"
                  expanded
                  v-model.number="yachtData.eco_spd_cons"
                  type="number"
                  step="0.5"
                  min="0"
                  max="99"
                />
                <p class="control">
                  <span class="button is-static">L/h</span>
                </p>
              </b-field>
            </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Identification</legend>

            <div class="columns">
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">MMSI</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    placeholder="MMSI Number"
                    v-model.number="yachtData.mmsi_num"
                    type="number"
                    min="1"
                  />
                </b-field>
                <div v-if="serverValidationErrors && serverValidationErrors.mmsi_num">
                  <p v-for="(error, key) in serverValidationErrors.mmsi_num" :key="key" class="has-text-danger">{{ error }}</p>
                </div>
              </div>
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">Call sign</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    placeholder="Call sign"
                    v-model.number="yachtData.call_sign"
                    type="number"
                    min="1"
                  />
                </b-field>
                <div v-if="serverValidationErrors && serverValidationErrors.call_sign">
                  <p v-for="(error, key) in serverValidationErrors.call_sign" :key="key" class="has-text-danger">{{ error }}</p>
                </div>
              </div>
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">Official number</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    placeholder="Official number"
                    v-model.number="yachtData.official_num"
                    type="number"
                    min="1"
                  />
                </b-field>
                <div v-if="serverValidationErrors && serverValidationErrors.official_num">
                  <p v-for="(error, key) in serverValidationErrors.official_num" :key="key" class="has-text-danger">{{ error }}</p>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Shipyard</legend>
            <div class="columns">
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">Keel laying</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    placeholder="Year"
                    v-model.number="yachtData.year_built"
                    type="number"
                    min="0"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">At shipyard</span>
                  </p>
                  <b-input
                    type="text"
                    expanded
                    :disabled="readOnlyStatus"
                    v-model="yachtData.yard"
                  />
                </b-field>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Dimensions</legend>
            <div class="columns">
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">GT</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    placeholder="Gross stonage"
                    v-model.number="yachtData.gross_tonnage"
                    type="number"
                    min="0"
                    step="1"
                  />
                </b-field>
              </div>
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">Displacement</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    placeholder="Displacement"
                    v-model.number="yachtData.displacement"
                    type="number"
                    min="1"
                  />
                  <p class="control">
                    <span class="button is-static">ton</span>
                  </p>
                </b-field>
              </div>
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">Breadth</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    placeholder="Breadth"
                    v-model.number="yachtData.beam"
                    type="number"
                    min="1"
                    step="0.5"
                  />
                  <p class="control">
                    <span class="button is-static">m</span>
                  </p>
                </b-field>
              </div>
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">Draught</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    placeholder="draught"
                    type="number"
                    min="1"
                    step="0.5"
                  />
                  <p class="control">
                    <span class="button is-static">m</span>
                  </p>
                </b-field>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Cruising restrictions</legend>
            <div class="columns">

              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Max. navigating passengers</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    v-model.number="yachtData.max_nb_passenger"
                    type="number"
                    min="1"
                  />
                </b-field>
              </div>

              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Max. passengers with berth</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    v-model.number="yachtData.nb_berth"
                    expanded
                    type="number"
                    step="1"
                    min="1"
                    max="12"
                  />
                </b-field>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Fuel</legend>
            <div class="columns">
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Fuel capacity</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    v-model.number="yachtData.fuel_capacity"
                    type="number"
                    min="1"
                  />
                </b-field>
              </div>

              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Fuel price</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    type="number"
                    min="1"
                  />
                </b-field>
              </div>

            </div>
          </fieldset>

          <fieldset>
            <legend>Engine</legend>
            <div class="columns">
              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Engine type</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    placeholde="Engine type"
                    v-model="yachtData.engine_type"
                  />
                </b-field>
              </div>

              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Number</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    placeholder="Number of engines"
                    v-model.number="yachtData.engine_quantity"
                    type="number"
                    min="1"
                    step="1"
                  />
                </b-field>
              </div>

              <div class="column">
                <b-field>
                  <p class="control">
                    <span class="button is-static">Power</span>
                  </p>
                  <b-input
                    :disabled="readOnlyStatus"
                    expanded
                    v-model="yachtData.total_power"
                  />
                  <p class="control">
                    <span class="button is-static">kW</span>
                  </p>
                </b-field>
              </div>

            </div>
          </fieldset>

          <yacht-pictures-form @pictures-updated="updateForm" :yacht="yacht"/>

          <div class="columns" v-if="areDetailsShown">
            <div class="column has-text-centered">
              <button @click="areDetailsShown = false" type="button" class="button is-info is-outlined">Hide detailed info</button>
            </div>
          </div>

        </div>
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
import SubmitButton from '@/components/UI/SubmitButton'
import RequestError from '@/components/UI/RequestError'
import MultiSelect from 'vue-multiselect'
import { required } from 'vuelidate/lib/validators'
import Fuse from 'fuse.js'
import YachtPicturesForm from '@/components/forms/yacht/YachtPicturesForm'

let fuseOptions = {
  shouldSort: true,
  threshold: 0.3,
  keys: [
    'port_name',
    'city_name',
    'alternatenames'
  ]
}

export default {
  name: 'YachtUpdateForm',
  components: {
    SubmitButton,
    MultiSelect,
    RequestError,
    YachtPicturesForm
  },
  props: {
    yachtId: {
      required: true
    }
  },
  watch: {
    yachtId (newYachtId, oldYachtId) {
      this.updateForm()
    },
    'yachtData.type' () {
      this.send()
    }
  },
  data () {
    return {
      yachtData: {
        name: '',
        imo_nb: 0,
        type: '',
        loa: 0.0,
        max_nb_passenger: 0,
        nb_berth: 0,
        max_nb_days: 0,
        max_spd: 0,
        max_spd_cons: 0,
        cruis_spd: 0,
        cruis_spd_cons: 0,
        eco_spd: 0,
        eco_spd_cons: 0,
        mmsi_num: '',
        call_sign: '',
        official_num: '',
        year_built: 0,
        gross_tonnage: 0,
        displacement: 0,
        draft: 0,
        beam: 0,
        yard: '',
        fuel_capacity: 0,
        engine_type: '',
        engine_quantity: 0,
        total_power: 0
      },
      selectedPort: null,
      portSearchText: '',
      countrySearchText: '',
      areDetailsShown: false,
      selectedCountry: null,
      isSending: false,
      isFetching: false,
      requestError: null,
      serverValidationErrors: null
    }
  },
  validations: {
    yachtData: {
      name: {
        required
      },
      type: {
        required
      }
    },
    selectedPort: {
      required
    },
    selectedCountry: {}
  },
  created () {
    this.isFetching = true
    Promise.all([
      this.$store.dispatch('getPorts'),
      this.$store.dispatch('getCountries')
    ]).finally(() => {
      this.updateForm()
    })
  },
  computed: {
    readOnlyStatus () {
      return this.$store.getters.yachtReadOnlyStatus
    },
    yacht () {
      return this.$store.state.yacht.yacht
    },
    ports () {
      if (this.portSearchText) {
        let fuse = new Fuse(this.$store.state.geo.ports, fuseOptions)
        return fuse.search(this.portSearchText)
      } else {
        return this.$store.state.geo.ports
      }
    },
    countries () {
      return this.$store.state.geo.countries
    }
  },
  methods: {
    send () {
      this.isSending = true
      this.requestError = null
      this.$store.dispatch('updateYacht', {
        yachtId: this.yacht.id,
        yachtData: {
          ...this.yachtData,
          port_of_registry_id: this.selectedPort ? this.selectedPort.geoname_id : null,
          flag_country_iso: this.selectedCountry ? this.selectedCountry.iso : null
        }
      })
        .then(updatedYacht => {
          this.isYachtCreateFormShown = false
          this.$store.commit('setCruiseYacht', updatedYacht)
        })
        .catch(error => {
          this.requestError = error
          if (error.response && error.response.data.messages) {
            this.serverValidationErrors = error.response.data.messages
          }
        })
        .finally(() => {
          this.isSending = false
        })
    },
    updateForm () {
      this.portSearchText = ''
      this.isFetching = true
      if (this.yachtId) {
        this.$store.dispatch('getYachtById', this.yachtId)
          .then(() => {
            this.yachtData.name = this.yacht.name
            this.yachtData.imo_nb = this.yacht.imo_nb
            this.yachtData.type = this.yacht.type
            this.yachtData.loa = this.yacht.loa
            this.yachtData.max_nb_passenger = this.yacht.max_nb_passenger
            this.yachtData.nb_berth = this.yacht.nb_berth
            this.yachtData.max_nb_days = this.yacht.max_nb_days
            this.yachtData.max_spd = this.yacht.max_spd
            this.yachtData.max_spd_cons = this.yacht.max_spd_cons
            this.yachtData.cruis_spd = this.yacht.cruis_spd
            this.yachtData.cruis_spd_cons = this.yacht.cruis_spd_cons
            this.yachtData.eco_spd = this.yacht.eco_spd
            this.yachtData.eco_spd_cons = this.yacht.eco_spd_cons
            this.yachtData.mmsi_num = this.yacht.mmsi_num
            this.yachtData.call_sign = this.yacht.call_sign
            this.yachtData.official_num = this.yacht.official_num
            this.yachtData.year_built = this.yacht.year_built
            this.yachtData.gross_tonnage = this.yacht.gross_tonnage
            this.yachtData.displacement = this.yacht.displacement
            this.yachtData.draft = this.yacht.draft
            this.yachtData.beam = this.yacht.beam
            this.yachtData.yard = this.yacht.yard
            this.yachtData.fuel_capacity = this.yacht.fuel_capacity
            this.yachtData.engine_type = this.yacht.engine_type
            this.yachtData.engine_quantity = this.yacht.engine_quantity
            this.yachtData.total_power = this.yacht.total_power
            this.selectedPort = null
            this.selectedCountry = null

            if (this.yacht.port_of_registry) {
              this.selectedPort = this.ports.find(port => Number(port.geoname_id) === Number(this.yacht.port_of_registry.geoname_id))
            }
            if (this.yacht.flag) {
              this.selectedCountry = this.countries.find(country => country.iso === this.yacht.flag.iso)
            }
          })
          .catch(error => {
            console.log(error)
          })
          .finally(() => {
            this.isFetching = false
          })
      } else {
        this.isFetching = false
      }
    }
  }
}
</script>
