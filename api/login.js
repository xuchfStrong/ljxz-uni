import { http, httpForm } from '@/utils/request.js'
// import { httpForm } from '@/utils/requestForm.js'


// 新用户登录获取sessionid
export function acclogin(data, header) {
  return http.post(
    // 'http://sdk.xxhd-tech.com:8081/client.php?gameparam=acclogin',
    'http://120.53.14.241:9080/ljxz/client.php?gameparam=acclogin',
    data,
    {header}
  )
}

// 大仙宗新用户登录获取sessionid
export function othersdkloginvalid(data, header) {
  return http.post(
    // 'http://sdk.xxhd-tech.com:8081/client.php?gameparam=othersdkloginvalid',
    'http://120.53.14.241:9080/ljxz/client.php?gameparam=othersdkloginvalid',
    data,
    {header}
  )
}

// 通过验证码登录
export function regbyphone(data, header) {
  return http.post(
    // 'http://sdk.xxhd-tech.com:8081/client.php?gameparam=regbyphone',
    'http://120.53.14.241:9080/ljxz/client.php?gameparam=regbyphone',
    data,
    {header}
  )
}

// 用户登录Checkidcard
export function checkidcard(data, header) {
  return http.post(
    'http://sdk.xxhd-tech.com:8081/client.php?gameparam=checkidcard',
    data,
    {header}
  )
}

// 抖音login
export function douyinUserLogin(data) {
  return http.post(
    // 'http://game.cross2.cn/sdk.php/User/user_login',
    'http://120.53.14.241:9080/ljxz_douyin/sdk.php/User/user_login',
    data
  )
}

// 新用户登录，添加到辅助后台
export function addUser(data) {
  return httpForm.post(
    '/ljxz/add_user.php',
    data
  )
}

export function checkUserStatus(params) {
  return http.get(
    '/ljxz/check_user.php',
    {params}
  )
}

// 获取远端选项信息
export function getRemoteOptions(params) {
  return http.get(
    '/ljxz/options.php',
    {params}
  )
}

