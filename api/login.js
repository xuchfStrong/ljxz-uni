import { http, httpForm } from '@/utils/request.js'


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

