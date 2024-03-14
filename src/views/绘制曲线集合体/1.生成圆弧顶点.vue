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
            scene: null,
            renderer: null,
            camera: null
        }
    },
    methods: {
        downLoad: function () {
            let link = document.createElement('a')
            const canvas = this.renderer.domElement

            link.href = canvas.toDataURL("image/png")
            console.log(link.href)
            link.download = '3d.png'
            link.click()
        },
        //创建一个圆弧顶点
        createGeometry: function () {
            //创建一个空的集合体
            const bufferGeometry = new THREE.BufferGeometry()
            //记录顶点数据
            const attributes = []
            const sourceX = 40; //圆弧的X点坐标
            const sourceY = 40; //圆弧的Y点坐标
            //圆弧的基本信息
            const r = 100 //圆弧半径 
            const n = 50 //三角形的数量
            const sp = 2 * Math.PI / n //每一个顶点的间隔弧度
            for (var i = 0; i < n; i++) { //利用半径当作临边 使用三角函数sin和cos计算出顶点的坐标
                const angle = sp * i //当前三角形的弧度
                const x = sourceX + r * Math.cos(angle)
                const y = sourceY + r * Math.sin(angle)
                attributes.push(x, y, 0)
            }
            const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
            const bufferAttribute = new THREE.BufferAttribute(new Float32Array(attributes), 3);
            bufferGeometry.attributes.position = bufferAttribute
            const lineloop = new THREE.LineLoop(bufferGeometry, material)
            this.scene.add(lineloop)
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
        //创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040)
        this.scene.add(ambientLight)
        //创建透视相机
        console.log('width:' + width + ', height:' + height)
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
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
