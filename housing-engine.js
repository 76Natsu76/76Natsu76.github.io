/************************************************************
 * housing-engine.js
 ************************************************************/

import { HOUSING } from "./housing-templates.json";

export const HousingEngine = {
  getHome(key) {
    return HOUSING.homes[key] || null;
  },

  getFurniture(key) {
    return HOUSING.furniture[key] || null;
  },

  getPlayerHome(player) {
    return player.home || null;
  },

  giveHome(player, homeKey) {
    if (!HOUSING.homes[homeKey]) return false;
    player.home = {
      key: homeKey,
      furniture: [],
      theme: "default"
    };
    return true;
  },

  upgradeHome(player) {
    const home = this.getPlayerHome(player);
    if (!home) return { ok: false, reason: "No home owned." };

    const template = this.getHome(home.key);
    if (!template.upgradeTo) {
      return { ok: false, reason: "Home is already max tier." };
    }

    const next = this.getHome(template.upgradeTo);

    // Check gold
    if ((player.gold || 0) < next.requirements.gold) {
      return { ok: false, reason: "Not enough gold." };
    }

    // Check items
    for (const req of next.requirements.items) {
      const invItem = player.inventory?.find(i => i.key === req.itemKey);
      if (!invItem || invItem.quantity < req.quantity) {
        return { ok: false, reason: "Missing required materials." };
      }
    }

    // Consume items
    for (const req of next.requirements.items) {
      const invItem = player.inventory.find(i => i.key === req.itemKey);
      invItem.quantity -= req.quantity;
      if (invItem.quantity <= 0) {
        player.inventory.splice(player.inventory.indexOf(invItem), 1);
      }
    }

    player.gold -= next.requirements.gold;

    // Upgrade
    player.home.key = template.upgradeTo;
    return { ok: true, newHome: template.upgradeTo };
  },

  placeFurniture(player, furnitureKey) {
    const home = this.getPlayerHome(player);
    if (!home) return { ok: false, reason: "No home owned." };

    const template = this.getHome(home.key);
    if (home.furniture.length >= template.maxFurniture) {
      return { ok: false, reason: "Furniture limit reached." };
    }

    if (!HOUSING.furniture[furnitureKey]) {
      return { ok: false, reason: "Unknown furniture." };
    }

    home.furniture.push(furnitureKey);
    return { ok: true };
  },

  applyRestBonuses(player) {
    const home = this.getPlayerHome(player);
    if (!home) return;

    const template = this.getHome(home.key);

    // Base home bonuses
    for (const stat in template.restBonus) {
      player[stat] = (player[stat] || 0) + template.restBonus[stat];
    }

    // Furniture bonuses
    for (const fKey of home.furniture) {
      const f = this.getFurniture(fKey);
      if (!f || !f.bonus) continue;

      for (const stat in f.bonus) {
        player[stat] = (player[stat] || 0) + f.bonus[stat];
      }
    }
  },

  setTheme(player, theme) {
    const home = this.getPlayerHome(player);
    if (!home) return { ok: false, reason: "No home owned." };

    const template = this.getHome(home.key);
    if (!template.themes.includes(theme)) {
      return { ok: false, reason: "Theme not available for this home." };
    }

    home.theme = theme;
    return { ok: true };
  }
};
