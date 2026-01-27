/************************************************************
 * guild-ui.js
 * ----------------------------------------------------------
 * UI controller for guild.html
 * Handles:
 *  - Loading guild data
 *  - Rendering guild overview
 *  - Members list
 *  - Bank
 *  - Events
 *  - World Boss
 *  - PvP
 ************************************************************/

import { GuildEngine } from './guild-engine.js';
import { getPlayerById } from './player-registry.js';
import { GUILDS } from './guilds.json';
import { GUILD_EVENTS } from './guild-events.json';
import { GUILD_BUFFS } from './guild-buffs.json';

let currentGuild = null;
let currentPlayer = null;

/************************************************************
 * Initialization
 ************************************************************/
export function initGuildUI(playerId, guildId) {
  currentPlayer = getPlayerById(playerId);
  currentGuild = GuildEngine.getGuild(guildId);

  if (!currentGuild) {
    document.getElementById("guild-content").innerHTML =
      `<p>No guild found. Join or create a guild first.</p>`;
    return;
  }

  renderGuildOverview();
}

/************************************************************
 * Render: Overview
 ************************************************************/
function renderGuildOverview() {
  document.getElementById("guild-name").textContent = currentGuild.name;
  document.getElementById("guild-members-count").textContent = currentGuild.members.length;
  document.getElementById("guild-rating").textContent = currentGuild.pvp.rating;

  const buffList = currentGuild.buffs.length
    ? currentGuild.buffs.map(b => GUILD_BUFFS[b]?.name || b).join(", ")
    : "None";

  document.getElementById("guild-buffs").textContent = buffList;

  document.getElementById("guild-content").innerHTML = `
    <div class="guild-section">
      <h2>Guild Overview</h2>
      <p><strong>Created:</strong> ${new Date(currentGuild.createdAt).toLocaleString()}</p>
      <p><strong>Achievements:</strong> ${currentGuild.achievements.join(", ") || "None"}</p>
    </div>
  `;
}

/************************************************************
 * Render: Members
 ************************************************************/
export function showMembers() {
  const members = currentGuild.members
    .map(m => {
      const p = getPlayerById(m.playerId);
      return `
        <tr>
          <td>${p?.name || m.playerId}</td>
          <td>${m.rank}</td>
          <td>${new Date(m.joinedAt).toLocaleDateString()}</td>
          <td>
            <button onclick="promoteMember('${m.playerId}')">Promote</button>
            <button onclick="demoteMember('${m.playerId}')">Demote</button>
            <button onclick="kickMember('${m.playerId}')">Kick</button>
          </td>
        </tr>
      `;
    })
    .join("");

  document.getElementById("guild-content").innerHTML = `
    <h2>Guild Members</h2>
    <table class="guild-table">
      <tr><th>Name</th><th>Rank</th><th>Joined</th><th>Actions</th></tr>
      ${members}
    </table>
  `;
}

window.promoteMember = function(playerId) {
  GuildEngine.setMemberRank(currentGuild.id, playerId, "officer");
  showMembers();
};

window.demoteMember = function(playerId) {
  GuildEngine.setMemberRank(currentGuild.id, playerId, "member");
  showMembers();
};

window.kickMember = function(playerId) {
  GuildEngine.leaveGuild(currentGuild.id, playerId);
  showMembers();
};

/************************************************************
 * Render: Bank
 ************************************************************/
export function showBank() {
  const items = currentGuild.bank.items
    .map(i => `<li>${i.itemKey} x${i.quantity}</li>`)
    .join("");

  document.getElementById("guild-content").innerHTML = `
    <h2>Guild Bank</h2>
    <p><strong>Gold:</strong> ${currentGuild.bank.gold}</p>
    <ul>${items || "<li>No items</li>"}</ul>

    <div class="bank-actions">
      <input id="deposit-gold" type="number" placeholder="Gold amount" />
      <button onclick="depositGold()">Deposit Gold</button>

      <input id="withdraw-gold" type="number" placeholder="Gold amount" />
      <button onclick="withdrawGold()">Withdraw Gold</button>
    </div>
  `;
}

