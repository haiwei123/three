<template>
    <div id="threeContainer" ref="threeContainer" @click="eventRayCasterFun">
        <el-row class="btnGroup">
            <el-button round @click="rayCasterFun">JIANCE</el-button>
            <el-button round @click="changeColor('blue')">蓝色</el-button>
        </el-row>
    </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 引入后处理器
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// 引入描边发光通道
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

export default {
    data() {
        return {
            material: null,
            scene: null,
            renderer: null,
            camera: null,
            meshGroup: [],
            ourLinePass: null,
            composer: null
        }
    },
    methods: {
        getPo: function(event) {
            //打印的是相对于点击区域的偏移属性
            console.log(`offsetX:${event.offsetX}, offsetY:${event.offsetY}`)
            //打印的是相对于浏览器可视区域的偏移属性
            console.log(`clientX:${event.clientX}, clientY:${event.clientY}`)
        },
        changeColor: function (colorStr) {
            const mesh = this.scene.getObjectByName('mesh')
            mesh.material.color.set(colorStr)
            this.renderer.render(this.scene, this.camera)
        },
        insertGeometry: function() {
            const loader = new GLTFLoader()
            loader.load('modal/factory/工厂.glb', (gltf)=> {
                var cc = gltf.scene.getObjectByName('存储罐')
                for (let i = 0; i < cc.children.length; i++) {
                    const meshs = cc.children[i]
                    meshs.traverse((obj1)=> {
                        if(obj1.isMesh) {
                            obj1.ancestors = meshs
                        }
                    })
                }
                this.meshGroup.push(cc)
                this.scene.add(gltf.scene)
            })
        },
        eventRayCasterFun: function(event) {
            //获取鼠标点击的相对位置
            const px = event.offsetX
            const py = event.offsetY
            //转换成Canvas的坐标
            const w = document.getElementById("threeContainer").offsetWidth
            const h = document.getElementById("threeContainer").offsetHeight
            const x = (px / w) * 2 -1
            const y = -(py / h) * 2 + 1
            //创建射线对象
            const raycaster = new THREE.Raycaster()
            //设置射线源是相机的位置，射线方向是点击坐标
            //等同于 raycaster.ray.origin + raycaster.ray.direction
            raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera) 
            const intersects = raycaster.intersectObjects([...this.meshGroup])
            if(intersects.length > 0) {
                this.OutlinePass.selectedObjects = [intersects[0].object.ancestors]
            }
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
        const gridHelper = new THREE.GridHelper(500, 25, 0x004444, 0x004444);
        //this.scene.add(gridHelper);
        this.insertGeometry()

        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040)
        this.scene.add(ambientLight)
        const directionalLight = new THREE.DirectionalLight(0x404040, 10)
        directionalLight.position.set(0, 200, -200)
        this.scene.add(directionalLight)
        //创建透视相机
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        this.camera.position.set(-96.63271048973782, 72.46417904631221, 149.48127023601594)
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);

        //创建渲染器
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        this.renderer.render(this.scene, this.camera)
        //创建后处理渲染器
        this.composer = new EffectComposer(this.renderer)
        //创建后处理器通道
        const renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(renderPass)
        //创建边缘发光
        this.OutlinePass = new OutlinePass(new THREE.Vector2(width, height), this.scene, this.camera)
        this.OutlinePass.visibleEdgeColor.set("#eff24e"); //发光外边的颜色
        this.OutlinePass.edgeThickness = 2; //发光外边的厚度
        this.OutlinePass.edgeStrength = 10;  //发光强度
        this.OutlinePass.pulsePeriod = 1;   //模型闪烁频率控制，默认0不闪烁
        this.composer.addPass(this.OutlinePass)
        this.$refs.threeContainer.appendChild(this.renderer.domElement)
        //创建相机控件
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
        orbitControls.addEventListener('change', () => {
            //可以重新设置相机的观察坐标
            this.camera.lookAt(orbitControls.target)
            this.renderer.render(this.scene, this.camera)
        })
        this.reRender()
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
