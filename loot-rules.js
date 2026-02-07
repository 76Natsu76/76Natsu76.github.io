// loot-rules.js

export const LOOT_RULES = {
  region: {
    forest_edge: {
      common:   ["Wildroot","Meadow Bloom","Wood Plank","Raw Meat","Slime Gel","Forest Berry"],
      uncommon: ["Mossleaf","Shadecap","Twig Bundle","Copper Ore","Leather Strip","Edgewood Charm"],
      rare:     ["Edgebloom Petal","Whisperbark Chip","Hunter’s Lucky Token","Forest Warden Band"],
      epic:     ["Edgewood Heartwood","Sylvan Ranger’s Cloak","Song of the Treeline"],
      mythic:   ["Seed of the First Grove","Edge of the Verdant Hunt"]
    },
    
    deep_forest: {
      common:   ["Wildroot","Meadow Bloom","Wood Plank","Raw Meat","Slime Gel","Shadecap","Mossleaf"],
      uncommon: ["Shadowcap Mushroom","Ancient Bark Sliver","Thornvine Segment","Copper Ore","Leather Strip"],
      rare:     ["Gloompetal Blossom","Elderroot Core","Whispering Spore Cluster","Hunter of Shadows Token"],
      epic:     ["Heart of the Deepwood","Cloak of the Hidden Canopy","Elderbark Totem"],
      mythic:   ["Seed of the Forgotten Titan Tree","Crown of the Deepwild"]
    }
  },

  weather: {
    rain: {
      forest_edge: ["Damp Bark Salve","Rain‑Soaked Herb Bundle"],
      deep_forest: ["Dripping Root Bundle","Sodden Leaf Poultice"]
    },
    storm: {
      forest_edge: ["Storm‑Split Branch","Lightning‑Kissed Leaf"],
      plains_field: ["Storm‑Charged Arrow","Thunder Herb Bundle"]
    },
    fog: {
      deep_forest: ["Mist‑Drenched Moss","Veilshroom Cluster"],
      swamp_marsh: ["Wisp‑Lure Lantern","Fog‑Dampened Herb Bundle"]
    }
  },

  crisis: {
    beastUprising: {
      forest_edge: ["Beast Fang Trophy","Hunter’s Binding Net"]
    },
    spiritAwakening: {
      deep_forest: ["Awakened Bark Fragment","Spirit‑Bound Vine"]
    },
    plagueBloom: {
      swamp_marsh: ["Plaguebloom Petal","Quarantine Ward Sigil"]
    },
    undeadRising: {
      swamp_marsh: ["Grave‑Slick Bone","Marsh Grave Marker Fragment"]
    }
  },

  event: {
    springThaw: {
      forest_edge: ["Fresh Sap Vial","Blooming Edgeflower"]
    },
    harvestMoon: {
      forest_edge: ["Moonlit Acorn","Gleaming Seed Pouch"]
    },
    eclipseNight: {
      deep_forest: ["Eclipsecap Fungus","Shadow‑Veined Leaf"]
    },
    ancientRite: {
      deep_forest: ["Ritual Grove Incense","Elder Circle Stone Chip"]
    },
    harvestFestival: {
      plains_field: ["Festival Grain Loaf","Decorated Field Wreath"]
    },
    willOWispNight: {
      swamp_marsh: ["Captured Wisp Ember","Ghostlight Glass"]
    },
    bogFestival: {
      swamp_marsh: ["Reed Mask","Swamp Brew Flask"]
    }
  },

  profession: {
    forest_edge: {
      druid:  ["Edgegrove Focus Charm"],
      ranger: ["Trailmarker’s Whistle"]
    },
    deep_forest: {
      druid:   ["Deepwild Focus Stone"],
      warlock: ["Pactbloom Sprig"]
    },
    plains_field: {
      ranger: ["Field Tracker’s Kit"],
      warrior:["Reinforced Field Bracers"]
    },
    swamp_marsh: {
      alchemist:  ["Marsh Reagent Satchel"],
      necromancer:["Drowned Bone Focus"]
    }
  }
};
