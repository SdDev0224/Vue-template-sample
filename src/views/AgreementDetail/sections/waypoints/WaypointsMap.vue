<template>
  <GmapMap
    :center="defaultCenter"
    :zoom="default_zoom"
    :options="{disableDoubleClickZoom, disableDefaultUI}"
    class="map"
    ref="mapRef"
    v-observe-visibility="onMapShow"
    :clickable="isMapActive"
    @click="onMapClick"
    @dblclick="onMapDblClick"
  >
    <GmapMarker
      :key="index"
      v-for="(m, index) in waypoints"
      :position="{lat: m.latitude, lng: m.longitude}"
      :clickable="isMapActive"
      :draggable="isMapActive"
      @click="onMarkerClick(m, $event)"
      @dragstart="onDragStart(m, $event)"
      @drag="onDrag(m, $event)"
      @dragend="onDragEnd(m, $event)"
      :icon="icon(m, index)"
    />
    <GmapPolyline
      :path="polylineCoordinates"
      :options="polylineOptions"
    />
  </GmapMap>
</template>

<script>
// TODO: ENABLE LINTER AND FOLLOW STYLEGUIDE...
/* eslint-disable */
import { mapGetters, mapActions } from "vuex";

export default {
  name: "WaypointsMap",
  props: {
    isMapActive: {
      type: Boolean,
      default: true
    },
    disableDefaultUI: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disableDoubleClickZoom: false,
      loading: false,
      polylineOptions: {
        // editable: true,
        strokeColor: "#000",
        strokeOpacity: 1.0,
        strokeWeight: 2
      },
      default_zoom: 10,
      defaultCenter: {
         lat: 43.293461,
         lng: 6.646186
      }
    };
  },
  computed: {
    ...mapGetters(["waypoints", "createNew", "cruiseId", "current", "waiting"]),
    polylineCoordinates() {
      return this.waypoints.map(item => {
        return {
          lat: item.latitude,
          lng: item.longitude
        };
      });
   }
  },

  methods: {
    ...mapActions([
      "setCreateNew",
      "addNewWaypoint",
      "setCurrent",
      "saveWaypoint"
    ]),
    onMapDblClick(event) {
      console.log('dbl click')
      this.is_click = false
   },
    onMapClick(event) {
      this.is_click = true
      var update_timeout = setTimeout(function(){
         console.log(this)
         console.log(this.is_click)
          if (this.is_click) {
             console.log('is click')
             // if (!this.createNew) return;
             let latitude = event.latLng.lat();
             let longitude = event.latLng.lng();
             this.addNewWaypoint({
               latitude,
               longitude
             }).catch(error => console.log(error));
          }
      }.bind(this), 300);
    },
    onMarkerClick(marker, $event) {
      if (marker) {
        this.setCurrent(marker);
        this.setCreateNew(false);
      } else {
        this.onMapClick($event);
      }
    },
    onDragStart(marker, $event) {
      console.log(marker)
      // marker.icon.fillColor = '#F00';
    },
    onDrag(marker, $event) {
      marker.latitude = $event.latLng.lat();
      marker.longitude = $event.latLng.lng();
    },
    onDragEnd(marker, $event) {
      marker.latitude = $event.latLng.lat();
      marker.longitude = $event.latLng.lng();
      this.saveWaypoint(marker)
        .then(() => {
          if (marker.id !== this.current.id) {
            this.setCurrent(marker);
          }
        })
        .catch(error => console.log(error));
    },
    onMapShow(isVisible) {
      if (!isVisible) return;
      this.centerAndFit();
    },
    centerAndFit() {
      if (this.waypoints.length === 0)
         return
      this.$refs.mapRef.$mapPromise.then(map => {
         if (this.waypoints.length === 1) {
             this.defaultCenter = {
                lat: this.waypoints[0].lat,
                lng: this.waypoints[0].lng
             };
             map.setCenter(this.defaultCenter);
          } else {
            this.$refs.mapRef.resizePreserveCenter();
            let bounds = new window.google.maps.LatLngBounds();
            this.waypoints.forEach(marker => {
             bounds.extend(
               new window.google.maps.LatLng(marker.latitude, marker.longitude)
             );
            });
            map.fitBounds(bounds);
            window.google.maps.event.trigger(map, "resize");
            this.$refs.mapRef.resizePreserveCenter();
         }
      });
    },
    icon(marker, index) {
      return getIcon(
        marker,
        this.default_zoom,
        index + 1,
        this.current,
        this.waypoints
      );
    }
  },

  watch: {
    waypoints(newVal, oldVal) {
      if (newVal.length === 0) {
        this.$store.dispatch("setCreateNew", true);
      }
   },
    waiting(newVal, oldVal) {
      if ((oldVal == true) && (newVal == false)) this.centerAndFit()
   }
  }
};

/**
 *
 * @param marker
 * @param zoom
 * @param currentIndex
 * @returns {{path: *, scale: number, fillColor: *, fillOpacity: number, strokeOpacity: number, strokeWeight: number}}
 */
const getIcon = (marker, zoom, currentIndex, current, waypoints) => {
  let size = 4;
  if (zoom > 6) {
    size = 6;
  }
  const markerColor = {
    default: "#000",
    first: "#35C220",
    isCall: "#2D7F28",
    current: "#3C98D9",
    last: "#CF2F20"
  };
  let strokeColor = markerColor.default;
  let color = markerColor.default;
  if (marker.is_call) {
    color = markerColor.isCall;
  }
  if (currentIndex === 1) {
    color = markerColor.first;
  }
  if (currentIndex === waypoints.length) {
    color = markerColor.last;
  }
  if (current && current.id === marker.id) {
    color = markerColor.current;
    strokeColor = markerColor.current;
  }
  let icon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: size,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: strokeColor,
    strokeOpacity: 1.0,
    strokeWeight: 2
  };
  return icon;
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
  min-height: 456px;
}

.infobar {
  padding: 10px;
}
</style>
