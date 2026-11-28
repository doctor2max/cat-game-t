window.Game = window.Game || {};

window.Game.Particles = (function () {
  const particles = [];
  const freeParticles = [];
  const MAX_PARTICLES = 110;
  const rings = [];
  const popups = [];

  function pushParticle(x, y, vx, vy, size, life, maxLife, color, gravity, kind, sway, rot, rotSpd) {
    if (particles.length >= MAX_PARTICLES) return;
    const p = freeParticles.length > 0 ? freeParticles.pop() : {};
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.size = size;
    p.life = life;
    p.maxLife = maxLife;
    p.color = color;
    p.gravity = gravity;
    p.kind = kind || '';
    p.sway = sway || 0;
    p.rot = rot || 0;
    p.rotSpd = rotSpd || 0;
    particles.push(p);
  }

  function spawnDust(x, y, count = 6, color = 'rgba(235, 220, 195, 0.65)') {
    for (let i = 0; i < count; i++) {
      pushParticle(
        x + (Math.random() - 0.5) * 16,
        y + (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 90,
        -20 - Math.random() * 60,
        3 + Math.random() * 4,
        0.35 + Math.random() * 0.2,
        0.55,
        color,
        140
      );
    }
  }

  function spawnSplash(x, y) {
    for (let i = 0; i < 12; i++) {
      pushParticle(
        x + (Math.random() - 0.5) * 20,
        y,
        (Math.random() - 0.5) * 200,
        -120 - Math.random() * 170,
        3 + Math.random() * 4,
        0.55,
        0.55,
        '#6ce5ff',
        650
      );
    }
  }

  function spawnHeart(x, y) {
    popups.push({
      x,
      y,
      vy: -38,
      text: '❤️ Purr~',
      color: '#ff8da1',
      life: 1.1,
      maxLife: 1.1,
    });
  }

  function spawnPopup(x, y, text, color = '#ffd36e') {
    popups.push({
      x,
      y,
      vy: -42,
      text,
      color,
      life: 1.0,
      maxLife: 1.0,
    });
  }

  function spawnMeowRing(x, y) {
    rings.push({
      x,
      y,
      radius: 10,
      maxRadius: 240,
      life: 0.65,
      maxLife: 0.65,
      color: '#ffd36e',
    });
  }

  function spawnCoinSparkle(x, y) {
    const colors = ['#fde047', '#fbbf24', '#ffffff', '#f59e0b'];
    for (let i = 0; i < 8; i++) {
      const ang = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
      const spd = 65 + Math.random() * 95;
      pushParticle(
        x,
        y,
        Math.cos(ang) * spd,
        Math.sin(ang) * spd - 35,
        2.2 + Math.random() * 2.5,
        0.36 + Math.random() * 0.16,
        0.52,
        colors[i % colors.length],
        220
      );
    }
  }

  function spawnShieldBurst(x, y) {
    rings.push({
      x,
      y,
      radius: 14,
      maxRadius: 110,
      life: 0.42,
      maxLife: 0.42,
      color: '#fde68a',
    });
    const burstColors = ['#d6a76c', '#b07b42', '#fef08a', '#fffbeb'];
    for (let i = 0; i < 12; i++) {
      const ang = (Math.PI * 2 * i) / 12;
      pushParticle(
        x,
        y,
        Math.cos(ang) * (120 + (i % 3) * 28),
        Math.sin(ang) * (120 + (i % 3) * 28) - 20,
        3 + Math.random() * 2.2,
        0.44,
        0.44,
        burstColors[i % burstColors.length],
        220
      );
    }
  }

  function spawnTrailDot(x, y, color) {
    if (particles.length > 75) return;
    pushParticle(
      x + (Math.random() - 0.5) * 8,
      y + (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 18,
      -12 - Math.random() * 18,
      2 + Math.random() * 2.2,
      0.34,
      0.34,
      color,
      10
    );
  }

  function spawnNectarBurst(x, y) {
    rings.push({
      x,
      y: y - 4,
      radius: 10,
      maxRadius: 72,
      life: 0.45,
      maxLife: 0.45,
      color: '#fde047',
    });

    const nectarCols = ['#fef08a', '#fbbf24', '#fde68a', '#fffbeb'];
    for (let i = 0; i < 10; i++) {
      const ang = -Math.PI * (0.12 + Math.random() * 0.76);
      const spd = 85 + Math.random() * 145;
      pushParticle(
        x + (Math.random() - 0.5) * 28,
        y - 2 + (Math.random() - 0.5) * 6,
        Math.cos(ang) * spd,
        Math.sin(ang) * spd - 30,
        2.2 + Math.random() * 2.4,
        0.55 + Math.random() * 0.35,
        0.9,
        nectarCols[i % nectarCols.length],
        260,
        'nectar'
      );
    }

    for (let i = 0; i < 8; i++) {
      pushParticle(
        x + (Math.random() - 0.5) * 38,
        y - 4 + (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 65,
        -45 - Math.random() * 75,
        1.6 + Math.random() * 1.8,
        0.75 + Math.random() * 0.45,
        1.2,
        i % 2 === 0 ? '#fef9c3' : '#facc15',
        28,
        'pollen',
        (Math.random() - 0.5) * 6
      );
    }

    const petalCols = ['#f3e8ff', '#d8b4fe', '#c084fc'];
    for (let i = 0; i < 4; i++) {
      pushParticle(
        x + (Math.random() - 0.5) * 44,
        y - 2,
        (Math.random() - 0.5) * 95,
        -75 - Math.random() * 65,
        3.6 + Math.random() * 1.8,
        0.85 + Math.random() * 0.45,
        1.3,
        petalCols[i % petalCols.length],
        75,
        'petal',
        0,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 7
      );
    }
  }

  function update(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        freeParticles.push(p);
        const last = particles.pop();
        if (i < particles.length) particles[i] = last;
        continue;
      }
      p.vy += p.gravity * dt;
      if (p.sway) p.vx += Math.sin(p.life * 9 + p.sway) * 28 * dt;
      if (p.rotSpd) p.rot = (p.rot || 0) + p.rotSpd * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }

    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i];
      r.life -= dt;
      if (r.life <= 0) {
        const last = rings.pop();
        if (i < rings.length) rings[i] = last;
        continue;
      }
      const progress = 1 - r.life / r.maxLife;
      r.radius = 12 + progress * r.maxRadius;
    }

    for (let i = popups.length - 1; i >= 0; i--) {
      const pop = popups[i];
      pop.life -= dt;
      if (pop.life <= 0) {
        const last = popups.pop();
        if (i < popups.length) popups[i] = last;
        continue;
      }
      pop.y += pop.vy * dt;
    }
  }

  function draw(ctx, camX, camY) {
    if (particles.length === 0 && rings.length === 0 && popups.length === 0) return;
    const viewW = ctx._viewW || 1024;
    ctx.save();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const sx = p.x - camX;
      const sy = p.y - camY;
      if (sx < -24 || sx > viewW + 24 || sy < -60 || sy > 760) continue;
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      if (p.kind === 'petal') {
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(p.rot || 0);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.52, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.kind === 'nectar') {
        const ang = Math.atan2(p.vy, p.vx) + Math.PI / 2;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.72, p.size * 1.15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-p.size * 0.2, -p.size * 0.3, p.size * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (rings.length > 0) {
      ctx.lineWidth = 3;
      for (let i = 0; i < rings.length; i++) {
        const r = rings[i];
        const alpha = Math.max(0, r.life / r.maxLife);
        ctx.globalAlpha = alpha * 0.78;
        ctx.strokeStyle = r.color || '#ffd36e';
        ctx.beginPath();
        ctx.arc(r.x - camX, r.y - camY, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (popups.length > 0) {
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      for (let i = 0; i < popups.length; i++) {
        const pop = popups[i];
        const px = pop.x - camX;
        if (px < -140 || px > viewW + 140) continue;
        const alpha = Math.max(0, pop.life / pop.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#090d16';
        ctx.fillText(pop.text, px + 1, pop.y - camY + 1);
        ctx.fillStyle = pop.color;
        ctx.fillText(pop.text, px, pop.y - camY);
      }
    }
    ctx.restore();
  }

  function clear() {
    while (particles.length > 0) freeParticles.push(particles.pop());
    rings.length = 0;
    popups.length = 0;
  }

  return {
    spawnDust,
    spawnSplash,
    spawnHeart,
    spawnPopup,
    spawnMeowRing,
    spawnCoinSparkle,
    spawnShieldBurst,
    spawnTrailDot,
    spawnNectarBurst,
    update,
    draw,
    clear,
  };
})();
