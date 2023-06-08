// pages/lanyatest/lanyatest.js
Page({
 
    /**
     * 页面的初始数据
     */
    data: {
      info:"未初始化蓝牙适配器",
      connectedDeviceId:""
    },
   
    lanyatest1(event){
      var that = this;
      wx.openBluetoothAdapter({
        success: function (res) {
          console.log('初始化蓝牙适配器成功')
          //页面日志显示
          that.setData({
            info: '初始化蓝牙适配器成功'
          })
        },
        fail: function (res) {
          console.log('请打开蓝牙和定位功能')
          that.setData({
            info: '请打开蓝牙和定位功能'
          })
        }
      })
    },
   
   
   
    lanyatest2(event){
      var that = this;
      wx.getBluetoothAdapterState({
   
        success: function (res) {
   
          //打印相关信息
          console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available);
   
          that.setData({
            info: JSON.stringify(res.errMsg) +"\n蓝牙是否可用：" + res.available
          })
   
        },
        fail: function (res) {
   
          //打印相关信息
          console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available);
   
          that.setData({
            info: JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available
          })
   
        }
        
      })
   
    },
   
   
   
    lanyatest3(event){
      var that = this;
      wx.startBluetoothDevicesDiscovery({
        services: ['FEE7'], //如果填写了此UUID，那么只会搜索出含有这个UUID的设备，建议一开始先不填写或者注释掉这一句
        success: function (res) {
          that.setData({
            info: "搜索设备" + JSON.stringify(res),
          })
          console.log('搜索设备返回' + JSON.stringify(res))
   
        }
      })
   
    },
   
   
   
   
    lanyatest4(event){
      var that = this;
      wx.getBluetoothDevices({
        success: function (res) {
   
          that.setData({
            info: "设备列表\n" + JSON.stringify(res.devices),
            devices: res.devices
          })
          console.log('搜设备数目：' + res.devices.length)
          console.log('设备信息：\n' + JSON.stringify(res.devices)+"\n")
        }
      })
   
    },
   
   
   
    lanyaconnect(event){
      var that = this;
      wx.createBLEConnection({
        deviceId: event.currentTarget.id,
        success: function (res) {
          console.log('调试信息：' + res.errMsg);
          that.setData({
            connectedDeviceId: event.currentTarget.id,
            info: "MAC地址：" + event.currentTarget.id  + '  调试信息：' + res.errMsg,
            
          })
        },
        fail: function () {
          console.log("连接失败");
        },
   
      })
   
    },
   
   
    lanyatest6(event){
      var that = this;
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          console.log("停止搜索" + JSON.stringify(res.errMsg));
          that.setData({
            info: "停止搜索"  + JSON.stringify(res.errMsg),
          })
        }
      })
   
    },
   
   
   
  //我删除了自动生成的生命周期函数
   
  })