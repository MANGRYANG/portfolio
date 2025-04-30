// Map.js
const pageWidth = 800;
const pageHeight = 600;

export default class gameMap {
    constructor(scene, key, scale) {
        this.scene = scene;
        this.key = key;
        this.scale = scale;
    }

    createMap() {
        const map = this.scene.make.tilemap({ key: this.key });

        const dungeonTileset = map.addTilesetImage("Dungeon", "dungeon_tiles", 16, 16);
        const slimeTileset = map.addTilesetImage("Slime", "slime_tiles", 16, 16);

        const offsetX = (pageWidth - this.scale * 320) / 2;
        const offsetY = (pageHeight - this.scale * 172) / 2;

        const tilesets = [dungeonTileset, slimeTileset];

        this.floorsLayer = map.createLayer("Floors", tilesets, offsetX, offsetY).setScale(this.scale);
        this.decorationsLayer = map.createLayer("Decorations", tilesets, offsetX, offsetY).setScale(this.scale);
        this.wallsLayer = map.createLayer("Walls", tilesets, offsetX, offsetY).setScale(this.scale);
        this.objectsLayer = map.createLayer("Objects", tilesets, offsetX, offsetY).setScale(this.scale);
        this.frontsLayer = map.createLayer("Fronts", tilesets, offsetX, offsetY).setScale(this.scale);

        this.frontsLayer.setDepth(1);
    }

    
    updateMap(currentTimeSymbol) {
        this.decorationsLayer.forEachTile(tile => {
            if(tile.index >= 3866 && tile.index < 3881) {
                tile.index += 1;
            } else if (tile.index === 3881) {
                tile.index -= 15; // Repeat animation
            }
        });

        this.frontsLayer.forEachTile(tile => {
            if((tile.index >= 8151 && tile.index < 8158) ||
                (tile.index >= 8264 && tile.index < 8271)) {
                tile.index += 1;
            } else if (tile.index === 8158 || tile.index === 8271) {
                tile.index -= 7;
            }
        })

        this.objectsLayer.forEachTile(tile => {
            if ((tile.index >= 3148 && tile.index < 3154) ||
                (tile.index >= 3261 && tile.index < 3267) ||
                (tile.index >= 3487 && tile.index < 3493) ||
                (tile.index >= 3600 && tile.index < 3606) ||
                (tile.index >= 3826 && tile.index < 3832) ||
                (tile.index >= 3939 && tile.index < 3945) ||
                (tile.index >= 4296 && tile.index < 4303) ||
                (tile.index >= 4409 && tile.index < 4416) ||
                (tile.index >= 4955 && tile.index < 4962) ||
                (tile.index >= 5068 && tile.index < 5075) ||
                (tile.index >= 5407 && tile.index < 5414) ||
                (tile.index >= 5520 && tile.index < 5534) ||
                (tile.index >= 6876 && tile.index < 6883) ||
                (tile.index >= 6989 && tile.index < 6996) ||
                (tile.index >= 8049 && tile.index < 8063) ||
                (tile.index >= 8162 && tile.index < 8177) ||
                (tile.index >= 8377 && tile.index < 8384)) {
                tile.index += 1;
            } else if ((tile.index >= 2941 && tile.index < 2955) ||
                (tile.index >= 3054 && tile.index < 3068) ||
                (tile.index >= 3167 && tile.index < 3181) ||
                (tile.index >= 3280 && tile.index < 3294)) {    // Doors
                tile.index += 2;
            } else if (tile.index === 4303 ||
                        tile.index === 4416 ||
                        tile.index === 4962 ||
                        tile.index === 5075 ||
                        tile.index === 5414 ||
                        tile.index === 6883 ||
                        tile.index === 6996 ||
                        tile.index === 8384) {
                tile.index -= 7; // Repeat animation
            } else if(tile.index >= 8501 && tile.index < 8522) {    // Slimes
                tile.index += 3;
            } else if (tile.index === 5534 ||
                        tile.index === 8063 ||
                        tile.index === 8177) {
                tile.index -= 14; // Repeat animation
            } else if ((tile.index === 3154) || (tile.index === 3493) || (tile.index === 3832)) {
                tile.index += 106;
            } else if ((tile.index === 3267) || (tile.index === 3606) || (tile.index === 3945)) {
                tile.index -= 120;
            } else if (tile.index === 8522) {
                tile.index -= 21;
            }
        });

        if(currentTimeSymbol % 2 === 0) {
            this.objectsLayer.forEachTile(tile => {
                if ((tile.index >= 6650 && tile.index < 6657)) {
                    tile.index += 1;
                } else if ((tile.index > 5729 && tile.index <= 5744) ||
                    (tile.index > 6181 && tile.index <= 6196) ||
                    (tile.index > 6407 && tile.index <= 6422)) {
                    tile.index -= 1;
                } else if (tile.index === 5729 || tile.index === 6181 || tile.index === 6407) {
                    tile.index += 15; // Repeat animation
                } else if (tile.index === 6657) {
                    tile.index -= 7; // Repeat animation
                } 
            });
        }

        if(currentTimeSymbol % 16 === 0) {
            this.objectsLayer.forEachTile(tile => {
                if ((tile.index >= 7258 && tile.index < 7273) || 
                    (tile.index >= 7484 && tile.index < 7499)) {    // Waves
                    tile.index += 1;
                } else if ((tile.index === 7273) || (tile.index === 7499)) {
                    tile.index -= 15;
                }
            })
        }
    }

    getTileIndexAt(x, y, layer) {
        // Get the tile at the given coordinates
        const tile = layer.getTileAt(x, y);
        // If tile exists, return its index; otherwise return -1 or any other default value
        return tile ? tile.index : -1;
    }

    setTileIndexAt(x, y, layer, newIndex) {
        const tile = layer.getTileAt(x, y);
        tile.index = newIndex;
    }
}
