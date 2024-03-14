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
    methods: {
    },
    mounted() {
        //获取当前容器的宽高
        let width = document.getElementById("threeContainer").offsetWidth
        let height = document.getElementById("threeContainer").offsetHeight
        //创建场景
        const scene = new THREE.Scene()

        //创建三维坐标系
        const axesHelper = new THREE.AxesHelper(150)
        scene.add(axesHelper)
        // 添加一个辅助网格地面
        const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
        scene.add(gridHelper);
        //创建透视相机
        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        camera.position.set(400, 400, 400)
        camera.lookAt(0, 0, 0)
        scene.add(camera);

        //创建渲染器
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(width, height)
        renderer.render(scene, camera)
        this.$refs.threeContainer.appendChild(renderer.domElement)
        //创建相机控件
        const orbitControls = new OrbitControls(camera, renderer.domElement)
        orbitControls.addEventListener('change', () => {
            //可以重新设置相机的观察坐标
            camera.lookAt(orbitControls.target)
            renderer.render(scene, camera)
        })
        //添加相机控件
        window.onresize = () => {
            console.log('resize')
            let rewidth = document.getElementById("threeContainer").offsetWidth
            let reheight = document.getElementById("threeContainer").offsetHeight
            console.log(rewidth, reheight)
            renderer.setSize(rewidth, reheight)
            camera.aspect = rewidth / reheight
            console.log('camera.aspect', camera.aspect)
            camera.updateProjectionMatrix();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#threeContainer {
    height: calc(100vh - 60px);
    width: calc(100vw-250px);
}
</style>
