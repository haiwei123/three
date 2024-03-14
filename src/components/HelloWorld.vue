<template>
  <div id="threeContainer">

  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import triangle from '@/libs/Triangle' //导入两个三角形
import square from '@/libs/square' //导入正方形
import squareIndex from '@/libs/squareIndex'
import { insertViewBlock, workPostion, CircleGeometryWithImage, transpotImgGeometry, UVDHPlaneGeomtry } from '@/libs/GeometryUtil'
import { import3DModal, earthModal, phoneModal, macheModal, physicalMaterial } from '@/libs/ModalUtils'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      scence: null, //场景
      axesHelper: null, //三维坐标系
      boxGeometry: null, //立方体
      meshbasicMaterial: null, //基础网络材质
      boxMesh: null,
      camera: null, //相机
      renderer: null, //渲染器
      orbitControls: null,
      gui: null,
      meshFolders: null,
      obj: {
        rotate: true
      },
      texture: null,
      earch: null
    }
  },
  methods: {
    //初始化THREE
    initScence: function () {
      //创建一个基础基础网络材质
      this.meshbasicMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,//0xff0000设置材质颜色为红色
        side: THREE.DoubleSide, //两面可见
      })

      //创建环境光 否则导入的模型不可见
      const light = new THREE.AmbientLight(0x404040); // 柔和的白光
      this.scence.add(light);

      //创建一个平面用来承载所有X+~Z+的集合体
      const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1000)
      const placeMesh = new THREE.Mesh(planeGeometry, this.meshbasicMaterial)
      placeMesh.position.set(550, 0, 520)
      placeMesh.rotateX(-1.57)
      this.scence.add(placeMesh)
      //创建一个平面来承载Z-~X+的集合体
      const planeGeometry1 = new THREE.PlaneGeometry(1000, 1000, 1000)
      const placeMesh1 = new THREE.Mesh(planeGeometry1, this.meshbasicMaterial)
      placeMesh1.position.set(550, 0, -520)
      placeMesh1.rotateX(-1.57)
      //给平面进行贴图
      const texture = new THREE.TextureLoader()
      const imageTexture = texture.load(require('../assets/cd.jpg'))

      this.meshbasicMaterial.map = imageTexture

      this.scence.add(placeMesh1)
      //创建一个平面来承载Z-~X+的集合体
      const planeGeometry2 = new THREE.PlaneGeometry(1000, 1000, 1000)
      const placeMesh2 = new THREE.Mesh(planeGeometry2, this.meshbasicMaterial)
      placeMesh2.position.set(-550, 0, -520)
      placeMesh2.rotateX(-1.57)
      this.scence.add(placeMesh2)
      //创建一个平面来承载Z-~X+的集合体
      const planeGeometry3 = new THREE.PlaneGeometry(1000, 1000, 1000)
      const placeMesh3 = new THREE.Mesh(planeGeometry3, this.meshbasicMaterial)
      placeMesh3.position.set(-550, 0, 520)
      placeMesh3.rotateX(-1.57)
      this.scence.add(placeMesh3)

      //创建一个几何体100, 100,100
      this.boxGeometry = new THREE.BoxGeometry(50, 50, 50)

      //创建一个基础基础网络材质
      this.meshbasicMaterial = new THREE.MeshBasicMaterial({
        color: 0XFF00FF,//0xff0000设置材质颜色为红色
      })
      this.gui.addColor(this.meshbasicMaterial, 'color').name('旋转模型颜色')
      //创建模型对象
      this.boxMesh = new THREE.Mesh(this.boxGeometry, this.meshbasicMaterial)
      //设置模型在三维坐标中的位置
      this.boxMesh.position.set(60, 45, 0)
      //将模型放入场景
      this.scence.add(this.boxMesh)
      //批量创建几何体
      //this.batchInsertBoxGetmetry()
      //插入带有分段的立方体
      insertViewBlock(this.scence, this.gui)
      //插入一个带有地球贴纸的球形
      this.earch = earthModal()
      //
      this.scence.add(this.earch)
      //导入手机模型
      phoneModal(this.scence)
      //导入金属模型
      macheModal(this.scence)
      //导入汽车模型
      physicalMaterial(this.scence, this.gui)
      //区分本地坐标和世界坐标
      //this.scence.add(workPostion())
      //this.scence.add(CircleGeometryWithImage())
      //this.scence.add(transpotImgGeometry())
      //let map = UVDHPlaneGeomtry()
      //this.texture = map.texture
      //this.scence.add(map.mesh)
      //添加三角形
      //this.scence.add(triangle)
      //导入自定义模型
      //import3DModal(this.scence)
      //添加正方形 
      //this.scence.add(square)
      //添加去掉重合顶点的正方形
      //this.scence.add(squareIndex)
      //创建自定义集合体
      //创建相机 透视相机（视角，画幅，近裁，远裁）
      this.camera = new THREE.PerspectiveCamera(30, this.windowWidth / this.windowHeight, 5, 8000)
      //创建相机的拍摄尺寸
      //设置相机位置
      this.camera.position.set(-504, 667, 1795)
      //设置相机的拍摄位置
      this.camera.lookAt(0, 0, 0)
      //创建渲染器5
      this.renderer = new THREE.WebGLRenderer({
        antialias: true //抗锯齿设置
      })
      //设置渲染器的渲染尺寸
      this.renderer.setSize(this.windowWidth, this.windowHeight)
      this.renderer.render(this.scence, this.camera)
      this.renderer.outputEncoding = THREE.sRGBEncoding //设置编码格式
      //添加相机控制空间
      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
      this.orbitControls.addEventListener('change', () => {
        //可以重新设置相机的观察坐标
        this.camera.lookAt(this.orbitControls.target)
        this.renderer.render(this.scence, this.camera)
        //this.orbitControls.update()
      })
      document.getElementById("threeContainer").appendChild(this.renderer.domElement)
      //浏览器窗口发生变化重新进行渲染
      window.onresize = () => {
        this.renderer.setSize(this.windowWidth, this.windowHeight)
        this.camera.aspect = this.windowWidth / this.windowHeight
        this.camera.updateProjectionMatrix()
      }
      this.renderFun()
    },
    //批量创建并插入几何模型
    batchInsertBoxGetmetry: function () {
      //定义网络基础材质（该材质不受光照影响）
      const basicMaterial = new THREE.MeshBasicMaterial(
        {
          color: 0xFFFA500, //颜色
          transparent: true,//开启透明
          opacity: 0.8,//设置透明度
        }
      )
      //添加GUI
      this.meshFolders.addColor(basicMaterial, 'color').name('模型颜色')
      this.meshFolders.add(basicMaterial, 'opacity', 0, 1).name('模型透明度')
      //this.mesgFolders.add(this.obj, 'rotate').name('旋转动画')
      //定义几何模型
      const geometry = new THREE.BoxGeometry(50, 50, 50)
      //创建组对象
      const group = new THREE.Group()
      this.gui.add(group.position, 'y', 0, 500)
      //X轴添加几何模型
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
          const mesh = new THREE.Mesh(geometry, basicMaterial)
          mesh.name = i + '' + j + 'geo'
          mesh.position.set(80 * i + 100 + 50, 40, 100 * j + 50)
          group.add(mesh)
        }
      }
      //查询第二排第三个的Mesh 并改变他的颜色
      const meshgeo = group.getObjectByName('23geo')
      console.log('23geo:', meshgeo)
      meshgeo.position.y = 300
      console.log('23geo:', meshgeo)
      console.log(`group.children`, group.children)
      this.scence.add(group)
    },
    //构建自定义集合体
    initEmptyGeometry() {
      //创建空的集合体对象
      const bufferGeometry = new THREE.BufferGeometry()

      //标记集合体的顶点数据
      const vertices = new Float32Array([
        //编写数组顶点坐标数据
        0, 0, 0, //顶点1坐标
        -50, 0, 0, //顶点2坐标
        0, 100, 0, //顶点3坐标
        0, 0, 10, //顶点4坐标
        0, 0, 100, //顶点5坐标
        -50, 0, 10, //顶点6坐标
      ])

      //使用属性缓冲缓冲对象存储顶点数据，THREEjs 强制要求的，可以更好的向GPU传递
      const attributes = new THREE.BufferAttribute(vertices, 3)

      //设置空集合体的位置数据
      bufferGeometry.attributes.position = attributes

      //创建点材质（特有材质）
      const pointMaterial = new THREE.PointsMaterial({ color: 0xffff00, size: 10.0 })

      //创建点模型
      const pointMesh = new THREE.Points(bufferGeometry, pointMaterial)

      this.scence.add(pointMesh)

    },
    renderFun: function () {
      //打印相机观察的坐标
      //console.log('target:', this.orbitControls.target)
      //打印相机在三维坐标中的位置
      //console.log('position:', this.camera.position)
      this.texture && (this.texture.offset.x += 0.02)
      this.renderer.render(this.scence, this.camera)
      this.earch != null && this.earch.rotateY(0.02)
      if (this.obj.rotate) this.boxMesh.rotateY(0.01)
      requestAnimationFrame(this.renderFun)
    }
  },
  mounted() {
    //初始化三维场景
    this.scence = new THREE.Scene()
    //实例化GUI对象
    this.gui = new GUI()
    this.meshFolders = this.gui.addFolder('几何模型')
    this.meshFolders.close()
    //给场景添加三维坐标系
    this.axesHelper = new THREE.AxesHelper(250)
    this.scence.add(this.axesHelper)
    this.initScence()
    //给环境设置贴纸会影响所有的模型
    const textureCube = new THREE.CubeTextureLoader().setPath('/metal/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    this.scence.environment = textureCube
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#threeContainer {
  height: 100vh;
  width: 100vw;
}
</style>
