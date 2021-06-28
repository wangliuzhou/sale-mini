// pages/data/pointData/index.js
import { post } from '../../../utils/request'
import {formatDate} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    starttime:'',
    endtime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id})
    this.getInit()
  },
  onRangeComplete(e) {
    const { begin, end } = e.detail;
    console.log("onRangeComplete", begin, end);
    this.setData({
      starttime: begin,
      endtime: end
    });
    this.getInit();
  },
  async getInit(){
    const { id, starttime, endtime } = this.data;
    const {data} = await post({
      r:'manage.statistics.dealerdet',
      dealerid:id,
      starttime: starttime ? formatDate(new Date(starttime)) : "",
      endtime: endtime ? formatDate(new Date(endtime)) : ""
    })
    // data.devicelist=[
    //   {
		// 		"id": "1",
		// 		"deviceNo": "A0000001",//设备编号
		// 		"remarks": "测试",//摆放备注
		// 		"SalePrice": 1100,//成交额
		// 		"SaleNum": 11,//成交次数
		// 		"ProfitPrice": 660,//利润
		// 		"ScanNum": 2,//扫码次数
		// 		"RepairNum": 0//补货次数
		// 	},
		// 	{
		// 		"id": "6",
		// 		"deviceNo": "A00002",
		// 		"remarks": "备注2",
		// 		"SalePrice": 0,
		// 		"SaleNum": 0,
		// 		"ProfitPrice": 0,
		// 		"ScanNum": 0,
		// 		"RepairNum": 0
		// 	},
		// 	{
		// 		"id": "5",
		// 		"deviceNo": "A00001",
		// 		"remarks": "备注1",
		// 		"SalePrice": 0,
		// 		"SaleNum": 0,
		// 		"ProfitPrice": 0,
		// 		"ScanNum": 0,
		// 		"RepairNum": 0
		// 	}
    // ]
    console.log(data)
    this.setData(data)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})