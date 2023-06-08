const {
  request,
  baseUrl,
  tableUrl
} = require('../utils/request')

/**
 * 获取个人管理小区
 */
export const getUserLocation = (params) => {
  return request(`${baseUrl}/api/user-locations`, 'GET', params);
}

/**
 * 获取数据表格我管理的小区列表
 */
export const getTableLocationList = (data) => {
  return request(`${tableUrl}/yiku/shequ/location/record/search`, 'POST', data);
}