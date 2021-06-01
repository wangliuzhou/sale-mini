// pages/order/afterSale/index.js
import { post } from "../../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: { id: "", reason: "", type: "0", info: {} },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({ id: options.id });
    this.getInfo();
  },
  async getInfo() {
    const info = await post({ r: "manage.order.refund", id: this.data.id });
    this.setData({ info });
  },
  reasonChnage(e) {
    this.setData({ reason: e.detail.value.trim() });
  },
  radioChange(e) {
    this.setData({ type: e.detail.value });
  },
  async handleSubmit() {
    const { type, reason, id } = this.data;
    await post({
      r: "manage.order.refund.submit",
      id,
      type,
      reason
    });
    wx.showToast({
      title: "提交成功",
      icon: "none"
    });
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 1500);
  }
});
