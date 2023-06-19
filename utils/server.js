const appKey = 'SFB9LGSypeHjWB1O';
const appSecret = 'bkosxt7y6szsf2qy';
const shopUrl = 'https://shop-api-v2.easyapi.com';
const baseUrl = 'https://api.yhryj8.com';

//微商城请求
module.exports.ajax = function(url, method, data, header) {
  wx.showLoading({
    title: '加载中',
  })

  let requestMethod = method.toUpperCase() || "GET";
  let requestData = data || {};
  let requestHeader = header || {
    'content-type': 'application/json'
  };
  requestData.appKey = appKey;
  requestData.appSecret = appSecret;

  var promise = new Promise(function(resolve, reject) {
    wx.request({
      url: shopUrl + url,
      data: requestData,
      method: requestMethod,
      header: requestHeader,
      success: function(res) {
        wx.hideLoading()
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

//用户基本请求
module.exports.http = function(url, method, data, header) {
  wx.showLoading({
    title: '加载中',
  })

  let requestMethod = method.toUpperCase() || "GET";
  let requestData = data || {};
  let requestHeader = header || {
    'content-type': 'application/json'
  };
  var promise = new Promise(function(resolve, reject) {
    let token = wx.getStorageSync('token');
    if (token) {
      requestHeader['Authorization'] = token
    }
    wx.request({
      url: baseUrl + url,
      data: requestData,
      method: requestMethod,
      header: requestHeader,
      success: function(res) {
        wx.hideLoading()
        if (res.data.code === -9) {
          wx.clearStorage()
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