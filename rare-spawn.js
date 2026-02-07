// rare-spawns.js

import { pickFromArray } from "./utils-weighted.js";
import { resolveEnemy } from "./resolveEnemy.js";

export const RARE_SPAWN_TABLE = [
  {
    id: "forest_spirit",
    chance: 0.01,
    templateKey: "forest_spirit_elite"
  },
  {
    id: "void_echo",
    chance: 0.005,
    templateKey: "void_echo"
  }
  // add more
];

export function maybeInjectRareSpawn(encounter, enemyTemplatesByKey) {
  for (const entry of RARE_SPAWN_TABLE) {
    if (Math.random() < entry.chance) {
      const template = enemyTemplatesByKey[entry.templateKey];
      if (!template) continue;

      const rareEnemy = resolveEnemy(
        template,
        encounter.region,
        encounter.tier || template.tier || 1
      );

      encounter.enemies.push(rareEnemy);
      encounter.debug.rareSpawn = entry.id;
      break;
    }
  }

  return encounter;
}
