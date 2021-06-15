import Vue from 'vue';
import App from './App.vue';

// Importation de fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Importation de Vue Router
import router from './router';

// Ajout d'une librairie d'icons fontawesome
library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
