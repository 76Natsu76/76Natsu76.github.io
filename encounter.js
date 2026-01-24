// encounters.js
// Client-side encounter resolver for the GitHub RPG.
// Uses WORLD_DATA and player data to generate encounters.

//
// ===============================
// Utility: weighted random choice
// ===============================
function weightedChoice(list) {
  const total = list.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;

  for (const item of list) {
    if (roll < item.weight) return item;
    roll -= item.weight;
  }
  return list[list.length - 1];
}

//
// ===============================
// Utility: random from array
// ===============================
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

//
// ===============================
// Main: resolve encounter
// ===============================
function resolveEncounter(regionKey, player) {
  const region = WORLD_DATA.regions[regionKey];
  if (!region) {
    console.error("Unknown region:", regionKey);
    return null;
  }

  // -------------------------------
  // 1. Determine weather
  // -------------------------------
  const weather = pick(region.weatherPool);

  // -------------------------------
  // 2. Determine event
  // -------------------------------
  const event = pick(region.eventPool);

  // -------------------------------
  // 3. Determine enemy family
  // -------------------------------
  const familyEntry = weightedChoice(region.enemyFamilies);
  const family = familyEntry.id;

  // -------------------------------
  // 4. Determine rarity
  // -------------------------------
  const rarityEntry = weightedChoice(region.rarityWeights);
  const rarity = rarityEntry.id;

  // -------------------------------
  // 5. Determine enemy level
  // -------------------------------
  const [minL, maxL] = region.levelRange;
  const enemyLevel = Math.floor(
    minL + Math.random() * (maxL - minL + 1)
  );

  // -------------------------------
  // 6. Determine variant (boss, elite, etc.)
  // -------------------------------
  let variant = "normal";

  if (rarity === "elite") variant = "elite";
  if (rarity === "mythical") variant = "mythical";
  if (rarity === "legendary") variant = "legendary";
  if (rarity === "ancient") variant = "ancient";

  // -------------------------------
  // 7. Build encounter object
  // -------------------------------
  const encounter = {
    region: regionKey,
    biome: region.biome,
    weather,
    event,
    family,
    rarity,
    variant,
    enemyLevel,
    modifiers: region.combatModifiers || {},
    lootModifier: region.lootModifier || 1.0,
    encounterRateMult: region.encounterRateMult || 1.0,
    rareSpawnMult: region.rareSpawnMult || 1.0,
    flavor: region.flavor || ""
  };

  return encounter;
}

//
// ===============================
// Export for global use
// ===============================
window.resolveEncounter = resolveEncounter;
