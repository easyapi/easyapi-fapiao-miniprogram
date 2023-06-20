
/**
 * 蓝牙初始化
 */
function initBLE(type) {
  wx.openBluetoothAdapter({
    success:(res) => {
      if(type === 'last' &&  wx.getStorageSync('lastBLE') && wx.getStorageSync('lastBLE').deviceId) {
        //连接历史蓝牙
        autoLink()
      }
      startBluetoothDevicesDiscovery()
    },
    fail: (res) => {
      if (res.errCode === 10001) {
        wx.showModal({
          title: '错误',
          content: '蓝牙初始化失败, 请打开蓝牙后重试。',
          showCancel: false
        })
      }
      // 当蓝牙设备状态发生改变后，需要重新扫描蓝牙打印机列表
      wx.onBluetoothAdapterStateChange((data) => {
        if (data.available) {
          // 取消监听
          wx.onBluetoothAdapterStateChange(() => {})
          //调用startBluetoothDevicesDiscovery
          startBluetoothDevicesDiscovery()
        }
      })
    }
  })
}

/**
 * 开始搜索蓝牙
 */
function startBluetoothDevicesDiscovery () {
  wx.startBluetoothDevicesDiscovery({
    powerLevel: 'high',
    allowDuplicatesKey: false,
    success: (res) => {
      //监听新设备
      wx.onBluetoothDeviceFound((data) => {
        if (data.devices[0].name != '') {
          getApp().globalData.arrBLE = getApp().globalData.arrBLE.concat(data.devices[0])
          console.log(getApp().globalData.arrBLE)
        }
      })
    },
    fail: (res) => {
      console.log('搜索蓝牙失败', res)
    }
  })
}


/**
 * 连接蓝牙
 */
function connectBluetooth (deviceId, name) {
  wx.showLoading({
    mask: true,
    title: '连接蓝牙中'
  })
  wx.createBLEConnection({
    deviceId: deviceId,
    timeout: 9000,
    success: (rse) => {
      //获取蓝牙服务
      wx.getBLEDeviceServices({
        deviceId: deviceId,
        success: (data) => {
          for (let i = 0; i < data.services.length; i++) {
            if (data.services[i].isPrimary) {
              getBLEDeviceCharacteristics(deviceId, data.services[i].uuid, name)
              return
            }
          }
          wx.stopBluetoothDevicesDiscovery({
            success() {
              console.log('停止搜索蓝牙')
            }
          })
        }
      })
    },
    fail: (rse) => {
      console.log('链接失败')
    }
  })
}

/**
 * 获取蓝牙功能
 */
function getBLEDeviceCharacteristics (deviceId, serviceId, name) {
  wx.getBLEDeviceCharacteristics({
    deviceId,
    serviceId,
    success: (res) => {
      for (let i = 0; i < res.characteristics.length; i++) {
        const item = res.characteristics[i]
        if (item.properties.write) {
          // 蓝牙信息存入本地
          wx.setStorageSync('lastBLE', {
            deviceId: deviceId,
            serviceId: serviceId,
            characteristicId: item.uuid,
            name: name
          })
          getApp().globalData.bindBLE = wx.getStorageSync('lastBLE')
          break;
        }
      }
      wx.showToast({
        title: '连接成功',
        duration: 1000
      })
    },
    fail: (res) => {
      console.error('getBLEDeviceCharacteristics', res)
    }
  })
}

/**
 * 直接链接
 */
function autoLink () {
  wx.createBLEConnection({
    deviceId: wx.getStorageSync('lastBLE').deviceId,
    timeout: 9000,
    success: (res) => {
      getApp().globalData.bindBLE = wx.getStorageSync('lastBLE')
      wx.showToast({
        title: '蓝牙已连接',
        duration: 1000
      })
    },
    fail: () => {}
  })
}


//js blue.js里有三个公共方式
module.exports = {
  initBLE: initBLE, //初始化蓝牙并搜索
  startBluetoothDevicesDiscovery: startBluetoothDevicesDiscovery, //搜索蓝牙
  connectBluetooth: connectBluetooth, //蓝牙连接 
}