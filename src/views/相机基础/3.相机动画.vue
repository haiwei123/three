
<template>
    <div id="threeContainer" ref="threeContainer">
        <el-row class="btnGroup">
            <el-button round @click="changeUp(0, 1, 0)">恢复</el-button>
            <el-button round @click="changeUp(-1, 0, 0)">up(-1, 0, 0)</el-button>
            <el-button round @click="changeUp(1, 0, 0)">1, 0, 0</el-button>
            <el-button round @click="changeUp(0, -1, 0)">up(0, -1, 0)</el-button>
            <el-button round @click="changeUp(0, 1, 0)">0, 1, 0</el-button>
            <el-button round @click="changeUp(0, 0, 1)">up(0, 0, 1)</el-button>
            <el-button round @click="changeUp(0, 0, -1)">0, 0, -1</el-button>
        </el-row>
    </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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
        changeUp: function(x, y, z) {
            this.camera.up.set(x, y, z)
            this.camera.lookAt(0, 0, 0)
            this.renderer.render(this.scene, this.camera)
        },
        //定点颜色
        createGeometry: function () {
            //添加雾化效果
            this.scene.fog = new THREE.Fog(0xffffff, 200, 1000)
            const gltfLoader = new GLTFLoader()
            gltfLoader.load("/modal/factory/工厂.glb", (gltf) => {
                this.scene.add(gltf.scene)
                gltf.scene.traverse((item) => {
                    if (item.type === 'Mesh') {
                        item.material = new THREE.MeshLambertMaterial({
                            color: item.material.color,
                            map: item.material.map,
                            side: THREE.DoubleSide
                        })
                    }
                })
                this.renderer.render(this.scene, this.camera)
            })
        },
        //相机动画
        rerender: function () {
            const R = 200; //元的半径
            let angle = 0; //计算渲染的角度
            let that = this
            function renderCamera() {
                angle -= 0.01; //每次旋转的角度
                console.log(angle)
                that.camera.position.x =R * Math.cos(angle);
                that.camera.position.z =R * Math.sin(angle);
                that.camera.lookAt(0,0,0);
                that.renderer.render(that.scene, that.camera);
                requestAnimationFrame(renderCamera);
            }
            renderCamera()
        },
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
        //this.scene.add(gridHelper);
        this.createGeometry();
        //创建环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight)
        const directionalLight = new THREE.PointLight(0xffffff, 2);
        directionalLight.position.set(100, 60, 50);
        this.scene.add(directionalLight);
        //创建透视相机
        console.log('width:' + width + ', height:' + height)
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 8000);
        this.camera.position.set(200, 200, 200)
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);
        //创建渲染器 logarithmicDepthBuffer: true 优化深度冲突问题
        this.renderer = new THREE.WebGLRenderer({
            logarithmicDepthBuffer: true, antialias: true
        })
        this.renderer.outputEncoding = THREE.sRGBEncoding //设置编码格式
        //设置背景透明
        //this.renderer.setClearAlpha(0.9);
        //设置背景颜色,和雾的颜色一样
        this.renderer.setClearColor(0xffffff, 0.8)

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
        this.rerender()
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
