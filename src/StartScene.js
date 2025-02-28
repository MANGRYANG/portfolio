import titleImageLocation from '../assets/TitleText.png';
import dungeonTilesLocation from '../assets/Dungeon.png';
import startMapLocation from '../assets/maps/StartMap.json';

import Phaser from 'phaser';

const pageWidth = document.documentElement.scrollWidth;
const pageHeight = document.documentElement.scrollHeight;

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('start-scene');
        this.lastTimeSymbol = 0;
        this.torchesLayer = null;
    }

    preload() {
        this.load.image('title_text', titleImageLocation);
        this.load.image('dungeon_tiles', dungeonTilesLocation);
        this.load.tilemapTiledJSON('tilemap', startMapLocation);
    }

    create() {
        const title_scale = pageWidth / (1717 * 2);
        this.add.image(pageWidth / 2, pageHeight / 8, 'title_text').setScale(title_scale);

        const map = this.make.tilemap({ key: 'tilemap' });
        const tileset = map.addTilesetImage("Dungeon", "dungeon_tiles", 16, 16);
        const layer_scale = pageWidth / (320 * 2);

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
        
        this.cameras.main.setBackgroundColor('#181425');
    }

    update(_time, delta) {
        // Check per 100ms
        const currentTimeSymbol = Math.floor(_time / 100) % 8;
        
        if (currentTimeSymbol !== this.lastTimeSymbol) {
            this.torchesLayer.forEachTile(tile => {
                if (tile.index >= 6997 && tile.index < 7004) {
                    tile.index += 1;
                } else if (tile.index === 7004) {
                    tile.index = 6997; // Repeat animation
                }

                if (tile.index >= 7441 && tile.index < 7448) {
                    tile.index += 1;
                } else if (tile.index === 7448) {
                    tile.index = 7441; // Repeat animation
                }
            });
            // Update lastTimeSymbol
            this.lastTimeSymbol = currentTimeSymbol;
        }
    }
}
