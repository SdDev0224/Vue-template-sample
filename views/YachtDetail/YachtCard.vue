<template>
  <div>
    <template v-if="!isFetching&&!isDetail">
      <div class="bv-row">
         <div class="columns yacht-card" v-for="(yacht, index) in yachts" :key="index">
             <div class="column">
                   <div class="yachtname">{{yacht.name}}</div>
            </div>
             <div class="column">
                    <div class="card-yachtdetails">
                      <div v-if="yacht.selectedCountryname" class="card-sub-details">Flag: &nbsp;&nbsp;{{yacht.selectedCountryname}}</div>
                      <div v-if="!yacht.selectedCountryname" class="card-sub-details">Flag: &nbsp;&nbsp;</div>
                      <div class="card-sub-details">Port of Registry: &nbsp;&nbsp;{{yacht.selectedPort}}</div>
                      <div class="card-sub-details" v-if="yacht.loa">Length over all: &nbsp;&nbsp;{{yacht.loa}} m</div>
                      <div class="card-sub-details" v-if="!yacht.loa">Length over all: &nbsp;&nbsp;</div>
                    </div>
              </div>
              <div class="column">
                <div class="yacht-btn">
                  <button @click="areDetailsShown(index)" type="button" class="button is-info is-outlined detail-btn">Detailed info</button>
                </div>
             </div>
            <div class="column" v-for="(picture,i) in yacht.pictures" :key="i" >
              <img v-if="picture.public_url" :src="getImagUrl(picture.public_url)"  fluid alt="No image" />
              <img v-if="!picture.public_url" :src="require('../../assets/img/yacht/empty.png')"  fluid alt="No image" />
           </div>
          </div>
      </div>
    </template>
    <yacht-detail-form v-if="isDetail" v-bind:yacht="selectedYacht" @destoried="childDestoried"></yacht-detail-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { Image, Layout } from 'bootstrap-vue/es/components'
import Modal from '@/components/UI/Modal'
import TablePlaceholder from '@/components/UI/TablePlaceholder'
import YachtDetailForm from '@/components/forms/yacht/YachtDetailForm'
import { serverURL } from '../../api/config'
import Fuse from 'fuse.js'
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
  name: 'YachtCard',
  components: {
    TablePlaceholder,
    YachtDetailForm,
    Modal
  },
  props: {
    isDetail: {
      required: true
    }
  },
  data () {
    return {
      selectedYacht: null,
      isYachtCreationModalShown: false,
      isSending: false,
      isFetching: false,
      isDetailsDestoried: false,
      yachtsDetails: []
    }
  },
  validations: {},
  created () {
    this.fetchingData()
  },
  computed: {
    yachts () {
      return this.yachtsDetails
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
    areDetailsShown (yachtindex) {
      this.selectedYacht = this.yachts[yachtindex]
      this.$emit('isDetail', !this.isDetail)
    },
    getImagUrl (url) {
      return serverURL + url
    },
    fetchingData () {
      this.isFetching = true
      this.yachtsDetails = []
      this.$store.dispatch('getUserYachts')
        .finally(() => {
          let yachts = this.$store.state.yacht.yachts
          yachts.map((yacht) => {
            this.$store.dispatch('getYachtById', yacht.id)
              .then(() => {
                let yacht = this.$store.state.yacht.yacht
                console.log('yacht', yacht)
                if (yacht.port_of_registry) {
                  yacht.selectedPort = yacht.port_of_registry.country
                }
                if (yacht.port_of_registry) {
                  yacht.selectedCountryname = yacht.port_of_registry.name
                }
                if (yacht.pictures.length > 2) {
                  yacht.pictures = yacht.pictures.splice(0, 2)
                } else if (yacht.pictures.length === 1) {
                  yacht.pictures.push({public_url: false})
                } else if (!yacht.pictures.length) {
                  yacht.pictures.push({public_url: false})
                  yacht.pictures.push({public_url: false})
                }
                this.yachtsDetails.push(yacht)
              })
              .finally(() => {
                this.isFetching = false
              })
          })
        })
    },
    childDestoried (v) {
      this.isDetailsDestoried = v
    }
  },
  updated: function () {
    if (!this.isDetail && this.isDetailsDestoried) {
      this.isDetailsDestoried = false
      this.fetchingData()
    }
  }
}
</script>

<style lang="scss">
.bv-row {
  .yacht-card{
    padding: 1px;
    border: solid 1px #dbdbdb;
    margin-bottom: calc(2rem - 0.75rem) !important;
    .yacht-btn{
      position: relative;
      top: 40%;
      @media screen and (max-width: 990px) {
        top: 0%;
        margin-bottom: 20px;
      }
      button {
          width: 100%;
        }
    }
    .images{
      height: auto;
      .image-panel{
        padding-left:0px !important;
        padding-right:0px !important;
        img{
          width:100%;
          height:100%;
          border: 2px #dbdbdb solid;
          padding: 2px;
        }
      }
    }
    .yachtname{
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 10px;
    }
    .card-yachtdetails{
      @media screen and (max-width: 990px) {
        top: 0%;
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
