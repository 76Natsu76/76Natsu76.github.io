/************************************************************
 * crafting-engine.js
 ************************************************************/

import { RECIPES } from "./recipes.json";

export const CraftingEngine = {
  getAllRecipes() {
    return RECIPES;
  },

  getRecipe(key) {
    return RECIPES[key] || null;
  },

  canCraft(player, recipeKey) {
    const recipe = this.getRecipe(recipeKey);
    if (!recipe) return { ok: false, reason: "Unknown recipe." };

    // Level checks
    if ((recipe.requiredPlayerLevel || 1) > (player.level || 1)) {
      return { ok: false, reason: `Requires player level ${recipe.requiredPlayerLevel}.` };
    }

    // Profession checks (simple shape: player.professions[profKey] = level)
    if (recipe.requiredProfession) {
      const profLevel = player.professions?.[recipe.requiredProfession] || 0;
      if (profLevel < (recipe.requiredProfessionLevel || 1)) {
        return {
          ok: false,
          reason: `Requires ${recipe.requiredProfession} level ${recipe.requiredProfessionLevel}.`
        };
      }
    }

    // Station check (optional: pass currentStation into canCraft if you want)
    // if (currentStation && recipe.station && currentStation !== recipe.station) { ... }

    // Inventory check
    if (!this._hasIngredients(player, recipe)) {
      return { ok: false, reason: "Missing required ingredients." };
    }

    // Gold check
    if ((player.gold || 0) < (recipe.goldCost || 0)) {
      return { ok: false, reason: "Not enough gold." };
    }

    return { ok: true, reason: "Ready to craft." };
  },

  craft(player, recipeKey) {
    const recipe = this.getRecipe(recipeKey);
    if (!recipe) return { ok: false, reason: "Unknown recipe." };

    const check = this.canCraft(player, recipeKey);
    if (!check.ok) return check;

    // Consume ingredients + gold
    this._consumeIngredients(player, recipe);
    player.gold = (player.gold || 0) - (recipe.goldCost || 0);

    // Roll success
    const successRoll = Math.random();
    if (successRoll > (recipe.baseSuccessChance ?? 1)) {
      // Failure: optional partial refund or byproduct
      return { ok: false, reason: "Crafting failed.", failure: true };
    }

    // Roll crit
    const critRoll = Math.random();
    const isCrit = recipe.critChance && critRoll < recipe.critChance;

    const resultItemKey = isCrit && recipe.critResultItem
      ? recipe.critResultItem
      : recipe.resultItem;

    const quantity = recipe.resultQuantity || 1;

    // Add item(s) to inventory
    this._addItem(player, resultItemKey, quantity);

    // Optional: profession XP, crafting XP, achievements, etc.
    return {
      ok: true,
      reason: "Crafting successful.",
      crit: isCrit,
      itemKey: resultItemKey,
      quantity
    };
  },

  // ----------------------------------------------------------
  // INTERNAL HELPERS
  // ----------------------------------------------------------
  _hasIngredients(player, recipe) {
    const inv = player.inventory || [];
    for (const ing of recipe.ingredients || []) {
      const have = inv.find(i => i.key === ing.itemKey);
      if (!have || have.quantity < ing.quantity) return false;
    }
    return true;
  },

  _consumeIngredients(player, recipe) {
    const inv = player.inventory || [];
    for (const ing of recipe.ingredients || []) {
      const item = inv.find(i => i.key === ing.itemKey);
      if (!item) continue;
      item.quantity -= ing.quantity;
      if (item.quantity <= 0) {
        const idx = inv.indexOf(item);
        if (idx >= 0) inv.splice(idx, 1);
      }
    }
    player.inventory = inv;
  },

  _addItem(player, itemKey, quantity) {
    const inv = player.inventory || [];
    let item = inv.find(i => i.key === itemKey);
    if (!item) {
      item = { key: itemKey, quantity: 0 };
      inv.push(item);
    }
    item.quantity += quantity;
    player.inventory = inv;
  }
};
