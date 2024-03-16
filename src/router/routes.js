import indexView from '@/views/indexView'
import indexView57 from '@/views/顶点UV坐标、纹理贴图/8.火焰序列帧动画'
import indexView61 from '@/views/加载外部三维模型/1.加载.gltf文件(模型加载全流程)'
import indexView64 from '@/views/加载外部三维模型/4.雾化效果'
import indexView65 from '@/views/加载外部三维模型/5.CSS2DReader'
import indexView66 from '@/views/加载外部三维模型/6.CSS3DReader'
import indexView67 from '@/views/加载外部三维模型/7.射线拾取'
import indexView68 from '@/views/加载外部三维模型/8.粮仓失火'
import indexView11 from '@/views/快速入门/1.简单的3D场景'
import indexView12 from '@/views/快速入门/2.三维坐标系'
import indexView13 from '@/views/快速入门/3.光源对物体的影响'
import indexView81 from '@/views/渲染器和前端UI界面/前端按钮与3D交互'
import indexView91 from '@/views/绘制曲线集合体/1.生成圆弧顶点'
import indexView92 from '@/views/绘制曲线集合体/2.自定义集合体顶点赋值'
import indexView93 from '@/views/绘制曲线集合体/3.曲线Curve简介'
import indexView94 from '@/views/绘制曲线集合体/4.圆和椭圆'
import indexView95 from '@/views/绘制曲线集合体/5.样条曲线'
import indexView96 from '@/views/绘制曲线集合体/6.贝塞尔曲线'
import indexView97 from '@/views/绘制曲线集合体/7.贝塞尔曲线样条曲线的应用'
import indexView98 from '@/views/绘制曲线集合体/8.组合曲线'
import indexView99 from '@/views/绘制曲线集合体/9.曲线路径管道'
import indexView910 from '@/views/绘制曲线集合体/10.旋转成型'
import indexView911 from '@/views/绘制曲线集合体/11.填充成型'
import indexView912 from '@/views/绘制曲线集合体/12.拉伸成型'
import indexView913 from '@/views/绘制曲线集合体/13.拉伸扫描成型'
import indexView914 from '@/views/绘制曲线集合体/14.多边形轮廓Shape'
import indexView915 from '@/views/绘制曲线集合体/15.内孔Shape'
import indexView916 from '@/views/绘制曲线集合体/16.几何体边线'
import indexView917 from '@/views/绘制曲线集合体/17.几何体定点颜色'
import indexView918 from '@/views/绘制曲线集合体/18.一段曲线颜色渐变'
import indexView919 from '@/views/绘制曲线集合体/19.修改外部模型订点坐标'
import indexView1001 from '@/views/3D案例/phone'
import indexView1002 from '@/views/3D案例/car'
import indexView1101 from '@/views/相机基础/1.正投影相机'
import indexView1102 from '@/views/相机基础/2.天空盒案例'
import indexView1103 from '@/views/相机基础/3.相机动画'
import indexView1104 from '@/views/相机基础/4.管道漫游'
import indexView1201 from '@/views/光源和阴影/1.聚光源'
import indexView1202 from '@/views/光源和阴影/2.阴影效果'
import indexView1301 from '@/views/精灵模型/1.精灵模型'
import indexView1302 from '@/views/精灵模型/2.下雨场景'
import indexView1401 from '@/views/后处理/1.发光描边'
import indexView1402 from '@/views/后处理/2.自发光通道'
import indexView1403 from '@/views/后处理/3.多通道组合'
import indexView1404 from '@/views/后处理/4.工厂模型应用'
import indexView1501 from '@/views/射线拾取模型/1.射线Ray'
import indexView1502 from '@/views/射线拾取模型/2.射线拾取RayCaster'
import indexView1503 from '@/views/射线拾取模型/3.射线拾取应用'
import HelloWorld from '@/components/HelloWorld'

