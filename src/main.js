import Vue from "vue";
import App from "./App.vue";
import "@/assets/css/tailwind.css";

import Chartkick from "vue-chartkick";

import Highcharts from "highcharts";

import { VueSpinners } from "@saeris/vue-spinners";

import router from "@/router";
import { dollarFilter } from "@/filters";
import { percentageFilter } from "@/filters";
Vue.use(Chartkick.use(Highcharts));
Vue.use(VueSpinners);
Vue.filter("dollar", dollarFilter);
Vue.filter("percentage", percentageFilter);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
