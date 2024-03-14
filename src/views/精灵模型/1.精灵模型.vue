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
    props: {
        material: null,
        scene: null,
        renderer: null,
        camera: null
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
        //创建精灵模型
        const spintMaterial = new THREE.SpriteMaterial({map: new THREE.TextureLoader().load(require('@/assets/光点.png'))})
        const sprint = new THREE.Sprite(spintMaterial)
        sprint.scale.set(20, 20, 20)
        sprint.position.set(0, 0, 200)
        this.scene.add(sprint)
        //创建一个立方体
        const boxGeometry = new THREE.BoxGeometry(100, 100, 100)
        this.materal = new THREE.MeshBasicMaterial()
        this.materal.color.set("green")
        const mesh = new THREE.Mesh(boxGeometry, this.materal)
        mesh.name = 'mesh'
        mesh.position.set(0, 50, 0)
        this.scene.add(mesh)
        const spintMaterial1 = new THREE.SpriteMaterial({map: new THREE.TextureLoader().load(require('@/assets/光点.png'))})
        const sprint1 = new THREE.Sprite(spintMaterial1)
        sprint1.scale.set(20, 20, 20)
        //sprint1.position.copy(mesh)
        sprint1.translateY(120)
        this.scene.add(sprint1)
        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040)
        this.scene.add(ambientLight)
        //创建透视相机
        this.camera = new THREE.PerspectiveCamera(10, width / height, 1, 10000);
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
