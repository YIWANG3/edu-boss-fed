import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string,
  password: string
}

// 用户请求相关的模块
export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // 这里header可以省略，axios检测到qs.stringify后的数据，会自动使用x-www-form-urlencoded
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data) // axios 默认发送的是 application/json 格式的数据，这里应该用x-www-form-urlencoded
  })
}

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}
