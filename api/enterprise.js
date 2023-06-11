const {
  request,
  baseUrl
} = require('../utils/request')

/**
 * 获取用户企业关系列表获取用户企业关系列表
 */
export const getShopList = (params) => {
  return request(`${baseUrl}/user/user-shops`, 'GET', params);
}

/**
 * 切换企业
 */
export const handoverShop = (id) => {
  return request(`${baseUrl}/shop/${id}/handover`, 'POST');
}

/**
 * 获取企业发票服务类型
 */
export const getCustomCategory = (params) => {
  return request(`${baseUrl}/custom-categories`, 'GET', params);
}