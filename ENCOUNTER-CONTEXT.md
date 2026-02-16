# Encounter Context — Identity Integration

The encounter context is the unified object that merges:
- region identity
- biome identity
- subregion identity
- world state
- season
- crisis
- weather
- hazard
- variant
- anomaly
- migration
- global modifier

Identity influences encounters in three major ways:

---

## 1. Encounter Weighting

`applyIdentityBiases(baseWeights, ctx)` merges:

- biome.encounterBias
- region.traits
- subregion.encounterBias

This determines:
- which families appear
- how often
- at what tiers

---

## 2. Environmental Modifiers

Biome combatModifiers apply during fight initialization:
- enemyATKMult
- enemyDEFMult
- enemyEvasionMult
- playerAccuracyMult
- elemental multipliers

---

## 3. Flavor

Identity provides:
- region personality
- biome flavor lines
- subregion quirks

These appear in:
- encounter debug
- world map
- region info
- fight logs (optional)
