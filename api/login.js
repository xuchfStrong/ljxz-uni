import { http, httpForm } from '@/utils/request.js'
// import { httpForm } from '@/utils/requestForm.js'


// 新用户登录获取sessionid
export function acclogin(data, header) {
  return http.post(
    // 'http://sdk.xxhd-tech.com:8081/client.php?gameparam=acclogin',
    'http://ceinfo.cc:20181/ljxz/client.php?gameparam=acclogin',
    data,
    {header}
  )
}

// 大仙宗新用户登录获取sessionid
export function othersdkloginvalid(data, header) {
  return http.post(
    // 'http://sdk.xxhd-tech.com:8081/client.php?gameparam=othersdkloginvalid',
    'http://ceinfo.cc:20181/ljxz/client.php?gameparam=othersdkloginvalid',
    data,
    {header}
  )
}

// 通过验证码登录
export function regbyphone(data, header) {
  return http.post(
    // 'http://sdk.xxhd-tech.com:8081/client.php?gameparam=regbyphone',
    'http://ceinfo.cc:20181/ljxz/client.php?gameparam=regbyphone',
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
    'http://ceinfo.cc:20181/ljxz_douyin/sdk.php/User/user_login',
    data
  )
}

// 玄幻修真login
export function xuanhuanxiuzhenUserLogin(data) {
  return httpForm.post(
    // 'http://h5ym.xxhd-tech.com/acclogin.php?a_gameid=100089100189&a_gamekey=97fd54d2ced793d6&a_pub=ah5sdk_ljxz_001',
    'http://ceinfo.cc:20181/ljxz_xuanhuanxiuzhen/acclogin.php?a_gameid=100089100189&a_gamekey=97fd54d2ced793d6&a_pub=ah5sdk_ljxz_001',
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

