import { http, httpForm } from '@/utils/request.js'
// import { httpForm } from '@/utils/requestForm.js'

// 获取远端选项信息
export function getRemoteOptions(params) {
  return http.get(
    '/ljxz/options.php',
    {params}
  )
}

// 获取更新信息
export function getUpdate(params) {
  return http.get(
    '/ljxz/update.php',
    {params}
  )
}

// 获取服务器信息
export function getServerInfo(params) {
  return http.get(
    '/ljxz/server.php',
    {params}
  )
}

// 获取服务器信息-渠道
export function getServerInfoChannel(params) {
  return http.get(
    '/ljxz/server_channel.php',
    {params}
  )
}

// 获取角色信息
export function getRoleInfo(params) {
  return http.get(
    '/ljxz/get_role_info.php',
    {params}
  )
}

// 获取配置信息
export function getConfigInfo(params) {
  return http.get(
    '/ljxz/get_role_settings.php',
    {params}
  )
}

// 修改配置信息
export function changeConfigInfo(data) {
  return http.post(
    '/ljxz/change_settings.php',
    data
  )
}

export function getDescription(params) {
  return http.get(
    '/ljxz//description.php',
    {params}
  )
}

export function getHelp(params) {
  return http.get(
    '/ljxz//help_info.php',
    {params}
  )
}

export function getGonglue(params) {
  return http.get(
    '/ljxz//gonglue.php',
    {params}
  )
}

export function startGuaji(params) {
  return http.get(
    '/ljxz/start.php',
    {params}
  )
}

export function stopGuaji(params) {
  return http.get(
    '/ljxz/stop.php',
    {params}
  )
}

export function getUtils(params) {
  return http.get(
    '/ljxz/utils.php',
    {params}
  )
}

// 转移时间
export function transferTime(data) {
  return httpForm.post(
    '/ljxz/transfer_time.php',
    data
  )
}

export function checkBayeSpecial(params) {
  return http.get(
    '/ljxz/check_special.php',
    {params}
  )
}
