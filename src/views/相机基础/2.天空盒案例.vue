<template>
    <div id="threeContainer" ref="threeContainer">
        <el-row class="btnGroup">
            <el-button round @click="changeColor('green')">绿色</el-button>
            <el-button round @click="changeColor('blue')">蓝色</el-button>
        </el-row>
    </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import henan from '@/libs/maps'
export default {
    data() {
        return {
            material: null,
            scene: null,
            renderer: null,
            camera: null,
            mapLocation: null
        }
    },
    methods: {
        //创建河南省地图
        createMap: function() {
            const pointsArr = [];// 一组二维向量表示一个多边形轮廓坐标
            henan.forEach(function(e){
                // data坐标数据转化为Vector2构成的顶点数组
                const v2 = new THREE.Vector2(e[0],e[1])
                pointsArr.push(v2);
            })
            // Shape表示一个平面多边形轮廓,参数是二维向量构成的数组pointsArr
            const shape = new THREE.Shape(pointsArr);
            // 多边形shape轮廓作为ShapeGeometry参数，生成一个多边形平面几何体
            const geometry = new THREE.ShapeGeometry(shape);
            const material = new THREE.MeshLambertMaterial({
                side: THREE.DoubleSide
            });
            material.color.set("#00ff00")
            const mesh = new THREE.Mesh(geometry, material)

            // 包围盒计算模型对象的大小和位置
            const box3 = new THREE.Box3();
            box3.expandByObject(mesh); // 计算模型包围盒
            const size = new THREE.Vector3();
            box3.getSize(size); // 计算包围盒尺寸
            console.log('模型包围盒尺寸',size);
            const center = new THREE.Vector3();
            box3.getCenter(center); // 计算包围盒中心坐标
            console.log('模型中心坐标',center);
            this.mapLocation = center
            this.camera.lookAt(this.mapLocation.x, this.mapLocation.y, this.mapLocation.z)
            this.scene.add(mesh)
        }
    },
    mounted() {
        //获取当前容器的宽高
        let width = document.getElementById("threeContainer").offsetWidth
        let height = document.getElementById("threeContainer").offsetHeight
        //创建场景
        this.scene = new THREE.Scene()
        //创建三维坐标系
        const axesHelper = new THREE.AxesHelper(150)
        axesHelper.position.set(113.51074981689453, 33.881850242614746, 0)
        this.scene.add(axesHelper)
        // 添加一个辅助网格地面
        const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
        this.scene.add(gridHelper);
        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040)
        this.scene.add(ambientLight)
        //创建正投影相机
        const s = 10; //控制left, right, top, bottom的范围大小
        const k = width / height
        this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 8000);
         this.camera.position.set(0, 500, 0);//相机放在了y轴上
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);
        this.createMap()
        //创建渲染器
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        this.renderer.render(this.scene, this.camera)
        this.$refs.threeContainer.appendChild(this.renderer.domElement)
        //创建相机控件
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
        orbitControls.addEventListener('change', () => {
            //可以重新设置相机的观察坐标
            this.camera.lookAt(this.mapLocation.x, this.mapLocation.y, this.mapLocation.z)
            this.renderer.render(this.scene, this.camera)
        })
 
        //添加相机控件
        window.onresize = () => {
            console.log('resize')
            let rewidth = document.getElementById("threeContainer").offsetWidth
            let reheight = document.getElementById("threeContainer").offsetHeight
            this.renderer.setSize(rewidth, reheight)
            const k = rewidth / reheight
            this.camera.aspect = rewidth / reheight
            this.camera.right = 600 * k
            this.camera.left = -600 * k
            console.log('camera.aspect', this.camera.aspect)
            this.camera.updateProjectionMatrix();
            this.renderer.render(this.scene, this.camera)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#threeContainer {
    height: calc(100vh - 60px);
    width: calc(100vw-250px);
    position: relative;
}

.btnGroup {
    position: absolute;
    top: 80%;
    width: 50%;
    left: 50%;
    transform: translate(-50%, 10px);
}
</style>
