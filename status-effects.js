// status-effects.js

export function applyStatusEffect(target, effect) {
  if (!target.statusEffects) target.statusEffects = [];
  const eff = JSON.parse(JSON.stringify(effect));
  eff.duration = eff.duration != null ? eff.duration : eff.maxDuration || 1;
  eff.maxDuration = eff.maxDuration != null ? eff.maxDuration : eff.duration;
  if (eff.stack === "replace") {
    target.statusEffects = target.statusEffects.filter(e => e.type !== eff.type);
  }
  target.statusEffects.push(eff);
}

export function tickStatusEffects(target, context, logs) {
  if (!target.statusEffects || !target.statusEffects.length) return;
  const remaining = [];
  for (const eff of target.statusEffects) {
    if (eff.valuePerTurn && eff.type === "dot") {
      const dmg = eff.valuePerTurn;
      context.applyDamage(null, target, dmg, context, logs, { isDOT: true });
    }
    if (eff.valuePerTurn && eff.type === "hot") {
      const heal = eff.valuePerTurn;
      const before = target.hpCurrent;
      target.hpCurrent = Math.min(target.hpMax, target.hpCurrent + heal);
      if (logs) logs.push(`${target.name} regenerates ${target.hpCurrent - before} HP.`);
    }
    eff.duration -= 1;
    if (eff.duration > 0) remaining.push(eff);
    else if (logs) logs.push(`${target.name} is no longer affected by ${eff.type}.`);
  }
  target.statusEffects = remaining;
}

export function cleanseStatusEffects(entity) {
  entity.statusEffects = (entity.statusEffects || []).filter(
    e => e.type === "shield" || !e.isDebuff
  );
}

export function crowdControlCheck(entity, logs) {
  const effects = entity.statusEffects || [];
  let stunned = false, silenced = false, rooted = false, feared = false;
  for (const eff of effects) {
    if (eff.type === "stun") stunned = true;
    if (eff.type === "silence") silenced = true;
    if (eff.type === "root") rooted = true;
    if (eff.type === "fear") feared = true;
  }
  const any = stunned || silenced || rooted || feared;
  if (any && logs) {
    if (stunned) logs.push(`${entity.name} is stunned and cannot act.`);
    if (silenced) logs.push(`${entity.name} is silenced and cannot cast spells.`);
    if (rooted) logs.push(`${entity.name} is rooted.`);
    if (feared) logs.push(`${entity.name} is feared.`);
  }
  return { stunned, silenced, rooted, feared, any };
}

export function applyShieldReduction(defender, incomingDamage, logs) {
  let dmg = incomingDamage;
  if (!defender.statusEffects) return dmg;
  for (let i = 0; i < defender.statusEffects.length; i++) {
    const eff = defender.statusEffects[i];
    if (eff.type === "shield" && eff.power > 0) {
      const absorbed = Math.min(eff.power, dmg);
      eff.power -= absorbed;
      dmg -= absorbed;
      if (logs) logs.push(`${defender.name}'s shield absorbs ${absorbed} damage.`);
      if (eff.power <= 0) {
        defender.statusEffects.splice(i, 1);
        i--;
      }
      if (dmg <= 0) return 0;
    }
  }
  return dmg;
}
