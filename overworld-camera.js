// overworld-camera.js

import { TILEMAP, TILE_SIZE } from "./world-map-data.js";

export const CAMERA = {
  x: 0,
  y: 0,
  width: 800,
  height: 600
};

export function updateCamera(playerX, playerY) {
  CAMERA.x = playerX - CAMERA.width / 2;
  CAMERA.y = playerY - CAMERA.height / 2;

  const maxX = TILEMAP[0].length * TILE_SIZE - CAMERA.width;
  const maxY = TILEMAP.length * TILE_SIZE - CAMERA.height;

  CAMERA.x = Math.max(0, Math.min(CAMERA.x, maxX));
  CAMERA.y = Math.max(0, Math.min(CAMERA.y, maxY));
}
