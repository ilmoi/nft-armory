import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';
import VueGtag from 'vue-gtag';
import 'bootstrap/dist/css/bootstrap.min.css'
//import './bootstrap.min.css';
import './style.css';

if (process.env.VUE_APP_MAINNET_URL && process.env.VUE_APP_MAINNET_URL!.includes('genesysgo')) {
  console.log('powered by gg');
}

createApp(App)
  .use(router)
  .use(VueGtag, {
    config: { id: 'G-6MN98MZZPL' },
  })
  .mount('#app');
