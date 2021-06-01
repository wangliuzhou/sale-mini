// pages/order/orderList/index.js
import { post } from "../../../utils/request";
import { formatDate } from "../../../utils/util";
let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyword: "",
    index: "",
    list: [],
    pointList: [],
    pointListFormat: [],
    pointId: "",
    page: 1,
    total: 0,
    psize: 10,
    starttime: "",
    endtime: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPointList();
    this.getOrderList();
  },
  clickItem(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/order/orderDetail/index?id=" + id
    });
  },
  async handleClickBtn(e) {
    const { id, refundstate } = e.currentTarget.dataset;
    console.log(id);
    if (refundstate == 1) {
      // 取消售后
      await post({ r: "manage.order.refund.cancel", id });
      wx.showToast({
        title: "取消售后成功",
        icon: "none"
      });
      setTimeout(() => {
        this.search();
      }, 1500);
      return;
    }
    wx.navigateTo({
      url: `/pages/order/afterSale/index?id=${id}`
    });
  },
  search() {
    this.setData({
      list: [],
      page: 1
    });
    this.getOrderList();
  },
  onRangeComplete(e) {
    const { begin, end } = e.detail;
    console.log("onRangeComplete", begin, end);
    this.setData({
      starttime: begin,
      endtime: end
    });
    this.search();
  },
  async getOrderList() {
    wx.showLoading({ title: "加载中..." });
    const { pointId, page, starttime, endtime, keyword } = this.data;
    let { list, total } = await post({
      r: "manage.order.get_list",
      page,
      keyword,
      dealerid: pointId,
      starttime: starttime ? formatDate(new Date(starttime)) : "",
      endtime: endtime ? formatDate(new Date(endtime)) : ""
    });
    list = list.concat(this.data.list);

    this.setData({ list, total });
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
  handleInput(e) {
    this.setData({ keyword: e.detail.value.trim() });
  },
  pickerChange(e) {
    const pointId = this.data.pointList[e.detail.value].id;
    this.setData({ index: e.detail.value, pointId });
    this.search();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("onReachBottom");
    const { page, total, psize } = this.data;
    if (page < total / psize) {
      this.setData({ page: this.data.page + 1 });
      this.getOrderList();
    }
  }
});
