import {
	paseNum
} from "@/common/util"
import {
	getGoods,
	getRecommend,
	getActGoods,
	getGoodDetail
} from "@/common/api"
const good = {
	namespaced: true,
	state: {
		items: [],
		recommend: {
			page: 1,
			data: []
		},
		actGoods: {
			page: 1,
			data: []
		},
		good: {}
	},
	mutations: {
		ADD_GOODS: (state, data) => {
			let item = state.items[data.cid]
			item.page = data.page;
			for (let i = 0, length = data.goods.length; i < length; i++) {
				let good = data.goods[i];
				if (data.push) {
					item.data.push(good)
				} else {
					item.data.unshift(good)
				}
			}
		},
		ADD_RECOMMEND_GOODS: (state, data) => {

			state.recommend.page = data.page;
			if (data.page == 1) {
				state.recommend.data = data.goods
			} else {
				for (let i = 0, length = data.goods.length; i < length; i++) {
					let good = data.goods[i];
					if (data.push) {
						state.recommend.data.push(good);
					} else {
						state.recommend.data.unshift(good);
					}
				}
			}

		},
		ADD_ACTGOODS: (state, data) => {
			state.actGoods.page = data.page;
			if (data.page == 1) {
				state.actGoods.data = data.goods;
			} else {
				for (let i = 0, length = data.goods.length; i < length; i++) {
					let good = data.goods[i];
					if(data.push){
						state.actGoods.data.push(good);
					}else{
						state.actGoods.data.unshift(good);
					}
				}
			}
		},
		INIT_GOODS: (state, data) => {
			let items = []
			for (let i = 0, length = data.length; i < length; i++) {
				let cid = data[i].id
				let item = {
					cid: cid,
					page: 1,
					data: []
				}
				items[cid] = item
			}
			state.items = items
			// console.log(state.items)
		},
		SET_GOOD: (state, data) => {
			state.good = data;
		}
	},
	actions: {
		GetGoods({
			commit
		}, options) {
			const params = options;
			return new Promise((resolve, reject) => {
				getGoods(params).then(response => {
					const goods = response.data.goods
					commit('ADD_GOODS', {
						push: params.push,
						cid: params.cid,
						page: params.page,
						goods: goods
					})
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},
		GetActGoods({
			commit
		}, options) {
			const params = options;
			return new Promise((resolve, reject) => {
				getActGoods(params).then(response => {
					const goods = response.data.goods
					commit('ADD_ACTGOODS', {
						push:params.push,
						page: params.page,
						goods: goods
					})
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},
		InitGoods({
			commit
		}, options) {
			commit('INIT_GOODS', options)
		},
		GetRecommend({
			commit
		}, options) {
			const params = options;
			return new Promise((resolve, reject) => {
				getRecommend(params).then(response => {
					const goods = response.data.goods
					commit('ADD_RECOMMEND_GOODS', {
						push: params.push,
						page: params.page,
						goods: goods
					})
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},
		GetGoodDetail({
			commit,
			dispatch
		}, options) {
			const params = options;
			return new Promise((resolve, reject) => {
				getGoodDetail(params).then(response => {
					const good = response.data.good;
					commit('SET_GOOD', good);
					dispatch('footprint/AddGoods', good, {
						root: true
					})
					resolve();
				}).catch(error => {
					reject(error)
				})
			})

		}
	},
	getters: {
		goods: (state, getters, rootState) => {
			return state.items.map((item) => {

				let temp = {
					cid: item.cid,
					page: item.page,
					data: {},
				}
				temp.data = item.data.map((good) => {
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
						coupon_price: parseFloat(good.coupon_price),
						coupon_total_num: good.coupon_total_num,
						coupon_receive_num: good.coupon_receive_num,
						coupon_end_time: good.coupon_end_time
					}
				});
				return temp;
			});
		},
		actGoods: (state, getters, rootState) => {
			let temp = {
				page: state.actGoods.page,
				data: []
			}
			temp.data = state.actGoods.data.map((good) => {
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
					coupon_price: parseFloat(good.coupon_price),
					coupon_total_num: good.coupon_total_num,
					coupon_receive_num: good.coupon_receive_num,
					coupon_end_time: good.coupon_end_time
				}
			})
			return temp;
		},
		recommend: (state, getters, rootState) => {

			let temp = {
				page: state.recommend.page,
				data: {}
			}
			temp.data = state.recommend.data.map((good) => {
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
					coupon_price: parseFloat(good.coupon_price),
					coupon_total_num: good.coupon_total_num,
					coupon_receive_num: good.coupon_receive_num,
					coupon_end_time: good.coupon_end_time
				}
			})

			return temp;
		},
		good: (state, getters, rootState) => {
			return state.good;
		}
	}

}
export default good
