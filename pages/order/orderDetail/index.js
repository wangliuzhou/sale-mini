// pages/order/orderDetail/index.js
import { post } from "../../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.set;
    this.getOrderDetail(options.id);
  },

  async getOrderDetail(id) {
    const { order, goods } = await post({ r: "manage.order.detail", id });
    order.goods = goods;
    this.setData(order);
  },
  async handleClickBtn() {
    if (this.data.refundstate == 1) {
      // 取消售后
      await post({ r: "manage.order.refund.cancel", id: this.data.id });
      wx.showToast({
        title: "取消售后成功",
        icon: "none"
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 1500);
      return;
    }
    wx.navigateTo({
      url: `/pages/order/afterSale/index?id=${this.data.id}`
    });
  }
});
