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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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
        },
        importModal: function() {
            const loader = new GLTFLoader();
            const clubTexture = new THREE.CubeTextureLoader().setPath('metal/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
            loader.load('modal/factory/工厂.glb', (gltf)=> {
                gltf.scene.traverse((obj)=> {
                    if(obj.isMesh) {
                        obj.material.envMap = clubTexture
                        obj.material.envMapIntensity = 2.0
                    }
                })
                this.scene.add(gltf.scene)
            })
        },
        snowDown: function() {
            const groupSnow = []
            const spintMaterial = new THREE.SpriteMaterial({map: new THREE.TextureLoader().load(require('@/assets/雪花.png'))})
            //模拟生成10000个雪花
            for(let i = 0; i<10000; i++) {
                const snow = new THREE.Sprite(spintMaterial);
                snow.scale.set(3, 3, 3)
                //随机生成雪花的位置 
                snow.position.x = 1000 * (Math.random()-0.5);
                snow.position.y = 1000 * Math.random();
                snow.position.z = 1000 * (Math.random()-0.5);
                groupSnow.push(snow)
                console.log(groupSnow.length)
                this.scene.add(snow)
            }
            //雪花下落
            const loop = () =>{
                groupSnow.forEach((item, index)=> {
                    item.position.y -=1
                    if(item.position.y<0) {
                       item.position.y = 500
                    }
                })
                requestAnimationFrame(loop)
            }
            loop()
        },
        reRender: function() {
            this.renderer.render(this.scene, this.camera)
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
        this.scene.fog = new THREE.Fog(0xffffff, 60, 2000)
        //导入工厂模型
        this.importModal();
        this.snowDown()
        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.9)
        this.scene.add(ambientLight)
        const directionalLight = new THREE.DirectionalLight(0x404040, 5)
        directionalLight.position.set(0, 200, -200)
        this.scene.add(directionalLight)
        //创建透视相机
        this.camera = new THREE.PerspectiveCamera(20, width / height, 1, 10000);
        this.camera.position.set(400, 400, 400)
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);

        //创建渲染器
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        this.renderer.render(this.scene, this.camera)
        this.renderer.setClearColor(0xffffff, 0.8)
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
