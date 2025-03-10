// Scene01.js
import phaser from 'phaser';
import image from './Image.js';
import map from './Map.js';
import player from './Player.js';

const titleImageURL = "../assets/TitleImageTexture.png";
const playerIdleURL = '../assets/characters/Idle.png';
const playerWalkURL = '../assets/characters/Walk.png';
const dungeonTilesURL = '../assets/Dungeon.png';
const map01URL = '../maps/Map01.json';

const pageWidth = document.documentElement.scrollWidth;
const pageHeight = document.documentElement.scrollHeight;
const scale = pageWidth / (320 * 2);

export default class Scene01 extends phaser.Scene {
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
        this.load.image('title_image', titleImageURL);
        this.load.image('dungeon_tiles', dungeonTilesURL);
        this.load.tilemapTiledJSON('map01', map01URL);
        this.load.spritesheet('playerIdle', playerIdleURL, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerWalk', playerWalkURL, { frameWidth: 32, frameHeight: 32 });
    }

    create(data) {
        this.setupScene(data);
        this.initializePlayer(data);
        this.setupKeyboardInput();
        this.cameras.main.setBackgroundColor('#181425');
    }

    setupScene(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.titleImage = new image(this, pageWidth / 2, pageHeight / 8, 'title_image', pageWidth / (1717 * 2));
        this.titleImage.create();
        this.map = new map(this, 'map01', scale);
        this.map.createMap();
    }

    initializePlayer(data) {
        const playerPosition = (data.portalDirection === 3) ? { x: 19, y: 6 } : { x: 0, y: 7 };
        this.player = new player(this, playerPosition.x, playerPosition.y, data.playerDirection, scale);
        this.player.create();
        this.player.idleAnimation(data.playerDirection);
    }

    setupKeyboardInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.w_Key = this.input.keyboard.addKey(phaser.Input.Keyboard.KeyCodes.W);
        this.a_Key = this.input.keyboard.addKey(phaser.Input.Keyboard.KeyCodes.A);
        this.s_Key = this.input.keyboard.addKey(phaser.Input.Keyboard.KeyCodes.S);
        this.d_Key = this.input.keyboard.addKey(phaser.Input.Keyboard.KeyCodes.D);
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
                        this.scene.start('start-scene', { portalDirection: undefined, playerDirection : undefined });
                    }
                });
            }
            this.lastTimeSymbol = currentTimeSymbol;
            this.handlePlayerMovement();
        }
    }

    handlePlayerMovement() {
        if (!this.player.isMoving) {
            const tileX = this.player.x;
            const tileY = this.player.y;

            if (this.cursors.down.isDown || this.s_Key.isDown) {
                this.movePlayer(0, 1, tileX, tileY);
            } else if (this.cursors.right.isDown || this.d_Key.isDown) {
                this.movePlayer(1, 0, tileX, tileY, 'scene-02', { portalDirection: 1, playerDirection : this.getDirection(1, 0) });
            } else if (this.cursors.up.isDown || this.w_Key.isDown) {
                this.movePlayer(0, -1, tileX, tileY);
            } else if (this.cursors.left.isDown || this.a_Key.isDown) {
                this.movePlayer(-1, 0, tileX, tileY, 'start-scene', { portalDirection: 3, playerDirection : this.getDirection(-1, 0) });
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
