<template>
    <el-row>
        <el-col :span="24">
            <h1>ThreeJs学习实例</h1>
            <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>快速入门</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1" @click="toRoute('/1-1')">简单的3D场景</el-menu-item>
                        <el-menu-item index="1-2" @click="toRoute('/1-2')">三维坐标系</el-menu-item>
                        <el-menu-item index="1-3" @click="toRoute('/1-3')">光源对物体的影响</el-menu-item>
                        <el-menu-item index="1-4" @click="toRoute('/1-1')">相机控件 OrbitControls</el-menu-item>
                        <el-menu-item index="1-5" @click="toRoute('/9-1')">平行光和点光源</el-menu-item>
                        <el-menu-item index="1-6" @click="toRoute('/9-1')">动画渲染循环</el-menu-item>
                        <el-menu-item index="1-7" @click="toRoute('/9-1')">Cavas画布和全屏</el-menu-item>
                        <el-menu-item index="1-8" @click="toRoute('/9-1')">Stat查看渲染帧率</el-menu-item>
                        <el-menu-item index="1-9" @click="toRoute('/9-1')">阵列立方体和相机适配</el-menu-item>
                        <el-menu-item index="1-10" @click="toRoute('/9-1')">常见的立方体</el-menu-item>
                        <el-menu-item index="1-11" @click="toRoute('/9-1')">高光网格材质Phong</el-menu-item>
                        <el-menu-item index="1-12" @click="toRoute('/9-1')">渲染器设置（锯齿、模糊）</el-menu-item>
                        <el-menu-item index="1-13" @click="toRoute('/9-1')">GUI调试</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>自定义几何体</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1">几何体顶点位置数据和点模型</el-menu-item>
                        <el-menu-item index="1-2">线模型对象</el-menu-item>
                        <el-menu-item index="1-2">网格模型(三角形概念)</el-menu-item>
                        <el-menu-item index="1-2">构建一个矩形平面几何体</el-menu-item>
                        <el-menu-item index="1-2">几何体顶点索引数据</el-menu-item>
                        <el-menu-item index="1-2">顶点法线数据</el-menu-item>
                        <el-menu-item index="1-2">查看threejs自带几何体顶点</el-menu-item>
                        <el-menu-item index="1-2">旋转、缩放、平移几何体</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-s-help"></i>
                        <span>模型对象、材质</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1">几何体顶点位置数据和点模型</el-menu-item>
                        <el-menu-item index="1-2">线模型对象</el-menu-item>
                        <el-menu-item index="1-2">网格模型(三角形概念)</el-menu-item>
                        <el-menu-item index="1-2">构建一个矩形平面几何体</el-menu-item>
                        <el-menu-item index="1-2">几何体顶点索引数据</el-menu-item>
                        <el-menu-item index="1-2">顶点法线数据</el-menu-item>
                        <el-menu-item index="1-2">查看threejs自带几何体顶点</el-menu-item>
                        <el-menu-item index="1-2">旋转、缩放、平移几何体</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-s-data"></i>
                        <span>层级模型</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1">几何体顶点位置数据和点模型</el-menu-item>
                        <el-menu-item index="1-2">线模型对象</el-menu-item>
                        <el-menu-item index="1-2">网格模型(三角形概念)</el-menu-item>
                        <el-menu-item index="1-2">构建一个矩形平面几何体</el-menu-item>
                        <el-menu-item index="1-2">几何体顶点索引数据</el-menu-item>
                        <el-menu-item index="1-2">顶点法线数据</el-menu-item>
                        <el-menu-item index="1-2">查看threejs自带几何体顶点</el-menu-item>
                        <el-menu-item index="1-2">旋转、缩放、平移几何体</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title">
                        <i class="el-icon-picture-outline"></i>
                        <span>顶点UV坐标、纹理贴图</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="5-1">1.创建纹理贴图</el-menu-item>
                        <el-menu-item index="5-2">2.自定义顶点UV坐标</el-menu-item>
                        <el-menu-item index="5-3">3.圆形平面设置纹理贴图</el-menu-item>
                        <el-menu-item index="5-4">4.纹理对象Texture阵列</el-menu-item>
                        <el-menu-item index="5-5">5.矩形Mesh+背景透明png贴图</el-menu-item>
                        <el-menu-item index="5-6">6.UV动画</el-menu-item>
                        <el-menu-item index="5-7" @click="toRoute('/5-7')">火焰序列动画</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="6">
                    <template slot="title">
                        <i class="el-icon-s-custom"></i>
                        <span>加载外部三维模型(gltf)</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="6-1" @click="toRoute('/6-1')">1.加载.gltf文件(模型加载全流程)</el-menu-item>
                        <el-menu-item index="6-2" @click="toRoute('/6-2')">2.gltf模型更换.map(纹理.flipY)</el-menu-item>
                        <el-menu-item index="6-3" @click="toRoute('/6-3')">3.外部模型材质是否共享的问题</el-menu-item>
                        <el-menu-item index="6-4" @click="toRoute('/6-4')">4.雾化效果</el-menu-item>
                        <el-menu-item index="6-5" @click="toRoute('/6-5')">5.CSS2DReader</el-menu-item>
                        <el-menu-item index="6-6" @click="toRoute('/6-6')">6.CSS3DReader</el-menu-item>
                        <el-menu-item index="6-7" @click="toRoute('/6-7')">7.射线拾取</el-menu-item>
                        <el-menu-item index="6-8" @click="toRoute('/6-8')">8.粮仓失火</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="7">
                    <template slot="title">
                        <i class="el-icon-s-open"></i>
                        <span>PBR材质与纹理贴图</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="7-1">火焰序列帧动画</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="8">
                    <template slot="title">
                        <i class="el-icon-s-platform"></i>
                        <span>渲染器和前端UI界面</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1">几何体顶点位置数据和点模型</el-menu-item>
                        <el-menu-item index="1-2">线模型对象</el-menu-item>
                        <el-menu-item index="1-2">网格模型(三角形概念)</el-menu-item>
                        <el-menu-item index="1-2">构建一个矩形平面几何体</el-menu-item>
                        <el-menu-item index="1-2">几何体顶点索引数据</el-menu-item>
                        <el-menu-item index="1-2">顶点法线数据</el-menu-item>
                        <el-menu-item index="1-2">查看threejs自带几何体顶点</el-menu-item>
                        <el-menu-item index="1-2">旋转、缩放、平移几何体</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="9">
                    <template slot="title">
                        <i class="el-icon-pie-chart"></i>
                        <span>生成曲线、几何体</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="9-1" @click="toRoute('/9-1')">1. 生成圆弧顶点</el-menu-item>
                        <el-menu-item index="9-2" @click="toRoute('/9-2')">2. 几何体方法.setFromPoints()</el-menu-item>
                        <el-menu-item index="9-3" @click="toRoute('/9-3')">3. 曲线Curve简介 (三角形概念)</el-menu-item>
                        <el-menu-item index="9-4" @click="toRoute('/9-4')">4. 椭圆、圆</el-menu-item>
                        <el-menu-item index="9-5" @click="toRoute('/9-5')">5. 样条曲线</el-menu-item>
                        <el-menu-item index="9-6" @click="toRoute('/9-6')">6. 贝塞尔曲线</el-menu-item>
                        <el-menu-item index="9-7" @click="toRoute('/9-7')">7. 样条、贝塞尔曲线应用</el-menu-item>
                        <el-menu-item index="9-8" @click="toRoute('/9-8')">8. 组合曲线CurvePath拼接曲线</el-menu-item>
                        <el-menu-item index="9-9" @click="toRoute('/9-9')">9. 曲线路径管道TubeGeometry</el-menu-item>
                        <el-menu-item index="9-10" @click="toRoute('/9-10')">10. 旋转成型LatheGeometry</el-menu-item>
                        <el-menu-item index="9-11" @click="toRoute('/9-11')">11. 轮廓填充ShapeGeometry</el-menu-item>
                        <el-menu-item index="9-12" @click="toRoute('/9-12')">12. 拉伸ExtrudeGeometry</el-menu-item>
                        <el-menu-item index="9-13" @click="toRoute('/9-13')">13. 扫描ExtrudeGeometry</el-menu-item>
                        <el-menu-item index="9-14" @click="toRoute('/9-14')">14. 多边形轮廓Shape简介</el-menu-item>
                        <el-menu-item index="9-16" @click="toRoute('/9-15')">15. 多边形Shape(内孔.holes)</el-menu-item>
                        <el-menu-item index="9-17" @click="toRoute('/9-16')">16. 模型边界线EdgesGeometry</el-menu-item>
                        <el-menu-item index="9-18" @click="toRoute('/9-17')">17. 几何体顶点颜色数数据</el-menu-item>
                        <el-menu-item index="9-19" @click="toRoute('/9-18')">18. 一段曲线颜色渐变</el-menu-item>
                        <el-menu-item index="9-21" @click="toRoute('/9-19')">20. 查看或设置gltf几何体顶点</el-menu-item>
                        <el-menu-item index="9-22" @click="toRoute('/9-20')">21. 山脉地形高度可视化</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="10">
                    <template slot="title">
                        <i class="el-icon-pie-chart"></i>
                        <span>简单3D案例</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="10-1" @click="toRoute('/10-1')">1.手机展示</el-menu-item>
                        <el-menu-item index="10-2" @click="toRoute('/10-2')">2.汽车展示</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="11">
                    <template slot="title">
                        <i class="el-icon-pie-chart"></i>
                        <span>相机基础</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="11-1" @click="toRoute('/11-1')">1.正投影相机</el-menu-item>
                        <el-menu-item index="11-2" @click="toRoute('/11-2')">2.河南省地图案例</el-menu-item>
                        <el-menu-item index="11-3" @click="toRoute('/11-3')">3.相机动画</el-menu-item>
                        <el-menu-item index="11-4" @click="toRoute('/11-4')">4.管道漫游</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="12">
                    <template slot="title">
                        <i class="el-icon-pie-chart"></i>
                        <span>光源和阴影</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="12-1" @click="toRoute('/12-1')">1.聚光源</el-menu-item>
                        <el-menu-item index="12-2" @click="toRoute('/12-2')">2.阴影效果</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="13">
                    <template slot="title">
                        <i class="el-icon-pie-chart"></i>
                        <span>精灵模型</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="13-1" @click="toRoute('/13-1')">1.精灵模型</el-menu-item>
                        <el-menu-item index="13-2" @click="toRoute('/13-2')">2.下雪场景</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="14">
                    <template slot="title">
                        <i class="el-icon-pie-chart"></i>
                        <span>后处理</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="14-1" @click="toRoute('/14-1')">1.描边发光OutLinePass</el-menu-item>
                        <el-menu-item index="14-2" @click="toRoute('/14-2')">2.自发光BloomPass</el-menu-item>
                        <el-menu-item index="14-3" @click="toRoute('/14-3')">3.多通道组合</el-menu-item>
                        <el-menu-item index="14-4" @click="toRoute('/14-4')">4.工厂模型描边</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="15">
                    <template slot="title">
                        <i class="el-icon-pie-chart"></i>
                        <span>射线拾取模型</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="15-1" @click="toRoute('/15-1')">1.射线Ray</el-menu-item>
                        <el-menu-item index="15-2" @click="toRoute('/15-2')">2.射线RatCaster</el-menu-item>
                        <el-menu-item index="15-3" @click="toRoute('/15-3')">2.射线粮仓应用</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-col>
    </el-row>
</template>
<script>
export default {
    methods: {
        toRoute: function (path) {
            if (path === this.$route.path) { return }
            this.$router.push({ path: path })
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
}
</script>
<style>
h1 {
    color: #c5c5fe;
    padding-left: 0%;
    box-sizing: border-box;
    margin-left: -30%;
}

.el-col>.el-menu {
    height: 90vh;
    overflow-y: scroll;
}

.el-menu-item,
.el-submenu__title {
    /* height: 56px; */
    line-height: 56px;
    /* list-style: none; */
    text-align: left;
}

.el-menu::-webkit-scrollbar {
    /*滚动条整体部分，其中的属性有width,height,background,border等（就和一个块级元素一样）（位置1）*/
    width: 0px;
    height: 0px;
}
</style>