import dungeonTileset from '../src/assets/Dungeon.png'
import titleImage from '../src/assets/TitleText.png'
import tilemap from '../src/assets/maps/StartMap.json'

import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
	constructor() {
		super('start-scene');
	}

	preload() {
		this.load.image('Dungeon', dungeonTileset);
		this.load.image('tileset', dungeonTileset);
		this.load.image('titleText', titleImage);

		this.load.tilemapTiledJSON('tilemap', tilemap);
	}

	create() {
		const titleImage = this.add.image(150, -17, 'titleText');
		titleImage.setDisplaySize(202, 20);

		this.map = this.make.tilemap({ key: 'tilemap' });
		const tileset = this.map.addTilesetImage('Dungeon', 'Dungeon');

		this.floorsLayer = this.map.createDynamicLayer('Floors', tileset);
		this.map.createStaticLayer('Cracks', tileset);
		this.map.createStaticLayer('Walls', tileset);
		this.map.createStaticLayer('Torchs', tileset);
		this.map.createStaticLayer('Objects', tileset);

		this.cameras.main.setZoom(3);
		this.cameras.main.setBounds(-30, -35, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.setBackgroundColor('#181425');

		handleCreateTilesData(this);
	}

	update(_time, delta) {
		handleAnimateTiles(this, delta);
	}
}

export const handleCreateTilesData = (scene) => {
	scene.animatedTiles = [];
	const tileData = scene.map.tilesets[0].tileData;

	for (let tileid in tileData) {
		scene.floorsLayer.data.forEach(tileRow => {
			tileRow.forEach(tile => {
				if (tile.index !== -1 && tile.index - scene.map.tilesets[0].firstgid === parseInt(tileid)) {
					scene.animatedTiles.push({
						tile,
						tileAnimationData: tileData[tileid].animation,
						firstgid: scene.map.tilesets[0].firstgid,
						elapsedTime: 0,
					});
				}
			});
		});
	}
};

export const handleAnimateTiles = (scene, delta) => {
	scene.animatedTiles.forEach(tile => {
		if (!tile.tileAnimationData) return;

		tile.elapsedTime += delta;
		const totalDuration = tile.tileAnimationData.reduce((sum, frame) => sum + frame.duration, 0);
		tile.elapsedTime %= totalDuration;

		let cumulativeDuration = 0;
		for (let i = 0; i < tile.tileAnimationData.length; i++) {
			cumulativeDuration += tile.tileAnimationData[i].duration;
			if (tile.elapsedTime < cumulativeDuration) {
				tile.tile.index = tile.tileAnimationData[i].tileid + tile.firstgid;
				break;
			}
		}
	});
};
