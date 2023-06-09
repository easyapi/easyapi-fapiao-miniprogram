const {
  request,
  baseUrl
} = require('../utils/request')

/**
 * 获取个人信息
 */
export const login = (data) => {
  return request(`${baseUrl}/authenticate`, 'POST', data);
}