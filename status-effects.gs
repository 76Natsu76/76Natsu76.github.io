// ============================================================
// StatusEffects.gs — Core Engine
// ============================================================

export function applyStatusEffect(target, effect, context) {
  if (!target.statusEffects) target.statusEffects = [];

  // Clone to avoid shared references
  var eff = JSON.parse(JSON.stringify(effect));

  // Normalize duration
  eff.duration    = eff.duration    != null ? eff.duration    : eff.maxDuration || 1;
  eff.maxDuration = eff.maxDuration != null ? eff.maxDuration : eff.duration;

  // Stacking behavior
  if (eff.stack === "replace") {
    target.statusEffects = target.statusEffects.filter(function(e) {
      return e.type !== eff.type;
    });
  }

  target.statusEffects.push(eff);
}

export function tickStatusEffects(target, context, logs) {
  if (!target.statusEffects || target.statusEffects.length === 0) return;

  var remaining = [];

  for (var i = 0; i < target.statusEffects.length; i++) {
    var eff = target.statusEffects[i];

    // DOT / HOT
    if (eff.valuePerTurn && eff.type === "dot") {
      var dmg = eff.valuePerTurn;
      applyDamage(target, dmg, { source: eff.source || "status" }, context, logs, {
        isDOT: true,
        statusType: eff.type
      });
    }

    if (eff.valuePerTurn && eff.type === "hot") {
      var heal = eff.valuePerTurn;
      var before = target.hpCurrent;
      target.hpCurrent = Math.min(target.hpMax, target.hpCurrent + heal);
      if (logs) logs.push(target.name + " regenerates " + (target.hpCurrent - before) + " HP.");
    }

    // Shields (decay handled elsewhere if needed)

    // Decrement duration
    eff.duration -= 1;

    if (eff.duration > 0) {
      remaining.push(eff);
    } else {
      if (logs) logs.push(target.name + " is no longer affected by " + (eff.type || "a status") + ".");
    }
  }

  target.statusEffects = remaining;
}

export function hasCC(target) {
  if (!target.statusEffects) return false;
  return target.statusEffects.some(function(e) {
    return e.type === "stun" || e.type === "freeze" || e.type === "sleep";
  });
}
/****************************************************
 * CLEANSE (remove all debuffs except shields)
 ****************************************************/
export function cleanseStatusEffects(entity) {
  entity.statusEffects = entity.statusEffects.filter(e =>
    e.type === "shield" || !e.isDebuff
  );
}

export function crowdControlCheck(entity, logs) {
  const effects = entity.statusEffects || [];

  let stunned = false;
  let silenced = false;
  let rooted = false;
  let feared = false;

  for (const eff of effects) {
    switch (eff.type) {
      case "stun":
        stunned = true;
        break;

      case "silence":
        silenced = true;
        break;

      case "root":
        rooted = true;
        break;

      case "fear":
        feared = true;
        break;
    }
  }

  const any = stunned || silenced || rooted || feared;

  if (any && logs) {
    if (stunned) logs.push(`${entity.name} is stunned and cannot act.`);
    if (silenced) logs.push(`${entity.name} is silenced and cannot cast spells.`);
    if (rooted) logs.push(`${entity.name} is rooted.`);
    if (feared) logs.push(`${entity.name} is feared and may act unpredictably.`);
  }

  return { stunned, silenced, rooted, feared, any };
}

export function applyShieldReduction(defender, incomingDamage, logs) {
  var dmg = incomingDamage;
  if (!defender.statusEffects || !defender.statusEffects.length) return dmg;

  for (var i = 0; i < defender.statusEffects.length; i++) {
    var eff = defender.statusEffects[i];
    if (eff.type === "shield" && eff.power > 0) {
      var absorbed = Math.min(eff.power, dmg);
      eff.power -= absorbed;
      dmg -= absorbed;

      if (logs) logs.push(defender.name + "'s shield absorbs " + absorbed + " damage.");

      if (eff.power <= 0) {
        defender.statusEffects.splice(i, 1);
        i--;
      }
      if (dmg <= 0) return 0;
    }
  }

  return dmg;
}
