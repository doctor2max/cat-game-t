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
    });
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
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x - camX, p.y - camY, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const r of rings) {
      const alpha = Math.max(0, r.life / r.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha * 0.75;
      ctx.strokeStyle = '#ffd36e';
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
    update,
    draw,
    clear,
  };
})();
