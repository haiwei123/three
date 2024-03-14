//两个三角形拼成一个正方形

import * as THREE from 'three'

//基础网格材质
const basicMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFF, side: THREE.DoubleSide});

//定义空立方体 
const bufferGemetry = new THREE.BufferGeometry();

//定义类型数组记录集合体顶点(定义顶点)
const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    80, 0, 0, //顶点2坐标
    80, 80, 0, //顶点3坐标

    0, 0, 0, //顶点4坐标   和顶点1位置相同
    80, 80, 0, //顶点5坐标  和顶点3位置相同
    0, 80, 0, //顶点6坐标

])

const attributes = new THREE.BufferAttribute(vertices, 3)
bufferGemetry.attributes.position = attributes

const mesh = new THREE.Mesh(bufferGemetry, basicMaterial)
mesh.position.set(-200, 0, 0)

export default mesh

