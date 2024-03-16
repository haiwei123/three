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
export default {
    data() {
        return {
            material: null,
        scene: null,
        renderer: null,
        camera: null
        }
    },
    methods: {
        changeColor: function (colorStr) {
            const mesh = this.scene.getObjectByName('mesh')
            mesh.material.color.set(colorStr)
            this.renderer.render(this.scene, this.camera)
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
        //创建射线
        const ray = new THREE.Ray()
        //设置坐标原点
        ray.origin = new THREE.Vector3(0,0,0);
        // 表示射线沿着x轴正方向
        ray.direction = new THREE.Vector3(1,0,0);
        // 三角形三个点坐标
        const p1 = new THREE.Vector3(100, 25, 0);
        const p2 = new THREE.Vector3(100, -25, 25);
        const p3 = new THREE.Vector3(100, -25, -25);
        const point = new THREE.Vector3();//用来记录射线和三角形的交叉点
        const result = ray.intersectTriangle(p1,p2,p3,false,point);
        console.log('交叉点坐标', point);
        console.log('查看是否相交', result);

        //生成线模型渲染线条
        var triangleGeometry = new THREE.BufferGeometry();
        var vertices = new Float32Array([
            100, 25, 0,
            100, -25, 25,
            100, -25, -25
        ]);
        //模拟渲染射线
        triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        // 创建三角形的材质
        var material = new THREE.LineBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
        // 创建三角形网格
        var triangleMesh = new THREE.LineLoop(triangleGeometry, material);
        this.scene.add(triangleMesh)
        //模拟射线路径
        var vertices1 = new Float32Array([
            0,0,0,
            500,0,0
        ]);
        var triangleGeometry1= new THREE.BufferGeometry();
        triangleGeometry1.setAttribute('position', new THREE.BufferAttribute(vertices1, 3));
        // 创建三角形的材质
        var material1 = new THREE.LineBasicMaterial({ side: THREE.DoubleSide });
        material1.color.set("white")
        // 创建三角形网格
        var rayMesh = new THREE.LineLoop(triangleGeometry1, material1);
        this.scene.add(rayMesh)

        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040)
        this.scene.add(ambientLight)
        //创建透视相机
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        this.camera.position.set(400, 400, 400)
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);

        //创建渲染器
        this.renderer = new THREE.WebGLRenderer()
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
            console.log('resize')
            let rewidth = document.getElementById("threeContainer").offsetWidth
            let reheight = document.getElementById("threeContainer").offsetHeight
            console.log(rewidth, reheight)
            this.renderer.setSize(rewidth, reheight)
            this.camera.aspect = rewidth / reheight
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
