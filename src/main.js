import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './Plugins/vuetify'; // You need to create this file

const app = createApp(App);
app.use(vuetify);
app.mount('#app');
