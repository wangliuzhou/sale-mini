// pages/moneyDetail/idnex.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    psize: 10,
    index: 0,
    list: [{}, {}, {}],
    begin: "",
    end: "",
    total: ""
  },

  onLoad: function(options) {
    this.getList();
  },

  onReachBottom: function() {
    console.log("onReachBottom");
    const { page, total, psize } = this.data;
    if (page < total / psize) {
      this.setData({ page: this.data.page + 1 });
      this.getOrderList();
    }
  },
  changeIndex(e) {
    this.setData({ index: e.currentTarget.dataset.index, list: [], page: 1 });
    this.getList();
  },
  async getList() {},
  onRangeComplete(e) {
    const { begin, end } = e.detail;
    this.setData({ begin, end, list: [], page: 1 });
    this.getList();
  }
});
