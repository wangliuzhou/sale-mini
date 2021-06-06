// pages/operation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        title: '设备设置',
        icon: 'sbsz',
        path: '/pages/operation/deviceSettings/index'
      },
      {
        title: '设备测试',
        icon: 'sbcs',
        path: '/pages/operation/deviceTest/index'
      },
      {
        title: '消费出货测试',
        icon: 'sbcs',
        path: '/pages/operation/saledTest/index'
      },
      {
        title: '设备解绑',
        icon: 'sbjb',
        path: '/pages/operation/unbind/index'
      },
      {
        title: '补货',
        icon: 'bh',
        path: '/pages/operation/replenishment/index'
      },
      {
        title: '电量预警',
        icon: 'dlyj',
        path: '/pages/operation/electricityWarn/index'
      },
      {
        title: '未扫码预警',
        icon: 'wsmyj',
        path: '/pages/operation/notScanWarn/index'
      },
      {
        title: '故障设备',
        icon: 'gzsb',
        path: '/pages/operation/deviceBreakdown/index'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goPage(e) {
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({
      url: path,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})