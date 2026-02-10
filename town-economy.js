// town-economy.js
import { getWorldState } from "./world-state.js";
import { PlayerStorage } from "./player-storage.js";
import { generateShopInventory } from "./settlement-shops.js";
import { CRAFTING_RECIPES } from "./crafting-system.js";

/* ---------------------------------------------------------
   ECONOMY + SHOP
--------------------------------------------------------- */
export function renderSettlementEconomyAndShop(settlementKey, username) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];
  if (!settlement) return;

  /* ------------------ RESOURCES ------------------ */
  const res = settlement.economy.resources || {};
  const econBox = document.getElementById("settlementEconomy");

  if (econBox) {
    econBox.innerHTML = Object.keys(res).length
      ? Object.keys(res).map(r => `<div>${r}: ${res[r].toFixed(1)}</div>`).join("")
      : "<div>No tracked resources yet.</div>";
  }

  /* ------------------ SHOP ------------------ */
  const shop = generateShopInventory(settlement);
  const shopBox = document.getElementById("settlementShop");

  if (shopBox) {
    shopBox.innerHTML = shop.map((item, idx) => `
      <div class="shop-item">
        ${item.item} — ${item.price}g (Stock: ${item.stock})
        <button class="btn" data-shop-index="${idx}">Buy</button>
      </div>
    `).join("");

    shopBox.querySelectorAll("button[data-shop-index]").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = Number(btn.getAttribute("data-shop-index"));
        buyShopItem(settlementKey, username, shop[index]);
      });
    });
  }

  /* ------------------ CRAFTING ------------------ */
  renderCraftingPanel(settlementKey, username);
}

/* ---------------------------------------------------------
   BUY ITEM
--------------------------------------------------------- */
function buyShopItem(settlementKey, username, shopItem) {
  const player = PlayerStorage.load(username);
  if (!player) return;

  player.reputation = player.reputation || {};
  const rep = player.reputation[settlementKey] || 0;

  // Simple rep-based discount: max 20% off at 20+ rep
  let modifier = 1;

   if (player.bounty?.[settlementKey] > 0) {
     shopBox.innerHTML = "<div>The shop refuses to serve you.</div>";
     return;
   }
   
   // Positive rep → discount
   if (rep > 100) modifier -= Math.min(0.2, rep * 0.001);
   // Negative rep → surcharge
   if (rep < 0) modifier += Math.min(0.3, Math.abs(rep) * 0.02);
   
   const effectivePrice = Math.ceil(shopItem.price * modifier);

  if (player.gold < effectivePrice) {
     // Attempted theft
     import("./crime-system.js").then(({ reportCrime, CRIME_TYPES }) => {
       reportCrime(player, settlementKey, CRIME_TYPES.THEFT, 2);
     });
   
     alert("You were caught trying to steal!");
     return;
   }

  player.gold -= effectivePrice;
  player.inventory = player.inventory || [];
  player.inventory.push({ id: shopItem.item, name: shopItem.item });

  PlayerStorage.save(username, player);
  alert(`Purchased: ${shopItem.item} for ${effectivePrice}g`);
}

/* ---------------------------------------------------------
   CRAFTING PANEL
--------------------------------------------------------- */
function renderCraftingPanel(settlementKey, username) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];
  if (!settlement) return;

  const panel = document.getElementById("craftingPanel");
  if (!panel) return;

  const recipes = CRAFTING_RECIPES || {};
  const res = settlement.economy.resources || {};

  panel.innerHTML = Object.entries(recipes).map(([key, recipe]) => {
    const canCraft = Object.entries(recipe.requires).every(([rk, rv]) => {
      return (res[rk] || 0) >= rv;
    });

    return `
      <div class="crafting-entry">
        <strong>${recipe.produces.item}</strong>
        <div>Requires: ${Object.entries(recipe.requires).map(([rk, rv]) => `${rv} ${rk}`).join(", ")}</div>
        <button class="btn" data-recipe-key="${key}" ${canCraft ? "" : "disabled"}>
          Craft
        </button>
      </div>
    `;
  }).join("");

  panel.querySelectorAll("button[data-recipe-key]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-recipe-key");
      craftRecipe(settlementKey, username, key);
    });
  });
}

/* ---------------------------------------------------------
   CRAFT EXECUTION
--------------------------------------------------------- */
function craftRecipe(settlementKey, username, recipeKey) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];
  const recipe = CRAFTING_RECIPES[recipeKey];
  if (!settlement || !recipe) return;

  const res = settlement.economy.resources || {};
  for (const [rk, rv] of Object.entries(recipe.requires)) {
    if ((res[rk] || 0) < rv) {
      alert("Not enough resources.");
      return;
    }
  }

  // Deduct resources
  for (const [rk, rv] of Object.entries(recipe.requires)) {
    res[rk] -= rv;
  }

  // Give item to player
  const player = PlayerStorage.load(username);
  if (!player) return;

  player.inventory = player.inventory || [];
  player.inventory.push({ id: recipe.produces.item, name: recipe.produces.item });

  PlayerStorage.save(username, player);
  alert(`Crafted: ${recipe.produces.item}`);
}
