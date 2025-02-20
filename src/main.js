import Phaser from 'phaser'
import StartScene from './StartScene'

const config = {
	type: Phaser.AUTO,
	width: 320 * 3.5 + 40,
	height: 172 * 3.5 + 40,
	pixelArt: true,
	scene: [StartScene],
	parent: 'game-container',
}

export default new Phaser.Game(config)