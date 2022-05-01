// //////////////////////////////////
//  RDF Storage Browsing Web Interface
//  Author: Tomas Kiss
//  Login: xkisst00
//  E-mail: xkisst00@stud.fit.vutbr.cz
//  University: Brno University of Technology (VUT FIT)
//  Purpose: Master theses project
//  Year: 2021/2022
// //////////////////////////////////

import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import router from "./router";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css";

import ConfirmationService from "primevue/confirmationservice";

const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.directive("tooltip", Tooltip);
app.mount("#app");
