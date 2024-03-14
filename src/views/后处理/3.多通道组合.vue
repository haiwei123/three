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
// 引入后处理器
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// 引入描边发光通道
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
// 引入GlitchPass通道
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';

export default {
    props: {
        material: null,
        scene: null,
        renderer: null,
        camera: null,
        composer: null
    },
    methods: {
        changeColor: function (colorStr) {
            const mesh = this.scene.getObjectByName('mesh')
            mesh.material.color.set(colorStr)
            this.renderer.render(this.scene, this.camera)
        },
        reRender: function() {
            //this.renderer.render(this.scene, this.camera)
            this.composer.render()
            requestAnimationFrame(this.reRender)
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
        const gridHelper = new THREE.GridHelper(1000, 25, 0x004444, 0x004444);
        this.scene.add(gridHelper);
        //创建一个立方体
        const boxGeometry = new THREE.BoxGeometry(100, 100, 100)
        this.materal = new THREE.MeshBasicMaterial()
        this.materal.color.set("green")
        const material2 = new THREE.MeshBasicMaterial()
        material2.color.set("blue")
        const mesh = new THREE.Mesh(boxGeometry, this.materal)
        const mesh1 = new THREE.Mesh(boxGeometry, material2)
        mesh.name = 'mesh'
        mesh.position.set(-120, 50, 0)
        mesh1.position.set(120, 50, 0)
        this.scene.add(mesh, mesh1)
        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040)
        this.scene.add(ambientLight)
        //创建透视相机
        this.camera = new THREE.PerspectiveCamera(10, width / height, 1, 10000);
        this.camera.position.set(2000, 2000, 2000)
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);

        //创建渲染器
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        this.renderer.render(this.scene, this.camera)
        //后处理器
        this.composer = new EffectComposer(this.renderer)
        //创建渲染器通道
        const renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(renderPass)
        //创建效果通道
        const v2 = new THREE.Vector2(width, height)
        const outlinePass = new OutlinePass(v2, this.scene, this.camera)
        outlinePass.visibleEdgeColor.set("#eff24e"); //发光外边的颜色
        outlinePass.edgeThickness = 5; //发光外边的厚度
        outlinePass.edgeStrength = 10;  //发光强度
        outlinePass.pulsePeriod = 5;   //模型闪烁频率控制，默认0不闪烁
        outlinePass.selectedObjects = [mesh]
        this.composer.addPass(outlinePass)
        //闪屏通道
        const glitchPass = new GlitchPass();
        // 设置glitchPass通道
        this.composer.addPass(glitchPass);


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
        this.reRender()
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
