// pages/role/roleDetail/index.js
import { post } from "../../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    type: "",
    info: {
      picker: ["-", "-", "-"],
      dealerlist: [],
      dealerids: []
    },
    pointList: [],
    showPoint: false,
    choosedPointText: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const { id, type, level } = options;
    this.setData({ id, type });
    if (options.id) {
      this.getRoleDetail(options.id);
    } else {
      this.getPointlist();
      this.data.info.level = level;
      this.setData({ info: this.data.info });
    }
  },
  async getRoleDetail(id) {
    wx.showLoading({ title: "加载中" });
    const info = await post({
      r: "manage.user.get_detail",
      id
    });
    info.dealerids = info.dealerlist.map(item => item.id);
    this.setData({ info });
    if (info.level == 4 || info.level == 2) {
      this.getPointlist();
    }
    wx.hideLoading();
  },
  async getPointlist() {
    wx.showLoading({ title: "加载中" });
    let { list } = await post({
      r: "manage.dealer.lists"
    });
    list.forEach(item => {
      item.checked = this.data.info.dealerids.includes(item.id);
    });
    const chooseAll = list.every(item => item.checked);
    this.dealerids = this.data.info.dealerids;
    this.setData({ pointList: list, chooseAll });
    this.setChoosedPointText();
    wx.hideLoading();
    console.log(222, list);
  },
  checkboxChange(e) {
    const { value } = e.detail;
    console.log(11, value);
    const { pointList } = this.data;
    pointList.forEach(item => {
      item.checked = value.includes(item.id);
    });
    const chooseAll = pointList.every(item => item.checked);
    this.dealerids = value;
    this.setData({ pointList, chooseAll });
    console.log(22, this.data.pointList);
  },
  setChoosedPointText() {
    const { pointList, info } = this.data;
    const choosedPointText = pointList
      .map(item => {
        if (info.dealerids.includes(item.id)) {
          return item.username;
        }
        return "";
      })
      .filter(item => item)
      .join(",");
    this.setData({ choosedPointText });
  },
  // 取消点位选择
  cancelChoose() {
    const { pointList, info } = this.data;
    this.dealerids = info.dealerids;
    pointList.forEach(item => {
      item.checked = info.dealerids.includes(item.id);
    });
    const chooseAll = pointList.every(item => item.checked);
    this.setData({
      showPoint: false,
      pointList,
      chooseAll
    });
    this.setChoosedPointText();
  },
  // 点击确认点位选择
  submitChoosePoint() {
    this.data.info.dealerids = this.dealerids;
    this.setData({
      info: this.data.info,
      showPoint: false
    });
    console.log(this.data.info);
    this.setChoosedPointText();
  },
  chooseAll() {
    const { chooseAll, pointList } = this.data;
    if (chooseAll) {
      pointList.forEach(item => {
        item.checked = false;
      });
      this.setData({
        chooseAll: false,
        pointList
      });
      this.dealerids = [];
    } else {
      pointList.forEach(item => {
        item.checked = true;
      });
      this.setData({
        chooseAll: true,
        pointList
      });
      this.dealerids = pointList.map(item => item.id);
    }
  },
  // 点击提交信息，
  // 编辑或新增信息
  async handleSubmit() {
    const { id, info } = this.data;
    if (id) {
      this.data.info.id = id;
    }
    this.data.info.bearcost = Number(!!info.bearcost);
    console.log("params===", this.data.info);
    if (this.data.info.dealerids) {
      this.data.info.dealerids = JSON.stringify(this.data.info.dealerids);
    }
    // return;
    await post({
      r: "manage.user.submit",
      ...this.data.info
    });
    wx.showToast({
      title: id ? "编辑成功" : "添加成功",
      icon: "none"
    });
    // wx.navigateBack();
  },
  showPointModal() {
    this.setData({ showPoint: !this.data.showPoint });
  },
  handleChange(e) {
    console.log(e);
    const { type } = e.currentTarget.dataset;
    const { value } = e.detail;
    if ("picker" === type) {
      this.data.info["province"] = value[0];
      this.data.info["city"] = value[1];
      this.data.info["area"] = value[2];
    } else {
      this.data.info[type] = value;
    }
    this.setData({
      info: this.data.info
    });
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
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
});
