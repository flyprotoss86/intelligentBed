<template>
  <div>
    <div id="myChartHeart" style="width: 600px;height: 200px;"/>
    <div id="myChartResp" style="width: 600px;height: 200px;"/>
    <div id="myChartTidong" style="width: 600px;height: 200px;"/>
    <div id="myChartSleep1" style="width: 600px;height: 600px;"/>
    <div id="myChartSleep2" style="width: 600px;height: 200px;"/>
    <div>
      <a @click="()=>{this.$router.history.go(-1)}" >返回</a>
    </div>
  </div>
</template>

<script>
import echarts from "echarts"
import $ from "jquery"
const url3 = "http://www.qlyovo.com/zncd/getHealthReport.aspx?materialId="
export default {
    name: "",
    data() {
        return {
        }
    },
    mounted() {
        console.log(this.$route.params.materialId)
        $.get(
            `${url3 + this.$route.params.materialId}&date=${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,

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
                }

                this.drawLine("myChartHeart",data.heartBeatDetailListVoBean.details[0].timeList,data.heartBeatDetailListVoBean.details[0].heartBeatList,
                    '心率频率轨迹图', '时间', '心率(次/分钟)')
                this.drawLine("myChartResp",data.respRateListVoBean.respRateVoBeanList[0].timeList,data.respRateListVoBean.respRateVoBeanList[0].respRateList,
                    '呼吸频率轨迹图', '时间', '呼吸(次/分钟)')
                this.drawSleep("myChartSleep1",data.userSleepRangeListVoBean.sleepRanges)
            })


    },

    methods: {
        drawSleep(id,sleepData){
            let myChart = echarts.init(document.getElementById(id));
            let categories = [ '睡眠质量']
            let types = [
                {sleepStatus: 0, color: '#dfdfdf'},
                {sleepStatus: 1, color: '#8ada6f'},
                {sleepStatus: 2, color: '#8ada6f'},
                {sleepStatus: 3, color: '#fdb302'},
                {sleepStatus: 4, color: '#fdb302'},
                {sleepStatus: 5, color: '#dde403'},
                {sleepStatus: 6, color: '#40a5d6'},
                {sleepStatus: 7, color: '#dddddd'},
            ]
            let startTime = 0
            let data=[]
            sleepData.unshift({"endTime":"11:59:00","sleepStatus":0,"startTime":"12:00:00"})
            sleepData.forEach(o=>{
                data.push({
                    sleepStatus: o.sleepStatus,
                    value: [0, getMins(o.startTime), getMins(o.endTime), getMins(o.endTime) - getMins(o.startTime)],
                    itemStyle : getStyle(o.sleepStatus)
                })
            })

            function getMins(timeStr){
                return (((Number(timeStr.split(':')[0])-12)+24)%24) *60+(Number(timeStr.split(':')[1]))
            }
            function getStyle(sleepStatus){
                return {
                    "normal":
                        {
                            //0离床 1:清醒<6> , 2:浅睡<43> , 3:深睡<12> , 4:离床<7> , 5:Rem<5>  7:离床
                            "color": types.filter(i => i.sleepStatus === sleepStatus)[0].color
                        }
                }
            }
            function formatter (val) {
                console.log(val)
                return val
                //return Math.max(0, val - startTime) + ' ms';
            }


            function renderItem(params, api) {
                var categoryIndex = api.value(0);
                var start = api.coord([api.value(1), categoryIndex]);
                var end = api.coord([api.value(2), categoryIndex]);
                var height = api.size([0, 1])[1] * 0.6;

                return {
                    type: 'rect',
                    shape: echarts.graphic.clipRectByRect({
                        x: start[0],
                        y: start[1] - height / 2,
                        width: end[0] - start[0],
                        height: height
                    }, {
                        x: params.coordSys.x,
                        y: params.coordSys.y,
                        width: params.coordSys.width,
                        height: params.coordSys.height
                    }),
                    style: api.style()
                };
            }

            myChart.setOption({
                tooltip: {
                    formatter: function (params) {
                        return params.marker + params.name + ': ' + params.value[3] + ' mhahas';
                    }
                },
                title: {
                    text: '睡眠状态分布图',
                    left: 'center'
                },
                dataZoom: [],
                grid: {
                    height:300
                },
                xAxis: {
                    min: 'startTime',
                    scale: true,
                    axisLabel: {
                        formatter: formatter
                    }
                },
                yAxis: {
                    data: categories
                },
                series: [{
                    type: 'custom',
                    renderItem: renderItem,
                    itemStyle: {
                        normal: {
                            opacity: 0.9
                        }
                    },
                    encode: {
                        x: [1, 2],
                        y: 0,
                        label: 1,
                        tooltip: [2, 4, 3]
                    },
                    data: data
                }]
            });
        },
        drawLine(id, xData, yData, title, xName, yName) {

            var myChart = echarts.init(document.getElementById(id));
            myChart.setOption({
                title: {
                    text: title
                },
                tooltip: {

                },
                xAxis: {
                    name: xName,
                    data: xData
                },
                yAxis: {
                    name: yName,
                },
                series: [{
                    type: 'line',
                    data: yData
                }]
            });


        },
    },

}
</script>

<style lang="scss" module>

</style>
