const {
  updateUnbind
} = require('../../../../api/third-party')

import Dialog from '../../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginSuccess: getApp().globalData.loginSuccess
  },

  jumpPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + '?id=' + e.currentTarget.dataset.id,
    })
  },

  logout() {
    Dialog.confirm({
        title: '您确认退出吗？',
      })
      .then(() => {
        let data = {
          providerUserId: wx.getStorageSync('openid'),
          providerId: 'miniprogram',
        }
        updateUnbind(data).then(res => {
          if (res.data.code == 1) {
            wx.showToast({
              title: "退出成功",
              icon: 'none',
              duration: 4000
            })
            wx.clearStorageSync()
            wx.switchTab({
              url: '/pages/home/index/index',
            })
          }
        })
      })
      .catch(() => {
        // on cancel

      });
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