// migration.js
// Converts old Apps Script player rows into the new GitHub-native schema.

import { PlayerStorage } from "./player-storage.js";

// Safely parse JSON fields that might be strings or objects
function safeParse(value, fallback) {
  try {
    if (typeof value === "string") return JSON.parse(value);
    if (typeof value === "object") return value;
    return fallback;
  } catch {
    return fallback;
  }
}

export function migrateAndSave(old) {
  if (!old || !old.username) {
    throw new Error("Invalid old player object");
  }

  // -----------------------------
  // Parse old JSON fields
  // -----------------------------
  const computed = safeParse(old.computedStatsJSON, {});
  const equipment = safeParse(old.equipment, {});
  const inventory = safeParse(old.inventoryEquipment, []);
  const cooldowns = safeParse(old.cooldownsJSON, {});
  const abilityLevels = safeParse(old.abilityLevelsJSON, {});
  const status = safeParse(old.playerStatusJSON, []);
  const activeEffects = safeParse(old.ActiveEffectsJSON, {});
  const talentTree = safeParse(old.talentTreeJSON, []);
  const regionMeta = safeParse(old.regionMetaJSON, {});

  // -----------------------------
  // Build new canonical player object
  // -----------------------------
  const migrated = {
    username: old.username,
    level: old.level || 1,
    race: old.race || "human",
    subrace: old.subrace || null,
    profession: old.profession || "adventurer",

    exp: old.exp || 0,
    gold: old.gold || 0,

    hardcore: !!old.hardcore,
    transcension: !!old.transcension,

    hp: old.hpCurrent || computed.hpMax || 10,
    hpMax: computed.hpMax || 10,

    mana: old.manaCurrent || computed.manaMax || 0,
    manaMax: computed.manaMax || 0,

    atk: computed.atk || 1,
    def: computed.def || 1,
    speed: computed.speed || old.speedBase || 1,

    critChance: computed.critChance || 0,
    critDamage: computed.critDamage || 1.5,

    elementAffinity: computed.elementAffinity || {},

    equipment: equipment || {},
    inventory: inventory || [],

    abilities: {
      slot1: old.ability1 || null
    },

    cooldowns,
    abilityLevels,
    abilityPoints: old.abilityPoints || 0,

    status,
    activeEffects,

    talentPoints: old.talentPoints || 0,
    talentTree,

    regionMeta
  };

  // -----------------------------
  // Save to localStorage
  // -----------------------------
  PlayerStorage.save(migrated.username, migrated);

  return migrated;
}
