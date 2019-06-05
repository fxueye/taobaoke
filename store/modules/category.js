import {
	getCategory
} from "@/common/api"
const category = {
	namespaced: true,
	state: {
		items: []
	},
	mutations: {
		SET_CATEGORYS: (state, categorys) => {
			state.items = categorys
		}
	},
	actions: {
		GetCategory({
			commit
		}) {
			return new Promise((resolve, reject) => {
				getCategory().then(response => {
					const data = response.data.categorys
					commit('SET_CATEGORYS', data)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		}
	},
	getters: {
		tcategorys: (state, getters, rootState) => {
			return state.items;
		},
		categorys: (state, getters, rootState) => {
			let temp = state.items.slice()
			temp.unshift({
				id: 0,
				name: "精选",
				sub_categorys: []
			})
			return temp;
		},
		gcategorys: (state, getters, rootState) => {
			let temp = state.items.slice()
			temp.unshift({
				id: 0,
				name: "精选",
				sub_categorys: []
			})
			return temp.map((item) => {

				let gtemp = {
					id: item.id,
					text: item.id,
					image: item.icon,
					sub_categorys: []
				}

				gtemp.sub_categorys = item.sub_categorys.map((sub) => {
					return {
						id: sub.id,
						text: sub.name,
						image: sub.icon
					}
				})
				return gtemp
			})
		}
	}
}
export default category
