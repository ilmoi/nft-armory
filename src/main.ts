import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';
// import VueGtag from 'vue-gtag';

createApp(App)
  .use(router)
  // .use(VueGtag, {
  //   config: { id: 'G-6MN98MZZPL' },
  // })
  .mount('#app');
