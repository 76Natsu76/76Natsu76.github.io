// player-registry.js
// Centralized player model + helpers for the GitHub frontend.
// All sheet/App Script specifics are handled by api.js (server-side).

/****************************************************
 * PROFESSION BONUS STATS
 * (ported directly from legacy backend)
 ****************************************************/
export const PROFESSION_BONUS_STATS = {
  // ============================
  // COMBAT PROFESSIONS (20 pts)
  // ============================
  acolyte:      { hp: 5, atk: 3, def: 6, crit: 1, speed: 5, element: { holy: 7 } },
  adept:        { hp: 3, atk: 6, def: 3, crit: 2, speed: 6, element: { arcane: 5 } },
  apocalypse:   { hp: 6, atk: 8, def: 4, crit: 1, speed: 1, element: { chaos: 10, dark: 7 } },
  apprentice:   { hp: 2, atk: 5, def: 2, crit: 3, speed: 8, element: { arcane: 3 } },
  archer:       { hp: 3, atk: 5, def: 3, crit: 5, speed: 4, element: {} },
  assassin:     { hp: 2, atk: 5, def: 2, crit: 7, speed: 4, element: {} },
  berserker:    { hp: 4, atk: 8, def: 2, crit: 4, speed: 2, element: {} },
  bozo:         { hp: 1, atk: 1, def: 1, crit: 4, speed: 5, element: { chaos: 10 } },
  cleric:       { hp: 6, atk: 3, def: 6, crit: 1, speed: 4, element: { holy: 6 } },
  corrupted:    { hp: 3, atk: 5, def: 3, crit: 3, speed: 6, element: { dark: 4, poison: 4 } },
  druid:        { hp: 5, atk: 4, def: 5, crit: 2, speed: 4, element: { nature: 8 } },
  guardian:     { hp: 8, atk: 3, def: 7, crit: 1, speed: 1, element: {} },
  healer:       { hp: 6, atk: 2, def: 6, crit: 2, speed: 4, element: { holy: 8 } },
  mage:         { hp: 2, atk: 8, def: 2, crit: 2, speed: 6, element: { arcane: 8 } },
  monk:         { hp: 5, atk: 4, def: 4, crit: 3, speed: 4, element: { light: 3 } },
  necromancer:  { hp: 3, atk: 6, def: 3, crit: 2, speed: 6, element: { poison: 5, dark: 5 } },
  paladin:      { hp: 7, atk: 4, def: 6, crit: 1, speed: 2, element: { holy: 6 } },
  ranger:       { hp: 4, atk: 4, def: 4, crit: 4, speed: 4, element: { nature: 5 } },
  rogue:        { hp: 2, atk: 5, def: 2, crit: 7, speed: 4, element: {} },
  rot:          { hp: 6, atk: 4, def: 5, crit: 1, speed: 4, element: { decay: 8 } },
  shaman:       { hp: 4, atk: 5, def: 4, crit: 2, speed: 5, element: { lightning: 5, nature: 5 } },
  thief:        { hp: 2, atk: 4, def: 2, crit: 6, speed: 6, element: {} },
  trainee:      { hp: 6, atk: 3, def: 5, crit: 1, speed: 5, element: {} },
  trickster:    { hp: 2, atk: 3, def: 2, crit: 7, speed: 6, element: { illusion: 8 } },
  void:         { hp: 3, atk: 7, def: 3, crit: 2, speed: 5, element: { void: 8 } },
  warlock:      { hp: 2, atk: 8, def: 2, crit: 2, speed: 6, element: { dark: 10 } },
  warrior:      { hp: 6, atk: 5, def: 5, crit: 2, speed: 2, element: {} },
  witch:        { hp: 2, atk: 7, def: 2, crit: 2, speed: 7, element: { dark: 8 } },

  // ============================
  // CRAFTING PROFESSIONS (20 pts)
  // ============================
  alchemist:     { hp: 3, atk: 4, def: 3, crit: 2, speed: 8, crafting: { alchemy: 12 } },
  artificer:     { hp: 3, atk: 6, def: 3, crit: 2, speed: 6, crafting: { enchanting: 12 } },
  blacksmith:    { hp: 6, atk: 4, def: 6, crit: 1, speed: 3, crafting: { metal: 10 } },
  carpenter:     { hp: 6, atk: 4, def: 6, crit: 1, speed: 3, crafting: { woodworking: 12 } },
  chef:          { hp: 6, atk: 4, def: 5, crit: 1, speed: 4, crafting: { cooking: 10 } },
  fisherman:     { hp: 5, atk: 4, def: 4, crit: 1, speed: 6, gathering: { fishing: 12 } },
  herbalist:     { hp: 4, atk: 3, def: 4, crit: 2, speed: 7, gathering: { herbalism: 12 } },
  leatherworker: { hp: 5, atk: 4, def: 5, crit: 2, speed: 4, crafting: { leatherworking: 10 } },
  miner:         { hp: 7, atk: 4, def: 6, crit: 2, speed: 1, gathering: { mining: 12 } },
  ritualist:     { hp: 6, atk: 2, def: 3, crit: 4, speed: 5, gathering: { ritual: 12 } },
  spelunker:     { hp: 7, atk: 4, def: 6, crit: 1, speed: 2, gathering: { mining: 12 } },
  tinkerer:      { hp: 4, atk: 5, def: 4, crit: 2, speed: 5, crafting: { engineering: 12 } },
  weaver:        { hp: 3, atk: 3, def: 4, crit: 2, speed: 8, crafting: { tailoring: 10 } },
};

