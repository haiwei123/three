<template>
  <div class="progress-bar">
    <div class="progressContainer">
        <template v-for="item in getSize">
            <div class="progress" ></div>
        </template>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        progres: 0
    },
    computed: {
        getSize: function() {
            return this.progres / 2
        }
    }
};
</script>

<style>
.progress-bar {
    width: 100%;
    height: 100%;
    background-color: #000;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.progressContainer {
    height: 50px;
    width: 13%;
    border: 3px solid #2fc5ee;
    border-radius: 2px;
    position: relative;
        padding: 2px;
            display: flex;
}
.progressContainer::after {
    content: '.';
    height: 25px;
    width: 4px;
    background-color: #2fc5ee;
    position: absolute;
    right: -4%;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    top: 50%;
    transform: translate(0, -55%);
}
.progress {
    width: 1.5%;
    background-color: #2fc5ee;
    height: 100%;
    margin-left: 1px;
    margin-right: 1px;
}
</style>