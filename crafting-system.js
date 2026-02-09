// crafting-system.js

export const CRAFTING_RECIPES = {
  leather_armor: {
    requires: { leather: 5 },
    produces: { item: "leather_armor" }
  },
  iron_sword: {
    requires: { ore: 8 },
    produces: { item: "iron_sword" },
    requiresBuilding: "blacksmith"
  }
};
