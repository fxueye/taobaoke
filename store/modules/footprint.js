import {
	string2Date,paseNum
} from "@/common/util"
const footprint = {
	namespaced: true,
	state: {
		goods: []
	},
	mutations: {
		SET_GOODS: (state, goods) => {
			state.goods = goods
		},
		ADD_GOOD: (state, good) => {
			var has = function(g){
				for(var gd of state.goods){
					if(gd.id == g.id){
						return true;
					}
				}
				return false;
			}
			if(!has(good)){
				state.goods.push(good)
			}
			uni.setStorageSync('footprint_goods', state.goods)
		},
		CLEAN_GOODS:(state) =>{
			state.goods = []
			uni.setStorageSync('footprint_goods', state.goods)
		},
		CLEAN_INVALID_GOODS:(state)  =>{
			let now =new Date()
			for(let i = state.goods.length -1;i >= 0; i--){
				let g = state.goods[i];
				let end =new Date(g.coupon_end_time);
				if(end < now){
					state.goods.splice(i,1);
				}
			}
		}
		
	},
	actions: {
		GetGoods({
			commit
		}) {
			return new Promise((resolve, reject) => {
				try{
					let goods = uni.getStorageSync('footprint_goods')
					if (goods) {
						commit('SET_GOODS', goods)
					}
					resolve()
				}catch(e){
					reject(e)
				}
				
			})
		},
		AddGoods({
			commit
		}, good) {
			return new Promise((resolve, reject) => {
				commit('ADD_GOOD', good)
				resolve()
			})
		},
		CleanGoods({commit}){
			return new Promise((resolve, reject) => {
				commit('CLEAN_GOODS')
				resolve()
			})
		},
		CleanInvalidGoods({commit}){
			return new Promise((resolve, reject) => {
				commit('CLEAN_INVALID_GOODS')
				resolve()
			})
		}
	},
	getters: {
		goods: (state, getters, rootState) => {
			let temp = []
			let now =new Date()
			for(var g of state.goods){
				let end =string2Date(g.coupon_end_time)
				console.log(now)
				console.log(end)
				if(end > now){
					temp.push(g)	
				}
			}
			return temp.map((good)=>{
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
			
		},
		invalidGoods:(state,getters,rootState)=>{
			let temp = []
			let now =new Date()
			for(var g of state.goods){
				let end =string2Date(g.coupon_end_time)
				if(end < now){
					temp.push(g)	
				}
			}
			return temp.map((good)=>{
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

		}
	}

}
export default footprint
