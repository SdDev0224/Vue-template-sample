import Vue from 'vue'
import router from './router'
import App from './App'
import store from './state'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueObserveVisibility from 'vue-observe-visibility'
import Vuelidate from 'vuelidate'
import Buefy from 'buefy'
import VCalendar from 'v-calendar'
import VueStripeCheckout from 'vue-stripe-checkout'

// Styles
import './styles/base.scss'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'v-calendar/lib/v-calendar.min.css'

const stripeCheckoutOptions = {
  key: 'pk_test_IkQeLppEHwtTJxmbknDrBXdD', // TODO: Check for env, set accordingly
  image: require('@/assets/img/logo@1x.svg'), // Switch to raster to prevent overflow
  locale: 'auto',
  currency: 'EUR',
  billingAddress: false,
  panelLabel: 'Pay {{amount}}'
}

Vue.use(VueStripeCheckout, stripeCheckoutOptions)

Vue.config.productionTip = false

// Plugins
Vue.use(Vuelidate)
// Vue.use(BootstrapVue)
Vue.use(Buefy, {
  defaultIconPack: 'fas'
})
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCXzXeWA9TjvTaYepmZw_63_k1WFwglUNQ',
    libraries: 'drawing'
  }
})
Vue.use(VCalendar, {
  firstDayOfWeek: 2
})
Vue.use(VueObserveVisibility)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
