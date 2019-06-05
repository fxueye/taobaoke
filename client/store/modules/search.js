import {
	paseNum
} from "@/common/util"
import {
	getSearch,
	searchGoods
} from "@/common/api"
const search = {
	namespaced: true,
	state: {
		items: [],
		goods: {
			world: "",
			page: 1,
			data: []
		}
	},
	mutations: {
		SET_SEARCH: (state, data) => {
			state.items = data
		},
		ADD_GOODS: (state, data) => {
			state.goods.page = data.page;
			if (data.page == 1) {
				state.goods = data;
			}
			if (state.goods.world == data.world) {
				for (let i = 0, length = data.data.length; i < length; i++) {
					let good = data.data[i];
					if(data.push){
						state.goods.data.push(good);
					}else{
						state.goods.data.unshift(good);
					}
					
				}
			}
		}
	},
	actions: {
		GetSearch({
			commit
		}) {
			return new Promise((resolve, reject) => {
				getSearch().then(response => {
					const data = response.data.search
					commit('SET_SEARCH', data)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},
		SearchGoods({
			commit
		}, options) {
			const params = options;
			return new Promise((resolve, reject) => {
				searchGoods(params).then(response => {
					const data = response.data.goods
					commit('ADD_GOODS', {
						world: params.world,
						page: params.page,
						push:params.push,
						data: data
					})
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		}
	},
	getters: {
		searchs: (state, getters, rootState) => {

			return state.items.map((item) => {
				return {
					world: item.world
				}
			});
		},
		goods: (state, getters, rootState) => {

			let temp = {
				page: state.goods.page,
				world: state.goods.world,
				data: []
			}
			temp.data = state.goods.data.map((good) => {
				return {
					dtitle: good.dtitle,
					id: good.id,
					goods_id: good.goods_id,
					main_pic: good.main_pic,
					// title: good.title,
					istmall: (good.shop_type == '1' ? true : false),
					original_price: good.original_price,
					sales_num: paseNum(good.month_sales),
					price: good.actual_price,
					coupon_price: parseFloat(good.coupon_price)
				}
			})
			return temp;
		}
	}

}
export default search
