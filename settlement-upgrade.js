// settlement-upgrade.js

import { BUILDINGS } from "./settlement-buildings.js";
import { getWorldState } from "./world-state.js";

export function canUpgradeBuilding(settlementKey, buildingKey, player) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];
  const region = world.regions[SETTLEMENTS[settlementKey].region];

  const building = BUILDINGS[buildingKey];
  const currentLevel = settlement.buildings[buildingKey].level;
  const nextTier = building.tiers.find(t => t.level === currentLevel + 1);

  if (!nextTier) return { ok: false, reason: "Max level reached" };

  const req = nextTier.requirements;

  // Gold requirement
  if (req.gold && player.gold < req.gold) {
    return { ok: false, reason: "Not enough gold" };
  }

  // Prosperity requirement
  if (req.prosperity && settlement.prosperity < req.prosperity) {
    return { ok: false, reason: "Settlement prosperity too low" };
  }

  // Boss defeat requirement
  if (req.bossDefeated && !region.worldBossDefeated) {
    return { ok: false, reason: "Boss not defeated" };
  }

  // Crisis resolved requirement
  if (req.crisisResolved && region.crisis) {
    return { ok: false, reason: "Crisis still active" };
  }

  return { ok: true };
}

export function upgradeBuilding(settlementKey, buildingKey, player) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];
  const building = BUILDINGS[buildingKey];

  const currentLevel = settlement.buildings[buildingKey].level;
  const nextTier = building.tiers.find(t => t.level === currentLevel + 1);

  if (!nextTier) return false;

  // Deduct gold
  if (nextTier.requirements.gold) {
    player.gold -= nextTier.requirements.gold;
  }

  // Apply upgrade
  settlement.buildings[buildingKey].level = nextTier.level;

  // Apply effects
  applyBuildingEffects(settlementKey, buildingKey, nextTier.effects);

  return true;
}

function applyBuildingEffects(settlementKey, buildingKey, effects) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];

  if (effects.moraleMult) {
    settlement.morale *= effects.moraleMult;
  }

  if (effects.prosperityMult) {
    settlement.prosperity *= effects.prosperityMult;
  }

  if (effects.dangerReduction) {
    const region = world.regions[SETTLEMENTS[settlementKey].region];
    region.dangerLevel = Math.max(0.5, region.dangerLevel - effects.dangerReduction);
  }

  // Crafting unlocks, shops, etc. handled in Phase 5 (Economy)
}
