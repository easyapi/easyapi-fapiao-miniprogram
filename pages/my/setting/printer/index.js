// pages/my/setting/printer/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    label: '',
    deviceId: '',
    serviceId: '',
    devicesList: [],
    name: '',
    canWrite: false
  },

  //连接蓝牙
  connect(v) {
    console.log(v, 999)
    wx.showLoading({
      mask: true,
      title: '连接蓝牙中'
    })
    var that = this
    that.setData({
      deviceId: v.currentTarget.dataset.item.deviceId,
      name: v.currentTarget.dataset.item.name
    })
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      timeout: 9000,
      success(rse) {
        console.log('连接蓝牙情况', rse)

        wx.getBLEDeviceServices({
          deviceId: that.data.deviceId,
          success: (res) => {
            let deviceId = that.data.deviceId
            console.log('getBLEDeviceServices', res)
            for (let i = 0; i < res.services.length; i++) {
              if (res.services[i].isPrimary) {
                that.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
                return
              }
            }
          }
        })
      },
      fail(rse) {
        console.log('链接失败')
      },
      complete() {
        wx.stopBluetoothDevicesDiscovery({
          success() {
            console.log('停止搜索蓝牙')
          }
        })
      }
    })
  },

  getBLEDeviceCharacteristics(deviceId, serviceId) {
    this.setData({
      serviceId: serviceId
    })
    console.log(deviceId, serviceId, '服务id获取到了')
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success', res.characteristics)
        // 这里会存在特征值是支持write，写入成功但是没有任何反应的情况
        // 只能一个个去试
        for (let i = 0; i < res.characteristics.length; i++) {
          const item = res.characteristics[i]
          if (item.properties.write) {
            this.setData({
              canWrite: true
            })
            wx.setStorageSync('BLE', {
              deviceId: this.data.deviceId,
              serviceId: this.data.serviceId,
              characteristicId: item.uuid,
              name:this.data.name
            })
            break;
          }
        }
        wx.showToast({
          title: '连接成功',
          duration: 1000
        })
        wx.navigateBack({
          delta: 1
        })
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
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
    var that = this
    wx.openBluetoothAdapter({
      success: (res) => {
        // 系统蓝牙模块打开。，并且蓝牙初始化成功后开始搜索蓝牙打印机
        that.setData({
          devicesList: []
        })
        wx.startBluetoothDevicesDiscovery({
          powerLevel: 'high',
          allowDuplicatesKey: false,
          success(res) {
            //监听新设备
            wx.onBluetoothDeviceFound(function (res) {
              console.log(res.devices, '搜索到的设备')
              var devices = res.devices;
              if (devices[0].name != '') {
                var list = that.data.devicesList
                list.push(devices[0])
                that.setData({
                  devicesList: list,
                })
              }
            })
          },
          fail(res) {
            console.log('搜索蓝牙失败', res)
          }
        })
      },
      fail: (res) => {
        // 一般如果系统蓝牙模块启动失败，或者设备不支持蓝牙则会初始化失败
        console.log('openBluetoothAdapter fail', res)
        if (res.errCode === 10001) {
          wx.showModal({
            title: '错误',
            content: '蓝牙初始化失败, 请打开蓝牙后重试。',
            showCancel: false
          })
          // 当蓝牙设备状态发生改变后，需要重新扫描蓝牙打印机列表
          wx.onBluetoothAdapterStateChange((res) => {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              // 取消监听，否则stopBluetoothDevicesDiscovery后仍会继续触发onBluetoothAdapterStateChange，
              // 导致再次调用startBluetoothDevicesDiscovery
              wx.onBluetoothAdapterStateChange(() => {})
              that.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
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