export const routes = [
    // 在这里定义你的路由
    {
        path: '/',
        name: 'index',
        component: indexView,
        redirect: '/example',
        children: [
            //快速入门
            {
                path: 'example',
                name: 'example',
                //component: require('@/views/快速入门/简单的3D场景').default,
                component: HelloWorld,
                meta: {
                    name: '简单的3D场景'
                }
            },
            {
                path: '1-1',
                name: '1-1',
                //component: require('@/views/快速入门/简单的3D场景').default,
                component: indexView11,
                meta: {
                    name: '简单的3D场景'
                }
            },
            {
                path: '1-2',
                name: '1-2',
                //component: require('@/views/快速入门/简单的3D场景').default,
                component: indexView12,
                meta: {
                    name: '三维坐标系'
                }
            },
            {
                path: '1-3',
                name: '1-3',
                //component: require('@/views/快速入门/简单的3D场景').default,
                component: indexView13,
                meta: {
                    name: '3.光源对物体的影响'
                }
            },
            //几何体BufferGeometry
            {
                path: '2-2',
                name: '2-2',
                component: indexView12,
                //component: require('@/views/快速入门/简单的3D场景').default,
                meta: {
                    name: '几何体BufferGeometry'
                }

            },
            //模型对象、材质
            //层级模型
            //定点UV坐标、纹理贴图
            {
                path: '5-7',
                name: '5-7',
                component: indexView57,
                //component: require('@/views/快速入门/简单的3D场景').default,
                meta: {
                    name: '火焰序列动画'
                }
            },
            //加载外部三维模型
            {
                path: '6-1',
                name: '6-1',
                component: indexView61,
                //component: require('@/views/快速入门/简单的3D场景').default,
                meta: {
                    name: '加载外部三维模型'
                }
            },
            {
                path: '6-4',
                name: '6-4',
                component: indexView64,
                //component: require('@/views/快速入门/简单的3D场景').default,
                meta: {
                    name: '雾化效果'
                }
            },
            {
                path: '6-5',
                name: '6-5',
                component: indexView65,
                //component: require('@/views/快速入门/简单的3D场景').default,
                meta: {
                    name: 'CSS2DReader标注'
                }
            },
            {
                path: '6-6',
                name: '6-6',
                component: indexView66,
                //component: require('@/views/快速入门/简单的3D场景').default,
                meta: {
                    name: 'CSS3DReader标注'
                }
            },
            {
                path: '6-7',
                name: '6-7',
                component: indexView67,
                //component: require('@/views/快速入门/简单的3D场景').default,
                meta: {
                    name: '射线拾取'
                }
            },
            {
                path: '6-8',
                name: '6-8',
                component: indexView68,
                //component: require('@/views/快速入门/简单的3D场景').default,
                meta: {
                    name: '粮仓失火'
                }
            },
            //PBR材质
            //渲染器和前端UI界面
            {
                path: '8-1',
                name: '8-1',
                component: indexView81,
                //component: require('@/views/快速入门/简单的3D场景').default,
                meta: {
                    name: '渲染器和前端UI界面'
                }
            },
            //生成圆弧顶点、矩形
            {
                path: '9-1',
                name: '9-1',
                component: indexView91,
                meta: {
                    name: '1.生成圆弧顶点'
                }
            },
            {
                path: '9-2',
                name: '9-2',
                component: indexView92,
                meta: {
                    name: '2.自定义集合体顶点赋值'
                }
            },
            {
                path: '9-3',
                name: '9-3',
                component: indexView93,
                meta: {
                    name: '3.曲线Curve简介'
                }
            },
            {
                path: '9-4',
                name: '9-4',
                component: indexView94,
                meta: {
                    name: '4.圆和椭圆'
                }
            },
            {
                path: '9-5',
                name: '9-5',
                component: indexView95,
                meta: {
                    name: '5.不规则曲线'
                }
            },
            {
                path: '9-6',
                name: '9-6',
                component: indexView96,
                meta: {
                    name: '6.贝塞尔曲线'
                }
            },
            {
                path: '9-7',
                name: '9-7',
                component: indexView97,
                meta: {
                    name: '7.贝塞尔曲线样条曲线的应用'
                }
            },
            {
                path: '9-8',
                name: '9-8',
                component: indexView98,
                meta: {
                    name: '8.组合曲线'
                }
            },
            {
                path: '9-9',
                name: '9-9',
                component: indexView99,
                meta: {
                    name: '9.曲线路径管道'
                }
            },
            {
                path: '9-10',
                name: '9-10',
                component: indexView910,
                meta: {
                    name: '10.旋转成型'
                }
            },
            {
                path: '9-11',
                name: '9-11',
                component: indexView911,
                meta: {
                    name: '11.填充成型'
                }
            },
            {
                path: '9-12',
                name: '9-12',
                component: indexView912,
                meta: {
                    name: '12.拉伸成型'
                }
            },
            {
                path: '9-13',
                name: '9-13',
                component: indexView913,
                meta: {
                    name: '13.拉伸扫描成型'
                }
            },
            {
                path: '9-14',
                name: '9-14',
                component: indexView914,
                meta: {
                    name: '14.多边形轮廓Shape'
                }
            },
            {
                path: '9-15',
                name: '9-15',
                component: indexView915,
                meta: {
                    name: '15.内孔Shape'
                }
            },
            {
                path: '9-16',
                name: '9-16',
                component: indexView916,
                meta: {
                    name: '16.几何体边线'
                }
            },
            {
                path: '9-17',
                name: '9-17',
                component: indexView917,
                meta: {
                    name: '17.几何体定点颜色'
                }
            },
            {
                path: '9-18',
                name: '9-18',
                component: indexView918,
                meta: {
                    name: '18.一段曲线颜色渐变'
                }
            },
            {
                path: '9-19',
                name: '9-19',
                component: indexView919,
                meta: {
                    name: '19.修改外部模型订点坐标'
                }
            },
            //3D模型展示
            {
                path: '10-1',
                name: '10-1',
                component: indexView1001,
                meta: {
                    name: '华为手机模型展示'
                }
            },
            {
                path: '10-2',
                name: '10-2',
                component: indexView1002,
                meta: {
                    name: '汽车模型'
                }
            },
            //相机基础
            {
                path: '11-1',
                name: '11-1',
                component: indexView1101,
                meta: {
                    name: '正投影相机'
                }
            },
            {

                path: '11-2',
                name: '11-2',
                component: indexView1102,
                meta: {
                    name: '2.河南省地图案例'
                }
            },
            {

                path: '11-3',
                name: '11-3',
                component: indexView1103,
                meta: {
                    name: '3.相机动画'
                }
            },
            {

                path: '11-4',
                name: '11-4',
                component: indexView1104,
                meta: {
                    name: '4.相机动画'
                }
            },
            {

                path: '12-1',
                name: '12-1',
                component: indexView1201,
                meta: {
                    name: '1.聚光灯'
                }
            },
            {

                path: '12-2',
                name: '12-2',
                component: indexView1202,
                meta: {
                    name: '2.阴影效果'
                }
            },
            {

                path: '13-1',
                name: '13-1',
                component: indexView1301,
                meta: {
                    name: '1.精灵模型'
                }
            },
            {

                path: '13-2',
                name: '13-2',
                component: indexView1302,
                meta: {
                    name: '2.下雪场景'
                }
            },
            {

                path: '14-1',
                name: '14-1',
                component: indexView1401,
                meta: {
                    name: '1.发光描边OutLinePass'
                }
            },
            {

                path: '14-2',
                name: '14-2',
                component: indexView1402,
                meta: {
                    name: '2.自发光BloomPass'
                }
            },
            {

                path: '14-3',
                name: '14-3',
                component: indexView1403,
                meta: {
                    name: '3.多通道组合(闪屏+描边)'
                }
            },
            {

                path: '14-4',
                name: '14-4',
                component: indexView1404,
                meta: {
                    name: '3.工厂设备描边效果'
                }
            },
            {

                path: '15-1',
                name: '15-1',
                component: indexView1501,
                meta: {
                    name: '1.射线Ray'
                }
            },
            {

                path: '15-2',
                name: '15-2',
                component: indexView1502,
                meta: {
                    name: '2.射线拾取RayCaster'
                }
            },
            {

                path: '15-3',
                name: '15-3',
                component: indexView1503,
                meta: {
                    name: '3.射线拾取粮仓应用'
                }
            },
        ]
    }
]
