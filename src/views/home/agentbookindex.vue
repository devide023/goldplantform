<template>
  <div>
    <div id="date_person_chart" style="width:100%;height:300px"></div>
    <div id="datechart" style="width:100%;height:300px"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import chartsfn from "@/api/echarts/index";
export default {
  data() {
    return {
      date_person_chart: null,
      datechart: null,
      personopt: {
        title: {
          text: "日期客流量统计"
        },
        legend: {
          data: ["人数"]
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        xAxis: {
          type: "category"
        },
        yAxis: {
          type: "value"
        },
        dataset: {
          dimensions: ["日期", "人数"],
          source: []
        },
        series: [
          {
            name: "人数",
            type: "line",
            encode: {
              x: "日期",
              y: "人数"
            }
          }
        ]
      },
      dateoption: {
        title: {
          text: "日期房型预定统计"
        },
        legend: {
          data: ["豪标", "豪大", "行标", "行大", "豪套", "行套", "总套"]
        },
        xAxis: {
          type: "category"
        },
        yAxis: {
          type: "value"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        dataset: {
          dimensions: [
            "日期",
            "豪标",
            "豪大",
            "行标",
            "行大",
            "豪套",
            "行套",
            "总套"
          ],
          source: []
        },
        series: [
          {
            name: "豪标",
            type: "line",
            areaStyle: {},
            stack: "总量",
            encode: {
              x: "日期",
              y: "豪标"
            }
          },
          {
            name: "豪大",
            type: "line",
            areaStyle: {},
            stack: "总量",
            encode: {
              x: "日期",
              y: "豪大"
            }
          },
          {
            name: "行标",
            type: "line",
            areaStyle: {},
            stack: "总量",
            encode: {
              x: "日期",
              y: "行标"
            }
          },
          {
            name: "行大",
            type: "line",
            areaStyle: {},
            stack: "总量",
            encode: {
              x: "日期",
              y: "行大"
            }
          },
          {
            name: "豪套",
            type: "line",
            areaStyle: {},
            stack: "总量",
            encode: {
              x: "日期",
              y: "豪套"
            }
          },
          {
            name: "行套",
            type: "line",
            areaStyle: {},
            stack: "总量",
            encode: {
              x: "日期",
              y: "行套"
            }
          },
          {
            name: "总套",
            type: "line",
            areaStyle: {},
            stack: "总量",
            encode: {
              x: "日期",
              y: "总套"
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.date_person_chart = echarts.init(
      document.getElementById("date_person_chart")
    );
    this.datechart = echarts.init(document.getElementById("datechart"));
    this.getdatedata();
  },
  methods: {
    getdatedata() {
      chartsfn.agent_date_book_cnt().then(res => {
        this.personopt.dataset.source = res.result.map(item => {
          return {
            日期: item.日期,
            人数: item.人数
          };
        });
        this.date_person_chart.setOption(this.personopt);
        this.dateoption.dataset.source = res.result;
        this.datechart.setOption(this.dateoption);
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
