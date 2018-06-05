<template>
  <div>
    <div>
      <a :class="$style.btnback" @click="()=>{this.$router.history.go(-1)}" >返回</a>
    </div>
    <div :class="$style.box">
      <div id="myChartHeart" style="width: 600px;height: 400px;"/>
      <div id="myChartResp" style="width: 600px;height: 400px;"/>
      <div id="myChartSleep2" style="width: 600px;height: 400px;"/>
      <div style="width: 600px;height: 450px;">
      <div id="myChartSleep1" style="width: 600px;height: 400px;"/>
      <ul id="myChartSleep1sub" style="display:none" :class="$style.labelBox">
        <li>离床</li>
        <li>清醒</li>
        <li>REM</li>
        <li>浅睡</li>
        <li>深睡</li>
      </ul>
      </div>
      <div id="myChartTidong" style="width: 600px;height: 400px;"/>
    </div>
  </div>
</template>

<script>
import echarts from "echarts"
require("echarts/lib/component/legend")
import $ from "jquery"
const url3Test = "http://www.qlyovo.com/zncd/getHealthReport.aspx?materialId="
const url3 = "http://192.168.8.109:8080/SleepCareIIServer/getHealthReport.action?materialId="  // 18686000003218&date=2018-05-30
export default {
    mounted() {
        console.log(this.$route.params.materialId)
        let url = `${url3 + this.$route.params.materialId}&date=${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
        if (this.$route.params.materialId === "18601000000036") {
            url = `${url3Test + this.$route.params.materialId}&date=${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
        }

        $.get(url,
            (data) => {
                if (data && data.activityInfoVoBeanII && data.activityInfoVoBeanII.errorCode === -996) {
                    for (let i = 1; i < data.heartBeatDetailListVoBean.details.length; i++) {
                        data.heartBeatDetailListVoBean.details[0].heartBeatList =
                            data.heartBeatDetailListVoBean.details[0].heartBeatList.concat(data.heartBeatDetailListVoBean.details[i].heartBeatList)
                        data.heartBeatDetailListVoBean.details[0].timeList =
                            data.heartBeatDetailListVoBean.details[0].timeList.concat(data.heartBeatDetailListVoBean.details[i].timeList)
                    }

                    for (let i = 1; i < data.respRateListVoBean.respRateVoBeanList.length; i++) {
                        data.respRateListVoBean.respRateVoBeanList[0].respRateList =
                            data.respRateListVoBean.respRateVoBeanList[0].respRateList.concat(data.respRateListVoBean.respRateVoBeanList[i].respRateList)
                        data.respRateListVoBean.respRateVoBeanList[0].timeList =
                            data.respRateListVoBean.respRateVoBeanList[0].timeList.concat(data.respRateListVoBean.respRateVoBeanList[i].timeList)
                    }

                    for (let i = 1; i < data.bodyMotionListVoBean.details.length; i++) {
                        data.bodyMotionListVoBean.details[0].bodyMotionList =
                            data.bodyMotionListVoBean.details[0].bodyMotionList.concat(data.bodyMotionListVoBean.details[i].bodyMotionList)
                        data.bodyMotionListVoBean.details[0].timeList =
                            data.bodyMotionListVoBean.details[0].timeList.concat(data.bodyMotionListVoBean.details[i].timeList)
                    }

                    this.drawLine("myChartHeart", data.heartBeatDetailListVoBean.details[0].timeList, data.heartBeatDetailListVoBean.details[0].heartBeatList,
                        "心率频率轨迹图", "时间", "心率(次/分钟)", '#fcaea4')
                    this.drawLine("myChartResp", data.respRateListVoBean.respRateVoBeanList[0].timeList, data.respRateListVoBean.respRateVoBeanList[0].respRateList,
                        "呼吸频率轨迹图", "时间", "呼吸(次/分钟)", '#a2da81')

                    this.drawSleep2("myChartSleep2", data.userSleepRangeListVoBean.sleepRanges, '#ca1317', '#8a8a8a')
                    this.drawSleep("myChartSleep1", data.userSleepRangeListVoBean.sleepRanges)
                    this.drawTidong2("myChartTidong", data.bodyMotionListVoBean.details[0], '#5badd5')


                    document.getElementById('myChartSleep1sub').style.display = ''
                }
            })
    },

    methods: {
        drawTidong2(id, sleepData, color) {
            const myChart = echarts.init(document.getElementById(id))
            myChart.setOption({
                title: {
                    text: "体动",
                    left: "center",
                },
                tooltip: {
                },
                xAxis: {
                    name: "时间",
                    data: sleepData.timeList,
                },
                yAxis: {
                    name: "体动",
                },
                series: [{
                    type: "line",
                    symbol: "none",
                    data: sleepData.bodyMotionList,
                    lineStyle:{
                        color
                    }
                }],
            })
        },

        drawTidong(id, sleepData) {
            const myChart = echarts.init(document.getElementById(id))

            // const xAxisData = ["", ""]
            // const customData = [
            //     [0, 811.99, 727.8, 632.25, 580.34, 651.56, 735.31, 822.98],
            //     [1, 792.77, 771.73, 700.52, 758.81, 804.89, 759.94, 741.75],
            // ]
            // const customData1 = [
            //     [[0, 0], [1, 811.99], [2, 727.8], [3, 632.25], [4, 580.34], [5, 651.56], [6, 735.31], [7, 822.98]],
            //     [[11, 1], [12, 792.77], [13, 771.73], [14, 700.52], [15, 758.81], [16, 804.89], [17, 759.94], [18, 741.75]],
            // ]

            var xAxisData = []  // 组，每增加1组数据，添加1个空串
            var customData = []   // 没组个数，记录每组数据点个数
            var customData1 = []  // 数据详情


            let startIndex = -1
            let groupSimp = []
            let groupDetail = []
            for (let i = 0; i < sleepData.bodyMotionList.length; i++) {
                if (sleepData.bodyMotionList[i] !== 0) {
                    if (startIndex === -1) {
                        // 开始新的一组
                        startIndex = i
                    }
                    groupDetail.push([sleepData.timeList[i], sleepData.bodyMotionList[i]])
                    groupSimp.push(sleepData.bodyMotionList[i])

                    if (i === sleepData.bodyMotionList.length - 1) {
                        if (groupDetail.length > 1) {
                            // 到结尾，结束
                            xAxisData.push("")

                            const tmp = new Array(groupDetail.length)
                            tmp.fill(10)
                            customData.push(tmp)

                            customData1.push(groupDetail)
                        }
                        groupDetail = []
                        groupSimp = []
                    }
                }
                else {
                    // 1组结束
                    if (startIndex > -1) {
                        startIndex = -1

                        if (groupDetail.length > 1) {
                            xAxisData.push("")
                            groupSimp.unshift(xAxisData.length - 1)
                            customData.push(groupSimp)
                            customData1.push(groupDetail)
                        }
                        groupDetail = []
                        groupSimp = []
                    }
                }
            }


            console.log(JSON.stringify(xAxisData))
            console.log(JSON.stringify(customData))
            console.log(JSON.stringify(customData1))


            var xAxisData = ["", ""]
            var customData = [
                [0, 811.99, 727.8, 632.25, 580.34, 651.56, 735.31, 822.98],
                [1, 792.77, 771.73, 700.52, 758.81, 804.89, 759.94, 741.75],
            ]

            var customData1 = [
                [[1, 0], [11, 811.99], [111, 727.8], [1111, 632.25], [2222, 580.34], [3333, 651.56], [4444, 735.31], [5555, 822.98]],
                [[11, 1], [12, 792.77], [13, 771.73], [14, 700.52], [15, 758.81], [16, 804.89], [17, 759.94], [18, 741.75]],
            ]

            console.log(JSON.stringify(xAxisData))
            console.log(JSON.stringify(customData))
            console.log(JSON.stringify(customData1))


            function getMins(timeStr) {
                return (((Number(timeStr.split(":")[0]) - 12) + 24) % 24) * 60 + Number(timeStr.split(":")[1])
            }

            function renderItem(params, api) {
                const xValue = api.value(0)
                const points = []

                // console.log(xValue)
                // console.log(customData1[xValue])

                for (const o of customData1[xValue]) {
                    // points.push([o[0],o[1]])

                    // console.log([o[0],o[1]],  [getMins(o[0]), o[1]])

                    // points.push(api.coord([ getMins(o[0]), o[1]]))
                    points.push([o[0], o[1]])
                }

                // points = [[11,1],[12,792.77],[13,771.73],[14,700.52],[15,758.81],[16,804.89],[17,759.94],[18,741.75]]

                // console.log(JSON.stringify( points))
                const style = api.style({
                    stroke: api.visual("color"),
                    fill: null,
                })
                return {
                    type: "polyline",
                    shape: {
                        points,
                    },
                    style,
                }
            }

            myChart.setOption({
                title: {
                    text: "体动图",
                    left: "center",
                },
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                },
                dataZoom: [],
                xAxis: {
                    data: xAxisData,
                },
                yAxis: {},
                series: [{
                    type: "custom",
                    name: "",
                    renderItem,
                    itemStyle: {
                        normal: {
                            borderWidth: 2,
                        },
                    },
                    encode: {
                        x: 10,
                        y: 1,
                    },
                    data: customData,
                }],
            }

            )
        },

        drawSleep(id, sleepData) {
            const myChart = echarts.init(document.getElementById(id))
            const data = []
            const startTime = 0// +new Date();
            const categories = [""]
            const types = [
                { sleepStatus: 0, color: "#dfdfdf", desc: "离床" },
                { sleepStatus: 1, color: "#8ada6f", desc: "深睡" },
                { sleepStatus: 2, color: "#8ada6f", desc: "深睡" },
                { sleepStatus: 3, color: "#fdb302", desc: "浅睡" },
                { sleepStatus: 4, color: "#fdb302", desc: "浅睡" },
                { sleepStatus: 5, color: "#dde403", desc: "Rem" },
                { sleepStatus: 6, color: "#40a5d6", desc: "清醒" },
                { sleepStatus: 7, color: "#dddddd", desc: "离床" },
            ]
            sleepData.unshift({ endTime: "11:59:00", sleepStatus: 0, startTime: "12:00:00" })
            for (const o of sleepData) {
                data.push({
                    sleepStatus: o.sleepStatus,
                    value: [0, getMins(o.startTime), getMins(o.endTime), getMins(o.endTime) - getMins(o.startTime)],
                    itemStyle: getStyle(o.sleepStatus),
                })
            }

            function getMins(timeStr) {
                return (((Number(timeStr.split(":")[0]) - 12) + 24) % 24) * 60 + Number(timeStr.split(":")[1])
            }

            function getStyle(sleepStatus) {
                return {
                    normal:
                        {
                            color: types.filter(i => i.sleepStatus === sleepStatus)[0].color,
                        },
                }
            }

            function renderItem(params, api) {
                const categoryIndex = api.value(0)
                const start = api.coord([api.value(1), categoryIndex])
                const end = api.coord([api.value(2), categoryIndex])
                const height = api.size([0, 1])[1] * 0.6
                return {
                    type: "rect",
                    shape: echarts.graphic.clipRectByRect({
                        x: start[0],
                        y: start[1] - height / 2,
                        width: end[0] - start[0],
                        height,
                    }, {
                        x: params.coordSys.x,
                        y: params.coordSys.y,
                        width: params.coordSys.width,
                        height: params.coordSys.height,
                    }),
                    style: api.style(),
                }
            }

            myChart.setOption({
                tooltip: {
                    formatter(params) {
                        return `${params.marker}: ${(types.filter(i => i.sleepStatus === params.data.sleepStatus))[0].desc}`
                    },
                },
                legend: {
                    // orient: 'vertical',
                    // top: 'middle',
                    bottom: 100,
                    left: 0,
                    data: [1, 2, 3, 4, 5, 6, 7, 0],
                },
                title: {
                    text: "睡眠状态分布图",
                    left: "center",
                },
                dataZoom: [],
                grid: {
                    height: 300,
                },
                xAxis: {
                    name: "时间",
                    min: startTime,
                    scale: true,
                    axisLabel: {
                        formatter(val) {
                            const hour = (12 + (val / 60)) % 24
                            const min = (val % 60)
                            return `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}`
                        },
                    },
                },
                yAxis: {
                    data: categories,
                },
                series: [{
                    legendHoverLink: true,
                    // type: 'radar',
                    symbolSize: 1,
                    // label:{
                    //     show:true,
                    //     color:'#000000',
                    //     position:'top'
                    // },
                    type: "custom",
                    renderItem,
                    itemStyle: {
                        normal: {
                            opacity: 0.8,
                        },
                    },
                    encode: {
                        x: [1, 2],
                        y: 0,
                    },
                    data,
                }],
            })
        },

        drawSleep2(id, sleepData, mainColor, sideColor) {
            const myChart = echarts.init(document.getElementById(id))
            const dataSrial1=[]
            const dataSrial2=[]
            const dataX = []
            const dataY = []
            const types = [
                { sleepStatus: 0, color: "#dfdfdf", desc: "离床" },
                { sleepStatus: 1, color: "#8ada6f", desc: "深睡" },
                { sleepStatus: 2, color: "#8ada6f", desc: "深睡" },
                { sleepStatus: 3, color: "#fdb302", desc: "浅睡" },
                { sleepStatus: 4, color: "#fdb302", desc: "浅睡" },
                { sleepStatus: 5, color: "#dde403", desc: "Rem" },
                { sleepStatus: 6, color: "#40a5d6", desc: "清醒" },
                { sleepStatus: 7, color: "#dddddd", desc: "离床" },
            ]

            for (let i = 0; i < sleepData.length; i++) {
                dataSrial1.push([getMins(sleepData[i].startTime), sleepData[i].sleepStatus])
                dataSrial1.push([getMins(sleepData[i].endTime), sleepData[i].sleepStatus])
                dataSrial1.push([NaN, NaN])
            }
            for (let i = 0; i < sleepData.length; i++) {
                dataSrial2.push([getMins(sleepData[i].startTime), sleepData[i].sleepStatus])
                dataSrial2.push([NaN, NaN])
                dataSrial2.push([getMins(sleepData[i].endTime), sleepData[i].sleepStatus])
            }

            function getMins(timeStr) {
                return (((Number(timeStr.split(":")[0]) - 12) + 24) % 24) * 60 + Number(timeStr.split(":")[1])
            }

            myChart.setOption({
                title: {
                    text: "睡眠阶段图",
                    left: "center",
                },
                tooltip: {
                    formatter(params) {
                        return `睡眠状态:${types.filter(i => i.sleepStatus === params.data)[0].desc}，时间:${params.name}`
                    },
                },
                xAxis: {
                    name: "时间",
                    scale: true,
                    axisLabel: {
                        formatter(val) {
                            const hour = (12 + parseInt(val / 60)) % 24
                            const min = (val % 60)
                            return `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}`
                        },
                    },
                },
                yAxis: {
                    name: "",
                    axisLabel: {
                        formatter(val) {
                            if(val !== 0)
                              return types.filter(i => i.sleepStatus === val)[0].desc
                        },
                    },
                },
                series: [{
                    data: dataSrial1,
                    type: 'line',
                    symbol: 'none',
                    lineStyle: {
                        width: 4,
                        color: mainColor
                    }
                },{
                    data: dataSrial2,
                    type: 'line',
                    symbol: 'none',
                    smooth: true,
                    lineStyle: {
                        width: 1,
                        color: sideColor
                    }

                }],
            })
        },

        drawLine(id, xData, yData, title, xName, yName, color) {
            const myChart = echarts.init(document.getElementById(id))
            myChart.setOption({
                title: {
                    text: title,
                    left: "center",
                },
                tooltip: {

                },
                xAxis: {
                    name: xName,
                    data: xData,
                },
                yAxis: {
                    name: yName,
                },
                series: [{
                    type: "line",
                    symbol: "none",
                    data: yData,
                    lineStyle: {
                        color
                    }
                }],
            })
        },

    },

}
</script>

<style lang="scss" module>
  @import "../../css/layout";
  .box{
    @include flex(row)
  }
  .btnback{
    display: inline-block;
    font-size: 30px;
    line-height: 50px;
    padding: 10px 30px;
    margin: 10px;
    background: #dfdfdf;
    border-radius: 5px;
  }
  .labelBox{
    @include flex(row)
    justify-content: space-around;

    li{
      text-align: center;
      padding-top: 10px;
      position: relative;
      line-height: 30px;
      font-size: 18px;
      width: 100px;
      box-sizing: border-box;
      &::before{
        content: '';
        display: block;
        height: 10px;
        width: 100px;
        position:absolute;
        top:0;
        left: 0;
      }

      &:nth-child(1){
        &::before{
          background: #dfdfdf;
        }
        color: #dfdfdf;
      }
      &:nth-child(2){
        &::before{
          background: #40a5d6;
        }
        color: #40a5d6;
      }
      &:nth-child(3){
        &::before{
          background: #dde403;
        }
        color: #dde403;
      }
      &:nth-child(4){
        &::before{
          background: #fdb302;
        }
        color: #fdb302;
      }
      &:nth-child(5){
        &::before{
          background: #8ada6f;
        }
        color: #8ada6f;
      }
    }

  }
</style>
