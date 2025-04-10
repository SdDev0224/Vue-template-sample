<template>
    <div class="yachtdetail">
      <div class="columns images">
          <div  v-for="(picture,i) in yachtData.pictures" :key="i" class="detail-img">
                <b-img v-if="picture.public_url" :src="getImagUrl(picture.public_url)"  fluid alt="Responsive image" />
                <b-img v-if="!picture.public_url" :src="require('../../../assets/img/yacht/empty.png')"  fluid alt="Responsive image" />
          </div>
          <div class="detail-img">
              <div class="dropbox">
                <input type="file" multiple name="file" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                  accept="image/*" class="input-file">
                  <p v-if="!isSaving">
                    <i class="fas fa-plus-circle plus-icon"></i>
                    <span>
                      Upload Picture
                    </span>
                  </p>
                  <p v-if="isSaving">
                    Uploading {{ fileCount }} files...
                  </p>
              </div>
          </div>
      </div>
    <form @submit.prevent="send" @change.capture="send"  @keyup="signalChange" v-if="!isFetching">
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
                  :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
                    :class="{'multiselect--menu-hidden': countrySearchText.length <= 2}"
                    v-model="selectedCountry"
                    placeholder="Type flag"
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
                  :disabled="this.yacht === null"
                  :class="{'multiselect--menu-hidden': portSearchText.length <= 2}"
                  v-model="selectedPort"
                  @input="$v.selectedPort.$touch()"
                  @close="$v.selectedPort.$touch()"
                  @select="send"
                  :allowEmpty="false"
                  :hideSelected="true"
                  label="city_name"
                  trackBy="geoname_id"
                  placeholder="Type port"
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
                  :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
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
        <div>

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
                  :disabled="this.yacht === null"
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
                  :disabled="this.yacht === null"
                  expanded
                  v-model.number="yachtData.max_spd_cons"
                  type="number"
                  step="0.5"
                  min="0"
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
                  :disabled="this.yacht === null"
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
                  :disabled="this.yacht === null"
                  expanded
                  v-model.number="yachtData.cruis_spd_cons"
                  type="number"
                  step="0.5"
                  min="0"
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
                  :disabled="this.yacht === null"
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
                  :disabled="this.yacht === null"
                  expanded
                  v-model.number="yachtData.eco_spd_cons"
                  type="number"
                  step="0.5"
                  min="0"
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
                    :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
                    expanded
                    placeholder="Call sign"
                    v-model.number="yachtData.call_sign"
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
                    :disabled="this.yacht === null"
                    expanded
                    placeholder="Official number"
                    v-model.number="yachtData.official_num"
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
                    :disabled="this.yacht === null"
                    expanded
                    placeholder="Year"
                    v-model.number="yachtData.year_built"
                    type="number"
                    min="0"
                    :max= "new Date().getFullYear()-1"
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
                    :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
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
            </div>
            <div class="columns">
              <div class="column">
                <b-field expanded>
                  <p class="control">
                    <span class="button is-static">Breadth</span>
                  </p>
                  <b-input
                    :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
                    expanded
                    type="number"
                    min="1"
                    max="999"
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
                    :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
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
                    :disabled="this.yacht === null"
                    expanded
                    v-model="yachtData.total_power"
                    type="number"
                  />
                  <p class="control">
                    <span class="button is-static">kW</span>
                  </p>
                </b-field>
              </div>

            </div>
          </fieldset>

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
    <div class="yachtsfrom-savebtn" id="yachtsavebtn"><button type="button" class="button is-info is-outlined detail-btn">Save</button></div>
  </div>

</template>

