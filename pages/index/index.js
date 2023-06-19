const {
  getCustomCategory
} = require('../../api/enterprise')
const {
  ifNoLogin
} = require('../../utils/noLogin')
const {
  timestampToTime
} = require('../../utils/time')
const {
  createScan,
  getShop,
  findFieldKeyList
} = require('../../api/scan')
const LAST_CONNECTED_DEVICE = 'last_connected_device'
const
  PrinterJobs = require('../../printer/printerjobs')
const
  printerUtil = require('../../printer/printerutil')

Page({
  data: {
    customCategoryId: 0,
    inputVal: '',
    phone: '',
    name: '',
    no: '',
    rate: '',
    tabs: [],
    category: '请选择发票类型',
    columns: [],
    showClassify: false,
    shopDetail: [],
    effectiveDay: '', //有效期
    img: '',
    canvasHeight: '',
    canvasWidth: '',
    outOrderNo: ''
  },

  
  //1.获取开票分类
  getCustomCategory() {
    let params = {
      page: 0,
      size: 100,
    }
    getCustomCategory(params).then(res => {
      if (res.data.code === 1) {
        this.setData({
          tabs: res.data.content,
          customCategoryId: res.data.content[0].customCategoryId,
          no: res.data.content[0].no,
          rate: res.data.content[0].rate,
          name: res.data.content[0].name,
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
  /**
   * 获取参数信息
   */
  getSetting() {
    const params = {
      fieldKeys: 'scan_effective_day',
    }
    findFieldKeyList(params).then((res) => {
      if (res.data.code === 1) {
        this.setData({
          'effectiveDay': res.data.content[0] ? res.data.content[0].fieldValue : ''
        })
      }
    })
  },

  /**
   * 获取商户门店信息
   */
  getShop() {
    getShop(wx.getStorageSync('user').shop.shopId).then((res) => {
      if (res.data.code === 1) {
        let arr = []
        res.data.content.invoiceCategories.forEach(item => {
          arr.push(item.category)
        })
        this.setData({
          'columns': arr
        })
      }
    })
  },

  // 点击获取点击类别的信息
  getItemImfor(e) {
    console.log(e)
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
  getPhoneVal(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  choseTypeClassify() {
    this.setData({
      showClassify: !this.data.showClassify,
    })
  },
  onConfirmClassify(e) {
    this.setData({
      showClassify: !this.data.showClassify,
      'category': e.detail.value
    })
  },
  onCancelClassify() {
    this.setData({
      showClassify: !this.data.showClassify
    })
  },
  /**
   * 查看二维码
   */
  seeQRcode() {
    if (this.data.category == '' || this.data.category == '请选择发票类型') {
      wx.showToast({
        title: '请选择发票类型',
        icon: 'none'
      })
      return
    }
    if (this.data.inputVal == '') {
      wx.showToast({
        title: '请输入开票金额',
        icon: 'none'
      })
      return
    }

    let data = {
      category: this.data.category,
      outOrderNo: 'MA' + new Date().getTime(),
      items: [{
        no: this.data.no,
        rate: this.data.rate,
        name: this.data.name,
        customCategoryId: this.data.customCategoryId,
        number: 1,
        price: this.data.inputVal,
      }]
    }
    this.setData({
      outOrderNo: timestampToTime(new Date().getTime())
    })

    createScan(data).then(res => {
      console.log(res)

      // 跳转首页
      if (res.data.code == 1) {
        wx.navigateTo({
          url: `/pages/contents/contents?id=${this.data.inputVal}&content=${this.data.name}&qrCode=${res.data.content}`
        })
      }
    })
  },

  // ArrayBuffer转16进度字符串示例
  ab2hex(buffer) {
    const hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join(',')
  },


  /**
   * 打印
   */
  print() {
    this.setData({
      outOrderNo: timestampToTime(new Date().getTime())
    })
    let printerJobs = new PrinterJobs();
    printerJobs
      .setAlign('ct')
      .setSize(2, 2)
      .print(wx.getStorageSync('user').shop.name)
      .setAlign('ct')
      .print(printerUtil.fillLine())
      .setAlign('ct')
      .setSize(1, 1)
      .print('开票金额：' + this.data.inputVal + '元')
      .setAlign('ct')
      .setSize(1, 1)
      .print('开票内容：' + this.data.name)
      .setAlign('ct')
      .setSize(1, 1)
      .print('打印时间：' + this.data.outOrderNo)
      .setAlign('ct')
      .setSize(1, 1)
      .print('有效期：' + this.data.effectiveDay + '天')
      .setAlign('ct')
      .setSize(1, 1)
      .print('联系电话：' + this.data.phone)
      .print(printerUtil.fillLine())
      .println();

    let buffer = printerJobs.buffer();
    // console.log('ArrayBuffer', 'length: ' + buffer.byteLength, ' hex: ' + ab2hex(buffer));
    // 1.并行调用多次会存在写失败的可能性
    // 2.建议每次写入不超过20字节
    // 分包处理，延时调用
    const maxChunk = 20;
    const delay = 20;
    for (let i = 0, j = 0, length = buffer.byteLength; i < length; i += maxChunk, j++) {
      let subPackage = buffer.slice(i, i + maxChunk <= length ? (i + maxChunk) : length);
      setTimeout(this._writeBLECharacteristicValue, j * delay, subPackage);
    }
  },

  _writeBLECharacteristicValue(buffer) {
    wx.writeBLECharacteristicValue({
      deviceId: wx.getStorageSync('BLE').deviceId,
      serviceId: wx.getStorageSync('BLE').serviceId,
      characteristicId: wx.getStorageSync('BLE').characteristicId,
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res)
      },
      fail(res) {
        console.log('writeBLECharacteristicValue fail', res)
      }
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
    if (ifNoLogin()) {
      wx.redirectTo({
        url: '/pages/login/login/login',
      })
      return
    }
    this.getCustomCategory()
    this.getShop()
    this.getSetting()
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