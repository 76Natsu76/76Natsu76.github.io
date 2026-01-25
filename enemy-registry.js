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
    this.families = await fetchJSON("/data/enemy-families.json");
    this.variants = await fetchJSON("/data/enemy-variants.json");
    this.tags = await fetchJSON("/data/enemy-tags.json");
    this.behaviors = await fetchJSON("/data/enemy-behaviors.json");
    this.abilities = await fetchJSON("/data/enemy-abilities.json");
    this.ultimates = await fetchJSON("/data/enemy-ultimates.json");
    this.enemies = await fetchJSON("/data/enemies.json");
    this.regionMap = await fetchJSON("/data/enemy-to-regions.json");
    this.subraceMap = await fetchJSON("/data/enemy-to-subrace.json");
  },

  buildEnemyTemplate(key) {
    const raw = this.enemies[key];
    if (!raw) throw new Error("Unknown enemy: " + key);

    const family = this.families[raw.family];
    const variant = this.variants[raw.variant];

    return {
      ...raw,
      baseHP: family.baseHP,
      baseATK: family.baseATK,
      baseDEF: family.baseDEF,
      elementAffinity: family.elementAffinity,
      behavior: this.behaviors[family.behavior],
      tags: [...(family.tags || []), ...(variant?.tags || [])],
      abilities: variant?.abilities || [],
      ultimate: variant?.ultimate || family.ultimate || null
    };
  }
};
