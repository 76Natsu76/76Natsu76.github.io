// enemy-ai.js

import {
  getUsableAbilities,
  crowdControlCheck,
  estimateAbilityDamage,
  resolveBossCombo,
  getAdaptiveCounter,
  getBossPatterns,
  resolvePatternStep,
  highestDamageAbility
} from "./enemy-ai-helpers.js";

export function chooseBossActionV3(enemy, player, context, logs) {
  enemy.ultimateUses = enemy.ultimateUses || {};
  enemy.patternIndex = enemy.patternIndex || 0;

  let abilities = getUsableAbilities(enemy);

  if (enemy.enrageActive) {
    const enragedStrike = abilities.find(a =>
      (a.combatTags && a.combatTags.includes("burst")) ||
      (a.statusEffects && a.statusEffects.some(se =>
        ["stun", "fear", "silence"].includes(se.type)
      ))
    );
    if (enragedStrike) return { type: "ability", ability: enragedStrike };
  }

  const cc = crowdControlCheck(enemy, logs);
  if (cc.silenced) {
    abilities = abilities.filter(a =>
      !(a.combatTags && a.combatTags.includes("magic"))
    );
  }

  if (!abilities.length) return { type: "basic" };

  if (enemy.lastBossAction) {
    abilities = abilities.filter(a => a.key !== enemy.lastBossAction);
    if (!abilities.length) abilities = getUsableAbilities(enemy);
  }

  const hpPct = enemy.hpCurrent / enemy.hpMax;
  const phase =
    hpPct > 0.70 ? 1 :
    hpPct > 0.40 ? 2 :
    hpPct > 0.20 ? 3 : 4;

  const combo = resolveBossCombo(enemy, player, abilities);
  if (combo) return combo;

  const kill = abilities.find(a =>
    estimateAbilityDamage(enemy, player, a) >= player.hpCurrent
  );
  if (kill) return { type: "ability", ability: kill };

  if (enemy.lastBossAction) {
    if (enemy.lastBossAction.includes("stun")) {
      const burst = abilities.find(a =>
        a.combatTags && a.combatTags.includes("burst")
      );
      if (burst) return { type: "ability", ability: burst };
    }

    if (enemy.lastBossAction.includes("dot")) {
      const debuff = abilities.find(a =>
        a.statusEffects &&
        a.statusEffects.some(se =>
          ["debuff_attack", "debuff_defense", "curse"].includes(se.type)
        )
      );
      if (debuff) return { type: "ability", ability: debuff };
    }

    if (enemy.lastBossAction.includes("debuff")) {
      const dmg = highestDamageAbility(enemy, player, abilities);
      if (dmg) return { type: "ability", ability: dmg };
    }

    if (enemy.lastBossAction === "charging") {
      const finisher = abilities.find(a =>
        a.combatTags && a.combatTags.includes("finisher")
      );
      if (finisher) return { type: "ability", ability: finisher };
    }
  }

  const ult = abilities.find(a => a.isUltimate);
  if (ult) {
    const chargeReady = enemy.currentCharge >= (ult.chargeRequired || 100);
    const uses = enemy.ultimateUses[ult.key] || 0;
    const canUse = chargeReady && uses < (ult.usesPerCombat || 2);

    if (canUse) {
      const playerBuffed = player.statusEffects.some(e => e.type.includes("buff"));
      const playerLow = player.hpCurrent < player.hpMax * 0.5;
      const bossLow = hpPct < 0.5;

      if (phase >= 2 || playerBuffed || playerLow || bossLow) {
        return { type: "ability", ability: ult };
      }
    }
  }

  const counter = getAdaptiveCounter(enemy, player, abilities);
  if (counter) return { type: "ability", ability: counter };

  if (enemy.lastBossAction) {
    if (enemy.lastBossAction.includes("stun") &&
        context.lastPlayerActionType === "heal") {
      const burst = abilities.find(a =>
        a.combatTags && a.combatTags.includes("burst")
      );
      if (burst) return { type: "ability", ability: burst };
    }

    if (enemy.lastBossAction.includes("dot") &&
        context.lastPlayerActionType === "shield") {
      const breaker = abilities.find(a =>
        a.combatTags && a.combatTags.includes("multi_hit")
      );
      if (breaker) return { type: "ability", ability: breaker };
    }

    if (enemy.lastBossAction.includes("debuff") &&
        context.lastPlayerActionType === "buff") {
      const cc2 = abilities.find(a =>
        a.statusEffects &&
        a.statusEffects.some(se =>
          ["silence", "fear", "stun"].includes(se.type)
        )
      );
      if (cc2) return { type: "ability", ability: cc2 };
    }
  }

  const patterns = getBossPatterns(enemy);
  const patternList =
    phase === 1 ? patterns.phase1 :
    phase === 2 ? patterns.phase2 :
    phase === 3 ? patterns.phase3 :
                  patterns.phase4;

  const step = patternList[enemy.patternIndex % patternList.length];
  enemy.patternIndex++;

  const patternAction = resolvePatternStep(step, enemy, player, abilities);
  if (patternAction) return patternAction;

  let best = null, bestScore = 0;
  for (const a of abilities) {
    const dmg = estimateAbilityDamage(enemy, player, a);
    const score = dmg / Math.max(1, a.manaCost || 1);
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }

  if (best) return { type: "ability", ability: best };
  return { type: "basic" };
}

