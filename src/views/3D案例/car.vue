<template>
    <div id="threeContainer" ref="threeContainer">  
        <ProgressBar v-if="progress < 100" :progres="progress"/>
    </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { three3DRender } from '@/libs/three3dUtils'
import ProgressBar from '@/components/ProgressBar'
import Vue from 'vue'
let material= null
let scene= null
let renderer= null
let camera= null
let gui=null
let meshArray= []
let meshGroup= new THREE.Group()
let roate= null
let sprintMesh= null
let rayArray = []
let orbitControls = null

export default {
    components: {
        ProgressBar
    },
    data() {
        return {
            progress: 0
        }
    },
    methods: {
        rotate: function () {
            if (roate === null) {
                this.animation()
            } else {
                this.cancelAnimationFrame(roate)
                roate = null
            }
        },
        animation: function () {
            meshGroup.rotateY(0.01)
            //更新标签位置
            const xst = scene.getObjectByName('xst')
            if(xst) {
            const tag = scene.getObjectByName('tag')
            const v3 = new THREE.Vector3()
            xst.getWorldPosition(v3)
            tag.position.copy(v3)
            }
            roate = requestAnimationFrame(this.animation)
        },
        resizeRender: function() {
            window.onresize = ()=> {
                const width = document.getElementById("threeContainer").offsetWidth
                const height = document.getElementById("threeContainer").offsetHeight
                renderer.setSize(width, height)
                camera.aspect = width / height
                camera.updateProjectionMatrix()
            }
        },
        addLight: function() {
           /**
            * 光源设置
            */
            // 平行方向光1
            var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
            directionalLight.position.set(100, 200, 200);
            scene.add(directionalLight);
            // 平行方向光2
            var directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight2.position.set(-300, -100, -400);
            scene.add(directionalLight2);
        },
        //创建一个隧道
        addCylinder: function () {
            const geometry = new THREE.CylinderGeometry( 700, 700, 3500, 32, 1, true );
            const material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide} );
            const textureImage = new THREE.TextureLoader().load(require('../../assets/sd.png'))
            textureImage.wrapS = THREE.RepeatWrapping;
            textureImage.wrapT = THREE.RepeatWrapping;
            textureImage.repeat.set(200, 200) //允许阵列多少个
            //material.map = textureImage
            material.color.set("#ccc")
            const cylinder = new THREE.Mesh( geometry, material );
            cylinder.rotateZ((Math.PI / 2))
            scene.add(cylinder);
        },
        //插入汽车模型
        insertCarModal: function() {
            //加密文件
            const loader = new GLTFLoader()
            const dracoLoader = new DRACOLoader()
            dracoLoader.setDecoderPath("draco/gltf/"); 
            dracoLoader.setDecoderConfig({ type: 'js' }); //使用js方式解压
            dracoLoader.preload(); //初始化_initDecoder 解码器
            loader.setDRACOLoader(dracoLoader); //gltfloader使用dracoLoader
            loader.load('modal/car/car/轿车-processed.glb', (gltf) =>{
                gltf.scene.traverse((object)=> {
                    // if(object.type==='Mesh') { //如果是物体
                    //     if (object.name.slice(0, 4) == "高光金属") {
                    //         object.material = new THREE.MeshStandardMaterial({
                    //             color: object.material.color, //读取材质原来的颜色
                    //             metalness: 1.0,
                    //             roughness: 0.2,
                    //             //   envMapIntensity控制环境贴图的影响
                    //             envMapIntensity: 1.0,
                    //         })
                    //     } else if (object.name.slice(0, 2) == "外壳") { //整个外壳、相同材质的车门外壳等
                    //         object.material = new THREE.MeshPhysicalMaterial({
                    //             color: object.material.color, //默认颜色
                    //             // color: 0x6a030a,//红色
                    //             // color: 0x222222,//灰色
                    //             // color: 0x000000,//黑色
                    //             // color: 0xffffff,//银白色
                    //             clearcoat: 1,
                    //             clearcoatRoughness: 0.01,
                    //             metalness: 0.9,
                    //             roughness: 0.5,
                    //             envMapIntensity: 2.5,
                    //         })
                    //     } else if (object.name.slice(0, 2) == "玻璃") {
                    //         object.material = new THREE.MeshPhysicalMaterial({
                    //             color: 0x000000,
                    //             metalness: 0,
                    //             roughness: 0,
                    //             transparent: true,
                    //             transmission: 0.5, //transmission替代opacity                    envMapIntensity: 2.5,
                    //         })
                    //     } else if (object.name.slice(0, 3) == "后视镜") {
                    //         object.material = new THREE.MeshStandardMaterial({
                    //             color: 0xffffff, //白色
                    //             metalness: 1.0,
                    //             roughness: 0.0,
                    //             //   envMapIntensity控制环境贴图的影响
                    //             envMapIntensity: 1.0,
                    //         })
                    //     } else if (object.name.slice(0, 2) == "轮胎") {
                    //         object.material.color.set(0x000000);
                    //         object.material.normalScale.set(2, 2); //加强法线贴图凹凸效果
                    //         object.material.metalness = 0.0;
                    //         object.material.roughness = 0.6;
                    //     } else if (object.name.slice(0, 3) == "前灯罩") {
                    //         object.material = new THREE.MeshPhysicalMaterial({
                    //             color: 0xffffff,
                    //             metalness: 0,
                    //             roughness: 0,
                    //             envMapIntensity: 1.0,
                    //             transmission: 0.9,
                    //             transparent: true,
                    //             envMapIntensity: 2.5,
                    //         })
                    //     } else if (object.name.slice(0, 4) == "尾灯灯罩") {
                    //         object.material = new THREE.MeshPhysicalMaterial({
                    //             color: 0xff0000,
                    //             metalness: 0,
                    //             roughness: 0,
                    //             transmission: 0.5,
                    //             transparent: true,
                    //             envMapIntensity: 2.5,
                    //         })
                    //     } else if (object.name.slice(0, 5) == "尾灯第二层") {
                    //         object.material = new THREE.MeshPhysicalMaterial({
                    //             color: 0x440000,
                    //             metalness: 0,
                    //             roughness: 0,
                    //             transmission: 0.5,
                    //             transparent: true,
                    //         })
                    //     } else if (object.name.slice(0, 4) == "尾灯发光") {
                    //         object.material = new THREE.MeshLambertMaterial({
                    //             color: 0x660000,
                    //         })
                    //     } else if (object.name.slice(0, 5) == "尾灯第三层") {
                    //         object.material = new THREE.MeshLambertMaterial({
                    //             color: 0x19190000,
                    //         })
                    //     } else if (object.name.slice(0, 2) == "塑料") {
                    //         object.material = new THREE.MeshPhysicalMaterial({
                    //             color: 0x010101,
                    //             metalness: 0.0,
                    //             roughness: 0.8,
                    //             envMapIntensity: 1.0,
                    //         })
                    //     }
                    //     gltf.scene.getObjectByName('天窗黑玻璃').material = new THREE.MeshPhysicalMaterial({
                    //         color: 0x00000,
                    //         metalness: 0,
                    //         roughness: 0,
                    //         envMapIntensity: 1.0,
                    //         transmission: 0.2, // .transmission属性用于设置玻璃材质
                    //         transparent: true
                    //     })
                    //     gltf.scene.getObjectByName('车座').material = new THREE.MeshPhysicalMaterial({
                    //         color: 0x020202,
                    //         metalness: 0.0,
                    //         roughness: 0.6,
                    //         envMapIntensity: 1.0,
                    //     })
                    // }
                })
                scene.add(gltf.scene)
                this.insertSprint('左前门')
                this.insertSprint('右前门')
                this.insertSprint('左后门')
                this.insertSprint('右后门')
            }, (xhr)=> {
                console.log('xhr', xhr)
		        this.progress = xhr.loaded / xhr.total * 100
            })
        },
        //添加精灵模型
        insertSprint: function(location) {
            const map = new THREE.TextureLoader().load(require('@/assets/光点.png'));
            const material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
            const sprite = new THREE.Sprite(material);
            const cm = scene.getObjectByName(location)
            const v3 = new THREE.Vector3()
            cm.getWorldPosition(v3)
            sprite.position.copy(v3)
            sprite.scale.set(12, 12, 12)
            sprite.translateX(80)
            sprite.translateZ(30)

            scene.add(sprite);
        },
        //创建地面
        createPlane: function() {
            const textureImage = new THREE.TextureLoader().load(require('../../assets/瓷砖.jpg'))
            textureImage.wrapS = THREE.RepeatWrapping;
            textureImage.wrapT = THREE.RepeatWrapping;
            textureImage.repeat.set(4, 4) //允许阵列多少个
            const material = new THREE.MeshBasicMaterial({map: textureImage, side: THREE.DoubleSide})
            const planeGeometry = new THREE.PlaneGeometry(3500, 1450)
            const mesh = new THREE.Mesh(planeGeometry, material)
            mesh.position.set(0, -5, 0)
            mesh.rotateX(Math.PI / 2)
            scene.add(mesh)
        },
    },
    mounted() {
        gui = new GUI()
        //创建场景
        scene = new THREE.Scene()
        //添加雾化效果
        scene.fog = new THREE.Fog(0xffffff, 1000, 2000)
        //三维坐标系
        const axesHelper = new THREE.AxesHelper(300)
        scene.add(axesHelper)
        // 添加一个辅助网格地面
        //const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
        //scene.add(gridHelper);
        //创建环境光
        const light = new THREE.AmbientLight(0x404040, 2)
        scene.add(light)
        
        const width = document.getElementById("threeContainer").offsetWidth
        const height = document.getElementById("threeContainer").offsetHeight
        //创建手机摄像头介绍说明
        
        //创建相机
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.set(-612.8215878689181, 181.3458527352969, -19.1122339981010)
        camera.lookAt(0, 0, 0)
        scene.add(camera);
        //添加相机环境贴图
        const clubTexture = new THREE.CubeTextureLoader().setPath('/modal/car/envMap/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
            clubTexture.encoding = THREE.sRGBEncoding
        scene.environment = clubTexture

        //创建渲染器
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(width, height)
        renderer.render(scene, camera)
        renderer.setClearColor(0xffffff, 0.8)
        document.getElementById('threeContainer').appendChild(renderer.domElement)
        //创建OrbitControls
        orbitControls = new OrbitControls(camera, renderer.domElement)
        orbitControls.addEventListener('change', () => {
            //camera.position.set(-612.8215878689181, 181.3458527352969, -19.1122339981010)
            camera.lookAt(orbitControls.target)
            renderer.render(scene, camera)
        })
        three3DRender(camera, scene, renderer)
        //animation()
        this.resizeRender()
        this.addCylinder()
        this.insertCarModal()
        this.createPlane()
        this.addLight()

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
