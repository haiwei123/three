<template>
    <div id="threeContainer" ref="threeContainer" @click="choseModal">
        <div class="btns">
            <el-button type="default" circle :icon="roate != null ? 'el-icon-circle-close' : 'el-icon-refresh'"
                @click="rotate()"></el-button>
        </div>
        <div class="colors">
            <img src="@/assets/color/幻夜黑.png" @click="changeColor('黑色外壳')" />
            <img src="@/assets/color/极光紫.png" @click="changeColor('紫色外壳')" />
            <img src="@/assets/color/极光蓝.png" @click="changeColor('蓝色外壳')" />
            <img src="@/assets/color/珊瑚红.png" @click="changeColor('红色外壳')" />
        </div>
        
    </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { three3DRender } from '@/libs/three3dUtils'
import phoneLabel from '@/components/phoneLabel'
import Vue from 'vue'
export default {
    components: {
        phoneLabel
    },
    data() {
        return {
            material: null,
            scene: null,
            renderer: null,
            css3dRenderer: null,
            css2dRenderer: null,
            camera: null,
            gui: null,
            raycaster: null,
            labelObject: null,
            meshArray: [],
            meshGroup: new THREE.Group(),
            roate: null,
            sprintMesh: null,
            rayArray: []
        }
    },
    methods: {
        rotate: function () {
            if (this.roate === null) {
                this.animation()
            } else {
                cancelAnimationFrame(this.roate)
                this.roate = null
            }
        },
        changeColor: function (type) {
            const phone = this.scene.getObjectByName('手机')
            const texture = new THREE.TextureLoader()
            if (type.indexOf('黑') > -1) {
                phone.material.map = texture.load('modal/phone1/幻夜黑.png')
            } else if (type.indexOf('紫') > -1) {
                phone.material.map = texture.load('modal/phone1/极光紫.png')
            } else if (type.indexOf('蓝') > -1) {
                phone.material.map = texture.load('modal/phone1/极光蓝.png')
            } else if (type.indexOf('红') > -1) {
                phone.material.map = texture.load('modal/phone1/珊瑚红.png')
            }
            phone.material.map.flipY = false;
        },
        onMouseMove: function (event) {
            // 定义射线检测器
            const raycaster = new THREE.Raycaster();
            //获取鼠标点击相对坐标
            var dx = event.clientX - 250; //鼠标点击位置横坐标
            var dy = event.clientY - 60; //鼠标点击位置纵坐标
            let width = window.innerWidth - 250
            let height = window.innerHeight - 60
            //转化为WebGL标准坐标
            var x = (dx / width) * 2 - 1; //WebGL标准设备横坐标
            var y = -(dy / height) * 2 + 1; //WebGL标准设备纵坐标
            // 从摄像机位置发出射线
            const mouse = new THREE.Vector2();
            mouse.x = x
            mouse.y = y 
            raycaster.setFromCamera(mouse, this.camera);
            // 执行射线检测
            const intersects = raycaster.intersectObjects(this.meshArray, true);
            // 检查是否有交点
            if (intersects.length > 0) {
                const contain = intersects.some((item)=> {
                    return item.object.name === '手机'
                })
                if(contain) {
                    cancelAnimationFrame(this.roate)
                    this.roate = null
                }
            } else { //
                //继续动画
                if(this.roate==null) {
                    this.animation()
                }
            }
        },
        choseModal: function (event) {
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

            var interscts = raycaster.intersectObjects(this.rayArray)
            console.log(interscts.length)
            if (interscts.length > 0) {
                const tagMesh = this.scene.getObjectByName('tag')
                tagMesh.visible = true
                this.orbitControls.enableRotate = false; // 禁用旋转
                this.orbitControls.enableZoom = false; // 禁用缩放
                this.orbitControls.enablePan = false; // 禁用平移（即右键拖拽）
            } else {
                this.orbitControls.enableRotate = true; // 禁用旋转
                this.orbitControls.enableZoom = true; // 禁用缩放
                this.orbitControls.enablePan = true; // 禁用平移（即右键拖拽）
            }
        },
        animation: function () {
            this.meshGroup.rotateY(0.01)
            //更新标签位置
            const xst = this.scene.getObjectByName('xst')
            if(xst) {
            const tag = this.scene.getObjectByName('tag')
            const v3 = new THREE.Vector3()
            xst.getWorldPosition(v3)
            tag.position.copy(v3)
            }
            this.roate = requestAnimationFrame(this.animation)
        },
        pointAnotion: function() {
            var s = 0.0;
            const that = this
            function waveAnimation() {
                s += 0.01;
                if (s < 0.5) {
                    that.sprintMesh!=null && (that.sprintMesh.scale.x = 6 * (1 + s));
                    that.sprintMesh!=null && (that.sprintMesh.scale.y = 6 * (1 + s));
                } else if (s >= 0.5 && s < 1.0) {
                    that.sprintMesh!=null && (that.sprintMesh.scale.x = 6 * (2 - s));
                    that.sprintMesh!=null && (that.sprintMesh.scale.y = 6 * (2 - s));
                } else {
                    s = 0.0;
                }
                //请求再次执行函数waveAnimation
                requestAnimationFrame(waveAnimation);
            }
            waveAnimation()
        },
        createTag: function(xst) {
            const pos = new THREE.Vector3()
            xst.getWorldPosition(pos)
            //创建组对象
            const group = new THREE.Group()
            //创建标注 
            const vm = new Vue({
                render: function (createElement) {
                    return createElement(phoneLabel); // 使用渲染函数将组件渲染成虚拟DOM
                }
            });
            // 手动挂载到虚拟DOM
            vm.$mount();
            // 等待Vue渲染完成
            vm.$nextTick(() => {
                const element = vm.$el;
                element.addEventListener('pointerdown', () =>{
                 // 处理点击事件的逻辑
                     var tag = this.scene.getObjectByName('tag')
                     tag.visible = false
                });
                const label = new CSS2DObject(element)
                label.position.copy(pos)
                label.name = 'tag'
                label.visible = false
                group.add(label)
            })
            return group
        },
        resizeRender: function() {
            window.onresize = ()=> {
                const width = document.getElementById("threeContainer").offsetWidth
                const height = document.getElementById("threeContainer").offsetHeight
                this.renderer.setSize(width, height)
                this.camera.aspect = width / height
                this.camera.updateProjectionMatrix()
            }
        }
    },
    mounted() {
        this.raycaster = new THREE.Raycaster();
        this.gui = new GUI()
        //创建场景
        this.scene = new THREE.Scene()
        //三维坐标系
        const axesHelper = new THREE.AxesHelper(100)
        //this.scene.add(axesHelper)
        // 添加一个辅助网格地面
        //const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
        //this.scene.add(gridHelper);
        //创建环境光
        const light = new THREE.AmbientLight(0x404040, 10)
        //light.position.set(50, 90, 40)
        const plight = new THREE.PointLight(0x404040, 50)
        plight.position.set(0, 120, 0)
        plight.name = '点光源'
        plight.add(new THREE.PointLightHelper(plight, 10))
        this.scene.add(light, plight)
        //解析手机模型
        const gltfLoader = new GLTFLoader()
        var textureCube = new THREE.CubeTextureLoader()
            .setPath('modal/phone1/envMap/')
            .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
        //解析并加载手机模型
        gltfLoader.load('modal/phone1/手机.glb', (gltf) => {
            //给手机模型添加纹理贴图
            const texLoader = new THREE.TextureLoader()     //翻转贴纸
            //texture.flipY = false
            const phone = gltf.scene.getObjectByName('手机')
            phone.material = new THREE.MeshPhysicalMaterial(
                {
                    // color:0xffffff,
                    metalness: 1.0,//Mesh表面金属度，默认值0.5
                    roughness: 1.0,//Mesh表面粗糙度，默认值0.5
                    map: texLoader.load("modal/phone1/幻夜黑.png"), //颜色贴图
                    // 金属度、粗糙度贴图表示的值会和金属度、粗糙度分别相乘
                    roughnessMap: texLoader.load("modal/phone1/roughness.png"), //粗糙度贴图
                    metalnessMap: texLoader.load("modal/phone1/metallic.png"), //金属度贴图
                    // 相机镜头等位置需要设置半透明效果(设置alphaMap和transparent属性)
                    alphaMap: texLoader.load("modal/phone1/opacity.png"),//alpha贴图

                    normalMap: texLoader.load("modal/phone1/normal.png"), //法线贴图
                    transparent: true, //使用alphaMap，注意开启透明计算
                    envMap: textureCube, //设置pbr材质环境贴图，渲染效果更好
                    envMapIntensity: 0.5, //设置环境贴图对模型表面影响程度
                }
            )
            // 纹理朝向texture.flipY
            phone.material.map.flipY = false;
            phone.material.normalMap.flipY = false;
            phone.material.metalnessMap.flipY = false;
            phone.material.roughnessMap.flipY = false;
            phone.material.alphaMap.flipY = false;
            phone.name = '手机'
            phone.renderOrder = 0; //renderOrder小的先渲染
            this.meshArray.push(gltf.scene)
            this.meshGroup.add(gltf.scene)
            //添加精灵模型
            const xst = gltf.scene.getObjectByName("后置摄像头位置")
            const texLoader1 = new THREE.TextureLoader()     //翻转贴纸
            //创建精灵模型材质
            const spriteMaterial = new THREE.SpriteMaterial({ map: texLoader1.load(require('@/assets/光点.png')) })
            this.sprintMesh = new THREE.Sprite(spriteMaterial)
            this.sprintMesh.name = 'xst'
            this.sprintMesh.scale.set(6, 6, 6)
            this.sprintMesh.renderOrder = 1;
            const pos = new THREE.Vector3()
            xst.getWorldPosition(pos)
            this.sprintMesh.position.copy(pos)
            this.sprintMesh.position.z -= 5
            this.scene.add(this.createTag(this.sprintMesh))
            this.meshGroup.add(this.sprintMesh)
            this.rayArray.push(this.sprintMesh)
            this.pointAnotion()
            //zsiga 双子系列
        })
        //创建圆环线
        const arcCurves = new THREE.ArcCurve(0, 0, 60, Math.PI / 8, Math.PI * 2 - Math.PI / 8)
        const buffer = new THREE.BufferGeometry().setFromPoints(arcCurves.getPoints(50))
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 1,
        })
        const lineMesh = new THREE.Line(buffer, lineMaterial)
        lineMesh.translateY(-50)
        lineMesh.position.set(0, -80, 0)
        lineMesh.rotateX(Math.PI / 2) // 将圆环线绕X轴旋转至平行于X轴
        lineMesh.rotateZ(Math.PI / 2)
        this.meshGroup.add(lineMesh)
        //添加720标签
        const material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide,    transparent: true, map: new THREE.TextureLoader().load(require('@/assets/720.png'))})
        const plane = new THREE.PlaneGeometry(40, 20)
        this.labelObject = new THREE.Mesh(plane, material)
        this.labelObject.position.set(0, -80.6, 57.2)
        this.labelObject.renderOrder = 2; //renderOrder小的先渲染
        this.meshGroup.add(this.labelObject)
        this.scene.add(this.meshGroup)
        this.gui.add(this.labelObject.position, 'y', -100, 100).name('720Y轴位置')
        this.gui.add(this.labelObject.position, 'z', -100, 100).name('720Z轴位置')

        const width = document.getElementById("threeContainer").offsetWidth
        const height = document.getElementById("threeContainer").offsetHeight
        //创建手机摄像头介绍说明
        
        //创建相机
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        this.camera.position.set(338.9625731580599, -21.879196363272378, 129.94922406797969)
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);
        //创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(width, height)
        this.renderer.render(this.scene, this.camera)
        //创建渲染器
        this.css3dRenderer = new CSS3DRenderer()
        this.css3dRenderer.setSize(width, height)
        this.css3dRenderer.domElement.style.pointerEvents = 'none'
        this.css3dRenderer.domElement.style.position = 'absolute'
        this.css3dRenderer.domElement.style.top = '0px'
        this.css3dRenderer.domElement.style.left = '0px'
        this.css3dRenderer.render(this.scene, this.camera)

        this.css2dRenderer = new CSS2DRenderer()
        this.css2dRenderer.setSize(width, height)
        this.css2dRenderer.domElement.style.pointerEvents = 'none'
        this.css2dRenderer.domElement.style.position = 'absolute'
        this.css2dRenderer.domElement.style.top = '0px'
        this.css2dRenderer.domElement.style.left = '0px'
        this.css2dRenderer.render(this.scene, this.camera)
        document.getElementById('threeContainer').appendChild(this.renderer.domElement)
        document.getElementById('threeContainer').appendChild(this.css3dRenderer.domElement)
        document.getElementById('threeContainer').appendChild(this.css2dRenderer.domElement)
        //创建OrbitControls
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbitControls.minDistance = 200;
        this.orbitControls.maxDistance = 500;
        this.orbitControls.addEventListener('change', () => {
            //this.camera.position.set(338.9625731580599, -21.879196363272378, 129.94922406797969)
            this.camera.lookAt(this.orbitControls.target)
            this.renderer.render(this.scene, this.camera)
            this.css2dRenderer.render(this.scene, this.camera)
            this.css3dRenderer.render(this.scene, this.camera)
        })
        three3DRender(this.camera, this.scene, this.renderer, this.css2dRenderer, this.css3dRenderer)
        //this.animation()
        this.resizeRender()
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

.btns {
    position: absolute;
    top: 50%;
    left: 20%;
    transform: translate(-50%, 10px);


}

.colors {
    position: absolute;
    top: 87%;
    width: 50%;
    left: 50%;
    transform: translate(-50%, 10px);


}

.colors img {
    width: 50px;
    height: 50px;
    margin-left: 20px;
    margin-right: 20px;
}
</style>
