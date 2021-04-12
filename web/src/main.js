import { createApp } from "vue";

import routes from "./router.js";
import store from "./stores/index.js";

import App from "./App.vue";

const app = createApp(App);

app.use(routes);
app.use(store);

app.mount("#app");
