// pages/accountBind/index.js
import { post } from "../../utils/request";
import wlz from "../../helper/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bankList: [],
    bankListFormat: [],
    wxappinfo: {},
    name: "",
    card: "",
    index: ""
  },

  onLoad: function(options) {
    this.getCardList();
    this.getBindInfo();
  },

  async getCardList() {
    const { data } = await post({ r: "shop.banklist" });
    const bankListFormat = data.map(item => item.bankname);
    this.setData({ bankList: data, bankListFormat });
  },
  async getBindInfo() {
    const {
      data: { bankinfo, wxappinfo }
    } = await post({ r: "member.binds" });
    const { bankcard, bankname, bankrealname } = bankinfo;
    this.setData({
      wxappinfo,
      name: bankname,
      card: bankcard,
      index: bankrealname
    });
  },
  inputChange(e) {
    const { value } = e.detail;
    const { action } = e.currentTarget.dataset;
    this.setData({
      [action]: value.trim()
    });
  },
  async bankBand() {
    const { name, card, index } = this.data;
    if (!name || !card || !index) {
      wx.showToast({
        title: "请输入完整信息",
        icon: "none"
      });
      return;
    }
    await post({
      r: "member.bindbank",
      bankrealname: index,
      bankname: name,
      bankcard: card
    });
    wx.showToast({
      title: "银行卡绑定成功",
      icon: "none"
    });
  },
  async bindwx() {
    wx.getUserProfile({
      desc: "用于完善资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: res => {
        // this.setData({
        //   userInfo: res.userInfo,
        //   hasUserInfo: true
        // })
        this.bindwxApi(res.userInfo);
      }
    });
  },
  async bindwxApi(userInfo) {
    const { code } = await wlz.login();
    await post({
      r: "member.bindwxapp",
      code,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl
    });
    wx.showToast({
      title: "微信号绑定成功",
      icon: "none"
    });
  }
});
