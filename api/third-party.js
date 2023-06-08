const {
  baseUrl,
  request
} = require('../utils/request')

/**
 * 第三方登录
 */
export const thirdPartyRegister = (params) => {
  return request(`${baseUrl}/third-party/register`, 'POST', params);
}

/**
 * 
 */
export const updateUnbind = (data) => {
  return request(`${baseUrl}/third-party/unbind`, 'PUT', data);
}