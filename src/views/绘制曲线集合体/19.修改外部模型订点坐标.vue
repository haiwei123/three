
<template>
    <div id="threeContainer" ref="threeContainer">
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
        show: function (type) {
            if (type == 2) {
                this.scene.getObjectByName('Mesh21').visible = true
                this.scene.getObjectByName('Mesh22').visible = true
                this.scene.getObjectByName('Mesh23').visible = true
                this.scene.getObjectByName('Mesh31').visible = false
                this.scene.getObjectByName('Mesh32').visible = false
                this.scene.getObjectByName('Mesh33').visible = false
            } else {
                this.scene.getObjectByName('Mesh21').visible = false
                this.scene.getObjectByName('Mesh22').visible = false
                this.scene.getObjectByName('Mesh23').visible = false
                this.scene.getObjectByName('Mesh31').visible = true
                this.scene.getObjectByName('Mesh32').visible = true
                this.scene.getObjectByName('Mesh33').visible = true
            }
            this.renderer.render(this.scene, this.camera)
        },
        //定点颜色
        createGeometry: function () {
            const gltfLoader = new GLTFLoader()
            gltfLoader.load("/modal/background/地形.glb", (gltf) => {
                this.scene.add(gltf.scene)
                const mesh = gltf.scene.children[0]
                const pos = mesh.geometry.attributes.position
                const count = pos.count
                const heightArr = []
                for (var i = 0; i < count; i++) {
                    heightArr.push(pos.getY(i))
                    //pos.setY(i, pos.getY(i) * 2)
                }
                heightArr.sort()
                //获取山脉的最低
                const maxHeight = heightArr[heightArr.length - 1]
                const minHeight = heightArr[0]
                const colors = []
                const color1 = new THREE.Color(0x0000ff) //黄色
                const color2 = new THREE.Color(0xfff000) //黄色
                const color3 = new THREE.Color(0xff0000) //黄色
                for (var i = 0; i < heightArr.length; i++) {
                    const percent = (pos.getY(i) - minHeight) / maxHeight;
                    let c = null
                    if (percent < 0.5) {
                        c = color1.clone().lerp(color2, percent * 2)
                    } else {
                        c = color2.clone().lerp(color3, (percent - 0.5) * 2)
                    }
                    colors.push(c.r, c.g, c.b)
                }
                const colorArray = new THREE.BufferAttribute(new Float32Array(colors), 3)
                mesh.material = new THREE.MeshLambertMaterial({
                    vertexColors: true,
                    side: THREE.DoubleSide
                });
                mesh.geometry.attributes.color = colorArray
                this.renderer.render(this.scene, this.camera)
            })
        },
        createGeometry1: function () {

        },
        createGeometry2: function () {

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
        this.createGeometry1();
        this.createGeometry2();
        //创建环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(100, 60, 50);
        this.scene.add(directionalLight);
        //创建透视相机
        console.log('width:' + width + ', height:' + height)
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 8000);
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
