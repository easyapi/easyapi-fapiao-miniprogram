// pages/contents/contents.js
const {
  request
} = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //获取token
  
  getToken() {
    var _that = this;
    wx.request({
      url: 'https://fapiao-api.easyapi.com/api/authenticate',
      data: {
        username: "13656171020",
        password: "123123",
        rememberMe: true
      },
      method: 'POST',
      success: function (res) {
        _that.setData({
          header: res.data.id_token
        })
        console.log(res.data);
        if (res.statusCode === 200) {
          _that.getCategories(res.data.id_token);
        }
      }
    })
  },
  //1.获取开票分类
  getCategories(head) {
    var _that = this;
    wx.request({
      url: 'https://fapiao-api.easyapi.com/custom-categories',
      header: {
        Authorization: 'Bearer ' + head
      },
      data: {},
      method: 'GET',
      success: function (res) {
        console.log(res.data.content);
        if (res.statusCode === 200) {
          _that.setData({
            tabs: res.data.content,
            no: res.data.content[0].taxCode.no,
            rate: res.data.content[0].taxCode.rate,
            name: res.data.content[0].name
          })
        }
      }
    })
  },
  // 点击获取点击类别的信息
  getItemImfor(e) {
    console.log(e);
    this.setData({
      no: e.target.dataset.item.taxCode.no,
      rate: e.target.dataset.item.taxCode.rate,
      name: e.target.dataset.item.name,
      active: e.target.dataset.index
    });
    console.log(this.data.no + "/" + this.data.rate + "/" + this.data.name);
  },
  // 获取input值
  getInputVal(e) {
    console.log(e);
    this.setData({
      inputVal: e.detail.value
    });
    console.log(this.data.inputVal);
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