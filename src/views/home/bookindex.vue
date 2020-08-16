<template>
  <div>
    <div id="calc_chart" style="width:100%;height:750px"></div>
    <div id="agent_chart" style="width:100%;height:400px"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import chartsfn from "@/api/echarts/index";
export default {
  data() {
    return {
      myChart: null,
      agentchart: null,
      caloption: {
        title: {
          text: "当月每日房型销售"
        },
        tooltip: {},
        legend: {
          top: 8,
          right: 20
        },
        calendar: {
          top: "middle",
          left: "center",
          orient: "vertical",
          cellSize: [140, 100],
          yearLabel: {
            show: false,
            textStyle: {
              fontSize: 18
            }
          },
          dayLabel: {
            margin: 20,
            padding: [50, 0, 0, 0],
            nameMap: [
              "星期日",
              "星期一",
              "星期二",
              "星期三",
              "星期四",
              "星期五",
              "星期六"
            ]
          },
          monthLabel: {
            show: true,
            nameMap: "cn",
            formatter: "{yyyy}年{MM}月",
            verticalAlign: "middle"
          },
          range: []
        },
        series: [
          {
            id: "label",
            type: "scatter",
            coordinateSystem: "calendar",
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return echarts.format.formatTime("dd", params.value[0]);
                },
                offset: [-60, -35],
                textStyle: {
                  color: "#000",
                  fontSize: 14
                }
              }
            },
            data: []
          }
        ]
      },
      scatterData: [],
      agentoption: {
        color: ["#ca8622", "#6e7074", "#d48265"],
        title: {
          text: "代理商预定统计"
        },
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: [],
          source: []
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category"
        },
        series: []
      }
    };
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("calc_chart"));
    this.agentchart = echarts.init(document.getElementById("agent_chart"));
    this.getdata();
    this.getagentdata();
  },
  methods: {
    getdata() {
      chartsfn.date_book_cnt().then(res => {
        this.scatterData = res.result;
        this.caloption.calendar.range = res.rang;
        this.caloption.series[0].data = res.dates.map(item => {
          return [item, Math.floor(Math.random() * 10000)];
        });
        this.myChart.setOption(this.caloption);
        let se = this.getPieSeries(this.scatterData, this.myChart);
        this.myChart.setOption({
          series: se
        });
      });
    },
    getagentdata() {
      chartsfn.agent_book_cnt().then(res => {
        this.agentoption.dataset.dimensions = res.dimensions;
        this.agentoption.dataset.source = res.result;
        let serdata = [
          {
            type: "bar",
            name: "人数"
          },
          {
            type: "bar",
            name: "房间数"
          }
        ];
        console.log(serdata);
        this.agentoption.series = serdata;
        this.agentchart.setOption(this.agentoption);
      });
    },
    getPieSeries(scatterData, chart) {
      let serobj = echarts.util.map(scatterData, function(item, index) {
        let sjs = Math.floor(Math.random() * 10000);
        let trq = item.日期;
        var center = chart.convertToPixel("calendar", [trq, sjs]);
        return {
          id: index + "pie",
          type: "pie",
          center: center,
          label: {
            normal: {
              formatter: "{c}",
              position: "inside"
            }
          },
          radius: 40,
          data: [
            { name: "豪标", value: item.豪华标准间 },
            { name: "豪大", value: item.豪华大床房 },
            { name: "行标", value: item.行政标准间 },
            { name: "行大", value: item.行政大床房 },
            { name: "豪套", value: item.豪华套房 },
            { name: "行套", value: item.行政套房 },
            { name: "总套", value: item.总统套房 }
          ]
        };
      });
      return serobj;
    }
  }
};
</script>
