// enemyRegistry.js

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

  async loadAll() {
    this.families   = await fetchJSON("/data/enemy-families.json");
    this.variants   = await fetchJSON("/data/enemy-variants.json");
    this.tags       = await fetchJSON("/data/enemy-tags.json");
    this.behaviors  = await fetchJSON("/data/enemy-behaviors.json");
    this.abilities  = await fetchJSON("/data/enemy-abilities.json");
    this.ultimates  = await fetchJSON("/data/enemy-ultimates.json");
    this.enemies    = await fetchJSON("/data/enemies.json");
    this.regionMap  = await fetchJSON("/data/enemy-to-regions.json");
    this.subraceMap = await fetchJSON("/data/enemy-to-subrace.json");
  },

  getEnemy(key) {
    return this.enemies.find(e => e.key === key) || null;
  },

  buildEnemyTemplate(key) {
    const raw = this.getEnemy(key);
    if (!raw) throw new Error("Unknown enemy: " + key);

    const family  = this.families[raw.family];
    if (!family) throw new Error("Unknown family: " + raw.family);

    const variant = raw.variant ? this.variants[raw.variant] : null;

    // --- FAMILY + VARIANT MODIFIERS ---
    const famMod = family.familyModifiers || {};
    const varMod = variant?.combatModifiers || {};

    const hpMult  = (famMod.hpMult  ?? 1) * (varMod.hpMult  ?? 1);
    const atkMult = (famMod.atkMult ?? 1) * (varMod.atkMult ?? 1);
    const defMult = (famMod.defMult ?? 1) * (varMod.defMult ?? 1);

    // --- BASE STATS ---
    const baseHP  = (raw.baseHP  ?? family.baseHP)  * hpMult;
    const baseATK = (raw.baseATK ?? family.baseATK) * atkMult;
    const baseDEF = (raw.baseDEF ?? family.baseDEF) * defMult;

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
    const lootTable = parseMaybeJSON(raw.lootTableJSON) || [];
    const activeEffects = parseMaybeJSON(raw.activeEffectsJSON) || [];

    return {
      key: raw.key,
      name: raw.name,

      family: raw.family,
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

// -----------------
// Helper Functions
// -----------------

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
