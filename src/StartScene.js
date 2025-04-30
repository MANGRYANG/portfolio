// StartScene.js
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
const startMapURL = '../maps/StartMap.json';

const pageWidth = 800;
const pageHeight = 600;
const scale = 2;

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('start-scene');
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
        this.load.tilemapTiledJSON('startMap', startMapURL);
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
        this.map = new map(this, 'startMap', scale);
        this.map.createMap();

        this.keyCollection = data.keyCollection ? data.keyCollection : [false, false, false, false, false];
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
        const playerPosition = (data.portalDirection === 3) ? { x: 19, y: 5 } : { x: 6, y: 5 };
        this.player = new player(this, playerPosition.x, playerPosition.y,
            (data.playerDirection != undefined) ? data.playerDirection : 0, scale);
        this.player.create();
        this.player.idleAnimation((data.portalDirection != undefined) ? data.playerDirection : 0);
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
            this.handlePlayerInteraction();
            this.handlePlayerMovement();
        }
    }

    handlePlayerInteraction() {
        // Interaction with signpost
        if (!this.player.isMoving && !this.interaction &&
            this.space_Key.isDown && (this.map.getTileIndexAt(15, 2, this.map.objectsLayer) === 4170) &&
            ((this.player.x === 15 && this.player.y === 1 && this.player.direction === 0) ||
            (this.player.x === 14 && this.player.y === 2 && this.player.direction === 1) ||
            (this.player.x === 15 && this.player.y === 3 && this.player.direction === 2) ||
            (this.player.x === 16 && this.player.y === 2 && this.player.direction === 3))) {
            this.player.idleAnimation();
            this.map.setTileIndexAt(15, 2, this.map.objectsLayer, 4171);
            this.interaction = true;

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

            const message = 'Notice: You can open the treasure chests with the keys throughout Dungeon to see my portfolio.';
            const offsetY = this.textLogs.length * 16;
            const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

            this.newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
            this.newTextLog.typeCreate();
            this.textLogs.push(this.newTextLog);

        } else if (!this.space_Key.isDown && (this.map.getTileIndexAt(15, 2, this.map.objectsLayer) === 4171)) {
            this.map.setTileIndexAt(15, 2, this.map.objectsLayer, 4170);
            this.interaction = false;
        }
    }

    handlePlayerMovement() {
        if (!this.player.isMoving && !this.interaction) {
            const tileX = this.player.x;
            const tileY = this.player.y;

            if (this.cursors.down.isDown || this.s_Key.isDown) {
                this.movePlayer(0, 1, tileX, tileY);
            } else if (this.cursors.right.isDown || this.d_Key.isDown) {
                this.movePlayer(1, 0, tileX, tileY, 'scene-01', { portalDirection: 1, playerDirection: this.getDirection(1, 0), textLogs: this.textLogs, keyCollection: this.keyCollection });
            } else if (this.cursors.up.isDown || this.w_Key.isDown) {
                this.movePlayer(0, -1, tileX, tileY);
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
        } else if (dx === 1 && tileX === 19) { // Check for scene transition
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.scene.stop();
            this.scene.start(sceneKey, sceneData);
        }
    }

    canMove(targetX, targetY) {
        const wallTileIndex = this.map.getTileIndexAt(targetX, targetY, this.map.wallsLayer);
        return (!(wallTileIndex === 1)) && (targetX > -1 && targetX < 20) && (targetY > -1 && targetY < 11);
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
