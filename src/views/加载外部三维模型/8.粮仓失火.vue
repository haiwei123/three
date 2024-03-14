
<template>
    <div id="threeContainer" ref="threeContainer" @click="choseModal">
    </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; FBXLoader
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { createFire } from '../../libs/fire'
import Label from '@/components/label'
import Vue from 'vue'
export default {
    components: {
        Label
    },
    props: {
    },
    data() {
        return {
            scene: null,
            renderer: null,
            css3dRenderer: null,
            css2dRenderer: null,
            camera: null,
            choseMesh: null,
            meshArray: [],
            texture: null,
            index: 0,
            num: 15
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
            //添加雾化效果
            this.scene.fog = new THREE.Fog(0xffffff, 200, 1000)
            //创建组对象添加标签
            const labelGroup = new THREE.Group()
            const gltfLoader = new GLTFLoader()
            gltfLoader.load("/modal/lc/粮仓.glb", (gltf) => {
                console.log('gltf.scene')
                console.log(gltf.scene)
                this.scene.add(gltf.scene)
                gltf.scene.traverse((item) => {
                    if (item.type === 'Mesh') {
                        item.material = new THREE.MeshLambertMaterial({
                            color: item.material.color,
                            map: item.material.map,
                            side: THREE.DoubleSide
                        })
                        this.meshArray.push(item)
                    }
                })
                //获取粮仓模型
                let models = gltf.scene.getObjectByName('粮仓')
                //循环添加标签
                models.traverse((obj) => {
                    if (obj.type === 'Mesh') {
                        const pos = new THREE.Vector3()
                        obj.getWorldPosition(pos)
                        if (obj.parent.name === '平房仓') {
                            pos.y += 16
                        } else if (obj.parent.name === '浅圆仓') {
                            pos.y += 20
                        } else {
                            pos.y += 40
                        }
                        const labelMesh = this.createTag(obj.name, pos)
                        labelGroup.add(labelMesh) //加入组
                    }
                })
                this.scene.add(labelGroup)
                console.log('labelGroup', labelGroup)
            })
        },
        createTag: function (name, pos) {
            let meshGroup = new THREE.Group()
            //创建标注 
            const vm = new Vue({
                render: function (createElement) {
                    return createElement(Label, { props: { name: name } }); // 使用渲染函数将组件渲染成虚拟DOM
                }
            });
            // 手动挂载到虚拟DOM
            vm.$mount();
            // 等待Vue渲染完成
            vm.$nextTick(() => {
                const mesh = new CSS3DObject(vm.$el)
                mesh.position.copy(pos)
                mesh.scale.set(0.3, 0.3, 0.3)
                mesh.rotateY(Math.PI / 2)
                mesh.rotateX(Math.PI / 6 * -1)
                meshGroup.add(mesh)
            })
            return meshGroup
        },
        choseModal: function (event) {
            if (this.choseMesh) {
                this.choseMesh.material.color.set(0xffffff)
            }
            //获取鼠标点击相对坐标
            var dx = event.clientX - 250; //鼠标点击位置横坐标
            var dy = event.clientY - 60; //鼠标点击位置纵坐标
            let width = window.innerWidth - 250
            let height = window.innerHeight - 60
            //转化为WebGL标准坐标
            var x = (dx / width) * 2 - 1; //WebGL标准设备横坐标
            var y = -(dy / height) * 2 + 1; //WebGL标准设备纵坐标
            //创建射线投射器
            var raycaster = new THREE.Raycaster()
            //通过鼠标点击位置标准设备坐标和相机参数计算射线投射器的射线属性.ray
            raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera)
            //返回intersctObjects()中选取的网格模型
            console.log(this.meshArray)
            var interscts = raycaster.intersectObjects(this.meshArray)
            console.log(interscts)
            if (interscts.length > 0) {
                this.choseMesh = interscts[0].object;
                console.log(`点击的模型${this.choseMesh.name}，`, this.choseMesh.position)
                this.choseMesh.material.color.set(0x00ffff)
                //this.createBox(this.choseMesh)
                let f = createFire(this.choseMesh);
                this.scene.add(f);
                setTimeout(() => {
                    //f.stop()
                    //this.scene.remove(f)
                }, 2000)
            }
        },

        updateRender: function () {
            this.renderer.render(this.scene, this.camera)
            this.css3dRenderer != null && this.css3dRenderer.render(this.scene, this.camera)
            this.css2dRenderer.render(this.scene, this.camera)
            requestAnimationFrame(this.updateRender)
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
        //this.createFire()
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
        //创建CSS2渲染器
        this.css3dRenderer = new CSS3DRenderer()
        this.css3dRenderer.setSize(width, height)
        this.css3dRenderer.domElement.style.pointerEvents = 'none'
        this.css3dRenderer.domElement.style.position = 'absolute'
        this.css3dRenderer.domElement.style.top = '0px'
        this.css3dRenderer.domElement.style.left = '0px'
        //创建CSS2渲染器
        this.css2dRenderer = new CSS2DRenderer()
        this.css2dRenderer.setSize(width, height)
        this.css2dRenderer.domElement.style.pointerEvents = 'none'
        this.css2dRenderer.domElement.style.position = 'absolute'
        this.css2dRenderer.domElement.style.top = '0px'
        this.css2dRenderer.domElement.style.left = '0px'


        this.css3dRenderer.render(this.scene, this.camera)
        this.css2dRenderer.render(this.scene, this.camera)
        this.$refs.threeContainer.appendChild(this.css3dRenderer.domElement)
        this.$refs.threeContainer.appendChild(this.css2dRenderer.domElement)
        //创建相机控件
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement)

        orbitControls.addEventListener('change', () => {
            //可以重新设置相机的观察坐标
            this.camera.lookAt(orbitControls.target)
            this.renderer.render(this.scene, this.camera)
            this.css3dRenderer.render(this.scene, this.camera)
            this.css2dRenderer.render(this.scene, this.camera)
        })
        //添加相机控件
        window.onresize = () => {
            let rewidth = window.innerWidth - 250
            let reheight = window.innerHeight - 60
            this.renderer.setSize(rewidth, reheight)
            this.camera.aspect = rewidth / reheight
            this.css3dRenderer.setSize(rewidth, reheight)
            this.css3dRenderer.render(this.scene, this.camera)
            this.renderer.render(this.scene, this.camera)
            this.camera.updateProjectionMatrix();
        }
        this.updateRender()
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
