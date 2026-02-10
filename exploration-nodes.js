// exploration-nodes.js

export const EXPLORATION_NODES = {
  greenhaven_center: {
    name: "Greenhaven Village Center",
    description: "A quiet square with a fountain.",
    exits: {
      north: "greenhaven_forest_edge",
      east: "greenhaven_inn",
      south: "greenhaven_market"
    },
    encounters: ["wolf", "bandit"],
    items: ["Herb"]
  },

  greenhaven_inn: {
    name: "Restful Ember Inn",
    description: "Warm fire, wooden tables, and the smell of stew.",
    exits: {
      west: "greenhaven_center"
    },
    items: ["Bread", "Ale"]
  },

  greenhaven_forest_edge: {
    name: "Forest Edge",
    description: "Tall trees and rustling leaves.",
    exits: {
      south: "greenhaven_center",
      north: "deep_forest"
    },
    encounters: ["wolf", "boar"]
  }
};
