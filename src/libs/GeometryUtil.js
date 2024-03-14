import * as THREE from 'three'

//批量创建并插入几何模型
export const batchInsertBoxGetmetry = (meshFolders, scence) => {
  //定义网络基础材质（该材质不受光照影响）
  const basicMaterial = new THREE.MeshBasicMaterial(
    {
      color: 0xFFFA500, //颜色
      transparent: true,//开启透明
      opacity: 0.8,//设置透明度
    }
  )

  //添加GUI
  meshFolders.addColor(basicMaterial, 'color').name('模型颜色')
  meshFolders.add(basicMaterial, 'opacity', 0, 1).name('模型透明度')
  //定义几何模型
  const geometry = new THREE.BoxGeometry(50, 50, 50)
  //X轴添加几何模型
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      const mesh = new THREE.Mesh(geometry, basicMaterial)
      mesh.position.set(80 * i + 100 + 50, 40, 100 * j + 50)
      scence.add(mesh)
    }
  }
}

//创建几何体并查看每个面的分段
export const insertViewBlock = (scene, gui) => {
  const geometryGui = gui.addFolder('分段立方体')
  const material = new THREE.MeshBasicMaterial({
    color: 0XFF0000,
    wireframe: true,//线条模式渲染mesh对应的三角形数据
  });
  //设置颜色都西昂
  const color = new THREE.Color()
  color.set('#ff5256')
  material.color = color
  //material.transparent = true
  //material.opacity = 0.1


  //创建一个平面矩形
  const planeGeometry = new THREE.PlaneGeometry(100, 100, 2, 2)
  //创建物体
  const mesh = new THREE.Mesh(planeGeometry, material)
  mesh.position.set(-50, 50, 200)
  //立方体
  let boxOptions = { width: 100, height: 100, depth: 100 }
  geometryGui.add(boxOptions, 'width', 2, 100).name('立方体宽')
  geometryGui.add(boxOptions, 'height', 2, 100).name('立方体高')
  const box = new THREE.BoxGeometry(boxOptions.width, boxOptions.height, boxOptions.depth)
  const boxMesh = new THREE.Mesh(box, material)
  boxMesh.position.set(-50, 50, 350)
  //定义向量对象 X轴翻转
  const vectory1 = new THREE.Vector3() //默认不定义就是原点 0，0，0
  vectory1.set(50, 50, 0)
  boxMesh.rotateOnAxis(vectory1, Math.PI / 360)
  //球体
  let sphereOptions = { radius: 60, widthSegments: 1000, heightSegments: 1000 }
  geometryGui.add(sphereOptions, 'widthSegments', 2, 100).name('球体水平分段')
  geometryGui.add(sphereOptions, 'heightSegments', 2, 100).name('球体垂直分段')
  const sphere = new THREE.SphereGeometry(sphereOptions.radius, sphereOptions.widthSegments, sphereOptions.heightSegments)
  const sphereMesh = new THREE.Mesh(sphere, material)


  sphereMesh.position.set(-50, 50, 500)
  sphereMesh.translateX(100)
  //使用三维向量去定义立方的值
  const vectory = new THREE.Vector3() //默认不定义就是原点 0，0，0
  vectory.set(50, 50, 0)
  vectory.normalize()
  //沿着某一个固定方向平移
  sphereMesh.translateOnAxis(vectory, 100)

  scene.add(mesh)
  scene.add(boxMesh)
  scene.add(sphereMesh)

}

//物体的世界坐标和本地坐标
export const workPostion = () => {
  const loader = new THREE.TextureLoader()
  const texture = loader.load(require('../assets/ztt.jpg'))
  const uv = new Float32Array([
    0.6, 0.1,
    0.8, 0.1,
    0.8, 0.5,
    0.6, 0.6
  ])
  const material = new THREE.MeshBasicMaterial()
  material.map = texture
  //material.color.set("#4e6ef2")

  const geometry = new THREE.BoxGeometry(100, 100, 100)
  geometry.attributes.uv = new THREE.BufferAttribute(uv, 2)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(-150, 40, 150)
  //mesh的position是物体的本地坐标
  const group = new THREE.Group()
  group.add(mesh)
  //这个是mesh的世界坐标 本地坐标 + group的坐标
  group.position.set(-150, 40, 150)
  //使用verty可以直接获取物体的世界坐标
  //const v3 = new THREE.Vector3()
  //const position = mesh.getWorldPosition(v3)

  return group
}

//创建一个由原型平面构成的圆形贴图
export const CircleGeometryWithImage = () => {
  const material = new THREE.MeshBasicMaterial(); //创建材质
  material.side = THREE.DoubleSide
  const texture = new THREE.TextureLoader() //创建贴图
  const textureImage = texture.load(require('../assets/dz.jpg'))
  textureImage.wrapS = THREE.RepeatWrapping;
  textureImage.wrapT = THREE.RepeatWrapping;
  textureImage.repeat.set(10, 10) //允许阵列多少个
  material.map = textureImage//设置材质的贴图

  const circleGeometry = new THREE.CircleGeometry(80) //创建圆形平面
  const mesh = new THREE.Mesh(circleGeometry, material) //创建模型
  mesh.position.set(-300, 80, 500)
  return mesh
}

//构建一个透明的贴纸
export const transpotImgGeometry = () => {
  const material = new THREE.MeshBasicMaterial(); //创建材质
  material.side = THREE.DoubleSide
  material.transparent = true
  const texture = new THREE.TextureLoader() //创建贴图
  const textureImage = texture.load(require('../assets/321.png'))

  material.map = textureImage//设置材质的贴图

  const circleGeometry = new THREE.CircleGeometry(80) //创建圆形平面
  const mesh = new THREE.Mesh(circleGeometry, material) //创建模型
  mesh.position.set(-400, 80, 600)
  return mesh
}

//创建一个整列动画贴图
export const UVDHPlaneGeomtry = () => {
  const planeGeometry = new THREE.PlaneGeometry(200, 50)
  const texture = new THREE.TextureLoader()
  const textureImage = texture.load(require('../assets/southeast.png'))
  textureImage.wrapS = THREE.RepeatWrapping;//对应offste.x偏移
  const material = new THREE.MeshBasicMaterial({ map: textureImage })
  const mesh = new THREE.Mesh(planeGeometry, material)
  mesh.position.set(-400, 80, 700)

  return { mesh: mesh, texture: textureImage }
}