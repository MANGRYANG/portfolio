// Scene05.js
import text from './Text.js';
import map from './Map.js';
import player from './Player.js';

const titleFontPngURL = '../assets/font/font.png';
const titleFontXmlURL = '../assets/font/font.xml';
const playerIdleURL = '../assets/characters/Idle.png';
const playerWalkURL = '../assets/characters/Walk.png';
const playerRaiseURL = '../assets/characters/Raise.png';
const playerFallingURL = '../assets/characters/Fall.png';
const dungeonTilesURL = '../assets/Dungeon.png';
const slimeTilesURL = '../assets/Slime.png';
const map05URL = '../maps/Map05.json';

const pageWidth = 800;
const pageHeight = 600;
const scale = 2;

export default class Scene05 extends Phaser.Scene {
    constructor() {
        super('scene-05');
        this.map = null;
        this.lastTimeSymbol = 0;
        this.tileSize = scale * 16;
    }

    preload() {
        this.loadAssets();
    }

    loadAssets() {
        this.load.bitmapFont('pixelFont', titleFontPngURL, titleFontXmlURL);
        this.load.image('dungeon_tiles', dungeonTilesURL);
        this.load.image('slime_tiles', slimeTilesURL);
        this.load.tilemapTiledJSON('map05', map05URL);
        this.load.spritesheet('playerIdle', playerIdleURL, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerWalk', playerWalkURL, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerRaise', playerRaiseURL, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerFalling', playerFallingURL, { frameWidth: 32, frameHeight: 32 });
    }

    create(data) {
        this.setupScene(data);
        this.initializePlayer(data);
        this.setupKeyboardInput();
        this.cameras.main.setBackgroundColor('#181425');

        this.input.keyboard.on('keydown-L', (event) => {
            if (this.input.keyboard.checkDown(this.ctrl_Key)) {
                event.preventDefault();
                this.textLogs.forEach(textLog => {
                    if (textLog.text) {
                        textLog.textMessage = '';
                        textLog.text.destroy();
                    }
                });
                this.textLogs = [];
            }
        });

        this.input.keyboard.on('keydown-K', (event) => {
            if (this.input.keyboard.checkDown(this.ctrl_Key)) {
                event.preventDefault();

                this.checkTextLogRenewal();

                let keysCollected = [];
                const keyNames = ["Red key", "Blue key", "Green key", "Golden key", "Silver key"];

                keyNames.forEach((key, index) => {
                    if (this.keyCollection[index]) {
                        keysCollected.push(key);
                    }
                });

                let message = keysCollected.length === 0 ? "You didn't collect any keys!" : "Collected keys: " + keysCollected.join(", ");
                const offsetY = this.textLogs.length * 16;
                let keySlotLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5, 'pixelFont', message, 16, 1);
                keySlotLog.typeCreate();
                this.textLogs.push(keySlotLog);
            }
        });
    }

    setupScene(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.titleText = new text(this, pageWidth / 2, pageHeight / 4 - (16 * 5 + 8), 'pixelFont', "Mangryang's Dungeon", 64, 0);
        this.titleText.create();
        this.map = new map(this, 'map05', scale);
        this.map.createMap();
        this.keyCollection = data.keyCollection;
        this.textLogs = [];
        if(data.textLogs != undefined) {
            data.textLogs.forEach(textLog => {
                let log = new text(this, textLog.worldX, textLog.worldY, 'pixelFont', textLog.textMessage, 16, 1);
                log.create();
                this.textLogs.push(log);
            });
        }
    }

    initializePlayer(data) {
        const playerPosition = (data.portalDirection === 0) ? { x: 9, y: 0 } : { x: 9, y: 10 };
        this.player = new player(this, playerPosition.x, playerPosition.y, data.playerDirection, scale);
        this.player.create();
        this.player.idleAnimation(data.playerDirection);
    }

    setupKeyboardInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.w_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.a_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.s_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.d_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.space_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.ctrl_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    }

    update(_time, delta) {
        const currentTimeSymbol = Math.floor(_time / 100) % 8;

        if (currentTimeSymbol !== this.lastTimeSymbol) {
            this.map.updateMap(currentTimeSymbol);

            this.lastTimeSymbol = currentTimeSymbol;
            this.handlePlayerMovement();
        }
    }

    handlePlayerMovement() {
        if (!this.player.isMoving) {
            const tileX = this.player.x;
            const tileY = this.player.y;

            if (this.cursors.down.isDown || this.s_Key.isDown) {
                this.movePlayer(0, 1, tileX, tileY, 'scene-02', { portalDirection: 3, playerDirection : this.getDirection(0, 1), textLogs: this.textLogs, keyCollection: this.keyCollection });
            } else if (this.cursors.right.isDown || this.d_Key.isDown) {
                this.movePlayer(1, 0, tileX, tileY);
            } else if (this.cursors.up.isDown || this.w_Key.isDown) {
                this.movePlayer(0, -1, tileX, tileY, 'scene-06', { portalDirection: 2, playerDirection : this.getDirection(0, -1), textLogs: this.textLogs, keyCollection: this.keyCollection });
            } else if (this.cursors.left.isDown || this.a_Key.isDown) {
                this.movePlayer(-1, 0, tileX, tileY);
            } else {
                this.player.idleAnimation();
            }
        }
    }

    movePlayer(dx, dy, tileX, tileY, sceneKey, sceneData) {
        this.player.direction = this.getDirection(dx, dy);
        this.player.walkAnimation();

        if (this.canMove(tileX + dx, tileY + dy)) {
            this.player.move(dx, dy);
        } else if ((dy === 1 && tileY === 10) ||
            (dy === -1 && tileY === 0)) { // Check for scene transition
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.scene.stop();
            this.scene.start(sceneKey, sceneData);
        }
    }

    canMove(targetX, targetY) {
        const wallTileIndex = this.map.getTileIndexAt(targetX, targetY, this.map.wallsLayer);
        if(targetX === 20) {return false;}
        else {
            return (!(wallTileIndex === 1)) && (targetX > -1 && targetX < 20) && (targetY > -1 && targetY < 11);
        }
    }

    getDirection(dx, dy) {
        if (dy > 0) return 0; // Down
        if (dx > 0) return 1; // Right
        if (dy < 0) return 2; // Up
        if (dx < 0) return 3; // Left
        return -1; // Idle
    }

    checkTextLogRenewal() {
        if (this.textLogs.length >= 5) {
            const removedText = this.textLogs.shift();
            if (removedText.text) {
                removedText.textMessage = '';
                removedText.text.destroy();
            }

            this.textLogs.forEach(textLog => {
                textLog.worldY -= 16;
                if (textLog.text) {
                    textLog.text.y -= 16;
                }
            });
        }
    }
}