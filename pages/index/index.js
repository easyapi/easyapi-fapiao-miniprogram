import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
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
const {
  initBLE
} = require('../../utils/bindBLE')
const
  PrinterJobs = require('../../printer/printerjobs')
const
  printerUtil = require('../../printer/printerutil')
import drawQrcode from '../../utils/weapp.qrcode.esm'
import util from '../../utils/util.js'

var toArrayBuffer = require('to-array-buffer')
var Buffer = require('buffer/').Buffer

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
    outOrderNo: '',
    shopName: '',
    qrTxt: '', //二维码地址
    show: false,
    customCategoryIndex: ''

  },


  /**
   * 获取开票分类
   */
  getCustomCategory() {
    let params = {
      page: 0,
      size: 100,
    }
    getCustomCategory(params).then(res => {
      if (res.data.code === 1) {
        if (this.data.customCategoryId === '') {
          this.setData({
            tabs: res.data.content,
            customCategoryId: res.data.content[0].customCategoryId,
            no: res.data.content[0].taxCode.no,
            rate: res.data.content[0].rate,
            name: res.data.content[0].name,
          })
          return
        }
        res.data.content.forEach((item) => {
          if (item.customCategoryId === this.data.customCategoryId) {
            this.setData({
              tabs: res.data.content,
              customCategoryId: item.customCategoryId,
              no: item.no,
              rate: item.rate,
              name: item.name,
            })
          }
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'error'
        })
        this.setData({
          tabs: [],
          customCategoryId: '',
          no: '',
          rate: '',
          name: '',
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
      customCategoryId: e.target.dataset.item.customCategoryId,
      customCategoryIndex: e.target.dataset.index
    });
    this.selectContent()
  },

  selectContent() {
    let content = wx.getStorageSync('selectContent') ? wx.getStorageSync('selectContent') : []
    if (content.length === 0) {
      let obj = {
        shopName: this.data.shopName,
        customCategoryId: this.data.customCategoryId,
        customCategoryIndex: this.data.customCategoryIndex,
        category: this.data.category
      }
      content = [obj]
      wx.setStorageSync('selectContent', content)
      return
    }
    content.forEach(item => {
      if (item.shopName === this.data.shopName) {
        item.shopName === this.data.shopName
        item.customCategoryId = this.data.customCategoryId
        item.category = this.data.category
      }
    })
    wx.setStorageSync('selectContent', content)
  },

  // 获取input值
  getInputVal(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  getPhoneVal(e) {
    wx.setStorageSync('phone', e.detail.value)
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
    this.selectContent()

  },
  onCancelClassify() {
    this.setData({
      showClassify: !this.data.showClassify
    })
  },
  /**
   * 查看二维码
   */
  seeQRcode(form) {

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
    if (this.data.phone == '') {
      wx.showToast({
        title: '请输入联系电话',
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
        // customCategoryId: this.data.customCategoryId,
        number: 1,
        price: this.data.inputVal,
      }]
    }
    this.setData({
      outOrderNo: timestampToTime(new Date().getTime())
    })
    createScan(data).then((res) => {
      if (form === 'print') {
        this.setData({
          qrTxt: `https://fapiao-scan.easyapi.com/?code=${res.data.content}`
        })
         this.setQRcode()
         setTimeout(() => {
           this.customPrint()
         }, 11000)
      } else {
        // 跳转二维码页面
        if (res.data.code == 1) {
          wx.navigateTo({
            url: `/pages/contents/contents?id=${this.data.inputVal}&content=${this.data.name}&qrCode=${this.data.content}&phone=${this.data.phone}&effectiveDay=${this.data.effectiveDay}`
          })
        }
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
   * 设置二维码
   */
  setQRcode() {
    let that = this
    const ctx = wx.createCanvasContext('canvas')
    ctx.clearRect(0, 0, 256, 256);
    drawQrcode({
      canvasId: 'canvas',
      text: String(this.data.qrTxt),
      width: 256,
      height: 256,
      callback(e) {
        setTimeout(() => {
          wx.canvasGetImageData({
            canvasId: 'canvas',
            x: 0,
            y: 0,
            width: 256,
            height: 256,
            success(res) {
              let arr = that.convert4to1(res.data);
              let data = that.convert8to1(arr);
              const cmds = [].concat([27, 97, 1], [29, 118, 48, 0, 32, 0, 0, 1], data, [27, 74, 3], [27, 64]);
              const buffer = toArrayBuffer(Buffer.from(cmds, 'gb2312'));
              let arrPrint = [];
              arrPrint.push(util.sendDirective([0x1B, 0x40]));
              for (let i = 0; i < buffer.byteLength; i = i + 20) {
                arrPrint.push(buffer.slice(i, i + 20));
              }
              arrPrint.push(util.hexStringToBuff("\n"));
              arrPrint.push(util.sendDirective([0x1B, 0x61, 0x01])); //居中
              arrPrint.push(util.hexStringToBuff("\n"));
              arrPrint.forEach((item, index) => {
                setTimeout(() => {
                  that._writeBLECharacteristicValue(item)
                }, index * 20);
              })

            }
          })
        }, 1500)
      }
    })
  },

  /**
   * 自定义内容
   */
  customPrint(){
    let printerJobs = new PrinterJobs();
    printerJobs
      .setAlign('ct')
      .setSize(1, 1)
      .print(printerUtil.fillLine())
      .setAlign('ct')
      .setSize(1, 1)
      .print('自定义内容：哈哈哈哈')
      .print();
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

  //4合1
  convert4to1(res) {
    let arr = [];
    for (let i = 0; i < res.length; i++) {
      if (i % 4 == 0) {
        let rule = 0.29900 * res[i] + 0.58700 * res[i + 1] + 0.11400 * res[i + 2];
        if (rule > 200) {
          res[i] = 0;
        } else {
          res[i] = 1;
        }
        arr.push(res[i]);
      }
    }
    return arr;
  },

  //8合1
  convert8to1(arr) {
    let data = [];
    for (let k = 0; k < arr.length; k += 8) {
      let temp = arr[k] * 128 + arr[k + 1] * 64 + arr[k + 2] * 32 + arr[k + 3] * 16 + arr[k + 4] * 8 + arr[k + 5] * 4 +
        arr[k + 6] * 2 + arr[k + 7] * 1
      data.push(temp);
    }
    return data;
  },

  /**
   * 打印
   */
  print() {
    var role = /^\d+(\.\d{1,2})?$/
    if (!getApp().globalData.bindBLE.name) {
      Dialog.confirm({
          title: '温馨提示',
          message: '打印发票需要连接打印机，请前往连接！',
        })
        .then(() => {
          wx.navigateTo({
            url: '../my/setting/printer/index',
          })
        })
      return
    }
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
    if(!role.test(this.data.inputVal)) {
      wx.showToast({
        title: '请输入正确的开票金额',
        icon: 'none'
      })
      return
    }
    if (this.data.phone == '') {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      })
      return
    }
    this.setData({
      show: true
    })
  },

  onConfirm() {
    this.setData({
      outOrderNo: timestampToTime(new Date().getTime())
    })

    let printerJobs = new PrinterJobs();
    printerJobs
      .setAlign('ct')
      .setSize(2, 2)
      .print(wx.getStorageSync('user').shop.name)
      .setAlign('ct')
      .setSize(1, 2)
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
      .setAlign('ct')
      .setSize(1, 1)
      .print(printerUtil.fillLine())
      .print();

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
    this.seeQRcode('print')
  },

  _writeBLECharacteristicValue(buffer) {
    wx.writeBLECharacteristicValue({
      deviceId: wx.getStorageSync('lastBLE').deviceId,
      serviceId: wx.getStorageSync('lastBLE').serviceId,
      characteristicId: wx.getStorageSync('lastBLE').characteristicId,
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res)
      },
      fail(res) {
        console.log('writeBLECharacteristicValue fail', res)
      }
    })
  },

  setOptions() {
    this.setData({
      category: '',
      customCategoryId: '',
      phone: wx.getStorageSync('phone')
    })
    let arr = wx.getStorageSync('selectContent') ? wx.getStorageSync('selectContent') : []
    if(arr.length === 0 ){
      return
    }
    arr.forEach(item => {
      if (item.shopName === this.data.shopName) {
        this.setData({
          category: item.category,
          customCategoryId: item.customCategoryId,
          phone: wx.getStorageSync('phone')
        })
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
    initBLE('last')
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
    this.setData({
      shopName: wx.getStorageSync('user') ? wx.getStorageSync('user').shop.name : ''
    })
    this.setOptions()
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