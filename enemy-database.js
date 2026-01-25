// enemy-database.js

import enemies from "./enemies.json" assert { type: "json" };

export function loadEnemies() {
  return enemies;
}
