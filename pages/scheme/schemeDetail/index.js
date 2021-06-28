// scheme js
// pages/role/roleDetail/index.js
import { post } from "../../../utils/request";
Page({
  initItem: {
    catename: "",
    cellNo: "",
    costprice: "",
    goodsid: "",
    id: "",
    marketprice: "",
    remarks: "",
    sell_agentid: "",
    sell_schemeid: "",
    sharescale: "",
    subtitle: "",
    thumb: "",
    title: "",
    uniacid: ""
  },
  data: {
    id: "",
    info: {
      lists: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    for (let i = 0; i < 9; i++) {
      this.data.info.lists.push(this.initItem);
    }
    this.setData({ info: this.data.info });
    const { id = "" } = options;
    this.setData({ id });
    if (options.id) {
      this.getDetail(options.id);
    }
  },
  async getDetail(id) {
    wx.showLoading({ title: "加载中..." });
    const info = await post({
      r: "manage.scheme.get_detail",
      id
    });
    console.log(123, info);
    for(let i in info.lists){
      this.data.info.lists[i - 1] = info.lists[i];
    }
    this.data.info.name = info.name
    
    // info.lists.forEach(item => {
    //   const { cellNo } = item;
    //   this.data.info.lists[cellNo - 1] = item;
    // });
    // info.lists = this.data.info.lists;
    this.setData({ info: this.data.info});
    wx.hideLoading();
  },
  // 点击提交信息，
  // 编辑或新增信息
  async handleSubmit() {
    const params = {
      name: this.data.info.name,
      detailed: JSON.stringify(this.data.info.lists)
    };
    console.log("this.data.info.lists", this.data.info.lists);

    wx.showLoading({ title: "加载中..." });
    const { id } = this.data;
    if (id) {
      params.id = id;
    }
    // return;
    console.log("params===", params);
    await post({
      r: "manage.scheme.submit",
      ...params
    });
    wx.showToast({
      title: id ? "编辑成功" : "添加成功",
      icon: "none"
    });
    // wx.navigateBack();
  },
  nameChange(e) {
    const { value } = e.detail;
    this.data.info.name = value.trim();
    this.setData({ info: this.data.info });
  },
  onInput(e) {
    const { index, type } = e.currentTarget.dataset;
    this.data.info.lists[index][type] = e.detail.value.trim();
    this.setData({ info: this.data.info });
  },
  chooseCate(e) {
    const { index } = e.currentTarget.dataset;
    console.log(index);
    wx.navigateTo({
      url: "/pages/scheme/cateList/index?index=" + index
    });
  },
  setItemFromGoodsList(goods) {
    let item = this.data.info.lists[goods.index];
    item = { ...item, ...goods, cellNo: goods.index + 1 };
    console.log(item);
    this.data.info.lists[goods.index] = item;
    this.setData({ info: this.data.info });
    console.log(22, this.data.info);
  },
  onTapNum(e) {
    const { numIdx, listIdx } = e.currentTarget.dataset;
    if (numIdx == listIdx) return;
    const item = { ...this.data.info.lists[listIdx] };
    const targetItem = { ...(this.data.info.lists[numIdx] || {}) };
    const { goodsid, marketprice, costprice, sharescale } = item;
    const { cellNo: targetCellNo } = targetItem;
    if (!goodsid) {
      return wx.showToast({ title: "请选择商品", icon: "none" });
    }
    if (!marketprice) {
      return wx.showToast({ title: "请输入商品售价", icon: "none" });
    }
    if (!costprice) {
      return wx.showToast({ title: "请输入商品成本价", icon: "none" });
    }
    if (!sharescale) {
      return wx.showToast({ title: "请输入点位分成", icon: "none" });
    }
    if (numIdx == 9) {
      // 点击全按钮
      const existGoods = this.data.info.lists
        .filter(item => item.cellNo)
        .map(item => item.cellNo);
      if (existGoods.length) {
        wx.showModal({
          title: "提示",
          content: existGoods.join(",") + "号柜已存在商品，确认覆盖？",
          confirmText: "确认",
          cancelText: "取消",
          success: result => {
            if (result.confirm) {
              this.data.info.lists.forEach((obj, index) => {
                let itemCopyDeep = { ...item };
                itemCopyDeep.cellNo = index + 1;
                this.data.info.lists[index] = itemCopyDeep;
              });
              wx.showToast({ title: "所有号柜同步成功", icon: "none" });
              this.setData({ info: this.data.info });
              console.log(2222, this.data.info.lists);
            }
          }
        });
      } else {
        this.data.info.lists.forEach((obj, index) => {
          let itemCopyDeep = { ...item };
          itemCopyDeep.cellNo = index + 1;
          this.data.info.lists[index] = itemCopyDeep;
        });
        wx.showToast({ title: "所有号柜同步成功", icon: "none" });
        this.setData({ info: this.data.info });
        console.log(2222, this.data.info.lists);
      }
      return;
    }
    if (targetCellNo) {
      wx.showModal({
        title: "提示",
        content: numIdx + 1 + "号柜已存在商品，确认覆盖？",
        confirmText: "确认",
        cancelText: "取消",
        success: result => {
          if (result.confirm) {
            item.cellNo = numIdx + 1;
            this.data.info.lists[numIdx] = item;
            wx.showToast({ title: numIdx + 1 + "号柜同步成功", icon: "none" });
            this.setData({info:this.data.info})
          }
        }
      });
    } else {
      item.cellNo = numIdx + 1;
      this.data.info.lists[numIdx] = item;
      wx.showToast({ title: numIdx + 1 + "号柜同步成功", icon: "none" });
      this.setData({info:this.data.info})
    }
    this.setData({ info: this.data.info });
    console.log(2222, this.data.info.lists);
  }
});
