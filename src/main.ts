import { createApp } from 'vue';
import router from '@/router';
import { createPinia } from 'pinia';
import App from './App';

import '@/assets/scss/global.scss';
import '@/assets/scss/reset-ele.scss';
import '@/assets/scss/custom-message.scss';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount('#app');
