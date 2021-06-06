// pages/operation/electricityWarn/index.js

import { post } from "../../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    pointList: [],
    pointListFormat: [],
    list: [],
    page: 1,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPointList();
    this.getOrderList();
  },
  async getOrderList() {
    wx.showLoading({ title: "加载中..." });
    const { pointList, page, index } = this.data;
    let { list, total } = await post({
      r: "manage.operation.get_waringlist",
      page,
      dealerid: index === '' ? '' : pointList[index].id,
    });
    list = this.data.list.concat(list);
    this.setData({ list, total });
    console.log(this.data.list);

    wx.hideLoading();
  },
  async getPointList() {
    const { list } = await post({
      r: "manage.dealer.lists",
      keyword: ""
    });
    const pointListFormat = list.map(item => item.username);
    this.setData({
      pointList: list,
      pointListFormat
    });
    console.log("pointList", list);
  },
  pickerChange(e) {
    const pointId = this.data.pointList[e.detail.value].id;
    this.setData({ index: e.detail.value, pointId });
    this.search();
  },
  search() {
    this.setData({
      list: [],
      page: 1
    });
    this.getOrderList();
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
    console.log("onReachBottom");
    const { page, total, psize } = this.data;
    if (page < total / psize) {
      this.setData({ page: this.data.page + 1 });
      this.getOrderList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})