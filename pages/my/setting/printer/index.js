// pages/my/setting/printer/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: 'Blea',
    label: '3D:3F',
    deviceId: '',
    devices: []
  },

  // 监听扫描到新设备事件
  onBluetoothDeviceFound() {
    let that = this
    wx.onBluetoothDeviceFound((res) => {
      this.data.devices.push(res.devices) 
      console.log(this.data.devices,777)
      // res.devices.forEach(device => {
      //   // 排除非法命名的设备
      //   if (!device.name && !device.localName) {
      //     return
      //   }
      //   // const foundDevices = res.devices
      //   // const idx = inArray(foundDevices, 'deviceId', device.deviceId)
      //   const data = {}
      //   // if (idx === -1) {
      //   //   devices[foundDevices.length] = device
      //   // } else {
      //   //   devices[idx] = device
      //   // }
      //   devices = devices.map(item => {
      //     item.feild = item.name
      //     return item
      //   })
      //   // 将其存入数据仓库，会在其他地方用到
      //   this.data.devices = devices
      //   //              store.commit('bluetooth/UPDATE_DEVICES', devices)
      //   console.log(this.data.devices, 789789)
      // })


      // console.log(res.devices,9999)
      // this.data.devices = [res.devices]
      // res.devices.forEach((device) => {
      //   // 这里可以做一些过滤
      //   console.log('Device Found', device)
      //   this.data.deviceId = device.deviceId
      //   console.log(this.data.deviceId, 66)
      // })
      // // 找到要搜索的设备后，及时停止扫描
      // wx.stopBluetoothDevicesDiscovery()
      // that.getBluetoothDevices()
    })
  },


  startBluetoothDevicesDiscovery() {
    let that = this

    // 开始搜索蓝牙
    wx.startBluetoothDevicesDiscovery({
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        // 搜索到蓝牙打印机后，会以事件回调的形式触发，需要注册事件
        that.onBluetoothDeviceFound()
      },
      fail: (res) => {
        console.log('startBluetoothDevicesDiscovery fail', res)
      }
    })
    //   wx.showToast({
    //     title: '正在搜索中...',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   let that = this

    //   console.log(123132)
    //   wx.startBluetoothDevicesDiscovery({
    //     allowDuplicatesKey: false,
    //     success: function (res) {
    //       console.log(res, 777)
    //       // ConnectedDeviceRelated.isSearchBluetooth_detectionBoard = true

    //       // //解决iOS第一次进入检测页面卡死的问题
    //       // setTimeout(function (params) {
    //       //   getBluetoothDevices()
    //       // }, 500)
    //       that.onBluetoothDeviceFound()

    //     },

    //     fail: function (res) {
    //       console.log('搜索蓝牙设备错误', res)
    //       if (res.errMsg == 'startBluetoothDevicesDiscovery:fail:location permission is denied') {
    //         wx.showModal({
    //           title: '警告',
    //           content: '微信的位置权限被拒绝，请到设置中手动开启授权！',
    //           showCancel: false,
    //           success(res) {}
    //         })
    //       }
    //     }
    //   })
  },

  // //获取蓝牙设备信息
  // getBluetoothDevices() {
  //   let that = this

  //   wx.getBluetoothDevices({
  //     success: function (res) {
  //       console.log(res, 666)
  //       if (res.devices.length > 0) {
  //         for (var i = 0; i < res.devices.length; i++) {
  //           if (res.devices[i].name !== '') {
  //             console.log('看一下获取到的指定设备', res.devices[i])
  //             // ConnectedDeviceRelated.deviceId = res.devices[i].deviceId
  //             // app.globalData.deviceId = res.devices[i].deviceId
  //             // app.globalData.bluetooth = res.devices[i].name
  //             that.createBLEConnection()
  //             break;
  //           }
  //           if (res.devices.length - 1 == i) {
  //             that.findBlue('repeat')
  //           }
  //         }
  //       } else {
  //         that.findBlue('repeat')
  //       }
  //     },
  //     fail: function () {
  //       console.log("搜索蓝牙设备失败")
  //     }
  //   })
  // },

  // createBLEConnection() {
  //   wx.createBLEConnection({
  //     deviceId: this.data.deviceId, // 搜索到设备的 deviceId
  //     success: () => {
  //       // 连接成功，获取服务
  //       wx.getBLEDeviceServices({
  //         deviceId: this.data.deviceId, // 搜索到设备的 deviceId
  //         success: (res) => {
  //           console.log(res, 333)
  //           for (let i = 0; i < res.services.length; i++) {
  //             if (res.services[i].isPrimary) {
  //               // 可根据具体业务需要，选择一个主服务进行通信
  //               wx.getBLEDeviceCharacteristics({
  //                 deviceId: this.data.deviceId, // 搜索到设备的 deviceId
  //                 serviceId:res.services[i].serviceId, // 上一步中找到的某个服务
  //                 success: (res) => {
  //                   for (let i = 0; i < res.characteristics.length; i++) {
  //                     let item = res.characteristics[i]
  //                     if (item.properties.write) { // 该特征值可写
  //                       // 本示例是向蓝牙设备发送一个 0x00 的 16 进制数据
  //                       // 实际使用时，应根据具体设备协议发送数据
  //                       let buffer = '发送数据'
  //                       // let dataView = new DataView(buffer)
  //                       // dataView.setUint8(0, 0)
  //                       wx.writeBLECharacteristicValue({
  //                         deviceId: this.data.deviceId, // 搜索到设备的 deviceId
  //                         serviceId:res.services[i].serviceId, // 上一步中找到的某个服务
  //                         characteristicId: item.uuid,
  //                         value: buffer,
  //                       })
  //                     }
  //                     if (item.properties.read) { // 改特征值可读
  //                       wx.readBLECharacteristicValue({
  //                         deviceId: this.data.deviceId, // 搜索到设备的 deviceId
  //                         serviceId:res.services[i].serviceId, // 上一步中找到的某个服务
  //                         characteristicId: item.uuid,
  //                       })
  //                     }
  //                     if (item.properties.notify || item.properties.indicate) {
  //                       // 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
  //                       wx.notifyBLECharacteristicValueChange({
  //                         deviceId: this.data.deviceId, // 搜索到设备的 deviceId
  //                         serviceId:item[i].serviceId, // 上一步中找到的某个服务
  //                         characteristicId: item.uuid,
  //                         state: true,
  //                       })
  //                     }
  //                   }
  //                 }
  //               })
  //               // 操作之前先监听，保证第一时间获取数据
  //               wx.onBLECharacteristicValueChange((result) => {
  //                 // 使用完成后在合适的时机断开连接和关闭蓝牙适配器
  //                 wx.closeBLEConnection({
  //                   deviceId: this.data.deviceId,
  //                 })
  //                 wx.closeBluetoothAdapter({})
  //               })
  //             }
  //           }
  //         }
  //       })
  //     }
  //   })
  // },

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
    let that = this
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        // 系统蓝牙模块打开。，并且蓝牙初始化成功后开始搜索蓝牙打印机
        that.startBluetoothDevicesDiscovery()
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
              // 取消监听，否则stopBluetoothDevicesDiscovery后仍会继续触发                          onBluetoothAdapterStateChange，
              // 导致再次调用startBluetoothDevicesDiscovery
              wx.onBluetoothAdapterStateChange(() => {})
              that.startBluetoothDevicesDiscovery()
            }
          })
        }
      }

      // success: function (res) {
      //   console.log("初始化蓝牙成功")
      //   //查找蓝牙设备
      //   that.findBlue()
      // },
      // fail: function (res) {
      //   wx.showModal({
      //     content: '请开启手机蓝牙！',
      //     showCancel: false,
      //     success(res) {}
      //   })
      // }
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