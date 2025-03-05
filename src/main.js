import Phaser from 'phaser'
import StartScene from './StartScene'
import Scene01 from './Scene01.js'

const pageWidth = document.documentElement.scrollWidth;
const pageHeight = document.documentElement.scrollHeight;

const config = {
	type: Phaser.AUTO,
	width: pageWidth,
	height: pageHeight,
	pixelArt: true,
	scene: [StartScene, Scene01],
}

export default new Phaser.Game(config)