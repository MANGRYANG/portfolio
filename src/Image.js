// Image.js
export default class Image {
    constructor(scene, worldX, worldY, key) {
        this.scene = scene;
        this.image = null;
        this.worldX = worldX;
        this.worldY = worldY;
        this.key = key;
    }

    create() {
        this.image = this.scene.add.image(this.worldX, this.worldY, this.key);
    }

    remove() {
        if(this.image != null) {
            this.image.destroy();
        }
    }
}