window.depositGold = function() {
  const amt = parseInt(document.getElementById("deposit-gold").value);
  if (amt > 0) {
    GuildEngine.addGuildGold(currentGuild.id, amt);
    showBank();
  }
};

window.withdrawGold = function() {
  const amt = parseInt(document.getElementById("withdraw-gold").value);
  if (amt > 0) {
    GuildEngine.spendGuildGold(currentGuild.id, amt);
    showBank();
  }
};

/************************************************************
 * Render: Events
 ************************************************************/
export function showEvents() {
  const active = currentGuild.events.activeEvents
    .map(e => `<li>${GUILD_EVENTS[e]?.name || e}</li>`)
    .join("");

  const completed = currentGuild.events.completedEvents
    .map(e => `<li>${GUILD_EVENTS[e]?.name || e}</li>`)
    .join("");

  document.getElementById("guild-content").innerHTML = `
    <h2>Guild Events</h2>

    <h3>Active Events</h3>
    <ul>${active || "<li>None</li>"}</ul>

    <h3>Completed Events</h3>
    <ul>${completed || "<li>None</li>"}</ul>

    <button onclick="startEventPrompt()">Start New Event</button>
  `;
}

window.startEventPrompt = function() {
  const keys = Object.keys(GUILD_EVENTS);
  const options = keys.map(k => `<option value="${k}">${GUILD_EVENTS[k].name}</option>`).join("");

  document.getElementById("guild-content").innerHTML = `
    <h2>Start Guild Event</h2>
    <select id="event-select">${options}</select>
    <button onclick="startSelectedEvent()">Start</button>
  `;
};

window.startSelectedEvent = function() {
  const key = document.getElementById("event-select").value;
  GuildEngine.addActiveEvent(currentGuild.id, key);
  showEvents();
};

/************************************************************
 * Render: World Boss
 ************************************************************/
export function showWorldBoss() {
  const boss = currentGuild.worldBossProgress;

  if (!boss) {
    document.getElementById("guild-content").innerHTML = `
      <h2>Guild World Boss</h2>
      <p>No active world boss.</p>
      <button onclick="startBossPrompt()">Start Boss</button>
    `;
    return;
  }

  document.getElementById("guild-content").innerHTML = `
    <h2>Guild World Boss</h2>
    <p><strong>Boss:</strong> ${boss.bossKey}</p>
    <p><strong>Phase:</strong> ${boss.phase}</p>
    <p><strong>HP Remaining:</strong> ${boss.hpRemaining}</p>

    <button onclick="fightWorldBoss()">Fight Boss</button>
    <button onclick="clearWorldBoss()">Clear Boss</button>
  `;
}

window.startBossPrompt = function() {
  document.getElementById("guild-content").innerHTML = `
    <h2>Start World Boss</h2>
    <input id="boss-key" placeholder="Boss Key" />
    <input id="boss-hp" type="number" placeholder="Total HP" />
    <button onclick="startBoss()">Start</button>
  `;
};

window.startBoss = function() {
  const key = document.getElementById("boss-key").value;
  const hp = parseInt(document.getElementById("boss-hp").value);
  GuildEngine.startWorldBoss(currentGuild.id, key, hp);
  showWorldBoss();
};

window.fightWorldBoss = function() {
  // You will wire this into your combat engine
  alert("World boss combat not implemented yet.");
};

window.clearWorldBoss = function() {
  GuildEngine.clearWorldBoss(currentGuild.id);
  showWorldBoss();
};

/************************************************************
 * Render: PvP
 ************************************************************/
export function showPvP() {
  const pvp = currentGuild.pvp;

  document.getElementById("guild-content").innerHTML = `
    <h2>Guild PvP</h2>
    <p><strong>Rating:</strong> ${pvp.rating}</p>
    <p><strong>Wins:</strong> ${pvp.wins}</p>
    <p><strong>Losses:</strong> ${pvp.losses}</p>

    <button onclick="queueGuildPvP()">Queue for Guild Skirmish</button>
  `;
}

window.queueGuildPvP = function() {
  alert("Arena queueing not implemented yet.");
};
