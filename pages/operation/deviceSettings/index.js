// pages/operation/deviceSettings/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '',
    endTime: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  TimeChange(e) {
    console.log(e);
    const { type } = e.currentTarget.dataset;
    this.setData({ [type]: e.detail.value })
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
})