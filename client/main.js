import Vue from 'vue'
import App from './App'
import store from './store'
import config from './common/config'
import {
	checkVersion
} from './common/api'
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$config = config

Vue.prototype.checkVersion = function() {
	return new Promise((resolve, reject) => {
		try {
			let channel = config.channel;
			let versionCode = config.versionCode;
			// #ifdef APP-PLUS
			checkVersion({
				channel: channel,
				version_code: versionCode
			}).then(response => {
				if (response.data.app) {
					let app = response.data.app;
					if (app.flag == 1) {
						uni.showModal({
							title: '更新提示',
							content: app.msg,
							success: (res) => {
								if (res.confirm) {
									plus.runtime.openURL(app.down_url);
								}
							}
						})
					}
					resolve()
				} else {
					reject()
				}
			}).catch(error => {
				reject(error)
			})
			// #endif

			// reject()

		} catch (e) {
			reject(e)
		}
	});
}


Vue.prototype.disabledPullRefresh = function(disabled) {
	// #ifdef APP-PLUS
	const pages = getCurrentPages();
	const page = pages[pages.length - 1];
	const currentWebview = page.$getAppWebview();
	currentWebview.setStyle({
		pullToRefresh: {
			support: disabled,
			style: plus.os.name === 'Android' ? 'circle' : 'default'
		}
	})
	// #endif
}
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
