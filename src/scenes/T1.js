// 全局游戏设置
const gameOptions = {
    // 角速度，每帧多少度
    rotationSpeed: 3,
    // 投掷飞刀的时间，单位毫秒
    throwSpeed: 150,
    // 两刀间最小间隔角度
    minAngle: 15
}

// 场景
export default class T1 extends Phaser.Scene {

    // 构造器
    constructor(width, height) {
        super('T1')
        this.width = width
        this.height = height
    }

    // 预加载资源
    preload() {
        // 加载图片
        this.load.image('target', require('@/assets/target.png'))
        this.load.image('knife', require('@/assets/knife.png'))
    }

    // 场景创建时执行
    create() {
        this.canThrow = true
        this.knifeGroup = this.add.group()

        this.knife = this.add.image(this.width / 2, this.height / 5 * 4, 'knife')
        this.target = this.add.image(this.width / 2, 400, 'target')

        this.input.on('pointerdown', this.throwKnife, this)
    }

    update() {
        // 旋转
        this.target.angle += gameOptions.rotationSpeed
            // 获取圆木上的飞刀数组
        const children = this.knifeGroup.getChildren()
            // 遍历飞刀数组
        for (let i = 0; i < children.length; i++) {
            // 旋转每个飞刀
            children[i].angle += gameOptions.rotationSpeed
                // 度转弧度
            const radians = Phaser.Math.DegToRad(children[i].angle + 90)
                // 计算x,y使其围绕中心旋转
            children[i].x = this.target.x + (this.target.width / 2) * Math.cos(radians)
            children[i].y = this.target.y + (this.target.width / 2) * Math.sin(radians)
        }

        this.input.keyboard.on('keydown-SPACE', () => {
            console.log(123)
        }, this);

    }

    throwKnife() {
        if (this.canThrow) {
            this.canThrow = false
                // tween 渐变
            this.tweens.add({
                // The object, or an array of objects, to run the tween on
                targets: [this.knife],
                // y方向目标
                y: this.target.y + this.target.width / 2,
                // 动画时间
                duration: gameOptions.throwSpeed,
                // 回调范围
                callbackScope: this,
                // 完成后的回调
                onComplete: function(tween) {
                    // 判断飞刀是否可以插入圆木
                    let legalHit = true
                        // 获取在圆木上旋转的飞刀数组
                    const children = this.knifeGroup.getChildren()
                        // 遍历飞刀数组
                    for (let i = 0; i < children.length; i++) {
                        // 判断刀间夹角是否满足条件
                        if (Math.abs(Phaser.Math.Angle.ShortestBetween(
                                this.target.angle,
                                children[i].impactAngle)) < gameOptions.minAngle) {
                            // 不满足条件
                            legalHit = false
                            break
                        }
                    }

                    // 判断是否满足条件
                    if (legalHit) {
                        // 可以继续投掷
                        this.canThrow = true
                            // 飞刀数组中增加本次飞刀
                        const knife = this.add.sprite(this.knife.x, this.knife.y, 'knife')
                            // 存储目标角度
                        knife.impactAngle = this.target.angle
                            // 添加到数组
                        this.knifeGroup.add(knife)
                            // 新生成一把刀
                        this.knife.y = this.height / 5 * 4
                    } else {
                        // 掉下来的动画
                        this.tweens.add({
                            // 加到targets数组
                            targets: [this.knife],
                            // y方向目标
                            y: this.height + this.knife.height,
                            // 旋转度数，弧度制
                            rotation: 5,
                            // 动画时间
                            duration: gameOptions.throwSpeed * 4,
                            // 回调范围
                            callbackScope: this,
                            // 回调函数
                            onComplete: function(tween) {
                                // 开始新一局
                                this.scene.start('T1')
                            }
                        })
                    }
                }
            })
        }
    }

}