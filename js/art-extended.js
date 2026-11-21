window.Game = window.Game || {};

(function () {
  const Art = window.Game.Art;
  if (!Art) return;

  const origDrawPlatform = Art.drawPlatform;

  // =========================================================================
  // 0. PRE-BAKED PROCEDURAL HIGH-DETAIL TEXTURE ENGINE (60fps GPU Blits!)
  // =========================================================================
  const tex = {};

  function makeOffscreen(w, h, fn) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    fn(c.getContext('2d'), w, h);
    return c;
  }

  function ensureTextures(ctx) {
    if (tex.ready) return;

    // 1. Calacatta Veined Museum Marble
    tex.veinedMarble = ctx.createPattern(
      makeOffscreen(128, 128, (c, w, h) => {
        const g = c.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, '#eef2f6');
        g.addColorStop(0.5, '#dde3ec');
        g.addColorStop(1, '#cfd8e3');
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);
        // Subtle mineral clouds
        for (let i = 0; i < 18; i++) {
          c.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(148,163,184,0.12)';
          c.beginPath();
          c.ellipse((i * 37) % w, (i * 53) % h, 18 + (i % 4) * 6, 8 + (i % 3) * 4, 0.5, 0, Math.PI * 2);
          c.fill();
        }
        // Organic diagonal marble veins (grey & faint gold)
        c.strokeStyle = 'rgba(100, 116, 139, 0.28)';
        c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(0, 24); c.bezierCurveTo(38, 34, 62, 12, 128, 48);
        c.moveTo(12, 128); c.bezierCurveTo(46, 86, 88, 96, 128, 62);
        c.stroke();
        c.strokeStyle = 'rgba(217, 119, 6, 0.16)';
        c.lineWidth = 1.1;
        c.beginPath();
        c.moveTo(0, 76); c.bezierCurveTo(42, 66, 76, 88, 128, 102);
        c.stroke();
        // Fine tile grout seams
        c.strokeStyle = 'rgba(71, 85, 105, 0.24)';
        c.lineWidth = 1;
        c.strokeRect(0.5, 0.5, w - 1, h / 2 - 1);
        c.strokeRect(0.5, h / 2 + 0.5, w - 1, h / 2 - 1);
      }),
      'repeat'
    );

    // 2. Venetian Midnight-Sapphire Museum Damask Wallpaper
    tex.museumDamask = ctx.createPattern(
      makeOffscreen(64, 64, (c, w, h) => {
        c.fillStyle = '#0f1830';
        c.fillRect(0, 0, w, h);
        c.fillStyle = '#14203e';
        c.fillRect(0, 0, 16, h);
        c.fillRect(32, 0, 16, h);
        // Delicate gold-tinted damask diamond motif
        c.strokeStyle = 'rgba(245, 185, 75, 0.085)';
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(16, 8); c.lineTo(24, 16); c.lineTo(16, 24); c.lineTo(8, 16); c.closePath();
        c.moveTo(48, 40); c.lineTo(56, 48); c.lineTo(48, 56); c.lineTo(40, 48); c.closePath();
        c.stroke();
        c.fillStyle = 'rgba(255, 255, 255, 0.03)';
        for (let i = 0; i < 40; i++) c.fillRect((i * 19) % w, (i * 29) % h, 1.5, 1.5);
      }),
      'repeat'
    );

    // 3. Weathered European Cut Ashlar Stone Masonry
    tex.ashlarStone = ctx.createPattern(
      makeOffscreen(96, 48, (c, w, h) => {
        c.fillStyle = '#1b1726';
        c.fillRect(0, 0, w, h);
        const tones = ['#39324a', '#433b56', '#332c42', '#4c4361', '#3d354f'];
        for (let row = 0; row < 2; row++) {
          const y = row * 24;
          const off = row === 0 ? 0 : 24;
          for (let col = -1; col < 3; col++) {
            const x = col * 48 + off;
            c.fillStyle = tones[(row * 3 + col + 5) % tones.length];
            c.fillRect(x + 1.5, y + 1.5, 45, 21);
            // Chiseled top highlight & bottom shadow bevel
            c.fillStyle = 'rgba(255, 245, 225, 0.1)';
            c.fillRect(x + 1.5, y + 1.5, 45, 2);
            c.fillStyle = 'rgba(0, 0, 0, 0.25)';
            c.fillRect(x + 1.5, y + 20.5, 45, 2);
          }
        }
        // Micro stone grain
        for (let i = 0; i < 65; i++) {
          c.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.12)';
          c.fillRect((i * 23) % w, (i * 31) % h, 2, 1.5);
        }
      }),
      'repeat'
    );

    // 4. Aged Warm European Stucco Plaster
    tex.stuccoPlaster = ctx.createPattern(
      makeOffscreen(96, 96, (c, w, h) => {
        c.fillStyle = '#473647';
        c.fillRect(0, 0, w, h);
        for (let i = 0; i < 160; i++) {
          const x = (i * 37) % w;
          const y = (i * 59) % h;
          c.fillStyle = i % 3 === 0 ? 'rgba(255, 232, 200, 0.055)' : 'rgba(18, 10, 22, 0.09)';
          c.fillRect(x, y, 3, 2);
        }
        // Subtle weathered plaster hairline crack
        c.strokeStyle = 'rgba(20, 10, 24, 0.22)';
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(18, 14); c.lineTo(25, 28); c.lineTo(22, 42);
        c.stroke();
      }),
      'repeat'
    );

    // 5. Scalloped Terracotta Roof Shingles
    tex.terracottaShingles = ctx.createPattern(
      makeOffscreen(48, 32, (c, w, h) => {
        c.fillStyle = '#4f1e22';
        c.fillRect(0, 0, w, h);
        for (let row = 0; row < 2; row++) {
          const y = row * 16;
          const off = row === 0 ? 0 : 12;
          for (let col = -1; col < 3; col++) {
            const x = col * 24 + off;
            const tg = c.createLinearGradient(x, y, x, y + 16);
            tg.addColorStop(0, '#8c3336');
            tg.addColorStop(1, '#5e1f24');
            c.fillStyle = tg;
            c.beginPath();
            c.arc(x + 12, y + 4, 12, 0, Math.PI);
            c.closePath();
            c.fill();
            c.strokeStyle = 'rgba(26, 8, 10, 0.55)';
            c.lineWidth = 1.2;
            c.stroke();
            c.strokeStyle = 'rgba(255, 210, 175, 0.14)';
            c.beginPath();
            c.arc(x + 12, y + 4, 10, 0.3, Math.PI - 0.3);
            c.stroke();
          }
        }
      }),
      'repeat'
    );

    // 6. Riveted Industrial Steel Plate (Bridges & Freighters)
    tex.rivetedSteel = ctx.createPattern(
      makeOffscreen(64, 64, (c, w, h) => {
        c.fillStyle = '#263244';
        c.fillRect(0, 0, w, h);
        // Brushed metal horizontal micro-grain
        for (let y = 0; y < h; y += 3) {
          c.fillStyle = y % 6 === 0 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.06)';
          c.fillRect(0, y, w, 1.5);
        }
        // Plate weld seam
        c.strokeStyle = 'rgba(8, 13, 24, 0.6)';
        c.lineWidth = 1.4;
        c.strokeRect(1, 1, w - 2, h - 2);
        c.strokeStyle = 'rgba(186, 230, 253, 0.08)';
        c.beginPath(); c.moveTo(2, 2); c.lineTo(w - 2, 2); c.stroke();
        // Embossed 3D corner rivets
        for (const [rx, ry] of [[6, 6], [w - 6, 6], [6, h - 6], [w - 6, h - 6]]) {
          c.fillStyle = '#0f172a'; c.beginPath(); c.arc(rx + 0.8, ry + 0.8, 2.2, 0, Math.PI * 2); c.fill();
          c.fillStyle = '#64748b'; c.beginPath(); c.arc(rx, ry, 2, 0, Math.PI * 2); c.fill();
          c.fillStyle = '#cbd5e1'; c.beginPath(); c.arc(rx - 0.5, ry - 0.5, 0.8, 0, Math.PI * 2); c.fill();
        }
      }),
      'repeat'
    );

    // 7. Sunlit / Moonlit Textured Cobblestone Street
    tex.cobbleStreet = ctx.createPattern(
      makeOffscreen(64, 32, (c, w, h) => {
        c.fillStyle = '#2d140c';
        c.fillRect(0, 0, w, h);
        const stones = ['#7c3820', '#8f4428', '#6b2e19', '#994c2c'];
        for (let row = 0; row < 2; row++) {
          const y = row * 16;
          const off = row === 0 ? 0 : 16;
          for (let col = -1; col < 3; col++) {
            const x = col * 32 + off;
            c.fillStyle = stones[(row * 2 + col + 4) % stones.length];
            c.beginPath();
            c.roundRect(x + 1.5, y + 1.5, 29, 13, 4);
            c.fill();
            c.fillStyle = 'rgba(254, 240, 138, 0.16)';
            c.fillRect(x + 4, y + 2.5, 22, 2);
          }
        }
      }),
      'repeat'
    );

    // 8. Frosted Victorian Botanical Conservatory Glass
    tex.botanicalGlass = ctx.createPattern(
      makeOffscreen(64, 64, (c, w, h) => {
        const g = c.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, 'rgba(167, 243, 208, 0.11)');
        g.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
        g.addColorStop(1, 'rgba(167, 243, 208, 0.09)');
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);
        c.strokeStyle = 'rgba(110, 231, 183, 0.18)';
        c.lineWidth = 1.2;
        c.strokeRect(0.5, 0.5, w - 1, h - 1);
        // Subtle diagonal glass specular highlight
        c.fillStyle = 'rgba(255, 255, 255, 0.05)';
        c.beginPath(); c.moveTo(8, 0); c.lineTo(20, 0); c.lineTo(0, 20); c.lineTo(0, 8); c.closePath(); c.fill();
      }),
      'repeat'
    );

    // 9. Brushed Dark Titanium & Architectural Cyber Deck Plating (NO checkerboard!)
    tex.carbonCyber = ctx.createPattern(
      makeOffscreen(96, 48, (c, w, h) => {
        const bg = c.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#171d2f');
        bg.addColorStop(0.5, '#111625');
        bg.addColorStop(1, '#0c101d');
        c.fillStyle = bg;
        c.fillRect(0, 0, w, h);
        // Subtle brushed dark aluminum horizontal micro-grain
        for (let y = 0; y < h; y += 2) {
          c.fillStyle = y % 4 === 0 ? 'rgba(148, 163, 184, 0.045)' : 'rgba(2, 6, 23, 0.14)';
          c.fillRect(0, y, w, 1);
        }
        // Sleek beveled industrial armor plate seams
        c.strokeStyle = 'rgba(2, 6, 23, 0.65)';
        c.lineWidth = 1.4;
        c.strokeRect(0.5, 0.5, w - 1, h - 1);
        c.beginPath(); c.moveTo(w * 0.5, 0); c.lineTo(w * 0.5, h); c.stroke();
        c.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        c.beginPath(); c.moveTo(2, 2); c.lineTo(w - 2, 2); c.stroke();
        // Tiny recessed hex bolts
        c.fillStyle = 'rgba(148, 163, 184, 0.22)';
        for (const [bx, by] of [[6, 6], [42, 6], [54, 6], [90, 6], [6, 42], [90, 42]]) {
          c.beginPath(); c.arc(bx, by, 1.3, 0, Math.PI * 2); c.fill();
        }
      }),
      'repeat'
    );

    // 10. Architectural Dark Glass Skyscraper Curtain-Wall Facade (Stage 14)
    tex.cyberGlassFacade = ctx.createPattern(
      makeOffscreen(72, 72, (c, w, h) => {
        const g = c.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, '#0c1224');
        g.addColorStop(0.5, '#121a32');
        g.addColorStop(1, '#090e1d');
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);
        // Subtle reflected skyline sheen across glass panes
        c.fillStyle = 'rgba(56, 189, 248, 0.04)';
        c.beginPath(); c.moveTo(0, 14); c.lineTo(w, 0); c.lineTo(w, 16); c.lineTo(0, 30); c.closePath(); c.fill();
        // Vertical aluminum curtain-wall mullions & horizontal floor slab spandrels
        c.fillStyle = 'rgba(2, 6, 23, 0.72)';
        for (let x = 0; x < w; x += 18) c.fillRect(x, 0, 2, h);
        for (let y = 0; y < h; y += 24) {
          c.fillRect(0, y, w, 4);
          c.fillStyle = 'rgba(148, 163, 184, 0.09)';
          c.fillRect(0, y + 4, w, 1);
          c.fillStyle = 'rgba(2, 6, 23, 0.72)';
        }
      }),
      'repeat'
    );

    // 11. Weathered Verdigris Patina Copper Roof Sheets (Stage 11 Clocktower & Stage 15 Domes)
    tex.verdigrisCopper = ctx.createPattern(
      makeOffscreen(64, 64, (c, w, h) => {
        const g = c.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, '#136f63');
        g.addColorStop(0.38, '#22a699');
        g.addColorStop(0.7, '#0f5c52');
        g.addColorStop(1, '#093832');
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);
        // Natural mottled malachite/turquoise oxidation & dark bronze oxide streaks
        for (let i = 0; i < 42; i++) {
          const px = (i * 23) % w;
          const py = (i * 17) % h;
          c.fillStyle = i % 3 === 0 ? 'rgba(153, 246, 228, 0.14)' : (i % 2 === 0 ? 'rgba(6, 40, 35, 0.22)' : 'rgba(120, 72, 48, 0.13)');
          c.beginPath(); c.ellipse(px, py, 5 + (i % 4), 2.5 + (i % 3), (i % 5) * 0.3, 0, Math.PI * 2); c.fill();
        }
        // Standing-seam copper roof panels (vertical ribs + highlight + shadow)
        for (let x = 0; x < w; x += 16) {
          c.fillStyle = 'rgba(4, 26, 23, 0.55)';
          c.fillRect(x, 0, 2, h);
          c.fillStyle = 'rgba(167, 243, 208, 0.28)';
          c.fillRect(x + 2, 0, 1.2, h);
        }
        // Horizontal overlapping copper sheet seams with tiny copper rivets
        for (let y = 0; y < h; y += 21) {
          c.fillStyle = 'rgba(4, 24, 20, 0.48)';
          c.fillRect(0, y, w, 1.6);
          c.fillStyle = 'rgba(167, 243, 208, 0.22)';
          c.fillRect(0, y + 1.6, w, 1);
          for (let rx = 4; rx < w; rx += 8) {
            c.fillStyle = 'rgba(4, 24, 20, 0.55)';
            c.beginPath(); c.arc(rx, y + 3.8, 0.9, 0, Math.PI * 2); c.fill();
          }
        }
      }),
      'repeat'
    );

    // 12. Warm Sunlit Dressed Limestone & Travertine Masonry (Stage 15 Dawn Villa & Townhouse Facades)
    tex.warmLimestoneBrick = ctx.createPattern(
      makeOffscreen(96, 64, (c, w, h) => {
        c.fillStyle = '#d6bfa3';
        c.fillRect(0, 0, w, h);
        const rows = 4;
        const rh = h / rows;
        for (let r = 0; r < rows; r++) {
          const y = r * rh;
          const shift = (r % 2) * 24;
          for (let x = -24; x < w; x += 48) {
            const bx = x + shift;
            const shade = (r * 3 + Math.floor((x + 24) / 48)) % 3;
            c.fillStyle = shade === 0 ? '#ead7be' : shade === 1 ? '#dfc8ab' : '#d2b898';
            c.fillRect(bx + 1, y + 1, 46, rh - 2);
            // Sunlit top & right bevel + recessed mortar shadow
            c.fillStyle = 'rgba(255, 251, 235, 0.45)';
            c.fillRect(bx + 1, y + 1, 46, 1.4);
            c.fillStyle = 'rgba(92, 64, 40, 0.35)';
            c.fillRect(bx + 1, y + rh - 2.2, 46, 1.4);
            c.fillRect(bx + 1, y + 1, 1.4, rh - 2);
          }
        }
        // Fine natural travertine mineral pores & warm grain
        for (let i = 0; i < 95; i++) {
          c.fillStyle = i % 2 === 0 ? 'rgba(255, 251, 235, 0.18)' : 'rgba(120, 83, 55, 0.14)';
          c.fillRect((i * 29) % w, (i * 19) % h, 2, 1.2);
        }
      }),
      'repeat'
    );

    // 13. Layered Blue-Slate Mansard Roof Shingles with Scalloped Overlap & Dawn Sheen (Stage 15 Townhouses)
    tex.slateRoofTiles = ctx.createPattern(
      makeOffscreen(48, 36, (c, w, h) => {
        c.fillStyle = '#1e293b';
        c.fillRect(0, 0, w, h);
        const rows = 3;
        const rh = h / rows;
        for (let r = 0; r < rows; r++) {
          const y = r * rh;
          const off = (r % 2) * 12;
          for (let x = -12; x < w + 12; x += 24) {
            const g = c.createLinearGradient(x + off, y, x + off, y + rh);
            g.addColorStop(0, '#475569');
            g.addColorStop(0.6, '#334155');
            g.addColorStop(1, '#0f172a');
            c.fillStyle = g;
            c.strokeStyle = '#090d16';
            c.lineWidth = 1.1;
            c.beginPath();
            c.roundRect(x + off + 0.5, y, 23, rh + 1.5, [0, 0, 6, 6]);
            c.fill();
            c.stroke();
            c.fillStyle = 'rgba(226, 232, 240, 0.22)';
            c.fillRect(x + off + 3, y + rh - 2.5, 17, 1.1);
          }
        }
      }),
      'repeat'
    );

    tex.ready = true;
  }

  // =========================================================================
  // 1. DETAILED 3D SPINNING GOLD COIN (Embossed Rim, Paw Relief, Specular)
  // =========================================================================
  function drawCoin(ctx, x, y, time, phase = 0, value = 1) {
    const bob = Math.sin(time * 4.2 + phase) * 4.5;
    const spin = Math.cos(time * 3.8 + phase);
    const scaleX = Math.max(0.24, Math.abs(spin));
    const r = value > 1 ? 13 : 11;
    const cy = y + bob;

    ctx.save();
    ctx.translate(x, cy);

    const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, r + 9);
    halo.addColorStop(0, value > 1 ? 'rgba(56, 189, 248, 0.34)' : 'rgba(251, 191, 36, 0.34)');
    halo.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(0, 0, r + 9, 0, Math.PI * 2); ctx.fill();

    ctx.scale(scaleX, 1);
    ctx.fillStyle = value > 1 ? '#0369a1' : '#92400e';
    ctx.beginPath(); ctx.arc(2.2, 0, r, 0, Math.PI * 2); ctx.fill();

    const g = ctx.createLinearGradient(-r, -r, r, r);
    if (value > 1) {
      g.addColorStop(0, '#f0f9ff'); g.addColorStop(0.45, '#38bdf8'); g.addColorStop(1, '#0284c7');
    } else {
      g.addColorStop(0, '#fef9c3'); g.addColorStop(0.45, '#fbbf24'); g.addColorStop(1, '#d97706');
    }
    ctx.fillStyle = g;
    ctx.strokeStyle = value > 1 ? '#0c4a6e' : '#78350f';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = value > 1 ? '#e0f2fe' : '#fffbeb';
    ctx.beginPath();
    ctx.arc(0, 1.8, 2.7, 0, Math.PI * 2);
    ctx.arc(-2.6, -2.3, 1.3, 0, Math.PI * 2);
    ctx.arc(0, -3.4, 1.3, 0, Math.PI * 2);
    ctx.arc(2.6, -2.3, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Helper: Realistic Cratered Moon with Soft Atmospheric Corona
  function drawRealisticMoon(ctx, mx, my, radius, tint = '#fff8dc') {
    const corona = ctx.createRadialGradient(mx, my, radius * 0.6, mx, my, radius * 4.8);
    corona.addColorStop(0, 'rgba(255, 248, 220, 0.34)');
    corona.addColorStop(0.42, 'rgba(186, 230, 253, 0.11)');
    corona.addColorStop(1, 'rgba(186, 230, 253, 0)');
    ctx.fillStyle = corona;
    ctx.beginPath(); ctx.arc(mx, my, radius * 4.8, 0, Math.PI * 2); ctx.fill();

    const moonG = ctx.createRadialGradient(mx - radius * 0.3, my - radius * 0.3, radius * 0.1, mx, my, radius);
    moonG.addColorStop(0, '#ffffff');
    moonG.addColorStop(0.7, tint);
    moonG.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = moonG;
    ctx.beginPath(); ctx.arc(mx, my, radius, 0, Math.PI * 2); ctx.fill();

    // Subtle lunar Maria craters
    ctx.fillStyle = 'rgba(100, 116, 139, 0.18)';
    ctx.beginPath(); ctx.arc(mx - radius * 0.28, my - radius * 0.12, radius * 0.24, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + radius * 0.25, my + radius * 0.22, radius * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + radius * 0.14, my - radius * 0.32, radius * 0.12, 0, Math.PI * 2); ctx.fill();
  }

  // =========================================================================
  // 2. STAGE 9: GRAND NIGHT MUSEUM (Venetian Damask, Marble, Carved Exhibits)
  // =========================================================================
  function drawMuseumSkyAndHorizon(ctx, camX, w, h, time) {
    ensureTextures(ctx);

    // Textured Venetian Damask Museum Wall with Deep Vignette Depth
    ctx.save();
    ctx.translate(-(camX * 0.14) % 64, 0);
    ctx.fillStyle = tex.museumDamask;
    ctx.fillRect(-64, 0, w + 128, h);
    ctx.restore();

    const wallShade = ctx.createLinearGradient(0, 0, 0, h);
    wallShade.addColorStop(0, 'rgba(4, 7, 18, 0.72)');
    wallShade.addColorStop(0.28, 'rgba(10, 16, 36, 0.15)');
    wallShade.addColorStop(0.76, 'rgba(12, 10, 24, 0.35)');
    wallShade.addColorStop(1, 'rgba(6, 5, 14, 0.82)');
    ctx.fillStyle = wallShade;
    ctx.fillRect(0, 0, w, h);

    // Coffered Ceiling Cornice Beam across top
    const cornG = ctx.createLinearGradient(0, 0, 0, 56);
    cornG.addColorStop(0, '#090d1a'); cornG.addColorStop(0.65, '#1e2742'); cornG.addColorStop(1, '#0d1324');
    ctx.fillStyle = cornG; ctx.fillRect(0, 0, w, 54);
    ctx.fillStyle = '#d97706'; ctx.fillRect(0, 48, w, 4);
    ctx.fillStyle = '#fef08a'; ctx.fillRect(0, 49, w, 1.4);

    // Recessed Gothic Stone Cathedral Windows with Starry Sky & Volumetric Moonbeams
    const archSpan = 340;
    const farP = 0.14;
    const aStart = Math.floor((camX * farP) / archSpan) - 1;
    const aEnd = Math.ceil((camX * farP + w) / archSpan) + 1;

    for (let i = aStart; i <= aEnd; i++) {
      const ax = i * archSpan - camX * farP;
      const wx = ax + 82;
      const wy = 78;
      const ww = 166;
      const wh = 295;

      // Deep Chiseled Stone Window Reveal Frame
      ctx.save();
      ctx.translate(wx - 10, wy - 10);
      ctx.fillStyle = tex.ashlarStone;
      ctx.beginPath();
      ctx.arc(ww / 2 + 10, ww / 2 + 10, ww / 2 + 10, Math.PI, 0);
      ctx.lineTo(ww + 20, wh + 20); ctx.lineTo(0, wh + 20); ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#090d18'; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();

      // Night Sky Glass Pane
      const winSky = ctx.createLinearGradient(wx, wy, wx, wy + wh);
      winSky.addColorStop(0, '#061026'); winSky.addColorStop(0.65, '#132a4f'); winSky.addColorStop(1, '#1e3e66');
      ctx.fillStyle = winSky;
      ctx.beginPath();
      ctx.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0);
      ctx.lineTo(wx + ww, wy + wh); ctx.lineTo(wx, wy + wh); ctx.closePath(); ctx.fill();

      // Distant city spire & stars seen through glass
      if (Math.abs(i) % 3 === 1) {
        drawRealisticMoon(ctx, wx + ww * 0.65, wy + 72, 16, '#e0f2fe');
      }
      for (let s = 0; s < 9; s++) {
        const sx = wx + 18 + ((s * 37 + Math.abs(i) * 19) % (ww - 36));
        const sy = wy + 34 + ((s * 29) % 150);
        const alpha = 0.3 + 0.6 * Math.abs(Math.sin(time * 1.5 + s + i));
        ctx.fillStyle = `rgba(254, 249, 195, ${alpha})`;
        ctx.fillRect(sx, sy, 1.8, 1.8);
      }

      // Soft Volumetric Moonlight Shaft with Drifting Dust Specks
      const shaft = ctx.createLinearGradient(wx, wy + 60, wx + 200, h - 70);
      shaft.addColorStop(0, 'rgba(186, 230, 253, 0.17)');
      shaft.addColorStop(0.55, 'rgba(186, 230, 253, 0.06)');
      shaft.addColorStop(1, 'rgba(186, 230, 253, 0)');
      ctx.fillStyle = shaft;
      ctx.beginPath();
      ctx.moveTo(wx + 10, wy + 68); ctx.lineTo(wx + ww - 8, wy + 68);
      ctx.lineTo(wx + ww + 165, h - 60); ctx.lineTo(wx + 80, h - 60);
      ctx.closePath(); ctx.fill();

      // Ornate Cathedral Rose Tracery & Mullions
      ctx.strokeStyle = '#141d30'; ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh);
      ctx.moveTo(wx + ww * 0.25, wy + 34); ctx.lineTo(wx + ww * 0.25, wy + wh);
      ctx.moveTo(wx + ww * 0.75, wy + 34); ctx.lineTo(wx + ww * 0.75, wy + wh);
      ctx.moveTo(wx, wy + 135); ctx.lineTo(wx + ww, wy + 135);
      ctx.moveTo(wx, wy + 220); ctx.lineTo(wx + ww, wy + 220);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(wx + ww / 2, wy + 52, 24, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(wx + ww / 2, wy + 52, 12, 0, Math.PI * 2); ctx.stroke();

      // Rich Carved Mahogany Wainscoting + Brass Wall Sconces along lower wall
      const wainG = ctx.createLinearGradient(0, h - 205, 0, h - 70);
      wainG.addColorStop(0, '#361a14'); wainG.addColorStop(0.5, '#24110d'); wainG.addColorStop(1, '#140907');
      ctx.fillStyle = wainG; ctx.fillRect(ax, h - 205, archSpan, 135);
      ctx.fillStyle = '#b45309'; ctx.fillRect(ax, h - 207, archSpan, 4);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.24)'; ctx.lineWidth = 1.6;
      ctx.strokeRect(ax + 18, h - 190, archSpan / 2 - 28, 92);
      ctx.strokeRect(ax + archSpan / 2 + 10, h - 190, archSpan / 2 - 28, 92);

      // Warm Glowing Brass Wall Sconce between windows
      const scX = ax + 24;
      const scY = h - 265;
      const sGlow = ctx.createRadialGradient(scX, scY, 4, scX, scY, 62);
      sGlow.addColorStop(0, 'rgba(254, 215, 130, 0.45)');
      sGlow.addColorStop(1, 'rgba(254, 215, 130, 0)');
      ctx.fillStyle = sGlow; ctx.beginPath(); ctx.arc(scX, scY, 62, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d97706'; ctx.fillRect(scX - 3, scY + 4, 6, 18);
      ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.ellipse(scX, scY, 7, 10, 0, 0, Math.PI * 2); ctx.fill();
    }

    // HERO LANDMARK: Ultra-Detailed T-Rex Fossil Exhibit on Carved Mahogany Podium!
    const dinoX = 435 - camX * 0.34;
    if (dinoX > -360 && dinoX < w + 360) {
      ctx.save();
      ctx.translate(dinoX, h - 108);
      const sp = ctx.createLinearGradient(0, -400, 0, 20);
      sp.addColorStop(0, 'rgba(254, 240, 138, 0.26)'); sp.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = sp;
      ctx.beginPath(); ctx.moveTo(-42, -395); ctx.lineTo(42, -395); ctx.lineTo(235, 20); ctx.lineTo(-235, 20); ctx.closePath(); ctx.fill();

      // Stepped Mahogany & Veined Marble Podium + Brass Plaque
      const podG = ctx.createLinearGradient(0, -28, 0, 22);
      podG.addColorStop(0, '#692d1b'); podG.addColorStop(0.5, '#3b150c'); podG.addColorStop(1, '#1c0905');
      ctx.fillStyle = podG; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(-165, -26, 330, 44, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fef08a'; ctx.fillRect(-158, -28, 316, 3);
      ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.2;
      ctx.fillRect(-40, -15, 80, 18); ctx.strokeRect(-40, -15, 80, 18);
      ctx.fillStyle = '#451a03'; ctx.font = 'bold 8.5px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('TYRANNOSAURUS REX', 0, -3);

      // Steel museum armature mount rods
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-42, -26); ctx.lineTo(-42, -142); ctx.moveTo(46, -26); ctx.lineTo(46, -158); ctx.stroke();

      // Sculpted Ivory Skeleton with Warm Bone Shading & Dark Outlines
      ctx.strokeStyle = '#57534e'; ctx.lineWidth = 8.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-182, -108); ctx.quadraticCurveTo(-92, -162, 12, -160); ctx.quadraticCurveTo(70, -165, 108, -212); ctx.stroke();
      ctx.strokeStyle = '#f5eedc'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-182, -108); ctx.quadraticCurveTo(-92, -162, 12, -160); ctx.quadraticCurveTo(70, -165, 108, -212); ctx.stroke();

      // Articulated Ribcage (far shaded ribs + near highlighted ribs)
      for (let r = 0; r < 8; r++) {
        const rx = -28 + r * 14;
        const len = 56 - Math.abs(r - 3.5) * 6;
        ctx.strokeStyle = '#a8a29e'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(rx + 4, -156); ctx.quadraticCurveTo(rx - 10, -156 + len * 0.6, rx + 8, -156 + len); ctx.stroke();
        ctx.strokeStyle = '#f5eedc'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(rx, -158); ctx.quadraticCurveTo(rx - 12, -158 + len * 0.6, rx + 4, -158 + len); ctx.stroke();
      }
      // Sculpted Pelvis & Powerful Articulated Hind Legs + Claws
      ctx.fillStyle = '#e7dec8'; ctx.strokeStyle = '#57534e'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.ellipse(-18, -156, 26, 13, 0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#57534e'; ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(-26, -148); ctx.lineTo(-54, -90); ctx.lineTo(-30, -29);
      ctx.moveTo(4, -150); ctx.lineTo(24, -88); ctx.lineTo(42, -29);
      ctx.stroke();
      ctx.strokeStyle = '#f5eedc'; ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(-26, -148); ctx.lineTo(-54, -90); ctx.lineTo(-30, -29);
      ctx.moveTo(4, -150); ctx.lineTo(24, -88); ctx.lineTo(42, -29);
      ctx.stroke();

      // Detailed Sculpted T-Rex Skull with Fenestrae & Serrated Teeth
      ctx.save();
      ctx.translate(122, -220);
      ctx.rotate(-0.14);
      const skG = ctx.createLinearGradient(0, -20, 0, 24);
      skG.addColorStop(0, '#fffbeb'); skG.addColorStop(1, '#d6cfc2');
      ctx.fillStyle = skG; ctx.strokeStyle = '#44403c'; ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-26, -18); ctx.lineTo(38, -14); ctx.quadraticCurveTo(48, -4, 44, 6); ctx.lineTo(-20, 8); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#141322';
      ctx.beginPath(); ctx.ellipse(-7, -5, 9, 6.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(14, -4, 7, 4.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(32, -4, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e7dec8';
      ctx.beginPath(); ctx.moveTo(-16, 14); ctx.lineTo(38, 17); ctx.lineTo(33, 26); ctx.lineTo(-18, 22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      for (let t = 0; t < 6; t++) {
        ctx.beginPath(); ctx.moveTo(t * 7 - 2, 6); ctx.lineTo(t * 7 + 1, 13); ctx.lineTo(t * 7 + 3, 6); ctx.closePath(); ctx.fill();
      }
      ctx.restore();

      // Velvet Barrier Stanchions with Gold Finials
      ctx.fillStyle = '#fbbf24';
      for (const sx of [-174, -86, 86, 174]) {
        ctx.fillRect(sx - 2.5, -56, 5, 30);
        ctx.beginPath(); ctx.arc(sx, -58, 4.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = '#991b1b'; ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-174, -50); ctx.quadraticCurveTo(-130, -34, -86, -50);
      ctx.moveTo(86, -50); ctx.quadraticCurveTo(130, -34, 174, -50);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawMuseumMidground(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    const span = 480;
    const parallax = 0.42;
    const startIdx = Math.floor((camX * parallax) / span) - 1;
    const endIdx = Math.ceil((camX * parallax + w) / span) + 1;

    for (let i = startIdx; i <= endIdx; i++) {
      const cx = i * span - camX * parallax;

      // Sculpted Fluted Corinthian Marble Column with 3D Cylindrical Lighting & Acanthus Capital
      const colG = ctx.createLinearGradient(cx, 0, cx + 54, 0);
      colG.addColorStop(0, '#1e263d'); colG.addColorStop(0.24, '#64748b'); colG.addColorStop(0.48, '#cbd5e1');
      colG.addColorStop(0.75, '#475569'); colG.addColorStop(1, '#141a2b');
      ctx.fillStyle = colG; ctx.fillRect(cx, 54, 54, h - 122);
      // Recessed vertical flutes with light rim
      for (let fx = 8; fx < 48; fx += 9) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.34)'; ctx.fillRect(cx + fx, 68, 3.5, h - 148);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)'; ctx.fillRect(cx + fx + 3.5, 68, 1.2, h - 148);
      }
      // Sculpted Capital & Plinth
      ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
      ctx.fillRect(cx - 12, 42, 78, 13); ctx.strokeRect(cx - 12, 42, 78, 13);
      ctx.fillStyle = '#d97706'; ctx.fillRect(cx - 8, 55, 70, 5);
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(cx - 12, h - 80, 78, 18); ctx.strokeRect(cx - 12, h - 80, 78, 18);

      // Classical White Marble Bust Sculpture on Fluted Plinth beside every other column
      if (i % 2 !== 0) {
        const bx = cx + 88;
        const by = h - 102;
        ctx.fillStyle = '#64748b'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.4;
        ctx.fillRect(bx - 16, by - 64, 32, 64); ctx.strokeRect(bx - 16, by - 64, 32, 64);
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.ellipse(bx, by - 72, 15, 10, 0, Math.PI, 0); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx, by - 88, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }

      // Ornate Multi-Tiered Crystal Chandelier with Glowing Candles & Prism Reflections
      const chX = cx + 240;
      const sway = Math.sin(time * 1.1 + i) * 3;
      ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(chX, 50); ctx.lineTo(chX + sway, 92); ctx.stroke();
      ctx.save();
      ctx.translate(chX + sway, 92);
      const chGlow = ctx.createRadialGradient(0, 8, 8, 0, 8, 92);
      chGlow.addColorStop(0, 'rgba(254, 240, 138, 0.25)'); chGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = chGlow; ctx.beginPath(); ctx.arc(0, 8, 92, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-54, 18); ctx.quadraticCurveTo(0, 34, 54, 18);
      ctx.moveTo(-36, 4); ctx.quadraticCurveTo(0, 16, 36, 4);
      ctx.stroke();
      for (const kx of [-48, -24, 0, 24, 48]) {
        const ky = Math.abs(kx) > 25 ? 16 : 6;
        ctx.fillStyle = '#fffbeb'; ctx.fillRect(kx - 2, ky - 11, 4, 11);
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(kx, ky - 14, 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath(); ctx.moveTo(kx, ky + 4); ctx.lineTo(kx + 3, ky + 13); ctx.lineTo(kx - 3, ky + 13); ctx.closePath(); ctx.fill();
      }
      ctx.restore();

      // Baroque Gold-Framed Oil Masterpiece Painting
      if (Math.abs(i) > 0 || camX > 460) {
        const px = cx + 150;
        const py = 220;
        const pw = 182;
        const ph = 128;

        // Brass Gallery Picture Lamp + Soft Conical Wash
        ctx.fillStyle = '#d97706'; ctx.fillRect(px + pw / 2 - 26, py - 26, 52, 8);
        const cone = ctx.createLinearGradient(px + pw / 2, py - 18, px + pw / 2, py + ph + 40);
        cone.addColorStop(0, 'rgba(254, 240, 138, 0.26)'); cone.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = cone;
        ctx.beginPath(); ctx.moveTo(px + pw / 2 - 26, py - 18); ctx.lineTo(px + pw / 2 + 26, py - 18);
        ctx.lineTo(px + pw + 30, py + ph + 40); ctx.lineTo(px - 30, py + ph + 40); ctx.closePath(); ctx.fill();

        // Drop Shadow & Layered Sculpted Gold Baroque Frame
        ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(px - 8, py - 6, pw + 22, ph + 22);
        const frG = ctx.createLinearGradient(px - 12, py - 12, px + pw + 12, py + ph + 12);
        frG.addColorStop(0, '#fef08a'); frG.addColorStop(0.35, '#d97706'); frG.addColorStop(0.7, '#92400e'); frG.addColorStop(1, '#fbbf24');
        ctx.fillStyle = frG; ctx.fillRect(px - 12, py - 12, pw + 24, ph + 24);
        ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2; ctx.strokeRect(px - 12, py - 12, pw + 24, ph + 24);
        ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 1.2; ctx.strokeRect(px - 5, py - 5, pw + 10, ph + 10);

        const kind = Math.abs(i) % 3;
        if (kind === 0) {
          // Mona-Cat Renaissance Portrait with Chiaroscuro Landscape!
          const pG = ctx.createLinearGradient(px, py, px, py + ph);
          pG.addColorStop(0, '#3f6212'); pG.addColorStop(0.6, '#1e3a2f'); pG.addColorStop(1, '#14261c');
          ctx.fillStyle = pG; ctx.fillRect(px, py, pw, ph);
          // Renaissance robe & scarf
          ctx.fillStyle = '#1e1b4b'; ctx.beginPath(); ctx.ellipse(px + pw / 2, py + ph - 4, 48, 42, 0, Math.PI, 0); ctx.fill();
          ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(px + pw / 2, py + 56, 25, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fff8ee'; ctx.beginPath(); ctx.ellipse(px + pw / 2, py + 65, 13, 8, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#e47e28';
          ctx.beginPath();
          ctx.moveTo(px + pw / 2 - 21, py + 43); ctx.lineTo(px + pw / 2 - 15, py + 20); ctx.lineTo(px + pw / 2 - 2, py + 35);
          ctx.moveTo(px + pw / 2 + 21, py + 43); ctx.lineTo(px + pw / 2 + 15, py + 20); ctx.lineTo(px + pw / 2 + 2, py + 35);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.beginPath(); ctx.arc(px + pw / 2 - 9, py + 53, 3.2, 0, Math.PI * 2); ctx.arc(px + pw / 2 + 9, py + 53, 3.2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(px + pw / 2 - 10, py + 52, 1.1, 0, Math.PI * 2); ctx.arc(px + pw / 2 + 8, py + 52, 1.1, 0, Math.PI * 2); ctx.fill();
        } else if (kind === 1) {
          // Starry Night Masterpiece
          const sG = ctx.createLinearGradient(px, py, px, py + ph);
          sG.addColorStop(0, '#0f172a'); sG.addColorStop(0.5, '#1d4ed8'); sG.addColorStop(1, '#1e3a8a');
          ctx.fillStyle = sG; ctx.fillRect(px, py, pw, ph);
          ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.arc(px + 64, py + 46, 24, 0, Math.PI * 1.45); ctx.stroke();
          ctx.beginPath(); ctx.arc(px + 114, py + 54, 18, 0.5, Math.PI * 1.9); ctx.stroke();
          ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(px + 148, py + 32, 14, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.moveTo(px + 18, py + ph); ctx.quadraticCurveTo(px + 28, py + 26, px + 40, py + ph); ctx.fill();
        } else {
          // Moonlit Venetian Grand Canal
          const mG = ctx.createLinearGradient(px, py, px, py + ph);
          mG.addColorStop(0, '#1e1b4b'); mG.addColorStop(0.55, '#9d174d'); mG.addColorStop(1, '#1e1b4b');
          ctx.fillStyle = mG; ctx.fillRect(px, py, pw, ph);
          ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(px + 124, py + 38, 17, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#0f172a'; ctx.fillRect(px, py + 84, pw, 44);
          ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
          for (let r = 0; r < 5; r++) ctx.fillRect(px + 104 + r * 3, py + 90 + r * 6, 40 - r * 6, 2.5);
        }
      }
    }
  }

  // =========================================================================
  // 3. STAGE 10: FOGGY SUSPENSION BRIDGE (Riveted Art-Deco Steel & Misty Bay)
  // =========================================================================
  function drawBridgeSkyAndHorizon(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#040a18');
    sky.addColorStop(0.32, '#0d223b');
    sky.addColorStop(0.68, '#284a68');
    sky.addColorStop(1, '#0b1a2b');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

    for (let s = 0; s < 42; s++) {
      const sx = (s * 197) % w;
      const sy = (s * 43) % 185;
      const a = 0.2 + 0.55 * Math.abs(Math.sin(time * 1.2 + s));
      ctx.fillStyle = `rgba(224, 242, 254, ${a})`;
      ctx.fillRect(sx, sy, 1.8, 1.8);
    }

    const mx = 980 - camX * 0.02;
    drawRealisticMoon(ctx, mx, 102, 30, '#e0f2fe');

    // Soft Sculpted Night Clouds drifting behind the bridge
    for (let c = 0; c < 6; c++) {
      const cx = ((c * 280 - camX * 0.04 + time * 6) % (w + 360) + (w + 360)) % (w + 360) - 180;
      const cy = 115 + (c % 3) * 48;
      ctx.fillStyle = 'rgba(148, 163, 184, 0.14)';
      ctx.beginPath(); ctx.ellipse(cx, cy, 110, 22, 0, 0, Math.PI * 2); ctx.ellipse(cx - 48, cy + 8, 64, 15, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Two Parallax Fjord Mountain Ridges with Atmospheric Haze
    ctx.fillStyle = '#132d47';
    ctx.beginPath(); ctx.moveTo(0, h - 130);
    for (let x = 0; x <= w + 100; x += 90) {
      const mh = 110 + Math.sin((x + camX * 0.04) * 0.005) * 52 + Math.cos((x + camX * 0.04) * 0.013) * 24;
      ctx.lineTo(x, h - 130 - mh);
    }
    ctx.lineTo(w, h - 130); ctx.closePath(); ctx.fill();

    ctx.fillStyle = '#0b1e32';
    ctx.beginPath(); ctx.moveTo(0, h - 130);
    for (let x = 0; x <= w + 100; x += 80) {
      const mh = 65 + Math.sin((x + camX * 0.08) * 0.008) * 36 + Math.cos((x + camX * 0.08) * 0.02) * 16;
      ctx.lineTo(x, h - 130 - mh);
    }
    ctx.lineTo(w, h - 130); ctx.closePath(); ctx.fill();

    // Distant Bayfront City Skyline Lights twinkling across water
    for (let l = 0; l < 55; l++) {
      const lx = ((l * 79 - camX * 0.1) % (w + 100) + (w + 100)) % (w + 100) - 50;
      const ly = h - 144 - (l % 5) * 4;
      ctx.fillStyle = l % 3 === 0 ? 'rgba(254, 240, 138, 0.72)' : l % 3 === 1 ? 'rgba(251, 146, 60, 0.55)' : 'rgba(125, 211, 252, 0.5)';
      ctx.fillRect(lx, ly, 3.2, 2.2);
    }

    // Shimmering Deep Bay Water + Animated Moon Reflection + Passing Ferry
    const waterG = ctx.createLinearGradient(0, h - 140, 0, h);
    waterG.addColorStop(0, '#0a2238'); waterG.addColorStop(1, '#030b16');
    ctx.fillStyle = waterG; ctx.fillRect(0, h - 140, w, 140);
    for (let r = 0; r < 18; r++) {
      const rw = 96 - r * 3.8;
      const rx = mx - rw / 2 + Math.sin(time * 2.5 + r * 0.8) * 9;
      ctx.fillStyle = `rgba(224, 242, 254, ${0.26 - r * 0.012})`;
      ctx.fillRect(rx, h - 134 + r * 7.5, rw, 2.2);
    }
  }

  function drawBridgeMidground(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    const span = 840;
    const parallax = 0.25;
    const startIdx = Math.floor((camX * parallax) / span) - 1;
    const endIdx = Math.ceil((camX * parallax + w) / span) + 1;

    ctx.save();
    for (let i = startIdx; i <= endIdx; i++) {
      const tx = i * span - camX * parallax;
      const towerX = tx + 160;
      const topY = 56;

      // Twin Main Catenary Cables (shadow + crimson-steel + top moonlight specular)
      ctx.strokeStyle = '#4a110f'; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(towerX + 40, topY + 24); ctx.quadraticCurveTo(towerX + span / 2, 440, towerX + span + 18, topY + 24); ctx.stroke();
      ctx.strokeStyle = '#c94138'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(towerX + 40, topY + 22); ctx.quadraticCurveTo(towerX + span / 2, 438, towerX + span + 18, topY + 22); ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 220, 210, 0.35)'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(towerX + 40, topY + 20); ctx.quadraticCurveTo(towerX + span / 2, 436, towerX + span + 18, topY + 20); ctx.stroke();

      // Suspender Vertical Wires + Steel Collar Clamps
      for (let step = 1; step < 15; step++) {
        const t = step / 15;
        const cx = towerX + 40 + (span - 22) * t;
        const cy = (1 - t) * (1 - t) * (topY + 24) + 2 * (1 - t) * t * 440 + t * t * (topY + 24);
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.36)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx - 2.2, cy); ctx.lineTo(cx - 2.2, h - 110); ctx.moveTo(cx + 2.2, cy); ctx.lineTo(cx + 2.2, h - 110); ctx.stroke();
        ctx.fillStyle = '#991b1b'; ctx.strokeStyle = '#2d0a0a'; ctx.lineWidth = 1;
        ctx.fillRect(cx - 4.5, cy - 3.5, 9, 7); ctx.strokeRect(cx - 4.5, cy - 3.5, 9, 7);
      }

      // Massive Stepped Art-Deco Red-Iron Tower with Riveted Texture & Diagonal Steel Bracing
      const legG = ctx.createLinearGradient(towerX, 0, towerX + 80, 0);
      legG.addColorStop(0, '#6b1818'); legG.addColorStop(0.35, '#b91c1c'); legG.addColorStop(0.7, '#991b1b'); legG.addColorStop(1, '#4a1010');
      ctx.fillStyle = legG; ctx.strokeStyle = '#240707'; ctx.lineWidth = 1.8;
      ctx.fillRect(towerX, topY, 26, h - topY); ctx.strokeRect(towerX, topY, 26, h - topY);
      ctx.fillRect(towerX + 54, topY, 26, h - topY); ctx.strokeRect(towerX + 54, topY, 26, h - topY);
      // Stepped Art-Deco outer flanges
      ctx.fillRect(towerX - 8, topY + 115, 8, h - topY - 115); ctx.strokeRect(towerX - 8, topY + 115, 8, h - topY - 115);
      ctx.fillRect(towerX + 80, topY + 115, 8, h - topY - 115); ctx.strokeRect(towerX + 80, topY + 115, 8, h - topY - 115);
      ctx.fillRect(towerX - 14, topY + 265, 6, h - topY - 265);
      ctx.fillRect(towerX + 88, topY + 265, 6, h - topY - 265);

      // Ornate Stepped Cross-Struts + X-Bracing + Inspection Lights
      for (const by of [topY + 22, topY + 132, topY + 250, topY + 372]) {
        ctx.fillStyle = '#991b1b'; ctx.fillRect(towerX + 24, by, 32, 24); ctx.strokeRect(towerX + 24, by, 32, 24);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(towerX + 28, by + 4, 24, 4);
      }
      ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(towerX + 26, topY + 156); ctx.lineTo(towerX + 54, topY + 250);
      ctx.moveTo(towerX + 54, topY + 156); ctx.lineTo(towerX + 26, topY + 250);
      ctx.moveTo(towerX + 26, topY + 274); ctx.lineTo(towerX + 54, topY + 372);
      ctx.moveTo(towerX + 54, topY + 274); ctx.lineTo(towerX + 26, topY + 372);
      ctx.stroke();

      // Pulsing Red Aviation Warning Beacon
      if (Math.sin(time * 4.5 + i) > -0.15) {
        const bG = ctx.createRadialGradient(towerX + 40, topY - 10, 2, towerX + 40, topY - 10, 22);
        bG.addColorStop(0, 'rgba(255, 69, 58, 0.75)'); bG.addColorStop(1, 'rgba(255, 69, 58, 0)');
        ctx.fillStyle = bG; ctx.beginPath(); ctx.arc(towerX + 40, topY - 10, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff453a'; ctx.beginPath(); ctx.arc(towerX + 40, topY - 10, 4.5, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Lower Distant Highway Truss + Illuminated Lamp Posts + Moving Cars!
    ctx.fillStyle = '#182436'; ctx.fillRect(0, h - 186, w, 18);
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let tx = 0; tx < w; tx += 26) { ctx.moveTo(tx, h - 186); ctx.lineTo(tx + 13, h - 168); ctx.lineTo(tx + 26, h - 186); }
    ctx.stroke();
    for (let c = 0; c < 12; c++) {
      const carX = ((c * 175 + time * (c % 2 === 0 ? 82 : -72)) % (w + 180) + (w + 180)) % (w + 180) - 90;
      ctx.fillStyle = c % 2 === 0 ? 'rgba(254, 240, 138, 0.24)' : 'rgba(248, 113, 113, 0.24)';
      ctx.beginPath(); ctx.ellipse(carX + 4, h - 189, 13, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c % 2 === 0 ? '#fef08a' : '#f87171';
      ctx.fillRect(carX, h - 190, 8, 2.5);
    }

    // Multi-Layer Drifting River Mist Banks
    for (let f = 0; f < 7; f++) {
      const fx = ((f * 260 - camX * 0.18 + time * (10 + f * 2.5)) % (w + 420) + (w + 420)) % (w + 420) - 210;
      const fy = h - 172 + (f % 3) * 32;
      const mG = ctx.createRadialGradient(fx, fy, 15, fx, fy, 175);
      mG.addColorStop(0, 'rgba(186, 230, 253, 0.16)'); mG.addColorStop(1, 'rgba(186, 230, 253, 0)');
      ctx.fillStyle = mG; ctx.beginPath(); ctx.ellipse(fx, fy, 180, 42, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  // =========================================================================
  // 4. STAGE 11: OLD TOWN & ASTRONOMICAL CLOCKTOWER (Stone, Stucco, Shingles)
  // =========================================================================
  function drawOldTownSkyAndHorizon(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0c0a20');
    sky.addColorStop(0.42, '#21183c');
    sky.addColorStop(0.78, '#4a263a');
    sky.addColorStop(1, '#1f1224');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 48; i++) {
      const sx = (i * 183) % w;
      const sy = (i * 49) % 210;
      const a = 0.25 + 0.55 * Math.abs(Math.sin(time * 1.4 + i));
      ctx.fillStyle = `rgba(254, 243, 199, ${a})`;
      ctx.fillRect(sx, sy, 1.8, 1.8);
    }

    // Warm Crescent Moon with Soft Corona
    const moonX = 215 - camX * 0.02;
    const mGlow = ctx.createRadialGradient(moonX, 95, 16, moonX, 95, 110);
    mGlow.addColorStop(0, 'rgba(254, 240, 138, 0.26)'); mGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = mGlow; ctx.beginPath(); ctx.arc(moonX, 95, 110, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.arc(moonX, 95, 29, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#120e28'; ctx.beginPath(); ctx.arc(moonX + 11, 88, 25, 0, Math.PI * 2); ctx.fill();

    // Distant Medieval Hilltop Cathedral & Rooftop Silhouettes
    ctx.fillStyle = '#18112b';
    for (let s = 0; s < 10; s++) {
      const sx = s * 175 - ((camX * 0.07) % 175);
      const sh = 140 + ((s * 67) % 90);
      ctx.fillRect(sx, h - 120 - sh, 125, sh);
      ctx.beginPath(); ctx.moveTo(sx - 6, h - 120 - sh); ctx.lineTo(sx + 62, h - 120 - sh - 46); ctx.lineTo(sx + 131, h - 120 - sh); ctx.closePath(); ctx.fill();
    }

    // HERO LANDMARK: Intricate Ashlar-Stone Gothic Astronomical Clocktower!
    const towerX = 760 - camX * 0.09;
    ctx.save();
    ctx.translate(towerX, 0);
    // Textured Ashlar Stone Tower Body
    ctx.fillStyle = tex.ashlarStone;
    ctx.fillRect(-70, 132, 140, h - 132);
    // Depth side shading
    const tShade = ctx.createLinearGradient(-70, 0, 70, 0);
    tShade.addColorStop(0, 'rgba(0,0,0,0.45)'); tShade.addColorStop(0.5, 'rgba(255,255,255,0.05)'); tShade.addColorStop(1, 'rgba(0,0,0,0.52)');
    ctx.fillStyle = tShade; ctx.fillRect(-70, 132, 140, h - 132);
    ctx.strokeStyle = '#0e0a1a'; ctx.lineWidth = 2.2; ctx.strokeRect(-70, 132, 140, h - 132);

    // Textured Weathered Verdigris Copper-Patina Gothic Spire + Standing-Seam Ribs + Corner Pinnacles
    ctx.save();
    ctx.beginPath(); ctx.moveTo(-82, 136); ctx.lineTo(0, 18); ctx.lineTo(82, 136); ctx.closePath();
    ctx.fillStyle = tex.verdigrisCopper; ctx.fill();
    // 3D cylindrical directional shading across the copper spire
    const spShade = ctx.createLinearGradient(-82, 75, 82, 75);
    spShade.addColorStop(0, 'rgba(2, 24, 21, 0.55)');
    spShade.addColorStop(0.28, 'rgba(153, 246, 228, 0.25)');
    spShade.addColorStop(0.55, 'rgba(13, 148, 136, 0.08)');
    spShade.addColorStop(1, 'rgba(2, 18, 16, 0.65)');
    ctx.fillStyle = spShade; ctx.fill();
    ctx.clip();
    // Converging standing-seam copper ribs & horizontal riveted bands
    for (const rx of [-56, -34, -14, 10, 32, 54]) {
      ctx.strokeStyle = 'rgba(2, 22, 19, 0.62)'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(rx, 136); ctx.stroke();
      ctx.strokeStyle = 'rgba(167, 243, 208, 0.36)'; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(1, 18); ctx.lineTo(rx + 1.6, 136); ctx.stroke();
    }
    for (const by of [54, 82, 110]) {
      ctx.strokeStyle = 'rgba(4, 28, 24, 0.55)'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(-82, by); ctx.lineTo(82, by); ctx.stroke();
      ctx.strokeStyle = 'rgba(153, 246, 228, 0.28)'; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.moveTo(-82, by + 1.5); ctx.lineTo(82, by + 1.5); ctx.stroke();
    }
    // Warm bronze cornice flashing at base of copper roof
    ctx.fillStyle = '#78350f'; ctx.fillRect(-84, 132, 168, 4);
    ctx.restore();
    ctx.strokeStyle = '#042f2e'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(-82, 136); ctx.lineTo(0, 18); ctx.lineTo(82, 136); ctx.closePath(); ctx.stroke();

    // Side gothic pinnacles with textured verdigris copper caps & ribs
    for (const px of [-70, 70]) {
      ctx.save();
      ctx.beginPath(); ctx.moveTo(px - 13, 136); ctx.lineTo(px, 80); ctx.lineTo(px + 13, 136); ctx.closePath();
      ctx.fillStyle = tex.verdigrisCopper; ctx.fill();
      const pinG = ctx.createLinearGradient(px - 13, 110, px + 13, 110);
      pinG.addColorStop(0, 'rgba(2,22,19,0.45)'); pinG.addColorStop(0.35, 'rgba(167,243,208,0.3)'); pinG.addColorStop(1, 'rgba(2,20,17,0.6)');
      ctx.fillStyle = pinG; ctx.fill();
      ctx.strokeStyle = '#042f2e'; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.strokeStyle = 'rgba(167, 243, 208, 0.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, 80); ctx.lineTo(px - 3, 135); ctx.stroke();
      ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(px, 78, 2.3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // Ornamental Golden Spire Finial (pure architectural orb & tapered tip — zero religious symbols)
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(0, 4); ctx.stroke();
    ctx.fillStyle = '#fde047'; ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(0, 11, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 3, 2.2, 0, Math.PI * 2); ctx.fill();

    // Stone Belfry Arch with Swinging Bronze Bell
    ctx.fillStyle = '#0c0817';
    ctx.beginPath(); ctx.arc(0, 152, 24, Math.PI, 0); ctx.lineTo(24, 186); ctx.lineTo(-24, 186); ctx.closePath(); ctx.fill();
    ctx.save();
    ctx.translate(0, 146); ctx.rotate(Math.sin(time * 2.1) * 0.24);
    const bellG = ctx.createLinearGradient(-12, 0, 12, 24);
    bellG.addColorStop(0, '#fbbf24'); bellG.addColorStop(1, '#92400e');
    ctx.fillStyle = bellG;
    ctx.beginPath(); ctx.moveTo(-12, 24); ctx.quadraticCurveTo(-9, 4, 0, 2); ctx.quadraticCurveTo(9, 4, 12, 24); ctx.closePath(); ctx.fill();
    ctx.restore();

    // Prague-Style Illuminated Astronomical Clock Dial!
    const cY = 256;
    const dialHalo = ctx.createRadialGradient(0, cY, 26, 0, cY, 82);
    dialHalo.addColorStop(0, 'rgba(254, 240, 138, 0.34)'); dialHalo.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = dialHalo; ctx.beginPath(); ctx.arc(0, cY, 82, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#fffbeb'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 6.5;
    ctx.beginPath(); ctx.arc(0, cY, 50, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Cobalt astronomical zodiac inner circle
    ctx.fillStyle = '#1e3a8a'; ctx.beginPath(); ctx.arc(0, cY, 31, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(0, cY, 31, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(4, cY + 4, 19, 0, Math.PI * 2); ctx.stroke();
    // 12 Roman-style hour ticks
    ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2.4;
    for (let m = 0; m < 12; m++) {
      const ang = (m * Math.PI) / 6;
      ctx.beginPath(); ctx.moveTo(Math.cos(ang) * 35, cY + Math.sin(ang) * 35); ctx.lineTo(Math.cos(ang) * 44, cY + Math.sin(ang) * 44); ctx.stroke();
    }
    // Ornate Golden Sun & Moon Hands
    const minAng = time * 0.5 - Math.PI / 2;
    const hrAng = time * 0.08 - Math.PI / 2;
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, cY); ctx.lineTo(Math.cos(minAng) * 38, cY + Math.sin(minAng) * 38); ctx.stroke();
    ctx.strokeStyle = '#1e1b2e'; ctx.lineWidth = 3.6;
    ctx.beginPath(); ctx.moveTo(0, cY); ctx.lineTo(Math.cos(hrAng) * 26, cY + Math.sin(hrAng) * 26); ctx.stroke();
    ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(0, cY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawOldTownMidground(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    const span = 320;
    const parallax = 0.46;
    const startIdx = Math.floor((camX * parallax) / span) - 1;
    const endIdx = Math.ceil((camX * parallax + w) / span) + 1;

    for (let i = startIdx; i <= endIdx; i++) {
      const bx = i * span - camX * parallax;
      const bh = 325 + ((Math.abs(i) * 53) % 92);
      const topY = h - 90 - bh;
      const bw = 304;

      // Brick Chimney with Clay Pots & Drifting Hearth Smoke
      const chimX = bx + (i % 2 === 0 ? 48 : 222);
      ctx.fillStyle = '#63292b'; ctx.strokeStyle = '#240c0d'; ctx.lineWidth = 1.6;
      ctx.fillRect(chimX, topY - 82, 30, 50); ctx.strokeRect(chimX, topY - 82, 30, 50);
      ctx.fillStyle = '#8c3b32'; ctx.fillRect(chimX + 5, topY - 94, 8, 12); ctx.fillRect(chimX + 17, topY - 94, 8, 12);
      for (let p = 0; p < 4; p++) {
        const lift = (time * 18 + p * 18 + Math.abs(i) * 9) % 68;
        ctx.fillStyle = `rgba(226, 232, 240, ${0.18 * (1 - lift / 68)})`;
        ctx.beginPath(); ctx.arc(chimX + 15 + lift * 0.35, topY - 98 - lift, 8 + lift * 0.16, 0, Math.PI * 2); ctx.fill();
      }

      // Weathered Stucco Plaster Facade (`tex.stuccoPlaster`) + Side Shadow Depth
      ctx.save();
      ctx.translate(bx, topY);
      ctx.fillStyle = tex.stuccoPlaster;
      ctx.fillRect(0, 0, bw, bh);
      const wTint = i % 3 === 0 ? 'rgba(92, 56, 72, 0.25)' : i % 3 === 1 ? 'rgba(56, 62, 92, 0.25)' : 'rgba(104, 68, 52, 0.22)';
      ctx.fillStyle = wTint; ctx.fillRect(0, 0, bw, bh);
      // Cast roof eave drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.36)'; ctx.fillRect(0, 6, bw, 14);

      // Authentic Dark-Oak Half-Timber Framing with Pegged Joints
      ctx.fillStyle = '#24171f';
      ctx.fillRect(0, 0, bw, 8); ctx.fillRect(0, 106, bw, 8); ctx.fillRect(0, 214, bw, 8);
      ctx.fillRect(0, 0, 8, bh); ctx.fillRect(bw - 8, 0, 8, bh); ctx.fillRect(bw / 2 - 4, 0, 8, 214);
      ctx.strokeStyle = '#24171f'; ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(6, 108); ctx.lineTo(44, 6);
      ctx.moveTo(bw - 6, 108); ctx.lineTo(bw - 44, 6);
      ctx.stroke();

      // Scalloped Terracotta Shingle Roof Gable (`tex.terracottaShingles`)!
      ctx.save();
      ctx.beginPath(); ctx.moveTo(-16, 10); ctx.lineTo(bw / 2, -74); ctx.lineTo(bw + 16, 10); ctx.closePath();
      ctx.fillStyle = tex.terracottaShingles; ctx.fill();
      ctx.strokeStyle = '#240c0f'; ctx.lineWidth = 3; ctx.stroke();
      ctx.restore();

      // Recessed Arched Windows with Warm Cozy Interior Rooms & Overflowing Flower Boxes!
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
          const wx = 38 + c * 150;
          const wy = 26 + r * 106;
          // Recessed wooden shutter halves
          ctx.fillStyle = '#3b5249'; ctx.strokeStyle = '#14221d'; ctx.lineWidth = 1.4;
          ctx.fillRect(wx - 15, wy + 6, 13, 52); ctx.strokeRect(wx - 15, wy + 6, 13, 52);
          ctx.fillRect(wx + 74, wy + 6, 13, 52); ctx.strokeRect(wx + 74, wy + 6, 13, 52);

          // Glowing warm room interior gradient
          const rmG = ctx.createRadialGradient(wx + 36, wy + 22, 6, wx + 36, wy + 34, 46);
          rmG.addColorStop(0, '#fffbeb'); rmG.addColorStop(0.55, '#fbbf24'); rmG.addColorStop(1, '#b45309');
          ctx.fillStyle = rmG;
          ctx.beginPath(); ctx.roundRect(wx, wy, 72, 60, [18, 18, 2, 2]); ctx.fill();
          // Interior silhouette curtains & hanging pendant lamp
          ctx.fillStyle = 'rgba(124, 45, 18, 0.35)';
          ctx.fillRect(wx + 2, wy + 12, 12, 46); ctx.fillRect(wx + 58, wy + 12, 12, 46);
          ctx.fillStyle = '#78350f'; ctx.fillRect(wx + 35, wy, 2, 16);
          ctx.beginPath(); ctx.arc(wx + 36, wy + 18, 6, Math.PI, 0); ctx.fill();
          // Mullion crossbars
          ctx.strokeStyle = '#23151e'; ctx.lineWidth = 2.6;
          ctx.beginPath(); ctx.roundRect(wx, wy, 72, 60, [18, 18, 2, 2]); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(wx + 36, wy); ctx.lineTo(wx + 36, wy + 60); ctx.moveTo(wx, wy + 32); ctx.lineTo(wx + 72, wy + 32); ctx.stroke();

          // Carved Wood Window Flower Box + Red Geraniums & Trailing Ivy
          ctx.fillStyle = '#5c3417'; ctx.fillRect(wx - 5, wy + 57, 82, 11);
          ctx.fillStyle = '#15803d';
          for (let lx = 0; lx < 74; lx += 10) { ctx.beginPath(); ctx.arc(wx + lx, wy + 54, 6, 0, Math.PI * 2); ctx.fill(); }
          ctx.fillStyle = c === 0 ? '#f43f5e' : '#facc15';
          for (let fl = 6; fl < 68; fl += 12) { ctx.beginPath(); ctx.arc(wx + fl, wy + 52, 3.2, 0, Math.PI * 2); ctx.fill(); }
        }
      }

      // Cozy Ground-Floor Bakery Display Window + Scalloped Striped Awning + Hanging Wrought-Iron Sign
      const sfY = bh - 88;
      const bWinG = ctx.createLinearGradient(0, sfY + 18, 0, sfY + 84);
      bWinG.addColorStop(0, '#fef08a'); bWinG.addColorStop(1, '#d97706');
      ctx.fillStyle = bWinG; ctx.fillRect(28, sfY + 18, bw - 56, 64);
      ctx.strokeStyle = '#3b1d0f'; ctx.lineWidth = 2.8; ctx.strokeRect(28, sfY + 18, bw - 56, 64);
      // Little golden loaves & pastries silhouetted on bakery shelf!
      ctx.fillStyle = '#92400e';
      for (let loaf = 46; loaf < bw - 60; loaf += 36) {
        ctx.beginPath(); ctx.ellipse(loaf, sfY + 66, 12, 7, 0, Math.PI, 0); ctx.fill();
      }
      // Scalloped red & cream bakery awning
      for (let st = 0; st < 8; st++) {
        ctx.fillStyle = st % 2 === 0 ? '#b91c1c' : '#fef3c7';
        ctx.fillRect(20 + st * 33, sfY, 33, 20);
        ctx.beginPath(); ctx.arc(36.5 + st * 33, sfY + 20, 16.5, 0, Math.PI); ctx.fill();
      }

      // Warm Festival String Lights draped between houses
      ctx.strokeStyle = 'rgba(20, 14, 28, 0.8)'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(bw - 8, 110); ctx.quadraticCurveTo(bw + 8, 144, span + 8, 110); ctx.stroke();
      for (let b = 1; b <= 3; b++) {
        const lx = bw - 8 + b * 12;
        const ly = 116 + (b === 2 ? 12 : 4);
        ctx.fillStyle = 'rgba(254, 240, 138, 0.32)'; ctx.beginPath(); ctx.arc(lx, ly, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(lx, ly, 3.4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  }

  // =========================================================================
  // 5. STAGE 12: STORMY HARBOR FREIGHTERS (Storm Clouds, Lighthouse, Riveted Hulls)
  // =========================================================================
  function drawHarborStormSkyAndSea(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    const lCycle = time % 5.8;
    const flash = (lCycle > 0.1 && lCycle < 0.2) || (lCycle > 0.25 && lCycle < 0.32) ? 0.4 : 0;

    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, flash > 0 ? '#2b436b' : '#030812');
    sky.addColorStop(0.48, flash > 0 ? '#3f5d8a' : '#0a172b');
    sky.addColorStop(1, '#0f2840');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

    // Sculpted Towering Cumulonimbus Storm Clouds with Silver Lightning Rims
    for (let c = 0; c < 10; c++) {
      const cx = ((c * 205 - camX * 0.05 + time * 5) % (w + 280) + (w + 280)) % (w + 280) - 140;
      const cy = 70 + (c % 3) * 26;
      ctx.fillStyle = flash > 0 ? 'rgba(186, 230, 253, 0.28)' : 'rgba(15, 25, 45, 0.72)';
      ctx.beginPath(); ctx.arc(cx, cy, 88, 0, Math.PI * 2); ctx.arc(cx + 58, cy + 12, 64, 0, Math.PI * 2); ctx.fill();
    }

    if (flash > 0) {
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.95)'; ctx.lineWidth = 3;
      const lx = 260 + ((Math.floor(time / 5.8) * 317) % (w - 420));
      ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx - 22, 82); ctx.lineTo(lx + 16, 152); ctx.lineTo(lx - 20, 275); ctx.moveTo(lx + 16, 152); ctx.lineTo(lx + 48, 212); ctx.stroke();
    }

    // Weathered Stone Lighthouse on Cliff Headland + Fresnel Rotating Beam
    const lhX = 210 - camX * 0.06;
    const lhY = h - 140;
    ctx.save();
    ctx.fillStyle = '#0c1526';
    ctx.beginPath(); ctx.moveTo(lhX - 74, lhY + 12); ctx.lineTo(lhX - 32, lhY - 28); ctx.lineTo(lhX + 44, lhY - 24); ctx.lineTo(lhX + 82, lhY + 12); ctx.closePath(); ctx.fill();
    for (let st = 0; st < 5; st++) {
      ctx.fillStyle = st % 2 === 0 ? '#e2e8f0' : '#b91c1c';
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.2;
      const sw = 28 - st * 1.8;
      ctx.fillRect(lhX - sw / 2, lhY - 26 - (st + 1) * 25, sw, 25);
      ctx.strokeRect(lhX - sw / 2, lhY - 26 - (st + 1) * 25, sw, 25);
    }
    // Iron gallery walkway & glass lantern house
    ctx.fillStyle = '#1e293b'; ctx.fillRect(lhX - 15, lhY - 154, 30, 6);
    ctx.fillStyle = '#fef08a'; ctx.fillRect(lhX - 9, lhY - 170, 18, 16);
    ctx.fillStyle = '#991b1b';
    ctx.beginPath(); ctx.moveTo(lhX - 14, lhY - 170); ctx.lineTo(lhX, lhY - 188); ctx.lineTo(lhX + 14, lhY - 170); ctx.closePath(); ctx.fill();
    ctx.translate(lhX, lhY - 162);
    ctx.rotate(Math.sin(time * 0.85) * 0.26);
    const beamG = ctx.createLinearGradient(0, 0, 580, 0);
    beamG.addColorStop(0, 'rgba(254, 240, 138, 0.36)'); beamG.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = beamG;
    ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(580, -80); ctx.lineTo(580, 80); ctx.lineTo(0, 6); ctx.closePath(); ctx.fill();
    ctx.restore();

    // Rolling Multi-Layer Storm Sea with Whitecap Foam Crests
    const seaG = ctx.createLinearGradient(0, h - 142, 0, h);
    seaG.addColorStop(0, '#0a243d'); seaG.addColorStop(1, '#020b15');
    ctx.fillStyle = seaG; ctx.fillRect(0, h - 142, w, 142);
    for (let r = 0; r < 7; r++) {
      const y = h - 126 + r * 18;
      ctx.strokeStyle = r % 2 === 0 ? 'rgba(224, 242, 254, 0.34)' : 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 34) {
        const wy = y + Math.sin(x * 0.032 + time * 4.8 + r * 1.3) * 5.5;
        if (x === 0) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }
  }

  function drawHarborStormMidground(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    const span = 840;
    const parallax = 0.3;
    const startIdx = Math.floor((camX * parallax) / span) - 1;
    const endIdx = Math.ceil((camX * parallax + w) / span) + 1;

    for (let i = startIdx; i <= endIdx; i++) {
      const sx = i * span - camX * parallax;
      const bob = Math.sin(time * 2.1 + i) * 3.5;
      const hullY = h - 220 + bob;

      // Towering Steel Lattice Port Gantry Crane
      const crX = sx + 220;
      ctx.strokeStyle = '#a16207'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(crX, h - 90); ctx.lineTo(crX + 28, 92); ctx.moveTo(crX + 116, h - 90); ctx.lineTo(crX + 88, 92); ctx.moveTo(crX - 85, 126); ctx.lineTo(crX + 275, 126); ctx.stroke();
      ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(crX + 28, 92); ctx.lineTo(crX + 260, 126); ctx.moveTo(crX + 88, 92); ctx.lineTo(crX - 75, 126); ctx.stroke();

      // Massive Riveted Steel Freighter Hull (`tex.rivetedSteel` + Flared Bow + Plimsoll Waterline + Anchor Chain)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sx + 34, hullY + 96);
      ctx.quadraticCurveTo(sx + 10, hullY + 56, sx - 6, hullY + 12);
      ctx.lineTo(sx + 575, hullY + 16);
      ctx.lineTo(sx + 538, hullY + 96);
      ctx.closePath();
      ctx.fillStyle = tex.rivetedSteel; ctx.fill();
      ctx.fillStyle = 'rgba(10, 18, 34, 0.45)'; ctx.fill();
      ctx.strokeStyle = '#020617'; ctx.lineWidth = 2.4; ctx.stroke();
      // Anti-fouling crimson lower hull & white load-line stripe
      ctx.fillStyle = '#991b1b'; ctx.fillRect(sx + 26, hullY + 76, 514, 16);
      ctx.fillStyle = '#e2e8f0'; ctx.fillRect(sx + 24, hullY + 73, 518, 2.5);
      ctx.fillStyle = '#e2e8f0'; ctx.fillRect(sx + 14, hullY + 28, 544, 3);
      // Forecastle deck bulwark & anchor hawsehole with iron anchor chain
      ctx.fillStyle = '#1e293b'; ctx.fillRect(sx + 22, hullY + 38, 12, 8);
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(sx + 28, hullY + 44); ctx.lineTo(sx + 20, hullY + 98); ctx.stroke();
      // Glowing portholes + warm water reflections shimmering below the hull
      for (let px = sx + 54; px < sx + 510; px += 44) {
        ctx.fillStyle = '#fde68a';
        ctx.beginPath(); ctx.arc(px, hullY + 48, 3.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(253, 224, 71, 0.16)';
        ctx.fillRect(px - 4, hullY + 98 + Math.sin(time * 4 + px) * 2, 8, 3.5);
      }
      ctx.restore();

      // 4 Tiers of Individually Shaded Ribbed Shipping Containers with Markings
      const cols = ['#b91c1c', '#1d4ed8', '#047857', '#d97706', '#334155'];
      for (let row = 0; row < 4; row++) {
        for (let c = 0; c < 6; c++) {
          if (row === 3 && (c + i) % 2 === 0) continue;
          const cx = sx + 58 + c * 62;
          const cy = hullY - 6 - row * 26;
          ctx.fillStyle = cols[(Math.abs(i) + row * 2 + c) % cols.length];
          ctx.strokeStyle = '#090d16'; ctx.lineWidth = 1.5;
          ctx.fillRect(cx, cy, 58, 24); ctx.strokeRect(cx, cy, 58, 24);
          ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(cx + 1, cy + 1, 56, 2.5);
          ctx.fillStyle = 'rgba(0,0,0,0.24)';
          for (let r = 8; r < 52; r += 8) ctx.fillRect(cx + r, cy + 3, 2, 19);
        }
      }

      // Multi-Deck Illuminated Command Bridge + Lifeboat on Davits + Radar Array + Smoking Funnel
      ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.8;
      ctx.fillRect(sx + 448, hullY - 126, 86, 142); ctx.strokeRect(sx + 448, hullY - 126, 86, 142);
      // Deck railings & bridge wings
      ctx.fillStyle = '#cbd5e1';
      for (const dy of [-86, -54, -22]) {
        ctx.fillRect(sx + 444, hullY + dy, 94, 4);
      }
      ctx.fillStyle = '#0f172a'; ctx.fillRect(sx + 454, hullY - 114, 74, 16);
      ctx.fillStyle = '#fef08a';
      for (let wx = 0; wx < 4; wx++) ctx.fillRect(sx + 458 + wx * 17, hullY - 111, 13, 10);
      // High-visibility orange enclosed lifeboat mounted on steel davits
      ctx.fillStyle = '#ea580c'; ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.ellipse(sx + 468, hullY - 36, 16, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fde047'; ctx.fillRect(sx + 458, hullY - 38, 20, 2.2);
      // Rotating radar scanner mast atop bridge roof
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx + 472, hullY - 126); ctx.lineTo(sx + 472, hullY - 152); ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      const radW = Math.max(4, Math.abs(Math.cos(time * 3.2 + i)) * 16);
      ctx.fillRect(sx + 472 - radW / 2, hullY - 154, radW, 3.5);
      // Red & black exhaust funnel with drifting steam plume
      ctx.fillStyle = '#dc2626'; ctx.fillRect(sx + 496, hullY - 166, 26, 40);
      ctx.fillStyle = '#0f172a'; ctx.fillRect(sx + 496, hullY - 166, 26, 10);
      for (let sp = 0; sp < 3; sp++) {
        const lift = (time * 22 + sp * 14) % 42;
        ctx.fillStyle = `rgba(203, 213, 225, ${0.22 * (1 - lift / 42)})`;
        ctx.beginPath(); ctx.arc(sx + 509 + lift * 0.6, hullY - 170 - lift * 0.7, 7 + lift * 0.2, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Layered Storm Rain Streaks
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.3)'; ctx.lineWidth = 1.3;
    for (let r = 0; r < 76; r++) {
      const rx = ((r * 139 + time * 245) % (w + 140)) - 70;
      const ry = ((r * 97 + time * 840) % (h + 80)) - 40;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 13, ry + 25); ctx.stroke();
    }
  }

  // =========================================================================
  // 6. STAGE 13: ROYAL BOTANICAL GREENHOUSE (Crystal Palace Glass & Fountains)
  // =========================================================================
  function drawGreenhouseSkyAndHorizon(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    // Rich Starlit Emerald-Indigo Night Sky Outside the Crystal Conservatory Dome
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#020b14');
    sky.addColorStop(0.32, '#061f29');
    sky.addColorStop(0.68, '#0c3b38');
    sky.addColorStop(1, '#041917');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

    // Twinkling stars visible through the high upper glass skylight
    for (let s = 0; s < 36; s++) {
      const sx = ((s * 97 - camX * 0.015) % w + w) % w;
      const sy = 14 + ((s * 43) % 165);
      const tw = 0.35 + 0.55 * Math.sin(time * 2.4 + s);
      ctx.fillStyle = `rgba(209, 250, 229, ${tw})`;
      ctx.beginPath(); ctx.arc(sx, sy, s % 4 === 0 ? 1.6 : 1.0, 0, Math.PI * 2); ctx.fill();
    }

    // Luminous Moon glowing behind the vaulted conservatory glass roof + diagonal volumetric moonbeams
    const moonX = 780 - camX * 0.03;
    drawRealisticMoon(ctx, moonX, 96, 34, '#d1fae5');
    ctx.save();
    for (let b = 0; b < 3; b++) {
      const bx = moonX - 30 + b * 65;
      const beamG = ctx.createLinearGradient(bx, 70, bx - 210, h - 80);
      beamG.addColorStop(0, 'rgba(167, 243, 208, 0.11)');
      beamG.addColorStop(0.6, 'rgba(110, 231, 183, 0.04)');
      beamG.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = beamG;
      ctx.beginPath();
      ctx.moveTo(bx - 18, 70); ctx.lineTo(bx + 26, 70);
      ctx.lineTo(bx - 140, h - 60); ctx.lineTo(bx - 235, h - 60);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();

    // Distant Misty Tropical Botanical Hills & Shimmering Waterfall Cliffs Seen Through the Glass
    ctx.fillStyle = 'rgba(4, 34, 31, 0.78)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 60; x += 60) {
      const wx = x + camX * 0.06;
      const hy = h - 185 - Math.sin(wx * 0.0045) * 42 - Math.cos(wx * 0.011) * 22;
      ctx.lineTo(x, hy);
    }
    ctx.lineTo(w, h); ctx.closePath(); ctx.fill();

    // Soaring Victorian Crystal-Palace Arched Glass Conservatory Vault (Curved Ribbed Mullions & Skylight Transoms — No Ugly Flat Grid!)
    const span = 340;
    const parallax = 0.18;
    const startIdx = Math.floor((camX * parallax) / span) - 1;
    const endIdx = Math.ceil((camX * parallax + w) / span) + 1;

    ctx.save();
    for (let i = startIdx; i <= endIdx; i++) {
      const ax = i * span - camX * parallax;
      const cx = ax + span / 2;
      const archY = 236;
      const r = span / 2;

      // Translucent curved glass bay tint with diagonal specular sheen
      const glassG = ctx.createLinearGradient(ax, archY - r, ax + span, h);
      glassG.addColorStop(0, 'rgba(167, 243, 208, 0.11)');
      glassG.addColorStop(0.45, 'rgba(20, 83, 74, 0.14)');
      glassG.addColorStop(1, 'rgba(6, 36, 31, 0.25)');
      ctx.fillStyle = glassG;
      ctx.beginPath(); ctx.arc(cx, archY, r, Math.PI, 0); ctx.lineTo(ax + span, h); ctx.lineTo(ax, h); ctx.closePath(); ctx.fill();

      // Diagonal glass reflection highlight inside each bay
      ctx.fillStyle = 'rgba(209, 250, 229, 0.045)';
      ctx.beginPath();
      ctx.moveTo(ax + 42, archY - r * 0.65); ctx.lineTo(ax + 96, archY - r * 0.85);
      ctx.lineTo(ax + 38, h - 110); ctx.lineTo(ax + 8, h - 110);
      ctx.closePath(); ctx.fill();

      // Delicate Curved Radial Skylight Glazing Bars inside the Dome Arch
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.16)'; ctx.lineWidth = 1.2;
      for (const ringR of [r * 0.48, r * 0.74]) {
        ctx.beginPath(); ctx.arc(cx, archY, ringR, Math.PI, 0); ctx.stroke();
      }
      for (let a = 1; a < 6; a++) {
        const ang = Math.PI + (a * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * (r * 0.22), archY + Math.sin(ang) * (r * 0.22));
        ctx.lineTo(cx + Math.cos(ang) * (r - 16), archY + Math.sin(ang) * (r - 16));
        ctx.stroke();
      }
      // Tall Arched Lower Conservatory Window Mullions (clean vertical & arched panes instead of tiny squares)
      for (const subX of [ax + span * 0.25, ax + span * 0.5, ax + span * 0.75]) {
        ctx.beginPath(); ctx.moveTo(subX, archY); ctx.lineTo(subX, h); ctx.stroke();
      }
      for (const ty of [archY + 55, archY + 125]) {
        ctx.beginPath(); ctx.moveTo(ax + 8, ty); ctx.lineTo(ax + span - 8, ty); ctx.stroke();
      }

      // Double Wrought-Iron Conservatory Arch Rib + Decorative Victorian Rosette Spandrels
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.38)'; ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.arc(cx, archY, r, Math.PI, 0); ctx.stroke();
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, archY, r - 16, Math.PI, 0); ctx.stroke();
      for (let a = 0.28; a <= Math.PI - 0.28; a += 0.34) {
        ctx.beginPath();
        ctx.arc(cx - Math.cos(a) * (r - 8), archY - Math.sin(a) * (r - 8), 6.2, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Fluted Cast-Iron Conservatory Pillar with Corinthian Capital & Warm Hanging Botanical Globe Lantern
      const pilG = ctx.createLinearGradient(ax - 9, 0, ax + 9, 0);
      pilG.addColorStop(0, '#041b17'); pilG.addColorStop(0.5, '#1b6b63'); pilG.addColorStop(1, '#031310');
      ctx.fillStyle = pilG;
      ctx.fillRect(ax - 8, archY, 16, h - archY);
      ctx.fillStyle = '#0d9488';
      ctx.fillRect(ax - 13, archY - 6, 26, 8);
      ctx.fillRect(ax - 11, archY + 4, 22, 5);

      // Warm Amber Victorian Globe Lantern suspended from the arch keystone
      const lanY = archY - r + 26;
      ctx.strokeStyle = '#0f766e'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(cx, archY - r + 16); ctx.lineTo(cx, lanY); ctx.stroke();
      const lGlow = ctx.createRadialGradient(cx, lanY + 7, 2, cx, lanY + 7, 32);
      lGlow.addColorStop(0, 'rgba(254, 240, 138, 0.38)'); lGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = lGlow; ctx.beginPath(); ctx.arc(cx, lanY + 7, 32, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(cx, lanY + 7, 5.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function drawGreenhouseMidground(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    const span = 420;
    const parallax = 0.42;
    const startIdx = Math.floor((camX * parallax) / span) - 1;
    const endIdx = Math.ceil((camX * parallax + w) / span) + 1;

    // Helper: True Photorealistic Pinnate Tropical Palm Tree (Ringed Diamond-Scarred Trunk + Green Crownshaft + 9 Curved Rachis Stems with 18 Individual Drooping Pinnate Leaflets Each!)
    const drawRealisticPalmTree = (baseX, baseY, topX, topY, scale, seed) => {
      ctx.save();
      const ctrlX = (baseX + topX) * 0.5 - 22 * scale;
      const ctrlY = (baseY + topY) * 0.5;

      // 1. Segmented Ringed Palm Trunk with 3D Cylindrical Bark Shading & Leaf-Scar Chevrons
      const steps = 22;
      for (let s = 0; s < steps; s++) {
        const t0 = s / steps;
        const t1 = (s + 1) / steps;
        const x0 = (1 - t0) * (1 - t0) * baseX + 2 * (1 - t0) * t0 * ctrlX + t0 * t0 * topX;
        const y0 = (1 - t0) * (1 - t0) * baseY + 2 * (1 - t0) * t0 * ctrlY + t0 * t0 * topY;
        const x1 = (1 - t1) * (1 - t1) * baseX + 2 * (1 - t1) * t1 * ctrlX + t1 * t1 * topX;
        const y1 = (1 - t1) * (1 - t1) * baseY + 2 * (1 - t1) * t1 * ctrlY + t1 * t1 * topY;
        const w0 = (13.5 - t0 * 5.2) * scale;
        const w1 = (13.5 - t1 * 5.2) * scale;

        const trkG = ctx.createLinearGradient(x0 - w0, y0, x0 + w0, y0);
        trkG.addColorStop(0, '#1c140d');
        trkG.addColorStop(0.38, '#5c432c');
        trkG.addColorStop(0.68, '#78583a');
        trkG.addColorStop(1, '#261b12');
        ctx.fillStyle = trkG;
        ctx.beginPath();
        ctx.moveTo(x0 - w0, y0 + 1); ctx.lineTo(x1 - w1, y1 - 1);
        ctx.lineTo(x1 + w1, y1 - 1); ctx.lineTo(x0 + w0, y0 + 1);
        ctx.closePath(); ctx.fill();

        // Horizontal annular leaf-scar ring + diamond bark notch
        ctx.strokeStyle = 'rgba(214, 197, 179, 0.25)'; ctx.lineWidth = 1.2 * scale;
        ctx.beginPath(); ctx.moveTo(x1 - w1 * 0.92, y1); ctx.quadraticCurveTo(x1, y1 + 2.2 * scale, x1 + w1 * 0.92, y1); ctx.stroke();
        ctx.strokeStyle = 'rgba(15, 10, 6, 0.45)'; ctx.lineWidth = 1.1 * scale;
        ctx.beginPath(); ctx.moveTo(x1 - w1 * 0.5, y1 + 3 * scale); ctx.lineTo(x1, y1 + 1 * scale); ctx.lineTo(x1 + w1 * 0.5, y1 + 3 * scale); ctx.stroke();
      }

      // 2. Smooth Emerald Crownshaft & Fibrous Burlap Leaf Bases + Hanging Golden Dates/Coconuts
      const csG = ctx.createLinearGradient(topX - 8 * scale, topY, topX + 8 * scale, topY + 26 * scale);
      csG.addColorStop(0, '#15803d'); csG.addColorStop(0.5, '#22c55e'); csG.addColorStop(1, '#14532d');
      ctx.fillStyle = csG;
      ctx.beginPath();
      ctx.moveTo(topX - 8.5 * scale, topY + 24 * scale);
      ctx.quadraticCurveTo(topX - 6.5 * scale, topY + 4 * scale, topX - 5 * scale, topY - 4 * scale);
      ctx.lineTo(topX + 5 * scale, topY - 4 * scale);
      ctx.quadraticCurveTo(topX + 6.5 * scale, topY + 4 * scale, topX + 8.5 * scale, topY + 24 * scale);
      ctx.closePath(); ctx.fill();

      // Cluster of coconuts/date drupes nestled under the crown fronds
      for (const [cx, cy] of [[-7, 4], [0, 6], [7, 3], [-3, 10], [4, 9]]) {
        const cg = ctx.createRadialGradient(topX + (cx - 1.5) * scale, topY + (cy - 1.5) * scale, 0.5, topX + cx * scale, topY + cy * scale, 5.2 * scale);
        cg.addColorStop(0, '#d97706'); cg.addColorStop(0.6, '#78350f'); cg.addColorStop(1, '#291509');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(topX + cx * scale, topY + cy * scale, 4.6 * scale, 0, Math.PI * 2); ctx.fill();
      }

      // 3. 9 Sweeping Curved Feather-Palm Fronds (Back Layer First, Front Layer Second) with 18 Individual Drooping Pinnate Leaflets Each!
      const fronds = [
        // Back shadowed fronds
        { dir: -1, ang: -0.15, len: 128, drop: 48, dark: true },
        { dir: -1, ang: -0.68, len: 118, drop: 32, dark: true },
        { dir:  1, ang: -0.18, len: 126, drop: 46, dark: true },
        { dir:  1, ang: -0.72, len: 116, drop: 30, dark: true },
        // Front sunlit fronds
        { dir: -1, ang:  0.16, len: 136, drop: 64, dark: false },
        { dir: -1, ang: -0.42, len: 132, drop: 44, dark: false },
        { dir:  1, ang:  0.14, len: 136, drop: 64, dark: false },
        { dir:  1, ang: -0.44, len: 130, drop: 42, dark: false },
        { dir:  1, ang: -1.12, len: 98,  drop: 18, dark: false },
      ];

      for (let f = 0; f < fronds.length; f++) {
        const fd = fronds[f];
        const sway = Math.sin(time * 1.45 + seed * 1.7 + f * 0.9) * 5.5 * scale;
        const endX = topX + fd.dir * Math.cos(fd.ang) * fd.len * scale;
        const endY = topY + Math.sin(fd.ang) * fd.len * 0.65 * scale + fd.drop * scale + sway;
        const midX = topX + fd.dir * Math.cos(fd.ang - 0.25) * (fd.len * 0.56) * scale;
        const midY = topY + Math.sin(fd.ang - 0.35) * (fd.len * 0.55) * scale - 18 * scale + sway * 0.5;

        // Draw 18 individual tapering drooping pinnate leaflets along the curved rachis stem
        const numLeaflets = 18;
        for (let l = 2; l <= numLeaflets; l++) {
          const u = l / numLeaflets;
          const rx = (1 - u) * (1 - u) * topX + 2 * (1 - u) * u * midX + u * u * endX;
          const ry = (1 - u) * (1 - u) * topY + 2 * (1 - u) * u * midY + u * u * endY;
          // Tangent along the rachis
          const tx = 2 * (1 - u) * (midX - topX) + 2 * u * (endX - midX);
          const ty = 2 * (1 - u) * (midY - topY) + 2 * u * (endY - midY);
          const tLen = Math.hypot(tx, ty) || 1;
          const ux = tx / tLen;
          const uy = ty / tLen;

          const env = Math.sin(u * Math.PI); // Natural almond taper from base to tip
          const leafL = (12 + 34 * env) * scale;
          const leafW = (2.1 + 2.4 * env) * scale;

          // Lower drooping leaflet blade
          const tipX = rx + ux * leafL * 0.38 + fd.dir * 2 * scale;
          const tipY = ry + uy * leafL * 0.25 + leafL * 0.92;
          ctx.fillStyle = fd.dark
            ? (l % 2 === 0 ? '#064e3b' : '#043927')
            : (l % 2 === 0 ? '#16a34a' : '#15803d');
          ctx.beginPath();
          ctx.moveTo(rx - ux * leafW * 0.5, ry);
          ctx.quadraticCurveTo(rx + ux * leafL * 0.3, ry + leafL * 0.35, tipX, tipY);
          ctx.quadraticCurveTo(rx - ux * leafL * 0.05, ry + leafL * 0.45, rx + ux * leafW * 0.5, ry);
          ctx.closePath();
          ctx.fill();

          // Upper shorter V-angled leaflet blade (gives authentic 3D V-trough palm frond depth)
          const upL = leafL * 0.58;
          const upTipX = rx + ux * upL * 0.65;
          const upTipY = ry + uy * upL * 0.55 - upL * 0.48;
          ctx.fillStyle = fd.dark ? '#065f46' : (l % 2 === 0 ? '#4ade80' : '#22c55e');
          ctx.beginPath();
          ctx.moveTo(rx - ux * leafW * 0.4, ry);
          ctx.quadraticCurveTo(rx + ux * upL * 0.35, ry - upL * 0.3, upTipX, upTipY);
          ctx.quadraticCurveTo(rx + ux * upL * 0.15, ry - upL * 0.05, rx + ux * leafW * 0.4, ry);
          ctx.closePath();
          ctx.fill();
        }

        // Tapered central woody/emerald rachis stem arching through the leaflets
        ctx.strokeStyle = fd.dark ? '#065f46' : '#86efac';
        ctx.lineWidth = (fd.dark ? 2.1 : 2.6) * scale;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.quadraticCurveTo(midX, midY, endX, endY);
        ctx.stroke();
      }
      ctx.restore();
    };

    for (let i = startIdx; i <= endIdx; i++) {
      const px = i * span - camX * parallax;

      // Secondary Background Canary Island Date Palm (adds deep botanical jungle layering)
      drawRealisticPalmTree(px + 205, h - 84, px + 188, 248, 0.76, i * 3 + 1);

      // Hero Foreground Royal Archontophoenix Palm Tree with Realistic Pinnate Leaflets!
      drawRealisticPalmTree(px + 86, h - 78, px + 108, 198, 1.02, i * 2);

      // Lush Tropical Understory: Fenestrated Monstera Leaves, Arching Boston Ferns & Blooming Phalaenopsis Orchids
      ctx.save();
      for (const [mx, my, mAng, mScale] of [[px + 38, h - 106, -0.45, 1], [px + 138, h - 102, 0.38, 1.08], [px + 185, h - 108, -0.22, 0.88]]) {
        ctx.save();
        ctx.translate(mx, my); ctx.rotate(mAng); ctx.scale(mScale, mScale);
        const mG = ctx.createLinearGradient(0, -34, 0, 12);
        mG.addColorStop(0, '#22c55e'); mG.addColorStop(0.55, '#15803d'); mG.addColorStop(1, '#064e3b');
        ctx.fillStyle = mG;
        ctx.beginPath();
        ctx.moveTo(0, 12);
        ctx.bezierCurveTo(-28, 8, -32, -26, 0, -38);
        ctx.bezierCurveTo(32, -26, 28, 8, 0, 12);
        ctx.closePath(); ctx.fill();
        // Characteristic Monstera leaf fenestrations (slits) & central midrib vein
        ctx.fillStyle = '#05201c';
        for (const sy of [-22, -12, -2]) {
          ctx.beginPath(); ctx.ellipse(-13, sy, 6, 1.7, 0.25, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(13, sy, 6, 1.7, -0.25, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = '#86efac'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(0, -34); ctx.stroke();
        ctx.restore();
      }
      // Arching 5-petal tropical orchid sprays with golden labellum throats
      for (const [ox, oy, oCol] of [[34, h - 132, '#f472b6'], [58, h - 142, '#e879f9'], [134, h - 128, '#fb7185'], [162, h - 138, '#f472b6']]) {
        ctx.fillStyle = oCol;
        for (let p = 0; p < 5; p++) {
          const a = (p * Math.PI * 2) / 5;
          ctx.beginPath(); ctx.ellipse(px + ox + Math.cos(a) * 4.2, oy + Math.sin(a) * 4.2, 3.6, 2.2, a, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(px + ox, oy, 2.1, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // Sculpted 3-Tier Carved Limestone & Verdigris Victorian Conservatory Fountain with Realistic Cascading Water!
      if (i % 2 === 0) {
        const fx = px + 265;
        const fy = h - 96;
        ctx.save();

        // Ground shadow beneath stone basin
        ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
        ctx.beginPath(); ctx.ellipse(fx, fy + 6, 80, 14, 0, 0, Math.PI * 2); ctx.fill();

        // Carved Weathered Limestone Ground Pool Wall (with recessed fluted panels & damp mossy trim)
        const poolG = ctx.createLinearGradient(fx - 76, fy - 14, fx + 76, fy + 6);
        poolG.addColorStop(0, '#475569'); poolG.addColorStop(0.32, '#94a3b8'); poolG.addColorStop(0.65, '#64748b'); poolG.addColorStop(1, '#334155');
        ctx.fillStyle = poolG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(fx - 74, fy - 8); ctx.lineTo(fx - 70, fy + 8);
        ctx.quadraticCurveTo(fx, fy + 18, fx + 70, fy + 8);
        ctx.lineTo(fx + 74, fy - 8); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Fluted carved relief recesses along outer stone basin
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.42)'; ctx.lineWidth = 1.2;
        for (const rx of [-48, -22, 22, 48]) {
          ctx.beginPath(); ctx.moveTo(fx + rx, fy - 4); ctx.lineTo(fx + rx * 0.96, fy + 9); ctx.stroke();
        }
        // Subtle green damp moss patches clinging to lower stone rim
        ctx.fillStyle = 'rgba(21, 128, 61, 0.65)';
        ctx.beginPath(); ctx.ellipse(fx - 56, fy + 6, 12, 3.2, 0.1, 0, Math.PI * 2); ctx.ellipse(fx + 44, fy + 7, 10, 2.8, -0.1, 0, Math.PI * 2); ctx.fill();

        // Beveled Stone Coping Rim + Shimmering Turquoise Conservatory Pool Water
        ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.ellipse(fx, fy - 8, 76, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        const waterG = ctx.createRadialGradient(fx, fy - 9, 8, fx, fy - 8, 68);
        waterG.addColorStop(0, '#67e8f9'); waterG.addColorStop(0.55, '#0e7490'); waterG.addColorStop(1, '#164e63');
        ctx.fillStyle = waterG;
        ctx.beginPath(); ctx.ellipse(fx, fy - 8, 68, 10.5, 0, 0, Math.PI * 2); ctx.fill();
        // Concentric shimmering water ripples in main pool
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.42)'; ctx.lineWidth = 1.1;
        const rip1 = ((time * 22) % 34);
        ctx.beginPath(); ctx.ellipse(fx, fy - 8, 22 + rip1, 3.5 + rip1 * 0.14, 0, 0, Math.PI * 2); ctx.stroke();

        // Sculpted Classical Fluted Baluster Pedestal Column (with curved molding rings!)
        const colG = ctx.createLinearGradient(fx - 18, fy - 110, fx + 18, fy - 110);
        colG.addColorStop(0, '#334155'); colG.addColorStop(0.35, '#cbd5e1'); colG.addColorStop(0.7, '#64748b'); colG.addColorStop(1, '#1e293b');
        ctx.fillStyle = colG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(fx - 18, fy - 8);
        ctx.bezierCurveTo(fx - 18, fy - 24, fx - 10, fy - 34, fx - 12, fy - 58);
        ctx.lineTo(fx - 9, fy - 102);
        ctx.lineTo(fx + 9, fy - 102);
        ctx.lineTo(fx + 12, fy - 58);
        ctx.bezierCurveTo(fx + 10, fy - 34, fx + 18, fy - 24, fx + 18, fy - 8);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Decorative stone molding collars
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.ellipse(fx, fy - 28, 14, 3.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(fx, fy - 76, 11, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Lower Wide Scalloped Stone Tier Bowl (fy - 58)
        const b1G = ctx.createLinearGradient(fx - 48, fy - 62, fx + 48, fy - 42);
        b1G.addColorStop(0, '#475569'); b1G.addColorStop(0.35, '#e2e8f0'); b1G.addColorStop(0.75, '#64748b'); b1G.addColorStop(1, '#334155');
        ctx.fillStyle = b1G; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(fx - 48, fy - 58);
        ctx.bezierCurveTo(fx - 42, fy - 42, fx - 16, fy - 40, fx - 12, fy - 42);
        ctx.lineTo(fx + 12, fy - 42);
        ctx.bezierCurveTo(fx + 16, fy - 40, fx + 42, fy - 42, fx + 48, fy - 58);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.ellipse(fx, fy - 58, 48, 8.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.ellipse(fx, fy - 58.5, 42, 6, 0, 0, Math.PI * 2); ctx.fill();

        // Upper Chalice Stone Tier Bowl (fy - 98) + Aged Verdigris Bronze Finial Nozzle
        ctx.fillStyle = b1G; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(fx - 26, fy - 98);
        ctx.bezierCurveTo(fx - 22, fy - 86, fx - 8, fy - 85, fx - 6, fy - 86);
        ctx.lineTo(fx + 6, fy - 86);
        ctx.bezierCurveTo(fx + 8, fy - 85, fx + 22, fy - 86, fx + 26, fy - 98);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.ellipse(fx, fy - 98, 26, 5.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#67e8f9'; ctx.beginPath(); ctx.ellipse(fx, fy - 98.5, 21, 3.6, 0, 0, Math.PI * 2); ctx.fill();
        // Verdigris bronze finial spout
        ctx.fillStyle = '#0f766e'; ctx.strokeStyle = '#042f2e'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(fx - 5, fy - 99); ctx.quadraticCurveTo(fx - 6, fy - 110, fx, fy - 116); ctx.quadraticCurveTo(fx + 6, fy - 110, fx + 5, fy - 99); ctx.closePath(); ctx.fill(); ctx.stroke();

        // REALISTIC MULTI-TIER ANIMATED WATER FLOWS (Central Plume, Parabolic Ribbons, Spill Curtains & Foam Mist!)
        const pulse = Math.sin(time * 7.5) * 3.5;
        // 1. Sparkling central fountain plume + rising mist spray
        const plumeG = ctx.createLinearGradient(fx, fy - 116, fx, fy - 144 - pulse);
        plumeG.addColorStop(0, 'rgba(224, 242, 254, 0.85)'); plumeG.addColorStop(1, 'rgba(186, 230, 253, 0.1)');
        ctx.fillStyle = plumeG;
        ctx.beginPath();
        ctx.moveTo(fx - 2.5, fy - 115); ctx.quadraticCurveTo(fx - 8, fy - 134 - pulse, fx, fy - 144 - pulse);
        ctx.quadraticCurveTo(fx + 8, fy - 134 - pulse, fx + 2.5, fy - 115); ctx.closePath(); ctx.fill();

        // 2. Curved parabolic water arcs cascading from finial -> upper bowl -> lower bowl -> pool
        for (const side of [-1, 1]) {
          // Top spray arc into upper bowl
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.65)'; ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(fx, fy - 118);
          ctx.quadraticCurveTo(fx + side * 12, fy - 138 - pulse * 0.7, fx + side * 17, fy - 98);
          ctx.stroke();

          // Translucent overflowing curtain sheet from Upper Bowl -> Lower Bowl
          const sheet1G = ctx.createLinearGradient(fx + side * 24, fy - 96, fx + side * 34, fy - 58);
          sheet1G.addColorStop(0, 'rgba(224, 242, 254, 0.62)'); sheet1G.addColorStop(1, 'rgba(103, 232, 249, 0.34)');
          ctx.fillStyle = sheet1G;
          ctx.beginPath();
          ctx.moveTo(fx + side * 20, fy - 96);
          ctx.quadraticCurveTo(fx + side * 32, fy - 82, fx + side * 35, fy - 58);
          ctx.lineTo(fx + side * 28, fy - 58);
          ctx.quadraticCurveTo(fx + side * 25, fy - 80, fx + side * 16, fy - 96);
          ctx.closePath(); ctx.fill();

          // Translucent overflowing cascade veil from Lower Bowl -> Ground Pool
          const sheet2G = ctx.createLinearGradient(fx + side * 44, fy - 56, fx + side * 56, fy - 8);
          sheet2G.addColorStop(0, 'rgba(224, 242, 254, 0.66)'); sheet2G.addColorStop(1, 'rgba(103, 232, 249, 0.28)');
          ctx.fillStyle = sheet2G;
          ctx.beginPath();
          ctx.moveTo(fx + side * 42, fy - 56);
          ctx.quadraticCurveTo(fx + side * 56, fy - 38, fx + side * 56, fy - 8);
          ctx.lineTo(fx + side * 46, fy - 8);
          ctx.quadraticCurveTo(fx + side * 45, fy - 36, fx + side * 34, fy - 56);
          ctx.closePath(); ctx.fill();

          // Animated falling sparkling water beads along the cascades
          ctx.fillStyle = '#ffffff';
          for (let d = 0; d < 3; d++) {
            const dtFrac = ((time * 2.4 + d * 0.33 + (side > 0 ? 0.15 : 0)) % 1);
            const dx1 = fx + side * (41 + dtFrac * 11);
            const dy1 = fy - 56 + dtFrac * dtFrac * 48;
            ctx.beginPath(); ctx.arc(dx1, dy1, 1.6, 0, Math.PI * 2); ctx.fill();
          }

          // Bubbling white splash foam where cascades hit lower bowl & main pool
          ctx.fillStyle = 'rgba(240, 249, 255, 0.72)';
          const foamBob = Math.sin(time * 9 + side * 2) * 1.2;
          ctx.beginPath();
          ctx.ellipse(fx + side * 31, fy - 58 + foamBob * 0.4, 7.5, 2.5, 0, 0, Math.PI * 2);
          ctx.ellipse(fx + side * 51, fy - 8 + foamBob * 0.5, 11, 3.4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Hanging Glass Terrarium Lantern with Soft Emerald-Amber Glow
      const sway = Math.sin(time * 1.6 + i) * 7;
      const lx = px + 275 + sway;
      const ly = 158;
      ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(px + 275, 0); ctx.lineTo(lx, ly); ctx.stroke();
      const lGlow = ctx.createRadialGradient(lx, ly, 4, lx, ly, 56);
      lGlow.addColorStop(0, 'rgba(254, 240, 138, 0.34)'); lGlow.addColorStop(0.5, 'rgba(52, 211, 153, 0.16)'); lGlow.addColorStop(1, 'rgba(52, 211, 153, 0)');
      ctx.fillStyle = lGlow; ctx.beginPath(); ctx.arc(lx, ly, 56, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#064e3b'; ctx.strokeStyle = '#6ee7b7'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(lx - 15, ly); ctx.lineTo(lx, ly - 17); ctx.lineTo(lx + 15, ly); ctx.lineTo(lx, ly + 19); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(lx, ly + 1, 5.5, 0, Math.PI * 2); ctx.fill();
    }

    for (let f = 0; f < 30; f++) {
      const fx = (f * 173 + time * 24) % w;
      const fy = 110 + ((f * 89) % 460) + Math.sin(time * 2.5 + f) * 18;
      const a = 0.25 + 0.65 * Math.abs(Math.sin(time * 3.2 + f));
      ctx.fillStyle = f % 3 === 0 ? `rgba(254, 240, 138, ${a})` : `rgba(110, 231, 183, ${a})`;
      ctx.beginPath(); ctx.arc(fx, fy, 2.8, 0, Math.PI * 2); ctx.fill();
    }
  }

  // =========================================================================
  // 7. STAGE 14: NEON CYBERPUNK SKYLINE (Neo-Tokyo Rain, Glass Arcologies, Maglev & Rich Billboards)
  // =========================================================================
  function drawNeonRooftopSkyAndHorizon(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    // Rich Cinematic Night-Rain City Sky with Electric Horizon Light Pollution
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#040612');
    sky.addColorStop(0.32, '#0c112b');
    sky.addColorStop(0.64, '#1f1242');
    sky.addColorStop(0.84, '#3d154f');
    sky.addColorStop(1, '#101830');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

    // Subtle High-Altitude Night Mist Clouds Illuminated by Neon City Glow Below
    for (let c = 0; c < 7; c++) {
      const cx = ((c * 240 - camX * 0.03 + time * 5) % (w + 320) + (w + 320)) % (w + 320) - 160;
      const cy = 62 + (c % 3) * 44;
      const cG = ctx.createRadialGradient(cx, cy + 12, 10, cx, cy, 130);
      cG.addColorStop(0, c % 2 === 0 ? 'rgba(56, 189, 248, 0.13)' : 'rgba(236, 72, 153, 0.12)');
      cG.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = cG;
      ctx.beginPath(); ctx.ellipse(cx, cy, 140, 28, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Sweeping Volumetric Cyber Searchlights from Distant Megatowers
    for (let s = 0; s < 4; s++) {
      const sx = 170 + s * 320 - ((camX * 0.04) % 320);
      const ang = Math.sin(time * 0.55 + s * 1.7) * 0.34;
      ctx.save();
      ctx.translate(sx, h - 80); ctx.rotate(ang);
      const beamG = ctx.createLinearGradient(0, 0, 0, -640);
      beamG.addColorStop(0, s % 2 === 0 ? 'rgba(34, 211, 238, 0.15)' : 'rgba(244, 114, 182, 0.14)');
      beamG.addColorStop(0.6, s % 2 === 0 ? 'rgba(34, 211, 238, 0.04)' : 'rgba(244, 114, 182, 0.04)');
      beamG.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = beamG;
      ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-68, -640); ctx.lineTo(68, -640); ctx.lineTo(10, 0); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // PARALLAX LAYER 1 (Ultra-Far Arcology Megastructures & Slanted Ziggurat Spires)
    const farSpan = 210;
    const farPar = 0.07;
    const farStart = Math.floor((camX * farPar) / farSpan) - 1;
    const farEnd = Math.ceil((camX * farPar + w) / farSpan) + 1;
    for (let i = farStart; i <= farEnd; i++) {
      const fx = i * farSpan - camX * farPar;
      const fh = 290 + ((Math.abs(i) * 97) % 190);
      const fy = h - fh;
      const style = Math.abs(i) % 3;
      const bodyG = ctx.createLinearGradient(fx, fy, fx, h);
      bodyG.addColorStop(0, '#111633');
      bodyG.addColorStop(0.7, '#1b1642');
      bodyG.addColorStop(1, '#2a1647');
      ctx.fillStyle = bodyG;
      ctx.beginPath();
      if (style === 0) {
        // Tapered Blade-Runner Pyramid Arcology
        ctx.moveTo(fx - 12, h); ctx.lineTo(fx + 22, fy + 24); ctx.lineTo(fx + 148, fy + 24); ctx.lineTo(fx + 182, h);
      } else if (style === 1) {
        // Slanted Crown Glass Megatower
        ctx.moveTo(fx + 6, h); ctx.lineTo(fx + 6, fy + 38); ctx.lineTo(fx + 146, fy - 12); ctx.lineTo(fx + 146, h);
      } else {
        // Stepped Spire Skyscraper
        ctx.moveTo(fx + 12, h); ctx.lineTo(fx + 12, fy + 45); ctx.lineTo(fx + 38, fy + 45);
        ctx.lineTo(fx + 38, fy); ctx.lineTo(fx + 128, fy); ctx.lineTo(fx + 128, fy + 45); ctx.lineTo(fx + 154, fy + 45); ctx.lineTo(fx + 154, h);
      }
      ctx.closePath(); ctx.fill();

      // Thin aviation needle spire with blinking red beacon
      const spireX = fx + 84;
      const spireTop = fy - 62;
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(spireX, fy + 24); ctx.lineTo(spireX, spireTop); ctx.stroke();
      const blink = Math.sin(time * 3.2 + i * 1.4) > 0.2;
      if (blink) {
        ctx.fillStyle = 'rgba(248, 113, 113, 0.35)'; ctx.beginPath(); ctx.arc(spireX, spireTop, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff453a'; ctx.beginPath(); ctx.arc(spireX, spireTop, 2.2, 0, Math.PI * 2); ctx.fill();
      }
    }

    // PARALLAX LAYER 2 (Mid-Far Architectural Glass Towers with Organic Lit Office Floor Bands)
    const span = 185;
    const parallax = 0.16;
    const startIdx = Math.floor((camX * parallax) / span) - 1;
    const endIdx = Math.ceil((camX * parallax + w) / span) + 1;
    for (let i = startIdx; i <= endIdx; i++) {
      const bx = i * span - camX * parallax;
      const bh = 240 + ((Math.abs(i) * 73) % 210);
      const topY = h - bh;
      const bw = 148;
      const accent = Math.abs(i) % 3 === 0 ? '#22d3ee' : Math.abs(i) % 3 === 1 ? '#f472b6' : '#a78bfa';

      ctx.save();
      ctx.translate(bx, topY);
      const tG = ctx.createLinearGradient(0, 0, bw, 0);
      tG.addColorStop(0, '#070b1a'); tG.addColorStop(0.6, '#0f1730'); tG.addColorStop(1, '#1a153a');
      ctx.fillStyle = tG; ctx.fillRect(0, 0, bw, bh);
      // Architectural crown bevel & penthouse glass deck
      ctx.fillStyle = '#0c1328';
      ctx.fillRect(16, -26, bw - 32, 26);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.72;
      ctx.fillRect(16, -26, bw - 32, 2.5);
      ctx.fillRect(2, 4, 2, bh - 40);
      ctx.globalAlpha = 1;

      // Realistic varied horizontal office window bands (mix of cool ice-blue, warm amber & dimmed suites)
      for (let wy = 16; wy < bh - 70; wy += 16) {
        const floorHash = Math.abs(i * 19 + wy * 7);
        if (floorHash % 4 === 0) continue;
        const litStart = 12 + (floorHash % 3) * 14;
        const litW = 36 + (floorHash % 5) * 16;
        const clampedW = Math.min(litW, bw - litStart - 12);
        if (clampedW > 12) {
          ctx.fillStyle = floorHash % 5 === 0
            ? 'rgba(253, 224, 71, 0.34)'
            : floorHash % 2 === 0
            ? 'rgba(125, 211, 252, 0.28)'
            : 'rgba(244, 114, 182, 0.22)';
          ctx.fillRect(litStart, wy, clampedW, 5.5);
          // Window mullion breaks
          ctx.fillStyle = '#090d1c';
          for (let mx = litStart + 10; mx < litStart + clampedW; mx += 12) ctx.fillRect(mx, wy, 2, 5.5);
        }
      }
      ctx.restore();
    }

    // Soft Electric City Horizon Haze behind Maglev Viaduct
    const hazeG = ctx.createLinearGradient(0, h - 290, 0, h - 80);
    hazeG.addColorStop(0, 'rgba(56, 189, 248, 0)');
    hazeG.addColorStop(0.55, 'rgba(168, 85, 247, 0.14)');
    hazeG.addColorStop(1, 'rgba(34, 211, 238, 0.18)');
    ctx.fillStyle = hazeG; ctx.fillRect(0, h - 290, w, 210);

    // Sleek Elevated Maglev Sky-Train Viaduct with Structural Trusses & 3-Car Articulated Express Train!
    const railY = 442;
    ctx.fillStyle = '#0b1020'; ctx.fillRect(0, railY, w, 13);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2;
    ctx.beginPath();
    const trussOff = ((camX * 0.22) % 44 + 44) % 44;
    for (let tx = -trussOff; tx < w + 44; tx += 44) {
      ctx.moveTo(tx, railY + 2); ctx.lineTo(tx + 22, railY + 12); ctx.lineTo(tx + 44, railY + 2);
    }
    ctx.stroke();
    // Glowing cyan magnetic guide-rail strip
    ctx.fillStyle = 'rgba(34, 211, 238, 0.72)'; ctx.fillRect(0, railY, w, 2);

    const trainX = ((time * 245) % (w + 620)) - 310;
    // Cyan maglev levitation hover glow under train
    const levG = ctx.createLinearGradient(trainX, railY - 4, trainX, railY + 6);
    levG.addColorStop(0, 'rgba(34, 211, 238, 0.52)'); levG.addColorStop(1, 'rgba(34, 211, 238, 0)');
    ctx.fillStyle = levG; ctx.fillRect(trainX + 6, railY - 3, 276, 8);
    // 3 Sleek Articulated Aerodynamic Maglev Cars
    for (let car = 0; car < 3; car++) {
      const cx = trainX + car * 94;
      const cw = 88;
      const bodyG = ctx.createLinearGradient(cx, railY - 22, cx, railY - 2);
      bodyG.addColorStop(0, '#cbd5e1'); bodyG.addColorStop(0.45, '#64748b'); bodyG.addColorStop(1, '#1e293b');
      ctx.fillStyle = bodyG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      const rad = car === 2 ? [4, 16, 2, 2] : car === 0 ? [12, 4, 2, 2] : [3, 3, 2, 2];
      ctx.roundRect(cx, railY - 21, cw, 19, rad);
      ctx.fill(); ctx.stroke();
      // Panoramic tinted cabin windows with warm golden interior lights
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx + 8, railY - 16, cw - 18, 7.5);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
      for (let wx = cx + 11; wx < cx + cw - 16; wx += 14) ctx.fillRect(wx, railY - 14.5, 9, 4.5);
      // Sleek cyan-magenta speed pinstripe
      ctx.fillStyle = '#22d3ee'; ctx.fillRect(cx + 4, railY - 6.5, cw - 8, 2);
      // Articulated coupler between cars
      if (car < 2) { ctx.fillStyle = '#090d16'; ctx.fillRect(cx + cw, railY - 17, 6, 13); }
    }
    // Bright LED headlight cone & red tail beacon
    const headG = ctx.createLinearGradient(trainX + 276, railY - 10, trainX + 355, railY - 10);
    headG.addColorStop(0, 'rgba(224, 242, 254, 0.65)'); headG.addColorStop(1, 'rgba(224, 242, 254, 0)');
    ctx.fillStyle = headG;
    ctx.beginPath(); ctx.moveTo(trainX + 275, railY - 13); ctx.lineTo(trainX + 355, railY - 22); ctx.lineTo(trainX + 355, railY - 2); ctx.lineTo(trainX + 275, railY - 7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff453a'; ctx.fillRect(trainX + 1, railY - 11, 3, 4);

    // Multi-Altitude Distant Flying Hover-Car Light Trails
    for (let f = 0; f < 14; f++) {
      const dir = f % 2 === 0 ? 1 : -1;
      const fx = ((f * 175 + time * dir * (120 + (f % 4) * 32)) % (w + 180) + (w + 180)) % (w + 180) - 90;
      const fy = 215 + (f % 5) * 40;
      const trailG = ctx.createLinearGradient(fx, fy, fx + dir * 38, fy);
      trailG.addColorStop(0, dir > 0 ? 'rgba(34, 211, 238, 0)' : 'rgba(244, 114, 182, 0)');
      trailG.addColorStop(1, dir > 0 ? 'rgba(34, 211, 238, 0.78)' : 'rgba(244, 114, 182, 0.78)');
      ctx.strokeStyle = trailG; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + dir * 38, fy); ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(fx + dir * 38, fy, 1.8, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawNeonRooftopMidground(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    const span = 460;
    const parallax = 0.36;
    const startIdx = Math.floor((camX * parallax) / span) - 1;
    const endIdx = Math.ceil((camX * parallax + w) / span) + 1;

    for (let i = startIdx; i <= endIdx; i++) {
      const bx = i * span - camX * parallax;
      const topY = 218 + (Math.abs(i) % 3) * 28;
      const bw = 246;
      const bh = h - topY;
      const type = ((i % 3) + 3) % 3;

      ctx.save();
      ctx.translate(bx, topY);

      // Architectural Dark-Glass & Titanium Skyscraper Facade (`tex.cyberGlassFacade`, NO checkerboard!)
      ctx.fillStyle = tex.cyberGlassFacade;
      ctx.fillRect(0, 0, bw, bh);
      // 3D cylindrical side-edge depth shading & crisp rim light
      const shadeG = ctx.createLinearGradient(0, 0, bw, 0);
      shadeG.addColorStop(0, 'rgba(2, 6, 23, 0.56)');
      shadeG.addColorStop(0.18, 'rgba(2, 6, 23, 0.08)');
      shadeG.addColorStop(0.84, 'rgba(2, 6, 23, 0.14)');
      shadeG.addColorStop(1, 'rgba(2, 6, 23, 0.62)');
      ctx.fillStyle = shadeG; ctx.fillRect(0, 0, bw, bh);

      // Structural dark-steel corner I-beams & horizontal mechanical service ledges
      ctx.fillStyle = '#090e1a';
      ctx.fillRect(0, 0, 10, bh); ctx.fillRect(bw - 10, 0, 10, bh);
      ctx.fillRect(-4, 0, bw + 8, 12);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(-4, 0, bw + 8, 3);
      // Exposed chrome utility conduit pipes & glowing fiber line on right flank
      ctx.fillStyle = '#334155'; ctx.fillRect(bw - 16, 12, 3.5, bh); ctx.fillRect(bw - 22, 12, 2.5, bh);
      ctx.fillStyle = type === 0 ? 'rgba(244, 114, 182, 0.55)' : type === 1 ? 'rgba(34, 211, 238, 0.55)' : 'rgba(251, 191, 36, 0.55)';
      ctx.fillRect(10, 14, 2, bh - 20);

      // Detailed Rooftop Equipment (HVAC Chillers, Exhaust Vents, Satellite Dish)
      ctx.fillStyle = '#141c2e'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.2;
      ctx.fillRect(14, -18, 42, 18); ctx.strokeRect(14, -18, 42, 18);
      ctx.fillStyle = '#090d16';
      for (let vy = -14; vy <= -4; vy += 4) ctx.fillRect(19, vy, 32, 2);
      ctx.fillStyle = '#141c2e'; ctx.fillRect(bw - 52, -14, 34, 14); ctx.strokeRect(bw - 52, -14, 34, 14);

      // Subtle warm/cool architectural penthouse & mid-tower lit glass bays
      for (let row = 0; row < 5; row++) {
        const wy = 34 + row * 72;
        if ((Math.abs(i) + row) % 2 === 0) {
          const wG = ctx.createLinearGradient(24, wy, bw - 28, wy + 22);
          wG.addColorStop(0, row % 2 === 0 ? 'rgba(56, 189, 248, 0.24)' : 'rgba(251, 191, 36, 0.22)');
          wG.addColorStop(1, 'rgba(15, 23, 42, 0.05)');
          ctx.fillStyle = wG; ctx.fillRect(24, wy, bw - 54, 18);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)'; ctx.lineWidth = 1;
          ctx.strokeRect(24, wy, bw - 54, 18);
        }
      }

      // === 3 DISTINCT, RICH, PROFESSIONAL ROOFTOP CYBERPUNK BILLBOARDS ===
      if (type === 0) {
        // BILLBOARD A: Neo-Tokyo Steaming Neon Ramen / Bistro Sign on Steel Mounting Truss!
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(42, 0); ctx.lineTo(42, -32); ctx.moveTo(bw - 42, 0); ctx.lineTo(bw - 42, -32);
        ctx.moveTo(42, -6); ctx.lineTo(74, -28); ctx.moveTo(bw - 42, -6); ctx.lineTo(bw - 74, -28);
        ctx.stroke();

        // Dark brushed-steel beveled signboard housing with backlit neon halo
        const bGlow = ctx.createRadialGradient(bw / 2, -68, 12, bw / 2, -68, 118);
        bGlow.addColorStop(0, 'rgba(244, 114, 182, 0.26)'); bGlow.addColorStop(1, 'rgba(244, 114, 182, 0)');
        ctx.fillStyle = bGlow; ctx.beginPath(); ctx.ellipse(bw / 2, -68, 125, 58, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#090818'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.roundRect(18, -108, bw - 36, 82, 8); ctx.fill(); ctx.stroke();
        // Double-stroke glowing pink neon frame (outer bloom + hot inner filament)
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.45)'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.roundRect(23, -103, bw - 46, 72, 6); ctx.stroke();
        ctx.strokeStyle = '#fbcfe8'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.roundRect(23, -103, bw - 46, 72, 6); ctx.stroke();

        // Glowing Neon Ramen Bowl + Chopsticks + Animated Rising Steam Curls!
        const rx = 74, ry = -56;
        // Animated steam ribbons
        ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
        for (let st = -1; st <= 1; st++) {
          const sx = rx + st * 11;
          const wave = Math.sin(time * 4 + st * 1.6) * 3;
          ctx.beginPath(); ctx.moveTo(sx, ry - 15); ctx.quadraticCurveTo(sx + wave, ry - 25, sx - wave, ry - 36); ctx.stroke();
        }
        // Chopsticks resting diagonally
        ctx.strokeStyle = '#fde047'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(rx - 22, ry - 18); ctx.lineTo(rx + 28, ry - 27); ctx.moveTo(rx - 20, ry - 14); ctx.lineTo(rx + 28, ry - 20); ctx.stroke();
        // Glowing bowl silhouette
        ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.arc(rx, ry - 10, 22, 0.1, Math.PI - 0.1); ctx.closePath(); ctx.stroke();
        ctx.fillStyle = 'rgba(244, 114, 182, 0.25)'; ctx.fill();
        ctx.fillStyle = '#fde047'; ctx.fillRect(rx - 10, ry + 11, 20, 3.5);

        // Crisp Glowing Typography & Decorative Neon Wave Bars
        ctx.fillStyle = '#fef08a'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('NEO BISTRO', 112, -73);
        ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 11px monospace';
        ctx.fillText('24H SKY RAMEN', 112, -56);
        // Illuminated progress dots
        for (let d = 0; d < 5; d++) {
          const lit = (Math.floor(time * 4) % 5) === d;
          ctx.fillStyle = lit ? '#fef08a' : '#f472b6';
          ctx.fillRect(112 + d * 18, -45, 12, 3.5);
        }
      } else if (type === 1) {
        // BILLBOARD B: Curved High-Tech Panoramic LED Megaboard (Live Audio Equalizer + Glowing Geometric Koi Prism!)
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(52, 0); ctx.lineTo(52, -24); ctx.moveTo(bw - 52, 0); ctx.lineTo(bw - 52, -24); ctx.stroke();

        const scrGlow = ctx.createRadialGradient(bw / 2, -68, 16, bw / 2, -68, 125);
        scrGlow.addColorStop(0, 'rgba(34, 211, 238, 0.28)'); scrGlow.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = scrGlow; ctx.beginPath(); ctx.ellipse(bw / 2, -68, 130, 62, 0, 0, Math.PI * 2); ctx.fill();

        const scrG = ctx.createLinearGradient(16, -112, bw - 16, -24);
        scrG.addColorStop(0, '#07142b'); scrG.addColorStop(0.5, '#0c2340'); scrG.addColorStop(1, '#1a103c');
        ctx.fillStyle = scrG; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(14, -112, bw - 28, 88, 6); ctx.fill(); ctx.stroke();
        // Metallic corner brackets
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(12, -114, 14, 4); ctx.fillRect(bw - 26, -114, 14, 4);
        ctx.fillRect(12, -26, 14, 4); ctx.fillRect(bw - 26, -26, 14, 4);

        // Live Animated Cyan-to-Magenta Spectrum Equalizer Bars inside Screen!
        for (let bar = 0; bar < 11; bar++) {
          const barH = 12 + Math.abs(Math.sin(time * 4.2 + bar * 0.75 + i)) * 34;
          const barX = 28 + bar * 10;
          const barG = ctx.createLinearGradient(barX, -42 - barH, barX, -42);
          barG.addColorStop(0, '#f472b6'); barG.addColorStop(0.5, '#38bdf8'); barG.addColorStop(1, '#0284c7');
          ctx.fillStyle = barG;
          ctx.fillRect(barX, -42 - barH, 6.5, barH);
        }

        // Glowing Geometric Neon Koi / Diamond Hologram Graphic on Right Half
        const gx = bw - 62, gy = -72;
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(time * 0.45);
        ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.8;
        ctx.strokeRect(-18, -18, 36, 36);
        ctx.rotate(Math.PI / 4);
        ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 1.6;
        ctx.strokeRect(-16, -16, 32, 32);
        ctx.restore();
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(gx, gy, 5, 0, Math.PI * 2); ctx.fill();

        // Glass diagonal glare + bottom glowing ticker bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath(); ctx.moveTo(22, -110); ctx.lineTo(68, -110); ctx.lineTo(36, -26); ctx.lineTo(16, -26); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(2, 6, 23, 0.72)'; ctx.fillRect(16, -37, bw - 32, 11);
        ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 9.5px monospace'; ctx.textAlign = 'center';
        ctx.fillText('SKYLINE METRO • SECTOR 14 • LIVE', bw / 2, -29);
      } else {
        // BILLBOARD C: Futuristic Orbital Holo-Spire with Rotating Glowing Rings & Vertical Blade Sign!
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(bw / 2 - 42, 0); ctx.lineTo(bw / 2 - 26, -22); ctx.lineTo(bw / 2 + 26, -22); ctx.lineTo(bw / 2 + 42, 0); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Upward volumetric projector cone
        const coneG = ctx.createLinearGradient(bw / 2, -22, bw / 2, -118);
        coneG.addColorStop(0, 'rgba(56, 189, 248, 0.34)'); coneG.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = coneG;
        ctx.beginPath(); ctx.moveTo(bw / 2 - 22, -22); ctx.lineTo(bw / 2 - 66, -118); ctx.lineTo(bw / 2 + 66, -118); ctx.lineTo(bw / 2 + 22, -22); ctx.closePath(); ctx.fill();

        // Holographic Glowing Planet Core + Counter-Rotating Tilted Orbital Rings
        const ox = bw / 2, oy = -76;
        const orbG = ctx.createRadialGradient(ox - 5, oy - 5, 3, ox, oy, 22);
        orbG.addColorStop(0, '#e0f2fe'); orbG.addColorStop(0.45, '#38bdf8'); orbG.addColorStop(1, 'rgba(99, 102, 241, 0.25)');
        ctx.fillStyle = orbG; ctx.beginPath(); ctx.arc(ox, oy, 20, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(ox, oy, 46, 13, 0.26 + Math.sin(time * 1.2) * 0.08, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.ellipse(ox, oy, 36, 11, -0.34 - Math.sin(time * 1.4) * 0.08, 0, Math.PI * 2); ctx.stroke();
        // Orbiting satellite spark
        const satAng = time * 2.2 + i;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(ox + Math.cos(satAng) * 44, oy + Math.sin(satAng) * 14, 3.2, 0, Math.PI * 2); ctx.fill();
      }

      // Detailed Cantilevered Vertical Neon Side Blade Sign with Steel Mounting Struts
      const sideCol = type === 0 ? '#22d3ee' : type === 1 ? '#f472b6' : '#fbbf24';
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(-4, 48); ctx.lineTo(4, 48); ctx.moveTo(-4, 162); ctx.lineTo(4, 162); ctx.stroke();
      ctx.fillStyle = '#070b18'; ctx.strokeStyle = sideCol; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(-28, 34, 24, 142, 4); ctx.fill(); ctx.stroke();
      // Sleek futuristic neon equalizer-bars, chevrons & glowing status pills (zero cross/plus shapes)
      for (let g = 0; g < 6; g++) {
        const gy = 48 + g * 21;
        const active = (Math.floor(time * 3.5 + i) + g) % 3 === 0;
        ctx.fillStyle = active ? '#ffffff' : sideCol;
        if (g % 2 === 0) {
          ctx.beginPath(); ctx.roundRect(-22, gy, 12, 4.5, 2); ctx.fill();
          ctx.fillStyle = sideCol;
          ctx.beginPath(); ctx.roundRect(-19, gy + 7, 9, 2.8, 1.4); ctx.fill();
        } else {
          ctx.strokeStyle = active ? '#ffffff' : sideCol; ctx.lineWidth = 2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(-21, gy + 5); ctx.lineTo(-16, gy); ctx.lineTo(-11, gy + 5); ctx.stroke();
        }
      }

      ctx.restore();
    }

    // Fine Diagonal Cyberpunk Rain Streaks Catching Neon Light
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.22)'; ctx.lineWidth = 1.1;
    for (let r = 0; r < 54; r++) {
      const rx = ((r * 151 + time * 195) % (w + 120)) - 60;
      const ry = ((r * 89 + time * 720) % (h + 60)) - 30;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 8, ry + 20); ctx.stroke();
    }
  }

  // =========================================================================
  // 8. STAGE 15: DAWN HOMEWARD AVENUE (Storybook Sunrise, Villas, Cherry Blossoms)
  // =========================================================================
  function drawHomewardSkyAndHorizon(ctx, camX, w, h, time) {
    ensureTextures(ctx);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#18143b');
    sky.addColorStop(0.24, '#59204f');
    sky.addColorStop(0.52, '#c85a53');
    sky.addColorStop(0.76, '#f29e61');
    sky.addColorStop(0.92, '#fbd38d');
    sky.addColorStop(1, '#fef3c7');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

    // Rising Morning Sun + Volumetric Golden Sunbeams
    const sunX = 880 - camX * 0.025;
    const sunY = h - 188;
    ctx.save();
    ctx.translate(sunX, sunY);
    for (let r = 0; r < 11; r++) {
      const ang = -Math.PI + (r / 10) * Math.PI + Math.sin(time * 0.35 + r) * 0.03;
      ctx.save();
      ctx.rotate(ang);
      const rayG = ctx.createLinearGradient(0, 0, 620, 0);
      rayG.addColorStop(0, 'rgba(255, 251, 235, 0.22)'); rayG.addColorStop(1, 'rgba(255, 251, 235, 0)');
      ctx.fillStyle = rayG;
      ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(620, -44); ctx.lineTo(620, 44); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    const sunHalo = ctx.createRadialGradient(sunX, sunY, 34, sunX, sunY, 285);
    sunHalo.addColorStop(0, 'rgba(255, 251, 235, 0.92)'); sunHalo.addColorStop(0.38, 'rgba(253, 186, 116, 0.42)'); sunHalo.addColorStop(1, 'rgba(253, 186, 116, 0)');
    ctx.fillStyle = sunHalo; ctx.beginPath(); ctx.arc(sunX, sunY, 285, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fffbeb'; ctx.beginPath(); ctx.arc(sunX, sunY, 54, 0, Math.PI * 2); ctx.fill();

    // Multi-Toned Dawn Clouds (Warm Gold Lit Bottom + Soft Plum Top)
    for (let c = 0; c < 8; c++) {
      const cx = ((c * 245 - camX * 0.06 + time * 6) % (w + 320) + (w + 320)) % (w + 320) - 160;
      const cy = 88 + (c % 4) * 50;
      ctx.fillStyle = 'rgba(253, 186, 116, 0.38)';
      ctx.beginPath(); ctx.ellipse(cx, cy + 5, 92, 18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 241, 224, 0.34)';
      ctx.beginPath(); ctx.ellipse(cx, cy, 86, 17, 0, 0, Math.PI * 2); ctx.ellipse(cx - 46, cy + 5, 48, 13, 0, 0, Math.PI * 2); ctx.ellipse(cx + 48, cy + 4, 52, 14, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Two Layered Misty Dawn Mountain & City Horizons
    ctx.fillStyle = 'rgba(74, 29, 64, 0.38)';
    ctx.beginPath(); ctx.moveTo(0, h - 100);
    for (let x = 0; x <= w + 100; x += 90) {
      ctx.lineTo(x, h - 185 - Math.sin((x + camX * 0.04) * 0.005) * 48);
    }
    ctx.lineTo(w, h - 100); ctx.closePath(); ctx.fill();

    ctx.fillStyle = 'rgba(56, 22, 52, 0.56)';
    ctx.beginPath(); ctx.moveTo(0, h - 95);
    for (let x = 0; x <= w + 100; x += 80) {
      ctx.lineTo(x, h - 142 - Math.sin((x + camX * 0.09) * 0.008) * 32);
    }
    ctx.lineTo(w, h - 95); ctx.closePath(); ctx.fill();

    // Distant Graceful Flock of Morning Birds
    ctx.strokeStyle = 'rgba(67, 20, 7, 0.58)'; ctx.lineWidth = 2;
    for (let b = 0; b < 8; b++) {
      const bx = ((b * 155 + time * 44) % (w + 120)) - 60;
      const by = 132 + (b % 3) * 38 + Math.sin(time * 4 + b) * 6;
      const wing = Math.sin(time * 9 + b * 1.3) * 5.5;
      ctx.beginPath();
      ctx.moveTo(bx - 9, by + wing); ctx.quadraticCurveTo(bx - 3, by - 4, bx, by);
      ctx.quadraticCurveTo(bx + 3, by - 4, bx + 9, by + wing);
      ctx.stroke();
    }
  }

  function drawHomewardMidground(ctx, camX, w, h, time) {
    ensureTextures(ctx);

    // Helper: Painterly Mediterranean Cypress Tree (slender dark-emerald spire catching golden dawn rim!)
    const drawCypress = (cx, baseY, height, wid) => {
      ctx.save();
      ctx.fillStyle = '#2d1c18'; ctx.fillRect(cx - 3.5, baseY - 22, 7, 22);
      const cyG = ctx.createLinearGradient(cx - wid, baseY - height, cx + wid, baseY - 12);
      cyG.addColorStop(0, '#0f2d24'); cyG.addColorStop(0.55, '#1e4d3a'); cyG.addColorStop(1, '#65a30d');
      ctx.fillStyle = cyG; ctx.strokeStyle = '#091c16'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, baseY - height);
      ctx.bezierCurveTo(cx - wid * 1.1, baseY - height * 0.65, cx - wid * 1.15, baseY - 26, cx - 5, baseY - 14);
      ctx.lineTo(cx + 5, baseY - 14);
      ctx.bezierCurveTo(cx + wid * 1.15, baseY - 26, cx + wid * 1.1, baseY - height * 0.65, cx, baseY - height);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Golden sunrise rim light along right flank of cypress
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.34)'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(cx + 1, baseY - height + 4); ctx.quadraticCurveTo(cx + wid * 0.85, baseY - height * 0.45, cx + 6, baseY - 18); ctx.stroke();
      ctx.restore();
    };

    // Helper: Painterly Sunlit Cherry-Blossom Tree (gnarled branching boughs + delicate multi-tone blossom clusters, NO cartoon balls!)
    const drawPainterlyBlossomTree = (tx, baseY, scale = 1) => {
      ctx.save();
      ctx.translate(tx, baseY); ctx.scale(scale, scale);
      // Gnarled textured bark trunk & sweeping asymmetric boughs
      ctx.fillStyle = '#3d2222'; ctx.strokeStyle = '#1f0f10'; ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-14, 0); ctx.quadraticCurveTo(-7, -58, -10, -118);
      ctx.lineTo(7, -118); ctx.quadraticCurveTo(6, -58, 15, 0);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#3d2222'; ctx.lineCap = 'round'; ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-4, -92); ctx.quadraticCurveTo(-28, -112, -52, -124);
      ctx.moveTo(4, -98); ctx.quadraticCurveTo(30, -118, 56, -122);
      ctx.moveTo(0, -108); ctx.quadraticCurveTo(-4, -135, 10, -152);
      ctx.stroke();
      // Delicate overlapping painterly foliage-blossom clouds (shaded plum underside -> rose -> sunlit cream-pink crest!)
      const clusters = [
        [-48, -124, 28, 18], [46, -122, 30, 19], [-20, -142, 34, 21],
        [22, -146, 32, 20], [2, -162, 28, 18], [-32, -112, 22, 14], [30, -110, 24, 15],
      ];
      for (const [cx, cy, rx, ry] of clusters) {
        const g = ctx.createRadialGradient(cx + rx * 0.2, cy - ry * 0.35, 2, cx, cy, rx * 1.1);
        g.addColorStop(0, '#fff1f2');
        g.addColorStop(0.38, '#f9a8d4');
        g.addColorStop(0.75, '#db2777');
        g.addColorStop(1, '#831843');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, (cx * 0.004), 0, Math.PI * 2); ctx.fill();
      }
      // Crisp individual sunlit micro-blossoms catching morning gold!
      ctx.fillStyle = 'rgba(255, 251, 235, 0.78)';
      for (const [bx, by] of [[-42, -134], [-18, -154], [14, -166], [36, -148], [54, -132], [4, -136], [-26, -122]]) {
        ctx.beginPath(); ctx.arc(bx, by, 2.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    };

    const span = 460;
    const parallax = 0.42;
    const startIdx = Math.floor((camX * parallax) / span) - 1;
    const endIdx = Math.ceil((camX * parallax + w) / span) + 1;

    for (let i = startIdx; i <= endIdx; i++) {
      const hx = i * span - camX * parallax;
      const style = ((i % 4) + 4) % 4;
      const groundY = h - 90;

      if (style === 0) {
        // LANDMARK 0: Grand Sunlit Mediterranean Tuscan Limestone Villa with Arched Colonnade Loggia, Balustrade Balcony & Climbing Bougainvillea!
        const bw = 278, bh = 288, topY = groundY - bh;
        ctx.save();
        ctx.translate(hx + 16, topY);

        // Warm dressed honey-limestone masonry (`tex.warmLimestoneBrick`) + sunlit golden directional shading
        ctx.fillStyle = tex.warmLimestoneBrick;
        ctx.fillRect(0, 0, bw, bh);
        const tintG = ctx.createLinearGradient(0, 0, bw, bh);
        tintG.addColorStop(0, 'rgba(180, 83, 9, 0.16)');
        tintG.addColorStop(0.55, 'rgba(251, 191, 36, 0.08)');
        tintG.addColorStop(1, 'rgba(68, 32, 16, 0.28)');
        ctx.fillStyle = tintG;
        ctx.fillRect(0, 0, bw, bh);
        // Deep cast drop shadow beneath the overhanging roof eaves
        ctx.fillStyle = 'rgba(28, 12, 6, 0.38)';
        ctx.fillRect(0, 8, bw, 13);
        ctx.strokeStyle = '#3b1d14';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, bw, bh);

        // Protruding Alternating Chiseled Limestone Corner Quoins & Molded Floor Stringcourses
        for (let qy = 12; qy < bh - 16; qy += 22) {
          const qw = (Math.floor(qy / 22) % 2 === 0) ? 18 : 12;
          ctx.fillStyle = '#f5ebe0';
          ctx.strokeStyle = '#785a40';
          ctx.lineWidth = 1.1;
          ctx.fillRect(-1, qy, qw, 18); ctx.strokeRect(-1, qy, qw, 18);
          ctx.fillRect(bw - qw + 1, qy, qw, 18); ctx.strokeRect(bw - qw + 1, qy, qw, 18);
        }
        // Carved cornice belt & wooden rafter tails under the eaves
        ctx.fillStyle = '#5c2d1b';
        ctx.fillRect(-12, 0, bw + 24, 9);
        ctx.fillStyle = '#e7d8c5';
        ctx.fillRect(-6, 9, bw + 12, 5);
        ctx.fillStyle = '#3b1a0e';
        for (let rx = 8; rx < bw - 4; rx += 22) {
          ctx.fillRect(rx, 8, 5, 8);
        }

        // Hipped Terracotta Barrel-Tile Roof (`tex.terracottaShingles`) with Sculpted Ridge CapTiles & Chimney
        ctx.fillStyle = '#b45309';
        ctx.strokeStyle = '#3b150e';
        ctx.lineWidth = 1.5;
        ctx.fillRect(46, -86, 26, 34); ctx.strokeRect(46, -86, 26, 34);
        ctx.fillStyle = '#e7d8c5';
        ctx.fillRect(43, -90, 32, 5);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-22, 6);
        ctx.lineTo(40, -64);
        ctx.lineTo(bw - 40, -64);
        ctx.lineTo(bw + 22, 6);
        ctx.closePath();
        ctx.fillStyle = tex.terracottaShingles;
        ctx.fill();
        const rShade = ctx.createLinearGradient(0, -64, 0, 6);
        rShade.addColorStop(0, 'rgba(254, 240, 138, 0.18)');
        rShade.addColorStop(1, 'rgba(28, 10, 6, 0.34)');
        ctx.fillStyle = rShade;
        ctx.fill();
        ctx.strokeStyle = '#3b150e';
        ctx.lineWidth = 2.4;
        ctx.stroke();
        ctx.restore();
        // Scalloped terracotta ridge tiles & hip seams
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-18, 4); ctx.lineTo(40, -64);
        ctx.moveTo(bw + 18, 4); ctx.lineTo(bw - 40, -64);
        ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        for (let tx = 40; tx < bw - 44; tx += 14) {
          ctx.beginPath(); ctx.roundRect(tx, -67, 13, 5, 2); ctx.fill();
        }

        // Upper Arched French Balcony Doors with Open Louvered Timber Shutters, Carved Keystones & Sheer Curtains!
        for (const wx of [36, 115, 194]) {
          // Open olive-teal wooden louvered shutters on both sides
          ctx.fillStyle = '#2d4f43';
          ctx.strokeStyle = '#13261f';
          ctx.lineWidth = 1.2;
          ctx.fillRect(wx - 12, 34, 11, 78); ctx.strokeRect(wx - 12, 34, 11, 78);
          ctx.fillRect(wx + 49, 34, 11, 78); ctx.strokeRect(wx + 49, 34, 11, 78);
          // Stone arch surround & keystone
          ctx.fillStyle = '#f5ebe0';
          ctx.strokeStyle = '#785a40';
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.roundRect(wx - 3, 24, 54, 90, [26, 26, 2, 2]); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#fff7ed';
          ctx.fillRect(wx + 20, 21, 8, 8); ctx.strokeRect(wx + 20, 21, 8, 8);
          // Glowing room interior
          const wg = ctx.createLinearGradient(wx, 28, wx, 116);
          wg.addColorStop(0, '#fffbeb'); wg.addColorStop(0.55, '#fde68a'); wg.addColorStop(1, '#d97706');
          ctx.fillStyle = wg; ctx.strokeStyle = '#3b1d14'; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.roundRect(wx, 28, 48, 86, [22, 22, 2, 2]); ctx.fill(); ctx.stroke();
          // Sheer draped curtains
          ctx.fillStyle = 'rgba(255, 241, 242, 0.58)';
          ctx.beginPath(); ctx.moveTo(wx + 2, 34); ctx.quadraticCurveTo(wx + 16, 62, wx + 6, 112); ctx.lineTo(wx + 2, 112); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.moveTo(wx + 46, 34); ctx.quadraticCurveTo(wx + 32, 62, wx + 42, 112); ctx.lineTo(wx + 46, 112); ctx.closePath(); ctx.fill();
          // French window mullions & fanlight spokes
          ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(wx + 24, 28); ctx.lineTo(wx + 24, 114);
          ctx.moveTo(wx, 52); ctx.lineTo(wx + 48, 52);
          ctx.moveTo(wx, 82); ctx.lineTo(wx + 48, 82);
          ctx.stroke();
        }

        // Carved Stone Balcony Slab with Corbel Brackets & Ornate Wrought-Iron Scrollwork Rail
        ctx.fillStyle = 'rgba(28, 12, 6, 0.32)';
        ctx.fillRect(16, 122, bw - 32, 9);
        ctx.fillStyle = '#f5ebe0'; ctx.strokeStyle = '#57534e'; ctx.lineWidth = 1.5;
        ctx.fillRect(16, 114, bw - 32, 9); ctx.strokeRect(16, 114, bw - 32, 9);
        for (let cx = 28; cx < bw - 24; cx += 36) {
          ctx.fillStyle = '#d6c7b2';
          ctx.fillRect(cx, 123, 8, 9); ctx.strokeRect(cx, 123, 8, 9);
        }
        ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.8;
        ctx.strokeRect(20, 92, bw - 40, 22);
        for (let rx = 30; rx < bw - 26; rx += 14) {
          ctx.beginPath(); ctx.moveTo(rx, 92); ctx.lineTo(rx, 114); ctx.stroke();
          ctx.beginPath(); ctx.arc(rx + 7, 103, 3.2, 0, Math.PI * 2); ctx.stroke();
        }

        // Ground-Floor Arched Stone Loggia Colonnade (3 deep vaulted arches with Tuscan columns, stone keystones & courtyard glow!)
        for (let a = 0; a < 3; a++) {
          const ax = 26 + a * 82;
          // Recessed stone arch mold
          ctx.fillStyle = '#f5ebe0'; ctx.strokeStyle = '#785a40'; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.roundRect(ax - 4, bh - 108, 70, 108, [35, 35, 0, 0]); ctx.fill(); ctx.stroke();
          const archG = ctx.createLinearGradient(ax, bh - 104, ax, bh);
          archG.addColorStop(0, '#1f0f12'); archG.addColorStop(0.55, '#3b1d16'); archG.addColorStop(1, '#6b341e');
          ctx.fillStyle = archG; ctx.strokeStyle = '#291512'; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.roundRect(ax, bh - 104, 62, 104, [31, 31, 0, 0]); ctx.fill(); ctx.stroke();
          // Warm glowing courtyard window/door inside arch + hanging wrought-iron lantern
          ctx.fillStyle = 'rgba(254, 240, 138, 0.28)';
          ctx.beginPath(); ctx.arc(ax + 31, bh - 74, 18, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath(); ctx.arc(ax + 31, bh - 74, 4.2, 0, Math.PI * 2); ctx.fill();
        }

        // Lush Climbing Crimson-Magenta Bougainvillea Vines cascading down left wall & balcony!
        ctx.fillStyle = '#15803d';
        for (const [vx, vy, r] of [[12, 114, 14], [24, 122, 12], [8, 136, 13], [18, 152, 11], [10, 174, 10], [42, 118, 10]]) {
          ctx.beginPath(); ctx.arc(vx, vy, r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#e11d48';
        for (const [bx, by] of [[10, 110], [22, 118], [6, 132], [18, 142], [12, 162], [38, 116], [16, 126]]) {
          ctx.beginPath(); ctx.arc(bx, by, 4.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#fda4af';
        for (const [bx, by] of [[11, 109], [23, 117], [17, 141]]) {
          ctx.beginPath(); ctx.arc(bx, by, 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        drawCypress(hx + 340, groundY, 215, 22);
        drawPainterlyBlossomTree(hx + 408, groundY, 0.92);
      } else if (style === 1) {
        // LANDMARK 1: Elegant Parisian Corner Dawn Patisserie & Artisan Bakery Townhouse (Textured Dressed Limestone, Scalloped Blue-Slate Mansard Roof & Ornate Wood-Paneled Storefront!)
        const bw = 252, bh = 258, topY = groundY - bh;
        ctx.save();
        ctx.translate(hx + 22, topY);

        // Dressed Warm Cream Limestone Upper Facade (`tex.warmLimestoneBrick`) + Molded Stone Cornices
        ctx.fillStyle = tex.warmLimestoneBrick;
        ctx.fillRect(0, 0, bw, bh - 110);
        const uShade = ctx.createLinearGradient(0, 0, bw, 0);
        uShade.addColorStop(0, 'rgba(255, 251, 235, 0.24)');
        uShade.addColorStop(0.7, 'rgba(254, 243, 199, 0.12)');
        uShade.addColorStop(1, 'rgba(68, 42, 24, 0.25)');
        ctx.fillStyle = uShade;
        ctx.fillRect(0, 0, bw, bh - 110);

        // Carved emerald-green & gold Regency wood-paneled patisserie ground floor
        const sfG = ctx.createLinearGradient(0, bh - 110, 0, bh);
        sfG.addColorStop(0, '#1f3a2e'); sfG.addColorStop(0.5, '#162c22'); sfG.addColorStop(1, '#0d1b15');
        ctx.fillStyle = sfG;
        ctx.fillRect(0, bh - 110, bw, 110);
        // Stone corner quoins on upper floor & carved fluted pilasters on ground floor
        for (let qy = 10; qy < bh - 118; qy += 22) {
          const qw = (Math.floor(qy / 22) % 2 === 0) ? 16 : 10;
          ctx.fillStyle = '#f5ebe0'; ctx.strokeStyle = '#785a40'; ctx.lineWidth = 1;
          ctx.fillRect(0, qy, qw, 18); ctx.strokeRect(0, qy, qw, 18);
          ctx.fillRect(bw - qw, qy, qw, 18); ctx.strokeRect(bw - qw, qy, qw, 18);
        }
        // Molded stone stringcourse & gold patisserie frieze band
        ctx.fillStyle = '#f5ebe0'; ctx.strokeStyle = '#57534e'; ctx.lineWidth = 1.4;
        ctx.fillRect(-6, bh - 116, bw + 12, 8); ctx.strokeRect(-6, bh - 116, bw + 12, 8);
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.4;
        ctx.strokeRect(6, bh - 105, bw - 12, 100);
        ctx.strokeStyle = '#1b2b22'; ctx.lineWidth = 2; ctx.strokeRect(0, 0, bw, bh);

        // Red-Brick Chimney with Terracotta Pots & Gentle Drifting Morning Hearth Smoke
        ctx.fillStyle = '#7c2d12'; ctx.strokeStyle = '#2d1008'; ctx.lineWidth = 1.5;
        ctx.fillRect(bw - 56, -84, 28, 56); ctx.strokeRect(bw - 56, -84, 28, 56);
        ctx.fillStyle = '#e7d8c5'; ctx.fillRect(bw - 59, -87, 34, 5);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(bw - 52, -96, 8, 9); ctx.fillRect(bw - 39, -96, 8, 9);
        for (let p = 0; p < 4; p++) {
          const lift = (time * 16 + p * 18 + Math.abs(i) * 7) % 62;
          ctx.fillStyle = `rgba(255, 247, 237, ${0.24 * (1 - lift / 62)})`;
          ctx.beginPath(); ctx.arc(bw - 43 + lift * 0.35, -98 - lift, 7 + lift * 0.16, 0, Math.PI * 2); ctx.fill();
        }

        // Textured Scalloped Blue-Slate Mansard Roof (`tex.slateRoofTiles`) + Zinc/Copper Ridge Cresting & Pedimented Dormer Windows!
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-14, 8);
        ctx.lineTo(18, -64);
        ctx.lineTo(bw - 18, -64);
        ctx.lineTo(bw + 14, 8);
        ctx.closePath();
        ctx.fillStyle = tex.slateRoofTiles;
        ctx.fill();
        const mShade = ctx.createLinearGradient(0, -64, 0, 8);
        mShade.addColorStop(0, 'rgba(226, 232, 240, 0.16)');
        mShade.addColorStop(1, 'rgba(15, 23, 42, 0.38)');
        ctx.fillStyle = mShade;
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.restore();
        // Ornate zinc & verdigris-copper roof ridge cresting + moulded eave cornice
        ctx.fillStyle = '#22a699';
        ctx.fillRect(18, -68, bw - 36, 4);
        ctx.fillStyle = '#f5ebe0';
        ctx.fillRect(-14, 4, bw + 28, 6);
        // Cast drop shadow under mansard cornice
        ctx.fillStyle = 'rgba(20, 12, 8, 0.32)';
        ctx.fillRect(0, 10, bw, 8);

        // Two Carved Limestone Pedimented Dormer Attic Windows
        for (const dx of [58, 154]) {
          // Dormer stone casing & triangular pediment roof
          ctx.fillStyle = '#e7d8c5'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.6;
          ctx.fillRect(dx - 4, -46, 44, 44); ctx.strokeRect(dx - 4, -46, 44, 44);
          ctx.fillStyle = '#334155';
          ctx.beginPath(); ctx.moveTo(dx - 8, -46); ctx.lineTo(dx + 18, -62); ctx.lineTo(dx + 44, -46); ctx.closePath(); ctx.fill(); ctx.stroke();
          // Glowing dormer window pane
          const dwG = ctx.createLinearGradient(dx, -42, dx, -6);
          dwG.addColorStop(0, '#fffbeb'); dwG.addColorStop(1, '#f59e0b');
          ctx.fillStyle = dwG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.roundRect(dx + 2, -41, 32, 35, [15, 15, 2, 2]); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.moveTo(dx + 18, -41); ctx.lineTo(dx + 18, -6); ctx.moveTo(dx + 2, -22); ctx.lineTo(dx + 34, -22); ctx.stroke();
        }

        // Second-Floor Sunlit Shuttered Windows with Stone Surrounds, Interior Curtains & Overflowing Geranium Boxes
        for (const wx of [36, 148]) {
          // Stone architrave frame & pediment header
          ctx.fillStyle = '#f5ebe0'; ctx.strokeStyle = '#785a40'; ctx.lineWidth = 1.2;
          ctx.fillRect(wx - 4, 24, 76, 74); ctx.strokeRect(wx - 4, 24, 76, 74);
          ctx.fillRect(wx - 7, 20, 82, 5); ctx.strokeRect(wx - 7, 20, 82, 5);
          // Louvered sage-green timber shutters with horizontal slats
          ctx.fillStyle = '#2d4f43'; ctx.strokeStyle = '#14221d'; ctx.lineWidth = 1.3;
          ctx.fillRect(wx - 16, 28, 13, 66); ctx.strokeRect(wx - 16, 28, 13, 66);
          ctx.fillRect(wx + 71, 28, 13, 66); ctx.strokeRect(wx + 71, 28, 13, 66);
          ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)'; ctx.lineWidth = 1;
          for (let sy = 33; sy < 90; sy += 6) {
            ctx.beginPath();
            ctx.moveTo(wx - 14, sy); ctx.lineTo(wx - 5, sy);
            ctx.moveTo(wx + 73, sy); ctx.lineTo(wx + 82, sy);
            ctx.stroke();
          }
          // Glowing warm room interior + curtains + mullions
          const wg = ctx.createLinearGradient(wx, 28, wx, 94);
          wg.addColorStop(0, '#fffbeb'); wg.addColorStop(0.6, '#fde68a'); wg.addColorStop(1, '#d97706');
          ctx.fillStyle = wg; ctx.strokeStyle = '#2d1a14'; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.roundRect(wx, 28, 68, 66, [10, 10, 2, 2]); ctx.fill(); ctx.stroke();
          ctx.fillStyle = 'rgba(180, 83, 9, 0.28)';
          ctx.fillRect(wx + 2, 32, 11, 60); ctx.fillRect(wx + 55, 32, 11, 60);
          ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(wx + 34, 28); ctx.lineTo(wx + 34, 94);
          ctx.moveTo(wx, 58); ctx.lineTo(wx + 68, 58);
          ctx.stroke();
          // Carved wood flower box with red geraniums
          ctx.fillStyle = '#5c3417'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.2;
          ctx.fillRect(wx - 5, 92, 78, 10); ctx.strokeRect(wx - 5, 92, 78, 10);
          ctx.fillStyle = '#15803d';
          for (let lx = 0; lx < 70; lx += 10) { ctx.beginPath(); ctx.arc(wx + lx, 89, 5.5, 0, Math.PI * 2); ctx.fill(); }
          ctx.fillStyle = '#f43f5e';
          for (let fl = 5; fl < 66; fl += 12) { ctx.beginPath(); ctx.arc(wx + fl, 87, 3.2, 0, Math.PI * 2); ctx.fill(); }
        }

        // Warm Glowing Ground-Floor Bakery Display Window + Tiered Pastry Shelves + Scalloped Olive & Cream Awning!
        const bWinG = ctx.createLinearGradient(0, bh - 82, 0, bh - 14);
        bWinG.addColorStop(0, '#fffbeb'); bWinG.addColorStop(0.55, '#fde047'); bWinG.addColorStop(1, '#d97706');
        ctx.fillStyle = bWinG; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.roundRect(18, bh - 82, 146, 64, 6); ctx.fill(); ctx.stroke();
        // Brass display shelf & golden croissants/loaves + hanging pendant lamps inside bakery window
        ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(22, bh - 44); ctx.lineTo(160, bh - 44); ctx.stroke();
        ctx.fillStyle = '#b45309';
        for (const lx of [40, 74, 108, 142]) {
          ctx.beginPath(); ctx.ellipse(lx, bh - 26, 11, 6.5, 0, Math.PI, 0); ctx.fill();
          ctx.beginPath(); ctx.ellipse(lx, bh - 45, 8, 4.5, 0, Math.PI, 0); ctx.fill();
        }
        // Paneled Mahogany & Brass French Café Door
        ctx.fillStyle = '#4a1d0d'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.roundRect(178, bh - 84, 54, 84, [24, 24, 0, 0]); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.roundRect(186, bh - 74, 38, 38, [18, 18, 2, 2]); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#4a1d0d'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(205, bh - 74); ctx.lineTo(205, bh - 36); ctx.moveTo(186, bh - 54); ctx.lineTo(224, bh - 54); ctx.stroke();
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(222, bh - 30, 2.5, 0, Math.PI * 2); ctx.fill();
        // Scalloped olive-green & cream striped canvas canopy with drop shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
        ctx.fillRect(10, bh - 82, 232, 8);
        for (let st = 0; st < 8; st++) {
          ctx.fillStyle = st % 2 === 0 ? '#166534' : '#fef3c7';
          ctx.fillRect(8 + st * 29, bh - 108, 29, 20);
          ctx.beginPath(); ctx.arc(22.5 + st * 29, bh - 88, 14.5, 0, Math.PI); ctx.fill();
        }
        ctx.restore();
        drawPainterlyBlossomTree(hx + 362, groundY, 1.05);
      } else if (style === 2) {
        // LANDMARK 2: Open Sunlit Stone Garden Pavilion & Cypress Overlook (gives the skyline breathtaking openness & variety!)
        ctx.save();
        ctx.translate(hx + 30, groundY);
        // Sculpted Limestone Garden Balustrade Wall overlooking rolling sunrise valley
        ctx.fillStyle = '#d6d3d1'; ctx.strokeStyle = '#57534e'; ctx.lineWidth = 1.6;
        ctx.fillRect(0, -52, 360, 10); ctx.strokeRect(0, -52, 360, 10);
        ctx.fillRect(0, -14, 360, 14); ctx.strokeRect(0, -14, 360, 14);
        for (let bx = 18; bx < 350; bx += 24) {
          ctx.fillStyle = '#a8a29e'; ctx.fillRect(bx, -42, 8, 28); ctx.strokeRect(bx, -42, 8, 28);
        }
        // Grand Carved Stone Gazebo Archway Pavilion with Textured Weathered Verdigris Copper Dome & Ribbed Seams!
        const px0 = 180;
        ctx.save();
        ctx.beginPath(); ctx.arc(px0, -172, 74, Math.PI, 0); ctx.closePath();
        ctx.fillStyle = tex.verdigrisCopper; ctx.fill();
        const domeG = ctx.createRadialGradient(px0 - 26, -222, 6, px0, -184, 82);
        domeG.addColorStop(0, 'rgba(167, 243, 208, 0.36)');
        domeG.addColorStop(0.55, 'rgba(13, 148, 136, 0.08)');
        domeG.addColorStop(1, 'rgba(2, 22, 19, 0.62)');
        ctx.fillStyle = domeG; ctx.fill();
        ctx.clip();
        // Curved meridian standing-seam copper ribs converging toward the finial apex
        for (const rx of [-54, -36, -18, 0, 18, 36, 54]) {
          ctx.strokeStyle = 'rgba(2, 22, 19, 0.65)'; ctx.lineWidth = 2.1;
          ctx.beginPath(); ctx.moveTo(px0, -246); ctx.quadraticCurveTo(px0 + rx * 0.72, -214, px0 + rx, -172); ctx.stroke();
          ctx.strokeStyle = 'rgba(167, 243, 208, 0.38)'; ctx.lineWidth = 1.0;
          ctx.beginPath(); ctx.moveTo(px0 + 1, -246); ctx.quadraticCurveTo(px0 + rx * 0.72 + 1.4, -214, px0 + rx + 1.4, -172); ctx.stroke();
        }
        // Horizontal riveted copper sheet lap bands across the dome
        for (const by of [-220, -196]) {
          ctx.strokeStyle = 'rgba(4, 28, 24, 0.52)'; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(px0 - 74, by); ctx.quadraticCurveTo(px0, by - 7, px0 + 74, by); ctx.stroke();
          ctx.strokeStyle = 'rgba(167, 243, 208, 0.25)'; ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.moveTo(px0 - 74, by + 1.5); ctx.quadraticCurveTo(px0, by - 5.5, px0 + 74, by + 1.5); ctx.stroke();
        }
        // Warm weathered bronze base cornice ring
        ctx.fillStyle = '#78350f'; ctx.fillRect(px0 - 76, -176, 152, 4.5);
        ctx.restore();
        ctx.strokeStyle = '#042f2e'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(px0, -172, 74, Math.PI, 0); ctx.closePath(); ctx.stroke();
        // Ornate golden finial base & orb atop gazebo dome (pure architectural orb — zero religious symbols)
        ctx.fillStyle = '#b45309'; ctx.beginPath(); ctx.ellipse(px0, -246, 8, 3.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fde047'; ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(px0, -253, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Stone entablature beam & 4 fluted columns
        ctx.fillStyle = '#e7e5e4'; ctx.strokeStyle = '#44403c'; ctx.lineWidth = 1.6;
        ctx.fillRect(px0 - 84, -176, 168, 16); ctx.strokeRect(px0 - 84, -176, 168, 16);
        for (const colX of [px0 - 68, px0 - 24, px0 + 24, px0 + 68]) {
          const cG = ctx.createLinearGradient(colX - 8, 0, colX + 8, 0);
          cG.addColorStop(0, '#78716c'); cG.addColorStop(0.45, '#f5f5f4'); cG.addColorStop(1, '#57534e');
          ctx.fillStyle = cG; ctx.fillRect(colX - 7, -160, 14, 146); ctx.strokeRect(colX - 7, -160, 14, 146);
        }
        // Hanging glowing rose-gold pavilion lantern inside gazebo
        ctx.strokeStyle = '#44403c'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px0, -160); ctx.lineTo(px0, -124); ctx.stroke();
        ctx.fillStyle = 'rgba(254, 240, 138, 0.35)'; ctx.beginPath(); ctx.arc(px0, -118, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(px0, -118, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        drawCypress(hx + 58, groundY, 225, 22);
        drawCypress(hx + 365, groundY, 198, 20);
        drawPainterlyBlossomTree(hx + 422, groundY, 0.88);
      } else {
        // LANDMARK 3: Storybook Stone & Half-Timbered Manor House with Carved Stone Turret & Ribbed Verdigris Copper Cupola!
        const bw = 268, bh = 306, topY = groundY - bh;
        ctx.save();
        ctx.translate(hx + 18, topY);

        // 1. Rusticated Ashlar Stone Ground Floor (`tex.ashlarStone`) + Warm Sunlit Limestone/Plaster Upper Floors (`tex.warmLimestoneBrick`)
        ctx.fillStyle = tex.ashlarStone;
        ctx.fillRect(0, bh - 116, bw - 36, 116);
        ctx.fillStyle = tex.warmLimestoneBrick;
        ctx.fillRect(0, 0, bw - 36, bh - 116);
        const manorLight = ctx.createLinearGradient(0, 0, bw - 36, 0);
        manorLight.addColorStop(0, 'rgba(255, 251, 235, 0.28)');
        manorLight.addColorStop(0.7, 'rgba(254, 243, 199, 0.14)');
        manorLight.addColorStop(1, 'rgba(40, 20, 12, 0.32)');
        ctx.fillStyle = manorLight;
        ctx.fillRect(0, 0, bw - 36, bh - 116);

        // Protruding Stone Corner Quoins on Left Edge & Molded Stone Corbel Belt Between Ground & Upper Floors
        for (let qy = 14; qy < bh - 12; qy += 22) {
          const qw = (Math.floor(qy / 22) % 2 === 0) ? 16 : 11;
          ctx.fillStyle = '#e7d8c5'; ctx.strokeStyle = '#57534e'; ctx.lineWidth = 1;
          ctx.fillRect(-1, qy, qw, 18); ctx.strokeRect(-1, qy, qw, 18);
        }
        // Cast drop shadow under overhanging upper timbered jetty floor
        ctx.fillStyle = 'rgba(15, 8, 4, 0.38)';
        ctx.fillRect(0, bh - 110, bw - 36, 10);
        ctx.fillRect(0, 8, bw - 36, 11);

        // Authentic Hand-Hewn Dark Oak Half-Timber Framing with Diagonal Braces, Carved Jetty Corbels & Pegged Joints!
        const oakG = ctx.createLinearGradient(0, 0, 0, bh - 112);
        oakG.addColorStop(0, '#4a2518'); oakG.addColorStop(0.5, '#361a10'); oakG.addColorStop(1, '#241009');
        ctx.fillStyle = oakG;
        ctx.fillRect(0, 0, bw - 36, 8);
        ctx.fillRect(0, 96, bw - 36, 8);
        ctx.fillRect(-4, bh - 118, bw - 32, 9);
        ctx.fillRect(0, 0, 8, bh - 116);
        ctx.fillRect(104, 0, 8, bh - 116);
        ctx.fillRect(bw - 44, 0, 8, bh - 116);
        // Diagonal Tudor oak braces & wooden pegs
        ctx.strokeStyle = '#361a10';
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        ctx.moveTo(8, 96); ctx.lineTo(34, 8);
        ctx.moveTo(104, 96); ctx.lineTo(78, 8);
        ctx.moveTo(8, bh - 118); ctx.lineTo(32, 104);
        ctx.moveTo(104, bh - 118); ctx.lineTo(80, 104);
        ctx.stroke();
        // Carved oak corbel brackets supporting the overhanging upper floor
        ctx.fillStyle = '#4a2518';
        for (const cx of [14, 62, 108, 158, 198]) {
          ctx.fillRect(cx, bh - 109, 7, 10);
        }

        // Steep Overhanging Terracotta-Shingled Gable Roof (`tex.terracottaShingles`) with Carved Wooden Bargeboards & Chimney!
        ctx.fillStyle = '#7c2d12'; ctx.strokeStyle = '#2d1008'; ctx.lineWidth = 1.5;
        ctx.fillRect(34, -68, 24, 38); ctx.strokeRect(34, -68, 24, 38);
        ctx.fillStyle = '#e7d8c5'; ctx.fillRect(31, -72, 30, 5);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-20, 10);
        ctx.lineTo(108, -76);
        ctx.lineTo(232, 10);
        ctx.closePath();
        ctx.fillStyle = tex.terracottaShingles;
        ctx.fill();
        const gShade = ctx.createLinearGradient(0, -76, 0, 10);
        gShade.addColorStop(0, 'rgba(254, 240, 138, 0.2)');
        gShade.addColorStop(1, 'rgba(28, 10, 6, 0.35)');
        ctx.fillStyle = gShade;
        ctx.fill();
        ctx.restore();
        // Carved timber gable bargeboards & finial spike
        ctx.strokeStyle = '#3b190e';
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(-22, 11); ctx.lineTo(108, -77); ctx.lineTo(234, 11);
        ctx.stroke();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-20, 10); ctx.lineTo(108, -75); ctx.lineTo(232, 10);
        ctx.stroke();

        // 2. Cylindrical Dressed-Stone Corner Turret (`tex.warmLimestoneBrick` + 3D Cylindrical Shading + Carved Corbel Crown!)
        const turX = bw - 48;
        ctx.save();
        ctx.beginPath();
        ctx.rect(turX - 38, -28, 76, bh + 28);
        ctx.clip();
        ctx.fillStyle = tex.warmLimestoneBrick;
        ctx.fillRect(turX - 38, -28, 76, bh + 28);
        // Lower turret stone plinth in darker ashlar stone
        ctx.fillStyle = tex.ashlarStone;
        ctx.fillRect(turX - 38, bh - 116, 76, 116);
        // 3D cylindrical light-and-shadow wrap across the round stone turret
        const turG = ctx.createLinearGradient(turX - 38, 0, turX + 38, 0);
        turG.addColorStop(0, 'rgba(20, 14, 12, 0.62)');
        turG.addColorStop(0.28, 'rgba(255, 251, 235, 0.22)');
        turG.addColorStop(0.55, 'rgba(254, 240, 138, 0.08)');
        turG.addColorStop(1, 'rgba(15, 10, 8, 0.68)');
        ctx.fillStyle = turG;
        ctx.fillRect(turX - 38, -28, 76, bh + 28);
        // Curved horizontal stone stringcourse bands wrapping around the turret
        for (const sy of [58, 168, bh - 116]) {
          ctx.fillStyle = '#e7d8c5';
          ctx.strokeStyle = '#44403c';
          ctx.lineWidth = 1.2;
          ctx.fillRect(turX - 38, sy, 76, 6);
          ctx.strokeRect(turX - 38, sy, 76, 6);
        }
        ctx.restore();
        ctx.strokeStyle = '#291d18';
        ctx.lineWidth = 2;
        ctx.strokeRect(turX - 38, -28, 76, bh + 28);
        // Carved stone machicolation corbel crown directly beneath the copper turret dome
        ctx.fillStyle = '#d6c7b2';
        ctx.strokeStyle = '#44403c';
        ctx.lineWidth = 1.3;
        ctx.fillRect(turX - 41, -33, 82, 6);
        ctx.strokeRect(turX - 41, -33, 82, 6);
        for (let cx = turX - 36; cx <= turX + 30; cx += 13) {
          ctx.fillRect(cx, -27, 6, 7);
          ctx.strokeRect(cx, -27, 6, 7);
        }

        // Textured Weathered Verdigris Copper Turret Spire Dome with Standing-Seam Ribs!
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(turX - 43, -31);
        ctx.quadraticCurveTo(turX - 25, -86, turX, -106);
        ctx.quadraticCurveTo(turX + 25, -86, turX + 43, -31);
        ctx.closePath();
        ctx.fillStyle = tex.verdigrisCopper; ctx.fill();
        const copG = ctx.createLinearGradient(turX - 43, -66, turX + 43, -66);
        copG.addColorStop(0, 'rgba(2, 22, 19, 0.55)');
        copG.addColorStop(0.32, 'rgba(167, 243, 208, 0.34)');
        copG.addColorStop(0.6, 'rgba(13, 148, 136, 0.08)');
        copG.addColorStop(1, 'rgba(2, 18, 16, 0.65)');
        ctx.fillStyle = copG; ctx.fill();
        ctx.clip();
        for (const rx of [-26, -13, 0, 13, 26]) {
          ctx.strokeStyle = 'rgba(2, 22, 19, 0.62)'; ctx.lineWidth = 1.9;
          ctx.beginPath(); ctx.moveTo(turX, -106); ctx.quadraticCurveTo(turX + rx * 0.62, -68, turX + rx, -31); ctx.stroke();
          ctx.strokeStyle = 'rgba(167, 243, 208, 0.35)'; ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.moveTo(turX + 1, -106); ctx.quadraticCurveTo(turX + rx * 0.62 + 1.2, -68, turX + rx + 1.2, -31); ctx.stroke();
        }
        for (const by of [-76, -52]) {
          ctx.strokeStyle = 'rgba(4, 28, 24, 0.52)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(turX - 41, by); ctx.quadraticCurveTo(turX, by - 4, turX + 41, by); ctx.stroke();
        }
        ctx.fillStyle = '#78350f'; ctx.fillRect(turX - 44, -35, 88, 4);
        ctx.restore();
        ctx.strokeStyle = '#042f2e'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(turX - 43, -31);
        ctx.quadraticCurveTo(turX - 25, -86, turX, -106);
        ctx.quadraticCurveTo(turX + 25, -86, turX + 43, -31);
        ctx.closePath(); ctx.stroke();
        ctx.fillStyle = '#fde047'; ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(turX, -110, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // 3. Detailed Arched Manor & Turret Windows (Stone Arch Surrounds, Louvered Shutters, Warm Curtained Rooms, Leaded Mullions & Flower Boxes!)
        for (const [wx, wy, ww, wh, isTurret] of [
          [24, 24, 62, 56, false],
          [122, 24, 48, 56, false],
          [24, 116, 62, 56, false],
          [122, 116, 48, 56, false],
          [turX - 17, -6, 34, 48, true],
          [turX - 17, 96, 34, 52, true],
          [turX - 17, bh - 92, 34, 50, true],
        ]) {
          // Carved stone architrave surround & sill
          ctx.fillStyle = '#e7d8c5'; ctx.strokeStyle = '#57534e'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.roundRect(wx - 3, wy - 3, ww + 6, wh + 6, [ww * 0.44, ww * 0.44, 2, 2]); ctx.fill(); ctx.stroke();
          if (!isTurret) {
            // Open dark-forest louvered wooden shutters
            ctx.fillStyle = '#1e3a2f'; ctx.strokeStyle = '#0d1b15'; ctx.lineWidth = 1.1;
            ctx.fillRect(wx - 12, wy + 8, 9, wh - 10); ctx.strokeRect(wx - 12, wy + 8, 9, wh - 10);
            ctx.fillRect(wx + ww + 3, wy + 8, 9, wh - 10); ctx.strokeRect(wx + ww + 3, wy + 8, 9, wh - 10);
          }
          // Warm glowing room interior
          const wg = ctx.createLinearGradient(wx, wy, wx, wy + wh);
          wg.addColorStop(0, '#fffbeb'); wg.addColorStop(0.55, '#fde68a'); wg.addColorStop(1, '#d97706');
          ctx.fillStyle = wg; ctx.strokeStyle = '#291512'; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, [ww * 0.4, ww * 0.4, 2, 2]); ctx.fill(); ctx.stroke();
          // Interior velvet curtains & warm pendant lamp silhouette
          ctx.fillStyle = 'rgba(153, 27, 27, 0.34)';
          ctx.fillRect(wx + 2, wy + 12, 8, wh - 14);
          ctx.fillRect(wx + ww - 10, wy + 12, 8, wh - 14);
          // Mullion crossbars
          ctx.strokeStyle = '#3b1e16'; ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh);
          ctx.moveTo(wx, wy + wh * 0.52); ctx.lineTo(wx + ww, wy + wh * 0.52);
          ctx.stroke();
          // Carved stone sill / flower box
          if (!isTurret) {
            ctx.fillStyle = '#5c3417'; ctx.fillRect(wx - 4, wy + wh - 1, ww + 8, 8);
            ctx.fillStyle = '#15803d';
            for (let lx = 2; lx < ww; lx += 10) { ctx.beginPath(); ctx.arc(wx + lx, wy + wh - 2, 4.5, 0, Math.PI * 2); ctx.fill(); }
            ctx.fillStyle = '#f43f5e';
            for (let fx = 6; fx < ww - 4; fx += 12) { ctx.beginPath(); ctx.arc(wx + fx, wy + wh - 4, 2.6, 0, Math.PI * 2); ctx.fill(); }
          } else {
            ctx.fillStyle = '#d6c7b2'; ctx.fillRect(wx - 5, wy + wh + 1, ww + 10, 5);
          }
        }

        // 4. Grand Carved Stone-Arched Oak Manor Portal with Wrought-Iron Strap Hinges, Stone Steps & Twin Glowing Coach Lanterns!
        const dx = 40, dw = 64, dh = 88;
        // Carved stone Tudor arch surround & keystone
        ctx.fillStyle = '#e7d8c5'; ctx.strokeStyle = '#57534e'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.roundRect(dx - 7, bh - dh - 7, dw + 14, dh + 7, [36, 36, 0, 0]); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f5ebe0'; ctx.fillRect(dx + dw / 2 - 6, bh - dh - 10, 12, 9); ctx.strokeRect(dx + dw / 2 - 6, bh - dh - 10, 12, 9);
        // Heavy paneled dark-oak double manor doors
        const doorG = ctx.createLinearGradient(dx, bh - dh, dx + dw, bh);
        doorG.addColorStop(0, '#5c2812'); doorG.addColorStop(0.5, '#431a08'); doorG.addColorStop(1, '#260d03');
        ctx.fillStyle = doorG; ctx.strokeStyle = '#1c0902'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(dx, bh - dh, dw, dh, [32, 32, 0, 0]); ctx.fill(); ctx.stroke();
        // Center door seam, arched fanlight window & wrought-iron strap hinges + brass knockers
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(dx + dw / 2, bh - dh + 26, 20, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#1c0902'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(dx + dw / 2, bh - dh + 6); ctx.lineTo(dx + dw / 2, bh); ctx.stroke();
        ctx.fillStyle = '#1e293b';
        for (const hy of [bh - 48, bh - 22]) {
          ctx.fillRect(dx + 2, hy, 14, 3);
          ctx.fillRect(dx + dw - 16, hy, 14, 3);
        }
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(dx + dw / 2 - 6, bh - 36, 2.4, 0, Math.PI * 2); ctx.arc(dx + dw / 2 + 6, bh - 36, 2.4, 0, Math.PI * 2); ctx.fill();
        // Twin glowing brass coach lanterns flanking the manor entrance
        for (const lx of [dx - 16, dx + dw + 16]) {
          ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
          ctx.beginPath(); ctx.arc(lx, bh - 56, 15, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#1e293b'; ctx.fillRect(lx - 3, bh - 62, 6, 11);
          ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(lx, bh - 56, 3.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        drawPainterlyBlossomTree(hx + 365, groundY, 0.98);
      }
    }

    // Drifting Sunlit Cherry-Blossom Petals Catching Golden Sunrise Light
    for (let p = 0; p < 32; p++) {
      const px = ((p * 179 + time * 48) % (w + 60)) - 30;
      const py = ((p * 83 + time * 28 + Math.sin(time * 2 + p) * 18) % (h - 60));
      ctx.save();
      ctx.translate(px, py); ctx.rotate(time * 2.1 + p);
      ctx.fillStyle = p % 2 === 0 ? 'rgba(255, 241, 242, 0.9)' : 'rgba(249, 168, 212, 0.85)';
      ctx.beginPath(); ctx.ellipse(0, 0, 4.8, 2.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  // =========================================================================
  // 9. ULTRA-DETAILED TEXTURED PLATFORMS & INTERACTIVE OBSTACLES
  // =========================================================================
  function drawPlatformExtended(ctx, p, px, py, nv, time) {
    ensureTextures(ctx);

    if (p.type === 'marble') {
      // Polished Veined Calacatta Marble Floor with Royal Gold Molding & Shadow Bevel
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = tex.veinedMarble;
      ctx.fillRect(0, 0, p.w, p.h);
      const depth = ctx.createLinearGradient(0, 0, 0, p.h);
      depth.addColorStop(0, 'rgba(255,255,255,0.28)'); depth.addColorStop(0.3, 'rgba(255,255,255,0)'); depth.addColorStop(1, 'rgba(15, 23, 42, 0.52)');
      ctx.fillStyle = depth; ctx.fillRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#b45309'; ctx.fillRect(0, 0, p.w, 7);
      ctx.fillStyle = '#fef08a'; ctx.fillRect(0, 1.5, p.w, 2.2);
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6; ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
      return;
    }

    if (p.type === 'display_case') {
      ctx.save();
      const baseTop = py + p.h * 0.44;
      const pedG = ctx.createLinearGradient(px, baseTop, px, py + p.h);
      pedG.addColorStop(0, '#881337'); pedG.addColorStop(0.5, '#4c0519'); pedG.addColorStop(1, '#26030d');
      ctx.fillStyle = pedG; ctx.strokeStyle = '#1f0505'; ctx.lineWidth = 1.6;
      ctx.fillRect(px, baseTop, p.w, p.h * 0.56); ctx.strokeRect(px, baseTop, p.w, p.h * 0.56);
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(px - 2, baseTop - 2, p.w + 4, 5);
      ctx.fillStyle = '#fef08a'; ctx.fillRect(px - 2, baseTop - 1, p.w + 4, 1.5);
      ctx.fillStyle = '#d97706'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1;
      ctx.fillRect(px + p.w * 0.28, baseTop + 14, p.w * 0.44, 11); ctx.strokeRect(px + p.w * 0.28, baseTop + 14, p.w * 0.44, 11);

      // Tempered Glass Vitrine + Specular Reflection Streak + Golden Crown Relic
      ctx.fillStyle = 'rgba(186, 230, 253, 0.24)'; ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 2;
      ctx.fillRect(px + 3, py, p.w - 6, p.h * 0.44); ctx.strokeRect(px + 3, py, p.w - 6, p.h * 0.44);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath(); ctx.moveTo(px + 10, py + 2); ctx.lineTo(px + 26, py + 2); ctx.lineTo(px + 12, baseTop - 3); ctx.lineTo(px + 4, baseTop - 3); ctx.closePath(); ctx.fill();
      const rx = px + p.w / 2, ry = py + p.h * 0.25;
      ctx.fillStyle = '#fde047'; ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(rx - 13, ry + 8); ctx.lineTo(rx - 15, ry - 6); ctx.lineTo(rx - 5, ry + 1);
      ctx.lineTo(rx, ry - 12); ctx.lineTo(rx + 5, ry + 1); ctx.lineTo(rx + 15, ry - 6); ctx.lineTo(rx + 13, ry + 8);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(rx, ry + 2, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }

    if (p.type === 'chandelier') {
      ctx.save();
      const topY = (p.baseY || py) - 135;
      const cx = px + p.w / 2;
      ctx.strokeStyle = '#b45309'; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.moveTo(cx, topY); ctx.lineTo(cx, py); ctx.stroke();
      const chG = ctx.createLinearGradient(px, py, px, py + p.h);
      chG.addColorStop(0, '#fef08a'); chG.addColorStop(0.5, '#d97706'); chG.addColorStop(1, '#78350f');
      ctx.fillStyle = chG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(px, py, p.w, p.h, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e0f2fe';
      for (let x = px + 14; x < px + p.w - 10; x += 18) {
        ctx.beginPath(); ctx.moveTo(x, py + p.h); ctx.lineTo(x + 4, py + p.h + 12); ctx.lineTo(x - 4, py + p.h + 12); ctx.closePath(); ctx.fill();
      }
      for (const kx of [px + 12, px + p.w - 12]) {
        ctx.fillStyle = '#fffbeb'; ctx.fillRect(kx - 2.5, py - 12, 5, 12);
        ctx.fillStyle = 'rgba(254, 240, 138, 0.35)'; ctx.beginPath(); ctx.arc(kx, py - 15, 11, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(kx, py - 15 + Math.sin(time * 12 + kx) * 1.2, 4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      return;
    }

    if (p.type === 'phase_platform') {
      const cycle = (time + (p.phase || 0)) % 7.0;
      const solid = cycle < 5.4;
      const warn = cycle >= 4.3 && cycle < 5.4;
      const alpha = !solid ? 0.22 : warn ? (Math.floor(time * 12) % 2 === 0 ? 0.56 : 0.96) : 0.95;
      const fillFrac = solid ? Math.max(0, 1 - cycle / 5.4) : Math.max(0, (cycle - 5.4) / 1.6);
      ctx.save();
      ctx.globalAlpha = alpha;
      const g = ctx.createLinearGradient(px, py, px, py + p.h);
      g.addColorStop(0, '#bae6fd'); g.addColorStop(0.35, '#0ea5e9'); g.addColorStop(1, '#0369a1');
      ctx.fillStyle = solid ? g : 'rgba(56, 189, 248, 0.16)';
      ctx.strokeStyle = warn ? '#fde047' : '#e0f2fe'; ctx.lineWidth = 2;
      if (!solid) ctx.setLineDash([6, 5]);
      ctx.beginPath(); ctx.roundRect(px, py, p.w, p.h, 6); ctx.fill(); ctx.stroke();
      ctx.setLineDash([]);
      // Glowing phase duration / recharge bar so timing is effortlessly readable!
      const barW = Math.max(0, (p.w - 28) * fillFrac);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
      ctx.fillRect(px + 14, py + p.h - 5.5, p.w - 28, 3);
      ctx.fillStyle = warn ? '#fde047' : solid ? '#7dd3fc' : '#38bdf8';
      ctx.fillRect(px + 14, py + p.h - 5.5, barW, 3);
      ctx.fillStyle = warn ? '#fde047' : solid ? '#ffffff' : '#64748b';
      ctx.beginPath(); ctx.arc(px + 8.5, py + p.h / 2, 3.6, 0, Math.PI * 2); ctx.arc(px + p.w - 8.5, py + p.h / 2, 3.6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }

    if (p.type === 'laser_grid') {
      ctx.save();
      ctx.translate(px, py);
      const cycle = (time + (p.phase || 0)) % 3.2;
      const active = cycle >= 1.7 && cycle <= 2.9;
      const warn = cycle >= 1.1 && cycle < 1.7;
      ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
      ctx.fillRect(0, 2, p.w, 12); ctx.strokeRect(0, 2, p.w, 12);
      for (const ex of [2, p.w - 10]) {
        ctx.fillStyle = '#334155'; ctx.fillRect(ex, -22, 8, 26);
        ctx.fillStyle = active ? '#ef4444' : warn ? '#facc15' : '#64748b';
        ctx.beginPath(); ctx.arc(ex + 4, -15, 3, 0, Math.PI * 2); ctx.fill();
      }
      if (active) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.36)'; ctx.fillRect(8, -21, p.w - 16, 21);
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(8, -15); ctx.lineTo(p.w - 8, -15); ctx.moveTo(8, -6); ctx.lineTo(p.w - 8, -6); ctx.stroke();
      } else if (warn) {
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.72)'; ctx.lineWidth = 1.4; ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(8, -12); ctx.lineTo(p.w - 8, -12); ctx.stroke();
      }
      ctx.restore();
      return;
    }

    if (p.type === 'bridge_deck') {
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = tex.rivetedSteel; ctx.fillRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#991b1b'; ctx.fillRect(0, 12, p.w, 15);
      ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.4; ctx.strokeRect(0, 12, p.w, 15);
      ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let tx = 0; tx < p.w - 24; tx += 28) { ctx.moveTo(tx, 27); ctx.lineTo(tx + 14, 58); ctx.lineTo(tx + 28, 27); }
      ctx.stroke();
      ctx.fillStyle = '#334155'; ctx.fillRect(0, 0, p.w, 12);
      ctx.fillStyle = '#fbbf24';
      for (let x = 14; x < p.w - 22; x += 48) ctx.fillRect(x, 4, 24, 3);
      ctx.restore();
      return;
    }

    if (p.type === 'cable_car') {
      // Realistic Full-Height Aerial Tramway / Cable Car Gondola Cabin with Solidly Connected Overhead Pulley Trolley & Suspension Cable!
      ctx.save();
      const cx = px + p.w / 2;
      const carH = 82; // Taller, realistic gondola cabin height (top collision deck remains at py!)

      // 1. Continuous Overhead Suspension Track Cable & Vertical Haul Rope (connected ALL THE WAY down into the cabin roof mount — ZERO gap!)
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, py + 2);
      ctx.stroke();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx - 1, 0);
      ctx.lineTo(cx - 1, py + 2);
      ctx.stroke();

      // Horizontal aerial track cable passing through the upper roller bogie
      const trolleyY = py - 34;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(px - 36, trolleyY - 5);
      ctx.lineTo(px + p.w + 36, trolleyY - 5);
      ctx.stroke();

      // Twin-Sheave Pulley Trolley Carriage & Heavy Bolted Steel Hanger Yoke Arm connecting trolley solidly to cabin roof!
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(cx - 26, trolleyY - 10, 52, 11, 4);
      ctx.fill(); ctx.stroke();
      for (const wx of [cx - 16, cx + 16]) {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(wx, trolleyY - 4.5, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(wx, trolleyY - 4.5, 2.4, 0, Math.PI * 2); ctx.fill();
      }
      // Diagonal A-frame steel hanger struts bolted directly into the cabin roof plate (py - 8..py + 2)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 10, trolleyY + 1); ctx.lineTo(cx - 20, py - 4);
      ctx.moveTo(cx + 10, trolleyY + 1); ctx.lineTo(cx + 20, py - 4);
      ctx.stroke();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx - 10, trolleyY + 1); ctx.lineTo(cx - 20, py - 4);
      ctx.moveTo(cx + 10, trolleyY + 1); ctx.lineTo(cx + 20, py - 4);
      ctx.stroke();

      // Bolted Roof Mounting Turret & Ventilator Housing seated flush on top of cabin roof (py - 9 to py + 1)
      const roofMntG = ctx.createLinearGradient(0, py - 9, 0, py + 1);
      roofMntG.addColorStop(0, '#64748b'); roofMntG.addColorStop(1, '#334155');
      ctx.fillStyle = roofMntG;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(px + 22, py - 9, p.w - 44, 10, [4, 4, 0, 0]);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e2e8f0';
      for (const rx of [px + 30, cx - 8, cx + 8, px + p.w - 30]) {
        ctx.beginPath(); ctx.arc(rx, py - 4, 1.5, 0, Math.PI * 2); ctx.fill();
      }

      // 2. Main Full-Height Panoramic Cable Car Gondola Body (py to py + 82)
      const carG = ctx.createLinearGradient(px, py, px, py + carH);
      carG.addColorStop(0, '#ef4444');
      carG.addColorStop(0.18, '#dc2626');
      carG.addColorStop(0.58, '#b91c1c');
      carG.addColorStop(0.88, '#7f1d1d');
      carG.addColorStop(1, '#3b0707');
      ctx.fillStyle = carG;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(px, py, p.w, carH, [12, 12, 14, 14]);
      ctx.fill(); ctx.stroke();

      // Cream & Gold Vintage Upper Roof Band + Lower Waist Beltline
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(px + 3, py + 4, p.w - 6, 8);
      ctx.fillRect(px + 2, py + 49, p.w - 4, 5);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(px + 2, py + 54, p.w - 4, 2.5);

      // 4 Tall Panoramic Glass Observation Windows (py + 15 to py + 46) with Interior Handrails, Warm Cabin Light & Specular Glaze!
      const winCount = 4;
      const gap = 8;
      const margin = 12;
      const winW = (p.w - margin * 2 - gap * (winCount - 1)) / winCount;
      const winY = py + 15;
      const winH = 31;
      for (let wIdx = 0; wIdx < winCount; wIdx++) {
        const wx = px + margin + wIdx * (winW + gap);
        const wG = ctx.createLinearGradient(wx, winY, wx, winY + winH);
        wG.addColorStop(0, '#fffbeb');
        wG.addColorStop(0.55, '#fde68a');
        wG.addColorStop(1, '#d97706');
        ctx.fillStyle = wG;
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(wx, winY, winW, winH, 4);
        ctx.fill(); ctx.stroke();

        // Interior overhead grab-bar & hanging passenger straps
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(wx + 2, winY + 6); ctx.lineTo(wx + winW - 2, winY + 6);
        ctx.moveTo(wx + winW * 0.5, winY + 6); ctx.lineTo(wx + winW * 0.5, winY + 13);
        ctx.stroke();

        // Diagonal glass reflection highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.34)';
        ctx.beginPath();
        ctx.moveTo(wx + 3, winY + 2);
        ctx.lineTo(wx + 11, winY + 2);
        ctx.lineTo(wx + 4, winY + winH - 2);
        ctx.lineTo(wx + 2, winY + winH - 2);
        ctx.closePath();
        ctx.fill();
      }

      // Lower Embossed Fluted Crimson Steel Body Panels, Stenciled Gondola Number & Rubber Bumper Skirt
      ctx.strokeStyle = 'rgba(69, 10, 10, 0.65)';
      ctx.lineWidth = 1.4;
      for (const ry of [py + 62, py + 68, py + 74]) {
        ctx.beginPath(); ctx.moveTo(px + 12, ry); ctx.lineTo(px + p.w - 12, ry); ctx.stroke();
      }
      // Center emblem badge on lower door panel
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.roundRect(cx - 14, py + 60, 28, 12, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#7f1d1d';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('A-10', cx, py + 69);

      // Heavy dark-steel bottom bumper skirt + glowing front/rear navigation lamps
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(px + 4, py + carH - 6, p.w - 8, 6, [0, 0, 8, 8]);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath(); ctx.arc(px + p.w - 4, py + 64, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(px + 4, py + 64, 3.2, 0, Math.PI * 2); ctx.fill();

      ctx.restore();
      return;
    }

    if (p.type === 'wind_zone') {
      // Natural Organic Soft-Fading Wind Ribbons & Air Curls (ZERO rectangular box!)
      ctx.save();
      const dir = p.windDir || 1;
      const baseColor = dir > 0 ? '186, 230, 253' : '253, 186, 116';
      ctx.lineCap = 'round';
      for (let r = 0; r < 8; r++) {
        const speed = 210 + (r % 3) * 48;
        const frac = ((time * speed + r * 71) % p.w) / p.w;
        // Smooth bell fade so ribbons gently materialize & dissolve with zero hard box edge!
        const edgeFade = Math.sin(frac * Math.PI);
        const sx = dir > 0 ? px + frac * p.w : px + (1 - frac) * p.w;
        const sy = py + 20 + (r / 8) * (p.h - 36) + Math.sin(time * 3 + r) * 6;
        const len = 36 + (r % 3) * 14;
        ctx.strokeStyle = `rgba(${baseColor}, ${(0.58 * edgeFade).toFixed(2)})`;
        ctx.lineWidth = r % 2 === 0 ? 2.2 : 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(
          sx + dir * len * 0.35, sy - 7,
          sx + dir * len * 0.7, sy + 5,
          sx + dir * len, sy - 2
        );
        ctx.stroke();
        // Tiny graceful curl tip on alternating wind streaks
        if (r % 2 === 0 && edgeFade > 0.35) {
          ctx.beginPath();
          ctx.arc(sx + dir * len, sy - 6, 4, dir > 0 ? Math.PI * 0.5 : -Math.PI * 0.5, dir > 0 ? Math.PI * 2.1 : Math.PI * 1.1);
          ctx.stroke();
        }
      }
      ctx.restore();
      return;
    }

    if (p.type === 'clock_gear') {
      ctx.save();
      const r = p.w / 2;
      const cx = px + r, cy = py + r;
      const angle = time * (p.spinSpeed || 1.15) * (p.spinDir || 1);
      ctx.translate(cx, cy); ctx.rotate(angle);
      const teeth = 14;
      ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
      for (let t = 0; t < teeth; t++) {
        ctx.save(); ctx.rotate((t * Math.PI * 2) / teeth);
        ctx.fillRect(-6, -r - 6, 12, 10); ctx.strokeRect(-6, -r - 6, 12, 10);
        ctx.restore();
      }
      const rimG = ctx.createRadialGradient(-8, -8, 6, 0, 0, r);
      rimG.addColorStop(0, '#fef08a'); rimG.addColorStop(0.55, '#d97706'); rimG.addColorStop(1, '#78350f');
      ctx.strokeStyle = rimG; ctx.lineWidth = 15;
      ctx.beginPath(); ctx.arc(0, 0, r - 8, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(0, 0, r - 1, 0, Math.PI * 2); ctx.arc(0, 0, r - 15, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 6.5;
      for (let s = 0; s < 5; s++) {
        const a = (s * Math.PI * 2) / 5;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (r - 10), Math.sin(a) * (r - 10)); ctx.stroke();
      }
      ctx.fillStyle = '#fef08a'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
      return;
    }

    if (p.type === 'cargo_container') {
      ctx.save();
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(px + 14, py); ctx.lineTo(px + 38, 0); ctx.moveTo(px + p.w - 14, py); ctx.lineTo(px + p.w - 38, 0); ctx.stroke();
      const cCol = p.color || '#1d4ed8';
      ctx.fillStyle = cCol; ctx.strokeStyle = '#090d16'; ctx.lineWidth = 2;
      ctx.fillRect(px, py, p.w, p.h); ctx.strokeRect(px, py, p.w, p.h);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      for (let rx = px + 10; rx < px + p.w - 10; rx += 11) ctx.fillRect(rx, py + 4, 3, p.h - 8);
      ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(px + 2, py + 2, p.w - 4, 3);
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(px, py, p.w, 4);
      ctx.restore();
      return;
    }

    if (p.type === 'oil_deck') {
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = tex.rivetedSteel; ctx.fillRect(0, 0, p.w, p.h);
      const sheen = ctx.createLinearGradient(0, 0, p.w, 0);
      sheen.addColorStop(0, '#38bdf8'); sheen.addColorStop(0.35, '#a855f7'); sheen.addColorStop(0.7, '#22d3ee'); sheen.addColorStop(1, '#38bdf8');
      ctx.fillStyle = sheen; ctx.fillRect(0, 0, p.w, 6);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      for (let sx = 14; sx < p.w - 24; sx += 44) ctx.fillRect(sx, 2, 18, 2);
      ctx.restore();
      return;
    }

    if (p.type === 'glass_floor') {
      ctx.save();
      ctx.translate(px, py);
      const g = ctx.createLinearGradient(0, 0, 0, p.h);
      g.addColorStop(0, '#115e59'); g.addColorStop(0.3, '#0d3b34'); g.addColorStop(1, '#041f1c');
      ctx.fillStyle = g; ctx.fillRect(0, 0, p.w, p.h);
      ctx.fillStyle = tex.botanicalGlass; ctx.fillRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#34d399'; ctx.fillRect(0, 0, p.w, 5);
      ctx.strokeStyle = '#064e3b'; ctx.lineWidth = 1.6; ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
      return;
    }

    if (p.type === 'sink_pad') {
      const dip = p.sinkOffset || 0;
      ctx.save();
      ctx.translate(px, py + dip);
      const padG = ctx.createLinearGradient(0, 0, 0, p.h);
      padG.addColorStop(0, '#4ade80'); padG.addColorStop(0.6, '#16a34a'); padG.addColorStop(1, '#14532d');
      ctx.fillStyle = padG; ctx.strokeStyle = '#052e16'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(0, 0, p.w, p.h, 12); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#bbf7d0'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(p.w * 0.5, p.h * 0.5); ctx.lineTo(12, 4); ctx.moveTo(p.w * 0.5, p.h * 0.5); ctx.lineTo(p.w - 12, 4); ctx.stroke();
      // Layered pink lotus bud
      ctx.fillStyle = '#ec4899'; ctx.beginPath(); ctx.arc(p.w - 18, -3, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fbcfe8'; ctx.beginPath(); ctx.arc(p.w - 18, -5, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }

    if (p.type === 'flower_bounce') {
      // Lush 3D Glossy Sculpted Blooming Purple Flower (Inspired by Reference: 8 Plump Oval 3D Petals, Golden Honeycomb Dome Center, 5 Glossy Curved Leaves, NO Vase, Tilted Slightly Upward!)
      ctx.save();
      const cx = px + p.w / 2;
      const baseY = py + p.h;
      const breeze = Math.sin(time * 1.8 + p.x * 0.03) * 0.018;
      const bend = p.stemBend || 0;
      const lean = (p.stemLean || 0) + breeze;
      const spread = p.petalSpread || 0;

      const headX = cx + Math.sin(lean) * 14;
      const headY = py + 15 + bend;
      const bowX = cx + Math.sin(lean) * 7 + bend * 0.22;
      const bowY = (baseY + headY) * 0.56;

      // Soft ambient ground shadow beneath rosette leaves
      ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
      ctx.beginPath(); ctx.ellipse(cx, baseY - 1, 34, 5.5, 0, 0, Math.PI * 2); ctx.fill();

      // Helper: Draw a plump 3D glossy sculpted leaf curving smoothly outward & downward (matching reference!)
      const drawGlossyLeaf = (ox, oy, ang, len, wid, backShade = false) => {
        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate(ang);
        const lg = ctx.createRadialGradient(len * 0.42, -wid * 0.38, 2, len * 0.48, 0, len * 0.82);
        if (backShade) {
          lg.addColorStop(0, '#a3e635');
          lg.addColorStop(0.45, '#16a34a');
          lg.addColorStop(0.85, '#0f766e');
          lg.addColorStop(1, '#064e3b');
        } else {
          lg.addColorStop(0, '#ecfccb');
          lg.addColorStop(0.28, '#a3e635');
          lg.addColorStop(0.68, '#16a34a');
          lg.addColorStop(1, '#0f766e');
        }
        ctx.fillStyle = lg;
        ctx.strokeStyle = '#064e3b';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(len * 0.25, -wid * 1.05, len * 0.78, -wid * 0.92, len, wid * 0.18);
        ctx.bezierCurveTo(len * 0.72, wid * 0.68, len * 0.25, wid * 0.52, 0, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Glossy sunlit highlight dome + crisp central leaf crease
        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.beginPath(); ctx.ellipse(len * 0.38, -wid * 0.32, len * 0.22, wid * 0.22, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(6, 78, 59, 0.48)'; ctx.lineWidth = 1.05;
        ctx.beginPath(); ctx.moveTo(2, 0.5); ctx.quadraticCurveTo(len * 0.48, -wid * 0.25, len * 0.92, wid * 0.14); ctx.stroke();
        ctx.restore();
      };

      // Back pair of plump glossy emerald leaves arching gracefully upward & outward
      drawGlossyLeaf(cx - 2, baseY - 12, -2.62, 34, 13.5, true);
      drawGlossyLeaf(cx + 2, baseY - 12, -0.52, 34, 13.5, true);

      // Smooth 3D Cylindrical Living Emerald Stem rising from rosette to blossom heart
      const stemG = ctx.createLinearGradient(cx - 6, baseY, cx + 6, baseY);
      stemG.addColorStop(0, '#14532d');
      stemG.addColorStop(0.38, '#4ade80');
      stemG.addColorStop(0.72, '#16a34a');
      stemG.addColorStop(1, '#064e3b');
      ctx.fillStyle = stemG;
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cx - 5.2, baseY - 4);
      ctx.quadraticCurveTo(bowX - 4.4, bowY, headX - 3.8, headY + 12);
      ctx.lineTo(headX + 3.8, headY + 12);
      ctx.quadraticCurveTo(bowX + 4.4, bowY, cx + 5.2, baseY - 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front 3 plump glossy arched leaves curving gracefully outward & downward around stem base!
      drawGlossyLeaf(cx - 3, baseY - 8, -2.92, 38, 14.5, false);
      drawGlossyLeaf(cx + 3, baseY - 8, -0.22, 38, 14.5, false);
      // Center-front plump rounded leaf facing viewer
      ctx.save();
      ctx.translate(cx, baseY - 8);
      const cfG = ctx.createRadialGradient(-3, -6, 1.5, 0, 0, 18);
      cfG.addColorStop(0, '#ecfccb'); cfG.addColorStop(0.35, '#84cc16'); cfG.addColorStop(0.8, '#16a34a'); cfG.addColorStop(1, '#0f766e');
      ctx.fillStyle = cfG; ctx.strokeStyle = '#064e3b'; ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.bezierCurveTo(-13, -7, -14, 7, 0, 12);
      ctx.bezierCurveTo(14, 7, 13, -7, 0, -8);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(6, 78, 59, 0.45)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(0, 10); ctx.stroke();
      ctx.restore();

      // === 3D GLOSSY SCULPTED 8-PETAL BLOOMING PURPLE FLOWER HEAD (Tilted Gently Upward Toward Sky & Camera!) ===
      ctx.save();
      ctx.translate(headX, headY);
      ctx.rotate(lean * 0.45);
      // Subtle 3/4 upward tilt (`scaleY = 0.76`) so it looks upward for jumping AND displays its full plump circular petal crown!
      const sX = 1 + spread * 0.08;
      const sY = 0.76 - Math.max(0, bend) * 0.006 + spread * 0.03;
      ctx.scale(sX, sY);

      // Soft mystical violet-lavender halo behind blossom
      const haloG = ctx.createRadialGradient(0, 0, 12, 0, 0, 56);
      haloG.addColorStop(0, `rgba(216, 180, 254, ${0.34 + spread * 0.2})`);
      haloG.addColorStop(1, 'rgba(147, 51, 234, 0)');
      ctx.fillStyle = haloG; ctx.beginPath(); ctx.arc(0, 0, 56, 0, Math.PI * 2); ctx.fill();

      // Helper: Paint a single plump, puffy, glossy 3D oval purple petal (exact reference volume + crease + rim glow!)
      const drawPlump3DPetal = (ang) => {
        ctx.save();
        ctx.rotate(ang);
        const pLen = 40 + spread * 3.5;
        const pWid = 16.5;

        // 3D volumetric radial gradient (bright glowing lavender-peach specular bulge -> rich royal purple -> cool periwinkle bottom bounce!)
        const pG = ctx.createRadialGradient(pLen * 0.56, -pWid * 0.28, 2.5, pLen * 0.52, 0, pLen * 0.72);
        pG.addColorStop(0, '#faf5ff');
        pG.addColorStop(0.24, '#e9d5ff');
        pG.addColorStop(0.55, '#a855f7');
        pG.addColorStop(0.84, '#7e22ce');
        pG.addColorStop(1, '#4c1d95');

        ctx.fillStyle = pG;
        ctx.strokeStyle = '#3b0764';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(6, 0);
        // Smooth plump rounded teardrop-oval petal (broad, pillowy rounded outer dome, zero sharp corners!)
        ctx.bezierCurveTo(pLen * 0.28, -pWid * 1.15, pLen * 0.96, -pWid * 1.05, pLen, 0);
        ctx.bezierCurveTo(pLen * 0.96, pWid * 1.05, pLen * 0.28, pWid * 1.15, 6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Soft cool iridescent lavender rim bounce highlight along outer curved lip
        ctx.strokeStyle = 'rgba(216, 180, 254, 0.58)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(pLen * 0.62, 0, pWid * 0.82, -0.85, 0.85);
        ctx.stroke();

        // Signature crisp recessed central petal crease line (just like the reference!)
        ctx.strokeStyle = 'rgba(76, 29, 149, 0.55)';
        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(pLen * 0.9, 0);
        ctx.stroke();
        // Subtle twin glossy specular pillows flanking the crease
        ctx.fillStyle = 'rgba(255, 255, 255, 0.34)';
        ctx.beginPath(); ctx.ellipse(pLen * 0.56, -pWid * 0.36, pLen * 0.18, pWid * 0.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      };

      // Draw 8 symmetrical plump 3D oval petals (ordered back-to-front so front petals overlap naturally!)
      const petalAngles = [
        -Math.PI * 0.5,
        -Math.PI * 0.75, -Math.PI * 0.25,
        Math.PI, 0,
        Math.PI * 0.75, Math.PI * 0.25,
        Math.PI * 0.5,
      ];
      for (const a of petalAngles) drawPlump3DPetal(a);

      // Deep soft contact shadow ringing the golden cushion center
      ctx.fillStyle = 'rgba(59, 7, 100, 0.48)';
      ctx.beginPath(); ctx.arc(0, 1.5, 17.5, 0, Math.PI * 2); ctx.fill();

      // 3D HONEYCOMB-BUMPED GOLDEN-ORANGE POLLEN DOME CENTER (exact reference!)
      const domeG = ctx.createRadialGradient(-5, -6, 2, 0, 0, 17);
      domeG.addColorStop(0, '#fef9c3');
      domeG.addColorStop(0.32, '#facc15');
      domeG.addColorStop(0.72, '#f97316');
      domeG.addColorStop(1, '#c2410c');
      ctx.fillStyle = domeG;
      ctx.strokeStyle = '#9a3412';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Sculpted 3D honeycomb pollen beads across the dome surface
      for (let ring = 0; ring < 2; ring++) {
        const rr = ring === 0 ? 5.5 : 11;
        const cnt = ring === 0 ? 6 : 12;
        for (let k = 0; k < cnt; k++) {
          const ka = (k * Math.PI * 2) / cnt + ring * 0.25;
          const bx = Math.cos(ka) * rr;
          const by = Math.sin(ka) * rr;
          ctx.fillStyle = by < 2 ? '#fde047' : '#ea580c';
          ctx.strokeStyle = 'rgba(154, 52, 18, 0.55)'; ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.arc(bx, by, 2.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
      }
      // Center pollen bead + crisp glossy white-cream specular highlight spot on upper-left dome!
      ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.beginPath(); ctx.ellipse(-6.2, -6.5, 3.6, 2.5, -0.5, 0, Math.PI * 2); ctx.fill();

      ctx.restore();
      ctx.restore();
      return;
    }

    if (p.type === 'neon_deck') {
      // Brushed Dark-Titanium & Reinforced Concrete Rooftop Deck with Under-Girders & Recessed LED Strip!
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = tex.carbonCyber; ctx.fillRect(0, 0, p.w, p.h);
      // Structural steel under-truss beams on deep rooftop slabs
      if (p.h >= 80) {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.45)'; ctx.fillRect(0, 26, p.w, p.h - 26);
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let gx = 0; gx < p.w - 36; gx += 48) {
          ctx.moveTo(gx, 26); ctx.lineTo(gx + 24, 62); ctx.lineTo(gx + 48, 26);
        }
        ctx.stroke();
      }
      // Top wet-titanium beveled deck cap with rain specular gleam
      const capG = ctx.createLinearGradient(0, 0, 0, 14);
      capG.addColorStop(0, '#334155'); capG.addColorStop(0.45, '#1e293b'); capG.addColorStop(1, '#090d16');
      ctx.fillStyle = capG; ctx.fillRect(0, 0, p.w, 14);
      // Crisp cyan architectural rim light + subtle magenta under-strip
      ctx.fillStyle = '#38bdf8'; ctx.fillRect(0, 0, p.w, 2.8);
      ctx.fillStyle = 'rgba(244, 114, 182, 0.72)'; ctx.fillRect(10, 14, p.w - 20, 2);
      // Industrial yellow-and-black corner caution trim
      ctx.fillStyle = '#facc15';
      ctx.fillRect(4, 5, 14, 4); ctx.fillRect(p.w - 18, 5, 14, 4);
      ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6; ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
      return;
    }

    if (p.type === 'boost_pad') {
      // High-Tech Electromagnetic Mag-Rail Acceleration Strip with Glowing Animated Plasma Chevrons!
      ctx.save();
      const dir = p.boostDir || 1;
      const baseG = ctx.createLinearGradient(px, py, px, py + p.h);
      baseG.addColorStop(0, '#1e293b'); baseG.addColorStop(1, '#090d16');
      ctx.fillStyle = baseG; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(px, py, p.w, p.h, 5); ctx.fill(); ctx.stroke();
      // Recessed glowing energy track
      ctx.fillStyle = 'rgba(14, 165, 233, 0.22)';
      ctx.fillRect(px + 6, py + 3, p.w - 12, p.h - 6);
      const shift = (time * 96) % 24;
      for (let cx = px + 14; cx < px + p.w - 14; cx += 24) {
        const ax = cx + (dir > 0 ? shift - 12 : 12 - shift);
        if (ax < px + 10 || ax > px + p.w - 10) continue;
        // Soft neon outer chevron + bright white-cyan inner core
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)'; ctx.lineWidth = 4.2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(ax - dir * 5, py + 3.5); ctx.lineTo(ax + dir * 4.5, py + p.h / 2); ctx.lineTo(ax - dir * 5, py + p.h - 3.5); ctx.stroke();
        ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = 1.7;
        ctx.beginPath(); ctx.moveTo(ax - dir * 5, py + 3.5); ctx.lineTo(ax + dir * 4.5, py + p.h / 2); ctx.lineTo(ax - dir * 5, py + p.h - 3.5); ctx.stroke();
      }
      ctx.restore();
      return;
    }

    if (p.type === 'museum_balcony') {
      // Ornate Royal Museum Mahogany & Brass-Railed Mezzanine Gallery!
      ctx.save();
      ctx.translate(px, py);
      // Decorative brass balustrade railing above floor
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2;
      ctx.strokeRect(4, -22, p.w - 8, 22);
      ctx.fillStyle = '#fef08a'; ctx.fillRect(2, -24, p.w - 4, 3);
      for (let rx = 14; rx < p.w - 10; rx += 18) {
        ctx.beginPath(); ctx.moveTo(rx, -22); ctx.lineTo(rx, 0); ctx.stroke();
      }
      // Carved Mahogany Floor Slab with Crimson Velvet Runner & Gold Molding
      const mG = ctx.createLinearGradient(0, 0, 0, p.h);
      mG.addColorStop(0, '#7f1d1d'); mG.addColorStop(0.28, '#5c2818'); mG.addColorStop(1, '#260d07');
      ctx.fillStyle = mG; ctx.strokeStyle = '#1c0905'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(0, 0, p.w, p.h, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(0, 0, p.w, 3.5);
      ctx.restore();
      return;
    }

    if (p.type === 'tire_bounce') {
      // Highway Bridge Yellow-and-Black Rubber Crash-Cushion / Safety Tire Stack (Bouncy!)
      ctx.save();
      ctx.translate(px, py);
      // Heavy steel base plate bolted to bridge deck
      ctx.fillStyle = '#334155'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
      ctx.fillRect(4, p.h - 10, p.w - 8, 10); ctx.strokeRect(4, p.h - 10, p.w - 8, 10);
      // Stacked grooved rubber safety tires
      const tiers = Math.max(2, Math.floor((p.h - 10) / 18));
      const tierH = (p.h - 10) / tiers;
      for (let t = 0; t < tiers; t++) {
        const ty = t * tierH;
        const tG = ctx.createLinearGradient(0, ty, 0, ty + tierH);
        tG.addColorStop(0, '#374151'); tG.addColorStop(0.5, '#1f2937'); tG.addColorStop(1, '#090d16');
        ctx.fillStyle = tG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.roundRect(2, ty, p.w - 4, tierH, 7); ctx.fill(); ctx.stroke();
        // High-visibility yellow reflective highway stripes
        ctx.fillStyle = '#facc15';
        ctx.fillRect(12, ty + tierH * 0.35, 16, 4);
        ctx.fillRect(p.w - 28, ty + tierH * 0.35, 16, 4);
      }
      // Bouncy yellow hazard cushion cap on top
      ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#854d0e'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(6, -3, p.w - 12, 8, 4); ctx.fill(); ctx.stroke();
      ctx.restore();
      return;
    }

    if (p.type === 'garden_pergola') {
      // Sunlit Carved Oak Garden Pergola / Balcony Terrace with Blooming Pink Roses & Ivy!
      ctx.save();
      ctx.translate(px, py);
      // Warm oak plank beam with beveled grain
      const woodG = ctx.createLinearGradient(0, 0, 0, p.h);
      woodG.addColorStop(0, '#b46936'); woodG.addColorStop(0.45, '#7c3f1c'); woodG.addColorStop(1, '#451f0a');
      ctx.fillStyle = woodG; ctx.strokeStyle = '#240f04'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(0, 0, p.w, p.h, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(254, 240, 138, 0.25)'; ctx.fillRect(4, 2, p.w - 8, 3);
      // Carved brackets & hanging blooming rose vines underneath
      ctx.fillStyle = '#15803d';
      for (let vx = 14; vx < p.w - 14; vx += 26) {
        ctx.beginPath(); ctx.arc(vx, p.h + 4, 6, 0, Math.PI * 2); ctx.arc(vx + 8, p.h + 8, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f472b6'; ctx.beginPath(); ctx.arc(vx + 4, p.h + 5, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#15803d';
      }
      ctx.restore();
      return;
    }

    if (p.type === 'waterwheel') {
      // Carved Timber & Brass Rotating Garden Mill Waterwheel Platform with Splashing Water Droplets!
      ctx.save();
      const cx = px + p.w * 0.5;
      const cy = py + p.h * 0.5 + 16;
      const r = Math.max(40, p.w * 0.45);
      const rot = time * (p.rotSpeed || 0.72);

      // Rotating wooden mill wheel behind the top stepping plank
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      // 8 radial oak spokes + wooden water-bucket paddles
      for (let s = 0; s < 8; s++) {
        const ang = (s * Math.PI) / 4;
        ctx.save();
        ctx.rotate(ang);
        ctx.fillStyle = '#5c2d0c'; ctx.strokeStyle = '#291204'; ctx.lineWidth = 1.4;
        ctx.fillRect(-3.5, 0, 7, r); ctx.strokeRect(-3.5, 0, 7, r);
        // Outer bucket paddle blade
        ctx.fillStyle = '#92400e';
        ctx.fillRect(-11, r - 9, 22, 8); ctx.strokeRect(-11, r - 9, 22, 8);
        ctx.restore();
      }
      // Double oak & riveted iron wheel rims
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 7.5;
      ctx.beginPath(); ctx.arc(0, 0, r - 8, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, r - 8, 0, Math.PI * 2); ctx.stroke();
      // Center forged iron & brass axle hub
      ctx.fillStyle = '#334155'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(0, 0, 6.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Sparkling water droplets cascading off the spinning wheel rims
      ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
      for (let d = 0; d < 6; d++) {
        const da = rot + d * 1.05;
        const dx = cx + Math.cos(da) * (r - 2);
        const dy = cy + Math.sin(da) * (r - 2) + ((time * 38 + d * 9) % 18);
        ctx.beginPath(); ctx.arc(dx, dy, 2.2, 0, Math.PI * 2); ctx.fill();
      }

      // Top solid timber bridge deck plank across the wheel crest (where Mashmasha lands)
      const deckG = ctx.createLinearGradient(px, py, px, py + p.h);
      deckG.addColorStop(0, '#b45309'); deckG.addColorStop(0.5, '#78350f'); deckG.addColorStop(1, '#3b1906');
      ctx.fillStyle = deckG; ctx.strokeStyle = '#1f0c02'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(px, py, p.w, p.h, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(254, 240, 138, 0.28)';
      ctx.fillRect(px + 5, py + 2, p.w - 10, 2.5);
      ctx.restore();
      return;
    }

    if (p.type === 'fountain_jet') {
      // Sculpted Limestone Garden Fountain Basin with Sparkling Buoyant Water Geyser Plume!
      ctx.save();
      const cx = px + p.w * 0.5;
      const liftH = p.jetHeight || 195;
      const pulse = Math.sin(time * 7.5 + px * 0.04) * 7;

      // Vertical buoyant water geyser column rising above the basin
      const jetG = ctx.createLinearGradient(cx, py - liftH, cx, py);
      jetG.addColorStop(0, 'rgba(224, 242, 254, 0.18)');
      jetG.addColorStop(0.35, 'rgba(125, 211, 252, 0.58)');
      jetG.addColorStop(0.75, 'rgba(56, 189, 248, 0.78)');
      jetG.addColorStop(1, 'rgba(240, 249, 255, 0.92)');
      ctx.fillStyle = jetG;
      ctx.beginPath();
      ctx.moveTo(cx - 16, py + 4);
      ctx.quadraticCurveTo(cx - 21, py - liftH * 0.5, cx - 26, py - liftH + pulse);
      ctx.quadraticCurveTo(cx, py - liftH - 18 + pulse, cx + 26, py - liftH + pulse);
      ctx.quadraticCurveTo(cx + 21, py - liftH * 0.5, cx + 16, py + 4);
      ctx.closePath();
      ctx.fill();

      // Animated rising foam streams & sparkling mist crown at top of water plume
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
      for (let s = -1; s <= 1; s++) {
        const off = ((time * 165 + (s + 1) * 44) % liftH);
        const sy = py - off;
        ctx.beginPath(); ctx.moveTo(cx + s * 9, sy); ctx.lineTo(cx + s * 10, Math.max(py - liftH, sy - 26)); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      for (let b = -2; b <= 2; b++) {
        const by = py - liftH + pulse + Math.abs(b) * 3 + Math.sin(time * 9 + b) * 3;
        ctx.beginPath(); ctx.arc(cx + b * 8.5, by, 6.5 - Math.abs(b) * 0.9, 0, Math.PI * 2); ctx.fill();
      }

      // Carved Limestone & Bronze Nozzle Fountain Basin Platform
      const stG = ctx.createLinearGradient(px, py, px, py + p.h);
      stG.addColorStop(0, '#f5f5f4'); stG.addColorStop(0.45, '#d6d3d1'); stG.addColorStop(1, '#78716c');
      ctx.fillStyle = stG; ctx.strokeStyle = '#44403c'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(px, py, p.w, p.h, 6); ctx.fill(); ctx.stroke();
      // Shimmering turquoise basin water rim & ornate bronze lion/lotus spout nozzle
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px + 8, py + 2, p.w - 16, 4.5);
      ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.roundRect(cx - 12, py - 4, 24, 7, 3); ctx.fill(); ctx.stroke();
      ctx.restore();
      return;
    }

    if (p.type === 'home_deck') {
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = tex.cobbleStreet; ctx.fillRect(0, 0, p.w, p.h);
      const curbG = ctx.createLinearGradient(0, 0, 0, 10);
      curbG.addColorStop(0, '#fde68a'); curbG.addColorStop(1, '#d97706');
      ctx.fillStyle = curbG; ctx.fillRect(0, 0, p.w, 7);
      ctx.strokeStyle = '#2d140c'; ctx.lineWidth = 1.6; ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
      return;
    }

    origDrawPlatform(ctx, p, px, py, nv, time);
  }

  Art.drawCoin = drawCoin;
  Art.drawMuseumSkyAndHorizon = drawMuseumSkyAndHorizon;
  Art.drawMuseumMidground = drawMuseumMidground;
  Art.drawBridgeSkyAndHorizon = drawBridgeSkyAndHorizon;
  Art.drawBridgeMidground = drawBridgeMidground;
  Art.drawOldTownSkyAndHorizon = drawOldTownSkyAndHorizon;
  Art.drawOldTownMidground = drawOldTownMidground;
  Art.drawHarborStormSkyAndSea = drawHarborStormSkyAndSea;
  Art.drawHarborStormMidground = drawHarborStormMidground;
  Art.drawGreenhouseSkyAndHorizon = drawGreenhouseSkyAndHorizon;
  Art.drawGreenhouseMidground = drawGreenhouseMidground;
  Art.drawNeonRooftopSkyAndHorizon = drawNeonRooftopSkyAndHorizon;
  Art.drawNeonRooftopMidground = drawNeonRooftopMidground;
  Art.drawHomewardSkyAndHorizon = drawHomewardSkyAndHorizon;
  Art.drawHomewardMidground = drawHomewardMidground;
  Art.drawPlatform = drawPlatformExtended;
})();
