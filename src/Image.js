// Image.js
export default class Image {
    constructor(scene, worldX, worldY, key, scale) {
        this.scene = scene;
        this.image = null;
        this.worldX = worldX;
        this.worldY = worldY;
        this.key = key;
        this.scale = scale;
    }

    create() {
        this.image = this.scene.add.image(this.worldX, this.worldY, this.key).setScale(this.scale);
    }
}
