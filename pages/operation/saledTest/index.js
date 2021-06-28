// pages/operation/saledTest/index.js
import wlz from '../../../helper/index'
Page({
  sreachBLEName:"HLB",
  deviceId:'',
  targetService: 'FCF0',
  serviceId:'',
  FCF1:'', // 读取电子锁电量特性id
  FCF2:'', // 交互灯、开关等特性id
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
  async searchBLE(){
    const that = this;
    wlz.closeBluetoothAdapter();
    const openBluetooth = await wx.openBluetoothAdapter();
    if(openBluetooth.errMsg=='openBluetoothAdapter:ok'){
      setTimeout(async() =>{
        wx.onBluetoothDeviceFound(({ devices })=> {
          console.log('search list',devices);
          devices.forEach(item=>{
            //找到指定设备，关闭搜索
            if(item.name===this.sreachBLEName){
              wlz.stopBluetoothDevicesDiscovery();
              const { deviceId } = item;
              this.deviceId = deviceId;
              that.createBLEConnection(item)
            }
          })
        })
        await wlz.startBluetoothDevicesDiscovery()
      }, 300);
    }else{
      // errcode
      console.log(openBluetooth);
      // ios 13提醒权限10001
    }
  },
  async createBLEConnection(obj){
    // 该方法回调中可以用于处理连接意外断开等异常情况
    wx.onBLEConnectionStateChange((res) => {
      console.log('onBLEConnectionStateChange',res);
    })

    const { errCode } = await wlz.createBLEConnection({ deviceId: this.deviceId }) 
    if(errCode==0){
      this.getBLEDeviceServices()
    }else{
      wx.showModal({ content:'连接超时，请重试' })
      wlz.closeBluetoothAdapter();
    }
  },
  async getBLEDeviceServices(){
    const { errCode, services } = await wlz.getBLEDeviceServices({ deviceId: this.deviceId })
    if(errCode==0){
      console.log('services',services);
      services.forEach(({uuid})=>{
        //  获取服务列表 找到特定服务
        if (uuid.toUpperCase().indexOf(this.targetService) !== -1) {
          this.serviceId = uuid;
        }
      })
      if(!this.serviceId){
        wx.showModal({ content:'未找到特定服务' })
        wlz.closeBluetoothAdapter();
        return
      }
      //获取特征值
      this.getBLEDeviceCharacteristics()
    }
  },
  //获取特征值
  async getBLEDeviceCharacteristics(){
    const { errCode, characteristics } = await wlz.getBLEDeviceCharacteristics({
      deviceId: this.deviceId, 
      serviceId: this.serviceId 
    })
    console.log('characteristics',characteristics);
    if(errCode===0){
      characteristics.forEach(({uuid})=>{
        if(uuid.indexOf("FCF1")>-1){
          this.FCF1 = uuid
        }
        if(uuid.indexOf("FCF2")>-1){
          this.FCF2 = uuid
        }
      })
      this.notifyBLECharacteristicValueChange()
      // this.writeBLECharacteristicValue()
    }
  },
  // 订阅特征值改变
  async notifyBLECharacteristicValueChange(){
    const { errCode } = await wlz.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: this.deviceId, //蓝牙设备id
      serviceId: this.serviceId, //服务id
      characteristicId: this.FCF1 //服务特征值characteristicId
    })
    if(errCode===0){
      // 监听低功耗蓝牙设备的特征值变化
      wx.onBLECharacteristicValueChange(res=>{
        let HexString = this.arrayBufferToHexString(res.value)  // 转变成正常字符串
        console.log('HexString',HexString);
      });
      await wlz.readBLECharacteristicValue({
        deviceId: this.deviceId, //蓝牙设备id
        serviceId: this.serviceId, //服务id
        characteristicId: this.FCF1 //服务特征值characteristicId
      })
      
      // this.writeBLECharacteristicValue([0xa5, 0x01, 0x0b])
      // setTimeout(()=>{
      //   console.log(1,'开灯30s');
      //   this.writeBLECharacteristicValue([[0xa5, 0x01, 0x06]])
      // },10000)
      setTimeout(()=>{
        console.log(2,'开灯60s');
        this.writeBLECharacteristicValue([[0xa5, 0x01, 0x0c]])
      },2000)
      // setTimeout(()=>{
      //   console.log(3,'开灯长亮');
      //   this.writeBLECharacteristicValue([[0xa5, 0x01, 0x07]])
      // },50000)
      // setTimeout(()=>{
      //   console.log(4,'关灯');
      //   this.writeBLECharacteristicValue([[0xa5, 0x01, 0x08]])
      // },60000)
      // setTimeout(()=>{
      //   console.log(5,'打开 USB');
      //   this.writeBLECharacteristicValue([[0xa5, 0x01, 0x09]])
      // },70000)
      // setTimeout(()=>{
      //   console.log(6,'关闭 USB');
      //   this.writeBLECharacteristicValue([[0xa5, 0x01, 0x0a]])
      // },80000)
    }
  },
  // 写入的方法
  async writeBLECharacteristicValue(array){
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
    // var buffer = new ArrayBuffer(str.length / 2);
    // let dataView = new DataView(buffer);
    // let ind = 0;
    // for (var i = 0, len = str.length; i < len; i += 2) {
    //   let code = parseInt(str.substr(i, 2), 16);
    //   dataView.setUint8(ind, code);
    //   ind++;
    // }
    // console.log(buffer);
    
    // return buffer;
    var buf = new ArrayBuffer(str.length*2); // 每个字符占用2个字节
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
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