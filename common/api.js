import http from '@/common/http'

export function getCategory() {
	return http.get('/api/category', {})
}
export function getGoods(params) {
	return http.get('/api/goods', params)
}
export function getActGoods(params) {
	return http.get('/api/goods/activity', params)
}
export function getRecommend(params) {
	return http.get('/api/goods/recommend', params)
}
export function getBanner() {
	return http.get('/api/banner')
}
export function getActivity(params) {
	return http.get('/api/activity', params)
}
export function getSearch() {
	return http.get('/api/search/worlds')
}
export function searchGoods(params) {
	return http.get('/api/search', params)
}
export function getGoodDetail(params) {
	return http.get('/api/goods/detail', params)
}
export function checkVersion(params){
	return http.get('/api/app/check_version',params)
}