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
        const tileset = map.addTilesetImage("Dungeon", "dungeon_tiles", 16, 16);

        this.floorsLayer = map.createLayer("Floors", tileset, (pageWidth - this.scale * 320) / 2,
            (pageHeight - this.scale * 172) / 2).setScale(this.scale);
        this.decorationsLayer = map.createLayer("Decorations", tileset, (pageWidth - this.scale * 320) / 2,
            (pageHeight - this.scale * 172) / 2).setScale(this.scale);
        this.wallsLayer = map.createLayer("Walls", tileset, (pageWidth - this.scale * 320) / 2,
            (pageHeight - this.scale * 172) / 2).setScale(this.scale);
        this.objectsLayer = map.createLayer("Objects", tileset, (pageWidth - this.scale * 320) / 2,
            (pageHeight - this.scale * 172) / 2).setScale(this.scale);	
    }
    updateMap(currentTimeSymbol) {
        this.decorationsLayer.forEachTile(tile => {
            if(tile.index >= 3866 && tile.index < 3881) {
                tile.index += 1;
            } else if (tile.index === 3881) {
                tile.index -= 15; // Repeat animation
            }
        });

        this.objectsLayer.forEachTile(tile => {
            if ((tile.index >= 3826 && tile.index < 3832) ||
                (tile.index >= 3939 && tile.index < 3945) ||
                (tile.index >= 4296 && tile.index < 4303) ||
                (tile.index >= 4409 && tile.index < 4416) ||
                (tile.index >= 4955 && tile.index < 4962) ||
                (tile.index >= 5068 && tile.index < 5075) ||
                (tile.index >= 5407 && tile.index < 5414) ||
                (tile.index >= 5520 && tile.index < 5534) ||
                (tile.index >= 6876 && tile.index < 6883) ||
                (tile.index >= 8049 && tile.index < 8063) ||
                (tile.index >= 8162 && tile.index < 8177)) {
                tile.index += 1;
            } else if (tile.index === 4303 ||
                        tile.index === 4416 ||
                        tile.index === 4962 ||
                        tile.index === 5075 ||
                        tile.index === 5414 ||
                        tile.index === 6883) {
                tile.index -= 7; // Repeat animation
            } else if (tile.index === 5534 ||
                        tile.index === 8063 ||
                        tile.index === 8177) {
                tile.index -= 14; // Repeat animation
            } else if (tile.index === 3832) {
                tile.index = 3938;
            } else if (tile.index === 3945) {
                tile.index = 3825;
            }
        });

        if(currentTimeSymbol % 2 === 0) {
            this.objectsLayer.forEachTile(tile => {
                if ((tile.index >= 6650 && tile.index < 6657)) {
                    tile.index += 1;
                } else if ((tile.index > 6181 && tile.index <= 6196)) {
                    tile.index -= 1;
                } else if (tile.index === 6657) {
                    tile.index -= 7; // Repeat animation
                } else if (tile.index === 6181) {
                    tile.index += 15; // Repeat animation
                }
            });
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
