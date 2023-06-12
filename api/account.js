const {
  request,
  baseUrl
} = require('../utils/request')

/**
 * 获取个人信息
 */
export const getAccount = (params) => {
  return request(`${baseUrl}/account`, 'GET', params);
}
//  类似这个的
/**
 * 修改个人信息
 */
export const updateAccount = (data) => {
  return request(`${baseUrl}/account`, 'PUT', data);
}

/**
 * 登录
 */
export const login = (data) => {
  return request(`${baseUrl}/authenticate`, 'POST', data);
}