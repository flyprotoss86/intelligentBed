<template>
  <ul v-on:click="$emit('chkdetail', item.materialId)" v-bind:class="[$style.box, item.inbedStatus === '在床' ? $style.inbed : '']">
    <li>科室：{{ item.department }}</li>
    <li>病房：{{ item.ward }}</li>
    <li>病床：{{ item.bedNum }}</li>
    <li>状态：{{ item.inbedStatus }}</li>
    <li>呼吸：{{ item.respRate }}</li>
    <li>心率：{{ item.heartBeat }}</li>
  </ul>
</template>

<script>
export default {
    props: {
        item: {},
    },
}
</script>

<style lang="scss" module>
  .box {
    background: #ede5f6;
    margin: 0 20px 20px 0;
    border-radius: 15px;
    box-shadow: 5px 5px 3px #888888;
    padding: 20px;
    font-size: 20px;
    line-height: 35px;
    width: 150px;
    color: #6f72b0;
  }
  .inbed{
    background: #99cc99 !important;

  }
  .outbed{

  }
</style>
