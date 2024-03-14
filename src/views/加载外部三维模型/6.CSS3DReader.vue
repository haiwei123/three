
<template>
    <div id="threeContainer" ref="threeContainer">
    </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
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
            //添加雾化效果
            this.scene.fog = new THREE.Fog(0xffffff, 200, 1000)
            //创建组对象添加标签
            const labelGroup = new THREE.Group()
            const gltfLoader = new GLTFLoader()
            gltfLoader.load("/modal/lc/粮仓.glb", (gltf) => {
                this.scene.add(gltf.scene)
                console.log(gltf.scene)
                gltf.scene.traverse((item) => {
                    if (item.type === 'Mesh') {
                        item.material = new THREE.MeshLambertMaterial({
                            color: item.material.color,
                            map: item.material.map,
                            side: THREE.DoubleSide
                        })
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
                this.renderer.render(this.scene, this.camera)
                setTimeout(() => {
                    this.css3dRenderer != null && this.css3dRenderer.render(this.scene, this.camera)
                }, 1)

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
        //创建CSS2渲染器
        this.css3dRenderer = new CSS3DRenderer()
        this.css3dRenderer.setSize(width, height)
        this.css3dRenderer.domElement.style.pointerEvents = 'none'
        this.css3dRenderer.domElement.style.position = 'absolute'
        this.css3dRenderer.domElement.style.top = '0px'
        this.css3dRenderer.domElement.style.left = '0px'

        this.css3dRenderer.render(this.scene, this.camera)
        this.$refs.threeContainer.appendChild(this.css3dRenderer.domElement)
        //创建相机控件
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement)

        orbitControls.addEventListener('change', () => {
            //可以重新设置相机的观察坐标
            this.camera.lookAt(orbitControls.target)
            this.renderer.render(this.scene, this.camera)
            this.css3dRenderer.render(this.scene, this.camera)
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
