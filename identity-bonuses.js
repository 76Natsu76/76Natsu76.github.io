// identity-bonuses.js
// Phase F10 — Identity-Based Meta Progression

/**
 * Tracks how many enemies of each identity the player has defeated.
 * Structure:
 *   identityKillCounts = {
 *     fire: 12,
 *     void: 5,
 *     beast: 20,
 *     wraith: 3,
 *     ...
 *   }
 */
export const identityKillCounts = {};

/**
 * Permanent bonuses unlocked when thresholds are reached.
 * Each entry:
 *   threshold: number of kills required
 *   bonus: object describing the permanent stat or effect
 *   applied: boolean to prevent re-applying
 */
export const IDENTITY_BONUSES = {
  // ELEMENT BONUSES
  fire: {
    threshold: 10,
    bonus: { fireResist: 0.02 }, // +2% fire resistance
    applied: false
  },
  ice: {
    threshold: 10,
    bonus: { iceResist: 0.02 },
    applied: false
  },
  electric: {
    threshold: 10,
    bonus: { lightningResist: 0.02 },
    applied: false
  },
  void: {
    threshold: 10,
    bonus: { corruptionResist: 0.03 },
    applied: false
  },
  holy: {
    threshold: 10,
    bonus: { holyResist: 0.02 },
    applied: false
  },

  // SUBRACE BONUSES
  beast: {
    threshold: 20,
    bonus: { beastDamage: 0.05 }, // +5% damage vs beasts
    applied: false
  },
  undead: {
    threshold: 20,
    bonus: { undeadDamage: 0.05 },
    applied: false
  },
  construct: {
    threshold: 20,
    bonus: { constructDamage: 0.05 },
    applied: false
  },

  // PROFESSION BONUSES
  pyromancer: {
    threshold: 5,
    bonus: { spellPower: 0.02 }, // +2% spell power
    applied: false
  },
  warrior: {
    threshold: 5,
    bonus: { physicalDamage: 0.02 },
    applied: false
  },
  rogue: {
    threshold: 5,
    bonus: { critChance: 0.01 },
    applied: false
  },

  // VARIANT BONUSES
  elite: {
    threshold: 5,
    bonus: { rareDropChance: 0.05 }, // +5% rare drop chance
    applied: false
  },
  champion: {
    threshold: 3,
    bonus: { rareDropChance: 0.10 },
    applied: false
  },
  mythic: {
    threshold: 1,
    bonus: { mythicAffinity: true }, // unlocks special cosmetic or title
    applied: false
  }
};

/**
 * Applies a bonus to the player permanently.
 * This function is intentionally simple — your player system
 * can interpret these bonuses however it wants.
 */
export function applyIdentityBonusToPlayer(player, bonus) {
  if (!player || !bonus) return;

  for (const [key, value] of Object.entries(bonus)) {
    // Additive bonuses
    if (typeof value === "number") {
      player[key] = (player[key] || 0) + value;
    }

    // Boolean unlocks (cosmetics, titles, etc.)
    if (value === true) {
      player[key] = true;
    }
  }
}

/**
 * Called whenever an enemy is defeated.
 * Increments kill counters and checks for bonus unlocks.
 */
export function registerIdentityKill(enemy, player) {
  if (!enemy || !player) return;

  // ELEMENT
  if (enemy.element) {
    identityKillCounts[enemy.element] =
      (identityKillCounts[enemy.element] || 0) + 1;
  }

  // SUBRACE
  if (enemy.subrace) {
    identityKillCounts[enemy.subrace] =
      (identityKillCounts[enemy.subrace] || 0) + 1;
  }

  // PROFESSION
  if (enemy.profession) {
    identityKillCounts[enemy.profession] =
      (identityKillCounts[enemy.profession] || 0) + 1;
  }

  // VARIANT
  if (enemy.variant) {
    identityKillCounts[enemy.variant] =
      (identityKillCounts[enemy.variant] || 0) + 1;
  }

  // Check for unlocks
  for (const [identity, data] of Object.entries(IDENTITY_BONUSES)) {
    if (data.applied) continue;

    const count = identityKillCounts[identity] || 0;
    if (count >= data.threshold) {
      applyIdentityBonusToPlayer(player, data.bonus);
      data.applied = true;

      if (player.log) {
        player.log.push(
          `🎉 Identity Mastery: You unlocked a permanent bonus for defeating many ${identity} enemies!`
        );
      }
    }
  }
}
