window.Game = window.Game || {};

window.Game.Cat = function (startX, startY) {
  const Audio = window.Game.Audio;
  const Particles = window.Game.Particles;

  const DEFAULT_PHYSICS = {
    gravity: 1650,
    jumpForce: 660,
    runSpeed: 330,
    wallSlideSpeed: 110,
  };

  // Reusable 3x supersampled offscreen silhouette buffer for Guardian Shield full-body shimmer
  const SHIELD_FX_SIZE = 156;
  const SHIELD_FX_OX = 78;
  const SHIELD_FX_OY = 116;
  const SHIELD_FX_DPR = 3;
  const shieldFxCanvas = document.createElement('canvas');
  shieldFxCanvas.width = SHIELD_FX_SIZE * SHIELD_FX_DPR;
  shieldFxCanvas.height = SHIELD_FX_SIZE * SHIELD_FX_DPR;
  const shieldFxCtx = shieldFxCanvas.getContext('2d');
  shieldFxCtx.imageSmoothingEnabled = true;
  shieldFxCtx.imageSmoothingQuality = 'high';

  const cat = {
    x: startX,
    y: startY,
    w: 44,
    h: 44,
    vx: 0,
    vy: 0,
    facing: 1,
    onGround: false,
    onNarrow: false,
    wallDir: 0,
    crouching: false,
    nightVision: false,
    lives: 6,
    maxLives: 7,
    purpleLives: 0,
    invulnTimer: 0,
    hurtTimer: 0,
    respawnLockTimer: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    wagasaBoostTimer: 0,
    meowCooldown: 0,
    playWithCatTimer: 0,
    animTime: 0,
    walkTime: 0,
    crouchTime: 0,
    landTimer: 0,
    scaleX: 1,
    scaleY: 1,
    balancePhase: 0,
    ropeDip: 0,
    checkpointX: startX,
    checkpointY: startY,
    shieldEnabled: false,
    shieldActive: false,
    shieldTimer: 0,
    shieldRechargeSec: 0,
    skin: 'classic',
    hasWingsGlide: false,
    trailTimer: 0,
    physics: { ...DEFAULT_PHYSICS },
  };

  function resetPhysics() {
    cat.physics = { ...DEFAULT_PHYSICS };
  }

  function applyUpgrades(bonuses, preserveCurrentLives = false) {
    if (!bonuses) return;
    cat.maxLives = bonuses.maxLives;
    if (!preserveCurrentLives) {
      cat.lives = bonuses.startLives;
    } else if (cat.lives > cat.maxLives) {
      cat.lives = cat.maxLives;
    }
    cat.physics.runSpeed = Math.round(DEFAULT_PHYSICS.runSpeed * (bonuses.speedMult || 1));
    cat.physics.jumpForce = Math.round(DEFAULT_PHYSICS.jumpForce * (bonuses.jumpMult || 1));
    cat.shieldEnabled = !!bonuses.hasShield;
    cat.shieldRechargeSec = bonuses.shieldRechargeSec || 0;
    if (!preserveCurrentLives) {
      cat.shieldActive = cat.shieldEnabled;
      cat.shieldTimer = 0;
    } else if (cat.shieldEnabled && !cat.shieldActive && cat.shieldTimer <= 0) {
      cat.shieldActive = true;
    }
    cat.skin = bonuses.skin || 'classic';
    cat.hasWingsGlide = !!bonuses.hasWingsGlide;
  }

  function refillLives() {
    cat.lives = cat.maxLives;
    if (cat.shieldEnabled) {
      cat.shieldActive = true;
      cat.shieldTimer = 0;
    }
    cat.invulnTimer = 1.6;
    cat.hurtTimer = 0;
    cat.respawnLockTimer = 0.55;
    cat.jumpBufferTimer = 0;
    cat.x = cat.checkpointX;
    cat.y = cat.checkpointY;
    cat.vx = 0;
    cat.vy = 0;
  }

  function resolveCollisionsX(platforms) {
    cat.wallDir = 0;
    for (const p of platforms) {
      if (p.hiddenInDay && !cat.nightVision) continue;
      if (p.broken || p.nonSolid) continue;
      if (p.type === 'maya_vault_door' && (p.openAnim || 0) >= 0.78) continue;
      if (p.type === 'wind_zone' || p.type === 'blizzard_zone' || p.type === 'thermal_updraft' || p.type === 'steam_ramen_vent' || p.type === 'pendulum_censer' || p.type === 'wagasa_ricochet' || p.type === 'tunnel_clearance' || p.type === 'track_switch_lever' || p.type === 'carnival_bell_swing' || p.type === 'canal_tide_gate' || p.type === 'venice_water_spout' || p.type === 'paris_chimney_updraft' || p.type === 'paris_bridge_crank' || p.type === 'moulin_sail_wheel' || p.type === 'morocco_fountain_geyser' || p.type === 'morocco_cedar_lever' || p.type === 'morocco_lantern_swing' || p.type === 'maya_cenote_geyser' || p.type === 'maya_jade_switch' || p.type === 'maya_vine_swing' || p.type === 'greece_sun_mirror' || p.type === 'greece_poseidon_wave' || p.type === 'greece_lyre_pillar' || p.type === 'greece_medusa_aegis' || p.type === 'greece_discobolus' || p.type === 'greece_zeus_obelisk' || p.type === 'battir_madud_gate' || p.type === 'battir_roman_bath_vent' || p.type === 'battir_noria_wheel' || p.type === 'istanbul_samovar_vent' || p.type === 'istanbul_hammam_valve' || p.type === 'istanbul_simit_vendor' || p.type === 'istanbul_tram_crossing' || p.type === 'istanbul_balik_grill' || p.type === 'istanbul_medusa_cistern' || p.type === 'istanbul_whirling_censer' || p.type === 'istanbul_dondurma_trick' || p.type === 'istanbul_kestane_cart' || p.type === 'swiss_cheese_wheel' || p.type === 'swiss_cuckoo_clock' || p.type === 'swiss_waterwheel_mill' || p.type === 'swiss_alphorn_gust' || p.type === 'swiss_rescue_hut' || p.type === 'swiss_fondue_cauldron' || p.type === 'swiss_avalanche_bell') continue;
      if (p.type === 'greece_light_bridge' && (p.activeTimer || 0) <= 0) continue;
      if (p.type === 'phase_platform' && p.phaseSolid === false) continue;
      if (p.type === 'jump_flip_panel' && p.flipActive === false) continue;
      if (p.type === 'switch_rail_bridge' && (p.extendAnim || 0) < 0.55) continue;
      if ((p.type === 'paris_balcony_drawbridge' || p.type === 'morocco_cedar_bridge' || p.type === 'maya_stone_bridge') && (p.bridgeAnim || 0) < 0.65) continue;
      if (p.type === 'cafe_awning_fold' && p.foldSolid === false) continue;
      if (p.oneWay) continue;
      if (
        cat.x < p.x + p.w &&
        cat.x + cat.w > p.x &&
        cat.y + 4 < p.y + p.h &&
        cat.y + cat.h - 4 > p.y
      ) {
        if (cat.vx > 0) {
          cat.x = p.x - cat.w;
          cat.vx = 0;
          if (p.climbable === true && !cat.onGround) cat.wallDir = 1;
        } else if (cat.vx < 0) {
          cat.x = p.x + p.w;
          cat.vx = 0;
          if (p.climbable === true && !cat.onGround) cat.wallDir = -1;
        }
      } else if (
        p.climbable === true &&
        !cat.onGround &&
        cat.y + 6 < p.y + p.h &&
        cat.y + cat.h - 6 > p.y
      ) {
        // Stable flush-contact sensor so Mashmasha holds her wall-climb pose without flickering
        // even on frames where vx === 0 while clinging to a climbable wall
        if (Math.abs((cat.x + cat.w) - p.x) <= 2.5 && (cat.vx >= 0 || cat.facing === 1)) {
          cat.wallDir = 1;
        } else if (Math.abs(cat.x - (p.x + p.w)) <= 2.5 && (cat.vx <= 0 || cat.facing === -1)) {
          cat.wallDir = -1;
        }
      }
    }
  }

  function resolveCollisionsY(platforms, prevBottom) {
    let landed = false;
    let currentNarrow = false;
    let standingPlatform = null;
    const wasAirborne = !cat.onGround;

    for (const p of platforms) {
      if (p.hiddenInDay && !cat.nightVision) continue;
      if (p.broken || (p.nonSolid && p.type !== 'swiss_waterwheel_mill' && p.type !== 'swiss_cuckoo_clock' && p.type !== 'swiss_fondue_cauldron')) continue;
      if (p.type === 'maya_vault_door' && (p.openAnim || 0) >= 0.78) continue;
      if (p.type === 'swiss_avalanche_bell') continue;
      if (p.type === 'wind_zone' || p.type === 'blizzard_zone' || p.type === 'thermal_updraft' || p.type === 'steam_ramen_vent' || p.type === 'pendulum_censer' || p.type === 'wagasa_ricochet' || p.type === 'tunnel_clearance' || p.type === 'track_switch_lever' || p.type === 'carnival_bell_swing' || p.type === 'canal_tide_gate' || p.type === 'venice_water_spout' || p.type === 'paris_chimney_updraft' || p.type === 'paris_bridge_crank' || p.type === 'morocco_fountain_geyser' || p.type === 'morocco_cedar_lever' || p.type === 'maya_cenote_geyser' || p.type === 'maya_jade_switch' || p.type === 'greece_sun_mirror' || p.type === 'greece_poseidon_wave' || p.type === 'greece_lyre_pillar' || p.type === 'greece_medusa_aegis' || p.type === 'greece_discobolus' || p.type === 'greece_zeus_obelisk' || p.type === 'battir_madud_gate' || p.type === 'battir_roman_bath_vent' || p.type === 'battir_taboon_oven' || p.type === 'battir_sabr_hedge' || p.type === 'battir_flash_sluice' || p.type === 'battir_locomotive_crossing' || p.type === 'battir_beehive_swarm' || p.type === 'istanbul_samovar_vent' || p.type === 'istanbul_hammam_valve' || p.type === 'istanbul_simit_vendor' || p.type === 'istanbul_tram_crossing' || p.type === 'istanbul_balik_grill' || p.type === 'istanbul_medusa_cistern' || p.type === 'istanbul_whirling_censer' || p.type === 'istanbul_dondurma_trick' || p.type === 'istanbul_kestane_cart' || p.type === 'swiss_cheese_wheel' || p.type === 'swiss_alphorn_gust' || p.type === 'swiss_rescue_hut') continue;
      if (p.type === 'istanbul_drawbridge_leaf') {
        const bOverlapX = cat.x + 6 < p.x + p.w - 6 && cat.x + cat.w - 6 > p.x + 6;
        if (bOverlapX) {
          const baseY = p.baseY !== undefined ? p.baseY : p.y;
          const openT = Math.max(0, Math.min(1, p.liftT || 0));
          const tiltAng = openT * 0.52;
          const halfW = p.w * 0.5;
          const catCx = cat.x + cat.w * 0.5;
          const distEdge = Math.max(0, Math.min(halfW, Math.min(catCx - p.x, (p.x + p.w) - catCx)));
          // Center ship-channel gap opens when twin bascule leaves rotate past 55%
          if (!(openT >= 0.55 && distEdge > halfW - 38)) {
            const leafTopY = baseY - Math.sin(tiltAng) * distEdge;
            const stickTol = !wasAirborne ? 14 : 3;
            if (cat.vy >= 0 && prevBottom <= leafTopY + 18 && cat.y + cat.h >= leafTopY - stickTol) {
              cat.y = leafTopY - cat.h;
              cat.vy = 0;
              landed = true;
              standingPlatform = p;
            }
          }
        }
        continue;
      }
      if (p.type === 'greece_light_bridge' && (p.activeTimer || 0) <= 0) continue;
      if (p.type === 'maya_rolling_wheel') {
        const wOverlapX = cat.x + 8 < p.x + p.w - 8 && cat.x + cat.w - 8 > p.x + 8;
        const stickTol = !wasAirborne ? 10 : 2;
        const rimArcDip = wOverlapX
          ? Math.pow(((cat.x + cat.w * 0.5) - (p.x + p.w * 0.5)) / (p.w * 0.5), 2) * 10
          : 0;
        const rimTopY = p.y + rimArcDip;
        if (wOverlapX && cat.vy >= 0 && prevBottom <= rimTopY + 18 && cat.y + cat.h >= rimTopY - stickTol) {
          cat.y = rimTopY - cat.h;
          cat.vy = 0;
          landed = true;
          standingPlatform = p;
        }
        continue;
      }
      if (p.type === 'swiss_fondue_cauldron') {
        if ((p.bridgeTimer || 0) > 0) {
          const stickTol = !wasAirborne ? 12 : 2;
          const bw = p.bridgeW || 138;
          const px0 = p.x + p.w * 0.5 - bw * 0.5;
          const py0 = p.y + p.h - 108;
          const fOverlapX = cat.x + 4 < px0 + bw && cat.x + cat.w - 4 > px0;
          if (fOverlapX && cat.vy >= 0 && prevBottom <= py0 + 18 && cat.y + cat.h >= py0 - stickTol) {
            cat.y = py0 - cat.h;
            cat.vy = 0;
            landed = true;
            standingPlatform = p;
          }
        }
        continue;
      }
      if (p.type === 'swiss_cuckoo_clock') {
        if ((p.cuckooOut || 0) >= 0.45) {
          const stickTol = !wasAirborne ? 12 : 2;
          const px0 = p.x + p.w * 0.5 - 42;
          const pw0 = 84;
          const py0 = p.y - 29;
          const cOverlapX = cat.x + 4 < px0 + pw0 && cat.x + cat.w - 4 > px0;
          if (cOverlapX && cat.vy >= 0 && prevBottom <= py0 + 18 && cat.y + cat.h >= py0 - stickTol) {
            cat.y = py0 - cat.h;
            cat.vy = 0;
            landed = true;
            standingPlatform = p;
          }
        }
        continue;
      }
      if (p.type === 'moulin_sail_wheel' || p.type === 'battir_noria_wheel' || p.type === 'swiss_waterwheel_mill') {
        if (p.blades) {
          const stickTol = !wasAirborne ? 12 : 2;
          for (let bi = 0; bi < p.blades.length; bi++) {
            const b = p.blades[bi];
            const bOverlapX = cat.x + 4 < b.x + b.w && cat.x + cat.w - 4 > b.x;
            const maxY = Math.max(b.y, b.prevY !== undefined ? b.prevY : b.y);
            const minY = Math.min(b.y, b.prevY !== undefined ? b.prevY : b.y);
            if (bOverlapX && cat.vy >= 0 && prevBottom <= maxY + 18 && cat.y + cat.h >= minY - stickTol) {
              cat.y = b.y - cat.h;
              cat.vy = 0;
              landed = true;
              standingPlatform = p;
              p.standingBladeIdx = bi;
              break;
            }
          }
        }
        continue;
      }
      if (p.type === 'morocco_lantern_swing' || p.type === 'maya_vine_swing') {
        if (p.platX !== undefined && p.platY !== undefined) {
          const stickTol = !wasAirborne ? 12 : 2;
          const lOverlapX = cat.x + 4 < p.platX + p.w && cat.x + cat.w - 4 > p.platX;
          const maxY = Math.max(p.platY, p.prevPlatY !== undefined ? p.prevPlatY : p.platY);
          const minY = Math.min(p.platY, p.prevPlatY !== undefined ? p.prevPlatY : p.platY);
          if (lOverlapX && cat.vy >= 0 && prevBottom <= maxY + 18 && cat.y + cat.h >= minY - stickTol) {
            cat.y = p.platY - cat.h;
            cat.vy = 0;
            landed = true;
            standingPlatform = p;
          }
        }
        continue;
      }
      if (p.type === 'phase_platform' && p.phaseSolid === false) continue;
      if (p.type === 'jump_flip_panel' && p.flipActive === false) continue;
      if (p.type === 'switch_rail_bridge' && (p.extendAnim || 0) < 0.55) continue;
      if ((p.type === 'paris_balcony_drawbridge' || p.type === 'morocco_cedar_bridge' || p.type === 'maya_stone_bridge') && (p.bridgeAnim || 0) < 0.65) continue;
      if (p.type === 'cafe_awning_fold' && p.foldSolid === false) continue;
      const overlapX = cat.x + 4 < p.x + p.w && cat.x + cat.w - 4 > p.x;
      if (!overlapX) continue;

      const effY = p.y + (p.sinkOffset || 0);

      if (p.oneWay) {
        const stickTol = !wasAirborne ? 6 : 0;
        if (cat.vy >= 0 && prevBottom <= effY + 14 && cat.y + cat.h >= effY - stickTol) {
          cat.y = effY - cat.h;
      if (p.bouncy || p.type === 'battir_olive_bough' || p.type === 'battir_fig_canopy' || p.type === 'istanbul_bazaar_awning' || p.type === 'swiss_hay_bounce' || p.type === 'airport_suitcase_bounce') {
            const mult = (p.type === 'circus_trampoline' || p.type === 'maya_bounce_drum') ? 1.44 : (p.type === 'paris_awning_spring' || p.type === 'souk_carpet_bounce') ? 1.42 : p.type === 'bamboo_spring' ? 1.40 : p.type === 'oasis_palm_bounce' ? 1.38 : p.type === 'flower_bounce' ? 1.36 : p.type === 'ice_bounce' ? 1.34 : 1.28;
            cat.vy = (p.type === 'battir_olive_bough' || p.type === 'battir_fig_canopy' || p.type === 'istanbul_bazaar_awning' || p.type === 'swiss_hay_bounce' || p.type === 'airport_suitcase_bounce') ? (p.bounceVy || -780) : (-cat.physics.jumpForce * mult);
            cat.scaleX = 0.94;
            cat.scaleY = 1.07;
            p.bounceAnim = 1;
            Audio.playJump();
            if (p.type === 'battir_olive_bough' || p.type === 'battir_fig_canopy' || p.type === 'istanbul_bazaar_awning' || p.type === 'swiss_hay_bounce' || p.type === 'airport_suitcase_bounce') {
              Particles.spawnDust(cat.x + cat.w * 0.5, cat.y + cat.h, 12, p.type === 'airport_suitcase_bounce' ? '#fbbf24' : p.type === 'swiss_hay_bounce' ? '#fde047' : p.type === 'istanbul_bazaar_awning' ? '#f59e0b' : (p.type === 'battir_fig_canopy' ? '#22c55e' : '#84cc16'));
            }
            if (p.type === 'flower_bounce') {
              // Firm, poised botanical cushion dip (sturdy, no wild shaking!) & lush nectar burst
              const impactOffset = Math.max(-1, Math.min(1, ((cat.x + cat.w / 2) - (p.x + p.w / 2)) / (p.w * 0.5)));
              p.stemBend = Math.min(11, (p.stemBend || 0) + 7.5);
              p.stemBendVel = 48;
              p.stemLean = Math.max(-0.14, Math.min(0.14, (p.stemLean || 0) + impactOffset * 0.08));
              p.stemLeanVel = impactOffset * 1.45 + (cat.vx / 330) * 0.45;
              p.petalSpread = 0.85;
              if (Particles.spawnNectarBurst) {
                Particles.spawnNectarBurst(p.x + p.w / 2, p.y + 8);
              } else {
                Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 9, '#fde047');
              }
            } else if (p.type === 'mushroom') {
              // Soft elastic sponge compression & rebound on mushroom jump!
              const impactOffset = Math.max(-1, Math.min(1, ((cat.x + cat.w / 2) - (p.x + p.w / 2)) / (p.w * 0.5)));
              p.spongeSquish = 0.92;
              p.spongeVel = 8.5;
              p.spongeTilt = impactOffset * 0.14;
              p.spongeTiltVel = impactOffset * 1.8 + (cat.vx / 330) * 0.6;
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 11, '#fef08a');
            } else if (p.type === 'ice_bounce') {
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 11, '#bae6fd');
            } else if (p.type === 'circus_trampoline') {
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 13, '#fde047');
            } else if (p.type === 'oasis_palm_bounce') {
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 12, '#4ade80');
            } else if (p.type === 'bamboo_spring') {
              if (Audio.playBambooClack) Audio.playBambooClack();
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 12, '#86efac');
            } else if (p.type === 'maya_bounce_drum') {
              if (Audio.playStoneThud) Audio.playStoneThud();
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 8, '#34d399');
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h - 4, 6, '#fbbf24');
            } else {
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 9, '#ffb35c');
            }
          } else {
            if (wasAirborne && cat.vy > 160) {
              const impact = Math.min(1, (cat.vy - 160) / 540);
              cat.landTimer = 0.18 + impact * 0.08;
              cat.scaleX = 1.05 + impact * 0.06;
              cat.scaleY = 0.95 - impact * 0.06;
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, Math.round(4 + impact * 6));
            }
            cat.vy = 0;
            landed = true;
            standingPlatform = p;
            if (p.narrow) currentNarrow = true;
          }
        }
      } else {
        if (p.type === 'crushing_lantern' && p.crushState === 'drop' && prevBottom > effY + 18) continue;
        if (cat.y < effY + p.h && cat.y + cat.h > effY) {
          if (cat.vy >= 0) {
            cat.y = effY - cat.h;
            if (wasAirborne && cat.vy > 160) {
              const impact = Math.min(1, (cat.vy - 160) / 540);
              cat.landTimer = 0.18 + impact * 0.08;
              cat.scaleX = 1.05 + impact * 0.06;
              cat.scaleY = 0.95 - impact * 0.06;
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, Math.round(4 + impact * 6));
            }
            cat.vy = 0;
            landed = true;
            standingPlatform = p;
            if (p.narrow) currentNarrow = true;
          } else if (cat.vy < 0) {
            cat.y = effY + p.h;
            if (p.type === 'crushing_lantern') {
              const floorTop = (p.dropY !== undefined ? p.dropY + p.h : 630) - cat.h;
              if (cat.y > floorTop) cat.y = floorTop;
            }
            cat.vy = 0;
          }
        }
      }
    }

    for (const p of platforms) {
      if (p.type === 'clothesline' || p.type === 'rigging' || p.type === 'cable' || p.type === 'tightrope' || p.type === 'paris_laundry_line') {
        if (p === standingPlatform) {
          p.catStanding = true;
          p.catLoadX = Math.max(0.08, Math.min(0.92, (cat.x + cat.w / 2 - p.x) / p.w));
          if (wasAirborne && prevBottom <= p.y + 10) {
            p.ropeSpringVel = (p.ropeSpringVel || 0) + 12;
          }
        } else {
          p.catStanding = false;
        }
      }
    }

    cat.onGround = landed;
    cat.onNarrow = currentNarrow;
    return standingPlatform;
  }

  function update(dt, input, level) {
    cat.animTime += dt;
    if (cat.invulnTimer > 0) cat.invulnTimer -= dt;
    if (cat.hurtTimer > 0) cat.hurtTimer = Math.max(0, cat.hurtTimer - dt);
    if (cat.respawnLockTimer > 0) cat.respawnLockTimer = Math.max(0, cat.respawnLockTimer - dt);
    if (cat.landTimer > 0) cat.landTimer = Math.max(0, cat.landTimer - dt);
    if (cat.meowCooldown > 0) cat.meowCooldown = Math.max(0, cat.meowCooldown - dt);
    if (cat.playWithCatTimer > 0) {
      cat.playWithCatTimer = Math.max(0, cat.playWithCatTimer - dt);
      if (cat.playWithCatTimer < 2.05 && (input.left || input.right || input.jumpPressed || !cat.onGround)) {
        cat.playWithCatTimer = 0;
      }
    }

    // Shield automatic recharge
    if (cat.shieldEnabled && !cat.shieldActive) {
      cat.shieldTimer -= dt;
      if (cat.shieldTimer <= 0) {
        cat.shieldActive = true;
        Particles.spawnShieldBurst(cat.x + cat.w / 2, cat.y + cat.h / 2);
        const readyTxt = window.Game.I18n ? window.Game.I18n.t('popup_shield_ready') : '🛡️ درع جاهز!';
        Particles.spawnPopup(cat.x + cat.w / 2, cat.y - 18, readyTxt, '#7dd3fc');
      }
    }

    // Cosmetic skin sparkle trails while moving
    if (cat.skin !== 'classic' && (Math.abs(cat.vx) > 65 || !cat.onGround)) {
      cat.trailTimer += dt;
      if (cat.trailTimer >= 0.085) {
        cat.trailTimer = 0;
        const trailCol =
          cat.skin === 'crown'
            ? '#fde047'
            : cat.skin === 'scarf'
            ? '#f87171'
            : cat.skin === 'starlight'
            ? '#fef08a'
            : cat.skin === 'cyber'
            ? '#22d3ee'
            : '#fef3c7';
        Particles.spawnTrailDot(cat.x + cat.w / 2 - cat.facing * 12, cat.y + cat.h * 0.55, trailCol);
      }
    }

    cat.scaleX += (1 - cat.scaleX) * Math.min(1, dt * 10);
    cat.scaleY += (1 - cat.scaleY) * Math.min(1, dt * 10);

    // Stage 24 Pok-Ta-Pok Serpent Launch Ring magnetic dock & precision parabolic arc flight!
    let inRingOverride = false;
    if (cat.inSerpentRing) {
      const ring = cat.inSerpentRing;
      const rcx = ring.x + ring.w * 0.5;
      const rcy = ring.y + ring.h * 0.5;
      cat.ringDockTimer = Math.max(0, (cat.ringDockTimer || 0) - dt);
      cat.x = rcx - cat.w * 0.5;
      cat.y = rcy - cat.h * 0.5;
      cat.vx = 0;
      cat.vy = 0;
      cat.onGround = false;
      cat.facing = (ring.targetX !== undefined ? ring.targetX - rcx : (ring.launchVx || 1)) >= 0 ? 1 : -1;
      if (cat.ringDockTimer <= 0 || input.jumpPressed) {
        cat.inSerpentRing = null;
        ring.ringCd = 0.38;
        ring.chargeAnim = 1.0;
        if (Audio.playJump) Audio.playJump();
        if (Audio.playBambooClack) Audio.playBambooClack();
        Particles.spawnDust(rcx, rcy, 12, '#34d399');
        Particles.spawnDust(rcx, rcy, 8, '#fde047');
        if (ring.targetX !== undefined && ring.targetY !== undefined) {
          cat.ringFlight = {
            sx: cat.x,
            sy: cat.y,
            tx: ring.targetX - cat.w * 0.5,
            ty: ring.targetY - cat.h * 0.5,
            arcH: ring.arcHeight || 68,
            dur: ring.flightTime || 0.48,
            elapsed: 0,
          };
        } else {
          cat.vx = ring.launchVx || 560;
          cat.vy = -(ring.launchVy || 560);
        }
      } else {
        inRingOverride = true;
      }
    }

    if (!inRingOverride && cat.ringFlight) {
      const rf = cat.ringFlight;
      rf.elapsed += dt;
      const u = Math.min(1, rf.elapsed / rf.dur);
      const nextX = rf.sx + (rf.tx - rf.sx) * u;
      const nextY = rf.sy + (rf.ty - rf.sy) * u - 4 * rf.arcH * u * (1 - u);
      cat.vx = (nextX - cat.x) / Math.max(0.001, dt);
      cat.vy = (nextY - cat.y) / Math.max(0.001, dt);
      cat.x = nextX;
      cat.y = nextY;
      cat.facing = rf.tx >= rf.sx ? 1 : -1;
      cat.onGround = false;
      if (Math.random() < dt * 36) {
        Particles.spawnTrailDot(cat.x + cat.w * 0.5, cat.y + cat.h * 0.5, Math.random() < 0.5 ? '#34d399' : '#fde047');
      }
      for (const p of level.platforms) {
        if (p.type === 'maya_serpent_ring' && !(p.ringCd > 0)) {
          const rcx = p.x + p.w * 0.5;
          const rcy = p.y + p.h * 0.5;
          if (Math.hypot((cat.x + cat.w * 0.5) - rcx, (cat.y + cat.h * 0.5) - rcy) < 42) {
            cat.ringFlight = null;
            cat.inSerpentRing = p;
            cat.ringDockTimer = 0.14;
            p.chargeAnim = 1.0;
            if (Audio.playTreat) Audio.playTreat();
            Particles.spawnDust(rcx, rcy, 8, '#fde047');
            inRingOverride = true;
            break;
          }
        }
      }
      if (!inRingOverride) {
        if (u >= 1) {
          const dir = rf.tx >= rf.sx ? 1 : -1;
          cat.ringFlight = null;
          cat.vx = dir * 220;
          cat.vy = 60;
        } else {
          inRingOverride = true;
        }
      }
    }

    let standing = null;
    if (!inRingOverride) {
    const lockedByRespawn = cat.respawnLockTimer > 0;
    cat.crouching = !lockedByRespawn && (input.shift || input.down);
    if (cat.crouching && cat.onGround) {
      cat.crouchTime += dt;
    } else {
      cat.crouchTime = 0;
    }

    let moveDir = 0;
    if (!lockedByRespawn && !(cat.playWithCatTimer > 0 && cat.onGround)) {
      if (input.left) moveDir -= 1;
      if (input.right) moveDir += 1;
    }
    if (moveDir !== 0) cat.facing = moveDir;

    if (cat.eggplantBoostTimer > 0) {
      cat.eggplantBoostTimer = Math.max(0, cat.eggplantBoostTimer - dt);
      if (Math.random() < dt * 16) Particles.spawnTrailDot(cat.x + cat.w * 0.5, cat.y + cat.h - 4, '#a855f7');
    }

    let targetSpeed = moveDir * cat.physics.runSpeed * (cat.eggplantBoostTimer > 0 ? 1.28 : 1);
    if (cat.crouching && cat.onGround) {
      targetSpeed *= 0.52;
    }

    if (cat.onGround && cat.onNarrow && !cat.crouching && moveDir !== 0) {
      cat.balancePhase += dt * 12;
      targetSpeed += Math.sin(cat.balancePhase) * 65;
    }

    if (cat.onGround) {
      cat.wagasaBoostTimer = 0;
    } else if (cat.wagasaBoostTimer > 0) {
      cat.wagasaBoostTimer = Math.max(0, cat.wagasaBoostTimer - dt);
    }

    const accel = cat.onGround ? (cat.onSlippery ? 3.8 : 18) : 13;
    if (lockedByRespawn) {
      cat.vx = 0;
    } else if (!cat.onGround && cat.wagasaBoostTimer > 0) {
      const boostDir = Math.sign(cat.vx) || cat.facing;
      if (moveDir === -boostDir) {
        cat.vx += (targetSpeed - cat.vx) * Math.min(1, dt * 4.5);
      } else if (moveDir === boostDir && Math.abs(targetSpeed) > Math.abs(cat.vx)) {
        cat.vx += (targetSpeed - cat.vx) * Math.min(1, dt * 6);
      } else {
        cat.vx *= Math.max(0.85, 1 - dt * 0.45);
      }
    } else {
      cat.vx += (targetSpeed - cat.vx) * Math.min(1, dt * accel);
    }

    // Crosswind & Periodic Arctic Blizzard Gust Zone physics (crouching anchors Mashmasha!)
    for (const p of level.platforms) {
      if (p.type === 'wind_zone') {
        if (cat.x + cat.w > p.x && cat.x < p.x + p.w && cat.y + cat.h > p.y && cat.y < p.y + p.h) {
          const anchor = cat.crouching && cat.onGround ? 0.22 : 1;
          cat.vx += (p.windDir || 1) * (p.windForce || 540) * anchor * dt;
        }
      } else if (p.type === 'blizzard_zone') {
        // Periodic cycle: 3.0s calm -> 0.9s howling warning -> 2.8s fierce blizzard gust (total 6.7s)
        const cyc = (cat.animTime + (p.phase || 0)) % 6.7;
        if (cyc >= 3.9 && cat.x + cat.w > p.x && cat.x < p.x + p.w && cat.y + cat.h > p.y && cat.y < p.y + p.h) {
          const anchor = cat.crouching && cat.onGround ? 0.16 : 1;
          cat.vx += (p.windDir || -1) * (p.windForce || 500) * anchor * dt;
        }
      } else if (p.type === 'thermal_updraft' || p.type === 'steam_ramen_vent') {
        // Periodic cycle: calm -> shimmering warning -> strong rising column (total 4.8s)
        const cyc = (cat.animTime + (p.phase || 0)) % 4.8;
        if (cyc >= 2.4 && cat.x + cat.w > p.x && cat.x < p.x + p.w && cat.y + cat.h > p.y - 24 && cat.y < p.y + p.h + 10) {
          const effLift = Math.max(2650, (p.liftForce || 1200) * 2.15);
          if (cat.vy > 80) cat.vy *= 0.72;
          cat.vy = Math.max(-520, cat.vy - effLift * dt);
          cat.onGround = false;
          cat.coyoteTimer = Math.max(cat.coyoteTimer || 0, 0.14);
          const dotCol = p.type === 'steam_ramen_vent' ? '#f8fafc' : '#fde047';
          if (Math.random() < dt * 18) Particles.spawnTrailDot(cat.x + cat.w / 2, cat.y + cat.h, dotCol);
        }
      }
    }

    if (cat.onGround && Math.abs(cat.vx) > 20) {
      cat.walkTime += dt * (Math.abs(cat.vx) / cat.physics.runSpeed);
    }

    if (cat.onGround) {
      cat.coyoteTimer = 0.13;
    } else {
      cat.coyoteTimer = Math.max(0, cat.coyoteTimer - dt);
    }

    if (lockedByRespawn) {
      cat.jumpBufferTimer = 0;
    } else if (input.jumpPressed) {
      cat.jumpBufferTimer = 0.15;
    } else {
      cat.jumpBufferTimer = Math.max(0, cat.jumpBufferTimer - dt);
    }

    if (cat.jumpBufferTimer > 0) {
      let didJump = false;
      if (cat.coyoteTimer > 0) {
        const eqBoost = cat.onSolarCrest ? 1.34 : 1.0;
        cat.vy = -cat.physics.jumpForce * eqBoost;
        if (Math.abs(cat.vx) > 80) {
          cat.vx = Math.sign(cat.vx) * Math.min(cat.physics.runSpeed * 1.12, Math.abs(cat.vx) * 1.07);
        }
        cat.onGround = false;
        cat.coyoteTimer = 0;
        cat.jumpBufferTimer = 0;
        cat.scaleX = eqBoost > 1 ? 0.88 : 0.95;
        cat.scaleY = eqBoost > 1 ? 1.14 : 1.05;
        Audio.playJump();
        if (eqBoost > 1) {
          cat.onSolarCrest = false;
          if (Audio.playTreat) Audio.playTreat();
          Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 10, '#fde047');
          Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h - 4, 6, '#34d399');
        } else {
          Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 5);
        }
        didJump = true;
      } else if (cat.wallDir !== 0) {
        cat.vy = -cat.physics.jumpForce * 0.94;
        cat.vx = -cat.wallDir * cat.physics.runSpeed * 1.15;
        cat.facing = -cat.wallDir;
        cat.wallDir = 0;
        cat.jumpBufferTimer = 0;
        cat.scaleX = 0.95;
        cat.scaleY = 1.05;
        Audio.playJump();
        Audio.playWallScratch();
        Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h / 2, 6, '#ffd36e');
        didJump = true;
      }
      if (didJump && level && level.platforms) {
        level.jumpParity = (level.jumpParity || 0) ^ 1;
        if (level.hasJumpFlip && Audio.playBambooClack) Audio.playBambooClack();
      }
    }

    if (!input.jumpHeld && cat.vy < -220 && !(cat.wagasaBoostTimer > 0)) {
      cat.vy += cat.physics.gravity * 1.45 * dt;
    }

    let gravMult = 1;
    if (!cat.onGround && Math.abs(cat.vy) < 145) {
      gravMult = 0.68;
    } else if (!cat.onGround && cat.vy > 145 && !(cat.hasWingsGlide && input.jumpHeld)) {
      gravMult = 1.20;
    }
    cat.vy += cat.physics.gravity * gravMult * dt;

    // Angel Wings smooth glide when holding jump while falling
    if (cat.hasWingsGlide && input.jumpHeld && !cat.onGround && cat.vy > 195 && cat.wallDir === 0) {
      cat.vy = Math.min(cat.vy, 215);
    }
    if (cat.wallDir !== 0 && cat.vy > cat.physics.wallSlideSpeed) {
      const pressingTowardWall =
        (cat.wallDir === 1 && input.right) || (cat.wallDir === -1 && input.left);
      if (pressingTowardWall) {
        cat.vy = cat.physics.wallSlideSpeed;
        if (Math.random() < dt * 10) {
          Particles.spawnDust(
            cat.wallDir === 1 ? cat.x + cat.w : cat.x,
            cat.y + cat.h * 0.5,
            1,
            '#e8c49a'
          );
        }
      }
    }
    if (cat.vy > 1050) cat.vy = 1050;

    cat.x += cat.vx * dt;
    if (cat.x < 0) {
      cat.x = 0;
      cat.vx = 0;
    }
    if (cat.x + cat.w > level.width) {
      cat.x = level.width - cat.w;
      cat.vx = 0;
    }
    resolveCollisionsX(level.platforms);

    const prevBottom = cat.y + cat.h;
    cat.y += cat.vy * dt;
    standing = resolveCollisionsY(level.platforms, prevBottom);

    // Advance continuous vertical wall-climb walking cycle while clinging/climbing on a wall
    if (!cat.onGround && cat.wallDir !== 0) {
      const climbRate = cat.vy < -25 ? 2.8 : 1.85;
      cat.wallClimbTime = (cat.wallClimbTime || 0) + dt * climbRate;
    }
    }

    let activeDip = 0;
    cat.onSolarCrest = false;
    for (const p of level.platforms) {
      if (p.type === 'clothesline' || p.type === 'rigging' || p.type === 'cable' || p.type === 'tightrope' || p.type === 'paris_laundry_line') {
        const targetSag = p.catStanding ? 11 : 0;
        p.ropeSag = p.ropeSag || 0;
        p.ropeSpringVel = p.ropeSpringVel || 0;
        const force = (targetSag - p.ropeSag) * 145;
        p.ropeSpringVel = (p.ropeSpringVel + force * dt) * Math.exp(-8.5 * dt);
        p.ropeSag = Math.max(-2, p.ropeSag + p.ropeSpringVel * dt);
        if (p === standing) {
          const t = p.catLoadX !== undefined ? p.catLoadX : 0.5;
          const baseSag = p.type === 'clothesline' ? 10 : p.type === 'rigging' ? 8 : 6;
          activeDip = (baseSag + p.ropeSag) * (2 * (1 - t) * t) + 1;
        }
      }
      if (p.type === 'flower_bounce') {
        // Firm, poised, critically-damped botanical spring (smooth gentle flex without excessive wobble!)
        p.stemBend = p.stemBend || 0;
        p.stemBendVel = p.stemBendVel || 0;
        p.stemLean = p.stemLean || 0;
        p.stemLeanVel = p.stemLeanVel || 0;
        p.petalSpread = p.petalSpread || 0;

        const bendForce = -p.stemBend * 210;
        p.stemBendVel = (p.stemBendVel + bendForce * dt) * Math.exp(-13.5 * dt);
        p.stemBend = Math.max(-3, Math.min(13, p.stemBend + p.stemBendVel * dt));

        const leanForce = -p.stemLean * 120;
        p.stemLeanVel = (p.stemLeanVel + leanForce * dt) * Math.exp(-10.5 * dt);
        p.stemLean = Math.max(-0.18, Math.min(0.18, p.stemLean + p.stemLeanVel * dt));

        if (p.petalSpread > 0) {
          p.petalSpread = Math.max(0, p.petalSpread - dt * 2.4);
        }
      }
      if (p.bounceAnim > 0) {
        p.bounceAnim = Math.max(0, p.bounceAnim - dt * 2.2);
      }
      if (p.type === 'mushroom') {
        // Elastic sponge spring-damper physics (squishes down & widens like a soft sponge, then springs back with a juicy jiggle!)
        p.spongeSquish = p.spongeSquish || 0;
        p.spongeVel = p.spongeVel || 0;
        p.spongeTilt = p.spongeTilt || 0;
        p.spongeTiltVel = p.spongeTiltVel || 0;

        const spForce = -p.spongeSquish * 240;
        p.spongeVel = (p.spongeVel + spForce * dt) * Math.exp(-7.5 * dt);
        p.spongeSquish = Math.max(-0.45, Math.min(1.05, p.spongeSquish + p.spongeVel * dt));

        const tForce = -p.spongeTilt * 180;
        p.spongeTiltVel = (p.spongeTiltVel + tForce * dt) * Math.exp(-8.0 * dt);
        p.spongeTilt = Math.max(-0.22, Math.min(0.22, p.spongeTilt + p.spongeTiltVel * dt));
      }
      if (p.type === 'paper_lantern_swing') {
        const prevX = p.x;
        const base = p.baseX !== undefined ? p.baseX : p.x;
        p.x = base + Math.sin(cat.animTime * (p.swingSpeed || 1.6) + (p.phase || 0)) * (p.swingAmp || 44);
        if (p === standing) {
          cat.x += (p.x - prevX);
          p.sinkOffset = Math.min(6, (p.sinkOffset || 0) + dt * 28);
        } else {
          p.sinkOffset = Math.max(0, (p.sinkOffset || 0) - dt * 20);
        }
      }
      if (p.type === 'crumble' || p.type === 'ice_crumble' || p.type === 'crumble_sandstone' || p.type === 'koi_bridge_planks' || p.type === 'greece_crumble_column' || p.type === 'battir_vine_trellis') {
        if (p === standing && !p.broken && !p.crumbleTimer) {
          p.crumbleTimer = (p.type === 'crumble_sandstone' || p.type === 'battir_vine_trellis') ? 0.9 : (p.type === 'koi_bridge_planks' || p.type === 'greece_crumble_column') ? 0.85 : 1.25;
        }
        if (p.crumbleTimer > 0) {
          p.crumbleTimer -= dt;
          if (p.type === 'crumble_sandstone') {
            const stress = Math.max(0, Math.min(1, 1 - p.crumbleTimer / 0.9));
            if (Math.random() < dt * (10 + stress * 24)) {
              const seam = [0.21, 0.44, 0.64, 0.82][Math.floor(Math.random() * 4)];
              const col = Math.random() < 0.55 ? '#f6d083' : '#c97e28';
              Particles.spawnDust(p.x + p.w * seam + (Math.random() - 0.5) * 8, p.y + 24, 1, col);
            }
          } else if (p.type === 'koi_bridge_planks' && Math.random() < dt * 14) {
            Particles.spawnDust(p.x + Math.random() * p.w, p.y + p.h, 1, '#d97706');
          }
          if (p.crumbleTimer <= 0) {
            p.crumbleTimer = 0;
            p.broken = true;
            p.crumbleFall = 0.001;
            p.respawnTimer = 2.2;
            if (p.type === 'crumble_sandstone') {
              for (const seam of [0.21, 0.44, 0.64, 0.82]) {
                Particles.spawnDust(p.x + p.w * seam, p.y + 14, 4, '#f6d083');
                Particles.spawnDust(p.x + p.w * seam, p.y + 18, 3, '#b86b24');
              }
            } else if (p.type === 'koi_bridge_planks') {
              Particles.spawnDust(p.x + p.w / 2, p.y + p.h, 10, '#d97706');
              Particles.spawnDust(p.x + p.w / 2, p.y + p.h + 12, 6, '#7dd3fc');
            } else {
              Particles.spawnDust(p.x + p.w / 2, p.y + p.h / 2, 12, '#bae6fd');
            }
          }
        } else if (p.broken) {
          if (p.crumbleFall > 0 && p.crumbleFall < 1) {
            p.crumbleFall = Math.min(1, p.crumbleFall + dt * 1.65);
          }
          p.respawnTimer -= dt;
          if (p.respawnTimer <= 0) {
            p.broken = false;
            p.crumbleFall = 0;
          }
        }
      }
      if (p.type === 'seesaw') {
        let targetTilt = 0;
        if (p === standing) {
          const offset = Math.max(-1, Math.min(1, ((cat.x + cat.w / 2) - (p.x + p.w / 2)) / (p.w / 2)));
          targetTilt = offset * 0.25;
          cat.vx += Math.sin(p.tiltAngle || 0) * 280 * dt;
        }
        p.tiltAngle = (p.tiltAngle || 0) + (targetTilt - (p.tiltAngle || 0)) * Math.min(1, dt * 6);
      }
      if (p.type === 'escalator' && p === standing) {
        cat.x += (p.direction || 1) * (p.speed || 95) * dt;
      }
      if ((p.type === 'clock_gear' || p.type === 'waterwheel') && p === standing) {
        cat.x += (p.spinDir || 1) * (p.spinSpeed || 1.15) * 85 * dt;
      }
      if (p.type === 'boost_pad' && p === standing) {
        const bdir = p.boostDir || 1;
        cat.vx = bdir * Math.max(540, cat.physics.runSpeed * 1.65);
        cat.facing = bdir;
        if (Math.random() < dt * 25) {
          Particles.spawnTrailDot(cat.x + cat.w / 2, cat.y + cat.h - 4, '#22d3ee');
        }
      }
      if (p.type === 'sink_pad' || p.type === 'ice_floe') {
        const isFloe = p.type === 'ice_floe';
        const waveBob = isFloe ? Math.sin(cat.animTime * 2.8 + (p.phase || 0)) * 3.5 : 0;
        const targetSink = p === standing ? (isFloe ? 46 : 40) : waveBob;
        p.sinkOffset = p.sinkOffset || 0;
        const rate = p === standing ? (isFloe ? 34 : 26) : 54;
        if (p.sinkOffset < targetSink) {
          p.sinkOffset = Math.min(targetSink, p.sinkOffset + rate * dt);
        } else if (p.sinkOffset > targetSink) {
          p.sinkOffset = Math.max(targetSink, p.sinkOffset - rate * dt);
        }
        if (p === standing) {
          cat.y = p.y + p.sinkOffset - cat.h;
        }
      } else if (p.type === 'quicksand') {
        p.sinkOffset = p.sinkOffset || 0;
        if (p === standing) {
          p.sinkOffset = Math.min(40, p.sinkOffset + 22 * dt);
          cat.vx *= Math.max(0.55, 1 - dt * 4.2);
          cat.y = p.y + p.sinkOffset - cat.h;
          if (Math.random() < dt * 10) Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 2, '#f59e0b');
          if (p.sinkOffset >= 38) {
            p.sinkOffset = 0;
            cat.quicksandSunk = true;
          }
        } else {
          p.sinkOffset = Math.max(0, p.sinkOffset - 26 * dt);
        }
      } else if (p.type === 'jump_flip_panel') {
        const active = (p.flipGroup || 0) === (level.jumpParity || 0);
        p.flipActive = active;
        const target = active ? 1 : 0;
        p.flipAnim = p.flipAnim === undefined ? target : p.flipAnim + (target - p.flipAnim) * Math.min(1, dt * 15);
      } else if (p.type === 'wagasa_ricochet') {
        if (p.launchCd > 0) p.launchCd = Math.max(0, p.launchCd - dt);
        if (p.spinAnim > 0) p.spinAnim = Math.max(0, p.spinAnim - dt * 2.4);
        const catchHit =
          cat.x + cat.w > p.x - 16 &&
          cat.x < p.x + p.w + 16 &&
          cat.y + cat.h > p.y - 14 &&
          cat.y < p.y + p.h + 20 &&
          cat.vy >= -280;
        if (!(p.launchCd > 0) && catchHit) {
          const lDir = p.launchDir || 1;
          cat.vx = lDir * (p.launchVx || 520);
          cat.vy = -(p.launchVy || 720);
          cat.facing = lDir;
          cat.onGround = false;
          cat.coyoteTimer = 0;
          cat.wagasaBoostTimer = 0.72;
          cat.scaleX = 0.78;
          cat.scaleY = 1.24;
          p.spinAnim = 1;
          p.launchCd = 0.24;
          if (Audio.playBambooClack) Audio.playBambooClack();
          else Audio.playJump();
          Particles.spawnDust(p.x + p.w / 2, p.y + 6, 12, '#f472b6');
        }
      } else if (p.type === 'crushing_lantern') {
        if (p.restY === undefined) p.restY = p.y;
        if (p.dropY === undefined) p.dropY = 630 - p.h;
        if (!p.crushState) p.crushState = 'idle';
        const prevY = p.y;
        const blkCx = p.x + p.w / 2;
        const catCx = cat.x + cat.w / 2;
        if (p.crushState === 'idle') {
          // Only trigger when Mashmasha is genuinely approaching UNDERNEATH the suspended block (never on top!)
          if (Math.abs(catCx - blkCx) < 88 && cat.y >= p.y + p.h - 10 && cat.y < p.dropY + p.h + 20) {
            p.crushState = 'warn';
            p.crushTimer = 0.50;
          }
        } else if (p.crushState === 'warn') {
          p.crushTimer -= dt;
          if (Math.random() < dt * 16) Particles.spawnDust(p.x + Math.random() * p.w, p.y + p.h, 1, '#cbd5e1');
          if (p.crushTimer <= 0) p.crushState = 'drop';
        } else if (p.crushState === 'drop') {
          p.y = Math.min(p.dropY, p.y + 780 * dt);
          // Strict underneath-core crush check: cat must be genuinely inside the block's underside footprint & pinned near the floor
          const underCoreX = cat.x + cat.w - 14 > p.x && cat.x + 14 < p.x + p.w;
          const underBlockY = cat.y + 8 >= prevY + p.h - 18 && cat.y + 8 <= p.y + p.h + 2;
          const nearFloor = cat.y + cat.h >= p.dropY + p.h - 14 && p.y + p.h >= cat.y + 10;
          if (underCoreX && underBlockY && nearFloor) {
            cat.crushedByBlock = true;
          }
          if (p.y >= p.dropY) {
            p.y = p.dropY;
            p.crushState = 'pause';
            p.crushTimer = 0.95;
            if (Audio.playStoneThud) Audio.playStoneThud();
            Particles.spawnDust(p.x + p.w / 2, p.y + p.h, 12, '#94a3b8');
          }
        } else if (p.crushState === 'pause') {
          p.crushTimer -= dt;
          if (p.crushTimer <= 0) p.crushState = 'rise';
        } else if (p.crushState === 'rise') {
          p.y = Math.max(p.restY, p.y - 98 * dt);
          if (p.y <= p.restY) {
            p.y = p.restY;
            p.crushState = 'idle';
          }
        }
        if (p === standing) {
          cat.y += (p.y - prevY);
        }
      } else if (p.type === 'waterwheel_arm') {
        const prevX = p.x;
        const prevY = p.y;
        const ang = cat.animTime * (p.rotSpeed || 0.92) + (p.armAngle || 0);
        const rad = p.radius || 96;
        p.curAngle = ang;
        p.x = p.hubX + Math.cos(ang) * rad - p.w / 2;
        p.y = p.hubY + Math.sin(ang) * rad - p.h / 2;
        if (p === standing) {
          cat.x += (p.x - prevX);
          cat.y += (p.y - prevY);
        }
      } else if (p.type === 'pinch_wall') {
        if (p.baseX === undefined) p.baseX = p.x;
        const cyc = ((cat.animTime + (p.phase || 0)) % 5.2) / 5.2;
        let raw = 0;
        if (cyc < 0.24) raw = 0;
        else if (cyc < 0.42) raw = (cyc - 0.24) / 0.18;
        else if (cyc < 0.78) raw = 1;
        else if (cyc < 0.94) raw = 1 - (cyc - 0.78) / 0.16;
        else raw = 0;
        const closeT = raw * raw * (3 - 2 * raw);
        p.closeT = closeT;
        p.x = p.baseX + (p.slideDir || 1) * (p.slideDist || 54) * closeT;
        if (cat.x < p.x + p.w && cat.x + cat.w > p.x && cat.y + 4 < p.y + p.h && cat.y + cat.h - 4 > p.y) {
          const sDir = p.slideDir || 1;
          const catCx = cat.x + cat.w * 0.5;
          const onInnerPinchSide = (sDir > 0 && catCx > p.x + p.w * 0.5) || (sDir < 0 && catCx < p.x + p.w * 0.5);
          if (p.canCrush && closeT > 0.90 && onInnerPinchSide) {
            cat.crushedByPinch = true;
          } else if (catCx >= p.x + p.w * 0.5) {
            cat.x = p.x + p.w;
          } else {
            cat.x = p.x - cat.w;
          }
        }
      } else if (p.type === 'steam_piston_lift') {
        if (p.restY === undefined) p.restY = p.y;
        const liftH = p.liftHeight || 150;
        const prevY = p.y;
        const cyc = (cat.animTime + (p.phase || 0)) % 4.6;
        let stroke = 0;
        if (cyc < 1.5) { stroke = 0; p.pistonState = 'idle'; }
        else if (cyc < 2.1) { stroke = 0; p.pistonState = 'warn'; }
        else if (cyc < 2.55) {
          const u = (cyc - 2.1) / 0.45;
          stroke = 1 - Math.pow(1 - u, 3);
          if (p.pistonState !== 'up') { if (Audio.playSteamHiss) Audio.playSteamHiss(); Particles.spawnDust(p.x + p.w / 2, p.y + p.h, 8, '#f1f5f9'); }
          p.pistonState = 'up';
        } else if (cyc < 3.85) { stroke = 1; p.pistonState = 'hold'; }
        else {
          const u = (cyc - 3.85) / 0.75;
          stroke = 1 - u * u;
          p.pistonState = 'down';
        }
        p.stroke = stroke;
        p.y = p.restY - liftH * stroke;
        if (p === standing) {
          cat.y += (p.y - prevY);
        }
      } else if (p.type === 'coal_hopper_conveyor') {
        if (p === standing) {
          cat.x += (p.conveyorSpeed || 150) * dt;
        }
      } else if (p.type === 'coupling_drawbridge') {
        if (p.tiltOffset === undefined) p.tiltOffset = 0;
        if (p === standing) {
          const rel = Math.max(0, Math.min(1, ((cat.x + cat.w * 0.5) - p.x) / p.w));
          const targetTilt = (rel - 0.5) * 44;
          p.tiltOffset += (targetTilt - p.tiltOffset) * Math.min(1, dt * 6.5);
          p.sinkOffset = Math.min(20, 6 + Math.abs(p.tiltOffset) * 0.55);
        } else {
          p.tiltOffset *= Math.max(0, 1 - dt * 5);
          p.sinkOffset = Math.max(0, (p.sinkOffset || 0) - 24 * dt);
        }
      } else if (p.type === 'track_switch_lever') {
        if (p.flipAnim === undefined) p.flipAnim = p.flipped ? 1 : 0;
        if (p.flipped) p.flipAnim = Math.min(1, p.flipAnim + dt * 6);
        if (!p.flipped && cat.x + cat.w > p.x && cat.x < p.x + p.w && cat.y + cat.h > p.y && cat.y < p.y + p.h) {
          p.flipped = true;
          if (Audio.playRailSwitch) Audio.playRailSwitch();
          Particles.spawnDust(p.x + p.w * 0.5, p.y + 10, 10, '#4ade80');
          for (const b of level.platforms) {
            if (b.type === 'switch_rail_bridge' && b.switchId === p.switchId) {
              b.extended = true;
            }
          }
        }
      } else if (p.type === 'switch_rail_bridge') {
        if (p.extendAnim === undefined) p.extendAnim = p.extended ? 1 : 0;
        const target = p.extended ? 1 : 0;
        p.extendAnim += (target - p.extendAnim) * Math.min(1, dt * 4.5);
      } else if (p.type === 'tunnel_clearance') {
        // Low overhead viaduct gantry: crouching slides safely underneath; standing upright hits the beam!
        if (!cat.crouching && cat.x + cat.w - 10 > p.x + 8 && cat.x + 10 < p.x + p.w - 8 && cat.y + 6 < p.y + p.h && cat.y + cat.h > p.y + 20) {
          cat.hitLowBridge = true;
        }
      } else if (p.type === 'pressure_boiler_valve') {
        const cyc = (cat.animTime + (p.phase || 0)) % 4.6;
        const prevSt = p.valveState || 'calm';
        p.valveState = cyc < 1.8 ? 'calm' : cyc < 2.6 ? 'warn' : cyc < 4.0 ? 'blast' : 'calm';
        if (p.valveState === 'blast' && prevSt !== 'blast' && Audio.playSteamHiss) Audio.playSteamHiss();
        if (p.valveState === 'blast') {
          const dir = p.blastDir || -1;
          const bLen = p.blastLen || 150;
          const bx0 = dir > 0 ? p.x + p.w : p.x - bLen;
          const bx1 = dir > 0 ? p.x + p.w + bLen : p.x;
          const by0 = p.y + 12;
          const by1 = p.y + 52;
          if (cat.x + cat.w - 8 > bx0 && cat.x + 8 < bx1 && cat.y + cat.h - 6 > by0 && cat.y + 6 < by1) {
            cat.vx += dir * 640 * dt;
            cat.scaldedBySteam = true;
          }
        }
      } else if (p.type === 'gondola_boat') {
        if (p.baseX === undefined) p.baseX = p.x;
        if (p.baseY === undefined) p.baseY = p.y;
        const prevX = p.x;
        p.x = p.baseX + Math.sin(cat.animTime * (p.driftSpeed || 1.3) + (p.phase || 0)) * (p.driftAmp || 55);
        p.y = p.baseY + Math.sin(cat.animTime * 2.4 + (p.phase || 0)) * 5;
        if (p === standing) {
          p.sinkOffset = Math.min(12, (p.sinkOffset || 0) + 34 * dt);
          cat.x += (p.x - prevX);
          cat.y = p.y + p.sinkOffset - cat.h;
        } else {
          p.sinkOffset = Math.max(0, (p.sinkOffset || 0) - 26 * dt);
        }
      } else if (p.type === 'canal_tide_gate') {
        if (p.spinAnim === undefined) p.spinAnim = p.opened ? 1 : 0;
        p.toggleCooldown = Math.max(0, (p.toggleCooldown || 0) - dt);
        if (p.opened) p.spinAnim = Math.min(1, p.spinAnim + dt * 2.2);
        else p.spinAnim = Math.max(0, p.spinAnim - dt * 2.2);
        const touching = cat.x + cat.w > p.x && cat.x < p.x + p.w && cat.y + cat.h > p.y && cat.y < p.y + p.h;
        if (touching && !p.wasTouching && p.toggleCooldown <= 0) {
          p.opened = !p.opened;
          p.toggleCooldown = 0.45;
          if (Audio.playWaterLock) Audio.playWaterLock();
          Particles.spawnSplash(p.x + p.w * 0.5, p.y + p.h - 6);
          for (const r of level.platforms) {
            if (r.type === 'canal_tide_raft' && r.gateId === p.gateId) r.raised = p.opened;
          }
        }
        p.wasTouching = touching;
      } else if (p.type === 'canal_tide_raft') {
        if (p.restY === undefined) p.restY = p.y;
        if (p.riseT === undefined) p.riseT = p.raised ? 1 : 0;
        if (p.raised) p.riseT = Math.min(1, p.riseT + dt * 0.72);
        else p.riseT = Math.max(0, p.riseT - dt * 0.72);
        const ease = p.riseT * p.riseT * (3 - 2 * p.riseT);
        const bob = Math.sin(cat.animTime * 2.6 + (p.x * 0.01)) * 3.5;
        p.y = p.restY - (p.riseHeight || 150) * ease + bob;
        if (p === standing) {
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'cafe_awning_fold') {
        const cyc = (cat.animTime + (p.phase || 0)) % 5.4;
        p.foldState = cyc < 3.1 ? 'open' : cyc < 3.85 ? 'warn' : 'retracted';
        p.foldSolid = p.foldState !== 'retracted';
        const target = p.foldSolid ? 1 : 0;
        p.foldAnim = p.foldAnim === undefined ? target : p.foldAnim + (target - p.foldAnim) * Math.min(1, dt * 10);
      } else if (p.type === 'venice_water_spout') {
        const cyc = (cat.animTime + (p.phase || 0)) % 4.6;
        p.spoutActive = cyc >= 2.1;
        p.spoutWarn = cyc >= 1.4 && cyc < 2.1;
        if (p.spoutActive && cat.x + cat.w > p.x + 6 && cat.x < p.x + p.w - 6 && cat.y + cat.h > p.y - 26 && cat.y < p.y + p.h + 10) {
          const effLift = Math.max(2700, (p.liftForce || 1240) * 2.2);
          if (cat.vy > 80) cat.vy *= 0.72;
          cat.vy = Math.max(-510, cat.vy - effLift * dt);
          cat.onGround = false;
          cat.coyoteTimer = Math.max(cat.coyoteTimer || 0, 0.14);
        }
      } else if (p.type === 'moulin_sail_wheel' || p.type === 'battir_noria_wheel' || p.type === 'swiss_waterwheel_mill') {
        const r = p.radius || (p.type === 'swiss_waterwheel_mill' ? 114 : p.type === 'battir_noria_wheel' ? 108 : 130);
        if (p.wheelAngle === undefined) p.wheelAngle = p.phase || 0;
        p.wheelAngle += (p.rotSpeed || 0.76) * dt;
        const ang0 = p.wheelAngle;
        if (!p.blades) p.blades = [{}, {}, {}, {}];
        const orbitR = (p.type === 'battir_noria_wheel' || p.type === 'swiss_waterwheel_mill') ? (r * 0.88) : (r * 0.76);
        const bw = (p.type === 'battir_noria_wheel' || p.type === 'swiss_waterwheel_mill') ? 86 : 78;
        for (let bi = 0; bi < 4; bi++) {
          const b = p.blades[bi];
          const prevBx = b.x !== undefined ? b.x : p.x;
          b.prevY = b.y !== undefined ? b.y : p.y;
          const a = ang0 + bi * (Math.PI * 0.5);
          b.x = p.x + Math.cos(a) * orbitR - bw * 0.5;
          b.y = p.y + Math.sin(a) * orbitR - 8;
          b.w = bw;
          b.h = 16;
          if (p === standing && p.standingBladeIdx === bi) {
            cat.x += (b.x - prevBx);
            cat.y = b.y - cat.h;
            cat.coyoteTimer = Math.max(cat.coyoteTimer || 0, 0.14);
          }
        }
      } else if (p.type === 'paris_chimney_updraft') {
        const cyc = (cat.animTime + (p.phase || 0)) % 4.8;
        p.updraftActive = cyc >= 2.2;
        p.updraftWarn = cyc >= 1.45 && cyc < 2.2;
        if (p.updraftActive && cat.x + cat.w > p.x + 6 && cat.x < p.x + p.w - 6 && cat.y + cat.h > p.y - 26 && cat.y < p.y + p.h + 10) {
          const effLift = Math.max(2700, (p.liftForce || 1240) * 2.2);
          if (cat.vy > 80) cat.vy *= 0.72;
          cat.vy = Math.max(-520, cat.vy - effLift * dt);
          cat.onGround = false;
          cat.coyoteTimer = Math.max(cat.coyoteTimer || 0, 0.14);
          if (Math.random() < dt * 16) Particles.spawnTrailDot(cat.x + cat.w * 0.5, cat.y + cat.h, '#fef3c7');
        }
      } else if (p.type === 'paris_bridge_crank') {
        if (p.spinAnim === undefined) p.spinAnim = p.opened ? 1 : 0;
        p.toggleCooldown = Math.max(0, (p.toggleCooldown || 0) - dt);
        if (p.opened) p.spinAnim = Math.min(1, p.spinAnim + dt * 2.4);
        else p.spinAnim = Math.max(0, p.spinAnim - dt * 2.4);
        const touching = cat.x + cat.w > p.x && cat.x < p.x + p.w && cat.y + cat.h > p.y && cat.y < p.y + p.h;
        if (touching && !p.wasTouching && p.toggleCooldown <= 0) {
          p.opened = !p.opened;
          p.toggleCooldown = 0.45;
          if (Audio.playBridgeCrank) Audio.playBridgeCrank();
          Particles.spawnDust(p.x + p.w * 0.5, p.y + p.h * 0.5, 8, '#fde047');
          for (const b of level.platforms) {
            if (b.type === 'paris_balcony_drawbridge' && b.bridgeId === p.bridgeId) b.lowered = p.opened;
          }
        }
        p.wasTouching = touching;
      } else if (p.type === 'paris_balcony_drawbridge' || p.type === 'morocco_cedar_bridge' || p.type === 'maya_stone_bridge') {
        if (p.bridgeAnim === undefined) p.bridgeAnim = p.lowered ? 1 : 0;
        const target = p.lowered ? 1 : 0;
        p.bridgeAnim += (target - p.bridgeAnim) * Math.min(1, dt * 4.2);
      } else if (p.type === 'morocco_lantern_swing' || p.type === 'maya_vine_swing') {
        const prevPx = p.platX !== undefined ? p.platX : p.x - p.w * 0.5;
        p.prevPlatY = p.platY !== undefined ? p.platY : p.y + (p.ropeLen || 260);
        p.swingAngle = Math.sin(cat.animTime * (p.swingSpeed || 1.5) + (p.phase || 0)) * (p.swingAmp || 0.45);
        const len = p.ropeLen || 260;
        p.platX = p.x + Math.sin(p.swingAngle) * len - p.w * 0.5;
        p.platY = p.y + Math.cos(p.swingAngle) * len;
        if (p === standing) {
          cat.x += (p.platX - prevPx);
          cat.y = p.platY - cat.h;
        }
      } else if (p.type === 'morocco_magic_carpet' || p.type === 'maya_sun_disc') {
        const prevX = p.x;
        const bx = p.baseX !== undefined ? p.baseX : p.x;
        const by = p.baseY !== undefined ? p.baseY : p.y;
        const spd = p.speed || 1.4;
        const ph = p.phase || 0;
        p.x = bx + Math.sin(cat.animTime * spd + ph) * (p.moveAmpX || 90);
        p.y = by + Math.sin(cat.animTime * spd * 2 + ph) * (p.moveAmpY || 18);
        if (p === standing) {
          cat.x += (p.x - prevX);
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'morocco_cedar_lever' || p.type === 'maya_jade_switch') {
        if (p.spinAnim === undefined) p.spinAnim = p.opened ? 1 : 0;
        p.toggleCooldown = Math.max(0, (p.toggleCooldown || 0) - dt);
        if (p.opened) p.spinAnim = Math.min(1, p.spinAnim + dt * 2.5);
        else p.spinAnim = Math.max(0, p.spinAnim - dt * 2.5);
        const touching = cat.x + cat.w > p.x && cat.x < p.x + p.w && cat.y + cat.h > p.y && cat.y < p.y + p.h;
        if (touching && !p.wasTouching && p.toggleCooldown <= 0) {
          p.opened = !p.opened;
          p.toggleCooldown = 0.45;
          if (Audio.playBridgeCrank) Audio.playBridgeCrank();
          Particles.spawnDust(p.x + p.w * 0.5, p.y + p.h * 0.5, 8, p.type === 'maya_jade_switch' ? '#34d399' : '#fbbf24');
          const targetType = p.type === 'maya_jade_switch' ? 'maya_stone_bridge' : 'morocco_cedar_bridge';
          for (const b of level.platforms) {
            if (b.type === targetType && b.bridgeId === p.bridgeId) b.lowered = p.opened;
          }
        }
        p.wasTouching = touching;
      } else if (p.type === 'morocco_fountain_geyser' || p.type === 'maya_cenote_geyser') {
        const cyc = (cat.animTime + (p.phase || 0)) % 4.8;
        p.geyserActive = cyc >= 2.1;
        p.geyserWarn = cyc >= 1.35 && cyc < 2.1;
        if (p.geyserActive && cat.x + cat.w > p.x + 6 && cat.x < p.x + p.w - 6 && cat.y + cat.h > p.y - 26 && cat.y < p.y + p.h + 10) {
          const effLift = Math.max(2700, (p.liftForce || 1250) * 2.2);
          if (cat.vy > 80) cat.vy *= 0.72;
          cat.vy = Math.max(-520, cat.vy - effLift * dt);
          cat.onGround = false;
          cat.coyoteTimer = Math.max(cat.coyoteTimer || 0, 0.14);
          if (Math.random() < dt * 16) Particles.spawnTrailDot(cat.x + cat.w * 0.5, cat.y + cat.h, p.type === 'maya_cenote_geyser' ? '#34d399' : '#5eead4');
        }
      } else if (p.type === 'maya_serpent_ring') {
        if (p.ringCd > 0) p.ringCd = Math.max(0, p.ringCd - dt);
        if (p.chargeAnim > 0) p.chargeAnim = Math.max(0, p.chargeAnim - dt * 2.4);
        if (!(p.ringCd > 0) && !cat.inSerpentRing) {
          const rcx = p.x + p.w * 0.5;
          const rcy = p.y + p.h * 0.5;
          if (Math.hypot((cat.x + cat.w * 0.5) - rcx, (cat.y + cat.h * 0.5) - rcy) < 42) {
            cat.inSerpentRing = p;
            cat.ringDockTimer = 0.14;
            cat.ringFlight = null;
            p.chargeAnim = 1.0;
            if (Audio.playTreat) Audio.playTreat();
            Particles.spawnDust(rcx, rcy, 8, '#fde047');
          }
        }
      } else if (p.type === 'maya_twin_scale') {
        // Linked Counterweight Mayan Gold Scales: standing on one pan lowers it while hoisting its twin skyward!
        if (p.baseY === undefined) p.baseY = p.y;
        if (p.panSide === -1) {
          const partner = level.platforms.find((q) => q.type === 'maya_twin_scale' && q.scaleGroup === p.scaleGroup && q !== p);
          const maxShift = p.maxShift || 52;
          let groupOff = p.scaleOffset || 0;
          if (p === standing) {
            groupOff = Math.min(maxShift, groupOff + 68 * dt);
          } else if (partner && partner === standing) {
            groupOff = Math.max(-maxShift, groupOff - 68 * dt);
          } else {
            if (Math.abs(groupOff) <= 34 * dt) groupOff = 0;
            else groupOff -= Math.sign(groupOff) * 34 * dt;
          }
          const prevAy = p.y;
          p.scaleOffset = groupOff;
          p.y = p.baseY + groupOff;
          if (p === standing) cat.y += (p.y - prevAy);
          if (partner) {
            if (partner.baseY === undefined) partner.baseY = partner.y;
            const prevBy = partner.y;
            partner.scaleOffset = -groupOff;
            partner.y = partner.baseY - groupOff;
            partner.partnerX = p.x + p.w * 0.5;
            partner.partnerY = p.y;
            p.partnerX = partner.x + partner.w * 0.5;
            p.partnerY = partner.y;
            if (partner === standing) cat.y += (partner.y - prevBy);
          }
        }
      } else if (p.type === 'maya_rolling_wheel') {
        // Giant Rolling Mayan Stone Sun-Calendar Wheel: rolls along sunken tracks & rotates with non-slip angular velocity!
        if (p.dir === undefined) p.dir = 1;
        if (p.wheelRot === undefined) p.wheelRot = 0;
        const prevX = p.x;
        const spd = p.speed || 115;
        p.x += p.dir * spd * dt;
        if (p.x <= p.minX) { p.x = p.minX; p.dir = 1; }
        else if (p.x >= p.maxX) { p.x = p.maxX; p.dir = -1; }
        const dx = p.x - prevX;
        const rad = p.w * 0.5;
        p.wheelRot += dx / Math.max(20, rad);
        if (p === standing) {
          // Carry Mashmasha with the rolling monolith + subtle tactile stone-rim spin nudge!
          cat.x += dx + p.dir * 28 * dt;
          const rimArcDip = Math.pow(Math.max(-1, Math.min(1, ((cat.x + cat.w * 0.5) - (p.x + p.w * 0.5)) / rad)), 2) * 10;
          cat.y = p.y + rimArcDip - cat.h;
        }
      } else if (p.type === 'maya_thorn_pit') {
        if (cat.x + cat.w - 8 > p.x + 4 && cat.x + 8 < p.x + p.w - 4 && cat.y + cat.h > p.y + 4 && cat.y < p.y + p.h) {
          cat.prickedByThorns = true;
        }
      } else if (p.type === 'maya_serpent_spine') {
        // Undulating Living Kukulcán Feathered-Serpent Spine + Traveling Golden Equinox Solar Crest!
        if (p.baseY === undefined) p.baseY = p.y;
        const prevY = p.y;
        const idx = p.segmentIdx || 0;
        const total = p.totalSegments || 7;
        const wave = Math.sin(cat.animTime * 2.45 - idx * 0.72) * (p.waveAmp || 26);
        p.y = p.baseY + wave;
        const crestPos = (cat.animTime * 1.65) % total;
        const distToCrest = Math.min(Math.abs(crestPos - idx), total - Math.abs(crestPos - idx));
        p.solarGlow = Math.max(0, 1 - distToCrest / 0.95);
        if (p === standing) {
          cat.y = p.y - cat.h;
          if (p.solarGlow > 0.35) cat.onSolarCrest = true;
        }
      } else if (p.type === 'maya_glyph_seal') {
        // Sacred Mayan Glyph Seal: touching lights it up and unlocks the Kukulcán Stone Vault when all 3 are lit!
        if (p.sealPulse === undefined) p.sealPulse = 0;
        if (p.activated) p.sealPulse = Math.min(1, p.sealPulse + dt * 3.0);
        if (!p.activated && cat.x + cat.w > p.x - 4 && cat.x < p.x + p.w + 4 && cat.y + cat.h > p.y - 4 && cat.y < p.y + p.h + 4) {
          p.activated = true;
          if (Audio.playCheckpoint) Audio.playCheckpoint();
          else if (Audio.playTreat) Audio.playTreat();
          Particles.spawnCoinSparkle(p.x + p.w * 0.5, p.y + p.h * 0.5);
          Particles.spawnDust(p.x + p.w * 0.5, p.y + p.h * 0.5, 10, '#34d399');
          const allSeals = level.platforms.filter((q) => q.type === 'maya_glyph_seal' && q.vaultId === p.vaultId);
          const litCount = allSeals.filter((q) => q.activated).length;
          const glyphIcons = ['☀️', '🐆', '🦜'];
          const icon = glyphIcons[p.sealIdx || 0] || '✨';
          Particles.spawnPopup(p.x + p.w * 0.5, p.y - 14, `${litCount}/${allSeals.length} ${icon}`, '#fde047');
          for (const v of level.platforms) {
            if (v.type === 'maya_vault_door' && v.vaultId === p.vaultId) {
              v.litMask = (v.litMask || 0) | (1 << (p.sealIdx || 0));
              v.litCount = litCount;
              if (litCount >= allSeals.length && !v.unlocked) {
                v.unlocked = true;
                if (Audio.playStoneThud) Audio.playStoneThud();
                if (Audio.playStageClear) Audio.playStageClear();
                const msg = window.Game.I18n && window.Game.I18n.isEn() ? '🔓 Vault Unlocked!' : '🔓 فُتحت خزنة كوكولكان!';
                Particles.spawnPopup(v.x + v.w * 0.5, v.y + 30, msg, '#34d399');
                Particles.spawnDust(v.x + v.w * 0.5, v.y + v.h - 8, 16, '#fde047');
              }
            }
          }
        }
      } else if (p.type === 'maya_vault_door') {
        if (p.openAnim === undefined) p.openAnim = p.unlocked ? 1 : 0;
        if (p.unlocked && p.openAnim < 1) {
          p.openAnim = Math.min(1, p.openAnim + dt * 0.85);
          if (Math.random() < dt * 18) {
            Particles.spawnDust(p.x + p.w * 0.5, p.y + p.h * (1 - p.openAnim * 0.85), 2, '#d6ccb4');
          }
        }
      } else if (p.type === 'greece_sun_mirror') {
        if (p.beamGlow === undefined) p.beamGlow = 0;
        if (p.activeTimer > 0) {
          p.activeTimer = Math.max(0, p.activeTimer - dt);
          p.beamGlow = Math.min(1, p.beamGlow + dt * 4.5);
        } else {
          p.beamGlow = Math.max(0, p.beamGlow - dt * 2.8);
        }
        const touching = cat.x + cat.w > p.x - 4 && cat.x < p.x + p.w + 4 && cat.y + cat.h > p.y - 4 && cat.y < p.y + p.h + 4;
        if (touching && (p.activeTimer || 0) < (p.duration || 8.0) * 0.85) {
          const wasOff = !(p.activeTimer > 0);
          p.activeTimer = p.duration || 8.0;
          if (wasOff) {
            if (Audio.playTreat) Audio.playTreat();
            Particles.spawnDust(p.x + p.w * 0.5, p.y + 18, 12, '#fde047');
            const msg = window.Game.I18n && window.Game.I18n.isEn() ? '☀️ Sun Bridge!' : '☀️ جسر الشمس!';
            Particles.spawnPopup(p.x + p.w * 0.5, p.y - 14, msg, '#fde047');
          }
          for (const b of level.platforms) {
            if (b.type === 'greece_light_bridge' && b.bridgeId === p.bridgeId) {
              b.activeTimer = p.duration || 8.0;
            }
          }
        }
      } else if (p.type === 'greece_light_bridge') {
        if (p.activeTimer > 0) {
          p.activeTimer = Math.max(0, p.activeTimer - dt);
          p.lightAlpha = Math.min(1, p.activeTimer / 0.65);
        } else {
          p.lightAlpha = 0;
        }
      } else if (p.type === 'greece_chariot_track') {
        if (p.startX === undefined) p.startX = p.x;
        if (p.endX === undefined) p.endX = p.x + 260;
        if (p.wheelRot === undefined) p.wheelRot = 0;
        const prevX = p.x;
        const spd = p.speed || 155;
        if (p === standing) {
          p.riding = true;
          p.holdTimer = 1.35;
        }
        if (p.riding) {
          if (p.x < p.endX) {
            p.x = Math.min(p.endX, p.x + spd * dt);
          } else {
            p.holdTimer = Math.max(0, (p.holdTimer || 0) - dt);
            if (p !== standing && p.holdTimer <= 0) p.riding = false;
          }
        } else if (p.x > p.startX) {
          p.x = Math.max(p.startX, p.x - spd * 0.72 * dt);
        }
        const dx = p.x - prevX;
        p.wheelRot += dx / 13;
        if (p === standing) {
          cat.x += dx;
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'greece_poseidon_wave') {
        const cyc = (cat.animTime + (p.phase || 0)) % 4.8;
        p.waveActive = cyc >= 2.0;
        p.waveWarn = cyc >= 1.25 && cyc < 2.0;
        if (p.waveActive && cat.x + cat.w > p.x + 6 && cat.x < p.x + p.w - 6 && cat.y + cat.h > p.y - 40 && cat.y < p.y + p.h + 10) {
          const effLift = Math.max(4800, (p.liftForce || 1320) * 3.6);
          if (cat.vy > 80) cat.vy *= 0.65;
          cat.vy = Math.max(-560, cat.vy - effLift * dt);
          cat.onGround = false;
          cat.coyoteTimer = Math.max(cat.coyoteTimer || 0, 0.14);
          if (Math.random() < dt * 16) Particles.spawnTrailDot(cat.x + cat.w * 0.5, cat.y + cat.h, '#7dd3fc');
        }
      } else if (p.type === 'greece_lyre_pillar') {
        if (p.strumAnim > 0) p.strumAnim = Math.max(0, p.strumAnim - dt * 2.2);
        if (p.activeTimer > 0) p.activeTimer = Math.max(0, p.activeTimer - dt);
        const touching = cat.x + cat.w > p.x - 4 && cat.x < p.x + p.w + 4 && cat.y + cat.h > p.y - 4 && cat.y < p.y + p.h + 4;
        if (touching && (p.activeTimer || 0) < (p.duration || 8.5) * 0.85) {
          const wasOff = !(p.activeTimer > 0);
          p.activeTimer = p.duration || 8.5;
          p.strumAnim = 1.0;
          if (wasOff) {
            if (Audio.playCheckpoint) Audio.playCheckpoint();
            else if (Audio.playTreat) Audio.playTreat();
            Particles.spawnDust(p.x + p.w * 0.5, p.y + 18, 10, '#fde047');
            const msg = window.Game.I18n && window.Game.I18n.isEn() ? '🎵 Marble Lift!' : '🎵 مصعد الرخام!';
            Particles.spawnPopup(p.x + p.w * 0.5, p.y - 16, msg, '#fde047');
          }
          for (const m of level.platforms) {
            if (m.type === 'greece_marble_lift' && m.liftId === p.liftId) {
              m.activeTimer = p.duration || 10.5;
              m.delayTimer = 0.75;
            }
          }
        }
      } else if (p.type === 'greece_marble_lift') {
        if (p.baseY === undefined) p.baseY = p.y;
        if (p.targetY === undefined) p.targetY = p.y - 140;
        const prevY = p.y;
        if (p.activeTimer > 0) {
          p.activeTimer = Math.max(0, p.activeTimer - dt);
          if (p.delayTimer > 0 && p !== standing) {
            p.delayTimer = Math.max(0, p.delayTimer - dt);
          } else {
            p.delayTimer = 0;
            p.y = Math.max(p.targetY, p.y - 92 * dt);
          }
        } else {
          p.y = Math.min(p.baseY, p.y + 82 * dt);
        }
        if (p === standing) {
          cat.y += (p.y - prevY);
        }
      } else if (p.type === 'battir_madud_gate') {
        // Bidirectional Ma'dud Roman Pool Water-Level Gate (نظام المعدود — raises/lowers Roman Pool water!)
        if (p.openAnim === undefined) p.openAnim = 0;
        if (p.cooldown > 0) p.cooldown = Math.max(0, p.cooldown - dt);
        const cx = p.x + p.w * 0.5, cy = p.y + p.h * 0.5;
        const near = Math.abs((cat.x + cat.w * 0.5) - cx) < 58 && Math.abs((cat.y + cat.h * 0.5) - cy) < 56;
        if (near && !p.wasNear && (p.cooldown || 0) <= 0) {
          p.waterOpen = !p.waterOpen;
          p.cooldown = 1.2;
          if (Audio.playCollect) Audio.playCollect();
          Particles.spawnDust(cx, p.y + 18, 12, '#38bdf8');
          if (Particles.spawnPopup) {
            const rawMsg = p.waterOpen ? '💧 ارتفع ماء البركة الرومانية!' : '💧 انخفض ماء البركة!';
            const msg = (window.Game && window.Game.I18n) ? window.Game.I18n.translateDynamic(rawMsg) : rawMsg;
            Particles.spawnPopup(cx, p.y - 18, msg, '#7dd3fc');
          }
          for (const m of level.platforms) {
            if (m.type === 'battir_pool_bridge' && m.poolId === p.poolId) {
              m.targetLevel = p.waterOpen ? 1 : 0;
            }
          }
        }
        p.wasNear = near;
        p.openAnim += ((p.waterOpen ? 1 : 0) - p.openAnim) * Math.min(1, dt * 4.5);
      } else if (p.type === 'battir_pool_bridge') {
        // Buoyant Roman Pool Floating Cedar Bridge rising/falling smoothly with Roman Pool water level!
        const lowY = p.lowY !== undefined ? p.lowY : p.y;
        const highY = p.highY !== undefined ? p.highY : lowY - 125;
        const target = p.targetLevel || 0;
        p.waterLevel = (p.waterLevel || 0) + (target - (p.waterLevel || 0)) * Math.min(1, dt * 2.2);
        const bob = Math.sin(cat.animTime * 2.8 + (p.x * 0.015)) * 2.4;
        p.y = lowY - (lowY - highY) * p.waterLevel + bob;
        if (p === standing) {
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'battir_press_pad') {
        // Carved Limestone Olive-Press Counterweight Pad (رافعة معصرة الزيتون بالثقل المعاكس)
        if (p.cooldown > 0) p.cooldown = Math.max(0, p.cooldown - dt);
        const pressed = (p === standing);
        p.pressAnim = (p.pressAnim || 0) + ((pressed ? 1 : 0) - (p.pressAnim || 0)) * Math.min(1, dt * 7.5);
        p.sinkOffset = p.pressAnim * 7;
        if (pressed) {
          cat.y = p.y + p.sinkOffset - cat.h;
          if ((p.cooldown || 0) <= 0) {
            p.cooldown = 3.0;
            if (Audio.playCollect) Audio.playCollect();
            Particles.spawnDust(p.x + p.w * 0.5, p.y, 10, '#84cc16');
            if (Particles.spawnPopup) {
              const rawMsg = '🫒 ارتفعت سلة معصرة الزيتون!';
              const msg = (window.Game && window.Game.I18n) ? window.Game.I18n.translateDynamic(rawMsg) : rawMsg;
              Particles.spawnPopup(p.x + p.w * 0.5, p.y - 22, msg, '#bef264');
            }
          }
          for (const m of level.platforms) {
            if (m.type === 'battir_olive_basket' && m.pressId === p.pressId) {
              m.activeTimer = p.duration || 9.5;
            }
          }
        }
      } else if (p.type === 'battir_olive_basket') {
        // Woven Olive-Harvest Basket Bridge hoisted by overhead timber pulley ropes!
        const lowY = p.lowY !== undefined ? p.lowY : p.y;
        const highY = p.highY !== undefined ? p.highY : lowY - 140;
        if (p.activeTimer > 0) {
          p.activeTimer = Math.max(0, p.activeTimer - dt);
          p.hoistAnim = Math.min(1, (p.hoistAnim || 0) + dt * 1.65);
        } else {
          p.hoistAnim = Math.max(0, (p.hoistAnim || 0) - dt * 0.85);
        }
        p.y = lowY - (lowY - highY) * (p.hoistAnim || 0);
        if (p === standing) {
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'battir_roman_bath_vent') {
        if (p.boostTimer > 0) p.boostTimer = Math.max(0, p.boostTimer - dt);
        const cyc = ((cat.animTime * 1.25 + (p.phase || 0)) % (Math.PI * 2));
        const telegraph = cyc > 1.8 && cyc <= 2.9;
        const active = (p.boostTimer > 0) || (cyc > 2.9 && cyc <= 5.4);
        p.telegraph = telegraph ? 1 : 0;
        p.steamPower = active ? Math.min(1, (p.steamPower || 0) + dt * 5.0) : Math.max(0, (p.steamPower || 0) - dt * 4.0);
        if (p.steamPower > 0.3) {
          const inCol = cat.x + cat.w > p.x + 6 && cat.x < p.x + p.w - 6 && cat.y + cat.h > p.y - 32 && cat.y < p.y + p.h + 18;
          if (inCol) {
            const effLift = Math.max(4800, (p.liftForce || 1440) * 3.5) * p.steamPower;
            if (cat.vy > 80) cat.vy *= 0.65;
            cat.vy = Math.max(-560, cat.vy - effLift * dt);
            cat.onGround = false;
            cat.coyoteTimer = Math.max(cat.coyoteTimer || 0, 0.14);
            if (Math.random() < dt * 15) {
              Particles.spawnDust(cat.x + cat.w * 0.5 + (Math.random() - 0.5) * 20, cat.y + cat.h, 1, '#fef3c7');
            }
          }
        }
      } else if (p.type === 'battir_spring_geyser') {
        const cyc = (cat.animTime + (p.phase || 0)) % 4.6;
        const active = cyc >= 1.8;
        p.geyserPower = active ? Math.min(1, (p.geyserPower || 0) + dt * 5.2) : Math.max(0.18, (p.geyserPower || 0) - dt * 3.6);
        if (p.geyserPower > 0.35) {
          const inCol = cat.x + cat.w > p.x + 6 && cat.x < p.x + p.w - 6 && cat.y + cat.h > p.y - 32 && cat.y < p.y + p.h + 16;
          if (inCol) {
            const effLift = Math.max(4800, (p.liftForce || 1460) * 3.5) * p.geyserPower;
            if (cat.vy > 80) cat.vy *= 0.65;
            cat.vy = Math.max(-560, cat.vy - effLift * dt);
            cat.onGround = false;
            cat.coyoteTimer = Math.max(cat.coyoteTimer || 0, 0.14);
            if (Math.random() < dt * 16) Particles.spawnTrailDot(cat.x + cat.w * 0.5, cat.y + cat.h, '#38bdf8');
          }
        }
      } else if (p.type === 'battir_railway_handcar') {
        if (p.startX === undefined) p.startX = p.x;
        if (p.endX === undefined) p.endX = p.x + 360;
        if (p.pumpPhase === undefined) p.pumpPhase = 0;
        const prevX = p.x;
        const spd = p.speed || 158;
        if (p === standing) {
          p.riding = true;
          p.holdTimer = 1.45;
        }
        if (p.riding) {
          if (p.x < p.endX) {
            p.x = Math.min(p.endX, p.x + spd * dt);
          } else {
            p.holdTimer = Math.max(0, (p.holdTimer || 0) - dt);
            if (p !== standing && p.holdTimer <= 0) p.riding = false;
          }
        } else if (p.x > p.startX) {
          p.x = Math.max(p.startX, p.x - spd * 0.72 * dt);
        }
        const dx = p.x - prevX;
        p.pumpPhase += dx * 0.065;
        if (p === standing) {
          cat.x += dx;
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'battir_grape_zipline') {
        // Overhead Vineyard Harvest Basket Pulley Ride across Wadi al-Makhrour gorges!
        if (p.startX === undefined) p.startX = p.x;
        if (p.startY === undefined) p.startY = p.y;
        if (p.endX === undefined) p.endX = p.x + 420;
        if (p.endY === undefined) p.endY = p.y - 60;
        if (p.zipT === undefined) p.zipT = 0;
        const prevX = p.x;
        const prevY = p.y;
        const rate = p.zipSpeed || 0.42;
        const catAboveBasket = (
          p !== standing &&
          cat.x + cat.w > p.x - 24 &&
          cat.x < p.x + p.w + 24 &&
          cat.y + cat.h <= p.y + 8 &&
          cat.y > p.y - 175
        );
        if (p === standing) {
          p.riding = true;
          p.holdTimer = 1.8;
        }
        if (p.riding) {
          if (p.zipT < 1) {
            if (!catAboveBasket) {
              p.zipT = Math.min(1, p.zipT + rate * dt);
            }
          } else {
            p.holdTimer = Math.max(0, (p.holdTimer || 0) - dt);
            if (p !== standing && !catAboveBasket && p.holdTimer <= 0) p.riding = false;
          }
        } else if (p.zipT > 0 && !catAboveBasket) {
          const nearStart = Math.abs((cat.x + cat.w * 0.5) - (p.startX + p.w * 0.5)) < 290;
          p.zipT = Math.max(0, p.zipT - rate * (nearStart ? 1.75 : 0.85) * dt);
        }
        const ease = p.zipT * p.zipT * (3 - 2 * p.zipT);
        p.x = p.startX + (p.endX - p.startX) * ease;
        p.y = p.startY + (p.endY - p.startY) * ease + Math.sin(p.zipT * Math.PI) * 10;
        p.pulleySpin = (p.pulleySpin || 0) + (p.x - prevX) * 0.09;
        if (p === standing) {
          cat.x += (p.x - prevX);
          cat.y = p.y - cat.h;
          cat.coyoteTimer = Math.max(cat.coyoteTimer || 0, 0.14);
        } else if (Math.abs(p.y - prevY) > 0.01 && cat.x + cat.w > p.x && cat.x < p.x + p.w && Math.abs((cat.y + cat.h) - p.y) < 10) {
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'battir_shadoof_beam') {
        // Counterbalanced Stone Well-Sweep Platform (رافعة البئر الحجرية المتوازنة)
        if (p.restY === undefined) p.restY = p.y;
        const prevY = p.y;
        if (p === standing) {
          p.liftT = Math.min(1, (p.liftT || 0) + dt * 0.88);
        } else {
          p.liftT = Math.max(0, (p.liftT || 0) - dt * 0.65);
        }
        const ease = (p.liftT || 0) * (p.liftT || 0) * (3 - 2 * (p.liftT || 0));
        p.y = p.restY - (p.liftHeight || 120) * ease;
        if (p === standing) {
          cat.y = p.y - cat.h;
          cat.coyoteTimer = Math.max(cat.coyoteTimer || 0, 0.14);
        }
      } else if (p.type === 'battir_hosh_arch_swing') {
        if (p.anchorX === undefined) p.anchorX = p.x + p.w * 0.5;
        if (p.anchorY === undefined) p.anchorY = p.y - (p.ropeLen || 145);
        const len = p.ropeLen || 145;
        const prevX = p.x;
        const ang = Math.sin(cat.animTime * (p.swingSpeed || 1.45) + (p.phase || 0)) * (p.swingAmp || 0.58);
        p.swingAngle = ang;
        p.x = p.anchorX + Math.sin(ang) * len - p.w * 0.5;
        p.y = p.anchorY + Math.cos(ang) * len;
        const dx = p.x - prevX;
        if (p === standing) {
          cat.x += dx;
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'istanbul_tram_car' || p.type === 'istanbul_vapur_boat') {
        if (p.baseY === undefined) p.baseY = p.y;
        const prevX = p.x;
        const sX = p.startX !== undefined ? p.startX : p.x;
        const eX = p.endX !== undefined ? p.endX : p.x + 360;
        const span = Math.max(40, eX - sX);
        const spd = (p.speed || 130) / span;
        const u = 0.5 - 0.5 * Math.cos(cat.animTime * spd * Math.PI + (p.phase || 0));
        p.x = sX + u * span;
        const dx = p.x - prevX;
        p.moveDir = dx >= 0 ? 1 : -1;
        if (p.type === 'istanbul_vapur_boat') {
          p.y = p.baseY + Math.sin(cat.animTime * 2.6 + (p.phase || 0)) * 5.5;
        }
        if (p === standing) {
          cat.x += dx;
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'istanbul_mosaic_chandelier') {
        // Swinging Grand Bazaar Mosaic Chandelier Pendulum (physical momentum transfer!)
        if (p.anchorX === undefined) p.anchorX = p.x + p.w * 0.5;
        if (p.anchorY === undefined) p.anchorY = p.y - (p.chainLen || 165);
        const len = p.chainLen || 165;
        const prevX = p.x;
        const ang = Math.sin(cat.animTime * (p.swingSpeed || 1.45) + (p.phase || 0)) * (p.swingAmp || 0.48);
        p.swingAngle = ang;
        p.x = p.anchorX + Math.sin(ang) * len - p.w * 0.5;
        p.y = p.anchorY + Math.cos(ang) * len;
        const dx = p.x - prevX;
        if (p === standing) {
          cat.x += dx;
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'istanbul_drawbridge_leaf') {
        // Galata Bascule Drawbridge Leaf (rhythmic maritime signal: flat green -> amber warning -> raised sky-deck!)
        if (p.baseY === undefined) p.baseY = p.y;
        if (p.holdTimer > 0) p.holdTimer = Math.max(0, p.holdTimer - dt);
        const cyc = (cat.animTime + (p.phase || 0)) % 7.2;
        let targetT = 0;
        if (p.holdTimer > 0) {
          targetT = p.holdRaised ? 1 : 0;
          p.bridgeWarn = false;
          p.bridgeRaised = !!p.holdRaised;
        } else if (cyc < 2.6) {
          targetT = 0; p.bridgeWarn = false; p.bridgeRaised = false;
        } else if (cyc < 3.4) {
          targetT = 0; p.bridgeWarn = true; p.bridgeRaised = false;
        } else if (cyc < 6.2) {
          targetT = 1; p.bridgeWarn = false; p.bridgeRaised = true;
        } else {
          targetT = 0; p.bridgeWarn = true; p.bridgeRaised = false;
        }
        p.liftT = (p.liftT || 0) + (targetT - (p.liftT || 0)) * Math.min(1, dt * 2.6);
        if (p === standing) {
          const openT = Math.max(0, Math.min(1, p.liftT || 0));
          const tiltAng = openT * 0.52;
          const halfW = p.w * 0.5;
          const catCx = cat.x + cat.w * 0.5;
          const distEdge = Math.max(0, Math.min(halfW, Math.min(catCx - p.x, (p.x + p.w) - catCx)));
          cat.y = p.baseY - Math.sin(tiltAng) * distEdge - cat.h;
        }
      } else if (p.type === 'istanbul_hammam_valve') {
        // Bidirectional Ottoman Hammam Brass Steam Valve (walk-through or Meow toggles ON/OFF with cooldown!)
        if (p.cooldown > 0) p.cooldown = Math.max(0, p.cooldown - dt);
        const targetRot = p.active ? Math.PI * 1.5 : 0;
        p.wheelRot = (p.wheelRot || 0) + (targetRot - (p.wheelRot || 0)) * Math.min(1, dt * 6);
        const vCx = p.x + p.w * 0.5, vCy = p.y + p.h * 0.5;
        const catCx = cat.x + cat.w * 0.5, catCy = cat.y + cat.h * 0.5;
        if (p.cooldown <= 0 && Math.abs(catCx - vCx) < 34 && Math.abs(catCy - vCy) < 42) {
          p.active = !p.active;
          p.cooldown = 1.1;
          if (Audio.playSteamHiss) Audio.playSteamHiss();
          else if (Audio.playBridgeCrank) Audio.playBridgeCrank();
          Particles.spawnDust(vCx, p.y + 18, 10, p.active ? '#38bdf8' : '#fbbf24');
          const isEn = window.Game.I18n && window.Game.I18n.isEn();
          Particles.spawnPopup(vCx, p.y - 12, p.active ? (isEn ? '♨️ Hammam Lift UP!' : '♨️ صعود مصعد الحمام!') : (isEn ? '⚙ Hammam Lift DOWN' : '⚙ نزول مصعد الحمام'), p.active ? '#38bdf8' : '#fbbf24');
        }
      } else if (p.type === 'istanbul_hammam_lift') {
        // Pressurized Carved-Marble Ottoman Hammam Lift controlled by matching valveId
        if (p.baseY === undefined) p.baseY = p.y;
        let isOn = false;
        for (const vp of level.platforms) {
          if (vp.type === 'istanbul_hammam_valve' && vp.valveId === p.valveId) {
            isOn = !!vp.active;
            break;
          }
        }
        p.liftActive = isOn;
        const targetT = isOn ? 1 : 0;
        p.liftT = (p.liftT || 0) + (targetT - (p.liftT || 0)) * Math.min(1, dt * 2.2);
        p.y = p.baseY - (p.liftH || 180) * p.liftT;
        if (p === standing) {
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'istanbul_fishing_float') {
        // Galata Bridge Angler Reeling Giant Cork Float (bobbing on Bosphorus -> rhythmic upward reel!)
        if (p.baseY === undefined) p.baseY = p.y;
        const cyc = (cat.animTime + (p.phase || 0)) % 4.6;
        let targetY = p.baseY + Math.sin(cat.animTime * 3.8 + (p.phase || 0)) * 4;
        if (cyc >= 1.6 && cyc < 3.6) {
          const u = Math.sin(((cyc - 1.6) / 2.0) * Math.PI);
          targetY = p.baseY - (p.liftH || 128) * u;
        }
        p.y = p.y + (targetY - p.y) * Math.min(1, dt * 6.5);
        if (p === standing) {
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'istanbul_dondurma_trick') {
        // Interactive Maraş Dondurma Trickster Cart: charmed stretchy spring cushion OR sweeping brass paddle!
        if (p.charmedTimer > 0) {
          p.charmedTimer = Math.max(0, p.charmedTimer - dt);
          const sCx = p.x + p.w * 0.5;
          const catCx = cat.x + cat.w * 0.5;
          if (Math.abs(catCx - sCx) < 52 && cat.vy >= -40 && cat.y + cat.h >= p.y + 18 && cat.y + cat.h <= p.y + 66) {
            cat.vy = -850;
            cat.onGround = false;
            if (Audio.playJump) Audio.playJump();
            Particles.spawnDust(sCx, p.y + 34, 14, '#f9a8d4');
            Particles.spawnDust(sCx, p.y + 34, 8, '#86efac');
            Particles.spawnPopup(sCx, p.y + 6, '🍦 BOING!', '#fef08a');
          }
        }
      } else if (p.type === 'istanbul_floating_pontoon') {
        // Buoyant Bosphorus Cedar Dock Pontoon: bobs on water, dips & tilts smoothly under Mashmasha's weight!
        const waveBob = Math.sin(cat.animTime * 2.6 + (p.phase || 0)) * 3.5;
        const targetSink = p === standing ? 18 + waveBob : waveBob;
        p.sinkOffset = (p.sinkOffset || 0) + (targetSink - (p.sinkOffset || 0)) * Math.min(1, dt * (p === standing ? 7.5 : 5.0));
        let targetTilt = Math.cos(cat.animTime * 2.2 + (p.phase || 0)) * 0.025;
        if (p === standing) {
          const off = Math.max(-1, Math.min(1, ((cat.x + cat.w * 0.5) - (p.x + p.w * 0.5)) / (p.w * 0.5)));
          targetTilt = off * 0.14;
          cat.vx += Math.sin(p.pontoonTilt || 0) * 165 * dt;
          cat.y = p.y + p.sinkOffset - cat.h;
        }
        p.pontoonTilt = (p.pontoonTilt || 0) + (targetTilt - (p.pontoonTilt || 0)) * Math.min(1, dt * 6.5);
      } else if (p.type === 'istanbul_tulip_fountain') {
        // Carved Marmara-Marble Sultanahmet Tulip Fountain whose pressurized water jet lifts a gilded lotus disc!
        if (p.baseY === undefined) p.baseY = p.y;
        const cyc = (cat.animTime + (p.phase || 0)) % 4.8;
        let jetU = 0;
        if (cyc >= 1.1 && cyc < 3.9) {
          jetU = Math.sin(((cyc - 1.1) / 2.8) * Math.PI);
        }
        p.jetRatio = jetU;
        const targetY = p.baseY - (p.liftH || 145) * jetU;
        p.y = p.y + (targetY - p.y) * Math.min(1, dt * 7.5);
        if (p === standing) {
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'istanbul_samovar_vent') {
        if (p.boostTimer > 0) p.boostTimer = Math.max(0, p.boostTimer - dt);
        const cyc = (cat.animTime + (p.phase || 0)) % 3.4;
        const active = (p.boostTimer > 0) || (cyc >= 0.7 && cyc <= 2.95);
        p.steamActive = active;
        p.steamWarn = !active && cyc >= 0.3 && cyc < 0.7;
        if (active) {
          const cx0 = p.x + p.w * 0.5;
          const catCx = cat.x + cat.w * 0.5;
          if (Math.abs(catCx - cx0) < 46 && cat.y + cat.h <= p.y + p.h + 10 && cat.y + cat.h >= p.y - 235) {
            const lift = p.boostTimer > 0 ? -570 : -470;
            cat.vy = Math.max(lift, Math.min(cat.vy, -360) - 960 * dt);
            cat.onGround = false;
          }
        }
      } else if (p.type === 'swiss_cable_car' || p.type === 'swiss_funicular_car' || p.type === 'airport_baggage_shuttle' || p.type === 'airport_cargo_scissor_lift') {
        if (p.startX === undefined) p.startX = p.x;
        if (p.startY === undefined) p.startY = p.y;
        if (p.endX === undefined) p.endX = p.startX + 420;
        if (p.endY === undefined) p.endY = p.startY;
        const prevX = p.x;
        const span = Math.max(80, Math.hypot(p.endX - p.startX, p.endY - p.startY));
        const rawSpd = p.speed || 0.45;
        const omega = rawSpd > 5 ? ((rawSpd * 1.45) / span) : rawSpd;
        const u = 0.5 - 0.5 * Math.cos(cat.animTime * omega + (p.phase || 0));
        p.x = p.startX + (p.endX - p.startX) * u;
        p.y = p.startY + (p.endY - p.startY) * u;
        p.moveDir = p.x >= prevX ? 1 : -1;
        if (p === standing) {
          cat.x += (p.x - prevX);
          cat.y = p.y - cat.h;
        }
      } else if (p.type === 'airport_conveyor_belt') {
        if (p === standing) {
          cat.x += (p.beltDir || 1) * (p.beltSpeed || 95) * dt;
        }
      } else if (p.type === 'swiss_alphorn_gust') {
        if (p.boostTimer > 0) p.boostTimer = Math.max(0, p.boostTimer - dt);
        const cyc = (cat.animTime + (p.phase || 0)) % 3.8;
        const active = (p.boostTimer > 0) || (cyc >= 0.7 && cyc <= 3.05);
        p.hornActive = active;
        p.hornWarn = !active && cyc >= 0.25 && cyc < 0.7;
        if (active) {
          const cx0 = p.x + p.w * 0.5;
          const catCx = cat.x + cat.w * 0.5;
          if (Math.abs(catCx - cx0) < 52 && cat.y + cat.h <= p.y + p.h + 12 && cat.y + cat.h >= p.y - 255) {
            const lift = p.boostTimer > 0 ? -590 : -495;
            cat.vy = Math.max(lift, Math.min(cat.vy, -370) - 980 * dt);
            cat.onGround = false;
            cat.coyoteTimer = Math.max(cat.coyoteTimer || 0, 0.14);
            if (Math.random() < dt * 16) Particles.spawnTrailDot(cat.x + cat.w * 0.5, cat.y + cat.h, '#fde047');
          }
        }
      }
    }
    cat.onSlippery = !!(standing && (standing.type === 'oil_deck' || standing.type === 'ice_deck' || standing.slippery));
    cat.ropeDip = activeDip;

    // Smoothly update trailing bee-style golden starlight motes/stars for 'starlight' skin
    const anchorX = cat.x + cat.w * 0.5;
    const anchorY = cat.y + (cat.crouching ? cat.h * 0.58 : cat.h * 0.42) + (cat.ropeDip || 0);
    if (!cat.starTrail || cat.starTrail.length === 0) {
      cat.starTrail = [];
      for (let i = 0; i < 7; i++) {
        cat.starTrail.push({
          x: anchorX - cat.facing * (12 + i * 8),
          y: anchorY + Math.sin(i * 1.1) * 6,
        });
      }
    } else {
      // Snap trail near Mashmasha if she respawned far away
      if (Math.hypot(cat.starTrail[0].x - anchorX, cat.starTrail[0].y - anchorY) > 260) {
        for (let i = 0; i < cat.starTrail.length; i++) {
          cat.starTrail[i].x = anchorX - cat.facing * (12 + i * 8);
          cat.starTrail[i].y = anchorY + Math.sin(i * 1.1) * 6;
        }
      }
      for (let i = 0; i < cat.starTrail.length; i++) {
        const node = cat.starTrail[i];
        const t = cat.animTime;
        let targetX, targetY;
        if (i === 0) {
          targetX = anchorX - cat.facing * 14 + Math.cos(t * 3.2) * 7;
          targetY = anchorY - 4 + Math.sin(t * 5.4) * 6;
        } else {
          const prev = cat.starTrail[i - 1];
          targetX = prev.x - cat.facing * 7.5 + Math.cos(t * 3.8 + i * 1.25) * 3.5;
          targetY = prev.y + Math.sin(t * 6.2 + i * 1.35) * 4.8;
        }
        const followRate = Math.min(1, dt * (15.5 - i * 1.15));
        node.x += (targetX - node.x) * followRate;
        node.y += (targetY - node.y) * followRate;
      }
    }
  }

  function takeDamage(reason, isFall = false) {
    if (cat.invulnTimer > 0 && !isFall) return false;
    cat.inSerpentRing = null;
    cat.ringDockTimer = 0;
    cat.ringFlight = null;

    // Guardian Shield absorbs the hit without losing a life!
    if (cat.shieldActive) {
      cat.shieldActive = false;
      cat.shieldTimer = cat.shieldRechargeSec || 35;
      cat.invulnTimer = 1.7;
      if (Audio.playShieldBreak) Audio.playShieldBreak();
      Particles.spawnShieldBurst(cat.x + cat.w / 2, cat.y + cat.h / 2);
      const blockedTxt = window.Game.I18n ? window.Game.I18n.t('popup_shield_blocked') : '🛡️ صدّ الدرع!';
      Particles.spawnPopup(cat.x + cat.w / 2, cat.y - 16, blockedTxt, '#7dd3fc');
      if (isFall) {
        cat.respawnLockTimer = 0.55;
        cat.jumpBufferTimer = 0;
        cat.x = cat.checkpointX;
        cat.y = cat.checkpointY;
        cat.vx = 0;
        cat.vy = 0;
      } else {
        cat.vy = -260;
      }
      return true;
    }

    const usedPurple = cat.purpleLives > 0;
    if (usedPurple) {
      cat.purpleLives -= 1;
    } else {
      cat.lives = Math.max(0, cat.lives - 1);
    }
    cat.invulnTimer = 1.6;
    cat.hurtTimer = 0.72; // Plays full 7-frame Row 3 Hurt animation!
    cat.respawnLockTimer = 0.55; // Brief movement input lock on checkpoint respawn so Mashmasha never accidentally runs off!
    cat.jumpBufferTimer = 0;
    Audio.playHurt();
    const localizedReason = reason && window.Game.I18n ? window.Game.I18n.translateDynamic(reason) : reason;
    if (usedPurple) {
      const isEn = window.Game.I18n && window.Game.I18n.isEn();
      Particles.spawnPopup(cat.x + cat.w / 2, cat.y - 12, isEn ? '-1 💜 Extra Life' : '-1 💜 الروح الإضافية', '#d8b4fe');
    } else {
      Particles.spawnPopup(cat.x + cat.w / 2, cat.y - 12, localizedReason || '-1 ❤️', '#ff6b8b');
    }

    cat.x = cat.checkpointX;
    cat.y = cat.checkpointY;
    cat.vx = 0;
    cat.vy = 0;
    return true;
  }

  function draw(ctx, camX, camY) {
    // Blink only after the Hurt animation finishes
    if (cat.hurtTimer <= 0 && cat.invulnTimer > 0 && Math.floor(cat.invulnTimer * 14) % 2 === 0) {
      return;
    }

    const cx = cat.x - camX + cat.w / 2;
    const by = cat.y - camY + cat.h + (cat.ropeDip || 0);

    ctx.save();
    ctx.translate(cx, by);

    // Ground shadow
    if (cat.onGround) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
      ctx.beginPath();
      ctx.ellipse(0, -1, 23, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (cat.nightVision) {
      ctx.shadowColor = '#4af2a1';
      ctx.shadowBlur = 12;
    }

    // Warm sunlit golden pollen-starlight aura behind Mashmasha when wearing 'starlight'
    if (cat.skin === 'starlight') {
      const auraY = cat.crouching ? -19 : -24;
      const auraG = ctx.createRadialGradient(0, auraY, 6, 0, auraY, 38);
      auraG.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
      auraG.addColorStop(0.6, 'rgba(251, 191, 36, 0.11)');
      auraG.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = auraG;
      ctx.beginPath();
      ctx.arc(0, auraY, 38, 0, Math.PI * 2);
      ctx.fill();
    }

    function renderCatFigure(targetCtx) {
      if (!window.Game.ProceduralCat || typeof window.Game.ProceduralCat.draw !== 'function') return;
      const isWallClimbing = !cat.onGround && cat.wallDir !== 0;
      const drawFacing = isWallClimbing ? cat.wallDir : cat.facing;
      targetCtx.save();
      targetCtx.scale(-drawFacing * cat.scaleX, cat.scaleY);
      window.Game.ProceduralCat.draw(targetCtx, cat);
      targetCtx.restore();
    }

    if (cat.shieldActive) {
      // Render cat (+ cardboard bag shield helmet) into offscreen silhouette buffer,
      // then apply a gentle full-body warm light shimmer strictly over the cat's shape!
      const pulse = 0.5 + 0.5 * Math.sin(cat.animTime * 4.2);
      shieldFxCtx.setTransform(1, 0, 0, 1, 0, 0);
      shieldFxCtx.clearRect(0, 0, shieldFxCanvas.width, shieldFxCanvas.height);

      shieldFxCtx.save();
      shieldFxCtx.scale(SHIELD_FX_DPR, SHIELD_FX_DPR);
      shieldFxCtx.translate(SHIELD_FX_OX, SHIELD_FX_OY);
      renderCatFigure(shieldFxCtx);

      // Subtle breathing warm illumination wash across entire silhouette
      shieldFxCtx.globalCompositeOperation = 'source-atop';
      shieldFxCtx.fillStyle = `rgba(255, 250, 224, ${(0.08 + 0.13 * pulse).toFixed(3)})`;
      shieldFxCtx.fillRect(-SHIELD_FX_OX, -SHIELD_FX_OY, SHIELD_FX_SIZE, SHIELD_FX_SIZE);

      // Soft diagonal light gleam sweeping gently across the body
      const sweepPhase = (cat.animTime * 0.65) % 1.6;
      if (sweepPhase < 1.0) {
        const gx = -56 + sweepPhase * 112;
        const gleam = shieldFxCtx.createLinearGradient(gx - 18, -96, gx + 18, 12);
        gleam.addColorStop(0, 'rgba(255, 253, 242, 0)');
        gleam.addColorStop(0.5, 'rgba(255, 253, 242, 0.25)');
        gleam.addColorStop(1, 'rgba(255, 253, 242, 0)');
        shieldFxCtx.fillStyle = gleam;
        shieldFxCtx.fillRect(-SHIELD_FX_OX, -SHIELD_FX_OY, SHIELD_FX_SIZE, SHIELD_FX_SIZE);
      }
      shieldFxCtx.restore();

      ctx.save();
      if (!cat.nightVision) {
        ctx.shadowColor = `rgba(255, 246, 206, ${(0.20 + 0.16 * pulse).toFixed(3)})`;
        ctx.shadowBlur = 4 + 3 * pulse;
      }
      ctx.drawImage(
        shieldFxCanvas,
        -SHIELD_FX_OX,
        -SHIELD_FX_OY,
        SHIELD_FX_SIZE,
        SHIELD_FX_SIZE
      );
      ctx.restore();
    } else {
      renderCatFigure(ctx);
    }

    if (cat.skin === 'starlight') {
      // Glowing bee-style golden starlight stars/motes (slightly larger than the bee's motes) that smoothly chase Mashmasha!
      const worldOriginX = cat.x + cat.w / 2;
      const worldOriginY = cat.y + cat.h + (cat.ropeDip || 0);
      const nodes = cat.starTrail && cat.starTrail.length ? cat.starTrail : [];
      for (let i = nodes.length - 1; i >= 0; i--) {
        const sx = nodes[i].x - worldOriginX;
        const sy = nodes[i].y - worldOriginY;
        const pulse = 0.84 + 0.16 * Math.sin(cat.animTime * 8.5 + i * 1.35);
        const baseR = (3.4 - i * 0.24) * pulse; // Larger than bee's 1.3px motes!
        const glowR = baseR * 3.4;

        // Soft sunlit golden halo around each chasing star (matching the bee's golden pollen glow)
        const sGlow = ctx.createRadialGradient(sx, sy, baseR * 0.3, sx, sy, glowR);
        sGlow.addColorStop(0, 'rgba(254, 240, 138, 0.62)');
        sGlow.addColorStop(0.55, 'rgba(251, 191, 36, 0.24)');
        sGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = sGlow;
        ctx.beginPath();
        ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Sparkling 4-point golden star flare + warm glowing mote disc
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(Math.sin(cat.animTime * 3.5 + i) * 0.28);
        const rayL = baseR * 1.95;
        const rayW = baseR * 0.48;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(254, 240, 138, 0.92)' : 'rgba(253, 224, 71, 0.88)';
        ctx.beginPath();
        ctx.moveTo(0, -rayL);
        ctx.quadraticCurveTo(rayW * 0.45, -rayW * 0.45, rayL, 0);
        ctx.quadraticCurveTo(rayW * 0.45, rayW * 0.45, 0, rayL);
        ctx.quadraticCurveTo(-rayW * 0.45, rayW * 0.45, -rayL, 0);
        ctx.quadraticCurveTo(-rayW * 0.45, -rayW * 0.45, 0, -rayL);
        ctx.closePath();
        ctx.fill();

        // Luminous warm starlight core (just like the bee's golden motes, scaled up)
        ctx.fillStyle = '#fef9c3';
        ctx.beginPath();
        ctx.arc(0, 0, baseR * 0.62, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  return {
    cat,
    resetPhysics,
    applyUpgrades,
    refillLives,
    update,
    takeDamage,
    draw,
  };
};
