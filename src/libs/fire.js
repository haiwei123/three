import * as THREE from 'three'
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';


//创建火焰
export const createFire = (meshPos) => {
    let index = 0
    let texture = null
    const num = 15
    let animation = null
    const vector3 = new THREE.Vector3()
    meshPos.getWorldPosition(vector3)

    //创建矩形平面
    const planeGeometry = new THREE.PlaneGeometry(20, 30)
    texture = new THREE.TextureLoader().load(require('../assets/火焰.png'))
    texture.repeat.set(1 / 15, 1);//注意选择合适的阵列数量
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture, transparent: true, depthWrite: false, })
    const mesh = new THREE.Mesh(planeGeometry, material)
    mesh.position.copy(vector3)
    mesh.position.y += 40
    //创建火焰标签
    const div = document.createElement('div')
    div.innerText = meshPos.name + '着火啦！！！！'
    div.style.color = 'red'
    const object2d = new CSS2DObject(div)

    mesh.add(object2d)
    object2d.position.y += 20
    mesh.tag = object2d

    let fireGroup = new THREE.Group()
    //fireGroup.add(object2d)
    //fireGroup.add(mesh)
    fireGroup.add(mesh, mesh.clone().rotateY(Math.PI / 4), mesh.clone().rotateY(Math.PI / 2), mesh.clone().rotateY(Math.PI / 4 * 3),)
    function goFire() {
        index += 0.15
        if (index > num) {
            index = 0
        }
        texture.offset.x = Math.floor(index) / num;//注意选择合适的阵列数量 Math.floor 转整数获取正确帧
        animation = requestAnimationFrame(goFire);//请求再次执行函数render
    }
    fireGroup.stop = function () {
        window.cancelAnimationFrame(animation)
    }

    goFire()
    return fireGroup
}
