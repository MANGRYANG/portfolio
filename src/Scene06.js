// Scene06.js
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
const map06URL = '../maps/Map06.json';

const pageWidth = 800;
const pageHeight = 600;
const scale = 2;

export default class Scene06 extends Phaser.Scene {
    constructor() {
        super('scene-06');
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
        this.load.tilemapTiledJSON('map06', map06URL);
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
        this.map = new map(this, 'map06', scale);
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
        // PortalDirection is always 2
        const playerPosition = { x: 9, y: 10 };
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
            const currentTileIndex = this.map.getTileIndexAt(this.player.x, this.player.y, this.map.objectsLayer);
            // Check player's death
            if((currentTileIndex >= 5409 && currentTileIndex <= 5414) ||
                (currentTileIndex >= 5522 && currentTileIndex <= 5527)) {
                    this.cameras.main.fadeOut(200, 0, 0, 0);
                    this.cameras.main.shake(200, 0.01);
                    let message = "[SYSTEM] YOU DIED BY TRAP!! :( ";
                    let deathLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + 5, 'pixelFont', message, 16, 1);
                    this.time.addEvent({
                        delay: 200,
                        callback: () => {
                            this.cameras.main.resetFX();
                            this.scene.stop();
                            this.scene.start('start-scene', { portalDirection: undefined, playerDirection: undefined, textLogs: [deathLog], keyCollection: [false, false, false, false, false] });
                        }
                    });
            } else if ((currentTileIndex >= 8501 && currentTileIndex <= 8522)) {
                this.cameras.main.fadeOut(200, 0, 0, 0);
                this.cameras.main.shake(200, 0.01);
                let message = "[SYSTEM] YOU KILLED BY TINY SLIME :/ ";
                let deathLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + 5, 'pixelFont', message, 16, 1);
                this.time.addEvent({
                    delay: 200,
                    callback: () => {
                        this.cameras.main.resetFX();
                        this.scene.stop();
                        this.scene.start('start-scene', { portalDirection: undefined, playerDirection: undefined, textLogs: [deathLog], keyCollection: [false, false, false, false, false] });
                    }
                });
            }

            this.lastTimeSymbol = currentTimeSymbol;
            this.handlePlayerInteraction();
            this.handlePlayerMovement();
        }
    }

    handlePlayerInteraction() {
        // Interaction with oak signpost
        if (!this.player.isMoving && !this.interaction &&
            this.space_Key.isDown && (this.map.getTileIndexAt(8, 8, this.map.objectsLayer) === 4170) &&
            ((this.player.x === 7 && this.player.y === 8 && this.player.direction === 1) ||
            (this.player.x === 8 && this.player.y === 9 && this.player.direction === 2) ||
            (this.player.x === 9 && this.player.y === 8 && this.player.direction === 3))) {
            this.player.idleAnimation();
            this.map.setTileIndexAt(8, 8, this.map.objectsLayer, 4171);
            this.interaction = true;

            this.checkTextLogRenewal();

            const message = '[NOTICE] Details about the action platformer game project built using DX11 can be found here.';
            const offsetY = this.textLogs.length * 16;
            const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

            this.newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
            this.newTextLog.typeCreate();
            this.textLogs.push(this.newTextLog);

        } else if (!this.space_Key.isDown && (this.map.getTileIndexAt(8, 8, this.map.objectsLayer) === 4171)) {
            this.map.setTileIndexAt(8, 8, this.map.objectsLayer, 4170);
            this.interaction = false;
        } // Interaction with steel signpost
        else if (!this.player.isMoving && !this.interaction &&
            this.space_Key.isDown && (this.map.getTileIndexAt(11, 8, this.map.objectsLayer) === 4396) &&
            ((this.player.x === 10 && this.player.y === 8 && this.player.direction === 1) ||
            (this.player.x === 11 && this.player.y === 9 && this.player.direction === 2) ||
            (this.player.x === 12 && this.player.y === 8 && this.player.direction === 3))) {
            this.player.idleAnimation();
            this.map.setTileIndexAt(11, 8, this.map.objectsLayer, 4397);
            this.interaction = true;

            this.checkTextLogRenewal();

            const message = '[NOTICE] Details about the portfolio website project built using Phaser can be found here.';
            const offsetY = this.textLogs.length * 16;
            const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

            this.newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
            this.newTextLog.typeCreate();
            this.textLogs.push(this.newTextLog);

        } else if (!this.space_Key.isDown && (this.map.getTileIndexAt(11, 8, this.map.objectsLayer) === 4397)) {
            this.map.setTileIndexAt(11, 8, this.map.objectsLayer, 4396);
            this.interaction = false;
        } else if (!this.player.isMoving && !this.interaction &&
            this.player.x === 17 && this.player.y === 8 &&
            !this.keyCollection[0]) { // When the player collects the red key
            
            this.interaction = true;
            
            this.player.direction = 0;
            this.player.raiseAnimation();
            
            this.map.setTileIndexAt(17, 8, this.map.objectsLayer, 0);
            this.keyCollection[0] = true;

            this.player.isMoving = true; // Stop player's moving

            const message = '[SYSTEM] You found a red key!!';
            const offsetY = this.textLogs.length * 16;
            const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

            let newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
            newTextLog.typeCreate();
            this.textLogs.push(newTextLog);

        } else if (!this.player.isMoving && !this.interaction &&
            this.player.x === 7 && this.player.y === 1 &&
            !this.keyCollection[2]) { // When the player collects the green key
            
            this.interaction = true;
            
            this.player.direction = 0;
            this.player.raiseAnimation();
            
            this.map.setTileIndexAt(7, 1, this.map.objectsLayer, 0);
            this.keyCollection[2] = true;

            this.player.isMoving = true; // Stop player's moving

            const message = '[SYSTEM] You found a green key!!';
            const offsetY = this.textLogs.length * 16;
            const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

            let newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
            newTextLog.typeCreate();
            this.textLogs.push(newTextLog);

        } else if (!this.interaction &&
            this.player.x === 5 && this.player.y === 5 &&
            this.space_Key.isDown && this.player.direction === 2) {

            this.interaction = true;

            if (this.map.getTileIndexAt(5, 4, this.map.objectsLayer) === 3825) {
                this.checkTextLogRenewal();
                if (this.keyCollection[0]) { // When a player attempts to open a treasure chest with a red key
                    this.map.setTileIndexAt(5, 4, this.map.objectsLayer, 3826); // Open a cheset
                    this.player.isMoving = true; // Stop player's moving
                    this.player.idleAnimation();

                    const message = '[SYSTEM] Opening the treasure chest ...';
                    const offsetY = this.textLogs.length * 16;
                    const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

                    let newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
                    newTextLog.typeCreate();
                    this.textLogs.push(newTextLog);
                } else {  // When a player attempts to open a treasure chest without a red key
                    const message = '[SYSTEM] Unable to open the chest ... T^T';
                    const offsetY = this.textLogs.length * 16;
                    const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

                    let newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
                    newTextLog.typeCreate();
                    this.textLogs.push(newTextLog);
                }
            } else if (this.map.getTileIndexAt(5, 4, this.map.objectsLayer) === 3938) { // When the player closes the treasure chest
                this.checkTextLogRenewal();
                this.map.setTileIndexAt(5, 4, this.map.objectsLayer, 3939); // Close a chest
                this.player.isMoving = false; // Player can move

                const message = '[SYSTEM] Closing the treasure chest ...';
                const offsetY = this.textLogs.length * 16;
                const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

                let newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
                newTextLog.typeCreate();
                this.textLogs.push(newTextLog);
            }

        } else if (!this.interaction &&
            this.player.x === 14 && this.player.y === 5 &&
            this.space_Key.isDown && this.player.direction === 2) {

            this.interaction = true;

            if (this.map.getTileIndexAt(14, 4, this.map.objectsLayer) === 3147) {
                this.checkTextLogRenewal();
                if (this.keyCollection[2]) { // When a player attempts to open a treasure chest with a green key
                    this.map.setTileIndexAt(14, 4, this.map.objectsLayer, 3148); // Open a cheset
                    this.player.isMoving = true; // Stop player's moving
                    this.player.idleAnimation();

                    const message = '[SYSTEM] Opening the treasure chest ...';
                    const offsetY = this.textLogs.length * 16;
                    const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

                    let newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
                    newTextLog.typeCreate();
                    this.textLogs.push(newTextLog);
                } else {  // When a player attempts to open a treasure chest without a green key
                    const message = '[SYSTEM] Unable to open the chest ... T^T';
                    const offsetY = this.textLogs.length * 16;
                    const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

                    let newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
                    newTextLog.typeCreate();
                    this.textLogs.push(newTextLog);
                }
            } else if (this.map.getTileIndexAt(14, 4, this.map.objectsLayer) === 3260) { // When the player closes the treasure chest
                this.checkTextLogRenewal();
                this.map.setTileIndexAt(14, 4, this.map.objectsLayer, 3261); // Close a chest
                this.player.isMoving = false; // Player can move

                const message = '[SYSTEM] Closing the treasure chest ...';
                const offsetY = this.textLogs.length * 16;
                const newY = (pageHeight / 2) + (16 * 5 + 8) * 2 + 8 + offsetY + 5;

                let newTextLog = new text(this, (pageWidth / 2) - (16 * 9 * 2), newY, 'pixelFont', message, 16, 1);
                newTextLog.typeCreate();
                this.textLogs.push(newTextLog);
            }

        }
        //Interaction with door 01
        else if (!this.player.isMoving && !this.interaction && this.space_Key.isDown &&
            ((this.player.direction === 0 && this.player.y === 6) && ((this.player.x === 4) || (this.player.x === 5)) ||
            (this.player.direction === 2 && this.player.y === 8) && ((this.player.x === 4) || (this.player.x === 5)))) {
                if(this.map.getTileIndexAt(4, 7, this.map.objectsLayer) === 3294) {     // open
                    this.map.setTileIndexAt(4, 6, this.map.objectsLayer, 2941);
                    this.map.setTileIndexAt(5, 6, this.map.objectsLayer, 2942);

                    this.map.setTileIndexAt(4, 7, this.map.objectsLayer, 3054);
                    this.map.setTileIndexAt(5, 7, this.map.objectsLayer, 3055);

                    this.map.setTileIndexAt(4, 7, this.map.wallsLayer, 0);
                    this.map.setTileIndexAt(5, 7, this.map.wallsLayer, 0);

                } else if (this.map.getTileIndexAt(4, 7, this.map.objectsLayer) === 3068) {     // close
                    this.map.setTileIndexAt(4, 6, this.map.objectsLayer, 3167);
                    this.map.setTileIndexAt(5, 6, this.map.objectsLayer, 3168);

                    this.map.setTileIndexAt(4, 7, this.map.objectsLayer, 3280);
                    this.map.setTileIndexAt(5, 7, this.map.objectsLayer, 3281);
                    
                    this.map.setTileIndexAt(4, 7, this.map.wallsLayer, 1);
                    this.map.setTileIndexAt(5, 7, this.map.wallsLayer, 1);
                }
        }
        //Interaction with door 02
        else if (!this.player.isMoving && !this.interaction && this.space_Key.isDown &&
            ((this.player.direction === 0 && this.player.y === 6) && ((this.player.x === 14) || (this.player.x === 15)) ||
            (this.player.direction === 2 && this.player.y === 8) && ((this.player.x === 14) || (this.player.x === 15)))) {
                if(this.map.getTileIndexAt(14, 7, this.map.objectsLayer) === 3294) {     // open
                    this.map.setTileIndexAt(14, 6, this.map.objectsLayer, 2941);
                    this.map.setTileIndexAt(15, 6, this.map.objectsLayer, 2942);

                    this.map.setTileIndexAt(14, 7, this.map.objectsLayer, 3054);
                    this.map.setTileIndexAt(15, 7, this.map.objectsLayer, 3055);

                    this.map.setTileIndexAt(14, 7, this.map.wallsLayer, 0);
                    this.map.setTileIndexAt(15, 7, this.map.wallsLayer, 0);

                } else if (this.map.getTileIndexAt(14, 7, this.map.objectsLayer) === 3068) {     // close
                    this.map.setTileIndexAt(14, 6, this.map.objectsLayer, 3167);
                    this.map.setTileIndexAt(15, 6, this.map.objectsLayer, 3168);

                    this.map.setTileIndexAt(14, 7, this.map.objectsLayer, 3280);
                    this.map.setTileIndexAt(15, 7, this.map.objectsLayer, 3281);
                    
                    this.map.setTileIndexAt(14, 7, this.map.wallsLayer, 1);
                    this.map.setTileIndexAt(15, 7, this.map.wallsLayer, 1);
                }
        }
        else {
            this.interaction = false;
        }
    }

    handlePlayerMovement() {
        if (!this.player.isMoving) {
            const tileX = this.player.x;
            const tileY = this.player.y;

            if (this.cursors.down.isDown || this.s_Key.isDown) {
                this.movePlayer(0, 1, tileX, tileY, 'scene-05', { portalDirection: 0, playerDirection : this.getDirection(0, 1), textLogs: this.textLogs, keyCollection: this.keyCollection });
            } else if (this.cursors.right.isDown || this.d_Key.isDown) {
                this.movePlayer(1, 0, tileX, tileY);
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
        } else if (dy === 1 && tileY === 10) { // Check for scene transition
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