//构建三角形

import * as THREE from 'three'

//定义材质
const meterial = new THREE.MeshBasicMaterial({color: 0xFFFFF, side: THREE.DoubleSide})

//定义空集合体
const bufferGemetry = new THREE.BufferGeometry() 

//记录顶点数据
const vertices = new Float32Array([
            //编写数组顶点坐标数据
            0, 0, 0, //顶点1坐标
            -50, 0, 0, //顶点2坐标
            0, 100, 5, //顶点3坐标
            0, 0, 0, //顶点4坐标
            0, 0, 100, //顶点5坐标
            -50, 0, 5, //顶点6坐标
])

//装载顶点数据
const bufferAttributes = new THREE.BufferAttribute(vertices, 3)

//设置顶点数据
bufferGemetry.attributes.position = bufferAttributes

//创建模型
const mesh = new THREE.Mesh(bufferGemetry, meterial)

//设置矩形的位置
mesh.position.set(0, 0, 0)

export default mesh

