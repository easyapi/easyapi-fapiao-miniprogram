const { connectBluetooth } = require('../../../../utils/bindBLE')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    devicesList: [],
  },

  //连接蓝牙
  connect(e) {
    let item = e.currentTarget.dataset.item
    connectBluetooth(item.deviceId, item.name)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      devicesList: getApp().globalData.arrBLE
    })
    setInterval(() => {
      this.setData({
        devicesList: getApp().globalData.arrBLE
      })
    }, 2000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})