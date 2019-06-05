import {
	getActivity,
	getCategorySub
} from "@/common/api"
const activity = {
	namespaced: true,
	state: {
		items: [],
	},
	mutations: {
		SET_ACTIVITY: (state, data) => {
			state.items = data
		}
	},
	actions: {

		GetActivity({
			commit
		}) {
			return new Promise((resolve, reject) => {
				getActivity().then(response => {
					const data = response.data.activity
					let items = []
					for (let i = 0, length = data.length; i < length; i++) {
						var item = data[i];
						items.push(item);
					}
					commit('SET_ACTIVITY', items)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		}
	},
	getters: {
		activitys: (state, getters, rootState) => {
			return state.items.map((item) => {
				return {
					id: item.id,
					image: item.image,
					url: item.url,
					text: item.name
				};
			});
		}
	}

}
export default activity
