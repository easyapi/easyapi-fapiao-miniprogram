const { getCustomCategory }  = require('../../api/enterprise')

Page({
  data: {
    customCategoryId: 0,
    inputVal: '',
    name: '',
    no: '',
    rate: '',
    tabs: [],
  },

  //1.获取开票分类
  getCustomCategory() {
    let params = {
      page: 0,
      size: 100,
    }
    getCustomCategory(params).then(res => {
      if(res.data.code === 1) {
        this.setData({
          tabs: res.data.content,
          customCategoryId: res.data.content[0].customCategoryId
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'error'
        })
        this.setData({
          tabs: [],
        })
      }
    })
  },

  // 点击获取点击类别的信息
  getItemImfor(e) {
    this.setData({
      no: e.target.dataset.item.taxCode.no,
      rate: e.target.dataset.item.taxCode.rate,
      name: e.target.dataset.item.name,
      customCategoryId: e.target.dataset.item.customCategoryId
    });
  },

  // 获取input值
  getInputVal(e) {
    this.setData({
      inputVal: e.detail.value
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
    this.getCustomCategory()
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
  onShareAppMessage: function () {},

})