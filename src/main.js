import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './Plugins/vuetify'; // You need to create this file
import router from './router';

const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);

app.use(vuetify);
app.use(router);
app.use(pinia);

app.mount('#app');
