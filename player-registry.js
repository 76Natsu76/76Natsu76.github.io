// ============================================================
// PLAYER REGISTRY — GitHub Architecture (Jan 2026)
// ============================================================
// Loads all profession, item, talent, and ability data.
// Reconstructs full player sheets and computes derived stats.
// ============================================================

export const PlayerRegistry = {
  professions: {},
  professionBonuses: {},
  professionChargeRules: {},
  abilities: {},
  items: {},
  itemEffects: {},
  talentTrees: {},
  leveling: {},
  baseStats: {},

  async loadAll() {
    this.professions          = await fetchJSON("/data/professions.json");
    this.professionBonuses    = await fetchJSON("/data/profession-bonus-stats.json");
    this.professionChargeRules= await fetchJSON("/data/profession-charge-rules.json");

    this.abilities            = await fetchJSON("/data/profession-abilities.json");
    this.items                = await fetchJSON("/data/items.json");
    this.itemEffects          = await fetchJSON("/data/item-effects.json");
    this.talentTrees          = await fetchJSON("/data/profession-talent-trees.json");
    this.leveling             = await fetchJSON("/data/profession-leveling.json");
    this.baseStats            = await fetchJSON("/data/base-stats.json");
  },

  // ------------------------------------------------------------
  // Build a full player sheet from raw sheet data
  // ------------------------------------------------------------
  buildPlayerSheet(raw) {
    const sheet = structuredClone(raw);

    // Start with base stats
    const base = this.baseStats[raw.race] || this.baseStats["default"];
    sheet.stats = {
      hp: base.hp,
      atk: base.atk,
      def: base.def,
      crit: base.crit,
      speed: base.speed,
      element: structuredClone(base.element || {})
    };

    // Apply profession bonuses
    this.applyProfessionBonuses(sheet);

    // Apply talent tree bonuses
    this.applyTalentTree(sheet);

    // Apply equipment
    this.applyEquipment(sheet);

    // Apply active status effects
    this.applyStatusEffects(sheet);

    // Compute derived stats (final)
    this.computeDerivedStats(sheet);

    return sheet;
  },

  // ------------------------------------------------------------
  // Profession bonuses
  // ------------------------------------------------------------
  applyProfessionBonuses(sheet) {
    const prof = sheet.profession?.toLowerCase();
    const bonus = this.professionBonuses[prof];
    if (!bonus) return;

    sheet.stats.hp    += bonus.hp    || 0;
    sheet.stats.atk   += bonus.atk   || 0;
    sheet.stats.def   += bonus.def   || 0;
    sheet.stats.crit  += bonus.crit  || 0;
    sheet.stats.speed += bonus.speed || 0;

    // Elemental bonuses
    if (bonus.element) {
      for (const [el, val] of Object.entries(bonus.element)) {
        sheet.stats.element[el] = (sheet.stats.element[el] || 0) + val;
      }
    }

    // Crafting/gathering (non-combat)
    sheet.crafting = bonus.crafting || {};
    sheet.gathering = bonus.gathering || {};
  },

  // ------------------------------------------------------------
  // Talent tree bonuses
  // ------------------------------------------------------------
  applyTalentTree(sheet) {
    const tree = this.talentTrees[sheet.profession];
    if (!tree) return;

    const chosen = sheet.talentTree || {};

    for (const nodeKey of Object.keys(chosen)) {
      const node = tree[nodeKey];
      if (!node) continue;

      if (node.stats) {
        for (const [stat, val] of Object.entries(node.stats)) {
          if (stat === "element") {
            for (const [el, amt] of Object.entries(val)) {
              sheet.stats.element[el] = (sheet.stats.element[el] || 0) + amt;
            }
          } else {
            sheet.stats[stat] = (sheet.stats[stat] || 0) + val;
          }
        }
      }
    }
  },

  // ------------------------------------------------------------
  // Equipment bonuses
  // ------------------------------------------------------------
  applyEquipment(sheet) {
    const eq = sheet.equipment || {};

    for (const slot of Object.keys(eq)) {
      const itemKey = eq[slot];
      const item = this.items[itemKey];
      if (!item) continue;

      if (item.stats) {
        for (const [stat, val] of Object.entries(item.stats)) {
          if (stat === "element") {
            for (const [el, amt] of Object.entries(val)) {
              sheet.stats.element[el] = (sheet.stats.element[el] || 0) + amt;
            }
          } else {
            sheet.stats[stat] = (sheet.stats[stat] || 0) + val;
          }
        }
      }
    }
  },

  // ------------------------------------------------------------
  // Status effects (buffs/debuffs)
  // ------------------------------------------------------------
  applyStatusEffects(sheet) {
    const effects = sheet.activeEffects || {};

    for (const eff of Object.values(effects)) {
      if (!eff || !eff.stats) continue;

      for (const [stat, val] of Object.entries(eff.stats)) {
        if (stat === "element") {
          for (const [el, amt] of Object.entries(val)) {
            sheet.stats.element[el] = (sheet.stats.element[el] || 0) + amt;
          }
        } else {
          sheet.stats[stat] = (sheet.stats[stat] || 0) + val;
        }
      }
    }
  },

  // ------------------------------------------------------------
  // Derived stats (final combat values)
  // ------------------------------------------------------------
  computeDerivedStats(sheet) {
    const s = sheet.stats;

    sheet.combat = {
      maxHP: Math.round(s.hp * 10 + sheet.level * 5),
      maxMana: Math.round(20 + sheet.level * 3),
      attack: Math.round(s.atk * 2 + sheet.level),
      defence: Math.round(s.def * 2 + sheet.level),
      critChance: Math.min(0.75, s.crit * 0.01),
      speed: Math.max(1, s.speed),
      element: s.element
    };
  },

  // ------------------------------------------------------------
  // Build combat profile for combat engine
  // ------------------------------------------------------------
  getCombatProfile(sheet) {
    return {
      username: sheet.username,
      level: sheet.level,
      profession: sheet.profession,
      subrace: sheet.subrace,
      race: sheet.race,

      hp: sheet.hpCurrent,
      mana: sheet.manaCurrent,

      stats: sheet.combat,
      abilities: this.getAbilitiesForPlayer(sheet),
      ultimate: sheet.ultimate,

      cooldowns: sheet.cooldowns || {},
      statusEffects: sheet.playerStatusEffects || [],
      activeEffects: sheet.activeEffects || {},

      chargeRules: this.professionChargeRules[sheet.profession] 
                || this.professionChargeRules["default"]
    };
  },

  // ------------------------------------------------------------
  // Resolve abilities for the player
  // ------------------------------------------------------------
  getAbilitiesForPlayer(sheet) {
    const keys = [sheet.ability1, sheet.ability2, sheet.ability3].filter(Boolean);
    return keys.map(k => this.abilities[k]).filter(Boolean);
  }
};


// ============================================================
// Helper
// ============================================================
async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load " + path);
  return await res.json();
}
