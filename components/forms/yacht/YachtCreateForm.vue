<template>
<div>
<!-- // v-if="!isFetching" -->
    <form v-if="!isCreate"  @submit.prevent="send" >
        <b-field
          expanded
          label="Name of the yacht"
          :type="$v.yachtData.name.$error ? 'is-danger' : null"
          :message="$v.yachtData.name.$error
            ? (!$v.yachtData.name.required ? 'This field is required' : null)
            : null">
          <b-input
            v-model="yachtData.name"
            @blur="$v.yachtData.name.$touch()"
            type="text"
          />
        </b-field>

        <b-field
          expanded
          label="Port of registry"
          :type="$v.selectedPort.$error ? 'is-danger' : null"
          :message="$v.selectedPort.$error
            ? (!$v.selectedPort.required ? 'This field is required' : null)
            : null"
          >
          <multi-select
            v-model="selectedPort"
            @input="$v.selectedPort.$touch()"
            @close="$v.selectedPort.$touch()"
            :allowEmpty="false"
            :hideSelected="true"
            label="city_name"
            track-by="geoname_id"
            placeholder="Type port"
            selectLabel=""
            :showNoResults="false"
            @search-change="portSearchText = $event"
            :options="ports"
          />
        </b-field>

        <b-field
          expanded
          label="Type"
          :type="$v.yachtData.type.$error ? 'is-danger' : null"
          :message="$v.yachtData.type.$error
            ? (!$v.yachtData.type.required ? 'This field is required' : null)
            : null">
          <b-select
            expanded
            v-model="yachtData.type"
            @blur="$v.yachtData.type.$touch()"
            placeholder="Select a yacht type"
          >
            <option value="MOTOR">Motor Yacht</option>
            <option value="SAIL">Sail Yacht</option>
          </b-select>
        </b-field>

        <b-message
          v-if="serverError"
          class="message is-danger"
          title="Server error"
          @close="serverError = null"
        >
          <pre>{{ selectedPort }}</pre>
          <br>
          <p>{{serverError}}</p>
        </b-message>

        <div class="field is-grouped">
          <p class="control">
            <a @click="cancelCreation" class="button is-danger">Cancel</a>
          </p>
          <p class="control is-expanded">
            <submit-button :is-loading="isSending" :is-disabled="isSending || $v.$invalid" buttonText="Create" />
          </p>
        </div>
    </form>
    <yacht-detail-form v-if="isCreate" v-bind:yacht="createdYacht" @destoried="childDestoried"></yacht-detail-form>
</div>
</template>

<script>
import SubmitButton from '@/components/UI/SubmitButton'
import MultiSelect from 'vue-multiselect'
import { required } from 'vuelidate/lib/validators'
import Fuse from 'fuse.js'
import YachtDetailForm from '@/components/forms/yacht/YachtDetailForm'

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
  name: 'YachtCreateForm',
  components: {
    SubmitButton,
    MultiSelect,
    YachtDetailForm
  },
  data () {
    return {
      yachtData: {
        name: '',
        type: null
      },
      yachtId: null,
      selectedPort: null,
      isSending: false,
      isFetching: false,
      serverError: null,
      portSearchText: '',
      isCreate: false,
      createdYacht: null
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
    }
  },
  created () {
    this.isFetching = true
    Promise.all([
      this.$store.dispatch('getPorts'),
      this.$store.dispatch('getCountries')
    ]).finally(() => {
      this.isFetching = false
    })
  },
  computed: {
    ports () {
      if (this.portSearchText.length >= 2) {
        let fuse = new Fuse(this.$store.state.geo.ports, fuseOptions)
        return fuse.search(this.portSearchText)
      } else {
        // return this.$store.state.geo.ports
        return []
      }
    },
    countries () {
      return this.$store.state.geo.countries
    }
  },
  methods: {
    send () {
      this.isSending = true
      this.$store.dispatch('createUserYacht', {
        ...this.yachtData,
        port_of_registry_id: this.selectedPort.geoname_id
      })
        .then(yacht => {
          this.$emit('yacht-created', yacht)
          this.isCreate = true
          this.createdYacht = yacht
        })
        .catch(err => {
          if (err.response) {
            this.serverError = err.response.data.message
          }
        })
        .finally(() => {
          this.isSending = false
          this.type = null
        })
    },
    cancelCreation () {
      this.$router.push({name: 'YachtList'})
    }
  }
}
</script>
