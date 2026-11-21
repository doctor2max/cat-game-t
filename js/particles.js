window.Game = window.Game || {};

window.Game.Particles = (function () {
  const particles = [];
  const rings = [];
  const popups = [];

  function spawnDust(x, y, count = 6, color = 'rgba(235, 220, 195, 0.65)') {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 90,
        vy: -20 - Math.random() * 60,
        size: 3 + Math.random() * 4,
        life: 0.35 + Math.random() * 0.2,
        maxLife: 0.55,
        color,
        gravity: 140,
      });
    }
  }

  function spawnSplash(x, y) {
    for (let i = 0; i < 14; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y,
        vx: (Math.random() - 0.5) * 200,
        vy: -120 - Math.random() * 170,
        size: 3 + Math.random() * 4,
        life: 0.55,
        maxLife: 0.55,
        color: '#6ce5ff',
        gravity: 650,
      });
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
      particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 35,
        size: 2.2 + Math.random() * 2.5,
        life: 0.36 + Math.random() * 0.16,
        maxLife: 0.52,
        color: colors[i % colors.length],
        gravity: 220,
      });
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
    for (let i = 0; i < 14; i++) {
      const ang = (Math.PI * 2 * i) / 14;
      particles.push({
        x,
        y,
        vx: Math.cos(ang) * (120 + (i % 3) * 28),
        vy: Math.sin(ang) * (120 + (i % 3) * 28) - 20,
        size: 3 + Math.random() * 2.2,
        life: 0.44,
        maxLife: 0.44,
        color: burstColors[i % burstColors.length],
        gravity: 220,
      });
    }
  }

  function spawnTrailDot(x, y, color) {
    if (particles.length > 90) return;
    particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 18,
      vy: -12 - Math.random() * 18,
      size: 2 + Math.random() * 2.2,
      life: 0.34,
      maxLife: 0.34,
      color,
      gravity: 10,
    });
  }

  function spawnNectarBurst(x, y) {
    // Soft golden pollen mist ring
    rings.push({
      x,
      y: y - 4,
      radius: 10,
      maxRadius: 72,
      life: 0.45,
      maxLife: 0.45,
      color: '#fde047',
    });

    // Shimmering liquid golden nectar droplets arcing gracefully outward
    const nectarCols = ['#fef08a', '#fbbf24', '#fde68a', '#fffbeb'];
    for (let i = 0; i < 12; i++) {
      const ang = -Math.PI * (0.12 + Math.random() * 0.76);
      const spd = 85 + Math.random() * 145;
      particles.push({
        x: x + (Math.random() - 0.5) * 28,
        y: y - 2 + (Math.random() - 0.5) * 6,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 30,
        size: 2.2 + Math.random() * 2.4,
        life: 0.55 + Math.random() * 0.35,
        maxLife: 0.9,
        color: nectarCols[i % nectarCols.length],
        gravity: 260,
        kind: 'nectar',
      });
    }

    // Weightless glowing golden pollen motes drifting gently upward
    for (let i = 0; i < 10; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 38,
        y: y - 4 + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 65,
        vy: -45 - Math.random() * 75,
        size: 1.6 + Math.random() * 1.8,
        life: 0.75 + Math.random() * 0.45,
        maxLife: 1.2,
        color: i % 2 === 0 ? '#fef9c3' : '#facc15',
        gravity: 28,
        sway: (Math.random() - 0.5) * 6,
        kind: 'pollen',
      });
    }

    // Delicate fluttering lavender-violet flower micro-petals
    const petalCols = ['#f3e8ff', '#d8b4fe', '#c084fc'];
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 44,
        y: y - 2,
        vx: (Math.random() - 0.5) * 95,
        vy: -75 - Math.random() * 65,
        size: 3.6 + Math.random() * 1.8,
        life: 0.85 + Math.random() * 0.45,
        maxLife: 1.3,
        color: petalCols[i % petalCols.length],
        gravity: 75,
        rot: Math.random() * Math.PI * 2,
        rotSpd: (Math.random() - 0.5) * 7,
        kind: 'petal',
      });
    }
  }

  function update(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
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
        rings.splice(i, 1);
        continue;
      }
      const progress = 1 - r.life / r.maxLife;
      r.radius = 12 + progress * r.maxRadius;
    }

    for (let i = popups.length - 1; i >= 0; i--) {
      const pop = popups[i];
      pop.life -= dt;
      if (pop.life <= 0) {
        popups.splice(i, 1);
        continue;
      }
      pop.y += pop.vy * dt;
    }
  }

  function draw(ctx, camX, camY) {
    for (const p of particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      const sx = p.x - camX;
      const sy = p.y - camY;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      if (p.kind === 'petal') {
        ctx.translate(sx, sy);
        ctx.rotate(p.rot || 0);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.52, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === 'nectar') {
        // Teardrop shimmering nectar droplet with specular dot
        const ang = Math.atan2(p.vy, p.vx) + Math.PI / 2;
        ctx.translate(sx, sy);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.72, p.size * 1.15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-p.size * 0.2, -p.size * 0.3, p.size * 0.28, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    for (const r of rings) {
      const alpha = Math.max(0, r.life / r.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha * 0.78;
      ctx.strokeStyle = r.color || '#ffd36e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(r.x - camX, r.y - camY, r.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (const pop of popups) {
      const alpha = Math.max(0, pop.life / pop.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#090d16';
      ctx.fillText(pop.text, pop.x - camX + 1, pop.y - camY + 1);
      ctx.fillStyle = pop.color;
      ctx.fillText(pop.text, pop.x - camX, pop.y - camY);
      ctx.restore();
    }
  }

  function clear() {
    particles.length = 0;
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