/****************************************************
 * PROFESSION CHARGE RULES
 ****************************************************/
export const PROFESSION_CHARGE_RULES = {
  warrior:   { attack: 8,  hitTaken: 4,  crit: 6,  turnStart: 2 },
  paladin:   { attack: 6,  hitTaken: 6,  crit: 4,  turnStart: 3 },
  mage:      { attack: 2,  manaSpent: 10, turnStart: 3 },
  healer:    { healingDone: 8, turnStart: 4 },
  rogue:     { attack: 6,  crit: 8,  turnStart: 2 },
  berserker: { hitTaken: 10, attack: 5, turnStart: 1 },
  // etc…
};

export const ENEMY_CHARGE_RULES = {
  default: { turnStart: 10, hitTaken: 5 }
};

/****************************************************
 * PLAYER REGISTRY
 * - Frontend cache + helpers
 * - All network I/O should go through api.js
 ****************************************************/

// If api.js exposes a generic callApi, we can wire it here.
// Adjust these imports to match your actual api.js.
import { api } from "./api.js";

export const PlayerRegistry = {
  currentPlayer: null,

  /**
   * Load a player by username from backend.
   * Returns a normalized player object.
   */
  async loadPlayer(username) {
    const raw = await api.getPlayer(username);
    const player = this.normalizePlayer(raw);
    this.currentPlayer = player;
    return player;
  },

  /**
   * Save a player back to backend.
   * Expects a normalized player object.
   */
  async savePlayer(player) {
    // You can strip any client-only fields here if needed.
    await api.savePlayer(player.username, player);
    this.currentPlayer = player;
  },

  /**
   * Ensure all expected fields exist on the player object.
   * This is the spiritual successor of mapRowToPlayer_ but
   * for JSON instead of raw sheet rows.
   */
  normalizePlayer(raw = {}) {
    return {
      username: raw.username || "",
      level: Number(raw.level || 1),
      race: raw.race || null,
      subrace: raw.subrace || null,
      profession: raw.profession || null,

      exp: Number(raw.exp || 0),
      gold: Number(raw.gold || 0),
      hardcore: raw.hardcore || false,
      transcension: raw.transcension || 0,

      hpCurrent: Number(raw.hpCurrent || 0),
      manaCurrent: Number(raw.manaCurrent || 0),
      speedBase: Number(raw.speedBase || 0),

      computedStatsJSON: raw.computedStatsJSON || {},

      items: raw.items || [],
      equipment: raw.equipment || {},
      inventoryEquipment: raw.inventoryEquipment || [],

      ability1: raw.ability1 || null,
      ability2: raw.ability2 || null,
      ability3: raw.ability3 || null,
      ultimate: raw.ultimate || null,

      cooldowns: raw.cooldowns || {},
      abilityLevels: raw.abilityLevels || {},
      abilityPoints: Number(raw.abilityPoints || 0),

      playerStatusEffects: raw.playerStatusEffects || [],
      activeEffects: raw.activeEffects || {},

      talentPoints: Number(raw.talentPoints || 0),
      talentTree: raw.talentTree || {},

      regionMetaJSON: raw.regionMetaJSON || {},

      regenTimeStamp: raw.regenTimeStamp || null,
      regenBuffUntil: raw.regenBuffUntil || null,

      role: raw.role || "player"
    };
  },

  /**
   * Apply profession bonus stats to a base stat block.
   * baseStats: { hp, atk, def, crit, speed, element: {..}, crafting: {..}, gathering: {..} }
   */
  applyProfessionBonuses(baseStats, professionKey) {
    const bonus = PROFESSION_BONUS_STATS[professionKey];
    if (!bonus) return { ...baseStats };

    const merged = {
      ...baseStats,
      hp:    (baseStats.hp    || 0) + (bonus.hp    || 0),
      atk:   (baseStats.atk   || 0) + (bonus.atk   || 0),
      def:   (baseStats.def   || 0) + (bonus.def   || 0),
      crit:  (baseStats.crit  || 0) + (bonus.crit  || 0),
      speed: (baseStats.speed || 0) + (bonus.speed || 0),
      element: {
        ...(baseStats.element || {}),
        ...(bonus.element || {})
      },
      crafting: {
        ...(baseStats.crafting || {}),
        ...(bonus.crafting || {})
      },
      gathering: {
        ...(baseStats.gathering || {}),
        ...(bonus.gathering || {})
      }
    };

    return merged;
  },

  /**
   * Get charge rules for a given profession (player) or enemy.
   */
  getChargeRulesForProfession(professionKey) {
    return PROFESSION_CHARGE_RULES[professionKey] || null;
  },

  getEnemyChargeRules(enemyKey) {
    // For now we only have a default; later we can branch by family/variant.
    return ENEMY_CHARGE_RULES[enemyKey] || ENEMY_CHARGE_RULES.default;
  }
};
