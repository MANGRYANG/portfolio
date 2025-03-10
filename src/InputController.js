import Phaser from 'phaser';

export default class InputController {
    constructor(scene) {
        this.scene = scene;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.WKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.AKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.SKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.DKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.pad = null;

        this.scene.input.gamepad.once('connected', (pad) => {
            this.pad = pad;
        });
    }

    isDown(key) {
        return this.cursors[key].isDown || (this.pad && this.pad.isDown(key));
    }
}