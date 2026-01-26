/************************************************************
 * world-modifiers.js
 * ----------------------------------------------------------
 * Central hook for biome, weather, region, and world-state
 * based combat modifications.
 *
 * For now, returns damage unchanged with clear extension
 * points.
 ************************************************************/

// Example context expectations:
// context.world = {
//   regionId,
//   biomeId,
//   weatherId,
//   season,
//   tick
// };

export const worldModifiers = {
  modifyDamage(attacker, defender, ability, baseDamage) {
    let dmg = baseDamage;

    // Example: elemental bonus in certain biomes
    // if (context.world?.biomeId === 'volcanic' && ability.combatTags?.includes('fire')) {
    //   dmg *= 1.1;
    // }

    return dmg;
  }
};
