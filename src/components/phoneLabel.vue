<template>
  <div id="camera">
    <div>
      <div style="height:1px;width:130px;background: #00ffff;margin-top:68px"></div>
    </div>
    <div id="message" style="width:350px;height:120px;">
      <div style="padding: 10px 4px;font-size:18px;">双摄像头</div>
      <div style="padding: 10px 24px;font-size:16px;">后置主摄像头——1300万像素(F/1.8光圈)</div>
      <div style="padding: 10px 24px;font-size:16px;">后置副摄像头——200万像素的</div>
    </div>
    <!-- 设置一个关闭按钮 -->
    <div style="position:relative;" @click="closeFun">
      <div style="position: absolute;left: -30px;top: 10px;">
        <img id="close" src="@/assets/关闭.png" alt="" width="18" style="cursor: pointer;">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    closeFun: function() {
      this.$emit("close")
    },
  },
  mounted() {
  }
}
</script>
<style>

    #camera {
      transform-origin: 'left center';
      position: absolute;
      display: flex;
      /* row是flex-direction默认值,可以不设置，表示主轴为水平方向，从左向右排列*/
      flex-direction: row;
      /*space-between表示*/
      justify-content: space-between;
      /* visibility: hidden; */
      width: 500px;
      margin-left: 250px;
      pointer-events: auto !important;
    }

    #message {

      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      padding: 0px;
      /* 边框 */
      background: linear-gradient(#00ffff, #00ffff) left top,
        linear-gradient(#00ffff, #00ffff) left top,
        linear-gradient(#00ffff, #00ffff) right bottom,
        linear-gradient(#00ffff, #00ffff) right bottom;
      background-repeat: no-repeat;
      background-size: 2px 20px, 36px 2px;
      background-color: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      font-size: 18px;
      padding: 8px 12px;
    }
</style>