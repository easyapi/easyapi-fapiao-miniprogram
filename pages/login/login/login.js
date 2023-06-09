const { login } = require('../../../api/user')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      username: '',
      password: '',
    }
  },

  /**
   * 获取手机号
   */
  inputUsername(event){
    this.setData({
      'userInfo.username': event.detail
    })
  },

  /**
   * 获取密码
   */
  inputPassword(event){
    this.setData({
      'userInfo.password': event.detail
    })
  },

  /**
   * 登录
   */
  login(){
    if( !this.data.userInfo.username ){
      wx.showToast({
        title: '请输入登陆手机号',
        icon: 'none'
      })
      return
    }
    if( !this.data.userInfo.password ){
      wx.showToast({
        title: '请输入登陆密码',
        icon: 'none'
      })
      return
    }
    login(this.data.userInfo).then(res => {
      if(res.data.code === 1){
        wx.setStorageSync('Authorization', res.data.id_token)
        wx.showToast({
          title: res.data.message,
          success: (res) => {
            wx.redirectTo({
            url: '/pages/index/index',
          })
         },
       })  
      }else{
        wx.showToast({
          title: res.data.message,
          icon: 'error'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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