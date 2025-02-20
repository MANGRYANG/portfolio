import titleImageLocation from '../src/assets/TitleText.png'
import dungeonTilesLocation from '../src/assets/Dungeon.png'
import startMapLocation from '../src/assets/maps/StartMap.json'

import Phaser from 'phaser';

const pageWidth = document.documentElement.scrollWidth;
const pageHeight = document.documentElement.scrollHeight;

export default class StartScene extends Phaser.Scene {
	constructor() {
		super('start-scene');
	}

	preload() {
		this.load.image('title_text', titleImageLocation);
		this.load.image('dungeon_tiles', dungeonTilesLocation);
		this.load.tilemapTiledJSON('tilemap', startMapLocation);
	}

	create() {
		// 1717 * 170 (px)
		const title_scale = pageWidth / (1717 * 2);
		// Takes up three quarters of space vertically
		this.add.image(pageWidth / 2, pageHeight / 8, 'title_text').setScale(title_scale);

		// 320 * 172 (px)
		const map = this.make.tilemap({ key: 'tilemap' });
		const tileset = map.addTilesetImage("Dungeon", "dungeon_tiles");
		const layer_scale = pageWidth / (320 * 2);

		map.createLayer("Floors", tileset, (pageWidth - layer_scale * 320) / 2,
			(pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
		map.createLayer("Cracks", tileset, (pageWidth - layer_scale * 320) / 2, 
			(pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
		map.createLayer("Walls", tileset, (pageWidth - layer_scale * 320) / 2, 
			(pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
		map.createLayer("Torchs", tileset, (pageWidth - layer_scale * 320) / 2, 
			(pageHeight - layer_scale * 172) / 2).setScale(layer_scale);
		map.createLayer("Objects", tileset, (pageWidth - layer_scale * 320) / 2, 
			(pageHeight - layer_scale * 172) / 2).setScale(layer_scale);

		this.cameras.main.setBackgroundColor('#181425');
	}
}
