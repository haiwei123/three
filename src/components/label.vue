<template>
    <div class="label" id="label">
        {{ name }}
    </div>
</template>
<script>
export default {
    props: {
        name: ''
    }
}
</script>
<style>
.label {
    padding: 2px;
    padding-left: 5px;
    padding-right: 5px;
    border: 2px solid #000;
    position: absolute;
    left: 0;
    top: 0;
    color: greenyellow;
}
</style>