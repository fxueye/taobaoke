import {
	getBanner
} from "@/common/api"
const banner = {
	namespaced: true,
	state: {
		items: []
	},
	mutations: {
		SET_BANNER: (state, banner) => {
			state.items = banner
		}
	},
	actions: {
		GetBanner({
			commit
		}) {
			return new Promise((resolve, reject) => {
				getBanner().then(response => {
					const data = response.data.banner
					commit('SET_BANNER', data)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		}
	},
	getters: {
		banners: (state, getters, rootState) => {
			// console.log(state.items)
			let temp = []
			for (var item of state.items) {
				// console.log(item)
				if (item.type == 1) {
					temp.push(item);
				}
			}
			state.items.map((item) => {
				return {
					image: item.image,
					url: item.url,
					activity_type: item.activity_type
				}
			});
			return temp.map((item) => {
				return {
					image: item.image,
					url: item.url,
					activity_type: item.activity_type
				}
			});
		},
		index_1: (state, getters, rootState) => {
			let temp = {}
			for (var item of state.items) {
				if (item.type == 2) {
					temp = item;
					break;
				}
			}
			return temp;

		}
	}

}
export default banner
