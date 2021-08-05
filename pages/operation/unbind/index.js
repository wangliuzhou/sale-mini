// pages/operation/unbind/index.js
import { post } from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  scan() {
    wx.scanCode({
      success: res => {
        console.log(res);
        this.setData({
          deviceNo: res.result
        })
      },
      fail: () => {
        wx.showToast({
          title: "扫码失败，请重试",
          icon: "none"
        });
      }
    });
  },
  async handleSubmit() {
    await post({
      r: 'manage.operation.unbound_device',
      deviceNo: this.data.deviceNo
    })
    wx.showToast({
      title: '解绑成功',
      icon: 'none',
      success: (res) => {
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})