// pages/role/roleList/index.js
import { post } from "../../../utils/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    level: "",
    type: "",
    page: 1,
    psize: 20,
    list: [
      // {
      //   id: "2",
      //   level: "1",
      //   realname: "王先生",
      //   mobile: "15388048808",
      //   icon: "../../../images/1.png",
      //   province: "河北省",
      //   city: "石家庄市",
      //   area: "元氏县",
      //   device_num: "0", //持有设备  --代理有效
      //   device_lack: "0" //缺货设备  --代理有效
      // },
      // {
      //   id: "3",
      //   level: "2",
      //   realname: "王先生",
      //   icon: "../../../images/1.png",
      //   mobile: "15388048808",
      //   province: "河北省",
      //   city: "石家庄市",
      //   area: "元氏县",
      //   device_num: "0", //持有设备  --代理有效
      //   device_lack: "0" //缺货设备  --代理有效
      // },
      // {
      //   id: "5",
      //   level: "3",
      //   realname: "王先生",
      //   mobile: "15388048808",
      //   province: "河北省",
      //   icon: "../../../images/1.png",
      //   city: "石家庄市",
      //   area: "元氏县",
      //   device_num: "0", //持有设备  --代理有效
      //   device_lack: "0" //缺货设备  --代理有效
      // },
      // {
      //   id: "5",
      //   level: "4",
      //   realname: "王先生",
      //   mobile: "15388048808",
      //   province: "河北省",
      //   icon: "../../../images/1.png",
      //   city: "石家庄市",
      //   area: "元氏县",
      //   device_num: "0", //持有设备  --代理有效
      //   device_lack: "0" //缺货设备  --代理有效
      // }
    ],
    total: 0,
    keyword: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, type } = options;
    this.setData({ level: id, type });
    this.getList();
  },
  goPage(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/role/roleDetail/index?id=${id}&type=${this.data.type}&level=${this.data.level}`
    });
  },
  addRole() {
    wx.navigateTo({
      url: `/pages/role/roleDetail/index?type=${this.data.type}&level=${this.data.level}`
    });
  },
  async getList() {
    const { level, keyword, page, psize, list } = this.data;
    wx.showLoading({
      title: "加载中..."
    });
    const info = await post({
      r: "manage.user.get_list",
      level,
      keyword,
      page,
      psize
    });
    wx.hideLoading();
    this.setData({
      list: list.concat(info.list),
      total: info.total
    });
  },
  handleInput(e) {
    this.setData({ keyword: e.detail.value.trim() });
  },
  search() {
    this.setData({
      list: [],
      page: 1
    });
    this.getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");
    const { page, total, psize } = this.data;
    if (page < total / psize) {
      this.setData({ page: this.data.page + 1 });
      this.getList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
});
