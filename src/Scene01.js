// Scene01.js
import text from './Text.js';
import map from './Map.js';
import player from './Player.js';

const titleFontPngURL = '../assets/font/font.png';
const titleFontXmlURL = '../assets/font/font.xml';
const playerIdleURL = '../assets/characters/Idle.png';
const playerWalkURL = '../assets/characters/Walk.png';
const playerRaiseURL = '../assets/characters/Raise.png';
const dungeonTilesURL = '../assets/Dungeon.png';
const map01URL = '../maps/Map01.json';

const pageWidth = 800;
const pageHeight = 600;
const scale = 2;

export default class Scene01 extends Phaser.Scene {
    constructor() {
        super('scene-01');
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
        this.load.tilemapTiledJSON('map01', map01URL);
        this.load.spritesheet('playerIdle', playerIdleURL, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerWalk', playerWalkURL, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerRaise', playerRaiseURL, { frameWidth: 32, frameHeight: 32 });
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
    }

    setupScene(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.titleText = new text(this, pageWidth / 2, pageHeight / 4 - (16 * 5 + 8), 'pixelFont', "Mangryang's Dungeon", 64, 0);
        this.titleText.create();
        this.map = new map(this, 'map01', scale);
        this.map.createMap();
        this.keyCollection = data.keyCollection;
        if(this.keyCollection[0]) {
            this.map.setTileIndexAt(13, 1, this.map.objectsLayer, 0);
        }
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
        const playerPosition = (data.portalDirection === 3) ? { x: 19, y: 6 } : { x: 0, y: 7 };
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
        this.l_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.space_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.ctrl_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    }

    update(_time, delta) {
        const currentTimeSymbol = Math.floor(_time / 100) % 8;

        if (currentTimeSymbol !== this.lastTimeSymbol) {
            this.map.updateMap(currentTimeSymbol);
            const currentTileIndex = this.map.getTileIndexAt(this.player.x, this.player.y, this.map.objectsLayer);
            // Check player's death
            if((currentTileIndex >= 5409 && currentTileIndex <= 5414) ||
                (currentTileIndex >= 5522 && currentTileIndex <= 5527)) {
                    this.cameras.main.fadeOut(200, 0, 0, 0);
                    this.cameras.main.shake(200, 0.01);
                    this.time.addEvent({
                    delay: 200,
                    callback: () => {
                        this.cameras.main.resetFX();
                        this.scene.stop();
                        this.scene.start('start-scene', { portalDirection: undefined, playerDirection: undefined, textLogs: [], keyCollection: [false, false, false, false, false] });
                    }
                });
            }

            this.lastTimeSymbol = currentTimeSymbol;
            this.handlePlayerInteraction();
            this.handlePlayerMovement();
        }
    }

    handlePlayerInteraction() {
        // Interaction with key
        if (!this.player.isMoving && !this.interaction &&
            this.player.x === 13 && this.player.y === 1 &&
            this.map.getTileIndexAt(13, 1, this.map.objectsLayer) >= 6181 &&
            this.map.getTileIndexAt(13, 1, this.map.objectsLayer) <= 6196) {
            
            this.interaction = true;
            
            this.player.direction = 0;

            this.player.raiseAnimation();

            this.map.setTileIndexAt(13, 1, this.map.objectsLayer, 0);
            this.keyCollection[0] = true;

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

            const message = 'You found a key!! Let\'s find the treasure chest that matches the key.';
            const offsetY = this.textLogs.length * 16;
            const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

            let newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
            newTextLog.typeCreate();
            this.textLogs.push(newTextLog);

        } else if (!this.player.isMoving && !this.interaction &&
            this.player.x === 6 && this.player.y === 3 &&
            this.space_Key.isDown && this.player.direction === 2 &&
            this.map.getTileIndexAt(6, 2, this.map.objectsLayer) === 3825) {
                this.interaction = true;
                if(this.keyCollection[0]) {   // player got a key
                    this.map.setTileIndexAt(6, 2, this.map.objectsLayer, 3826); // open the chest

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
                    
                    const message = 'Opening the treasure chest ...';
                    const offsetY = this.textLogs.length * 16;
                    const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

                    let newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
                    newTextLog.typeCreate();
                    this.textLogs.push(newTextLog);
                } else {
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
                    
                    const message = 'Unable to open the test ... T^T';
                    const offsetY = this.textLogs.length * 16;
                    const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

                    let newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
                    newTextLog.typeCreate();
                    this.textLogs.push(newTextLog);
                }
        } else {
            this.interaction = false;
        }
    }


    handlePlayerMovement() {
        if (!this.player.isMoving) {
            const tileX = this.player.x;
            const tileY = this.player.y;

            if (this.cursors.down.isDown || this.s_Key.isDown) {
                this.movePlayer(0, 1, tileX, tileY);
            } else if (this.cursors.right.isDown || this.d_Key.isDown) {
                this.movePlayer(1, 0, tileX, tileY, 'scene-02', { portalDirection: 1, playerDirection: this.getDirection(1, 0), textLogs: this.textLogs, keyCollection: this.keyCollection });
            } else if (this.cursors.up.isDown || this.w_Key.isDown) {
                this.movePlayer(0, -1, tileX, tileY);
            } else if (this.cursors.left.isDown || this.a_Key.isDown) {
                this.movePlayer(-1, 0, tileX, tileY, 'start-scene', { portalDirection: 3, playerDirection : this.getDirection(-1, 0), textLogs: this.textLogs, keyCollection: this.keyCollection });
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
        } else if ((dx === 1 && tileX === 19) || (dx === -1 && tileX === 0)) { // Check for scene transition
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
}
