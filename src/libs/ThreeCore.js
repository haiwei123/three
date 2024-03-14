import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

class ThreeCore {

    //构造方法
    constructor(domId) {
        this.domId = domId
        this.gui = null
        this.scene = null
        this.camera = null
        this.renderer = null
        this.orbitControls = null
        this.css3dRenderer = null
        this.css2drenderer = null
    }

    init3D() {
        this.gui = new GUI()
        console.log(document.getElementById(this.domId))
        this.createScence()
        // //创建相机
        console.log('camera', this.camera)
        this.createCamera()
        //设置场景的环境贴图
        const clubTexture = new THREE.CubeTextureLoader().setPath('/modal/car/envMap/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
        clubTexture.encoding = THREE.sRGBEncoding
        this.scene.environment = clubTexture
        //创建渲染器
        console.log('renderer', this.renderer)
        this.createRenderer()
        this.render()
        document.getElementById(this.domId).appendChild(this.renderer.domElement)
        //创建相机控件
        insertOrbitControls(scene, camera, renderer)
        //场口变化
        windowResize(renderer, camera)
        this.addLight()
        //动画渲染
        animationRender(scene, camera, renderer)

    }
    render() {
        this.renderer && this.renderer.render(this.scene, this.camera)
    }
    addModal() {
    }
    /**
     * 创建场景
     * @param {*} axesHelper 是否创建三维坐标系
     * @returns 
     */
    createScence(axesHelper = true, light = true) {
        this.scene = new THREE.Scene()
        if (axesHelper) {
            this.scene.add(new THREE.AxesHelper(100))
        }
        if (light) {
            this.scene.add(new THREE.AmbientLight(0xffffff, 0.9));
        }
        console.log('----创建场景')
    }


    /**
     * 创建相机
     * @param {*} width 
     * @param {*} height 
     * @param {*} pos 
     * @returns 
     */
    createCamera(pos) {
        const swidth = document.getElementById(this.domId).offsetWidth
        const sheight = document.getElementById(this.domId).offsetHeight
        this.camera = new THREE.PerspectiveCamera(45, swidth / sheight, 1, 10000)
        if (pos) {
            pos && this.camera.position.copy(pos)
        } else {
            this.camera.position.set(500, 500, 500)
        }
        this.camera.aspect = swidth / sheight
        this.camera.lookAt(0, 0, 0)
        this.scene.add(this.camera)
        console.log('----创建相机')
    }

    /**
     * 创建渲染器
     * @returns WEBGlRender
     */
    createRenderer(color) {
        const swidth = document.getElementById(this.domId).offsetWidth
        const sheight = document.getElementById(this.domId).offsetHeight
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(swidth, sheight)
        this.renderer.outputEncoding = THREE.sRGBEncoding //设置输出编码格式
        this.renderer.render(this.scene, this.camera)
        color && this.renderer.setClearColor(color, 0.8)
        console.log('----创建渲染器')
    }

    /**
     * 循环渲染
     * @param {*} camera 
     * @param {*} scene 
     * @param {*} renderer 
     * @param {*} css2drenderer 
     * @param {*} css3drenderer 
     */
    three3DRender() {
        function render() {
            this.renderer && this.renderer.render(this.scene, this.camera)
            this.css2drenderer && this.css2drenderer.render(this.scene, this.camera)
            this.css3drenderer && this.css3drenderer.render(this.scene, this.camera)
            requestAnimationFrame(render)
        }
        render()
    }


    /**
     * 窗口变动处理
     * @param {*} renderer 
     * @param {*} camera 
     */
    windowResize(renderer, camera) {
        window.onresize = () => {
            const swidth = document.getElementById(this.domId).offsetWidth
            const sheight = document.getElementById(this.domId).offsetHeight
            console.log('window.resize')
            this.renderer.setSize(swidth, sheight)
            this.camera.aspect = swidth / sheight
            this.camera.updateProjectionMatrix()
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
    insertOrbitControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
        //可以设置相机控件放大缩小限制
        this.orbitControls.addEventListener('change', () => {
            this.camera.lookAt(this.orbitControls.target)
            this.renderer.render(this.scene, this.camera)
            this.css2dRenderer && this.css2dRenderer.render(this.scene, this.camera)
            this.css3dRenderer && this.css3dRenderer.render(this.scene, this.camera)
        })
    }

    /**
     * 动画渲染
     */
    animationRender() {
        let animation = null
        function render() {
            renderer.render(this.scene, this.camera)
            animation = requestAnimationFrame(render)
        }
        render()
        return animation
    }
}

export default ThreeCore;