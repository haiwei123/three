<template>
    <div id="threeContainer" ref="threeContainer">
        <el-row class="btnGroup">
            <el-button round @click="changeColor(1)">关闭/开启环境光</el-button>
            <el-button round @click="changeColor(2)">关闭/开启点光</el-button>
            <el-button round @click="changeColor(3)">关闭/开启平行光</el-button>
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
        changeColor: function (light) {
            if (light == 1) { //开启关闭环境光
                const ambientLight = this.scene.getObjectByName('ambientLight')
                ambientLight.visible = !ambientLight.visible
            } else if (light == 2) { //开启关闭点光源
                const pointLight = this.scene.getObjectByName('pointLight')
                pointLight.visible = !pointLight.visible
            } else {  //开启关闭平行光
                const directionalLight = this.scene.getObjectByName('directionalLight')
                directionalLight.visible = !directionalLight.visible
            }
            this.renderer.render(this.scene, this.camera)
        },
        //旋转立方体
        renderBox: function () {
            const mesh = this.scene.getObjectByName('mesh')
            mesh.rotateY(0.01)
            this.renderer.render(this.scene, this.camera)
            requestAnimationFrame(this.renderBox);
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
        //创建一个立方体
        const boxGeometry = new THREE.BoxGeometry(100, 100, 100)
        //创建材质
        this.materal = new THREE.MeshLambertMaterial()
        this.materal.color.set("green")
        //创建物体
        const mesh = new THREE.Mesh(boxGeometry, this.materal)
        mesh.name = 'mesh'
        mesh.position.set(0, 50, 0)
        this.scene.add(mesh)

        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 5.0)
        ambientLight.name = 'ambientLight'
        this.scene.add(ambientLight)
        //创建点光源
        const pointLight = new THREE.PointLight(0x404040, 10.0);
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 6)
        pointLight.name = 'pointLight'
        pointLight.position.set(80, 150, 100);
        this.scene.add(pointLight);
        this.scene.add(pointLightHelper);
        //创建平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
        const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
        directionalLight.name = 'directionalLight'
        directionalLight.position.set(-120, 140, 0);
        directionalLightHelper.target = directionalLight
        this.scene.add(directionalLight);
        this.scene.add(directionalLightHelper);

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
        this.renderBox()
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
