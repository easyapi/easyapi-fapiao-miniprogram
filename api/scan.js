const {
  request,
  baseUrl,
} = require('../utils/request')

/**
 * 商户打印二维码小票
 */
export const createScan = (data) => {
  return request(`${baseUrl}/scan/print`, 'POST', data);
}

/**
 * 获取商店门户信息
 */
export const getShop = (id) => {
  return request(`${baseUrl}/shop/${id}`, 'GET');
}


/**
 * 获取参数信息
 */
export const findFieldKeyList = (params) => {
  return request(`${baseUrl}/setting/find`, 'GET', params);
}