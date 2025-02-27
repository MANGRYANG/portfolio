import Phaser from 'phaser'
import StartScene from './StartScene'

const pageWidth = document.documentElement.scrollWidth;
const pageHeight = document.documentElement.scrollHeight;

const config = {
	type: Phaser.AUTO,
	width: pageWidth,
	height: pageHeight,
	pixelArt: true,
	scene: [StartScene],
}

export default new Phaser.Game(config)