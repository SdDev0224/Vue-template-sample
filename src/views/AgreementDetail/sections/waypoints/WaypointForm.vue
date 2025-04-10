<template>
  <div>
    <div class="card">
      <header class="card-header">
        <p class="card-header-title" v-if="current">Selected waypoint: {{ current.sn }}</p>
        <p class="card-header-title" v-else>Create new waypoint</p>
      </header>
      <div class="card-content">
        <!-- Number -->
        <div class="columns">
          <div class="column has-text-success" v-if="!current.id">Click on map to add marker</div>
        </div>
        <div v-if="current">
          <!-- LatLng -->
          <div class="columns input-change">
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static control-label">lat.</span>
                </p>
                <b-input
                  v-model.number="roundLatitude"
                  @input="throttleSave"
                  expanded></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static control-label">lon.</span>
                </p>
                <b-input
                  v-model.number="roundLongitude"
                  @input="throttleSave"
                  expanded></b-input>
              </b-field>
            </div>
          </div>
          <!-- is_call -->
          <div class="columns">
            <div class="column">
              <b-checkbox
                v-model="current.is_call"
                @input="throttleSave"
                class="is-pulled-right"
              >This waypoint is a Call
              </b-checkbox>
            </div>
          </div>
          <!-- Call -->
          <div class="columns" v-if="current.is_call">
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static control-label">Call</span>
                </p>
                <b-input
                  v-model="current.call_location_str"
                  @input="throttleSave"
                  expanded></b-input>
              </b-field>
            </div>
          </div>
          <!-- Arrival -->
          <div class="columns input-change">
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static control-label">arr.</span>
                </p>
                <b-datepicker
                  placeholder="Click to select..."
                  icon="calendar"
                  v-model="current.arr_date"
                  @input="throttleSave"
                  :date-formatter="dateFormatter"
                  expanded
                ></b-datepicker>
              </b-field>
            </div>
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static">at</span>
                </p>
                <b-timepicker
                  icon="clock"
                  v-model="current.arr_date"
                  @input="throttleSave"
                  :increment-minutes="5"
                  expanded
                ></b-timepicker>
              </b-field>
            </div>
          </div>
          <!-- Departure -->
          <div class="columns input-change" v-if="current.is_call">
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static control-label">dep.</span>
                </p>
                <b-datepicker
                  placeholder="Click to select..."
                  icon="calendar"
                  v-model="current.dep_date"
                  @input="throttleSave"
                  :date-formatter="dateFormatter"
                  expanded
                ></b-datepicker>
              </b-field>
            </div>
            <div class="column">
              <b-field>
                <p class="control">
                  <span class="button is-static">at</span>
                </p>
                <b-timepicker
                  icon="clock"
                  v-model="current.dep_date"
                  @input="throttleSave"
                  :increment-minutes="5"
                  expanded
                ></b-timepicker>
              </b-field>
            </div>
          </div>
          <button
            v-if="current.id"
            @click.prevent="onDeleteClick(current.id)"
            class="button is-danger"
          >
            <b-icon icon="trash-alt" pack="fas"></b-icon>
            <span>Delete waypoint</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: ENABLE LINTER AND FOLLOW STYLEGUIDE...
/* eslint-disable */
import { mapGetters, mapActions } from "vuex";
import debounce from "lodash/debounce";
import dayjs from "dayjs";

export default {
  name: "WayPointForm",

  data() {
    return {};
  },

  computed: {
    ...mapGetters(["current"]),
    roundLatitude: {
      get: function() {
        return this.current.latitude.toFixed(4);
      },
      set: function() {
        return this.current.latitude.toFixed(4);
      }
    },
    roundLongitude: {
      get: function() {
        return this.current.longitude.toFixed(4);
      },
      set: function() {
        return this.current.longitude.toFixed(4);
      }
    }
  },

  methods: {
    ...mapActions(["putCruiseWaypoint", "setCurrent", "deleteWaypoint"]),
    throttleSave: debounce(function() {
      this.putCruiseWaypoint(this.current).catch(error => console.log(error));
    }, 100),
    onDeleteClick(id) {
      if (this.current && id === this.current.id) {
        this.setCurrent(false);
      }
      this.deleteWaypoint(id).catch(error => console.log(error));
    },
    dateFormatter(date) {
      return dayjs(date).format("DD/MM/YY");
    }
  }
};
</script>

<style scoped>
.control-label {
  text-align: right;
  display: block;
}
</style>
