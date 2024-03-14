
<template>
    <div id="threeContainer" ref="threeContainer">
        <el-row class="btnGroup">
            <el-button round @click="show(3)">仅查看三维样条曲线</el-button>
            <el-button round @click="show(2)">仅查看二维样条曲线</el-button>
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
                this.scene.getObjectByName('lineMesh2').visible = true
                this.scene.getObjectByName('pointMesh2').visible = true
                this.scene.getObjectByName('lineMesh3').visible = false
                this.scene.getObjectByName('pointMesh3').visible = false
            } else {
                console.log(this.scene.getObjectByName('lineMesh2'))
                this.scene.getObjectByName('lineMesh2').visible = false
                this.scene.getObjectByName('pointMesh2').visible = false
                this.scene.getObjectByName('lineMesh3').visible = true
                this.scene.getObjectByName('pointMesh3').visible = true
            }
            this.renderer.render(this.scene, this.camera)
        },
        //不规则曲线不能使用Curve来绘制
        createGeometry: function () {
            //绘制三维样条曲线
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-50, 20, 20),
                new THREE.Vector3(25, 25, 25),
                new THREE.Vector3(40, 45, -25),
                new THREE.Vector3(40, 65, -25)
            ])
            //创建线模型
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30))
            const materialLine = new THREE.LineBasicMaterial({ color: 0x888888 })
            const lineMesh = new THREE.Line(lineGeometry, materialLine)
            lineMesh.name = 'lineMesh3'
            this.scene.add(lineMesh)
            //创建点模型
            const pointGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30))
            const materialPoint = new THREE.PointsMaterial({ color: 0x888888, size: 5 })
            materialPoint.color.set("blue")
            const pointMesh = new THREE.Points(pointGeometry, materialPoint)
            pointMesh.name = 'pointMesh3'
            this.scene.add(pointMesh)

            //创建二维样条曲线
            // 二维向量Vector2创建一组顶点坐标
            const arr = [
                new THREE.Vector2(50, 0),
                new THREE.Vector2(100, 100),
                new THREE.Vector2(150, 0),
            ];
            // 二维样条曲线
            const curve2 = new THREE.SplineCurve(arr);
            //创建线模型
            const lineGeometry2 = new THREE.BufferGeometry().setFromPoints(curve2.getPoints(30))
            const materialLine2 = new THREE.LineBasicMaterial({ color: 0x888888 })
            const lineMesh2 = new THREE.Line(lineGeometry2, materialLine2)
            lineMesh2.name = 'lineMesh2'
            this.scene.add(lineMesh2)
            //创建点模型
            const pointGeometry2 = new THREE.BufferGeometry().setFromPoints(curve2.getPoints(30))
            const materialPoint2 = new THREE.PointsMaterial({ color: 0x888888, size: 5 })
            materialPoint2.color.set("blue")
            const pointMesh2 = new THREE.Points(pointGeometry2, materialPoint2)
            pointMesh2.name = 'pointMesh2'
            this.scene.add(pointMesh2)
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
