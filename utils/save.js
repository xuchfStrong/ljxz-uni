// 管理登录信息
const LOGIN_KEY = 'LOGIN_KEY';
const SERVER_KEY = 'SERVER_KEY';
const ROLE_KEY = 'ROLE_KEY'

const getGameLoginInfo = function () {
    let ret = '';
    ret = uni.getStorageSync(LOGIN_KEY);
    if (!ret) {
        ret = '{}';
    }
    return JSON.parse(ret);
}

const setGameLoginInfo = function (gameLoginInfo) {
    uni.setStorageSync(LOGIN_KEY, JSON.stringify(gameLoginInfo));
}

const getServerInfo = function () {
  let ret = '';
  ret = uni.getStorageSync(SERVER_KEY);
  if (!ret) {
      ret = '{}';
  }
  return JSON.parse(ret);
}

const setServerInfo = function (serverInfo) {
  uni.setStorageSync(SERVER_KEY, JSON.stringify(serverInfo));
}

const getRoleList = function () {
  let ret = '';
  ret = uni.getStorageSync(ROLE_KEY);
  if (!ret) {
      ret = '[]';
  }
  return JSON.parse(ret);
}

const setRoleList = function (roleList) {
  uni.setStorageSync(ROLE_KEY, JSON.stringify(roleList));
}

const getViewConfigLocal = function () {
  let ret = '';
  ret = uni.getStorageSync('viewConfigWdsz');
  if (!ret) {
    return '';
  } else {
    return JSON.parse(ret);
  }
}

const setViewConfigLocal = function (viewConfig) {
  uni.setStorageSync('viewConfigWdsz', JSON.stringify(viewConfig));
}

export default {
  getGameLoginInfo,
  setGameLoginInfo,
  getServerInfo,
  setServerInfo,
  getRoleList,
  setRoleList,
  getViewConfigLocal,
  setViewConfigLocal
}