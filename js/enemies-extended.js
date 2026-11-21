window.Game = window.Game || {};

window.Game.EnemiesExtended = (function () {
  // =========================================================================
  // MEOW REPEL SYSTEM (Pushes back, recoils & startles ALL nearby enemies!)
  // =========================================================================
  function applyMeowRepel(level, mx, my, range, Particles) {
    const r = range || 280;
    const pop = (x, y, txt) => {
      if (Particles && Particles.spawnPopup) Particles.spawnPopup(x, y, txt || '💨', '#7dd3fc');
    };

    const repelPatrol = (list, dur = 2.4) => {
      if (!list) return;
      for (const e of list) {
        const ex = e.x + (e.w || 48) / 2;
        const ey = e.y + (e.h || 40) / 2;
        if (Math.hypot(mx - ex, my - ey) < r) {
          const dir = ex >= mx ? 1 : -1;
          e.repelTimer = dur;
          e.repelDir = dir;
          e.facing = dir;
          e.alert = false;
          e.charging = false;
          e.spraying = false;
          e.warning = false;
          pop(ex, e.y - 12, '💨');
        }
      }
    };

    repelPatrol(level.security_bots, 2.5);
    repelPatrol(level.foxes, 2.5);
    repelPatrol(level.clockwork_beetles, 2.4);
    repelPatrol(level.skunks, 2.6);
    repelPatrol(level.badgers, 2.6);
    repelPatrol(level.bridge_rovers, 2.3);
    repelPatrol(level.dobermans, 2.7);
    repelPatrol(level.rival_cats, 2.5);
    repelPatrol(level.hover_saws, 2.1);

    // Flying enemies: sweep upward & away out of Mashmasha's path!
    for (const list of [level.pelicans, level.hawks]) {
      if (!list) continue;
      for (const f of list) {
        const fx = f.x + (f.w || 56) / 2;
        const fy = f.y + (f.h || 32) / 2;
        if (Math.hypot(mx - fx, my - fy) < r) {
          const dir = fx >= mx ? 1 : -1;
          f.repelTimer = 2.4;
          f.repelDir = dir;
          f.facing = dir;
          pop(fx, f.y - 12, '💨');
        }
      }
    }

    // Stinging Bees: recoil upward & back, retracting their stinger!
    if (level.bees) {
      for (const bee of level.bees) {
        const bx = bee.x + bee.w / 2;
        const by = bee.y + bee.h / 2;
        if (Math.hypot(mx - bx, my - by) < r) {
          const dir = bx >= mx ? 1 : -1;
          bee.repelTimer = 2.5;
          bee.repelDir = dir;
          bee.facing = dir;
          bee.stingReady = 0;
          pop(bx, bee.y - 12, '💨');
        }
      }
    }

    // Venus Flytraps: startled & clamped harmlessly shut!
    if (level.venus_traps) {
      for (const v of level.venus_traps) {
        const vx = v.x + v.w / 2;
        const vy = v.y + v.h / 2;
        if (Math.hypot(mx - vx, my - vy) < r) {
          v.stunTimer = 2.8;
          v.state = 'rest';
          pop(vx, v.y - 24, '💫');
        }
      }
    }

    // Cyber Spiders: zip back up their silk thread!
    if (level.cyber_spiders) {
      for (const sp of level.cyber_spiders) {
        const sx = sp.x + sp.w / 2;
        const sy = sp.y + sp.h / 2;
        if (Math.hypot(mx - sx, my - sy) < r) {
          sp.repelTimer = 2.6;
          pop(sx, sp.y - 12, '💨');
        }
      }
    }

    // Storm Octopus Tentacles: recoil back down beneath the waves!
    if (level.tentacles) {
      for (const tent of level.tentacles) {
        const ty = tent.baseY - (tent.height || 0) * 0.5;
        if (Math.hypot(mx - tent.x, my - ty) < r) {
          tent.repelTimer = 2.6;
          pop(tent.x, tent.baseY - Math.max(30, tent.height || 0), '💨');
        }
      }
    }
  }

  // =========================================================================
  // UPDATE ALL NEW ENEMIES (Unique AI, Fair Telegraphs & Meow Repel Support)
  // =========================================================================
  function updateAll(level, catCtrl, dt, timeSec, onHit, Audio, Particles) {
    const c = catCtrl.cat;
    const catCx = c.x + c.w / 2;
    const catCy = c.y + c.h / 2;
    let anyChasing = false;

    function hitBox(x, y, w, h, pad = 6) {
      return (
        c.x + pad < x + w - pad &&
        c.x + c.w - pad > x + pad &&
        c.y + pad < y + h - pad &&
        c.y + c.h - pad > y + pad
      );
    }

    function stepRepelled(e, speed) {
      if (e.repelTimer > 0) {
        e.repelTimer -= dt;
        const dir = e.repelDir || 1;
        e.facing = dir;
        if (e.minX !== undefined && e.maxX !== undefined) {
          e.x = Math.max(e.minX, Math.min(e.maxX, e.x + dir * speed * dt));
        }
        return true;
      }
      return false;
    }

    // 1. Museum Armored Security Bots
    if (level.security_bots) {
      for (const bot of level.security_bots) {
        if (stepRepelled(bot, 210)) { bot.alert = false; continue; }
        const bx = bot.x + bot.w / 2;
        const by = bot.y + bot.h / 2;
        const ahead = (catCx - bx) * bot.facing;
        const seesCat = ahead > 0 && ahead < (c.crouching ? 110 : 210) && Math.abs(catCy - by) < 60;
        bot.alert = seesCat;
        const spd = Math.abs(bot.vx) * (seesCat ? 1.55 : 1);
        bot.x += bot.facing * spd * dt;
        if (bot.x <= bot.minX) { bot.x = bot.minX; bot.facing = 1; }
        else if (bot.x >= bot.maxX) { bot.x = bot.maxX; bot.facing = -1; }
        if (hitBox(bot.x, bot.y, bot.w, bot.h, 6)) onHit('روبوت الحراسة! -1 ❤️');
      }
    }

    // 2. Ceiling Sweeping Laser Turrets
    if (level.sweeping_lasers) {
      for (const tur of level.sweeping_lasers) {
        const ang = Math.PI / 2 + Math.sin(timeSec * (tur.speed || 1.35) + (tur.phase || 0)) * (tur.sweep || 0.65);
        tur.angle = ang;
        const len = tur.len || 240;
        const ex = tur.x + Math.cos(ang) * len;
        const ey = tur.y + Math.sin(ang) * len;
        const vx = ex - tur.x, vy = ey - tur.y;
        const wx = catCx - tur.x, wy = catCy - tur.y;
        const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy)));
        const px = tur.x + t * vx, py = tur.y + t * vy;
        if (Math.hypot(catCx - px, catCy - py) < (c.crouching ? 13 : 18)) {
          onHit('كاشف الليزر! -1 ❤️');
        }
      }
    }

    // 3. Giant Swooping Coastal Pelicans
    if (level.pelicans) {
      for (const pel of level.pelicans) {
        if (stepRepelled(pel, 220)) {
          pel.y = pel.baseY - 70 * Math.min(1, pel.repelTimer / 0.8);
          continue;
        }
        pel.x += pel.facing * Math.abs(pel.vx) * dt;
        if (pel.x <= pel.minX) { pel.x = pel.minX; pel.facing = 1; }
        else if (pel.x >= pel.maxX) { pel.x = pel.maxX; pel.facing = -1; }
        const phase = (pel.x - pel.minX) / Math.max(1, pel.maxX - pel.minX);
        pel.y = pel.baseY + Math.sin(phase * Math.PI) * (pel.dip || 64);
        if (hitBox(pel.x, pel.y, pel.w, pel.h, 8)) onHit('انقضاض البجع! -1 ❤️');
      }
    }

    // 4. Bounding Sly Red Foxes
    if (level.foxes) {
      for (const fox of level.foxes) {
        if (stepRepelled(fox, 215)) { fox.hopY = 0; continue; }
        fox.x += fox.facing * Math.abs(fox.vx) * dt;
        if (fox.x <= fox.minX) { fox.x = fox.minX; fox.facing = 1; }
        else if (fox.x >= fox.maxX) { fox.x = fox.maxX; fox.facing = -1; }
        const hopCycle = (timeSec + (fox.phase || 0)) % 2.4;
        fox.hopY = hopCycle < 0.55 ? Math.sin((hopCycle / 0.55) * Math.PI) * 44 : 0;
        if (hitBox(fox.x, fox.y - fox.hopY, fox.w, fox.h, 6)) onHit('الثعلب الماكر! -1 ❤️');
      }
    }

    // 5. Clockwork Brass Beetles
    if (level.clockwork_beetles) {
      for (const b of level.clockwork_beetles) {
        if (stepRepelled(b, 200)) { b.surging = false; continue; }
        const burst = Math.sin(timeSec * 3.2 + (b.phase || 0)) > 0.55 ? 1.85 : 0.72;
        b.surging = burst > 1;
        b.x += b.facing * Math.abs(b.vx) * burst * dt;
        if (b.x <= b.minX) { b.x = b.minX; b.facing = 1; }
        else if (b.x >= b.maxX) { b.x = b.maxX; b.facing = -1; }
        if (hitBox(b.x, b.y, b.w, b.h, 5)) onHit('خنفساء الساعة! -1 ❤️');
      }
    }

    // 6. Nocturnal Striped Skunks
    if (level.skunks) {
      for (const sk of level.skunks) {
        if (stepRepelled(sk, 200)) { sk.spraying = false; sk.warning = false; continue; }
        const cycle = (timeSec + (sk.phase || 0)) % 4.0;
        sk.spraying = cycle >= 2.2 && cycle <= 3.5;
        sk.warning = cycle >= 1.6 && cycle < 2.2;
        if (!sk.spraying && !sk.warning) {
          sk.x += sk.facing * Math.abs(sk.vx) * dt;
          if (sk.x <= sk.minX) { sk.x = sk.minX; sk.facing = 1; }
          else if (sk.x >= sk.maxX) { sk.x = sk.maxX; sk.facing = -1; }
        }
        if (hitBox(sk.x, sk.y, sk.w, sk.h, 5)) onHit('الظربان الليلي! -1 ❤️');
        if (sk.spraying) {
          const cloudX = sk.facing > 0 ? sk.x - 58 : sk.x + sk.w;
          if (hitBox(cloudX, sk.y - 16, 58, 48, 4)) onHit('سحابة الظربان! -1 ❤️');
        }
      }
    }

    // 7. Crackling Electric Leaping Sea-Eels
    if (level.leaping_fish) {
      for (const fish of level.leaping_fish) {
        const period = fish.period || 3.2;
        const cycle = (timeSec + (fish.phase || 0)) % period;
        const activeDur = 1.45;
        if (cycle < activeDur) {
          const t = cycle / activeDur;
          fish.active = true;
          fish.t = t;
          fish.curY = fish.baseY - Math.sin(t * Math.PI) * (fish.jumpH || 215);
          if (hitBox(fish.x - 16, fish.curY - 18, 32, 36, 4)) onHit('ثعبان البحر الكهربائي! -1 ❤️');
        } else {
          fish.active = false;
          fish.curY = fish.baseY + 40;
        }
      }
    }

    // 8. Giant Storm Octopus Tentacles (Smooth Organic Rise/Undulation + Recoils on Meow!)
    if (level.tentacles) {
      for (const tent of level.tentacles) {
        if (tent.repelTimer > 0) {
          tent.repelTimer -= dt;
          tent.height = Math.max(0, (tent.height || 0) - 240 * dt);
          tent.warning = false;
          continue;
        }
        const cycle = (timeSec + (tent.phase || 0)) % 4.6;
        let targetH = 0;
        if (cycle < 1.2) {
          targetH = 0;
          tent.warning = cycle > 0.5;
        } else if (cycle < 3.1) {
          const t = (cycle - 1.2) / 1.9;
          // Smooth organic ease-in-out rise & graceful sine-curled dwell at peak
          targetH = Math.pow(Math.sin(t * Math.PI), 0.78) * (tent.maxH || 124);
          tent.warning = false;
        } else {
          targetH = 0;
          tent.warning = false;
        }
        tent.height = tent.height === undefined ? targetH : tent.height + (targetH - tent.height) * Math.min(1, dt * 8.5);
        if (tent.height > 28) {
          if (hitBox(tent.x - 15, tent.baseY - tent.height, 30, tent.height, 5)) {
            onHit('ذراع الأخطبوط! -1 ❤️');
          }
        }
      }
    }

    // 9. Snapping Carnivorous Venus Flytraps (Smooth Organic Botanical Articulation + Startled by Meow!)
    if (level.venus_traps) {
      for (const v of level.venus_traps) {
        if (v.stunTimer > 0) {
          v.stunTimer -= dt;
          v.state = 'rest';
          v.jawAngle = (v.jawAngle || 0.1) + (0.06 - (v.jawAngle || 0.1)) * Math.min(1, dt * 10);
          v.lunge = (v.lunge || 0) + (4 - (v.lunge || 0)) * Math.min(1, dt * 10);
          continue;
        }
        const cycle = (timeSec + (v.phase || 0)) % 3.6;
        let targetJaw = 0.62;
        let targetLunge = 0;
        if (cycle < 1.6) {
          v.state = 'open';
          targetJaw = 0.62 + Math.sin(timeSec * 2.4 + (v.phase || 0)) * 0.05;
          targetLunge = 0;
        } else if (cycle < 2.2) {
          v.state = 'warn';
          targetJaw = 0.84;
          targetLunge = 6;
        } else if (cycle < 2.95) {
          v.state = 'snap';
          const snapT = Math.min(1, (cycle - 2.2) / 0.18);
          targetJaw = 0.04;
          targetLunge = -22 * Math.sin(snapT * Math.PI * 0.5);
        } else {
          v.state = 'rest';
          targetJaw = 0.22;
          targetLunge = -4;
        }
        v.jawAngle = v.jawAngle === undefined ? targetJaw : v.jawAngle + (targetJaw - v.jawAngle) * Math.min(1, dt * (v.state === 'snap' ? 24 : 8));
        v.lunge = v.lunge === undefined ? targetLunge : v.lunge + (targetLunge - v.lunge) * Math.min(1, dt * (v.state === 'snap' ? 22 : 7));

        if (v.state === 'snap') {
          if (hitBox(v.x - 5, v.y - 22, v.w + 10, v.h + 22, 6)) onHit('عضّة نبتة فينوس! -1 ❤️');
        }
      }
    }

    // 10. Giant Bioluminescent Luna Moths (legacy support)
    if (level.luna_moths) {
      for (const m of level.luna_moths) {
        const spd = m.freq || 1.65;
        const p = timeSec * spd + (m.phase || 0);
        const prevX = m.x;
        m.x = m.baseX + Math.sin(p) * (m.rx || 110);
        m.y = m.baseY + Math.sin(p * 2) * (m.ry || 38);
        m.facing = m.x >= prevX ? 1 : -1;
        if (hitBox(m.x, m.y, m.w, m.h, 7)) onHit('فراشة القمر السامة! -1 ❤️');
      }
    }

    // 10b. Ultra-Detailed Stinging Greenhouse Bees (Figure-8 Patrol + Stinger Telegraph + Meow Repel!)
    if (level.bees) {
      for (const bee of level.bees) {
        if (bee.repelTimer > 0) {
          bee.repelTimer -= dt;
          const dir = bee.repelDir || 1;
          bee.facing = dir;
          bee.stingReady = 0;
          const lift = Math.min(1, bee.repelTimer / 0.8);
          bee.x += dir * 165 * dt;
          bee.x = Math.max(bee.baseX - 180, Math.min(bee.baseX + 180, bee.x));
          bee.y = bee.baseY - 95 * lift + Math.sin(timeSec * 24) * 3;
          bee.pitch = -0.22;
          continue;
        }
        const spd = bee.freq || 1.55;
        const p = timeSec * spd + (bee.phase || 0);
        const prevX = bee.x;
        const prevY = bee.y;
        bee.x = bee.baseX + Math.sin(p) * (bee.rx || 115);
        bee.y = bee.baseY + Math.sin(p * 2) * (bee.ry || 36) + Math.sin(timeSec * 28 + p) * 1.4;
        const dxMove = bee.x - prevX;
        const dyMove = bee.y - prevY;
        if (Math.abs(dxMove) > 0.05) bee.facing = dxMove >= 0 ? 1 : -1;
        bee.pitch = Math.max(-0.28, Math.min(0.28, dyMove * 0.08));

        const distToCat = Math.hypot(catCx - (bee.x + bee.w / 2), catCy - (bee.y + bee.h / 2));
        const targetSting = distToCat < 210 ? 1 : 0;
        bee.stingReady = (bee.stingReady || 0) + (targetSting - (bee.stingReady || 0)) * Math.min(1, dt * 8);

        if (hitBox(bee.x, bee.y, bee.w, bee.h, 6)) onHit('لسعة نحلة! -1 ❤️');
      }
    }

    // 11. Cybernetic Neon Spider-Bots (Recoils up silk thread on Meow!)
    if (level.cyber_spiders) {
      for (const sp of level.cyber_spiders) {
        if (sp.repelTimer > 0) {
          sp.repelTimer -= dt;
          sp.y = sp.y + (sp.topY - 35 - sp.y) * Math.min(1, dt * 8);
          continue;
        }
        const p = (Math.sin(timeSec * (sp.speed || 2.0) + (sp.phase || 0)) + 1) * 0.5;
        sp.y = sp.topY + p * (sp.dropDist || 175);
        if (hitBox(sp.x, sp.y, sp.w, sp.h, 5)) onHit('العنكبوت الآلي! -1 ❤️');
      }
    }

    // 12. High-Speed Plasma Hover-Saws
    if (level.hover_saws) {
      for (const saw of level.hover_saws) {
        if (stepRepelled(saw, 230)) continue;
        saw.x += saw.facing * Math.abs(saw.vx) * dt;
        if (saw.x <= saw.minX) { saw.x = saw.minX; saw.facing = 1; }
        else if (saw.x >= saw.maxX) { saw.x = saw.maxX; saw.facing = -1; }
        if (hitBox(saw.x, saw.y, saw.w, saw.h, 4)) onHit('قرص البلازما! -1 ❤️');
      }
    }

    // 13. Armored Street Badgers
    if (level.badgers) {
      for (const bg of level.badgers) {
        if (stepRepelled(bg, 215)) { bg.charging = false; continue; }
        const dist = Math.abs(catCx - (bg.x + bg.w / 2));
        const sameY = Math.abs(catCy - (bg.y + bg.h / 2)) < 55;
        const charging = dist < 210 && sameY && !c.crouching;
        bg.charging = charging;
        if (charging) bg.facing = catCx > bg.x + bg.w / 2 ? 1 : -1;
        bg.x += bg.facing * Math.abs(bg.vx) * (charging ? 1.65 : 1) * dt;
        if (bg.x <= bg.minX) { bg.x = bg.minX; bg.facing = 1; }
        else if (bg.x >= bg.maxX) { bg.x = bg.maxX; bg.facing = -1; }
        if (hitBox(bg.x, bg.y, bg.w, bg.h, 6)) onHit('هجوم الغرير! -1 ❤️');
      }
    }

    // 14. Majestic Golden Dawn Hawks
    if (level.hawks) {
      for (const hk of level.hawks) {
        if (stepRepelled(hk, 225)) {
          hk.y = hk.baseY - 75 * Math.min(1, hk.repelTimer / 0.8);
          continue;
        }
        hk.x += hk.facing * Math.abs(hk.vx) * dt;
        if (hk.x <= hk.minX) { hk.x = hk.minX; hk.facing = 1; }
        else if (hk.x >= hk.maxX) { hk.x = hk.maxX; hk.facing = -1; }
        hk.y = hk.baseY + Math.sin(timeSec * (hk.freq || 2.4) + hk.minX * 0.01) * (hk.amp || 36);
        if (hitBox(hk.x, hk.y, hk.w, hk.h, 7)) onHit('انقضاض الصقر! -1 ❤️');
      }
    }

    // 15. Flashing Highway Bridge Maintenance Rovers
    if (level.bridge_rovers) {
      for (const rv of level.bridge_rovers) {
        if (stepRepelled(rv, 195)) continue;
        rv.x += rv.facing * Math.abs(rv.vx) * dt;
        if (rv.x <= rv.minX) { rv.x = rv.minX; rv.facing = 1; }
        else if (rv.x >= rv.maxX) { rv.x = rv.maxX; rv.facing = -1; }
        if (hitBox(rv.x, rv.y, rv.w, rv.h, 5)) onHit('عربة صيانة الجسر! -1 ❤️');
      }
    }

    // 16. Sleek Guard Doberman Pinschers (Stage 15 — Full Dog Vision Cone, Bark, Chase Music, Sneak Stealth & Meow Repel!)
    if (level.dobermans) {
      for (const db of level.dobermans) {
        if (stepRepelled(db, 235)) { db.alert = false; db.state = 'repelled'; continue; }
        const dbCx = db.x + db.w / 2;
        const dbCy = db.y + db.h / 2;
        const dist = Math.hypot(catCx - dbCx, catCy - dbCy);
        const sightRange = c.crouching ? 135 : 225;
        const sameHeight = Math.abs(catCy - dbCy) < 85;
        const facingCat = (catCx - dbCx) * db.facing > -20;

        if (dist < sightRange && sameHeight && facingCat && c.invulnTimer <= 0) {
          if (!db.alert) {
            db.alert = true;
            db.state = 'alert';
            if (Audio && Audio.playBark) Audio.playBark();
            if (Particles && Particles.spawnPopup) {
              Particles.spawnPopup(dbCx, db.y - 14, '❗ WOOF!', '#ff6b8b');
            }
          }
          anyChasing = true;
          const dxToCat = catCx - dbCx;
          if (Math.abs(dxToCat) > 14) {
            db.facing = dxToCat > 0 ? 1 : -1;
            db.x += db.facing * 175 * dt;
            db.x = Math.max(db.minX, Math.min(db.maxX, db.x));
          }
        } else {
          db.alert = false;
          db.state = 'patrol';
          db.x += db.facing * Math.abs(db.vx) * dt;
          if (db.x <= db.minX) { db.x = db.minX; db.facing = 1; }
          else if (db.x >= db.maxX) { db.x = db.maxX; db.facing = -1; }
        }
        if (hitBox(db.x, db.y, db.w, db.h, 6)) onHit('عضّة كلب الدوبرمان! -1 ❤️');
      }
    }
    return anyChasing;
  }

  // =========================================================================
  // ANATOMICAL & MECHANICAL MASTER-QUALITY CREATURE RENDERERS
  // =========================================================================
  function drawAll(ctx, level, camX, camY, time, viewW, nv) {
    const cullW = viewW || 1280;

    // 1. Museum Armored Brass & Obsidian Security Automaton
    if (level.security_bots) {
      for (const bot of level.security_bots) {
        const bx = bot.x - camX, by = bot.y - camY;
        if (bx < -120 || bx > cullW + 120) continue;
        const hover = Math.sin(time * 8 + bot.x * 0.05) * 1.2;
        ctx.save();
        ctx.translate(bx + bot.w / 2, by + bot.h);
        ctx.scale(bot.facing, 1);

        // Volumetric scanner cone
        const coneG = ctx.createLinearGradient(16, -34, 138, -10);
        coneG.addColorStop(0, bot.alert ? 'rgba(239, 68, 68, 0.45)' : 'rgba(56, 189, 248, 0.25)');
        coneG.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = coneG;
        ctx.beginPath(); ctx.moveTo(16, -35); ctx.lineTo(138, -50); ctx.lineTo(138, -4); ctx.closePath(); ctx.fill();

        // Ground contact shadow
        ctx.fillStyle = 'rgba(0,0,0,0.48)';
        ctx.beginPath(); ctx.ellipse(0, 0, 28, 5, 0, 0, Math.PI * 2); ctx.fill();

        // Heavy Rubber Tank Treads with 4 Rotating Brass Bogie Wheels
        ctx.fillStyle = '#090d16'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.roundRect(-24, -14, 48, 13, 6.5); ctx.fill(); ctx.stroke();
        const wheelRot = time * (bot.alert ? 14 : 7);
        for (const wx of [-15, -5, 5, 15]) {
          ctx.save();
          ctx.translate(wx, -7.5); ctx.rotate(wheelRot);
          ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-3.5, 0); ctx.lineTo(3.5, 0); ctx.stroke();
          ctx.restore();
        }

        // Hydraulic Neck & Suspension Pistons
        ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.2;
        ctx.fillRect(-10, -18, 5, 6); ctx.fillRect(5, -18, 5, 6);

        // Layered Brushed-Steel & Gold-Filigree Armored Torso
        ctx.translate(0, hover);
        const torsoG = ctx.createLinearGradient(-18, -45, 18, -14);
        torsoG.addColorStop(0, '#475569'); torsoG.addColorStop(0.4, '#1e293b'); torsoG.addColorStop(1, '#090d16');
        ctx.fillStyle = torsoG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.roundRect(-18, -43, 36, 29, [14, 14, 5, 5]); ctx.fill(); ctx.stroke();
        // Brass armor trim & cooling vents
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.roundRect(-15, -40, 30, 23, [11, 11, 3, 3]); ctx.stroke();
        ctx.fillStyle = '#090d16';
        for (let vy = -25; vy <= -19; vy += 3) ctx.fillRect(-10, vy, 16, 1.8);

        // Articulated Side Sensor Pod + Glass Visor Optics
        ctx.fillStyle = '#020617'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(-2, -38, 21, 10, 4); ctx.fill(); ctx.stroke();
        const eyeX = 5 + Math.sin(time * 7) * 4;
        ctx.fillStyle = bot.alert ? '#ff453a' : '#38bdf8';
        ctx.beginPath(); ctx.arc(eyeX, -33, 3.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(eyeX - 1, -34, 1.3, 0, Math.PI * 2); ctx.fill();

        // Twin Brass Antenna & Pulsing Dome Beacon
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-4, -43); ctx.lineTo(-6, -52); ctx.moveTo(4, -43); ctx.lineTo(4, -49); ctx.stroke();
        ctx.fillStyle = bot.alert ? '#ef4444' : '#fde047';
        ctx.beginPath(); ctx.arc(-6, -53, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 2. Ornate Ceiling Gimbal Laser Turrets
    if (level.sweeping_lasers) {
      for (const tur of level.sweeping_lasers) {
        const tx = tur.x - camX, ty = tur.y - camY;
        if (tx < -260 || tx > cullW + 260) continue;
        const ang = tur.angle || Math.PI / 2;
        const len = tur.len || 240;
        const ex = tx + Math.cos(ang) * len;
        const ey = ty + Math.sin(ang) * len;

        ctx.save();
        // Multi-layered plasma laser beam + floor impact flare
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.24)'; ctx.lineWidth = 14;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.strokeStyle = 'rgba(248, 113, 113, 0.72)'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.fillStyle = 'rgba(254, 202, 202, 0.8)';
        ctx.beginPath(); ctx.arc(ex, ey, 5 + Math.sin(time * 24) * 2, 0, Math.PI * 2); ctx.fill();

        // Bolted Ceiling Plate + Articulated Rotating Brass Gimbal Barrel
        ctx.fillStyle = '#334155'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
        ctx.fillRect(tx - 24, ty - 6, 48, 8); ctx.strokeRect(tx - 24, ty - 6, 48, 8);
        const domeG = ctx.createLinearGradient(tx - 16, ty, tx + 16, ty + 16);
        domeG.addColorStop(0, '#fbbf24'); domeG.addColorStop(0.5, '#b45309'); domeG.addColorStop(1, '#451a03');
        ctx.fillStyle = domeG; ctx.strokeStyle = '#1c0a02'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(tx, ty + 2, 16, 0, Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Rotating barrel nozzle
        ctx.save();
        ctx.translate(tx, ty + 6); ctx.rotate(ang);
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.3;
        ctx.fillRect(4, -5, 16, 10); ctx.strokeRect(4, -5, 16, 10);
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(19, 0, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        ctx.restore();
      }
    }

    // 3. Ultra-Detailed Swooping Coastal Pelicans (Layered Primary Feathers, S-Neck, Translucent Pouch)
    if (level.pelicans) {
      for (const pel of level.pelicans) {
        const px = pel.x - camX, py = pel.y - camY;
        if (px < -130 || px > cullW + 130) continue;
        const flap = Math.sin(time * 9.5 + pel.minX) * 16;
        ctx.save();
        ctx.translate(px + pel.w / 2, py + pel.h / 2);
        ctx.scale(pel.facing, 1);

        // Far shaded articulated wing with dark primary tips
        ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-4, -5); ctx.quadraticCurveTo(-20, -28 + flap, -38, -10 + flap);
        ctx.quadraticCurveTo(-24, 0, -6, 3); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Tucked webbed orange feet
        ctx.fillStyle = '#ea580c';
        ctx.beginPath(); ctx.ellipse(-18, 12, 8, 3.5, 0.25, 0, Math.PI * 2); ctx.fill();

        // Sculpted Plump White Body with Underbelly Shading & Dark Tail Feathers
        ctx.fillStyle = '#334155';
        ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-37, -5); ctx.lineTo(-34, 7); ctx.lineTo(-20, 6); ctx.closePath(); ctx.fill();
        const bodyG = ctx.createLinearGradient(0, -12, 0, 14);
        bodyG.addColorStop(0, '#ffffff'); bodyG.addColorStop(0.65, '#e2e8f0'); bodyG.addColorStop(1, '#94a3b8');
        ctx.fillStyle = bodyG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.ellipse(-2, 2, 24, 12.5, -0.06, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Graceful S-Curved White Neck + Crested Head
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(14, -4); ctx.quadraticCurveTo(22, -16, 27, -10);
        ctx.quadraticCurveTo(30, -2, 18, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(23, -10, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Crown feather crest
        ctx.beginPath(); ctx.moveTo(18, -18); ctx.lineTo(12, -22); ctx.lineTo(16, -15); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Iconic Shaded Golden Bill + Elastic Veined Throat Pouch
        const pouchG = ctx.createLinearGradient(28, -5, 44, 10);
        pouchG.addColorStop(0, '#fbbf24'); pouchG.addColorStop(0.55, '#f97316'); pouchG.addColorStop(1, '#c2410c');
        ctx.fillStyle = pouchG; ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(26, -5); ctx.quadraticCurveTo(37, 13, 50, -6); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Upper hooked mandible
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.moveTo(28, -12); ctx.lineTo(52, -7); ctx.lineTo(50, -4); ctx.lineTo(27, -5); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Expressive Eye with Gold Ring & Specular Catchlight
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(24, -11.5, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(24.4, -11.5, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(23.8, -12.2, 0.8, 0, Math.PI * 2); ctx.fill();

        // Near Layered Feathered Wing with Individual Slotted Primary Tips
        const wG = ctx.createLinearGradient(0, -28 - flap, 0, 8);
        wG.addColorStop(0, '#ffffff'); wG.addColorStop(0.7, '#cbd5e1'); wG.addColorStop(1, '#334155');
        ctx.fillStyle = wG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(6, -2); ctx.quadraticCurveTo(-12, -30 - flap, -34, -8 - flap);
        ctx.lineTo(-26, -2 - flap * 0.7); ctx.lineTo(-30, 3 - flap * 0.5);
        ctx.quadraticCurveTo(-12, 9, 8, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }

    // 4. Anatomical Bounding Red Fox (Articulated Legs, Bushy Tail, Fur Strokes, Pointed Snout)
    if (level.foxes) {
      for (const fox of level.foxes) {
        const fx = fox.x - camX, fy = fox.y - (fox.hopY || 0) - camY;
        if (fx < -110 || fx > cullW + 110) continue;
        const walk = time * 13 + fox.x * 0.08;
        const stepA = Math.sin(walk) * 6.5;
        const stepB = -stepA;
        const bob = Math.abs(Math.sin(walk)) * 1.4;
        ctx.save();
        ctx.translate(fx + fox.w / 2, fy + fox.h);
        ctx.scale(fox.facing, 1);

        // Ground shadow (scales down when hopping!)
        ctx.fillStyle = 'rgba(0,0,0,0.44)';
        ctx.beginPath(); ctx.ellipse(0, fox.hopY || 0, Math.max(12, 28 - (fox.hopY || 0) * 0.22), 4.8, 0, 0, Math.PI * 2); ctx.fill();

        // Lush Multi-Tufted Bushy Russet Tail with Fluffy White Tip
        ctx.save();
        ctx.translate(-17, -18 - bob);
        ctx.rotate(-0.22 + Math.sin(time * 5.2 + fox.x) * 0.14);
        const tailG = ctx.createLinearGradient(0, -10, -34, 10);
        tailG.addColorStop(0, '#ea580c'); tailG.addColorStop(0.62, '#c2410c'); tailG.addColorStop(0.68, '#fffbeb'); tailG.addColorStop(1, '#f8fafc');
        ctx.fillStyle = tailG; ctx.strokeStyle = '#431407'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -3); ctx.quadraticCurveTo(-16, -13, -34, -4); ctx.quadraticCurveTo(-24, 9, 0, 4);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();

        // Far Shaded Black-Stockinged Slender Legs
        ctx.strokeStyle = '#090d16'; ctx.lineWidth = 4.6; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-12, -14 - bob); ctx.lineTo(-15 + stepB * 0.7, -2);
        ctx.moveTo(10, -14 - bob); ctx.lineTo(13 + stepA * 0.7, -2);
        ctx.stroke();

        // Sleek Muscular Russet Fox Body + Cream Belly & Chest Ruff
        const furG = ctx.createLinearGradient(0, -32 - bob, 0, -8 - bob);
        furG.addColorStop(0, '#fb923c'); furG.addColorStop(0.45, '#ea580c'); furG.addColorStop(1, '#9a3412');
        ctx.fillStyle = furG; ctx.strokeStyle = '#431407'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-20, -15 - bob);
        ctx.quadraticCurveTo(-18, -29 - bob, -2, -29 - bob);
        ctx.quadraticCurveTo(13, -29 - bob, 18, -19 - bob);
        ctx.quadraticCurveTo(16, -9 - bob, 4, -9 - bob);
        ctx.quadraticCurveTo(-10, -8 - bob, -20, -15 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Creamy fluffy chest ruff & fur texture strokes
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath(); ctx.ellipse(13, -15 - bob, 8.5, 6.2, 0.25, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255, 237, 213, 0.34)'; ctx.lineWidth = 1.2;
        for (const [tx, ty] of [[-11, -24], [-3, -26], [5, -24], [-7, -18]]) {
          ctx.beginPath(); ctx.moveTo(tx, ty - bob); ctx.lineTo(tx - 4, ty - 2 - bob); ctx.stroke();
        }

        // Near Articulated Russet Thighs -> Black Lower Stockings -> White Paw Tips
        ctx.strokeStyle = '#c2410c'; ctx.lineWidth = 5.5;
        ctx.beginPath(); ctx.moveTo(-11, -15 - bob); ctx.lineTo(-12 + stepA * 0.4, -8); ctx.moveTo(11, -14 - bob); ctx.lineTo(12 + stepB * 0.4, -8); ctx.stroke();
        ctx.strokeStyle = '#18181b'; ctx.lineWidth = 4.2;
        ctx.beginPath(); ctx.moveTo(-12 + stepA * 0.4, -9); ctx.lineTo(-10 + stepA, -2); ctx.moveTo(12 + stepB * 0.4, -9); ctx.lineTo(14 + stepB, -2); ctx.stroke();
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath(); ctx.arc(-9 + stepA, -1.8, 2.2, 0, Math.PI * 2); ctx.arc(15 + stepB, -1.8, 2.2, 0, Math.PI * 2); ctx.fill();

        // Sculpted Triangular Fox Head, White Cheeks & Large Pointed Black-Tipped Ears
        ctx.fillStyle = '#ea580c'; ctx.strokeStyle = '#431407'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(10, -29 - bob); ctx.quadraticCurveTo(20, -31 - bob, 24, -24 - bob);
        ctx.lineTo(35, -20 - bob); ctx.lineTo(24, -14 - bob); ctx.quadraticCurveTo(14, -12 - bob, 10, -20 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // White lower cheek ruff
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath(); ctx.moveTo(13, -19 - bob); ctx.lineTo(34, -20 - bob); ctx.lineTo(23, -14 - bob); ctx.quadraticCurveTo(15, -13 - bob, 13, -19 - bob); ctx.closePath(); ctx.fill();
        // Large triangular upright ears with dark tips & pale inner tufts
        for (const [ex, rot] of [[12, -0.15], [18, 0.1]]) {
          ctx.save(); ctx.translate(ex, -27 - bob); ctx.rotate(rot);
          ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.moveTo(-4.5, 0); ctx.lineTo(0, -13); ctx.lineTo(4.5, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#18181b'; ctx.beginPath(); ctx.moveTo(-2.5, -7); ctx.lineTo(0, -13); ctx.lineTo(2.5, -7); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.moveTo(-2.2, -1); ctx.lineTo(0, -7); ctx.lineTo(2.2, -1); ctx.closePath(); ctx.fill();
          ctx.restore();
        }
        // Sly Golden Eye with Vertical Pupil, Catchlight, Black Nose & Fine Whiskers
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.ellipse(21.5, -23.5 - bob, 3, 2.3, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.ellipse(22, -23.5 - bob, 1, 2.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(20.8, -24.2 - bob, 0.85, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(35, -20 - bob, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(30, -19 - bob); ctx.lineTo(38, -21 - bob); ctx.moveTo(30, -18 - bob); ctx.lineTo(38, -16 - bob); ctx.stroke();
        ctx.restore();
      }
    }

    // 5. Steampunk Mechanical Brass Clockwork Scarab Beetle (Meshing Gears, Riveted Wing-Cases, Ruby Optics)
    if (level.clockwork_beetles) {
      for (const b of level.clockwork_beetles) {
        const bx = b.x - camX, by = b.y - camY;
        if (bx < -90 || bx > cullW + 90) continue;
        ctx.save();
        ctx.translate(bx + b.w / 2, by + b.h);
        ctx.scale(b.facing, 1);

        ctx.fillStyle = 'rgba(0,0,0,0.44)';
        ctx.beginPath(); ctx.ellipse(0, 0, 24, 4.5, 0, 0, Math.PI * 2); ctx.fill();

        // Exposed Interlocking Meshing Brass Gears rotating above carapace!
        const gearSpeed = time * (b.surging ? 13 : 4.8);
        for (const [gx, gy, gr, dir] of [[-7, -26, 8.5, 1], [6, -24, 6.5, -1.3]]) {
          ctx.save();
          ctx.translate(gx, gy); ctx.rotate(gearSpeed * dir);
          ctx.fillStyle = '#d97706'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.2;
          for (let t = 0; t < 8; t++) {
            ctx.save(); ctx.rotate((t * Math.PI * 2) / 8); ctx.fillRect(-1.8, -gr - 2.5, 3.6, 3.5); ctx.restore();
          }
          ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(0, 0, gr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }

        // 6 Articulated 2-Segment Copper Legs with Brass Knee Rivets
        for (let l = 0; l < 3; l++) {
          const lx = -13 + l * 12;
          const phase = time * (b.surging ? 22 : 12) + l * 2.1;
          const kx = lx + Math.sin(phase) * 3.5;
          const ky = -7 + Math.cos(phase) * 1.5;
          ctx.strokeStyle = '#78350f'; ctx.lineWidth = 3; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(lx, -11); ctx.lineTo(kx, ky); ctx.lineTo(kx + 2, -1); ctx.stroke();
          ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(kx, ky, 1.8, 0, Math.PI * 2); ctx.fill();
        }

        // Layered Polished Bronze & Copper Wing-Case Plates with Brass Rivets
        const shellG = ctx.createLinearGradient(0, -26, 0, -5);
        shellG.addColorStop(0, '#fef08a'); shellG.addColorStop(0.35, '#d97706'); shellG.addColorStop(0.75, '#92400e'); shellG.addColorStop(1, '#451a03');
        ctx.fillStyle = shellG; ctx.strokeStyle = '#290f02'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.ellipse(-2, -13, 21, 12.5, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Segmented armor seams & specular strip
        ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(-6, -25); ctx.quadraticCurveTo(-2, -16, -4, -13); ctx.moveTo(7, -24); ctx.quadraticCurveTo(10, -17, 9, -13); ctx.stroke();
        ctx.fillStyle = 'rgba(255, 251, 235, 0.38)'; ctx.beginPath(); ctx.ellipse(-4, -20, 10, 2.5, -0.1, 0, Math.PI * 2); ctx.fill();
        // Tiny brass rivets along edge
        ctx.fillStyle = '#fef08a';
        for (const rx of [-17, -10, -2, 6, 14]) { ctx.beginPath(); ctx.arc(rx, -14.5, 1.2, 0, Math.PI * 2); ctx.fill(); }

        // Faceted Ruby Optical Eye & Serrated Brass Mandibles
        ctx.fillStyle = b.surging ? '#ff453a' : '#dc2626'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(16, -15, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fecaca'; ctx.beginPath(); ctx.arc(15, -16.2, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(19, -11); ctx.quadraticCurveTo(27, -15, 26, -7); ctx.stroke();
        ctx.restore();
      }
    }

    // 6. Realistic Nocturnal Striped Skunk (Plumed Fur Tail, Articulated Claws, Swirling Gas Cloud)
    if (level.skunks) {
      for (const sk of level.skunks) {
        const sx = sk.x - camX, sy = sk.y - camY;
        if (sx < -130 || sx > cullW + 130) continue;
        const walk = time * 11 + sk.x * 0.08;
        const step = sk.spraying || sk.warning ? 0 : Math.sin(walk) * 4;
        ctx.save();
        ctx.translate(sx + sk.w / 2, sy + sk.h);
        ctx.scale(sk.facing, 1);

        // Multi-Layered Swirling Toxic Emerald Gas Cloud when spraying
        if (sk.spraying) {
          for (let p = 0; p < 6; p++) {
            const ox = -24 - p * 10;
            const oy = -19 + Math.sin(time * 8 + p * 1.4) * 8;
            const r = 13 + (p % 3) * 4;
            const gG = ctx.createRadialGradient(ox, oy, 2, ox, oy, r);
            gG.addColorStop(0, 'rgba(134, 239, 172, 0.55)'); gG.addColorStop(1, 'rgba(74, 222, 128, 0)');
            ctx.fillStyle = gG; ctx.beginPath(); ctx.arc(ox, oy, r, 0, Math.PI * 2); ctx.fill();
          }
        }

        ctx.fillStyle = 'rgba(0,0,0,0.44)';
        ctx.beginPath(); ctx.ellipse(0, 0, 24, 4.5, 0, 0, Math.PI * 2); ctx.fill();

        // Huge Fluffy Plumed Black-and-White Tail
        const tailAng = sk.spraying || sk.warning ? -0.95 : -0.32 + Math.sin(time * 4.5) * 0.1;
        ctx.save();
        ctx.translate(-14, -15); ctx.rotate(tailAng);
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.bezierCurveTo(-12, -16, -32, -14, -36, -2); ctx.bezierCurveTo(-30, 10, -10, 8, 0, 3);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.moveTo(-3, -3); ctx.quadraticCurveTo(-18, -14, -33, -4); ctx.quadraticCurveTo(-18, -3, -3, -3); ctx.fill();
        ctx.restore();

        // Articulated Stubby Dark Legs & Curved Pale Claws
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.roundRect(-13 + step, -11, 7, 10, 3); ctx.roundRect(6 - step, -11, 7, 10, 3); ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(-7 + step, -2, 3, 2); ctx.fillRect(12 - step, -2, 3, 2);

        // Pear-Shaped Glossy Black Coat + Twin Bold White Dorsal Stripes
        const coatG = ctx.createLinearGradient(0, -28, 0, -6);
        coatG.addColorStop(0, '#334155'); coatG.addColorStop(0.45, '#111827'); coatG.addColorStop(1, '#020617');
        ctx.fillStyle = coatG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-18, -12); ctx.quadraticCurveTo(-18, -27, -2, -26); ctx.quadraticCurveTo(12, -25, 16, -15);
        ctx.quadraticCurveTo(14, -6, -2, -6); ctx.quadraticCurveTo(-14, -6, -18, -12);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Bold iconic white stripe flowing from crown down back
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.moveTo(-15, -20); ctx.quadraticCurveTo(-4, -27, 12, -22); ctx.quadraticCurveTo(-2, -20, -15, -16); ctx.closePath(); ctx.fill();

        // Triangular Skunk Head, Rounded Ears, Forehead Blaze & Bright Eye
        ctx.fillStyle = '#111827'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(16, -15, 9.5, 7, 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(11, -21, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.ellipse(17, -19.5, 6.5, 2.2, 0.25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = sk.warning || sk.spraying ? '#4ade80' : '#ffffff';
        ctx.beginPath(); ctx.arc(18.5, -16, 2.3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#020617'; ctx.beginPath(); ctx.arc(19, -16, 1.2, 0, Math.PI * 2); ctx.arc(25.5, -14.5, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 7. Crackling Electric Scaled Sea-Eel (Iridescent Scales, Spiny Fins, Fanged Jaws, Lightning Arcs)
    if (level.leaping_fish) {
      for (const fish of level.leaping_fish) {
        if (!fish.active) continue;
        const fx = fish.x - camX, fy = fish.curY - camY;
        if (fx < -90 || fx > cullW + 90) continue;
        const tilt = (fish.t - 0.5) * 2.5;
        ctx.save();
        ctx.translate(fx, fy); ctx.rotate(tilt);

        const auraG = ctx.createRadialGradient(0, 0, 6, 0, 0, 38);
        auraG.addColorStop(0, 'rgba(56, 189, 248, 0.42)'); auraG.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = auraG; ctx.beginPath(); ctx.ellipse(0, 0, 26, 40, 0, 0, Math.PI * 2); ctx.fill();

        // Translucent Spiny Dorsal & Pectoral Fins
        ctx.fillStyle = 'rgba(125, 211, 252, 0.65)'; ctx.strokeStyle = '#0369a1'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-10, -12); ctx.lineTo(-20, -2); ctx.lineTo(-10, 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(10, -12); ctx.lineTo(20, -2); ctx.lineTo(10, 8); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Sinuous Scaled Sea-Eel Body + Forked Tail
        const eelG = ctx.createLinearGradient(-12, -28, 12, 28);
        eelG.addColorStop(0, '#0284c7'); eelG.addColorStop(0.45, '#38bdf8'); eelG.addColorStop(0.75, '#0369a1'); eelG.addColorStop(1, '#082f49');
        ctx.fillStyle = eelG; ctx.strokeStyle = '#041b2d'; ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -28); ctx.quadraticCurveTo(14, -14, 11, 8); ctx.lineTo(15, 28); ctx.lineTo(0, 20);
        ctx.lineTo(-15, 28); ctx.lineTo(-11, 8); ctx.quadraticCurveTo(-14, -14, 0, -28);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Shimmering scale crescents + glowing cyan eyes + white fangs
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.45)'; ctx.lineWidth = 1.1;
        for (let sy = -8; sy <= 12; sy += 7) {
          ctx.beginPath(); ctx.arc(0, sy, 6, 0.2, Math.PI - 0.2); ctx.stroke();
        }
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(-5, -16, 2.8, 0, Math.PI * 2); ctx.arc(5, -16, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#020617'; ctx.beginPath(); ctx.arc(-5, -16.5, 1.2, 0, Math.PI * 2); ctx.arc(5, -16.5, 1.2, 0, Math.PI * 2); ctx.fill();

        // Crackling Electric Arcs around body
        ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 2;
        ctx.beginPath();
        const j = Math.sin(time * 40) * 4;
        ctx.moveTo(-14, -18); ctx.lineTo(-20 + j, -6); ctx.lineTo(-13, 6);
        ctx.moveTo(14, -18); ctx.lineTo(20 - j, -4); ctx.lineTo(13, 8);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 8. Lifelike Multi-Segment Traveling-Wave Storm Octopus Tentacles (Fluid Kinematic Undulation, Spiraling Tip Curl, Mottled Wet Skin & Double 3D Suction Cups!)
    if (level.tentacles) {
      for (const tent of level.tentacles) {
        const tx = tent.x - camX, by = tent.baseY - camY;
        if (tx < -120 || tx > cullW + 120) continue;

        // Churning pre-emergence foam bubbles
        if (tent.warning) {
          ctx.fillStyle = 'rgba(224, 242, 254, 0.82)';
          for (let b = -22; b <= 22; b += 9) {
            const lift = Math.abs(Math.sin(time * 12 + b * 0.4 + (tent.phase || 0))) * 8;
            ctx.beginPath(); ctx.arc(tx + b, by - 3 - lift, 4.5 + (b === 0 ? 1.5 : 0), 0, Math.PI * 2); ctx.fill();
          }
        }

        if (tent.height > 4) {
          ctx.save();
          const h = tent.height;
          const ph = tent.phase || 0;
          const N = 18;
          const pts = [];
          const radii = [];

          // Compute realistic 18-segment traveling-wave spine with spiraling whip curl at the flexible tip!
          let curX = tx;
          let curY = by;
          const segLen = h / N;
          for (let s = 0; s <= N; s++) {
            const frac = s / N;
            pts.push({ x: curX, y: curY, frac });
            radii.push(Math.max(1.8, 17.5 * Math.pow(1 - frac * 0.92, 0.78)));
            // Traveling organic sine wave propagating from base to tip + gentle curling hook in upper 35%
            const waveAngle = Math.sin(frac * 4.5 - time * 4.4 + ph) * (0.24 + frac * 0.48);
            const curlZone = Math.max(0, (frac - 0.58) / 0.42);
            const curlDir = Math.sin(time * 1.9 + ph) >= 0 ? 1 : -1;
            const tipCurl = curlZone * curlZone * 1.65 * curlDir;
            const ang = -Math.PI / 2 + waveAngle + tipCurl;
            curX += Math.cos(ang) * segLen;
            curY += Math.sin(ang) * segLen;
          }

          // Compute smooth perpendicular left (dorsal) & right (ventral) flesh contours along the curved spine
          const leftPts = [];
          const rightPts = [];
          for (let s = 0; s <= N; s++) {
            const prev = pts[Math.max(0, s - 1)];
            const next = pts[Math.min(N, s + 1)];
            const dx = next.x - prev.x;
            const dy = next.y - prev.y;
            const len = Math.hypot(dx, dy) || 1;
            const nx = -dy / len;
            const ny = dx / len;
            const r = radii[s];
            leftPts.push({ x: pts[s].x + nx * r, y: pts[s].y + ny * r, nx, ny, r });
            rightPts.push({ x: pts[s].x - nx * r, y: pts[s].y - ny * r, nx, ny, r });
          }

          // Fill Muscular Tapered Cephalopod Arm Silhouette with Rich Deep Crimson-Plum Wet Shading
          const tG = ctx.createLinearGradient(tx - 24, by, pts[N].x + 24, pts[N].y);
          tG.addColorStop(0, '#3b0724');
          tG.addColorStop(0.35, '#881337');
          tG.addColorStop(0.72, '#be123c');
          tG.addColorStop(1, '#fb7185');
          ctx.fillStyle = tG;
          ctx.strokeStyle = '#240317';
          ctx.lineWidth = 2;
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(leftPts[0].x, leftPts[0].y);
          for (let s = 1; s <= N; s++) ctx.lineTo(leftPts[s].x, leftPts[s].y);
          ctx.arc(pts[N].x, pts[N].y, radii[N], 0, Math.PI * 2);
          for (let s = N; s >= 0; s--) ctx.lineTo(rightPts[s].x, rightPts[s].y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Paler Fleshy Rose-Coral Ventral Underside Strip along Sucker Side
          ctx.strokeStyle = 'rgba(253, 164, 175, 0.45)';
          ctx.lineWidth = 5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          for (let s = 1; s < N; s++) {
            const vx = pts[s].x - rightPts[s].nx * (radii[s] * 0.55);
            const vy = pts[s].y - rightPts[s].ny * (radii[s] * 0.55);
            if (s === 1) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
          }
          ctx.stroke();

          // Wet Glossy Dorsal Specular Sheen Ribbon + Mottled Dark Chromatophore Skin Spots
          ctx.strokeStyle = 'rgba(255, 228, 230, 0.34)';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          for (let s = 1; s < N - 1; s++) {
            const hx = pts[s].x + leftPts[s].nx * (radii[s] * 0.48);
            const hy = pts[s].y + leftPts[s].ny * (radii[s] * 0.48);
            if (s === 1) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
          }
          ctx.stroke();

          ctx.fillStyle = 'rgba(76, 5, 25, 0.48)';
          for (let s = 2; s < N - 2; s += 2) {
            const sx = pts[s].x + leftPts[s].nx * (radii[s] * 0.25);
            const sy = pts[s].y + leftPts[s].ny * (radii[s] * 0.25);
            ctx.beginPath(); ctx.ellipse(sx, sy, Math.max(1.4, radii[s] * 0.28), Math.max(1, radii[s] * 0.16), 0.3, 0, Math.PI * 2); ctx.fill();
          }

          // Double Staggered Row of Realistic 3D Cupped Suction Cups (Acetabula) Following the Exact Curved Ventral Edge!
          for (let s = 1; s < N - 1; s++) {
            const frac = s / N;
            const cupR = Math.max(1.6, 5.2 * (1 - frac * 0.72));
            const off = (s % 2 === 0 ? 0.72 : 0.96);
            const cx = pts[s].x - rightPts[s].nx * (radii[s] * off);
            const cy = pts[s].y - rightPts[s].ny * (radii[s] * off);
            // Outer fleshy pale-rose suction rim
            ctx.fillStyle = '#fbcfe8'; ctx.strokeStyle = '#831843'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(cx, cy, cupR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            // Deep shaded concave suction cup center
            ctx.fillStyle = '#9d174d';
            ctx.beginPath(); ctx.arc(cx - rightPts[s].nx * 0.4, cy - rightPts[s].ny * 0.4, cupR * 0.46, 0, Math.PI * 2); ctx.fill();
          }

          // Churning Ocean Foam & Spray Collar Swirling at Waterline Base
          ctx.fillStyle = 'rgba(224, 242, 254, 0.8)';
          for (let f = -20; f <= 20; f += 10) {
            const bob = Math.sin(time * 9 + f) * 1.8;
            ctx.beginPath(); ctx.arc(tx + f, by - 2 + bob, 5.5 + (f === 0 ? 1.5 : 0), 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
        }
      }
    }

    // 9. Museum-Grade Botanical Venus Flytrap (Dionaea muscipula — Winged Rosette, Cupped Veined Lobes, Trigger Hairs, Interlocking Cilia)
    if (level.venus_traps) {
      for (const v of level.venus_traps) {
        const vx = v.x - camX, vy = v.y - camY;
        if (vx < -100 || vx > cullW + 100) continue;
        ctx.save();
        ctx.translate(vx + v.w / 2, vy + v.h);

        const sway = Math.sin(time * 2.2 + (v.phase || 0)) * 2.2;
        const tremble = v.state === 'warn' ? Math.sin(time * 46) * 2.8 : 0;
        const lunge = v.lunge !== undefined ? v.lunge : (v.state === 'snap' ? -20 : 0);
        const jawAngle = v.jawAngle !== undefined ? v.jawAngle : (v.state === 'snap' ? 0.04 : 0.62);
        const headX = sway + tremble;
        const headY = -36 + lunge;

        // Ground contact shadow + Dark mossy soil mound with pebbles
        ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
        ctx.beginPath(); ctx.ellipse(0, 0, 29, 5.2, 0, 0, Math.PI * 2); ctx.fill();
        const soilG = ctx.createRadialGradient(-3, -4, 2, 0, -2, 24);
        soilG.addColorStop(0, '#3f2e21'); soilG.addColorStop(0.65, '#1f1610'); soilG.addColorStop(1, '#090d0a');
        ctx.fillStyle = soilG;
        ctx.beginPath(); ctx.ellipse(0, -1, 22, 6.5, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
        // Velvet moss tufts around soil rim
        ctx.fillStyle = '#15803d';
        for (const [mx, my, mr] of [[-14, -3, 4.5], [-6, -5, 5], [7, -4.5, 4.8], [15, -3, 4]]) {
          ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
        }

        // Botanical Basal Rosette of Broad Winged Petiole Leaves + Two Tiny Juvenile Closed Buds
        for (const s of [-1, 1]) {
          ctx.save();
          ctx.translate(s * 3, -4);
          ctx.rotate(s * 0.14);
          const leafG = ctx.createLinearGradient(0, -10, s * 28, 2);
          leafG.addColorStop(0, '#14532d'); leafG.addColorStop(0.5, '#16a34a'); leafG.addColorStop(1, '#4d7c0f');
          ctx.fillStyle = leafG; ctx.strokeStyle = '#052e16'; ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(s * 9, -12, s * 24, -10, s * 29, -2);
          ctx.bezierCurveTo(s * 23, 6, s * 10, 6, 0, 2);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          // Central midrib & delicate veins
          ctx.strokeStyle = 'rgba(187, 247, 208, 0.55)'; ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(s * 2, 0.5); ctx.quadraticCurveTo(s * 14, -3, s * 25, -2);
          ctx.moveTo(s * 11, -1); ctx.lineTo(s * 16, -6);
          ctx.moveTo(s * 15, -1.5); ctx.lineTo(s * 20, 2.5);
          ctx.stroke();
          ctx.restore();
        }

        // Small closed juvenile Venus bud curling up on the left side for botanical authenticity
        ctx.strokeStyle = '#15803d'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-8, -5); ctx.quadraticCurveTo(-18, -14, -19, -22); ctx.stroke();
        ctx.fillStyle = '#22c55e'; ctx.strokeStyle = '#052e16'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.ellipse(-20, -24, 6.5, 4, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Supple Ribbed Botanical Petiole Stalk (smoothly bends & stretches with lunge!)
        const ctrlX = headX * 0.45 + 6;
        const ctrlY = headY * 0.52;
        ctx.strokeStyle = '#052e16'; ctx.lineWidth = 11; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, -4); ctx.quadraticCurveTo(ctrlX, ctrlY, headX, headY + 6); ctx.stroke();
        const stalkG = ctx.createLinearGradient(-6, -4, headX + 6, headY);
        stalkG.addColorStop(0, '#14532d'); stalkG.addColorStop(0.45, '#16a34a'); stalkG.addColorStop(1, '#65a30d');
        ctx.strokeStyle = stalkG; ctx.lineWidth = 7.4;
        ctx.beginPath(); ctx.moveTo(0, -4); ctx.quadraticCurveTo(ctrlX, ctrlY, headX, headY + 6); ctx.stroke();
        // Ribbed midvein highlight along petiole
        ctx.strokeStyle = 'rgba(217, 249, 157, 0.52)'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(-1, -6); ctx.quadraticCurveTo(ctrlX - 1.5, ctrlY, headX - 1, headY + 6); ctx.stroke();

        // Articulated Botanical Clam-Shell Trap Head
        ctx.save();
        ctx.translate(headX, headY + 4);

        // Deep shadowed botanical throat/hinge cup between the two lobes
        if (jawAngle > 0.14) {
          const throatG = ctx.createRadialGradient(0, -8, 2, 0, -8, 16);
          throatG.addColorStop(0, '#4c0519'); throatG.addColorStop(0.65, '#881337'); throatG.addColorStop(1, '#be123c');
          ctx.fillStyle = throatG;
          ctx.beginPath(); ctx.ellipse(0, -9, 14 * Math.min(1, jawAngle * 1.45), 11, 0, 0, Math.PI * 2); ctx.fill();
        }

        // Draw Left & Right Cupped Sculpted Botanical Valve Lobes
        for (const side of [-1, 1]) {
          ctx.save();
          ctx.rotate(side * jawAngle);

          // Sculpted semicircular cupped botanical lobe (outer green skin)
          const outerG = ctx.createLinearGradient(0, -24, side * 22, 4);
          outerG.addColorStop(0, '#84cc16'); outerG.addColorStop(0.35, '#22c55e'); outerG.addColorStop(0.75, '#15803d'); outerG.addColorStop(1, '#052e16');
          ctx.fillStyle = outerG; ctx.strokeStyle = '#052e16'; ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(0, 2);
          ctx.bezierCurveTo(side * 16, 4, side * 25, -9, side * 19, -22);
          ctx.bezierCurveTo(side * 12, -29, side * 2, -24, 0, -17);
          ctx.closePath();
          ctx.fill(); ctx.stroke();

          // Subtle natural parallel green botanical ribs on outer valve
          ctx.strokeStyle = 'rgba(217, 249, 157, 0.34)'; ctx.lineWidth = 0.9;
          for (let r = 0; r < 3; r++) {
            const ry = -4 - r * 6;
            ctx.beginPath(); ctx.moveTo(side * 3, ry + 2); ctx.quadraticCurveTo(side * 12, ry, side * 18, ry - 4); ctx.stroke();
          }

          // Rich Velvety Crimson-Burgundy Glandular Interior (visible when open/warning!)
          if (jawAngle > 0.12) {
            const innerG = ctx.createRadialGradient(side * 7, -12, 1.5, side * 9, -12, 14);
            innerG.addColorStop(0, '#fb7185');
            innerG.addColorStop(0.32, '#e11d48');
            innerG.addColorStop(0.75, '#881337');
            innerG.addColorStop(1, '#4c0519');
            ctx.fillStyle = innerG;
            ctx.beginPath();
            ctx.moveTo(side * 1.5, -1);
            ctx.bezierCurveTo(side * 11, 0, side * 17, -9, side * 13, -19);
            ctx.bezierCurveTo(side * 8, -23, side * 2, -19, side * 1.5, -14);
            ctx.closePath(); ctx.fill();

            // Wet nectar specular sheen & tiny sensory trigger hairs (trichomes)
            ctx.fillStyle = 'rgba(255, 228, 230, 0.45)';
            ctx.beginPath(); ctx.ellipse(side * 6.5, -15, 3.2, 1.4, side * 0.3, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(254, 240, 138, 0.72)'; ctx.lineWidth = 0.85;
            for (const ty of [-15, -11, -7]) {
              ctx.beginPath(); ctx.moveTo(side * 6, ty); ctx.lineTo(side * 2, ty - 1.5); ctx.stroke();
            }
          }

          // Curved Organic Marginal Cilia Spines (interlocking like a real Venus Flytrap cage!)
          ctx.strokeStyle = '#365314'; ctx.lineWidth = 2.1; ctx.lineCap = 'round';
          for (let c = 0; c < 6; c++) {
            const frac = c / 5;
            const bx = side * (1.2 + Math.sin(frac * Math.PI) * 2.5);
            const by = -2 - frac * 19;
            const tipX = -side * (5.2 + Math.sin(frac * Math.PI) * 3.8);
            const tipY = by - 2.2 + (frac - 0.5) * 3;
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.quadraticCurveTo(bx - side * 3.5, by - 3, tipX, tipY);
            ctx.stroke();
            // Pale amber-ivory botanical spine highlight
            ctx.strokeStyle = v.state === 'warn' ? '#fde047' : '#d9f99d'; ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.quadraticCurveTo(bx - side * 3.5, by - 3, tipX, tipY);
            ctx.stroke();
            ctx.strokeStyle = '#365314'; ctx.lineWidth = 2.1;
          }

          ctx.restore();
        }

        // Glistening Amber Nectar Dewdrop on outer rim when open/warning
        if (v.state === 'warn' || v.state === 'open') {
          ctx.fillStyle = v.state === 'warn' ? 'rgba(254, 240, 138, 0.9)' : 'rgba(224, 242, 254, 0.75)';
          ctx.beginPath(); ctx.arc(12, -2, 2.1, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(11.3, -2.7, 0.75, 0, Math.PI * 2); ctx.fill();
        }

        ctx.restore();
        ctx.restore();
      }
    }

    // 10. Ethereal Giant Actias Luna Moth (kept for any custom stage compatibility)
    if (level.luna_moths) {
      for (const m of level.luna_moths) {
        const mx = m.x - camX, my = m.y - camY;
        if (mx < -100 || mx > cullW + 100) continue;
        const flap = 0.62 + Math.sin(time * 12 + m.baseX) * 0.38;
        ctx.save();
        ctx.translate(mx + m.w / 2, my + m.h / 2);
        for (const s of [-1, 1]) {
          ctx.save();
          ctx.scale(s * flap, 1);
          const wG = ctx.createLinearGradient(0, -18, 30, 20);
          wG.addColorStop(0, '#ecfdf5'); wG.addColorStop(0.5, '#6ee7b7'); wG.addColorStop(1, '#34d399');
          ctx.fillStyle = wG; ctx.strokeStyle = '#064e3b'; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(0, -5); ctx.bezierCurveTo(14, -26, 34, -22, 32, -3); ctx.quadraticCurveTo(20, 8, 0, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        ctx.fillStyle = '#fffbeb'; ctx.beginPath(); ctx.ellipse(0, 1, 5, 12, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 10b. Ultra-Detailed Stinging Greenhouse Bee (Iridescent Veined Wings, Fuzzy Thorax, Curved 3D Tergite Stripes, Pollen Baskets & Sharp Stinger!)
    if (level.bees) {
      for (const bee of level.bees) {
        const bx = bee.x - camX, by = bee.y - camY;
        if (bx < -100 || bx > cullW + 100) continue;
        const wingBeat = Math.sin(time * 58 + (bee.phase || 0) * 7);
        const wingAng = -0.52 + wingBeat * 0.42;
        const sting = bee.stingReady || 0;

        ctx.save();
        ctx.translate(bx + bee.w / 2, by + bee.h / 2);
        ctx.scale((bee.facing || 1) * 1.15, 1.15);
        ctx.rotate((bee.pitch || 0) + sting * 0.16);

        // Soft warm sunlit pollen-dust glow halo around buzzing bee
        const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, 32);
        glow.addColorStop(0, sting > 0.35 ? 'rgba(251, 191, 36, 0.34)' : 'rgba(254, 240, 138, 0.22)');
        glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2); ctx.fill();

        // Tiny drifting golden pollen motes behind wings
        ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
        for (let d = 0; d < 3; d++) {
          const dx = -22 - ((time * 38 + d * 11) % 18);
          const dy = Math.sin(time * 9 + d * 2.1) * 5;
          ctx.beginPath(); ctx.arc(dx, dy, 1.3, 0, Math.PI * 2); ctx.fill();
        }

        // Far Translucent Iridescent Hindwing & Forewing (high-frequency blur fan + veined wing)
        ctx.save();
        ctx.translate(2, -7);
        ctx.rotate(wingAng * 0.85 - 0.18);
        ctx.fillStyle = 'rgba(224, 242, 254, 0.34)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)'; ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.bezierCurveTo(-8, -22, -26, -22, -24, -7); ctx.quadraticCurveTo(-15, 2, 0, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();

        // 6 Articulated Chitin Insect Legs + Bright Golden Pollen Baskets (Corbiculae) on Hind Legs!
        ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.65; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const legBob = Math.sin(time * 18 + (bee.phase || 0)) * 1.4;
        // Front leg
        ctx.beginPath(); ctx.moveTo(9, 6); ctx.lineTo(13, 12); ctx.lineTo(17, 13 + legBob * 0.4); ctx.stroke();
        // Mid leg
        ctx.beginPath(); ctx.moveTo(2, 8); ctx.lineTo(1, 14); ctx.lineTo(5, 17 - legBob * 0.5); ctx.stroke();
        // Hind leg (angled back with golden pollen saddle!)
        ctx.beginPath(); ctx.moveTo(-4, 7); ctx.lineTo(-9, 14); ctx.lineTo(-15, 17 + legBob * 0.6); ctx.stroke();
        ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#a16207'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.ellipse(-9.5, 13.5, 3.6, 2.5, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef9c3'; ctx.beginPath(); ctx.arc(-10.2, 12.8, 1, 0, Math.PI * 2); ctx.fill();

        // Sharp Metallic Barbed Stinger protruding from curved abdomen tip!
        const stingLen = 7.5 + sting * 5.5;
        ctx.save();
        ctx.translate(-19, 3 + sting * 3.5);
        ctx.rotate(-0.22 - sting * 0.36);
        ctx.fillStyle = '#090d16'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(2, -2.2);
        ctx.lineTo(-stingLen, 0.8);
        ctx.lineTo(2, 2.4);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Metallic sheen + amber venom glint at stinger needle tip!
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(0, -0.8); ctx.lineTo(-stingLen + 1, 0.5); ctx.stroke();
        if (sting > 0.25) {
          ctx.fillStyle = `rgba(251, 113, 133, ${0.55 + Math.sin(time * 24) * 0.35})`;
          ctx.beginPath(); ctx.arc(-stingLen, 0.8, 3.4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath(); ctx.arc(-stingLen, 0.8, 1.3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        // Sculpted Curved 3D Striped Abdomen (clipped with curved anatomical black tergite bands!)
        ctx.save();
        ctx.translate(-10, 1 + sting * 1.5);
        ctx.rotate(-0.14 - sting * 0.18);
        ctx.beginPath();
        ctx.moveTo(10, -2);
        ctx.bezierCurveTo(6, -11, -11, -10, -14, 1);
        ctx.bezierCurveTo(-11, 10, 5, 10, 10, 2);
        ctx.closePath();

        // Honey-gold radial 3D shading
        const abdG = ctx.createLinearGradient(0, -10, 0, 10);
        abdG.addColorStop(0, '#fef08a');
        abdG.addColorStop(0.35, '#fbbf24');
        abdG.addColorStop(0.75, '#d97706');
        abdG.addColorStop(1, '#78350f');
        ctx.fillStyle = abdG; ctx.fill();

        // Clip inside abdomen silhouette to draw 3D wrapping obsidian-black tergite bands
        ctx.save();
        ctx.clip();
        ctx.fillStyle = '#0f172a';
        for (const [sx, sw] of [[3.5, 3.4], [-2.5, 3.8], [-8.5, 3.6], [-13.5, 4.2]]) {
          ctx.beginPath();
          ctx.ellipse(sx, 0.5, sw * 0.65, 11.5, 0.12, 0, Math.PI * 2);
          ctx.fill();
        }
        // Glossy wet-chitin dorsal specular highlight across stripes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.beginPath(); ctx.ellipse(-1, -5.2, 8.5, 2.2, -0.08, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();

        // Plump Fuzzy Golden-Amber Thorax with Fine Velvety Fur-Tuft Strokes!
        const thorG = ctx.createRadialGradient(4, -3, 1.5, 4, 0, 11);
        thorG.addColorStop(0, '#fef08a'); thorG.addColorStop(0.5, '#f59e0b'); thorG.addColorStop(0.88, '#92400e'); thorG.addColorStop(1, '#451a03');
        ctx.fillStyle = thorG; ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(4.5, -0.5, 9.2, 8.6, 0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Dark dorsal collar band & fine velvety golden fur strokes
        ctx.fillStyle = 'rgba(28, 25, 23, 0.72)';
        ctx.beginPath(); ctx.ellipse(4.5, -4, 4.2, 3.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.78)'; ctx.lineWidth = 1;
        for (let a = -2.4; a <= 2.4; a += 0.48) {
          const fx = 4.5 + Math.cos(a) * 8.2;
          const fy = -0.5 + Math.sin(a) * 7.6;
          ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + Math.cos(a) * 2.2, fy + Math.sin(a) * 2.1); ctx.stroke();
        }

        // Sculpted Glossy Dark-Chitin Bee Head, Faceted Compound Eye, Mandibles & Jointed Elbowed Antennae!
        const headG = ctx.createRadialGradient(14.5, -2.5, 1, 14, 0, 7.5);
        headG.addColorStop(0, '#44403c'); headG.addColorStop(0.55, '#1c1917'); headG.addColorStop(1, '#090d16');
        ctx.fillStyle = headG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.ellipse(14.2, 0.2, 6.2, 7.1, 0.14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Large glossy oval faceted compound eye with rich deep-amber sheen & crisp catchlight
        const eyeG = ctx.createLinearGradient(13, -5, 19, 3);
        eyeG.addColorStop(0, '#475569'); eyeG.addColorStop(0.4, '#0f172a'); eyeG.addColorStop(1, '#020617');
        ctx.fillStyle = eyeG; ctx.strokeStyle = '#334155'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.ellipse(15.8, -0.8, 3.3, 5.1, 0.16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(16.6, -2.8, 1.1, 1.9, 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
        ctx.beginPath(); ctx.arc(15.2, 1.5, 0.75, 0, Math.PI * 2); ctx.fill();
        // Tiny dark curved mandibles at mouth
        ctx.strokeStyle = '#292524'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(16.8, 5.8); ctx.quadraticCurveTo(19.5, 7.8, 18.2, 9.5); ctx.stroke();
        // Jointed Elbowed Insect Antennae (scape -> elbow -> curved flagellum)
        const antTwitch = Math.sin(time * 16 + (bee.phase || 0)) * 1.4;
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(16.5, -5.2); ctx.lineTo(20.5, -10.5 + antTwitch * 0.4); ctx.quadraticCurveTo(25, -11.5 + antTwitch, 27.5, -8.5 + antTwitch);
        ctx.moveTo(14.5, -5.8); ctx.lineTo(17.5, -12 - antTwitch * 0.4); ctx.quadraticCurveTo(22, -13.5 - antTwitch, 24.5, -11 - antTwitch);
        ctx.stroke();

        // Near Translucent Iridescent Forewing with Delicate Chitin Wing-Cell Veins!
        ctx.save();
        ctx.translate(4, -6.5);
        ctx.rotate(wingAng);
        // Subtle motion-blur ghost behind wing
        ctx.fillStyle = 'rgba(224, 242, 254, 0.16)';
        ctx.beginPath(); ctx.ellipse(-11, -9, 17, 7, 0.42, 0, Math.PI * 2); ctx.fill();
        // Crisp pearlescent translucent forewing
        const wg = ctx.createLinearGradient(0, 0, -25, -18);
        wg.addColorStop(0, 'rgba(254, 249, 195, 0.55)');
        wg.addColorStop(0.5, 'rgba(224, 242, 254, 0.62)');
        wg.addColorStop(1, 'rgba(186, 230, 253, 0.36)');
        ctx.fillStyle = wg; ctx.strokeStyle = 'rgba(100, 116, 139, 0.78)'; ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-5, -20, -28, -23, -29, -8);
        ctx.bezierCurveTo(-26, 2, -10, 4, 0, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Fine insect wing venation cells
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.48)'; ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(-1, -1); ctx.quadraticCurveTo(-13, -12, -26, -10);
        ctx.moveTo(-2, 0); ctx.quadraticCurveTo(-14, -5, -24, -4);
        ctx.moveTo(-11, -8); ctx.lineTo(-14, -15);
        ctx.moveTo(-18, -9); ctx.lineTo(-19, -3);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }
    }

    // 11. Articulated Cybernetic Neon Spider-Bot (3-Segment Servo Legs, 6 Optical Lenses, Plasma Core)
    if (level.cyber_spiders) {
      for (const sp of level.cyber_spiders) {
        const sx = sp.x - camX, sy = sp.y - camY;
        if (sx < -90 || sx > cullW + 90) continue;
        const cx = sx + sp.w / 2, cy = sy + sp.h / 2;
        ctx.save();
        // Glowing Laser Silk Thread with energy pulse
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, cy); ctx.stroke();
        ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, cy); ctx.stroke();

        // 6 Articulated 3-Segment Carbon & Magenta Servo Legs
        for (const side of [-1, 1]) {
          for (let l = -1; l <= 1; l++) {
            const wig = Math.sin(time * 9 + l * 2.1 + side) * 3.5;
            const kx = cx + side * 18, ky = cy + l * 6 - 7 + wig;
            const fx = cx + side * 26, fy = cy + l * 9 + 9;
            ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3.6; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(cx + side * 8, cy + l * 4); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke();
            ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke();
            ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(kx, ky, 2.2, 0, Math.PI * 2); ctx.fill();
          }
        }
        // Armored Obsidian Abdomen & Cephalothorax + Glowing Core + 6 Optical Eyes
        const bodyG = ctx.createRadialGradient(cx - 3, cy - 4, 2, cx, cy, 15);
        bodyG.addColorStop(0, '#334155'); bodyG.addColorStop(0.6, '#0f172a'); bodyG.addColorStop(1, '#020617');
        ctx.fillStyle = bodyG; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.ellipse(cx, cy - 2, 14, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Pulsing neon magenta reactor diamond
        ctx.fillStyle = '#f472b6';
        ctx.beginPath(); ctx.moveTo(cx, cy - 9); ctx.lineTo(cx + 5, cy - 3); ctx.lineTo(cx, cy + 2); ctx.lineTo(cx - 5, cy - 3); ctx.closePath(); ctx.fill();
        // Cluster of 6 glowing eyes
        for (const [ex, ey, r] of [[-6, 4, 1.5], [-2.5, 5.5, 2], [2.5, 5.5, 2], [6, 4, 1.5]]) {
          ctx.fillStyle = '#ff453a'; ctx.beginPath(); ctx.arc(cx + ex, cy + ey, r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(cx + ex - 0.5, cy + ey - 0.5, r * 0.4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
    }

    // 12. Counter-Rotating Plasma Hover-Saw Drone
    if (level.hover_saws) {
      for (const saw of level.hover_saws) {
        const sx = saw.x - camX, sy = saw.y - camY;
        if (sx < -80 || sx > cullW + 80) continue;
        const r = saw.w / 2;
        ctx.save();
        ctx.translate(sx + r, sy + r);
        const halo = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r + 10);
        halo.addColorStop(0, 'rgba(34, 211, 238, 0.35)'); halo.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(0, 0, r + 10, 0, Math.PI * 2); ctx.fill();

        // Spinning Swept Titanium & Cyan Plasma Saw Teeth
        ctx.save();
        ctx.rotate(time * 15 * saw.facing);
        for (let t = 0; t < 10; t++) {
          ctx.save(); ctx.rotate((t * Math.PI * 2) / 10);
          ctx.fillStyle = '#22d3ee'; ctx.strokeStyle = '#0e7490'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(r - 6, -4.5); ctx.lineTo(r + 6, -1.5); ctx.lineTo(r - 3, 4.5); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        ctx.restore();

        // Armored Titanium Hub & Counter-Rotating Magenta Reactor Ring
        const hubG = ctx.createRadialGradient(-3, -3, 2, 0, 0, r - 3);
        hubG.addColorStop(0, '#475569'); hubG.addColorStop(0.6, '#1e1b4b'); hubG.addColorStop(1, '#090d16');
        ctx.fillStyle = hubG; ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(0, 0, r - 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 13. Photorealistic Woodland European Badger (Layered Grizzled Guard Fur, Sculpted Snout & Whiskers, Curved Digging Claws)
    if (level.badgers) {
      for (const bg of level.badgers) {
        const bx = bg.x - camX, by = bg.y - camY;
        if (bx < -120 || bx > cullW + 120) continue;
        const walk = time * (bg.charging ? 20 : 10.5) + bg.x * 0.08;
        const step = Math.sin(walk) * 5.2;
        const bob = Math.abs(Math.sin(walk)) * 1.6;
        ctx.save();
        ctx.translate(bx + bg.w / 2, by + bg.h);
        ctx.scale(bg.facing, 1);

        // Soft ambient ground shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
        ctx.beginPath(); ctx.ellipse(0, 0, 31, 5.2, 0, 0, Math.PI * 2); ctx.fill();

        // Stubby fluffy ringed silver-and-charcoal tail at rump
        ctx.save();
        ctx.translate(-22, -16 - bob);
        ctx.rotate(-0.28 + Math.sin(time * 5 + bg.x) * 0.1);
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.bezierCurveTo(-10, -11, -24, -10, -27, -2);
        ctx.bezierCurveTo(-24, 6, -9, 5, 0, 3);
        ctx.closePath();
        const tailG = ctx.createLinearGradient(0, -8, -27, 4);
        tailG.addColorStop(0, '#9ca3af'); tailG.addColorStop(0.5, '#d1d5db'); tailG.addColorStop(1, '#111827');
        ctx.fillStyle = tailG; ctx.fill();
        ctx.save();
        ctx.clip();
        ctx.fillStyle = '#111827';
        for (const tx of [-6, -13, -20]) {
          ctx.beginPath(); ctx.ellipse(tx, 0, 2.2, 9, 0.15, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.3; ctx.stroke();
        ctx.restore();

        // Far shaded heavy digging legs
        ctx.fillStyle = '#090d16';
        ctx.beginPath(); ctx.roundRect(-18 - step * 0.7, -13, 9, 12, 3.5); ctx.roundRect(7 + step * 0.7, -13, 9, 12, 3.5); ctx.fill();

        // Muscular Low-Slung Silver-Grizzled Badger Body with 3D Volumetric Fur Coat Shading
        const bG = ctx.createLinearGradient(0, -34 - bob, 0, -6 - bob);
        bG.addColorStop(0, '#e5e7eb');
        bG.addColorStop(0.24, '#9ca3af');
        bG.addColorStop(0.55, '#4b5563');
        bG.addColorStop(0.82, '#1f2937');
        bG.addColorStop(1, '#090d16');
        ctx.fillStyle = bG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-25, -13 - bob);
        ctx.bezierCurveTo(-24, -31 - bob, -7, -34 - bob, 4, -32 - bob);
        ctx.bezierCurveTo(15, -30 - bob, 21, -22 - bob, 20, -13 - bob);
        ctx.bezierCurveTo(14, -6 - bob, -6, -6 - bob, -25, -13 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Dense Layered Grizzled Silver & Charcoal Fur-Tuft Strokes across Back & Haunches!
        ctx.lineCap = 'round';
        for (let fy = 0; fy < 3; fy++) {
          for (let fx = -19; fx <= 10; fx += 6.5) {
            const x = fx + (fy % 2) * 3;
            const y = -27 + fy * 5.2 - bob + Math.abs(x) * 0.08;
            ctx.strokeStyle = fy === 0 ? 'rgba(248, 250, 252, 0.52)' : fy === 1 ? 'rgba(209, 213, 219, 0.36)' : 'rgba(15, 23, 42, 0.42)';
            ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 3, y - 1, x - 6, y + 1.5); ctx.stroke();
          }
        }

        // Near Heavy Muscular Black Legs + 3 Individual Long Curved Ivory Digging Claws per Paw!
        for (const [lx, off] of [[-16, step], [6, -step]]) {
          const legG = ctx.createLinearGradient(lx + off, -15, lx + off + 9, -2);
          legG.addColorStop(0, '#374151'); legG.addColorStop(0.5, '#111827'); legG.addColorStop(1, '#020617');
          ctx.fillStyle = legG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.roundRect(lx + off, -14, 9.5, 13, 4); ctx.fill(); ctx.stroke();
          // 3 curved pale digging claws
          ctx.strokeStyle = '#f3f4f6'; ctx.lineWidth = 1.5;
          for (let cl = 0; cl < 3; cl++) {
            const cy = -4.5 + cl * 1.5;
            ctx.beginPath(); ctx.moveTo(lx + off + 8.5, cy); ctx.quadraticCurveTo(lx + off + 12, cy - 0.5, lx + off + 13.5, cy + 1.6); ctx.stroke();
          }
        }

        // Sculpted Iconic Black-and-White Striped Badger Head + White-Rimmed Ears + Whiskers
        const headG = ctx.createLinearGradient(12, -29 - bob, 32, -11 - bob);
        headG.addColorStop(0, '#ffffff'); headG.addColorStop(0.65, '#e2e8f0'); headG.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = headG; ctx.strokeStyle = '#090d16'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(11, -27 - bob);
        ctx.bezierCurveTo(20, -29 - bob, 29, -23 - bob, 34, -17 - bob);
        ctx.quadraticCurveTo(32, -11 - bob, 25, -10.5 - bob);
        ctx.quadraticCurveTo(15, -10 - bob, 11, -17 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Rounded dark ear with crisp white fur rim & pink inner hint
        ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#090d16'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(14, -27.5 - bob, 4.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(14.2, -27 - bob, 2.7, 0, Math.PI * 2); ctx.fill();

        // Bold sculpted black bandit eye-stripe tapering cleanly to nose
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.moveTo(12, -25.5 - bob); ctx.quadraticCurveTo(22, -23 - bob, 31, -18.5 - bob);
        ctx.lineTo(29.5, -14 - bob); ctx.quadraticCurveTo(19, -15.5 - bob, 11.5, -19.5 - bob);
        ctx.closePath(); ctx.fill();

        // Fierce Glinting Eye (amber-gold, flares crimson when charging!) + Wet Textured Nose + Fine Whiskers
        ctx.fillStyle = bg.charging ? '#ff453a' : '#fbbf24';
        ctx.beginPath(); ctx.ellipse(22, -19 - bob, 2.5, 2.1, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#020617'; ctx.beginPath(); ctx.arc(22.5, -19 - bob, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(21.4, -19.7 - bob, 0.85, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#020617'; ctx.beginPath(); ctx.ellipse(34, -16.8 - bob, 2.8, 2.2, 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.48)'; ctx.beginPath(); ctx.arc(33.4, -17.6 - bob, 0.85, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.72)'; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(29, -15.5 - bob); ctx.lineTo(36, -14.2 - bob);
        ctx.moveTo(29, -14.5 - bob); ctx.lineTo(35, -12.2 - bob);
        ctx.stroke();

        // Subtle steam snort puffs when charging!
        if (bg.charging) {
          ctx.fillStyle = 'rgba(226, 232, 240, 0.55)';
          const puff = (time * 18) % 10;
          ctx.beginPath(); ctx.arc(38 + puff, -15 - puff * 0.4, 2.4 + puff * 0.15, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
    }

    // 14. Majestic Realistic Golden Dawn Eagle (Layered Scalloped Plumage, 6 Slotted Wingtip Primary Feathers, Barred Tail, Razor Talons & Hooked Raptor Beak!)
    if (level.hawks) {
      for (const hk of level.hawks) {
        const hx = hk.x - camX, hy = hk.y - camY;
        if (hx < -140 || hx > cullW + 140) continue;
        const wingCycle = time * 8.2 + hk.minX * 0.05;
        const flap = Math.sin(wingCycle) * 18;
        const bodyBob = -Math.sin(wingCycle) * 2.2;
        ctx.save();
        ctx.translate(hx + hk.w / 2, hy + hk.h / 2 + bodyBob);
        ctx.scale(hk.facing, 1);

        // 1. Far Sweeping Eagle Wing with Individual Slotted Primary Feathers
        ctx.save();
        ctx.translate(2, -4);
        const farG = ctx.createLinearGradient(0, -28 + flap * 0.7, -36, 4);
        farG.addColorStop(0, '#92400e'); farG.addColorStop(0.55, '#5c2408'); farG.addColorStop(1, '#290f02');
        ctx.fillStyle = farG; ctx.strokeStyle = '#1c0a02'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(6, -1);
        ctx.bezierCurveTo(-4, -26 + flap * 0.75, -26, -30 + flap * 0.85, -39, -10 + flap * 0.8);
        // Slotted far wingtip feathers
        ctx.lineTo(-32, -6 + flap * 0.65); ctx.lineTo(-36, -1 + flap * 0.6); ctx.lineTo(-27, 1 + flap * 0.45);
        ctx.quadraticCurveTo(-12, 5, 6, 3);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();

        // 2. Fanned Layered Barred Eagle Tail Feathers (5 overlapping rectrices with dark subterminal band!)
        ctx.save();
        ctx.translate(-17, 1);
        for (let t = -2; t <= 2; t++) {
          ctx.save();
          ctx.rotate(t * 0.14);
          const tailG = ctx.createLinearGradient(0, 0, -24, 0);
          tailG.addColorStop(0, '#92400e'); tailG.addColorStop(0.65, '#b45309'); tailG.addColorStop(0.82, '#290f02'); tailG.addColorStop(1, '#fef3c7');
          ctx.fillStyle = tailG; ctx.strokeStyle = '#290f02'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.ellipse(-12, 0, 12.5, 3.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        ctx.restore();

        // 3. Feathered Muscular Eagle Thighs + Golden Scaled Feet + 4 Razor-Sharp Black Curved Talons!
        ctx.fillStyle = '#78350f'; ctx.strokeStyle = '#290f02'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(-3, 9, 6.5, 4.5, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-4, 11); ctx.lineTo(-9, 16); ctx.lineTo(-2, 17); ctx.moveTo(-9, 16); ctx.lineTo(-14, 18); ctx.stroke();
        ctx.strokeStyle = '#090d16'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-2, 17); ctx.quadraticCurveTo(2, 18, 1, 21);
        ctx.moveTo(-14, 18); ctx.quadraticCurveTo(-17, 19, -15, 22);
        ctx.stroke();

        // 4. Aerodynamic Sculpted Golden-Eagle Torso with Layered Breast Feather Scallops!
        const bodyG = ctx.createLinearGradient(0, -11, 0, 11);
        bodyG.addColorStop(0, '#b45309'); bodyG.addColorStop(0.42, '#78350f'); bodyG.addColorStop(0.75, '#92400e'); bodyG.addColorStop(1, '#fde68a');
        ctx.fillStyle = bodyG; ctx.strokeStyle = '#290f02'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.bezierCurveTo(-14, -12, 8, -13, 21, -4);
        ctx.bezierCurveTo(18, 9, 2, 12, -16, 6);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Delicate breast plumage scallops
        ctx.strokeStyle = 'rgba(254, 243, 199, 0.36)'; ctx.lineWidth = 1;
        for (const [fx, fy] of [[4, 2], [9, 3], [14, 1], [1, 5], [7, 6]]) {
          ctx.beginPath(); ctx.arc(fx, fy, 3.2, 0.2, Math.PI - 0.2); ctx.stroke();
        }

        // 5. Noble Sculpted Golden Eagle Head (Golden Nape Hackles, Fierce Overhanging Brow, Amber Cere & Razor Hooked Beak!)
        const headG = ctx.createRadialGradient(21, -7, 2, 21, -5, 11);
        headG.addColorStop(0, '#fcd34d'); headG.addColorStop(0.55, '#d97706'); headG.addColorStop(1, '#78350f');
        ctx.fillStyle = headG; ctx.strokeStyle = '#290f02'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(12, -8);
        ctx.bezierCurveTo(16, -15, 27, -14, 30, -7);
        ctx.quadraticCurveTo(28, 1, 17, 1);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Golden nape hackle feathers
        ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(15, -10); ctx.lineTo(11, -7); ctx.moveTo(17, -11); ctx.lineTo(13, -8.5); ctx.stroke();
        // Yellow cere & razor-sharp curved grey-gold raptor beak
        ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(27.5, -8.8, 4.5, 5, 1.5); ctx.fill(); ctx.stroke();
        const beakG = ctx.createLinearGradient(30, -9, 40, 1);
        beakG.addColorStop(0, '#fde047'); beakG.addColorStop(0.55, '#ca8a04'); beakG.addColorStop(1, '#1e293b');
        ctx.fillStyle = beakG; ctx.strokeStyle = '#1c0a02'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(31, -8.8);
        ctx.bezierCurveTo(38, -8.5, 42, -3.5, 39.5, 2.2); // fierce downward hook!
        ctx.quadraticCurveTo(36, -2.5, 31, -2.5);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Intense Golden Raptor Eye + Pronounced Fierce Supraorbital Brow Ridge!
        ctx.fillStyle = '#fef08a'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.arc(24.2, -6.8, 2.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(24.7, -6.8, 1.35, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(23.7, -7.6, 0.75, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#290f02'; ctx.lineWidth = 2.1; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(20, -9.8); ctx.lineTo(28, -8.4); ctx.stroke();

        // 6. Near Wide Cambered Golden Eagle Wing with 6 Individually Articulated Slotted Primary Feathers & Covert Rows!
        ctx.save();
        ctx.translate(6, -2);
        const wG = ctx.createLinearGradient(0, -34 - flap, -20, 10);
        wG.addColorStop(0, '#f59e0b'); wG.addColorStop(0.38, '#b45309'); wG.addColorStop(0.75, '#78350f'); wG.addColorStop(1, '#290f02');
        ctx.fillStyle = wG; ctx.strokeStyle = '#1c0a02'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(6, -2);
        ctx.bezierCurveTo(-4, -30 - flap, -22, -36 - flap, -43, -15 - flap);
        // 5 distinct slotted primary flight feathers fanning cleanly at wingtip!
        ctx.lineTo(-34, -11 - flap * 0.85);
        ctx.lineTo(-42, -6 - flap * 0.8);
        ctx.lineTo(-32, -3 - flap * 0.65);
        ctx.lineTo(-38, 2 - flap * 0.55);
        ctx.lineTo(-27, 3 - flap * 0.4);
        ctx.lineTo(-31, 8 - flap * 0.3);
        ctx.quadraticCurveTo(-12, 10, 6, 4);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Sunlit golden upper wing leading-edge highlight + layered covert feather rows!
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.52)'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(4, -3); ctx.quadraticCurveTo(-10, -25 - flap * 0.85, -34, -18 - flap * 0.92); ctx.stroke();
        ctx.strokeStyle = 'rgba(41, 15, 2, 0.52)'; ctx.lineWidth = 1.1;
        for (let r = 0; r < 4; r++) {
          const rx = -8 - r * 7;
          const ry = -6 - r * 3 - flap * (0.25 + r * 0.14);
          ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 9, ry + 7); ctx.stroke();
        }
        ctx.restore();

        ctx.restore();
      }
    }

    // 15. Flashing Highway Bridge Maintenance Rover (Stage 10 — realistic engineering details!)
    if (level.bridge_rovers) {
      for (const rv of level.bridge_rovers) {
        const rx = rv.x - camX, ry = rv.y - camY;
        if (rx < -120 || rx > cullW + 120) continue;
        const wheelRot = time * 11;
        ctx.save();
        ctx.translate(rx + rv.w / 2, ry + rv.h);
        ctx.scale(rv.facing, 1);

        // Warm LED Headlight Cone on bridge fog
        const beam = ctx.createLinearGradient(24, -18, 125, -4);
        beam.addColorStop(0, 'rgba(254, 240, 138, 0.36)'); beam.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = beam;
        ctx.beginPath(); ctx.moveTo(24, -22); ctx.lineTo(125, -34); ctx.lineTo(125, 0); ctx.lineTo(24, -10); ctx.closePath(); ctx.fill();

        // Ground shadow
        ctx.fillStyle = 'rgba(0,0,0,0.48)';
        ctx.beginPath(); ctx.ellipse(0, 0, 30, 5, 0, 0, Math.PI * 2); ctx.fill();

        // Front Spinning Road-Sweeper Bristle Roller
        ctx.save();
        ctx.translate(25, -8); ctx.rotate(time * 16);
        ctx.fillStyle = '#475569'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        for (let b = 0; b < 6; b++) {
          const a = (b * Math.PI) / 3;
          ctx.beginPath(); ctx.moveTo(Math.cos(a) * 3, Math.sin(a) * 3); ctx.lineTo(Math.cos(a) * 8, Math.sin(a) * 8); ctx.stroke();
        }
        ctx.restore();

        // Riveted Industrial Yellow Chassis with Black Hazard Stripes
        const bodyG = ctx.createLinearGradient(0, -34, 0, -10);
        bodyG.addColorStop(0, '#facc15'); bodyG.addColorStop(0.55, '#eab308'); bodyG.addColorStop(1, '#a16207');
        ctx.fillStyle = bodyG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.roundRect(-24, -32, 48, 22, [8, 10, 3, 3]); ctx.fill(); ctx.stroke();
        // Slanted hazard warning stripes on side panel
        ctx.fillStyle = '#0f172a';
        for (let sx = -18; sx <= 10; sx += 11) {
          ctx.beginPath(); ctx.moveTo(sx, -11); ctx.lineTo(sx + 5, -11); ctx.lineTo(sx + 9, -18); ctx.lineTo(sx + 4, -18); ctx.closePath(); ctx.fill();
        }
        // Tinted Windshield Cab + Bright LED Headlight
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(4, -29, 16, 10, 3); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(23, -18, 3.2, 0, Math.PI * 2); ctx.fill();

        // Rotating Flashing Amber Safety Beacon on Roof
        const flash = Math.sin(time * 12 + rv.minX) > -0.1;
        if (flash) {
          ctx.fillStyle = 'rgba(251, 146, 60, 0.38)'; ctx.beginPath(); ctx.arc(-4, -38, 14, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#334155'; ctx.fillRect(-9, -35, 10, 3);
        ctx.fillStyle = flash ? '#fb923c' : '#9a3412'; ctx.strokeStyle = '#431407'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(-4, -38, 5, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Heavy Rubber Wheels with Steel Hubcaps
        for (const wx of [-14, 10]) {
          ctx.save(); ctx.translate(wx, -8); ctx.rotate(wheelRot);
          ctx.fillStyle = '#111827'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.arc(0, 0, 3.8, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(-3.5, 0); ctx.lineTo(3.5, 0); ctx.moveTo(0, -3.5); ctx.lineTo(0, 3.5); ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
      }
    }

    // 16. Sleek Athletic Black-and-Tan Doberman Guard Dog (Stage 15 — Full Dog Vision Cone, Alert Badge, Authentic Canine Anatomy, Glossy Coat, Rust-Tan Markings & Studded Collar!)
    if (level.dobermans) {
      for (const db of level.dobermans) {
        const dx = db.x - camX, dy = db.y - camY;
        if (dx < -160 || dx > cullW + 160) continue;

        // Visible Dog Detection Sight Cone (clearly visible in both night vision and Stage 15's warm dawn light!)
        if (!db.repelTimer || db.repelTimer <= 0) {
          ctx.save();
          const dir = db.facing || 1;
          const eyeX = dx + db.w / 2 + dir * 24;
          const eyeY = dy + 11;
          const coneLen = 220;
          const coneG = ctx.createLinearGradient(eyeX, eyeY, eyeX + dir * coneLen, eyeY);
          if (db.alert) {
            coneG.addColorStop(0, 'rgba(255, 45, 70, 0.48)');
            coneG.addColorStop(0.55, 'rgba(255, 55, 80, 0.22)');
            coneG.addColorStop(1, 'rgba(255, 55, 80, 0)');
          } else if (nv) {
            coneG.addColorStop(0, 'rgba(255, 215, 110, 0.38)');
            coneG.addColorStop(0.6, 'rgba(255, 215, 110, 0.15)');
            coneG.addColorStop(1, 'rgba(255, 215, 110, 0)');
          } else {
            coneG.addColorStop(0, 'rgba(249, 115, 22, 0.36)');
            coneG.addColorStop(0.55, 'rgba(239, 68, 68, 0.16)');
            coneG.addColorStop(1, 'rgba(239, 68, 68, 0)');
          }
          ctx.fillStyle = coneG;
          ctx.beginPath();
          ctx.moveTo(eyeX, eyeY);
          ctx.lineTo(eyeX + dir * coneLen, eyeY - 42);
          ctx.lineTo(eyeX + dir * coneLen, eyeY + 34);
          ctx.closePath();
          ctx.fill();
          // Crisp sight-cone boundary rays so the player can clearly gauge the Doberman's vision range
          ctx.strokeStyle = db.alert ? 'rgba(255, 55, 80, 0.55)' : 'rgba(249, 115, 22, 0.34)';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(eyeX, eyeY);
          ctx.lineTo(eyeX + dir * (coneLen * 0.85), eyeY - 35);
          ctx.moveTo(eyeX, eyeY);
          ctx.lineTo(eyeX + dir * (coneLen * 0.85), eyeY + 29);
          ctx.stroke();
          ctx.restore();
        }

        const speedMul = db.alert || db.repelTimer > 0 ? 18 : 11;
        const gait = time * speedMul + db.x * 0.08;
        const strideA = Math.sin(gait) * 7.5;
        const strideB = -strideA;
        const bob = Math.abs(Math.sin(gait)) * 2;
        ctx.save();
        ctx.translate(dx + db.w / 2, dy + db.h);
        ctx.scale(db.facing || 1, 1);

        // Ground contact shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath(); ctx.ellipse(0, 0, 31, 5, 0, 0, Math.PI * 2); ctx.fill();

        // Far Shaded Athletic Legs (Black upper thighs + Warm Rust-Tan lower legs & paws)
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        // Far hind leg
        ctx.strokeStyle = '#090d16'; ctx.lineWidth = 6.2;
        ctx.beginPath(); ctx.moveTo(-17, -22 - bob); ctx.lineTo(-22 + strideB * 0.45, -11); ctx.stroke();
        ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 4.6;
        ctx.beginPath(); ctx.moveTo(-22 + strideB * 0.45, -11); ctx.lineTo(-18 + strideB * 0.85, -2); ctx.stroke();
        // Far front leg
        ctx.strokeStyle = '#090d16'; ctx.lineWidth = 5.6;
        ctx.beginPath(); ctx.moveTo(11, -21 - bob); ctx.lineTo(12 + strideA * 0.45, -11); ctx.stroke();
        ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 4.4;
        ctx.beginPath(); ctx.moveTo(12 + strideA * 0.45, -11); ctx.lineTo(15 + strideA * 0.85, -2); ctx.stroke();

        // Short Classic Docked Upright Doberman Tail
        const tailWag = Math.sin(time * (db.alert ? 18 : 7)) * 0.14;
        ctx.save();
        ctx.translate(-22, -29 - bob); ctx.rotate(-0.45 + tailWag);
        ctx.strokeStyle = '#020617'; ctx.lineWidth = 5.5;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-7, -9); ctx.stroke();
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3.2;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-7, -9); ctx.stroke();
        ctx.restore();

        // Sleek Muscular Deep-Chested Black Doberman Torso + Tucked Athletic Waist!
        const coatG = ctx.createLinearGradient(0, -37 - bob, 0, -14 - bob);
        coatG.addColorStop(0, '#334155');
        coatG.addColorStop(0.28, '#111827');
        coatG.addColorStop(0.75, '#090d16');
        coatG.addColorStop(1, '#020617');
        ctx.fillStyle = coatG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-22, -28 - bob); // rump
        ctx.bezierCurveTo(-10, -34 - bob, 6, -36 - bob, 18, -32 - bob); // straight athletic back & withers
        ctx.bezierCurveTo(23, -24 - bob, 20, -14 - bob, 8, -14 - bob); // deep muscular chest
        ctx.bezierCurveTo(-2, -14 - bob, -10, -21 - bob, -18, -20 - bob); // iconic tucked Doberman waist!
        ctx.quadraticCurveTo(-24, -22 - bob, -22, -28 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Glossy blue-slate specular fur sheen along muscular back & shoulder
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(-16, -30 - bob); ctx.quadraticCurveTo(0, -33 - bob, 14, -30 - bob); ctx.stroke();

        // Authentic Warm Rust-Tan Doberman Chest Patch
        const tanG = ctx.createLinearGradient(12, -28 - bob, 22, -16 - bob);
        tanG.addColorStop(0, '#ea580c'); tanG.addColorStop(1, '#9a3412');
        ctx.fillStyle = tanG;
        ctx.beginPath();
        ctx.ellipse(16.5, -22 - bob, 5.2, 6.8, 0.22, 0, Math.PI * 2);
        ctx.fill();

        // Near Articulated Muscular Legs (Glossy Black Upper -> Crisp Rust-Tan Stockings & Paws!)
        // Near hind leg (angulated athletic thigh + hock + tan paw)
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-21, -26 - bob); ctx.quadraticCurveTo(-11, -28 - bob, -11, -18 - bob);
        ctx.lineTo(-18 + strideA * 0.45, -11); ctx.lineTo(-23 + strideA * 0.45, -13);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#c2410c'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(-19 + strideA * 0.45, -12); ctx.lineTo(-15 + strideA, -2); ctx.stroke();
        ctx.fillStyle = '#ea580c'; ctx.strokeStyle = '#431407'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(-13 + strideA, -1.8, 4.2, 2.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Near front leg (straight powerful foreleg -> rust-tan lower leg & paw)
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 6.2;
        ctx.beginPath(); ctx.moveTo(14, -24 - bob); ctx.lineTo(14 + strideB * 0.45, -12); ctx.stroke();
        ctx.strokeStyle = '#c2410c'; ctx.lineWidth = 4.8;
        ctx.beginPath(); ctx.moveTo(14 + strideB * 0.45, -12); ctx.lineTo(17 + strideB, -2); ctx.stroke();
        ctx.fillStyle = '#ea580c'; ctx.strokeStyle = '#431407'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(19 + strideB, -1.8, 4.2, 2.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Proud Arched Muscular Neck + Crimson Leather & Brass-Studded Guard Collar with Gold Tag!
        ctx.fillStyle = coatG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(10, -32 - bob); ctx.quadraticCurveTo(15, -42 - bob, 20, -45 - bob);
        ctx.lineTo(27, -38 - bob); ctx.quadraticCurveTo(24, -28 - bob, 18, -24 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Rust-tan throat mark
        ctx.fillStyle = '#c2410c';
        ctx.beginPath(); ctx.ellipse(22, -31 - bob, 3.6, 4.8, 0.25, 0, Math.PI * 2); ctx.fill();
        // Crimson Leather Guard Collar + Gold Studs + Dangling Medallion Tag
        ctx.strokeStyle = '#b91c1c'; ctx.lineWidth = 4.6;
        ctx.beginPath(); ctx.moveTo(13, -34 - bob); ctx.lineTo(24.5, -29.5 - bob); ctx.stroke();
        ctx.fillStyle = '#fde047';
        for (const [sx, sy] of [[15, -33.2], [19, -31.6], [23, -30]]) {
          ctx.beginPath(); ctx.arc(sx, sy - bob, 1.3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#92400e'; ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.arc(24.5, -26 - bob, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Noble Sculpted Wedge-Shaped Doberman Head, Pointed Upright Ears & Tan Muzzle/Eyebrow Pips!
        const headBob = bob + (db.alert ? -1.5 : 0);
        // Upright sharp pointed cropped Doberman ears (far ear + near ear)
        ctx.fillStyle = '#090d16'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(18, -44 - headBob); ctx.lineTo(15, -56 - headBob); ctx.lineTo(22, -46 - headBob); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#111827';
        ctx.beginPath(); ctx.moveTo(21, -44 - headBob); ctx.lineTo(20, -57 - headBob); ctx.lineTo(26, -45 - headBob); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#9a3412';
        ctx.beginPath(); ctx.moveTo(21.5, -45 - headBob); ctx.lineTo(21, -53 - headBob); ctx.lineTo(24.2, -45.5 - headBob); ctx.closePath(); ctx.fill();

        // Tapered sleek wedge skull & long Doberman snout
        ctx.fillStyle = '#111827'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(16, -43 - headBob);
        ctx.quadraticCurveTo(22, -47 - headBob, 29, -43 - headBob);
        ctx.lineTo(41, -39 - headBob); // sleek straight bridge of snout
        ctx.lineTo(40, -34.5 - headBob); // muzzle end
        ctx.lineTo(28, -33.5 - headBob); // lower jaw
        ctx.quadraticCurveTo(18, -33 - headBob, 16, -43 - headBob);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Warm Rust-Tan Doberman Muzzle, Cheek Dot & Iconic Tan Eyebrow Pip!
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(27, -37.5 - headBob); ctx.lineTo(40, -37 - headBob); ctx.lineTo(39, -34.2 - headBob); ctx.lineTo(27, -34 - headBob);
        ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.arc(24.5, -36 - headBob, 2.4, 0, Math.PI * 2); ctx.fill(); // tan cheek spot
        ctx.fillStyle = '#f97316';
        ctx.beginPath(); ctx.ellipse(27.5, -43.2 - headBob, 2.3, 1.3, -0.2, 0, Math.PI * 2); ctx.fill(); // iconic tan eyebrow pip!

        // Alert parted jaw with tiny glinting white canine fang when spotting Mashmasha
        if (db.alert) {
          ctx.fillStyle = '#7f1d1d';
          ctx.beginPath(); ctx.moveTo(31, -34.5 - headBob); ctx.lineTo(38, -35 - headBob); ctx.lineTo(36, -32.2 - headBob); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.moveTo(35.5, -35 - headBob); ctx.lineTo(36.8, -32.5 - headBob); ctx.lineTo(37.8, -35 - headBob); ctx.closePath(); ctx.fill();
        }

        // Intense Amber Eye with Crisp Catchlight & Glossy Black Nose
        ctx.fillStyle = db.alert ? '#fbbf24' : '#d97706';
        ctx.beginPath(); ctx.ellipse(28.5, -40.2 - headBob, 2.5, 2.1, -0.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#020617';
        ctx.beginPath(); ctx.arc(29, -40.2 - headBob, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(28, -41 - headBob, 0.75, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#020617';
        ctx.beginPath(); ctx.ellipse(41, -38.2 - headBob, 2.6, 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath(); ctx.arc(40.4, -39 - headBob, 0.8, 0, Math.PI * 2); ctx.fill();

        ctx.restore();
      }
    }
  }

  return {
    updateAll,
    drawAll,
    applyMeowRepel,
  };
})();
