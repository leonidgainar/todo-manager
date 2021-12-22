import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

import router from "./router";
import store from "./store";
import VeeValidatePlugin from "./plugin/validation";

const app = createApp(App);

app.use(router);
app.use(store);
app.use(VeeValidatePlugin);

app.mount("#app");
