import { post } from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile: "15388047731",
    password: "15388047731"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.autoLogin();
  },
  autoLogin() {
    const token = wx.getStorageSync("token");
    if (token) {
      wx.switchTab({
        url: "/pages/index/index"
      });
    }
  },
  async formSubmit(e) {
    const { mobile, password } = e.detail.value;
    console.log(e.detail.value);
    const { token, member } = await post({
      r: "account.login",
      mobile,
      pwd: password
    });
    wx.setStorageSync("token", token);
    wx.setStorageSync("member", member);
    wx.switchTab({
      url: "/pages/index/index"
    });
  },

});
