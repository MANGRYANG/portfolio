import titleImageLocation from '../assets/TitleText.png';
import dungeonTilesLocation from '../assets/Dungeon.png';
import map01Location from '../maps/Map01.json';
import playerLocation from '../assets/characters/Idle.png';
import playerWalkLocation from '../assets/characters/Walk.png';

import Phaser from 'phaser';

const pageWidth = document.documentElement.scrollWidth;
const pageHeight = document.documentElement.scrollHeight;
const layer_scale = pageWidth / (320 * 2);
const directions = ['down', 'right', 'up', 'left'];

export default class Scene01 extends Phaser.Scene {

    WKey; AKey; SKey; DKey;

    constructor() {
        super('scene-01');
        this.lastTimeSymbol = 0;
        this.map = null;
        this.torchesLayer = null;
        this.isMoving = false;
        this.tileSize = layer_scale * 16;
    }

    preload() {
        this.load.image('title_text', titleImageLocation);
        this.load.image('dungeon_tiles', dungeonTilesLocation);
        this.load.tilemapTiledJSON('map01', map01Location);
        this.load.spritesheet('playerIdle', playerLocation, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerWalk', playerWalkLocation, { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.input.enabled = true;
        
        const title_scale = pageWidth / (1717 * 2);
        this.add.image(pageWidth / 2, pageHeight / 8, 'title_text').setScale(title_scale);

        const map = this.make.tilemap({ key: 'map01' });
        this.map = map;
        const tileset = this.map.addTilesetImage("Dungeon", "dungeon_tiles");

        this.floorsLayer = map.createLayer("Floors", tileset, (pageWidth - layer_scale * 320) / 2,
            (pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
        this.wallsLayer = map.createLayer("Walls", tileset, (pageWidth - layer_scale * 320) / 2,
            (pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
        this.torchesLayer = map.createLayer("Torches", tileset, (pageWidth - layer_scale * 320) / 2,
            (pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
        this.waterfallsLayer = map.createLayer("Waterfalls", tileset, (pageWidth - layer_scale * 320) / 2,
            (pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
        this.trapsLayer = map.createLayer("Traps", tileset, (pageWidth - layer_scale * 320) / 2,
            (pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
        this.objectsLayer = map.createLayer("Objects", tileset, (pageWidth - layer_scale * 320) / 2,
            (pageHeight - layer_scale * 172) / 2).setScale(layer_scale);	

        // Add cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        // Add player
        this.player = this.add.sprite(pageWidth / 2 - (16 * 9 + 8) * layer_scale, pageHeight / 2 + (16 * 5),
            'playerIdle').setScale(layer_scale);

        this.playerDirection = 1;

        // Create animations
        directions.forEach((dir, index) => {
            this.anims.create({
                key: `${dir}Idle`,
                frames: this.anims.generateFrameNumbers('playerIdle', { start: index * 8, end: (index + 1) * 8 - 1 }),
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
        
        this.playerPositionInMap = this.map.worldToTileXY(this.player.x, this.player.y);
        const currentTrapTile = this.map.getTileAt(this.playerPositionInMap.x, this.playerPositionInMap.y, true, this.trapsLayer);

        if (currentTimeSymbol !== this.lastTimeSymbol) {
            // Player death
            if((currentTrapTile.index >= 5409 && currentTrapTile.index <= 5414) || (currentTrapTile.index >= 5522 && currentTrapTile.index <= 5527)) {
                this.playerDeath();
            }

            this.torchesLayer.forEachTile(tile => {
                if (tile.index >= 6876 && tile.index < 6883) {
                    tile.index += 1;
                } else if (tile.index === 6883) {
                    tile.index = 6876; // Repeat animation
                }
            });

            this.waterfallsLayer.forEachTile(tile => {
                if ((tile.index >= 4955 && tile.index < 4962) || (tile.index >= 5068 && tile.index < 5075)) {
                    tile.index += 1;
                } else if (tile.index === 4962) {
                    tile.index = 4955; // Repeat animation
                } else if (tile.index === 5075) {
                    tile.index = 5068; // Repeat animation
                }
            });

            this.trapsLayer.forEachTile(tile => {
                if ((tile.index >= 5407 && tile.index < 5414) || (tile.index >= 5520 && tile.index < 5535)) {
                    tile.index += 1;
                } else if (tile.index === 5414) {
                    tile.index = 5407; // Repeat animation
                } else if (tile.index === 5535) {
                    tile.index = 5520; // Repeat animation
                }
            });
            
            if (currentTimeSymbol % 2 === 0) {
                this.objectsLayer.forEachTile(tile => {
                    if (tile.index >= 6650 && tile.index < 6657) {
                        tile.index += 1;
                    } else if (tile.index > 6181 && tile.index <= 6196) {
                        tile.index -= 1;
                    } else if (tile.index === 6657) {
                        tile.index = 6650; // Repeat animation
                    } else if (tile.index === 6181) {
                        tile.index = 6196; // Repeat animation
                    }
                });
            }

            if (currentTimeSymbol === 0) {
                this.floorsLayer.forEachTile(tile => {
                    if (tile.index === 4948) {
                        tile.index += 1;
                    } else if (tile.index === 4949) {
                        tile.index -= 1; // Repeat animation
                    }
                });
            }
            this.lastTimeSymbol = currentTimeSymbol;

            if (!this.isMoving) {
                if (this.cursors.down.isDown || this.SKey.isDown) {
                    this.player.anims.play('downWalk', true);
                    this.playerDirection = 0;
                    if((this.map.getTileAt(this.playerPositionInMap.x, this.playerPositionInMap.y + 1, true, this.floorsLayer).index) > 0 &&
                        (this.map.getTileAt(this.playerPositionInMap.x, this.playerPositionInMap.y + 1, true, this.objectsLayer).index) < 0) {
                        this.startMove(0, this.tileSize);
                    }
                } else if (this.cursors.right.isDown || this.DKey.isDown) {
                    this.player.anims.play('rightWalk', true);
                    this.playerDirection = 1;
                    if(this.playerPositionInMap.x == 19) {
                        this.input.enabled = false;
                        this.cameras.main.fadeOut(1000, 0, 0, 0);
                        this.scene.transition({ target: 'start-scene', duration: 1 });

                        this.cameras.main.once('camerafadeoutcomplete', function () {
                            this.sceneTransitioning = false;
                        }, this);
                    }
                    else {
                        if((this.map.getTileAt(this.playerPositionInMap.x + 1, this.playerPositionInMap.y, true, this.floorsLayer).index) > 0 &&
                            (this.map.getTileAt(this.playerPositionInMap.x + 1, this.playerPositionInMap.y, true, this.objectsLayer).index) < 0) {
                            this.startMove(this.tileSize, 0);
                        }
                    }
                } else if (this.cursors.up.isDown || this.WKey.isDown) {
                    this.player.anims.play('upWalk', true);
                    this.playerDirection = 2;
                    if((this.map.getTileAt(this.playerPositionInMap.x, this.playerPositionInMap.y - 1, true, this.floorsLayer).index) > 0 &&
                        (this.map.getTileAt(this.playerPositionInMap.x, this.playerPositionInMap.y - 1, true, this.objectsLayer).index) < 0) {
                        this.startMove(0, -this.tileSize);
                    }
                } else if (this.cursors.left.isDown || this.AKey.isDown) {
                    this.player.anims.play('leftWalk', true);
                    this.playerDirection = 3;
                    if(this.playerPositionInMap.x == 0) {
                        this.input.enabled = false;
                        this.cameras.main.fadeOut(1000, 0, 0, 0);
                        this.scene.transition({ target: 'start-scene', duration: 1 });

                        this.cameras.main.once('camerafadeoutcomplete', function () {
                            this.sceneTransitioning = false;
                        }, this);
                    }
                    else {
                        if((this.map.getTileAt(this.playerPositionInMap.x - 1, this.playerPositionInMap.y, true, this.floorsLayer).index) > 0 &&
                            (this.map.getTileAt(this.playerPositionInMap.x - 1, this.playerPositionInMap.y, true, this.objectsLayer).index) < 0) {
                            this.startMove(-this.tileSize, 0);
                        }
                    }
                } else {
                    this.player.anims.play(`${directions[[this.playerDirection]]}Idle`, true);
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

    playerDeath ()
    {
        this.input.enabled = false;
        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.shake(200, 0.01);

        this.time.addEvent({
            delay: 200,
            callback: () => {
                this.cameras.main.resetFX();
                this.scene.stop();
                this.scene.start('start-scene');
            }
        });
    }
}