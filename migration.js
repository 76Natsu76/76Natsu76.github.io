// migration.js
// Legacy KV player → full modern canonical player schema

import { PlayerStorage } from "./player-storage.js";

// -----------------------------
// JSON loader (root-relative)
// -----------------------------
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Failed to load " + path);
  return res.json();
}

// Preload all game data
const [
  abilityDefs,
  raceDefs,
  subraceProfiles,
  professionDefs,
  talentTrees
] = await Promise.all([
  loadJSON("./ability-definitions.json"),
  loadJSON("./race-definitions.json"),
  loadJSON("./subrace-stat-profiles.json"),
  loadJSON("./profession-definitions.json"),
  loadJSON("./profession-talent-trees.json")
]);

// -----------------------------
// Helpers
// -----------------------------
function computeXpRequired(level) {
  const lvl = level || 1;
  return Math.floor(100 * lvl * lvl);
}

function detectPrimaryElement(affinity) {
  if (!affinity || typeof affinity !== "object") return "none";
  const entries = Object.entries(affinity);
  if (!entries.length) return "none";
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function round3(x) {
  return Number((x ?? 0).toFixed(3));
}

function mapSubrace(race, subrace) {
  if (race === "elf" && subrace === "dark_elf") return "shadow_elf";
  return subrace;
}

// -----------------------------
// Stat computation
// -----------------------------
function computeBaseFromLegacyAndDefs(old, raceKey, subraceKey, professionKey) {
  const race = raceDefs[raceKey] || {};
  const raceMods = race.baseModifiers || {};

  const subraceBlock = subraceProfiles[raceKey] || {};
  const subrace = subraceBlock[subraceKey] || {};
  const growth = subrace.growth || {};

  const prof = professionDefs[professionKey] || {};
  const baseBonuses = prof.baseBonuses || {};

  const legacy = {
    hp: old.hpMax ?? old.hp ?? 10,
    atk: old.atk ?? 1,
    def: old.def ?? 0,
    speed: old.speed ?? 1,
    mana: old.manaMax ?? old.mana ?? 0,
    crit: old.critChance ?? 0,
    critDmg: old.critDamage ?? 1.5
  };

  const hpMult =
    (raceMods.hpMult ?? 1) *
    (growth.hp ?? 1);
  const atkMult =
    (raceMods.atkMult ?? 1) *
    (growth.atk ?? 1);
  const defMult =
    (raceMods.defMult ?? 1) *
    (growth.def ?? 1);
  const speedMult =
    (raceMods.speedMult ?? 1) *
    (growth.speed ?? 1);
  const manaMult =
    (raceMods.manaMult ?? 1) *
    (growth.mana ?? 1);

  const base = {
    hp: legacy.hp * hpMult,
    atk: legacy.atk * atkMult,
    def: legacy.def * defMult,
    speed: legacy.speed * speedMult,
    mana: legacy.mana * manaMult,
    crit: legacy.crit + (baseBonuses.critChance ?? 0),
    critDmg: legacy.critDmg,
    evade: baseBonuses.evadeChance ?? 0
  };

  return base;
}

function computeEquipmentBonuses(equipment) {
  const out = { hp: 0, atk: 0, def: 0, speed: 0, crit: 0, critDmg: 0, evade: 0 };
  if (!equipment || typeof equipment !== "object") return out;

  for (const slot of Object.keys(equipment)) {
    const item = equipment[slot];
    if (!item || !item.bonuses) continue;
    for (const [k, v] of Object.entries(item.bonuses)) {
      if (out[k] === undefined) out[k] = 0;
      out[k] += v;
    }
  }
  return out;
}

function computeDerivedStats(p) {
  return {
    evade: round3((p.evade ?? 0) + (p.speed || 0) * 0.002),
    block: round3((p.def || 0) * 0.001),
    critChance: round3(p.crit || 0),
    critDamage: round3(p.critDmg || 1.5),
    powerScore: Math.floor(
      (p.atk || 0) * 1.5 + (p.def || 0) * 1.2 + (p.hpMax || 0) * 0.3
    )
  };
}

// -----------------------------
// Ability resolution (nested by profession)
// -----------------------------
function resolveAbilities(old, profession) {
  const out = [];
  if (!old.abilities || typeof old.abilities !== "object") return out;

  const profBlock = abilityDefs[profession] || {};
  const globalBlock = abilityDefs.global || {};

  for (const slot of Object.keys(old.abilities)) {
    const key = old.abilities[slot];
    if (!key) continue;

    const def =
      profBlock[key] ||
      globalBlock[key];

    if (!def) {
      out.push({
        key,
        name: key,
        description: "(Unknown legacy ability)",
        cooldown: old.cooldowns?.[key] ?? 0,
        icon: "/assets/abilities/default.png"
      });
      continue;
    }

    out.push({
      key: def.key || key,
      name: def.name || key,
      description: def.description || "",
      cooldown: def.cooldown ?? (old.cooldowns?.[key] ?? 0),
      icon: def.icon || `/assets/abilities/${key}.png`,
      combatTags: def.combatTags || [],
      statusEffects: def.statusEffects || [],
      basePower: def.basePower ?? 1,
      scalingPerLevel: def.scalingPerLevel ?? 0
    });
  }

  return out;
}

// -----------------------------
// Talent tree resolution
// -----------------------------
function resolveTalentTreeDefinition(profession) {
  return talentTrees[profession] || null;
}

function resolveTalentTree(old) {
  if (Array.isArray(old.talentTree)) return old.talentTree;
  return [];
}

// -----------------------------
// MAIN RESOLVER
// -----------------------------
export async function resolveLegacyPlayer(old) {
  if (!old) return null;

  const p = {};

  // Identity
  p.username = old.username;
  p.level = old.level ?? 1;
  p.race = old.race ?? "human";
  p.subrace = mapSubrace(p.race, old.subrace ?? null);
  p.profession = old.profession ?? "adventurer";

  // XP
  p.xp = old.exp ?? old.xp ?? 0;
  p.xpRequired = computeXpRequired(p.level);

  // Element affinity + element
  const race = raceDefs[p.race] || {};
  const raceAffinity = race.elementAffinity || {};

  const subraceBlock = subraceProfiles[p.race] || {};
  const subrace = subraceBlock[p.subrace] || {};
  const subraceAffinity = subrace.elementAffinity || {};

  const legacyAffinity = old.elementAffinity || {};

  p.elementAffinity = {
    ...raceAffinity,
    ...subraceAffinity,
    ...legacyAffinity
  };
  p.element = detectPrimaryElement(p.elementAffinity);

  // Family
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
  p.abilities = resolveAbilities(old, p.profession);

  // Status Effects
  p.statusEffects = [];
  if (Array.isArray(old.status)) {
    p.statusEffects.push(...old.status);
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

  // Region Progress
  p.regionProgress = {};
  if (old.regionMeta?.visitedRegions) {
    for (const region of Object.keys(old.regionMeta.visitedRegions)) {
      p.regionProgress[region] = 100;
    }
  }

  // Talent tree
  p.talentTreeDefinition = resolveTalentTreeDefinition(p.profession);
  p.talentTree = resolveTalentTree(old);
  p.talentPoints = old.talentPoints ?? 0;

  // Base stats from legacy × race × subrace × profession
  const base = computeBaseFromLegacyAndDefs(
    old,
    p.race,
    p.subrace,
    p.profession
  );

  // Equipment bonuses
  const eq = computeEquipmentBonuses(p.equipment);

  // Final stats
  p.hpMax = Math.max(1, Math.floor((base.hp || 10) + (eq.hp ?? 0)));
  p.hpCurrent = Math.min(old.hp ?? p.hpMax, p.hpMax);

  p.atk = Math.floor((base.atk || 1) + (eq.atk ?? 0));
  p.def = Math.floor((base.def || 0) + (eq.def ?? 0));
  p.speed = Math.floor((base.speed || 1) + (eq.speed ?? 0));

  p.manaMax = Math.floor((base.mana || 0));
  p.mana = Math.min(old.mana ?? p.manaMax, p.manaMax);

  p.crit = round3((base.crit || 0) + (eq.crit ?? 0));
  p.critDmg = round3((base.critDmg || 1.5) + (eq.critDmg ?? 0));
  p.evade = round3((base.evade || 0) + (eq.evade ?? 0));

  // Stats + derived
  p.stats = {
    hp: p.hpMax,
    atk: p.atk,
    def: p.def,
    speed: p.speed,
    crit: p.crit,
    critDmg: p.critDmg
  };
  p.derived = computeDerivedStats(p);

  // Adaptive profile
  p.adaptiveProfile = {
    playerHeals: old.adaptiveProfile?.playerHeals ?? 0,
    playerBuffs: old.adaptiveProfile?.playerBuffs ?? 0,
    playerShields: old.adaptiveProfile?.playerShields ?? 0,
    playerDOTsApplied: old.adaptiveProfile?.playerDOTsApplied ?? 0,
    playerCCsApplied: old.adaptiveProfile?.playerCCsApplied ?? 0
  };

  // Misc
  p.gold = old.gold ?? 0;
  p.hardcore = old.hardcore ?? false;
  p.transcension = old.transcension ?? false;

  // Persist locally as the new canonical object (optional but nice)
  try {
    PlayerStorage.save(p.username, p);
  } catch (e) {
    // ignore if PlayerStorage isn't needed here
  }
  return p;
}
