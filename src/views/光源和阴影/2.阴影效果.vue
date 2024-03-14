<template>
    <div id="threeContainer" ref="threeContainer">
        <el-row class="btnGroup">
            <el-button round @click="changeColor('green')">绿色</el-button>
            <el-button round @click="changeColor('blue')">蓝色</el-button>
        </el-row>
    </div>
</template>
<script>
import mesh from '@/libs/Triangle';
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
        let width = document.getElementById("threeContainer").offsetWidth
        let height = document.getElementById("threeContainer").offsetHeight
        this.scene = new THREE.Scene()
        const axesHelper = new THREE.AxesHelper(150)
        this.scene.add(axesHelper)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.9)
        this.scene.add(ambientLight)
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        this.camera.position.set(400, 400, 400)
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);
        let meshBoxTarget = null;
        //创建一个立方体
        for(let i = 0; i<5; i++) {
            const boxGeometry = new THREE.BoxGeometry(50, 100, 50)
            const materalBox = new THREE.MeshLambertMaterial({color: 0x00ffff})
            const meshBox = new THREE.Mesh(boxGeometry, materalBox)
            meshBox.translateY(50)
            meshBox.translateZ(i*50+i*20)
            meshBox.castShadow = true;
            if(i===0) {
                meshBoxTarget = meshBox
            }
            this.scene.add(meshBox)
        }

        //设置被照射的物体
        const planeGeometry = new THREE.PlaneGeometry(400, 800, 400)
        const boxMateral = new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: 0x999999,})
        const planeMesh = new THREE.Mesh(planeGeometry, boxMateral)
        planeMesh.position.set(0, 0, 0)
        planeMesh.rotateX(Math.PI / 2)
        this.scene.add(planeMesh)
        
        //创建平行光
        const directionalLight = new THREE.DirectionalLight(0x404040, 2)
        directionalLight.position.set(200, 200, 100)
        directionalLight.target = meshBoxTarget
        directionalLight.add(new THREE.DirectionalLightHelper(directionalLight))
        this.scene.add(directionalLight)
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        this.renderer.render(this.scene, this.camera)
        // 设置三维场景计算阴影的范围
        directionalLight.shadow.camera.left = -300;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 200;
        directionalLight.shadow.camera.bottom = -100;
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 500;

        directionalLight.shadow.mapSize.set(1024,1024) //默认512
        directionalLight.shadow.radius = 10
        // 设置阴影效果
        //meshBox.castShadow = true;         //1.设置接受阴影的物体
        planeMesh.receiveShadow = true     //2.设置可以接受阴影的平面
        directionalLight.castShadow = true;    //3.设置光源可产生阴影
        this.renderer.shadowMap.enabled = true; //4.设置渲染器开启阴影

        
        const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
        this.scene.add(cameraHelper);
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
