// enemyRegistry.js — HYBRID FAMILY VERSION

export const EnemyRegistry = {
  families: {},
  variants: {},
  tags: {},
  behaviors: {},
  abilities: {},
  ultimates: {},
  enemies: [],
  regionMap: {},
  subraceMap: {},
  raceMap: {},

  async loadAll() {
    this.families   = await fetchJSON("./enemy-families.json");
    this.variants   = await fetchJSON("./enemy-variants.json");
    this.tags       = await fetchJSON("./enemy-tags.json");
    this.behaviors  = await fetchJSON("./enemy-behaviors.json");
    this.abilities  = await fetchJSON("./enemy-abilities.json");
    this.ultimates  = await fetchJSON("./enemy-ultimates.json");

    // enemies.json is an array
    this.enemies = Object.values(await fetchJSON("./enemies.json"));

    this.regionMap  = await fetchJSON("./enemy-regions.json");
    this.subraceMap = await fetchJSON("./enemy-subrace.json");
    this.raceMap    = await fetchJSON("./enemy-race.json"); // optional but supported
  },

  getEnemy(key) {
    return this.enemies.find(e => e.key === key) || null;
  },

  // ---------------------------------------------------------
  // FAMILY RESOLUTION (Hybrid Tier System)
  // ---------------------------------------------------------
  resolveFamily(raw) {
    // 1. Direct family on enemy
    if (raw.family && this.families[raw.family]) {
      return this.families[raw.family];
    }

    // 2. Subrace → family mapping
    const subrace = raw.subrace || this.subraceMap[raw.key];
    if (subrace && this.families[subrace]) {
      return this.families[subrace];
    }

    // 3. Race → family mapping
    const race = raw.race || this.raceMap[raw.key];
    if (race && this.families[race]) {
      return this.families[race];
    }

    throw new Error(`No valid family found for enemy '${raw.key}'`);
  },

  // ---------------------------------------------------------
  // BASE STAT RESOLUTION (supports null family stats)
  // ---------------------------------------------------------
  resolveBaseStat(rawValue, familyValue, defaultValue = 0) {
    if (rawValue != null) return rawValue;
    if (familyValue != null) return familyValue;
    return defaultValue;
  },

  // ---------------------------------------------------------
  // BUILD ENEMY TEMPLATE
  // ---------------------------------------------------------
  buildEnemyTemplate(key) {
    const raw = this.getEnemy(key);
    if (!raw) throw new Error("Unknown enemy: " + key);

    // --- FAMILY (Hybrid Tier Resolution) ---
    const family = this.resolveFamily(raw);

    // --- VARIANT ---
    const variant = raw.variant ? this.variants[raw.variant] : null;

    // --- FAMILY + VARIANT MODIFIERS ---
    const famMod = family.familyModifiers || {};
    const varMod = variant?.combatModifiers || {};

    const hpMult  = (famMod.hpMult  ?? 1) * (varMod.hpMult  ?? 1);
    const atkMult = (famMod.atkMult ?? 1) * (varMod.atkMult ?? 1);
    const defMult = (famMod.defMult ?? 1) * (varMod.defMult ?? 1);

    // --- BASE STATS (Hybrid Safe) ---
    const baseHP = this.resolveBaseStat(raw.baseHP, family.baseHP, 50) * hpMult;
    const baseATK = this.resolveBaseStat(raw.baseATK, family.baseATK, 5) * atkMult;
    const baseDEF = this.resolveBaseStat(raw.baseDEF, family.baseDEF, 5) * defMult;

    // --- ELEMENTAL AFFINITY ---
    const elementAffinity = {
      ...(family.elementAffinity || {}),
      ...(variant?.elementAffinity || {})
    };

    // --- BEHAVIOR ---
    const behaviorKey = variant?.behavior || family.behavior;
    const behavior = this.behaviors[behaviorKey] || null;

    // --- TAGS ---
    const tagKeys = [
      ...(family.tags || []),
      ...(variant?.tags || [])
    ];
    const resolvedTags = tagKeys.map(t => this.tags[t]).filter(Boolean);

    // --- ABILITIES ---
    const abilityKeys = [
      ...(family.abilities || []),
      ...(variant?.abilities || [])
    ];
    const resolvedAbilities = abilityKeys.map(a => this.abilities[a]).filter(Boolean);

    // --- ULTIMATE ---
    const ultimateKey = variant?.ultimate || family.ultimate || null;
    const ultimate = ultimateKey ? this.ultimates[ultimateKey] : null;

    // --- REGION ---
    const region = this.regionMap[raw.key] || null;

    // --- SUBRACE ---
    const subrace = raw.subrace || this.subraceMap[raw.key] || null;

    // --- LOOT / EFFECTS ---
    const lootTable = parseMaybeJSON(raw.lootTableJSON) || raw.lootTable || [];
    const activeEffects = parseMaybeJSON(raw.activeEffectsJSON) || raw.activeEffects || [];

    return {
      key: raw.key,
      name: raw.name,

      family: raw.family || family.key,
      variant: raw.variant || null,
      subrace,

      rarity: raw.rarity,
      element: raw.element,
      level: raw.level,

      baseHP,
      baseATK,
      baseDEF,

      elementAffinity,
      behavior,

      tags: resolvedTags,
      abilities: resolvedAbilities,
      ultimate,

      lootTable,
      activeEffects,

      region,

      flavor: variant?.flavor || family.flavor || ""
    };
  }
};

// ---------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------

async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load " + path);
  return await res.json();
}

function parseMaybeJSON(value) {
  if (!value) return null;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
