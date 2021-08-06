import { post } from "../../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    id: '',
    devicelist:[],
    goodslist:[],
    username:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ id: options.id })
    this.getInfo()
  },
  async getInfo() {
    const { data } = await post({
      r: 'manage.operation.get_lack',
      dealerid: this.data.id
    })
    this.setData(data)
    console.log(data);
    
  },
  handleInput(e) {
    this.setData({
      keyword: e.detail.value.trim()
    })
  },
  scan() {
    wx.scanCode({
      success: res => {
        console.log(res);
        if(res.result){
          wx.navigateTo({
            url: `/pages/operation/addGoods/index?deviceNo=${res.result}`,
          })
        }else{
          wx.showToast({
            title: "未获取到指定信息，请重试",
            icon: "none"
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: "扫码失败，请重试",
          icon: "none"
        });
      }
    });
  },
})