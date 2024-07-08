import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VueNativeSock from 'vue-native-websocket-vue3';
import App from './App.vue';
import vuetify from './Plugins/vuetify'; // You need to create this file
import router from './router';

const app = createApp(App);
const pinia = createPinia()

app.use(vuetify);
app.use(router);
app.use(pinia);
app.use(VueNativeSock, 'ws://localhost:3000', {
  format: 'json',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
});

app.mount('#app');
