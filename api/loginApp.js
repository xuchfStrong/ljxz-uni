import { http, httpForm } from '@/utils/request.js'


// 新用户登录获取sessionid
export function acclogin(data, header) {
  return http.post(
    'http://sdk.xxhd-tech.com:8081/client.php?gameparam=acclogin',
    data,
    {header}
  )
}

// 大仙宗新用户登录获取sessionid
export function othersdkloginvalid(data, header) {
  return http.post(
    'http://sdk.xxhd-tech.com:8081/client.php?gameparam=othersdkloginvalid',
    data,
    {header}
  )
}

// 通过验证码登录
export function regbyphone(data, header) {
  return http.post(
    'http://sdk.xxhd-tech.com:8081/client.php?gameparam=regbyphone',
    data,
    {header}
  )
}


// 抖音login
export function douyinUserLogin(data) {
  return http.post(
    'http://game.cross2.cn/sdk.php/User/user_login',
    data
  )
}

// 玄幻修真login
export function xuanhuanxiuzhenUserLogin(data) {
  return httpForm.post(
    'http://h5ym.xxhd-tech.com/acclogin.php?a_gameid=100089100189&a_gamekey=97fd54d2ced793d6&a_pub=ah5sdk_ljxz_001',
    data
  )
}

