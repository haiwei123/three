import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'
const path = require('path');

//导入3D模型
export const import3DModal = (scence) => {
    const loader = new GLTFLoader()
    loader.load("/modal/human/LeePerrySmith.glb", (gltf) => {
        let LeePerrySmith = gltf.scene.getObjectByName("LeePerrySmith") //获取人像模型
        console.log(LeePerrySmith)
        LeePerrySmith.scale.set(30, 30, 30)
        //LeePerrySmith.material.color.set(0xff0000);
        LeePerrySmith.position.set(-550, 120, 300)
        scence.add(gltf.scene)
    })
}

//会转动的地球模型
export const earthModal = () => {
    const sphere = new THREE.SphereGeometry(60)
    const texture = new THREE.TextureLoader().load(require('../assets/earth.jpg'))
    texture.encoding = THREE.LinearEncoding //默认编码
    console.log('texture.encoding', texture.encoding)
    texture.encoding = THREE.sRGBEncoding //默认编码
    const material = new THREE.MeshBasicMaterial({ map: texture })
    const mesh = new THREE.Mesh(sphere, material)
    mesh.position.set(-650, 120, 600)
    return mesh
}

//更换模型的贴纸材质
export const phoneModal = (scence) => {
    const loader = new GLTFLoader()
    loader.load("/modal/phone/phone.glb", (gltf) => {
        const mesh = gltf.scene.getObjectByName('手机')
        mesh.position.set(-200, 100, 700)
        const texture = new THREE.TextureLoader().load(require('../../public/modal/phone/黑色.png'))
        texture.encoding = THREE.sRGBEncoding
        //翻转贴纸
        texture.flipY = false
        mesh.material.map = texture
        scence.add(gltf.scene)
    })
}

//机器零件模型（金属度和粗糙度）
export const macheModal = (scence) => {
    //加载环境贴图

    const load = new GLTFLoader()
    const pointLight = new THREE.PointLight(0x404040, 1.0)
    pointLight.position.set(400, 300, -400);
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
    scence.add(pointLight);
    scence.add(pointLightHelper);
    load.load("/modal/metal/金属.glb", (gltf) => {
        gltf.scene.traverse((obj) => {
            if (obj.isMesh) { //判断是否是网格模型
                obj.material.metalness = 1.0
                obj.material.roughness = 0.5
                //obj.material.envMap = textureCube
                obj.scale.set(8, 8, 8)
                obj.rotateX(1.5);
                obj.position.set(400, 100, -200)
                scence.add(obj)
            }
        })
    })
}

//物理材质 青漆层
export const physicalMaterial = (scence, gui) => {
    const textureCube = new THREE.CubeTextureLoader().setPath('/metal/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    const carFolder = gui.addFolder('轿车');
    const gltf = new GLTFLoader()
    const catOptions = {
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,//透明涂层表面的粗糙度
        envMap: textureCube, //环境贴图
        envMapIntensity: 2.0, //环境程度影响程度
        metalness: 1.0, //金属度
        roughness: 1.0, //粗糙度
        color: ''
    }

    //加载第三方模型
    gltf.load('/modal/car/轿车.glb', (gltf) => {
        console.log('gltf.scene', gltf.scene)
        const mesh = gltf.scene.getObjectByName('外壳01');
        catOptions.color = mesh.material.color
        mesh.material = new THREE.MeshPhysicalMaterial({
            clearcoat: catOptions.clearcoat,
            clearcoatRoughness: catOptions.clearcoatRoughness,//透明涂层表面的粗糙度
            envMap: textureCube, //环境贴图
            envMapIntensity: catOptions.envMapIntensity, //环境程度影响程度
            metalness: catOptions.metalness, //金属度
            roughness: catOptions.roughness, //粗糙度
            color: catOptions.color
        })
        carFolder.add(mesh.material, 'metalness', 0, 1).name('金属度')
        carFolder.add(mesh.material, 'roughness', 0, 1).name('粗糙度')
        carFolder.addColor(mesh.material, 'color').name('材质颜色')
        carFolder.add(mesh.material, 'envMapIntensity', 0, 1).name('环境贴图影响')
        carFolder.add(mesh.material, 'clearcoat', 0, 1).name('清漆层')
        carFolder.add(mesh.material, 'clearcoatRoughness', 0, 1).name('清漆层粗糙度')
        //玻璃
        const meshBl = gltf.scene.getObjectByName('玻璃01');
        meshBl.material = new THREE.MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0,
            transmission: 0.5,
            ior: 1.5,
            envMap: textureCube, //环境贴图
            envMapIntensity: catOptions.envMapIntensity, //环境程度影响程度
        })
        carFolder.add(meshBl.material, 'metalness', 0, 1).name('玻璃金属度')
        carFolder.add(meshBl.material, 'roughness', 0, 1).name('玻璃粗糙度')
        carFolder.add(meshBl.material, 'transmission', 0, 1).name('透光率')
        carFolder.add(meshBl.material, 'ior', 0, 1).name('折射率')

        scence.add(gltf.scene)
    })
}

//物理模型
export const physicalTranAndIor = () => {

}