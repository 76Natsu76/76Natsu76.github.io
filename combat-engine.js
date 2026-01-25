// combat-engine.js
// Modernized, client-side combat engine (Option B)

class CombatEngine {
  constructor(player, encounter, callbacks = {}) {
    this.callbacks = {
      onUpdate: callbacks.onUpdate || function () {},
      onLog: callbacks.onLog || function () {},
      onEnd: callbacks.onEnd || function () {}
    };

    this.playerTemplate = JSON.parse(JSON.stringify(player || {}));
    this.encounter = JSON.parse(JSON.stringify(encounter || {}));

    const saved = sessionStorage.getItem("savedCombat");
    if (saved) {
      this.state = JSON.parse(saved);
    } else {
      this._initState();
    }

    this._notifyUpdate();
  }

  /* =========================================
   * INITIALIZATION
   * =======================================*/

  _initState() {
    const p = this.playerTemplate;
    const e = this.encounter.enemy || {};

    const playerMaxHP =
      (p.derived && p.derived.maxHP) || p.hpMax || 100;
    const enemyMaxHP = e.maxHP || e.hpMax || 100;

    this.state = {
      turn: "PLAYER",
      round: 1,
      outcome: null,
      log: [],
      region: this.encounter.region || null,
      weather: this.encounter.weather || null,

      player: {
        key: p.key || "player",
        name: p.name || "Adventurer",
        level: p.level || 1,
        rarity: p.rarity || "COMMON",
        element: p.element || "neutral",
        family: p.family || "humanoid",

        hp: playerMaxHP,
        hpMax: playerMaxHP,

        atk:
          (p.derived && p.derived.attack) ||
          p.attack ||
          10,
        def:
          (p.derived && p.derived.defense) ||
          p.defense ||
          5,

        critChance: p.critChance || 0.05,
        critMult: p.critMult || 1.5,

        ultCharge: 0,
        ultReady: false,

        abilities: p.abilities || [],
        cooldowns: [],

        equipment: p.equipment || {},
        inventoryEquipment: p.inventoryEquipment || []
      },

      enemy: {
        key: e.key || "enemy",
        name: e.name || "Unknown Foe",
        level: e.level || 1,
        rarity: e.rarity || "COMMON",
        family: e.family || "beast",
        element: e.element || "neutral",

        hp: enemyMaxHP,
        hpMax: enemyMaxHP,

        atk: e.attack || 8,
        def: e.defense || 4,

        critChance: e.critChance || 0.03,
        critMult: e.critMult || 1.4,

        portrait:
          e.portrait ||
          `/assets/enemies/${e.key || "default"}.png`,
        modifiers: e.modifiers || []
      },

      effects: [], // DOT/HOT etc.
      rewards: null
    };

    this._log(
      `A wild ${this._fmt(this.state.enemy.name)} appears!`
    );
    this._persist();
  }

  /* =========================================
   * PUBLIC API
   * =======================================*/

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  async basicAttack() {
    if (this._isOver()) return;
    if (this.state.turn !== "PLAYER") return;

    this._log("You strike the enemy!");
    this._playerAttack({ type: "BASIC" });

    await this._afterPlayerAction();
  }

  async useAbility(key) {
    if (this._isOver()) return;
    if (this.state.turn !== "PLAYER") return;

    const ability = this.state.player.abilities.find(
      (a) => a.key === key
    );
    if (!ability) {
      this._log(`You don't have that ability.`);
      this._notifyUpdate();
      return;
    }

    const cd = this.state.player.cooldowns.find(
      (c) => c.key === key
    );
    if (cd && cd.remaining > 0) {
      this._log(`${ability.name} is on cooldown.`);
      this._notifyUpdate();
      return;
    }

    this._log(`You use ${ability.name}!`);
    this._applyAbility(ability);

    this._setCooldown(ability);
    await this._afterPlayerAction();
  }

  async useUltimate() {
    if (this._isOver()) return;
    if (this.state.turn !== "PLAYER") return;

    if (!this.state.player.ultReady) {
      this._log("Your ultimate is not ready yet!");
      this._notifyUpdate();
      return;
    }

    this._log("You unleash your Ultimate!");
    this._applyUltimate();

    this.state.player.ultCharge = 0;
    this.state.player.ultReady = false;

    await this._afterPlayerAction();
  }

  async enemyTurn() {
    if (this._isOver()) return;
    if (this.state.turn !== "ENEMY") return;

    this._log(
      `${this._fmt(this.state.enemy.name)} prepares an attack...`
    );

    this._enemyAttack();
    await this._endTurn();
  }

