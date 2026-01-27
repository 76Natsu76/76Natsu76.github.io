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

// ============================================================
// MIGRATION RESOLVER
// Converts legacy KV player → modern canonical player schema
// ============================================================

export function resolveLegacyPlayer(old) {
  if (!old) return null;

  const p = {};

  // ------------------------------------------------------------
  // BASIC IDENTITY
  // ------------------------------------------------------------
  p.username = old.username;
  p.level = old.level ?? 1;
  p.race = old.race ?? null;
  p.subrace = old.subrace ?? null;
  p.profession = old.profession ?? null;
  p.family = old.family ?? null;
  p.element = old.element ?? null;

  // ------------------------------------------------------------
  // XP / PROGRESSION
  // ------------------------------------------------------------
  p.xp = old.exp ?? old.xp ?? 0;
  p.xpRequired = old.xpRequired ?? 0; // You can compute this later

  // ------------------------------------------------------------
  // HP / MANA
  // ------------------------------------------------------------
  p.hpCurrent = old.hp ?? old.hpCurrent ?? 1;
  p.hpMax = old.hpMax ?? p.hpCurrent;
  p.manaCurrent = old.mana ?? old.manaCurrent ?? 0;
  p.manaMax = old.manaMax ?? p.manaCurrent;

  // ------------------------------------------------------------
  // CORE COMBAT STATS
  // ------------------------------------------------------------
  p.atk = old.atk ?? 1;
  p.def = old.def ?? 0;
  p.speed = old.speed ?? 1;
  p.critChance = old.critChance ?? 0.05;
  p.critDamage = old.critDamage ?? 1.5;
  p.elementAffinity = old.elementAffinity ?? {};

  // ------------------------------------------------------------
  // EQUIPMENT (convert stats → bonuses)
  // ------------------------------------------------------------
  p.equipment = {};
  if (old.equipment && typeof old.equipment === "object") {
    for (const slot of Object.keys(old.equipment)) {
      const item = old.equipment[slot];
      if (!item) continue;

      p.equipment[slot] = {
        name: item.name,
        rarity: item.rarity ?? "common",
        level: item.level ?? 1,
        bonuses: item.stats ?? {}, // rename stats → bonuses
      };
    }
  }

  // ------------------------------------------------------------
  // INVENTORY
  // ------------------------------------------------------------
  p.inventory = Array.isArray(old.inventory) ? old.inventory : [];

  // ------------------------------------------------------------
  // ABILITIES (convert slot map → array)
  // ------------------------------------------------------------
  p.abilities = [];

  if (old.abilities && typeof old.abilities === "object") {
    for (const slot of Object.keys(old.abilities)) {
      const key = old.abilities[slot];

      p.abilities.push({
        key,
        name: formatAbilityName(key),
        icon: `/assets/abilities/${key}.png`,
        description: "(No description available — legacy ability)",
        cooldown: old.cooldowns?.[key] ?? 0,
      });
    }
  }

  // ------------------------------------------------------------
  // ULTIMATE (legacy KV has none)
  // ------------------------------------------------------------
  p.ultimate = null;
  p.ultimateCharge = 0;
  p.ultimateChargeRequired = 100;

  // ------------------------------------------------------------
  // STATUS EFFECTS
  // ------------------------------------------------------------
  p.statusEffects = [];

  if (Array.isArray(old.status)) {
    p.statusEffects = old.status.map(s => ({
      name: s.name ?? "Unknown",
      duration: s.duration ?? 0,
      stacks: s.stacks ?? 1,
      description: s.description ?? "",
    }));
  }

  // activeEffects (object) → merge into statusEffects
  if (old.activeEffects && typeof old.activeEffects === "object") {
    for (const key of Object.keys(old.activeEffects)) {
      const eff = old.activeEffects[key];
      p.statusEffects.push({
        name: key,
        duration: eff.duration ?? 0,
        stacks: eff.stacks ?? 1,
        description: eff.description ?? "",
      });
    }
  }

  // ------------------------------------------------------------
  // TALENT TREE
  // ------------------------------------------------------------
  p.talentTree = Array.isArray(old.talentTree) ? old.talentTree : [];
  p.talentPoints = old.talentPoints ?? 0;

  // ------------------------------------------------------------
  // REGION PROGRESS (regionMeta → regionProgress)
  // ------------------------------------------------------------
  p.regionProgress = {};

  if (old.regionMeta?.visitedRegions) {
    for (const region of Object.keys(old.regionMeta.visitedRegions)) {
      p.regionProgress[region] = 100; // visited = 100%
    }
  }

  // ------------------------------------------------------------
  // ADAPTIVE PROFILE (legacy has none)
  // ------------------------------------------------------------
  p.adaptiveProfile = {
    playerHeals: 0,
    playerBuffs: 0,
    playerShields: 0,
    playerDOTsApplied: 0,
    playerCCsApplied: 0,
  };

  // ------------------------------------------------------------
  // DERIVED STATS (legacy has none)
  // ------------------------------------------------------------
  p.stats = {};
  p.derived = {};

  // ------------------------------------------------------------
  // MISC
  // ------------------------------------------------------------
  p.gold = old.gold ?? 0;
  p.hardcore = old.hardcore ?? false;
  p.transcension = old.transcension ?? false;

  return p;
}

// Helper: turn "backstab" → "Backstab"
function formatAbilityName(key) {
  if (!key) return "Unknown";
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
