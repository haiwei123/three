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
export default {
    data() {
        return {
            material: null,
            scene: null,
            renderer: null,
            camera: null,
            meshGroup: []
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
            //创建三个立方体
            const boxGeometry = new THREE.BoxGeometry(50, 50, 50)
            const material = new THREE.MeshBasicMaterial({color: 0x004444})
            for(let i = 0; i<3; i++) {
                const mesh = new THREE.Mesh(boxGeometry, material)
                mesh.translateY(25)
                mesh.translateX(i*50 + i*40)
                this.scene.add(mesh)
                this.meshGroup.push(mesh)
            }
        },
        //射线拾取
        //射线会返回相交的所有mesh 
        rayCasterFun: function() {
            //生成线模型渲染线条
            var triangleGeometry = new THREE.BufferGeometry();
            var vertices = new Float32Array([
                -100, 0, 0,
                300, 50, 0
            ]);
            //模拟渲染射线
            triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            // 创建三角形的材质
            var material = new THREE.LineBasicMaterial({ side: THREE.DoubleSide });
            material.color.set("white")
            // 创建三角形网格
            var triangleMesh = new THREE.LineLoop(triangleGeometry, material);
            this.scene.add(triangleMesh)

            //创建射线对象
            const rayCaster = new THREE.Raycaster()
            rayCaster.ray.origin = new THREE.Vector3(-100, 0, 0)
            rayCaster.ray.direction = new THREE.Vector3(300, 50, 0).normalize()
            console.log(this.meshGroup)
            const mesh = rayCaster.intersectObjects([...this.meshGroup])
            console.log('mesh：')
            console.log(mesh)
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
            const meshArray = raycaster.intersectObjects([...this.meshGroup])
            console.log(meshArray)
            if(true) {

            }
            
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
        // 添加一个辅助网格地面
        const gridHelper = new THREE.GridHelper(500, 25, 0x004444, 0x004444);
        this.scene.add(gridHelper);
        this.insertGeometry()

        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040)
        this.scene.add(ambientLight)

        //创建透视相机
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        this.camera.position.set(400, 400, 400)
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera);

        //创建渲染器
        this.renderer = new THREE.WebGLRenderer()
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
