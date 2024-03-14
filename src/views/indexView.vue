<template>
    <el-container class="container">
        <el-container>
            <el-aside width="200px">
                <leftNavBar />
            </el-aside>
            <el-main>
                <el-header>{{ $route.meta.name }}</el-header>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import leftNavBar from '@/components/leftNavBar'
export default {
    components: {
        leftNavBar
    },
    methods: {

    }
}
</script>
<style>
.container {
    height: 100vh;
    width: 100vw;
}

.el-aside {
    background-color: rgb(84, 92, 100);
    width: 250px !important;
    overflow: hidden;
}

.el-aside::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}

.el-main {
    padding: 0 !important;
}

.el-header {
    line-height: 60px;
}

.el-submenu .el-menu li {
    background-color: rgb(67, 74, 80) !important;
}
</style>