  async flee() {
    if (this._isOver()) return;
    if (this.state.turn !== "PLAYER") return;

    const chance = 0.35;
    if (Math.random() < chance) {
      this._log("You successfully fled the battle!");
      this._setOutcome("FLEE");
      return;
    } else {
      this._log("You failed to flee!");
      await this._afterPlayerAction();
    }
  }

  async swapEquipment(slot, itemId) {
    if (this._isOver()) return;
    if (this.state.turn !== "PLAYER") return;

    const p = this.state.player;
    const item = (p.inventoryEquipment || []).find(
      (i) => String(i.id) === String(itemId)
    );
    if (!item) {
      this._log("Item not found.");
      this._notifyUpdate();
      return;
    }

    const previous = p.equipment[slot] || null;
    p.equipment[slot] = item;

    if (previous) {
      p.inventoryEquipment.push(previous);
    }
    p.inventoryEquipment = p.inventoryEquipment.filter(
      (i) => String(i.id) !== String(itemId)
    );

    this._recalculatePlayerStats();
    this._log(
      `You equipped ${item.name} in ${this._fmt(slot)} slot.`
    );

    this._notifyUpdate();
    this._persist();
  }

  /* =========================================
   * TURN FLOW
   * =======================================*/

  async _afterPlayerAction() {
    this._applyOngoingEffects();
    this._tickCooldowns();
    this._checkOutcome();
    this._persist();
    this._notifyUpdate();

    if (this._isOver()) return;

    this.state.turn = "ENEMY";
    await this.enemyTurn();
  }

  async _endTurn() {
    this._applyOngoingEffects();
    this._tickCooldowns();
    this._checkOutcome();
    this._persist();
    this._notifyUpdate();

    if (this._isOver()) return;

    this.state.turn = "PLAYER";
    this.state.round += 1;
  }

  /* =========================================
   * DAMAGE / HEALING
   * =======================================*/

  _playerAttack({ type }) {
    const dmg = this._calculateDamage(
      this.state.player,
      this.state.enemy,
      { source: type || "BASIC", attackerSide: "PLAYER" }
    );
    this._applyDamage("ENEMY", dmg);
    this._gainUlt("PLAYER", 10);
  }

  _enemyAttack() {
    const dmg = this._calculateDamage(
      this.state.enemy,
      this.state.player,
      { source: "BASIC", attackerSide: "ENEMY" }
    );
    this._applyDamage("PLAYER", dmg);
    this._gainUlt("PLAYER", 5); // gain ult when hit
  }

  _applyAbility(ability) {
    // Simple default: treat as a stronger attack + optional DOT/HOT
    const baseMult = ability.powerMult || 1.2;
    const isHeal = ability.tags?.includes("HEAL");

    if (isHeal) {
      const amount =
        Math.round(
          (this.state.player.hpMax || 100) *
            (ability.healPct || 0.25)
        ) || 20;
      this._applyHealing("PLAYER", amount);
      this._log(
        `${ability.name} heals you for ${amount} HP.`
      );
      this._gainUlt("PLAYER", 8);
      return;
    }

    const dmg = this._calculateDamage(
      this.state.player,
      this.state.enemy,
      {
        source: "ABILITY",
        attackerSide: "PLAYER",
        powerMult: baseMult,
        element: ability.element || null
      }
    );
    this._applyDamage("ENEMY", dmg);
    this._gainUlt("PLAYER", 12);

    if (ability.dot) {
      this._addEffect({
        type: "DOT",
        target: "ENEMY",
        amount: ability.dot.amount || 5,
        duration: ability.dot.duration || 3,
        effectKey: ability.key || "dot",
        element: ability.element || null
      });
      this._log(
        `${ability.name} applies a damage-over-time effect.`
      );
    }

    if (ability.hot) {
      this._addEffect({
        type: "HOT",
        target: "PLAYER",
        amount: ability.hot.amount || 5,
        duration: ability.hot.duration || 3,
        effectKey: ability.key || "hot",
        element: ability.element || null
      });
      this._log(
        `${ability.name} applies a healing-over-time effect.`
      );
    }
  }

