import Phaser from 'phaser'
import StartScene from './StartScene'
import Scene01 from './Scene01.js'
import Scene02 from './Scene02.js'
import Scene03 from './Scene03.js'
import Scene04 from './Scene04.js'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	pixelArt: true,
	antialias: false,
	scene: [StartScene, Scene01, Scene02, Scene03, Scene04],
	parent: 'app',
}

export default new Phaser.Game(config)