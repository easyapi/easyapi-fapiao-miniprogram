const {
  updateAccount
} = require('../../../../api/account')
const {
  getKey,
  getToken
} = require('../../../../api/qiniu')
const {
  checkLoginStatus
} = require('../../../../common/checkLogin')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    show: false,
    gender: ['男', '女'],
  },
  getUserInfo() {
    let user = wx.getStorageSync("user")
    this.setData({
      userInfo: user
    })
  },


  /**
   * 更新图片信息
   */
  updateAccount() {
    let data = {
      photo: this.data.userInfo.photo,
    }
    updateAccount(data).then(res => {
      if (res.data.code == 1) {
        getApp().getUserInfo()
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 3000
        })
      }
    })
  },

  //获取七牛Key
  getKeyAndToken() {
    this.getKey();
    this.getToken();
  },

  //获取七牛key
  getKey() {
    getKey().then(res => {
      if (res.data.code === 1) {
        this.setData({
          key: res.data.content.key
        })
      }
    })
  },

  //获取七牛token
  getToken() {
    getToken().then(res => {
      if (res.data.code === 1) {
        this.setData({
          upToken: res.data.content.upToken,
        })
      }
    })
  },

  //上传图片
  afterRead(event, type) {
    const {
      file
    } = event.detail;
    let _that = this
    wx.uploadFile({
      url: 'https://upload.qiniup.com/',
      filePath: file.url,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        'key': _that.data.key,
        'token': _that.data.upToken
      },
      success: function (res) {
        if (res.statusCode = 200) {
          let img = 'https://qiniu.easyapi.com/' + JSON.parse(res.data).key
          file.url = img
          _that.setData({
            'userInfo.photo': img
          })
          _that.updateAccount()
        }
      }
    })
  },

  // 修改昵称
  change(e) {
    if (this.data.userInfo.nickname == e.detail.value) {
      return
    }
    var that = this
    if (e.detail.value == '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 3000
      })
    } else {
      let data = {
        nickname: e.detail.value,
      }
      updateAccount(data).then(res => {
        if (res.data.code == 1) {
          getApp().getUserInfo()
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 3000
          })
        }
      })
    }
  },

  // 选择性别
  choseGender() {
    this.setData({
      show: !this.data.show,
    })
  },

  // 点击取消
  onCancel() {
    this.setData({
      show: !this.data.show,
    })
  },

  // 点击确认
  onConfirm(e) {
    this.setData({
      show: !this.data.show,
      'userInfo.male': !this.data.userInfo.male
    })
    let data = {
      male: this.data.userInfo.male,
    }
    updateAccount(data).then(res => {
      if (res.data.code == 1) {
        getApp().getUserInfo()
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 3000
        })
      }
    })
  },


  bindGetUserInfo: function (e) {
    this.setData({
      'userInfo.photo': e.detail.userInfo.avatarUrl,
      'userInfo.nickname': e.detail.userInfo.nickName,
    })
    let data = {
      nickname: e.detail.userInfo.nickName,
      photo: e.detail.userInfo.avatarUrl,
    }
    updateAccount(data).then(res => {
      if (res.data.code == 1) {
        getApp().getUserInfo()
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 3000
        })
      }
    })
  },

  /**
   * 获取用户临时头像
   */
  getImage(e) {
    let that = this
    that.getKeyAndToken()
    let event = {
      detail: {
        file: {
          url: e.detail.avatarUrl
        }
      }
    }
    setTimeout(function () {
      that.afterRead(event, '上传')
    }, 200)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    checkLoginStatus('/pages/my/setting/data/data')
    this.getUserInfo()
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