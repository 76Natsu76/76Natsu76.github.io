// migration.js
// 1) Apps Script row → legacy KV-ish player (migrateAndSave)
// 2) Legacy KV player → full modern schema (resolveLegacyPlayer)

import { PlayerStorage } from "./player-storage.js";

// Universal JSON loader (works everywhere)
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Failed to load " + path);
  return res.json();
}

// Load all game data JSONs
const raceDefs = await loadJSON("./race-definitions.json");
const subraceProfiles = await loadJSON("./subrace-stat-profiles.json");
const professionDefs = await loadJSON("./profession-definitions.json");
const abilityDefs = await loadJSON("./ability-definitions.json");


// -----------------------------
// Helpers
// -----------------------------
function safeParse(value, fallback) {
  try {
    if (typeof value === "string") return JSON.parse(value);
    if (typeof value === "object" && value !== null) return value;
    return fallback;
  } catch {
    return fallback;
  }
}

function computeXpRequired(level) {
  // Simple quadratic curve; adjust if you want your original formula
  return Math.floor(100 * Math.pow(level || 1, 2));
}

function detectPrimaryElement(affinity) {
  if (!affinity || typeof affinity !== "object") return "none";
  const entries = Object.entries(affinity);
  if (!entries.length) return "none";
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function formatAbilityName(key) {
  if (!key) return "Unknown";
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// -----------------------------
// 1) Apps Script row → legacy KV-ish player
// -----------------------------
export function migrateAndSave(old) {
  if (!old || !old.username) {
    throw new Error("Invalid old player object");
  }

  const computed = safeParse(old.computedStatsJSON, {});
  const equipment = safeParse(old.equipment, {});
  const inventory = safeParse(old.inventoryEquipment, []);
  const cooldowns = safeParse(old.cooldownsJSON, {});
  const abilityLevels = safeParse(old.abilityLevelsJSON, {});
  const status = safeParse(old.playerStatusJSON, []);
  const activeEffects = safeParse(old.ActiveEffectsJSON, {});
  const talentTree = safeParse(old.talentTreeJSON, []);
  const regionMeta = safeParse(old.regionMetaJSON, {});

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

  PlayerStorage.save(migrated.username, migrated);
  return migrated;
}

// ============================================================
// 2) Legacy KV player → full modern canonical schema
// ============================================================

function computeBaseStatsFromDefs(old) {
  const race = raceDefs[old.race] || {};
  const subrace = subraceProfiles[old.subrace] || {};
  const prof = professionDefs[old.profession] || {};

  const raceStats = race.baseStats || race.stats || {};
  const subraceStats = subrace.stats || subrace.baseStats || {};
  const profStats = prof.baseStats || prof.stats || prof.bonuses || {};

  const stats = {
    hp: 0,
    atk: 0,
    def: 0,
    speed: 0,
    crit: 0,
    critDmg: 1.5,
    ...raceStats,
    ...subraceStats
  };

  for (const [k, v] of Object.entries(profStats)) {
    stats[k] = (stats[k] || 0) + v;
  }

  return stats;
}

function computeEquipmentBonuses(equipment) {
  const bonuses = { hp: 0, atk: 0, def: 0, speed: 0, crit: 0, critDmg: 0 };
  if (!equipment || typeof equipment !== "object") return bonuses;

  for (const slot of Object.keys(equipment)) {
    const item = equipment[slot];
    if (!item || !item.bonuses) continue;
    for (const [k, v] of Object.entries(item.bonuses)) {
      bonuses[k] = (bonuses[k] || 0) + v;
    }
  }
  return bonuses;
}

function computeDerivedStats(p) {
  return {
    evade: (p.speed || 0) * 0.002,
    block: (p.def || 0) * 0.001,
    critChance: p.crit || 0,
    critDamage: p.critDmg || 1.5,
    powerScore: Math.floor((p.atk || 0) * 1.5 + (p.def || 0) * 1.2 + (p.hpMax || 0) * 0.3)
  };
}

function resolveAbilities(old) {
  const out = [];
  if (!old.abilities || typeof old.abilities !== "object") return out;

  for (const slot of Object.keys(old.abilities)) {
    const key = old.abilities[slot];
    if (!key) continue;

    const def = abilityDefs[key];

    if (!def) {
      out.push({
        key,
        name: formatAbilityName(key),
        description: "(Unknown legacy ability)",
        cooldown: old.cooldowns?.[key] ?? 0,
        icon: "/assets/abilities/default.png"
      });
      continue;
    }

    out.push({
      key,
      name: def.name || formatAbilityName(key),
      description: def.description || "",
      cooldown: def.cooldown ?? (old.cooldowns?.[key] ?? 0),
      icon: def.icon || `/assets/abilities/${key}.png`,
      type: def.type,
      scaling: def.scaling
    });
  }

  return out;
}

export function resolveLegacyPlayer(old) {
  if (!old) return null;

  const p = {};

  // Identity
  p.username = old.username;
  p.level = old.level ?? 1;
  p.race = old.race ?? "human";
  p.subrace = old.subrace ?? null;
  p.profession = old.profession ?? "adventurer";

  // XP
  p.xp = old.exp ?? old.xp ?? 0;
  p.xpRequired = computeXpRequired(p.level);

  // Element + family
  p.elementAffinity = old.elementAffinity ?? {};
  p.element = detectPrimaryElement(p.elementAffinity);
  p.family = old.family ?? old.regionMeta?.family ?? null;

  // Equipment (normalize stats → bonuses)
  p.equipment = {};
  if (old.equipment && typeof old.equipment === "object") {
    for (const slot of Object.keys(old.equipment)) {
      const item = old.equipment[slot];
      if (!item) continue;
      p.equipment[slot] = {
        name: item.name,
        rarity: item.rarity ?? "common",
        level: item.level ?? 1,
        bonuses: item.bonuses || item.stats || {}
      };
    }
  }

  // Inventory
  p.inventory = Array.isArray(old.inventory) ? old.inventory : [];

  // Abilities
  p.abilities = resolveAbilities(old);

  // Status Effects
  p.statusEffects = [];
  if (Array.isArray(old.status)) {
    p.statusEffects.push(
      ...old.status.map((s) => ({
        name: s.name ?? "Unknown",
        duration: s.duration ?? 0,
        stacks: s.stacks ?? 1,
        description: s.description ?? ""
      }))
    );
  }
  if (old.activeEffects && typeof old.activeEffects === "object") {
    for (const key of Object.keys(old.activeEffects)) {
      const eff = old.activeEffects[key];
      p.statusEffects.push({
        name: key,
        duration: eff.duration ?? 0,
        stacks: eff.stacks ?? 1,
        description: eff.description ?? ""
      });
    }
  }

  // Talent Tree
  p.talentTree = Array.isArray(old.talentTree) ? old.talentTree : [];
  p.talentPoints = old.talentPoints ?? 0;

  // Region Progress
  p.regionProgress = {};
  if (old.regionMeta?.visitedRegions) {
    for (const region of Object.keys(old.regionMeta.visitedRegions)) {
      p.regionProgress[region] = 100;
    }
  }

  // Base stats from race/subrace/profession
  const base = computeBaseStatsFromDefs(old);

  // Equipment bonuses
  const eq = computeEquipmentBonuses(p.equipment);

  // Final stats
  p.hpMax = (old.hpMax ?? base.hp ?? 10) + (eq.hp ?? 0);
  p.hpCurrent = Math.min(old.hp ?? p.hpMax, p.hpMax);

  p.atk = (old.atk ?? base.atk ?? 1) + (eq.atk ?? 0);
  p.def = (old.def ?? base.def ?? 0) + (eq.def ?? 0);
  p.speed = (old.speed ?? base.speed ?? 1) + (eq.speed ?? 0);

  p.crit = (old.critChance ?? base.crit ?? 0) + (eq.crit ?? 0);
  p.critDmg = (old.critDamage ?? base.critDmg ?? 1.5) + (eq.critDmg ?? 0);

  // Derived stats
  p.stats = {
    hp: p.hpMax,
    atk: p.atk,
    def: p.def,
    speed: p.speed,
    crit: p.crit,
    critDmg: p.critDmg
  };
  p.derived = computeDerivedStats(p);

  // Adaptive profile (fresh for legacy)
  p.adaptiveProfile = {
    playerHeals: 0,
    playerBuffs: 0,
    playerShields: 0,
    playerDOTsApplied: 0,
    playerCCsApplied: 0
  };

  // Misc
  p.gold = old.gold ?? 0;
  p.hardcore = old.hardcore ?? false;
  p.transcension = old.transcension ?? false;

  return p;
}
