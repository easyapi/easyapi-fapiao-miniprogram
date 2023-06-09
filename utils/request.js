const tableUrl = 'https://table-api.easyapi.com'
const docUrl = 'https://doc-api.easyapi.com'
const baseUrl = 'https://fapiao-api-test.easyapi.com';

module.exports.baseUrl = baseUrl
module.exports.tableUrl = tableUrl
module.exports.docUrl = docUrl

/**
 * 请求基础方法
 */
module.exports.request = async function (url, method, data, header) {
  let requestMethod = method.toUpperCase() || "GET";
  let requestData = data || {};
  let requestHeader = header || {
    'content-type': 'application/json'
  };
  if (url.indexOf(baseUrl) > -1) {
    let authorization = wx.getStorageSync('Authorization');
    if (authorization) {
      requestHeader['Authorization'] = authorization
    }
  }
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: requestData,
      method: requestMethod,
      header: requestHeader,
      success: function (res) {
        wx.hideLoading()
        if (res.data.code === -9) {
          wx.clearStorageSync();
          wx.redirectTo({
            url: '/pages/login/login/login',
          })
        } else if (res.data.code === -1) {
          wx.showToast({
            title: res.data.message,
            duration: 2000,
            icon: 'none'
          });
        }
        resolve(res)
      },
      fail: function (error) {
        wx.hideLoading()
        reject
      }
    })
  });
  return promise;
};