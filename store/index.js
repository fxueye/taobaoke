import Vue from 'vue'
import Vuex from 'vuex'
import category from './modules/category'
import good from './modules/good'
import banner from './modules/banner'
import activity from './modules/activity'
import search from './modules/search'
import footprint from './modules/footprint'
Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        category,
		good,
		banner,
		activity,
		search,
		footprint
    }
})

export default store
