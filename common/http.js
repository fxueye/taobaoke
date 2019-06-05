import Request from '@/common/request'
import Config from '@/common/config'
const http = new Request()

http.setConfig((config) => {
	config.baseUrl = Config.server
	config.responseType = "json"
	return config
})

// 拦截器
http.interceptor.request((config, cancel) => { 
	return config;
})
http.interceptor.response((response) => {
	// console.log(response)
	
	const res = response.data;
	if(res.code !== '20000'){
		//TODO
		return Promise.reject(res);
	}else{
		return response.data;
	}
})

export default http
