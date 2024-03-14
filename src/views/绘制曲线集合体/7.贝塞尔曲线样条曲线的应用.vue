
<template>
    <div id="threeContainer" ref="threeContainer">
        <el-row class="btnGroup">
            <el-button round @click="show(3)">仅查看三维贝塞尔曲线</el-button>
            <el-button round @click="show(2)">仅查看二维贝塞尔曲线</el-button>
        </el-row>
    </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export default {
    props: {
    },
    data() {
        return {
            scene: null,
            renderer: null,
            camera: null
        }
    },
    methods: {
        show: function (type) {
            if (type == 2) {
                this.scene.getObjectByName('Mesh21').visible = true
                this.scene.getObjectByName('Mesh22').visible = true
                this.scene.getObjectByName('Mesh23').visible = true
                this.scene.getObjectByName('Mesh31').visible = false
                this.scene.getObjectByName('Mesh32').visible = false
                this.scene.getObjectByName('Mesh33').visible = false
            } else {
                this.scene.getObjectByName('Mesh21').visible = false
                this.scene.getObjectByName('Mesh22').visible = false
                this.scene.getObjectByName('Mesh23').visible = false
                this.scene.getObjectByName('Mesh31').visible = true
                this.scene.getObjectByName('Mesh32').visible = true
                this.scene.getObjectByName('Mesh33').visible = true
            }
            this.renderer.render(this.scene, this.camera)
        },
        //绘制贝塞尔曲线（模拟飞机飞行的路线）
        createGeometry: function () {
            const startPoint = new THREE.Vector3(20, 0, 50) //飞机起始位置
            const endPoint = new THREE.Vector3(-50, 0, -50) //飞机降落位置
            //使用三维二次二次贝塞尔曲线模拟飞机路线
            const middlePoint = new THREE.Vector3((startPoint.x + endPoint.x) / 2, 50, (startPoint.z + endPoint.z) / 2) //计算中间的定点   

            const quCurve = new THREE.QuadraticBezierCurve3(startPoint, middlePoint, endPoint)
            const boxGeometry = new THREE.BufferGeometry().setFromPoints(quCurve.getPoints(20))
            const material = new THREE.LineBasicMaterial({ color: 0x888888 })
            const lineMesh = new THREE.Line(boxGeometry, material)
            this.scene.add(lineMesh)
        },
        //绘制样条曲线（模拟飞机飞行的路线）
        createGeometry1: function () {
            const startPoint = new THREE.Vector3(40, 0, 80) //飞机起始位置
            const endPoint = new THREE.Vector3(-80, 0, -90) //飞机降落位置
            const middlePoint = new THREE.Vector3((startPoint.x + endPoint.x) / 2, 50, (startPoint.z + endPoint.z) / 2) //计算中间的定点   
            const quCurve = new THREE.CatmullRomCurve3([startPoint, middlePoint, endPoint])
            const boxGeometry = new THREE.BufferGeometry().setFromPoints(quCurve.getPoints(20))
            const material = new THREE.LineBasicMaterial({ color: 0x888888 })
            const lineMesh = new THREE.Line(boxGeometry, material)
            this.scene.add(lineMesh)
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
        this.scene.add(axesHelper)
        // 添加一个辅助网格地面
        const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
        this.scene.add(gridHelper);
        this.createGeometry();
        this.createGeometry1();
        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040)
        this.scene.add(ambientLight)
        //创建透视相机
        console.log('width:' + width + ', height:' + height)
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        this.camera.position.set(200, 200, 200)
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);
        //创建渲染器 logarithmicDepthBuffer: true 优化深度冲突问题
        this.renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true })
        //设置背景透明
        //this.renderer.setClearAlpha(0.9);
        //设置背景颜色
        //this.renderer.setClearColor(0x0000000, 0.8)

        this.renderer.setSize(width, height)
        this.renderer.render(this.scene, this.camera)
        this.$refs.threeContainer.appendChild(this.renderer.domElement)
        //创建相机控件
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
        orbitControls.addEventListener('change', () => {
            //可以重新设置相机的观察坐标
            this.camera.lookAt(orbitControls.target)
            this.renderer.render(this.scene, this.camera)
        })
        //添加相机控件
        window.onresize = () => {
            let rewidth = window.innerWidth - 250
            let reheight = window.innerHeight - 60
            console.log(rewidth, reheight)
            this.renderer.setSize(rewidth, reheight)
            this.camera.aspect = rewidth / reheight
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
