// building-loot.js
import { reportCrime, CRIME_TYPES } from "./crime-system.js";
import { PlayerStorage } from "./player-storage.js";
import { BUILDING_TYPES } from "./building-definitions.js";
import { rollLootTable } from "./loot-tables.js";

export function searchBuildingForLoot(player, settlementKey, buildingDef, buildingState) {
  // Already searched?
  if (buildingState.searchCooldown && Date.now() < buildingState.searchCooldown) {
    return { ok: false, reason: "You already searched here recently." };
  }

  // Mark searched for 10 minutes
  buildingState.searchCooldown = Date.now() + 10 * 60 * 1000;

  // Burglary crime if building is private
  if (buildingDef.trespassCrime) {
    reportCrime(player, settlementKey, CRIME_TYPES.THEFT, 2);
  }

  // Roll loot
  const loot = rollLootTable(buildingDef.type);

  // Add loot to player inventory
  player.inventory = player.inventory || [];
  loot.forEach(item => player.inventory.push(item));

  PlayerStorage.save(player.username, player);

  return { ok: true, loot };
}
