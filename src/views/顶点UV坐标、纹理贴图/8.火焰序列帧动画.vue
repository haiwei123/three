<template>
    <div id="threeContainer" ref="threeContainer">
    </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export default {
    props: {
    },
    data() {
        return {
            num: 15,
            index: 0,
            scene: null,
            camera: null,
            renderer: null,
            texture: null
        }
    },
    methods: {
        //创建立方体
        createGeometry: function () {
            //创建
            const planeGeometry = new THREE.PlaneGeometry(50, 50)
            this.texture = new THREE.TextureLoader().load(require('../../assets/火焰.png'))
            this.texture.repeat.set(1 / 15, 1);//注意选择合适的阵列数量
            const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: this.texture, transparent: true, depthWrite: false, })
            const mesh = new THREE.Mesh(planeGeometry, material)
            mesh.translateY(25)
            let fireGroup = new THREE.Group()
            fireGroup.add(mesh, mesh.clone().rotateY(Math.PI / 4), mesh.clone().rotateY(Math.PI / 2), mesh.clone().rotateY(Math.PI / 4 * 3),)
            this.scene.add(fireGroup)
            this.renderer.render(this.scene, this.camera)
            this.goFire()
        },
        goFire: function () {
            this.index += 0.1
            if (this.index > this.num) {
                this.index = 0
            }
            this.texture.offset.x = Math.floor(this.index) / this.num;//注意选择合适的阵列数量 Math.floor 转整数获取正确帧
            this.renderer.render(this.scene, this.camera)
            requestAnimationFrame(this.goFire);//请求再次执行函数render
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

        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 20)
        this.scene.add(ambientLight)
        //创建透视相机
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
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
        this.createGeometry()
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
