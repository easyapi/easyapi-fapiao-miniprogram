const { getShopList, handoverShop }  = require('../../../api/enterprise')
const { getAccount } = require('../../../api/account')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowShop: {},
    list: [],
    pageInfo: {
      page: 0,
      size: 100,
    },
    noData: false,
  },

  /**
   * 获取企业列表
   */
  getShopList() {
    getShopList(this.data.pageInfo).then(res => {
      if(res.data.code === 1){
        this.setData({
          list: this.data.list.concat(res.data.content.content)
        })
      }
    })
  },

  /**
   * 切换企业
   */
  changeShop(e) {
    handoverShop(e.currentTarget.dataset.item.shop.shopId).then(res => {
      if(res.data.code === 1) {
        wx.showToast({
          title: res.data.message,
        })
        this.getAccount()
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'error'
        })
      }
    })
  },

  /**
   * 更新我的信息
   */
  getAccount(){
    getAccount().then(res => {
      if(res.data.code === 1){
        wx.setStorageSync('user', res.data.content)
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }, 1000)
      }
    })
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
      nowShop: wx.getStorageSync('user').shop
    })
    this.getShopList()
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