export function chooseEnemyActionV3(enemy, player, context, logs) {
  enemy.ultimateUses = enemy.ultimateUses || {};

  let abilities = getUsableAbilities(enemy);

  const cc = crowdControlCheck(enemy, logs);
  if (cc.silenced) {
    abilities = abilities.filter(a =>
      !(a.combatTags && a.combatTags.includes("magic"))
    );
  }

  if (!abilities.length) return { type: "basic" };

  const ult = abilities.find(a => a.isUltimate);
  if (ult) {
    const chargeReady = enemy.currentCharge >= (ult.chargeRequired || 100);
    const uses = enemy.ultimateUses[ult.key] || 0;
    const canUse = chargeReady && uses < (ult.usesPerCombat || 1);

    if (canUse) {
      const hpPct = enemy.hpCurrent / enemy.hpMax;
      const shouldUseUlt =
        hpPct < 0.35 ||
        player.hpCurrent < player.hpMax * 0.4 ||
        (ult.combatTags && ult.combatTags.includes("aoe")) ||
        (ult.statusEffects &&
         ult.statusEffects.some(se =>
           ["fear", "stun", "silence"].includes(se.type)
         ));

      if (shouldUseUlt) {
        return { type: "ability", ability: ult };
      }
    }
  }

  const prof = enemy.profession || enemy.family || "";

  const playerHas = type =>
    player.statusEffects.some(e => e.type === type);

  const enemyHas = type =>
    enemy.statusEffects.some(e => e.type === type);

  const supportProfs = [
    "alchemist","artificer","blacksmith","carpenter","chef",
    "fisherman","herbalist","leatherworker","miner","ritualist",
    "spelunker","tinkerer","weaver"
  ];

  if (supportProfs.includes(prof)) {
    const cleanse = abilities.find(a =>
      a.statusEffects &&
      a.statusEffects.some(se => se.type === "cleanse")
    );
    if (cleanse && player.statusEffects.some(e => e.isDebuff)) {
      return { type: "ability", ability: cleanse };
    }

    const heal = abilities.find(a =>
      a.statusEffects &&
      a.statusEffects.some(se => se.type.includes("heal"))
    );
    if (heal && enemy.hpCurrent < enemy.hpMax * 0.6) {
      return { type: "ability", ability: heal };
    }

    const buff = abilities.find(a =>
      a.statusEffects &&
      a.statusEffects.some(se =>
        [
          "team_buff_attack","team_buff_defense","team_buff_resist",
          "team_buff_speed","team_shield_flat"
        ].includes(se.type)
      )
    );
    if (buff) return { type: "ability", ability: buff };

    const util = abilities.find(a =>
      a.utilityEffects && Object.keys(a.utilityEffects).length > 0
    );
    if (util) return { type: "ability", ability: util };

    return { type: "basic" };
  }

  if (prof === "berserker") {
    const selfBuff = abilities.find(a =>
      a.statusEffects &&
      a.statusEffects.some(se => se.type.includes("self_buff"))
    );
    if (selfBuff && !enemyHas("self_buff_attack")) {
      return { type: "ability", ability: selfBuff };
    }
  }

  if (prof === "cleric" || prof === "healer") {
    const heal = abilities.find(a =>
      a.statusEffects &&
      a.statusEffects.some(se => se.type.includes("heal"))
    );
    if (heal && enemy.hpCurrent < enemy.hpMax * 0.6) {
      return { type: "ability", ability: heal };
    }

    const cleanse = abilities.find(a =>
      a.statusEffects &&
      a.statusEffects.some(se => se.type === "cleanse")
    );
    if (cleanse && enemy.statusEffects.some(e => e.isDebuff)) {
      return { type: "ability", ability: cleanse };
    }
  }

  if (prof === "necromancer") {
    const summon = abilities.find(a =>
      a.statusEffects &&
      a.statusEffects.some(se => se.type === "summon")
    );
    if (summon) return { type: "ability", ability: summon };
  }

  if (prof === "assassin" || prof === "rogue") {
    const bleed = abilities.find(a =>
      a.statusEffects &&
      a.statusEffects.some(se => se.type === "bleed")
    );
    if (bleed && !playerHas("bleed")) {
      return { type: "ability", ability: bleed };
    }
  }

  if (prof === "witch" || prof === "corrupted") {
    const curse = abilities.find(a =>
      a.statusEffects &&
      a.statusEffects.some(se => se.type === "curse")
    );
    if (curse && !playerHas("curse")) {
      return { type: "ability", ability: curse };
    }
  }

  if (prof === "guardian") {
    const shield = abilities.find(a =>
      a.statusEffects &&
      a.statusEffects.some(se => se.type.includes("shield"))
    );
    if (shield && !enemyHas("shield")) {
      return { type: "ability", ability: shield };
    }
  }

  const kill = abilities.find(a =>
    estimateAbilityDamage(enemy, player, a) >= player.hpCurrent
  );
  if (kill) return { type: "ability", ability: kill };

  const playerCC = ["stun", "silence", "slow", "fear", "disorient"];
  const ccAbility = abilities.find(a =>
    a.statusEffects &&
    a.statusEffects.some(se => playerCC.includes(se.type))
  );
  if (ccAbility &&
      !player.statusEffects.some(e => playerCC.includes(e.type))) {
    return { type: "ability", ability: ccAbility };
  }

  const dotTypes = ["burn", "poison", "bleed", "acid", "disease"];
  const dotAbility = abilities.find(a =>
    a.statusEffects &&
    a.statusEffects.some(se => dotTypes.includes(se.type))
  );
  if (dotAbility &&
      !player.statusEffects.some(e => dotTypes.includes(e.type))) {
    return { type: "ability", ability: dotAbility };
  }

  const buffSelf = abilities.find(a =>
    a.statusEffects &&
    a.statusEffects.some(se => se.type.includes("self_buff"))
  );
  if (buffSelf && !enemyHas("self_buff_attack")) {
    return { type: "ability", ability: buffSelf };
  }

  let best = null;
  let bestScore = 0;

  for (const a of abilities) {
    const dmg = estimateAbilityDamage(enemy, player, a);
    const score = dmg / Math.max(1, a.manaCost || 1);
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }

  if (best) return { type: "ability", ability: best };
  return { type: "basic" };
}
