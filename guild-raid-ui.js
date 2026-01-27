/************************************************************
 * guild-raid-ui.js
 ************************************************************/

import { GuildRaidEngine } from "./guild-raid-engine.js";

const username = sessionStorage.getItem("twitch_username");
document.getElementById("usernameDisplay").textContent =
  username ? "Logged in as: " + username : "No user logged in";

let guild = JSON.parse(sessionStorage.getItem("guild_data") || "{}");

document.getElementById("guildNameDisplay").textContent =
  guild.name ? `Guild: ${guild.name} (Lv ${guild.level || 1})` : "No guild data";

const raidListEl = document.getElementById("raid-list");
const raidDetailEl = document.getElementById("raid-detail");

init();

function init() {
  renderRaidList();
}

function renderRaidList() {
  const raids = GuildRaidEngine.getAllRaids();
  const out = [];

  for (const key in raids) {
    const r = raids[key];
    const check = GuildRaidEngine.canEnterRaid(guild, key);

    out.push(`
      <div class="raid-row">
        <button onclick="selectRaid('${key}')">${r.name}</button>
        <span class="raid-meta">Min Guild Lv ${r.minGuildLevel}</span>
        <span class="raid-status ${check.ok ? "ok" : "locked"}">
          ${check.ok ? "Available" : "Locked"}
        </span>
      </div>
    `);
  }

  raidListEl.innerHTML = out.join("");
}

window.selectRaid = function(raidKey) {
  const raid = GuildRaidEngine.getRaid(raidKey);
  if (!raid) {
    raidDetailEl.innerHTML = "<p>Unknown raid.</p>";
    return;
  }

  const check = GuildRaidEngine.canEnterRaid(guild, raidKey);
  const active = guild.activeRaid && guild.activeRaid.key === raidKey;
  const currentBoss = active ? GuildRaidEngine.getCurrentBoss(guild) : null;

  const bosses = raid.bosses
    .map((b, idx) => {
      const defeated = guild.activeRaid?.progress?.includes(b.key);
      const isCurrent = active && guild.activeRaid.bossIndex === idx;
      return `
        <li class="${defeated ? "defeated" : isCurrent ? "current" : ""}">
          ${b.name} (HP: ${b.hp})
        </li>
      `;
    })
    .join("");

  raidDetailEl.innerHTML = `
    <h2>${raid.name}</h2>
    <p>Min Guild Level: ${raid.minGuildLevel}</p>
    <p>Recommended Power: ${raid.recommendedPower}</p>
    <p>Lockout: ${raid.lockoutHours}h</p>

    <h3>Bosses</h3>
    <ul>${bosses}</ul>

    <h3>Rewards</h3>
    <p>Guild XP: ${raid.rewards.guildXp}</p>
    <p>Guild Currency: ${raid.rewards.guildCurrency}</p>
    <p>Unique Mount: ${raid.rewards.uniqueMount || "None"}</p>
    <p>Unique Pet: ${raid.rewards.uniquePet || "None"}</p>

    <button class="btn ${check.ok && !active ? "" : "disabled"}"
      onclick="startRaid('${raidKey}')">
      ${active ? "Raid In Progress" : check.ok ? "Start Raid" : check.reason}
    </button>

    ${active && currentBoss ? `
      <button class="btn" onclick="markBossDefeated('${raidKey}')">
        Mark Current Boss Defeated (placeholder)
      </button>
    ` : ""}
  `;
};

window.startRaid = function(raidKey) {
  const result = GuildRaidEngine.startRaid(guild, raidKey);
  if (!result.ok) {
    alert(result.reason);
    return;
  }

  sessionStorage.setItem("guild_data", JSON.stringify(guild));
  selectRaid(raidKey);
  renderRaidList();
};

window.markBossDefeated = function(raidKey) {
  const result = GuildRaidEngine.markBossDefeated(guild);
  if (!result.ok) {
    alert(result.reason);
    return;
  }

  sessionStorage.setItem("guild_data", JSON.stringify(guild));

  if (result.complete) {
    alert("Raid complete! Rewards granted to the guild.");
  } else {
    alert("Boss defeated. Advancing to the next boss.");
  }

  selectRaid(raidKey);
  renderRaidList();
};

window.goToGuild = () => (window.location.href = "guild.html");
window.goToWorldMap = () => (window.location.href = "world-map.html");