  _applyUltimate() {
    // Big hit + maybe small self-heal
    const dmg = this._calculateDamage(
      this.state.player,
      this.state.enemy,
      {
        source: "ULTIMATE",
        attackerSide: "PLAYER",
        powerMult: 2.0
      }
    );
    this._applyDamage("ENEMY", dmg);

    const heal = Math.round(
      (this.state.player.hpMax || 100) * 0.15
    );
    this._applyHealing("PLAYER", heal);
    this._log(
      `Your ultimate restores ${heal} HP as residual energy.`
    );
  }

  _calculateDamage(attacker, defender, opts = {}) {
    const powerMult = opts.powerMult || 1.0;

    const atk = attacker.atk || 10;
    const def = defender.def || 5;

    let base = Math.max(1, atk - def * 0.5);
    base *= powerMult;

    // Region / element hooks (kept simple, but easy to extend)
    const element = opts.element || attacker.element || null;
    const regionKey = this.state.region;
    if (typeof REGION_DEFINITIONS !== "undefined" && regionKey) {
      const region = REGION_DEFINITIONS[regionKey];
      if (region && region.combatModifiers) {
        const cm = region.combatModifiers;
        if (opts.attackerSide === "PLAYER") {
          if (cm.playerATKMult)
            base *= cm.playerATKMult;
        } else if (opts.attackerSide === "ENEMY") {
          if (cm.enemyATKMult)
            base *= cm.enemyATKMult;
        }
        if (element && cm.elementBias && cm.elementBias[element]) {
          base *= 1 + cm.elementBias[element];
        }
      }
    }

    // Crit
    const critChance = attacker.critChance || 0;
    const critMult = attacker.critMult || 1.5;
    const isCrit = Math.random() < critChance;
    if (isCrit) base *= critMult;

    const dmg = Math.max(1, Math.round(base));

    this.state.log.push({
      type: "attack",
      attacker:
        opts.attackerSide === "PLAYER"
          ? "PLAYER"
          : "ENEMY",
      target:
        opts.attackerSide === "PLAYER"
          ? "ENEMY"
          : "PLAYER",
      damage: dmg,
      crit: isCrit,
      element: element || null
    });

    return dmg;
  }

  _applyDamage(targetSide, amount) {
    const target =
      targetSide === "PLAYER"
        ? this.state.player
        : this.state.enemy;

    target.hp = Math.max(0, target.hp - amount);
  }

  _applyHealing(targetSide, amount) {
    const target =
      targetSide === "PLAYER"
        ? this.state.player
        : this.state.enemy;

    target.hp = Math.min(target.hpMax, target.hp + amount);
  }

  /* =========================================
   * EFFECTS (DOT / HOT)
   * =======================================*/

  _addEffect(effect) {
    this.state.effects.push({
      type: effect.type, // "DOT" | "HOT"
      target: effect.target, // "PLAYER" | "ENEMY"
      amount: effect.amount,
      duration: effect.duration,
      remaining: effect.duration,
      effectKey: effect.effectKey || "effect",
      element: effect.element || null
    });
  }

  _applyOngoingEffects() {
    const remaining = [];

    for (const eff of this.state.effects) {
      if (eff.remaining <= 0) continue;

      if (eff.type === "DOT") {
        this._applyDamage(eff.target, eff.amount);
        this.state.log.push({
          type: "dot",
          target: eff.target,
          amount: eff.amount,
          effectKey: eff.effectKey
        });
      } else if (eff.type === "HOT") {
        this._applyHealing(eff.target, eff.amount);
        this.state.log.push({
          type: "hot",
          target: eff.target,
          amount: eff.amount,
          effectKey: eff.effectKey
        });
      }

      eff.remaining -= 1;
      if (eff.remaining > 0) {
        remaining.push(eff);
      } else {
        this.state.log.push({
          type: "expire",
          effectKey: eff.effectKey
        });
      }
    }

    this.state.effects = remaining;
  }

  /* =========================================
   * COOLDOWNS / ULT
   * =======================================*/

  _setCooldown(ability) {
    if (!ability.cooldown) return;

    const existing = this.state.player.cooldowns.find(
      (c) => c.key === ability.key
    );
    if (existing) {
      existing.remaining = ability.cooldown;
    } else {
      this.state.player.cooldowns.push({
        key: ability.key,
        name: ability.name,
        remaining: ability.cooldown
      });
    }
  }

  _tickCooldowns() {
    this.state.player.cooldowns =
      this.state.player.cooldowns
        .map((c) => ({
          ...c,
          remaining: Math.max(0, c.remaining - 1)
        }))
        .filter((c) => c.remaining > 0);
  }

