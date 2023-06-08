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

/**
 * 修改个人信息
 */
export const updateAccount = (data) => {
  return request(`${baseUrl}/account`, 'PUT', data);
}

/**
 * 
 */
export const login = (data) => {
  return request(`${baseUrl}/account/login`, 'POST', data);
}