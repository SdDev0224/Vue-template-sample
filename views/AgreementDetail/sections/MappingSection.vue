<template>
  <div>
    <div class="columns">

      <div class="column is-two-thirds">
        <waypoints-map></waypoints-map>
      </div>

      <div class="column is-one-third">
        <waypoint-form></waypoint-form>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <waypoints-list></waypoints-list>
      </div>
    </div>
  </div>
</template>

<script>
import WaypointForm from './waypoints/WaypointForm'
import WaypointsList from './waypoints/WaypointsList'
import WaypointsMap from './waypoints/WaypointsMap'

export default {
  name: 'MappingSection',

  components: {
    WaypointsList,
    WaypointForm,
    WaypointsMap
  },

  data () {
    return {}
  },

  created () {
    this.$store.dispatch('getCruiseWaypoints').then((waypoints) => {
      this.$store.dispatch('setWaypoints', waypoints)
    })
  }
}
</script>
