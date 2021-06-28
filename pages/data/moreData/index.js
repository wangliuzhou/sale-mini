// pages/data/moreData/index.js
import { post } from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    psize: 10,
    list: [],
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  async getList() {
    const { page, list } = this.data;
    wx.showLoading({
      title: "加载中..."
    });
    const info = await post({
      r: "manage.statistics.dealer",
      page,
    });
    wx.hideLoading();
    this.setData({
      list: list.concat(info.list),
      total: info.total
    });
  },
  goPage(e){
    const { item = {} } = e.currentTarget.dataset;
    const { id } = item;
    wx.navigateTo({
      url: `/pages/data/pointData/index?id=${id}`
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
  onShareAppMessage: function () {

  }
})