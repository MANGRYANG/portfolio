import titleImageLocation from '../assets/TitleText.png';
import dungeonTilesLocation from '../assets/Dungeon.png';
import startMapLocation from '../assets/maps/StartMap.json';
import playerLocation from '../assets/characters/idle.png';
import playerWalkLocation from '../assets/characters/walk.png';

import Phaser from 'phaser';

const pageWidth = document.documentElement.scrollWidth;
const pageHeight = document.documentElement.scrollHeight;
const layer_scale = pageWidth / (320 * 2);

export default class StartScene extends Phaser.Scene {

    WKey; AKey; SKey; DKey;

    constructor() {
        super('start-scene');
        this.lastTimeSymbol = 0;
        this.torchesLayer = null;
        this.isMoving = false;
        this.tileSize = layer_scale * 16;
        this.playerDirection = 0;
    }

    preload() {
        this.load.image('title_text', titleImageLocation);
        this.load.image('dungeon_tiles', dungeonTilesLocation);
        this.load.tilemapTiledJSON('tilemap', startMapLocation);
        this.load.spritesheet('player', playerLocation, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerWalk', playerWalkLocation, { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        const title_scale = pageWidth / (1717 * 2);
        this.add.image(pageWidth / 2, pageHeight / 8, 'title_text').setScale(title_scale);

        const map = this.make.tilemap({ key: 'tilemap' });
        const tileset = map.addTilesetImage("Dungeon", "dungeon_tiles", 16, 16);

        const floorsLayer = map.createLayer("Floors", tileset, (pageWidth - layer_scale * 320) / 2,
            (pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
        const cracksLayer = map.createLayer("Cracks", tileset, (pageWidth - layer_scale * 320) / 2,
            (pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
        const wallsLayer = map.createLayer("Walls", tileset, (pageWidth - layer_scale * 320) / 2,
            (pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
        const objectsLayer = map.createLayer("Objects", tileset, (pageWidth - layer_scale * 320) / 2,
            (pageHeight - layer_scale * 172) / 2).setScale(layer_scale);	

        // Animated layer
        this.torchesLayer = map.createLayer("Torches", tileset, (pageWidth - layer_scale * 320) / 2,
            (pageHeight - layer_scale * 172) / 2).setScale(layer_scale);

        // Add cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        // Add player
        this.player = this.add.sprite(pageWidth / 2 - (16 * 8 + 8) * layer_scale, pageHeight / 2 - (16 * 4) * layer_scale,
            'player').setScale(layer_scale);

        // Create animations
        const directions = ['down', 'right', 'up', 'left'];
        directions.forEach((dir, index) => {
            this.anims.create({
                key: `${dir}Idle`,
                frames: this.anims.generateFrameNumbers('player', { start: index * 8, end: (index + 1) * 8 - 1 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: `${dir}Walk`,
                frames: this.anims.generateFrameNumbers('playerWalk', { start: index * 8, end: (index + 1) * 8 - 1 }),
                frameRate: 10,
                repeat: -1
            });
        });

        this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.cameras.main.setBackgroundColor('#181425');
    }

    update(_time, delta) {
        const currentTimeSymbol = Math.floor(_time / 100) % 8;

        if (currentTimeSymbol !== this.lastTimeSymbol) {
            this.torchesLayer.forEachTile(tile => {
                if (tile.index >= 6989 && tile.index < 6996) {
                    tile.index += 1;
                } else if (tile.index === 6996) {
                    tile.index = 6989; // Repeat animation
                }
            });
            this.lastTimeSymbol = currentTimeSymbol;

            if (!this.isMoving) {
                if (this.cursors.down.isDown || this.SKey.isDown) {
                    this.player.anims.play('downWalk', true);
                    this.playerDirection = 0;
                    this.startMove(0, this.tileSize);
                } else if (this.cursors.right.isDown || this.DKey.isDown) {
                    this.player.anims.play('rightWalk', true);
                    this.playerDirection = 1;
                    this.startMove(this.tileSize, 0);
                } else if (this.cursors.up.isDown || this.WKey.isDown) {
                    this.player.anims.play('upWalk', true);
                    this.playerDirection = 2;
                    this.startMove(0, -this.tileSize);
                } else if (this.cursors.left.isDown || this.AKey.isDown) {
                    this.player.anims.play('leftWalk', true);
                    this.playerDirection = 3;
                    this.startMove(-this.tileSize, 0);
                } else {
                    switch(this.playerDirection) {
                        case 1:
                            this.player.anims.play('rightIdle', true);
                            break;

                        case 2:
                            this.player.anims.play('upIdle', true);
                            break;
                        
                        case 3:
                            this.player.anims.play('leftIdle', true);
                            break;

                        default:
                            this.player.anims.play('downIdle', true);
                            break;
                    }
                }
            }
        }
    }

    startMove(deltaX, deltaY) {
        this.isMoving = true;

        this.tweens.add({
            targets: this.player,
            x: this.player.x + deltaX,
            y: this.player.y + deltaY,
            duration: 160,
            onComplete: () => {
                this.isMoving = false;
            }
        });
    }
}