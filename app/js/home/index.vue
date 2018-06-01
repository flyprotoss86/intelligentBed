<template lang="html">
  <div :class="$style.home">
    <material v-for="item in this.items" :item="item" :key="item.materialId" @chkdetail="chkdetail" />
  </div>
</template>

<script>
import material from "./material.vue"
import $ from "jquery"

const items = [{ currentStatus: "0", materialId: "18686000003218", messageCnt: 0, department: "骨科", ward: "302", bedNum: "6" },
    { currentStatus: "0", materialId: "18686000004857", messageCnt: 0, department: "骨科", ward: "301", bedNum: "6" },
    { currentStatus: "0", materialId: "18686000000562", messageCnt: 0, department: "骨科", ward: "303", bedNum: "6" },
    { currentStatus: "0", materialId: "18601000000036", messageCnt: 0, department: "骨科", ward: "304", bedNum: "6" },
    { currentStatus: "0", materialId: "18686000002401", messageCnt: 0, department: "骨科", ward: "302", bedNum: "2" },
    { currentStatus: "0", materialId: "18601000005782", messageCnt: 0, department: "骨科", ward: "303", bedNum: "5" },
    { currentStatus: "0", materialId: "18627000001422", messageCnt: 0, department: "骨科", ward: "301", bedNum: "3" },
    { currentStatus: "0", materialId: "18615000001010", messageCnt: 0, department: "骨科", ward: "304", bedNum: "3" }]
const url1 = "http://www.qlyovo.com/zncd/getMultiCurrentStatus.aspx?materialIds="
// const url1 = "http://10.3.102.21:8080/SleepCareIIServer/getMultiCurrentStatus.action?materialIds="
const url2 = "http://www.qlyovo.com/zncd/getCurrentSleepStatusNew.aspx?materialId="
// const url2 = "http://10.3.102.21:8080/SleepCareIIServer/getCurrentSleepStatusNew.action?materialId="
export default {
    components: {
        material,
    },
    data() {
        return {
            items,
        }
    },
    created() {
        this.getData()
        this.intervalid = setInterval(() => {
            this.getData()
        }, 10000)
        console.log("created")
    },
    beforeDestroy() {
        clearInterval(this.intervalid)
        console.log("beforeDestroy")
    },

    methods: {
        chkdetail(e) {
            this.$router.history.push({ name: "Detail", params: { materialId: e } })
        },
        getData() {
            $.get(url1 + items.map(i => i.materialId).join(","), (_data) => {
                if (_data.errorCode === -996) {
                    for (const o of _data.arrayListUnitStatus) {

                        let _item = this.items.filter(i=>i.materialId === o.materialId)
                        if(_item && _item[0]){
                            o.department = _item[0].department
                            o.ward = _item[0].ward
                            o.bedNum = _item[0].bedNum
                        }

                        if (o.currentStatus !== "1") {
                            o.inbedStatus = "离床"
                            o.heartBeat = 0
                            o.respRate = 0
                        }
                        const iIndex = this.items.findIndex(item => item.materialId === o.materialId)
                        if (iIndex > -1) {
                            this.items.splice(iIndex, 1, o)
                        }
                        else {
                            this.items.push(o)
                        }
                    }
                    const _items = this.items.filter(item => item.currentStatus === "1").forEach(item => {
                        $.get(url2 + item.materialId, (_data2) => {
                            const iIndex = this.items.findIndex(item => item.materialId === item.materialId)
                            if (iIndex > -1) {
                                const newVal = JSON.parse(JSON.stringify(this.items[iIndex]))
                                newVal.inbedStatus = _data2.inbedStatus
                                newVal.heartBeat = _data2.heartBeat
                                newVal.respRate = _data2.respRate
                                this.items.splice(iIndex, 1, newVal)
                            }
                        })
                    })
                }
            })
        },
    },
}


</script>


<style lang="scss" module>
    @import "../../css/element";
    .home{
        @include list(row);
        justify-content: flex-start;
        align-items: flex-start;
        padding: 20px;
        background: #fff;
    }
</style>