  _gainUlt(side, amount) {
    if (side !== "PLAYER") return;

    const p = this.state.player;
    p.ultCharge = Math.min(100, p.ultCharge + amount);
    if (p.ultCharge >= 100) {
      p.ultReady = true;
    }
  }

  /* =========================================
   * OUTCOME / REWARDS
   * =======================================*/

  _checkOutcome() {
    if (this.state.outcome) return;

    if (this.state.player.hp <= 0) {
      this._setOutcome("LOSE");
    } else if (this.state.enemy.hp <= 0) {
      this._setOutcome("WIN");
    }
  }

  _setOutcome(type) {
    this.state.outcome = type;

    if (type === "WIN") {
      this.state.rewards = this._generateRewards();
      this._log("You are victorious!");
    } else if (type === "LOSE") {
      this.state.rewards = null;
      this._log("You were defeated...");
    } else if (type === "FLEE") {
      this.state.rewards = null;
      this._log("You escaped the encounter.");
    }

    sessionStorage.removeItem("savedCombat");
    this._persist(); // final snapshot
    this._notifyUpdate();
    this.callbacks.onEnd(this.state.rewards);
  }

  _generateRewards() {
    const enemyLevel = this.state.enemy.level || 1;
    const baseXP = 10 + enemyLevel * 5;

    const xp = baseXP;
    const xpPercent = Math.min(100, 20 + enemyLevel * 2);

    const levelUp = false; // hook for future
    const newLevel = this.state.player.level;

    // Simple placeholder loot
    const loot = {
      name: "Mysterious Shard",
      rarity: "RARE",
      quantity: 1
    };

    return {
      xp,
      xpPercent,
      levelUp,
      newLevel,
      loot
    };
  }

  /* =========================================
   * STATS / EQUIPMENT
   * =======================================*/

  _recalculatePlayerStats() {
    const p = this.state.player;

    let atkBase =
      (this.playerTemplate.derived &&
        this.playerTemplate.derived.attack) ||
      this.playerTemplate.attack ||
      10;
    let defBase =
      (this.playerTemplate.derived &&
        this.playerTemplate.derived.defense) ||
      this.playerTemplate.defense ||
      5;
    let hpBase =
      (this.playerTemplate.derived &&
        this.playerTemplate.derived.maxHP) ||
      this.playerTemplate.hpMax ||
      100;

    for (const slot of Object.keys(p.equipment || {})) {
      const item = p.equipment[slot];
      if (!item || !item.bonuses) continue;

      const b = item.bonuses;
      if (b.attack) atkBase += b.attack;
      if (b.defense) defBase += b.defense;
      if (b.maxHP) hpBase += b.maxHP;
    }

    p.atk = atkBase;
    p.def = defBase;

    const hpPct = p.hp / p.hpMax;
    p.hpMax = hpBase;
    p.hp = Math.max(1, Math.round(p.hpMax * hpPct));
  }

  /* =========================================
   * EXTERNAL PLAYER SYNC
   * =======================================*/

  applyExternalPlayerSnapshot(playerData) {
    if (!playerData) return;

    const p = this.state.player;

    // HP / Max HP
    const maxHP =
      (playerData.derived && playerData.derived.maxHP) ||
      playerData.hpMax ||
      p.hpMax;

    const currentHP =
      playerData.hp != null
        ? playerData.hp
        : Math.min(p.hp, maxHP);

    p.hpMax = maxHP;
    p.hp = Math.max(0, Math.min(maxHP, currentHP));

    // ATK / DEF (if present)
    const atk =
      (playerData.derived && playerData.derived.attack) ||
      playerData.attack;
    const def =
      (playerData.derived && playerData.derived.defense) ||
      playerData.defense;

    if (atk != null) p.atk = atk;
    if (def != null) p.def = def;

    // Optionally sync equipment snapshot if you want it to stay aligned
    if (playerData.equipment) {
      p.equipment = playerData.equipment;
    }

    this._persist();
    this._notifyUpdate();
  }

  /* =========================================
   * UTILITIES
   * =======================================*/

  _isOver() {
    return !!this.state.outcome;
  }

  _log(msg) {
    this.callbacks.onLog(msg);
    this.state.log.push(msg);
  }

  _notifyUpdate() {
    this.callbacks.onUpdate(this.getState());
  }

  _persist() {
    sessionStorage.setItem(
      "savedCombat",
      JSON.stringify(this.state)
    );
  }

  _fmt(str) {
    return String(str)
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

// Expose globally in browser
window.CombatEngine = CombatEngine;
