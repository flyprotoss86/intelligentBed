<template>
  <div @click="$emit('chkdetail', item.materialId)" :class="$style.box">
    <div :class="$style.header">
      <span>{{ item.ward }} - {{ item.bedNum }}</span>
      <span>{{ item.department }}</span>
    </div>
    <div :class="$style.content">
      <ul>
        <li>状态：{{ item.inbedStatus }}</li>
        <li>呼吸：{{ item.respRate }}</li>
        <li>心率：{{ item.heartBeat }} </li>
      </ul>
      <div v-bind:class="item.inbedStatus === '在床' ? $style.inbed : $style.picstatus"/>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        item: {},
    },
    data() {
        return {
            // picstatus1: {
            //     width: "60px",
            //     height: "60px",
            //     background: `url(${require("./static/icon1.png")})`,
            // },
        }
    },

}

</script>

<style lang="scss" module>
  @import "../../css/layout";

  .box {
    @include flex(column);
    background: #fff;
    border: 0.1rem solid #99cc99;
    margin: 0 20px 20px 0;
    border-radius: 15px;
    box-shadow: 5px 5px 3px #888888;
    padding: 20px;
    font-size: 20px;
    line-height: 35px;
    width: 250px;
    color: #6f72b0;

    .header{
      @include flex(row);
      justify-content: space-around;
      span{
        font-size: 24px;
        font-weight: bold;
      }
    }
    .content{
      @include flex(row);
      justify-content: space-around;
      ul{
        @include flex(column);
      }
      .picstatus {
        margin-top:10px;
        width:108px;
        height:87px;
        background: url(data:image/png;base64,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);
        background-size: cover;
      }

      .inbed{
        margin-top:10px;
        width:116px;
        height:86px;
        background: url(data:image/png;base64,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);
        background-size: cover;
      }
    }


  }


</style>
