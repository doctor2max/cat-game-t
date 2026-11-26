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
    repelPatrol(level.penguins, 2.5);
    repelPatrol(level.seals, 2.4);
    repelPatrol(level.unicycle_monkeys, 2.5);
    repelPatrol(level.circus_clowns, 2.5);
    repelPatrol(level.scorpions, 2.2);
    repelPatrol(level.sand_vipers, 2.2);
    repelPatrol(level.tanuki_rascals, 2.3);
    repelPatrol(level.shiba_guards, 2.4);
    repelPatrol(level.rail_inspectors, 2.4);
    repelPatrol(level.carnival_jesters, 2.4);
    repelPatrol(level.canal_crabs, 2.2);
    repelPatrol(level.paris_poodles, 2.4);
    repelPatrol(level.paris_bakers, 2.4);
    repelPatrol(level.morocco_monkeys, 2.4);
    repelPatrol(level.morocco_merchants, 2.4);
    repelPatrol(level.maya_jaguars, 2.4);
    repelPatrol(level.maya_warriors, 2.4);
    repelPatrol(level.greece_goats, 2.4);
    repelPatrol(level.greece_hoplites, 2.4);
    repelPatrol(level.battir_porcupines, 2.4);
    repelPatrol(level.battir_boars, 2.5);
    repelPatrol(level.battir_scorpions, 2.3);
    if (level.mail_owls) {
      for (const ow of level.mail_owls) {
        const ox = ow.x + ow.w * 0.5, oy = ow.y + ow.h * 0.5;
        if (Math.hypot(mx - ox, my - oy) < r) { ow.swooping = false; ow.y = ow.baseY - 40; pop(ox, oy - 12, '✉️'); }
      }
    }
    if (level.coal_sparks) {
      for (const cs of level.coal_sparks) {
        const sx = cs.x !== undefined ? cs.x : cs.startX;
        if (!cs.waiting && Math.hypot(mx - sx, my - cs.y) < r) {
          cs.waiting = true; cs.waitTimer = 2.6;
          if (Particles && Particles.spawnDust) Particles.spawnDust(sx, cs.y, 10, '#fb923c');
          pop(sx, cs.y - 16, '💨');
        }
      }
    }
    if (level.samurai_crows) {
      for (const cr of level.samurai_crows) {
        const cx = cr.x + cr.w * 0.5, cy = cr.y + cr.h * 0.5;
        if (Math.hypot(mx - cx, my - cy) < r) { cr.swooping = false; cr.y = cr.baseY - 40; pop(cx, cy - 12, '💨'); }
      }
    }
    if (level.daruma_rollers) {
      for (const dr of level.daruma_rollers) {
        const dx = dr.x !== undefined ? dr.x : dr.startX;
        if (!dr.waiting && Math.hypot(mx - dx, my - dr.y) < r) {
          dr.waiting = true; dr.waitTimer = 2.6;
          if (Particles && Particles.spawnDust) Particles.spawnDust(dx, dr.y, 10, '#fca5a5');
          pop(dx, dr.y - 16, '🎎');
        }
      }
    }
    if (level.sleeping_lions) {
      for (const ln of level.sleeping_lions) {
        const lx = ln.x + ln.w * 0.5;
        const ly = ln.y + ln.h * 0.5;
        if (Math.hypot(mx - lx, my - ly) < r) {
          const hx = ln.homeX !== undefined ? ln.homeX : ln.x;
          ln.awake = false;
          ln.returning = Math.abs(hx - ln.x) > 3;
          ln.sleepLock = 3.2;
          pop(lx, ln.y - 16, '💤');
        }
      }
    }

    // Falling Icicles: shatter nearby shaking/falling icicles harmlessly in mid-air!
    if (level.falling_icicles) {
      for (const ic of level.falling_icicles) {
        const iy = ic.curY !== undefined ? ic.curY : ic.y;
        if (ic.state !== 'respawn' && Math.hypot(mx - ic.x, my - (iy + ic.len * 0.5)) < r) {
          ic.state = 'respawn';
          ic.timer = 3.2;
          if (Particles && Particles.spawnDust) Particles.spawnDust(ic.x, iy + ic.len * 0.5, 9, '#bae6fd');
          pop(ic.x, iy, '❄️');
        }
      }
    }

    // Rolling Snowballs: blast snowball into snow powder & reset temporarily!
    if (level.snowballs) {
      for (const sb of level.snowballs) {
        const sx = sb.x !== undefined ? sb.x : sb.startX;
        if (!sb.waiting && Math.hypot(mx - sx, my - sb.y) < r) {
          sb.waiting = true;
          sb.waitTimer = 2.8;
          if (Particles && Particles.spawnDust) Particles.spawnDust(sx, sb.y, 12, '#f0f9ff');
          pop(sx, sb.y - 18, '❄️');
        }
      }
    }

    // Flying enemies: sweep upward & away out of Mashmasha's path!
    for (const list of [
      level.pelicans,
      level.hawks,
      level.venice_gulls,
      level.paris_pigeons,
      level.morocco_storks,
      level.maya_quetzals,
      level.greece_owls,
      level.battir_hoopoes,
    ]) {
      if (!list) continue;
      for (const f of list) {
        const fx = f.x + (f.w || 56) / 2;
        const fy = f.y + (f.h || 32) / 2;
        if (Math.hypot(mx - fx, my - fy) < r) {
          const dir = fx >= mx ? 1 : -1;
          f.repelTimer = 2.4;
          f.repelDir = dir;
          f.facing = dir;
          if (f.vx !== undefined) f.vx = dir * Math.abs(f.vx);
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

    // 17. Arctic Emperor Penguins (Stage 16 — Waddle patrol + Belly-Slide Dash when Mashmasha is ahead!)
    if (level.penguins) {
      for (const pg of level.penguins) {
        if (stepRepelled(pg, 215)) { pg.sliding = false; continue; }
        const pgCx = pg.x + pg.w / 2;
        const pgCy = pg.y + pg.h / 2;
        const ahead = (catCx - pgCx) * pg.facing;
        const seesCat = ahead > 0 && ahead < (c.crouching ? 120 : 215) && Math.abs(catCy - pgCy) < 58;
        pg.sliding = seesCat;
        const spd = Math.abs(pg.vx) * (seesCat ? 1.72 : 1);
        pg.x += pg.facing * spd * dt;
        if (pg.x <= pg.minX) { pg.x = pg.minX; pg.facing = 1; }
        else if (pg.x >= pg.maxX) { pg.x = pg.maxX; pg.facing = -1; }
        const hitH = pg.sliding ? pg.h * 0.65 : pg.h;
        const hitY = pg.sliding ? pg.y + pg.h - hitH : pg.y;
        if (hitBox(pg.x, hitY, pg.w, hitH, 6)) onHit('انزلاق البطريق! -1 ❤️');
      }
    }

    // 18. Spotted Arctic Seals (Stage 16 — Undulating patrol + rhythmic flipper-hop & frosty breath!)
    if (level.seals) {
      for (const sl of level.seals) {
        if (stepRepelled(sl, 195)) { sl.hopY = 0; continue; }
        sl.x += sl.facing * Math.abs(sl.vx) * dt;
        if (sl.x <= sl.minX) { sl.x = sl.minX; sl.facing = 1; }
        else if (sl.x >= sl.maxX) { sl.x = sl.maxX; sl.facing = -1; }
        const hopCyc = (timeSec + (sl.phase || 0)) % 2.1;
        sl.hopY = hopCyc < 0.48 ? Math.sin((hopCyc / 0.48) * Math.PI) * 26 : 0;
        if (hitBox(sl.x, sl.y - sl.hopY, sl.w, sl.h, 6)) onHit('هجوم الفقمة! -1 ❤️');
      }
    }
    // 19. Hanging Falling Crystal Icicles (Stage 16 — Shiver/glint telegraph -> plummet -> shatter & regrow!)
    if (level.falling_icicles) {
      for (const ic of level.falling_icicles) {
        if (!ic.state) {
          ic.state = 'idle';
          ic.curY = ic.y;
          ic.vy = 0;
          ic.timer = 0;
        }
        if (ic.state === 'idle') {
          ic.curY = ic.y;
          if (Math.abs(catCx - ic.x) < 128 && catCy > ic.y - 15 && catCy < ic.floorY + 20) {
            ic.state = 'shake';
            ic.timer = 0.62;
          }
        } else if (ic.state === 'shake') {
          ic.timer -= dt;
          if (ic.timer <= 0) {
            ic.state = 'fall';
            ic.vy = 110;
          }
        } else if (ic.state === 'fall') {
          ic.vy = Math.min(720, ic.vy + 1280 * dt);
          ic.curY += ic.vy * dt;
          if (hitBox(ic.x - 10, ic.curY, 20, ic.len, 4)) {
            onHit('سقوط رقاقة جليد! -1 ❤️');
            ic.state = 'respawn';
            ic.timer = 3.0;
            if (Particles && Particles.spawnDust) Particles.spawnDust(ic.x, ic.curY + ic.len * 0.6, 10, '#bae6fd');
          } else if (ic.curY + ic.len >= ic.floorY) {
            ic.state = 'respawn';
            ic.timer = 3.1;
            if (Particles && Particles.spawnDust) Particles.spawnDust(ic.x, ic.floorY, 10, '#e0f2fe');
          }
        } else if (ic.state === 'respawn') {
          ic.timer -= dt;
          if (ic.timer <= 0) {
            ic.state = 'idle';
            ic.curY = ic.y;
            ic.vy = 0;
          }
        }
      }
    }

    // 20. Giant Rolling Snowballs (Stage 16 — Barreling along glacial decks with snow-powder trail!)
    if (level.snowballs) {
      for (const sb of level.snowballs) {
        if (sb.x === undefined) {
          sb.x = sb.startX;
          sb.angle = 0;
          sb.waiting = false;
          sb.waitTimer = 0;
        }
        if (sb.waiting) {
          sb.waitTimer -= dt;
          if (sb.waitTimer <= 0) {
            sb.waiting = false;
            sb.x = sb.startX;
            sb.angle = 0;
            if (Particles && Particles.spawnDust) Particles.spawnDust(sb.x, sb.y, 8, '#f0f9ff');
          }
          continue;
        }
        const dir = sb.dir || -1;
        sb.x += dir * sb.speed * dt;
        sb.angle += (dir * sb.speed * dt) / Math.max(12, sb.r);
        if ((dir < 0 && sb.x < sb.minX) || (dir > 0 && sb.x > sb.maxX)) {
          if (Particles && Particles.spawnDust) Particles.spawnDust(sb.x, sb.y, 10, '#e0f2fe');
          sb.waiting = true;
          sb.waitTimer = sb.respawnDelay || 1.3;
          continue;
        }
        const dist = Math.hypot(catCx - sb.x, catCy - sb.y);
        if (dist < sb.r + 14) {
          onHit('كرة ثلج عملاقة! -1 ❤️');
        }
      }
    }

    // 21. Unicycling Acrobat Monkeys (Stage 17 — Pedals & juggles; wheelie-dashes when Mashmasha is ahead!)
    if (level.unicycle_monkeys) {
      for (const mk of level.unicycle_monkeys) {
        if (stepRepelled(mk, 215)) { mk.dashing = false; continue; }
        const mkCx = mk.x + mk.w * 0.5;
        const mkCy = mk.y + mk.h * 0.5;
        const ahead = (catCx - mkCx) * mk.facing;
        const seesCat = ahead > 0 && ahead < (c.crouching ? 115 : 215) && Math.abs(catCy - mkCy) < 64;
        mk.dashing = seesCat;
        const spd = Math.abs(mk.vx) * (seesCat ? 1.58 : 1);
        mk.x += mk.facing * spd * dt;
        mk.wheelRot = (mk.wheelRot || 0) + (mk.facing * spd * dt) / 13;
        if (mk.x <= mk.minX) { mk.x = mk.minX; mk.facing = 1; }
        else if (mk.x >= mk.maxX) { mk.x = mk.maxX; mk.facing = -1; }
        if (hitBox(mk.x, mk.y, mk.w, mk.h, 6)) onHit('قرد الدراجة الأحادية! -1 ❤️');
      }
    }

    // 22. Vintage Wind-Up Rolling Jester Clown-Bots (Stage 17 — Rolls on circus balance sphere!)
    if (level.circus_clowns) {
      for (const cl of level.circus_clowns) {
        if (stepRepelled(cl, 200)) continue;
        const spd = Math.abs(cl.vx);
        cl.x += cl.facing * spd * dt;
        cl.ballRot = (cl.ballRot || 0) + (cl.facing * spd * dt) / 14;
        if (cl.x <= cl.minX) { cl.x = cl.minX; cl.facing = 1; }
        else if (cl.x >= cl.maxX) { cl.x = cl.maxX; cl.facing = -1; }
        if (hitBox(cl.x, cl.y, cl.w, cl.h, 6)) onHit('المهرج الآلي! -1 ❤️');
      }
    }

    // 23. Stealth Sleeping Circus Lions (Stage 17 — 3-State AI: Sleep -> Roar & Prowl Chase -> Turn Around & Walk Home -> Sleep!)
    if (level.sleeping_lions) {
      for (const ln of level.sleeping_lions) {
        if (ln.homeX === undefined) ln.homeX = ln.x;
        if (ln.homeFacing === undefined) ln.homeFacing = ln.facing || -1;
        if (ln.walkDist === undefined) ln.walkDist = 0;
        if (ln.walkBlend === undefined) ln.walkBlend = 0;
        if (ln.sleepLock > 0) ln.sleepLock -= dt;
        if (ln.roarTimer > 0) ln.roarTimer -= dt;

        const prevX = ln.x;
        const lnCx = ln.x + ln.w * 0.5;
        const lnCy = ln.y + ln.h * 0.5;
        const dist = Math.hypot(catCx - lnCx, catCy - lnCy);
        const noisyNear = dist < 175 && Math.abs(catCy - lnCy) < 75 && !c.crouching && Math.abs(c.vx) > 45 && !(ln.sleepLock > 0);

        if (!ln.awake && noisyNear && c.invulnTimer <= 0) {
          ln.awake = true;
          ln.returning = false;
          ln.awakeTimer = 3.2;
          ln.roarTimer = 1.15;
          ln.facing = catCx >= lnCx ? 1 : -1;
          if (Audio && Audio.playLionRoar) Audio.playLionRoar();
          if (Particles && Particles.spawnPopup) Particles.spawnPopup(lnCx, ln.y - 18, '🦁 ROAR!', '#fb923c');
        }

        if (ln.awake) {
          anyChasing = true;
          ln.awakeTimer -= dt;
          const dxToCat = catCx - lnCx;
          if (Math.abs(dxToCat) > 6) ln.facing = dxToCat > 0 ? 1 : -1;
          if (Math.abs(dxToCat) > 14) {
            ln.x = Math.max(ln.minX, Math.min(ln.maxX, ln.x + ln.facing * 152 * dt));
          }
          if (ln.awakeTimer <= 0 || dist > 260) {
            ln.awake = false;
            ln.returning = Math.abs(ln.homeX - ln.x) > 3;
          }
          if (hitBox(ln.x, ln.y, ln.w, ln.h, 7)) onHit('زئير الأسد! -1 ❤️');
        } else if (ln.returning) {
          // Turn around to face home cushion and walk calmly forward on all 4 legs (NEVER slide backwards!)
          const homeDiff = ln.homeX - ln.x;
          if (Math.abs(homeDiff) > 3) {
            ln.facing = homeDiff > 0 ? 1 : -1;
            ln.x += ln.facing * Math.min(Math.abs(homeDiff), 84 * dt);
          } else {
            ln.x = ln.homeX;
            ln.returning = false;
            ln.facing = ln.homeFacing;
          }
          if (hitBox(ln.x + 8, ln.y + 8, ln.w - 16, ln.h - 10, 5)) onHit('زئير الأسد! -1 ❤️');
        } else {
          ln.x = ln.homeX;
          if (hitBox(ln.x + 12, ln.y + 14, ln.w - 24, ln.h - 14, 4)) onHit('زئير الأسد! -1 ❤️');
        }

        // Ground-locked stride accumulation: legs ONLY animate when actual horizontal motion occurs!
        const actualDx = Math.abs(ln.x - prevX);
        const standing = !!(ln.awake || ln.returning);
        if (standing && actualDx > 0.08) {
          ln.walkDist += actualDx;
          const targetBlend = ln.awake ? 1.0 : 0.72;
          ln.walkBlend += (targetBlend - ln.walkBlend) * Math.min(1, dt * 12);
        } else {
          ln.walkBlend = Math.max(0, ln.walkBlend - dt * 9.5);
        }
      }
    }

    // 24. Flaming Circus Fire Hoops (Stage 17 — Periodic 4.2s cycle: calm embers -> flare warning -> roaring ring of fire!)
    if (level.fire_hoops) {
      for (const fh of level.fire_hoops) {
        const cyc = (timeSec + (fh.phase || 0)) % 4.2;
        fh.state = cyc < 1.8 ? 'calm' : cyc < 2.45 ? 'warn' : cyc < 3.9 ? 'blaze' : 'calm';
        if (fh.state === 'blaze') {
          const d = Math.hypot(catCx - fh.x, catCy - fh.y);
          if (d < fh.r + 6) {
            onHit('حلقة النار! -1 ❤️');
          }
        }
      }
    }

    // 25. Desert Ambush Scorpions (Stage 18 — Lurk low -> Snap & lunge -> Walk forward home cleanly!)
    if (level.scorpions) {
      for (const sc of level.scorpions) {
        if (sc.homeX === undefined) sc.homeX = sc.x;
        if (sc.homeFacing === undefined) sc.homeFacing = sc.facing || -1;
        if (sc.walkDist === undefined) sc.walkDist = 0;
        if (sc.walkBlend === undefined) sc.walkBlend = 0;
        if (sc.stunTimer > 0) { sc.stunTimer -= dt; continue; }

        const prevX = sc.x;
        const scCx = sc.x + sc.w * 0.5;
        const scCy = sc.y + sc.h * 0.5;
        const dist = Math.hypot(catCx - scCx, catCy - scCy);
        const near = dist < 170 && Math.abs(catCy - scCy) < 75;

        if (!sc.awake && near && c.invulnTimer <= 0) {
          sc.awake = true;
          sc.returning = false;
          sc.awakeTimer = 2.8;
          sc.facing = catCx >= scCx ? 1 : -1;
          if (Audio && Audio.playScorpionSnap) Audio.playScorpionSnap();
        }
        if (sc.awake) {
          anyChasing = true;
          sc.awakeTimer -= dt;
          const dx = catCx - scCx;
          if (Math.abs(dx) > 6) sc.facing = dx > 0 ? 1 : -1;
          if (Math.abs(dx) > 12) {
            sc.x = Math.max(sc.minX, Math.min(sc.maxX, sc.x + sc.facing * 138 * dt));
          }
          if (sc.awakeTimer <= 0 || dist > 235) {
            sc.awake = false;
            sc.returning = Math.abs(sc.homeX - sc.x) > 3;
          }
          if (hitBox(sc.x, sc.y, sc.w, sc.h, 6)) onHit('لدغة عقرب! -1 ❤️');
        } else if (sc.returning) {
          const hDiff = sc.homeX - sc.x;
          if (Math.abs(hDiff) > 3) {
            sc.facing = hDiff > 0 ? 1 : -1;
            sc.x += sc.facing * Math.min(Math.abs(hDiff), 76 * dt);
          } else {
            sc.x = sc.homeX; sc.returning = false; sc.facing = sc.homeFacing;
          }
          if (hitBox(sc.x + 6, sc.y + 8, sc.w - 12, sc.h - 8, 5)) onHit('لدغة عقرب! -1 ❤️');
        } else {
          sc.x = sc.homeX;
          if (hitBox(sc.x + 10, sc.y + 12, sc.w - 20, sc.h - 12, 4)) onHit('لدغة عقرب! -1 ❤️');
        }
        const dxMove = Math.abs(sc.x - prevX);
        if ((sc.awake || sc.returning) && dxMove > 0.08) {
          sc.walkDist += dxMove;
          sc.walkBlend += (1 - sc.walkBlend) * Math.min(1, dt * 12);
        } else {
          sc.walkBlend = Math.max(0, sc.walkBlend - dt * 10);
        }
      }
    }

    // 26. Stealth Horned Sand Vipers (Stage 18 — Crouch to sneak past; upright running triggers hiss & strike!)
    if (level.sand_vipers) {
      for (const vp of level.sand_vipers) {
        if (vp.homeX === undefined) vp.homeX = vp.x;
        if (vp.homeFacing === undefined) vp.homeFacing = vp.facing || -1;
        if (vp.walkDist === undefined) vp.walkDist = 0;
        if (vp.stunTimer > 0) { vp.stunTimer -= dt; continue; }

        const prevX = vp.x;
        const vpCx = vp.x + vp.w * 0.5;
        const vpCy = vp.y + vp.h * 0.5;
        const dist = Math.hypot(catCx - vpCx, catCy - vpCy);
        const noisy = dist < 160 && Math.abs(catCy - vpCy) < 70 && !c.crouching && Math.abs(c.vx) > 40;

        if (!vp.awake && noisy && c.invulnTimer <= 0) {
          vp.awake = true;
          vp.returning = false;
          vp.awakeTimer = 2.6;
          vp.facing = catCx >= vpCx ? 1 : -1;
          if (Audio && Audio.playSnakeHiss) Audio.playSnakeHiss();
        }
        if (vp.awake) {
          anyChasing = true;
          vp.awakeTimer -= dt;
          const dx = catCx - vpCx;
          if (Math.abs(dx) > 6) vp.facing = dx > 0 ? 1 : -1;
          if (Math.abs(dx) > 12) vp.x = Math.max(vp.minX, Math.min(vp.maxX, vp.x + vp.facing * 145 * dt));
          if (vp.awakeTimer <= 0 || dist > 230) {
            vp.awake = false;
            vp.returning = Math.abs(vp.homeX - vp.x) > 3;
          }
          if (hitBox(vp.x, vp.y, vp.w, vp.h, 6)) onHit('لدغة أفعى الرمال! -1 ❤️');
        } else if (vp.returning) {
          const hDiff = vp.homeX - vp.x;
          if (Math.abs(hDiff) > 3) {
            vp.facing = hDiff > 0 ? 1 : -1;
            vp.x += vp.facing * Math.min(Math.abs(hDiff), 78 * dt);
          } else {
            vp.x = vp.homeX; vp.returning = false; vp.facing = vp.homeFacing;
          }
          if (hitBox(vp.x + 8, vp.y + 10, vp.w - 16, vp.h - 10, 4)) onHit('لدغة أفعى الرمال! -1 ❤️');
        } else {
          if (hitBox(vp.x + 12, vp.y + 14, vp.w - 24, vp.h - 14, 4)) onHit('لدغة أفعى الرمال! -1 ❤️');
        }
        vp.walkDist += Math.abs(vp.x - prevX);
      }
    }

    // 27. Swooping Desert Falcons (Stage 18 — Soar high & dive-swoop with cry telegraph!)
    if (level.desert_falcons) {
      for (const fl of level.desert_falcons) {
        fl.x += fl.vx * dt;
        if (fl.x <= fl.minX) { fl.x = fl.minX; fl.vx = Math.abs(fl.vx); fl.facing = 1; }
        if (fl.x >= fl.maxX) { fl.x = fl.maxX; fl.vx = -Math.abs(fl.vx); fl.facing = -1; }
        const baseY = fl.baseY !== undefined ? fl.baseY : fl.y;
        const hDist = Math.abs(catCx - (fl.x + fl.w * 0.5));
        if (!fl.swooping && hDist < 190 && catCy > baseY + 60 && catCy < baseY + 380 && c.invulnTimer <= 0) {
          fl.swooping = true;
          fl.swoopT = 0;
          if (Audio && Audio.playFalconCry) Audio.playFalconCry();
        }
        if (fl.swooping) {
          fl.swoopT += dt * 1.45;
          fl.y = baseY + Math.sin(fl.swoopT * Math.PI) * 155;
          if (fl.swoopT >= 1) { fl.swooping = false; fl.y = baseY; }
        } else {
          fl.y = baseY + Math.sin(timeSec * 2.4 + (fl.phase || 0)) * (fl.amp || 22);
        }
        if (hitBox(fl.x, fl.y, fl.w, fl.h, 8)) onHit('انقضاض صقر الصحراء! -1 ❤️');
      }
    }

    // 28. Spinning Sand Dust Devils (Stage 18 — Miniature desert whirlwinds tossing Mashmasha!)
    if (level.dust_devils) {
      for (const dd of level.dust_devils) {
        dd.x += dd.vx * dt;
        if (dd.x <= dd.minX) { dd.x = dd.minX; dd.vx = Math.abs(dd.vx); }
        if (dd.x >= dd.maxX) { dd.x = dd.maxX; dd.vx = -Math.abs(dd.vx); }
        if (hitBox(dd.x, dd.y, dd.w, dd.h, 6)) {
          if (Audio && Audio.playSandWhoosh) Audio.playSandWhoosh();
          c.vy = -340;
          c.vx = (catCx < dd.x + dd.w * 0.5 ? -1 : 1) * 320;
          onHit('دوار الرمال! -1 ❤️');
        }
      }
    }

    // 29. Mischievous Leaf-Disguised Tanuki Rascals (Stage 19 — Crouch to sneak past; upright running pops them up!)
    if (level.tanuki_rascals) {
      for (const tn of level.tanuki_rascals) {
        if (tn.homeX === undefined) tn.homeX = tn.x;
        if (tn.homeFacing === undefined) tn.homeFacing = tn.facing || -1;
        if (tn.walkDist === undefined) tn.walkDist = 0;
        if (tn.walkBlend === undefined) tn.walkBlend = 0;
        if (stepRepelled(tn, 200)) { tn.awake = false; tn.returning = true; continue; }
        const prevX = tn.x;
        const tnCx = tn.x + tn.w * 0.5, tnCy = tn.y + tn.h * 0.5;
        const dist = Math.hypot(catCx - tnCx, catCy - tnCy);
        const noisy = dist < 175 && Math.abs(catCy - tnCy) < 75 && !c.crouching && Math.abs(c.vx) > 35;
        if (!tn.awake && noisy && c.invulnTimer <= 0) {
          tn.awake = true; tn.returning = false; tn.awakeTimer = 2.8;
          tn.facing = catCx >= tnCx ? 1 : -1;
          if (Audio && Audio.playTanukiPop) Audio.playTanukiPop();
          if (Particles && Particles.spawnPopup) Particles.spawnPopup(tnCx, tn.y - 14, '🍃', '#4ade80');
        }
        if (tn.awake) {
          anyChasing = true; tn.awakeTimer -= dt;
          const dx = catCx - tnCx;
          if (Math.abs(dx) > 6) tn.facing = dx > 0 ? 1 : -1;
          if (Math.abs(dx) > 12) tn.x = Math.max(tn.minX, Math.min(tn.maxX, tn.x + tn.facing * 142 * dt));
          if (tn.awakeTimer <= 0 || dist > 250) { tn.awake = false; tn.returning = Math.abs(tn.homeX - tn.x) > 3; }
          if (hitBox(tn.x, tn.y, tn.w, tn.h, 6)) onHit('مقلب التانوكي! -1 ❤️');
        } else if (tn.returning) {
          const hDiff = tn.homeX - tn.x;
          if (Math.abs(hDiff) > 3) { tn.facing = hDiff > 0 ? 1 : -1; tn.x += tn.facing * Math.min(Math.abs(hDiff), 80 * dt); }
          else { tn.x = tn.homeX; tn.returning = false; tn.facing = tn.homeFacing; }
          if (hitBox(tn.x + 8, tn.y + 8, tn.w - 16, tn.h - 8, 4)) onHit('مقلب التانوكي! -1 ❤️');
        } else {
          if (hitBox(tn.x + 10, tn.y + 12, tn.w - 20, tn.h - 12, 4)) onHit('مقلب التانوكي! -1 ❤️');
        }
        const dxMove = Math.abs(tn.x - prevX);
        if ((tn.awake || tn.returning) && dxMove > 0.08) { tn.walkDist += dxMove; tn.walkBlend += (1 - tn.walkBlend) * Math.min(1, dt * 12); }
        else { tn.walkBlend = Math.max(0, tn.walkBlend - dt * 10); }
      }
    }

    // 30. Alert Shiba Inu Street Guards (Stage 19 — Patrols Kyoto Machiya alleys, barks & trots when spotting Mashmasha!)
    if (level.shiba_guards) {
      for (const sh of level.shiba_guards) {
        if (sh.walkDist === undefined) sh.walkDist = 0;
        if (stepRepelled(sh, 215)) { sh.alert = false; continue; }
        const prevX = sh.x;
        const shCx = sh.x + sh.w * 0.5, shCy = sh.y + sh.h * 0.5;
        const dist = Math.hypot(catCx - shCx, catCy - shCy);
        const sees = dist < (c.crouching ? 120 : 210) && Math.abs(catCy - shCy) < 75 && (catCx - shCx) * sh.facing > -15;
        if (sees && c.invulnTimer <= 0) {
          if (!sh.alert) {
            sh.alert = true;
            if (Audio && Audio.playBark) Audio.playBark();
            if (Particles && Particles.spawnPopup) Particles.spawnPopup(shCx, sh.y - 14, '🐕!', '#f97316');
          }
          anyChasing = true;
          const dx = catCx - shCx;
          if (Math.abs(dx) > 10) { sh.facing = dx > 0 ? 1 : -1; sh.x = Math.max(sh.minX, Math.min(sh.maxX, sh.x + sh.facing * 155 * dt)); }
        } else {
          sh.alert = false;
          sh.x += sh.facing * Math.abs(sh.vx || 82) * dt;
          if (sh.x <= sh.minX) { sh.x = sh.minX; sh.facing = 1; }
          else if (sh.x >= sh.maxX) { sh.x = sh.maxX; sh.facing = -1; }
        }
        sh.walkDist += Math.abs(sh.x - prevX);
        if (hitBox(sh.x, sh.y, sh.w, sh.h, 6)) onHit('كلب الشيبا الحارس! -1 ❤️');
      }
    }

    // 31. Swooping Kyoto Karasu Crows (Stage 19 — Dive-swoop between pagoda eaves with crow caw!)
    if (level.samurai_crows) {
      for (const cr of level.samurai_crows) {
        cr.x += cr.vx * dt;
        if (cr.x <= cr.minX) { cr.x = cr.minX; cr.vx = Math.abs(cr.vx); cr.facing = 1; }
        if (cr.x >= cr.maxX) { cr.x = cr.maxX; cr.vx = -Math.abs(cr.vx); cr.facing = -1; }
        const baseY = cr.baseY !== undefined ? cr.baseY : cr.y;
        const hDist = Math.abs(catCx - (cr.x + cr.w * 0.5));
        if (!cr.swooping && hDist < 190 && catCy > baseY + 55 && catCy < baseY + 380 && c.invulnTimer <= 0) {
          cr.swooping = true; cr.swoopT = 0;
          if (Audio && Audio.playCrowCaw) Audio.playCrowCaw();
        }
        if (cr.swooping) {
          cr.swoopT += dt * 1.45;
          cr.y = baseY + Math.sin(cr.swoopT * Math.PI) * 155;
          if (cr.swoopT >= 1) { cr.swooping = false; cr.y = baseY; }
        } else {
          cr.y = baseY + Math.sin(timeSec * 2.5 + (cr.phase || 0)) * (cr.amp || 22);
        }
        if (hitBox(cr.x, cr.y, cr.w, cr.h, 7)) onHit('انقضاض غراب كيوتو! -1 ❤️');
      }
    }

    // 32. Rolling Red Lacquered Daruma Dolls (Stage 19 — Tumble along shrine decks with true rolling rotation!)
    if (level.daruma_rollers) {
      for (const dr of level.daruma_rollers) {
        if (dr.x === undefined) { dr.x = dr.startX; dr.angle = 0; dr.waiting = false; dr.waitTimer = 0; }
        if (dr.waiting) {
          dr.waitTimer -= dt;
          if (dr.waitTimer <= 0) {
            dr.waiting = false; dr.x = dr.startX; dr.angle = 0;
            if (Particles && Particles.spawnDust) Particles.spawnDust(dr.x, dr.y, 7, '#fca5a5');
          }
          continue;
        }
        const dir = dr.dir || -1;
        dr.x += dir * dr.speed * dt;
        dr.angle += (dir * dr.speed * dt) / Math.max(12, dr.r);
        if ((dir < 0 && dr.x < dr.minX) || (dir > 0 && dr.x > dr.maxX)) {
          if (Particles && Particles.spawnDust) Particles.spawnDust(dr.x, dr.y, 8, '#fca5a5');
          dr.waiting = true; dr.waitTimer = dr.respawnDelay || 1.4;
          continue;
        }
        if (Math.hypot(catCx - dr.x, catCy - dr.y) < dr.r + 13) onHit('دمية الداروما المتدحرجة! -1 ❤️');
      }
    }

    // 33. Clockwork Brass Rail Inspectors (Stage 20 — Patrols train roofs with swinging signal lantern!)
    if (level.rail_inspectors) {
      for (const ri of level.rail_inspectors) {
        if (ri.walkDist === undefined) ri.walkDist = 0;
        if (stepRepelled(ri, 200)) { ri.alert = false; continue; }
        const prevX = ri.x;
        const riCx = ri.x + ri.w * 0.5, riCy = ri.y + ri.h * 0.5;
        const dist = Math.hypot(catCx - riCx, catCy - riCy);
        const sees = dist < (c.crouching ? 110 : 200) && Math.abs(catCy - riCy) < 70 && (catCx - riCx) * ri.facing > -15;
        if (sees && c.invulnTimer <= 0) {
          if (!ri.alert) {
            ri.alert = true;
            if (Audio && Audio.playRailBell) Audio.playRailBell();
            if (Particles && Particles.spawnPopup) Particles.spawnPopup(riCx, ri.y - 14, '🔔!', '#fbbf24');
          }
          anyChasing = true;
          const dx = catCx - riCx;
          if (Math.abs(dx) > 10) { ri.facing = dx > 0 ? 1 : -1; ri.x = Math.max(ri.minX, Math.min(ri.maxX, ri.x + ri.facing * 145 * dt)); }
        } else {
          ri.alert = false;
          ri.x += ri.facing * Math.abs(ri.vx || 78) * dt;
          if (ri.x <= ri.minX) { ri.x = ri.minX; ri.facing = 1; }
          else if (ri.x >= ri.maxX) { ri.x = ri.maxX; ri.facing = -1; }
        }
        ri.walkDist += Math.abs(ri.x - prevX);
        if (hitBox(ri.x, ri.y, ri.w, ri.h, 6)) onHit('مفتش القطار النحاسي! -1 ❤️');
      }
    }

    // 34. Bouncing Furnace Coal Sparks (Stage 20 — Glowing embers hopping along tender roofs!)
    if (level.coal_sparks) {
      for (const cs of level.coal_sparks) {
        if (cs.x === undefined) { cs.x = cs.startX; cs.hopT = 0; cs.waiting = false; cs.waitTimer = 0; }
        if (cs.waiting) {
          cs.waitTimer -= dt;
          if (cs.waitTimer <= 0) { cs.waiting = false; cs.x = cs.startX; cs.hopT = 0; }
          continue;
        }
        const dir = cs.dir || -1;
        cs.x += dir * cs.speed * dt;
        cs.hopT += dt * 4.2;
        const hopH = Math.abs(Math.sin(cs.hopT)) * 26;
        cs.curY = cs.y - hopH;
        if ((dir < 0 && cs.x < cs.minX) || (dir > 0 && cs.x > cs.maxX)) {
          cs.waiting = true; cs.waitTimer = cs.respawnDelay || 1.6;
          continue;
        }
        if (Math.hypot(catCx - cs.x, catCy - cs.curY) < cs.r + 11) onHit('جمرة القطار المشتعلة! -1 ❤️');
      }
    }

    // 35. Express Railway Post-Owls (Stage 20 — Calm predictable gliding flight, NO swoop-diving!)
    if (level.mail_owls) {
      for (const ow of level.mail_owls) {
        ow.swooping = false;
        ow.x += ow.vx * dt;
        if (ow.x <= ow.minX) { ow.x = ow.minX; ow.vx = Math.abs(ow.vx); ow.facing = 1; }
        if (ow.x >= ow.maxX) { ow.x = ow.maxX; ow.vx = -Math.abs(ow.vx); ow.facing = -1; }
        const baseY = ow.baseY !== undefined ? ow.baseY : ow.y;
        ow.y = baseY + Math.sin(timeSec * 2.2 + (ow.phase || 0)) * (ow.amp || 18);
        if (hitBox(ow.x, ow.y, ow.w, ow.h, 7)) onHit('بومة بريد القطار! -1 ❤️');
      }
    }

    // 36. Masked Venetian Carnival Jesters (Stage 21 — crouch-aware sight, walkDist-driven stride!)
    if (level.carnival_jesters) {
      for (const js of level.carnival_jesters) {
        if (js.walkDist === undefined) js.walkDist = 0;
        if (stepRepelled(js, 200)) { js.alert = false; continue; }
        const prevX = js.x;
        const jCx = js.x + js.w * 0.5, jCy = js.y + js.h * 0.5;
        const dist = Math.hypot(catCx - jCx, catCy - jCy);
        const sees = dist < (c.crouching ? 105 : 195) && Math.abs(catCy - jCy) < 70 && (catCx - jCx) * js.facing > -15;
        if (sees && c.invulnTimer <= 0) {
          if (!js.alert) {
            js.alert = true;
            if (Audio && Audio.playVeniceBell) Audio.playVeniceBell();
            if (Particles && Particles.spawnPopup) Particles.spawnPopup(jCx, js.y - 14, '🎭!', '#fbbf24');
          }
          anyChasing = true;
          const dx = catCx - jCx;
          if (Math.abs(dx) > 10) { js.facing = dx > 0 ? 1 : -1; js.x = Math.max(js.minX, Math.min(js.maxX, js.x + js.facing * 140 * dt)); }
        } else {
          js.alert = false;
          js.x += js.facing * Math.abs(js.vx || 78) * dt;
          if (js.x <= js.minX) { js.x = js.minX; js.facing = 1; }
          else if (js.x >= js.maxX) { js.x = js.maxX; js.facing = -1; }
        }
        js.walkDist += Math.abs(js.x - prevX);
        if (hitBox(js.x, js.y, js.w, js.h, 6)) onHit('مهرّج كرنفال البندقية! -1 ❤️');
      }
    }

    // 37. Venetian Lagoon Quay Stone Crabs (Stage 21 — grounded dock scuttling!)
    if (level.canal_crabs) {
      for (const cb of level.canal_crabs) {
        if (cb.walkDist === undefined) cb.walkDist = 0;
        if (stepRepelled(cb, 185)) continue;
        const prevX = cb.x;
        cb.x += (cb.facing || -1) * Math.abs(cb.vx || 74) * dt;
        if (cb.x <= cb.minX) { cb.x = cb.minX; cb.facing = 1; }
        else if (cb.x >= cb.maxX) { cb.x = cb.maxX; cb.facing = -1; }
        cb.walkDist += Math.abs(cb.x - prevX);
        if (hitBox(cb.x, cb.y, cb.w, cb.h, 5)) onHit('سرطان قنوات البندقية! -1 ❤️');
      }
    }

    // 38. Calm High-Gliding Venetian Lagoon Gulls (Stage 21 — smooth predictable flight, NO swoop-diving!)
    if (level.venice_gulls) {
      for (const gl of level.venice_gulls) {
        gl.x += gl.vx * dt;
        if (gl.x <= gl.minX) { gl.x = gl.minX; gl.vx = Math.abs(gl.vx); gl.facing = 1; }
        if (gl.x >= gl.maxX) { gl.x = gl.maxX; gl.vx = -Math.abs(gl.vx); gl.facing = -1; }
        const baseY = gl.baseY !== undefined ? gl.baseY : gl.y;
        gl.y = baseY + Math.sin(timeSec * 2.1 + (gl.phase || 0)) * (gl.amp || 16);
        if (hitBox(gl.x, gl.y, gl.w, gl.h, 7)) onHit('نورس البندقية! -1 ❤️');
      }
    }

    // 39. Royal Parisian Poodles (Stage 22 — grounded rooftop patrol, walkDist-driven!)
    if (level.paris_poodles) {
      for (const pd of level.paris_poodles) {
        if (pd.walkDist === undefined) pd.walkDist = 0;
        if (stepRepelled(pd, 200)) continue;
        const prevX = pd.x;
        pd.x += (pd.facing || pd.dir || 1) * (pd.speed || 96) * dt;
        if (pd.x <= pd.minX) { pd.x = pd.minX; pd.facing = 1; }
        else if (pd.x >= pd.maxX) { pd.x = pd.maxX; pd.facing = -1; }
        pd.walkDist += Math.abs(pd.x - prevX);
        if (hitBox(pd.x, pd.y, pd.w, pd.h, 6)) onHit('كلب باريس المدلل! -1 ❤️');
      }
    }

    // 40. Parisian Boulangerie Chefs (Stage 22 — grounded rooftop patrol, walkDist-driven!)
    if (level.paris_bakers) {
      for (const bk of level.paris_bakers) {
        if (bk.walkDist === undefined) bk.walkDist = 0;
        if (stepRepelled(bk, 200)) continue;
        const prevX = bk.x;
        bk.x += (bk.facing || bk.dir || 1) * (bk.speed || 90) * dt;
        if (bk.x <= bk.minX) { bk.x = bk.minX; bk.facing = 1; }
        else if (bk.x >= bk.maxX) { bk.x = bk.maxX; bk.facing = -1; }
        bk.walkDist += Math.abs(bk.x - prevX);
        if (hitBox(bk.x, bk.y, bk.w, bk.h, 6)) onHit('خباز باريس! -1 ❤️');
      }
    }

    // 41. Parisian Rooftop Pigeons (Stage 22 — smooth predictable sine glide, NO swoop-diving!)
    if (level.paris_pigeons) {
      for (const pg of level.paris_pigeons) {
        pg.x += pg.vx * dt;
        if (pg.x <= pg.minX) { pg.x = pg.minX; pg.vx = Math.abs(pg.vx); pg.facing = 1; }
        if (pg.x >= pg.maxX) { pg.x = pg.maxX; pg.vx = -Math.abs(pg.vx); pg.facing = -1; }
        const baseY = pg.baseY !== undefined ? pg.baseY : pg.y;
        pg.y = baseY + Math.sin(timeSec * 2.4 + (pg.phase || 0)) * (pg.bobAmp || 13);
        if (hitBox(pg.x, pg.y, pg.w, pg.h, 7)) onHit('حمامة باريس! -1 ❤️');
      }
    }

    // 42. Atlas Barbary Macaques (Stage 23 — grounded souk patrol, walkDist-driven!)
    if (level.morocco_monkeys) {
      for (const mk of level.morocco_monkeys) {
        if (mk.walkDist === undefined) mk.walkDist = 0;
        if (stepRepelled(mk, 200)) continue;
        const prevX = mk.x;
        mk.x += (mk.facing || mk.dir || 1) * (mk.speed || 110) * dt;
        if (mk.x <= mk.minX) { mk.x = mk.minX; mk.facing = 1; }
        else if (mk.x >= mk.maxX) { mk.x = mk.maxX; mk.facing = -1; }
        mk.walkDist += Math.abs(mk.x - prevX);
        if (hitBox(mk.x, mk.y, mk.w, mk.h, 6)) onHit('قرد أطلس المشاغب! -1 ❤️');
      }
    }

    // 43. Marrakech Tea & Spice Merchants (Stage 23 — grounded adult patrol, walkDist-driven!)
    if (level.morocco_merchants) {
      for (const mc of level.morocco_merchants) {
        if (mc.walkDist === undefined) mc.walkDist = 0;
        if (stepRepelled(mc, 200)) continue;
        const prevX = mc.x;
        mc.x += (mc.facing || mc.dir || 1) * (mc.speed || 96) * dt;
        if (mc.x <= mc.minX) { mc.x = mc.minX; mc.facing = 1; }
        else if (mc.x >= mc.maxX) { mc.x = mc.maxX; mc.facing = -1; }
        mc.walkDist += Math.abs(mc.x - prevX);
        if (hitBox(mc.x, mc.y, mc.w, mc.h, 6)) onHit('تاجر سوق مراكش! -1 ❤️');
      }
    }

    // 44. White Moroccan Kasbah Storks (Stage 23 — smooth predictable sine glide, NO swoop-diving!)
    if (level.morocco_storks) {
      for (const st of level.morocco_storks) {
        st.x += st.vx * dt;
        if (st.x <= st.minX) { st.x = st.minX; st.vx = Math.abs(st.vx); st.facing = 1; }
        if (st.x >= st.maxX) { st.x = st.maxX; st.vx = -Math.abs(st.vx); st.facing = -1; }
        const baseY = st.baseY !== undefined ? st.baseY : st.y;
        st.y = baseY + Math.sin(timeSec * 2.2 + (st.phase || 0)) * (st.bobAmp || 14);
        if (hitBox(st.x, st.y, st.w, st.h, 7)) onHit('لقلق القصبة! -1 ❤️');
      }
    }

    // 45. Yucatán Jaguars (Stage 24 — sleek jungle patrol, walkDist-driven!)
    if (level.maya_jaguars) {
      for (const jg of level.maya_jaguars) {
        if (jg.walkDist === undefined) jg.walkDist = 0;
        if (stepRepelled(jg, 210)) continue;
        const prevX = jg.x;
        jg.x += (jg.facing || 1) * (jg.speed || 116) * dt;
        if (jg.x <= jg.minX) { jg.x = jg.minX; jg.facing = 1; }
        else if (jg.x >= jg.maxX) { jg.x = jg.maxX; jg.facing = -1; }
        jg.walkDist += Math.abs(jg.x - prevX);
        if (hitBox(jg.x, jg.y, jg.w, jg.h, 6)) onHit('نمر اليوكاتان! -1 ❤️');
      }
    }

    // 46. Mayan Jaguar Temple Guardians (Stage 24 — adult temple patrol, walkDist-driven!)
    if (level.maya_warriors) {
      for (const mw of level.maya_warriors) {
        if (mw.walkDist === undefined) mw.walkDist = 0;
        if (stepRepelled(mw, 200)) continue;
        const prevX = mw.x;
        mw.x += (mw.facing || 1) * (mw.speed || 84) * dt;
        if (mw.x <= mw.minX) { mw.x = mw.minX; mw.facing = 1; }
        else if (mw.x >= mw.maxX) { mw.x = mw.maxX; mw.facing = -1; }
        mw.walkDist += Math.abs(mw.x - prevX);
        if (hitBox(mw.x, mw.y, mw.w, mw.h, 6)) onHit('حارس معبد المايا! -1 ❤️');
      }
    }

    // 47. Resplendent Quetzal Birds (Stage 24 — smooth predictable sine glide, NO swoop-diving!)
    if (level.maya_quetzals) {
      for (const qz of level.maya_quetzals) {
        const baseY = qz.baseY !== undefined ? qz.baseY : qz.y;
        qz.y = baseY + Math.sin(timeSec * 2.1 + (qz.phase || 0)) * (qz.ampY || 26);
        if (stepRepelled(qz, 215)) continue;
        const spd = qz.speed || 122;
        qz.x += (qz.facing || 1) * spd * dt;
        if (qz.x <= qz.minX) { qz.x = qz.minX; qz.facing = 1; }
        else if (qz.x >= qz.maxX) { qz.x = qz.maxX; qz.facing = -1; }
        if (hitBox(qz.x, qz.y, qz.w, qz.h, 7)) onHit('طائر الكيتزال! -1 ❤️');
      }
    }

    // 48. Santorini Wild Mountain Goats (Stage 25 — agile Aegean cliff patrol, walkDist-driven!)
    if (level.greece_goats) {
      for (const gt of level.greece_goats) {
        if (gt.walkDist === undefined) gt.walkDist = 0;
        if (stepRepelled(gt, 205)) continue;
        const prevX = gt.x;
        gt.x += (gt.facing || 1) * (gt.speed || 110) * dt;
        if (gt.x <= gt.minX) { gt.x = gt.minX; gt.facing = 1; }
        else if (gt.x >= gt.maxX) { gt.x = gt.maxX; gt.facing = -1; }
        gt.walkDist += Math.abs(gt.x - prevX);
        if (hitBox(gt.x, gt.y, gt.w, gt.h, 6)) onHit('ماعز سانتوريني الجبلي! -1 ❤️');
      }
    }

    // 49. Greek Acropolis Hoplite Guards (Stage 25 — disciplined bronze-armored patrol, walkDist-driven!)
    if (level.greece_hoplites) {
      for (const hp of level.greece_hoplites) {
        if (hp.walkDist === undefined) hp.walkDist = 0;
        if (stepRepelled(hp, 195)) continue;
        const prevX = hp.x;
        hp.x += (hp.facing || 1) * (hp.speed || 84) * dt;
        if (hp.x <= hp.minX) { hp.x = hp.minX; hp.facing = 1; }
        else if (hp.x >= hp.maxX) { hp.x = hp.maxX; hp.facing = -1; }
        hp.walkDist += Math.abs(hp.x - prevX);
        if (hitBox(hp.x, hp.y, hp.w, hp.h, 6)) onHit('حارس الأكروبوليس الإغريقي! -1 ❤️');
      }
    }

    // 50. Sacred Owls of Athena (Stage 25 — calm predictable sine glide, NO swoop-diving!)
    if (level.greece_owls) {
      for (const ow of level.greece_owls) {
        const baseY = ow.baseY !== undefined ? ow.baseY : ow.y;
        ow.y = baseY + Math.sin(timeSec * 2.0 + (ow.phase || 0)) * (ow.ampY || 24);
        if (stepRepelled(ow, 210)) continue;
        const spd = ow.speed || 118;
        ow.x += (ow.facing || 1) * spd * dt;
        if (ow.x <= ow.minX) { ow.x = ow.minX; ow.facing = 1; }
        else if (ow.x >= ow.maxX) { ow.x = ow.maxX; ow.facing = -1; }
        if (hitBox(ow.x, ow.y, ow.w, ow.h, 7)) onHit('بومة أثينا الحكيمة! -1 ❤️');
      }
    }

    // 51. Indian Crested Porcupines (Stage 26: Battir — النيص البري with defensive quill-flare!)
    if (level.battir_porcupines) {
      for (const p of level.battir_porcupines) {
        const prevX = p.x;
        if (stepRepelled(p, 195)) { p.walkDist = (p.walkDist || 0) + Math.abs(p.x - prevX); continue; }
        const dxCat = catCx - (p.x + p.w * 0.5);
        const dyCat = Math.abs(catCy - (p.y + p.h * 0.5));
        const near = Math.abs(dxCat) < 175 && dyCat < 75;
        p.bristle = near ? Math.min(1, (p.bristle || 0) + dt * 4.5) : Math.max(0, (p.bristle || 0) - dt * 2.8);
        const spd = (p.speed || 76) * (near ? 0.65 : 1.0);
        p.x += (p.facing || 1) * spd * dt;
        if (p.x <= p.minX) { p.x = p.minX; p.facing = 1; }
        else if (p.x >= p.maxX) { p.x = p.maxX; p.facing = -1; }
        p.walkDist = (p.walkDist || 0) + Math.abs(p.x - prevX);
        if (hitBox(p.x, p.y, p.w, p.h, 8)) onHit('أشواك النيص البري في بتّير! -1 ❤️');
      }
    }

    // 52. Wild Wadi Boars (Stage 26: Battir — الخنزير البري الجبلي في وادي المخرور — tusks, bristle mane & brisk trot!)
    if (level.battir_boars) {
      for (const b of level.battir_boars) {
        const prevX = b.x;
        if (stepRepelled(b, 215)) { b.walkDist = (b.walkDist || 0) + Math.abs(b.x - prevX); continue; }
        const dxCat = catCx - (b.x + b.w * 0.5);
        const dyCat = Math.abs(catCy - (b.y + b.h * 0.5));
        const charging = Math.abs(dxCat) < 190 && dyCat < 68;
        b.snortAnim = charging ? Math.min(1, (b.snortAnim || 0) + dt * 4.5) : Math.max(0, (b.snortAnim || 0) - dt * 3.0);
        const spd = (b.speed || 96) * (charging ? 1.42 : 1.0);
        b.x += (b.facing || 1) * spd * dt;
        if (b.x <= b.minX) { b.x = b.minX; b.facing = 1; }
        else if (b.x >= b.maxX) { b.x = b.maxX; b.facing = -1; }
        b.walkDist = (b.walkDist || 0) + Math.abs(b.x - prevX);
        if (hitBox(b.x, b.y, b.w, b.h, 8)) onHit('الخنزير البري في وادي المخرور! -1 ❤️');
      }
    }

    // 53. Crowned Palestinian Hoopoes (Stage 26: Battir — طائر الهدهد الفلسطيني المتوّج — undulating butterfly wave flight!)
    if (level.battir_hoopoes) {
      for (const hp of level.battir_hoopoes) {
        const baseY = hp.baseY !== undefined ? hp.baseY : hp.y;
        hp.y = baseY + Math.sin(timeSec * 2.9 + (hp.phase || 0)) * (hp.ampY || 26);
        if (stepRepelled(hp, 215)) continue;
        const spd = hp.speed || 116;
        hp.x += (hp.facing || 1) * spd * dt;
        if (hp.x <= hp.minX) { hp.x = hp.minX; hp.facing = 1; }
        else if (hp.x >= hp.maxX) { hp.x = hp.maxX; hp.facing = -1; }
        if (hitBox(hp.x, hp.y, hp.w, hp.h, 7)) onHit('طائر الهدهد البري المتوّج! -1 ❤️');
      }
    }

    // 54. Palestinian Golden Cliff Scorpions (Stage 26: Battir — عقرب الصخور الجبلي في الخربة!)
    if (level.battir_scorpions) {
      for (const sc of level.battir_scorpions) {
        const prevX = sc.x;
        if (stepRepelled(sc, 200)) { sc.walkDist = (sc.walkDist || 0) + Math.abs(sc.x - prevX); continue; }
        const dxCat = catCx - (sc.x + sc.w * 0.5);
        const dyCat = Math.abs(catCy - (sc.y + sc.h * 0.5));
        const alert = Math.abs(dxCat) < 160 && dyCat < 60;
        sc.threat = alert ? Math.min(1, (sc.threat || 0) + dt * 5.0) : Math.max(0, (sc.threat || 0) - dt * 3.2);
        const spd = (sc.speed || 88) * (alert ? 1.3 : 1.0);
        sc.x += (sc.facing || 1) * spd * dt;
        if (sc.x <= sc.minX) { sc.x = sc.minX; sc.facing = 1; }
        else if (sc.x >= sc.maxX) { sc.x = sc.maxX; sc.facing = -1; }
        sc.walkDist = (sc.walkDist || 0) + Math.abs(sc.x - prevX);
        if (hitBox(sc.x, sc.y, sc.w, sc.h, 7)) onHit('عقرب صخور قلعة بتّير! -1 ❤️');
      }
    }

    // Universal Runtime Checkpoint Sanctuary Barrier across all extended enemies (Stages 5-25)
    const guardCp = window.Game && window.Game.guardCheckpointZone;
    if (guardCp && level.checkpoints && level.checkpoints.length) {
      const boxLists = [
        level.security_bots, level.pelicans, level.foxes, level.clockwork_beetles,
        level.skunks, level.luna_moths, level.bees, level.hover_saws,
        level.badgers, level.hawks, level.bridge_rovers, level.dobermans,
        level.penguins, level.seals, level.unicycle_monkeys, level.circus_clowns,
        level.sleeping_lions, level.scorpions, level.sand_vipers, level.desert_falcons,
        level.dust_devils, level.tanuki_rascals, level.shiba_guards, level.samurai_crows,
        level.rail_inspectors, level.mail_owls, level.carnival_jesters, level.canal_crabs,
        level.venice_gulls, level.paris_poodles, level.paris_bakers, level.paris_pigeons,
        level.morocco_monkeys, level.morocco_merchants, level.morocco_storks,
        level.maya_jaguars, level.maya_warriors, level.maya_quetzals,
        level.greece_goats, level.greece_hoplites, level.greece_owls,
        level.battir_porcupines, level.battir_boars, level.battir_hoopoes, level.battir_scorpions,
      ];
      for (const list of boxLists) {
        if (!list) continue;
        for (const e of list) guardCp(level, e, false);
      }
      const centerLists = [level.snowballs, level.daruma_rollers, level.coal_sparks];
      for (const list of centerLists) {
        if (!list) continue;
        for (const e of list) guardCp(level, e, true);
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

    // 17. Ultra-Detailed Arctic Emperor Penguin (Sculpted Tuxedo Silhouette, Golden Auricular Collar, Webbed Feet & Dedicated Hydrodynamic Belly-Slide Pose!)
    if (level.penguins) {
      for (const pg of level.penguins) {
        const px = pg.x - camX, py = pg.y - camY;
        if (px < -120 || px > cullW + 120) continue;
        const waddle = time * 10.5 + pg.x * 0.08;
        const sway = Math.sin(waddle) * 0.09;
        const bob = Math.abs(Math.sin(waddle)) * 1.6;
        const step = Math.sin(waddle) * 4.8;

        ctx.save();
        ctx.translate(px + pg.w / 2, py + pg.h);
        ctx.scale(pg.facing || 1, 1);

        // Soft cool shadow on snow/ice
        ctx.fillStyle = 'rgba(12, 74, 110, 0.34)';
        ctx.beginPath(); ctx.ellipse(0, 0, pg.sliding ? 29 : 19, 4.4, 0, 0, Math.PI * 2); ctx.fill();

        if (pg.sliding) {
          // === DEDICATED HYDRODYNAMIC BELLY-SLIDE (TOBOGGANING) POSE ===
          const glideBob = Math.sin(time * 22 + pg.x * 0.1) * 1.1;

          // Sparkling snow-crystal spray & ice wake kicking up behind the sliding penguin
          for (let sp = 0; sp < 6; sp++) {
            const frac = ((time * 2.4 + sp * 0.17) % 1);
            const ox = -22 - frac * 28;
            const oy = -3 - Math.sin(frac * Math.PI) * 14 - (sp % 2) * 3;
            ctx.fillStyle = `rgba(240, 249, 255, ${(0.88 * (1 - frac)).toFixed(2)})`;
            ctx.beginPath(); ctx.arc(ox, oy, 2.8 * (1 - frac * 0.5), 0, Math.PI * 2); ctx.fill();
          }

          ctx.save();
          ctx.translate(0, -10 + glideBob);

          // Kicking orange webbed feet trailing behind
          const kick = Math.sin(time * 24) * 3.5;
          ctx.fillStyle = '#ea580c'; ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(-25, 3 + kick * 0.4, 7.5, 3.2, -0.25, 0, Math.PI * 2);
          ctx.ellipse(-21, 5 - kick * 0.4, 7.5, 3.2, -0.15, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();

          // Streamlined horizontal obsidian-navy dorsal body & pointed tail
          const slideBackG = ctx.createLinearGradient(-26, -15, 24, 6);
          slideBackG.addColorStop(0, '#0f172a');
          slideBackG.addColorStop(0.45, '#1e293b');
          slideBackG.addColorStop(0.85, '#0f172a');
          slideBackG.addColorStop(1, '#020617');
          ctx.fillStyle = slideBackG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(-27, 2);
          ctx.bezierCurveTo(-22, -13, 6, -16, 22, -10);
          ctx.bezierCurveTo(29, -7, 29, 3, 21, 6);
          ctx.quadraticCurveTo(-2, 10, -27, 2);
          ctx.closePath();
          ctx.fill(); ctx.stroke();

          // Snow-white gliding belly & warm golden upper chest
          const slideBellyG = ctx.createLinearGradient(-18, -2, 22, 6);
          slideBellyG.addColorStop(0, '#bae6fd');
          slideBellyG.addColorStop(0.65, '#ffffff');
          slideBellyG.addColorStop(1, '#fef08a');
          ctx.fillStyle = slideBellyG;
          ctx.beginPath();
          ctx.moveTo(-19, 3);
          ctx.quadraticCurveTo(2, 10, 22, 5);
          ctx.quadraticCurveTo(25, 0, 17, -1);
          ctx.quadraticCurveTo(-4, 2, -19, 3);
          ctx.closePath();
          ctx.fill();

          // Sleek craned Emperor head & golden auricular ear patch
          ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.ellipse(21, -7, 9.5, 8.2, -0.12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          const earG = ctx.createRadialGradient(18, -5, 1, 18, -5, 6.2);
          earG.addColorStop(0, '#fde047'); earG.addColorStop(0.65, '#f59e0b'); earG.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = earG;
          ctx.beginPath(); ctx.ellipse(18, -5, 6.2, 4.2, -0.2, 0, Math.PI * 2); ctx.fill();

          // Curved two-tone Emperor beak pointing eagerly forward
          ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.1;
          ctx.beginPath(); ctx.moveTo(28, -9.5); ctx.quadraticCurveTo(36, -8.5, 40, -6); ctx.lineTo(28, -5.5); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#fb7185';
          ctx.beginPath(); ctx.moveTo(28, -6.2); ctx.lineTo(38, -6); ctx.quadraticCurveTo(33, -3.5, 28, -3.8); ctx.closePath(); ctx.fill();

          // Focused expressive eye with crisp catchlight
          ctx.fillStyle = '#020617';
          ctx.beginPath(); ctx.arc(23.2, -9.2, 2.3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(22.6, -9.9, 0.9, 0, Math.PI * 2); ctx.fill();

          // Aerodynamic swept-back flipper wing with pale underside edge
          ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(7, -4);
          ctx.bezierCurveTo(-4, -9, -18, -11, -21, -5);
          ctx.bezierCurveTo(-13, 0, -1, 1, 7, -4);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)'; ctx.lineWidth = 1.1;
          ctx.beginPath(); ctx.moveTo(4, -2); ctx.quadraticCurveTo(-8, -1, -18, -5); ctx.stroke();

          ctx.restore();
        } else {
          // === SCULPTED UPRIGHT EMPEROR PENGUIN WADDLE POSE ===
          ctx.save();
          ctx.translate(0, -1 - bob);
          ctx.rotate(sway);

          // 1. Far Webbed Orange Foot
          const footLiftA = Math.max(0, Math.sin(waddle)) * 2.5;
          const footLiftB = Math.max(0, -Math.sin(waddle)) * 2.5;
          ctx.fillStyle = '#c2410c'; ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-4 - step * 0.45, -4 - footLiftB);
          ctx.lineTo(-10 - step * 0.45, 0 - footLiftB);
          ctx.lineTo(3 - step * 0.45, 0 - footLiftB);
          ctx.quadraticCurveTo(6 - step * 0.45, -2.5 - footLiftB, 1 - step * 0.45, -4 - footLiftB);
          ctx.closePath(); ctx.fill(); ctx.stroke();

          // 2. Far Flipper peeking slightly on chest side
          ctx.save();
          ctx.translate(10, -25);
          ctx.rotate(-0.18 - Math.sin(waddle) * 0.14);
          ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(0, -2); ctx.bezierCurveTo(6, 4, 7, 14, 2, 17); ctx.bezierCurveTo(-2, 14, -2, 4, 0, -2);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.restore();

          // 3. Stiff Pointed Penguin Tail at Lower Back
          ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(-11, -12); ctx.lineTo(-19, -5); ctx.lineTo(-9, -4); ctx.closePath();
          ctx.fill(); ctx.stroke();

          // 4. Sleek Pear-Shaped Emperor Penguin Body & Tapered Neck (Midnight-Navy Dorsal Plumage)
          const bodyG = ctx.createLinearGradient(-15, -46, 15, -4);
          bodyG.addColorStop(0, '#334155');
          bodyG.addColorStop(0.32, '#1e293b');
          bodyG.addColorStop(0.72, '#0f172a');
          bodyG.addColorStop(1, '#020617');
          ctx.fillStyle = bodyG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.7;
          ctx.beginPath();
          ctx.moveTo(-12, -6);
          ctx.bezierCurveTo(-18, -16, -15, -31, -8, -37); // sculpted arched back to tapered neck
          ctx.bezierCurveTo(-10, -45, -3, -50, 4, -49); // rounded crown of head
          ctx.bezierCurveTo(12, -48, 13, -40, 10, -35); // forehead & throat
          ctx.bezierCurveTo(17, -27, 17, -12, 11, -5); // proud plump chest
          ctx.quadraticCurveTo(0, -1, -12, -6);
          ctx.closePath();
          ctx.fill(); ctx.stroke();

          // Subtle midnight-blue feather sheen along back
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(-12, -16); ctx.quadraticCurveTo(-13, -27, -7, -34); ctx.stroke();

          // 5. Crisp Snow-White Belly with Golden Upper-Chest Gradient & Cool Ice-Blue Lower Shading
          const bellyG = ctx.createLinearGradient(3, -36, 3, -3);
          bellyG.addColorStop(0, '#fde047');
          bellyG.addColorStop(0.18, '#fef9c3');
          bellyG.addColorStop(0.36, '#ffffff');
          bellyG.addColorStop(0.82, '#f0f9ff');
          bellyG.addColorStop(1, '#bae6fd');
          ctx.fillStyle = bellyG;
          ctx.beginPath();
          ctx.moveTo(6, -35);
          ctx.bezierCurveTo(15, -28, 16, -13, 10, -5);
          ctx.quadraticCurveTo(1, -2, -5, -6);
          ctx.bezierCurveTo(-8, -16, -4, -29, 6, -35);
          ctx.closePath();
          ctx.fill();

          // 6. Iconic Teardrop Golden-Orange Emperor Auricular (Ear/Neck) Patch
          const earG = ctx.createRadialGradient(2.5, -38.5, 1, 2.5, -38.5, 7);
          earG.addColorStop(0, '#fde047');
          earG.addColorStop(0.55, '#f59e0b');
          earG.addColorStop(0.88, '#ea580c');
          earG.addColorStop(1, 'rgba(234, 88, 12, 0)');
          ctx.fillStyle = earG;
          ctx.beginPath();
          ctx.ellipse(2.5, -38.5, 6.2, 4.4, -0.35, 0, Math.PI * 2);
          ctx.fill();

          // 7. Near Articulated Orange Webbed Foot (3 toes + subtle claw tips)
          ctx.save();
          ctx.translate(3 + step * 0.55, -1 - footLiftA);
          ctx.fillStyle = '#f97316'; ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(-6, -3);
          ctx.lineTo(-7, 1);
          ctx.lineTo(8, 1.2);
          ctx.quadraticCurveTo(10, -1, 5, -3);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          // Subtle webbed toe ridges
          ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.moveTo(-1, -2); ctx.lineTo(3, 1); ctx.moveTo(2, -2); ctx.lineTo(6, 1); ctx.stroke();
          ctx.restore();

          // 8. Sculpted Curved Two-Tone Emperor Beak (Glossy Black Upper + Coral-Rose Lower Mandible)
          ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(9, -43.5);
          ctx.quadraticCurveTo(17, -43.2, 23, -39.8);
          ctx.lineTo(10, -39.2);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#fb7185'; ctx.strokeStyle = '#881337'; ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(10, -39.8);
          ctx.lineTo(20.5, -39.6);
          ctx.quadraticCurveTo(15, -36.8, 9.5, -37.5);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          // Tiny specular highlight along upper beak ridge
          ctx.strokeStyle = 'rgba(226, 232, 240, 0.55)'; ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.moveTo(11, -42.6); ctx.quadraticCurveTo(16, -42.2, 19.5, -40.8); ctx.stroke();

          // 9. Charming Glossy Eye with Soft Rim & Crisp Double Catchlight
          ctx.fillStyle = '#334155';
          ctx.beginPath(); ctx.arc(6.6, -43.2, 3.1, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#020617';
          ctx.beginPath(); ctx.arc(6.8, -43.2, 2.3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(6.0, -44.0, 0.95, 0, Math.PI * 2); ctx.arc(7.6, -42.6, 0.45, 0, Math.PI * 2); ctx.fill();

          // 10. Sleek Curved Blade-Like Flipper Wing with Pale Icy Underside Edge
          ctx.save();
          ctx.translate(-3.5, -29);
          const wingAng = 0.16 + Math.sin(waddle * 1.2) * 0.18;
          ctx.rotate(wingAng);
          const wingG = ctx.createLinearGradient(-7, 0, 5, 19);
          wingG.addColorStop(0, '#334155');
          wingG.addColorStop(0.55, '#0f172a');
          wingG.addColorStop(1, '#020617');
          ctx.fillStyle = wingG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(1, -2);
          ctx.bezierCurveTo(-8, 4, -9, 16, -2, 22);
          ctx.bezierCurveTo(3, 17, 5, 6, 1, -2);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          // Crisp pale-icy leading edge on flipper
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.6)'; ctx.lineWidth = 1.1;
          ctx.beginPath(); ctx.moveTo(2, 1); ctx.quadraticCurveTo(3.5, 11, -1, 20); ctx.stroke();
          ctx.restore();

          ctx.restore();
        }
        ctx.restore();
      }
    }

    // 18. Ultra-Detailed Spotted Arctic Seal (Velvety Dappled Coat, Articulated Flippers, Whiskers & Frosty Breath Puffs!)
    if (level.seals) {
      for (const sl of level.seals) {
        const sx = sl.x - camX, sy = sl.y - (sl.hopY || 0) - camY;
        if (sx < -130 || sx > cullW + 130) continue;
        const undul = time * 8.5 + sl.x * 0.06;
        const arch = Math.sin(undul) * 2.8;
        const flipSwing = Math.sin(undul) * 0.28;

        ctx.save();
        ctx.translate(sx + sl.w / 2, sy + sl.h);
        ctx.scale(sl.facing || 1, 1);

        // Soft ice contact shadow (shrinks during hop!)
        ctx.fillStyle = 'rgba(12, 74, 110, 0.34)';
        ctx.beginPath(); ctx.ellipse(0, sl.hopY || 0, Math.max(16, 30 - (sl.hopY || 0) * 0.35), 4.8, 0, 0, Math.PI * 2); ctx.fill();

        // Fanned Split Rear Tail Flippers
        ctx.save();
        ctx.translate(-26, -8 + arch * 0.4);
        ctx.rotate(-0.18 + Math.sin(undul) * 0.14);
        ctx.fillStyle = '#475569'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -2); ctx.lineTo(-14, -10); ctx.quadraticCurveTo(-12, -1, -6, 1);
        ctx.lineTo(-15, 6); ctx.quadraticCurveTo(-8, 8, 2, 4);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();

        // Sleek Plump Velvety Silver-Grey Seal Body with Soft Pale Belly
        const bodyG = ctx.createLinearGradient(0, -32 - arch, 0, -2);
        bodyG.addColorStop(0, '#cbd5e1');
        bodyG.addColorStop(0.38, '#94a3b8');
        bodyG.addColorStop(0.72, '#64748b');
        bodyG.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = bodyG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(-27, -7);
        ctx.bezierCurveTo(-24, -22 - arch, -6, -30 - arch, 12, -26 - arch * 0.5);
        ctx.bezierCurveTo(22, -23, 25, -12, 18, -5);
        ctx.quadraticCurveTo(-2, -1, -27, -7);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Dappled Arctic Harbor-Seal Charcoal Spots along Back & Flank
        ctx.fillStyle = 'rgba(30, 41, 59, 0.52)';
        for (const [dx, dy, rx, ry] of [[-14, -14, 3.6, 2.2], [-5, -20, 4.2, 2.6], [4, -17, 3.4, 2.1], [-10, -9, 2.8, 1.8], [1, -11, 3.0, 1.9]]) {
          ctx.beginPath(); ctx.ellipse(dx, dy - arch * 0.6, rx, ry, -0.2, 0, Math.PI * 2); ctx.fill();
        }
        // Soft glossy moonlight sheen on wet seal back
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.45)'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(-18, -19 - arch * 0.8); ctx.quadraticCurveTo(-2, -27 - arch, 10, -24 - arch * 0.5); ctx.stroke();

        // Articulated Broad Front Flipper with Subtle Claw Lines
        ctx.save();
        ctx.translate(10, -10);
        ctx.rotate(0.22 + flipSwing);
        ctx.fillStyle = '#64748b'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -3); ctx.bezierCurveTo(10, 0, 14, 9, 4, 12); ctx.quadraticCurveTo(-4, 10, -4, 1);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();

        // Rounded Expressive Seal Head, Plump Whisker Pads, Wet Black Nose & Big Glossy Eyes!
        const headY = -23 - arch * 0.4;
        const headG = ctx.createRadialGradient(20, headY - 4, 2, 19, headY, 13);
        headG.addColorStop(0, '#e2e8f0'); headG.addColorStop(0.65, '#94a3b8'); headG.addColorStop(1, '#475569');
        ctx.fillStyle = headG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.ellipse(19, headY, 11.5, 9.8, -0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Cute plump pale muzzle & wet glossy black nose
        ctx.fillStyle = '#f1f5f9'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(27.5, headY + 2.5, 5.2, 3.8, 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#090d16';
        ctx.beginPath(); ctx.ellipse(31.5, headY + 0.8, 2.8, 2.0, 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath(); ctx.arc(30.8, headY + 0.1, 0.8, 0, Math.PI * 2); ctx.fill();

        // Big Adorable Glossy Dark Seal Eye with Double Catchlight
        ctx.fillStyle = '#090d16';
        ctx.beginPath(); ctx.arc(22.2, headY - 2.6, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(21.2, headY - 3.6, 1.1, 0, Math.PI * 2); ctx.arc(23.1, headY - 1.8, 0.55, 0, Math.PI * 2); ctx.fill();

        // Fine Silvery Seal Whiskers
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.85)'; ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(27, headY + 2.2); ctx.lineTo(35, headY + 0.5);
        ctx.moveTo(27, headY + 3.4); ctx.lineTo(36, headY + 3.4);
        ctx.moveTo(26.5, headY + 4.5); ctx.lineTo(34.5, headY + 6.2);
        ctx.stroke();

        // Visible Cold-Air Frosty Breath Puff drifting from Seal's Nose!
        const puffT = (time * 0.85 + (sl.phase || 0)) % 1.4;
        if (puffT < 0.75) {
          const u = puffT / 0.75;
          ctx.fillStyle = `rgba(224, 242, 254, ${(0.55 * (1 - u)).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(35 + u * 14, headY + 0.5 - u * 8, 2.2 + u * 4.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // 19. Hanging Falling Crystal Icicles (Stage 16 — Translucent Faceted Stalactites, Shiver Glint Telegraph & Smooth Regrow!)
    if (level.falling_icicles) {
      for (const ic of level.falling_icicles) {
        const ix = ic.x - camX;
        if (ix < -80 || ix > cullW + 80) continue;
        const baseY = ic.y - camY;
        const state = ic.state || 'idle';
        const len = ic.len || 54;

        // Frozen frost-collar mount always clinging to underside of ice ledge
        ctx.save();
        ctx.fillStyle = 'rgba(224, 242, 254, 0.78)';
        ctx.beginPath();
        ctx.ellipse(ix, baseY + 1, 13, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();

        if (state === 'respawn') {
          // Smooth crystal regrow animation during the final 0.85s of respawn
          const tLeft = ic.timer || 0;
          if (tLeft < 0.85) {
            const grow = Math.max(0.08, 1 - tLeft / 0.85);
            const gLen = len * grow;
            const gW = 9.5 * grow;
            ctx.globalAlpha = 0.35 + grow * 0.55;
            ctx.fillStyle = 'rgba(186, 230, 253, 0.72)';
            ctx.strokeStyle = 'rgba(240, 249, 255, 0.85)';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(ix - gW, baseY);
            ctx.lineTo(ix, baseY + gLen);
            ctx.lineTo(ix + gW, baseY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
          ctx.restore();
          continue;
        }

        const curY = (ic.curY !== undefined ? ic.curY : ic.y) - camY;
        const shakeX = state === 'shake' ? Math.sin(time * 72 + ic.x) * 2.8 : 0;
        const drawX = ix + shakeX;

        // Shiver Warning Halo + Falling Frost Dust Motes
        if (state === 'shake') {
          const pulse = 0.55 + Math.sin(time * 32) * 0.35;
          const warnG = ctx.createRadialGradient(drawX, curY + len * 0.45, 2, drawX, curY + len * 0.45, 24);
          warnG.addColorStop(0, `rgba(254, 240, 138, ${(0.55 * pulse).toFixed(2)})`);
          warnG.addColorStop(0.55, `rgba(125, 211, 252, ${(0.32 * pulse).toFixed(2)})`);
          warnG.addColorStop(1, 'rgba(125, 211, 252, 0)');
          ctx.fillStyle = warnG;
          ctx.beginPath();
          ctx.ellipse(drawX, curY + len * 0.45, 20, len * 0.65, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tiny cracking ice-powder motes drifting down
          ctx.fillStyle = 'rgba(240, 249, 255, 0.9)';
          for (let d = 0; d < 3; d++) {
            const drop = ((time * 52 + d * 17) % 24);
            ctx.beginPath();
            ctx.arc(drawX + (d - 1) * 5, curY + len * 0.35 + drop, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Crisp Air-Wake Speed Lines when Plummeting
        if (state === 'fall') {
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.58)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(drawX - 6, curY - 4); ctx.lineTo(drawX - 6, curY - 26);
          ctx.moveTo(drawX, curY - 8); ctx.lineTo(drawX, curY - 36);
          ctx.moveTo(drawX + 6, curY - 4); ctx.lineTo(drawX + 6, curY - 24);
          ctx.stroke();
        }

        // Translucent Multi-Faceted Crystal Icicle Spear
        const icG = ctx.createLinearGradient(drawX - 10, curY, drawX + 10, curY + len);
        icG.addColorStop(0, 'rgba(240, 249, 255, 0.92)');
        icG.addColorStop(0.32, 'rgba(186, 230, 253, 0.80)');
        icG.addColorStop(0.75, 'rgba(56, 189, 248, 0.74)');
        icG.addColorStop(1, 'rgba(14, 116, 144, 0.88)');
        ctx.fillStyle = icG;
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.92)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(drawX - 10, curY);
        ctx.lineTo(drawX - 7.5, curY + len * 0.28);
        ctx.lineTo(drawX - 4.2, curY + len * 0.66);
        ctx.lineTo(drawX, curY + len);
        ctx.lineTo(drawX + 4.8, curY + len * 0.62);
        ctx.lineTo(drawX + 8.2, curY + len * 0.24);
        ctx.lineTo(drawX + 10, curY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Dark-cyan shaded right bevel facet for 3D crystal depth
        ctx.fillStyle = 'rgba(12, 74, 110, 0.28)';
        ctx.beginPath();
        ctx.moveTo(drawX + 1, curY + 2);
        ctx.lineTo(drawX + 8, curY + len * 0.24);
        ctx.lineTo(drawX + 4.8, curY + len * 0.62);
        ctx.lineTo(drawX, curY + len);
        ctx.closePath();
        ctx.fill();

        // Bright sunlit left specular crystal ridge + diamond star glint
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(drawX - 5.5, curY + 4);
        ctx.lineTo(drawX - 2.2, curY + len * 0.58);
        ctx.lineTo(drawX - 0.5, curY + len * 0.85);
        ctx.stroke();

        // Side micro-icicle spurs near root
        ctx.fillStyle = 'rgba(224, 242, 254, 0.72)';
        ctx.beginPath();
        ctx.moveTo(drawX - 12, curY); ctx.lineTo(drawX - 9.5, curY + len * 0.26); ctx.lineTo(drawX - 7, curY);
        ctx.moveTo(drawX + 7, curY); ctx.lineTo(drawX + 9.5, curY + len * 0.22); ctx.lineTo(drawX + 12, curY);
        ctx.closePath();
        ctx.fill();

        // Sparkle star glint on shaking or idle icicle
        const glint = Math.sin(time * (state === 'shake' ? 24 : 4.2) + ic.x * 0.09);
        if (glint > 0.35 || state === 'shake') {
          const gr = state === 'shake' ? 5.2 : 3.4;
          const gy = curY + len * 0.34;
          ctx.fillStyle = state === 'shake' ? '#fef08a' : '#ffffff';
          ctx.beginPath();
          ctx.moveTo(drawX - 3, gy - gr); ctx.lineTo(drawX - 2, gy - 1.2); ctx.lineTo(drawX - 3 + gr, gy);
          ctx.lineTo(drawX - 2, gy + 1.2); ctx.lineTo(drawX - 3, gy + gr); ctx.lineTo(drawX - 4, gy + 1.2);
          ctx.lineTo(drawX - 3 - gr, gy); ctx.lineTo(drawX - 4, gy - 1.2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // 20. Giant Rolling Snowballs (Stage 16 — Sculpted 3D Packed-Snow Sphere, Rotating Grooves/Pebbles & Powder-Snow Trail!)
    if (level.snowballs) {
      for (const sb of level.snowballs) {
        const sx = (sb.x !== undefined ? sb.x : sb.startX) - camX;
        const sy = sb.y - camY;
        const r = sb.r || 28;
        const dir = sb.dir || -1;

        // Subtle swirling snow-flurry telegraph at spawn point before rolling out
        if (sb.waiting) {
          const spX = sb.startX - camX;
          if (spX < -100 || spX > cullW + 100) continue;
          if ((sb.waitTimer || 0) < 0.78) {
            const u = 1 - (sb.waitTimer || 0) / 0.78;
            ctx.save();
            ctx.strokeStyle = `rgba(224, 242, 254, ${(0.65 * u).toFixed(2)})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(spX, sy, r * (0.35 + u * 0.65), time * 8, time * 8 + Math.PI * 1.4);
            ctx.stroke();
            ctx.fillStyle = `rgba(240, 249, 255, ${(0.35 * u).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(spX, sy, r * (0.25 + u * 0.5), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          continue;
        }

        if (sx < -120 || sx > cullW + 120) continue;
        ctx.save();

        // Ground contact shadow beneath rolling snowball
        ctx.fillStyle = 'rgba(12, 74, 110, 0.36)';
        ctx.beginPath();
        ctx.ellipse(sx, sy + r - 1, r * 0.92, 5.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Kicked-up powder-snow spray wake & flying snow flakes trailing behind
        for (let p = 0; p < 6; p++) {
          const frac = ((time * 2.8 + p * 0.17) % 1);
          const ox = sx - dir * (r * 0.6 + frac * 34);
          const oy = sy + r - 5 - Math.sin(frac * Math.PI) * 18 - (p % 2) * 4;
          const pr = (4.6 - frac * 2.8) * (p % 2 === 0 ? 1 : 0.72);
          ctx.fillStyle = `rgba(240, 249, 255, ${(0.82 * (1 - frac)).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(ox, oy, Math.max(1.2, pr), 0, Math.PI * 2);
          ctx.fill();
        }

        // Main 3D Sculpted Packed-Snow Sphere
        const ballG = ctx.createRadialGradient(sx - r * 0.32, sy - r * 0.32, r * 0.12, sx, sy, r);
        ballG.addColorStop(0, '#ffffff');
        ballG.addColorStop(0.45, '#f0f9ff');
        ballG.addColorStop(0.78, '#bae6fd');
        ballG.addColorStop(1, '#38bdf8');
        ctx.fillStyle = ballG;
        ctx.strokeStyle = '#0c4a6e';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Clipped Rotating Inner Snow-Pack Ridges, Dimples, Pebbles & Ice-Crystal Shards!
        ctx.save();
        ctx.beginPath();
        ctx.arc(sx, sy, r - 1.2, 0, Math.PI * 2);
        ctx.clip();
        ctx.translate(sx, sy);
        ctx.rotate(sb.angle || 0);

        // Swirling packed-snow compression grooves
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.42)';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.62, 0.2, 2.2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.40, 3.2, 5.4);
        ctx.stroke();

        // Soft packed-snow shadow dimples
        ctx.fillStyle = 'rgba(125, 211, 252, 0.42)';
        for (const [dx, dy, dr] of [[-r * 0.35, -r * 0.18, r * 0.16], [r * 0.32, r * 0.25, r * 0.18], [-r * 0.1, r * 0.48, r * 0.14]]) {
          ctx.beginPath();
          ctx.arc(dx, dy, dr, 0, Math.PI * 2);
          ctx.fill();
        }

        // Embedded tiny Arctic slate pebbles & frosted pine twig rotating with the snowball!
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.ellipse(r * 0.42, -r * 0.28, 3.4, 2.2, 0.4, 0, Math.PI * 2);
        ctx.ellipse(-r * 0.46, r * 0.22, 2.8, 2.0, -0.3, 0, Math.PI * 2);
        ctx.fill();
        // Tiny frosted pine twig
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-r * 0.18, -r * 0.45);
        ctx.lineTo(r * 0.08, -r * 0.56);
        ctx.moveTo(-r * 0.05, -r * 0.51);
        ctx.lineTo(-r * 0.02, -r * 0.64);
        ctx.stroke();

        ctx.restore();

        // Fixed Top-Left Sunlit Snow Specular Highlight Crescent (stays aligned with sky light!)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
        ctx.beginPath();
        ctx.ellipse(sx - r * 0.3, sy - r * 0.36, r * 0.36, r * 0.18, -0.52, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // 21. Unicycling Acrobat Monkey (Spoked Brass Unicycle, Articulated Capuchin, Fez Hat & 3 Juggling Balls!)
    if (level.unicycle_monkeys) {
      for (const mk of level.unicycle_monkeys) {
        const mx = mk.x - camX, my = mk.y - camY;
        if (mx < -100 || mx > cullW + 100) continue;
        const rot = mk.wheelRot || 0;
        const pedalBob = Math.sin(rot * 2) * 1.6;
        ctx.save();
        ctx.translate(mx + mk.w * 0.5, my + mk.h);
        ctx.scale(mk.facing || 1, 1);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.44)';
        ctx.beginPath(); ctx.ellipse(0, 0, 18, 4.2, 0, 0, Math.PI * 2); ctx.fill();

        const wy = -14;
        ctx.save();
        ctx.translate(0, wy); ctx.rotate(rot);
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3.2;
        ctx.beginPath(); ctx.arc(0, 0, 13.5, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 1.1;
        for (let s = 0; s < 6; s++) {
          const a = (s * Math.PI) / 3;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 11, Math.sin(a) * 11); ctx.stroke();
        }
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(0, wy); ctx.lineTo(0, -32 + pedalBob); ctx.stroke();
        ctx.fillStyle = '#7f1d1d'; ctx.strokeStyle = '#1c0a02'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(-8, -34 + pedalBob, 16, 5, 3); ctx.fill(); ctx.stroke();

        ctx.strokeStyle = '#5c2d12'; ctx.lineWidth = 3.4; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-6, -32 + pedalBob);
        ctx.bezierCurveTo(-22, -32 + pedalBob, -24, -48 + pedalBob, -14, -50 + pedalBob + Math.sin(time * 7) * 3);
        ctx.stroke();

        const pX = Math.cos(rot) * 6.5;
        const pY = Math.sin(rot) * 6.5;
        ctx.strokeStyle = '#5c2d12'; ctx.lineWidth = 3.6;
        ctx.beginPath();
        ctx.moveTo(-2, -32 + pedalBob); ctx.lineTo(-4 - pX * 0.5, wy - pY * 0.7);
        ctx.moveTo(2, -32 + pedalBob); ctx.lineTo(4 + pX * 0.5, wy + pY * 0.7);
        ctx.stroke();

        ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#290d05'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.ellipse(1, -39 + pedalBob, 8.5, 9.5, 0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(1, -47 + pedalBob); ctx.lineTo(2, -31 + pedalBob); ctx.stroke();

        const hy = -51 + pedalBob;
        ctx.fillStyle = '#5c2d12'; ctx.strokeStyle = '#240f04'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(-6, hy, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(2, hy, 8.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fde68a';
        ctx.beginPath(); ctx.ellipse(5, hy + 1.2, 5.5, 5.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(6.5, hy - 0.8, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(6, hy - 1.4, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#b91c1c'; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(-4, hy - 7); ctx.lineTo(-2, hy - 15); ctx.lineTo(7, hy - 15); ctx.lineTo(8, hy - 7); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#fde047'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(2, hy - 15); ctx.quadraticCurveTo(-5, hy - 14, -7, hy - 9); ctx.stroke();

        const jCols = ['#38bdf8', '#fde047', '#f472b6'];
        for (let b = 0; b < 3; b++) {
          const ja = time * (mk.dashing ? 9.5 : 6.2) + (b * Math.PI * 2) / 3;
          const jx = 12 + Math.cos(ja) * 11;
          const jy = -52 + pedalBob - Math.abs(Math.sin(ja)) * 20;
          ctx.fillStyle = jCols[b]; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(jx, jy, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.beginPath(); ctx.arc(jx - 1, jy - 1, 1.1, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
    }

    // 22. Vintage Wind-Up Rolling Jester Clown-Bot (Rotating Striped Balance Sphere + Wind-Up Key!)
    if (level.circus_clowns) {
      for (const cl of level.circus_clowns) {
        const cx = cl.x - camX, cy = cl.y - camY;
        if (cx < -100 || cx > cullW + 100) continue;
        const brot = cl.ballRot || 0;
        const bob = Math.sin(time * 9 + cl.x * 0.05) * 1.4;
        ctx.save();
        ctx.translate(cx + cl.w * 0.5, cy + cl.h);
        ctx.scale(cl.facing || 1, 1);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.44)';
        ctx.beginPath(); ctx.ellipse(0, 0, 19, 4.4, 0, 0, Math.PI * 2); ctx.fill();

        const by = -15;
        ctx.save();
        ctx.translate(0, by); ctx.rotate(brot);
        const spG = ctx.createRadialGradient(-4, -4, 2, 0, 0, 14);
        spG.addColorStop(0, '#fef9c3'); spG.addColorStop(0.5, '#fbbf24'); spG.addColorStop(1, '#b45309');
        ctx.fillStyle = spG; ctx.strokeStyle = '#1c0a02'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 13.2, 0, Math.PI * 0.5); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 13.2, Math.PI, Math.PI * 1.5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(-11, -36 + bob);
        const keyScale = Math.cos(time * 8 + cl.x * 0.02);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-8, 0); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(-11, 0, 3.5, Math.max(1.5, Math.abs(keyScale) * 6.5), 0, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();

        const bodyG = ctx.createLinearGradient(-10, -44 + bob, 10, -24 + bob);
        bodyG.addColorStop(0, '#38bdf8'); bodyG.addColorStop(0.5, '#2563eb'); bodyG.addColorStop(1, '#1e3a8a');
        ctx.fillStyle = bodyG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(-10, -43 + bob, 20, 17, [6, 6, 8, 8]); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(3, -36 + bob, 2, 0, Math.PI * 2); ctx.arc(3, -30 + bob, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(0, -43 + bob, 12, 4.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        const hy = -51 + bob;
        ctx.fillStyle = '#fffbeb'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(1, hy, 8.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(9.2, hy + 0.8, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(5, hy - 1.5, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fda4af'; ctx.beginPath(); ctx.arc(4.5, hy + 2.5, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-6, hy - 5); ctx.quadraticCurveTo(-14, hy - 18, -2, hy - 16); ctx.lineTo(1, hy - 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath(); ctx.moveTo(0, hy - 8); ctx.quadraticCurveTo(10, hy - 21, 15, hy - 11); ctx.lineTo(6, hy - 6); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(-2, hy - 16, 2.6, 0, Math.PI * 2); ctx.arc(15, hy - 11, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 23. Museum-Grade Storybook African Circus Lion (Unified Big-Cat Anatomy, Sweeping Layered Mane Cape & Noble Profile!)
    if (level.sleeping_lions) {
      for (const ln of level.sleeping_lions) {
        const lx = ln.x - camX, ly = ln.y - camY;
        if (lx < -170 || lx > cullW + 170) continue;
        const breath = Math.sin(time * 2.0 + (ln.phase || 0)) * 1.6;
        const homeDrawX = (ln.homeX !== undefined ? ln.homeX : ln.x) - camX + ln.w * 0.5;
        const groundY = ly + ln.h;

        // 1. Plush Royal Crimson Velvet Cushion with Gold Cord Piping & Corner Tassels (grounded flush on deck!)
        ctx.save();
        ctx.translate(homeDrawX, groundY);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
        ctx.beginPath(); ctx.ellipse(0, 0, 64, 6.2, 0, 0, Math.PI * 2); ctx.fill();
        const cushG = ctx.createLinearGradient(0, -17, 0, 0);
        cushG.addColorStop(0, '#dc2626');
        cushG.addColorStop(0.35, '#991b1b');
        cushG.addColorStop(0.82, '#6b0f0f');
        cushG.addColorStop(1, '#3b0707');
        ctx.fillStyle = cushG; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-54, -2);
        ctx.quadraticCurveTo(-60, -10, -52, -16);
        ctx.quadraticCurveTo(0, -13, 52, -16);
        ctx.quadraticCurveTo(60, -10, 54, -2);
        ctx.quadraticCurveTo(0, 2, -54, -2);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Subtle sunlit crimson velvet highlight & braided gold cord trim
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-48, -14); ctx.quadraticCurveTo(0, -11, 48, -14); ctx.stroke();
        // Corner gold silk tassels
        ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1;
        for (const side of [-1, 1]) {
          ctx.beginPath(); ctx.arc(side * 56, -7, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(side * 56, -3.5); ctx.lineTo(side * 60, 1.5); ctx.lineTo(side * 53, 1.5); ctx.closePath(); ctx.fill();
        }
        ctx.restore();

        // 2. Sculpted Majestic African Lion Figure (facing +x locally, flipped by ln.facing)
        const standing = !!(ln.awake || ln.returning);
        const wb = standing ? Math.max(0, Math.min(1, ln.walkBlend || 0)) : 0;
        const gait = (ln.walkDist || 0) * 0.135;
        const strideA = Math.sin(gait) * 12.5 * wb;
        const liftA = Math.max(0, Math.cos(gait)) * 6.5 * wb;
        const strideB = Math.sin(gait + Math.PI) * 12.5 * wb;
        const liftB = Math.max(0, Math.cos(gait + Math.PI)) * 6.5 * wb;
        const walkBob = Math.abs(Math.sin(gait)) * 2.6 * wb;
        const bob = standing ? (walkBob + breath * (1 - wb) * 0.7) : breath;
        const roaring = !!(ln.awake && ((ln.roarTimer || 0) > 0 || wb < 0.25));

        ctx.save();
        ctx.translate(lx + ln.w * 0.5, groundY - (standing ? 2 : 11));
        ctx.scale(ln.facing || -1, 1);

        if (standing) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.44)';
          ctx.beginPath(); ctx.ellipse(-2, 2, 50, 6.2, 0, 0, Math.PI * 2); ctx.fill();
        }

        // Helper: Sculpted Anatomically Detailed 3-Toed Big-Cat Lion Paw (knuckles, fleshy toes & pad shadows)
        const drawLionPaw = (px0, py0, rx, ry, dark) => {
          const pG = ctx.createLinearGradient(px0, py0 - ry, px0, py0 + ry);
          if (dark) {
            pG.addColorStop(0, '#a66218'); pG.addColorStop(1, '#6b3a0a');
          } else {
            pG.addColorStop(0, '#f8d784'); pG.addColorStop(0.55, '#dfa138'); pG.addColorStop(1, '#9c6014');
          }
          ctx.fillStyle = pG;
          ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(px0 - rx * 0.95, py0 + ry * 0.65);
          ctx.quadraticCurveTo(px0 - rx * 0.92, py0 - ry * 0.95, px0 + rx * 0.08, py0 - ry * 0.92);
          ctx.quadraticCurveTo(px0 + rx * 1.08, py0 - ry * 0.65, px0 + rx * 1.02, py0 + ry * 0.52);
          ctx.quadraticCurveTo(px0, py0 + ry * 0.92, px0 - rx * 0.95, py0 + ry * 0.65);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          // Subtle toe knuckle highlight & cleft dividers
          if (!dark) {
            ctx.fillStyle = 'rgba(255, 248, 220, 0.45)';
            ctx.beginPath(); ctx.ellipse(px0 + rx * 0.25, py0 - ry * 0.35, rx * 0.42, ry * 0.25, 0.1, 0, Math.PI * 2); ctx.fill();
          }
          ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(px0 + rx * 0.18, py0 - ry * 0.18); ctx.lineTo(px0 + rx * 0.28, py0 + ry * 0.68);
          ctx.moveTo(px0 + rx * 0.58, py0 - ry * 0.12); ctx.lineTo(px0 + rx * 0.66, py0 + ry * 0.58);
          ctx.stroke();
        };

        // Helper: Articulated 3-Segment Feline Hind Leg (Muscular Thigh -> Knee -> Distinct Curved Hock -> Ankle -> Paw)
        const drawHindLeg = (hipX, hipY, strideX, liftY, dark) => {
          const hockX = hipX - 8 + strideX * 0.42;
          const hockY = -15.5 - liftY * 0.45;
          const ankleX = hipX + 1.5 + strideX;
          const ankleY = -3.2 - liftY;
          const legG = ctx.createLinearGradient(hipX - 10, hipY, hipX + 10, ankleY);
          if (dark) {
            legG.addColorStop(0, '#9c5b14'); legG.addColorStop(0.6, '#82490d'); legG.addColorStop(1, '#683808');
          } else {
            legG.addColorStop(0, '#ecc060'); legG.addColorStop(0.45, '#d69430'); legG.addColorStop(1, '#a66818');
          }
          ctx.fillStyle = legG; ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 1.55;
          ctx.beginPath();
          ctx.moveTo(hipX - 7, hipY + 2);
          ctx.bezierCurveTo(hipX - 11, hipY + 11, hockX - 5, hockY - 3, hockX - 4.5, hockY);
          ctx.quadraticCurveTo(hockX - 3, hockY + 7, ankleX - 4.5, ankleY);
          ctx.lineTo(ankleX + 4.2, ankleY);
          ctx.quadraticCurveTo(hockX + 4.5, hockY + 6, hockX + 5.2, hockY - 1);
          ctx.bezierCurveTo(hipX + 13, hipY + 13, hipX + 12, hipY - 3, hipX + 4, hipY - 4);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          if (!dark) {
            // Sculpted muscular thigh contour & warm sunlit outer thigh highlight
            ctx.strokeStyle = 'rgba(255, 248, 220, 0.45)'; ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(hipX - 4, hipY + 1); ctx.quadraticCurveTo(hipX - 7, hipY + 10, hockX - 1.5, hockY - 1);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(92, 42, 8, 0.35)'; ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(hipX + 7, hipY + 4); ctx.quadraticCurveTo(hipX + 4, hipY + 12, hockX + 2, hockY + 2);
            ctx.stroke();
          }
          drawLionPaw(ankleX + 2.5, ankleY, dark ? 7.6 : 8.5, dark ? 4.1 : 4.5, dark);
        };

        // Helper: Articulated 3-Segment Feline Foreleg (Deltoid Shoulder -> Elbow -> Forearm -> Wrist -> Heavy Paw)
        const drawForeLeg = (shX, shY, strideX, liftY, dark) => {
          const elbowX = shX - 3.5 + strideX * 0.28;
          const elbowY = -19.5 - liftY * 0.3;
          const wristX = shX + 1.5 + strideX;
          const wristY = -3.2 - liftY;
          const legG = ctx.createLinearGradient(shX - 8, shY, shX + 8, wristY);
          if (dark) {
            legG.addColorStop(0, '#9c5b14'); legG.addColorStop(0.6, '#82490d'); legG.addColorStop(1, '#683808');
          } else {
            legG.addColorStop(0, '#f2c868'); legG.addColorStop(0.5, '#da9832'); legG.addColorStop(1, '#a96b1a');
          }
          ctx.fillStyle = legG; ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 1.55;
          ctx.beginPath();
          ctx.moveTo(shX - 6.5, shY);
          ctx.quadraticCurveTo(elbowX - 5.5, elbowY, wristX - 4.8, wristY);
          ctx.lineTo(wristX + 4.8, wristY);
          ctx.quadraticCurveTo(elbowX + 6.5, elbowY - 1, shX + 7.5, shY);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          if (!dark) {
            // Defined forearm sinew & front shoulder highlight
            ctx.strokeStyle = 'rgba(255, 248, 220, 0.44)'; ctx.lineWidth = 1.7;
            ctx.beginPath();
            ctx.moveTo(shX + 4.5, shY + 3); ctx.quadraticCurveTo(elbowX + 4, elbowY, wristX + 2.2, wristY - 3);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(92, 42, 8, 0.34)'; ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(elbowX - 2.5, elbowY + 1); ctx.lineTo(wristX - 1.5, wristY - 4);
            ctx.stroke();
          }
          drawLionPaw(wristX + 3, wristY, dark ? 8.1 : 8.9, dark ? 4.2 : 4.7, dark);
        };

        // 2a. Sinuous Tapered Lion Tail with Sculpted Dark Mahogany Brush Tuft
        const tailWave = Math.sin(time * (ln.awake ? 6.5 : ln.returning ? 3.4 : 1.7) + (ln.phase || 0)) * (ln.awake ? 7 : 3.8);
        const tailStartY = standing ? -37 - bob * 0.45 : -16;
        const tailTipX = standing ? -58 : -55;
        const tailTipY = standing ? -45 + tailWave : -26 + tailWave;
        ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 6.2; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-38, tailStartY);
        ctx.bezierCurveTo(-50, tailStartY + 14, -64, tailStartY + 2 + tailWave, tailTipX, tailTipY);
        ctx.stroke();
        ctx.strokeStyle = '#d99a36'; ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(-38, tailStartY);
        ctx.bezierCurveTo(-50, tailStartY + 14, -64, tailStartY + 2 + tailWave, tailTipX, tailTipY);
        ctx.stroke();
        // Teardrop dark mahogany brush tuft
        ctx.save();
        ctx.translate(tailTipX, tailTipY);
        ctx.rotate(standing ? -0.55 : -0.35);
        ctx.fillStyle = '#3b1506'; ctx.strokeStyle = '#1c0902'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-2, 0);
        ctx.bezierCurveTo(-4, -6, -12, -5, -15, 0);
        ctx.bezierCurveTo(-11, 5, -4, 5, -2, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(-4, -1); ctx.lineTo(-11, -1); ctx.stroke();
        ctx.restore();

        // Rich Painterly Golden-Tawny Lion Coat Gradient
        const coatG = ctx.createLinearGradient(0, -54 - bob, 0, -4);
        coatG.addColorStop(0, '#f8d37c');
        coatG.addColorStop(0.32, '#e3a840');
        coatG.addColorStop(0.72, '#c07e22');
        coatG.addColorStop(1, '#8a5010');

        if (standing) {
          // === STANDING / PROWLING / WALKING HOME BIG-CAT BODY ===
          // 1. Far shaded diagonal-pair legs behind torso
          drawHindLeg(-31, -33 - bob * 0.35, strideB * 0.9, liftB, true);
          drawForeLeg(18, -32 - bob * 0.45, strideA * 0.9, liftA, true);

          // 2. Anatomically Sculpted Big-Cat Torso (Raised Withers/Scapula, Supple Spine, Deep Chest, Tucked Athletic Flank & Muscular Haunch)
          const scapLift = liftB * 0.25;
          ctx.fillStyle = coatG; ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 1.75;
          ctx.beginPath();
          ctx.moveTo(-42, -35 - bob * 0.4);                                                                  // tail root / rump
          ctx.bezierCurveTo(-39, -46 - bob * 0.7, -26, -47 - bob * 0.8, -14, -45 - bob * 0.9);              // muscular croup -> lower back
          ctx.bezierCurveTo(-2, -43.5 - bob * 0.9, 8, -51.5 - bob - scapLift, 21, -50 - bob - scapLift);    // supple sway -> raised lion shoulder withers!
          ctx.bezierCurveTo(31, -48 - bob * 0.8, 34, -36 - bob * 0.5, 29, -22 - bob * 0.35);                // deep powerful lion chest
          ctx.bezierCurveTo(20, -16 - bob * 0.3, 6, -18 - bob * 0.3, -4, -22.5 - bob * 0.3);                // ribcage tapering into lean athletic flank tuck!
          ctx.bezierCurveTo(-15, -26.5 - bob * 0.3, -29, -22 - bob * 0.3, -38, -24 - bob * 0.3);            // tucked waist -> groin -> hip
          ctx.quadraticCurveTo(-43, -28 - bob * 0.35, -42, -35 - bob * 0.4);
          ctx.closePath(); ctx.fill(); ctx.stroke();

          // Warm sunlit golden dorsal ridge highlight along spine & croup
          ctx.strokeStyle = 'rgba(255, 250, 224, 0.52)'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(-36, -41.5 - bob * 0.6);
          ctx.bezierCurveTo(-22, -45.5 - bob * 0.8, -4, -43 - bob * 0.9, 14, -48 - bob - scapLift);
          ctx.stroke();

          // Soft cream-ivory feline underbelly & subtle ribcage/flank musculature shading
          ctx.fillStyle = 'rgba(254, 243, 199, 0.58)';
          ctx.beginPath();
          ctx.moveTo(-16, -24.5 - bob * 0.3);
          ctx.bezierCurveTo(-4, -21 - bob * 0.3, 10, -17.5 - bob * 0.3, 21, -20.5 - bob * 0.3);
          ctx.quadraticCurveTo(6, -23.5 - bob * 0.3, -16, -24.5 - bob * 0.3);
          ctx.fill();
          // Subtle anatomical flank hollow & ribcage shadow
          ctx.strokeStyle = 'rgba(110, 52, 10, 0.30)'; ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(-14, -36 - bob * 0.6); ctx.quadraticCurveTo(-8, -28 - bob * 0.4, -18, -24 - bob * 0.3);
          ctx.moveTo(2, -39 - bob * 0.6); ctx.quadraticCurveTo(6, -30 - bob * 0.4, 1, -22 - bob * 0.3);
          ctx.stroke();

          // 3. Near Articulated Muscular Legs (diagonal pair opposite to far legs)
          drawHindLeg(-33, -34 - bob * 0.4, strideA, liftA, false);
          drawForeLeg(15, -33 - bob * 0.5 - scapLift * 0.5, strideB, liftB, false);

          // Subtle near shoulder-blade (scapula) contour over upper foreleg
          ctx.strokeStyle = 'rgba(92, 42, 8, 0.34)'; ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(7, -43 - bob * 0.8 - scapLift); ctx.quadraticCurveTo(18, -38 - bob * 0.6, 20, -29 - bob * 0.4);
          ctx.stroke();
        } else {
          // === SLEEPING / REGAL SPHINX LOUNGING LION BODY ===
          // Far stretched foreleg & paw peeking ahead for natural 3D depth
          ctx.fillStyle = '#a8691a'; ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(16, -13); ctx.quadraticCurveTo(32, -13.5, 44, -6.5); ctx.lineTo(44, -1); ctx.lineTo(14, -2);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          drawLionPaw(43, -4, 8.6, 4.2, true);

          // Sweeping Regal Resting Lion Body (sculpted shoulder withers -> supple ribcage -> rounded hip haunch)
          ctx.fillStyle = coatG; ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 1.75;
          ctx.beginPath();
          ctx.moveTo(-45, -5);
          ctx.bezierCurveTo(-47, -25 - breath * 0.5, -33, -36 - breath * 0.8, -16, -34 - breath);
          ctx.bezierCurveTo(-2, -32.5 - breath, 8, -38 - breath * 0.8, 22, -36 - breath * 0.6);
          ctx.bezierCurveTo(33, -33 - breath * 0.4, 35, -12, 24, -2);
          ctx.quadraticCurveTo(-8, 1.5, -45, -5);
          ctx.closePath(); ctx.fill(); ctx.stroke();

          // Warm sunlit dorsal spine highlight & soft cream belly fold
          ctx.strokeStyle = 'rgba(255, 250, 224, 0.50)'; ctx.lineWidth = 2.3; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(-36, -30 - breath * 0.7);
          ctx.quadraticCurveTo(-12, -34 - breath, 12, -35 - breath * 0.7);
          ctx.stroke();
          ctx.fillStyle = 'rgba(254, 243, 199, 0.46)';
          ctx.beginPath();
          ctx.ellipse(2, -5.5, 16, 4.2, 0, 0, Math.PI * 2); ctx.fill();

          // Sculpted folded muscular hind thigh, bent hock & tucked hind paw
          const thG = ctx.createLinearGradient(-42, -28, -16, -2);
          thG.addColorStop(0, '#e3a840'); thG.addColorStop(0.6, '#c48124'); thG.addColorStop(1, '#925612');
          ctx.fillStyle = thG; ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 1.55;
          ctx.beginPath();
          ctx.moveTo(-43, -8);
          ctx.bezierCurveTo(-43, -27 - breath * 0.4, -20, -29 - breath * 0.4, -15, -10);
          ctx.quadraticCurveTo(-26, -2, -43, -8);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          // Subtle hip muscle highlight
          ctx.strokeStyle = 'rgba(255, 248, 220, 0.42)'; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(-37, -19 - breath * 0.3); ctx.quadraticCurveTo(-28, -24 - breath * 0.3, -21, -15); ctx.stroke();
          drawLionPaw(-14, -4, 8.6, 4.4, false);

          // Near Sculpted Foreleg with Elbow Contour stretching gracefully forward onto the cushion!
          ctx.fillStyle = coatG; ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 1.55;
          ctx.beginPath();
          ctx.moveTo(9, -15);
          ctx.bezierCurveTo(18, -16, 28, -11.5, 38, -8);
          ctx.lineTo(38, -1);
          ctx.quadraticCurveTo(22, 1.5, 7, -2);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = 'rgba(92, 42, 8, 0.34)'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(11, -11); ctx.quadraticCurveTo(20, -10, 28, -7); ctx.stroke();
          drawLionPaw(38, -4, 9.4, 4.7, false);
        }

        // 3. SWEEPING UNIFIED ROYAL LION MANE CAPE (Flowing Organic Tufts — ZERO Disconnected Ovals!)
        const headX = standing ? 26 : 22;
        const headY = standing ? -43 - bob : -23 - breath * 0.6;
        ctx.save();
        ctx.translate(headX, headY);

        // Outer Deep Chestnut-Umber Sweeping Mane Cloak (continuous sculpted multi-tuft silhouette!)
        const maneOuterG = ctx.createLinearGradient(-28, -24, 16, 28);
        maneOuterG.addColorStop(0, '#7c2d12');
        maneOuterG.addColorStop(0.45, '#591c09');
        maneOuterG.addColorStop(0.85, '#3b1205');
        maneOuterG.addColorStop(1, '#240a02');
        ctx.fillStyle = maneOuterG; ctx.strokeStyle = '#1c0802'; ctx.lineWidth = 1.7;
        ctx.beginPath();
        // Starts at brow crest, sweeps back over crown & shoulders in dynamic curved hair-tuft points, flows down deep chest bib!
        ctx.moveTo(10, -14);
        ctx.quadraticCurveTo(2, -24, -10, -22);      // proud forehead crest
        ctx.quadraticCurveTo(-18, -25, -24, -16);    // upper crown lock
        ctx.quadraticCurveTo(-34, -14, -36, -4);     // upper back sweeping tuft
        ctx.quadraticCurveTo(-40, 4, -32, 12);       // mid-shoulder sweeping lock
        ctx.quadraticCurveTo(-30, 22, -18, 22);      // lower shoulder lock
        ctx.quadraticCurveTo(-10, 32, 2, 28);        // deep chest mane ruff
        ctx.quadraticCurveTo(14, 29, 18, 18);        // lower throat sweep
        ctx.quadraticCurveTo(22, 10, 18, 2);         // cheek frame
        ctx.quadraticCurveTo(18, -8, 10, -14);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Mid-Layer Warm Russet-Sienna Inner Mane Collar framing the face & chest
        const maneMidG = ctx.createLinearGradient(-16, -18, 12, 20);
        maneMidG.addColorStop(0, '#c25918');
        maneMidG.addColorStop(0.55, '#9a3412');
        maneMidG.addColorStop(1, '#5c1d09');
        ctx.fillStyle = maneMidG;
        ctx.beginPath();
        ctx.moveTo(9, -12);
        ctx.quadraticCurveTo(0, -19, -10, -16);
        ctx.quadraticCurveTo(-22, -12, -25, -2);
        ctx.quadraticCurveTo(-26, 10, -14, 17);
        ctx.quadraticCurveTo(-2, 24, 10, 18);
        ctx.quadraticCurveTo(16, 10, 14, -2);
        ctx.closePath(); ctx.fill();

        // Flowing Painterly Golden-Amber Hair-Strand Highlights sweeping back along the mane!
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.42)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-4, -18); ctx.quadraticCurveTo(-18, -14, -29, -4);
        ctx.moveTo(-8, -10); ctx.quadraticCurveTo(-22, -4, -28, 9);
        ctx.moveTo(-6, 4); ctx.quadraticCurveTo(-16, 14, -10, 22);
        ctx.moveTo(2, 12); ctx.quadraticCurveTo(-2, 21, 8, 24);
        ctx.stroke();

        // 4. NOBLE REGAL LION HEAD (Side-3/4 Profile — Sloping Roman Nose Bridge, Sculpted Cheek, Hinged Jaw!)
        // Far ear peeking slightly above brow crest
        ctx.fillStyle = '#3b1506';
        ctx.beginPath(); ctx.arc(4, -15, 4.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#d99a36';
        ctx.beginPath(); ctx.arc(4, -14.5, 3.2, 0, Math.PI * 2); ctx.fill();

        // Near rounded feline ear nestled naturally in upper mane (dark outer rim + warm cream inner tuft!)
        ctx.fillStyle = '#290d02'; ctx.strokeStyle = '#1c0802'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(-9, -13, 5.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e5aa42';
        ctx.beginPath(); ctx.arc(-8.6, -12.5, 4.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath(); ctx.arc(-7.8, -12, 2.1, 0, Math.PI * 2); ctx.fill();

        // Sculpted Noble Feline Skull, Sloping Roman Nose Bridge & Strong Muzzle
        const headG = ctx.createLinearGradient(-4, -14, 24, 12);
        headG.addColorStop(0, '#f8d682');
        headG.addColorStop(0.55, '#e0a53e');
        headG.addColorStop(1, '#b8761c');
        ctx.fillStyle = headG; ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-6, -10);                       // back of crown
        ctx.quadraticCurveTo(4, -14, 12, -8);      // proud sculpted brow ridge
        ctx.lineTo(23, -2);                        // regal straight Roman lion nose bridge!
        ctx.quadraticCurveTo(26, 2, 23, 6);        // strong squared upper muzzle front
        ctx.quadraticCurveTo(16, 8, 9, 6);         // upper lip line
        if (!roaring) {
          ctx.quadraticCurveTo(14, 12, 8, 12);     // calm closed chin
          ctx.quadraticCurveTo(-4, 13, -9, 3);     // jaw & cheek curve
        } else {
          ctx.lineTo(5, 5);                        // corner of roaring mouth
          ctx.quadraticCurveTo(-5, 11, -9, 2);     // cheek curve
        }
        ctx.quadraticCurveTo(-11, -5, -6, -10);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Plump Cream-Ivory Muzzle Pad & Triangular Rose-Brown Lion Nose
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath(); ctx.ellipse(17, 4, 6.2, 3.6, 0.08, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#3b1506';
        ctx.beginPath();
        ctx.moveTo(20, -2.5); ctx.lineTo(25.2, -1); ctx.quadraticCurveTo(23.5, 3, 21, 2.5);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(217, 119, 6, 0.55)';
        ctx.beginPath(); ctx.arc(22.5, -0.8, 1.1, 0, Math.PI * 2); ctx.fill();

        if (roaring) {
          // Authentic Hinged Lower Jaw Opening Downward for a Fierce Roar!
          ctx.fillStyle = '#6b0f1a'; ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(6, 5);
          ctx.lineTo(22, 6);
          ctx.quadraticCurveTo(20, 15, 10, 15);
          ctx.quadraticCurveTo(4, 12, 6, 5);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          // Curved rose tongue inside roaring mouth
          ctx.fillStyle = '#e11d48';
          ctx.beginPath(); ctx.ellipse(13, 12.5, 5, 2.2, 0.15, 0, Math.PI * 2); ctx.fill();
          // Sculpted lower chin & cream beard
          ctx.fillStyle = '#f8d682'; ctx.strokeStyle = '#3b1806'; ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(5, 12); ctx.quadraticCurveTo(14, 16, 21, 14);
          ctx.quadraticCurveTo(18, 18.5, 9, 17.5); ctx.quadraticCurveTo(2, 16, 3, 11);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          // Sleek sharp ivory canine fangs (upper & lower)
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(18.5, 5.5); ctx.lineTo(20, 10.5); ctx.lineTo(21.4, 5.8);
          ctx.moveTo(17.5, 14.2); ctx.lineTo(18.8, 10.8); ctx.lineTo(20, 14.2);
          ctx.closePath(); ctx.fill();
        } else {
          // Composed closed chin & serene mouth line (when walking calmly home or sleeping)
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath(); ctx.ellipse(12, 10, 5.2, 2.4, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#5c2d12'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(19, 5.5); ctx.quadraticCurveTo(15, 8.2, 10, 7.2); ctx.stroke();
        }

        if (standing) {
          // Noble Almond-Shaped Predator Eye (Amber Iris, Vertical Slit, Crisp Catchlight & Brow Ridge!)
          ctx.fillStyle = '#fde047'; ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(4.5, -5.5); ctx.quadraticCurveTo(9, -8.5, 13.5, -5);
          ctx.quadraticCurveTo(9, -2.2, 4.5, -5.5);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#090d16';
          ctx.beginPath(); ctx.ellipse(9.5, -5.4, 1.1, 2.2, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(8.5, -6.2, 0.75, 0, Math.PI * 2); ctx.fill();
          // Sculpted brow ridge (fiercer when chasing, calmer when walking back)
          ctx.strokeStyle = '#451a03'; ctx.lineWidth = ln.awake ? 2 : 1.4;
          ctx.beginPath(); ctx.moveTo(3.5, ln.awake ? -8 : -7.5); ctx.quadraticCurveTo(9, -9.5, 14.5, ln.awake ? -6.5 : -7); ctx.stroke();
        } else {
          // Peaceful Sleeping Almond Eyelid with Subtle Dark Lashes
          ctx.fillStyle = 'rgba(254, 243, 199, 0.55)';
          ctx.beginPath(); ctx.ellipse(9, -4, 4.2, 2.5, -0.1, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1.9; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(5, -4.5); ctx.quadraticCurveTo(9.2, -1.6, 13.4, -4.5);
          ctx.stroke();
        }

        // Subtle Whisker Follicle Spots & Fine Silvery Lion Whiskers
        ctx.fillStyle = 'rgba(69, 26, 3, 0.45)';
        for (const [wx, wy] of [[15, 3.2], [18, 4.2], [16.5, 5.2]]) {
          ctx.beginPath(); ctx.arc(wx, wy, 0.7, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = 'rgba(255, 251, 235, 0.72)'; ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(17, 3.5); ctx.lineTo(29, 2);
        ctx.moveTo(17, 5); ctx.lineTo(30, 5.5);
        ctx.moveTo(16, 6.5); ctx.lineTo(28, 8.5);
        ctx.stroke();

        ctx.restore(); // end head & mane
        ctx.restore(); // end lion

        // Floating translucent 'Zzz' sleep bubbles drifting up ONLY when truly asleep on cushion!
        if (!standing) {
          const zPhase = (time * 0.72 + (ln.phase || 0)) % 1.6;
          if (zPhase < 1.3) {
            const zu = zPhase / 1.3;
            ctx.save();
            ctx.fillStyle = `rgba(254, 249, 195, ${(0.88 * (1 - zu)).toFixed(2)})`;
            ctx.font = `bold ${Math.round(12 + zu * 7)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Z', lx + ln.w * 0.5 + Math.sin(time * 3) * 6, ly - 8 - zu * 28);
            ctx.restore();
          }
        }
      }
    }

    // 24. Flaming Circus Fire Hoops (Wrought-Iron Ring, Embers Telegraph & Roaring Multi-Layer Flames!)
    if (level.fire_hoops) {
      for (const fh of level.fire_hoops) {
        const fx = fh.x - camX, fy = fh.y - camY;
        if (fx < -120 || fx > cullW + 120) continue;
        const r = fh.r || 44;
        const st = fh.state || 'calm';
        ctx.save();
        ctx.translate(fx, fy);

        // Grounded gilded iron pedestal for deck hoops OR overhead iron suspension chain for aerial hoops!
        if (fh.y >= 520) {
          ctx.strokeStyle = '#334155'; ctx.lineWidth = 4.2;
          ctx.beginPath(); ctx.moveTo(0, r); ctx.lineTo(0, r + 24); ctx.stroke();
          ctx.fillStyle = '#92400e'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.roundRect(-14, r + 18, 28, 7, 3); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(0, r + 2, 4.5, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2.6;
          ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, -r - 220); ctx.stroke();
          ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(0, -r - 2, 4.5, 0, Math.PI * 2); ctx.fill();
        }

        if (st === 'blaze' || st === 'warn') {
          const glowR = st === 'blaze' ? r + 32 : r + 18;
          const fGlow = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, glowR);
          fGlow.addColorStop(0, st === 'blaze' ? 'rgba(249, 115, 22, 0.36)' : 'rgba(254, 240, 138, 0.22)');
          fGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = fGlow; ctx.beginPath(); ctx.arc(0, 0, glowR, 0, Math.PI * 2); ctx.fill();
        }

        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = st === 'blaze' ? '#fde047' : st === 'warn' ? '#f59e0b' : '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();

        const count = st === 'blaze' ? 18 : st === 'warn' ? 12 : 8;
        for (let k = 0; k < count; k++) {
          const a = (k / count) * Math.PI * 2 + time * (st === 'blaze' ? 2.4 : 0.8);
          const px0 = Math.cos(a) * r;
          const py0 = Math.sin(a) * r;
          const flick = Math.sin(time * 18 + k * 1.9) * 3.5;
          const fhLen = st === 'blaze' ? (16 + flick) : st === 'warn' ? (9 + flick * 0.5) : (4 + flick * 0.25);
          ctx.save();
          ctx.translate(px0, py0);
          ctx.fillStyle = st === 'blaze' ? '#ef4444' : '#f97316';
          ctx.beginPath();
          ctx.moveTo(-5, 2); ctx.quadraticCurveTo(0, -fhLen * 1.4, 5, 2); ctx.closePath(); ctx.fill();
          ctx.fillStyle = st === 'blaze' ? '#fef08a' : '#fde68a';
          ctx.beginPath();
          ctx.moveTo(-2.5, 1); ctx.quadraticCurveTo(0, -fhLen * 0.85, 2.5, 1); ctx.closePath(); ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }
    }

    // 25. High-Craft Desert Stalker Scorpion (Unified Sculpted Carapace, Interlocking Tapered Tail, Arachnid Legs & Crescent Pincers!)
    if (level.scorpions) {
      for (const sc of level.scorpions) {
        const sx = sc.x - camX, sy = sc.y - camY;
        if (sx < -120 || sx > cullW + 120) continue;
        const standing = !!(sc.awake || sc.returning);
        const wb = standing ? Math.max(0, Math.min(1, sc.walkBlend || 0)) : 0;
        const gait = (sc.walkDist || 0) * 0.25;

        ctx.save();
        ctx.translate(sx + sc.w * 0.5, sy + sc.h);
        ctx.scale(sc.facing || -1, 1);

        // Grounded desert contact shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.40)';
        ctx.beginPath(); ctx.ellipse(2, 0, 35, 5, 0, 0, Math.PI * 2); ctx.fill();

        // Helper: Sleek knee-up arachnid leg (rising femur -> sharp patella knee -> slender angled tibia -> tarsus claw!)
        const drawArachnidLeg = (hipX, spreadX, phaseOff, dark) => {
          const step = Math.sin(gait + phaseOff) * 6.5 * wb;
          const lift = Math.max(0, Math.cos(gait + phaseOff)) * 4.5 * wb;
          const hipY = -12;
          const kneeX = hipX + spreadX * 0.48 + step * 0.4;
          const kneeY = -22 - lift * 0.65;
          const ankleX = hipX + spreadX * 0.92 + step * 0.85;
          const ankleY = -8 - lift * 0.85;
          const footX = hipX + spreadX * 1.15 + step;
          const footY = -0.8 - lift;

          ctx.strokeStyle = '#1c0802'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.lineWidth = dark ? 4.2 : 4.8;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY); ctx.lineTo(kneeX, kneeY); ctx.lineTo(ankleX, ankleY); ctx.lineTo(footX, footY);
          ctx.stroke();

          ctx.strokeStyle = dark ? '#5c280a' : '#c9781c';
          ctx.lineWidth = dark ? 2.2 : 2.7;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY); ctx.lineTo(kneeX, kneeY); ctx.lineTo(ankleX, ankleY); ctx.lineTo(footX, footY);
          ctx.stroke();
        };

        // Helper: Sculpted Pedipalp Arm & Sleek Curved Crescent Pincer Claw
        const drawPincerArm = (ox, oy, scale, snapAng, dark) => {
          ctx.save();
          ctx.translate(ox, oy);
          ctx.scale(scale, scale);
          // Reaching upper arm & elbow
          ctx.fillStyle = dark ? '#5c280a' : '#b45309';
          ctx.strokeStyle = '#1c0802'; ctx.lineWidth = 1.35;
          ctx.beginPath();
          ctx.moveTo(0, -2.5); ctx.quadraticCurveTo(9, -8, 17, -4);
          ctx.lineTo(16, 1.5); ctx.quadraticCurveTo(8, -2, 0, 2);
          ctx.closePath(); ctx.fill(); ctx.stroke();

          // Broad sculpted teardrop chela palm + twin inward-curving dark-tipped crescent blades
          ctx.translate(18, -1.5);
          // Upper crescent jaw
          ctx.save(); ctx.rotate(-0.14 - snapAng);
          ctx.fillStyle = dark ? '#78350f' : '#d97706';
          ctx.beginPath();
          ctx.moveTo(0, -1); ctx.bezierCurveTo(6, -8, 15, -7, 20, -1.5);
          ctx.bezierCurveTo(14, -3.5, 8, -2, 0, 1.5);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.restore();
          // Lower crescent jaw
          ctx.save(); ctx.rotate(0.14 + snapAng);
          ctx.fillStyle = dark ? '#451a03' : '#92400e';
          ctx.beginPath();
          ctx.moveTo(0, 1); ctx.bezierCurveTo(6, 8, 15, 7, 20, 1.5);
          ctx.bezierCurveTo(14, 3.5, 8, 2, 0, -1.5);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.restore();
          // Glossy bulbous chela palm
          const palmG = ctx.createRadialGradient(0, -2, 1, 1, 0, 7);
          palmG.addColorStop(0, dark ? '#92400e' : '#fcd34d');
          palmG.addColorStop(0.6, dark ? '#5c280a' : '#b45309');
          palmG.addColorStop(1, '#290d02');
          ctx.fillStyle = palmG;
          ctx.beginPath(); ctx.ellipse(1, 0, 6.2, 4.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.restore();
        };

        const snap = sc.awake ? Math.abs(Math.sin(time * 11)) * 0.36 : 0.08;

        // 1. Far Shaded Legs & Far Pincer Arm behind carapace
        drawArachnidLeg(-14, -14, Math.PI + 0.0, true);
        drawArachnidLeg(-6, -8, Math.PI + 1.4, true);
        drawArachnidLeg(2, 4, Math.PI + 2.8, true);
        drawArachnidLeg(10, 12, Math.PI + 4.2, true);
        drawPincerArm(15, -16, 0.86, snap * 0.85, true);

        // 2. Unified Sleek Sculpted Armored Carapace (Continuous Contour + Engraved Tergite Grooves!)
        const carG = ctx.createLinearGradient(0, -24, 0, -6);
        carG.addColorStop(0, '#fcd34d');
        carG.addColorStop(0.28, '#d97706');
        carG.addColorStop(0.72, '#78350f');
        carG.addColorStop(1, '#290d02');
        ctx.fillStyle = carG; ctx.strokeStyle = '#1c0802'; ctx.lineWidth = 1.55;
        ctx.beginPath();
        ctx.moveTo(-24, -14);                                      // tail root
        ctx.bezierCurveTo(-18, -22, -4, -24.5, 10, -22.5);         // arched mesosoma dorsal armor
        ctx.bezierCurveTo(18, -21.5, 24, -18, 25, -13);            // flat prosoma head shield
        ctx.bezierCurveTo(22, -8, 10, -7, -6, -8.5);               // tucked armored underside
        ctx.quadraticCurveTo(-18, -9.5, -24, -14);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Warm glossy chitin ridge highlight along spine + crisp engraved armor segment seams
        ctx.strokeStyle = 'rgba(255, 251, 235, 0.42)'; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-16, -18.5); ctx.quadraticCurveTo(0, -22, 16, -19); ctx.stroke();
        ctx.strokeStyle = 'rgba(28, 8, 2, 0.72)'; ctx.lineWidth = 1.3;
        for (const sx0 of [-15, -8, -1, 6, 13]) {
          ctx.beginPath(); ctx.moveTo(sx0 + 1, -21.5); ctx.quadraticCurveTo(sx0 - 2.5, -15, sx0, -9); ctx.stroke();
        }
        // Glinting tiny scorpion eyes on head shield
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(19, -16.5, 1.4, 0, Math.PI * 2); ctx.arc(22.5, -15, 1.1, 0, Math.PI * 2); ctx.fill();

        // 3. Interlocking Tapered Curved Metasoma Tail (5 Sculpted Chitinous Plates curving over the back!)
        const raise = sc.awake ? 5.5 : 0;
        const tSway = Math.sin(time * (sc.awake ? 9.5 : 2.4) + (sc.phase || 0)) * 2.5;
        const spine = [
          [-22, -14.5],
          [-30, -20.5],
          [-33, -30 - raise * 0.35],
          [-28, -40 - raise * 0.75],
          [-18 + tSway * 0.5, -46 - raise],
          [-6 + tSway, -45 - raise],
        ];
        const widths = [5.4, 4.8, 4.3, 3.8, 3.3, 2.8];
        for (let k = 0; k < spine.length - 1; k++) {
          const [x0, y0] = spine[k], [x1, y1] = spine[k + 1];
          const dx = x1 - x0, dy = y1 - y0;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len, ny = dx / len;
          const w0 = widths[k], w1 = widths[k + 1];
          const segG = ctx.createLinearGradient(x0 + nx * w0, y0 + ny * w0, x0 - nx * w0, y0 - ny * w0);
          segG.addColorStop(0, '#fcd34d'); segG.addColorStop(0.45, '#b45309'); segG.addColorStop(1, '#3b1506');
          ctx.fillStyle = segG; ctx.strokeStyle = '#1c0802'; ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(x0 + nx * w0, y0 + ny * w0);
          ctx.lineTo(x1 + nx * w1, y1 + ny * w1);
          ctx.lineTo(x1 - nx * w1, y1 - ny * w1);
          ctx.lineTo(x0 - nx * w0, y0 - ny * w0);
          ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        // Teardrop Crimson-Amber Venom Vesicle (Telson) & Razor Curved Obsidian Stinger
        const [tipX, tipY] = spine[spine.length - 1];
        const telG = ctx.createRadialGradient(tipX - 1.5, tipY - 1.5, 1, tipX, tipY, 6.2);
        telG.addColorStop(0, sc.awake ? '#fca5a5' : '#fde68a');
        telG.addColorStop(0.55, sc.awake ? '#dc2626' : '#b45309');
        telG.addColorStop(1, '#3b0707');
        ctx.fillStyle = telG; ctx.strokeStyle = '#1c0802'; ctx.lineWidth = 1.25;
        ctx.beginPath(); ctx.ellipse(tipX + 1.5, tipY + 0.5, 5.8, 3.8, 0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.moveTo(tipX + 6, tipY - 1.2);
        ctx.bezierCurveTo(tipX + 14, tipY - 0.5, tipX + 15, tipY + 5.5, tipX + 11.5, tipY + 9);
        ctx.bezierCurveTo(tipX + 11, tipY + 4.5, tipX + 8.5, tipY + 2.8, tipX + 4.5, tipY + 2.6);
        ctx.closePath(); ctx.fill();

        // 4. Near Lit 4 Arachnid Legs & Near Sculpted Pincer Arm
        drawArachnidLeg(-15, -16, 0.0, false);
        drawArachnidLeg(-7, -9, 1.4, false);
        drawArachnidLeg(1, 5, 2.8, false);
        drawArachnidLeg(9, 13, 4.2, false);
        drawPincerArm(17, -12, 1.0, snap, false);

        ctx.restore();
      }
    }

    // 26. Royal Egyptian Desert Cobra (100% Seamless Tapered Continuous Body, Fluid Gliding Wave & Flared Hood!)
    if (level.sand_vipers) {
      for (const vp of level.sand_vipers) {
        const vx = vp.x - camX, vy = vp.y - camY;
        if (vx < -120 || vx > cullW + 120) continue;
        const moving = !!(vp.awake || vp.returning);
        const wavePhase = (vp.walkDist || 0) * 0.16;
        const sway = Math.sin(time * (vp.awake ? 6.5 : 2.1) + (vp.phase || 0)) * (vp.awake ? 2.4 : 1.5);

        ctx.save();
        ctx.translate(vx + vp.w * 0.5, vy + vp.h);
        ctx.scale(vp.facing || -1, 1);

        // Grounded contact shadow flush on sand
        ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
        ctx.beginPath(); ctx.ellipse(-4, 0, moving ? 40 : 32, 4.8, 0, 0, Math.PI * 2); ctx.fill();

        // Helper: Sample a smooth Catmull-Rom / quadratic spline and extrude ONE seamless tapered snake silhouette!
        const drawSeamlessSnakeBody = (ctrlPts, rFn, shade) => {
          const N = ctrlPts.length;
          if (N < 2) return;
          const samples = [];
          const subSteps = 6;
          for (let i = 0; i < N - 1; i++) {
            const p0 = ctrlPts[Math.max(0, i - 1)];
            const p1 = ctrlPts[i];
            const p2 = ctrlPts[i + 1];
            const p3 = ctrlPts[Math.min(N - 1, i + 2)];
            const steps = i === N - 2 ? subSteps + 1 : subSteps;
            for (let s = 0; s < steps; s++) {
              const t = s / subSteps;
              const t2 = t * t, t3 = t2 * t;
              const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
              const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
              const u = (i + t) / (N - 1);
              samples.push({ x, y, u, r: rFn(u) });
            }
          }
          const M = samples.length;
          const left = [], right = [];
          for (let i = 0; i < M; i++) {
            const prev = samples[Math.max(0, i - 1)];
            const next = samples[Math.min(M - 1, i + 1)];
            const dx = next.x - prev.x, dy = next.y - prev.y;
            const len = Math.hypot(dx, dy) || 1;
            const nx = -dy / len, ny = dx / len;
            const r = samples[i].r;
            left.push({ x: samples[i].x + nx * r, y: samples[i].y + ny * r, nx, ny, r });
            right.push({ x: samples[i].x - nx * r, y: samples[i].y - ny * r, nx, ny, r });
          }

          // Single continuous outer silhouette (ZERO internal joint seams!)
          ctx.beginPath();
          ctx.moveTo(left[0].x, left[0].y);
          for (let i = 1; i < M; i++) ctx.lineTo(left[i].x, left[i].y);
          ctx.arc(samples[M - 1].x, samples[M - 1].y, samples[M - 1].r, 0, Math.PI * 2);
          for (let i = M - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
          ctx.closePath();

          if (shade) {
            ctx.fillStyle = '#6b3a0c';
            ctx.fill();
            ctx.strokeStyle = '#1c0b03'; ctx.lineWidth = 1.4; ctx.stroke();
            return;
          }

          const bodyG = ctx.createLinearGradient(-40, -38, 18, 0);
          bodyG.addColorStop(0, '#92400e');
          bodyG.addColorStop(0.45, '#b45309');
          bodyG.addColorStop(0.85, '#ca8a04');
          bodyG.addColorStop(1, '#a16207');
          ctx.fillStyle = bodyG;
          ctx.fill();

          // Clip inside the single continuous body for smooth dorsal sheen, cream belly & scale bands
          ctx.save();
          ctx.clip();

          // Warm golden sunlit dorsal ridge running continuously from tail to neck
          ctx.strokeStyle = '#eab308';
          ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.lineWidth = 3.8;
          ctx.beginPath();
          for (let i = 0; i < M; i++) {
            const ox = samples[i].x + left[i].nx * (samples[i].r * 0.35);
            const oy = samples[i].y + left[i].ny * (samples[i].r * 0.35);
            if (i === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy);
          }
          ctx.stroke();

          // Cream-ivory ventral belly strip along underside
          ctx.strokeStyle = 'rgba(254, 243, 199, 0.72)';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          for (let i = 1; i < M - 1; i++) {
            const bx = samples[i].x - left[i].nx * (samples[i].r * 0.58);
            const by = samples[i].y - left[i].ny * (samples[i].r * 0.58);
            if (i === 1) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
          }
          ctx.stroke();

          // Subtle natural dark cobra chevron scale bands (spaced evenly along continuous spine)
          ctx.strokeStyle = 'rgba(41, 13, 2, 0.42)';
          ctx.lineWidth = 1.9;
          for (let i = 4; i < M - 3; i += 4) {
            const p = samples[i];
            const l = left[i];
            ctx.beginPath();
            ctx.moveTo(p.x + l.nx * p.r * 0.95, p.y + l.ny * p.r * 0.95);
            ctx.lineTo(p.x - l.nx * p.r * 0.15, p.y - l.ny * p.r * 0.15);
            ctx.stroke();
          }

          ctx.restore();

          // Crisp outer ink contour around the entire seamless silhouette
          ctx.strokeStyle = '#1c0b03';
          ctx.lineWidth = 1.5;
          ctx.lineJoin = 'round';
          ctx.stroke();
        };

        let hoodX = 12 + sway * 0.6, hoodY = -28, headX = 17 + sway, headY = -41;

        if (moving) {
          // === FLUID GLIDING EGYPTIAN COBRA (One Continuous S-Wave Spine from Tapered Tail to Poised Neck!) ===
          const lunge = vp.awake ? 4 : 0;
          const w1 = Math.sin(wavePhase) * 2.6;
          const w2 = Math.sin(wavePhase - 1.3) * 2.8;
          const w3 = Math.sin(wavePhase - 2.6) * 2.2;

          const glidePts = [
            [-48, -2.2 + w1 * 0.45],
            [-36, -5.2 + w1],
            [-22, -3.2 - w2 * 0.8],
            [-8, -7.2 + w2],
            [4, -4.0 - w3 * 0.6],
            [12 + lunge, -9.5],
            [15 + lunge + sway * 0.3, -22],
            [14 + lunge + sway * 0.5, -36],
          ];
          drawSeamlessSnakeBody(glidePts, (u) => {
            if (u < 0.28) return 1.3 + (u / 0.28) * 4.1;
            if (u < 0.72) return 5.4 - ((u - 0.28) / 0.44) * 0.5;
            return 4.9 - ((u - 0.72) / 0.28) * 1.1;
          }, false);

          hoodX = 13 + lunge + sway * 0.4;
          hoodY = -27;
          headX = 19 + lunge + sway * 0.6;
          headY = -39;
        } else {
          // === REGAL SEAMLESS COILED EGYPTIAN COBRA (Shaded Rear Loop + One Continuous Foreground Body -> Neck!) ===
          drawSeamlessSnakeBody([
            [-22, -7.5],
            [-6, -13.5],
            [10, -13.0],
            [18, -8.5],
          ], () => 4.8, true);

          const coilPts = [
            [-36, -2.0],
            [-25, -4.8],
            [-8, -2.4],
            [11, -3.2],
            [20, -6.5],
            [11, -11.5],
            [-5, -10.5],
            [-14, -12.8],
            [0, -14.8],
            [10, -17.5],
            [13 + sway * 0.35, -26],
            [12 + sway * 0.6, -37],
          ];
          drawSeamlessSnakeBody(coilPts, (u) => {
            if (u < 0.2) return 1.4 + (u / 0.2) * 4.2;
            if (u < 0.75) return 5.6 - ((u - 0.2) / 0.55) * 0.8;
            return 4.8 - ((u - 0.75) / 0.25) * 0.9;
          }, false);

          hoodX = 11 + sway * 0.5;
          hoodY = -28;
          headX = 16 + sway;
          headY = -41;
        }

        // === ICONIC FLARED ROYAL EGYPTIAN COBRA HOOD ===
        ctx.save();
        ctx.translate(hoodX, hoodY);
        ctx.rotate(moving ? 0.16 : 0.06);
        const hoodW = vp.awake ? 13.5 : 10.5;
        const hoodH = 14.5;
        const hOuterG = ctx.createLinearGradient(-hoodW, -hoodH, hoodW, hoodH);
        hOuterG.addColorStop(0, '#78350f'); hOuterG.addColorStop(0.5, '#b45309'); hOuterG.addColorStop(1, '#451a03');
        ctx.fillStyle = hOuterG; ctx.strokeStyle = '#1c0b03'; ctx.lineWidth = 1.45;
        ctx.beginPath();
        ctx.moveTo(0, -hoodH);
        ctx.bezierCurveTo(-hoodW * 1.25, -hoodH * 0.55, -hoodW * 1.15, hoodH * 0.45, -3, hoodH);
        ctx.lineTo(3, hoodH);
        ctx.bezierCurveTo(hoodW * 1.15, hoodH * 0.45, hoodW * 1.25, -hoodH * 0.55, 0, -hoodH);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Warm Royal Golden-Ivory Inner Cobra Hood Chest + Horizontal Dark Ribs
        const hInnerG = ctx.createLinearGradient(0, -hoodH + 2, 0, hoodH);
        hInnerG.addColorStop(0, '#fef9c3'); hInnerG.addColorStop(0.6, '#fde047'); hInnerG.addColorStop(1, '#d97706');
        ctx.fillStyle = hInnerG;
        ctx.beginPath();
        ctx.moveTo(2, -hoodH + 3);
        ctx.bezierCurveTo(-hoodW * 0.55, -hoodH * 0.3, -hoodW * 0.5, hoodH * 0.5, 0, hoodH - 1);
        ctx.bezierCurveTo(hoodW * 0.72, hoodH * 0.45, hoodW * 0.75, -hoodH * 0.3, 2, -hoodH + 3);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(92, 40, 10, 0.58)'; ctx.lineWidth = 1.25;
        for (const ry of [-6, -2, 2, 6, 10]) {
          const rw = (1 - Math.abs(ry) / 15) * hoodW * 0.58;
          ctx.beginPath(); ctx.moveTo(1 - rw * 0.7, ry); ctx.quadraticCurveTo(2, ry + 1.5, 2 + rw, ry); ctx.stroke();
        }
        ctx.fillStyle = '#290d02'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.ellipse(-hoodW * 0.55, -2, 2.5, 4.2, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();

        // === SCULPTED REGAL EGYPTIAN COBRA HEAD ===
        ctx.save();
        ctx.translate(headX, headY);
        ctx.rotate(vp.awake ? 0.12 : 0.04);

        if (vp.awake) {
          ctx.fillStyle = '#7f1d1d'; ctx.strokeStyle = '#1c0b03'; ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-4, 1); ctx.lineTo(13, 1.5); ctx.quadraticCurveTo(9, 10.5, -2, 8.5); ctx.closePath();
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.moveTo(-5, 5.5); ctx.quadraticCurveTo(3, 11, 11.5, 9); ctx.quadraticCurveTo(3, 13, -6, 8.5); ctx.closePath();
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(8, 1); ctx.lineTo(9.8, 7.2); ctx.lineTo(11.2, 1.4);
          ctx.moveTo(5.2, 1.2); ctx.lineTo(6.6, 6.2); ctx.lineTo(7.8, 1.4);
          ctx.closePath(); ctx.fill();
        }

        const hdG = ctx.createLinearGradient(-8, -7, 14, 5);
        hdG.addColorStop(0, '#fde047'); hdG.addColorStop(0.45, '#b45309'); hdG.addColorStop(1, '#451a03');
        ctx.fillStyle = hdG; ctx.strokeStyle = '#1c0b03'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-9, -1);
        ctx.quadraticCurveTo(-5, -7.5, 3, -6.5);
        ctx.lineTo(14.5, -2);
        ctx.quadraticCurveTo(15.5, 1.2, 12, 2.8);
        ctx.lineTo(-4, 3.8);
        ctx.quadraticCurveTo(-9.5, 2.5, -9, -1);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        ctx.fillStyle = vp.awake ? '#fb7185' : '#4ade80'; ctx.strokeStyle = '#1c0b03'; ctx.lineWidth = 0.95;
        ctx.beginPath(); ctx.ellipse(4.5, -2.4, 2.7, 2.1, -0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#090d16'; ctx.fillRect(4.1, -4.3, 1.0, 3.8);
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(3.6, -3.1, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1c0b03'; ctx.beginPath(); ctx.arc(11.5, -1.4, 0.8, 0, Math.PI * 2); ctx.fill();

        if (vp.awake || Math.sin(time * 4.0 + (vp.phase || 0)) > 0.35) {
          const tf = Math.sin(time * 26) * 1.6;
          ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.25; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(13, 1.5); ctx.lineTo(21, 1.5 + tf * 0.4);
          ctx.lineTo(25, -1.4 + tf);
          ctx.moveTo(21, 1.5 + tf * 0.4); ctx.lineTo(25, 4.4 + tf);
          ctx.stroke();
        }
        ctx.restore(); // end cobra head
        ctx.restore(); // end cobra
      }
    }


    // 27. Swooping Desert Falcons (Stage 18 — Dual Articulated Feathered Wings, Barred Plumage, Malar Stripe & Splayed Talons!)
    if (level.desert_falcons) {
      for (const fl of level.desert_falcons) {
        const fx = fl.x - camX, fy = fl.y - camY;
        if (fx < -110 || fx > cullW + 110) continue;
        const flap = Math.sin(time * (fl.swooping ? 16 : 9) + (fl.phase || 0));
        ctx.save();
        ctx.translate(fx + fl.w * 0.5, fy + fl.h * 0.5);
        ctx.scale(fl.facing || 1, 1);
        if (fl.swooping) ctx.rotate(0.36);

        // 1. Far Shaded Articulated Wing behind body
        ctx.fillStyle = '#451a03'; ctx.strokeStyle = '#1c0802'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(2, -4);
        ctx.quadraticCurveTo(0, -24 * flap - 10, -18, -21 * flap - 6);
        ctx.quadraticCurveTo(-2, -9 * flap, 10, -3);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 2. Fanned Barred Tail Feathers
        ctx.fillStyle = '#5c280a'; ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-15, 2); ctx.lineTo(-36, -6); ctx.lineTo(-34, 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(-26, -2); ctx.lineTo(-25, 5); ctx.stroke();

        // 3. Sleek Aerodynamic Falcon Body with Barred Cream-Gold Breast Plumage
        const fG = ctx.createLinearGradient(0, -11, 0, 12);
        fG.addColorStop(0, '#78350f'); fG.addColorStop(0.5, '#b45309'); fG.addColorStop(1, '#fef3c7');
        ctx.fillStyle = fG; ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.ellipse(0, 2, 19, 9.5, -0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Subtle raptor chest feather bars
        ctx.strokeStyle = 'rgba(92, 40, 10, 0.42)'; ctx.lineWidth = 1.0;
        for (const bx of [-4, 2, 8]) {
          ctx.beginPath(); ctx.moveTo(bx, 5); ctx.lineTo(bx + 2, 9); ctx.stroke();
        }

        // 4. Near Articulated Feathered Wing with Fanned Primary Flight Feathers!
        const wingG = ctx.createLinearGradient(0, -24 * flap - 8, 0, 2);
        wingG.addColorStop(0, '#451a03'); wingG.addColorStop(0.55, '#92400e'); wingG.addColorStop(1, '#d97706');
        ctx.fillStyle = wingG; ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-4, -1);
        ctx.quadraticCurveTo(-10, -25 * flap - 9, -28, -20 * flap - 5);
        ctx.lineTo(-23, -15 * flap - 2);
        ctx.lineTo(-25, -12 * flap);
        ctx.lineTo(-18, -9 * flap + 1);
        ctx.quadraticCurveTo(-2, -4 * flap, 8, -1);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 5. Falcon Head, Classic Dark Malar Cheek Stripe, Golden Cere & Hooked Raptor Beak
        ctx.fillStyle = '#451a03';
        ctx.beginPath(); ctx.arc(17, -4, 7.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath(); ctx.arc(17, -1.5, 4.5, 0, Math.PI); ctx.fill();
        // Dark malar stripe under eye
        ctx.fillStyle = '#1c0802'; ctx.fillRect(17, -4, 2.2, 4.5);
        // Hooked golden-black beak
        ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#1c0802'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(23, -5.5); ctx.quadraticCurveTo(31, -3.5, 28, 2.5); ctx.lineTo(22.5, -1); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(19.5, -5.5, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(20, -5.5, 0.9, 0, Math.PI * 2); ctx.fill();

        // 6. Sharp Golden Talons (splayed forward when swooping!)
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.7; ctx.lineCap = 'round';
        const talSpread = fl.swooping ? 5 : 0;
        ctx.beginPath();
        ctx.moveTo(2, 10); ctx.lineTo(6 + talSpread, 15 + talSpread * 0.4);
        ctx.moveTo(6, 10); ctx.lineTo(10 + talSpread, 14 + talSpread * 0.4);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 28. Realistic Volumetric Desert Dust Devils (Stage 18 — Swirling Sand-Haze Funnel, Turbulent Ground Cloud, Intertwined Helical Ribbons & Debris!)
    if (level.dust_devils) {
      for (const dd of level.dust_devils) {
        const dx = dd.x - camX, dy = dd.y - camY;
        if (dx < -110 || dx > cullW + 110) continue;
        const cx = dx + dd.w * 0.5;
        const baseY = dy + dd.h;
        const ph = dd.phase || 0;
        ctx.save();

        // 1. Soft turbulent ground dust-kickup cloud hugging the desert floor
        const baseGlow = ctx.createRadialGradient(cx, baseY - 4, 4, cx, baseY - 4, 34);
        baseGlow.addColorStop(0, 'rgba(217, 119, 6, 0.45)');
        baseGlow.addColorStop(0.55, 'rgba(253, 230, 138, 0.25)');
        baseGlow.addColorStop(1, 'rgba(253, 230, 138, 0)');
        ctx.fillStyle = baseGlow;
        ctx.beginPath(); ctx.ellipse(cx, baseY - 3, 34, 10, 0, 0, Math.PI * 2); ctx.fill();

        // 2. Volumetric Translucent Swirling Sand-Haze Funnel Column (14 layered S-bending dust puffs!)
        for (let k = 0; k < 14; k++) {
          const u = k / 13;
          const py0 = baseY - 6 - u * (dd.h - 10);
          const bend = Math.sin(time * 6.5 + u * 4.5 + ph) * (3 + u * 8.5);
          const puffRx = 8 + Math.pow(u, 1.15) * 24;
          const puffRy = 5 + u * 8;
          const alpha = Math.sin(u * Math.PI * 0.86 + 0.14) * 0.34;
          const puffG = ctx.createRadialGradient(cx + bend - puffRx * 0.2, py0 - 2, 1, cx + bend, py0, puffRx);
          puffG.addColorStop(0, `rgba(254, 243, 199, ${(alpha * 1.15).toFixed(2)})`);
          puffG.addColorStop(0.55, `rgba(217, 119, 6, ${(alpha * 0.85).toFixed(2)})`);
          puffG.addColorStop(1, 'rgba(180, 83, 9, 0)');
          ctx.fillStyle = puffG;
          ctx.beginPath(); ctx.ellipse(cx + bend, py0, puffRx, puffRy, 0, 0, Math.PI * 2); ctx.fill();
        }

        // 3. Intertwined Helical Wind-Stream Ribbons Spiraling Upward Around the Funnel!
        ctx.lineCap = 'round';
        for (let s = 0; s < 3; s++) {
          const sOff = (s * Math.PI * 2) / 3;
          ctx.beginPath();
          let started = false;
          for (let step = 0; step <= 18; step++) {
            const u = step / 18;
            const ang = time * 11 + u * Math.PI * 4.2 + sOff + ph;
            const rad = 6 + Math.pow(u, 1.1) * 20;
            const bend = Math.sin(time * 6.5 + u * 4.5 + ph) * (3 + u * 8.5);
            const sx0 = cx + bend + Math.cos(ang) * rad;
            const sy0 = baseY - 5 - u * (dd.h - 12) + Math.sin(ang) * (rad * 0.18);
            if (!started) { ctx.moveTo(sx0, sy0); started = true; } else { ctx.lineTo(sx0, sy0); }
          }
          ctx.strokeStyle = s === 0 ? 'rgba(255, 251, 235, 0.56)' : s === 1 ? 'rgba(253, 224, 71, 0.42)' : 'rgba(180, 83, 9, 0.38)';
          ctx.lineWidth = s === 0 ? 2.0 : 1.5;
          ctx.stroke();
        }

        // 4. Orbiting Desert Sand Grains, Pebbles & Spinning Dry Twigs caught in the vortex
        for (let g = 0; g < 14; g++) {
          const gu = ((time * 0.65 + g * 0.13) % 1);
          const ga = time * 12 + g * 1.3 + ph;
          const bend = Math.sin(time * 6.5 + gu * 4.5 + ph) * (3 + gu * 8.5);
          const rad = 7 + Math.pow(gu, 1.1) * 23;
          const gx = cx + bend + Math.cos(ga) * rad;
          const gy = baseY - 6 - gu * (dd.h - 14);
          const a = Math.sin(gu * Math.PI) * 0.85;
          if (g % 4 === 0) {
            ctx.save();
            ctx.translate(gx, gy); ctx.rotate(ga * 1.4);
            ctx.strokeStyle = `rgba(92, 40, 10, ${a.toFixed(2)})`; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(-3.5, 0); ctx.lineTo(3.5, 0); ctx.stroke();
            ctx.restore();
          } else {
            ctx.fillStyle = g % 2 === 0 ? `rgba(254, 243, 199, ${a.toFixed(2)})` : `rgba(217, 119, 6, ${a.toFixed(2)})`;
            ctx.beginPath(); ctx.arc(gx, gy, g % 3 === 0 ? 1.9 : 1.3, 0, Math.PI * 2); ctx.fill();
          }
        }
        ctx.restore();
      }
    }

    // 29. Mischievous Leaf-Disguised Japanese Tanuki Rascals (Sculpted Raccoon-Dog, Fur Shading, Ringed Tail & Magic Leaf!)
    if (level.tanuki_rascals) {
      for (const tn of level.tanuki_rascals) {
        const tx = tn.x - camX, ty = tn.y - camY;
        if (tx < -120 || tx > cullW + 120) continue;
        const standing = !!(tn.awake || tn.returning);
        const wb = standing ? Math.max(0, Math.min(1, tn.walkBlend || 0)) : 0;
        const gait = (tn.walkDist || 0) * 0.22;
        const stepA = Math.sin(gait) * 7.5 * wb;
        const stepB = -stepA;
        const bob = standing ? Math.abs(Math.sin(gait)) * 2.2 * wb : Math.sin(time * 2.4 + (tn.phase || 0)) * 1.1;
        ctx.save();
        ctx.translate(tx + tn.w * 0.5, ty + tn.h);
        ctx.scale(tn.facing || -1, 1);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.44)';
        ctx.beginPath(); ctx.ellipse(0, 0, 27, 4.8, 0, 0, Math.PI * 2); ctx.fill();

        // Lush Banded Tanuki Tail with 3D Fur Shading
        ctx.save();
        ctx.translate(-17, -14 - bob);
        ctx.rotate(-0.22 + Math.sin(time * 5 + (tn.phase || 0)) * 0.12);
        const tG = ctx.createLinearGradient(0, -10, -32, 8);
        tG.addColorStop(0, '#92400e'); tG.addColorStop(0.65, '#78350f'); tG.addColorStop(1, '#292524');
        ctx.fillStyle = tG; ctx.strokeStyle = '#1c0a02'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, -3); ctx.bezierCurveTo(-12, -13, -28, -9, -32, 0); ctx.bezierCurveTo(-26, 9, -10, 8, 0, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1c1917';
        ctx.beginPath(); ctx.ellipse(-10, 0, 3.2, 6.2, 0.1, 0, Math.PI * 2); ctx.ellipse(-20, 0, 3.4, 6.4, 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Far Dark Tanuki Legs (strictly driven by walkDist!)
        ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 5.2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-11, -12 - bob); ctx.lineTo(-12 + stepB, -2); ctx.moveTo(10, -12 - bob); ctx.lineTo(11 + stepA, -2); ctx.stroke();

        // Plump Sculpted Brown-Tan Tanuki Body, Cream Belly & Sunlit Back Sheen
        const bodyG = ctx.createLinearGradient(0, -33 - bob, 0, -6 - bob);
        bodyG.addColorStop(0, '#c27824'); bodyG.addColorStop(0.45, '#854d0e'); bodyG.addColorStop(1, '#451a03');
        ctx.fillStyle = bodyG; ctx.strokeStyle = '#1c0a02'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-20, -12 - bob); ctx.bezierCurveTo(-20, -30 - bob, -4, -34 - bob, 11, -28 - bob);
        ctx.bezierCurveTo(20, -24 - bob, 20, -10 - bob, 9, -7 - bob); ctx.quadraticCurveTo(-8, -6 - bob, -20, -12 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.ellipse(4, -12 - bob, 11, 5.2, 0.08, 0, Math.PI * 2); ctx.fill();

        // Near legs + small paws
        ctx.strokeStyle = '#292524'; ctx.lineWidth = 5.0;
        ctx.beginPath(); ctx.moveTo(-10, -13 - bob); ctx.lineTo(-9 + stepA, -2); ctx.moveTo(11, -13 - bob); ctx.lineTo(13 + stepB, -2); ctx.stroke();

        // Sculpted Tanuki Head, Iconic Dark Bandit Mask, Whiskers & Magic Green Leaf!
        const hy = -26 - bob;
        ctx.fillStyle = '#92400e'; ctx.strokeStyle = '#1c0a02'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(9, hy - 9, 4.4, 0, Math.PI * 2); ctx.arc(17, hy - 9, 4.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.arc(9.5, hy - 9, 2.0, 0, Math.PI * 2); ctx.arc(17.5, hy - 9, 2.0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#a16207'; ctx.beginPath(); ctx.ellipse(15, hy, 11.5, 9.5, 0.05, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1c1917'; ctx.beginPath(); ctx.ellipse(18, hy - 1, 6.8, 4.6, 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.ellipse(23.5, hy + 2, 5.4, 3.6, 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(27.8, hy + 1, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = tn.awake ? '#fde047' : '#ffffff'; ctx.beginPath(); ctx.arc(19.5, hy - 1.5, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(20, hy - 1.5, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(19.2, hy - 2.2, 0.7, 0, Math.PI * 2); ctx.fill();
        // Iconic Magic Green Transformation Leaf with central midvein on Tanuki's crown!
        ctx.save(); ctx.translate(13, hy - 10); ctx.rotate(-0.25 + Math.sin(time * 4) * 0.08);
        ctx.fillStyle = '#22c55e'; ctx.strokeStyle = '#14532d'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-9, 1); ctx.quadraticCurveTo(0, -9, 11, -2); ctx.quadraticCurveTo(1, 5, -9, 1); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#bbf7d0'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(-6, 0.5); ctx.lineTo(8, -2); ctx.stroke();
        ctx.restore();
        ctx.restore();
      }
    }

    // 30. Alert Shiba Inu Street Guard (Sight Cone, Articulated Legs, Curled Donut Tail, Urajiro Cream Cheeks & Crimson Bandana!)
    if (level.shiba_guards) {
      for (const sh of level.shiba_guards) {
        const sx = sh.x - camX, sy = sh.y - camY;
        if (sx < -140 || sx > cullW + 140) continue;

        // Subtle Dog Vision Cone (so player can read Shiba's alert range clearly!)
        if (!sh.repelTimer || sh.repelTimer <= 0) {
          ctx.save();
          const dir = sh.facing || -1;
          const eyeX = sx + sh.w * 0.5 + dir * 22;
          const eyeY = sy + 14;
          const coneG = ctx.createLinearGradient(eyeX, eyeY, eyeX + dir * 185, eyeY);
          coneG.addColorStop(0, sh.alert ? 'rgba(239, 68, 68, 0.36)' : 'rgba(251, 146, 60, 0.22)');
          coneG.addColorStop(1, 'rgba(251, 146, 60, 0)');
          ctx.fillStyle = coneG;
          ctx.beginPath(); ctx.moveTo(eyeX, eyeY); ctx.lineTo(eyeX + dir * 185, eyeY - 34); ctx.lineTo(eyeX + dir * 185, eyeY + 28); ctx.closePath(); ctx.fill();
          ctx.restore();
        }

        const gait = (sh.walkDist || 0) * 0.2;
        const stepA = Math.sin(gait) * 7.8;
        const stepB = -stepA;
        const bob = Math.abs(Math.sin(gait)) * 1.9;
        ctx.save();
        ctx.translate(sx + sh.w * 0.5, sy + sh.h);
        ctx.scale(sh.facing || -1, 1);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.44)';
        ctx.beginPath(); ctx.ellipse(0, 0, 29, 4.8, 0, 0, Math.PI * 2); ctx.fill();

        // Iconic Fluffy Curled Shiba Inu Donut Tail over Rump
        ctx.fillStyle = '#ea8c38'; ctx.strokeStyle = '#431407'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(-20, -26 - bob, 8.8, 0.2, Math.PI * 1.85); ctx.quadraticCurveTo(-14, -22 - bob, -18, -19 - bob); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fffbeb'; ctx.beginPath(); ctx.arc(-21, -26 - bob, 4.0, 0, Math.PI * 2); ctx.fill();

        // Far shaded legs
        ctx.strokeStyle = '#9a4c14'; ctx.lineWidth = 5.2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-14, -15 - bob); ctx.lineTo(-15 + stepB, -2); ctx.moveTo(11, -15 - bob); ctx.lineTo(13 + stepA, -2); ctx.stroke();

        // Athletic Ginger-Tan Shiba Body + Fluffy Urajiro Cream Chest & Belly
        const sG = ctx.createLinearGradient(0, -35 - bob, 0, -10 - bob);
        sG.addColorStop(0, '#f7a94b'); sG.addColorStop(0.55, '#d97724'); sG.addColorStop(1, '#9a4c14');
        ctx.fillStyle = sG; ctx.strokeStyle = '#431407'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-21, -22 - bob); ctx.bezierCurveTo(-18, -34 - bob, 4, -35 - bob, 18, -28 - bob);
        ctx.bezierCurveTo(22, -20 - bob, 19, -11 - bob, 7, -11 - bob); ctx.quadraticCurveTo(-10, -11 - bob, -21, -22 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fffbeb'; ctx.beginPath(); ctx.ellipse(11, -16 - bob, 9.8, 6.4, 0.18, 0, Math.PI * 2); ctx.fill();

        // Near muscular legs with crisp white paws
        ctx.strokeStyle = '#d97724'; ctx.lineWidth = 5.2;
        ctx.beginPath(); ctx.moveTo(-13, -16 - bob); ctx.lineTo(-11 + stepA, -2); ctx.moveTo(12, -16 - bob); ctx.lineTo(15 + stepB, -2); ctx.stroke();
        ctx.fillStyle = '#fffbeb'; ctx.beginPath(); ctx.arc(-10 + stepA, -1.8, 2.9, 0, Math.PI * 2); ctx.arc(16 + stepB, -1.8, 2.9, 0, Math.PI * 2); ctx.fill();

        // Traditional Crimson Karakusa Bandana Scarf with white swirl dots
        ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(9, -28 - bob); ctx.lineTo(22, -22 - bob); ctx.lineTo(15, -13 - bob); ctx.lineTo(7, -21 - bob); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.arc(14, -20 - bob, 1.3, 0, Math.PI * 2); ctx.arc(17, -22 - bob, 1.1, 0, Math.PI * 2); ctx.fill();

        // Sculpted Shiba Head, Upright Triangular Ears with Cream Inner Folds & Expressive Eye
        const hy = -33 - bob;
        ctx.fillStyle = '#ea8c38'; ctx.strokeStyle = '#431407'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(13, hy - 6); ctx.lineTo(12, hy - 17); ctx.lineTo(20, hy - 9); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(18, hy - 6); ctx.lineTo(21, hy - 18); ctx.lineTo(25, hy - 7); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.moveTo(19.5, hy - 7); ctx.lineTo(21, hy - 14); ctx.lineTo(23.5, hy - 7.5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ea8c38'; ctx.beginPath(); ctx.ellipse(20, hy, 11, 9.5, 0.05, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fffbeb'; ctx.beginPath(); ctx.ellipse(24, hy + 2.8, 8.2, 5.2, 0.05, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(32, hy + 1, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(23.5, hy - 2, 2.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(22.9, hy - 2.6, 0.85, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 31. Swooping Kyoto Karasu Crows (Iridescent Indigo-Black Plumage, Slotted Primary Wingtip Feathers & Shrine Ribbon!)
    if (level.samurai_crows) {
      for (const cr of level.samurai_crows) {
        const cx = cr.x - camX, cy = cr.y - camY;
        if (cx < -110 || cx > cullW + 110) continue;
        const flap = Math.sin(time * (cr.swooping ? 16 : 9.5) + (cr.phase || 0));
        ctx.save();
        ctx.translate(cx + cr.w * 0.5, cy + cr.h * 0.5);
        ctx.scale(cr.facing || 1, 1);
        if (cr.swooping) ctx.rotate(0.32);

        // Far shaded wing
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(2, -4); ctx.quadraticCurveTo(-2, -23 * flap - 8, -22, -18 * flap - 4); ctx.quadraticCurveTo(-4, -8 * flap, 10, -2); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Fanned tail feathers
        ctx.beginPath(); ctx.moveTo(-14, 2); ctx.lineTo(-34, -5); ctx.lineTo(-31, 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Glossy iridescent indigo-black crow body
        const cG = ctx.createLinearGradient(0, -10, 0, 10);
        cG.addColorStop(0, '#4338ca'); cG.addColorStop(0.42, '#1e1b4b'); cG.addColorStop(1, '#090d16');
        ctx.fillStyle = cG;
        ctx.beginPath(); ctx.ellipse(0, 2, 18.5, 9.2, -0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Near layered feathered wing with slotted primary wingtip feathers
        const wG = ctx.createLinearGradient(0, -24 * flap - 8, 0, 2);
        wG.addColorStop(0, '#312e81'); wG.addColorStop(0.6, '#1e1b4b'); wG.addColorStop(1, '#090d16');
        ctx.fillStyle = wG;
        ctx.beginPath();
        ctx.moveTo(-4, -1); ctx.quadraticCurveTo(-10, -26 * flap - 8, -31, -20 * flap - 4);
        ctx.lineTo(-24, -14 * flap - 2); ctx.lineTo(-28, -10 * flap); ctx.lineTo(-21, -7 * flap + 1);
        ctx.quadraticCurveTo(-2, -3 * flap, 8, -1); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Head, sharp dark hooked beak, fierce golden eye & fluttering crimson shrine headband ribbon!
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(16, -4, 7.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#475569'; ctx.beginPath(); ctx.moveTo(22, -6); ctx.lineTo(33, -2.5); ctx.lineTo(22, 0.5); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(18.5, -5.2, 2.0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#020617'; ctx.beginPath(); ctx.arc(19, -5.2, 0.95, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.0;
        ctx.beginPath(); ctx.moveTo(10, -8); ctx.lineTo(20, -8); ctx.moveTo(10, -8); ctx.quadraticCurveTo(2, -11, -5, -7 + Math.sin(time * 14) * 2); ctx.stroke();
        ctx.restore();
      }
    }

    // 32. Rolling Red Lacquered Daruma Dolls (3D Glossy Crimson Sphere, Golden Brow Calligraphy & Specular Sheen!)
    if (level.daruma_rollers) {
      for (const dr of level.daruma_rollers) {
        if (dr.waiting) continue;
        const dx = (dr.x !== undefined ? dr.x : dr.startX) - camX, dy = dr.y - camY;
        if (dx < -90 || dx > cullW + 90) continue;
        const r = dr.r || 22;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
        ctx.beginPath(); ctx.ellipse(dx, dy + r - 1, r * 0.92, 4.8, 0, 0, Math.PI * 2); ctx.fill();

        ctx.translate(dx, dy); ctx.rotate(dr.angle || 0);
        const dG = ctx.createRadialGradient(-r * 0.32, -r * 0.32, 2, 0, 0, r);
        dG.addColorStop(0, '#fca5a5'); dG.addColorStop(0.35, '#dc2626'); dG.addColorStop(0.82, '#991b1b'); dG.addColorStop(1, '#450a0a');
        ctx.fillStyle = dG; ctx.strokeStyle = '#290606'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Golden decorative belly trim & gold crest stroke
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.0;
        ctx.beginPath(); ctx.arc(0, 0, r - 4, 0.35, Math.PI - 0.35); ctx.stroke();
        ctx.strokeStyle = '#fde047'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(0, 9); ctx.lineTo(0, 15); ctx.moveTo(-4, 12); ctx.lineTo(4, 12); ctx.stroke();
        // Classic cream painted Daruma face medallion with fierce painted brows & eyes
        ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(0, -3, r * 0.62, r * 0.44, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#090d16';
        ctx.beginPath(); ctx.arc(-5, -3.5, 3.0, 0, Math.PI * 2); ctx.arc(5, -3.5, 3.0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(-5.8, -4.3, 1.0, 0, Math.PI * 2); ctx.arc(4.2, -4.3, 1.0, 0, Math.PI * 2); ctx.fill();
        // Bold ink crane-wing eyebrows & mustache
        ctx.strokeStyle = '#090d16'; ctx.lineWidth = 2.1; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-9.5, -8); ctx.quadraticCurveTo(-5, -11, -1.5, -7.5);
        ctx.moveTo(9.5, -8); ctx.quadraticCurveTo(5, -11, 1.5, -7.5);
        ctx.moveTo(-7.5, 2); ctx.quadraticCurveTo(0, -0.5, 7.5, 2);
        ctx.stroke();
        // Glossy lacquer specular highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
        ctx.beginPath(); ctx.ellipse(-r * 0.35, -r * 0.45, r * 0.25, r * 0.12, -0.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 33. Lifelike Victorian Railway Conductor / Lamp Inspector (Stage 20 — walkDist-driven boots, tailored navy greatcoat, handlebar mustache & brass signal lantern!)
    if (level.rail_inspectors) {
      for (const ri of level.rail_inspectors) {
        const rx = ri.x - camX, ry = ri.y - camY;
        if (rx < -130 || rx > cullW + 130) continue;
        const f = ri.facing || -1;
        const stride = Math.sin((ri.walkDist || 0) * 0.14);
        const bob = Math.abs(stride) * 2.4;
        ctx.save();
        ctx.translate(rx + ri.w * 0.5, ry + ri.h);
        ctx.scale(f, 1);

        // Ground contact shadow flush on carriage roof
        ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
        ctx.beginPath(); ctx.ellipse(0, 0, 23, 5.0, 0, 0, Math.PI * 2); ctx.fill();

        // 1. Articulated navy railway trousers & polished black leather boots (strictly walkDist-driven!)
        for (const [legIdx, s] of [[0, -1], [1, 1]]) {
          const swing = s * stride * 9.5;
          const kneeX = s * 3 + swing * 0.45;
          const footX = s * 4 + swing;
          ctx.strokeStyle = legIdx === 0 ? '#0f172a' : '#1e293b';
          ctx.lineWidth = 7.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(s * 4, -22 - bob);
          ctx.lineTo(kneeX, -11 - bob * 0.5);
          ctx.lineTo(footX, -4);
          ctx.stroke();
          // Polished Victorian leather ankle boot with heel
          ctx.fillStyle = '#090d16'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.0;
          ctx.beginPath(); ctx.roundRect(footX - 5, -6.5, 13, 6.5, [2, 4, 1, 1]); ctx.fill(); ctx.stroke();
        }

        // 2. Tailored Victorian Double-Breasted Navy Greatcoat with Crimson Collar & Twin Brass Button Rows!
        const coatG = ctx.createLinearGradient(-15, -52 - bob, 15, -18 - bob);
        coatG.addColorStop(0, '#1e3a8a'); coatG.addColorStop(0.55, '#172554'); coatG.addColorStop(1, '#0f172a');
        ctx.fillStyle = coatG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-12, -48 - bob);
        ctx.quadraticCurveTo(0, -51 - bob, 12, -48 - bob);
        ctx.lineTo(15, -19 - bob);
        ctx.quadraticCurveTo(0, -16 - bob, -15, -19 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Crimson velvet lapel collar & waist belt with brass buckle
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath(); ctx.moveTo(-8, -48 - bob); ctx.lineTo(9, -48 - bob); ctx.lineTo(5, -42 - bob); ctx.lineTo(-4, -42 - bob); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.fillRect(-13.5, -28 - bob, 27, 4.5);
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(3, -29 - bob, 6, 6.5);
        // Twin rows of gleaming brass coat buttons & gold pocket-watch chain
        ctx.fillStyle = '#fde047';
        for (const by of [-41, -36, -31]) {
          ctx.beginPath(); ctx.arc(1, by - bob, 1.5, 0, Math.PI * 2); ctx.arc(7, by - bob, 1.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(4, -26 - bob); ctx.quadraticCurveTo(-2, -21 - bob, -8, -24 - bob); ctx.stroke();

        // 3. Expressive 3/4 Profile Head, Sculpted Handlebar Mustache & Tall Victorian Conductor Cap!
        ctx.fillStyle = '#fed7aa'; ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.arc(1, -56 - bob, 9.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Nose, attentive eye & bushy brow
        ctx.fillStyle = '#fdba74'; ctx.beginPath(); ctx.arc(10, -55 - bob, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(5.5, -57 - bob, 1.7, 0, Math.PI * 2); ctx.fill();
        // Sculpted brown Victorian handlebar mustache!
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.moveTo(2, -52.5 - bob);
        ctx.quadraticCurveTo(8, -54.5 - bob, 13, -51.5 - bob);
        ctx.quadraticCurveTo(9, -49.5 - bob, 2, -51 - bob);
        ctx.closePath(); ctx.fill();
        // Tall Glossy Navy Station-Master Cap with Visor, Gold Braid & Winged Badge
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.ellipse(5, -62 - bob, 12, 2.8, 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1e3a8a'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-9, -62 - bob); ctx.lineTo(-10, -70 - bob); ctx.quadraticCurveTo(1, -73 - bob, 11, -69 - bob); ctx.lineTo(10, -62 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(-9, -64.5 - bob, 19, 2.6);
        ctx.beginPath(); ctx.arc(4, -68 - bob, 2.4, 0, Math.PI * 2); ctx.fill();

        // 4. Articulated Forearm Holding Detailed Victorian Brass-Caged Railway Signal Lantern!
        const lanSwing = Math.sin(time * 4.5 + (ri.walkDist || 0) * 0.08) * 2.5;
        const handX = 20, handY = -36 - bob;
        ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(7, -44 - bob); ctx.lineTo(14, -38 - bob); ctx.lineTo(handX, handY); ctx.stroke();
        ctx.fillStyle = '#b91c1c'; ctx.fillRect(15, -39 - bob, 4, 5); // crimson cuff
        ctx.fillStyle = '#fed7aa'; ctx.beginPath(); ctx.arc(handX, handY, 3.2, 0, Math.PI * 2); ctx.fill();

        // Detailed Hanging Victorian Signal Lantern (handle ring, domed brass cap, glass globe, wire cage & warm glow!)
        const lanX = handX + 1 + lanSwing * 0.6;
        const lanY = handY + 13;
        const lGlow = ctx.createRadialGradient(lanX, lanY, 3, lanX, lanY, 34);
        lGlow.addColorStop(0, ri.alert ? 'rgba(248, 113, 113, 0.82)' : 'rgba(254, 240, 138, 0.78)');
        lGlow.addColorStop(0.5, ri.alert ? 'rgba(239, 68, 68, 0.28)' : 'rgba(251, 191, 36, 0.25)');
        lGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = lGlow; ctx.beginPath(); ctx.arc(lanX, lanY, 34, 0, Math.PI * 2); ctx.fill();
        // Bail handle & domed brass chimney cap
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(lanX, lanY - 9, 5, Math.PI, 0); ctx.stroke();
        ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(lanX - 7, lanY - 7); ctx.lineTo(lanX, lanY - 13); ctx.lineTo(lanX + 7, lanY - 7); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Glowing glass globe + inner flickering flame + brass wire guard bars
        ctx.fillStyle = ri.alert ? '#ef4444' : '#fef08a'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.roundRect(lanX - 6.5, lanY - 7, 13, 15, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(lanX, lanY, 3.0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.moveTo(lanX - 6.5, lanY + 1); ctx.lineTo(lanX + 6.5, lanY + 1); ctx.stroke();
        // Brass lantern base foot
        ctx.fillStyle = '#92400e'; ctx.fillRect(lanX - 7.5, lanY + 7, 15, 3.5);
        ctx.restore();
      }
    }

    // 34. Bouncing Furnace Coal Sparks (Stage 20 — Glowing molten coal ember hopping along carriage roof!)
    if (level.coal_sparks) {
      for (const cs of level.coal_sparks) {
        if (cs.waiting) continue;
        const sx = (cs.x !== undefined ? cs.x : cs.startX) - camX;
        const sy = (cs.curY !== undefined ? cs.curY : cs.y) - camY;
        if (sx < -80 || sx > cullW + 80) continue;
        const r = cs.r || 19;
        ctx.save();
        // Ground shadow on carriage roof below the hopping ember
        ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
        ctx.beginPath(); ctx.ellipse(sx, cs.y - camY + r - 1, r * 0.85, 4.2, 0, 0, Math.PI * 2); ctx.fill();
        // Fiery heat halo
        const halo = ctx.createRadialGradient(sx, sy, 3, sx, sy, r * 1.9);
        halo.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
        halo.addColorStop(0.5, 'rgba(249, 115, 22, 0.35)');
        halo.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(sx, sy, r * 1.9, 0, Math.PI * 2); ctx.fill();
        // Sculpted glowing coal lump with molten orange cracks
        const cG = ctx.createRadialGradient(sx - 4, sy - 4, 2, sx, sy, r);
        cG.addColorStop(0, '#fef08a'); cG.addColorStop(0.45, '#f97316'); cG.addColorStop(0.82, '#7c2d12'); cG.addColorStop(1, '#1c1917');
        ctx.fillStyle = cG; ctx.strokeStyle = '#0c0a09'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Cute fierce glowing eyes inside ember
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath(); ctx.arc(sx - 5, sy - 2, 2.8, 0, Math.PI * 2); ctx.arc(sx + 5, sy - 2, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 35. Express Railway Post-Owls (Stage 20 — Detailed anatomical Owl with layered flight feathers, ear tufts & wax-sealed mail satchel!)
    if (level.mail_owls) {
      for (const ow of level.mail_owls) {
        const ox = ow.x - camX, oy = ow.y - camY;
        if (ox < -120 || ox > cullW + 120) continue;
        const f = ow.facing || 1;
        const wingCycle = Math.sin(time * 8.5 + (ow.phase || 0));
        const wingLift = wingCycle * 14;
        ctx.save();
        ctx.translate(ox + ow.w * 0.5, oy + ow.h * 0.5);
        ctx.scale(f, 1);

        // 1. Far articulated feathered wing (darker tawny silhouette behind body)
        ctx.fillStyle = '#5c280a'; ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(2, -4);
        ctx.quadraticCurveTo(-8, -22 - wingLift * 0.8, -26, -12 - wingLift * 0.9);
        ctx.quadraticCurveTo(-18, -2 - wingLift * 0.4, -2, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 2. Sculpted fanned tail feathers with dark barring
        ctx.fillStyle = '#92400e'; ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-14, 1); ctx.lineTo(-30, -3); ctx.lineTo(-31, 4); ctx.lineTo(-27, 8); ctx.lineTo(-14, 6);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(-22, -1); ctx.lineTo(-22, 6); ctx.moveTo(-27, -2); ctx.lineTo(-27, 7); ctx.stroke();

        // 3. Sculpted anatomical owl torso with creamy scalloped breast plumage
        const oG = ctx.createLinearGradient(-16, -11, 16, 12);
        oG.addColorStop(0, '#78350f'); oG.addColorStop(0.45, '#b45309'); oG.addColorStop(0.78, '#fef3c7'); oG.addColorStop(1, '#fde68a');
        ctx.fillStyle = oG; ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-16, 2);
        ctx.bezierCurveTo(-14, -10, 6, -12, 16, -3);
        ctx.bezierCurveTo(18, 7, 4, 12, -16, 2);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Delicate scalloped feather flecks on chest
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.55)'; ctx.lineWidth = 1.0;
        for (const [fx, fy] of [[4, 2], [9, 1], [1, 5], [7, 5]]) {
          ctx.beginPath(); ctx.arc(fx, fy, 2.3, 0.2, Math.PI - 0.2); ctx.stroke();
        }

        // 4. Tucked talons clutching stitched leather Express Mail Satchel with brass buckle & wax-sealed letter!
        ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(-3, 8); ctx.lineTo(-2, 13); ctx.moveTo(4, 8); ctx.lineTo(5, 13); ctx.stroke();
        const bagG = ctx.createLinearGradient(-8, 10, 9, 21);
        bagG.addColorStop(0, '#991b1b'); bagG.addColorStop(1, '#450a0a');
        ctx.fillStyle = bagG; ctx.strokeStyle = '#1c0a05'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(-8, 10, 17, 11, 2.5); ctx.fill(); ctx.stroke();
        // Peeking cream express envelope with tiny red wax seal
        ctx.fillStyle = '#fffbeb'; ctx.fillRect(-5, 8, 10, 5);
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, 10.5, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(-1.5, 14, 4, 3);

        // 5. Near articulated layered wing with individual primary feather tips!
        const wG = ctx.createLinearGradient(-4, -16 + wingLift, -26, 6 + wingLift);
        wG.addColorStop(0, '#d97706'); wG.addColorStop(0.55, '#92400e'); wG.addColorStop(1, '#451a03');
        ctx.fillStyle = wG; ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(4, -2);
        ctx.bezierCurveTo(-4, -18 + wingLift, -22, -16 + wingLift, -32, -3 + wingLift);
        ctx.quadraticCurveTo(-24, 3 + wingLift * 0.7, -18, 2 + wingLift * 0.5);
        ctx.quadraticCurveTo(-12, 6 + wingLift * 0.3, -4, 4);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Primary feather barbs along trailing edge
        ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 0.95;
        for (let k = 0; k < 4; k++) {
          const t = k / 3;
          ctx.beginPath();
          ctx.moveTo(-6 - t * 14, -4 + wingLift * (0.4 + t * 0.4));
          ctx.lineTo(-14 - t * 14, 2 + wingLift * (0.4 + t * 0.45));
          ctx.stroke();
        }

        // 6. Expressive Owl Head with Feathered Ear Tufts, Heart Facial Disc, Amber Eyes & Hooked Beak
        ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(15, -5, 9.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Prominent feathered ear tufts
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(11, -13); ctx.lineTo(7, -20); ctx.lineTo(15, -14); ctx.closePath();
        ctx.moveTo(16, -13); ctx.lineTo(18, -20); ctx.lineTo(21, -12); ctx.closePath();
        ctx.fill(); ctx.stroke();
        // Pale cream heart-shaped facial disc
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath(); ctx.ellipse(17.5, -5, 6.2, 6.8, 0.1, 0, Math.PI * 2); ctx.fill();
        // Large luminous amber eye with dark pupil & bright specular catchlight
        ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#290d02'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.arc(19.2, -5.8, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(19.8, -5.8, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(18.8, -6.8, 1.0, 0, Math.PI * 2); ctx.fill();
        // Curved hooked raptor beak
        ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.moveTo(23.5, -5.5); ctx.quadraticCurveTo(28.5, -4, 26.5, -0.5); ctx.lineTo(23, -2); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }

    // 36. Masked Venetian Carnival Noble-Jester (Stage 21 — Brocade harlequin doublet, pleated ruff, porcelain Bauta mask, marotte scepter & walkDist-driven boots!)
    if (level.carnival_jesters) {
      for (const js of level.carnival_jesters) {
        const jx = js.x - camX, jy = js.y - camY;
        if (jx < -130 || jx > cullW + 130) continue;
        const f = js.facing || -1;
        const stride = Math.sin((js.walkDist || 0) * 0.14);
        const bob = Math.abs(stride) * 2.5;
        ctx.save();
        ctx.translate(jx + js.w * 0.5, jy + js.h);
        ctx.scale(f, 1);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
        ctx.beginPath(); ctx.ellipse(0, 0, 22, 4.8, 0, 0, Math.PI * 2); ctx.fill();

        // Articulated Renaissance knee-breeches, silk stockings & gold-buckled velvet shoes (walkDist-driven!)
        for (const [idx, s] of [[0, -1], [1, 1]]) {
          const swing = s * stride * 9.0;
          const kneeX = s * 3 + swing * 0.45;
          const footX = s * 4 + swing;
          ctx.strokeStyle = idx === 0 ? '#7f1d1d' : '#1e3a8a';
          ctx.lineWidth = 7.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.beginPath(); ctx.moveTo(s * 4, -22 - bob); ctx.lineTo(kneeX, -11 - bob * 0.5); ctx.lineTo(footX, -4); ctx.stroke();
          ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.0;
          ctx.beginPath(); ctx.roundRect(footX - 5, -6.5, 13, 6.5, [2, 4, 1, 1]); ctx.fill(); ctx.stroke();
        }

        // Tailored Crimson & Indigo Brocade Harlequin Doublet with Gold Diamond Motif & Velvet Capelet
        const dG = ctx.createLinearGradient(-14, -48 - bob, 14, -18 - bob);
        dG.addColorStop(0, '#dc2626'); dG.addColorStop(0.5, '#881337'); dG.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = dG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-12, -46 - bob); ctx.quadraticCurveTo(0, -49 - bob, 12, -46 - bob);
        ctx.lineTo(15, -19 - bob); ctx.quadraticCurveTo(0, -16 - bob, -15, -19 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        for (const [dx, dy] of [[-5, -37], [5, -37], [0, -29], [-6, -24], [6, -24]]) {
          ctx.beginPath(); ctx.moveTo(dx, dy - 4 - bob); ctx.lineTo(dx + 4, dy - bob); ctx.lineTo(dx, dy + 4 - bob); ctx.lineTo(dx - 4, dy - bob); ctx.closePath(); ctx.fill();
        }
        // Pleated white Renaissance lace ruff collar
        ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let r = -12; r <= 12; r += 6) {
          ctx.arc(r, -46 - bob, 4.2, 0, Math.PI * 2);
        }
        ctx.fill(); ctx.stroke();

        // Sculpted Porcelain Venetian Bauta Carnival Mask with Gold Filigree & Alert Crimson Glint!
        ctx.fillStyle = '#fffbeb'; ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(1, -56 - bob, 9.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Ornate gold mask brow filigree
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(-3, -60 - bob); ctx.quadraticCurveTo(4, -63 - bob, 10, -59 - bob); ctx.stroke();
        ctx.fillStyle = js.alert ? '#ef4444' : '#0f172a';
        ctx.beginPath(); ctx.ellipse(5.2, -56.5 - bob, 2.7, 1.7, -0.1, 0, Math.PI * 2); ctx.fill();

        // Twin Curving Velvet Jester Cap Horns with Swinging Golden Bells!
        const bellSway = Math.sin(time * 6 + (js.walkDist || 0) * 0.1) * 2.2;
        ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(-6, -62 - bob); ctx.quadraticCurveTo(-20, -76 - bob, -16 + bellSway, -58 - bob); ctx.quadraticCurveTo(-10, -64 - bob, -2, -63 - bob); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1d4ed8'; ctx.strokeStyle = '#172554';
        ctx.beginPath(); ctx.moveTo(4, -63 - bob); ctx.quadraticCurveTo(20, -78 - bob, 19 - bellSway, -59 - bob); ctx.quadraticCurveTo(10, -65 - bob, 1, -63 - bob); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.arc(-16 + bellSway, -58 - bob, 3.2, 0, Math.PI * 2); ctx.arc(19 - bellSway, -59 - bob, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Articulated Arm Holding a Gilded Venetian Carnival Marotte Scepter!
        const handX = 18, handY = -34 - bob;
        ctx.strokeStyle = '#991b1b'; ctx.lineWidth = 5.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(7, -42 - bob); ctx.lineTo(13, -37 - bob); ctx.lineTo(handX, handY); ctx.stroke();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(handX - 2, handY + 12); ctx.lineTo(handX + 5, handY - 18); ctx.stroke();
        ctx.fillStyle = '#fef08a'; ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(handX + 6, handY - 21, 5.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }

    // 37. Venetian Lagoon Quay Stone Crabs (Stage 21 — Realistic sculpted scalloped carapace, 4-pair jointed legs, serrated pincers & glossy eyestalks!)
    if (level.canal_crabs) {
      for (const cb of level.canal_crabs) {
        const cx = cb.x - camX, cy = cb.y - camY;
        if (cx < -95 || cx > cullW + 95) continue;
        const sc = Math.sin((cb.walkDist || 0) * 0.26);
        const bodyBob = Math.abs(sc) * 1.4;
        ctx.save();
        ctx.translate(cx + cb.w * 0.5, cy + cb.h);

        // 1. Soft grounded contact shadow on Venetian stone quay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
        ctx.beginPath(); ctx.ellipse(0, 0, 26, 4.8, 0, 0, Math.PI * 2); ctx.fill();

        // 2. Four pairs of anatomically jointed 3-segment walking legs (merus -> carpus -> tapered dactylus!)
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (const side of [-1, 1]) {
          for (let l = 0; l < 4; l++) {
            const phase = (l % 2 === 0 ? 1 : -1) * sc;
            const lift = Math.max(0, phase) * 3.8;
            const sway = phase * 2.2;
            const rootX = side * (9 + l * 2.2);
            const rootY = -10.5 - bodyBob + l * 0.5;
            const kneeX = side * (17 + l * 2.8) + sway * 0.5;
            const kneeY = -17.5 + l * 1.3 - lift;
            const midX = side * (22 + l * 2.6) + sway * 0.85;
            const midY = -9.5 + l * 1.4 - lift * 0.75;
            const tipX = side * (25.5 + l * 2.1) + sway;
            const tipY = -1.2 - lift * 0.25;

            // Dark chitinous outline + warm burnt-sienna leg segments
            ctx.strokeStyle = '#3b0707'; ctx.lineWidth = 4.2 - l * 0.25;
            ctx.beginPath(); ctx.moveTo(rootX, rootY); ctx.lineTo(kneeX, kneeY); ctx.lineTo(midX, midY); ctx.lineTo(tipX, tipY); ctx.stroke();
            ctx.strokeStyle = l % 2 === 0 ? '#c2410c' : '#b91c1c'; ctx.lineWidth = 2.4 - l * 0.15;
            ctx.beginPath(); ctx.moveTo(rootX, rootY); ctx.lineTo(kneeX, kneeY); ctx.lineTo(midX, midY); ctx.stroke();
            // Warm ochre dorsal highlight along upper femur (merus) & ivory-brown claw tip (dactylus)
            ctx.strokeStyle = '#fdba74'; ctx.lineWidth = 1.0;
            ctx.beginPath(); ctx.moveTo(rootX, rootY - 0.5); ctx.lineTo(kneeX, kneeY - 0.6); ctx.stroke();
            ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(midX, midY); ctx.lineTo(tipX, tipY); ctx.stroke();
            // Joint articulation dot
            ctx.fillStyle = '#450a0a';
            ctx.beginPath(); ctx.arc(kneeX, kneeY, 1.3, 0, Math.PI * 2); ctx.fill();
          }
        }

        // 3. Sculpted Realistic Scalloped Mediterranean Crab Carapace (bodyBob-driven)
        ctx.save();
        ctx.translate(0, -bodyBob);
        // Pale sandy-ivory ventral apron peek underneath shell
        ctx.fillStyle = '#fed7aa'; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.ellipse(0, -8.5, 13.5, 4.5, 0, 0, Math.PI); ctx.fill(); ctx.stroke();

        // Main broad hexagonal-oval carapace with serrated anterolateral marginal teeth
        const cG = ctx.createRadialGradient(-5, -21, 2.5, 0, -14.5, 23);
        cG.addColorStop(0, '#fed7aa');
        cG.addColorStop(0.28, '#f97316');
        cG.addColorStop(0.64, '#b91c1c');
        cG.addColorStop(0.88, '#7f1d1d');
        cG.addColorStop(1, '#3b0707');
        ctx.fillStyle = cG; ctx.strokeStyle = '#260404'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-20.5, -14.5);
        // Left anterolateral scalloped carapace teeth
        ctx.lineTo(-19.5, -17.8); ctx.lineTo(-17.8, -18.2);
        ctx.lineTo(-16.5, -21.2); ctx.lineTo(-14.2, -21.4);
        ctx.lineTo(-11.5, -23.8); ctx.quadraticCurveTo(0, -25.8, 11.5, -23.8);
        // Right anterolateral scalloped carapace teeth
        ctx.lineTo(14.2, -21.4); ctx.lineTo(16.5, -21.2);
        ctx.lineTo(17.8, -18.2); ctx.lineTo(19.5, -17.8);
        ctx.lineTo(20.5, -14.5);
        // Tapered posterolateral margin
        ctx.quadraticCurveTo(17, -7.5, 8.5, -7);
        ctx.lineTo(-8.5, -7);
        ctx.quadraticCurveTo(-17, -7.5, -20.5, -14.5);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Anatomical H-shaped cervical & branchiocardiac shell grooves + mottled natural shell speckles
        ctx.strokeStyle = 'rgba(69, 10, 10, 0.52)'; ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(-7.5, -18.5); ctx.quadraticCurveTo(-4.5, -15, -6, -11.5);
        ctx.moveTo(7.5, -18.5); ctx.quadraticCurveTo(4.5, -15, 6, -11.5);
        ctx.moveTo(-5.2, -15); ctx.quadraticCurveTo(0, -13.5, 5.2, -15);
        ctx.stroke();
        // Organic mottled terracotta/amber shell spots
        ctx.fillStyle = 'rgba(254, 215, 170, 0.34)';
        for (const [mx, my, mr] of [[-9, -18, 2.2], [-3, -20.5, 2.0], [5, -19.5, 2.3], [11, -16.5, 1.8], [-11, -13, 1.6], [2, -11.5, 1.9]]) {
          ctx.beginPath(); ctx.ellipse(mx, my, mr, mr * 0.65, 0.25, 0, Math.PI * 2); ctx.fill();
        }
        // Wet glossy canal-water specular sheen across upper dome
        ctx.fillStyle = 'rgba(255, 247, 237, 0.44)';
        ctx.beginPath(); ctx.ellipse(-5.5, -20.5, 7.2, 2.4, -0.22, 0, Math.PI * 2); ctx.fill();

        // Delicate twitching twin front sensory antennae + tiny mouthpart palps
        const antWig = Math.sin(time * 9 + (cb.x * 0.05)) * 1.6;
        ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(-2.5, -23.5); ctx.quadraticCurveTo(-4.5, -27, -7 + antWig, -28.5);
        ctx.moveTo(2.5, -23.5); ctx.quadraticCurveTo(4.5, -27, 7 - antWig, -28.5);
        ctx.stroke();

        // 4. Short-Armed, Large, Clean Classic Crab Pincers (Stocky Short Arms + Big Unmistakable Snapping C-Claws!)
        for (const side of [-1, 1]) {
          const snap = Math.max(0, Math.sin(time * 4.2 + side * 1.1)) * 0.28;
          ctx.save();
          ctx.translate(side * 15.5, -18.5);
          // Short, stocky claw arm tucked snugly beside the carapace shoulder
          ctx.strokeStyle = '#3b0707'; ctx.lineWidth = 6.2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(side * 4.5, -5.5); ctx.stroke();
          ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3.8;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(side * 4.5, -5.5); ctx.stroke();

          // Large, clean, iconic plump crab claw perched right at the short wrist
          ctx.translate(side * 4.8, -6.5);
          ctx.rotate(side * (-0.18 + snap * 0.12));

          const clawG = ctx.createRadialGradient(side * -2, -9, 2, 0, -7, 15);
          clawG.addColorStop(0, '#fed7aa');
          clawG.addColorStop(0.32, '#f97316');
          clawG.addColorStop(0.72, '#dc2626');
          clawG.addColorStop(1, '#7f1d1d');
          ctx.fillStyle = clawG; ctx.strokeStyle = '#260404'; ctx.lineWidth = 1.6;

          // Clean, bold classic crab pincer silhouette with dynamic snapping V-notch!
          const openAng = 0.24 + snap;
          ctx.beginPath();
          // Outer plump curved body of claw (bottom-outer up to outer pincer tip)
          ctx.moveTo(0, 1);
          ctx.bezierCurveTo(side * 11.5, -1.5, side * 13.5, -13.5, side * (4.5 + openAng * 6), -18.5);
          // Inner jaw notch sweeping down to the hinge and up to the inner pincer tip
          ctx.quadraticCurveTo(side * 3.5, -10.5, side * 0.5, -9.2);
          ctx.quadraticCurveTo(side * -2.8, -11.5, side * (-3.5 - openAng * 5), -17.8);
          // Inner curved claw contour back down to wrist
          ctx.bezierCurveTo(side * -10.5, -13.0, side * -8.5, -2.0, 0, 1);
          ctx.closePath();
          ctx.fill(); ctx.stroke();

          // Clean glossy wet specular highlight along outer claw curve
          ctx.fillStyle = 'rgba(255, 247, 237, 0.52)';
          ctx.beginPath(); ctx.ellipse(side * 5.2, -7.2, 2.2, 4.4, side * -0.22, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }

        // 5. Armored Eye Sockets & Expressive Glossy Stalked Eyes with Specular Catchlights
        for (const ex of [-6.8, 6.8]) {
          // Chitinous orbital socket collar
          ctx.fillStyle = '#9a3412'; ctx.strokeStyle = '#260404'; ctx.lineWidth = 1.1;
          ctx.beginPath(); ctx.ellipse(ex, -24.2, 2.8, 1.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          // Curved organic eyestalk
          ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(ex, -24.5); ctx.quadraticCurveTo(ex * 1.12, -28.2, ex * 1.08, -30.5); ctx.stroke();
          ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.moveTo(ex - 0.4, -25); ctx.lineTo(ex * 1.05, -29.8); ctx.stroke();
          // Glossy dark spherical eye + warm amber rim + crisp white catchlight
          const eyeX = ex * 1.08, eyeY = -31.2;
          ctx.fillStyle = '#090d16'; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.arc(eyeX, eyeY, 2.9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(eyeX - 0.9, eyeY - 1.0, 1.05, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(253, 186, 116, 0.55)';
          ctx.beginPath(); ctx.arc(eyeX + 1.0, eyeY + 1.0, 0.6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        ctx.restore();
      }
    }

    // 38. Graceful Anatomical Adriatic Yellow-Legged Gull (Stage 21 — Layered pearl-grey wings, black-white wingtips & authentic red-spotted yellow beak!)
    if (level.venice_gulls) {
      for (const gl of level.venice_gulls) {
        const gx = gl.x - camX, gy = gl.y - camY;
        if (gx < -110 || gx > cullW + 110) continue;
        const f = gl.facing || 1;
        const flap = Math.sin(time * 7.2 + (gl.phase || 0)) * 13;
        ctx.save();
        ctx.translate(gx + gl.w * 0.5, gy + gl.h * 0.5);
        ctx.scale(f, 1);
        // 1. Far articulated pearl-grey wing with dark slate primary tip
        ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(4, -3); ctx.quadraticCurveTo(-8, -21 - flap * 0.75, -28, -9 - flap * 0.85);
        ctx.quadraticCurveTo(-14, -1 - flap * 0.3, 4, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        // 2. Sculpted fanned white tail feathers
        ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-29, -3); ctx.lineTo(-28, 5); ctx.lineTo(-14, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
        // 3. Aerodynamic snow-white gull body with soft pearl underbelly shading
        const bG = ctx.createLinearGradient(0, -9, 0, 10);
        bG.addColorStop(0, '#ffffff'); bG.addColorStop(0.7, '#f1f5f9'); bG.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = bG; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-16, 1); ctx.bezierCurveTo(-12, -9, 8, -9, 17, -2); ctx.bezierCurveTo(16, 8, -4, 10, -16, 1);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Tucked yellow webbed feet
        ctx.strokeStyle = '#eab308'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(-4, 7); ctx.lineTo(-11, 9); ctx.stroke();
        // 4. Near articulated pearl-grey wing with authentic black primary wingtip & white mirror spots!
        const wG = ctx.createLinearGradient(4, -14 + flap, -30, 4 + flap);
        wG.addColorStop(0, '#e2e8f0'); wG.addColorStop(0.68, '#94a3b8'); wG.addColorStop(0.84, '#1e293b'); wG.addColorStop(1, '#0f172a');
        ctx.fillStyle = wG; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(6, -1);
        ctx.bezierCurveTo(-4, -18 + flap, -20, -16 + flap, -33, -4 + flap);
        ctx.quadraticCurveTo(-22, 4 + flap * 0.5, -12, 3 + flap * 0.3);
        ctx.quadraticCurveTo(-4, 5, 6, 3);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // 5. Sleek gull head, amber eye ring, dark pupil & yellow hooked beak with red gonys spot!
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(17, -4.5, 7.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(19.5, -5.2, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(19.8, -5.2, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#a16207'; ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.moveTo(23.5, -5.8); ctx.quadraticCurveTo(32, -4.5, 31.5, -1.5); ctx.lineTo(23, -1.2); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(28.2, -2.1, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 39. Royal Parisian Poodles (Stage 22 — Sculpted curly pom-pom coat, 3/4 canine snout, walkDist-driven 3-segment legs & crimson silk bow!)
    if (level.paris_poodles) {
      for (const pd of level.paris_poodles) {
        const px = pd.x - camX, py = pd.y - camY;
        if (px < -100 || px > cullW + 100) continue;
        const f = pd.facing || 1;
        const st = Math.sin((pd.walkDist || 0) * 0.14);
        const bob = Math.abs(st) * 2.2;
        ctx.save();
        ctx.translate(px + pd.w * 0.5, py + pd.h);
        ctx.scale(f, 1);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.30)';
        ctx.beginPath(); ctx.ellipse(0, 0, 22, 4.5, 0, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
        for (const [lx, ph] of [[-11, -st], [10, st]]) {
          const swing = ph * 6;
          ctx.beginPath(); ctx.moveTo(lx, -16 - bob); ctx.lineTo(lx + swing * 0.5, -8 - bob * 0.5); ctx.lineTo(lx + swing, -2); ctx.stroke();
          ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.0;
          ctx.beginPath(); ctx.arc(lx + swing * 0.85, -5.5, 3.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }

        const tailWig = Math.sin(time * 7 + pd.x * 0.02) * 3;
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(-16, -20 - bob); ctx.quadraticCurveTo(-24, -28 - bob, -23, -33 - bob + tailWig); ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(-23, -34 - bob + tailWig, 5.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        const coatG = ctx.createRadialGradient(4, -24 - bob, 3, 0, -18 - bob, 22);
        coatG.addColorStop(0, '#ffffff'); coatG.addColorStop(0.65, '#f1f5f9'); coatG.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = coatG; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-16, -18 - bob);
        ctx.bezierCurveTo(-14, -27 - bob, -2, -26 - bob, 4, -28 - bob);
        ctx.bezierCurveTo(16, -29 - bob, 19, -15 - bob, 9, -13 - bob);
        ctx.bezierCurveTo(1, -13 - bob, -8, -16 - bob, -16, -15 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        for (const [lx, ph] of [[-9, st], [12, -st]]) {
          const swing = ph * 6.5;
          ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3.6;
          ctx.beginPath(); ctx.moveTo(lx, -15 - bob); ctx.lineTo(lx + swing * 0.5, -7 - bob * 0.5); ctx.lineTo(lx + swing, -1.5); ctx.stroke();
          ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.1;
          ctx.beginPath(); ctx.arc(lx + swing * 0.85, -5.2, 4.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }

        ctx.fillStyle = '#e11d48'; ctx.strokeStyle = '#4c0519'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.ellipse(12, -26 - bob, 5.5, 2.6, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(10, -28 - bob);
        ctx.quadraticCurveTo(14, -38 - bob, 22, -35 - bob);
        ctx.lineTo(29, -31 - bob); ctx.quadraticCurveTo(30, -27 - bob, 22, -26 - bob);
        ctx.quadraticCurveTo(15, -24 - bob, 10, -28 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(16, -37 - bob, 6.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.ellipse(11.5, -30 - bob, 4.2, 8.2, 0.22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#090d16';
        ctx.beginPath(); ctx.arc(28.5, -30.5 - bob, 2.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(19.5, -33 - bob, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(19.0, -33.6 - bob, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 40. Imposing Parisian Boulangerie Chefs (Stage 22 — Enlarged w:52 h:78, Tall Pleated Toque Blanche, Apron, Handlebar Mustache, Baguette & Copper Whisk!)
    if (level.paris_bakers) {
      for (const bk of level.paris_bakers) {
        const bx = bk.x - camX, by = bk.y - camY;
        if (bx < -120 || bx > cullW + 120) continue;
        const f = bk.facing || 1;
        const st = Math.sin((bk.walkDist || 0) * 0.11);
        const bob = Math.abs(st) * 2.4;
        ctx.save();
        ctx.translate(bx + bk.w * 0.5, by + bk.h);
        ctx.scale(f, 1);

        // 1. Grounded contact shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
        ctx.beginPath(); ctx.ellipse(0, 0, 22, 5.2, 0, 0, Math.PI * 2); ctx.fill();

        // 2. Far arm holding gleaming copper pastry whisk (walkDist-driven counter-swing)
        ctx.save();
        ctx.translate(-8, -48 - bob);
        ctx.rotate(-st * 0.28 + 0.18);
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 6.2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-7, 15); ctx.stroke();
        ctx.fillStyle = '#fed7aa'; ctx.beginPath(); ctx.arc(-7, 17, 3.6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(-7, 17); ctx.lineTo(-14, 27); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(-16, 30, 4.2, 2.6, -0.7, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();

        // 3. Articulated walking striped chef trousers & dark polished chef clogs (walkDist-driven!)
        for (const [side, ph] of [[-1, -st], [1, st]]) {
          const sw = ph * 9.5;
          const lift = Math.max(0, ph) * 3.0;
          ctx.strokeStyle = side < 0 ? '#1e293b' : '#334155'; ctx.lineWidth = 8.4; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(side * 6, -26 - bob); ctx.lineTo(side * 6 + sw * 0.5, -13 - lift * 0.5); ctx.lineTo(side * 6 + sw, -4 - lift); ctx.stroke();
          // Fine houndstooth/stripe trouser highlight
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.32)'; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(side * 6 + 1, -24 - bob); ctx.lineTo(side * 6 + sw + 1, -5 - lift); ctx.stroke();
          // Polished leather kitchen clog
          ctx.fillStyle = '#090d16'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.0;
          ctx.beginPath(); ctx.ellipse(side * 6 + sw + 3, -2.5 - lift, 6.8, 3.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }

        // 4. Crisp Double-Breasted White Parisian Chef Jacket + Tied White Waist Apron + Tucked Wooden Spoon!
        const coatG = ctx.createLinearGradient(-16, -56 - bob, 16, -22 - bob);
        coatG.addColorStop(0, '#ffffff'); coatG.addColorStop(0.65, '#f1f5f9'); coatG.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = coatG; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(-16, -55 - bob, 32, 32, [8, 8, 4, 4]); ctx.fill(); ctx.stroke();
        // Double-breasted diagonal lapel seam & two rows of glossy black buttons
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(3, -53 - bob); ctx.lineTo(3, -32 - bob); ctx.stroke();
        ctx.fillStyle = '#0f172a';
        for (const by0 of [-48, -41, -35]) {
          ctx.beginPath(); ctx.arc(1, by0 - bob, 1.5, 0, Math.PI * 2); ctx.arc(9, by0 - bob, 1.5, 0, Math.PI * 2); ctx.fill();
        }
        // Tied crisp white waist apron draping over upper legs + tucked wooden spoon in pocket
        ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.roundRect(-15, -31 - bob, 30, 17, [2, 2, 4, 4]); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#d97706'; ctx.fillRect(-10, -34 - bob, 3, 10);
        ctx.beginPath(); ctx.ellipse(-8.5, -35 - bob, 3.0, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(-16, -31 - bob); ctx.lineTo(16, -31 - bob); ctx.stroke();

        // Knotted crimson silk Parisian chef neckerchief
        ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-11, -55 - bob); ctx.lineTo(11, -55 - bob);
        ctx.lineTo(6, -47 - bob); ctx.lineTo(-5, -47 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(4, -50 - bob, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // 5. Expressive 3/4 Parisian Chef Face (Warm shading, rosy cheek, sculpted nose, curled brown handlebar mustache!)
        const headG = ctx.createRadialGradient(-2, -66 - bob, 2, 0, -64 - bob, 11);
        headG.addColorStop(0, '#ffedd5'); headG.addColorStop(0.7, '#fdba74'); headG.addColorStop(1, '#c2410c');
        ctx.fillStyle = headG; ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.arc(0, -64 - bob, 10.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Warm rosy cheek & sculpted nose
        ctx.fillStyle = 'rgba(244, 63, 94, 0.34)';
        ctx.beginPath(); ctx.ellipse(4.5, -62 - bob, 3.0, 1.9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fdba74'; ctx.beginPath(); ctx.arc(9.5, -63.5 - bob, 2.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Expressive dark eye with catchlight & bushy brow
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(5.2, -66.2 - bob, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(4.7, -66.8 - bob, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(2.5, -69.5 - bob); ctx.lineTo(7.5, -68.8 - bob); ctx.stroke();
        // Signature curled brown French handlebar mustache!
        ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(1.5, -60 - bob); ctx.quadraticCurveTo(6.5, -62 - bob, 12.2, -59.5 - bob);
        ctx.quadraticCurveTo(14.5, -60.5 - bob, 13.5, -62.5 - bob);
        ctx.stroke();

        // 6. Monumental Tall Pleated White Toque Blanche Chef Hat!
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.4;
        ctx.fillRect(-11, -82 - bob, 22, 11); ctx.strokeRect(-11, -82 - bob, 22, 11);
        ctx.beginPath();
        ctx.arc(-8.5, -86 - bob, 7.2, 0, Math.PI * 2);
        ctx.arc(0, -90 - bob, 8.2, 0, Math.PI * 2);
        ctx.arc(8.5, -86 - bob, 7.2, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        // Vertical toque pleat seams
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)'; ctx.lineWidth = 1.0;
        for (const px0 of [-6, 0, 6]) { ctx.beginPath(); ctx.moveTo(px0, -82 - bob); ctx.lineTo(px0, -72 - bob); ctx.stroke(); }

        // 7. Articulated Foreground Arm holding a Large Crusty Golden Scored French Baguette!
        ctx.save();
        ctx.translate(6, -47 - bob);
        ctx.rotate(st * 0.24 - 0.34);
        ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 6.8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(9, 8); ctx.stroke();
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-1, -3); ctx.lineTo(8, 5); ctx.stroke();
        // Large golden artisanal French Baguette
        const bagG = ctx.createLinearGradient(4, -5, 34, 6);
        bagG.addColorStop(0, '#fef08a'); bagG.addColorStop(0.4, '#d97706'); bagG.addColorStop(1, '#78350f');
        ctx.fillStyle = bagG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.roundRect(2, 2, 32, 9.5, 4.8); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 1.3;
        for (const sx of [8, 15, 22, 28]) { ctx.beginPath(); ctx.moveTo(sx, 3.4); ctx.lineTo(sx + 3.5, 9.8); ctx.stroke(); }
        // Chef hand gripping baguette
        ctx.fillStyle = '#fed7aa'; ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.arc(10, 8, 3.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
        ctx.restore();
      }
    }

    // 41. Parisian Rooftop Pigeons (Stage 22 — Iridescent emerald-violet neck, twin black wing-bars & graceful sine glide!)
    if (level.paris_pigeons) {
      for (const pg of level.paris_pigeons) {
        const gx = pg.x - camX, gy = pg.y - camY;
        if (gx < -95 || gx > cullW + 95) continue;
        const f = pg.facing || 1;
        const flap = Math.sin(time * 8.2 + (pg.phase || 0)) * 11;
        ctx.save();
        ctx.translate(gx + pg.w * 0.5, gy + pg.h * 0.5);
        ctx.scale(f, 1);

        ctx.fillStyle = '#64748b'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(3, -2); ctx.quadraticCurveTo(-7, -17 - flap * 0.7, -23, -7 - flap * 0.8); ctx.quadraticCurveTo(-11, 0, 3, 1); ctx.closePath(); ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#475569'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.moveTo(-12, 1); ctx.lineTo(-26, -2); ctx.lineTo(-25, 6); ctx.lineTo(-12, 5); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#0f172a'; ctx.fillRect(-25, -1, 4, 6);

        const bG = ctx.createLinearGradient(-12, -7, 14, 8);
        bG.addColorStop(0, '#94a3b8'); bG.addColorStop(0.65, '#64748b'); bG.addColorStop(1, '#334155');
        ctx.fillStyle = bG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(0, 1, 14, 7.2, -0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        const irG = ctx.createLinearGradient(7, -6, 15, 2);
        irG.addColorStop(0, '#10b981'); irG.addColorStop(0.55, '#8b5cf6'); irG.addColorStop(1, '#475569');
        ctx.fillStyle = irG; ctx.beginPath(); ctx.ellipse(10.5, -2, 4.8, 5.2, 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(-3, 7); ctx.lineTo(-9, 9); ctx.stroke();

        ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(5, -1); ctx.bezierCurveTo(-4, -15 + flap, -18, -13 + flap, -27, -3 + flap);
        ctx.quadraticCurveTo(-15, 4 + flap * 0.4, 5, 3);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(-4, -4 + flap * 0.5); ctx.lineTo(-14, -2 + flap * 0.65); ctx.moveTo(-9, -7 + flap * 0.6); ctx.lineTo(-19, -5 + flap * 0.75); ctx.stroke();

        ctx.fillStyle = '#475569'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.arc(14.5, -5.5, 5.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(16.6, -6.2, 1.9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(16.9, -6.2, 1.0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.moveTo(19.5, -6.4); ctx.lineTo(25.2, -4.6); ctx.lineTo(19.5, -3.4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(20.2, -5.8, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 42. Atlas Barbary Macaque Monkeys (Stage 23 — Layered golden-olive fur, 2-segment limbs, embroidered Jabador vest & Fassi Fez!)
    if (level.morocco_monkeys) {
      for (const mk of level.morocco_monkeys) {
        const mx = mk.x - camX, my = mk.y - camY;
        if (mx < -95 || mx > cullW + 95) continue;
        const f = mk.facing || 1;
        const phase = (mk.walkDist || 0) * 0.14;
        const stride = Math.sin(phase) * 6.8;
        const bob = Math.abs(Math.cos(phase)) * 2.4;
        ctx.save();
        ctx.translate(mx + mk.w * 0.5, my + mk.h);
        ctx.scale(f, 1);

        // Ground contact shadow
        ctx.fillStyle = 'rgba(45, 18, 8, 0.32)';
        ctx.beginPath(); ctx.ellipse(0, -1, 17, 4.4, 0, 0, Math.PI * 2); ctx.fill();

        // Far 2-segment articulated limbs (strictly walkDist-driven!)
        ctx.strokeStyle = '#4e351f'; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(-8, -15 - bob); ctx.lineTo(-11 - stride * 0.5, -9 - bob * 0.5); ctx.lineTo(-10 - stride, -2.5);
        ctx.moveTo(7, -16 - bob); ctx.lineTo(10 + stride * 0.5, -9 - bob * 0.5); ctx.lineTo(10 + stride, -2.5);
        ctx.stroke();

        // Sculpted Atlas Barbary macaque golden-olive fur torso + fluffy shoulder ruff (tailless Barbary rump!)
        const furG = ctx.createRadialGradient(-1, -21 - bob, 3, 0, -17 - bob, 17);
        furG.addColorStop(0, '#c89f68');
        furG.addColorStop(0.55, '#936b3e');
        furG.addColorStop(1, '#54391e');
        ctx.fillStyle = furG; ctx.strokeStyle = '#362211'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-15, -16 - bob);
        ctx.bezierCurveTo(-15, -28 - bob, 2, -30 - bob, 11, -23 - bob);
        ctx.bezierCurveTo(14, -17 - bob, 10, -9 - bob, -2, -9 - bob);
        ctx.quadraticCurveTo(-14, -9 - bob, -15, -16 - bob);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Warm buff fur tufts along back ridge
        ctx.strokeStyle = 'rgba(245, 222, 179, 0.45)'; ctx.lineWidth = 1.2;
        for (const fx of [-9, -4, 1]) {
          ctx.beginPath(); ctx.moveTo(fx, -25 - bob); ctx.lineTo(fx - 3.5, -23 - bob); ctx.stroke();
        }

        // Richly Embroidered Crimson & Emerald Moroccan Jabador Souk Vest with Gold Sfifa & Aakad Buttons!
        const vG = ctx.createLinearGradient(-4, -27 - bob, 9, -10 - bob);
        vG.addColorStop(0, '#e11d48'); vG.addColorStop(0.6, '#9f1239'); vG.addColorStop(1, '#4c0519');
        ctx.fillStyle = vG; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-5, -26 - bob);
        ctx.quadraticCurveTo(5, -27 - bob, 9.5, -21 - bob);
        ctx.quadraticCurveTo(10, -13 - bob, 3, -10 - bob);
        ctx.lineTo(-5, -12 - bob);
        ctx.quadraticCurveTo(-3, -19 - bob, -5, -26 - bob);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        // Emerald diamond patch & brass aakad buttons on vest
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(1, -21 - bob); ctx.lineTo(4, -18 - bob); ctx.lineTo(1, -15 - bob); ctx.lineTo(-2, -18 - bob);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fde047';
        for (const by of [-23, -19, -15]) {
          ctx.beginPath(); ctx.arc(7.2, by - bob, 1.1, 0, Math.PI * 2); ctx.fill();
        }

        // Near 2-segment articulated limbs + nimble peach-tan hands/paws
        ctx.strokeStyle = '#7c5834'; ctx.lineWidth = 4.6;
        ctx.beginPath();
        ctx.moveTo(-6, -15 - bob); ctx.lineTo(-8 + stride * 0.5, -8.5 - bob * 0.5); ctx.lineTo(-5 + stride, -2.5);
        ctx.moveTo(7.5, -16 - bob); ctx.lineTo(11 - stride * 0.45, -9 - bob * 0.5); ctx.lineTo(11 - stride, -2.5);
        ctx.stroke();
        ctx.fillStyle = '#e2b28e'; ctx.strokeStyle = '#4e351f'; ctx.lineWidth = 0.9;
        for (const px0 of [-5 + stride, 11 - stride]) {
          ctx.beginPath(); ctx.ellipse(px0 + 1, -2.2, 3.2, 2.0, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }

        // Sculpted Macaque Head, Fluffy Cream Cheek Whiskers, Brow Ridge & Expressive Face!
        ctx.fillStyle = '#8f683d'; ctx.strokeStyle = '#362211'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.arc(10.5, -29.5 - bob, 8.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Rounded ear with pink-tan inner pinna
        ctx.fillStyle = '#d6a47c';
        ctx.beginPath(); ctx.arc(4.2, -30.5 - bob, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Fluffy cream-buff macaque cheek ruff
        ctx.fillStyle = '#f3dfc1';
        ctx.beginPath(); ctx.ellipse(8.5, -26 - bob, 4.2, 3.6, -0.2, 0, Math.PI * 2); ctx.fill();
        // Peach-tan facial mask & protruding muzzle
        ctx.fillStyle = '#e5b591';
        ctx.beginPath(); ctx.ellipse(14.2, -28.2 - bob, 6.2, 5.6, 0.1, 0, Math.PI * 2); ctx.fill();
        // Expressive brow ridge, amber eye with white catchlight & nostrils
        ctx.strokeStyle = '#54391e'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(11, -32.5 - bob); ctx.quadraticCurveTo(15, -33.8 - bob, 18, -31.5 - bob); ctx.stroke();
        ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(14.8, -30.0 - bob, 2.0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(15.3, -30.0 - bob, 1.05, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(14.5, -30.6 - bob, 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#451a03'; ctx.beginPath(); ctx.arc(18.6, -27.5 - bob, 1.3, 0, Math.PI * 2); ctx.fill();

        // Jaunty Fassi Crimson Tarbouche (Fez) with Gold-Emerald Trim & Swinging Silk Tassel!
        ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(5.5, -36 - bob); ctx.lineTo(7.2, -43.5 - bob);
        ctx.lineTo(14.5, -42.8 - bob); ctx.lineTo(15.6, -35.2 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#065f46';
        ctx.fillRect(6.0, -37.5 - bob, 9.2, 2.2);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(10.8, -43.2 - bob);
        ctx.quadraticCurveTo(4.5, -42 - bob, 3.2 - stride * 0.25, -35 - bob);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(3.2 - stride * 0.25, -35 - bob, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 43. Adult Marrakech Souk Atay & Spice Masters (Stage 23 — Striped Djellaba with Sfifa & Chkara Leather Bag, Rezza Turban, Steaming Berrad Tea Tray & Babouche!)
    if (level.morocco_merchants) {
      for (const mc of level.morocco_merchants) {
        const mx = mc.x - camX, my = mc.y - camY;
        if (mx < -110 || mx > cullW + 110) continue;
        const f = mc.facing || 1;
        const phase = (mc.walkDist || 0) * 0.10;
        const stride = Math.sin(phase) * 8.5;
        const bob = Math.abs(Math.cos(phase)) * 2.4;
        const variant = Math.abs(Math.floor((mc.minX || 0) / 300)) % 3;
        const robeTop = variant === 0 ? '#047857' : (variant === 1 ? '#d97706' : '#1d4ed8');
        const robeMid = variant === 0 ? '#065f46' : (variant === 1 ? '#b45309' : '#1e40af');
        const robeBot = variant === 0 ? '#064e3b' : (variant === 1 ? '#78350f' : '#172554');
        ctx.save();
        ctx.translate(mx + mc.w * 0.5, my + mc.h);
        ctx.scale(f, 1);

        // Ground shadow
        ctx.fillStyle = 'rgba(45, 18, 8, 0.34)';
        ctx.beginPath(); ctx.ellipse(0, -1, 20, 5.0, 0, 0, Math.PI * 2); ctx.fill();

        // Pointed Saffron Moroccan Babouche Leather Slippers with Gold Embroidery (walkDist-driven!)
        for (const leg of [{ x: -stride, back: true }, { x: stride, back: false }]) {
          ctx.fillStyle = leg.back ? '#b45309' : '#d99b66';
          ctx.fillRect(leg.x - 3, -11, 5.5, 5);
          ctx.fillStyle = leg.back ? '#ca8a04' : '#facc15';
          ctx.strokeStyle = '#713f12'; ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(leg.x - 6.5, -7);
          ctx.lineTo(leg.x + 8, -7);
          ctx.quadraticCurveTo(leg.x + 14, -6.5, leg.x + 14.5, -3.5); // authentic upturned pointed Babouche toe!
          ctx.lineTo(leg.x + 11, -1.8);
          ctx.lineTo(leg.x - 6.5, -1.8);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          if (!leg.back) {
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(leg.x + 5, -4.5, 1.3, 0, Math.PI * 2); ctx.fill();
          }
        }

        // Flowing Moroccan Djellaba Robe with Woven Stripes, Draped Qob Hood & Gold Sfifa Placket!
        const rG = ctx.createLinearGradient(-15, -56 - bob, 16, -6);
        rG.addColorStop(0, robeTop); rG.addColorStop(0.55, robeMid); rG.addColorStop(1, robeBot);
        ctx.fillStyle = rG; ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-12, -55 - bob);
        ctx.quadraticCurveTo(-19, -30 - bob, -16.5, -6);
        ctx.lineTo(15.5, -6);
        ctx.quadraticCurveTo(17.5, -30 - bob, 12, -55 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Subtle woven vertical silk stripes on Djellaba
        ctx.strokeStyle = 'rgba(255, 251, 235, 0.14)'; ctx.lineWidth = 1.0;
        for (const sx0 of [-10, -4, 8]) {
          ctx.beginPath(); ctx.moveTo(sx0, -52 - bob); ctx.lineTo(sx0 * 1.15, -8); ctx.stroke();
        }

        // Gold braided Sfifa trim, Aakad knot buttons & hem embroidery
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(3.5, -54 - bob); ctx.lineTo(4.5, -8);
        ctx.moveTo(-15.5, -9); ctx.lineTo(14.5, -9);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        for (let by = -49; by <= -25; by += 6) {
          ctx.beginPath(); ctx.arc(3.8, by - bob, 1.2, 0, Math.PI * 2); ctx.fill();
        }

        // Traditional Embossed Marrakech Leather Crossbody Satchel (Chkara) & Brass Buckle!
        ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(-6, -54 - bob); ctx.lineTo(8, -26 - bob); ctx.stroke();
        ctx.fillStyle = '#9a3412'; ctx.strokeStyle = '#431407'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(-12, -31 - bob, 11, 10, 2.5); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(-6.5, -26 - bob, 1.6, 0, Math.PI * 2); ctx.fill();

        // Draped Pointed Djellaba Hood (Qob) with silk tassel on back
        ctx.fillStyle = robeBot; ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-10, -55 - bob); ctx.lineTo(-22, -43 - bob); ctx.lineTo(-13, -37 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(-22, -42 - bob, 1.8, 0, Math.PI * 2); ctx.fill();

        // Expressive Face, Warm Skin Tone, Trimmed Beard, Mustache & Friendly Smile
        ctx.fillStyle = '#d99b66'; ctx.strokeStyle = '#5c3317'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(1.5, -63 - bob, 9.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(3.8, -59.5 - bob, 6.4, 0.08, Math.PI * 0.94);
        ctx.closePath(); ctx.fill();
        // Warm eye + eyebrow + nose bridge
        ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(3.5, -66.5 - bob); ctx.lineTo(7.8, -66 - bob); ctx.stroke();
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(5.8, -64.2 - bob, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(5.3, -64.7 - bob, 0.55, 0, Math.PI * 2); ctx.fill();

        // Multi-Fold Wrapped Moroccan Rezza Turban (Ivory & Saffron-Gold Folds!)
        const tG = ctx.createLinearGradient(-11, -77 - bob, 12, -65 - bob);
        tG.addColorStop(0, '#fffbeb'); tG.addColorStop(0.55, '#f8fafc'); tG.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = tG; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.ellipse(0.5, -70.5 - bob, 12, 7.2, -0.06, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Crisscrossing turban cloth folds & saffron silk band
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(-9, -72 - bob); ctx.quadraticCurveTo(1, -67 - bob, 10, -72 - bob);
        ctx.moveTo(-7, -75 - bob); ctx.quadraticCurveTo(2, -70 - bob, 9, -74 - bob);
        ctx.stroke();
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.7;
        ctx.beginPath(); ctx.moveTo(-9.5, -68.5 - bob); ctx.quadraticCurveTo(1, -72.5 - bob, 10.5, -68.5 - bob); ctx.stroke();

        // Outstretched Djellaba Sleeve Balancing Ornate Chased-Brass Siniya Tea Tray, Silver Berrad & Steaming Keesan!
        ctx.fillStyle = robeTop; ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(5, -49 - bob); ctx.lineTo(19, -42 - bob); ctx.lineTo(17.5, -35 - bob); ctx.lineTo(4, -40 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(18.2, -42 - bob); ctx.lineTo(17, -35.5 - bob); ctx.stroke();

        // Chased hammered-brass Siniya tray with scalloped rim
        ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.ellipse(23.5, -40 - bob, 14.5, 3.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Gleaming Silver-Brass Moroccan Berrad Teapot (bulbous body, conical lid, handle & curved spout!)
        const tpX = 18.5, tpY = -46.5 - bob;
        const berradG = ctx.createRadialGradient(tpX - 1.5, tpY - 2, 1, tpX, tpY, 6.5);
        berradG.addColorStop(0, '#ffffff'); berradG.addColorStop(0.55, '#fde68a'); berradG.addColorStop(1, '#b45309');
        ctx.fillStyle = berradG; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.15;
        ctx.beginPath(); ctx.ellipse(tpX, tpY, 5.2, 6.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tpX - 3.5, tpY - 5.5); ctx.lineTo(tpX, tpY - 10.5); ctx.lineTo(tpX + 3.5, tpY - 5.5); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tpX + 4.5, tpY + 1); ctx.quadraticCurveTo(tpX + 10.5, tpY - 2, tpX + 9.5, tpY - 8.5);
        ctx.moveTo(tpX - 4.5, tpY - 3.5); ctx.quadraticCurveTo(tpX - 9, tpY, tpX - 4.5, tpY + 3.5);
        ctx.stroke();

        // Twin Jewel-Toned Gilded Mint-Tea Glasses (Keesan) with Fresh Mint Sprigs + Rising Fragrant Steam!
        for (const [gx, gCol] of [[25.5, '#10b981'], [30.5, '#e11d48']]) {
          ctx.fillStyle = gCol; ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 0.9;
          ctx.fillRect(gx, -46.5 - bob, 4.0, 6.2); ctx.strokeRect(gx, -46.5 - bob, 4.0, 6.2);
          ctx.fillStyle = '#22c55e';
          ctx.beginPath(); ctx.arc(gx + 2, -47.5 - bob, 1.5, 0, Math.PI * 2); ctx.fill();
        }
        // Rising curly mint-tea steam wisp
        const stLift = (time * 14 + (mc.minX || 0)) % 12;
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.58 * (1 - stLift / 12)).toFixed(2)})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(28, -50 - bob - stLift);
        ctx.quadraticCurveTo(30.5, -54 - bob - stLift, 27.5, -58 - bob - stLift);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 44. Moroccan Kasbah White Storks — Bellarej (Stage 23 — Slotted black primaries, S-neck ruff, vermilion bill & trailing scarlet legs!)
    if (level.morocco_storks) {
      for (const st of level.morocco_storks) {
        const sx = st.x - camX, sy = st.y - camY;
        if (sx < -110 || sx > cullW + 110) continue;
        const f = st.facing || 1;
        const flap = Math.sin(time * 6.8 + (st.phase || 0)) * 13;
        const farFlap = Math.sin(time * 6.8 + (st.phase || 0) - 0.3) * 11;
        ctx.save();
        ctx.translate(sx + st.w * 0.5, sy + st.h * 0.5);
        ctx.scale(f, 1);

        // 1. Far Wing (White coverts + slotted jet-black primary wingtips)
        ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(5, -2);
        ctx.quadraticCurveTo(-8, -20 - farFlap * 0.8, -26, -11 - farFlap * 0.9);
        ctx.quadraticCurveTo(-13, 0, 5, 1);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(-12, -8 - farFlap * 0.65);
        ctx.lineTo(-27, -11 - farFlap * 0.9);
        ctx.lineTo(-23, -6 - farFlap * 0.7);
        ctx.lineTo(-25, -3 - farFlap * 0.55);
        ctx.lineTo(-15, -2 - farFlap * 0.35);
        ctx.closePath(); ctx.fill();

        // 2. Trailing Long Scarlet-Crimson Stork Legs & Feet + Black Tail Feathers
        ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1.9; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-10, 4); ctx.lineTo(-21, 6); ctx.lineTo(-32, 7.5);
        ctx.moveTo(-9, 6); ctx.lineTo(-20, 8.5); ctx.lineTo(-30, 10.5);
        ctx.stroke();
        // Black stork tail tips
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(-12, 0); ctx.lineTo(-22, -2); ctx.lineTo(-20, 4); ctx.lineTo(-11, 4);
        ctx.closePath(); ctx.fill();

        // 3. Sleek White Stork Body, Fluffy Breast Ruff & Graceful Outstretched Neck
        const bG = ctx.createLinearGradient(-15, -6, 16, 8);
        bG.addColorStop(0, '#ffffff'); bG.addColorStop(0.7, '#f8fafc'); bG.addColorStop(1, '#fed7aa');
        ctx.fillStyle = bG; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(-1, 1.5, 15, 6.8, -0.05, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Graceful S-curved neck + shaggy white chest feathers
        ctx.beginPath();
        ctx.moveTo(8, -2.5);
        ctx.quadraticCurveTo(14, -5.5, 19, -5.2);
        ctx.lineTo(19, -0.5);
        ctx.quadraticCurveTo(13, 3.5, 7, 4.5);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 4. Near Articulated Wing with Scalloped Coverts & Slotted Jet-Black Flight Feathers!
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(7, -1);
        ctx.bezierCurveTo(-4, -18 + flap, -19, -16 + flap, -31, -5 + flap);
        ctx.quadraticCurveTo(-16, 4 + flap * 0.45, 7, 3.2);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Individually slotted jet-black outer & trailing primaries
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(-9, -4 + flap * 0.6);
        ctx.lineTo(-31, -5 + flap);
        ctx.lineTo(-27, -1 + flap * 0.85);
        ctx.lineTo(-30, 2 + flap * 0.8);
        ctx.lineTo(-24, 3 + flap * 0.65);
        ctx.lineTo(-26, 6 + flap * 0.6);
        ctx.lineTo(-8, 3 + flap * 0.35);
        ctx.closePath(); ctx.fill();

        // 5. Sculpted Head, Dark Ocular Ring & Long Sharp Vermilion-Red Stork Bill!
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.15;
        ctx.beginPath(); ctx.arc(19.5, -3.6, 4.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.ellipse(20.8, -4.2, 1.9, 1.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(20.5, -4.6, 0.55, 0, Math.PI * 2); ctx.fill();

        const billG = ctx.createLinearGradient(23, -5.2, 37, -3.0);
        billG.addColorStop(0, '#ef4444'); billG.addColorStop(1, '#b91c1c');
        ctx.fillStyle = billG; ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(23.2, -5.4);
        ctx.lineTo(37.5, -3.1);
        ctx.lineTo(23.2, -1.5);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(23.4, -3.4); ctx.lineTo(36.5, -3.1); ctx.stroke();
        ctx.restore();
      }
    }

    // 45. Yucatán Jaguars (Stage 24 — Muscular golden-amber coat, authentic rosette spots, whiskers, ear ocelli & emerald eyes!)
    if (level.maya_jaguars) {
      for (const jg of level.maya_jaguars) {
        const jx = jg.x - camX, jy = jg.y - camY;
        if (jx < -105 || jx > cullW + 105) continue;
        const f = jg.facing || 1;
        const phase = (jg.walkDist || 0) * 0.12;
        const stride = Math.sin(phase) * 9.5;
        const stride2 = Math.cos(phase) * 8.0;
        const bob = Math.abs(Math.sin(phase)) * 2.2;
        ctx.save();
        ctx.translate(jx + jg.w * 0.5, jy + jg.h);
        ctx.scale(f, 1);

        // Contact shadow
        ctx.fillStyle = 'rgba(16, 26, 12, 0.36)';
        ctx.beginPath(); ctx.ellipse(0, -1, 25, 5.0, 0, 0, Math.PI * 2); ctx.fill();

        // Swishing ringed jaguar tail with dark tip
        const tWag = Math.sin(time * 4.2 + jg.x * 0.02) * 5.5;
        ctx.strokeStyle = '#78350f'; ctx.lineWidth = 5.0; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-18, -20 - bob); ctx.quadraticCurveTo(-31, -25 + tWag, -35, -14 + tWag); ctx.stroke();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.8;
        ctx.beginPath(); ctx.moveTo(-18, -20 - bob); ctx.quadraticCurveTo(-30, -24 + tWag, -32, -16 + tWag); ctx.stroke();
        ctx.fillStyle = '#1c1917';
        ctx.beginPath(); ctx.arc(-35, -14 + tWag, 2.6, 0, Math.PI * 2); ctx.fill();

        // Far legs (3-segment articulated, walkDist-driven)
        ctx.strokeStyle = '#b45309'; ctx.lineWidth = 5.2; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(-12, -16 - bob); ctx.lineTo(-14 - stride * 0.5, -8); ctx.lineTo(-12 - stride, -2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(12, -17 - bob); ctx.lineTo(14 + stride2 * 0.5, -8); ctx.lineTo(12 + stride2, -2); ctx.stroke();

        // Sculpted muscular jaguar torso with golden-amber dorsal sheen & ivory chest/belly
        const bG = ctx.createLinearGradient(-20, -31 - bob, 20, -9 - bob);
        bG.addColorStop(0, '#fde047'); bG.addColorStop(0.32, '#f59e0b'); bG.addColorStop(0.75, '#d97706'); bG.addColorStop(1, '#92400e');
        ctx.fillStyle = bG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-20, -18 - bob);
        ctx.bezierCurveTo(-18, -31 - bob, 8, -32 - bob, 18, -24 - bob);
        ctx.bezierCurveTo(22, -16 - bob, 14, -9 - bob, 0, -10 - bob);
        ctx.bezierCurveTo(-13, -10 - bob, -21, -12 - bob, -20, -18 - bob);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath(); ctx.ellipse(2, -12.5 - bob, 14, 3.6, 0, 0, Math.PI); ctx.fill();

        // Authentic Jaguar Rosette Spots (broken dark polygon ring + rich amber core + central dot!)
        for (const [rx, ry, rr] of [[-12, -22, 2.9], [-4, -24.5, 3.1], [5, -23.5, 2.9], [12.5, -20, 2.6], [-8, -16.5, 2.5], [1, -18, 2.7], [9, -15.5, 2.4]]) {
          ctx.fillStyle = '#b45309';
          ctx.beginPath(); ctx.arc(rx, ry - bob, rr, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#1c0a00'; ctx.lineWidth = 1.5; ctx.setLineDash([3.2, 1.4]);
          ctx.beginPath(); ctx.arc(rx, ry - bob, rr, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#1c0a00';
          ctx.beginPath(); ctx.arc(rx, ry - bob, 0.85, 0, Math.PI * 2); ctx.fill();
        }

        // Near legs (walkDist-driven) with spotted shoulders & ivory paws
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 5.6;
        ctx.beginPath(); ctx.moveTo(-10, -16 - bob); ctx.lineTo(-11 + stride * 0.5, -8); ctx.lineTo(-10 + stride, -2.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(13, -17 - bob); ctx.lineTo(15 - stride2 * 0.5, -8); ctx.lineTo(13 - stride2, -2.5); ctx.stroke();
        ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.ellipse(-10 + stride, -2, 3.8, 2.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(13 - stride2, -2, 3.8, 2.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Sculpted Jaguar Head, Rounded Black-Rim Ears with White Ocelli, Broad Muzzle, Whiskers & Glowing Emerald Eyes
        ctx.fillStyle = '#291003';
        ctx.beginPath(); ctx.arc(16.5, -33.5 - bob, 3.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath(); ctx.arc(16.2, -33.8 - bob, 1.5, 0, Math.PI * 2); ctx.fill();

        const hG = ctx.createRadialGradient(20, -28 - bob, 2, 21, -26 - bob, 10);
        hG.addColorStop(0, '#fde047'); hG.addColorStop(0.65, '#f59e0b'); hG.addColorStop(1, '#b45309');
        ctx.fillStyle = hG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.ellipse(21, -26 - bob, 9.8, 8.2, 0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath(); ctx.ellipse(27.2, -23.2 - bob, 4.8, 3.6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#9f1239';
        ctx.beginPath(); ctx.arc(30.8, -24.5 - bob, 1.7, 0, Math.PI * 2); ctx.fill();
        // Crisp white jaguar whiskers
        ctx.strokeStyle = 'rgba(255, 251, 235, 0.85)'; ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(27, -22.5 - bob); ctx.lineTo(33.5, -21 - bob);
        ctx.moveTo(26.5, -21.5 - bob); ctx.lineTo(32.5, -19 - bob);
        ctx.stroke();
        // Piercing emerald feline eye with vertical slit pupil & catchlight
        ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(24.5, -28 - bob, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16'; ctx.fillRect(24.1, -30.0 - bob, 1.0, 3.8);
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(23.7, -28.9 - bob, 0.85, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 46. Adult Mayan Jaguar Temple Guardians (Stage 24 — Sculpted Jaguar Helmet Headdress, Quetzal Plumes, Jade Pectoral, Obsidian Macuahuitl & Feathered Sun Shield!)
    if (level.maya_warriors) {
      for (const mw of level.maya_warriors) {
        const mx = mw.x - camX, my = mw.y - camY;
        if (mx < -110 || mx > cullW + 110) continue;
        const f = mw.facing || 1;
        const phase = (mw.walkDist || 0) * 0.10;
        const stride = Math.sin(phase) * 8.5;
        const bob = Math.abs(Math.cos(phase)) * 2.2;
        ctx.save();
        ctx.translate(mx + mw.w * 0.5, my + mw.h);
        ctx.scale(f, 1);

        // Contact shadow
        ctx.fillStyle = 'rgba(16, 26, 12, 0.34)';
        ctx.beginPath(); ctx.ellipse(0, -1, 20, 5.0, 0, 0, Math.PI * 2); ctx.fill();

        // Articulated legs, jade ankle greaves & laced Mesoamerican sandals (strictly walkDist-driven!)
        for (const leg of [{ x: -stride, col: '#9a5a32' }, { x: stride, col: '#be7647' }]) {
          ctx.strokeStyle = leg.col; ctx.lineWidth = 5.6; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(leg.x * 0.3, -24 - bob); ctx.lineTo(leg.x, -4); ctx.stroke();
          ctx.fillStyle = '#059669'; ctx.fillRect(leg.x - 3, -12, 6, 4);
          ctx.fillStyle = '#451a03'; ctx.fillRect(leg.x - 5, -5, 12.5, 4.5);
          ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(leg.x - 3, -9); ctx.lineTo(leg.x + 3, -6); ctx.stroke();
        }

        // Jaguar-pelt & embroidered crimson/Maya-blue Mayan ceremonial loincloth apron (Maxtlatl)
        ctx.fillStyle = '#991b1b'; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(-12, -36 - bob); ctx.lineTo(12, -36 - bob); ctx.lineTo(15, -18 - bob); ctx.lineTo(-15, -18 - bob); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#0284c7'; ctx.fillRect(-13, -23 - bob, 26, 4.5);
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(-4, -36 - bob, 8, 20);
        ctx.fillStyle = '#10b981'; ctx.fillRect(-2, -33 - bob, 4, 14);

        // Muscular bronze torso + Beaded Mayan Jade & Gold Pectoral Collar + Jade Bracers
        const tG = ctx.createLinearGradient(-11, -56 - bob, 11, -34 - bob);
        tG.addColorStop(0, '#c87d4b'); tG.addColorStop(1, '#9a5a32');
        ctx.fillStyle = tG; ctx.strokeStyle = '#5c3317'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.roundRect(-11.5, -56 - bob, 23, 22, 6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#059669'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(0, -51 - bob, 12, 6, 0, 0, Math.PI); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fde047';
        for (const bx2 of [-7, 0, 7]) {
          ctx.beginPath(); ctx.arc(bx2, -45 - bob, 1.6, 0, Math.PI * 2); ctx.fill();
        }

        // Raised Ceremonial Wooden Macuahuitl Club with Gleaming Obsidian Blades!
        ctx.strokeStyle = '#b87042'; ctx.lineWidth = 4.6;
        ctx.beginPath(); ctx.moveTo(9, -48 - bob); ctx.lineTo(17, -53 - bob); ctx.stroke();
        ctx.fillStyle = '#92400e'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.2;
        ctx.save();
        ctx.translate(18, -53 - bob);
        ctx.rotate(-0.48);
        ctx.fillRect(-3, -20, 6, 24); ctx.strokeRect(-3, -20, 6, 24);
        ctx.fillStyle = '#0f172a';
        for (let k = 0; k < 3; k++) {
          ctx.fillRect(-6, -18 + k * 6, 3, 4);
          ctx.fillRect(3, -18 + k * 6, 3, 4);
        }
        ctx.restore();

        // Expressive Warrior Face, Jade Earplug & Sculpted Jaguar-Head Helmet with Flowing Quetzal Plumes!
        ctx.fillStyle = '#be7647'; ctx.strokeStyle = '#5c3317'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.arc(1.5, -63 - bob, 8.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(5.5, -64 - bob, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#10b981'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.arc(-3.5, -62 - bob, 2.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Flowing iridescent emerald & turquoise Quetzal crest plumes arching behind helmet
        const plSw = Math.sin(time * 4.5 + mw.x * 0.02) * 3.2;
        for (const [py2, col] of [[-79, '#047857'], [-75, '#10b981'], [-70, '#2dd4bf']]) {
          ctx.strokeStyle = col; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(-3, py2 + 4 - bob); ctx.quadraticCurveTo(-19, py2 - 7 - bob, -28, py2 + 2 + plSw - bob); ctx.stroke();
        }
        // Sculpted golden jaguar-crest helmet with jade brow & spotted ears
        ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.35;
        ctx.beginPath(); ctx.roundRect(-9.5, -75 - bob, 21, 9.5, [6, 6, 1, 1]); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(-4, -76 - bob, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#b91c1c'; ctx.fillRect(-8, -68 - bob, 18, 2.5);
        ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(3, -71 - bob, 2.8, 0, Math.PI * 2); ctx.fill();

        // Round Painted Mayan Sun Shield (Chimalli) with Hanging Turquoise & Scarlet Feather Fringe!
        for (let tf = -2; tf <= 2; tf++) {
          ctx.strokeStyle = (tf % 2 === 0) ? '#10b981' : '#ef4444';
          ctx.lineWidth = 2.4;
          ctx.beginPath(); ctx.moveTo(-11 + tf * 3.2, -30 - bob); ctx.lineTo(-12 + tf * 3.8, -23 - bob); ctx.stroke();
        }
        ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.arc(-11, -39 - bob, 11.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 2.0;
        ctx.beginPath(); ctx.arc(-11, -39 - bob, 7.2, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(-11, -39 - bob, 4.0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 47. Natural-History Masterpiece Resplendent Quetzal Birds (Stage 24 — Multi-row iridescent coverts, slotted black primaries, drooping shoulder plumes, tapered twin ribbon streamers with golden rachis & 9-plume helmet crest!)
    if (level.maya_quetzals) {
      for (const qz of level.maya_quetzals) {
        const qx = qz.x - camX, qy = qz.y - camY;
        if (qx < -140 || qx > cullW + 140) continue;
        const f = qz.facing || 1;
        const flap = Math.sin(time * 7.8 + (qz.phase || 0)) * 13;
        const farFlap = Math.sin(time * 7.8 + (qz.phase || 0) - 0.32) * 11;
        const tailWave = Math.sin(time * 5.0 + (qz.phase || 0)) * 8.5;
        ctx.save();
        ctx.translate(qx + qz.w * 0.5, qy + qz.h * 0.5);
        ctx.scale(f, 1);

        // 1. Far Wing (Slotted jet-black primary flight feathers + dark viridian-emerald coverts)
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(-4, -5 - farFlap * 0.4);
        ctx.lineTo(-27, -12 - farFlap * 0.95);
        ctx.lineTo(-23, -7 - farFlap * 0.8);
        ctx.lineTo(-26, -4 - farFlap * 0.7);
        ctx.lineTo(-10, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        const fwG = ctx.createLinearGradient(5, -16 - farFlap, -20, 2);
        fwG.addColorStop(0, '#10b981'); fwG.addColorStop(1, '#064e3b');
        ctx.fillStyle = fwG; ctx.strokeStyle = '#022c22'; ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(6, -2);
        ctx.quadraticCurveTo(-5, -19 - farFlap * 0.8, -21, -9 - farFlap * 0.85);
        ctx.quadraticCurveTo(-10, 0, 5, 1.5);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 2. Snowy-White Undertail Rectrices (Crissum) + Tucked Dark Perching Feet
        ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(-10, 1); ctx.lineTo(-24, -1.5); ctx.lineTo(-22, 3); ctx.lineTo(-25, 6); ctx.lineTo(-10, 5);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(-3, 6.5); ctx.lineTo(-7, 8.5); ctx.stroke();

        // 3. Luxuriant Tapered Twin Iridescent Emerald-Turquoise Ribbon Tail Streamers + Golden Rachis Shafts!
        const r1G = ctx.createLinearGradient(-10, 1, -72, 8 + tailWave);
        r1G.addColorStop(0, '#059669'); r1G.addColorStop(0.45, '#10b981'); r1G.addColorStop(0.8, '#14b8a6'); r1G.addColorStop(1, '#0284c7');
        ctx.fillStyle = r1G; ctx.strokeStyle = '#064e3b'; ctx.lineWidth = 0.9;
        // Upper long ribbon streamer with spatulate tip
        ctx.beginPath();
        ctx.moveTo(-10, 0.5);
        ctx.bezierCurveTo(-28, 4 + tailWave * 0.45, -48, -7 - tailWave * 0.6, -70, 4 + tailWave);
        ctx.quadraticCurveTo(-75, 7 + tailWave, -69, 9.5 + tailWave);
        ctx.bezierCurveTo(-47, -1 - tailWave * 0.6, -28, 8.5 + tailWave * 0.45, -10, 3.8);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Central iridescent golden-green feather shaft (rachis)
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.65)'; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-11, 2); ctx.bezierCurveTo(-28, 6 + tailWave * 0.45, -48, -4 - tailWave * 0.6, -70, 6.8 + tailWave);
        ctx.stroke();

        // Lower ribbon streamer
        ctx.fillStyle = r1G; ctx.strokeStyle = '#064e3b'; ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(-10, 3.2);
        ctx.bezierCurveTo(-26, 9 + tailWave * 0.35, -43, 1 - tailWave * 0.5, -62, 11 + tailWave * 0.9);
        ctx.quadraticCurveTo(-66, 13.5 + tailWave * 0.9, -60, 15.5 + tailWave * 0.9);
        ctx.bezierCurveTo(-42, 5.5 - tailWave * 0.5, -25, 12.5 + tailWave * 0.35, -9.5, 5.8);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 4. Sculpted Torso: Metallic Golden-Emerald Mantle & Rich Shaded Ruby-Scarlet Breast!
        const backG = ctx.createLinearGradient(-15, -8, 15, 4);
        backG.addColorStop(0.0, '#6ee7b7');
        backG.addColorStop(0.35, '#10b981');
        backG.addColorStop(0.75, '#059669');
        backG.addColorStop(1.0, '#065f46');
        ctx.fillStyle = backG; ctx.strokeStyle = '#022c22'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-15, 1);
        ctx.bezierCurveTo(-12, -8.5, 7, -9, 15, -3.5);
        ctx.bezierCurveTo(17, 3, 8, 8.5, -2, 7.5);
        ctx.bezierCurveTo(-10, 7, -15, 4.5, -15, 1);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Subtle scalloped dorsal feather texture
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.34)'; ctx.lineWidth = 0.85;
        for (const sx0 of [-8, -3, 2, 7]) {
          ctx.beginPath(); ctx.arc(sx0, -3.5, 3.2, 0.2 * Math.PI, 0.85 * Math.PI); ctx.stroke();
        }

        // Vivid Crimson-Scarlet Breast with 3D Ruby Belly Shading
        const brG = ctx.createRadialGradient(6, 2, 1.5, 4, 4, 11);
        brG.addColorStop(0, '#fb7185'); brG.addColorStop(0.45, '#e11d48'); brG.addColorStop(1, '#881337');
        ctx.fillStyle = brG;
        ctx.beginPath();
        ctx.moveTo(-3, 2.5);
        ctx.quadraticCurveTo(7, -0.5, 13.5, 1.5);
        ctx.quadraticCurveTo(11, 8.2, 1, 7.8);
        ctx.quadraticCurveTo(-4, 6.8, -3, 2.5);
        ctx.closePath(); ctx.fill();

        // 5. Near Articulated Wing: Slotted Jet-Black Primaries + 2 Rows of Scalloped Iridescent Coverts + Drooping Plumes!
        // Slotted jet-black primary flight feathers
        ctx.fillStyle = '#090d16'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(-5, -3 + flap * 0.45);
        ctx.lineTo(-32, -5 + flap);
        ctx.lineTo(-27, -1 + flap * 0.88);
        ctx.lineTo(-30, 2.2 + flap * 0.82);
        ctx.lineTo(-24, 3.8 + flap * 0.68);
        ctx.lineTo(-26, 6.5 + flap * 0.60);
        ctx.lineTo(-6, 3.5 + flap * 0.35);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Crisp pale feather shafts on black primaries
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)'; ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(-8, -2 + flap * 0.5); ctx.lineTo(-29, -4 + flap * 0.95);
        ctx.moveTo(-8, 0 + flap * 0.45); ctx.lineTo(-27, 1.8 + flap * 0.8);
        ctx.stroke();

        // Iridescent golden-emerald wing coverts + elongated drooping lance-shaped covert plumes!
        const nwG = ctx.createLinearGradient(7, -14 + flap, -20, 4 + flap * 0.5);
        nwG.addColorStop(0, '#a7f3d0'); nwG.addColorStop(0.35, '#34d399'); nwG.addColorStop(0.75, '#059669'); nwG.addColorStop(1, '#065f46');
        ctx.fillStyle = nwG; ctx.strokeStyle = '#022c22'; ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(7.5, -1.5);
        ctx.bezierCurveTo(-2, -17 + flap, -15, -14 + flap * 0.9, -21, -4 + flap * 0.75);
        ctx.lineTo(-16, 1.5 + flap * 0.55);
        ctx.lineTo(-19, 4.5 + flap * 0.50);
        ctx.lineTo(-12, 3.5 + flap * 0.42);
        ctx.lineTo(-14, 6.2 + flap * 0.38);
        ctx.quadraticCurveTo(-3, 4.5 + flap * 0.25, 7.5, 2.5);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Scalloped golden-green lesser covert sheen arcs
        ctx.strokeStyle = 'rgba(254, 249, 195, 0.48)'; ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(3, -5 + flap * 0.35);
        ctx.quadraticCurveTo(-6, -9 + flap * 0.55, -14, -4 + flap * 0.65);
        ctx.stroke();

        // 6. Sculpted Head, 9-Plume Filamentous Golden-Emerald Helmet Crest, Expressive Eye & Curved Golden Bill!
        const hdG = ctx.createRadialGradient(14.5, -5.5, 1, 15.2, -4, 6.5);
        hdG.addColorStop(0, '#6ee7b7'); hdG.addColorStop(0.55, '#10b981'); hdG.addColorStop(1, '#047857');
        ctx.fillStyle = hdG; ctx.strokeStyle = '#022c22'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.arc(15.2, -4.0, 5.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Fan of 8 delicate curved filamentous golden-emerald crest plumes!
        for (let cp = 0; cp < 8; cp++) {
          const u = cp / 7;
          const ang = -2.35 + u * 1.45;
          const len = 6.2 + Math.sin(u * Math.PI) * 2.4;
          const bx0 = 15.0 + Math.cos(ang) * 4.5;
          const by0 = -4.8 + Math.sin(ang) * 4.5;
          ctx.strokeStyle = (cp % 2 === 0) ? '#34d399' : '#bef264';
          ctx.lineWidth = 1.45; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(bx0, by0);
          ctx.quadraticCurveTo(bx0 + Math.cos(ang - 0.15) * (len * 0.6), by0 + Math.sin(ang - 0.15) * (len * 0.6), bx0 + Math.cos(ang - 0.28) * len, by0 + Math.sin(ang - 0.28) * len);
          ctx.stroke();
        }

        // Velvety dark lore patch, large glossy eye with dual catchlights & curved bright golden bill
        ctx.fillStyle = '#022c22';
        ctx.beginPath(); ctx.ellipse(18.0, -4.5, 2.3, 1.9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#090d16';
        ctx.beginPath(); ctx.arc(17.8, -4.6, 1.65, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(17.2, -5.1, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#a7f3d0';
        ctx.beginPath(); ctx.arc(18.3, -4.0, 0.35, 0, Math.PI * 2); ctx.fill();

        const billG = ctx.createLinearGradient(20, -5.5, 28, -2.5);
        billG.addColorStop(0, '#fef08a'); billG.addColorStop(0.55, '#facc15'); billG.addColorStop(1, '#ca8a04');
        ctx.fillStyle = billG; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(20.0, -5.4);
        ctx.quadraticCurveTo(24.8, -5.2, 28.0, -3.1);
        ctx.lineTo(20.0, -1.8);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20.2, -3.5); ctx.lineTo(27.2, -3.2); ctx.stroke();
        ctx.restore();
      }
    }

    // 48. Santorini Cretan Kri-Kri Wild Ibex Goats (Stage 25 — Tapered 2-Segment Limbs, Ringed Scimitar Horns, Russet-Cream Coat & Swinging Bell!)
    if (level.greece_goats) {
      for (const gt of level.greece_goats) {
        const gx = gt.x - camX, gy = gt.y - camY;
        if (gx < -140 || gx > cullW + 140) continue;
        const gait = (gt.walkDist || 0) * 0.16;
        const sA = Math.sin(gait) * 7.8, sB = -sA;
        const bob = Math.abs(Math.sin(gait)) * 2.0;
        const goatScale = 1.4;
        ctx.save();
        ctx.translate(gx + gt.w * 0.5, gy + gt.h);
        ctx.scale((gt.facing || 1) * goatScale, goatScale);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.36)';
        ctx.beginPath(); ctx.ellipse(0, 0, 27, 4.6, 0, 0, Math.PI * 2); ctx.fill();

        const drawIbexLeg = (hx0, hy0, kx0, ky0, fx0, fy0, upperCol, lowerCol) => {
          ctx.fillStyle = upperCol;
          ctx.beginPath();
          ctx.moveTo(hx0 - 3.6, hy0); ctx.lineTo(hx0 + 3.6, hy0);
          ctx.lineTo(kx0 + 2.2, ky0); ctx.lineTo(kx0 - 2.2, ky0);
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = lowerCol; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(kx0, ky0); ctx.lineTo(fx0, fy0); ctx.stroke();
          // Split dark cloven mountain hoof
          ctx.fillStyle = '#1c1917';
          ctx.beginPath();
          ctx.moveTo(fx0 - 2.2, fy0 - 1.5); ctx.lineTo(fx0 + 3.4, fy0 - 1.5);
          ctx.lineTo(fx0 + 4.2, fy0 + 1.8); ctx.lineTo(fx0 + 0.8, fy0 + 1.8);
          ctx.lineTo(fx0 + 0.2, fy0 + 0.2); ctx.lineTo(fx0 - 2.2, fy0 + 1.8);
          ctx.closePath(); ctx.fill();
        };

        // Far shaded muscular mountain-goat legs
        drawIbexLeg(-14, -17 - bob, -16 + sB * 0.45, -9 - bob * 0.4, -13 + sB, -2, '#6b5b4d', '#57534e');
        drawIbexLeg(11, -17 - bob, 12 + sA * 0.45, -9 - bob * 0.4, 14 + sA, -2, '#6b5b4d', '#57534e');

        // Uplifted dark-tipped goat tail tuft
        ctx.fillStyle = '#44403c'; ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-22, -23 - bob); ctx.quadraticCurveTo(-29, -31 - bob, -25, -35 - bob);
        ctx.quadraticCurveTo(-20, -30 - bob, -18, -21 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Sculpted athletic Kri-Kri Ibex torso (warm russet-fawn back, cream belly & bold dark shoulder harness stripe!)
        const bG = ctx.createLinearGradient(0, -35 - bob, 0, -10 - bob);
        bG.addColorStop(0.0, '#c28552');
        bG.addColorStop(0.48, '#e7d8c5');
        bG.addColorStop(0.82, '#fafaf9');
        bG.addColorStop(1.0, '#cbd5e1');
        ctx.fillStyle = bG; ctx.strokeStyle = '#292524'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-22, -20 - bob);
        ctx.bezierCurveTo(-20, -34 - bob, 4, -35 - bob, 17, -28 - bob);
        ctx.bezierCurveTo(22, -20 - bob, 18, -11 - bob, 7, -11 - bob);
        ctx.quadraticCurveTo(-11, -10 - bob, -22, -20 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Authentic Kri-Kri dark dorsal crest & vertical shoulder stripe
        ctx.fillStyle = 'rgba(41, 37, 36, 0.72)';
        ctx.beginPath();
        ctx.moveTo(9, -29 - bob); ctx.quadraticCurveTo(13, -20 - bob, 9, -12 - bob);
        ctx.lineTo(5, -12 - bob); ctx.quadraticCurveTo(9, -20 - bob, 5, -28 - bob);
        ctx.closePath(); ctx.fill();

        // Near sunlit articulated legs
        drawIbexLeg(-13, -17 - bob, -15 + sA * 0.45, -9 - bob * 0.4, -11 + sA, -2, '#d6c7b2', '#e7e5e4');
        drawIbexLeg(12, -17 - bob, 13 + sB * 0.45, -9 - bob * 0.4, 15 + sB, -2, '#d6c7b2', '#e7e5e4');

        // Proud arched neck, woven Aegean-blue collar & swinging brass shepherd bell!
        const nkG = ctx.createLinearGradient(11, -38 - bob, 24, -18 - bob);
        nkG.addColorStop(0, '#d6c2ab'); nkG.addColorStop(1, '#f5f5f4');
        ctx.fillStyle = nkG; ctx.strokeStyle = '#292524'; ctx.lineWidth = 1.45;
        ctx.beginPath();
        ctx.moveTo(10, -27 - bob); ctx.lineTo(18, -39 - bob);
        ctx.lineTo(25, -32 - bob); ctx.lineTo(18, -18 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 2.8;
        ctx.beginPath(); ctx.moveTo(13, -25 - bob); ctx.lineTo(21.5, -21.5 - bob); ctx.stroke();
        ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.arc(21.5 + Math.sin(gait) * 1.2, -18.5 - bob, 3.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Sculpted Ibex Head, Sweeping Ridged Scimitar Horns, Alert Ear, Beard & Rectangular Pupil Amber Eye!
        const hy = -36 - bob;
        // Far horn
        ctx.strokeStyle = '#292524'; ctx.lineWidth = 3.8; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(18, hy - 5); ctx.bezierCurveTo(13, hy - 21, -2, hy - 21, -8, hy - 10);
        ctx.stroke();
        // Near thick curved scimitar horn with transverse keratin growth ridges!
        ctx.strokeStyle = '#57534e'; ctx.lineWidth = 4.4;
        ctx.beginPath();
        ctx.moveTo(21, hy - 5); ctx.bezierCurveTo(17, hy - 22, 2, hy - 22, -4, hy - 11);
        ctx.stroke();
        ctx.strokeStyle = '#d6d3d1'; ctx.lineWidth = 1.2;
        for (let hr = 1; hr <= 5; hr++) {
          const hu = hr / 6;
          const rx = (1 - hu) * (1 - hu) * 21 + 2 * (1 - hu) * hu * 11 + hu * hu * (-4);
          const ry = (1 - hu) * (1 - hu) * (hy - 5) + 2 * (1 - hu) * hu * (hy - 21) + hu * hu * (hy - 11);
          ctx.beginPath(); ctx.moveTo(rx - 1, ry - 1.6); ctx.lineTo(rx + 1, ry + 1.6); ctx.stroke();
        }

        // Pointed goat ear behind horn base
        ctx.fillStyle = '#d6c2ab'; ctx.strokeStyle = '#292524'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.ellipse(15.5, hy - 3.5, 4.2, 1.9, -0.45, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Chiseled goat face, dark blaze & tapered muzzle
        ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#292524'; ctx.lineWidth = 1.45;
        ctx.beginPath();
        ctx.moveTo(16, hy - 6); ctx.quadraticCurveTo(25, hy - 8, 33.5, hy - 1);
        ctx.lineTo(32.5, hy + 4.2); ctx.quadraticCurveTo(22, hy + 6.2, 16, hy + 1);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(68, 64, 60, 0.58)';
        ctx.beginPath(); ctx.moveTo(20, hy - 6.2); ctx.lineTo(31, hy - 1.8); ctx.lineTo(29, hy + 0.2); ctx.lineTo(19, hy - 3.8); ctx.closePath(); ctx.fill();

        // Flowing dark-and-silver chin goatee
        ctx.fillStyle = '#44403c';
        ctx.beginPath(); ctx.moveTo(28, hy + 4); ctx.quadraticCurveTo(30, hy + 11, 26, hy + 13.5); ctx.quadraticCurveTo(24, hy + 9, 23.5, hy + 4.8); ctx.closePath(); ctx.fill();

        // Luminous golden-amber eye with horizontal caprine pupil + catchlight
        ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(23.5, hy - 2.4, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#090d16'; ctx.fillRect(22.1, hy - 3.0, 2.8, 1.2);
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(22.9, hy - 3.2, 0.65, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1c1917'; ctx.beginPath(); ctx.arc(32.0, hy + 0.6, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // 49. Acropolis Spartan Bronze Hoplite Guardians (Stage 25 — Anatomical Muscle Cuirass, Bronze Greaves, Plumed Corinthian Helmet & Convex Aspis Shield!)
    if (level.greece_hoplites) {
      for (const hp of level.greece_hoplites) {
        const hx = hp.x - camX, hy = hp.y - camY;
        if (hx < -120 || hx > cullW + 120) continue;
        const stride = Math.sin((hp.walkDist || 0) * 0.14);
        const bob = Math.abs(stride) * 2.2;
        ctx.save();
        ctx.translate(hx + hp.w * 0.5, hy + hp.h);
        ctx.scale(hp.facing || 1, 1);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.38)';
        ctx.beginPath(); ctx.ellipse(0, 0, 23, 5.0, 0, 0, Math.PI * 2); ctx.fill();

        // Billowing Crimson Spartan Chlamys Cloak with Fold Highlights
        const cloakWave = Math.sin(time * 5.2 + (hp.x * 0.02)) * 4.5;
        const clG = ctx.createLinearGradient(-24, -46 - bob, 0, -10 - bob);
        clG.addColorStop(0, '#dc2626'); clG.addColorStop(0.6, '#991b1b'); clG.addColorStop(1, '#450a0a');
        ctx.fillStyle = clG; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-6, -45 - bob);
        ctx.bezierCurveTo(-19, -36 - bob, -26 + cloakWave, -22 - bob, -23 + cloakWave, -10 - bob);
        ctx.quadraticCurveTo(-15 + cloakWave * 0.6, -7 - bob, -9 + cloakWave * 0.4, -12 - bob);
        ctx.quadraticCurveTo(-7, -27 - bob, 2, -40 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Articulated Muscular Legs + Sculpted Bronze Greaves (Knemides) & Strapped Krepis Sandals
        for (const [idx, s] of [[0, -1], [1, 1]]) {
          const swing = s * stride * 9.8;
          const kneeX = s * 3 + swing * 0.48;
          const kneeY = -12 - bob * 0.4;
          const footX = s * 4 + swing;
          // Muscular thigh
          ctx.strokeStyle = idx === 0 ? '#9a5b32' : '#c67d4e';
          ctx.lineWidth = 6.2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(s * 4, -22 - bob); ctx.lineTo(kneeX, kneeY); ctx.stroke();
          // Burnished bronze greave shin armor + embossed knee boss
          ctx.strokeStyle = idx === 0 ? '#a16207' : '#f59e0b';
          ctx.lineWidth = 5.8;
          ctx.beginPath(); ctx.moveTo(kneeX, kneeY); ctx.lineTo(footX, -4); ctx.stroke();
          ctx.fillStyle = idx === 0 ? '#ca8a04' : '#fef08a';
          ctx.beginPath(); ctx.arc(kneeX + 1, kneeY, 2.8, 0, Math.PI * 2); ctx.fill();
          // Greek leather krepis sandal
          ctx.fillStyle = '#78350f'; ctx.strokeStyle = '#290f02'; ctx.lineWidth = 1.1;
          ctx.beginPath(); ctx.roundRect(footX - 4.5, -5.5, 12, 5.2, 2); ctx.fill(); ctx.stroke();
        }

        // Leather-and-Gold Pteruges Battle Skirt Strips over White Chiton
        ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(-11, -27 - bob); ctx.lineTo(11, -27 - bob); ctx.lineTo(14.5, -17 - bob); ctx.lineTo(-14.5, -17 - bob); ctx.closePath(); ctx.fill(); ctx.stroke();
        for (let pt = -10; pt <= 8; pt += 4.5) {
          ctx.fillStyle = '#92400e';
          ctx.fillRect(pt, -27 - bob, 3.2, 8.5);
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(pt, -20 - bob, 3.2, 1.5);
        }

        // Sculpted Bronze Muscle Cuirass (Thorax) with Pectoral Relief & Specular Sheen
        const armorG = ctx.createLinearGradient(-12, -46 - bob, 12, -25 - bob);
        armorG.addColorStop(0, '#fef9c3'); armorG.addColorStop(0.35, '#eab308'); armorG.addColorStop(0.75, '#b45309'); armorG.addColorStop(1, '#78350f');
        ctx.fillStyle = armorG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(-11.5, -46 - bob, 23, 20.5, 5); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(69, 26, 3, 0.55)'; ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(-3, -38 - bob, 4.2, 0.2, Math.PI - 0.2);
        ctx.arc(5, -38 - bob, 4.2, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Authentic Corinthian Bronze Helmet + Sweeping Crimson-and-Ivory Horsehair Crest (Lophos)!
        const headY = -55 - bob;
        // Bronze crest holder rail
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(0, headY - 2, 11.5, -Math.PI * 0.85, -Math.PI * 0.15); ctx.stroke();
        // Magnificent sweeping crimson & ivory horsehair plume
        const plG = ctx.createLinearGradient(-20, headY - 24, 10, headY - 6);
        plG.addColorStop(0, '#ef4444'); plG.addColorStop(0.65, '#b91c1c'); plG.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = plG; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(9, headY - 8);
        ctx.bezierCurveTo(6, headY - 24, -16, headY - 24, -22, headY - 5 + cloakWave * 0.25);
        ctx.quadraticCurveTo(-12, headY - 12, -2, headY - 10);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(6, headY - 11); ctx.quadraticCurveTo(-6, headY - 19, -17, headY - 9); ctx.stroke();

        // Sculpted Corinthian helmet skull, neck-flare & pointed cheek-guards
        const helmG = ctx.createRadialGradient(-2, headY - 4, 2, 0, headY, 11.5);
        helmG.addColorStop(0, '#fef9c3'); helmG.addColorStop(0.5, '#eab308'); helmG.addColorStop(1, '#78350f');
        ctx.fillStyle = helmG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.45;
        ctx.beginPath();
        ctx.arc(0.5, headY - 1, 9.6, Math.PI * 0.75, Math.PI * 2.15);
        ctx.lineTo(9.5, headY + 7.5); // Pointed Corinthian cheekpiece
        ctx.lineTo(2.5, headY + 8.5);
        ctx.lineTo(-9.5, headY + 6.5); // Flared neck guard
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Menacing Corinthian eye-slit & glowing warrior eye
        ctx.fillStyle = '#090d16';
        ctx.beginPath(); ctx.moveTo(2.5, headY - 3); ctx.lineTo(9.8, headY - 1.5); ctx.lineTo(5.5, headY + 1.2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(6.2, headY - 1.2, 1.15, 0, Math.PI * 2); ctx.fill();

        // Ash-Wood Dory Spear with Bronze Sauroter Butt-Spike & Gleaming Leaf-Shaped Iron Spearhead!
        ctx.strokeStyle = '#5c3317'; ctx.lineWidth = 2.8;
        ctx.beginPath(); ctx.moveTo(-18, -23 - bob); ctx.lineTo(30, -45 - bob); ctx.stroke();
        ctx.fillStyle = '#d97706';
        ctx.beginPath(); ctx.moveTo(-18, -23 - bob); ctx.lineTo(-23, -20.5 - bob); ctx.lineTo(-17, -21 - bob); ctx.closePath(); ctx.fill();
        const spG = ctx.createLinearGradient(27, -48 - bob, 40, -43 - bob);
        spG.addColorStop(0, '#ffffff'); spG.addColorStop(0.5, '#cbd5e1'); spG.addColorStop(1, '#475569');
        ctx.fillStyle = spG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(27, -43.5 - bob);
        ctx.quadraticCurveTo(32, -49 - bob, 41, -49.5 - bob);
        ctx.quadraticCurveTo(34, -42 - bob, 28.5, -40.5 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 3D Domed Bronze Spartan Aspis (Hoplon) Shield with Embossed Rim & Crimson/Sapphire Lambda!
        const shG = ctx.createRadialGradient(7, -37 - bob, 2, 10, -33 - bob, 15);
        shG.addColorStop(0, '#fffbeb'); shG.addColorStop(0.42, '#f59e0b'); shG.addColorStop(0.82, '#b45309'); shG.addColorStop(1, '#451a03');
        ctx.fillStyle = shG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.ellipse(10.5, -33 - bob, 11, 14.5, 0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(254, 243, 199, 0.65)'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.ellipse(10.5, -33 - bob, 8.8, 12.0, 0.08, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#991b1b'; ctx.lineWidth = 2.5; ctx.lineJoin = 'miter';
        ctx.beginPath(); ctx.moveTo(6.8, -26 - bob); ctx.lineTo(10.8, -39.5 - bob); ctx.lineTo(14.8, -26 - bob); ctx.stroke();
        ctx.restore();
      }
    }

    // 50. Sacred Little Owls of Athena (Athene noctua — Stage 25: Slotted Primary Feathers, Speckled Plumage, Talons & Luminous Amber Eyes!)
    if (level.greece_owls) {
      for (const ow of level.greece_owls) {
        const ox = ow.x - camX, oy = ow.y - camY;
        if (ox < -110 || ox > cullW + 110) continue;
        const wingBeat = Math.sin(time * 7.8 + (ow.phase || 0));
        const flap = wingBeat * 15.5;
        const bodyBob = -wingBeat * 1.8;
        ctx.save();
        ctx.translate(ox + ow.w * 0.5, oy + ow.h * 0.5 + bodyBob);
        ctx.scale(ow.facing || 1, 1);

        // Far shaded articulated wing with feathered primaries
        ctx.fillStyle = '#57534e'; ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.moveTo(2, -3);
        ctx.bezierCurveTo(-6, -22 + flap * 0.72, -20, -24 + flap * 0.78, -30, -11 + flap * 0.82);
        ctx.lineTo(-24, -6 + flap * 0.6);
        ctx.quadraticCurveTo(-10, 1, 5, 2);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Fanned barred owl tail feathers
        const tlG = ctx.createLinearGradient(-31, 0, -12, 4);
        tlG.addColorStop(0, '#57534e'); tlG.addColorStop(0.5, '#a8a29e'); tlG.addColorStop(1, '#78716c');
        ctx.fillStyle = tlG; ctx.strokeStyle = '#292524'; ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.moveTo(-13, 1); ctx.lineTo(-31, -4);
        ctx.quadraticCurveTo(-34, 2.5, -29, 9);
        ctx.lineTo(-12, 5);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(250, 250, 249, 0.55)'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(-22, -1); ctx.lineTo(-21, 6.5); ctx.moveTo(-27, -2.2); ctx.lineTo(-26, 7.5); ctx.stroke();

        // Plump mottled umber-and-ivory owl body
        const oG = ctx.createLinearGradient(0, -11, 0, 13);
        oG.addColorStop(0, '#6b5e53'); oG.addColorStop(0.42, '#cfc6bc'); oG.addColorStop(1, '#fafaf9');
        ctx.fillStyle = oG; ctx.strokeStyle = '#292524'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.ellipse(0, 2, 17.5, 10.5, -0.06, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Authentic Athene noctua breast streaks & white wing-covert spots
        ctx.fillStyle = 'rgba(87, 73, 62, 0.58)';
        for (const [fx, fy] of [[-5, 4], [0, 6.5], [5, 5], [9, 3], [3, 1.5], [-2, 1]]) {
          ctx.beginPath(); ctx.ellipse(fx, fy, 2.4, 1.05, -0.1, 0, Math.PI * 2); ctx.fill();
        }
        // Tucked feathered legs & curved golden-grey raptor talons
        ctx.fillStyle = '#e7e5e4';
        ctx.beginPath(); ctx.ellipse(1, 11.5, 4.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#292524'; ctx.lineWidth = 1.2;
        for (const tx of [-1, 1.5, 4]) {
          ctx.beginPath(); ctx.moveTo(tx, 12); ctx.quadraticCurveTo(tx + 2, 14.5, tx + 0.5, 16); ctx.stroke();
        }

        // Near Broad Sculpted Wing with 4 Slotted Primary Feathers & Pale Buff Wing-Bars!
        const wG = ctx.createLinearGradient(0, -26 - flap, 0, 5);
        wG.addColorStop(0, '#5c4f44'); wG.addColorStop(0.55, '#9c8f82'); wG.addColorStop(1, '#f5f5f4');
        ctx.fillStyle = wG; ctx.strokeStyle = '#292524'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(5, -1);
        ctx.bezierCurveTo(-3, -27 - flap, -21, -29 - flap, -35, -12 - flap);
        ctx.lineTo(-28, -8 - flap * 0.82);
        ctx.lineTo(-33, -4 - flap * 0.68);
        ctx.lineTo(-26, -1 - flap * 0.52);
        ctx.lineTo(-29, 3 - flap * 0.36);
        ctx.quadraticCurveTo(-10, 7.5, 6, 3);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Pale cream covert spots across upper wing
        ctx.fillStyle = 'rgba(255, 251, 235, 0.72)';
        for (let sp = 0; sp < 4; sp++) {
          const sx = -5 - sp * 5.2;
          const sy = -9 - sp * 1.2 - flap * (0.35 + sp * 0.12);
          ctx.beginPath(); ctx.arc(sx, sy, 1.4, 0, Math.PI * 2); ctx.fill();
        }

        // Iconic Round Owl of Athena Head, Twin Facial Discs, Olive-Leaf Crown & Luminous Golden Eyes!
        const hdG = ctx.createRadialGradient(13, -6, 2, 15, -4, 10.5);
        hdG.addColorStop(0, '#9c8e80'); hdG.addColorStop(0.65, '#6b5e53'); hdG.addColorStop(1, '#443c35');
        ctx.fillStyle = hdG; ctx.strokeStyle = '#292524'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(15, -4.2, 9.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // White crown speckles
        ctx.fillStyle = 'rgba(255, 253, 244, 0.65)';
        for (const [cx0, cy0] of [[10, -9], [13, -10.5], [16, -9.8]]) {
          ctx.beginPath(); ctx.arc(cx0, cy0, 0.9, 0, Math.PI * 2); ctx.fill();
        }
        // Cream feathered facial disc + white V-shaped supercilium eyebrows!
        ctx.fillStyle = '#fefce8'; ctx.strokeStyle = '#574c42'; ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.ellipse(18.6, -3.6, 6.4, 7.0, 0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(14.5, -8.5); ctx.lineTo(20.5, -6.8); ctx.lineTo(23.5, -8.2); ctx.stroke();

        // Sacred Golden Olive-Leaf Sprig of Goddess Athena tucked at brow
        ctx.fillStyle = '#84cc16'; ctx.strokeStyle = '#365314'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.ellipse(12.2, -11.2, 3.8, 1.6, -0.45, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(15.5, -12.0, 3.4, 1.5, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // 3D Luminous Golden Wisdom Eye with Radial Iris, Deep Pupil & Dual Catchlights!
        const eyG = ctx.createRadialGradient(18.5, -4.8, 0.5, 19.0, -4.4, 3.6);
        eyG.addColorStop(0, '#fef9c3'); eyG.addColorStop(0.55, '#facc15'); eyG.addColorStop(1, '#b45309');
        ctx.fillStyle = eyG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 0.95;
        ctx.beginPath(); ctx.arc(19.0, -4.4, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(19.4, -4.4, 1.75, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(18.3, -5.4, 0.95, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(20.1, -3.5, 0.45, 0, Math.PI * 2); ctx.fill();

        // Curved Hooked Raptor Beak
        const bkG = ctx.createLinearGradient(22.5, -4.5, 26.5, 1.5);
        bkG.addColorStop(0, '#fef08a'); bkG.addColorStop(1, '#b45309');
        ctx.fillStyle = bkG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(23.2, -4.2); ctx.quadraticCurveTo(28.2, -2.6, 25.6, 1.6);
        ctx.lineTo(22.4, -1.0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }

    // 51. Indian Crested Porcupine (Stage 26: Battir — النيص الفلسطيني البري)
    // Style switch: 'enhanced' (museum-grade 3-layer quills, crest mane, claws, whiskers) | 'classic' (previous look preserved)
    if (level.battir_porcupines) {
      const BATTIR_PORCUPINE_STYLE = 'enhanced';
      for (const p of level.battir_porcupines) {
        const sx = p.x - camX, sy = p.y - camY;
        if (sx + p.w < -80 || sx > 1400) continue;
        const face = p.facing || 1;
        const wPhase = (p.walkDist || 0) * 0.14;
        const bob = Math.abs(Math.sin(wPhase)) * 1.8;
        const flare = p.bristle || 0;
        const quiver = flare > 0.15 ? Math.sin(time * 34 + p.x) * 0.035 * flare : 0;
        ctx.save();
        ctx.translate(sx + p.w * 0.5, sy + p.h);
        ctx.scale(face, 1);
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';

        if (BATTIR_PORCUPINE_STYLE === 'classic') {
          // --- PRESERVED CLASSIC LOOK ---
          ctx.fillStyle = 'rgba(28, 25, 23, 0.28)';
          ctx.beginPath(); ctx.ellipse(0, 0, 29, 4.5, 0, 0, Math.PI * 2); ctx.fill();
          const farA = Math.sin(wPhase + Math.PI) * 5.2;
          const nearA = Math.sin(wPhase) * 5.2;
          ctx.strokeStyle = '#292524'; ctx.lineWidth = 5.5;
          ctx.beginPath(); ctx.moveTo(-14, -13 - bob); ctx.lineTo(-14 + farA, -2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(14, -13 - bob); ctx.lineTo(14 - farA, -2); ctx.stroke();
          for (let q = 0; q < 15; q++) {
            const frac = q / 14;
            const baseAng = -Math.PI * 0.92 + frac * Math.PI * 0.72;
            const ang = baseAng - flare * 0.24 * (1 - frac);
            const qLen = (23 + (q % 3) * 5.5) * (1 + flare * 0.22);
            const bx = -8 + frac * 18, by = -20 - bob;
            const ex = bx + Math.cos(ang) * qLen, ey = by + Math.sin(ang) * qLen;
            ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 3.2;
            ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke();
            ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(bx + Math.cos(ang) * qLen * 0.36, by + Math.sin(ang) * qLen * 0.36);
            ctx.lineTo(bx + Math.cos(ang) * qLen * 0.62, by + Math.sin(ang) * qLen * 0.62);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(bx + Math.cos(ang) * qLen * 0.80, by + Math.sin(ang) * qLen * 0.80);
            ctx.lineTo(ex, ey);
            ctx.stroke();
          }
          const bG = ctx.createLinearGradient(0, -34, 0, -8);
          bG.addColorStop(0, '#44403c'); bG.addColorStop(0.6, '#292524'); bG.addColorStop(1, '#1c1917');
          ctx.fillStyle = bG; ctx.strokeStyle = '#0c0a09'; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.ellipse(-2, -19 - bob, 23, 13.5, -0.05, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = '#f5f5f4'; ctx.lineWidth = 2.6;
          ctx.beginPath(); ctx.arc(14, -18 - bob, 9.5, 0.3, 1.85); ctx.stroke();
          ctx.fillStyle = '#3f3b37'; ctx.strokeStyle = '#0c0a09'; ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(15, -26 - bob); ctx.quadraticCurveTo(30, -24 - bob, 32, -16 - bob);
          ctx.quadraticCurveTo(31, -10 - bob, 16, -11 - bob); ctx.closePath();
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#57534e'; ctx.beginPath(); ctx.arc(16, -26 - bob, 4.2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#0c0a09'; ctx.beginPath(); ctx.arc(24, -20.5 - bob, 2.1, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(24.7, -21.2 - bob, 0.7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#1c1917'; ctx.beginPath(); ctx.ellipse(31.2, -16.5 - bob, 2.3, 1.8, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 5.8;
          ctx.beginPath(); ctx.moveTo(-10, -12 - bob); ctx.lineTo(-10 + nearA, -1.5); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(11, -12 - bob); ctx.lineTo(11 - nearA, -1.5); ctx.stroke();
          ctx.restore();
          continue;
        }

        // --- ENHANCED MUSEUM-GRADE PALESTINIAN INDIAN CRESTED PORCUPINE (النيص البري) ---
        // Soft grounded contact shadow
        ctx.fillStyle = 'rgba(28, 25, 23, 0.30)';
        ctx.beginPath(); ctx.ellipse(0, 0, 32, 4.8, 0, 0, Math.PI * 2); ctx.fill();

        const farA = Math.sin(wPhase + Math.PI) * 5.2;
        const nearA = Math.sin(wPhase) * 5.2;

        // Helper: draw sculpted articulated porcupine leg + paw + 3 ivory digging claws flush at y=0
        const drawLeg = (lx, swing, darkCol, pawCol) => {
          const footX = lx + swing;
          ctx.fillStyle = darkCol; ctx.strokeStyle = '#0c0a09'; ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(lx - 4.6, -14 - bob);
          ctx.quadraticCurveTo(footX - 4.2, -6 - bob * 0.4, footX - 3.2, -1.5);
          ctx.lineTo(footX + 5.2, -1.5);
          ctx.quadraticCurveTo(footX + 4.4, -7 - bob * 0.4, lx + 4.4, -14 - bob);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          // Rounded paw & 3 delicate ivory digging claws
          ctx.fillStyle = pawCol;
          ctx.beginPath(); ctx.ellipse(footX + 1.4, -1.8, 4.6, 2.2, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#e7e5e4'; ctx.lineWidth = 1.1;
          for (let cl = 0; cl < 3; cl++) {
            const cx0 = footX + 3.2 + cl * 1.4;
            ctx.beginPath(); ctx.moveTo(cx0, -2.2); ctx.lineTo(cx0 + 1.8, -0.4); ctx.stroke();
          }
        };

        // 1. Far articulated legs
        drawLeg(-14, farA, '#26221f', '#1c1917');
        drawLeg(13, -farA, '#26221f', '#1c1917');

        // 2. Short vibrating hollow rattle-quill tail at rear
        ctx.save();
        ctx.translate(-22, -17 - bob);
        ctx.rotate(-0.2 + quiver * 4);
        for (let r = 0; r < 5; r++) {
          const ra = -Math.PI * 0.85 - r * 0.14;
          ctx.strokeStyle = r % 2 === 0 ? '#fef3c7' : '#d6d3d1'; ctx.lineWidth = 2.0;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ra) * 11, Math.sin(ra) * 11); ctx.stroke();
        }
        ctx.restore();

        // 3. Layer 1 — Back Radiating Curved Banded Quills (18 tapered obsidian & ivory needles!)
        for (let q = 0; q < 18; q++) {
          const frac = q / 17;
          const baseAng = -Math.PI * 0.96 + frac * Math.PI * 0.78;
          const ang = baseAng - flare * 0.28 * (1 - frac) + quiver * (q % 2 === 0 ? 1 : -1);
          const qLen = (25 + (q % 3) * 6.5) * (1 + flare * 0.25);
          const bx = -10 + frac * 22, by = -20 - bob;
          const midAng = ang + 0.06;
          const mx = bx + Math.cos(midAng) * qLen * 0.52, my = by + Math.sin(midAng) * qLen * 0.52;
          const ex = bx + Math.cos(ang) * qLen, ey = by + Math.sin(ang) * qLen;
          // Obsidian-black tapered quill shaft
          ctx.strokeStyle = '#18181b'; ctx.lineWidth = 3.4;
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke();
          // Warm ivory middle band & needle-sharp ivory tip
          ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 2.1;
          ctx.beginPath();
          ctx.moveTo(bx + Math.cos(midAng) * qLen * 0.30, by + Math.sin(midAng) * qLen * 0.30);
          ctx.lineTo(bx + Math.cos(midAng) * qLen * 0.54, by + Math.sin(midAng) * qLen * 0.54);
          ctx.stroke();
          ctx.strokeStyle = '#fffbeb'; ctx.lineWidth = 1.7;
          ctx.beginPath();
          ctx.moveTo(bx + Math.cos(ang) * qLen * 0.78, by + Math.sin(ang) * qLen * 0.78);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }

        // 4. Sculpted Muscular Dark-Umber Body with Warm Rim Highlight
        const bG = ctx.createRadialGradient(4, -26 - bob, 4, -2, -19 - bob, 26);
        bG.addColorStop(0.0, '#57534e'); bG.addColorStop(0.55, '#292524'); bG.addColorStop(1.0, '#141210');
        ctx.fillStyle = bG; ctx.strokeStyle = '#09090b'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-24, -17 - bob);
        ctx.bezierCurveTo(-24, -33 - bob, 6, -36 - bob, 18, -25 - bob);
        ctx.bezierCurveTo(22, -16 - bob, 16, -7 - bob, -2, -7 - bob);
        ctx.bezierCurveTo(-18, -7 - bob, -24, -11 - bob, -24, -17 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 5. Layer 2 — Foreground 3D Shield Quills wrapping across the flank!
        for (let fq = 0; fq < 9; fq++) {
          const frac = fq / 8;
          const ang = -Math.PI * 0.90 + frac * Math.PI * 0.38 - flare * 0.18 + quiver;
          const qLen = (15 + (fq % 2) * 4.5) * (1 + flare * 0.18);
          const bx = -14 + frac * 18, by = -18 - bob + (fq % 2) * 2.5;
          const ex = bx + Math.cos(ang) * qLen, ey = by + Math.sin(ang) * qLen;
          ctx.strokeStyle = '#0c0a09'; ctx.lineWidth = 2.6;
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(bx + Math.cos(ang) * qLen * 0.52, by + Math.sin(ang) * qLen * 0.52);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }

        // 6. Signature Swept-Back Silver-Crest Mane (العُرف الشوكي) over crown & shoulders
        for (let cr = 0; cr < 6; cr++) {
          const cx0 = 15 - cr * 2.2, cy0 = -28 - bob;
          ctx.strokeStyle = cr % 2 === 0 ? '#e7e5e4' : '#57534e'; ctx.lineWidth = 1.9;
          ctx.beginPath();
          ctx.moveTo(cx0, cy0);
          ctx.quadraticCurveTo(cx0 - 8, cy0 - 11 - flare * 4, cx0 - 17, cy0 - 6 - flare * 6);
          ctx.stroke();
        }

        // 7. Crisp Snowy-White Throat Collar Crescent characteristic of Hystrix indica
        ctx.strokeStyle = '#fafaf9'; ctx.lineWidth = 3.0;
        ctx.beginPath(); ctx.arc(13.5, -17.5 - bob, 10.2, 0.25, 1.85); ctx.stroke();

        // 8. Sculpted Head, Rounded Snout, Inner-Shaded Ear, Expressive Eye & Long Whiskers
        const hdG = ctx.createLinearGradient(14, -29 - bob, 33, -10 - bob);
        hdG.addColorStop(0.0, '#57534e'); hdG.addColorStop(0.55, '#3b3632'); hdG.addColorStop(1.0, '#221f1d');
        ctx.fillStyle = hdG; ctx.strokeStyle = '#09090b'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(14, -27.5 - bob);
        ctx.bezierCurveTo(23, -29.5 - bob, 33.5, -24.5 - bob, 34, -16.5 - bob);
        ctx.bezierCurveTo(33.5, -10.5 - bob, 24, -9.5 - bob, 15, -11.5 - bob);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Rounded ear with warm shaded inner concha
        ctx.fillStyle = '#44403c'; ctx.strokeStyle = '#0c0a09'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.ellipse(16.2, -27.2 - bob, 4.4, 3.6, -0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#a8a29e';
        ctx.beginPath(); ctx.ellipse(16.6, -26.8 - bob, 2.2, 1.7, -0.25, 0, Math.PI * 2); ctx.fill();
        // Expressive glistening dark eye with subtle warm amber iris rim & dual catchlights
        ctx.fillStyle = '#78350f';
        ctx.beginPath(); ctx.arc(24.2, -20.8 - bob, 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#09090b';
        ctx.beginPath(); ctx.arc(24.4, -20.8 - bob, 2.0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(25.1, -21.5 - bob, 0.85, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath(); ctx.arc(23.5, -20.0 - bob, 0.45, 0, Math.PI * 2); ctx.fill();
        // Moist sculpted dark nose with specular highlight
        ctx.fillStyle = '#18181b';
        ctx.beginPath(); ctx.ellipse(33.0, -16.8 - bob, 2.6, 2.1, 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath(); ctx.ellipse(32.5, -17.6 - bob, 0.9, 0.5, 0, 0, Math.PI * 2); ctx.fill();
        // Delicate long curved sensory whiskers
        ctx.strokeStyle = 'rgba(245, 245, 244, 0.65)'; ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(29, -15.5 - bob); ctx.quadraticCurveTo(36, -17.5 - bob, 41, -15.5 - bob);
        ctx.moveTo(28.5, -14.2 - bob); ctx.quadraticCurveTo(35.5, -14.0 - bob, 40.5, -11.5 - bob);
        ctx.moveTo(28, -13.0 - bob); ctx.quadraticCurveTo(34, -11.2 - bob, 38.5, -8.5 - bob);
        ctx.stroke();

        // 9. Near articulated legs + paws + ivory claws flush at y=0
        drawLeg(-10, nearA, '#1c1917', '#141210');
        drawLeg(11, -nearA, '#1c1917', '#141210');

        ctx.restore();
      }
    }

    // 52. Wild Wadi Boar (Stage 26: Battir — الخنزير البري الجبلي في وادي المخرور — curved ivory tusks, spiky dorsal mane & hooves!)
    if (level.battir_boars) {
      for (const b of level.battir_boars) {
        const sx = b.x - camX, sy = b.y - camY;
        if (sx + b.w < -80 || sx > 1400) continue;
        const face = b.facing || 1;
        const wPhase = (b.walkDist || 0) * 0.15;
        const bob = Math.abs(Math.sin(wPhase)) * 2.4;
        const nearA = Math.sin(wPhase) * 7.2;
        const farA = Math.sin(wPhase + Math.PI) * 7.2;
        const snort = b.snortAnim || 0;
        ctx.save();
        ctx.translate(sx + b.w * 0.5, sy + b.h);
        ctx.scale(face, 1);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // Ground contact shadow
        ctx.fillStyle = 'rgba(24, 16, 12, 0.34)';
        ctx.beginPath(); ctx.ellipse(0, 0, 32, 4.8, 0, 0, Math.PI * 2); ctx.fill();

        // Far 2-segment muscular legs + cloven hooves
        ctx.strokeStyle = '#291d16'; ctx.lineWidth = 5.6;
        ctx.beginPath();
        ctx.moveTo(-16, -15 - bob); ctx.lineTo(-18 + farA * 0.5, -7 - bob * 0.4); ctx.lineTo(-15 + farA, -1.5);
        ctx.moveTo(14, -15 - bob); ctx.lineTo(15 - farA * 0.5, -7 - bob * 0.4); ctx.lineTo(16 - farA, -1.5);
        ctx.stroke();

        // Curly tufted boar tail flicking behind
        const tailWag = Math.sin(time * 9 + sx * 0.03) * 0.25;
        ctx.strokeStyle = '#3b281c'; ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(-26, -24 - bob);
        ctx.quadraticCurveTo(-34, -32 - bob, -31 + tailWag * 8, -36 - bob);
        ctx.stroke();
        ctx.fillStyle = '#1c140f';
        ctx.beginPath(); ctx.ellipse(-31 + tailWag * 8, -37 - bob, 3.8, 2.4, -0.4, 0, Math.PI * 2); ctx.fill();

        // Spiky erect dorsal bristle mane ridge along spine & shoulders!
        ctx.fillStyle = '#1c140f';
        ctx.beginPath();
        ctx.moveTo(-22, -28 - bob);
        for (let m = 0; m < 9; m++) {
          const mx0 = -20 + m * 4.6;
          const mh = (m >= 3 && m <= 6 ? 9.5 : 6.5) + snort * 3.0;
          ctx.lineTo(mx0, -33 - bob - mh);
          ctx.lineTo(mx0 + 2.4, -31 - bob);
        }
        ctx.closePath();
        ctx.fill();

        // Heavy front-shouldered Wild Boar torso (grizzled dark umber & chestnut coat)
        const brG = ctx.createRadialGradient(4, -24 - bob, 5, -2, -20 - bob, 32);
        brG.addColorStop(0.0, '#78533a');
        brG.addColorStop(0.50, '#4e3524');
        brG.addColorStop(0.85, '#322116');
        brG.addColorStop(1.0, '#1c120c');
        ctx.fillStyle = brG;
        ctx.strokeStyle = '#140c08';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-27, -15 - bob);
        ctx.bezierCurveTo(-29, -29 - bob, -15, -36 - bob, 6, -37 - bob);
        ctx.bezierCurveTo(20, -37 - bob, 26, -27 - bob, 23, -13 - bob);
        ctx.quadraticCurveTo(0, -8 - bob, -27, -15 - bob);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Coarse grizzled silver-buff shoulder & flank hair strokes
        ctx.strokeStyle = 'rgba(214, 191, 166, 0.36)';
        ctx.lineWidth = 1.1;
        for (const [hx0, hy0] of [[-14, -24], [-4, -27], [6, -28], [-9, -18], [3, -20]]) {
          ctx.beginPath(); ctx.moveTo(hx0, hy0 - bob); ctx.lineTo(hx0 - 5, hy0 + 2 - bob); ctx.stroke();
        }

        // Sloping wedge-shaped boar head & snout (tilts down menacingly when snorting!)
        ctx.save();
        ctx.translate(18, -24 - bob);
        ctx.rotate(snort * 0.14);
        const hdG = ctx.createLinearGradient(-4, -12, 20, 8);
        hdG.addColorStop(0, '#5c3f2b');
        hdG.addColorStop(1, '#2b1c12');
        ctx.fillStyle = hdG;
        ctx.strokeStyle = '#140c08';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-6, -11);
        ctx.lineTo(18, -2);
        ctx.lineTo(18, 6);
        ctx.quadraticCurveTo(4, 9, -6, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pointed furry ear
        ctx.fillStyle = '#3b271a';
        ctx.beginPath();
        ctx.moveTo(-3, -10); ctx.lineTo(-8, -19); ctx.lineTo(2, -13);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Pinkish-brown flat nasal disc & nostrils
        ctx.fillStyle = '#a16256';
        ctx.strokeStyle = '#29150e';
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.ellipse(18.5, 2, 3.2, 4.6, 0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1c100b';
        ctx.beginPath(); ctx.arc(19, 0.5, 1.0, 0, Math.PI * 2); ctx.arc(19, 3.5, 1.0, 0, Math.PI * 2); ctx.fill();

        // Gleaming Curved Ivory Boar Tusks (أنياب عاجية مقوسة)!
        ctx.fillStyle = '#fef9c3';
        ctx.strokeStyle = '#573d26';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(11, 5);
        ctx.quadraticCurveTo(16, 4, 17.5, -5.5);
        ctx.quadraticCurveTo(13.5, 1, 9, 3.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Fierce amber-gold eye under heavy brow
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(5.5, -4.5, 2.3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#09090b';
        ctx.beginPath(); ctx.arc(6.0, -4.5, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#140c08'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(2.5, -7.2); ctx.lineTo(8.5, -5.8); ctx.stroke();

        // Snorting steam puff when charging
        if (snort > 0.25) {
          ctx.fillStyle = `rgba(254, 243, 199, ${(snort * 0.55).toFixed(2)})`;
          ctx.beginPath(); ctx.arc(24 + Math.sin(time * 16) * 2, 3, 3.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        // Near 2-segment legs & dark cloven hooves flush at y = 0
        ctx.strokeStyle = '#3b271a'; ctx.lineWidth = 6.0;
        ctx.beginPath();
        ctx.moveTo(-13, -14 - bob); ctx.lineTo(-15 + nearA * 0.5, -6.5 - bob * 0.4); ctx.lineTo(-12 + nearA, -1.8);
        ctx.moveTo(12, -14 - bob); ctx.lineTo(14 - nearA * 0.5, -6.5 - bob * 0.4); ctx.lineTo(13 - nearA, -1.8);
        ctx.stroke();
        ctx.fillStyle = '#0c0a09';
        ctx.fillRect(-15 + nearA, -2.5, 6, 2.5);
        ctx.fillRect(10 - nearA, -2.5, 6, 2.5);
        ctx.restore();
      }
    }

    // 53. Crowned Palestinian Hoopoe (Stage 26: Battir — طائر الهدهد الفلسطيني المتوّج — fan crest & zebra-striped wings!)
    if (level.battir_hoopoes) {
      for (const hp of level.battir_hoopoes) {
        const sx = hp.x - camX, sy = hp.y - camY;
        if (sx + hp.w < -80 || sx > 1400) continue;
        const face = hp.facing || 1;
        const flap = Math.sin(time * 10.5 + (hp.phase || 0));
        const wingY = flap * 14;
        const crestOpen = 0.65 + 0.35 * Math.sin(time * 4.8 + (hp.phase || 0));
        ctx.save();
        ctx.translate(sx + hp.w * 0.5, sy + hp.h * 0.5);
        ctx.scale(face, 1);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // 1. Bold Black-and-White Banded Hoopoe Tail
        ctx.fillStyle = '#18181b';
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(-12, 0); ctx.lineTo(-31, -4.5); ctx.lineTo(-29, 6.5); ctx.lineTo(-12, 4.5);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Crisp white central tail bar
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-21, -2.2); ctx.lineTo(-25, -3.1); ctx.lineTo(-23.8, 5.2); ctx.lineTo(-19.8, 4.4);
        ctx.closePath(); ctx.fill();

        // 2. Far Rounded Wing (black with white bars)
        ctx.fillStyle = '#27272a';
        ctx.beginPath();
        ctx.moveTo(-2, -3);
        ctx.quadraticCurveTo(-10, -18 - wingY * 0.75, -23, -11 - wingY * 0.8);
        ctx.quadraticCurveTo(-14, -1, -2, 2);
        ctx.closePath(); ctx.fill();

        // 3. Warm Cinnamon-Terracotta & Salmon-Pink Hoopoe Body!
        const hpG = ctx.createLinearGradient(0, -9, 0, 9);
        hpG.addColorStop(0.0, '#ea580c');
        hpG.addColorStop(0.55, '#fb923c');
        hpG.addColorStop(1.0, '#ffedd5');
        ctx.fillStyle = hpG;
        ctx.strokeStyle = '#431407';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.ellipse(2, 1.5, 16, 7.5, -0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 4. Near Rounded Zebra-Striped Black-and-White Hoopoe Wing!
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(5, -1);
        ctx.bezierCurveTo(-2, -19 - wingY, -19, -19 - wingY, -24, -7 - wingY * 0.9);
        ctx.bezierCurveTo(-22, 3 - wingY * 0.3, -8, 6, 4, 4);
        ctx.closePath();
        ctx.fillStyle = '#18181b';
        ctx.fill();
        ctx.clip();
        // Three bold snow-white diagonal wing bands!
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.4;
        for (const off of [-6, -13, -20]) {
          ctx.beginPath();
          ctx.moveTo(off + 8, -22 - wingY);
          ctx.lineTo(off - 4, 8);
          ctx.stroke();
        }
        ctx.restore();
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(5, -1);
        ctx.bezierCurveTo(-2, -19 - wingY, -19, -19 - wingY, -24, -7 - wingY * 0.9);
        ctx.bezierCurveTo(-22, 3 - wingY * 0.3, -8, 6, 4, 4);
        ctx.closePath();
        ctx.stroke();

        // 5. Cinnamon Head + Iconic Fanning 7-Feather Black-and-White-Tipped Crown Crest (تاج الهدهد المروحي)!
        ctx.fillStyle = '#ea580c';
        ctx.strokeStyle = '#431407';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(16.5, -3.5, 6.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        for (let f = 0; f < 7; f++) {
          const frac = f / 6;
          const baseA = -Math.PI * 0.96 + frac * (Math.PI * 0.68 * crestOpen);
          const fLen = 14 + Math.sin(frac * Math.PI) * 5;
          const rx0 = 15, ry0 = -7.5;
          const ex = rx0 + Math.cos(baseA) * fLen;
          const ey = ry0 + Math.sin(baseA) * fLen;
          // Golden-orange feather shaft
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2.8;
          ctx.beginPath(); ctx.moveTo(rx0, ry0); ctx.lineTo(ex, ey); ctx.stroke();
          // Subterminal snow-white band
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(rx0 + Math.cos(baseA) * (fLen * 0.65), ry0 + Math.sin(baseA) * (fLen * 0.65));
          ctx.lineTo(rx0 + Math.cos(baseA) * (fLen * 0.82), ry0 + Math.sin(baseA) * (fLen * 0.82));
          ctx.stroke();
          // Jet-black feather tip!
          ctx.strokeStyle = '#09090b';
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.moveTo(rx0 + Math.cos(baseA) * (fLen * 0.82), ry0 + Math.sin(baseA) * (fLen * 0.82));
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }

        // Bright dark eye + catchlight + Long Slender Decurved Black Hoopoe Bill!
        ctx.fillStyle = '#09090b';
        ctx.beginPath(); ctx.arc(18.8, -4.2, 1.7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(19.3, -4.7, 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(21.5, -3.8);
        ctx.quadraticCurveTo(29.5, -3.2, 33.5, 1.8);
        ctx.stroke();

        ctx.restore();
      }
    }

    // 54. Palestinian Golden Cliff Scorpion (Stage 26: Battir — عقرب الصخور الجبلي الذهبي!)
    // Museum-grade arachnid anatomy: 4 far & 4 near 3-segment legs, armored
    // segmented tergite carapace, 5-bead arched metasoma tail with bulbous venom
    // telson & curved obsidian stinger, plus twin articulated serrated pincers!
    if (level.battir_scorpions) {
      for (const sc of level.battir_scorpions) {
        const sx = sc.x - camX, sy = sc.y - camY;
        if (sx + sc.w < -80 || sx > 1400) continue;
        const face = sc.facing || 1;
        const wPhase = (sc.walkDist || 0) * 0.24;
        const threat = sc.threat || 0;
        ctx.save();
        ctx.translate(sx + sc.w * 0.5, sy + sc.h);
        ctx.scale(face, 1);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // Soft ground contact shadow
        ctx.fillStyle = 'rgba(24, 16, 10, 0.30)';
        ctx.beginPath(); ctx.ellipse(1, 0, 26, 4.0, 0, 0, Math.PI * 2); ctx.fill();

        // 1. Far-side 4 jointed arachnid legs (darker shaded for 3D depth)
        for (let l = 0; l < 4; l++) {
          const lx = -11 + l * 6.5;
          const lift = Math.max(0, Math.sin(wPhase + l * 1.55 + Math.PI)) * 2.8;
          const stride = Math.cos(wPhase + l * 1.55 + Math.PI) * 3.2;
          const kneeX = lx - 1.5 + stride * 0.45;
          const kneeY = -14.5 - lift * 0.4;
          const footX = lx + 1.5 + stride;
          const footY = -1.2 - lift;
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(lx, -8.5);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();
        }

        // Far-side front pedipalp pincer (depth shadow)
        const snap = Math.abs(Math.sin(time * 6.8 + sx * 0.015)) * (0.22 + threat * 0.42);
        ctx.save();
        ctx.translate(12, -10);
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 2.8;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(7, -5); ctx.lineTo(13, -3.5); ctx.stroke();
        ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.ellipse(16, -5.5 - snap * 2.5, 5.2, 2.0, -0.35 - snap, 0, Math.PI * 2);
        ctx.ellipse(16, -2.0 + snap * 2.0, 4.8, 1.8, 0.25 + snap, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.restore();

        // 2. Sculpted 5-Segment Tapered Interlocking Metasoma Tail + Venom Telson & Stinger
        const tailCurl = threat * 0.26 + Math.sin(time * 4.8 + sx * 0.02) * 0.06;
        let tx0 = -13.5, ty0 = -10.5;
        const segLens = [7.0, 6.8, 6.6, 6.3, 6.0];
        const segAngs = [-2.22, -1.68, -1.04 + tailCurl, -0.40 + tailCurl, 0.22 + tailCurl];
        for (let s = 0; s < segAngs.length; s++) {
          const ang = segAngs[s];
          const len = segLens[s];
          const nx = tx0 + Math.cos(ang) * len;
          const ny = ty0 + Math.sin(ang) * len;
          const mx = (tx0 + nx) * 0.5;
          const my = (ty0 + ny) * 0.5;
          const rx = len * 0.60;
          const ry = 3.2 - s * 0.28;
          ctx.save();
          ctx.translate(mx, my);
          ctx.rotate(ang);
          const sgG = ctx.createLinearGradient(0, -ry, 0, ry);
          if (s === 4) {
            sgG.addColorStop(0, '#b45309'); sgG.addColorStop(0.55, '#78350f'); sgG.addColorStop(1, '#3b1506');
          } else {
            sgG.addColorStop(0, '#fde047'); sgG.addColorStop(0.42, '#f59e0b'); sgG.addColorStop(1, '#92400e');
          }
          ctx.fillStyle = sgG;
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Chitinous dorsal highlight & joint keel
          ctx.fillStyle = 'rgba(255, 251, 235, 0.35)';
          ctx.beginPath(); ctx.ellipse(0, -ry * 0.35, rx * 0.55, ry * 0.25, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          tx0 = nx; ty0 = ny;
        }
        // Bulbous Venom Vesicle (Telson) + Razor-Sharp Curved Obsidian Stinger Barb
        const telG = ctx.createRadialGradient(tx0 - 1, ty0 - 1, 0.6, tx0 + 1, ty0, 4.4);
        telG.addColorStop(0, '#dc2626'); telG.addColorStop(0.55, '#7f1d1d'); telG.addColorStop(1, '#1c1917');
        ctx.fillStyle = telG;
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.ellipse(tx0 + 1.5, ty0 + 0.5, 4.0, 3.0, 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Curved stinger barb
        ctx.fillStyle = '#09090b';
        ctx.beginPath();
        ctx.moveTo(tx0 + 4.5, ty0 - 0.8);
        ctx.quadraticCurveTo(tx0 + 10.5, ty0 + 1.5, tx0 + 6.5, ty0 + 8.0);
        ctx.quadraticCurveTo(tx0 + 6.8, ty0 + 3.0, tx0 + 3.5, ty0 + 2.2);
        ctx.closePath();
        ctx.fill();
        if (threat > 0.15) {
          ctx.fillStyle = '#bef264';
          ctx.beginPath(); ctx.arc(tx0 + 6.5, ty0 + 8.2, 1.3, 0, Math.PI * 2); ctx.fill();
        }

        // 3. Armored Segmented Mesosoma & Cephalothorax Carapace (درع العقرب المقسّم)
        const scG = ctx.createLinearGradient(-16, -16, 16, -4);
        scG.addColorStop(0.0, '#fcd34d');
        scG.addColorStop(0.38, '#f59e0b');
        scG.addColorStop(0.75, '#b45309');
        scG.addColorStop(1.0, '#5c2408');
        ctx.fillStyle = scG;
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-15.5, -9.5);
        ctx.bezierCurveTo(-13, -15.5, 6, -16.0, 15.5, -10.5);
        ctx.bezierCurveTo(16.5, -6.5, 10, -4.2, 0, -4.4);
        ctx.bezierCurveTo(-10, -4.4, -15, -6.2, -15.5, -9.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 5 Overlapping Chitinous Tergite Armor Ridges + Glossy Specular Sheen
        ctx.strokeStyle = 'rgba(69, 26, 3, 0.65)';
        ctx.lineWidth = 1.05;
        for (const rx of [-9.5, -5.2, -1.0, 3.2, 7.4]) {
          ctx.beginPath();
          ctx.moveTo(rx, -14.2);
          ctx.quadraticCurveTo(rx - 1.5, -9.5, rx + 0.5, -5.0);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(254, 249, 195, 0.36)';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(rx + 1.1, -13.6);
          ctx.quadraticCurveTo(rx - 0.3, -9.5, rx + 1.5, -5.8);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(69, 26, 3, 0.65)';
          ctx.lineWidth = 1.05;
        }
        // Gleaming tiny black median & lateral eyes on head shield + tiny chelicerae
        ctx.fillStyle = '#09090b';
        ctx.beginPath();
        ctx.arc(10.5, -12.0, 1.3, 0, Math.PI * 2);
        ctx.arc(13.5, -10.6, 1.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(10.8, -12.3, 0.45, 0, Math.PI * 2); ctx.fill();

        // 4. Near-side 4 articulated 3-segment arachnid legs (femur -> tibia -> tarsus claw)
        for (let l = 0; l < 4; l++) {
          const lx = -10 + l * 6.5;
          const lift = Math.max(0, Math.sin(wPhase + l * 1.55)) * 3.0;
          const stride = Math.cos(wPhase + l * 1.55) * 3.6;
          const kneeX = lx - 1.8 + stride * 0.4;
          const kneeY = -13.5 - lift * 0.5;
          const midX = lx + 0.5 + stride * 0.85;
          const midY = -6.0 - lift * 0.7;
          const footX = lx + 2.2 + stride;
          const footY = -0.6 - lift;
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 3.2;
          ctx.beginPath(); ctx.moveTo(lx, -7.5); ctx.lineTo(kneeX, kneeY); ctx.lineTo(midX, midY); ctx.lineTo(footX, footY); ctx.stroke();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(lx, -7.5); ctx.lineTo(kneeX, kneeY); ctx.lineTo(midX, midY); ctx.lineTo(footX, footY); ctx.stroke();
        }

        // 5. Near-side Sculpted Front Pedipalp Arm, Armored Manus & Crescent Pincers (الكلابات الأمامية)
        ctx.save();
        ctx.translate(12, -8.5);
        ctx.strokeStyle = '#451a03'; ctx.lineWidth = 4.2;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(6.5, -3.2); ctx.lineTo(12.5, -1.5); ctx.stroke();
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(6.5, -3.2); ctx.lineTo(12.5, -1.5); ctx.stroke();
        // Swollen armored manus (pincer palm)
        const mnG = ctx.createRadialGradient(13.5, -2.5, 0.8, 14, -1.5, 4.8);
        mnG.addColorStop(0, '#fde047'); mnG.addColorStop(0.55, '#d97706'); mnG.addColorStop(1, '#78350f');
        ctx.fillStyle = mnG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.ellipse(14.0, -1.5, 4.4, 3.3, -0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Upper & lower curved crescent pincer blades snapping!
        ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(16.5, -3.2);
        ctx.quadraticCurveTo(22.5, -7.2 - snap * 3.5, 25.5, -2.6 - snap * 3.2);
        ctx.quadraticCurveTo(21.2, -3.5 - snap * 1.8, 17.0, -1.5);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(16.5, 0.2);
        ctx.quadraticCurveTo(22.5, 3.8 + snap * 3.0, 25.2, -0.4 + snap * 2.5);
        ctx.quadraticCurveTo(21.0, 0.8 + snap * 1.4, 17.0, -0.8);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();

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
