/************************************************************
 * pet-engine.js
 ************************************************************/

import { PETS } from "./pets.json";

export const PetEngine = {
  getPet(key) {
    return PETS[key] || null;
  },

  getAllPets() {
    return PETS;
  },

  getPlayerPets(player) {
    return player.pets || [];
  },

  givePet(player, petKey) {
    if (!PETS[petKey]) return false;

    player.pets = player.pets || [];

    if (!player.pets.includes(petKey)) {
      player.pets.push(petKey);
    }

    return true;
  },

  summonPet(player, petKey) {
    if (!player.pets?.includes(petKey)) {
      return { ok: false, reason: "You do not own this pet." };
    }

    player.activePet = petKey;
    return { ok: true, reason: "Pet summoned." };
  },

  unsummonPet(player) {
    player.activePet = null;
  },

  getActivePet(player) {
    if (!player.activePet) return null;
    return PETS[player.activePet] || null;
  },

  applyPetPassives(player) {
    const pet = this.getActivePet(player);
    if (!pet) return;

    const bonuses = pet.statBonuses || {};
    for (const stat in bonuses) {
      player[stat] = (player[stat] || 0) + bonuses[stat];
    }
  },

  evolvePet(player, petKey) {
    const pet = PETS[petKey];
    if (!pet || !pet.evolvesTo) {
      return { ok: false, reason: "This pet cannot evolve." };
    }

    const evoKey = pet.evolvesTo;
    if (!PETS[evoKey]) {
      return { ok: false, reason: "Evolution target missing." };
    }

    // Replace pet
    const idx = player.pets.indexOf(petKey);
    if (idx >= 0) player.pets[idx] = evoKey;

    // Update active pet if needed
    if (player.activePet === petKey) {
      player.activePet = evoKey;
    }

    return { ok: true, newPet: evoKey };
  }
};
