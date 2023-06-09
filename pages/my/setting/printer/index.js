// pages/my/setting/printer/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: 'Blea',
    label: '3D:3F',
    deviceId: '',
    devicesList: []
  },

//连接蓝牙
connect(v){
  wx.showLoading({
      mask:true,
      title:'连接蓝牙中'
  })
  var that=this
  that.setData({
    deviceId:v.currentTarget.dataset.item.deviceId
  })
  wx.createBLEConnection({
    deviceId:that.data.deviceId,
    timeout:9000,
    success(rse){
      console.log('连接蓝牙情况',rse)
      wx.getBLEDeviceServices({
        deviceId:that.data.deviceId,
        complete(rse){
          if(rse.errCode!=0){
            if(rse.errCode==10012){
              wx.showToast({
                title: '连接蓝牙超时请重试',
                icon: 'error',
                duration: 1000
              })
            }else{
              wx.showToast({
                title: '连接蓝牙异常',
                icon: 'error',
                duration: 1000
              })
            }
            return
          }
          //查询特征值
          that.setData({
            inactive:[]
          })
          for(var i in rse.services){
            wx.getBLEDeviceCharacteristics({
              deviceId:that.data.deviceId,
              serviceId:rse.services[i].uuid,
              complete(rse){
                if(that.data.inactive[0]){
                  return
                }
                for(var j in rse.characteristics){
                  if(rse.characteristics[j].properties.write){
                        var arr=that.data.inactive
                        console.log(that.data.inactive,'查询值')
                        arr.push({
                          deviceId:rse.deviceId,
                          serviceId:rse.serviceId,
                          characteristicId:rse.characteristics[j].uuid,
                          name:v.currentTarget.dataset.item.name
                        })
                        wx.setStorageSync('bluetooth', v)
                        that.setData({
                          inactive:arr
                        })
                        wx.showToast({
                          title: '连接成功',
                          duration: 1000
                        })
                          that.data.status==1?that.print():that.data.status==2?that.receipt():''
                      //  that.speedUp(rse.deviceId)
                       break
                  }
                }
                if(!that.data.inactive[0]){
                  wx.showToast({
                    title: '获取蓝牙服务失败',
                    icon: 'error',
                    duration: 1000
                  })
                }
              }
            })
          }
        }
      })
    },
    fail(rse){
      console.log('链接失败')
    },
    complete(){
      wx.stopBluetoothDevicesDiscovery({
        success(){
          console.log('停止搜索蓝牙')
        }
      })
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
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        // 系统蓝牙模块打开。，并且蓝牙初始化成功后开始搜索蓝牙打印机

          this.setData({
            devicesList:[]
          })
          var that=this
          wx.startBluetoothDevicesDiscovery({
            success(res){
              //监听新设备
              wx.onBluetoothDeviceFound(function(res) {
                var devices = res.devices;
                if(devices[0].name!=''){
                  // this.list.push(devices[0])
                  var list=that.data.devicesList
                  list.push(devices[0])
                  that.setData({
                    devicesList:list,
                  })
                }
                console.log(that.data.devicesList)
                // console.log('new device list has founded')
                // console.log(ab2hex(devices[0].advertisData))
              })
            },
            fail(res){
              console.log('搜索蓝牙失败',res)
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