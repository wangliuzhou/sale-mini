// pages/operation/saledTest/index.js
import wlz from '../../../helper/index'
Page({
  sreachBLEName: "HLB",
  deviceId: '',
  targetService: 'FCF0',

  serviceId: '',
  targetFCF1: 'FCF1',
  targetFCF2: 'FCF2',
  FCF1: '', // 读取电子锁电量特性id
  FCF2: '', // 交互灯、开关等特性id
  type: '', // 是哪个指令的orderObj的key
  orderObj: {
    0: [], // 读电量
    1: [0xa5, 0x01, 0x0b],  // 开启全部电机
    2: [], // 打开某一电机
    3: [0xa5, 0x01, 0x06], // 开灯30s
    4: [0xa5, 0x01, 0x0c],
    5: [0xa5, 0x01, 0x07],
    6: [0xa5, 0x01, 0x08],
    7: [0xa5, 0x01, 0x09],
    8: [0xa5, 0x01, 0x0a],
    9: []  // 定时打开
  },
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  scan() {
    wx.scanCode({
      success: res => {
        console.log(res);
      },
      fail: () => {
        wx.showToast({
          title: "扫码失败，请重试",
          icon: "none"
        });
      }
    });
  },
  async searchBLE(e) {
    const { type } = e.currentTarget.dataset;
    this.type = parseInt(type)
    const that = this;
    wlz.closeBluetoothAdapter();
    const openBluetooth = await wx.openBluetoothAdapter();
    if (openBluetooth.errMsg == 'openBluetoothAdapter:ok') {
      setTimeout(async () => {
        wx.onBluetoothDeviceFound(({ devices }) => {
          console.log('search list', devices);
          devices.forEach(item => {
            //找到指定设备，关闭搜索
            if (item.name === this.sreachBLEName) {
              wlz.stopBluetoothDevicesDiscovery();
              const { deviceId } = item;
              this.deviceId = deviceId;
              that.createBLEConnection(item)
            }
          })
        })
        await wlz.startBluetoothDevicesDiscovery()
      }, 300);
    } else {
      // errcode
      console.log(openBluetooth);
      // ios 13提醒权限10001
    }
  },
  async createBLEConnection(obj) {
    // 该方法回调中可以用于处理连接意外断开等异常情况
    wx.onBLEConnectionStateChange((res) => {
      console.log('onBLEConnectionStateChange', res);
    })

    const { errCode } = await wlz.createBLEConnection({ deviceId: this.deviceId })
    if (errCode == 0) {
      this.getBLEDeviceServices()
    } else {
      wx.showModal({ content: '连接超时，请重试' })
      wlz.closeBluetoothAdapter();
    }
  },
  async getBLEDeviceServices() {
    const { errCode, services } = await wlz.getBLEDeviceServices({ deviceId: this.deviceId })
    if (errCode == 0) {
      console.log('services', services);
      services.forEach(({ uuid }) => {
        //  获取服务列表 找到特定服务
        if (uuid.toUpperCase().indexOf(this.targetService) !== -1) {
          this.serviceId = uuid;
        }
      })
      if (!this.serviceId) {
        wx.showModal({ content: '未找到特定服务' })
        wlz.closeBluetoothAdapter();
        return
      }
      //获取特征值
      this.getBLEDeviceCharacteristics()
    }
  },
  //获取特征值
  async getBLEDeviceCharacteristics() {
    const { errCode, characteristics } = await wlz.getBLEDeviceCharacteristics({
      deviceId: this.deviceId,
      serviceId: this.serviceId
    })
    console.log('characteristics', characteristics);
    if (errCode === 0) {
      characteristics.forEach(({ uuid }) => {
        if (uuid.indexOf(this.targetFCF1) > -1) {
          this.FCF1 = uuid
        }
        if (uuid.indexOf(this.targetFCF2) > -1) {
          this.FCF2 = uuid
        }
      })
      this.notifyBLECharacteristicValueChange()
      // this.writeBLECharacteristicValue()
    }
  },
  // 订阅特征值改变
  async notifyBLECharacteristicValueChange() {
    const { errCode } = await wlz.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: this.deviceId, //蓝牙设备id
      serviceId: this.serviceId, //服务id
      characteristicId: this.FCF1 //服务特征值characteristicId
    })
    if (errCode === 0) {
      // 监听低功耗蓝牙设备的特征值变化
      wx.onBLECharacteristicValueChange(res => {
        let HexString = this.arrayBufferToHexString(res.value)  // 转变成正常字符串
        console.log('HexString', HexString);
      });
      if(this.type===0){
        const readRes = await wlz.readBLECharacteristicValue({
          deviceId: this.deviceId, //蓝牙设备id
          serviceId: this.serviceId, //服务id
          characteristicId: this.FCF1 //服务特征值characteristicId
        })
        console.log('readRes',readRes);
      }else{
        // 写入数据
        const order = this.orderObj[this.type] 
        console.log(77,order);
        this.writeBLECharacteristicValue(order)
      }
    }
  },
  // 写入的方法
  async writeBLECharacteristicValue(array) {
    let arrayBuffer = new Uint8Array(array).buffer;
    const res = await wlz.writeBLECharacteristicValue({
      deviceId: this.deviceId,
      serviceId: this.serviceId,
      characteristicId: this.FCF2,
      value: arrayBuffer// 把指令转变成buffer类型
    })
    console.log('写入结果', res);
  },
  // str转变成buffer类型
  hexStringToArrayBuffer(str) {
    if (!str) {
      return new ArrayBuffer(0);
    }
    var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },
  // buffer转变成str类型
  arrayBufferToHexString(buffer) {
    let bufferType = Object.prototype.toString.call(buffer);
    if (buffer != '[object ArrayBuffer]') {
      return;
    }
    let dataView = new DataView(buffer);
    var hexStr = '';
    for (var i = 0; i < dataView.byteLength; i++) {
      var str = dataView.getUint8(i);
      var hex = (str & 0xff).toString(16);
      hex = hex.length === 1 ? '0' + hex : hex;
      hexStr += hex;
    }
    return hexStr.toUpperCase();
  },
})