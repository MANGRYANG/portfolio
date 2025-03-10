// Player.js
const pageWidth = document.documentElement.scrollWidth;
const pageHeight = document.documentElement.scrollHeight;

const directions = ['down', 'right', 'up', 'left'];

export default class Player {
    constructor(scene, x, y, direction, scale) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.direction = direction;
        this.isMoving = false;
        this.sprite = null;
    }

    create() {
        this.sprite = this.scene.add.sprite(this.getWorldX(), this.getWorldY(), 'playerIdle').setScale(this.scale);
        this.createAnimations();
    }

    getWorldX() {
        return pageWidth / 2 - (16 * (9 - this.x) + 8) * this.scale;
    }

    getWorldY() {
        return pageHeight / 2 - (16 * (5 - this.y)) * this.scale;
    }

    createAnimations() {
        directions.forEach((dir, index) => {
            this.scene.anims.create({
                key: `${dir}Idle`,
                frames: this.scene.anims.generateFrameNumbers('playerIdle', { start: index * 8, end: (index + 1) * 8 - 1 }),
                frameRate: 10,
                repeat: -1
            });

            this.scene.anims.create({
                key: `${dir}Walk`,
                frames: this.scene.anims.generateFrameNumbers('playerWalk', { start: index * 8, end: (index + 1) * 8 - 1 }),
                frameRate: 10,
                repeat: -1
            });
        });
    }

    idleAnimation() {
        this.playAnimation('Idle');
    }

    walkAnimation() {
        this.playAnimation('Walk');
    }

    playAnimation(action) {
        this.sprite.anims.play(`${directions[this.direction]}${action}`, true);
    }

    move(deltaX, deltaY) {
        if (this.isMoving) return; // Prevent movement if already moving

        this.isMoving = true;
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.sprite.x + (deltaX * this.scale * 16),
            y: this.sprite.y + (deltaY * this.scale * 16),
            duration: 160,
            onComplete: () => this.onMoveComplete(deltaX, deltaY)
        });
    }

    onMoveComplete(deltaX, deltaY) {
        this.isMoving = false;
        this.x += deltaX;
        this.y += deltaY;
    }
}
