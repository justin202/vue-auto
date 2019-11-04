<template>
<div class="hello">
    <h1>{{ msg }}</h1>
    <md-card id="phaser">
    </md-card>
</div>
</template>

<script>
import Phaser from 'phaser'
import T1 from '@/scenes/T1'
import T2 from '@/scenes/T2'

export default {
    name: 'HelloWorld',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
        }
    },
    mounted() {
        // 配置信息
        const config = {
            parent: 'phaser',
            // 渲染类型
            type: Phaser.CANVAS,
            // 界面宽度，单位像素
            width: 750,
            // 界面高度
            height: 1334,
            // 背景色
            backgroundColor: 0x444444,
            // 渲染器
            renderer: Phaser.CANVAS,
        };
        // 场景
        let t1 = new T1(config.width, config.height)
        config.scene = [t1]

        let game = new Phaser.Game(config);

    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
</style>
