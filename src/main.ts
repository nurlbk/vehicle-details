import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import '@fortawesome/fontawesome-free/css/all.css';


import BootsrapVueNext from 'bootstrap-vue-next'


const app = createApp(App);


app
    .use(BootsrapVueNext)
    .use(store)
    .use(router)
    .mount('#app')
