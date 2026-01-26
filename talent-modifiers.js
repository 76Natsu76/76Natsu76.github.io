/************************************************************
 * talent-modifiers.js
 * ----------------------------------------------------------
 * Applies profession talent tree and synergy bonuses.
 *
 * Assumes attacker.talents is an object or array you can
 * read from. For now, this is a stub with clear hooks.
 ************************************************************/

export const talentModifiers = {
  modifyDamage(attacker, ability, baseDamage) {
    let dmg = baseDamage;

    // Example:
    // if (attacker.talents?.fire_mastery && ability.combatTags?.includes('fire')) {
    //   dmg *= 1.1;
    // }

    return dmg;
  }
};
