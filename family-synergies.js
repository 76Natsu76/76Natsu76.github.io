export const FAMILY_SYNERGIES = {
  undead: {
    weakTo: ["holy"],
    resistantTo: ["dark", "rot"],
    immuneTo: ["fear"],
    bonusAgainst: ["humanoid"],
    notes: "Classic undead profile."
  },

  demon: {
    weakTo: ["holy"],
    resistantTo: ["fire", "dark"],
    bonusAgainst: ["celestial"],
    notes: "Infernal vs divine polarity."
  },

  celestial: {
    weakTo: ["dark"],
    resistantTo: ["holy", "arcane"],
    bonusAgainst: ["demon", "undead"],
    notes: "Radiant purity."
  },

  void: {
    weakTo: ["arcane"],
    resistantTo: ["dark"],
    immuneTo: ["poison"],
    bonusAgainst: ["elemental"],
    notes: "Entropy disrupts elemental structure."
  },

  elemental: {
    weakTo: ["void"],
    resistantTo: ["fire", "ice", "lightning", "earth", "water"],
    bonusAgainst: ["beast"],
    notes: "Elemental dominance."
  },

  beast: {
    weakTo: ["fire"],
    resistantTo: ["nature"],
    bonusAgainst: ["humanoid"],
    notes: "Savage instincts."
  },

  fae: {
    weakTo: ["iron"],
    resistantTo: ["nature", "arcane"],
    bonusAgainst: ["humanoid"],
    notes: "Fae folklore rules."
  },

  eldritch: {
    weakTo: ["holy"],
    resistantTo: ["arcane", "dark"],
    immuneTo: ["fear"],
    bonusAgainst: ["spirit", "humanoid"],
    notes: "Mind-warping horrors."
  },

  astral_family: {
    weakTo: ["gravity"],
    resistantTo: ["arcane"],
    bonusAgainst: ["void"],
    notes: "Astral vs Void polarity."
  },

  cosmic_entity: {
    weakTo: ["none"],
    resistantTo: ["holy", "arcane", "dark"],
    immuneTo: ["poison", "fear", "rot"],
    bonusAgainst: ["everything"],
    notes: "Cosmic supremacy."
  },

  god: {
    weakTo: ["paradox"],
    resistantTo: ["holy", "arcane"],
    immuneTo: ["fear", "poison", "rot"],
    bonusAgainst: ["demon", "undead", "void"],
    notes: "Divine dominion."
  },

  paradox_god: {
    weakTo: ["none"],
    resistantTo: ["everything"],
    immuneTo: ["everything"],
    bonusAgainst: ["everything"],
    notes: "End-tier contradiction beings."
  }
};
