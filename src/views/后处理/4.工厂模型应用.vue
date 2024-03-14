<template>
    <div id="threeContainer" ref="threeContainer">
        <el-row class="btnGroup">
            <el-button round @click="changeColor('旗杆')">旗杆</el-button>
            <el-button round @click="changeColor('红旗')">红旗</el-button>
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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 伽马校正后处理Shader
import {GammaCorrectionShader} from 'three/addons/shaders/GammaCorrectionShader.js';
// ShaderPass功能：使用后处理Shader创建后处理通道
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';

export default {
    props: {
        material: null,
        scene: null,
        renderer: null,
        camera: null,
        composer: null,
        outLinePass: null
    },
    methods: {
        changeColor: function (name) {
            const mesh = this.scene.getObjectByName(name);
            console.log(mesh)
            this.outLinePass.selectedObjects = [mesh]
        },
        reRender: function() {
            //this.renderer.render(this.scene, this.camera)
            this.composer.render()
            requestAnimationFrame(this.reRender)
        },
        insertModal: function() {
            const loader = new GLTFLoader();
            const clubTexture = new THREE.CubeTextureLoader().setPath('metal/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
            loader.load('modal/factory/工厂.glb', (gltf)=> {
                gltf.scene.traverse((obj)=> {
                    if(obj.isMesh) {
                        console.log(obj.name)
                        obj.material.envMap = clubTexture
                        obj.material.envMapIntensity = 2.0
                    }
                })
                this.scene.add(gltf.scene)
            })
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
        //创建透视相机
        this.camera = new THREE.PerspectiveCamera(10, width / height, 1, 10000);
        this.camera.position.set(1000, 1000, 1000)
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);

        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.9)
        this.scene.add(ambientLight)
        const directionalLight = new THREE.DirectionalLight(0x404040, 5)
        directionalLight.position.set(0, 200, -200)
        this.scene.add(directionalLight)
        //创建渲染器
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        this.renderer.render(this.scene, this.camera)
        this.insertModal()

                
        //创建后处理器
        this.composer = new EffectComposer(this.renderer)
        //创建后处理器通道
        const renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(renderPass)
        //创建后处理效果
        const v2 = new THREE.Vector2(width, height)
        this.outLinePass = new OutlinePass(v2, this.scene, this.camera)

        this.outLinePass.visibleEdgeColor.set("#eff24e"); //发光外边的颜色
        this.outLinePass.edgeThickness = 5; //scene
        this.outLinePass.edgeStrength = 10;  //发光强度
        this.outLinePass.pulsePeriod = 5;   //模型闪烁频率控制，默认0不闪烁
        this.composer.addPass(this.outLinePass)
        // 创建伽马校正通道
        const gammaPass= new ShaderPass(GammaCorrectionShader);
        this.composer.addPass(gammaPass);


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
