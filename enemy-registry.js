// enemyRegistry.js

export const EnemyRegistry = {
  families: {},
  variants: {},
  tags: {},
  behaviors: {},
  abilities: {},
  ultimates: {},
  enemies: {},
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
    const variant = raw.variant ? this.variants[raw.variant] : null;

    return {
      key: raw.key,
      name: raw.name,

      family: raw.family,
      variant: raw.variant || null,
      subrace: raw.subrace || this.subraceMap[raw.key] || null,

      rarity: raw.rarity,
      element: raw.element,
      level: raw.level,

      // Base stats (raw + family + variant modifiers)
      baseHP:  (raw.baseHP  ?? family.baseHP)  * (variant?.statModifiers?.hpMult  ?? 1),
      baseATK: (raw.baseATK ?? family.baseATK) * (variant?.statModifiers?.atkMult ?? 1),
      baseDEF: (raw.baseDEF ?? family.baseDEF) * (variant?.statModifiers?.defMult ?? 1),

      // Elemental affinities
      elementAffinity: {
        ...family.elementAffinity,
        ...(variant?.elementAffinity || {})
      },

      // Behavior profile
      behavior: this.behaviors[variant?.behavior || family.behavior],

      // Tags
      tags: [
        ...(family.tags || []),
        ...(variant?.tags || [])
      ],

      // Abilities
      abilities: variant?.abilities || family.abilities || [],

      // Ultimate
      ultimate: variant?.ultimate || family.ultimate || null,

      // Loot
      lootTable: raw.lootTable || [],

      // Effects
      activeEffects: raw.activeEffects || [],

      // Region
      region: raw.region || this.regionMap[raw.key] || null,

      // Flavor
      flavor: variant?.flavor || family.flavor || ""
    };
  }
};

// Helper
async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load " + path);
  return await res.json();
}
