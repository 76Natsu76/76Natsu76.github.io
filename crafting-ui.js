/************************************************************
 * crafting-ui.js
 ************************************************************/

import { CraftingEngine } from "./crafting-engine.js";

const username = sessionStorage.getItem("twitch_username");
document.getElementById("usernameDisplay").textContent =
  username ? "Logged in as: " + username : "No user logged in";

let player = JSON.parse(sessionStorage.getItem("player_data") || "{}");

const recipeListEl = document.getElementById("recipe-list");
const recipeDetailEl = document.getElementById("recipe-detail");

init();

function init() {
  renderRecipeList();
}

function renderRecipeList() {
  const recipes = CraftingEngine.getAllRecipes();
  const out = [];

  for (const key in recipes) {
    const r = recipes[key];
    out.push(`
      <div class="recipe-row">
        <button onclick="selectRecipe('${key}')">${r.name}</button>
        <span class="recipe-meta">${r.category} • Lv ${r.requiredPlayerLevel || 1}</span>
      </div>
    `);
  }

  recipeListEl.innerHTML = out.join("");
}

window.selectRecipe = function(recipeKey) {
  const recipe = CraftingEngine.getRecipe(recipeKey);
  if (!recipe) {
    recipeDetailEl.innerHTML = "<p>Unknown recipe.</p>";
    return;
  }

  const can = CraftingEngine.canCraft(player, recipeKey);

  const ingredients = (recipe.ingredients || [])
    .map(ing => `<li>${ing.quantity}x ${format(ing.itemKey)}</li>`)
    .join("");

  recipeDetailEl.innerHTML = `
    <h2>${recipe.name}</h2>
    <p>Category: ${format(recipe.category)}</p>
    <p>Result: ${format(recipe.resultItem)} x${recipe.resultQuantity || 1}</p>
    <p>Required Level: ${recipe.requiredPlayerLevel || 1}</p>
    <p>Profession: ${recipe.requiredProfession || "None"} (Lv ${recipe.requiredProfessionLevel || 0})</p>
    <p>Station: ${recipe.station || "Any"}</p>
    <p>Gold Cost: ${recipe.goldCost || 0}</p>

    <h3>Ingredients</h3>
    <ul>${ingredients}</ul>

    <button class="btn ${can.ok ? "" : "disabled"}"
      onclick="craft('${recipeKey}')">
      ${can.ok ? "Craft" : can.reason}
    </button>
  `;
};

window.craft = function(recipeKey) {
  const result = CraftingEngine.craft(player, recipeKey);
  if (!result.ok) {
    alert(result.reason);
    return;
  }

  // Persist player
  sessionStorage.setItem("player_data", JSON.stringify(player));

  alert(
    result.crit
      ? `Critical craft! You created ${result.quantity}x ${format(result.itemKey)}.`
      : `You created ${result.quantity}x ${format(result.itemKey)}.`
  );

  // Re-render detail to update button state
  selectRecipe(recipeKey);
};

function format(str) {
  return String(str)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

window.goToWorldMap = () => (window.location.href = "world-map.html");
window.goToInventory = () => (window.location.href = "inventory.html");
