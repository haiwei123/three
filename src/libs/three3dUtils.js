
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * 创建场景
 * @param {*} axesHelper 是否创建三维坐标系
 * @returns 
 */
export const createScence = (axesHelper = true, light = true) => {
    const scene = new THREE.Scene()
    if (axesHelper) {
        scene.add(new THREE.AxesHelper(100))
    }
    if (light) {
        scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    }
    console.log('----创建场景')
    return scene;
}


/**
 * 创建相机
 * @param {*} width 
 * @param {*} height 
 * @param {*} pos 
 * @returns 
 */
export const createCamera = (width, height, pos) => {
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
    if (pos) {
        pos && camera.position.copy(pos)
    } else {
        camera.position.set(500, 500, 500)
    }
    camera.aspect = width / height
    camera.lookAt(0, 0, 0)
    console.log('----创建相机')
    return camera;
}

/**
 * 创建渲染器
 * @returns WEBGlRender
 */
export const createRenderer = (scene, camera, color, eleId) => {
    const swidth = document.getElementById("threeContainer").offsetWidth
    const sheight = document.getElementById("threeContainer").offsetHeight
    const render = new THREE.WebGLRenderer({ antialias: true })
    render.setSize(swidth, sheight)
    render.outputEncoding = THREE.sRGBEncoding //设置输出编码格式
    render.render(scene, camera)
    color && this.renderer.setClearColor(color, 0.8)
    console.log('----创建渲染器')
    return render
}

/**
 * 循环渲染
 * @param {*} camera 
 * @param {*} scene 
 * @param {*} renderer 
 * @param {*} css2drenderer 
 * @param {*} css3drenderer 
 */
export const three3DRender = (camera, scene, renderer, css2drenderer, css3drenderer) => {
    function render() {
        renderer && renderer.render(scene, camera)
        css2drenderer && css2drenderer.render(scene, camera)
        css3drenderer && css3drenderer.render(scene, camera)
        requestAnimationFrame(render)
    }
    render()
}


/**
 * 窗口变动处理
 * @param {*} renderer 
 * @param {*} camera 
 */
export const windowResize = (renderer, camera) => {
    window.onresize = () => {
        const swidth = document.getElementById("threeContainer").offsetWidth
        const sheight = document.getElementById("threeContainer").offsetHeight
        console.log('window.resize')
        renderer.setSize(swidth, sheight)
        camera.aspect = swidth / sheight
        camera.updateProjectionMatrix()
    }
}

/**
 * 插入相机控制插件
 * @param {*} scene 
 * @param {*} camera 
 * @param {*} renderer 
 * @param {*} css2dRenderer 
 * @param {*} css3dRenderer 
 * @returns 
 */
export const insertOrbitControls = (scene, camera, renderer, css2dRenderer, css3dRenderer) => {
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    //可以设置相机控件放大缩小限制
    orbitControls.addEventListener('change', () => {
        camera.lookAt(orbitControls.target)
        renderer.render(scene, camera)
        css2dRenderer && css2dRenderer.render(scene, camera)
        css3dRenderer && css3dRenderer.render(scene, camera)
    })
    return orbitControls
}

/**
 * 动画渲染
 * @param {*} scene 
 * @param {*} camera 
 * @param {*} renderer 
 */
export const animationRender = (scene, camera, renderer, stat) => {
    let animation = null
    function render() {
        stat.update()
        renderer.render(scene, camera)
        animation = requestAnimationFrame(render)
    }
    render()
    return animation
}