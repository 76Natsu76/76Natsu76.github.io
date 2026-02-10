// world-map-data.js

export const TILE_SIZE = 32;

// 0 = grass, 1 = water, 2 = mountain, 3 = town
export const TILEMAP = [
  [0, 0, 0, 0, 3, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 2, 2],
  [0, 1, 1, 0, 0, 0, 2, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 3]
];

// Tiles that block movement
export const COLLISION_TILES = new Set([1, 2]);

export function getTileAtPixel(x, y) {
  const col = Math.floor(x / TILE_SIZE);
  const row = Math.floor(y / TILE_SIZE);
  if (row < 0 || row >= TILEMAP.length) return null;
  if (col < 0 || col >= TILEMAP[0].length) return null;
  return { row, col, id: TILEMAP[row][col] };
}

export const WORLD_MAP = {
  tileSize: 32,

  regions: {
    forest: {
      bounds: { x1: 0, y1: 0, x2: 500, y2: 500 },
      encounterTable: "forest_edge"
    },
    plains: {
      bounds: { x1: 500, y1: 0, x2: 1200, y2: 600 },
      encounterTable: "plains_field"
    },
    capital_city: {
      bounds: { x1: 1200, y1: 200, x2: 1500, y2: 500 },
      safeZone: true
    }
  },

  buildings: [
    { id: "greenhaven_inn", x: 100, y: 100, settlement: "greenhaven", buildingId: "inn_main" },
    { id: "greenhaven_shop", x: 120, y: 100, settlement: "greenhaven", buildingId: "shop_general" },
    { id: "throne_room", x: 1350, y: 350, settlement: "capital_city", buildingId: "throne_room" }
  ]
};
