import { http, httpForm } from '@/utils/request.js'


// 新用户登录获取sessionid
export function acclogin(data, header) {
  return http.post(
    // 'http://sdk.xxhd-tech.com:8081/client.php?gameparam=acclogin',
    'http://106.54.36.248:9080/ljxz/client.php?gameparam=acclogin',
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

