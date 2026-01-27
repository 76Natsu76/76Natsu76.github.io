/************************************************************
 * pet-ui.js
 ************************************************************/

import { PetEngine } from "./pet-engine.js";

let player = JSON.parse(sessionStorage.getItem("player_data") || "{}");

const listEl = document.getElementById("pet-list");
const detailEl = document.getElementById("pet-detail");

init();

function init() {
  renderPetList();
}

function renderPetList() {
  const pets = PetEngine.getPlayerPets(player);
  const all = PetEngine.getAllPets();

  const out = pets.map(key => {
    const p = all[key];
    return `
      <div class="pet-row">
        <button onclick="selectPet('${key}')">${p.name}</button>
        <span class="pet-meta">${p.rarity}</span>
      </div>
    `;
  });

  listEl.innerHTML = out.join("") || "<p>You have no pets.</p>";
}

window.selectPet = function(petKey) {
  const pet = PetEngine.getPet(petKey);
  if (!pet) return;

  const isActive = player.activePet === petKey;

  const passives = Object.entries(pet.passives || {})
    .map(([k, v]) => `<li>${k}: +${v}</li>`)
    .join("");

  const stats = Object.entries(pet.statBonuses || {})
    .map(([k, v]) => `<li>${k}: +${v}</li>`)
    .join("");

  detailEl.innerHTML = `
    <h2>${pet.name}</h2>
    <p>${pet.description}</p>

    <h3>Passives</h3>
    <ul>${passives || "<li>None</li>"}</ul>

    <h3>Stat Bonuses</h3>
    <ul>${stats || "<li>None</li>"}</ul>

    <button class="btn" onclick="summon('${petKey}')">
      ${isActive ? "Unsummon" : "Summon"}
    </button>

    ${pet.evolvesTo ? `
      <button class="btn" onclick="evolve('${petKey}')">Evolve</button>
    ` : ""}
  `;
};

window.summon = function(petKey) {
  if (player.activePet === petKey) {
    PetEngine.unsummonPet(player);
  } else {
    PetEngine.summonPet(player, petKey);
  }

  sessionStorage.setItem("player_data", JSON.stringify(player));
  selectPet(petKey);
  renderPetList();
};

window.evolve = function(petKey) {
  const result = PetEngine.evolvePet(player, petKey);
  if (!result.ok) {
    alert(result.reason);
    return;
  }

  sessionStorage.setItem("player_data", JSON.stringify(player));
  alert(`Your pet evolved into ${result.newPet}!`);
  renderPetList();
  selectPet(result.newPet);
};
