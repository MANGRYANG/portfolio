// Text.js
export default class Text {
    constructor(scene, worldX, worldY, key, textMessage, textSize, align) {
        this.scene = scene;
        this.text = null;
        this.worldX = worldX;
        this.worldY = worldY;
        this.key = key;
        this.textMessage = textMessage;
        this.textSize = textSize;
        // 0: Center; 1: Align Text Left;
        this.align = align;
    }

    create() {
        this.text = this.scene.add.bitmapText(this.worldX, this.worldY, this.key, this.textMessage, this.textSize).setOrigin((this.align === 1) ? 0 : 0.5);
    }

    typeCreate() {
        let currentText = '';
        let idx = currentText.length;

        const typeNextCharacter = () => {
            if (idx < this.textMessage.length) {
                currentText += this.textMessage[idx];

                if (this.text) {
                    this.text.destroy();
                }

                this.text = this.scene.add.bitmapText(this.worldX, this.worldY, this.key, currentText, this.textSize).setOrigin(this.align === 1 ? 0 : 0.5);
                idx++;

                this.scene.time.addEvent({
                    delay: 25,
                    callback: typeNextCharacter,
                    callbackScope: this
                });
            }
        };

        typeNextCharacter();
    }
}
