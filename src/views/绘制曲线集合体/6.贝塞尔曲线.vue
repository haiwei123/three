
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
        //绘制贝塞尔曲线
        createGeometry: function () {
            const p1 = new THREE.Vector2(-30, 0)
            const p2 = new THREE.Vector2(80, 80)
            const p3 = new THREE.Vector2(130, 0)
            //绘制二维维二次贝塞尔曲线
            const curve = new THREE.QuadraticBezierCurve(p1, p2, p3)
            //创建线模型
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(10))
            const materialLine = new THREE.LineBasicMaterial()
            materialLine.color.set('red')
            const lineMesh = new THREE.Line(lineGeometry, materialLine)
            lineMesh.name = 'Mesh21'
            this.scene.add(lineMesh)
            //创建点模型
            const pointGeometry = new THREE.BufferGeometry().setFromPoints([p1, p2, p3])
            const materialPoint = new THREE.PointsMaterial({ color: 0x888888, size: 5 })
            materialPoint.color.set("blue")
            const pointMesh = new THREE.Points(pointGeometry, materialPoint)
            pointMesh.name = 'Mesh22'
            this.scene.add(pointMesh)
            //创建线模型
            const lineGeometryD = new THREE.BufferGeometry().setFromPoints([p1, p2, p3])
            const materialLineD = new THREE.LineBasicMaterial()
            materialLineD.color.set("#ccc")
            const lineMeshD = new THREE.Line(lineGeometryD, materialLineD)
            lineMeshD.name = 'Mesh23'
            this.scene.add(lineMeshD)


            const p12 = new THREE.Vector3(-30, 0, 150)
            const p22 = new THREE.Vector3(80, 80, 60)
            const p32 = new THREE.Vector3(130, 0, 90)
            //绘制二维维二次贝塞尔曲线
            const curve2 = new THREE.QuadraticBezierCurve3(p12, p22, p32)
            //创建线模型
            const lineGeometry2 = new THREE.BufferGeometry().setFromPoints(curve2.getPoints(10))
            const materialLine2 = new THREE.LineBasicMaterial()
            materialLine2.color.set('red')
            const lineMesh2 = new THREE.Line(lineGeometry2, materialLine2)
            lineMesh2.name = 'Mesh31'
            this.scene.add(lineMesh2)
            //创建点模型
            const pointGeometry2 = new THREE.BufferGeometry().setFromPoints([p12, p22, p32])
            const materialPoint2 = new THREE.PointsMaterial({ color: 0x888888, size: 5 })
            materialPoint2.color.set("blue")
            const pointMesh2 = new THREE.Points(pointGeometry2, materialPoint2)
            pointMesh2.name = 'Mesh32'
            this.scene.add(pointMesh2)
            //创建线模型
            const lineGeometryD2 = new THREE.BufferGeometry().setFromPoints([p12, p22, p32])
            const materialLineD2 = new THREE.LineBasicMaterial()
            materialLineD2.color.set("#ccc")
            const lineMeshD2 = new THREE.Line(lineGeometryD2, materialLineD2)
            lineMeshD2.name = 'Mesh33'
            this.scene.add(lineMeshD2)


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
