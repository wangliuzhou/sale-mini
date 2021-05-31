// pages/withdraw/index.js
import { post } from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    value: "",
    data: { moneytext: "" }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInfo();
  },
  async getInfo() {
    const { data } = await post({
      r: "member.withdraw"
    });
    console.log(data);
    this.setData({ data });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  chooseType(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ index: type });
  },
  onValueChange(e) {
    this.setData({ value: e.detail.value.trim() });
  },
  total() {
    this.setData({ value: this.data.data.moneytext });
  },
  async handleSubmit() {
    wx.showLoading({
      title: "提现中..."
    });
    await post({
      r: "member.withdraw.submit",
      applytype: this.data.index,
      money: this.data.value
    });
    wx.showLoading({
      title: "提现成功"
    });
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 1500);
  }
});
