// pages/contents/contents.js
import {
  getKey
} from '../../api/qiniu.js'
const {
  request
} = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrTxt: 'https://github.com/liuxdi/wx-qr',
    money: '',
    content: '',
    corporate: '',
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
      customCategoryId: e.target.dataset.item.customCategoryId
    });
    console.log(this.data.no + "/" + this.data.rate + "/" + this.data.name);
  },
  // 获取input值
  getInputVal(e) {
    console.log(e);
    this.setData({
      inputVal: e.detail.value
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const data = wx.getStorageSync('user')
    this.setData({
      data
    })
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var options = currentPage.options //如果要获取url中所带的参数可以查看options
    this.setData({
      money: options.id, //这里的options.表示获取参数
      content: options.content,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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