import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import { VueCookieNext } from "vue-cookie-next";

import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css";

const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(VueCookieNext);
app.directive("tooltip", Tooltip);
app.mount("#app");

// set default expiration config
VueCookieNext.config({ expire: -1 });
