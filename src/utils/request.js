// 数据请求模块：Ajax 封装
import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

// 创建 axios 实例
const request = axios.create({
  // timeout: 2000
  // baseURL:
  // headers:
})

function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  config.baseURL = getBaseURL(config.url)

  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
// 存储是否正在更新 token 的状态
let isRefreshing = false
// 存储因为等待 token 刷新二挂起的请求
let requests = []

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 状态码为 2xx 都会进入这里
  // console.log('请求响应成功了：', response)
  return response
}, function (error) {
  // 超出 2xx 都会进入这里
  if (error.response) {
    // 请求发送成功，也收到了响应，到状态码超过了2xx（常见错误处理位置）
    // 1. 保存状态码
    const { status } = error.response
    // 2. 判断
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // 1、 无 token 信息
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return requests.push(() => {
          request(error.config)
        })
      }
      isRefreshing = true
      // 2、 token 无效（错误 token；过期 token）
      // 发送请求，获取新的 token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        if (res.data.state !== 1) {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新 token 成功
        //  - 存储新的 token
        store.commit('setUser', res.data.content)
        //  - 重新发送失败的请求
        requests.forEach(callback => callback())
        //  - 发送完毕，清除 requests 内容
        requests = []
        //  - 将本次请求重新发送
        return request(error.config)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // 请求发送完毕，响应处理完毕，将刷新状态改为 false
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // 请求发送成功，但没有收到响应
    Message.error('请求超时，请重试')
  } else {
    // 在设置请求时发生了一些失去，触发了错误（未知型错误）
    Message.error(`请求失败${error.message}`)
  }
  // 将请i失败的错误对象继续抛出，传递给接收响应的处理函数
  return Promise.reject(error)
})

export default request
