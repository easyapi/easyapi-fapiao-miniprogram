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

  // 查看二维码
  seeQRcode() {
    var _that = this;
    var taxRate = Number(_that.data.rate) / 100;
    console.log(taxRate);
    var obj = {
      shopNo: "",
      remark: "",
      items: [{
        outOrderNo: "",
        outOrderTime: "",
        no: _that.data.no,
        name: _that.data.name,
        price: _that.data.inputVal,
        taxRate: taxRate,
        number: 1
      }]
    };

    // 在小程序里边  使用变量
    console.log(_that.data.inputVal)
    wx.navigateTo({
        url: `/pages/contents/contents?id=${_that.data.inputVal}`,
      }),
      wx.request({
        url: 'https://fapiao-api.easyapi.com/scan/print',
        header: {
          Authorization: 'Bearer ' + _that.data.header
        },
        data: obj,
        method: 'POST',
        success: function (res) {
          if (res.statusCode === 200) {
            console.log(res.data.content);
            wx.request({
              url: 'https://api2.easyapi.com/api/qrCode',
              header: {
                Authorization: 'Bearer ' + _that.data.header
              },
              data: {
                appKey: "f4f33c07e706eaf1",
                appSecret: "46ad7599c926f20c",
                bg: "FFFFFF",
                fg: "000000",
                text: "https://fapiao-scan.easyapi.com/mobile.html?code=" + res.data.content
              },
              method: 'POST',
              success: function (res) {
                if (res.statusCode === 200) {
                  console.log(res.data.content);
                  wx.navigateTo({
                    url: '/pages/webViewPage/webViewPage?url=' + res.data.content.img,
                  })
                }
              }
            })
          }
        }
      })
  },

  // 打印二维码
  getWeAppQRDecode() {
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('---初始化蓝牙适配器状态---');
        console.log(res);
        // this.getBluetoothAdapterState();
      }
    })
    wx.navigateTo({
      url: '/pages/printer/index',
    })

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