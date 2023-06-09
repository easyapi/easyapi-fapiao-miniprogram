const request = getApp().sendRequest.request;
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

const {
  baseUrl
} = require('../../../utils/request')

const {
  thirdPartyRegister
} = require('../../../api/third-party')
const {
  getAccount
} = require('../../../api/account')
const {
  getUserLocation,
  getTableLocationList
} = require('../../../api/user-location')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: getApp().globalData.logo,
    projectName: getApp().globalData.projectName,
    checked: false,
    agree: "agree",
    showGetPhoneNumber: "",
    sessionKey: '',
    auth: '',
    userPhone: '',
    getPhoneNumber: ''
  },
  /**
   * 授权登录页面
   */
  authorization: function (e) {
    if (this.data.checked == false) {
      wx.showToast({
        title: '请勾选用户协议',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.getUserProfile({
        desc: '展示用户信息',
        // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          if (res.errMsg === "getUserProfile:ok") {
            wx.setStorageSync('wxUserInfo', res.userInfo)
          }
          wx.login({
            //必须先获取信息后再调用login，再login里调用信息接口调用不了
            complete: (res) => {
              if (res.errMsg === "login:ok") {
                this.setData({
                  showGetPhoneNumber: false
                });
              }
            },
          })
        }
      })
    }
  },
  /**
   * 拒绝
   */
  reject: function () {
    wx.reLaunch({
      url: '/pages/home/index/index',
    })
  },
  /**
   * get openid and sessionKey
   */
  wxLogin() {
    let _that = this;
    wx.login({
      success(res) {
        if (res.code) {
          let code = res.code;
          // 发起网络请求
          request(`${baseUrl}/weixin/miniprogram/${getApp().globalData.maAppId}/sessionInfo/` + code, 'GET').then(res => {
            if (res.data.code === 1) {
              let openid = res.data.content.openid;
              let sessionKey = res.data.content.session_key;
              _that.setData({
                auth: res.data.content
              })
              wx.setStorageSync('openid', openid);
              _that.setData({
                sessionKey: sessionKey
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  /**
   * 获取-解密手机号
   */
  getPhoneNumber(e) {
    if (this.data.checked == false) {
      wx.showToast({
        title: '请勾选用户协议',
        icon: 'none',
        duration: 2000
      })
    } else {
      let _that = this;
      // _that.setData({
      //   showGetPhoneNumber: false
      // });
      if (e.detail.errMsg === "getPhoneNumber:ok") {
        let iv = e.detail.iv
        let encryptedData = e.detail.encryptedData;
        let sessionkey = _that.data.sessionKey;
        request(`${baseUrl}/weixin/miniprogram/${getApp().globalData.maAppId}/phoneNoInfo`, 'GET', {
          encryptedData: encryptedData,
          ivStr: iv,
          sessionKey: sessionkey
        }).then(res => {
          if (res.data.code === 1) {
            _that.setData({
              userPhone: res.data.content
            })
            _that.speedyLogin();
          }
        })
      }
    }

  },
  /**
   * 快速登录
   */
  speedyLogin() {
    let _that = this;
    let wxUserInfo = wx.getStorageSync('wxUserInfo');
    let auth = this.data.auth;
    let userPhone = this.data.userPhone;
    let obj = {
      providerUserId: auth.openid,
      displayName: wxUserInfo.nickName,
      imageUrl: wxUserInfo.avatarUrl,
      providerId: "miniprogram",
      mobile: userPhone.purePhoneNumber,
      inviter: getApp().globalData.inviter,
      appId: getApp().globalData.maAppId,
      app: getApp().globalData.projectName
    }
    thirdPartyRegister(obj).then(res => {
      if (res.data.code === 1) {
        //保存令牌
        wx.setStorageSync('Authorization', "Bearer " + res.data.content);
        //获取用户信息
        _that.getUserInfo();
      }
    })
  },
  /**
   * 获取用户管理的小区
   */
  getUserLocationAPI() {
    let params = {
      size: 1000,
      userId: wx.getStorageSync('user').userId
    }
    getUserLocation(params).then(res => {
      this.getTableLocationList(res.data.content);
    })
  },

  /**
   * 获取数据表格的小区recordId
   */
  getTableLocationList(userLocations) {},

  /**
   * 获取用户信息
   */
  getUserInfo() {
    getAccount().then(res => {
      if (res.data.code === 1) {
        wx.setStorageSync('user', res.data.content);
        const arr = res.data.content.roles[0]
        if (arr.indexOf("USER") != -1) {
          Dialog.confirm({
              title: '温馨提示',
              message: '检测到您不是小区管理人员，无法进入物业管理界面！',
            })
            .then(() => {
              wx.redirectTo({
                url: '/pages/home/index/index',
              })
              wx.clearStorageSync()
            })
            .catch(() => {
              wx.redirectTo({
                url: '/pages/home/index/index',
              })
              wx.clearStorageSync()
            });
        } else if (res.data.content.location) {
          this.getUserLocationAPI()
        } else {
          if (getApp().globalData.from) {
            url = getApp().globalData.from
          }
          wx.redirectTo({
            url: '/pages/home/index/index',
          })
        }
      }
    })
  },
  /**
   * 是否选中
   */
  checkedTap: function () {
    var checked = this.data.checked;
    if (checked == false) {
      this.setData({
        "checked": !checked,
        getPhoneNumber: 'getPhoneNumber',
      })
    } else {
      this.setData({
        "checked": !checked,
        getPhoneNumber: '',
      })
    }
  },
  /**
   * 用户协议跳转
   */
  gotoAgreement() {
    getApp().globalData.webviewUrl = '';
    wx.navigateTo({
      url: '/pages/micro/page/page?id=38'
    })
  },
  /**
   * 隐私协议跳转
   */
  gotoPrivacy() {
    getApp().globalData.webviewUrl = '';
    wx.navigateTo({
      url: '/pages/micro/page/page?id=37'
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
    this.wxLogin();
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