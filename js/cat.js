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

  // Reusable 2x supersampled offscreen silhouette buffer for Guardian Shield full-body shimmer
  const SHIELD_FX_SIZE = 156;
  const SHIELD_FX_OX = 78;
  const SHIELD_FX_OY = 116;
  const SHIELD_FX_DPR = 2;
  const shieldFxCanvas = document.createElement('canvas');
  shieldFxCanvas.width = SHIELD_FX_SIZE * SHIELD_FX_DPR;
  shieldFxCanvas.height = SHIELD_FX_SIZE * SHIELD_FX_DPR;
  const shieldFxCtx = shieldFxCanvas.getContext('2d');

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
    invulnTimer: 0,
    hurtTimer: 0,
    respawnLockTimer: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    meowCooldown: 0,
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
      if (p.broken) continue;
      if (p.type === 'wind_zone') continue;
      if (p.type === 'phase_platform' && p.phaseSolid === false) continue;
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
      if (p.broken) continue;
      if (p.type === 'wind_zone') continue;
      if (p.type === 'phase_platform' && p.phaseSolid === false) continue;
      const overlapX = cat.x + 4 < p.x + p.w && cat.x + cat.w - 4 > p.x;
      if (!overlapX) continue;

      const effY = p.y + (p.sinkOffset || 0);

      if (p.oneWay) {
        if (cat.vy >= 0 && prevBottom <= effY + 10 && cat.y + cat.h >= effY) {
          cat.y = effY - cat.h;
          if (p.bouncy) {
            const mult = p.type === 'flower_bounce' ? 1.36 : 1.28;
            cat.vy = -cat.physics.jumpForce * mult;
            cat.scaleX = 0.84;
            cat.scaleY = 1.18;
            p.bounceAnim = 1;
            Audio.playJump();
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
            } else {
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 9, '#ffb35c');
            }
          } else {
            if (wasAirborne && cat.vy > 160) {
              const impact = Math.min(1, (cat.vy - 160) / 540);
              cat.landTimer = 0.16 + impact * 0.08;
              cat.scaleX = 1.14 + impact * 0.12;
              cat.scaleY = 0.86 - impact * 0.12;
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, Math.round(4 + impact * 6));
            }
            cat.vy = 0;
            landed = true;
            standingPlatform = p;
            if (p.narrow) currentNarrow = true;
          }
        }
      } else {
        if (cat.y < effY + p.h && cat.y + cat.h > effY) {
          if (cat.vy >= 0) {
            cat.y = effY - cat.h;
            if (wasAirborne && cat.vy > 160) {
              const impact = Math.min(1, (cat.vy - 160) / 540);
              cat.landTimer = 0.16 + impact * 0.08;
              cat.scaleX = 1.14 + impact * 0.12;
              cat.scaleY = 0.86 - impact * 0.12;
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, Math.round(4 + impact * 6));
            }
            cat.vy = 0;
            landed = true;
            standingPlatform = p;
            if (p.narrow) currentNarrow = true;
          } else if (cat.vy < 0) {
            cat.y = effY + p.h;
            cat.vy = 0;
          }
        }
      }
    }

    for (const p of platforms) {
      if (p.type === 'clothesline' || p.type === 'rigging' || p.type === 'cable') {
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

    const lockedByRespawn = cat.respawnLockTimer > 0;
    cat.crouching = !lockedByRespawn && (input.shift || input.down);
    if (cat.crouching && cat.onGround) {
      cat.crouchTime += dt;
    } else {
      cat.crouchTime = 0;
    }

    let moveDir = 0;
    if (!lockedByRespawn) {
      if (input.left) moveDir -= 1;
      if (input.right) moveDir += 1;
    }
    if (moveDir !== 0) cat.facing = moveDir;

    let targetSpeed = moveDir * cat.physics.runSpeed;
    if (cat.crouching && cat.onGround) {
      targetSpeed *= 0.52;
    }

    if (cat.onGround && cat.onNarrow && !cat.crouching && moveDir !== 0) {
      cat.balancePhase += dt * 12;
      targetSpeed += Math.sin(cat.balancePhase) * 65;
    }

    const accel = cat.onGround ? (cat.onSlippery ? 3.8 : 18) : 13;
    if (lockedByRespawn) {
      cat.vx = 0;
    } else {
      cat.vx += (targetSpeed - cat.vx) * Math.min(1, dt * accel);
    }

    // Crosswind Gust Zone physics (crouching anchors Mashmasha against headwinds!)
    for (const p of level.platforms) {
      if (p.type === 'wind_zone') {
        if (cat.x + cat.w > p.x && cat.x < p.x + p.w && cat.y + cat.h > p.y && cat.y < p.y + p.h) {
          const anchor = cat.crouching && cat.onGround ? 0.22 : 1;
          cat.vx += (p.windDir || 1) * (p.windForce || 540) * anchor * dt;
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
      if (cat.coyoteTimer > 0) {
        cat.vy = -cat.physics.jumpForce;
        if (Math.abs(cat.vx) > 80) {
          cat.vx = Math.sign(cat.vx) * Math.min(cat.physics.runSpeed * 1.12, Math.abs(cat.vx) * 1.07);
        }
        cat.onGround = false;
        cat.coyoteTimer = 0;
        cat.jumpBufferTimer = 0;
        cat.scaleX = 0.84;
        cat.scaleY = 1.16;
        Audio.playJump();
        Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 5);
      } else if (cat.wallDir !== 0) {
        cat.vy = -cat.physics.jumpForce * 0.94;
        cat.vx = -cat.wallDir * cat.physics.runSpeed * 1.15;
        cat.facing = -cat.wallDir;
        cat.wallDir = 0;
        cat.jumpBufferTimer = 0;
        cat.scaleX = 0.84;
        cat.scaleY = 1.16;
        Audio.playJump();
        Audio.playWallScratch();
        Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h / 2, 6, '#ffd36e');
      }
    }

    if (!input.jumpHeld && cat.vy < -220) {
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
    const standing = resolveCollisionsY(level.platforms, prevBottom);

    // Advance continuous vertical wall-climb walking cycle while clinging/climbing on a wall
    if (!cat.onGround && cat.wallDir !== 0) {
      const climbRate = cat.vy < -25 ? 2.8 : 1.85;
      cat.wallClimbTime = (cat.wallClimbTime || 0) + dt * climbRate;
    }

    let activeDip = 0;
    for (const p of level.platforms) {
      if (p.type === 'clothesline' || p.type === 'rigging' || p.type === 'cable') {
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
      if (p.type === 'crumble') {
        if (p === standing && !p.broken && !p.crumbleTimer) {
          p.crumbleTimer = 1.25;
        }
        if (p.crumbleTimer > 0) {
          p.crumbleTimer -= dt;
          if (p.crumbleTimer <= 0) {
            p.crumbleTimer = 0;
            p.broken = true;
            p.respawnTimer = 2.0;
            Particles.spawnDust(p.x + p.w / 2, p.y + p.h / 2, 10, '#bae6fd');
          }
        } else if (p.broken) {
          p.respawnTimer -= dt;
          if (p.respawnTimer <= 0) p.broken = false;
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
      if (p.type === 'sink_pad') {
        const targetSink = p === standing ? 40 : 0;
        p.sinkOffset = p.sinkOffset || 0;
        const rate = p === standing ? 26 : 56;
        if (p.sinkOffset < targetSink) {
          p.sinkOffset = Math.min(targetSink, p.sinkOffset + rate * dt);
        } else if (p.sinkOffset > targetSink) {
          p.sinkOffset = Math.max(targetSink, p.sinkOffset - rate * dt);
        }
        if (p === standing) {
          cat.y = p.y + p.sinkOffset - cat.h;
        }
      }
    }
    cat.onSlippery = !!(standing && standing.type === 'oil_deck');
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

    cat.lives = Math.max(0, cat.lives - 1);
    cat.invulnTimer = 1.6;
    cat.hurtTimer = 0.72; // Plays full 7-frame Row 3 Hurt animation!
    cat.respawnLockTimer = 0.55; // Brief movement input lock on checkpoint respawn so Mashmasha never accidentally runs off!
    cat.jumpBufferTimer = 0;
    Audio.playHurt();
    const localizedReason = reason && window.Game.I18n ? window.Game.I18n.translateDynamic(reason) : reason;
    Particles.spawnPopup(cat.x + cat.w / 2, cat.y - 12, localizedReason || '-1 ❤️', '#ff6b8b');

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