<script>
import Vue from 'vue'
import SubmitButton from '@/components/UI/SubmitButton'
import RequestError from '@/components/UI/RequestError'
import MultiSelect from 'vue-multiselect'
import { required } from 'vuelidate/lib/validators'
import Fuse from 'fuse.js'
import { postYachtImage } from '../../../api/yacht'
import { serverURL } from '../../../api/config'
import { Image, Layout } from 'bootstrap-vue/es/components'
Vue.use(Image, Layout)

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
  name: 'YachtDetailForm',
  components: {
    SubmitButton,
    MultiSelect,
    RequestError
  },
  props: {
    yacht: {
      required: true
    }
  },
  watch: {
    yacht (newYacht, oldYacht) {
      this.updateForm()
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
        total_power: 0,
        pictures: []
      },
      selectedPort: null,
      portSearchText: '',
      countrySearchText: '',
      areDetailsShown: false,
      selectedCountry: null,
      isSending: false,
      isFetching: false,
      requestError: null,
      serverValidationErrors: null,
      selectedimg: null,
      newImagUrl: '',
      isSaving: false
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
    },
    isFormInactive () {
      return (this.yacht === null || this.isFetching)
    }
  },
  methods: {
    signalChange: function (evt) {
      document.getElementById('yachtsavebtn').style.display = 'block'
    },
    send () {
      document.getElementById('yachtsavebtn').style.display = 'none'
      this.isSending = true
      this.requestError = null
      // delete this.yachtData.pictures
      this.$store.dispatch('updateYacht', {
        yachtId: this.yacht.id,
        yachtData: {
          ...this.yachtData,
          port_of_registry_id: this.selectedPort ? this.selectedPort.geoname_id : null,
          flag_country_iso: this.selectedCountry ? this.selectedCountry.iso : null
        }
      })
        .then(() => {
          this.isYachtCreateFormShown = false
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
      if (this.yacht) {
        this.$store.dispatch('getYachtById', this.yacht.id)
          .then(() => {
            let yacht = this.$store.state.yacht.yacht
            this.yachtData.name = yacht.name
            this.yachtData.imo_nb = yacht.imo_nb
            this.yachtData.type = yacht.type
            this.yachtData.loa = yacht.loa
            this.yachtData.max_nb_passenger = yacht.max_nb_passenger
            this.yachtData.nb_berth = yacht.nb_berth
            this.yachtData.max_nb_days = yacht.max_nb_days
            this.yachtData.max_spd = yacht.max_spd
            this.yachtData.max_spd_cons = yacht.max_spd_cons
            this.yachtData.cruis_spd = yacht.cruis_spd
            this.yachtData.cruis_spd_cons = yacht.cruis_spd_cons
            this.yachtData.eco_spd = yacht.eco_spd
            this.yachtData.eco_spd_cons = yacht.eco_spd_cons
            this.yachtData.mmsi_num = yacht.mmsi_num
            this.yachtData.call_sign = yacht.call_sign
            this.yachtData.official_num = yacht.official_num
            this.yachtData.year_built = yacht.year_built
            this.yachtData.gross_tonnage = yacht.gross_tonnage
            this.yachtData.displacement = yacht.displacement
            this.yachtData.draft = yacht.draft
            this.yachtData.beam = yacht.beam
            this.yachtData.yard = yacht.yard
            this.yachtData.fuel_capacity = yacht.fuel_capacity
            this.yachtData.engine_type = yacht.engine_type
            this.yachtData.engine_quantity = yacht.engine_quantity
            this.yachtData.total_power = yacht.total_power
            this.selectedPort = null
            this.selectedCountry = null
            if (yacht.port_of_registry) {
              this.selectedPort = this.ports.find(port => Number(port.geoname_id) === Number(yacht.port_of_registry.geoname_id))
            }
            if (yacht.flag) {
              this.selectedCountry = this.countries.find(country => country.iso === yacht.flag.iso)
            }
            if (yacht.pictures.length > 2) {
              yacht.pictures = yacht.pictures.splice(0, 2)
            } else if (yacht.pictures.length === 1) {
              yacht.pictures.push({public_url: false})
            } else if (!yacht.pictures.length) {
              yacht.pictures.push({public_url: false})
              yacht.pictures.push({public_url: false})
            }
            this.yachtData.pictures = yacht.pictures
          })
          .finally(() => {
            this.isFetching = false
          })
      } else {
        this.isFetching = false
      }
    },
    getImagUrl (url) {
      return serverURL + url
    },
    getcurrentyear () {
      return (new Date()).getFullYear()
    },
    reset () {
      this.uploadError = null
    },
    uploadFiles (formData) {
      // this.isSaving = true
      postYachtImage(this.yacht.id, formData)
        .then((res) => {
          if (res.status === 200) {
            this.updateForm()
          } else {
            console.log('upload faild!', res)
          }
          // this.isSaving = false
        })
    },
    filesChange (fieldName, fileList) {
      const formData = new FormData()
      if (!fileList.length) {
        return false
      }

      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          formData.append(fieldName, fileList[x], fileList[x].name)
        })
      this.uploadFiles(formData)
    }
  },
  mounted () {
    this.reset()
  },
  destroyed () {
    this.$emit('destoried', true)
  }
}
</script>
<style lang="scss">
.yachtdetail{
  .images {
    justify-content: flex-end;
    .detail-img {
      padding: 1px !important;
      border: 2px #dbdbdb solid;
      margin-right: 2px;
      width: 200px;
      height: 130px;
      display: inline-block;
      img {
        max-width: 100%;
        max-height: 100%;
        height: 100%;
        width: 100%;
      }
      .dropbox {
        outline: 2px dashed #dbdbdb;
        /* the dash box */
        outline-offset: -5px;
        background: #ffffff;
        color: #00aeff;
        padding: 10px 10px;
        position: relative;
        cursor: pointer;
        height: 100%;
        display: flex;
        justify-content: center;
        &:hover {
          color: rgb(7, 135, 194)
        }
        span {
          display: block;
          margin-top: 20px;
        }
        .plus-icon {
        font-size: 35px;
        position: relative;
        left: 35%;
        top: 14px;
        display: block;
        margin-top: 5px;
        }
        &:hover {
          background: #fff;
          /* when mouse over to the drop zone, change color */
        }
        p {
          text-align: center;
        }
      }
      .input-file {
        opacity: 0;
        width: 90%;
        height: 80%;
        position: absolute;
        cursor: pointer;
        z-index: 1;
      }
    }
  }
}
#yachtsavebtn{
  text-align: right;
  margin-top: 50px;
  margin-right: 50px;
  display: none;
}
.form-control{
  padding: 0rem 0.75rem;
}
</style>