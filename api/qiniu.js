const {
  baseUrl,
  request
} = require('../utils/request')

/**
 * 获取七牛key
 */
export const getKey = (params) => {
  return request(`${baseUrl}/qiniu/key`, 'GET', params);
}

/**
 * 获取七牛token
 */
export const getToken = (params) => {
  return request(`${baseUrl}/qiniu/upload-token`, 'GET', params);
}