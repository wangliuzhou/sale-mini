import { post } from "../../../utils/request";
import wlz from '../../../helper/index'
Page({
  deviceNumber: "",
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
    2: [], // 打开某一电机, openDevice有赋值
    3: [0xa5, 0x01, 0x06], // 开灯30s 暂时不用的指令
    4: [0xa5, 0x01, 0x0c], // 暂时不用的指令
    5: [0xa5, 0x01, 0x07], // 暂时不用的指令
    6: [0xa5, 0x01, 0x08], // 暂时不用的指令
    7: [0xa5, 0x01, 0x09], // 暂时不用的指令
    8: [0xa5, 0x01, 0x0a], // 暂时不用的指令
    9: []  // 定时打开,暂时不用的指令
  },
  data: {
    deviceNumber: '',
    serviceStatus: '',
    electricNumber: null,
    list: [],
  },

  onLoad: function (options) {
    this.getInit(options.deviceNo)
  },

  async getInit(deviceNo) {
    const { data } = await post({
      r: 'manage.operation.get_devicelack',
      deviceNo,
      // deviceNo: 'A00001' || deviceNo
    })
    this.setData(data)
    // this.deviceNumber = '11000173' || data.id
    this.deviceNumber = data.id
    console.log(data);
  },
  onUnload() {
    wlz.closeBluetoothAdapter();
    console.log('关闭了蓝牙');
  },
  scan() {
    wx.scanCode({
      success: res => {
        console.log(res);
        this.deviceNumber = res.result;
        this.setData({ deviceNumber: res.result })
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
    wx.openBluetoothAdapter().then(res => {
      wx.showLoading({ title: "设备搜索中" });
      let bles = []
      setTimeout(async () => {
        wx.onBluetoothDeviceFound(({ devices }) => {
          console.log('search list', devices);
          devices.forEach(item => {
            const isExist = bles.find(ble => ble.name == item.name)
            if (!isExist) {
              bles.push(item)
              console.log('全部蓝牙', bles);
            }
            //找到指定设备，关闭搜索
            if (item.name === this.deviceNumber) {
              wlz.stopBluetoothDevicesDiscovery();
              const { deviceId } = item;
              this.deviceId = deviceId;
              wx.showLoading({ title: "设备连接中" });
              that.createBLEConnection(item)
            }
          })
        })
        await wlz.startBluetoothDevicesDiscovery()
      }, 300);
    }).catch(err => {
      wx.showModal({ content: '请确保微信拥有了蓝牙权限，且蓝牙处于打开状态' });
    })
  },
  async createBLEConnection(obj) {
    // 该方法回调中可以用于处理连接意外断开等异常情况
    wx.onBLEConnectionStateChange((res) => {
      console.log('onBLEConnectionStateChange', res);
    })

    const { errCode } = await wlz.createBLEConnection({ deviceId: this.deviceId })
    if (errCode == 0) {
      this.getBLEDeviceServices()
      this.setData({ serviceStatus: '已连接' })
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
          wx.showLoading({ title: "获取到指定服务" });
        }
      })
      if (!this.serviceId) {
        wx.hideLoading()
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
          wx.showLoading({ title: "获取到指定特征值" });
        }
        if (uuid.indexOf(this.targetFCF2) > -1) {
          this.FCF2 = uuid
        }
      })
      this.notifyBLECharacteristicValueChange()
      // this.writeBLECharacteristicValue()
    } else {
      wx.hideLoading()
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
      wx.showLoading({ title: "蓝牙连接成功" });
      setTimeout(() => { wx.hideLoading() }, 300)
      // 监听低功耗蓝牙设备的特征值变化
      wx.onBLECharacteristicValueChange(res => {
        let HexString = this.arrayBufferToHexString(res.value)  // 转变成16进制的字符串
        console.log('HexString', HexString);
        if (HexString.startsWith('00')) {
          const electricNumber = parseInt(HexString, 16)
          this.setData({ electricNumber })
        }
      });
      if (this.type === 0) {
        const readRes = await wlz.readBLECharacteristicValue({
          deviceId: this.deviceId, //蓝牙设备id
          serviceId: this.serviceId, //服务id
          characteristicId: this.FCF1 //服务特征值characteristicId
        })
        console.log('readRes', readRes);
      } else {
        // 写入数据
        const order = this.orderObj[this.type]
        console.log(77, order);
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
  // 打开某一电机柜
  openDevice(e) {
    const { number } = e.currentTarget.dataset; // 想要打开几号柜
    const hexNumber = parseInt(number, 16)
    console.log('hexNumber', hexNumber);
    this.orderObj[2] = [0xa5, 0x02, hexNumber, 0x05];
    console.log(this.orderObj[2]);
    this.searchBLE({
      currentTarget: {
        dataset: {
          type: 2
        }
      }
    })
  },
  // 确认补货某一格子
  confirm(e) {
    const { number } = e.currentTarget.dataset; // 想要补货几号柜
    const idx = this.data.list.findIndex(i => i.cellNo == number);
    const { isConfirmed } = this.data.list[idx];
    if (!isConfirmed) { // 如果没确认过
      wx.showModal({
        title: '提示',
        content: `确认对${number}号格子进行补货操作吗？确认后不可撤销!`,
        success: result => {
          if (result.confirm) {
            this.sendAddGoods(number)
          }
        }
      })
    }
  },
  // 确认补货某一格子
  async sendAddGoods(number) {
    const { list } = this.data;
    const idx = list.findIndex(i => i.cellNo == number);
    await post({
      r: 'manage.operation.post_devicelack',
      deviceid: this.data.id,
      detailed: JSON.stringify([{ cellNo: number }])
    })
    wx.showToast({
      title: `${number}号格子补货成功`,
    })
    list[idx].isConfirmed = true
    this.setData({ list })
  },
  // 一键确认
  confirmAll() {
    wx.showModal({
      title: '提示',
      content: `确认对所有格子进行补货操作吗？确认后不可撤销!`,
      success: result => {
        if (result.confirm) {
          this.confirmAllFetch()
        }
      }
    })
  },
  async confirmAllFetch() {
    const { list, id } = this.data;
    const detailed = list.filter(item => !item.isConfirmed).map(item => ({ cellNo: item.cellNo }))
    console.log(detailed);
    await post({
      r: 'manage.operation.post_devicelack',
      deviceid: id,
      detailed: JSON.stringify(detailed)
    })
    wx.showToast({
      title: `补货成功`,
    })
    list.forEach(item => {
      item.isConfirmed = true
    })
    this.setData({ list })
  }
})