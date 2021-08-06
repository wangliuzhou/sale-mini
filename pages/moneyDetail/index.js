// pages/moneyDetail/idnex.js
import { post } from '../../utils/request';
import { formatDate } from "../../utils/util";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    index: 0,
    list: [],
    page: 1,
    total: 0,
    psize: 10,
    starttime: "",
    endtime: ""
  },

  onLoad: function (options) {
    this.getList();
  },

  onReachBottom: function () {
    console.log("onReachBottom");
    const { page, total, psize } = this.data;
    if (page < total / psize) {
      this.setData({ page: this.data.page + 1 });
      this.getOrderList();
    }
  },
  changeIndex(e) {
    this.setData({ index: e.currentTarget.dataset.index });
    this.search();
  },
  async getList() {
    wx.showLoading({ title: "加载中..." });
    const { index, page, starttime, endtime, } = this.data;
    let { data = {}, } = await post({
      r: "member.log.get_list",
      page,
      type: index,
      starttime: starttime ? formatDate(new Date(starttime)) : "",
      endtime: endtime ? formatDate(new Date(endtime)) : ""
    });
    console.log('page',page);
    console.log('type',index);
    console.log('starttime', starttime ? starttime : "");
    console.log('endtime', endtime ? formatDate(new Date(endtime)) : "");
    
    let { total, list, money } = data
    list = this.data.list.concat(list);
    this.setData({ list, total, money });
    console.log(this.data.list);

    wx.hideLoading();
  },
  search() {
    this.setData({
      list: [],
      page: 1
    });
    this.getList();
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
});
