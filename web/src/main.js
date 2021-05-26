import { createApp } from "vue";

import routes from "./router.js";
import store from "./stores/index.js";

import BaseModal from "./components/BaseModal.vue";

import App from "./App.vue";

const app = createApp(App);

app.use(routes);
app.use(store);

app.component("BaseModal", BaseModal);

app.mount("#app");
