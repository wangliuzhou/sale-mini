import { post } from "../../utils/request";

//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    showModal:false,
    warnTotalNum: 0,
    active: 1,
    info: "",
    list: [
      {
        title: "点位管理",
        desc: "创建/编辑点位",
        image: "../../images/index/point.png",
        path: "/pages/point/pointList/index"
      },
      {
        title: "方案管理",
        desc: "创建/编辑方案",
        image: "../../images/index/function.png",
        path: "/pages/scheme/schemeList/index"
      },
      // {
      //   title: "活动管理",
      //   desc: "创建/开启活动",
      //   image: "../../images/1.png"
      // },
      {
        title: "用户管理",
        desc: "创建/编辑用户",
        image: "../../images/index/user.png",
        path: "/pages/role/roleType/index"
      },
      {
        title: "订单管理",
        desc: "订单记录/查询",
        image: "../../images/index/order.png",
        path: "/pages/order/orderList/index"
      },
      {
        title: "运维管理",
        desc: "设备维护/补货",
        image: "../../images/index/run.png",
        path: "/pages/operation/operationList/index"
      }
    ]
  },
  async chooseActive(e) {
    wx.showLoading({
      title: "加载中..."
    });
    const { index } = e.currentTarget.dataset;
    const info = await post({
      r: "manage.home",
      datetype: index
    });
    this.setData({ info, active: index });
    wx.hideLoading();
  },
  goPage(e) {
    const { path } = e.currentTarget.dataset;
    console.log(11, e, path);
    wx.navigateTo({
      url: path
    });
  },
  onLoad: async function () { 
    
  },
  onShow() {
    this.getWaringList()
    this.chooseActive({
      currentTarget: {
        dataset: {
          index: this.data.active
        }
      }
    });
  },
  // 电量预警
  async getWaringList() {
    let { total } = await post({
      r: "manage.operation.get_waringlist",
      page:1,
      psize:100000000,
      dealerid: '',
    });
    if(this.loaded){
      // 不是第一次onshow
      this.setData({ warnTotalNum: total });
    }else{
      // 第一次onshow
      this.loaded=true
      this.setData({ warnTotalNum: total, showModal:total>0 });
    }
  },
  hideModal(){
    this.setData({showModal:false})
  },
  goLowerEle(){
    wx.navigateTo({
      url:"/pages/operation/electricityWarn/index"
    })
    this.setData({showModal:false})
  }
});
