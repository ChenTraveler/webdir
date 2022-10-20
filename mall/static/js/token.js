// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    if (response.data.status === 1 && response.data.message === '身份认证失败') {
      location.href = '/login'
    }
    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
let uname = null
axios({
  method: 'post',
  url: '/token'
})
  .then(d => {
    uname = d.data
  })
  .catch(err => err)
