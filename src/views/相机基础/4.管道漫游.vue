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
            mapLocation: null,
            points: [],
            pointLight: null
        }
    },
    methods: {
        //创建河南省地图
        createMap: function() {
            //绘制管道顶点(样条曲线)
            const curve = new THREE.CatmullRomCurve3( [
                new THREE.Vector3(-50, 20, 90),
                new THREE.Vector3(-10, 40, 40),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(60, -60, 0),
                new THREE.Vector3(90, -40, 60),
                new THREE.Vector3(120, 30, 30),
            ] );
            //生成管道矩形
            const tube = new THREE.TubeGeometry(curve, 50, 5, 50)
            const material = new THREE.MeshStandardMaterial({side: THREE.DoubleSide})
               //生成管道贴图
            const texture = new THREE.TextureLoader().load(require('@/assets/diffuse.jpg'))
            texture.wrapS = THREE.RepeatWrapping
            texture.repeat.x = 10
            material.map = texture
            const mesh = new THREE.Mesh(tube, material)
            this.scene.add(mesh)
            return curve.getPoints(1000)
        },
        //相机动画
        rerender: function () {
            let i = 0;
            let that = this
            function renderFun() {
                console.log('123')
                if(that.points.length - i > 0) { //如果还有通道顶点
                    if(i === 1000) {
                        i = 0
                    } else {
                        const position = that.points[i]
                        that.camera.position.copy(position)
                        that.pointLight.position.copy(position)
                        that.camera.lookAt(that.points[i+1]);
                        i+=1
                    }
                } else { //重新开始
                    i = 0
                }
                that.renderer.render(that.scene, that.camera);
                requestAnimationFrame(renderFun);
            }
            renderFun()
        },
    },
    mounted() {
        //获取当前容器的宽高
        let width = document.getElementById("threeContainer").offsetWidth
        let height = document.getElementById("threeContainer").offsetHeight
        //创建场景
        this.scene = new THREE.Scene()
        //创建三维坐标系
        const axesHelper = new THREE.AxesHelper(150)
        //axesHelper.position.set(113.51074981689453, 33.881850242614746, 0)
        this.scene.add(axesHelper)
        // 添加一个辅助网格地面
        const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
        this.scene.add(gridHelper);
        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.1)
        //this.scene.add(ambientLight)
         //创建环境光
        this.pointLight = new THREE.PointLight(0x404040, 5, 50)
        this.scene.add(this.pointLight)
        //创建正投影相机
        const s = 3; //控制left, right, top, bottom的范围大小
        const k = width / height
        this.camera = new THREE.PerspectiveCamera(90, width / height, 1, 3000);
        this.camera.position.set(1500, 5500, 1500);//相机放在了y轴上
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);
        this.points = this.createMap()
        this.pointLight.position.copy(this.points)
        //创建渲染器
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        this.renderer.render(this.scene, this.camera)

        this.$refs.threeContainer.appendChild(this.renderer.domElement)
        //创建相机控件
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
        orbitControls.addEventListener('change', () => {
            //可以重新设置相机的观察坐标
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
            this.camera.updateProjectionMatrix();
            this.renderer.render(this.scene, this.camera)
        }
        this.rerender()
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
