export default class RequestCloud {
	config = {
		contentType: 'json',
		dataType: 'json'
	}
	
	setConfig(f) {
	  this.config = f(this.config)
	}
	
	// 这种写法和下面的在回调函数种直接返回Promise.reslove和Promise.reject效果是一样的
	async requestOld(options = {}) {
		return new Promise((resolve, reject) => {
			uniCloud.callFunction({
				name:"wdszproxy",
				data: {
					"url": options.url,
					"method": options.method,
					"header": options.header || {},
					"contentType": options.contentType || this.config.contentType,
					"data": options.data || {},
					"dataType": options.dataType || this.config.dataType
				},
				success: (e) => {
					resolve(e.result)
				},
				fail: (e) => {
					reject(e)
				}
			})
		})
	}
	
	async request(options = {}) {
		return uniCloud.callFunction({
			name:"wdszproxy",
			data: {
				"url": options.url,
				"method": options.method,
				"header": options.header || {},
				"contentType": options.contentType || this.config.contentType,
				"data": options.data || {},
				"dataType": options.dataType || this.config.dataType
			}
		}).then(res => {
			return Promise.resolve(res.result)
		}).catch(err => {
			return Promise.reject(err)
		})
	}
	
	get(url, options = {}) {
		return this.request({
		  url,
		  method: 'GET',
			header: options.header,
			data: options.params,
		  ...options
		})
	}
	
	post(url, data, options = {}) {
	  return this.request({
	    url,
	    data,
	    method: 'POST',
			header: options.header,
	    ...options
	  })
	}
}