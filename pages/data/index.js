import { formatMD, formatDate } from "../../utils/util";
import { post } from '../../utils/request'
let chart = null;
var data = [
  //   {
  //     date: "2020-07-01",
  //     money: 83
  //   },
  //   {
  //     date: "2020-07-02",
  //     money: 12
  //   },
];

function initChart(canvas, width, height, F2) {
  // 使用 F2 绘制图表

  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data, {
    value: {
      tickCount: 5,
      min: 0
    },
    date: {
      type: "timeCat",
      range: [0, 1],
      tickCount: 5,
      formatter: timeStamp => {
        return formatMD(new Date(timeStamp));
      }
    }
  });
  chart.tooltip({
    custom: true,
    showXTip: true,
    showYTip: true,
    snap: true,
    crosshairsType: "xy",
    crosshairsStyle: {
      lineDash: [2]
    }
  });
  chart.axis("date", {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = "left";
      } else if (index === total - 1) {
        textCfg.textAlign = "right";
      }
      return textCfg;
    }
  });

  chart.area().position("date*money");
  chart.line().position("date*money");
  chart.render();
  // 注意：需要把chart return 出来
  return chart;
}

Page({
  data: {
    opts: {
      onInit: initChart
    },
    showCanvas: true,
    starttime: '',
    endtime: ''
  },
  onLoad() {
    // 初始化取最近10天内的数据
    this.setData({
      starttime: +new Date() - 9 * 24 * 60 * 60 * 1000,
      endtime: +new Date()
    })
  },
  onReady: function () {
    this.getInitInfo()
  },
  goPage() {
    wx.navigateTo({
      url: '/pages/data/moreData/index',
    })
  },
  async getInitInfo() {
    const { starttime, endtime } = this.data
    const { data = {} } = await post({
      r: 'manage.statistics',
      starttime: starttime ? formatDate(new Date(starttime)) : "",
      endtime: endtime ? formatDate(new Date(endtime)) : ""
    })
    console.log('init data', data);
    console.log('starttime', starttime ? formatDate(new Date(starttime)) : "");
    console.log('endtime', endtime ? formatDate(new Date(endtime)) : "");

    this.setData(data)
    if (data.chartlist) {
      chart.changeData(data.chartlist);
    }
  },
  // 选择日期时点击缺点
  onRangeComplete(e) {
    const { begin, end } = e.detail;
    console.log("onRangeComplete", begin, end);
    this.setData({
      starttime: begin,
      endtime: end,
      showCanvas: true
    });
    this.getInitInfo();
  },
  // 日历弹起
  onShowPicker(e) {
    const showPicker = e.detail;
    if (showPicker) {
      this.setData({ showCanvas: false });
    }
  },
  // 选择日期时点击取消
  cancelChooseDate() {
    console.log(222, this.data.chartlist);
    this.setData({ showCanvas: true }, () => {
      setTimeout(() => {
        chart.changeData(this.data.chartlist);
      }, 111)
    });
  }
});
