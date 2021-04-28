import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

const request = axios.create({
  // 配置选项
  // baseURL,
  // timeout
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  // 注意一定要返回config，否则请求就发不出去
  return config
}, function (error) {
  return Promise.reject(error)
})

let isRefreshing = false
// 存储刷新Token期间过来的401请求，更新token后要重发请求
let requests:any[] = []
// 响应拦截器
request.interceptors.response.use(function (response) {
  // 所有2xx的状态码都会进入这里
  return response
}, async function (error) {
  // 所有非2xx的状态码都进入这里
  if (error.response) {
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // 如果有refresh token，那么尝试使用refresh_token获取新的access_token，
      // 如果没有，跳转登录页
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }

      // 刷新token
      if (!isRefreshing) {
        isRefreshing = true // 开启刷新状态
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新Token失败')
          }

          // 刷新token成功了
          store.commit('setUser', res.data.content)
          // 执行requests中缓存的请求
          requests.forEach(cb => cb())
          // 重置requests数组
          requests = []
          return request(error.config)
        }).catch(err => {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(err)
        }).finally(() => {
          // 重置刷新状态
          isRefreshing = false
        })
      }

      // 刷新状态下，把请求挂起
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务器内部错误')
    }
  } else if (error.request) {

  } else {

  }

  // 把请求失败的错误对象继续抛出
  return Promise.reject(error)
})

export default request
