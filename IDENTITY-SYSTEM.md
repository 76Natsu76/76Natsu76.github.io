# Identity System — Phase E Documentation

The Identity System defines the personality, flavor, and simulation behavior of
every region, biome, and subregion in the world. It is the foundation for
encounter generation, world simulation, map flavor, and environmental logic.

This system is composed of three canonical identity layers:

---

## 1. Region Identity (`region-identity.js`)

Each region defines:
- **archetype** — high-level category (forestlands, stormlands, voidlands, etc.)
- **personality** — a one-sentence flavor description
- **traits** — tags that influence encounter weighting
- **biomeAffinity** — which biomes the region resonates with
- **anomalyAffinity** — which anomalies are more likely
- **migrationAffinity** — which migrations are more likely
- **globalResonance** — global environmental hooks
- **stabilityDrift** — how stable the region becomes over time
- **dangerDrift** — how dangerous the region becomes over time

These values feed into:
- encounter weighting
- world simulation drift
- map flavor
- crisis escalation

---

## 2. Biome Identity (`biome-identity.js`)

Each biome defines:
- **tags** — elemental/environmental categories
- **encounterBias** — direct weighting for encounter families
- **hazardPool** — hazards that can appear
- **anomalyBias** — anomalies more likely in this biome
- **migrationBias** — migrations more likely in this biome
- **combatModifiers** — environmental combat effects
- **flavor** — short flavor lines for UI

These values feed into:
- encounter weighting
- hazard selection
- anomaly/migration rolls
- combat modifiers
- map flavor

---

## 3. Subregion Identity (`subregion-identity.js`)

Each subregion defines:
- **tier** — encounter tier baseline
- **type** — descriptive category (grove, ridge, basin, etc.)
- **biome** — biome override
- **quirk** — unique environmental twist
- **encounterBias** — micro-level encounter weighting
- **lootBias** — micro-level loot weighting

These values feed into:
- encounter weighting
- loot tables
- map flavor
- subregion-specific events

---

## Integration Summary

Identity data is used in:

### Encounters
- `applyIdentityBiases` merges region, biome, and subregion biases.
- Region traits add small nudges.
- Biome encounterBias adds strong weighting.
- Subregion encounterBias adds micro-weighting.

### World Simulation
- Region stability/danger drift applied each tick.
- Global resonance hooks influence world-wide events.

### World Map
- Region cards and markers show:
  - region personality
  - biome flavor
  - subregion quirk (if applicable)

### Combat
- Biome combatModifiers applied during fight initialization.

---

## Extending the Identity System

To add a new region/biome/subregion:
1. Add it to the identity file.
2. Add it to region hierarchy.
3. Add it to region-to-biome mapping.
4. Add enemies to REGION_ENEMIES.
5. Done — identity system handles the rest.

The system is fully modular and future-proof.
