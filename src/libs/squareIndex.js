//两个三角形拼成一个正方形(去除重复顶点)

import * as THREE from 'three'

//基础网格材质
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFF, side: THREE.DoubleSide });

//定义空立方体 
const bufferGemetry = new THREE.BufferGeometry();

//定义类型数组记录集合体顶点(定义顶点)
const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    80, 0, 0, //顶点2坐标
    80, 80, 0, //顶点3坐标
    0, 80, 0, //顶点4坐标
])

const normals = new Float32Array([
    0, 0, 1, //顶点1法线( 法向量 )
    0, 0, 1, //顶点2法线
    0, 0, 1, //顶点3法线
    0, 0, 1, //顶点4法线
]);


//类型化顶点数据
const indexs = new Uint16Array([0, 1, 2, 0, 2, 3])
const indexsAttributes = new THREE.BufferAttribute(indexs, 1)

const attributes = new THREE.BufferAttribute(vertices, 3)
bufferGemetry.attributes.position = attributes
bufferGemetry.index = indexsAttributes //记录重复顶点
bufferGemetry.attributes.normal = new THREE.BufferAttribute(normals, 3); // 设置几何体的顶点法线属性.attributes.normal

const mesh = new THREE.Mesh(bufferGemetry, basicMaterial)
mesh.position.set(-300, 0, 0)

export default mesh

