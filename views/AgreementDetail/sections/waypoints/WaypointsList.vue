<template>
  <div>
    <b-table
      v-if="waypoints"
      :data="waypoints"
      @select="onSelect"
      :selected="current ? current : waypoints[waypoints.length - 1]"
      :loading="loading"
    >
      <template slot-scope="props">
        <b-table-column label="WP">
          {{props.row.sn}}
        </b-table-column>
        <b-table-column label="Lat.">
          {{props.row.latitude | coordinates}}
        </b-table-column>
        <b-table-column label="Lon.">
          {{props.row.longitude | coordinates}}
        </b-table-column>
        <b-table-column label="Call">
           <b-checkbox v-model="props.row.is_call"/>
          {{props.row.call_location_str}}
        </b-table-column>
        <b-table-column label="Arrival">
          <b-datepicker
            icon="calendar"
            class = "wlist-input"
            v-model="props.row.arr_date"
            :date-formatter="dateFormatter"
          />
          <b-timepicker
            icon="clock"
            class="is-hidden-tablet-only wlist-input"
            v-model="props.row.arr_date"
            :increment-minutes="5"
          />
          </b-table-column>
        <b-table-column label="Departure">
            <b-datepicker
            v-if='props.row.is_call'
            icon="calendar"
            class = "wlist-input"
            v-model="props.row.dep_date"
            :date-formatter="dateFormatter"
          />
          <b-timepicker
            v-if='props.row.is_call'
            class="is-hidden-tablet-only wlist-input"
            icon="clock"
            v-model="props.row.dep_date"
            :increment-minutes="5"
          />
          </b-table-column>
          <b-table-column label="DtG">
            {{props.row.distance_to_go | distance }}
          </b-table-column>
        <b-table-column label="">
          <div
            @click="onDeleteClick(props.row.id)"
          >
            <b-icon icon="trash-alt" pack="fas"></b-icon>
          </div>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
// TODO: ENABLE LINTER AND FOLLOW STYLEGUIDE...
/* eslint-disable */
import { mapGetters, mapActions } from "vuex";
import debounce from "lodash/debounce";
import dayjs from "dayjs";

export default {
  name: "WaypointsList",

  data() {
    return {
      loading: false
    };
  },

  computed: {
    ...mapGetters(["waypoints", "current", "waiting"])
  },

  methods: {
    ...mapActions(["setCurrent", "deleteWaypoint"]),
    onSelect(row) {
      if (this.loading) return;
      this.loading = true;
      this.setCurrent(row);
      this.loading = false;
    },
    onDeleteClick(id) {
      this.loading = true;
      this.deleteWaypoint(id)
        .then(() => {
          if (this.current && id === this.current.id) {
            this.setCurrent(false);
          }
          this.loading = false;
        })
        .catch(error => console.log(error));
    },
    dateFormatter(date) {
      return dayjs(date).format("DD/MM/YY");
    }
  },

  filters: {
    formatDate(value) {
      return dayjs(value).format("DD/MM/YY @ HH:mm");
    },
    coordinates(value) {
      return parseFloat(value).toFixed(4);
   },
    distance(value) {
      return parseFloat(value / 1.852).toFixed(2);
    }
  }
};
</script>

<style scoped>
.wlist-input {
  display: inline-flex;
  width: 110px;
}
</style>
