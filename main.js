import Vue from 'vue'
import App from './App'
import global from '@/utils/global'
import { toast } from '@/utils/index'
import store from './store'  

Vue.prototype.$store = store  
Vue.prototype.$global = global
Vue.prototype.$toast = toast
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
