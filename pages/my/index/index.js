const {
  request
} = require('../../../utils/request')

const {
  baseUrl
} = require('../../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: getApp().globalData.logo,
    statusBarHeight: 0, //状态栏初始高度
    toBarHeight: 44, //标题栏高度：安卓：48px，iOS：44px;单位必需跟胶囊按钮一致，用p
    cusTitle: "个人中心",
    user: null,
    countDate: {}
  },
  /**
   * 
   */
  formSubmit(e) {
    if (e.detail.formId != 'the formId is a mock one') {
      let params = {
        wxFormId: e.detail.formId,
      }
      getWxForm(params).then(res => {})
    }
  },
  gotoUser() {
    wx.navigateTo({
      url: '/pages/my/setting/data/data',
    })
  },
  /**
   * 
   */
  jumpPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + '?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 
   */
  jumpPurse(e) {
    if (this.data.user) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else {
      wx.reLaunch({
        url: '/pages/login/login/login',
      })
    }
  },
  /**
   * 
   */
  jumpYue(e) {
    if (this.data.user) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else {
      wx.reLaunch({
        url: '/pages/login/login/login',
      })
    }
  },
  /**
   * 
   */
  jumpLogin() {
    if (!wx.getStorageSync("user")) {
      wx.navigateTo({
        url: '/pages/login/login/login',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let sysinfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sysinfo.statusBarHeight
    })
    let user = wx.getStorageSync("user");

    if (user) {
      this.setData({
        user: user
      })
      this.getCount();
    } else {
      this.setData({
        user: null,
        countDate: {}
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})