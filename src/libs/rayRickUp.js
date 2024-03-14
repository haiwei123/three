//射线拾取

import * as THREE from 'three'
var choseMesh = null
var granaryArr = []
/**
 * 射线拾取思路
 * 1.获取点击屏幕坐标
 * 2.转化为WebGL标准坐标
 * 3.创建射线投射器
 * 4.计算射线属性
 * 5.获取点击坐标位于射线中内的模型
 * @param {*} event 
 * @param {*} camera 
 */
export const chose = (event, camera) => {
    if (choseMesh) {
        choseMesh.material.color.set(0xffffff)
    }
    //获取鼠标点击相对坐标
    var dx = event.clientX; //鼠标点击位置横坐标
    var dy = event.clientY; //鼠标点击位置纵坐标
    //转化为WebGL标准坐标
    var x = (dx / window.innerWidth) * 2 - 1; //WebGL标准设备横坐标
    var y = -(dx / window.innerHeight) * 2 + 1; //WebGL标准设备纵坐标
    //创建射线投射器
    var raycaster = new THREE.Raycaster()
    //通过鼠标点击位置标准设备坐标和相机参数计算射线投射器的射线属性.ray
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
    //返回intersctObjects()中选取的网格模型
    var interscts = raycaster.intersectObjects(granaryArr)
    if (interscts.length > 0) {
        choseMesh = interscts[0].object;
        choseMesh.material.color.set(0x00ffff)
    }
    addEventListener('click', choose); // 监听窗口鼠标单击事件,鼠标单击选中某个国家Mesh
}
