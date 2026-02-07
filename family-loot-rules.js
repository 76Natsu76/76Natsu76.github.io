// family-loot-rules.js

export const FAMILY_LOOT_RULES = {
  beast: {
    common:   ["Raw Meat", "Beast Fur", "Beast Bone"],
    uncommon: ["Beast Fang", "Thick Hide"],
    rare:     ["Alpha Fang", "Wildheart Totem"],
    ultraRare: [
      { item: "Alpha Beast Heart", chance: 0.01 },
      { item: "Primal Beast Essence", chance: 0.005 }
    ]
  },

  undead: {
    common:   ["Bone Fragment", "Rotten Cloth"],
    uncommon: ["Grave Dust", "Ghoul Claw"],
    rare:     ["Necrotic Core", "Soulbound Shard"]
  },

  elemental: {
    common:   ["Elemental Residue"],
    uncommon: ["Elemental Core Fragment"],
    rare:     ["Pure Elemental Core"]
  },

  demon: {
    common:   ["Demon Ichor", "Burnt Bone"],
    uncommon: ["Infernal Ember"],
    rare:     ["Demonblood Vial", "Infernal Sigil"]
  },

  dragon: {
    common:   ["Dragon Scale Fragment"],
    uncommon: ["Dragon Claw", "Drake Bone"],
    rare:     ["Dragon Heart Shard", "Ancient Scale"]
  },

  construct: {
    common:   ["Metal Scrap", "Gear Fragment"],
    uncommon: ["Reinforced Plate", "Arcane Gear"],
    rare:     ["Construct Core"]
  },

  spirit: {
    common:   ["Spirit Dust"],
    uncommon: ["Wisp Essence"],
    rare:     ["Spirit Core"]
  },

  slimeborn: {
    common:   ["Slime Gel"],
    uncommon: ["Viscous Core"],
    rare:     ["Primal Ooze"]
  },

  plantfolk: {
    common:   ["Bark Fragment", "Forest Herb"],
    uncommon: ["Sap Cluster", "Thornvine Segment"],
    rare:     ["Ancient Bark Core"]
  }
};

