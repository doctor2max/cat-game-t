window.Game = window.Game || {};

window.Game.Art = (function () {
  const patterns = {};
  const graffitiImg = new Image();
  let graffitiReady = false;
  graffitiImg.onload = function () { graffitiReady = true; };
  graffitiImg.src = 'images/max07-clean.png';

  function createOffscreen(w, h, drawFn) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const cctx = c.getContext('2d');
    drawFn(cctx, w, h);
    return c;
  }

  function initPatterns(ctx) {
    if (patterns.ready) return;

    // 1. Realistic staggered brick pattern
    const brickCanvas = createOffscreen(64, 32, (c, w, h) => {
      c.fillStyle = '#3d2224';
      c.fillRect(0, 0, w, h);
      const colors = ['#592e2a', '#63342e', '#4d2725', '#6b3b32'];
      for (let row = 0; row < 2; row++) {
        const y = row * 16;
        const offset = row % 2 === 0 ? 0 : 16;
        for (let col = -1; col < 3; col++) {
          const x = col * 32 + offset;
          c.fillStyle = colors[(row * 3 + col + 4) % colors.length];
          c.fillRect(x + 1.5, y + 1.5, 29, 13);
          c.fillStyle = 'rgba(255,210,180,0.08)';
          c.fillRect(x + 1.5, y + 1.5, 29, 2);
        }
      }
    });
    patterns.brick = ctx.createPattern(brickCanvas, 'repeat');

    // 2. Darker alley facade brick
    const darkBrickCanvas = createOffscreen(64, 32, (c, w, h) => {
      c.fillStyle = '#1f1722';
      c.fillRect(0, 0, w, h);
      const colors = ['#2b1f2b', '#322430', '#261b26', '#382834'];
      for (let row = 0; row < 2; row++) {
        const y = row * 16;
        const offset = row % 2 === 0 ? 0 : 16;
        for (let col = -1; col < 3; col++) {
          const x = col * 32 + offset;
          c.fillStyle = colors[(row * 2 + col + 4) % colors.length];
          c.fillRect(x + 1, y + 1, 30, 14);
        }
      }
    });
    patterns.darkBrick = ctx.createPattern(darkBrickCanvas, 'repeat');

    // 3. Textured asphalt
    const asphaltCanvas = createOffscreen(64, 64, (c, w, h) => {
      c.fillStyle = '#191d29';
      c.fillRect(0, 0, w, h);
      for (let i = 0; i < 140; i++) {
        const x = (i * 37) % w;
        const y = (i * 53) % h;
        c.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.18)';
        c.fillRect(x, y, 2, 2);
      }
    });
    patterns.asphalt = ctx.createPattern(asphaltCanvas, 'repeat');

    // 4. Realistic rich oak wood plank grain
    const woodCanvas = createOffscreen(64, 32, (c, w, h) => {
      c.fillStyle = '#854e27';
      c.fillRect(0, 0, w, h);
      const plankCols = ['#8c542b', '#794521'];
      for (let row = 0; row < 2; row++) {
        const py = row * 16;
        c.fillStyle = plankCols[row];
        c.fillRect(0, py, w, 15);
        // Subtle organic wood fibers
        c.strokeStyle = 'rgba(55, 25, 8, 0.28)';
        c.lineWidth = 1;
        for (let f = 0; f < 4; f++) {
          const fy = py + 3 + f * 3.2;
          c.beginPath();
          c.moveTo(0, fy);
          c.bezierCurveTo(w * 0.3, fy + (f % 2 === 0 ? 1.5 : -1.2), w * 0.7, fy + (f % 2 === 0 ? -1 : 1.4), w, fy);
          c.stroke();
        }
        // Wood knot
        const kx = row === 0 ? 22 : 46;
        const ky = py + 8;
        c.fillStyle = 'rgba(52, 24, 8, 0.35)';
        c.beginPath();
        c.ellipse(kx, ky, 4.5, 2.2, 0.1, 0, Math.PI * 2);
        c.fill();
        // Top highlight & recessed plank seam
        c.fillStyle = 'rgba(255, 224, 180, 0.14)';
        c.fillRect(0, py + 1, w, 1.5);
        c.fillStyle = '#3d1f0d';
        c.fillRect(0, py + 15, w, 1.5);
      }
    });
    patterns.wood = ctx.createPattern(woodCanvas, 'repeat');

    patterns.ready = true;
  }

  function drawSkyAndFarCity(ctx, camX, w, h, time) {
    initPatterns(ctx);

    // NYC dusk-to-night sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#090d1c');
    sky.addColorStop(0.36, '#171a36');
    sky.addColorStop(0.7, '#352545');
    sky.addColorStop(1, '#161624');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Warm Manhattan horizon glow
    const horizonGlow = ctx.createLinearGradient(0, h * 0.42, 0, h - 90);
    horizonGlow.addColorStop(0, 'rgba(255, 145, 75, 0)');
    horizonGlow.addColorStop(1, 'rgba(255, 140, 75, 0.22)');
    ctx.fillStyle = horizonGlow;
    ctx.fillRect(0, h * 0.42, w, h);

    // Stars
    for (let i = 0; i < 50; i++) {
      const sx = (i * 193) % w;
      const sy = (i * 47) % 210;
      const alpha = 0.2 + 0.55 * Math.abs(Math.sin(time * 1.3 + i * 0.7));
      ctx.fillStyle = `rgba(255, 245, 220, ${alpha})`;
      ctx.fillRect(sx, sy, i % 4 === 0 ? 2 : 1.4, i % 4 === 0 ? 2 : 1.4);
    }

    // Moon with atmospheric halo
    const moonX = 1040 - camX * 0.03;
    const moonY = 92;
    const halo = ctx.createRadialGradient(moonX, moonY, 18, moonX, moonY, 140);
    halo.addColorStop(0, 'rgba(255, 236, 185, 0.36)');
    halo.addColorStop(0.5, 'rgba(255, 210, 150, 0.09)');
    halo.addColorStop(1, 'rgba(255, 210, 150, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 140, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff2ce';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 32, 0, Math.PI * 2);
    ctx.fill();

    // Distant Brooklyn/Manhattan-style Suspension Bridge silhouette
    const bridgeX = 760 - camX * 0.1;
    ctx.save();
    ctx.strokeStyle = 'rgba(30, 34, 58, 0.72)';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(24, 28, 48, 0.78)';
    ctx.fillRect(bridgeX, 250, 18, 280);
    ctx.fillRect(bridgeX + 280, 250, 18, 280);
    ctx.beginPath();
    ctx.moveTo(bridgeX - 130, 390);
    ctx.quadraticCurveTo(bridgeX - 60, 355, bridgeX + 9, 254);
    ctx.quadraticCurveTo(bridgeX + 149, 375, bridgeX + 289, 254);
    ctx.quadraticCurveTo(bridgeX + 355, 355, bridgeX + 430, 390);
    ctx.stroke();
    ctx.restore();

    // Far Manhattan Skyscrapers (Empire State, One WTC, Art Deco & Glass Towers)
    for (let i = 0; i < 24; i++) {
      const bx = i * 135 - ((camX * 0.16) % 135);
      const bh = 210 + ((i * 89) % 210);
      const bw = 96 + ((i * 23) % 34);
      const topY = h - 90 - bh;

      ctx.fillStyle = i % 2 === 0 ? '#13172b' : '#181c33';
      ctx.fillRect(bx, topY, bw, bh);

      if (i % 6 === 2) {
        ctx.fillRect(bx + 14, topY - 34, bw - 28, 34);
        ctx.fillRect(bx + 26, topY - 62, bw - 52, 28);
        ctx.fillStyle = 'rgba(255, 195, 110, 0.45)';
        ctx.fillRect(bx + 28, topY - 56, bw - 56, 8);
        ctx.fillStyle = '#1d223d';
        ctx.fillRect(bx + bw / 2 - 2, topY - 102, 4, 40);
        ctx.fillStyle = 'rgba(255, 80, 80, 0.85)';
        ctx.beginPath();
        ctx.arc(bx + bw / 2, topY - 102, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (i % 6 === 5) {
        ctx.beginPath();
        ctx.moveTo(bx + 8, topY);
        ctx.lineTo(bx + 22, topY - 78);
        ctx.lineTo(bx + bw - 22, topY - 78);
        ctx.lineTo(bx + bw - 8, topY);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(bx + bw / 2 - 1.5, topY - 118, 3, 40);
        ctx.fillStyle = 'rgba(120, 220, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(bx + bw / 2, topY - 118, 2.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (i % 3 === 0) {
        ctx.strokeStyle = '#101322';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx + 20, topY);
        ctx.lineTo(bx + 25, topY - 16);
        ctx.moveTo(bx + 42, topY);
        ctx.lineTo(bx + 37, topY - 16);
        ctx.stroke();
        ctx.fillStyle = '#262129';
        ctx.fillRect(bx + 20, topY - 34, 22, 18);
        ctx.beginPath();
        ctx.moveTo(bx + 18, topY - 34);
        ctx.lineTo(bx + 31, topY - 43);
        ctx.lineTo(bx + 44, topY - 34);
        ctx.closePath();
        ctx.fill();
      }

      for (let wy = topY + 14; wy < h - 120; wy += 16) {
        for (let wx = bx + 10; wx < bx + bw - 12; wx += 14) {
          const hash = (wx * 13 + wy * 7 + i * 31) % 13;
          if (hash < 5) {
            ctx.fillStyle =
              hash === 0
                ? 'rgba(255, 215, 130, 0.42)'
                : hash === 1
                ? 'rgba(135, 215, 255, 0.24)'
                : 'rgba(255, 180, 100, 0.22)';
            ctx.fillRect(wx, wy, 7, 10);
          }
        }
      }
    }
  }

  function drawMidgroundCityBuildings(ctx, camX, w, h, time) {
    // Classic New York Brownstones & Red-Brick Tenements with zig-zag Fire Escapes & Rooftop Billboards
    const buildingW = 320;
    const count = 16;

    for (let i = 0; i < count; i++) {
      const bx = i * buildingW - camX * 0.5;
      if (bx + buildingW < -80 || bx > w + 80) continue;

      const bh = 430 + ((i * 61) % 135);
      const topY = h - 90 - bh;

      ctx.save();
      ctx.translate(bx, topY);

      // Brick tenement or brownstone facade
      ctx.fillStyle = i % 2 === 0 ? patterns.darkBrick : '#2a2029';
      ctx.fillRect(0, 0, buildingW - 10, bh);

      const edgeGrad = ctx.createLinearGradient(buildingW - 42, 0, buildingW - 10, 0);
      edgeGrad.addColorStop(0, 'rgba(0,0,0,0)');
      edgeGrad.addColorStop(1, 'rgba(0,0,0,0.48)');
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(buildingW - 42, 0, 32, bh);

      // Ornate NYC stone parapet cornice
      ctx.fillStyle = '#473845';
      ctx.fillRect(-4, 0, buildingW - 2, 16);
      ctx.fillStyle = '#5e4b5b';
      ctx.fillRect(-4, 0, buildingW - 2, 4);

      // Large NYC Rooftop Illuminated Billboard (every 2nd building)
      if (i % 2 === 0) {
        const bbw = 175;
        const bbh = 62;
        const bbx = 42;
        const bby = -bbh - 18;

        // Steel scaffolding struts
        ctx.strokeStyle = '#181b26';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bbx + 22, 0);
        ctx.lineTo(bbx + 22, bby + bbh);
        ctx.lineTo(bbx + 42, 0);
        ctx.moveTo(bbx + bbw - 22, 0);
        ctx.lineTo(bbx + bbw - 22, bby + bbh);
        ctx.lineTo(bbx + bbw - 42, 0);
        ctx.stroke();

        // Outer steel frame
        ctx.fillStyle = '#101420';
        ctx.strokeStyle = '#434d68';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(bbx, bby, bbw, bbh, 5);
        ctx.fill();
        ctx.stroke();

        // Vibrant illuminated ad canvas
        const adType = (i / 2) % 3;
        const adGrad = ctx.createLinearGradient(bbx, bby, bbx + bbw, bby + bbh);
        if (adType === 0) {
          adGrad.addColorStop(0, '#1e1035');
          adGrad.addColorStop(1, '#4c1d57');
        } else if (adType === 1) {
          adGrad.addColorStop(0, '#0f2942');
          adGrad.addColorStop(1, '#155263');
        } else {
          adGrad.addColorStop(0, '#3b1518');
          adGrad.addColorStop(1, '#6e2129');
        }
        ctx.fillStyle = adGrad;
        ctx.fillRect(bbx + 4, bby + 4, bbw - 8, bbh - 8);

        // Glowing neon border inside billboard
        const neonAccent = adType === 0 ? '#ff6bcb' : adType === 1 ? '#4ee8ff' : '#ffd147';
        ctx.strokeStyle = neonAccent;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bbx + 7, bby + 7, bbw - 14, bbh - 14);

        // Ad graphics & typography
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'left';
        if (adType === 0) {
          ctx.fillText('DR. MAX AGENTS', bbx + 16, bby + 28);
          ctx.fillStyle = '#ffd147';
          ctx.font = '11px monospace';
          ctx.fillText('AI AUTOMATION • NYC', bbx + 16, bby + 45);
          ctx.font = '24px sans-serif';
          ctx.fillText('🤖', bbx + bbw - 40, bby + 40);
        } else if (adType === 1) {
          ctx.fillText('ROYAL TUNA CO.', bbx + 16, bby + 28);
          ctx.fillStyle = '#7ce8ff';
          ctx.font = '11px monospace';
          ctx.fillText('100% PURE CAT TREAT', bbx + 16, bby + 45);
          ctx.font = '24px sans-serif';
          ctx.fillText('🐟', bbx + bbw - 42, bby + 40);
        } else {
          ctx.fillText('BROADWAY LIVE', bbx + 16, bby + 28);
          ctx.fillStyle = '#ffb35c';
          ctx.font = '11px monospace';
          ctx.fillText('TONIGHT AT 8:00 PM', bbx + 16, bby + 45);
          ctx.font = '22px sans-serif';
          ctx.fillText('🎭', bbx + bbw - 40, bby + 40);
        }

        // Top floodlights casting light downward
        for (let fl = 0; fl < 3; fl++) {
          const flx = bbx + 32 + fl * 55;
          ctx.fillStyle = '#2d3446';
          ctx.fillRect(flx - 5, bby - 5, 10, 5);
          const spot = ctx.createRadialGradient(flx, bby, 2, flx, bby + 28, 42);
          spot.addColorStop(0, 'rgba(255, 240, 190, 0.38)');
          spot.addColorStop(1, 'rgba(255, 240, 190, 0)');
          ctx.fillStyle = spot;
          ctx.beginPath();
          ctx.arc(flx, bby + 16, 38, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Rooftop NYC Wooden Water Tower on alternate buildings
        ctx.strokeStyle = '#181a24';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(220, 0);
        ctx.lineTo(226, -20);
        ctx.moveTo(256, 0);
        ctx.lineTo(250, -20);
        ctx.stroke();
        ctx.fillStyle = '#4e3529';
        ctx.fillRect(222, -46, 32, 26);
        ctx.fillStyle = '#2d2326';
        ctx.beginPath();
        ctx.moveTo(220, -46);
        ctx.lineTo(238, -58);
        ctx.lineTo(256, -46);
        ctx.closePath();
        ctx.fill();
      }

      // NYC double-hung sash windows with stone lintels & sills
      for (let row = 0; row < 2; row++) {
        const wy = 44 + row * 124;
        for (let col = 0; col < 3; col++) {
          const wx = 26 + col * 92;
          const lit = (i + row * 2 + col) % 3 !== 1;

          ctx.fillStyle = '#4a3c4a';
          ctx.fillRect(wx - 4, wy - 7, 56, 8);

          ctx.fillStyle = '#110e16';
          ctx.fillRect(wx, wy, 48, 72);

          if (lit) {
            const winGlow = ctx.createLinearGradient(wx, wy, wx, wy + 72);
            winGlow.addColorStop(0, 'rgba(255, 212, 128, 0.56)');
            winGlow.addColorStop(1, 'rgba(235, 138, 68, 0.36)');
            ctx.fillStyle = winGlow;
          } else {
            ctx.fillStyle = 'rgba(32, 38, 56, 0.88)';
          }
          ctx.fillRect(wx + 4, wy + 4, 40, 64);

          ctx.strokeStyle = '#1b1520';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(wx + 4, wy + 35);
          ctx.lineTo(wx + 44, wy + 35);
          ctx.moveTo(wx + 24, wy + 4);
          ctx.lineTo(wx + 24, wy + 68);
          ctx.stroke();

          ctx.fillStyle = '#544454';
          ctx.fillRect(wx - 5, wy + 71, 58, 6);
        }
      }

      // Iconic NYC Black Iron Fire Escape (balcony landings + diagonal zig-zag stairs)
      ctx.strokeStyle = '#11131b';
      ctx.lineWidth = 2.6;
      for (let row = 0; row < 2; row++) {
        const fy = 98 + row * 124;
        ctx.strokeRect(108, fy, 152, 20);
        for (let rx = 116; rx <= 252; rx += 12) {
          ctx.beginPath();
          ctx.moveTo(rx, fy);
          ctx.lineTo(rx, fy + 20);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(122, fy + 20);
        ctx.lineTo(186, fy + 124);
        ctx.stroke();
      }

      // Vertical Blade Neon Sign mounted on building side
      const bladeY = 140;
      const bladeColor = i % 2 === 0 ? '#ff5e84' : '#3ee8ff';
      ctx.strokeStyle = '#222836';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(buildingW - 10, bladeY + 12);
      ctx.lineTo(buildingW + 4, bladeY + 12);
      ctx.moveTo(buildingW - 10, bladeY + 78);
      ctx.lineTo(buildingW + 4, bladeY + 78);
      ctx.stroke();

      ctx.save();
      ctx.shadowColor = bladeColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#0d111c';
      ctx.strokeStyle = bladeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(buildingW - 4, bladeY, 22, 92, 6);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = bladeColor;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      const vWord = i % 2 === 0 ? 'HOTEL' : 'DINER';
      for (let cIdx = 0; cIdx < vWord.length; cIdx++) {
        ctx.fillText(vWord[cIdx], buildingW + 7, bladeY + 20 + cIdx * 15);
      }
      ctx.restore();

      // Ground-floor NYC Bodega / Pizza / Deli / Jazz Club storefront
      const shopY = bh - 112;
      ctx.fillStyle = '#18141e';
      ctx.fillRect(14, shopY, buildingW - 40, 112);

      const shopGlow = ctx.createLinearGradient(24, shopY + 18, 24, shopY + 96);
      shopGlow.addColorStop(0, 'rgba(255, 212, 130, 0.44)');
      shopGlow.addColorStop(1, 'rgba(255, 165, 85, 0.18)');
      ctx.fillStyle = shopGlow;
      ctx.fillRect(24, shopY + 24, buildingW - 112, 74);

      // Interior shop details (shelves & warm pendant lamps)
      ctx.fillStyle = 'rgba(40, 28, 36, 0.55)';
      ctx.fillRect(32, shopY + 48, buildingW - 130, 5);
      ctx.fillRect(32, shopY + 68, buildingW - 130, 5);
      ctx.fillStyle = '#ffe89e';
      ctx.beginPath();
      ctx.arc(65, shopY + 34, 4, 0, Math.PI * 2);
      ctx.arc(135, shopY + 34, 4, 0, Math.PI * 2);
      ctx.fill();

      // Shop door
      ctx.fillStyle = '#29202c';
      ctx.fillRect(buildingW - 78, shopY + 18, 38, 94);
      ctx.fillStyle = 'rgba(255, 212, 130, 0.36)';
      ctx.fillRect(buildingW - 72, shopY + 26, 26, 44);

      // Detailed Glowing Storefront Signboard with icon & neon tube border
      const signs = [
        { title: 'JOE’S NY PIZZA', sub: 'HOT SLICES 24/7', icon: '🍕', col: '#ff6b6b' },
        { title: 'BROOKLYN DELI', sub: 'COFFEE & BAGELS', icon: '🥯', col: '#4ee8ff' },
        { title: 'MAX BODEGA', sub: 'GROCERY • SNACKS', icon: '🏪', col: '#ffd147' },
        { title: 'BLUE NOTE JAZZ', sub: 'LIVE MUSIC CLUB', icon: '🎷', col: '#c56cf0' },
      ];
      const sInfo = signs[i % signs.length];
      ctx.save();
      ctx.shadowColor = sInfo.col;
      ctx.shadowBlur = 12;
      ctx.fillStyle = 'rgba(10, 12, 22, 0.95)';
      ctx.strokeStyle = sInfo.col;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(20, shopY - 16, 165, 32, 6);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.font = '16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(sInfo.icon, 28, shopY + 5);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(sInfo.title, 50, shopY - 2);

      ctx.fillStyle = sInfo.col;
      ctx.font = '9px monospace';
      ctx.fillText(sInfo.sub, 50, shopY + 10);
      ctx.restore();

      // Classic Realistic NYC Yellow Cab parked in background
      if (i % 4 === 1) {
        const tx = 132;
        const ty = bh - 46;
        ctx.save();

        // Ground shadow under car
        ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
        ctx.beginPath();
        ctx.ellipse(tx + 58, ty + 42, 62, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glowing TAXI roof sign
        ctx.save();
        ctx.shadowColor = '#ffe066';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#fff3b0';
        ctx.strokeStyle = '#8c5a00';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(tx + 46, ty - 7, 22, 8, [3, 3, 0, 0]);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#111';
        ctx.font = 'bold 6px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TAXI', tx + 57, ty - 1);
        ctx.restore();

        // Main sedan body silhouette (metallic NYC cab yellow gradient)
        const cabGrad = ctx.createLinearGradient(tx, ty + 1, tx, ty + 38);
        cabGrad.addColorStop(0, '#ffd23f');
        cabGrad.addColorStop(0.35, '#f2ad18');
        cabGrad.addColorStop(0.85, '#c9820a');
        cabGrad.addColorStop(1, '#8c5404');
        ctx.fillStyle = cabGrad;
        ctx.strokeStyle = '#332004';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(tx + 4, ty + 28);
        ctx.lineTo(tx + 5, ty + 19);
        ctx.quadraticCurveTo(tx + 12, ty + 14, tx + 28, ty + 14);
        ctx.lineTo(tx + 40, ty + 2);
        ctx.quadraticCurveTo(tx + 58, ty, tx + 76, ty + 2);
        ctx.lineTo(tx + 92, ty + 14);
        ctx.quadraticCurveTo(tx + 108, ty + 14, tx + 112, ty + 20);
        ctx.lineTo(tx + 113, ty + 32);
        ctx.lineTo(tx + 4, ty + 32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Specular highlight along hood & roof
        ctx.strokeStyle = 'rgba(255, 248, 200, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tx + 10, ty + 16);
        ctx.lineTo(tx + 28, ty + 15.5);
        ctx.moveTo(tx + 42, ty + 2.5);
        ctx.lineTo(tx + 74, ty + 2.5);
        ctx.stroke();

        // Tinted cabin windows with glass reflection
        const glassGrad = ctx.createLinearGradient(tx + 38, ty + 3, tx + 88, ty + 14);
        glassGrad.addColorStop(0, '#2a3954');
        glassGrad.addColorStop(0.5, '#192336');
        glassGrad.addColorStop(1, '#101624');
        ctx.fillStyle = glassGrad;
        ctx.beginPath();
        ctx.moveTo(tx + 41, ty + 4);
        ctx.lineTo(tx + 57, ty + 4);
        ctx.lineTo(tx + 57, ty + 14);
        ctx.lineTo(tx + 32, ty + 14);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(tx + 61, ty + 4);
        ctx.lineTo(tx + 75, ty + 4);
        ctx.lineTo(tx + 87, ty + 14);
        ctx.lineTo(tx + 61, ty + 14);
        ctx.closePath();
        ctx.fill();

        // Diagonal window reflection streak
        ctx.fillStyle = 'rgba(180, 225, 255, 0.22)';
        ctx.beginPath();
        ctx.moveTo(tx + 44, ty + 4);
        ctx.lineTo(tx + 49, ty + 4);
        ctx.lineTo(tx + 42, ty + 14);
        ctx.lineTo(tx + 37, ty + 14);
        ctx.closePath();
        ctx.fill();

        // Door seam lines & chrome door handles
        ctx.strokeStyle = 'rgba(60, 35, 0, 0.55)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tx + 59, ty + 14);
        ctx.lineTo(tx + 59, ty + 31);
        ctx.moveTo(tx + 33, ty + 14);
        ctx.lineTo(tx + 33, ty + 30);
        ctx.moveTo(tx + 84, ty + 14);
        ctx.lineTo(tx + 82, ty + 30);
        ctx.stroke();
        ctx.fillStyle = '#dce3ee';
        ctx.fillRect(tx + 50, ty + 18, 5, 2);
        ctx.fillRect(tx + 73, ty + 18, 5, 2);

        // Side mirror
        ctx.fillStyle = '#d99814';
        ctx.fillRect(tx + 33, ty + 13, 5, 4);

        // Classic NYC black & white checker stripe
        for (let ck = 0; ck < 10; ck++) {
          const cx = tx + 24 + ck * 6;
          ctx.fillStyle = ck % 2 === 0 ? '#111' : '#f4f4f4';
          ctx.fillRect(cx, ty + 22, 6, 3);
          ctx.fillStyle = ck % 2 === 0 ? '#f4f4f4' : '#111';
          ctx.fillRect(cx, ty + 25, 6, 3);
        }

        // Chrome front & rear bumpers
        ctx.fillStyle = '#cfd6e0';
        ctx.fillRect(tx + 1, ty + 28, 8, 5);
        ctx.fillRect(tx + 108, ty + 28, 7, 5);

        // Warm glowing headlight + red taillight
        ctx.fillStyle = '#fff5b8';
        ctx.fillRect(tx + 3, ty + 19, 5, 5);
        const beam = ctx.createLinearGradient(tx + 3, ty + 21, tx - 34, ty + 28);
        beam.addColorStop(0, 'rgba(255, 240, 170, 0.32)');
        beam.addColorStop(1, 'rgba(255, 240, 170, 0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(tx + 3, ty + 19);
        ctx.lineTo(tx - 34, ty + 14);
        ctx.lineTo(tx - 34, ty + 36);
        ctx.lineTo(tx + 3, ty + 24);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff3838';
        ctx.fillRect(tx + 109, ty + 19, 4, 6);

        // Realistic wheel wells & alloy wheels
        for (const wx of [tx + 24, tx + 91]) {
          ctx.fillStyle = '#0c0e14';
          ctx.beginPath();
          ctx.arc(wx, ty + 33, 11.5, Math.PI, 0);
          ctx.fill();

          ctx.fillStyle = '#151821';
          ctx.strokeStyle = '#08090d';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(wx, ty + 34, 9.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#b9c2d0';
          ctx.beginPath();
          ctx.arc(wx, ty + 34, 5.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#4a5468';
          ctx.lineWidth = 1.2;
          for (let sp = 0; sp < 5; sp++) {
            const ang = (sp * Math.PI * 2) / 5;
            ctx.beginPath();
            ctx.moveTo(wx, ty + 34);
            ctx.lineTo(wx + Math.cos(ang) * 5, ty + 34 + Math.sin(ang) * 5);
            ctx.stroke();
          }
          ctx.fillStyle = '#262d3b';
          ctx.beginPath();
          ctx.arc(wx, ty + 34, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      } else if (i % 4 === 0) {
        // Detailed Blue & White City Delivery Van
        const vx = 112;
        const vy = bh - 56;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.56)';
        ctx.beginPath(); ctx.ellipse(vx + 65, vy + 52, 70, 6, 0, 0, Math.PI * 2); ctx.fill();
        const vanG = ctx.createLinearGradient(vx, vy, vx, vy + 43);
        vanG.addColorStop(0, '#f1f5f9'); vanG.addColorStop(0.46, '#cbd5e1'); vanG.addColorStop(0.48, '#2563eb'); vanG.addColorStop(0.88, '#1d4ed8'); vanG.addColorStop(1, '#1e3a8a');
        ctx.fillStyle = vanG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(vx + 4, vy + 41); ctx.lineTo(vx + 4, vy + 22); ctx.lineTo(vx + 19, vy + 4);
        ctx.lineTo(vx + 120, vy + 4); ctx.quadraticCurveTo(vx + 128, vy + 4, vx + 128, vy + 12);
        ctx.lineTo(vx + 128, vy + 41); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Roof rack & specular roof line
        ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
        ctx.strokeRect(vx + 36, vy - 2, 78, 5);
        ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(vx + 22, vy + 5.5, 98, 1.5);
        // Tinted windshield & glass reflection
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.moveTo(vx + 20, vy + 7); ctx.lineTo(vx + 37, vy + 7); ctx.lineTo(vx + 37, vy + 21); ctx.lineTo(vx + 10, vy + 21); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(186, 230, 253, 0.25)';
        ctx.beginPath(); ctx.moveTo(vx + 22, vy + 7); ctx.lineTo(vx + 27, vy + 7); ctx.lineTo(vx + 19, vy + 21); ctx.lineTo(vx + 14, vy + 21); ctx.closePath(); ctx.fill();
        // Cargo ribs, sliding door seam & chrome handle
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)'; ctx.lineWidth = 1.2;
        ctx.strokeRect(vx + 44, vy + 8, 44, 31);
        ctx.fillStyle = '#e2e8f0'; ctx.fillRect(vx + 48, vy + 24, 6, 2.2); ctx.fillRect(vx + 31, vy + 24, 5, 2);
        ctx.fillStyle = '#1e293b'; ctx.fillRect(vx + 36, vy + 18, 5, 4); // side mirror
        // Chrome bumpers, headlight & taillight
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(vx + 1, vy + 37, 8, 5); ctx.fillRect(vx + 122, vy + 37, 7, 5);
        ctx.fillStyle = '#fff5b8'; ctx.fillRect(vx + 2, vy + 28, 5, 6);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(vx + 124, vy + 26, 4, 8);
        for (const wx of [vx + 25, vx + 101]) {
          ctx.fillStyle = '#0b0e14'; ctx.beginPath(); ctx.arc(wx, vy + 41, 11.5, Math.PI, 0); ctx.fill();
          ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(wx, vy + 42, 9.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.arc(wx, vy + 42, 5.2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#334155'; ctx.beginPath(); ctx.arc(wx, vy + 42, 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      } else if (i % 4 === 2) {
        // Detailed Crimson Sports Coupe
        const sx = 124;
        const sy = bh - 42;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.56)';
        ctx.beginPath(); ctx.ellipse(sx + 60, sy + 38, 65, 5.5, 0, 0, Math.PI * 2); ctx.fill();
        const spG = ctx.createLinearGradient(sx, sy, sx, sy + 30);
        spG.addColorStop(0, '#f87171'); spG.addColorStop(0.35, '#dc2626'); spG.addColorStop(0.8, '#991b1b'); spG.addColorStop(1, '#450a0a');
        ctx.fillStyle = spG; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(sx + 4, sy + 28); ctx.lineTo(sx + 6, sy + 17); ctx.quadraticCurveTo(sx + 25, sy + 12, sx + 38, sy + 12);
        ctx.lineTo(sx + 52, sy + 2); ctx.quadraticCurveTo(sx + 74, sy + 1, sx + 96, sy + 12);
        ctx.lineTo(sx + 114, sy + 15); ctx.lineTo(sx + 116, sy + 28); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Rear carbon spoiler, side intake & racing stripe
        ctx.fillStyle = '#1e293b'; ctx.fillRect(sx + 106, sy + 7, 11, 4); ctx.fillRect(sx + 110, sy + 11, 3, 5);
        ctx.fillStyle = '#f8fafc'; ctx.fillRect(sx + 10, sy + 21, 98, 2.5);
        ctx.fillStyle = '#7f1d1d'; ctx.fillRect(sx + 74, sy + 16, 12, 4);
        // Tinted fastback cabin glass & reflection
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.moveTo(sx + 50, sy + 4); ctx.lineTo(sx + 76, sy + 4); ctx.lineTo(sx + 91, sy + 12); ctx.lineTo(sx + 40, sy + 12); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(186, 230, 253, 0.25)';
        ctx.beginPath(); ctx.moveTo(sx + 53, sy + 4); ctx.lineTo(sx + 59, sy + 4); ctx.lineTo(sx + 51, sy + 12); ctx.lineTo(sx + 45, sy + 12); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#e2e8f0'; ctx.fillRect(sx + 64, sy + 16, 6, 2); // chrome handle
        ctx.fillStyle = '#bae6fd'; ctx.fillRect(sx + 4, sy + 18, 7, 4); // xenon headlight
        ctx.fillStyle = '#ff3838'; ctx.fillRect(sx + 112, sy + 17, 4, 5);
        for (const wx of [sx + 25, sx + 93]) {
          ctx.fillStyle = '#0b0e14'; ctx.beginPath(); ctx.arc(wx, sy + 28, 11, Math.PI, 0); ctx.fill();
          ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(wx, sy + 29, 9.2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.arc(wx, sy + 29, 5.2, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.2;
          for (let sp = 0; sp < 5; sp++) { const a = (sp * Math.PI * 2) / 5; ctx.beginPath(); ctx.moveTo(wx, sy + 29); ctx.lineTo(wx + Math.cos(a) * 5, sy + 29 + Math.sin(a) * 5); ctx.stroke(); }
        }
        ctx.restore();
      } else {
        // Detailed Police Cruiser (i % 8 === 3) or Rugged Teal Pickup Truck (i % 8 === 7)
        const px = 122;
        const py = bh - 46;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.56)';
        ctx.beginPath(); ctx.ellipse(px + 58, py + 42, 64, 6, 0, 0, Math.PI * 2); ctx.fill();
        if (i % 8 === 3) {
          ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(px + 4, py + 32); ctx.lineTo(px + 6, py + 17); ctx.lineTo(px + 30, py + 14); ctx.lineTo(px + 42, py + 2); ctx.lineTo(px + 78, py + 2); ctx.lineTo(px + 92, py + 14); ctx.lineTo(px + 114, py + 18); ctx.lineTo(px + 114, py + 32); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#f8fafc'; ctx.fillRect(px + 34, py + 15, 48, 16);
          ctx.fillStyle = '#1e293b'; ctx.fillRect(px + 44, py + 4, 32, 10);
          ctx.fillStyle = '#0f172a'; ctx.font = 'bold 5.5px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('NYPD', px + 58, py + 25);
          ctx.fillStyle = '#cbd5e1'; ctx.fillRect(px + 1, py + 27, 7, 5); ctx.fillRect(px + 110, py + 27, 6, 5);
          ctx.fillStyle = '#fff5b8'; ctx.fillRect(px + 3, py + 19, 5, 5);
          ctx.fillStyle = '#ef4444'; ctx.fillRect(px + 111, py + 19, 4, 5);
          // Pulsing red/blue police lightbar
          const flash = Math.sin(time * 9 + i) > 0;
          ctx.fillStyle = flash ? '#ef4444' : '#3b82f6'; ctx.fillRect(px + 52, py - 3, 8, 5);
          ctx.fillStyle = flash ? '#3b82f6' : '#ef4444'; ctx.fillRect(px + 60, py - 3, 8, 5);
        } else {
          // Rugged Teal Pickup Truck
          const pkG = ctx.createLinearGradient(px, py, px, py + 32);
          pkG.addColorStop(0, '#14b8a6'); pkG.addColorStop(0.5, '#0d9488'); pkG.addColorStop(1, '#134e4a');
          ctx.fillStyle = pkG; ctx.strokeStyle = '#042f2e'; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(px + 4, py + 32); ctx.lineTo(px + 6, py + 15); ctx.lineTo(px + 28, py + 13); ctx.lineTo(px + 38, py + 1); ctx.lineTo(px + 68, py + 1); ctx.lineTo(px + 68, py + 15); ctx.lineTo(px + 116, py + 15); ctx.lineTo(px + 116, py + 32); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#1e293b'; ctx.fillRect(px + 40, py + 4, 23, 10);
          ctx.fillStyle = '#cbd5e1'; ctx.fillRect(px + 1, py + 27, 7, 5); ctx.fillRect(px + 112, py + 27, 6, 5); // chrome bumpers
          ctx.fillStyle = '#fff5b8'; ctx.fillRect(px + 3, py + 17, 5, 5); ctx.fillStyle = '#ef4444'; ctx.fillRect(px + 113, py + 17, 4, 6);
          ctx.strokeStyle = '#334155'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px + 68, py + 14); ctx.lineTo(px + 74, py + 3); ctx.stroke(); // rollbar
        }
        for (const wx of [px + 25, px + 94]) {
          ctx.fillStyle = '#0b0e14'; ctx.beginPath(); ctx.arc(wx, py + 33, 11.5, Math.PI, 0); ctx.fill();
          ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(wx, py + 34, 9.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.arc(wx, py + 34, 5.2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#334155'; ctx.beginPath(); ctx.arc(wx, py + 34, 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore();

      // Rising NYC street manhole steam plume
      if (i % 3 === 0) {
        const steamX = bx + 205;
        for (let s = 0; s < 4; s++) {
          const lift = ((time * 28 + s * 22) % 75);
          ctx.fillStyle = `rgba(220, 230, 245, ${0.14 * (1 - lift / 75)})`;
          ctx.beginPath();
          ctx.arc(steamX + Math.sin(time * 2 + s) * 8, 622 - lift, 10 + lift * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // Lively Stage 2 Night Market Background (Supermarket, Produce Market, Pizza Vitrine, Shoe Store, Bakery)
  function drawMarketMidgroundBuildings(ctx, camX, w, h, time) {
    const buildingW = 340;
    const count = 16;

    for (let i = 0; i < count; i++) {
      const bx = i * buildingW - camX * 0.5;
      if (bx + buildingW < -100 || bx > w + 100) continue;

      const bh = 420 + ((i * 53) % 110);
      const topY = h - 90 - bh;
      const shopType = i % 5;

      ctx.save();
      ctx.translate(bx, topY);

      // Warm market building facade
      const facadeColors = ['#2e2028', '#232836', '#332622', '#242333', '#30242d'];
      ctx.fillStyle = facadeColors[shopType];
      ctx.fillRect(0, 0, buildingW - 8, bh);

      // Parapet cornice
      ctx.fillStyle = '#4e3c4c';
      ctx.fillRect(-4, 0, buildingW, 14);
      ctx.fillStyle = '#685265';
      ctx.fillRect(-4, 0, buildingW, 4);

      // Warm apartment windows & flower boxes upstairs
      for (let row = 0; row < 2; row++) {
        const wy = 38 + row * 112;
        for (let col = 0; col < 3; col++) {
          const wx = 26 + col * 98;
          const lit = (i + row + col) % 3 !== 0;
          ctx.fillStyle = '#14101a';
          ctx.fillRect(wx, wy, 48, 66);
          ctx.fillStyle = lit ? 'rgba(255, 214, 130, 0.54)' : 'rgba(34, 40, 60, 0.85)';
          ctx.fillRect(wx + 4, wy + 4, 40, 58);
          ctx.strokeStyle = '#1c1522';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(wx + 4, wy + 32);
          ctx.lineTo(wx + 44, wy + 32);
          ctx.moveTo(wx + 24, wy + 4);
          ctx.lineTo(wx + 24, wy + 62);
          ctx.stroke();
          ctx.fillStyle = '#5c4654';
          ctx.fillRect(wx - 4, wy + 65, 56, 6);
          if (row === 1 && col !== 1) {
            ctx.fillStyle = '#2d6a4f';
            ctx.fillRect(wx + 4, wy + 57, 40, 8);
            ctx.fillStyle = '#ff758f';
            ctx.fillRect(wx + 10, wy + 55, 5, 4);
            ctx.fillRect(wx + 24, wy + 54, 5, 4);
            ctx.fillRect(wx + 35, wy + 56, 5, 4);
          }
        }
      }

      // Ground-floor lively market shop
      const shopY = bh - 134;
      const shopW = buildingW - 24;
      ctx.fillStyle = '#14111a';
      ctx.fillRect(8, shopY, shopW, 134);

      // Warm sidewalk light spill in front of each open shop
      const sidewalkGlow = ctx.createRadialGradient(shopW / 2 + 8, bh, 12, shopW / 2 + 8, bh, 145);
      sidewalkGlow.addColorStop(0, 'rgba(255, 210, 120, 0.24)');
      sidewalkGlow.addColorStop(1, 'rgba(255, 210, 120, 0)');
      ctx.fillStyle = sidewalkGlow;
      ctx.fillRect(-30, bh - 40, shopW + 76, 55);

      if (shopType === 0) {
        // 0. PIZZA RESTAURANT WITH WOOD-FIRED BRICK OVEN & ILLUMINATED GLASS VITRINE
        const winX = 20, winY = shopY + 26, winW = shopW - 76, winH = 92;
        const bg = ctx.createLinearGradient(winX, winY, winX, winY + winH);
        bg.addColorStop(0, 'rgba(255, 198, 120, 0.58)');
        bg.addColorStop(1, 'rgba(180, 72, 32, 0.38)');
        ctx.fillStyle = bg;
        ctx.fillRect(winX, winY, winW, winH);

        // Hanging copper pans & kitchen rack inside
        ctx.strokeStyle = 'rgba(55, 28, 16, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(winX + 14, winY + 14);
        ctx.lineTo(winX + 95, winY + 14);
        ctx.stroke();
        for (let pan = 0; pan < 3; pan++) {
          const px = winX + 26 + pan * 24;
          ctx.strokeStyle = '#3d2214';
          ctx.beginPath();
          ctx.moveTo(px, winY + 14);
          ctx.lineTo(px, winY + 23);
          ctx.stroke();
          ctx.fillStyle = '#c87544';
          ctx.beginPath();
          ctx.arc(px, winY + 27, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Brick wood-fired oven with glowing flickering fire
        const ovX = winX + winW - 44, ovY = winY + 46;
        ctx.fillStyle = '#6b2d26';
        ctx.beginPath();
        ctx.arc(ovX, ovY, 26, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#240b06';
        ctx.beginPath();
        ctx.arc(ovX, ovY, 15, Math.PI, 0);
        ctx.fill();
        const firePulse = 0.75 + 0.25 * Math.sin(time * 9 + i);
        ctx.fillStyle = `rgba(255, 115, 30, ${firePulse})`;
        ctx.beginPath();
        ctx.arc(ovX - 3, ovY - 2, 7, Math.PI, 0);
        ctx.arc(ovX + 4, ovY - 2, 5.5, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#ffe066';
        ctx.beginPath();
        ctx.arc(ovX, ovY - 1, 4, Math.PI, 0);
        ctx.fill();

        // Glass Vitrine / Display Case with heat lamps & 3 ultra-detailed pizzas
        const vitX = winX + 6, vitY = winY + 34, vitW = winW - 12, vitH = 54;
        const heatGlow = ctx.createLinearGradient(vitX, vitY, vitX, vitY + 34);
        heatGlow.addColorStop(0, 'rgba(255, 225, 140, 0.35)');
        heatGlow.addColorStop(1, 'rgba(255, 180, 90, 0.08)');
        ctx.fillStyle = heatGlow;
        ctx.fillRect(vitX, vitY, vitW, vitH);
        ctx.fillStyle = '#6b2d26';
        ctx.fillRect(vitX, vitY + 34, vitW, 20);
        ctx.fillStyle = '#a8b2c4';
        ctx.fillRect(vitX, vitY + 32, vitW, 3);

        for (let pIdx = 0; pIdx < 3; pIdx++) {
          const px = vitX + 34 + pIdx * 57;
          const py = vitY + 23;
          // Stainless/wood serving peel tray
          ctx.fillStyle = '#dce3ee';
          ctx.strokeStyle = '#6c7a89';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(px, py + 3, 23, 6.8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Blistered golden-brown crust
          ctx.fillStyle = '#c87528';
          ctx.beginPath();
          ctx.ellipse(px, py, 20.5, 5.8, 0, 0, Math.PI * 2);
          ctx.fill();
          // Rich tomato sauce rim
          ctx.fillStyle = '#c92a2a';
          ctx.beginPath();
          ctx.ellipse(px, py - 0.3, 17.5, 4.6, 0, 0, Math.PI * 2);
          ctx.fill();
          // Melted mozzarella cheese layer
          ctx.fillStyle = '#ffd65c';
          ctx.beginPath();
          ctx.ellipse(px, py - 0.6, 16, 4.1, 0, 0, Math.PI * 2);
          ctx.fill();
          // Crisp slice cut lines
          ctx.strokeStyle = 'rgba(130, 55, 10, 0.45)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(px - 15, py - 0.5); ctx.lineTo(px + 15, py - 0.5);
          ctx.moveTo(px - 8, py - 3.8); ctx.lineTo(px + 8, py + 2.8);
          ctx.moveTo(px + 8, py - 3.8); ctx.lineTo(px - 8, py + 2.8);
          ctx.stroke();
          // Pepperoni slices with fat highlights
          const peps = [[-8, -1.8], [3, -1.5], [-2, 1.2], [9, 0.4], [-11, 0.8]];
          for (const [ox, oy] of peps) {
            ctx.fillStyle = '#b01c1c';
            ctx.beginPath();
            ctx.ellipse(px + ox, py + oy, 2.5, 1.2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 220, 200, 0.55)';
            ctx.fillRect(px + ox - 0.8, py + oy - 0.4, 1, 0.6);
          }
          // Black olive rings & fresh basil leaves
          ctx.strokeStyle = '#1d1e22';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(px + 5, py + 1.5, 1.6, 0.9, 0, 0, Math.PI * 2);
          ctx.ellipse(px - 5, py - 2.1, 1.5, 0.8, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#2b8a3e';
          ctx.beginPath();
          ctx.ellipse(px + 1, py - 2.3, 2.4, 1, 0.3, 0, Math.PI * 2);
          ctx.ellipse(px - 6, py + 1.5, 2.2, 0.9, -0.3, 0, Math.PI * 2);
          ctx.fill();
          // Animated rising steam wisps
          const steamOff = (time * 16 + pIdx * 7) % 15;
          ctx.strokeStyle = `rgba(255,255,255,${0.42 * (1 - steamOff / 15)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(px - 4, py - 6 - steamOff);
          ctx.quadraticCurveTo(px - 7, py - 10 - steamOff, px - 2, py - 14 - steamOff);
          ctx.moveTo(px + 4, py - 5 - steamOff);
          ctx.quadraticCurveTo(px + 7, py - 9 - steamOff, px + 3, py - 13 - steamOff);
          ctx.stroke();
        }
        // Diagonal vitrine glass reflection & gold frame
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.beginPath();
        ctx.moveTo(vitX + 12, vitY);
        ctx.lineTo(vitX + 34, vitY);
        ctx.lineTo(vitX + 18, vitY + 34);
        ctx.lineTo(vitX + 2, vitY + 34);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(vitX, vitY, vitW, vitH);

        // Italian flag striped awning
        for (let s = 0; s < 9; s++) {
          ctx.fillStyle = s % 3 === 0 ? '#2b8a3e' : s % 3 === 1 ? '#f8f9fa' : '#d9383a';
          ctx.fillRect(14 + s * 32, shopY + 8, 32, 16);
        }
        drawShopBanner(ctx, 20, shopY - 14, 185, '🍕', 'BELLA PIZZA', 'WOOD OVEN • VITRINE', '#ff6b6b');
      } else if (shopType === 1) {
        // 1. SUPERMARKET (MAX SUPERMARKET)
        const winX = 18, winY = shopY + 24, winW = shopW - 68, winH = 96;
        ctx.fillStyle = 'rgba(215, 240, 255, 0.34)';
        ctx.fillRect(winX, winY, winW, winH);
        for (let sh = 0; sh < 3; sh++) {
          const sy = winY + 22 + sh * 24;
          ctx.fillStyle = '#2c3e50';
          ctx.fillRect(winX + 8, sy, winW - 16, 4);
          const itemCols = ['#ff6b6b', '#ffd166', '#4ecdc4', '#a29bfe', '#55efc4'];
          for (let ix = winX + 12, k = 0; ix < winX + winW - 18; ix += 14, k++) {
            const col = itemCols[(k + sh) % itemCols.length];
            ctx.fillStyle = col;
            const ih = k % 2 === 0 ? 12 : 9;
            ctx.fillRect(ix, sy - ih, 9, ih);
            ctx.fillStyle = 'rgba(255,255,255,0.65)';
            ctx.fillRect(ix + 1, sy - ih + 3, 7, 3);
          }
        }
        ctx.fillStyle = '#0d1b2a';
        ctx.strokeStyle = '#4ee8ff';
        ctx.lineWidth = 1.5;
        ctx.fillRect(winX + winW - 44, winY + 6, 36, 16);
        ctx.strokeRect(winX + winW - 44, winY + 6, 36, 16);
        ctx.fillStyle = '#4ee8ff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('24/7', winX + winW - 26, winY + 17);
        ctx.strokeStyle = '#b9c2d0';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(shopW - 38, bh - 26, 22, 14);
        ctx.beginPath();
        ctx.moveTo(shopW - 16, bh - 26);
        ctx.lineTo(shopW - 11, bh - 32);
        ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(shopW - 34, bh - 9, 3, 0, Math.PI * 2);
        ctx.arc(shopW - 20, bh - 9, 3, 0, Math.PI * 2);
        ctx.fill();
        drawShopBanner(ctx, 20, shopY - 14, 195, '🛒', 'MAX SUPERMARKET', 'GROCERIES • FRESH FOOD', '#4ee8ff');
      } else if (shopType === 2) {
        // 2. FRESH PRODUCE & VEGETABLE MARKET (Detailed Fruits, Veggies, Slatted Crates & Price Tags)
        const winX = 18, winY = shopY + 26, winW = shopW - 60, winH = 92;
        ctx.fillStyle = 'rgba(255, 226, 155, 0.36)';
        ctx.fillRect(winX, winY, winW, winH);
        for (let s = 0; s < 10; s++) {
          ctx.fillStyle = s % 2 === 0 ? '#2d6a4f' : '#f1faee';
          ctx.fillRect(12 + s * 29, shopY + 6, 29, 17);
        }
        const crates = [
          { x: 20, kind: 'apples', price: '$1.99' },
          { x: 82, kind: 'oranges', price: '$2.49' },
          { x: 144, kind: 'bananas', price: '$1.49' },
          { x: 206, kind: 'greens', price: '$1.79' },
        ];
        for (const cr of crates) {
          // Slatted wooden produce crate
          ctx.fillStyle = '#784920';
          ctx.strokeStyle = '#3b2208';
          ctx.lineWidth = 1.4;
          ctx.fillRect(cr.x, bh - 34, 54, 24);
          ctx.strokeRect(cr.x, bh - 34, 54, 24);
          ctx.fillStyle = '#4f2d11';
          ctx.fillRect(cr.x + 2, bh - 27, 50, 2.5);
          ctx.fillRect(cr.x + 2, bh - 19, 50, 2.5);
          // Chalkboard price tag
          ctx.fillStyle = '#181c24';
          ctx.strokeStyle = '#d4a373';
          ctx.lineWidth = 1;
          ctx.fillRect(cr.x + 14, bh - 29, 26, 12);
          ctx.strokeRect(cr.x + 14, bh - 29, 26, 12);
          ctx.fillStyle = '#fff3b0';
          ctx.font = 'bold 7.5px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(cr.price, cr.x + 27, bh - 20);

          // Detailed produce items piled inside
          if (cr.kind === 'apples') {
            for (let row = 0; row < 2; row++) {
              const countRow = row === 0 ? 4 : 3;
              for (let k = 0; k < countRow; k++) {
                const ax = cr.x + (row === 0 ? 10 : 15) + k * 11;
                const ay = bh - 37 - row * 7;
                ctx.fillStyle = k % 2 === 0 ? '#e63946' : '#c92a2a';
                ctx.beginPath(); ctx.arc(ax, ay, 5.5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = 'rgba(255,255,255,0.45)';
                ctx.beginPath(); ctx.arc(ax - 1.5, ay - 2, 1.4, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#2b8a3e';
                ctx.fillRect(ax - 0.5, ay - 7, 1.5, 3);
              }
            }
          } else if (cr.kind === 'oranges') {
            // Oranges + leafy carrots
            for (let k = 0; k < 4; k++) {
              const ox = cr.x + 10 + k * 11;
              const oy = bh - 37;
              ctx.fillStyle = '#f77f00';
              ctx.beginPath(); ctx.arc(ox, oy, 5.5, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = 'rgba(255,230,170,0.4)';
              ctx.beginPath(); ctx.arc(ox - 1.5, oy - 1.8, 1.3, 0, Math.PI * 2); ctx.fill();
            }
            for (let k = 0; k < 3; k++) {
              const cx = cr.x + 15 + k * 12;
              ctx.fillStyle = '#ff6d00';
              ctx.beginPath();
              ctx.moveTo(cx - 3, bh - 42); ctx.lineTo(cx + 3, bh - 42); ctx.lineTo(cx, bh - 50);
              ctx.closePath(); ctx.fill();
              ctx.fillStyle = '#2d6a4f';
              ctx.fillRect(cx - 2, bh - 53, 4, 3);
            }
          } else if (cr.kind === 'bananas') {
            // Striped watermelon + curved yellow bananas
            ctx.fillStyle = '#2b9348';
            ctx.beginPath(); ctx.ellipse(cr.x + 18, bh - 40, 11, 7.5, -0.2, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#081c15';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(cr.x + 12, bh - 46); ctx.quadraticCurveTo(cr.x + 15, bh - 40, cr.x + 12, bh - 34);
            ctx.moveTo(cr.x + 20, bh - 47); ctx.quadraticCurveTo(cr.x + 23, bh - 40, cr.x + 20, bh - 33);
            ctx.stroke();
            for (let b = 0; b < 3; b++) {
              ctx.strokeStyle = '#ffd166';
              ctx.lineWidth = 3.2;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.arc(cr.x + 36 + b * 4, bh - 43, 8, 0.3, 2.3);
              ctx.stroke();
            }
          } else {
            // Layered green lettuce & cabbage heads
            for (let k = 0; k < 3; k++) {
              const lx = cr.x + 14 + k * 13;
              const ly = bh - 39 - (k % 2) * 3;
              ctx.fillStyle = '#40916c';
              ctx.beginPath(); ctx.arc(lx, ly, 7.2, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = '#74c69d';
              ctx.beginPath(); ctx.arc(lx - 1, ly - 1, 4.5, 0, Math.PI * 2); ctx.fill();
              ctx.strokeStyle = '#d8f3dc';
              ctx.lineWidth = 0.8;
              ctx.beginPath(); ctx.arc(lx, ly, 3, 0.4, 2.4); ctx.stroke();
            }
          }
        }
        drawShopBanner(ctx, 20, shopY - 14, 190, '🥬', 'GREEN GARDEN', 'FRESH FRUITS & VEGGIES', '#52b788');
      } else if (shopType === 3) {
        // 3. SHOE STORE WITH ILLUMINATED SNEAKER VITRINE
        const winX = 20, winY = shopY + 24, winW = shopW - 68, winH = 94;
        const shoeBg = ctx.createLinearGradient(winX, winY, winX, winY + winH);
        shoeBg.addColorStop(0, 'rgba(130, 175, 255, 0.34)');
        shoeBg.addColorStop(1, 'rgba(65, 55, 115, 0.28)');
        ctx.fillStyle = shoeBg;
        ctx.fillRect(winX, winY, winW, winH);
        ctx.strokeStyle = '#a29bfe';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(winX, winY, winW, winH);
        const shoeCols = ['#ff6b6b', '#4ecdc4', '#ffd166', '#ffffff', '#ff9f43', '#74b9ff'];
        for (let row = 0; row < 2; row++) {
          const sy = winY + 34 + row * 38;
          ctx.fillStyle = 'rgba(220, 235, 255, 0.45)';
          ctx.fillRect(winX + 12, sy, winW - 24, 3);
          for (let c = 0; c < 3; c++) {
            const sx = winX + 34 + c * 62;
            const sc = shoeCols[(row * 3 + c) % shoeCols.length];
            ctx.fillStyle = sc;
            ctx.beginPath();
            ctx.roundRect(sx - 12, sy - 11, 24, 9, [4, 6, 2, 2]);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sx - 12, sy - 3, 25, 3);
          }
        }
        ctx.fillStyle = '#ff4757';
        ctx.beginPath();
        ctx.roundRect(winX + winW - 48, winY + 6, 40, 15, 3);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SALE 50%', winX + winW - 28, winY + 16);
        drawShopBanner(ctx, 20, shopY - 14, 180, '👟', 'URBAN SHOES', 'SNEAKERS • BOOTS', '#c56cf0');
      } else {
        // 4. ARTISAN ICE CREAM & GELATO PARLOR
        const winX = 20, winY = shopY + 26, winW = shopW - 68, winH = 92;
        const iceBg = ctx.createLinearGradient(winX, winY, winX, winY + winH);
        iceBg.addColorStop(0, 'rgba(255, 210, 235, 0.46)');
        iceBg.addColorStop(1, 'rgba(130, 210, 255, 0.3)');
        ctx.fillStyle = iceBg;
        ctx.fillRect(winX, winY, winW, winH);
        // Pastel pink & cream striped awning
        for (let s = 0; s < 9; s++) {
          ctx.fillStyle = s % 2 === 0 ? '#ff758f' : '#fff8f0';
          ctx.fillRect(14 + s * 32, shopY + 8, 32, 16);
        }
        // Glass gelato freezer vitrine
        const fX = winX + 8, fY = winY + 34, fW = winW - 16, fH = 54;
        ctx.fillStyle = 'rgba(220, 248, 255, 0.25)';
        ctx.fillRect(fX, fY, fW, fH);
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(fX, fY + 30, fW, 24);
        ctx.fillStyle = '#b8e0f6';
        ctx.fillRect(fX, fY + 28, fW, 3);
        // 5 colorful creamy gelato tubs inside freezer
        const flavors = [
          { top: '#ff758f', swirl: '#ffb3c1' }, // Strawberry
          { top: '#80ed99', swirl: '#c7f9cc' }, // Pistachio
          { top: '#fff3b0', swirl: '#ffffff' }, // Vanilla
          { top: '#6f4518', swirl: '#a47148' }, // Chocolate
          { top: '#ffb703', swirl: '#ffd166' }, // Mango
        ];
        for (let fIdx = 0; fIdx < flavors.length; fIdx++) {
          const tx = fX + 12 + fIdx * 36;
          const ty = fY + 18;
          ctx.fillStyle = '#ced4da';
          ctx.fillRect(tx, ty + 4, 28, 8);
          ctx.fillStyle = flavors[fIdx].top;
          ctx.beginPath();
          ctx.ellipse(tx + 14, ty + 3, 13, 5.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = flavors[fIdx].swirl;
          ctx.beginPath();
          ctx.ellipse(tx + 14, ty + 1.5, 8, 2.8, 0.2, 0, Math.PI * 2);
          ctx.fill();
          // Metal serving scoop handle
          ctx.strokeStyle = '#adb5bd';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(tx + 20, ty + 2);
          ctx.lineTo(tx + 25, ty - 5);
          ctx.stroke();
        }
        // Stacked waffle cones on right counter
        for (let c = 0; c < 3; c++) {
          const cx = fX + fW - 22 + c * 5;
          ctx.fillStyle = '#d4a373';
          ctx.strokeStyle = '#8c5a2b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - 4, fY + 10);
          ctx.lineTo(cx + 4, fY + 10);
          ctx.lineTo(cx, fY + 28);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        // Freezer glass reflection & frame
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.beginPath();
        ctx.moveTo(fX + 16, fY); ctx.lineTo(fX + 36, fY); ctx.lineTo(fX + 20, fY + 30); ctx.lineTo(fX + 4, fY + 30);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#90e0ef';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(fX, fY, fW, fH);
        drawShopBanner(ctx, 20, shopY - 14, 185, '🍨', 'SWEET GELATO', 'ICE CREAM • WAFFLES', '#ff8fab');
      }

      // Shop entrance door on right
      ctx.fillStyle = '#29202c';
      ctx.fillRect(shopW - 44, shopY + 24, 34, 110);
      ctx.fillStyle = 'rgba(255, 216, 140, 0.35)';
      ctx.fillRect(shopW - 39, shopY + 32, 24, 48);

      // Lively articulated walking market shoppers with coats, scarves & shopping bags
      const walkerDir = i % 2 === 0 ? 1 : -1;
      const rawWalk = (time * (26 + (i % 3) * 7) + i * 95) % (buildingW - 44);
      const walkerX = walkerDir === 1 ? rawWalk + 14 : buildingW - 24 - rawWalk;
      const walkPhase = time * 6.5 + i;
      const legSwing = Math.sin(walkPhase) * 4.5;
      const walkBob = Math.abs(Math.cos(walkPhase)) * 1.8;
      const coats = ['#3b5998', '#c0392b', '#2c786c', '#8e44ad', '#d35400'];
      const coatCol = coats[i % coats.length];
      const bagCol = i % 2 === 0 ? '#f4d35e' : '#ff8fab';

      ctx.save();
      ctx.translate(walkerX, bh - 2);
      ctx.scale(walkerDir, 1);
      // Ground shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
      ctx.beginPath(); ctx.ellipse(0, 1, 8, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      // Swinging legs & shoes
      ctx.strokeStyle = '#1b2234';
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-1.5, -13 - walkBob); ctx.lineTo(-1.5 + legSwing, -1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1.5, -13 - walkBob); ctx.lineTo(1.5 - legSwing, -1); ctx.stroke();
      // Coat torso
      ctx.fillStyle = coatCol;
      ctx.beginPath(); ctx.roundRect(-5.5, -28 - walkBob, 11, 16, 3); ctx.fill();
      // Warm scarf
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(-4.5, -28 - walkBob, 9, 3);
      // Head & hair/beanie
      ctx.fillStyle = '#f1c29b';
      ctx.beginPath(); ctx.arc(0, -33 - walkBob, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = i % 3 === 0 ? '#2b1d14' : '#4a2c1d';
      ctx.beginPath(); ctx.arc(-0.5, -34.5 - walkBob, 4.5, Math.PI, 0); ctx.fill();
      // Swinging arm holding paper shopping bag
      ctx.strokeStyle = coatCol;
      ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(1, -25 - walkBob); ctx.lineTo(3 - legSwing * 0.6, -15 - walkBob); ctx.stroke();
      ctx.fillStyle = bagCol;
      ctx.fillRect(1 - legSwing * 0.6, -15 - walkBob, 6, 7.5);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(4 - legSwing * 0.6, -15 - walkBob, 1.8, Math.PI, 0); ctx.stroke();
      ctx.restore();

      ctx.restore();
    }
  }

  // Stage 3: Lush Public Park Night Sky, Moon, Rolling Hills & Fireflies
  function drawParkSkyAndHorizon(ctx, camX, w, h, time) {
    initPatterns(ctx);

    // Deep emerald-indigo night sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#07101f');
    sky.addColorStop(0.42, '#102332');
    sky.addColorStop(0.76, '#1a3836');
    sky.addColorStop(1, '#0f1c1d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Twinkling stars
    for (let i = 0; i < 60; i++) {
      const sx = (i * 181) % w;
      const sy = (i * 43) % 240;
      const alpha = 0.25 + 0.65 * Math.abs(Math.sin(time * 1.4 + i * 0.8));
      ctx.fillStyle = `rgba(240, 255, 235, ${alpha})`;
      ctx.fillRect(sx, sy, i % 5 === 0 ? 2.2 : 1.4, i % 5 === 0 ? 2.2 : 1.4);
    }

    // Full glowing silver-gold moon
    const moonX = 960 - camX * 0.03;
    const moonY = 98;
    const halo = ctx.createRadialGradient(moonX, moonY, 20, moonX, moonY, 155);
    halo.addColorStop(0, 'rgba(235, 255, 225, 0.38)');
    halo.addColorStop(0.5, 'rgba(170, 240, 210, 0.1)');
    halo.addColorStop(1, 'rgba(170, 240, 210, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 155, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f4fae0';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 34, 0, Math.PI * 2);
    ctx.fill();

    // Distant city skyline far behind the park trees
    for (let i = 0; i < 20; i++) {
      const bx = i * 145 - ((camX * 0.08) % 145);
      const bh = 95 + ((i * 53) % 110);
      const bw = 80 + ((i * 19) % 30);
      const topY = h - 180 - bh;
      ctx.fillStyle = 'rgba(14, 24, 38, 0.72)';
      ctx.fillRect(bx, topY, bw, bh);
      for (let wy = topY + 12; wy < h - 190; wy += 16) {
        for (let wx = bx + 10; wx < bx + bw - 10; wx += 14) {
          if ((wx + wy + i) % 5 === 0) {
            ctx.fillStyle = 'rgba(255, 225, 150, 0.2)';
            ctx.fillRect(wx, wy, 5, 7);
          }
        }
      }
    }

    // Rolling layered park hills
    ctx.fillStyle = '#122925';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 60; x += 60) {
      const hillY = h - 220 + Math.sin((x + camX * 0.14) * 0.0045) * 42;
      ctx.lineTo(x, hillY);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#18362e';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 50; x += 50) {
      const hillY = h - 165 + Math.cos((x + camX * 0.25) * 0.006) * 32;
      ctx.lineTo(x, hillY);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Drifting glowing fireflies
    for (let f = 0; f < 34; f++) {
      const fx = ((f * 137 + time * (12 + (f % 3) * 5)) % (w + 40)) - 20;
      const fy = 220 + ((f * 73) % 360) + Math.sin(time * 2.2 + f) * 18;
      const glowAlpha = 0.35 + 0.65 * Math.abs(Math.sin(time * 3.1 + f * 1.3));
      ctx.fillStyle = `rgba(195, 255, 110, ${glowAlpha * 0.25})`;
      ctx.beginPath();
      ctx.arc(fx, fy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(235, 255, 160, ${glowAlpha})`;
      ctx.beginPath();
      ctx.arc(fx, fy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Stage 3: Detailed Park Midground (Trees, Fountains, Gazebo, Flowerbeds, Iron Fence & Strollers)
  function drawParkMidground(ctx, camX, w, h, time) {
    const span = 380;
    const count = 16;
    const groundY = h - 90;

    // Wrought-iron park perimeter fence in midground
    const fenceStart = -((camX * 0.5) % 24);
    ctx.strokeStyle = '#141d24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY - 46);
    ctx.lineTo(w, groundY - 46);
    ctx.moveTo(0, groundY - 12);
    ctx.lineTo(w, groundY - 12);
    ctx.stroke();
    for (let fx = fenceStart; fx < w + 24; fx += 24) {
      ctx.beginPath();
      ctx.moveTo(fx, groundY);
      ctx.lineTo(fx, groundY - 52);
      ctx.stroke();
      ctx.fillStyle = '#253540';
      ctx.beginPath();
      ctx.moveTo(fx - 3, groundY - 52);
      ctx.lineTo(fx, groundY - 58);
      ctx.lineTo(fx + 3, groundY - 52);
      ctx.closePath();
      ctx.fill();
    }

    for (let i = 0; i < count; i++) {
      const bx = i * span - camX * 0.5;
      if (bx + span < -120 || bx > w + 120) continue;

      ctx.save();
      ctx.translate(bx, groundY);

      // Lush Park Oak / Weeping Willow Tree
      const treeX = 75;
      const trunkH = 190 + (i % 3) * 28;
      ctx.fillStyle = '#382214';
      ctx.beginPath();
      ctx.moveTo(treeX - 16, 0);
      ctx.quadraticCurveTo(treeX - 10, -trunkH * 0.5, treeX - 8, -trunkH);
      ctx.lineTo(treeX + 8, -trunkH);
      ctx.quadraticCurveTo(treeX + 10, -trunkH * 0.5, treeX + 16, 0);
      ctx.closePath();
      ctx.fill();
      // Bark highlight
      ctx.strokeStyle = 'rgba(130, 88, 56, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(treeX - 4, -8);
      ctx.lineTo(treeX - 3, -trunkH + 20);
      ctx.stroke();
      // Layered leafy canopy
      const canopyCols = ['#143628', '#1d4d38', '#276447'];
      const blobs = [
        { ox: -38, oy: -trunkH + 10, r: 44 },
        { ox: 38, oy: -trunkH + 14, r: 42 },
        { ox: -18, oy: -trunkH - 22, r: 48 },
        { ox: 22, oy: -trunkH - 18, r: 45 },
        { ox: 0, oy: -trunkH - 36, r: 50 },
      ];
      for (let b = 0; b < blobs.length; b++) {
        ctx.fillStyle = canopyCols[b % canopyCols.length];
        ctx.beginPath();
        ctx.arc(treeX + blobs[b].ox, blobs[b].oy, blobs[b].r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Feature per span: Ornamental Fountain, Gazebo Pavilion, or Flowerbed + Bench
      const feature = i % 3;
      if (feature === 0) {
        // Ornamental Multi-Tiered Stone Water Fountain with animated water jets
        const fX = 235;
        ctx.fillStyle = '#4e5b6e';
        ctx.strokeStyle = '#232a36';
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.roundRect(fX - 52, -18, 104, 18, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#63738a';
        ctx.fillRect(fX - 10, -56, 20, 38);
        ctx.beginPath(); ctx.ellipse(fX, -56, 32, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#4e5b6e';
        ctx.fillRect(fX - 6, -84, 12, 28);
        ctx.beginPath(); ctx.ellipse(fX, -84, 18, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Shimmering water basin & arcing jets
        ctx.fillStyle = 'rgba(110, 220, 255, 0.55)';
        ctx.fillRect(fX - 48, -20, 96, 4);
        const jetH = 26 + Math.sin(time * 5 + i) * 4;
        ctx.strokeStyle = 'rgba(175, 240, 255, 0.78)';
        ctx.lineWidth = 2;
        for (const dir of [-1, 0, 1]) {
          ctx.beginPath();
          ctx.moveTo(fX, -86);
          ctx.quadraticCurveTo(fX + dir * 18, -86 - jetH, fX + dir * 32, -56);
          ctx.stroke();
        }
        for (const dir of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(fX + dir * 24, -54);
          ctx.quadraticCurveTo(fX + dir * 38, -42, fX + dir * 42, -18);
          ctx.stroke();
        }
      } else if (feature === 1) {
        // Cozy Wooden Park Gazebo / Pavilion
        const gX = 235;
        ctx.fillStyle = '#5c371c';
        ctx.fillRect(gX - 54, -10, 108, 10);
        ctx.fillStyle = '#7a4b28';
        ctx.fillRect(gX - 46, -82, 7, 72);
        ctx.fillRect(gX + 39, -82, 7, 72);
        ctx.fillRect(gX - 4, -82, 8, 72);
        // Pointed gazebo roof
        ctx.fillStyle = '#2d4f43';
        ctx.strokeStyle = '#142620';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(gX - 64, -82);
        ctx.lineTo(gX, -124);
        ctx.lineTo(gX + 64, -82);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Warm hanging lantern inside gazebo
        const gGlow = ctx.createRadialGradient(gX, -62, 2, gX, -62, 42);
        gGlow.addColorStop(0, 'rgba(255, 225, 130, 0.65)');
        gGlow.addColorStop(1, 'rgba(255, 225, 130, 0)');
        ctx.fillStyle = gGlow;
        ctx.beginPath(); ctx.arc(gX, -62, 42, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffe899';
        ctx.beginPath(); ctx.arc(gX, -62, 4.5, 0, Math.PI * 2); ctx.fill();
      } else {
        // Colorful Flowerbeds (Tulips & Roses) + Park Wooden Signpost
        const fbX = 185;
        ctx.fillStyle = '#244d34';
        ctx.beginPath(); ctx.roundRect(fbX, -16, 110, 16, 6); ctx.fill();
        const flowerCols = ['#ff595e', '#ffca3a', '#ff8fab', '#a29bfe'];
        for (let fl = 0; fl < 9; fl++) {
          const fx = fbX + 10 + fl * 11;
          ctx.strokeStyle = '#40916c';
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(fx, -12); ctx.lineTo(fx, -22); ctx.stroke();
          ctx.fillStyle = flowerCols[(fl + i) % flowerCols.length];
          ctx.beginPath(); ctx.arc(fx, -23, 3.5, 0, Math.PI * 2); ctx.fill();
        }
        // Wooden Park Signpost
        ctx.fillStyle = '#5c371c';
        ctx.fillRect(fbX + 126, -54, 6, 54);
        ctx.fillStyle = '#8b572d';
        ctx.strokeStyle = '#3b200d';
        ctx.lineWidth = 1.2;
        ctx.fillRect(fbX + 104, -50, 48, 18);
        ctx.strokeRect(fbX + 104, -50, 48, 18);
        ctx.fillStyle = '#fff3b0';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PARK', fbX + 128, -38);
      }

      // Background Park Visitors / Joggers strolling along path
      const walkerDir = i % 2 === 0 ? 1 : -1;
      const rawWalk = (time * (32 + (i % 3) * 8) + i * 110) % (span - 40);
      const walkerX = walkerDir === 1 ? rawWalk + 20 : span - 20 - rawWalk;
      const walkPhase = time * 7 + i;
      const legSwing = Math.sin(walkPhase) * 5;
      const walkBob = Math.abs(Math.cos(walkPhase)) * 2;
      const jacketCols = ['#2a9d8f', '#e76f51', '#457b9d', '#9b5de5'];
      const jCol = jacketCols[i % jacketCols.length];

      ctx.save();
      ctx.translate(walkerX, -2);
      ctx.scale(walkerDir, 1);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath(); ctx.ellipse(0, 1, 7, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#182230';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-1.5, -13 - walkBob); ctx.lineTo(-1.5 + legSwing, -1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1.5, -13 - walkBob); ctx.lineTo(1.5 - legSwing, -1); ctx.stroke();
      ctx.fillStyle = jCol;
      ctx.beginPath(); ctx.roundRect(-5, -28 - walkBob, 10, 15, 3); ctx.fill();
      ctx.fillStyle = '#f1c29b';
      ctx.beginPath(); ctx.arc(0, -33 - walkBob, 4.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2b1d14';
      ctx.beginPath(); ctx.arc(-0.5, -34.5 - walkBob, 4.2, Math.PI, 0); ctx.fill();
      ctx.restore();

      ctx.restore();
    }
  }

  // Stage 5: Harbor Night Sky, Full Moon Reflection, Rotating Lighthouse & Ocean Waves
  function drawHarborSkyAndSea(ctx, camX, w, h, time) {
    initPatterns(ctx);

    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#050c1a');
    sky.addColorStop(0.42, '#0c2036');
    sky.addColorStop(0.72, '#143247');
    sky.addColorStop(1, '#091826');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Crisp stars over the sea
    for (let i = 0; i < 65; i++) {
      const sx = (i * 199) % w;
      const sy = (i * 41) % 250;
      const alpha = 0.25 + 0.65 * Math.abs(Math.sin(time * 1.3 + i * 0.7));
      ctx.fillStyle = `rgba(225, 242, 255, ${alpha})`;
      ctx.fillRect(sx, sy, i % 5 === 0 ? 2 : 1.4, i % 5 === 0 ? 2 : 1.4);
    }

    // Large glowing moon + shimmering reflection path on the sea
    const moonX = 940 - camX * 0.03;
    const moonY = 96;
    const halo = ctx.createRadialGradient(moonX, moonY, 18, moonX, moonY, 150);
    halo.addColorStop(0, 'rgba(225, 245, 255, 0.36)');
    halo.addColorStop(0.55, 'rgba(130, 200, 255, 0.1)');
    halo.addColorStop(1, 'rgba(130, 200, 255, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(moonX, moonY, 150, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f2f7ff';
    ctx.beginPath(); ctx.arc(moonX, moonY, 32, 0, Math.PI * 2); ctx.fill();

    // Distant sea horizon
    const seaY = h - 205;
    const seaGrad = ctx.createLinearGradient(0, seaY, 0, h);
    seaGrad.addColorStop(0, '#0d2b3e');
    seaGrad.addColorStop(0.5, '#092030');
    seaGrad.addColorStop(1, '#05121d');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, seaY, w, h - seaY);

    // Moon reflection shimmer column on water
    for (let r = 0; r < 10; r++) {
      const ry = seaY + 8 + r * 14;
      const rw = 44 - r * 2 + Math.sin(time * 3 + r) * 8;
      ctx.fillStyle = `rgba(220, 242, 255, ${0.22 - r * 0.015})`;
      ctx.fillRect(moonX - rw / 2, ry, rw, 3);
    }

    // Distant Grand Ocean Steamship / Passenger Liner cruising on the horizon
    for (let sIdx = 0; sIdx < 2; sIdx++) {
      const shipX = ((sIdx * 760 + 260 - camX * 0.16 - time * (sIdx === 0 ? 14 : 9)) % (w + 480));
      const sx = shipX < -240 ? shipX + w + 480 : shipX;
      const sy = seaY + 4;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.fillStyle = '#121b2b';
      ctx.beginPath();
      ctx.moveTo(-110, -14);
      ctx.lineTo(118, -14);
      ctx.lineTo(98, 4);
      ctx.lineTo(-94, 4);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#cfd8e8';
      ctx.fillRect(-76, -26, 150, 12);
      ctx.fillRect(-58, -36, 114, 10);
      ctx.fillStyle = 'rgba(255, 220, 130, 0.85)';
      for (let px = -68; px <= 64; px += 12) {
        ctx.fillRect(px, -23, 5, 4);
      }
      for (let px = -50; px <= 46; px += 14) {
        ctx.fillRect(px, -33, 6, 4);
      }
      for (const fx of [-24, 18]) {
        ctx.fillStyle = '#c93434';
        ctx.fillRect(fx, -54, 12, 18);
        ctx.fillStyle = '#141924';
        ctx.fillRect(fx, -54, 12, 5);
        for (let p = 0; p < 4; p++) {
          const drift = ((time * 18 + p * 12 + sIdx * 9) % 45);
          ctx.fillStyle = `rgba(210, 225, 240, ${0.22 * (1 - drift / 45)})`;
          ctx.beginPath();
          ctx.arc(fx + 6 + drift * 0.9, -58 - drift * 0.45, 5 + drift * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = '#4af2a1';
      ctx.beginPath(); ctx.arc(95, -18, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff5b8';
      ctx.fillRect(-2, -48, 2, 12);
      ctx.beginPath(); ctx.arc(-1, -50, 2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // Distant Iconic Rotating Lighthouse on rocky headland
    const lhX = 760 - camX * 0.12;
    const lhBaseY = seaY + 8;
    ctx.save();
    ctx.fillStyle = '#111b29';
    ctx.beginPath();
    ctx.moveTo(lhX - 48, lhBaseY);
    ctx.quadraticCurveTo(lhX, lhBaseY - 26, lhX + 48, lhBaseY);
    ctx.closePath(); ctx.fill();
    for (let seg = 0; seg < 4; seg++) {
      ctx.fillStyle = seg % 2 === 0 ? '#d9dde6' : '#c93434';
      const wTop = 14 + (3 - seg) * 2.5;
      const wBot = 14 + (4 - seg) * 2.5;
      const yTop = lhBaseY - 115 + seg * 26;
      ctx.beginPath();
      ctx.moveTo(lhX - wTop / 2, yTop);
      ctx.lineTo(lhX + wTop / 2, yTop);
      ctx.lineTo(lhX + wBot / 2, yTop + 26);
      ctx.lineTo(lhX - wBot / 2, yTop + 26);
      ctx.closePath(); ctx.fill();
    }
    const lampY = lhBaseY - 122;
    ctx.fillStyle = '#1d2433';
    ctx.fillRect(lhX - 10, lampY - 12, 20, 14);
    ctx.fillStyle = '#ffe899';
    ctx.beginPath(); ctx.arc(lhX, lampY - 5, 6, 0, Math.PI * 2); ctx.fill();
    const beamAngle = Math.sin(time * 0.9) * 0.38;
    ctx.save();
    ctx.translate(lhX, lampY - 5);
    ctx.rotate(beamAngle);
    const beamGrad = ctx.createLinearGradient(0, 0, 320, 0);
    beamGrad.addColorStop(0, 'rgba(255, 240, 175, 0.36)');
    beamGrad.addColorStop(1, 'rgba(255, 240, 175, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(320, -48); ctx.lineTo(320, 48); ctx.lineTo(0, 4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(-320, -48); ctx.lineTo(-320, 48); ctx.lineTo(0, 4); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.restore();

    // Rolling moonlit ocean swells
    ctx.strokeStyle = 'rgba(135, 210, 245, 0.16)';
    ctx.lineWidth = 1.6;
    for (let row = 0; row < 4; row++) {
      const wy = seaY + 26 + row * 28;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 30) {
        const waveY = wy + Math.sin((x + camX * (0.2 + row * 0.05)) * 0.03 + time * 2 + row) * 4;
        if (x === 0) ctx.moveTo(x, waveY); else ctx.lineTo(x, waveY);
      }
      ctx.stroke();
    }
  }

  // Stage 5: Rich Harbor Midground (Steam Ferries, Sailing Ships, Cranes & Maritime Warehouses)
  function drawHarborMidground(ctx, camX, w, h, time) {
    const span = 440;
    const count = 14;
    const waterY = h - 90;

    // Hero Close-Up Giant Docked Ocean Liner right at the start of Stage 5
    const heroX = 390 - camX * 0.45;
    if (heroX > -620 && heroX < w + 620) {
      const hBob = Math.sin(time * 1.25) * 2.5;
      ctx.save();
      ctx.translate(heroX, waterY - 4 + hBob);
      ctx.scale(1.42, 1.42);
      // Massive dark steel hull
      const hullG = ctx.createLinearGradient(0, -68, 0, 26);
      hullG.addColorStop(0, '#1e293b');
      hullG.addColorStop(0.7, '#0f172a');
      hullG.addColorStop(1, '#070b14');
      ctx.fillStyle = hullG;
      ctx.strokeStyle = '#05080f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-270, -64);
      ctx.lineTo(290, -64);
      ctx.quadraticCurveTo(276, 16, 232, 26);
      ctx.lineTo(-244, 26);
      ctx.quadraticCurveTo(-266, 6, -270, -64);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Red Plimsoll waterline & anchor hawsehole + chain
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(-252, 6, 492, 10);
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.arc(232, -32, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(232, -26); ctx.lineTo(238, 22); ctx.stroke();
      // Glowing hull portholes
      ctx.fillStyle = 'rgba(255, 222, 140, 0.88)';
      for (let px = -220; px <= 200; px += 34) {
        ctx.beginPath(); ctx.arc(px, -38, 4.5, 0, Math.PI * 2); ctx.fill();
      }
      // Multi-deck white passenger/bridge superstructure
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.6;
      ctx.fillRect(-195, -112, 360, 48);
      ctx.strokeRect(-195, -112, 360, 48);
      ctx.fillStyle = 'rgba(255, 215, 130, 0.78)';
      for (let wx = -178; wx <= 140; wx += 26) ctx.fillRect(wx, -100, 16, 16);
      // Upper bridge deck
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(-125, -152, 220, 40);
      ctx.strokeRect(-125, -152, 220, 40);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-105, -142, 180, 14);
      ctx.fillStyle = 'rgba(125, 211, 252, 0.55)';
      for (let bx = -98; bx <= 58; bx += 24) ctx.fillRect(bx, -140, 16, 10);
      // Lifeboats on davits
      for (const lbx of [-155, -80, 95]) {
        ctx.fillStyle = '#ea580c';
        ctx.beginPath(); ctx.ellipse(lbx, -114, 18, 6.5, 0, 0, Math.PI * 2); ctx.fill();
      }
      // Twin tall red-and-black smokestacks puffing steam
      for (const sx of [-40, 28]) {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(sx, -205, 30, 53);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(sx, -205, 30, 13);
        ctx.strokeRect(sx, -205, 30, 53);
        for (let p = 0; p < 4; p++) {
          const drift = ((time * 18 + p * 22) % 70);
          ctx.fillStyle = `rgba(215, 225, 240, ${0.22 - (drift / 70) * 0.2})`;
          ctx.beginPath(); ctx.arc(sx + 12 - drift * 0.45, -212 - drift * 0.65, 9 + drift * 0.2, 0, Math.PI * 2); ctx.fill();
        }
      }
      // Radar mast & navigation light
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-72, -152); ctx.lineTo(-72, -215); ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(-72, -216, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    for (let i = 0; i < count; i++) {
      if (i <= 1) continue; // Keep space clear around the giant ocean liner at Stage 5 start
      const bx = i * span - camX * 0.5;
      if (bx + span < -200 || bx > w + 200) continue;

      ctx.save();
      ctx.translate(bx, waterY);

      const kind = i % 3;
      if (kind === 0) {
        // 0. Classic Multi-Deck Coastal Steamship / Ferry
        const bob = Math.sin(time * 1.9 + i) * 3;
        ctx.save();
        ctx.translate(190, -12 + bob);
        ctx.fillStyle = '#1b2638';
        ctx.strokeStyle = '#0c121c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-140, -24);
        ctx.lineTo(148, -24);
        ctx.quadraticCurveTo(138, 12, 114, 16);
        ctx.lineTo(-122, 16);
        ctx.quadraticCurveTo(-136, 4, -140, -24);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#b83232';
        ctx.fillRect(-126, 4, 244, 6);
        ctx.fillStyle = '#dde4ef';
        ctx.strokeStyle = '#3c4b64';
        ctx.lineWidth = 1.4;
        ctx.fillRect(-98, -56, 194, 32);
        ctx.strokeRect(-98, -56, 194, 32);
        ctx.fillStyle = 'rgba(255, 212, 120, 0.85)';
        for (let wx = -86; wx <= 76; wx += 22) {
          ctx.fillRect(wx, -48, 14, 14);
        }
        ctx.fillStyle = '#cfd8e6';
        ctx.fillRect(-52, -82, 92, 26);
        ctx.strokeRect(-52, -82, 92, 26);
        ctx.fillStyle = 'rgba(255, 224, 145, 0.9)';
        ctx.fillRect(-42, -76, 22, 12);
        ctx.fillRect(-10, -76, 22, 12);
        for (const lbx of [-78, 62]) {
          ctx.fillStyle = '#e76f51';
          ctx.beginPath(); ctx.ellipse(lbx, -58, 14, 5, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#d62828';
        ctx.fillRect(-12, -118, 22, 36);
        ctx.fillStyle = '#141a26';
        ctx.fillRect(-12, -118, 22, 9);
        for (let p = 0; p < 4; p++) {
          const lift = ((time * 22 + p * 14) % 52);
          ctx.fillStyle = `rgba(220, 232, 245, ${0.22 * (1 - lift / 52)})`;
          ctx.beginPath(); ctx.arc(-1 + lift * 0.45, -124 - lift * 0.7, 6 + lift * 0.2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#ffe899';
        ctx.beginPath(); ctx.arc(128, -32, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else if (kind === 1) {
        // 1. Tall-Mast Wooden Sailing Schooner & Fishing Ship
        const bob = Math.sin(time * 2.2 + i) * 3.5;
        ctx.save();
        ctx.translate(185, -12 + bob);
        const hullG = ctx.createLinearGradient(0, -22, 0, 16);
        hullG.addColorStop(0, '#784824');
        hullG.addColorStop(1, '#3b200d');
        ctx.fillStyle = hullG;
        ctx.strokeStyle = '#1c0e04';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-110, -20);
        ctx.lineTo(118, -24);
        ctx.lineTo(92, 16);
        ctx.lineTo(-92, 16);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#5c3418';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(114, -22); ctx.lineTo(152, -38); ctx.stroke();
        ctx.fillStyle = '#543018';
        ctx.fillRect(-84, -48, 58, 28);
        ctx.fillStyle = '#ffd166';
        ctx.beginPath(); ctx.arc(-68, -34, 4, 0, Math.PI * 2); ctx.arc(-48, -34, 4, 0, Math.PI * 2); ctx.fill();
        for (const mx of [-16, 48]) {
          ctx.fillStyle = '#4a2912';
          ctx.fillRect(mx - 3, -155, 6, 135);
          ctx.fillRect(mx - 36, -128, 72, 4);
          ctx.fillRect(mx - 42, -88, 84, 4);
          ctx.fillStyle = '#e8dec8';
          ctx.beginPath(); ctx.roundRect(mx - 34, -125, 68, 12, 6); ctx.fill();
          ctx.beginPath(); ctx.roundRect(mx - 40, -85, 80, 13, 6); ctx.fill();
          ctx.strokeStyle = 'rgba(210, 220, 235, 0.3)';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(mx, -152); ctx.lineTo(mx - 44, -20);
          ctx.moveTo(mx, -152); ctx.lineTo(mx + 44, -20);
          ctx.stroke();
        }
        const lGlow = ctx.createRadialGradient(54, -82, 2, 54, -82, 26);
        lGlow.addColorStop(0, 'rgba(255, 220, 120, 0.72)');
        lGlow.addColorStop(1, 'rgba(255, 220, 120, 0)');
        ctx.fillStyle = lGlow;
        ctx.beginPath(); ctx.arc(54, -82, 26, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffe899';
        ctx.beginPath(); ctx.arc(54, -82, 3.8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else {
        // 2. Harbor Fish Market Warehouse & Lattice Gantry Crane
        ctx.fillStyle = '#1b2434';
        ctx.fillRect(36, -142, 205, 142);
        ctx.fillStyle = '#26344a';
        ctx.beginPath(); ctx.moveTo(28, -142); ctx.lineTo(138, -180); ctx.lineTo(248, -142); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#0d1522';
        ctx.strokeStyle = '#4ee8ff';
        ctx.lineWidth = 1.8;
        ctx.fillRect(64, -122, 148, 26);
        ctx.strokeRect(64, -122, 148, 26);
        ctx.fillStyle = '#4ee8ff';
        ctx.font = 'bold 10.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('HARBOR PIER • FISH CO.', 138, -105);
        ctx.fillStyle = 'rgba(255, 210, 130, 0.48)';
        for (let wx = 58; wx <= 194; wx += 44) {
          ctx.beginPath(); ctx.roundRect(wx, -80, 26, 36, [8, 8, 0, 0]); ctx.fill();
        }
        ctx.strokeStyle = '#2c3a4f';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(295, 0); ctx.lineTo(295, -172); ctx.lineTo(385, -212);
        ctx.stroke();
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(385, -212); ctx.lineTo(385, -130); ctx.stroke();
        ctx.fillStyle = '#ffd166';
        ctx.fillRect(380, -130, 10, 6);
      }

      ctx.restore();
    }
  }

  function drawShopBanner(ctx, x, y, w, icon, title, sub, col) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 4;
    ctx.fillStyle = 'rgba(12, 15, 24, 0.92)';
    ctx.strokeStyle = col;
    ctx.globalAlpha = 0.72;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, 30, 6);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.92;
    ctx.font = '15px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(icon, x + 8, y + 20);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(title, x + 30, y + 13);
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.78;
    ctx.font = '8.5px monospace';
    ctx.fillText(sub, x + 30, y + 24);
    ctx.restore();
  }

  // Stage 6: High-Rise Rooftops Sky, Moon, Distant Skyscrapers & Aviation Beacons
  function drawRooftopSkyAndHorizon(ctx, camX, w, h, time) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#040713');
    sky.addColorStop(0.45, '#0b132b');
    sky.addColorStop(0.82, '#1c2541');
    sky.addColorStop(1, '#2b1f3d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // High-altitude crisp stars
    for (let i = 0; i < 65; i++) {
      const sx = ((i * 199 + 41) % (w + 180)) - ((camX * 0.03) % 180);
      const sy = (i * 83 + 19) % 340;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(time * 2.1 + i * 1.3));
      ctx.fillStyle = `rgba(225, 240, 255, ${tw})`;
      ctx.fillRect(sx, sy, (i % 5 === 0 ? 2.2 : 1.4), (i % 5 === 0 ? 2.2 : 1.4));
    }

    // Crescent moon with subtle atmospheric halo
    const mx = 980 - camX * 0.025;
    const my = 96;
    const moonHalo = ctx.createRadialGradient(mx, my, 8, mx, my, 95);
    moonHalo.addColorStop(0, 'rgba(255, 244, 210, 0.35)');
    moonHalo.addColorStop(1, 'rgba(255, 244, 210, 0)');
    ctx.fillStyle = moonHalo;
    ctx.beginPath(); ctx.arc(mx, my, 95, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff3d1';
    ctx.beginPath(); ctx.arc(mx, my, 28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#070d1f';
    ctx.beginPath(); ctx.arc(mx + 10, my - 6, 24, 0, Math.PI * 2); ctx.fill();

    // Far distant skyscraper silhouettes with blinking red aviation beacons
    const farOff = -(camX * 0.12) % 420;
    for (let bx = farOff - 420; bx < w + 420; bx += 140) {
      const idx = Math.abs(Math.round((bx - farOff) / 140));
      const bh = 250 + (idx * 67) % 210;
      const bw = 96 + (idx % 3) * 22;
      const by = h - bh;
      ctx.fillStyle = '#0c1428';
      ctx.fillRect(bx, by, bw, bh);
      // Spire antenna + blinking red aircraft warning light
      if (idx % 2 === 0) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(bx + bw / 2, by); ctx.lineTo(bx + bw / 2, by - 44); ctx.stroke();
        const blink = Math.sin(time * 3.5 + idx) > 0.2;
        if (blink) {
          ctx.fillStyle = '#ff3b4e';
          ctx.beginPath(); ctx.arc(bx + bw / 2, by - 45, 3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(255, 59, 78, 0.28)';
          ctx.beginPath(); ctx.arc(bx + bw / 2, by - 45, 11, 0, Math.PI * 2); ctx.fill();
        }
      }
      // Subtle architectural curtain-wall mullions (calm, non-distracting)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
      ctx.lineWidth = 1;
      for (let wx = bx + 16; wx < bx + bw - 10; wx += 18) {
        ctx.beginPath(); ctx.moveTo(wx, by + 10); ctx.lineTo(wx, h); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 218, 155, 0.08)';
      for (let wy = by + 24; wy < h - 50; wy += 28) {
        for (let wx = bx + 12; wx < bx + bw - 16; wx += 22) {
          if (((wx * 3 + wy * 7 + idx) % 13) === 0) ctx.fillRect(wx, wy, 8, 5);
        }
      }
    }

    // Distant city street glow far below the abyss
    const abyssGlow = ctx.createLinearGradient(0, h - 130, 0, h);
    abyssGlow.addColorStop(0, 'rgba(255, 160, 90, 0)');
    abyssGlow.addColorStop(1, 'rgba(255, 145, 80, 0.16)');
    ctx.fillStyle = abyssGlow;
    ctx.fillRect(0, h - 130, w, 130);
  }

  function drawRooftopMidground(ctx, camX, w, h, time) {
    const midOff = -(camX * 0.34) % 560;
    for (let x = midOff - 560; x < w + 560; x += 280) {
      const idx = Math.abs(Math.round((x - midOff) / 280));
      const bw = 205 + (idx % 3) * 30;
      const bh = 310 + (idx * 73) % 160;
      const by = h - bh;
      const grad = ctx.createLinearGradient(x, by, x, h);
      grad.addColorStop(0, '#131b30');
      grad.addColorStop(1, '#090e1c');
      ctx.fillStyle = grad;
      ctx.fillRect(x, by, bw, bh);
      ctx.strokeStyle = '#1e2942';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, by, bw, bh);

      // Calm architectural glass mullions & sparse, soft interior glow
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 1;
      for (let wx = x + 22; wx < x + bw - 14; wx += 24) {
        ctx.beginPath(); ctx.moveTo(wx, by + 16); ctx.lineTo(wx, h); ctx.stroke();
      }
      for (let wy = by + 26; wy < h - 30; wy += 28) {
        for (let wx = x + 16; wx < x + bw - 22; wx += 24) {
          if (((wx * 11 + wy * 17 + idx) % 19) < 2) {
            ctx.fillStyle = ((wx + idx) % 3 === 0) ? 'rgba(120, 195, 255, 0.13)' : 'rgba(255, 214, 145, 0.15)';
            ctx.fillRect(wx + 2, wy, 12, 9);
          }
        }
      }

      // Subtle architectural penthouse crown or distant crane
      if (idx % 2 === 0) {
        ctx.fillStyle = '#19233d';
        ctx.fillRect(x + 26, by - 14, bw - 52, 14);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x + 26, by - 14, bw - 52, 14);
      } else {
        ctx.strokeStyle = '#1a2338';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + bw * 0.5, by);
        ctx.lineTo(x + bw * 0.5, by - 72);
        ctx.lineTo(x + bw * 0.5 + 88, by - 72);
        ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x + bw * 0.5, by - 82); ctx.lineTo(x + bw * 0.5 + 88, by - 72); ctx.stroke();
      }
    }
  }

  // Stage 7: Masterpiece Grand Underground Metro Station & Vintage Train Yard
  function drawSubwaySkyAndHorizon(ctx, camX, w, h, time) {
    const tunnelBlend = Math.max(0, Math.min(1, (camX - 700) / 800));
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, tunnelBlend > 0.4 ? '#05070c' : '#080d1a');
    sky.addColorStop(0.5, tunnelBlend > 0.4 ? '#0c101b' : '#121c32');
    sky.addColorStop(1, '#161c28');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Open-air night marshalling yard at the entrance (first ~1400px)
    if (tunnelBlend < 1) {
      ctx.save();
      ctx.globalAlpha = 1 - tunnelBlend;
      for (let i = 0; i < 36; i++) {
        const sx = ((i * 211 + 29) % (w + 150)) - ((camX * 0.04) % 150);
        const sy = (i * 67 + 14) % 210;
        ctx.fillStyle = 'rgba(225, 240, 255, 0.5)';
        ctx.fillRect(sx, sy, 1.8, 1.8);
      }
      // Distant industrial control tower, yard floodlight towers & overhead catenary wires
      const gOff = -(camX * 0.18) % 520;
      for (let gx = gOff - 260; gx < w + 520; gx += 520) {
        // Steel lattice signal & floodlight tower
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(gx, h); ctx.lineTo(gx + 14, 120); ctx.lineTo(gx + 34, 120); ctx.lineTo(gx + 48, h);
        ctx.moveTo(gx + 8, 150); ctx.lineTo(gx + 190, 150);
        ctx.stroke();
        // Cross lattice
        ctx.lineWidth = 1.4;
        for (let ly = 140; ly < h - 100; ly += 36) {
          ctx.beginPath(); ctx.moveTo(gx + 10, ly); ctx.lineTo(gx + 38, ly + 28); ctx.stroke();
        }
        // Yard floodlights & signal heads
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(gx + 24, 114, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(gx + 85, 142, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(gx + 102, 142, 4.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawSubwayMidground(ctx, camX, w, h, time) {
    const tunnelBlend = Math.max(0, Math.min(1, (camX - 700) / 800));

    if (tunnelBlend > 0.03) {
      ctx.save();
      ctx.globalAlpha = tunnelBlend;

      // 1. Deep Vaulted Underground Tunnel Back Wall with Classic Glazed Ceramic Tiles
      const wallG = ctx.createLinearGradient(0, 70, 0, h - 80);
      wallG.addColorStop(0, '#121722');
      wallG.addColorStop(0.35, '#1e2636');
      wallG.addColorStop(0.8, '#171d29');
      wallG.addColorStop(1, '#0e121a');
      ctx.fillStyle = wallG;
      ctx.fillRect(0, 70, w, h - 150);

      // Fine beveled subway ceramic tile coursework
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.048)';
      ctx.lineWidth = 1;
      const tileOff = -(camX * 0.45) % 44;
      for (let tx = tileOff; tx < w; tx += 44) {
        ctx.beginPath(); ctx.moveTo(tx, 84); ctx.lineTo(tx, h - 88); ctx.stroke();
      }
      for (let ty = 96; ty < h - 88; ty += 22) {
        ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(w, ty); ctx.stroke();
      }

      // Decorative Mosaic Tile Band (Deep Cobalt, Emerald & Gold Border)
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 146, w, 18);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 142, w, 4);
      ctx.fillRect(0, 164, w, 4);
      const mosOff = -(camX * 0.45) % 24;
      ctx.fillStyle = '#38bdf8';
      for (let mx = mosOff; mx < w; mx += 24) {
        ctx.fillRect(mx + 4, 152, 6, 6);
      }

      // 2. Recessed Brick Tunnel Arches, Vending Machines, Ticket Kiosks & Transit Maps
      const baySpan = 680;
      const bayOff = -(camX * 0.45) % baySpan;
      for (let bx = bayOff - baySpan; bx < w + baySpan; bx += baySpan) {
        // Recessed dark brick arch alcove
        ctx.fillStyle = '#101520';
        ctx.beginPath();
        ctx.moveTo(bx + 60, h - 90);
        ctx.lineTo(bx + 60, 235);
        ctx.arc(bx + 155, 235, 95, Math.PI, 0);
        ctx.lineTo(bx + 250, h - 90);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 3;
        ctx.stroke();

        // Wooden station waiting bench inside alcove
        ctx.fillStyle = '#78350f';
        ctx.fillRect(bx + 92, h - 132, 126, 10);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(bx + 96, h - 148, 118, 12);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx + 104, h - 122, 8, 28);
        ctx.fillRect(bx + 198, h - 122, 8, 28);

        // Backlit Metro System Map Lightbox
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(bx + 295, 208, 134, 88);
        ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3;
        ctx.strokeRect(bx + 295, 208, 134, 88);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx + 301, 214, 122, 76);
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(bx + 310, 230); ctx.lineTo(bx + 362, 252); ctx.lineTo(bx + 414, 252); ctx.stroke();
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath(); ctx.moveTo(bx + 314, 276); ctx.lineTo(bx + 362, 252); ctx.lineTo(bx + 404, 224); ctx.stroke();
        ctx.strokeStyle = '#22c55e';
        ctx.beginPath(); ctx.moveTo(bx + 350, 220); ctx.lineTo(bx + 362, 252); ctx.lineTo(bx + 375, 282); ctx.stroke();

        // Illuminated Drinks & Snacks Vending Machine + Automated Ticket Kiosk
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(bx + 465, h - 195, 58, 102);
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2;
        ctx.strokeRect(bx + 465, h - 195, 58, 102);
        ctx.fillStyle = 'rgba(186, 230, 253, 0.78)';
        ctx.fillRect(bx + 472, h - 186, 32, 54);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(bx + 476, h - 178, 24, 8);
        ctx.fillStyle = '#22c55e'; ctx.fillRect(bx + 476, h - 164, 24, 8);
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(bx + 476, h - 150, 24, 8);

        // Ticket Kiosk next to vending machine
        ctx.fillStyle = '#334155';
        ctx.fillRect(bx + 535, h - 182, 46, 89);
        ctx.strokeRect(bx + 535, h - 182, 46, 89);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(bx + 543, h - 168, 30, 22);

        // Digital LED Split-Flap Train Arrival Board
        ctx.fillStyle = '#090d16';
        ctx.fillRect(bx + 445, 178, 190, 42);
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
        ctx.strokeRect(bx + 445, 178, 190, 42);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        const mins = 1 + (Math.floor(time * 0.25) % 4);
        ctx.fillText(`1 EXPRESS  ➔  ${mins} MIN`, bx + 455, 195);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`7 LOCAL    ➔  ${mins + 3} MIN`, bx + 455, 211);
      }

      // 3. Vaulted Concrete Tunnel Ceiling, Overhead Catenary Wire & Fluorescent Cones
      ctx.fillStyle = '#080b11';
      ctx.fillRect(0, 0, w, 86);
      ctx.fillStyle = '#1e2636';
      ctx.fillRect(0, 82, w, 8);
      // Heavy industrial red/steel conduit pipes & high-voltage catenary wire
      ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(0, 48); ctx.lineTo(w, 48); ctx.stroke();
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, 62); ctx.lineTo(w, 62); ctx.stroke();

      const archOff = -(camX * 0.45) % 340;
      for (let ax = archOff - 340; ax < w + 340; ax += 340) {
        ctx.fillStyle = '#111622';
        ctx.fillRect(ax, 0, 28, 92);
        // Hanging illuminated vintage station clock every 2 bays
        if (Math.abs(Math.round((ax - archOff) / 340)) % 2 === 0) {
          ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(ax + 14, 88); ctx.lineTo(ax + 14, 118); ctx.stroke();
          ctx.fillStyle = '#fefce8';
          ctx.strokeStyle = '#b45309'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(ax + 14, 134, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(ax + 14, 134); ctx.lineTo(ax + 14, 123);
          ctx.moveTo(ax + 14, 134); ctx.lineTo(ax + 23, 134);
          ctx.stroke();
        }
        // Fluorescent tube light fixture + volumetric cone
        ctx.fillStyle = '#334155';
        ctx.fillRect(ax + 120, 78, 104, 8);
        ctx.fillStyle = 'rgba(224, 242, 254, 0.92)';
        ctx.fillRect(ax + 126, 83, 92, 3.5);
        const cone = ctx.createLinearGradient(0, 86, 0, 340);
        cone.addColorStop(0, 'rgba(186, 230, 253, 0.15)');
        cone.addColorStop(1, 'rgba(186, 230, 253, 0)');
        ctx.fillStyle = cone;
        ctx.beginPath(); ctx.moveTo(ax + 126, 86); ctx.lineTo(ax + 218, 86); ctx.lineTo(ax + 270, 340); ctx.lineTo(ax + 74, 340); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }

    // 4. Realistic Long Passing Express Metro Train with Diverse Commuters Inside
    const trainPeriod = 13;
    const tPhase = (time % trainPeriod) / trainPeriod;
    if (tPhase < 0.50) {
      const carW = 356;
      const carGap = 10;
      const totalCars = 6;
      const tx = w + 380 - (tPhase / 0.50) * (w + totalCars * (carW + carGap) + 520);
      const ty = h - 224;
      ctx.save();
      ctx.globalAlpha = 0.92;

      for (let c = 0; c < totalCars; c++) {
        const cx = tx + c * (carW + carGap);

        // Flexible accordion rubber gangway connector between cars
        if (c > 0) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(cx - carGap - 2, ty + 14, carGap + 4, 92);
          ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.2;
          for (let gx = cx - carGap; gx <= cx; gx += 4) {
            ctx.beginPath(); ctx.moveTo(gx, ty + 14); ctx.lineTo(gx, ty + 106); ctx.stroke();
          }
        }

        // Steel bogies & wheels under each car
        for (const bx of [cx + 28, cx + carW - 82]) {
          ctx.fillStyle = '#090d16'; ctx.fillRect(bx, ty + 114, 54, 10);
          ctx.fillStyle = '#1e293b';
          ctx.beginPath(); ctx.arc(bx + 12, ty + 122, 8, 0, Math.PI * 2); ctx.arc(bx + 42, ty + 122, 8, 0, Math.PI * 2); ctx.fill();
        }

        // Roof HVAC pods
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx + 42, ty - 6, 56, 6);
        ctx.fillRect(cx + carW - 98, ty - 6, 56, 6);

        // Brushed stainless-steel car body (aerodynamic sloped front on lead car)
        const bodyG = ctx.createLinearGradient(0, ty, 0, ty + 118);
        bodyG.addColorStop(0, '#e2e8f0');
        bodyG.addColorStop(0.42, '#94a3b8');
        bodyG.addColorStop(0.85, '#475569');
        bodyG.addColorStop(1, '#1e293b');
        ctx.fillStyle = bodyG;
        ctx.strokeStyle = '#090d16'; ctx.lineWidth = 2;
        ctx.beginPath();
        if (c === 0) {
          ctx.moveTo(cx + 28, ty);
          ctx.lineTo(cx + carW - 4, ty);
          ctx.lineTo(cx + carW, ty + 6);
          ctx.lineTo(cx + carW, ty + 114);
          ctx.lineTo(cx + 6, ty + 114);
          ctx.quadraticCurveTo(cx - 8, ty + 78, cx + 10, ty + 20);
          ctx.quadraticCurveTo(cx + 16, ty + 2, cx + 28, ty);
        } else {
          ctx.roundRect(cx, ty, carW, 114, c === totalCars - 1 ? [4, 16, 4, 4] : 4);
        }
        ctx.fill(); ctx.stroke();

        // Fine stainless corrugation ribs & metro livery stripe
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'; ctx.lineWidth = 1;
        for (let ry = ty + 62; ry < ty + 110; ry += 5) {
          ctx.beginPath(); ctx.moveTo(cx + 10, ry); ctx.lineTo(cx + carW - 6, ry); ctx.stroke();
        }
        ctx.fillStyle = '#1d4ed8'; ctx.fillRect(cx + 4, ty + 68, carW - 8, 12);
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(cx + 4, ty + 80, carW - 8, 3.5);

        // Lead car sloped windshield, driver silhouette, LED destination sign & headlights
        if (c === 0) {
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.moveTo(cx + 12, ty + 20); ctx.lineTo(cx + 36, ty + 20);
          ctx.lineTo(cx + 36, ty + 54); ctx.lineTo(cx + 4, ty + 54);
          ctx.closePath(); ctx.fill();
          // Glowing LED headsign
          ctx.fillStyle = '#090d16'; ctx.fillRect(cx + 16, ty + 8, 28, 9);
          ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 6.5px monospace'; ctx.textAlign = 'center';
          ctx.fillText('M7 EXP', cx + 30, ty + 15);
          // Bright dual headlights + volumetric light cone
          ctx.fillStyle = '#fef08a';
          ctx.beginPath(); ctx.arc(cx + 6, ty + 84, 5.5, 0, Math.PI * 2); ctx.fill();
          const hBeam = ctx.createLinearGradient(cx, ty + 84, cx - 260, ty + 84);
          hBeam.addColorStop(0, 'rgba(254, 240, 138, 0.44)');
          hBeam.addColorStop(1, 'rgba(254, 240, 138, 0)');
          ctx.fillStyle = hBeam;
          ctx.beginPath(); ctx.moveTo(cx, ty + 74); ctx.lineTo(cx - 260, ty + 38); ctx.lineTo(cx - 260, ty + 124); ctx.lineTo(cx, ty + 94); ctx.closePath(); ctx.fill();
        } else if (c === totalCars - 1) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath(); ctx.arc(cx + carW - 7, ty + 84, 4.5, 0, Math.PI * 2); ctx.fill();
        }

        // Tall double sliding passenger doors (2 per car)
        for (const df of [0.24, 0.66]) {
          const dx = cx + carW * df;
          const dw = 44;
          const dh = 92;
          ctx.fillStyle = '#475569'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.roundRect(dx, ty + 14, dw, dh, [3, 3, 0, 0]); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#090d16'; ctx.fillRect(dx + dw / 2 - 1, ty + 14, 2, dh);
          for (const leafX of [dx + 4, dx + dw / 2 + 3]) {
            ctx.fillStyle = 'rgba(255, 236, 175, 0.88)';
            ctx.fillRect(leafX, ty + 20, 15, 38);
            ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.strokeRect(leafX, ty + 20, 15, 38);
          }
        }

        // Wide panoramic passenger windows with diverse, realistic commuters inside!
        const winOffsets = c === 0 ? [50, 152, 296] : [18, 152, 296];
        const coatCols = ['#1e293b', '#7f1d1d', '#0f766e', '#b45309', '#312e81', '#3f3f46'];
        const hairCols = ['#0f172a', '#451a03', '#78350f', '#1e293b', '#92400e'];
        for (let wi = 0; wi < winOffsets.length; wi++) {
          const wx = cx + winOffsets[wi];
          const wy = ty + 18;
          const ww = 46;
          const wh = 36;
          // Warm lit train interior
          const winG = ctx.createLinearGradient(0, wy, 0, wy + wh);
          winG.addColorStop(0, 'rgba(255, 244, 200, 0.94)');
          winG.addColorStop(1, 'rgba(251, 211, 141, 0.85)');
          ctx.fillStyle = winG;
          ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 4); ctx.fill(); ctx.stroke();

          // Vertical stainless grab pole & hanging ceiling straps
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.65)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(wx + ww * 0.5, wy + 1); ctx.lineTo(wx + ww * 0.5, wy + wh - 1); ctx.stroke();
          ctx.beginPath(); ctx.arc(wx + 12, wy + 7, 2.5, 0, Math.PI * 2); ctx.arc(wx + 34, wy + 7, 2.5, 0, Math.PI * 2); ctx.stroke();

          // Draw varied commuters inside the window
          const kind = (c * 5 + wi * 3) % 6;
          const coat = coatCols[(c + wi) % coatCols.length];
          const hair = hairCols[(c * 2 + wi) % hairCols.length];

          if (kind === 0) {
            // Commuter looking down at a glowing smartphone
            ctx.fillStyle = coat;
            ctx.beginPath(); ctx.roundRect(wx + 9, wy + 22, 16, 13, 4); ctx.fill();
            ctx.fillStyle = '#e2b89b';
            ctx.beginPath(); ctx.arc(wx + 17, wy + 17, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = hair;
            ctx.beginPath(); ctx.arc(wx + 16, wy + 15.5, 4.5, Math.PI, 0); ctx.fill();
            // Glowing phone screen
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(wx + 24, wy + 23, 3.5, 6);
          } else if (kind === 1) {
            // Standing commuter holding overhead strap (raised arm)
            ctx.fillStyle = coat;
            ctx.beginPath(); ctx.roundRect(wx + 22, wy + 19, 15, 16, 4); ctx.fill();
            ctx.strokeStyle = coat; ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.moveTo(wx + 25, wy + 21); ctx.lineTo(wx + 13, wy + 9); ctx.stroke();
            ctx.fillStyle = '#d4a373';
            ctx.beginPath(); ctx.arc(wx + 29, wy + 14, 4.4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = hair;
            ctx.beginPath(); ctx.arc(wx + 29, wy + 12.5, 4.5, Math.PI, 0); ctx.fill();
          } else if (kind === 2) {
            // Seated passenger wearing headphones
            ctx.fillStyle = coat;
            ctx.beginPath(); ctx.roundRect(wx + 14, wy + 23, 18, 12, 4); ctx.fill();
            ctx.fillStyle = '#f1c27d';
            ctx.beginPath(); ctx.arc(wx + 23, wy + 18, 4.6, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(wx + 23, wy + 17.5, 5.2, Math.PI, 0); ctx.stroke();
          } else if (kind === 3) {
            // Two passengers standing/chatting side-by-side
            ctx.fillStyle = coat;
            ctx.beginPath(); ctx.roundRect(wx + 6, wy + 22, 13, 13, 3); ctx.fill();
            ctx.fillStyle = '#e0ac69';
            ctx.beginPath(); ctx.arc(wx + 12.5, wy + 17, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#475569';
            ctx.beginPath(); ctx.roundRect(wx + 25, wy + 20, 14, 15, 3); ctx.fill();
            ctx.fillStyle = '#f1c27d';
            ctx.beginPath(); ctx.arc(wx + 32, wy + 15, 4.2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#dc2626'; // beanie hat
            ctx.beginPath(); ctx.arc(wx + 32, wy + 13.5, 4.2, Math.PI, 0); ctx.fill();
          } else if (kind === 4) {
            // Passenger in baseball cap looking out the window
            ctx.fillStyle = coat;
            ctx.beginPath(); ctx.roundRect(wx + 15, wy + 22, 16, 13, 4); ctx.fill();
            ctx.fillStyle = '#d4a373';
            ctx.beginPath(); ctx.arc(wx + 23, wy + 17, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#2563eb';
            ctx.beginPath(); ctx.arc(wx + 23, wy + 15, 4.6, Math.PI, 0); ctx.fill();
            ctx.fillRect(wx + 16, wy + 14.5, 8, 2); // cap brim
          }
        }

        // Pantograph & electric arc spark on car 2 roof
        if (c === 2 && Math.sin(time * 28) > 0.3) {
          ctx.fillStyle = '#7dd3fc';
          ctx.beginPath(); ctx.arc(cx + 150, ty - 6, 7, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
    }

    // 5. Heavy Riveted Cast-Iron Station Columns & Enamel Station Signs
    const pOff = -(camX * 0.52) % 440;
    for (let x = pOff - 440; x < w + 440; x += 440) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, 78, 28, h - 150);
      ctx.fillStyle = '#334155';
      ctx.fillRect(x - 6, 78, 40, 14);
      ctx.fillRect(x - 5, h - 92, 38, 18);
      // Rivet dots along column
      ctx.fillStyle = '#64748b';
      for (let ry = 104; ry < h - 100; ry += 28) {
        ctx.beginPath(); ctx.arc(x + 6, ry, 1.6, 0, Math.PI * 2); ctx.arc(x + 22, ry, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      // Modern Backlit Metro Wayfinding Signboard (suspended from ceiling)
      const signX = x + 84;
      const signY = 100;
      const signW = 252;
      const signH = 44;
      // Slim brushed-steel ceiling suspension rods
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(signX + 34, 86); ctx.lineTo(signX + 34, signY);
      ctx.moveTo(signX + signW - 34, 86); ctx.lineTo(signX + signW - 34, signY);
      ctx.stroke();

      // Sleek dark-glass backlit signboard frame
      ctx.save();
      ctx.shadowColor = 'rgba(56, 189, 248, 0.25)';
      ctx.shadowBlur = 10;
      const signG = ctx.createLinearGradient(signX, signY, signX, signY + signH);
      signG.addColorStop(0, '#1e293b');
      signG.addColorStop(0.5, '#0f172a');
      signG.addColorStop(1, '#090d16');
      ctx.fillStyle = signG;
      ctx.beginPath(); ctx.roundRect(signX, signY, signW, signH, 8); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.6;
      ctx.stroke();
      // Subtle top glass sheen & bottom accent bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath(); ctx.roundRect(signX + 3, signY + 2, signW - 6, 10, [6, 6, 0, 0]); ctx.fill();
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(signX + 12, signY + signH - 4, signW - 24, 2.5);

      // Left Metro Line Badge (M7)
      ctx.fillStyle = '#2563eb';
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(signX + 26, signY + signH / 2, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
      ctx.fillText('M7', signX + 26, signY + signH / 2 + 3.5);

      // Right Exit Direction Pill
      ctx.fillStyle = '#eab308';
      ctx.beginPath(); ctx.roundRect(signX + signW - 36, signY + 12, 24, 19, 5); ctx.fill();
      ctx.fillStyle = '#090d16'; ctx.font = 'bold 11px sans-serif';
      ctx.fillText('➔', signX + signW - 24, signY + 25.5);

      // Clean 2-Line Bilingual Station Text (fits comfortably inside frame)
      const textCenterX = signX + signW / 2 - 4;
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('محطة الأنفاق المركزية', textCenterX, signY + 18);
      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 9.5px monospace';
      ctx.fillText('CENTRAL METRO  •  LINE 7', textCenterX, signY + 34);
      ctx.restore();
    }
  }

  // Stage 8: Stormy Skyscraper Construction Site & Giant Tower Cranes
  function drawConstructionSkyAndHorizon(ctx, camX, w, h, time) {
    // Occasional dramatic lightning flash in the storm
    const lCycle = time % 7.5;
    const flash = (lCycle > 0.1 && lCycle < 0.22) || (lCycle > 0.28 && lCycle < 0.36) ? 0.35 : 0;

    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, flash > 0 ? '#1e2948' : '#050812');
    sky.addColorStop(0.55, flash > 0 ? '#2b395c' : '#0d1424');
    sky.addColorStop(1, '#1a2234');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Distant jagged lightning bolt during flash
    if (flash > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
      ctx.lineWidth = 2.5;
      const lx = 320 + ((Math.floor(time / 7.5) * 277) % (w - 500));
      ctx.beginPath();
      ctx.moveTo(lx, 0); ctx.lineTo(lx - 24, 95); ctx.lineTo(lx + 14, 155); ctx.lineTo(lx - 18, 270);
      ctx.stroke();
      ctx.restore();
    }

    // Distant unfinished skyscraper skeletons & city glow
    const farOff = -(camX * 0.14) % 440;
    for (let bx = farOff - 440; bx < w + 440; bx += 220) {
      const idx = Math.abs(Math.round((bx - farOff) / 220));
      const bh = 230 + (idx * 71) % 190;
      const by = h - bh;
      ctx.fillStyle = '#0a101d';
      ctx.fillRect(bx, by, 130, bh);
      // Exposed steel framework at top
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2;
      ctx.strokeRect(bx + 8, by - 48, 114, 48);
      for (let sx = bx + 36; sx < bx + 110; sx += 28) {
        ctx.beginPath(); ctx.moveTo(sx, by - 48); ctx.lineTo(sx, by); ctx.stroke();
      }
      // Blinking amber/red aviation beacon
      if (Math.sin(time * 4 + idx) > 0) {
        ctx.fillStyle = '#f97316';
        ctx.beginPath(); ctx.arc(bx + 65, by - 52, 3.2, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  function drawConstructionMidground(ctx, camX, w, h, time) {
    // Giant Detailed Trussed Tower Cranes across the construction skyline
    const span = 680;
    const parallax = 0.26;
    const startIdx = Math.floor((camX * parallax) / span) - 1;
    const endIdx = Math.ceil((camX * parallax + w) / span) + 1;
    for (let i = startIdx; i <= endIdx; i++) {
      const cx = i * span - camX * parallax;
      const mastX = cx + 190;
      const mastW = 36;
      const jibY = 104;
      const apexY = 54;

      // Wide steel lattice crane mast with alternating X-bracing
      ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(mastX, h); ctx.lineTo(mastX, apexY);
      ctx.moveTo(mastX + mastW, h); ctx.lineTo(mastX + mastW, apexY);
      ctx.stroke();
      ctx.strokeStyle = '#eab308'; ctx.lineWidth = 1.6;
      for (let my = 80; my < h; my += 26) {
        ctx.beginPath();
        ctx.moveTo(mastX, my); ctx.lineTo(mastX + mastW, my + 24);
        ctx.moveTo(mastX + mastW, my); ctx.lineTo(mastX, my + 24);
        ctx.stroke();
      }
      // Climbing cage collar
      ctx.fillStyle = '#a16207'; ctx.fillRect(mastX - 5, 148, mastW + 10, 14);

      // A-frame apex peak & heavy steel tension guy-cables
      ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(mastX, jibY); ctx.lineTo(mastX + mastW / 2, apexY); ctx.lineTo(mastX + mastW, jibY);
      ctx.stroke();
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(mastX + mastW / 2, apexY); ctx.lineTo(mastX - 105, jibY - 12);
      ctx.moveTo(mastX + mastW / 2, apexY); ctx.lineTo(mastX + 295, jibY - 12);
      ctx.stroke();

      // Trussed triangular jib boom (top chord + bottom chord + zig-zag web struts)
      ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(mastX - 115, jibY); ctx.lineTo(mastX + 315, jibY);
      ctx.moveTo(mastX - 110, jibY - 14); ctx.lineTo(mastX + 305, jibY - 14);
      ctx.stroke();
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let jx = mastX - 110; jx < mastX + 295; jx += 22) {
        ctx.moveTo(jx, jibY); ctx.lineTo(jx + 11, jibY - 14); ctx.lineTo(jx + 22, jibY);
      }
      ctx.stroke();

      // Stacked concrete counterweight blocks on rear counter-jib
      ctx.fillStyle = '#334155'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.4;
      for (let cw = 0; cw < 3; cw++) {
        ctx.fillRect(mastX - 105 + cw * 20, jibY, 17, 26);
        ctx.strokeRect(mastX - 105 + cw * 20, jibY, 17, 26);
      }

      // Glazed operator cabin with warm interior instrument glow
      ctx.fillStyle = '#eab308'; ctx.fillRect(mastX + mastW, jibY + 4, 34, 28);
      ctx.strokeRect(mastX + mastW, jibY + 4, 34, 28);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.72)'; ctx.fillRect(mastX + mastW + 14, jibY + 8, 16, 16);

      // Animated sliding trolley carriage + dual hoist cables + pulley hook + suspended I-beam
      const trolleyX = mastX + 175 + Math.sin(time * 0.75 + i * 1.7) * 65;
      ctx.fillStyle = '#dc2626'; ctx.fillRect(trolleyX - 12, jibY - 2, 24, 9);
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.65)'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(trolleyX - 4, jibY + 7); ctx.lineTo(trolleyX - 4, 250);
      ctx.moveTo(trolleyX + 4, jibY + 7); ctx.lineTo(trolleyX + 4, 250);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(trolleyX - 8, 248, 16, 14); ctx.strokeRect(trolleyX - 8, 248, 16, 14);
      ctx.fillStyle = '#475569'; ctx.fillRect(trolleyX - 36, 266, 72, 10); ctx.strokeRect(trolleyX - 36, 266, 72, 10);

      // Pulsing orange crane warning beacon
      if (Math.sin(time * 5 + i * 2.1) > -0.2) {
        ctx.fillStyle = '#fb923c';
        ctx.beginPath(); ctx.arc(mastX + mastW / 2, apexY - 4, 4.5, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Animated diagonal storm rain streaks across screen
    ctx.save();
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.24)';
    ctx.lineWidth = 1.2;
    for (let r = 0; r < 68; r++) {
      const rx = ((r * 137 + time * 190) % (w + 120)) - 60;
      const ry = ((r * 89 + time * 720) % (h + 80)) - 40;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 9, ry + 22); ctx.stroke();
    }
    ctx.restore();
  }

  // Realistic 3D-perspective crashed cardboard box scene at the start of the alley
  function drawStartCardboardScene(ctx, camX, camY) {
    const bx = 68 - camX;
    const by = 574 - camY;
    if (bx < -200 || bx > 1400) return;

    ctx.save();

    // Ground ambient occlusion shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
    ctx.beginPath();
    ctx.ellipse(bx + 42, by + 58, 68, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Secondary smaller box in back-left
    ctx.fillStyle = '#6e4726';
    ctx.strokeStyle = '#38200d';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(bx - 28, by + 22, 36, 34, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#875831';
    ctx.beginPath();
    ctx.moveTo(bx - 28, by + 22);
    ctx.lineTo(bx - 36, by + 13);
    ctx.lineTo(bx - 8, by + 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Secondary crushed box on right
    ctx.fillStyle = '#754c29';
    ctx.beginPath();
    ctx.roundRect(bx + 72, by + 28, 34, 28, 2);
    ctx.fill();
    ctx.stroke();

    // Main Hero Cardboard Box — Dark interior cavity
    ctx.fillStyle = '#29170a';
    ctx.fillRect(bx + 2, by - 4, 72, 18);

    // Main Box Front Face (corrugated warm kraft brown)
    const frontGrad = ctx.createLinearGradient(bx, by, bx, by + 56);
    frontGrad.addColorStop(0, '#9e6b3b');
    frontGrad.addColorStop(1, '#784d26');
    ctx.fillStyle = frontGrad;
    ctx.strokeStyle = '#3d220e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx, by + 4);
    ctx.lineTo(bx + 54, by + 6);
    ctx.lineTo(bx + 52, by + 56);
    ctx.lineTo(bx - 2, by + 56);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Main Box Right Side Face (shaded 3D perspective)
    ctx.fillStyle = '#69411f';
    ctx.beginPath();
    ctx.moveTo(bx + 54, by + 6);
    ctx.lineTo(bx + 78, by - 2);
    ctx.lineTo(bx + 76, by + 48);
    ctx.lineTo(bx + 52, by + 56);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Jagged impact tear / V-rip at top of front face (from Mishmisha's fall!)
    ctx.fillStyle = '#29170a';
    ctx.beginPath();
    ctx.moveTo(bx + 18, by + 5);
    ctx.lineTo(bx + 26, by + 22);
    ctx.lineTo(bx + 35, by + 5.5);
    ctx.closePath();
    ctx.fill();

    // Corrugated inner edge highlight along the tear
    ctx.strokeStyle = '#c9935b';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(bx + 18, by + 5);
    ctx.lineTo(bx + 26, by + 22);
    ctx.lineTo(bx + 35, by + 5.5);
    ctx.stroke();

    // Left bent open flap
    ctx.fillStyle = '#b57c47';
    ctx.strokeStyle = '#3d220e';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(bx, by + 4);
    ctx.lineTo(bx - 18, by - 11);
    ctx.lineTo(bx + 18, by - 5);
    ctx.lineTo(bx + 22, by + 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right bent open flap
    ctx.fillStyle = '#8f5d30';
    ctx.beginPath();
    ctx.moveTo(bx + 54, by + 6);
    ctx.lineTo(bx + 78, by - 2);
    ctx.lineTo(bx + 92, by - 12);
    ctx.lineTo(bx + 62, by - 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Packing tape strip & shipping icons (Fragile / Arrows / Barcode)
    ctx.fillStyle = 'rgba(215, 180, 125, 0.55)';
    ctx.fillRect(bx + 22, by + 22, 8, 20);

    // White shipping label with barcode
    ctx.fillStyle = '#f2ece1';
    ctx.fillRect(bx + 6, by + 28, 14, 10);
    ctx.fillStyle = '#222';
    ctx.fillRect(bx + 8, by + 30, 2, 6);
    ctx.fillRect(bx + 11, by + 30, 1, 6);
    ctx.fillRect(bx + 14, by + 30, 2.5, 6);

    // Handling icons (↑↑ and umbrella/glass) on lower right of front face
    ctx.strokeStyle = '#3d220e';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(bx + 36, by + 48);
    ctx.lineTo(bx + 48, by + 48);
    ctx.moveTo(bx + 39, by + 46);
    ctx.lineTo(bx + 39, by + 39);
    ctx.moveTo(bx + 45, by + 46);
    ctx.lineTo(bx + 45, by + 39);
    ctx.stroke();

    // Scattered white papers, crumpled flyers & cardboard shards on the ground
    ctx.fillStyle = '#e8e2d5';
    ctx.beginPath();
    ctx.moveTo(bx - 38, by + 54);
    ctx.lineTo(bx - 20, by + 51);
    ctx.lineTo(bx - 16, by + 58);
    ctx.lineTo(bx - 34, by + 60);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(bx + 64, by + 55);
    ctx.lineTo(bx + 84, by + 52);
    ctx.lineTo(bx + 88, by + 59);
    ctx.lineTo(bx + 68, by + 61);
    ctx.closePath();
    ctx.fill();

    // Torn cardboard flap piece on cobblestones
    ctx.fillStyle = '#915f32';
    ctx.strokeStyle = '#3d220e';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(bx + 18, by + 55);
    ctx.lineTo(bx + 42, by + 53);
    ctx.lineTo(bx + 46, by + 60);
    ctx.lineTo(bx + 14, by + 61);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  function drawStreetlamps(ctx, lamps, camX, time) {
    for (const lx of lamps) {
      const sx = lx - camX;
      if (sx < -240 || sx > 1520) continue;

      ctx.fillStyle = '#222836';
      ctx.fillRect(sx - 4, 330, 8, 300);
      ctx.fillRect(sx - 9, 608, 18, 22);
      ctx.strokeStyle = '#222836';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(sx, 345);
      ctx.quadraticCurveTo(sx + 8, 326, sx + 22, 336);
      ctx.stroke();

      ctx.fillStyle = '#151924';
      ctx.beginPath();
      ctx.moveTo(sx + 13, 338);
      ctx.lineTo(sx + 31, 338);
      ctx.lineTo(sx + 22, 331);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffe699';
      ctx.beginPath();
      ctx.arc(sx + 22, 346, 6.5, 0, Math.PI * 2);
      ctx.fill();

      const cone = ctx.createRadialGradient(sx + 22, 348, 8, sx + 22, 510, 250);
      cone.addColorStop(0, 'rgba(255, 214, 130, 0.30)');
      cone.addColorStop(0.55, 'rgba(255, 190, 95, 0.09)');
      cone.addColorStop(1, 'rgba(255, 190, 95, 0)');
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.moveTo(sx + 10, 346);
      ctx.lineTo(sx - 145, 630);
      ctx.lineTo(sx + 190, 630);
      ctx.lineTo(sx + 34, 346);
      ctx.closePath();
      ctx.fill();

      const refl = ctx.createRadialGradient(sx + 22, 634, 4, sx + 22, 634, 75);
      refl.addColorStop(0, 'rgba(255, 214, 130, 0.24)');
      refl.addColorStop(1, 'rgba(255, 214, 130, 0)');
      ctx.fillStyle = refl;
      ctx.fillRect(sx - 55, 630, 155, 18);

      ctx.fillStyle = 'rgba(255, 240, 200, 0.75)';
      for (let m = 0; m < 2; m++) {
        const mx = sx + 22 + Math.cos(time * 4 + m * 3 + lx) * 14;
        const my = 348 + Math.sin(time * 5 + m * 2) * 8;
        ctx.fillRect(mx, my, 2, 2);
      }
    }
  }

  function drawPlatform(ctx, p, px, py, nv, time) {
    if (p.type === 'asphalt') {
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = patterns.asphalt;
      ctx.fillRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#434b66';
      ctx.fillRect(0, 0, p.w, 10);
      ctx.fillStyle = '#5a6485';
      ctx.fillRect(0, 0, p.w, 2.5);
      ctx.fillStyle = '#282d3e';
      for (let cx = 0; cx < p.w; cx += 64) {
        ctx.fillRect(cx, 0, 2, 10);
      }
      ctx.restore();
    } else if (p.type === 'crate') {
      ctx.save();
      ctx.translate(px, py);
      // Base wood grain
      ctx.fillStyle = patterns.wood;
      ctx.fillRect(0, 0, p.w, p.h);
      // Recessed inner panel & horizontal planks
      ctx.fillStyle = 'rgba(30, 14, 4, 0.22)';
      ctx.fillRect(6, 6, p.w - 12, p.h - 12);
      ctx.fillStyle = '#3d1f0d';
      for (let sy = 14; sy < p.h - 8; sy += 14) {
        ctx.fillRect(6, sy, p.w - 12, 1.6);
      }
      // Diagonal wooden cross brace with highlight
      ctx.strokeStyle = '#5e3416';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(6, p.h - 6);
      ctx.lineTo(p.w - 6, 6);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 220, 170, 0.2)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(6, p.h - 7.5);
      ctx.lineTo(p.w - 7.5, 6);
      ctx.stroke();
      // Beveled outer frame
      ctx.strokeStyle = '#42220d';
      ctx.lineWidth = 4.5;
      ctx.strokeRect(2.2, 2.2, p.w - 4.4, p.h - 4.4);
      ctx.strokeStyle = 'rgba(255, 215, 165, 0.26)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(1, p.h - 1); ctx.lineTo(1, 1); ctx.lineTo(p.w - 1, 1);
      ctx.stroke();
      // Iron corner brackets & nail heads
      const corners = [[0, 0], [p.w - 7, 0], [0, p.h - 7], [p.w - 7, p.h - 7]];
      for (const [cx, cy] of corners) {
        ctx.fillStyle = '#2b3242';
        ctx.fillRect(cx, cy, 7, 7);
        ctx.fillStyle = '#8b97ad';
        ctx.beginPath(); ctx.arc(cx + 3.5, cy + 3.5, 1.3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    } else if (p.type === 'dumpster') {
      ctx.fillStyle = '#255444';
      ctx.fillRect(px, py + 12, p.w, p.h - 12);
      ctx.fillStyle = '#1c4034';
      for (let rx = px + 14; rx < px + p.w - 14; rx += 22) {
        ctx.fillRect(rx, py + 22, 6, p.h - 34);
      }
      ctx.strokeStyle = '#132b23';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py + 12, p.w, p.h - 12);
      ctx.fillStyle = '#163329';
      ctx.beginPath();
      ctx.roundRect(px - 4, py, p.w + 8, 15, 4);
      ctx.fill();
      ctx.stroke();
    } else if (p.type === 'awning') {
      ctx.fillStyle = '#d94444';
      ctx.beginPath();
      ctx.roundRect(px, py, p.w, p.h, [6, 6, 10, 10]);
      ctx.fill();
      ctx.fillStyle = '#fff4e6';
      for (let sx = px + 10; sx < px + p.w - 10; sx += 24) {
        ctx.fillRect(sx, py + 2, 10, p.h - 5);
      }
      ctx.strokeStyle = '#7a1f1f';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (p.type === 'ac') {
      ctx.fillStyle = '#9aa8bd';
      ctx.fillRect(px, py, p.w, p.h);
      ctx.fillStyle = '#b8c4d6';
      ctx.fillRect(px, py, p.w, 4);
      ctx.strokeStyle = '#4e596b';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, p.w, p.h);
      ctx.fillStyle = '#333b4a';
      ctx.beginPath();
      ctx.arc(px + 26, py + p.h / 2, 9, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'fireescape') {
      ctx.fillStyle = '#3a4254';
      ctx.fillRect(px, py, p.w, 8);
      ctx.strokeStyle = '#71809c';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py - 16, p.w, 16);
      for (let rx = px + 18; rx < px + p.w; rx += 20) {
        ctx.beginPath();
        ctx.moveTo(rx, py - 16);
        ctx.lineTo(rx, py);
        ctx.stroke();
      }
    } else if (p.type === 'clothesline') {
      ctx.save();
      const sag = 10 + (p.ropeSag || 0);
      const ropeYAt = (t) => (1 - t) * (1 - t) * (py + 2) + 2 * (1 - t) * t * (py + 2 + sag) + t * t * (py + 2);

      // Wall-mount iron brackets & pulleys at both ends
      for (const anchorX of [px, px + p.w]) {
        ctx.fillStyle = '#2b3242';
        ctx.strokeStyle = '#141822';
        ctx.lineWidth = 1.5;
        ctx.fillRect(anchorX - 3, py - 8, 6, 20);
        ctx.strokeRect(anchorX - 3, py - 8, 6, 20);
        ctx.fillStyle = '#8b97ad';
        ctx.beginPath();
        ctx.arc(anchorX, py + 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Braided hemp rope with subtle shadow & highlight (sags dynamically under cat weight)
      ctx.strokeStyle = '#2d241c';
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(px, py + 3);
      ctx.quadraticCurveTo(px + p.w / 2, py + 3 + sag, px + p.w, py + 3);
      ctx.stroke();

      ctx.strokeStyle = '#d8c3a5';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(px, py + 2);
      ctx.quadraticCurveTo(px + p.w / 2, py + 2 + sag, px + p.w, py + 2);
      ctx.stroke();

      // Realistic varied garments hanging from the exact rope curve
      const items = [
        { t: 0.17, kind: 'shirt', col: '#d9534f', shade: '#a83834' },
        { t: 0.40, kind: 'pants', col: '#3d6999', shade: '#28496e' },
        { t: 0.63, kind: 'towel', col: '#f2cc5c', shade: '#c9a136' },
        { t: 0.84, kind: 'socks', col: '#58b8a8', shade: '#3c8c7f' },
      ];

      for (let idx = 0; idx < items.length; idx++) {
        const it = items[idx];
        const gx = px + p.w * it.t;
        const gy = ropeYAt(it.t);
        const swayAngle = Math.sin(time * 2.2 + idx * 1.4) * 0.065;

        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(swayAngle);

        if (it.kind === 'shirt') {
          ctx.fillStyle = it.col;
          ctx.strokeStyle = '#401816';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(-11, 2);
          ctx.lineTo(-19, 10);
          ctx.lineTo(-15, 16);
          ctx.lineTo(-10, 12);
          ctx.lineTo(-10, 32);
          ctx.quadraticCurveTo(0, 34, 10, 32);
          ctx.lineTo(10, 12);
          ctx.lineTo(15, 16);
          ctx.lineTo(19, 10);
          ctx.lineTo(11, 2);
          ctx.quadraticCurveTo(0, 6, -11, 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = it.shade;
          ctx.beginPath();
          ctx.moveTo(-4, 14);
          ctx.lineTo(-5, 30);
          ctx.moveTo(4, 12);
          ctx.lineTo(5, 29);
          ctx.stroke();
          for (const pinX of [-8, 8]) {
            ctx.fillStyle = '#d4a373';
            ctx.fillRect(pinX - 1.5, -4, 3, 9);
            ctx.fillStyle = '#555';
            ctx.fillRect(pinX - 1.5, 0, 3, 1.5);
          }
        } else if (it.kind === 'pants') {
          ctx.fillStyle = it.col;
          ctx.strokeStyle = '#182b42';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(-10, 2);
          ctx.lineTo(10, 2);
          ctx.lineTo(11, 36);
          ctx.lineTo(2, 36);
          ctx.lineTo(0, 16);
          ctx.lineTo(-2, 36);
          ctx.lineTo(-11, 36);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = it.shade;
          ctx.fillRect(-10, 2, 20, 4);
          for (const pinX of [-7, 7]) {
            ctx.fillStyle = '#d4a373';
            ctx.fillRect(pinX - 1.5, -4, 3, 9);
          }
        } else if (it.kind === 'towel') {
          ctx.fillStyle = it.col;
          ctx.strokeStyle = '#5c4610';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(-11, 2);
          ctx.lineTo(11, 2);
          ctx.lineTo(12, 28);
          ctx.quadraticCurveTo(6, 31, 0, 28);
          ctx.quadraticCurveTo(-6, 31, -12, 28);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = it.shade;
          ctx.fillRect(-11, 21, 22, 3);
          for (const pinX of [-8, 8]) {
            ctx.fillStyle = '#d4a373';
            ctx.fillRect(pinX - 1.5, -4, 3, 9);
          }
        } else {
          ctx.fillStyle = it.col;
          ctx.strokeStyle = '#1b4740';
          ctx.lineWidth = 1.3;
          for (const sx of [-5, 4]) {
            ctx.beginPath();
            ctx.roundRect(sx - 3, 2, 6, 17, 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(sx + 2, 18, 4.5, 2.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.fillStyle = '#d4a373';
          ctx.fillRect(-2, -4, 3.5, 9);
        }

        ctx.restore();
      }
      ctx.restore();
    } else if (p.type === 'cobble') {
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = '#242938';
      ctx.fillRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#4e556e';
      ctx.fillRect(0, 0, p.w, 12);
      for (let cx = 0; cx < p.w; cx += 24) {
        ctx.fillStyle = (cx / 24) % 2 === 0 ? '#5c6482' : '#474e66';
        ctx.beginPath();
        ctx.roundRect(cx + 1, 1, 21, 9, 3);
        ctx.fill();
      }
      ctx.fillStyle = '#717a99';
      ctx.fillRect(0, 0, p.w, 2);
      ctx.restore();
    } else if (p.type === 'barrel') {
      ctx.save();
      ctx.translate(px, py);
      const bGrad = ctx.createLinearGradient(0, 0, p.w, 0);
      bGrad.addColorStop(0, '#4f2b14');
      bGrad.addColorStop(0.28, '#8d562d');
      bGrad.addColorStop(0.52, '#a36738');
      bGrad.addColorStop(1, '#3d1f0c');
      ctx.fillStyle = bGrad;
      ctx.strokeStyle = '#241206';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(0, 0, p.w, p.h, 9);
      ctx.fill();
      ctx.stroke();
      // Curved oak staves
      ctx.strokeStyle = 'rgba(28, 13, 4, 0.5)';
      ctx.lineWidth = 1.2;
      for (let gx = 11; gx < p.w - 8; gx += 11) {
        const curve = (gx - p.w / 2) * 0.12;
        ctx.beginPath();
        ctx.moveTo(gx, 2);
        ctx.quadraticCurveTo(gx + curve, p.h / 2, gx, p.h - 2);
        ctx.stroke();
      }
      // Top rim highlight
      ctx.fillStyle = 'rgba(255, 224, 175, 0.22)';
      ctx.fillRect(4, 2, p.w - 8, 2);
      // Riveted wrought-iron hoops
      for (const hy of [9, p.h - 15]) {
        ctx.fillStyle = '#252b38';
        ctx.fillRect(1, hy, p.w - 2, 5.5);
        ctx.fillStyle = 'rgba(180, 195, 220, 0.35)';
        ctx.fillRect(2, hy + 0.8, p.w - 4, 1.2);
        ctx.fillStyle = '#9aa6bd';
        for (let rx = 8; rx < p.w - 6; rx += 14) {
          ctx.beginPath(); ctx.arc(rx, hy + 2.8, 1.2, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
    } else if (p.type === 'stall') {
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = '#5c371c';
      ctx.fillRect(0, 10, p.w, p.h - 10);
      ctx.fillStyle = '#1d7874';
      ctx.beginPath();
      ctx.roundRect(-4, 0, p.w + 8, 14, [6, 6, 4, 4]);
      ctx.fill();
      ctx.fillStyle = '#ffd166';
      for (let sx = 6; sx < p.w - 6; sx += 22) {
        ctx.fillRect(sx, 1, 10, 11);
      }
      ctx.strokeStyle = '#0f3d3b';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(-4, 0, p.w + 8, 14);
      for (let bx = 14; bx < p.w - 10; bx += 28) {
        ctx.fillStyle = '#ffe899';
        ctx.beginPath();
        ctx.arc(bx, 18, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (p.type === 'brickwall') {
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = patterns.brick;
      ctx.fillRect(0, 0, p.w, p.h);
      ctx.strokeStyle = '#3d1c16';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
    } else if (p.type === 'pier') {
      ctx.save();
      ctx.translate(px, py);
      for (let pilX = 28; pilX < p.w - 20; pilX += 110) {
        ctx.fillStyle = '#361f10';
        ctx.fillRect(pilX, 14, 20, p.h - 14);
        ctx.fillStyle = '#523019';
        ctx.fillRect(pilX + 2, 14, 6, p.h - 14);
        ctx.fillStyle = '#224c3a';
        ctx.fillRect(pilX, p.h - 28, 20, 14);
        if (pilX + 110 < p.w - 20) {
          ctx.strokeStyle = '#3d2413';
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(pilX + 10, 26); ctx.lineTo(pilX + 110, p.h - 22); ctx.stroke();
        }
      }
      ctx.fillStyle = patterns.wood;
      ctx.fillRect(0, 0, p.w, 20);
      ctx.fillStyle = '#3d200d';
      ctx.fillRect(0, 18, p.w, 4);
      ctx.fillStyle = 'rgba(255, 224, 180, 0.2)';
      ctx.fillRect(0, 1, p.w, 2.5);
      for (let sx = 0; sx < p.w; sx += 48) {
        ctx.fillStyle = 'rgba(30, 14, 4, 0.45)';
        ctx.fillRect(sx, 0, 2, 18);
      }
      for (let bx = 34; bx < p.w - 20; bx += 220) {
        ctx.fillStyle = '#252c3b';
        ctx.fillRect(bx, -9, 10, 9);
        ctx.fillRect(bx - 3, -11, 16, 3.5);
        ctx.strokeStyle = '#c8a97e';
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.ellipse(bx + 18, -2, 8, 2.5, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    } else if (p.type === 'boat') {
      ctx.save();
      ctx.translate(px, py);
      const hullGrad = ctx.createLinearGradient(0, 0, 0, p.h);
      hullGrad.addColorStop(0, '#9c5e31');
      hullGrad.addColorStop(0.55, '#693b1a');
      hullGrad.addColorStop(1, '#381d0b');
      ctx.fillStyle = hullGrad;
      ctx.strokeStyle = '#1f0e04';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, 6);
      ctx.quadraticCurveTo(p.w * 0.5, 9, p.w + 4, 6);
      ctx.quadraticCurveTo(p.w - 10, p.h - 4, p.w - 24, p.h);
      ctx.lineTo(24, p.h);
      ctx.quadraticCurveTo(10, p.h - 4, -4, 6);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#b87642';
      ctx.beginPath(); ctx.roundRect(-5, 2, p.w + 10, 6, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#d62828';
      ctx.fillRect(14, p.h - 14, p.w - 28, 4.5);
      ctx.fillStyle = '#3b2110';
      ctx.fillRect(p.w - 16, -18, 4, 20);
      ctx.fillStyle = '#ffe899';
      ctx.beginPath(); ctx.arc(p.w - 14, -20, 4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#d4a373';
      ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(24, 1); ctx.lineTo(p.w - 38, 1); ctx.stroke();
      ctx.strokeStyle = '#f8f9fa';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(p.w * 0.35, 20, 6.5, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#e63946';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(p.w * 0.35, 20, 6.5, -0.4, 0.4); ctx.stroke();
      ctx.restore();
    } else if (p.type === 'buoy') {
      ctx.save();
      ctx.translate(px, py);
      const stemH = Math.max(24, p.h - 14);
      ctx.fillStyle = '#2c3648';
      ctx.strokeStyle = '#121824';
      ctx.lineWidth = 1.6;
      ctx.fillRect(p.w * 0.34, 14, p.w * 0.32, stemH);
      ctx.strokeRect(p.w * 0.34, 14, p.w * 0.32, stemH);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(p.w * 0.36, 22, p.w * 0.28, 5);
      const buoyGrad = ctx.createLinearGradient(0, -4, 0, 16);
      buoyGrad.addColorStop(0, '#ff6b6b');
      buoyGrad.addColorStop(1, '#c92a2a');
      ctx.fillStyle = buoyGrad;
      ctx.strokeStyle = '#5c1414';
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(2, 0, p.w - 4, 16, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(p.w * 0.22, 1, 14, 14);
      ctx.fillRect(p.w * 0.64, 1, 14, 14);
      ctx.fillStyle = '#ffd166';
      ctx.beginPath(); ctx.arc(p.w * 0.5, 8, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (p.type === 'rigging') {
      ctx.save();
      const sag = 8 + (p.ropeSag || 0);
      const ropeYAt = (t) => (1 - t) * (1 - t) * (py + 2) + 2 * (1 - t) * t * (py + 2 + sag) + t * t * (py + 2);

      // Heavy iron dock bollards / ship mooring cleats at both ends
      for (const anchorX of [px, px + p.w]) {
        ctx.fillStyle = '#2d3748';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.fillRect(anchorX - 5, py - 9, 10, 22);
        ctx.strokeRect(anchorX - 5, py - 9, 10, 22);
        ctx.fillStyle = '#475569';
        ctx.fillRect(anchorX - 7, py - 11, 14, 5);
        ctx.strokeRect(anchorX - 7, py - 11, 14, 5);
        // Coiled mooring knot wrap around bollard
        ctx.strokeStyle = '#b68d5c';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(anchorX - 6, py + 2); ctx.lineTo(anchorX + 6, py + 4); ctx.stroke();
      }

      // Thick braided maritime ship hawser (no party flags)
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#2a1c0e';
      ctx.lineWidth = 7.2;
      ctx.beginPath(); ctx.moveTo(px, py + 3); ctx.quadraticCurveTo(px + p.w / 2, py + 3 + sag, px + p.w, py + 3); ctx.stroke();

      ctx.strokeStyle = '#b98f5a';
      ctx.lineWidth = 4.6;
      ctx.beginPath(); ctx.moveTo(px, py + 2); ctx.quadraticCurveTo(px + p.w / 2, py + 2 + sag, px + p.w, py + 2); ctx.stroke();

      // Twisted hemp strand weave ticks along the hawser
      ctx.strokeStyle = '#6f4e28';
      ctx.lineWidth = 1.4;
      for (let t = 0.05; t <= 0.95; t += 0.045) {
        const rx = px + p.w * t;
        const ry = ropeYAt(t);
        ctx.beginPath(); ctx.moveTo(rx - 2, ry - 2.2); ctx.lineTo(rx + 2, ry + 2.2); ctx.stroke();
      }
      ctx.restore();
    } else if (p.type === 'grass') {
      ctx.save();
      ctx.translate(px, py);
      // Rich dark earth with pebbles
      const soilGrad = ctx.createLinearGradient(0, 12, 0, p.h);
      soilGrad.addColorStop(0, '#3e2718');
      soilGrad.addColorStop(1, '#1e120a');
      ctx.fillStyle = soilGrad;
      ctx.fillRect(0, 12, p.w, p.h - 12);
      for (let rx = 18; rx < p.w - 14; rx += 38) {
        ctx.fillStyle = 'rgba(130, 110, 95, 0.25)';
        ctx.beginPath(); ctx.ellipse(rx, 28 + (rx % 24), 5, 3, 0.2, 0, Math.PI * 2); ctx.fill();
      }
      // Lush layered turf top
      ctx.fillStyle = '#23593a';
      ctx.fillRect(0, 4, p.w, 12);
      ctx.fillStyle = '#388e58';
      ctx.fillRect(0, 0, p.w, 8);
      // Individual grass blades & tiny wildflowers
      for (let gx = 4; gx < p.w - 4; gx += 12) {
        ctx.fillStyle = gx % 24 === 4 ? '#52b788' : '#40916c';
        ctx.beginPath();
        ctx.moveTo(gx, 2); ctx.lineTo(gx + 3, -5); ctx.lineTo(gx + 6, 2);
        ctx.closePath(); ctx.fill();
        if (gx % 48 === 4) {
          ctx.fillStyle = gx % 96 === 4 ? '#ffd166' : '#ff8fab';
          ctx.beginPath(); ctx.arc(gx + 8, -2, 2.2, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
    } else if (p.type === 'stonewall') {
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = '#3f4959';
      ctx.fillRect(0, 0, p.w, p.h);
      // Chiseled stone blocks
      ctx.strokeStyle = '#202630';
      ctx.lineWidth = 1.6;
      for (let sy = 0; sy < p.h; sy += 22) {
        const off = (sy / 22) % 2 === 0 ? 0 : 16;
        for (let sx = -off; sx < p.w; sx += 32) {
          ctx.fillStyle = (sx + sy) % 64 === 0 ? '#4d596b' : '#3a4454';
          ctx.fillRect(Math.max(0, sx + 1), sy + 1, Math.min(30, p.w - sx - 1), 20);
          ctx.strokeRect(Math.max(0, sx + 1), sy + 1, Math.min(30, p.w - sx - 1), 20);
        }
      }
      // Moss & creeping ivy vines
      ctx.fillStyle = '#3a824e';
      ctx.fillRect(0, 0, p.w, 6);
      for (let mx = 6; mx < p.w - 6; mx += 18) {
        ctx.beginPath(); ctx.arc(mx, 7, 4, 0, Math.PI); ctx.fill();
      }
      ctx.restore();
    } else if (p.type === 'branch') {
      ctx.save();
      ctx.translate(px, py);
      // Hanging moss & leafy vines underneath for natural canopy feel
      ctx.strokeStyle = '#2d6a4f';
      ctx.lineWidth = 2;
      for (let vx = 22; vx < p.w - 20; vx += 34) {
        const vLen = 10 + (vx % 12);
        ctx.beginPath();
        ctx.moveTo(vx, p.h - 3);
        ctx.quadraticCurveTo(vx + 3, p.h + vLen * 0.5, vx - 2, p.h + vLen);
        ctx.stroke();
        ctx.fillStyle = '#40916c';
        ctx.beginPath(); ctx.arc(vx - 2, p.h + vLen, 2.5, 0, Math.PI * 2); ctx.fill();
      }
      // Oak bark branch
      const brGrad = ctx.createLinearGradient(0, 0, 0, p.h);
      brGrad.addColorStop(0, '#784824');
      brGrad.addColorStop(0.5, '#593317');
      brGrad.addColorStop(1, '#3b200d');
      ctx.fillStyle = brGrad;
      ctx.strokeStyle = '#241206';
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(0, 2, p.w, p.h - 4, 8); ctx.fill(); ctx.stroke();
      // Bark ridges
      ctx.strokeStyle = 'rgba(255, 220, 175, 0.16)';
      ctx.lineWidth = 1.2;
      for (let bx = 12; bx < p.w - 18; bx += 26) {
        ctx.beginPath(); ctx.moveTo(bx, 6); ctx.lineTo(bx + 14, 6); ctx.stroke();
      }
      // Leafy clusters at ends
      for (const lx of [8, p.w - 10]) {
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath(); ctx.arc(lx, 6, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#40916c';
        ctx.beginPath(); ctx.arc(lx + 4, 3, 5.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    } else if (p.type === 'bench') {
      ctx.save();
      ctx.translate(px, py);
      const legH = Math.max(20, p.h - 6);
      // Cast-iron legs & ornate armrests
      ctx.fillStyle = '#1b222c';
      ctx.fillRect(12, 6, 6, legH);
      ctx.fillRect(p.w - 18, 6, 6, legH);
      ctx.fillRect(8, legH + 2, 14, 4);
      ctx.fillRect(p.w - 22, legH + 2, 14, 4);
      ctx.strokeStyle = '#2b3645';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(12, 6, 6, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(p.w - 12, 6, 6, Math.PI, 0); ctx.stroke();
      // Wooden seat & double backrest slats
      ctx.fillStyle = '#8b542b';
      ctx.strokeStyle = '#3b200d';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.roundRect(0, 0, p.w, 8, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#73421e';
      ctx.beginPath(); ctx.roundRect(4, -10, p.w - 8, 6, 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(4, -18, p.w - 8, 5, 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    } else if (p.type === 'mushroom') {
      ctx.save();
      ctx.translate(px, py);
      const stemH = Math.max(20, p.h - 10);
      // Shaded cream mushroom stem reaching ground
      const stemGrad = ctx.createLinearGradient(p.w * 0.34, 0, p.w * 0.66, 0);
      stemGrad.addColorStop(0, '#d8ccb2');
      stemGrad.addColorStop(0.5, '#f6efe0');
      stemGrad.addColorStop(1, '#c2b295');
      ctx.fillStyle = stemGrad;
      ctx.strokeStyle = '#5c4b3f';
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(p.w * 0.35, 10, p.w * 0.3, stemH, 5); ctx.fill(); ctx.stroke();
      // Mossy grass tuft around stem base
      ctx.fillStyle = '#2d6a4f';
      ctx.beginPath(); ctx.ellipse(p.w * 0.5, stemH + 8, p.w * 0.24, 5, 0, 0, Math.PI * 2); ctx.fill();
      // Glowing spotted red-orange bouncy cap
      const capGrad = ctx.createLinearGradient(0, -6, 0, 14);
      capGrad.addColorStop(0, '#ff7575');
      capGrad.addColorStop(1, '#c92a2a');
      ctx.fillStyle = capGrad;
      ctx.strokeStyle = '#5c1414';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, 13);
      ctx.quadraticCurveTo(p.w / 2, -14, p.w, 13);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Cream spots on cap
      ctx.fillStyle = '#fff8e8';
      for (const sx of [0.22, 0.45, 0.68, 0.82]) {
        ctx.beginPath(); ctx.arc(p.w * sx, 5 - (sx === 0.45 ? 3 : 0), 3.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    } else if (p.type === 'girder') {
      // Industrial Steel I-Beam Girder (دوامر حديدية)
      ctx.save();
      ctx.translate(px, py);
      const beamG = ctx.createLinearGradient(0, 0, 0, p.h);
      beamG.addColorStop(0, '#64748b');
      beamG.addColorStop(0.22, '#334155');
      beamG.addColorStop(0.78, '#1e293b');
      beamG.addColorStop(1, '#475569');
      ctx.fillStyle = beamG;
      ctx.fillRect(0, 0, p.w, p.h);
      // Top & bottom I-beam flanges
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 0, p.w, 5);
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, p.h - 5, p.w, 5);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(0, 0, p.w, p.h);
      // Structural web rivets & subtle rust/hazard end markers
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(2, 5, 10, p.h - 10);
      ctx.fillRect(p.w - 12, 5, 10, p.h - 10);
      ctx.fillStyle = '#cbd5e1';
      for (let rx = 20; rx < p.w - 16; rx += 18) {
        ctx.beginPath(); ctx.arc(rx, p.h / 2, 1.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    } else if (p.type === 'cable') {
      // High-tension rooftop steel cable with ceramic insulators & dynamic sag
      ctx.save();
      const sag = 6 + (p.ropeSag || 0);
      for (const anchorX of [px, px + p.w]) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(anchorX - 4, py - 8, 8, 18);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(anchorX, py + 2, 3.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4.2;
      ctx.beginPath(); ctx.moveTo(px, py + 2); ctx.quadraticCurveTo(px + p.w / 2, py + 2 + sag, px + p.w, py + 2); ctx.stroke();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py + 1.5); ctx.quadraticCurveTo(px + p.w / 2, py + 1.5 + sag, px + p.w, py + 1.5); ctx.stroke();
      ctx.restore();
    } else if (p.type === 'rooftop') {
      // Detailed High-Rise Architectural Skyscraper Roof & Facade
      ctx.save();
      ctx.translate(px, py);
      // Main precast brick/concrete facade
      const roofG = ctx.createLinearGradient(0, 0, 0, p.h);
      roofG.addColorStop(0, '#3a4254');
      roofG.addColorStop(0.22, '#283042');
      roofG.addColorStop(1, '#141926');
      ctx.fillStyle = roofG;
      ctx.fillRect(0, 0, p.w, p.h);

      // Vertical architectural pilasters (concrete columns)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      for (let cx = 0; cx < p.w; cx += 92) {
        ctx.fillRect(cx, 16, 14, p.h - 16);
      }

      // Classical cornice molding under the parapet
      ctx.fillStyle = '#4b5563';
      ctx.fillRect(0, 10, p.w, 8);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 18, p.w, 4);

      // Top parapet stone coping + rainwater scuppers + yellow edge warning
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, p.w, 10);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 0, p.w, 3);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 0, 18, 4);
      ctx.fillRect(p.w - 18, 0, 18, 4);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.4;
      for (let sx = 0; sx < p.w; sx += 46) {
        ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, 10); ctx.stroke();
      }

      // Recessed architectural apartment/office windows with sills & mullions
      for (let wy = 30; wy < p.h - 24; wy += 34) {
        for (let wx = 24; wx < p.w - 36; wx += 46) {
          ctx.fillStyle = '#0b111e';
          ctx.fillRect(wx, wy, 26, 20);
          const lit = ((wx * 5 + wy * 11) % 7) === 0;
          ctx.fillStyle = lit ? 'rgba(255, 212, 135, 0.35)' : 'rgba(56, 100, 150, 0.18)';
          ctx.fillRect(wx + 2, wy + 2, 22, 16);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(wx, wy, 26, 20);
          ctx.beginPath(); ctx.moveTo(wx + 13, wy); ctx.lineTo(wx + 13, wy + 20); ctx.stroke();
          // Stone window sill
          ctx.fillStyle = '#64748b';
          ctx.fillRect(wx - 2, wy + 20, 30, 3);
        }
      }

      // Metal downspout drainpipe on right edge
      ctx.fillStyle = '#475569';
      ctx.fillRect(p.w - 14, 18, 5, p.h - 18);
      ctx.fillStyle = '#1e293b';
      for (let by = 36; by < p.h - 10; by += 36) ctx.fillRect(p.w - 16, by, 9, 3);
      ctx.restore();
    } else if (p.type === 'watertower') {
      // Classic wooden-barrel rooftop water tower on steel cross-braced stilts
      ctx.save();
      ctx.translate(px, py);
      // Steel stilts underneath
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(10, p.h); ctx.lineTo(18, 42);
      ctx.moveTo(p.w - 10, p.h); ctx.lineTo(p.w - 18, 42);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(12, p.h - 6); ctx.lineTo(p.w - 16, 46);
      ctx.moveTo(p.w - 12, p.h - 6); ctx.lineTo(16, 46);
      ctx.stroke();
      // Wooden stave tank
      const tankG = ctx.createLinearGradient(8, 0, p.w - 8, 0);
      tankG.addColorStop(0, '#5c3417');
      tankG.addColorStop(0.45, '#8b5228');
      tankG.addColorStop(1, '#42230c');
      ctx.fillStyle = tankG;
      ctx.fillRect(10, 6, p.w - 20, 42);
      ctx.strokeStyle = '#1f0e04';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(10, 6, p.w - 20, 42);
      // Iron hoops
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(9, 16, p.w - 18, 3);
      ctx.fillRect(9, 34, p.w - 18, 3);
      // Conical roof cap (standable top)
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.moveTo(4, 6); ctx.lineTo(p.w / 2, -10); ctx.lineTo(p.w - 4, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    } else if (p.type === 'ac_unit') {
      // Industrial HVAC condenser unit with rotating fan
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, 0, p.w, 5);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, p.w, p.h);
      // Spinning fan grille
      const fx = p.w * 0.35, fy = p.h * 0.54, fr = Math.min(16, p.h * 0.34);
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.translate(fx, fy); ctx.rotate(time * 8);
      ctx.fillStyle = '#64748b';
      for (let b = 0; b < 4; b++) {
        ctx.rotate(Math.PI / 2);
        ctx.fillRect(-2, -fr + 2, 4, fr - 2);
      }
      ctx.restore();
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2); ctx.stroke();
      // Louvres on right
      ctx.fillStyle = '#475569';
      for (let ly = 12; ly < p.h - 8; ly += 6) ctx.fillRect(p.w * 0.62, ly, p.w * 0.28, 3);
      ctx.restore();
    } else if (p.type === 'skylight') {
      // Bouncy glowing glass penthouse skylight
      ctx.save();
      ctx.translate(px, py);
      const skyG = ctx.createLinearGradient(0, 0, 0, p.h);
      skyG.addColorStop(0, '#7dd3fc');
      skyG.addColorStop(0.5, '#38bdf8');
      skyG.addColorStop(1, '#fbbf24');
      ctx.fillStyle = skyG;
      ctx.beginPath(); ctx.roundRect(0, 0, p.w, p.h, [12, 12, 3, 3]); ctx.fill();
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.2;
      ctx.stroke();
      for (let mx = 24; mx < p.w - 10; mx += 26) {
        ctx.beginPath(); ctx.moveTo(mx, 2); ctx.lineTo(mx, p.h); ctx.stroke();
      }
      ctx.restore();
    } else if (p.type === 'gondola') {
      // Window-washer suspended cradle with guardrails
      ctx.save();
      ctx.translate(px, py);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.4;
      ctx.strokeRect(2, -18, p.w - 4, 18);
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 0, p.w, 5);
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6; ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
    } else if (p.type === 'steam_vent') {
      // NEW Stage 6 Obstacle/Lift: Thermal Steam Exhaust Updraft (فتحة بخار رافعة)
      ctx.save();
      ctx.translate(px, py);
      const cycle = (time + (p.phase || 0)) % 3.6;
      const active = cycle >= 1.1 && cycle <= 2.9;
      const warning = cycle >= 0.65 && cycle < 1.1;
      // Iron exhaust duct housing
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.8;
      ctx.fillRect(4, 4, p.w - 8, p.h - 4);
      ctx.strokeRect(4, 4, p.w - 8, p.h - 4);
      ctx.fillStyle = warning ? '#f59e0b' : active ? '#38bdf8' : '#64748b';
      ctx.fillRect(0, 0, p.w, 7);
      ctx.strokeRect(0, 0, p.w, 7);
      if (warning) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
        ctx.beginPath(); ctx.arc(p.w / 2, -6, 10 + Math.sin(time * 24) * 3, 0, Math.PI * 2); ctx.fill();
      } else if (active) {
        // Tall rising buoyant white steam column
        for (let s = 0; s < 9; s++) {
          const sy = -((time * 170 + s * 28) % 215);
          const alpha = Math.max(0, 0.42 * (1 + sy / 220));
          ctx.fillStyle = `rgba(226, 240, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.w / 2 + Math.sin(time * 6 + s) * 8, sy, 14 + (-sy * 0.06), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    } else if (p.type === 'seesaw') {
      // NEW Stage 6 Platform: Tilting Steel Balance Plank (لوح توازن حديدي)
      ctx.save();
      ctx.translate(px + p.w / 2, py + p.h / 2);
      // Central iron fulcrum stand
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(-12, 18); ctx.lineTo(0, 0); ctx.lineTo(12, 18); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.rotate(p.tiltAngle || 0);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-p.w / 2, -p.h / 2, 14, p.h);
      ctx.fillRect(p.w / 2 - 14, -p.h / 2, 14, p.h);
      ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (p.type === 'crumble') {
      // NEW Stage 6 Platform: Cracked Glass/Slate Tile (لوح زجاجي متصدع ينهار)
      if (p.broken) return;
      ctx.save();
      const shakeX = p.crumbleTimer > 0 ? Math.sin(time * 55) * 2.5 : 0;
      ctx.translate(px + shakeX, py);
      ctx.fillStyle = p.crumbleTimer > 0 ? 'rgba(248, 113, 113, 0.55)' : 'rgba(125, 211, 252, 0.42)';
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(0, 0, p.w, p.h, 4); ctx.fill(); ctx.stroke();
      // Crack lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(p.w * 0.25, 0); ctx.lineTo(p.w * 0.42, p.h * 0.6); ctx.lineTo(p.w * 0.34, p.h);
      ctx.moveTo(p.w * 0.72, 0); ctx.lineTo(p.w * 0.58, p.h * 0.5); ctx.lineTo(p.w * 0.68, p.h);
      ctx.stroke();
      ctx.restore();
    } else if (p.type === 'solar_panel') {
      // NEW Stage 6 Platform: Photovoltaic Solar Panel Array
      ctx.save();
      ctx.translate(px, py);
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(14, p.h); ctx.lineTo(14, 10); ctx.moveTo(p.w - 14, p.h); ctx.lineTo(p.w - 14, 10); ctx.stroke();
      const spG = ctx.createLinearGradient(0, 0, p.w, 16);
      spG.addColorStop(0, '#0f172a'); spG.addColorStop(0.5, '#1d4ed8'); spG.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = spG;
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
      ctx.fillRect(0, 0, p.w, 16);
      ctx.strokeRect(0, 0, p.w, 16);
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)'; ctx.lineWidth = 1;
      for (let gx = 18; gx < p.w; gx += 18) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, 16); ctx.stroke(); }
      ctx.restore();
    } else if (p.type === 'car') {
      // Enlarged Realistic Standable Parked City Delivery Van / Sedan Platform
      ctx.save();
      ctx.translate(px, py);
      const isVan = p.variant === 'van';

      // Ground contact shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath(); ctx.ellipse(p.w * 0.5, p.h + 1, p.w * 0.52, 6, 0, 0, Math.PI * 2); ctx.fill();

      if (isVan) {
        // Roof rack rails
        ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2.4;
        ctx.strokeRect(36, -5, p.w - 52, 6);
        // Two-tone metallic delivery van body
        const vanG = ctx.createLinearGradient(0, 0, 0, p.h - 10);
        vanG.addColorStop(0, '#f1f5f9');
        vanG.addColorStop(0.45, '#cbd5e1');
        vanG.addColorStop(0.47, '#2563eb');
        vanG.addColorStop(0.88, '#1d4ed8');
        vanG.addColorStop(1, '#1e3a8a');
        ctx.fillStyle = vanG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(4, p.h - 11);
        ctx.lineTo(4, 34);
        ctx.lineTo(26, 2);
        ctx.lineTo(p.w - 10, 2);
        ctx.quadraticCurveTo(p.w - 2, 2, p.w - 2, 12);
        ctx.lineTo(p.w - 2, p.h - 11);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Specular roof highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(28, 4, p.w - 42, 2.5);

        // Tinted windshield & side cab window with diagonal reflection
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.moveTo(27, 7); ctx.lineTo(52, 7); ctx.lineTo(52, 29); ctx.lineTo(12, 29); ctx.closePath(); ctx.fill();
        ctx.fillRect(58, 7, 24, 22);
        ctx.fillStyle = 'rgba(186, 230, 253, 0.26)';
        ctx.beginPath(); ctx.moveTo(30, 7); ctx.lineTo(38, 7); ctx.lineTo(26, 29); ctx.lineTo(18, 29); ctx.closePath(); ctx.fill();

        // Side mirror, door seam, sliding cargo door & chrome handles
        ctx.fillStyle = '#1e293b'; ctx.fillRect(49, 24, 7, 5);
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.55)'; ctx.lineWidth = 1.4;
        ctx.strokeRect(88, 9, p.w - 102, p.h - 24);
        ctx.fillStyle = '#e2e8f0'; ctx.fillRect(72, 34, 7, 2.5); ctx.fillRect(94, 34, 7, 2.5);

        // Chrome front & rear bumpers, glowing headlight + beam & taillight
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(-1, p.h - 17, 10, 7); ctx.fillRect(p.w - 8, p.h - 17, 9, 7);
        ctx.fillStyle = '#fff5b8'; ctx.fillRect(2, p.h - 30, 7, 8);
        const hBeam = ctx.createLinearGradient(2, p.h - 26, -55, p.h - 20);
        hBeam.addColorStop(0, 'rgba(255, 244, 175, 0.28)'); hBeam.addColorStop(1, 'rgba(255, 244, 175, 0)');
        ctx.fillStyle = hBeam;
        ctx.beginPath(); ctx.moveTo(2, p.h - 30); ctx.lineTo(-55, p.h - 38); ctx.lineTo(-55, p.h - 10); ctx.lineTo(2, p.h - 22); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ef4444'; ctx.fillRect(p.w - 6, p.h - 32, 4, 10);
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(p.w - 6, p.h - 38, 4, 5);
      } else {
        const sedG = ctx.createLinearGradient(0, 0, 0, p.h - 10);
        sedG.addColorStop(0, '#ef4444'); sedG.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = sedG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.roundRect(0, 14, p.w, p.h - 24, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.roundRect(p.w * 0.2, 0, p.w * 0.56, 18, [6, 6, 0, 0]); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#0f172a'; ctx.fillRect(p.w * 0.26, 3, p.w * 0.2, 11); ctx.fillRect(p.w * 0.5, 3, p.w * 0.2, 11);
      }

      // Recessed dark wheel arches, rubber tires & 5-spoke alloy rims
      for (const wx of [34, p.w - 36]) {
        ctx.fillStyle = '#090d16'; ctx.beginPath(); ctx.arc(wx, p.h - 10, 15, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#111827'; ctx.strokeStyle = '#05070c'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(wx, p.h - 10, 12.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.arc(wx, p.h - 10, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.4;
        for (let sp = 0; sp < 5; sp++) {
          const a = (sp * Math.PI * 2) / 5;
          ctx.beginPath(); ctx.moveTo(wx, p.h - 10); ctx.lineTo(wx + Math.cos(a) * 6.5, p.h - 10 + Math.sin(a) * 6.5); ctx.stroke();
        }
        ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(wx, p.h - 10, 2.4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    } else if (p.type === 'rail_platform') {
      // Authentic Concrete Metro Platform with Tactile Dots, Overhang Shadow & Steel Tracks
      ctx.save();
      ctx.translate(px, py);
      const platG = ctx.createLinearGradient(0, 0, 0, p.h);
      platG.addColorStop(0, '#64748b'); platG.addColorStop(0.18, '#475569'); platG.addColorStop(0.32, '#1e293b'); platG.addColorStop(1, '#0f172a');
      ctx.fillStyle = platG; ctx.fillRect(0, 0, p.w, p.h);
      // Textured Yellow Tactile Safety Strip with raised warning dots
      ctx.fillStyle = '#eab308'; ctx.fillRect(0, 0, p.w, 9);
      ctx.fillStyle = '#a16207';
      for (let tx = 6; tx < p.w; tx += 12) { ctx.beginPath(); ctx.arc(tx, 4.5, 1.8, 0, Math.PI * 2); ctx.fill(); }
      // Recessed dark platform overhang shadow
      ctx.fillStyle = '#090d16'; ctx.fillRect(0, 18, p.w, 12);
      // Crushed stone ballast + creosote wooden sleepers + twin steel T-rails
      ctx.fillStyle = '#3f2718';
      for (let sx = 10; sx < p.w; sx += 30) ctx.fillRect(sx, p.h - 22, 16, 10);
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(0, p.h - 20, p.w, 4);
      ctx.fillStyle = '#475569'; ctx.fillRect(0, p.h - 15, p.w, 2);
      // Electrified yellow-capped third rail
      ctx.fillStyle = '#facc15'; ctx.fillRect(0, p.h - 27, p.w, 3);
      ctx.restore();
    } else if (p.type === 'train_car') {
      // Detailed Parked Stainless-Steel Metro Car or Weathered Freight Boxcar (with optional Street-Art Graffiti)
      ctx.save();
      ctx.translate(px, py);
      const isSubway = p.variant === 'subway';

      // Heavy iron coupler buffers at both ends & underframe air-brake tank
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-7, p.h - 24, 9, 6);
      ctx.fillRect(p.w - 2, p.h - 24, 9, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(p.w * 0.32, p.h - 16, p.w * 0.36, 5);
      ctx.beginPath(); ctx.roundRect(p.w * 0.42, p.h - 17, 26, 8, 4); ctx.fill();

      const carG = ctx.createLinearGradient(0, 4, 0, p.h - 14);
      if (isSubway) {
        carG.addColorStop(0, '#e2e8f0'); carG.addColorStop(0.45, '#94a3b8'); carG.addColorStop(1, '#475569');
      } else {
        carG.addColorStop(0, '#a63a17'); carG.addColorStop(0.55, '#7c2d12'); carG.addColorStop(1, '#431407');
      }
      ctx.fillStyle = carG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(0, 5, p.w, p.h - 19, isSubway ? [14, 14, 4, 4] : 4); ctx.fill(); ctx.stroke();

      // Roof HVAC pods / raised freight roofwalk
      ctx.fillStyle = '#334155'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.2;
      if (isSubway) {
        ctx.fillRect(28, 0, 42, 6); ctx.strokeRect(28, 0, 42, 6);
        ctx.fillRect(p.w - 70, 0, 42, 6); ctx.strokeRect(p.w - 70, 0, 42, 6);
      } else {
        ctx.fillStyle = '#475569';
        ctx.fillRect(10, 1, p.w - 20, 4); ctx.strokeRect(10, 1, p.w - 20, 4);
      }

      if (isSubway) {
        ctx.fillStyle = '#1d4ed8'; ctx.fillRect(2, p.h * 0.56, p.w - 4, 11);
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(2, p.h * 0.64, p.w - 4, 3);
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
        for (let ry = 46; ry < p.h - 20; ry += 5) { ctx.beginPath(); ctx.moveTo(6, ry); ctx.lineTo(p.w - 6, ry); ctx.stroke(); }
        // 3 Large Realistic Double Sliding Metro Doors (full passenger height)
        const doorFracs = p.w > 360 ? [0.15, 0.44, 0.73] : [0.24, 0.62];
        for (const df of doorFracs) {
          const dx = p.w * df;
          const dw = 48;
          const dh = p.h - 30;
          ctx.fillStyle = '#475569'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.roundRect(dx, 12, dw, dh, [4, 4, 0, 0]); ctx.fill(); ctx.stroke();
          // Rubber center seal
          ctx.fillStyle = '#090d16'; ctx.fillRect(dx + dw / 2 - 1.5, 12, 3, dh);
          // Tall rounded safety-glass door windows
          ctx.fillStyle = 'rgba(255, 232, 165, 0.86)';
          ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.roundRect(dx + 5, 19, 15, dh * 0.46, 3); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.roundRect(dx + dw - 20, 19, 15, dh * 0.46, 3); ctx.fill(); ctx.stroke();
        }
        // Wide panoramic passenger windows between doors
        const winFracs = p.w > 360 ? [0.04, 0.30, 0.59, 0.87] : [0.06, 0.45, 0.82];
        for (const wf of winFracs) {
          const wx = p.w * wf;
          ctx.fillStyle = 'rgba(255, 232, 165, 0.9)';
          ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.roundRect(wx, 19, 36, 30, 4); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)'; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(wx + 18, 20); ctx.lineTo(wx + 18, 48); ctx.stroke();
        }
      } else {
        // Corrugated steel ribs with highlight + shadow depth
        for (let rx = 18; rx < p.w - 16; rx += 14) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
          ctx.fillRect(rx, 8, 3, p.h - 24);
          ctx.fillStyle = 'rgba(255, 210, 170, 0.12)';
          ctx.fillRect(rx + 3, 8, 2, p.h - 24);
        }
        // Horizontal steel belt rail & riveted corner posts
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.fillRect(2, p.h * 0.48, p.w - 4, 4);
        ctx.fillStyle = '#5c210e';
        ctx.fillRect(2, 6, 8, p.h - 21);
        ctx.fillRect(p.w - 10, 6, 8, p.h - 21);

        // Detailed Sliding Cargo Door with Upper Track Rail, Rollers & Locking Bar
        const doorX = p.w * 0.34;
        const doorW = p.w * 0.28;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(doorX - 10, 9, doorW + 20, 4); // upper door track
        ctx.fillStyle = '#6c2710';
        ctx.fillRect(doorX, 13, doorW, p.h - 29);
        ctx.strokeStyle = '#1a0a04'; ctx.lineWidth = 1.6;
        ctx.strokeRect(doorX, 13, doorW, p.h - 29);
        // Door vertical lock bar & brass padlock
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(doorX + doorW - 10, 15, 3, p.h - 33);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(doorX + doorW - 12, p.h * 0.45, 7, 7);

        // Stenciled Freight Numbering
        ctx.fillStyle = 'rgba(255, 248, 230, 0.72)';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('RAIL-07', 16, 20);

        // Steel End Ladder (left) & Handbrake Wheel (right)
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(6, 10); ctx.lineTo(6, p.h - 14);
        ctx.moveTo(13, 10); ctx.lineTo(13, p.h - 14);
        for (let ly = 15; ly < p.h - 16; ly += 10) {
          ctx.moveTo(6, ly); ctx.lineTo(13, ly);
        }
        ctx.stroke();
        // Handbrake wheel on right end
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(p.w - 8, 28, 6, 0, Math.PI * 2); ctx.stroke();

        // Custom MAX07 Graffiti Sticker (background removed, slightly transparent on corrugated steel)
        if (p.graffiti) {
          if (graffitiReady) {
            ctx.save();
            const maxW = p.w - 44;
            const maxH = p.h - 32;
            const ratio = Math.min(maxW / graffitiImg.width, maxH / graffitiImg.height);
            const gw = graffitiImg.width * ratio;
            const gh = graffitiImg.height * ratio;
            const gx = (p.w - gw) * 0.5;
            const gy = 10 + (maxH - gh) * 0.5;
            ctx.globalAlpha = 0.78;
            ctx.drawImage(graffitiImg, gx, gy, gw, gh);
            ctx.globalAlpha = 1;
            // Subtle corrugated steel rib shadows over the sticker so it blends into the metal
            for (let rx = 18; rx < p.w - 16; rx += 14) {
              if (rx >= gx && rx <= gx + gw) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
                ctx.fillRect(rx, gy, 2.5, gh);
              }
            }
            ctx.restore();
          }

          // 7. Colorful Spray-Paint Cans & Paint Splatters scattered on the ground!
          const cans = [
            { x: -18, y: p.h - 1, ang: 0.05, col: '#ec4899', upright: true },
            { x: 18, y: p.h - 2, ang: -1.35, col: '#22d3ee', upright: false },
            { x: 96, y: p.h - 1, ang: 0, col: '#a3e635', upright: true },
            { x: 174, y: p.h - 2, ang: 1.42, col: '#facc15', upright: false },
            { x: p.w + 16, y: p.h - 1, ang: -0.08, col: '#ef4444', upright: true },
          ];
          for (const can of cans) {
            // Paint splatter puddle on ground
            ctx.fillStyle = can.col;
            ctx.globalAlpha = 0.55;
            ctx.beginPath(); ctx.ellipse(can.x + 2, p.h, 11, 2.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;

            ctx.save();
            ctx.translate(can.x, can.upright ? can.y - 7 : can.y - 3);
            ctx.rotate(can.ang);
            // Cylindrical aluminum can body
            ctx.fillStyle = '#e2e8f0';
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.roundRect(-4, -7, 8, 14, 1.5); ctx.fill(); ctx.stroke();
            // Colored paint band & cap
            ctx.fillStyle = can.col;
            ctx.fillRect(-3.5, -2, 7, 7);
            ctx.fillRect(-3.5, -9, 7, 2.5);
            // White spray nozzle tip
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-1.5, -11.5, 3, 2.5);
            ctx.restore();
          }
        }
      }
      // Detailed Dual-Axle Steel Bogies with Coil Springs
      for (const bx of [20, p.w - 66]) {
        ctx.fillStyle = '#1e293b'; ctx.fillRect(bx, p.h - 16, 46, 7);
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(bx + 19, p.h - 15, 8, 5);
        for (const wx of [bx + 8, bx + 38]) {
          ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(wx, p.h - 8, 8.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.arc(wx, p.h - 8, 3.8, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
    } else if (p.type === 'rail_cart') {
      // Detailed Railway Maintenance Flatcar with Flashing Work Beacon & Toolbox
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = '#eab308'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
      ctx.fillRect(0, 4, p.w, p.h - 12);
      ctx.strokeRect(0, 4, p.w, p.h - 12);
      ctx.fillStyle = '#dc2626'; ctx.fillRect(14, -8, 28, 12); ctx.strokeRect(14, -8, 28, 12);
      const pulse = Math.sin(time * 8) > 0;
      ctx.fillStyle = pulse ? '#fbbf24' : '#92400e';
      ctx.beginPath(); ctx.arc(p.w - 22, 0, 5, 0, Math.PI * 2); ctx.fill();
      for (const wx of [20, p.w - 20]) {
        ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(wx, p.h - 5, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.arc(wx, p.h - 5, 2.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    } else if (p.type === 'baggage_cart') {
      // Vintage Brass & Oak Station Luggage Trolley with Strapped Trunks & Mail Sack
      ctx.save();
      ctx.translate(px, py);
      // Brass push handle & side rails
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(6, p.h - 14); ctx.lineTo(6, -16); ctx.lineTo(20, -16); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p.w - 8, p.h - 14); ctx.lineTo(p.w - 8, -10); ctx.stroke();
      // Bottom vintage steamer trunk with leather straps & brass corners
      ctx.fillStyle = '#78350f'; ctx.strokeStyle = '#291203'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(12, 4, p.w - 24, p.h - 18, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#451a03'; ctx.fillRect(24, 4, 5, p.h - 18); ctx.fillRect(p.w - 32, 4, 5, p.h - 18);
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(23, 10, 7, 5); ctx.fillRect(p.w - 33, 10, 7, 5);
      // Upper leather suitcase + bouncy canvas mail sack
      ctx.fillStyle = '#b45309';
      ctx.beginPath(); ctx.roundRect(20, -10, p.w - 40, 15, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fde68a'; ctx.fillRect(p.w * 0.45, -7, 10, 6);
      // Oak flatbed deck & spoked iron wheels
      ctx.fillStyle = '#334155'; ctx.fillRect(0, p.h - 14, p.w, 6);
      for (const wx of [16, p.w - 16]) {
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(wx, p.h - 5, 6.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(wx, p.h - 5, 2.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    } else if (p.type === 'escalator') {
      // NEW Stage 7 Mechanic: Animated Moving Metro Escalator / Conveyor Walkway
      ctx.save();
      ctx.translate(px, py);
      const dir = p.direction || 1;
      // Stainless steel balustrade & glass handrail
      ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.6;
      ctx.fillRect(4, -18, p.w - 8, 18);
      ctx.strokeRect(4, -18, p.w - 8, 18);
      // Moving black rubber handrail top
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.roundRect(0, -21, p.w, 5, 3); ctx.fill();
      //Metallic escalator deck housing
      const escG = ctx.createLinearGradient(0, 0, 0, p.h);
      escG.addColorStop(0, '#475569'); escG.addColorStop(0.5, '#1e293b'); escG.addColorStop(1, '#0f172a');
      ctx.fillStyle = escG;
      ctx.fillRect(0, 0, p.w, p.h);
      ctx.strokeStyle = '#090d16'; ctx.lineWidth = 1.8;
      ctx.strokeRect(0, 0, p.w, p.h);
      // Scrolling yellow-cleated escalator steps + crisp vector directional chevron arrows
      const stepOffset = ((time * 55 * dir) % 20 + 20) % 20;
      ctx.fillStyle = '#eab308';
      for (let sx = stepOffset; sx < p.w - 4; sx += 20) {
        ctx.fillRect(sx, 1, 3, 7);
      }
      ctx.direction = 'ltr';
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ESCALATOR', p.w / 2, p.h - 5);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (const baseCx of [22, 32, 42, p.w - 42, p.w - 32, p.w - 22]) {
        const cy = p.h - 9;
        ctx.beginPath();
        ctx.moveTo(baseCx - 3 * dir, cy - 3.5);
        ctx.lineTo(baseCx + 3 * dir, cy);
        ctx.lineTo(baseCx - 3 * dir, cy + 3.5);
        ctx.stroke();
      }
      ctx.restore();
    } else if (p.type === 'turnstile') {
      // NEW Stage 7 Bouncy Platform: Stainless-Steel Metro Fare Turnstile Gate
      ctx.save();
      ctx.translate(px, py);
      const bodyG = ctx.createLinearGradient(0, 0, p.w, 0);
      bodyG.addColorStop(0, '#94a3b8'); bodyG.addColorStop(0.5, '#e2e8f0'); bodyG.addColorStop(1, '#64748b');
      ctx.fillStyle = bodyG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(0, 0, p.w, p.h, [8, 8, 2, 2]); ctx.fill(); ctx.stroke();
      // Top contactless yellow/cyan smart-card pad (bouncy surface)
      ctx.fillStyle = '#0f172a'; ctx.fillRect(8, 0, p.w - 16, 6);
      ctx.fillStyle = '#38bdf8'; ctx.fillRect(14, 1, p.w - 28, 3);
      // LED GO / Arrow indicator screen
      ctx.fillStyle = '#090d16'; ctx.fillRect(10, 12, p.w - 20, 16);
      ctx.fillStyle = '#22c55e'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
      ctx.fillText('GO ➔', p.w / 2, 23);
      // Spinning 3-bar stainless steel tripod arms
      const hubX = p.w * 0.5, hubY = p.h * 0.58;
      ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(hubX, hubY, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
      for (let a = 0; a < 3; a++) {
        const ang = time * 2.2 + (a * Math.PI * 2) / 3;
        ctx.beginPath(); ctx.moveTo(hubX, hubY); ctx.lineTo(hubX + Math.cos(ang) * 18, hubY + Math.sin(ang) * 14); ctx.stroke();
      }
      ctx.restore();
    } else if (p.type === 'third_rail') {
      // NEW Stage 7 Timed Hazard/Platform: High-Voltage Electrified Third Rail
      ctx.save();
      ctx.translate(px, py);
      const cycle = (time + (p.phase || 0)) % 3.4;
      const arcing = cycle >= 1.9 && cycle <= 3.1;
      const warn = cycle >= 1.25 && cycle < 1.9;
      // Ceramic high-voltage insulators & heavy steel rail
      for (let ix = 16; ix < p.w - 10; ix += 38) {
        ctx.fillStyle = '#78350f'; ctx.fillRect(ix - 5, 10, 10, p.h - 10);
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(ix - 7, 13, 14, 4);
      }
      ctx.fillStyle = arcing ? '#38bdf8' : warn ? '#f59e0b' : '#475569';
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
      ctx.fillRect(0, 0, p.w, 11);
      ctx.strokeRect(0, 0, p.w, 11);
      // Yellow/black high-voltage hazard stripes
      ctx.fillStyle = '#eab308';
      for (let hx = 6; hx < p.w - 10; hx += 18) ctx.fillRect(hx, 3, 8, 5);
      if (warn) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.fillRect(0, -6, p.w, 8);
      } else if (arcing) {
        // Crackling blue-white electric arcs dancing across the rail!
        ctx.save();
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let ax = 4; ax < p.w - 4; ax += 14) {
          const jy = -4 - Math.abs(Math.sin(time * 42 + ax)) * 18;
          if (ax === 4) ctx.moveTo(ax, 0);
          else ctx.lineTo(ax, jy);
        }
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    } else if (p.type === 'catwalk') {
      // NEW Stage 7 Overhead Platform: Suspended Steel Tunnel Maintenance Catwalk
      ctx.save();
      ctx.translate(px, py);
      // Threaded suspension rods up to tunnel ceiling
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.48)'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(14, -py); ctx.moveTo(p.w - 14, 0); ctx.lineTo(p.w - 14, -py); ctx.stroke();
      // Safety yellow tubular handrail above deck
      ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2.2;
      ctx.strokeRect(2, -16, p.w - 4, 16);
      for (let rx = 32; rx < p.w - 10; rx += 32) {
        ctx.beginPath(); ctx.moveTo(rx, -16); ctx.lineTo(rx, 0); ctx.stroke();
      }
      // Perforated steel grating deck
      ctx.fillStyle = '#334155'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
      ctx.fillRect(0, 0, p.w, p.h);
      ctx.strokeRect(0, 0, p.w, p.h);
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
      for (let gx = 8; gx < p.w - 6; gx += 10) {
        ctx.beginPath(); ctx.moveTo(gx, 2); ctx.lineTo(gx + 5, p.h - 2); ctx.stroke();
      }
      ctx.restore();
    } else if (p.type === 'signal_bridge') {
      // NEW Stage 7 Platform: Overhead Railway Signal Truss Gantry with Semaphore Lights
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.8;
      ctx.fillRect(0, 0, p.w, p.h);
      ctx.strokeRect(0, 0, p.w, p.h);
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
      for (let tx = 8; tx < p.w - 14; tx += 18) {
        ctx.beginPath(); ctx.moveTo(tx, 2); ctx.lineTo(tx + 14, p.h - 2); ctx.moveTo(tx + 14, 2); ctx.lineTo(tx, p.h - 2); ctx.stroke();
      }
      // Hanging railway signal head with glowing green & red aspects
      const sx = p.w * 0.5;
      ctx.fillStyle = '#090d16'; ctx.fillRect(sx - 10, p.h, 20, 32);
      ctx.strokeStyle = '#475569'; ctx.strokeRect(sx - 10, p.h, 20, 32);
      const isGreen = Math.sin(time * 1.2 + p.x * 0.01) > -0.2;
      ctx.fillStyle = isGreen ? '#22c55e' : '#ef4444';
      ctx.beginPath(); ctx.arc(sx, p.h + (isGreen ? 22 : 10), 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (p.type === 'trashbin') {
      // Realistic Metro Station Slatted Metal Trash Bin (سلة مهملات المحطة)
      ctx.save();
      ctx.translate(px, py);
      // Domed hood top with side litter opening
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(2, 0, p.w - 4, 16, [12, 12, 2, 2]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#090d16';
      ctx.beginPath(); ctx.roundRect(10, 5, p.w - 20, 8, 3); ctx.fill();
      // Cylindrical ribbed steel body
      const binG = ctx.createLinearGradient(4, 16, p.w - 4, 16);
      binG.addColorStop(0, '#475569');
      binG.addColorStop(0.45, '#64748b');
      binG.addColorStop(1, '#1e293b');
      ctx.fillStyle = binG;
      ctx.fillRect(5, 16, p.w - 10, p.h - 20);
      ctx.strokeRect(5, 16, p.w - 10, p.h - 20);
      // Vertical steel slats & base plinth
      ctx.fillStyle = '#0f172a';
      for (let sx = 11; sx < p.w - 11; sx += 8) {
        ctx.fillRect(sx, 20, 2.5, p.h - 28);
      }
      // Subtle yellow/green recycling band
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(5, p.h - 14, p.w - 10, 4);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(2, p.h - 5, p.w - 4, 5);
      ctx.restore();
    } else if (p.type === 'concrete_slab') {
      // Unfinished Reinforced Concrete Deck with Formwork Seams, Exposed Rebar, Hazard Tape & Workshop Props
      ctx.save();
      ctx.translate(px, py);
      const slabG = ctx.createLinearGradient(0, 0, 0, p.h);
      slabG.addColorStop(0, '#64748b'); slabG.addColorStop(0.22, '#475569'); slabG.addColorStop(1, '#1e293b');
      ctx.fillStyle = slabG; ctx.fillRect(0, 0, p.w, p.h);
      // Concrete formwork panel seams
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)'; ctx.lineWidth = 1.4;
      for (let fx = 120; fx < p.w; fx += 120) { ctx.beginPath(); ctx.moveTo(fx, 8); ctx.lineTo(fx, p.h); ctx.stroke(); }
      ctx.fillStyle = '#eab308'; ctx.fillRect(0, 0, p.w, 8);
      ctx.fillStyle = '#0f172a';
      for (let hx = 0; hx < p.w; hx += 24) ctx.fillRect(hx, 0, 12, 8);
      // Exposed steel rebar rods with hooked ends
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.6;
      for (const ry of [18, 32, 46]) {
        ctx.beginPath();
        ctx.moveTo(-12, ry); ctx.lineTo(6, ry);
        ctx.moveTo(p.w - 6, ry); ctx.lineTo(p.w + 12, ry);
        ctx.stroke();
      }
      ctx.fillStyle = '#334155';
      for (let cx = 24; cx < p.w - 20; cx += 110) ctx.fillRect(cx, 12, 8, p.h - 12);

      // Construction Workshop Decorations seated cleanly on top of wide slabs
      if (p.w >= 900) {
        // 1. Orange & White Reflective Traffic Cones near edges
        for (const coneX of [38, p.w - 46]) {
          ctx.fillStyle = '#ea580c'; ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(coneX - 9, 0); ctx.lineTo(coneX - 3, -20); ctx.lineTo(coneX + 3, -20); ctx.lineTo(coneX + 9, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#f8fafc'; ctx.fillRect(coneX - 5.5, -12, 11, 4.5);
          ctx.fillStyle = '#1e293b'; ctx.fillRect(coneX - 11, -3, 22, 3.5);
        }
        // 2. Stacked Red Brick Pallet + Cement Bags
        const palX = p.w * 0.22;
        ctx.fillStyle = '#78350f'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.2;
        ctx.fillRect(palX, -6, 62, 6); ctx.strokeRect(palX, -6, 62, 6);
        for (let r = 0; r < 3; r++) {
          for (let b = 0; b < 4; b++) {
            ctx.fillStyle = (r + b) % 2 === 0 ? '#b91c1c' : '#991b1b';
            ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1;
            ctx.fillRect(palX + 4 + b * 13.5, -14 - r * 8, 12.5, 7);
            ctx.strokeRect(palX + 4 + b * 13.5, -14 - r * 8, 12.5, 7);
          }
        }
        // Cement bags beside pallet
        ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#475569';
        ctx.beginPath(); ctx.roundRect(palX + 68, -11, 24, 11, 3); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.roundRect(palX + 70, -21, 22, 10, 3); ctx.fill(); ctx.stroke();

        // 3. Detailed Yellow Concrete Mixer Drum with Chute, Wheel & Rotating Fin
        const mixX = p.w * 0.72;
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.8;
        ctx.beginPath(); ctx.moveTo(mixX - 16, 0); ctx.lineTo(mixX, -20); ctx.lineTo(mixX + 16, 0); ctx.stroke();
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(mixX - 14, -4, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.arc(mixX - 14, -4, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.save(); ctx.translate(mixX, -26); ctx.rotate(-0.45);
        ctx.fillStyle = '#eab308'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.ellipse(0, 0, 18, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, 12, time * 3, time * 3 + 2.2); ctx.stroke();
        ctx.fillStyle = '#334155'; ctx.fillRect(12, -7, 9, 14);
        ctx.restore();

        // 4. Tripod Halogen Site Floodlight with Warm Light Cone
        const flX = p.w * 0.48;
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(flX - 12, 0); ctx.lineTo(flX, -46); ctx.lineTo(flX + 12, 0); ctx.moveTo(flX, 0); ctx.lineTo(flX, -46); ctx.stroke();
        ctx.fillStyle = '#1e293b'; ctx.fillRect(flX - 11, -56, 22, 12);
        ctx.fillStyle = '#fef08a'; ctx.fillRect(flX - 9, -54, 18, 8);
        const fCone = ctx.createLinearGradient(flX, -50, flX + 60, 0);
        fCone.addColorStop(0, 'rgba(254, 240, 138, 0.28)'); fCone.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = fCone;
        ctx.beginPath(); ctx.moveTo(flX + 9, -54); ctx.lineTo(flX + 95, -12); ctx.lineTo(flX + 95, 0); ctx.lineTo(flX + 9, -46); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    } else if (p.type === 'safety_net') {
      // Detailed Heavy-Duty Construction Safety Trampoline / Netting Rig
      ctx.save();
      ctx.translate(px, py);
      const sag = p.bounceAnim ? Math.sin(p.bounceAnim * Math.PI) * 8 : 0;
      // Galvanized steel A-frame side stanchions & bolted baseplates
      ctx.fillStyle = '#334155'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.4;
      ctx.fillRect(-2, p.h - 4, 14, 4); ctx.fillRect(p.w - 12, p.h - 4, 14, 4);
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3.8; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(4, p.h - 2); ctx.lineTo(0, 2);
      ctx.moveTo(10, p.h - 2); ctx.lineTo(0, 2);
      ctx.moveTo(p.w - 4, p.h - 2); ctx.lineTo(p.w, 2);
      ctx.moveTo(p.w - 10, p.h - 2); ctx.lineTo(p.w, 2);
      ctx.stroke();
      // Yellow/black hazard collar caps on posts
      ctx.fillStyle = '#eab308'; ctx.fillRect(-3, -2, 8, 6); ctx.fillRect(p.w - 5, -2, 8, 6);
      // Criss-cross diamond safety netting under top rim
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.72)'; ctx.lineWidth = 1.4;
      for (let nx = 8; nx < p.w - 8; nx += 10) {
        const midSag = Math.sin((nx / p.w) * Math.PI) * (9 + sag);
        ctx.beginPath();
        ctx.moveTo(nx, 3 + midSag * 0.4); ctx.lineTo(nx + 7, 13 + midSag);
        ctx.moveTo(nx + 7, 3 + midSag * 0.4); ctx.lineTo(nx, 13 + midSag);
        ctx.stroke();
      }
      // Padded bright-orange perimeter tension cable + bungee rings
      ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(0, 3); ctx.quadraticCurveTo(p.w / 2, 11 + sag, p.w, 3); ctx.stroke();
      ctx.strokeStyle = '#fed7aa'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(2, 2); ctx.quadraticCurveTo(p.w / 2, 10 + sag, p.w - 2, 2); ctx.stroke();
      ctx.restore();
    } else if (p.type === 'elevator_hoist') {
      // Detailed Caged Rack-and-Pinion Construction Hoist with Guide Mast & Beacon
      ctx.save();
      ctx.translate(px, py);
      // Vertical steel guide rack rail behind hoist
      ctx.fillStyle = '#1e293b'; ctx.fillRect(p.w * 0.5 - 6, -90, 12, 90);
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.4;
      for (let ry = -84; ry < 0; ry += 12) { ctx.beginPath(); ctx.moveTo(p.w * 0.5 - 6, ry); ctx.lineTo(p.w * 0.5 + 6, ry); ctx.stroke(); }
      // Caged safety enclosure with diagonal wire mesh
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)'; ctx.fillRect(2, -30, p.w - 4, 30);
      ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2.4; ctx.strokeRect(2, -30, p.w - 4, 30);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.55)'; ctx.lineWidth = 1.2;
      for (let gx = 12; gx < p.w - 10; gx += 16) {
        ctx.beginPath(); ctx.moveTo(gx, -30); ctx.lineTo(gx + 10, 0); ctx.moveTo(gx + 10, -30); ctx.lineTo(gx, 0); ctx.stroke();
      }
      // Flashing amber hoist beacon
      ctx.fillStyle = Math.sin(time * 7) > 0 ? '#fb923c' : '#92400e';
      ctx.beginPath(); ctx.arc(p.w - 14, -34, 4, 0, Math.PI * 2); ctx.fill();
      // Heavy steel deck & hazard stripe
      ctx.fillStyle = '#334155'; ctx.fillRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#eab308'; ctx.fillRect(0, 0, p.w, 6);
      ctx.fillStyle = '#0f172a';
      for (let hx = 4; hx < p.w - 8; hx += 18) ctx.fillRect(hx, 0, 8, 6);
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.8; ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
    } else if (p.type === 'pendulum_beam') {
      // Detailed Swinging Wrecking-Crane Steel I-Beam with Suspension Cables & Shackle
      ctx.save();
      ctx.translate(px, py);
      // Twin suspension cables rising from central shackle
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.72)'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.w * 0.5 - 6, -12); ctx.lineTo(p.w * 0.5 - 24, -py);
      ctx.moveTo(p.w * 0.5 + 6, -12); ctx.lineTo(p.w * 0.5 + 24, -py);
      ctx.stroke();
      // Forged steel shackle & chain bridle
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(p.w * 0.5, -14); ctx.lineTo(24, 0); ctx.moveTo(p.w * 0.5, -14); ctx.lineTo(p.w - 24, 0); ctx.stroke();
      ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(p.w * 0.5 - 10, -20, 20, 12, 4); ctx.fill(); ctx.stroke();
      // Heavy I-beam flanges, web & rivets
      const pG = ctx.createLinearGradient(0, 0, 0, p.h);
      pG.addColorStop(0, '#64748b'); pG.addColorStop(0.5, '#334155'); pG.addColorStop(1, '#1e293b');
      ctx.fillStyle = pG; ctx.fillRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(0, 0, p.w, 4.5); ctx.fillRect(0, p.h - 4.5, p.w, 4.5);
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.8; ctx.strokeRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#f97316'; ctx.fillRect(2, 4.5, 16, p.h - 9); ctx.fillRect(p.w - 18, 4.5, 16, p.h - 9);
      ctx.fillStyle = '#cbd5e1';
      for (let rx = 28; rx < p.w - 24; rx += 18) { ctx.beginPath(); ctx.arc(rx, p.h / 2, 1.8, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    } else if (p.type === 'scaffolding') {
      // Detailed Multi-Tier Construction Scaffolding Tower with Guardrails, Couplers & Wooden Planks
      ctx.save();
      ctx.translate(px, py);
      // Top safety guardrail & mid-rail
      ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2.4;
      ctx.strokeRect(3, -22, p.w - 6, 22);
      ctx.beginPath(); ctx.moveTo(3, -11); ctx.lineTo(p.w - 3, -11); ctx.stroke();
      // Steel pipe vertical standards & horizontal ledgers across tiers
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(5, -22); ctx.lineTo(5, p.h);
      ctx.moveTo(p.w - 5, -22); ctx.lineTo(p.w - 5, p.h);
      if (p.w > 130) { ctx.moveTo(p.w * 0.5, 10); ctx.lineTo(p.w * 0.5, p.h); }
      ctx.stroke();
      // Diagonal X cross-braces
      const tiers = Math.max(1, Math.round(p.h / 75));
      const tierH = (p.h - 10) / tiers;
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
      for (let t = 0; t < tiers; t++) {
        const y0 = 10 + t * tierH;
        const y1 = y0 + tierH;
        ctx.beginPath();
        ctx.moveTo(6, y0); ctx.lineTo(p.w - 6, y1);
        ctx.moveTo(p.w - 6, y0); ctx.lineTo(6, y1);
        ctx.moveTo(6, y1); ctx.lineTo(p.w - 6, y1);
        ctx.stroke();
        // Steel joint coupler clamps
        ctx.fillStyle = '#eab308';
        ctx.fillRect(2, y0 - 2, 7, 5); ctx.fillRect(p.w - 9, y0 - 2, 7, 5);
      }
      // Screw-jack steel baseplates at bottom
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, p.h - 5, 14, 5); ctx.fillRect(p.w - 14, p.h - 5, 14, 5);
      // Heavy wooden scaffold plank deck with metal end-caps & grain
      ctx.fillStyle = '#92400e'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
      ctx.fillRect(0, 0, p.w, 11); ctx.strokeRect(0, 0, p.w, 11);
      ctx.fillStyle = '#b45309'; ctx.fillRect(2, 1.5, p.w - 4, 3);
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(0, 0, 8, 11); ctx.fillRect(p.w - 8, 0, 8, 11);
      ctx.restore();
    } else if (p.type === 'crane_hook') {
      // Detailed Tower-Crane Pulley Block, Forged Hook & Strapped Steel Girder Load
      ctx.save();
      ctx.translate(px, py);
      // Yellow/black striped pulley sheave block above girder
      ctx.fillStyle = '#eab308'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
      ctx.fillRect(p.w / 2 - 14, -22, 28, 18); ctx.strokeRect(p.w / 2 - 14, -22, 28, 18);
      ctx.fillStyle = '#0f172a'; ctx.fillRect(p.w / 2 - 10, -18, 8, 10); ctx.fillRect(p.w / 2 + 2, -18, 8, 10);
      // Lifting chains to load
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(p.w / 2, -4); ctx.lineTo(20, 0); ctx.moveTo(p.w / 2, -4); ctx.lineTo(p.w - 20, 0); ctx.stroke();
      // Heavy hazard-striped steel girder load
      ctx.fillStyle = '#eab308'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.8;
      ctx.fillRect(0, 0, p.w, p.h); ctx.strokeRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#0f172a';
      for (let hx = 10; hx < p.w - 14; hx += 22) ctx.fillRect(hx, 3, 10, p.h - 6);
      ctx.restore();
    } else if (p.type === 'sandbags') {
      // Detailed Piled Burlap Sandbags on Wooden Pallet
      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = '#78350f'; ctx.fillRect(0, p.h - 5, p.w, 5);
      for (let row = 0; row < 2; row++) {
        for (let bx = 4 + row * 8; bx < p.w - 22; bx += 22) {
          const bagG = ctx.createLinearGradient(bx, row * 12, bx, row * 12 + 13);
          bagG.addColorStop(0, row === 0 ? '#e09132' : '#c2741c');
          bagG.addColorStop(1, '#78350f');
          ctx.fillStyle = bagG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.roundRect(bx, row * 12, 24, 13, 5); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = 'rgba(255, 235, 200, 0.28)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(bx + 5, row * 12 + 3.5); ctx.lineTo(bx + 19, row * 12 + 3.5); ctx.stroke();
        }
      }
      ctx.restore();
    } else if (p.type === 'welding_spark') {
      // Detailed Welding Conduit & Molten Arc Hazard
      ctx.save();
      ctx.translate(px, py);
      const cycle = (time + (p.phase || 0)) % 3.2;
      const active = cycle >= 1.7 && cycle <= 2.9;
      const warn = cycle >= 1.1 && cycle < 1.7;
      ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6;
      ctx.fillRect(0, 2, p.w, 12); ctx.strokeRect(0, 2, p.w, 12);
      ctx.fillStyle = active ? '#f97316' : warn ? '#facc15' : '#475569';
      ctx.fillRect(4, 0, p.w - 8, 5);
      if (active) {
        ctx.save();
        ctx.shadowColor = '#fb923c'; ctx.shadowBlur = 14;
        ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let sx = 6; sx < p.w - 6; sx += 14) {
          ctx.moveTo(sx, 0);
          ctx.lineTo(sx + Math.sin(time * 38 + sx) * 8, -16 - Math.abs(Math.cos(time * 29 + sx)) * 14);
        }
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    } else if (p.type === 'swing') {
      // Charming Park Wooden Swing suspended by chains from an overhead timber crossbar
      const topY = (p.baseY || p.y) - 118;
      const swayOffset = p.x - (p.baseX || p.x);
      const topCenterX = px - swayOffset + p.w / 2;
      ctx.save();
      // Fixed overhead timber crossbar & wrought-iron brackets
      ctx.fillStyle = '#4a2a14';
      ctx.strokeStyle = '#241206';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(topCenterX - p.w * 0.56, topY - 12, p.w * 1.12, 12, 4);
      ctx.fill(); ctx.stroke();
      // Cozy leafy vine accents on crossbar
      ctx.fillStyle = '#2d6a4f';
      ctx.beginPath();
      ctx.arc(topCenterX - p.w * 0.42, topY - 10, 7, 0, Math.PI * 2);
      ctx.arc(topCenterX + p.w * 0.42, topY - 10, 7, 0, Math.PI * 2);
      ctx.fill();
      // Angled steel swing chains from fixed top hooks to moving oak seat
      const leftHookX = topCenterX - p.w * 0.38;
      const rightHookX = topCenterX + p.w * 0.38;
      const leftSeatX = px + 14;
      const rightSeatX = px + p.w - 14;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(leftHookX, topY); ctx.lineTo(leftSeatX, py + 2);
      ctx.moveTo(rightHookX, topY); ctx.lineTo(rightSeatX, py + 2);
      ctx.stroke();
      // Chain link beads
      ctx.fillStyle = '#cbd5e1';
      for (let t = 0.15; t <= 0.85; t += 0.175) {
        ctx.beginPath();
        ctx.arc(leftHookX + (leftSeatX - leftHookX) * t, topY + (py + 2 - topY) * t, 2, 0, Math.PI * 2);
        ctx.arc(rightHookX + (rightSeatX - rightHookX) * t, topY + (py + 2 - topY) * t, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Carved oak wooden swing seat with brass eyelets
      const seatG = ctx.createLinearGradient(px, py, px, py + p.h);
      seatG.addColorStop(0, '#a36738');
      seatG.addColorStop(1, '#5c3417');
      ctx.fillStyle = seatG;
      ctx.strokeStyle = '#241206';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(px, py, p.w, p.h, 5);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255, 224, 175, 0.28)';
      ctx.fillRect(px + 4, py + 2, p.w - 8, 2.5);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(leftSeatX, py + 3, 3, 0, Math.PI * 2); ctx.arc(rightSeatX, py + 3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (p.type === 'secret' && nv) {
      ctx.fillStyle = 'rgba(74, 242, 161, 0.28)';
      ctx.strokeStyle = '#4af2a1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(px, py, p.w, p.h, 6);
      ctx.fill();
      ctx.stroke();
    }
    if (p.moving && p.type !== 'boat' && p.type !== 'rail_cart' && p.type !== 'swing') {
      ctx.save();
      const isSteel = p.type === 'girder' || p.type === 'gondola' || p.type === 'crane_hook';
      ctx.strokeStyle = isSteel ? 'rgba(203, 213, 225, 0.72)' : 'rgba(180, 195, 215, 0.42)';
      ctx.lineWidth = isSteel ? 2.6 : 1.8;
      for (const rx of [px + 14, px + p.w - 14]) {
        ctx.beginPath();
        ctx.moveTo(rx, isSteel && p.type === 'gondola' ? py - 18 : py);
        ctx.lineTo(rx, 0);
        ctx.stroke();
        ctx.fillStyle = isSteel ? '#94a3b8' : '#ffd166';
        ctx.strokeStyle = isSteel ? '#0f172a' : '#5c3c0a';
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(rx, py + 2, isSteel ? 4 : 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = isSteel ? 'rgba(203, 213, 225, 0.72)' : 'rgba(180, 195, 215, 0.42)';
        ctx.lineWidth = isSteel ? 2.6 : 1.8;
      }
      ctx.restore();
    }
  }

  // Stage 8 Enemy: Huge Muscular Black & Rust-Tan Guard Doberman Pinscher
  function drawDoberman(ctx, dog, dx, dy, nv, time) {
    // Detection sight cone
    ctx.save();
    ctx.fillStyle =
      dog.state === 'alert'
        ? 'rgba(255, 50, 75, 0.26)'
        : nv
        ? 'rgba(255, 211, 110, 0.18)'
        : 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.moveTo(dx + dog.w / 2, dy + 16);
    ctx.lineTo(dx + dog.w / 2 + dog.facing * 240, dy - 42);
    ctx.lineTo(dx + dog.w / 2 + dog.facing * 240, dy + 50);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(dx + dog.w / 2, dy + dog.h);
    ctx.scale(dog.facing * 1.24, 1.24);
    const isAlert = dog.state === 'alert';
    const pace = isAlert ? 20 : 12;
    const phase = time * pace + dog.x * 0.05;
    const bob = Math.abs(Math.sin(phase)) * 2;

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.ellipse(0, 0, 29, 5, 0, 0, Math.PI * 2); ctx.fill();

    // Docked upright Doberman tail
    ctx.strokeStyle = '#090d16'; ctx.lineWidth = 4.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-22, -23 - bob); ctx.lineTo(-27, -29 - bob); ctx.stroke();

    // Sleek muscular legs with rust-tan lower leg markings
    const drawDobLeg = (lx, phaseOff, dark) => {
      const sw = Math.sin(phase + phaseOff) * (isAlert ? 8 : 5);
      ctx.strokeStyle = dark ? '#05070c' : '#0f172a';
      ctx.lineWidth = 5.2;
      ctx.beginPath(); ctx.moveTo(lx, -16 - bob); ctx.lineTo(lx + sw * 0.5, -8); ctx.lineTo(lx + sw, -2); ctx.stroke();
      ctx.strokeStyle = dark ? '#7c3f1d' : '#c26a32';
      ctx.lineWidth = 3.6;
      ctx.beginPath(); ctx.moveTo(lx + sw * 0.5, -8); ctx.lineTo(lx + sw, -2); ctx.stroke();
      ctx.fillStyle = '#c26a32';
      ctx.beginPath(); ctx.ellipse(lx + sw + 2, -1.5, 4, 2, 0, 0, Math.PI * 2); ctx.fill();
    };
    drawDobLeg(-16, Math.PI, true);
    drawDobLeg(12, 0.2, true);

    // Deep muscular obsidian-black Doberman torso & broad chest
    const coatG = ctx.createLinearGradient(0, -36 - bob, 0, -10 - bob);
    coatG.addColorStop(0, '#1e2533');
    coatG.addColorStop(0.45, '#0b0f18');
    coatG.addColorStop(1, '#05070b');
    ctx.fillStyle = coatG;
    ctx.strokeStyle = '#020408'; ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-24, -22 - bob);
    ctx.quadraticCurveTo(-10, -34 - bob, 6, -32 - bob);
    ctx.quadraticCurveTo(22, -32 - bob, 23, -19 - bob);
    ctx.quadraticCurveTo(18, -10 - bob, 6, -12 - bob);
    ctx.quadraticCurveTo(-12, -16 - bob, -24, -17 - bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Rust-tan chest patch
    ctx.fillStyle = '#c26a32';
    ctx.beginPath(); ctx.ellipse(17, -19 - bob, 5.5, 7.5, -0.25, 0, Math.PI * 2); ctx.fill();

    drawDobLeg(-14, 0, false);
    drawDobLeg(14, Math.PI + 0.2, false);

    // Spiked leather & steel guard collar
    ctx.strokeStyle = '#7f1d1d'; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(12, -31 - bob); ctx.lineTo(22, -23 - bob); ctx.stroke();
    ctx.fillStyle = '#e2e8f0';
    for (const [sx, sy] of [[14, -30], [18, -27], [21, -24]]) {
      ctx.beginPath(); ctx.moveTo(sx, sy - bob); ctx.lineTo(sx + 3, sy - 3 - bob); ctx.lineTo(sx + 3, sy + 1 - bob); ctx.closePath(); ctx.fill();
    }

    // Sleek sculpted Doberman head, tall pointed cropped ears, rust muzzle & fierce eyes
    ctx.save();
    ctx.translate(21, -30 - bob);
    // Tall cropped ears
    ctx.fillStyle = '#090d16'; ctx.strokeStyle = '#020408'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-3, -4); ctx.lineTo(-5, -17); ctx.lineTo(1, -6); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1, -5); ctx.lineTo(2, -18); ctx.lineTo(6, -5); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Cranium & long squared muzzle
    ctx.beginPath();
    ctx.moveTo(-6, 4); ctx.quadraticCurveTo(-6, -8, 4, -7);
    ctx.lineTo(18, -3); ctx.lineTo(18, 3); ctx.lineTo(4, 5); ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Rust-tan muzzle & eyebrow dot
    ctx.fillStyle = '#c26a32';
    ctx.fillRect(6, -2, 11, 5);
    ctx.beginPath(); ctx.arc(3, -5, 1.8, 0, Math.PI * 2); ctx.fill();
    // Fierce glowing eye & black nose
    ctx.fillStyle = isAlert ? '#ef4444' : '#f59e0b';
    ctx.beginPath(); ctx.arc(4, -3, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#020408';
    ctx.beginPath(); ctx.arc(18, -2, 2.2, 0, Math.PI * 2); ctx.fill();
    if (isAlert) {
      // Snarling fangs
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(12, 3); ctx.lineTo(13.5, 6.5); ctx.lineTo(15, 3); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    ctx.restore();
  }

  function drawDog(ctx, dog, dx, dy, nv, time) {
    if (dog.variant === 'doberman') return drawDoberman(ctx, dog, dx, dy, nv, time);
    ctx.save();
    ctx.fillStyle =
      dog.state === 'alert'
        ? 'rgba(255, 80, 100, 0.22)'
        : nv
        ? 'rgba(255, 211, 110, 0.18)'
        : 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.moveTo(dx + dog.w / 2, dy + 14);
    ctx.lineTo(dx + dog.w / 2 + dog.facing * 205, dy - 36);
    ctx.lineTo(dx + dog.w / 2 + dog.facing * 205, dy + 44);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(dx + dog.w / 2, dy + dog.h);
    ctx.scale(dog.facing, 1);

    const isAlert = dog.state === 'alert';
    const isDistracted = dog.state === 'distracted';
    const outline = '#1f120b';
    const speed = isAlert ? 22 : 9;
    const stride = Math.sin(time * speed);
    const bob = Math.abs(stride) * (isAlert ? 3.2 : 1.4);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 28, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    function drawLeg(hipX, hipY, phase, fillCol, isBackLeg) {
      const theta = time * speed + phase;
      const swing = Math.sin(theta) * (isAlert ? 9 : 6);
      const lift = Math.max(0, Math.cos(theta)) * (isAlert ? 5.5 : 3.0);
      const jointBend = isBackLeg ? -3.5 : 2.2;
      const kneeX = hipX + swing * 0.45 + jointBend;
      const kneeY = hipY + 7.5 - lift * 0.5;
      const pawX = hipX + swing;
      const pawY = -2 - lift;

      ctx.strokeStyle = outline;
      ctx.lineWidth = 7.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(kneeX, kneeY);
      ctx.lineTo(pawX, pawY);
      ctx.stroke();

      ctx.strokeStyle = fillCol;
      ctx.lineWidth = 4.8;
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(kneeX, kneeY);
      ctx.lineTo(pawX, pawY);
      ctx.stroke();

      ctx.fillStyle = '#d9b58c';
      ctx.strokeStyle = outline;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(pawX + 2, pawY + 1, 4.2, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    const farLegColor = isAlert ? '#70281c' : '#573927';
    const nearLegColor = isAlert ? '#a14430' : '#85583c';

    drawLeg(-16, -15 - bob, Math.PI, farLegColor, true);
    drawLeg(11, -15 - bob, 0.3, farLegColor, false);

    ctx.save();
    ctx.translate(-22, -26 - bob);
    ctx.rotate(isAlert ? -0.35 + Math.sin(time * 24) * 0.16 : Math.sin(time * 6) * 0.22);
    ctx.fillStyle = isAlert ? '#7a3122' : '#5e3f2b';
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-12, -4, -18, -16);
    ctx.quadraticCurveTo(-11, -18, -4, -7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    const coatGrad = ctx.createLinearGradient(-24, -36 - bob, 16, -12 - bob);
    coatGrad.addColorStop(0, isAlert ? '#ab4935' : '#966544');
    coatGrad.addColorStop(0.6, isAlert ? '#8c3726' : '#7a4f34');
    coatGrad.addColorStop(1, isAlert ? '#662418' : '#523422');

    ctx.fillStyle = coatGrad;
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-23, -22 - bob);
    ctx.bezierCurveTo(-22, -33 - bob, -8, -33 - bob, 4, -31 - bob);
    ctx.bezierCurveTo(10, -34 - bob, 13, -39 - bob, 16, -40 - bob);
    ctx.lineTo(22, -24 - bob);
    ctx.bezierCurveTo(21, -13 - bob, 12, -10 - bob, 4, -12 - bob);
    ctx.bezierCurveTo(-4, -14 - bob, -12, -15 - bob, -20, -14 - bob);
    ctx.quadraticCurveTo(-25, -15 - bob, -23, -22 - bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(30, 18, 12, 0.48)';
    ctx.beginPath();
    ctx.ellipse(-6, -28 - bob, 13, 5.2, 0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#dbb48a';
    ctx.beginPath();
    ctx.ellipse(14, -19 - bob, 5.5, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();

    drawLeg(-14, -15 - bob, 0, nearLegColor, true);
    drawLeg(13, -15 - bob, Math.PI + 0.3, nearLegColor, false);

    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(11, -33 - bob);
    ctx.lineTo(20, -24 - bob);
    ctx.stroke();
    ctx.fillStyle = '#ffd36e';
    ctx.beginPath();
    ctx.arc(19, -22 - bob, 2.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(18, -33 - bob);

    ctx.fillStyle = '#3d2518';
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(4, -21);
    ctx.lineTo(9, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isAlert ? '#a64532' : '#8f5f40';
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.moveTo(-9, 3);
    ctx.bezierCurveTo(-11, -9, -1, -13, 6, -9);
    ctx.lineTo(10, -4);
    ctx.lineTo(21, -3);
    ctx.quadraticCurveTo(24, 0, 21, 3.5);
    ctx.lineTo(7, 4.5);
    ctx.quadraticCurveTo(1, 9, -9, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#d9b186';
    ctx.beginPath();
    ctx.ellipse(12, 1, 7.5, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isAlert) {
      ctx.fillStyle = '#2e0b0b';
      ctx.beginPath();
      ctx.moveTo(7, 3.5);
      ctx.lineTo(20, 4);
      ctx.lineTo(17, 9);
      ctx.lineTo(7, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(15, 3.8);
      ctx.lineTo(16.5, 7);
      ctx.lineTo(18, 3.8);
      ctx.moveTo(10, 3.8);
      ctx.lineTo(11.2, 6.2);
      ctx.lineTo(12.4, 3.8);
      ctx.fill();
    }

    ctx.fillStyle = '#120f0e';
    ctx.beginPath();
    ctx.ellipse(21.5, -1.5, 3, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.arc(20.8, -2.2, 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4f301e';
    ctx.beginPath();
    ctx.moveTo(-6, -6);
    ctx.lineTo(-3, -21);
    ctx.lineTo(4, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(4.5, -4, 3.2, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isAlert ? '#ff3838' : '#26170d';
    ctx.beginPath();
    ctx.arc(5.3, -4, 1.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    if (isAlert) {
      ctx.moveTo(1, -8);
      ctx.lineTo(8.5, -5.5);
    } else if (isDistracted) {
      ctx.moveTo(1, -7.5);
      ctx.lineTo(8.5, -9.5);
    } else {
      ctx.moveTo(1.5, -7.5);
      ctx.lineTo(8, -7.5);
    }
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }

  function drawPuddle(ctx, px, py, w, h, time, isOcean) {
    ctx.save();
    if (isOcean) {
      const oceanGrad = ctx.createLinearGradient(px, py, px, py + 84);
      oceanGrad.addColorStop(0, '#0f4c75');
      oceanGrad.addColorStop(0.5, '#092e4a');
      oceanGrad.addColorStop(1, '#041626');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(px, py + 2, w, 84);

      ctx.fillStyle = '#1b6ca8';
      ctx.beginPath();
      ctx.moveTo(px, py + 12);
      for (let x = 0; x <= w; x += 20) {
        const wy = py + 2 + Math.sin(x * 0.045 + time * 3.2) * 3.5;
        ctx.lineTo(px + x, wy);
      }
      ctx.lineTo(px + w, py + 18);
      ctx.lineTo(px, py + 18);
      ctx.closePath(); ctx.fill();

      ctx.strokeStyle = 'rgba(215, 245, 255, 0.65)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 20) {
        const wy = py + 2 + Math.sin(x * 0.045 + time * 3.2) * 3.5;
        if (x === 0) ctx.moveTo(px + x, wy); else ctx.lineTo(px + x, wy);
      }
      ctx.stroke();
      ctx.restore();
      return;
    }

    ctx.fillStyle = '#10141f';
    ctx.beginPath();
    ctx.roundRect(px - 2, py - 2, w + 4, h + 4, 6);
    ctx.fill();

    const waterGrad = ctx.createLinearGradient(px, py, px, py + h);
    waterGrad.addColorStop(0, '#186c9e');
    waterGrad.addColorStop(1, '#0c3754');
    ctx.fillStyle = waterGrad;
    ctx.beginPath();
    ctx.roundRect(px, py, w, h, 4);
    ctx.fill();

    ctx.strokeStyle = 'rgba(135, 236, 255, 0.72)';
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 3; i++) {
      const rx = px + 22 + i * (w / 3.2);
      const ry = py + 7 + (i % 2) * 5;
      const rad = 6 + ((time * 18 + i * 9) % 16);
      ctx.globalAlpha = Math.max(0, 1 - rad / 22);
      ctx.beginPath();
      ctx.ellipse(rx, ry, rad, rad * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawCheckpoint(ctx, cp, cx, cy, time) {
    ctx.save();
    const active = cp.activated;
    const baseY = cy + 32;

    // Ground ambient shadow under the cat house
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cx + 22, baseY + 1, 30, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3D Right side wall (shaded warm timber)
    ctx.fillStyle = '#4f2d18';
    ctx.strokeStyle = '#241207';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cx + 36, baseY - 26);
    ctx.lineTo(cx + 46, baseY - 30);
    ctx.lineTo(cx + 46, baseY - 4);
    ctx.lineTo(cx + 36, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Front wooden facade with horizontal plank seams
    const wallGrad = ctx.createLinearGradient(cx, baseY - 30, cx, baseY);
    wallGrad.addColorStop(0, '#9a6138');
    wallGrad.addColorStop(1, '#734424');
    ctx.fillStyle = wallGrad;
    ctx.beginPath();
    ctx.moveTo(cx + 2, baseY - 26);
    ctx.lineTo(cx + 19, baseY - 38);
    ctx.lineTo(cx + 36, baseY - 26);
    ctx.lineTo(cx + 36, baseY);
    ctx.lineTo(cx + 2, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Subtle horizontal wood plank lines
    ctx.strokeStyle = 'rgba(36, 18, 7, 0.35)';
    ctx.lineWidth = 1;
    for (const py of [baseY - 8, baseY - 16, baseY - 24]) {
      ctx.beginPath();
      ctx.moveTo(cx + 3, py);
      ctx.lineTo(cx + 35, py);
      ctx.stroke();
    }

    // Arched cozy cat doorway
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx + 11, baseY);
    ctx.lineTo(cx + 11, baseY - 12);
    ctx.arc(cx + 19, baseY - 12, 8, Math.PI, 0);
    ctx.lineTo(cx + 27, baseY);
    ctx.closePath();

    if (active) {
      const innerGlow = ctx.createRadialGradient(cx + 19, baseY - 10, 2, cx + 19, baseY - 10, 14);
      innerGlow.addColorStop(0, '#ffe49e');
      innerGlow.addColorStop(0.65, '#e88b38');
      innerGlow.addColorStop(1, '#6e3214');
      ctx.fillStyle = innerGlow;
    } else {
      ctx.fillStyle = '#1b100b';
    }
    ctx.fill();
    ctx.strokeStyle = '#3b2010';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Cozy cushion visible inside doorway
    ctx.fillStyle = active ? '#ff6b8b' : '#634358';
    ctx.beginPath();
    ctx.ellipse(cx + 19, baseY - 2, 6.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Warm light spilling out on threshold when activated
    if (active) {
      const spill = ctx.createRadialGradient(cx + 19, baseY + 1, 2, cx + 19, baseY + 1, 22);
      spill.addColorStop(0, 'rgba(255, 215, 130, 0.38)');
      spill.addColorStop(1, 'rgba(255, 215, 130, 0)');
      ctx.fillStyle = spill;
      ctx.beginPath();
      ctx.ellipse(cx + 19, baseY + 1, 22, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tiny round attic window / gold cat badge above doorway
    ctx.fillStyle = active ? '#ffe89e' : '#2e2226';
    ctx.strokeStyle = '#3b2010';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx + 19, baseY - 27, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cute pointed Cat Ears on the roof ridge
    for (const side of [-1, 1]) {
      const ex = cx + 19 + side * 8.5;
      const ey = baseY - 34;
      ctx.fillStyle = '#5a311b';
      ctx.strokeStyle = '#241207';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ex - side * 4.5, ey + 2);
      ctx.lineTo(ex + side * 1, ey - 8);
      ctx.lineTo(ex + side * 4.5, ey + 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner ear warm pink-amber
      ctx.fillStyle = '#cf7f69';
      ctx.beginPath();
      ctx.moveTo(ex - side * 2.2, ey + 2);
      ctx.lineTo(ex + side * 0.8, ey - 5);
      ctx.lineTo(ex + side * 2.8, ey + 3.5);
      ctx.closePath();
      ctx.fill();
    }

    // Sloped shingled roof (front eaves + 3D side roof slope)
    ctx.fillStyle = '#3b2012';
    ctx.strokeStyle = '#1d0e06';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cx + 19, baseY - 40);
    ctx.lineTo(cx + 30, baseY - 43);
    ctx.lineTo(cx + 49, baseY - 29);
    ctx.lineTo(cx + 38, baseY - 25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#5c331d';
    ctx.lineWidth = 3.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 2, baseY - 24);
    ctx.lineTo(cx + 19, baseY - 40);
    ctx.lineTo(cx + 39, baseY - 24);
    ctx.stroke();

    ctx.strokeStyle = '#854e2e';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx - 1, baseY - 25.5);
    ctx.lineTo(cx + 19, baseY - 41);
    ctx.lineTo(cx + 38, baseY - 25.5);
    ctx.stroke();

    // Wrought-iron bracket & gently swinging hanging lantern on right eave
    const swing = Math.sin(time * 2.4 + cx) * 1.4;
    ctx.strokeStyle = '#1b202e';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx + 43, baseY - 28);
    ctx.lineTo(cx + 50, baseY - 28);
    ctx.lineTo(cx + 50 + swing * 0.4, baseY - 22);
    ctx.stroke();

    const lx = cx + 50 + swing;
    const ly = baseY - 19;
    if (active) {
      const lGlow = ctx.createRadialGradient(lx, ly, 2, lx, ly, 24);
      lGlow.addColorStop(0, 'rgba(255, 225, 130, 0.72)');
      lGlow.addColorStop(1, 'rgba(255, 225, 130, 0)');
      ctx.fillStyle = lGlow;
      ctx.beginPath();
      ctx.arc(lx, ly, 24, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#1b202e';
    ctx.fillRect(lx - 3.5, ly - 4, 7, 2);
    ctx.fillStyle = active ? '#ffe899' : '#4a566e';
    ctx.strokeStyle = '#1b202e';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(lx - 3, ly - 2, 6, 7, 1.5);
    ctx.fill();
    ctx.stroke();

    // Floating vector Cat Paw Print emblem above the roof (replaces emoji)
    const pawX = cx + 19;
    const pawY = baseY - 54 + Math.sin(time * 3.2) * 2.2;
    ctx.save();
    ctx.translate(pawX, pawY);
    if (active) {
      ctx.shadowColor = '#ffd36e';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffd36e';
      ctx.strokeStyle = '#6b3e08';
    } else {
      ctx.fillStyle = 'rgba(255, 224, 155, 0.48)';
      ctx.strokeStyle = 'rgba(40, 24, 14, 0.7)';
    }
    ctx.lineWidth = 1.2;

    // Main paw pad
    ctx.beginPath();
    ctx.ellipse(0, 2, 5.2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Four toe beans
    const toes = [
      { x: -5.2, y: -2.2, r: 1.9 },
      { x: -1.9, y: -4.4, r: 2.0 },
      { x: 1.9, y: -4.4, r: 2.0 },
      { x: 5.2, y: -2.2, r: 1.9 },
    ];
    for (const t of toes) {
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Tiny twinkling sparkles when activated
    if (active) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff6cc';
      for (let s = 0; s < 3; s++) {
        const ang = time * 2.5 + s * ((Math.PI * 2) / 3);
        const sx = Math.cos(ang) * 11;
        const sy = Math.sin(ang) * 6 - 1;
        ctx.fillRect(sx - 1, sy - 1, 2, 2);
      }
    }
    ctx.restore();

    ctx.restore();
  }

  function drawMarketFestoonLanterns(ctx, camX, w, time) {
    ctx.save();
    const span = 260;
    const startIdx = Math.floor((camX - 100) / span);
    const endIdx = Math.ceil((camX + w + 100) / span);
    const colors = ['#ff6b6b', '#ffd166', '#4ecdc4', '#ff9f43'];
    for (let i = startIdx; i <= endIdx; i++) {
      const x0 = i * span - camX;
      const x1 = (i + 1) * span - camX;
      const y0 = 76 + (i % 2) * 18;
      const y1 = 76 + ((i + 1) % 2) * 18;
      ctx.strokeStyle = 'rgba(30, 34, 48, 0.75)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo((x0 + x1) / 2, Math.max(y0, y1) + 28, x1, y1);
      ctx.stroke();
      for (let k = 1; k <= 4; k++) {
        const t = k / 5;
        const lx = (1 - t) * x0 + t * x1;
        const ly = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (Math.max(y0, y1) + 28) + t * t * y1;
        const col = colors[(Math.abs(i) + k) % colors.length];
        const pulse = 0.72 + 0.28 * Math.sin(time * 2.5 + i + k);
        ctx.fillStyle = col;
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(lx, ly + 4, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.14 * pulse;
        ctx.beginPath();
        ctx.arc(lx, ly + 4, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
  }

  function drawMarketGate(ctx, g, gx, gy, time, label) {
    ctx.save();
    const gateGlow = ctx.createRadialGradient(gx + g.w / 2, gy + g.h / 2, 10, gx + g.w / 2, gy + g.h / 2, 110);
    gateGlow.addColorStop(0, 'rgba(255, 211, 110, 0.42)');
    gateGlow.addColorStop(1, 'rgba(255, 211, 110, 0)');
    ctx.fillStyle = gateGlow;
    ctx.fillRect(gx - 50, gy - 50, g.w + 100, g.h + 100);

    ctx.fillStyle = 'rgba(255, 200, 90, 0.22)';
    ctx.strokeStyle = '#ffd36e';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(gx, gy, g.w, g.h, [36, 36, 0, 0]);
    ctx.fill();
    ctx.stroke();

    const swing = Math.sin(time * 2.5) * 3;
    ctx.strokeStyle = '#ffd36e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(gx + g.w / 2, gy + 4);
    ctx.lineTo(gx + g.w / 2 + swing, gy + 18);
    ctx.stroke();
    ctx.fillStyle = '#ffe699';
    ctx.beginPath();
    ctx.arc(gx + g.w / 2 + swing, gy + 22, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd36e';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label || 'بوابة السوق ←', gx + g.w / 2, gy - 12);
    ctx.restore();
  }

  // New Enemy #1: Nocturnal Spiky Hedgehog (القنفذ الشوكي)
  function drawHedgehog(ctx, hog, hx, hy, time) {
    ctx.save();
    ctx.translate(hx + hog.w / 2, hy + hog.h);
    ctx.scale(hog.facing, 1);

    const scurry = Math.abs(Math.sin(time * 14 + hog.x)) * 1.5;
    // Ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath(); ctx.ellipse(0, 0, 18, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Tiny scurrying paws
    ctx.fillStyle = '#5c4033';
    const pOff = Math.sin(time * 16) * 3;
    ctx.beginPath(); ctx.arc(-8 + pOff, -2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(7 - pOff, -2, 3, 0, Math.PI * 2); ctx.fill();

    // Spiky quill shell
    ctx.fillStyle = '#2d2424';
    ctx.strokeStyle = '#140e0e';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(-2, -6 - scurry, 16, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sharp protruding quills
    ctx.strokeStyle = '#d4c3a3';
    ctx.lineWidth = 1.6;
    for (let a = Math.PI + 0.25; a < Math.PI * 2 - 0.15; a += 0.32) {
      ctx.beginPath();
      ctx.moveTo(-2 + Math.cos(a) * 12, -6 - scurry + Math.sin(a) * 12);
      ctx.lineTo(-2 + Math.cos(a) * 19, -6 - scurry + Math.sin(a) * 19);
      ctx.stroke();
    }

    // Tan face & twitching pink nose
    ctx.fillStyle = '#d9b38c';
    ctx.beginPath();
    ctx.moveTo(6, -12 - scurry);
    ctx.quadraticCurveTo(18, -9 - scurry, 17, -4 - scurry);
    ctx.lineTo(5, -4 - scurry);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(11, -8 - scurry, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff758f';
    ctx.beginPath(); ctx.arc(17.5, -5.5 - scurry, 2, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }

  // New Enemy #2: Detailed Iridescent Night Crow (الغراب الليلي)
  function drawCrow(ctx, crow, cx, cy, time) {
    ctx.save();
    ctx.translate(cx + crow.w / 2, cy + crow.h / 2);
    ctx.scale(crow.facing, 1);

    const wingPhase = time * 13 + crow.x * 0.04;
    const flap = Math.sin(wingPhase);
    const farFlap = Math.sin(wingPhase - 0.35);

    // 1. Far wing (behind body for 3D depth)
    ctx.save();
    ctx.translate(-1, -1);
    ctx.fillStyle = '#0c101a';
    ctx.strokeStyle = '#05070c';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-2, -1);
    ctx.quadraticCurveTo(4, -14 - farFlap * 14, -14, -11 - farFlap * 15);
    ctx.lineTo(-10, -1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 2. Fanned layered tail feathers
    for (let t = -1; t <= 1; t++) {
      ctx.fillStyle = t === 0 ? '#1c2438' : '#111624';
      ctx.strokeStyle = '#07090f';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(-11, 2);
      ctx.lineTo(-27, -3 + t * 4.5);
      ctx.lineTo(-25, 1 + t * 4.5);
      ctx.lineTo(-12, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // 3. Tucked dark claws under belly
    ctx.strokeStyle = '#3b4252';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-4, 8);
    ctx.lineTo(-9, 12);
    ctx.lineTo(-12, 11);
    ctx.moveTo(-1, 8);
    ctx.lineTo(-6, 13);
    ctx.stroke();

    // 4. Sleek raven body with iridescent midnight-blue sheen
    const bodyGrad = ctx.createLinearGradient(-14, -8, 14, 10);
    bodyGrad.addColorStop(0, '#2e3c5c');
    bodyGrad.addColorStop(0.55, '#151b2b');
    bodyGrad.addColorStop(1, '#090c14');
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#05070c';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, 2, 15, 7.8, -0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Subtle breast feather highlight
    ctx.strokeStyle = 'rgba(130, 165, 225, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(4, 3, 7, 0.4, 1.8);
    ctx.stroke();

    // 5. Sculpted head, neck ruff & sharp hooked beak
    ctx.fillStyle = '#192133';
    ctx.strokeStyle = '#05070c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(12.5, -3.5, 6.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Upper & lower hooked obsidian beak
    ctx.fillStyle = '#475269';
    ctx.beginPath();
    ctx.moveTo(17.5, -6.5);
    ctx.quadraticCurveTo(25, -5.5, 28, -1.5);
    ctx.lineTo(17.5, -1.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#2d3445';
    ctx.beginPath();
    ctx.moveTo(17.5, -1.5);
    ctx.lineTo(25.5, -1.5);
    ctx.lineTo(17.5, 1.2);
    ctx.closePath();
    ctx.fill();

    // Piercing glowing crimson-amber eye with catchlight
    ctx.fillStyle = '#ff4d4d';
    ctx.beginPath();
    ctx.arc(14.5, -4.5, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(14.8, -4.5, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(14.1, -5.1, 0.65, 0, Math.PI * 2);
    ctx.fill();

    // 6. Near articulated wing with fanned primary flight feathers
    const wTipY = -14 - flap * 16;
    const wingGrad = ctx.createLinearGradient(-16, wTipY, 4, 4);
    wingGrad.addColorStop(0, '#324266');
    wingGrad.addColorStop(0.5, '#1a2236');
    wingGrad.addColorStop(1, '#0d111c');
    ctx.fillStyle = wingGrad;
    ctx.strokeStyle = '#05070c';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(4, -1);
    ctx.quadraticCurveTo(2, wTipY * 0.75, -16, wTipY);
    // 4 scalloped flight feather tips
    ctx.lineTo(-19, wTipY + 5);
    ctx.lineTo(-14, wTipY + 7);
    ctx.lineTo(-16, wTipY + 11);
    ctx.lineTo(-10, wTipY + 11);
    ctx.lineTo(-11, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Feather sheen lines
    ctx.strokeStyle = 'rgba(130, 170, 235, 0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-2, -1);
    ctx.lineTo(-13, wTipY + 3);
    ctx.moveTo(-5, 0);
    ctx.lineTo(-13, wTipY + 8);
    ctx.stroke();

    ctx.restore();
  }

  // Harbor Enemy #1: Detailed Armored Harbor Crab (سرطان البحر)
  function drawCrab(ctx, crab, cx, cy, time) {
    ctx.save();
    ctx.translate(cx + crab.w / 2, cy + crab.h);
    const scuttle = Math.sin(time * 16 + crab.x) * 1.4;

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.42)';
    ctx.beginPath(); ctx.ellipse(0, 0, 23, 4.5, 0, 0, Math.PI * 2); ctx.fill();

    // 8 Articulated walking legs (4 pairs) with two-segment joints
    for (const side of [-1, 1]) {
      for (let l = 0; l < 4; l++) {
        const phase = time * 18 + l * 1.35 + (side > 0 ? 0 : Math.PI * 0.5);
        const stepY = Math.max(0, Math.sin(phase)) * 3.8;
        const stepX = Math.cos(phase) * 2.2;
        const rootX = side * (9 + l * 1.6);
        const rootY = -7 - (3 - l) * 0.6 + scuttle * 0.25;
        const kneeX = side * (16 + l * 2.6) + stepX * 0.5;
        const kneeY = -13 + l * 1.1 - stepY * 0.7;
        const footX = side * (19 + l * 3.1) + stepX;
        const footY = -1 - stepY;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#4a0b0b';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        ctx.strokeStyle = '#d62828';
        ctx.lineWidth = 1.7;
        ctx.stroke();
      }
    }

    // Jointed cheliped arms & two-jawed snapping pincer claws
    const snap = Math.abs(Math.sin(time * 5.2 + crab.x * 0.1)) * 0.42;
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(side * 12, -13 + scuttle * 0.35);

      // Arm segments (merus + carpus)
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#4a0b0b';
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(0, 1);
      ctx.lineTo(side * 5, -4);
      ctx.lineTo(side * 7, -10);
      ctx.stroke();
      ctx.strokeStyle = '#e63946';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // Pincer palm + lower fixed finger + upper movable dactylus
      ctx.translate(side * 7, -10);
      ctx.scale(side, 1);

      // Lower fixed jaw & palm
      ctx.fillStyle = '#e63946';
      ctx.strokeStyle = '#42090b';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-2, 2);
      ctx.quadraticCurveTo(3, 5, 9, 1);
      ctx.quadraticCurveTo(11, -1, 8, -2.5);
      ctx.lineTo(2, -1.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Upper movable pincer jaw (opens & snaps)
      ctx.save();
      ctx.translate(2, -2);
      ctx.rotate(-0.18 - snap);
      ctx.fillStyle = '#ff6b4a';
      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.quadraticCurveTo(3, -5, 8, -1.5);
      ctx.quadraticCurveTo(5, 1, -1, 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    }

    // Serrated hexagonal carapace shell
    const sy = -11 + scuttle * 0.3;
    const shellGrad = ctx.createRadialGradient(-3, sy - 4, 2, 0, sy, 18);
    shellGrad.addColorStop(0, '#ff8c42');
    shellGrad.addColorStop(0.5, '#e63946');
    shellGrad.addColorStop(1, '#7f1116');
    ctx.fillStyle = shellGrad;
    ctx.strokeStyle = '#3b0709';
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.moveTo(-13, sy - 4);
    ctx.lineTo(-17, sy - 1);
    ctx.lineTo(-15.5, sy + 2);
    ctx.lineTo(-17.5, sy + 4.5);
    ctx.lineTo(-11, sy + 8.5);
    ctx.lineTo(0, sy + 9.5);
    ctx.lineTo(11, sy + 8.5);
    ctx.lineTo(17.5, sy + 4.5);
    ctx.lineTo(15.5, sy + 2);
    ctx.lineTo(17, sy - 1);
    ctx.lineTo(13, sy - 4);
    ctx.quadraticCurveTo(0, sy - 11.5, -13, sy - 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Carapace dorsal ridge, H-groove & speckles
    ctx.strokeStyle = 'rgba(70, 8, 10, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-6, sy - 1);
    ctx.quadraticCurveTo(0, sy + 2, 6, sy - 1);
    ctx.moveTo(-3, sy + 1);
    ctx.lineTo(-4, sy + 5);
    ctx.moveTo(3, sy + 1);
    ctx.lineTo(4, sy + 5);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 225, 195, 0.38)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, sy - 1, 9, Math.PI * 1.18, Math.PI * 1.82);
    ctx.stroke();

    ctx.fillStyle = 'rgba(90, 12, 14, 0.35)';
    ctx.beginPath();
    ctx.arc(-7, sy + 3, 1.2, 0, Math.PI * 2);
    ctx.arc(7, sy + 3, 1.2, 0, Math.PI * 2);
    ctx.arc(0, sy - 4, 1.1, 0, Math.PI * 2);
    ctx.fill();

    // Tiny front antennules
    ctx.strokeStyle = '#ff9f68';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-2, sy - 8); ctx.lineTo(-3.5, sy - 11.5);
    ctx.moveTo(2, sy - 8); ctx.lineTo(3.5, sy - 11.5);
    ctx.stroke();

    // Stalked eyes
    for (const side of [-1, 1]) {
      ctx.strokeStyle = '#9e1920';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(side * 5, sy - 7);
      ctx.lineTo(side * 6.8, sy - 13.5);
      ctx.stroke();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(side * 6.8, sy - 13.8, 2.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(side * 6.2, sy - 14.5, 0.85, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  // Harbor Enemy #2: Detailed Swooping Coastal Seagull (طائر النورس)
  function drawSeagull(ctx, gull, gx, gy, time) {
    ctx.save();
    ctx.translate(gx + gull.w / 2, gy + gull.h / 2);
    ctx.scale(gull.facing, 1);
    const flap = Math.sin(time * 10.5 + gull.x * 0.04);
    const farFlap = Math.sin(time * 10.5 + gull.x * 0.04 - 0.35);

    // Far wing: long, narrow, M-bent gull silhouette with black primary tip
    const fWristY = -7 - farFlap * 11;
    const fTipY = -12 - farFlap * 16;
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(1, -2);
    ctx.lineTo(6, fWristY);
    ctx.lineTo(-14, fTipY);
    ctx.lineTo(-17, fTipY + 3.5);
    ctx.lineTo(-4, fWristY + 4.5);
    ctx.lineTo(-7, 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Black tip on far wing
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-8, fTipY * 0.8 + fWristY * 0.2);
    ctx.lineTo(-14, fTipY);
    ctx.lineTo(-17, fTipY + 3.5);
    ctx.lineTo(-10, fTipY + 5);
    ctx.closePath();
    ctx.fill();

    // Square-fanned white tail & tucked yellow webbed feet
    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-12, 1.5);
    ctx.lineTo(-27, -2.5);
    ctx.lineTo(-26.5, 4.5);
    ctx.lineTo(-12, 5.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-6, 6.5);
    ctx.lineTo(-15, 9.5);
    ctx.lineTo(-17, 8.5);
    ctx.moveTo(-15, 9.5);
    ctx.lineTo(-17, 11);
    ctx.stroke();

    // Sleek aerodynamic white body & neck
    const bodyG = ctx.createLinearGradient(0, -6, 0, 9);
    bodyG.addColorStop(0, '#ffffff');
    bodyG.addColorStop(0.65, '#f8fafc');
    bodyG.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = bodyG;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-14, 2.5);
    ctx.quadraticCurveTo(-4, -5.5, 9, -4.5);
    ctx.quadraticCurveTo(16, -3.5, 16, 1.5);
    ctx.quadraticCurveTo(13, 7.5, -2, 7.5);
    ctx.quadraticCurveTo(-11, 7, -14, 2.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pearl-grey mantle (back)
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(-12, 2);
    ctx.quadraticCurveTo(-3, -4.8, 7, -3.2);
    ctx.quadraticCurveTo(-1, 1.5, -12, 2);
    ctx.closePath();
    ctx.fill();

    // Flat-crowned elongated gull head (distinct from rounded pigeon head)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(8, -3.5);
    ctx.quadraticCurveTo(10, -8.8, 15.5, -8.5); // flat crown
    ctx.quadraticCurveTo(19.5, -8.2, 20, -4.2); // steep forehead
    ctx.quadraticCurveTo(19.5, 0.5, 14, 1);
    ctx.quadraticCurveTo(9, 1, 8, -3.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Long, straight, stout yellow gull bill with hooked tip & red gonys spot
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(19.2, -5.6);
    ctx.lineTo(31.5, -3.8); // long straight culmen
    ctx.quadraticCurveTo(33.2, -2.5, 31.8, -0.8); // hooked tip
    ctx.lineTo(28.5, -1.3); // gonys angle
    ctx.lineTo(18.8, -1.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Red gonys spot on lower mandible
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(28.5, -2.1, 1.45, 0, Math.PI * 2);
    ctx.fill();

    // Sharp gull eye with amber orbital ring
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(15.6, -5.3, 2.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(15.7, -5.3, 1.45, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(15.2, -5.8, 0.55, 0, Math.PI * 2); ctx.fill();

    // Near long, narrow, M-bent angled gull wing with black tips & white mirrors
    const nWristX = 7;
    const nWristY = -7 - flap * 12;
    const nTipX = -19;
    const nTipY = -14 - flap * 18;
    const wingGrad = ctx.createLinearGradient(0, nTipY, 0, 3);
    wingGrad.addColorStop(0, '#94a3b8');
    wingGrad.addColorStop(0.55, '#cbd5e1');
    wingGrad.addColorStop(1, '#f8fafc');
    ctx.fillStyle = wingGrad;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(3, -1);
    ctx.lineTo(nWristX, nWristY); // carpal wrist bend
    ctx.lineTo(nTipX, nTipY);     // long swept outer primary edge
    ctx.lineTo(nTipX - 2, nTipY + 4.5);
    ctx.lineTo(-2, nWristY + 5.5);
    ctx.lineTo(-9, 2.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Black primary wingtips with crisp white mirrors
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(nTipX + 8.5, nTipY + (nWristY - nTipY) * 0.32);
    ctx.lineTo(nTipX, nTipY);
    ctx.lineTo(nTipX - 2, nTipY + 4.5);
    ctx.lineTo(nTipX + 7, nTipY + 7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(nTipX + 2.2, nTipY + 2.8, 1.6, 0.9, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Harbor Enemy #3: Detailed Fast Harbor Rat (جرذ الميناء)
  function drawRat(ctx, rat, rx, ry, time) {
    ctx.save();
    ctx.translate(rx + rat.w / 2, ry + rat.h);
    ctx.scale(rat.facing, 1);
    const run = time * 22 + rat.x * 0.08;
    const bob = Math.abs(Math.sin(run)) * 1.4;

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.ellipse(0, 0, 20, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Long tapering, whipping pink-grey tail
    const tailWave = Math.sin(time * 14 + rat.x) * 3.2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#9e6868';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(-12, -7.5 - bob);
    ctx.quadraticCurveTo(-20, -12 + tailWave * 0.5, -24, -10 + tailWave * 0.6);
    ctx.stroke();
    ctx.strokeStyle = '#cfa0a0';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-23, -10 + tailWave * 0.6);
    ctx.quadraticCurveTo(-29, -7 - tailWave, -34, -9.5 + tailWave * 0.4);
    ctx.stroke();

    // Far scurrying paws
    const pOff = Math.sin(run) * 4;
    ctx.fillStyle = '#b57f7f';
    ctx.beginPath(); ctx.ellipse(-7 - pOff * 0.7, -2, 3.2, 1.8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(7 + pOff * 0.7, -2, 2.8, 1.6, 0, 0, Math.PI * 2); ctx.fill();

    // Muscular arched rodent body (S-curved spine & haunch)
    const furGrad = ctx.createLinearGradient(0, -19 - bob, 0, -2 - bob);
    furGrad.addColorStop(0, '#786e68');
    furGrad.addColorStop(0.55, '#4d4540');
    furGrad.addColorStop(1, '#2d2724');
    ctx.fillStyle = furGrad;
    ctx.strokeStyle = '#1c1715';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-14, -6 - bob);
    ctx.quadraticCurveTo(-15, -16 - bob, -5, -17.5 - bob); // hunched haunch & spine
    ctx.quadraticCurveTo(4, -18 - bob, 10, -13.5 - bob);   // shoulders & neck
    ctx.quadraticCurveTo(18, -12 - bob, 23.5, -7.5 - bob); // tapered muzzle
    ctx.quadraticCurveTo(18, -3.5 - bob, 9, -4 - bob);     // jaw & throat
    ctx.quadraticCurveTo(-2, -2.5 - bob, -14, -6 - bob);   // belly
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lighter warm-grey underbelly
    ctx.fillStyle = '#a89e95';
    ctx.beginPath();
    ctx.ellipse(0, -5 - bob, 9.5, 2.4, -0.04, 0, Math.PI * 2);
    ctx.fill();

    // Subtle fur-tuft strokes along spine
    ctx.strokeStyle = 'rgba(255, 240, 225, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-8, -15.5 - bob); ctx.lineTo(-10, -17.5 - bob);
    ctx.moveTo(-2, -16.5 - bob); ctx.lineTo(-4, -18.5 - bob);
    ctx.stroke();

    // Near scurrying hind & fore paws
    ctx.fillStyle = '#e0a9a9';
    ctx.strokeStyle = '#5c3c3c';
    ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.ellipse(-6 + pOff, -1.8, 3.6, 1.9, -0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(8 - pOff, -1.8, 3.0, 1.7, 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Rounded translucent pink-grey ear with inner fold
    ctx.fillStyle = '#8b7e76';
    ctx.strokeStyle = '#1c1715';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.ellipse(7.5, -16.5 - bob, 4.2, 4.8, -0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f4acb7';
    ctx.beginPath(); ctx.ellipse(7.8, -16.3 - bob, 2.5, 3.1, -0.25, 0, Math.PI * 2); ctx.fill();

    // Beady dark glinting eye
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(14.8, -10.5 - bob, 1.7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(14.3, -11.1 - bob, 0.65, 0, Math.PI * 2); ctx.fill();

    // Pink twitching nose & tiny incisor hint
    ctx.fillStyle = '#ff758f';
    ctx.beginPath(); ctx.arc(23.5, -7.8 - bob, 1.9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(19.5, -5.2 - bob, 1.6, 1.4);

    // Long sweeping whiskers
    ctx.strokeStyle = 'rgba(235, 235, 235, 0.72)';
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(20, -8.2 - bob); ctx.lineTo(28.5, -11.5 - bob);
    ctx.moveTo(20, -7.4 - bob); ctx.lineTo(29.5, -7.2 - bob);
    ctx.moveTo(20, -6.6 - bob); ctx.lineTo(28, -3.8 - bob);
    ctx.stroke();

    ctx.restore();
  }

  // Stage 6 Enemy #1: Realistic Great Horned Night Owl (بومة الأسطح الليلية)
  function drawFalcon(ctx, owl, fx, fy, time) {
    ctx.save();
    ctx.translate(fx + owl.w / 2, fy + owl.h / 2);
    ctx.scale(owl.facing, 1);
    const flap = Math.sin(time * 8.5 + owl.x * 0.04);
    const farFlap = Math.sin(time * 8.5 + owl.x * 0.04 - 0.35);

    // Far broad rounded owl wing
    const fTipY = -12 - farFlap * 14;
    ctx.fillStyle = '#4a3728';
    ctx.strokeStyle = '#1f160f';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(2, -3);
    ctx.quadraticCurveTo(6, fTipY * 0.85, -18, fTipY);
    ctx.quadraticCurveTo(-20, fTipY + 8, -10, 2);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Rounded mottled tail feathers
    ctx.fillStyle = '#5c4432';
    ctx.beginPath();
    ctx.moveTo(-12, 2); ctx.lineTo(-27, -2); ctx.quadraticCurveTo(-29, 3, -26, 7); ctx.lineTo(-12, 6);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Feathered legs & curved sharp talons
    ctx.fillStyle = '#d6c3a5';
    ctx.beginPath(); ctx.ellipse(-5, 9, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1f160f'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-5, 11); ctx.quadraticCurveTo(-7, 15, -3, 16);
    ctx.moveTo(-5, 11); ctx.quadraticCurveTo(-9, 14, -11, 15);
    ctx.stroke();

    // Plump mottled brown & cream barred owl body
    const bodyG = ctx.createLinearGradient(0, -8, 0, 10);
    bodyG.addColorStop(0, '#6b4f3a');
    bodyG.addColorStop(0.55, '#c4a484');
    bodyG.addColorStop(1, '#e8d8c3');
    ctx.fillStyle = bodyG;
    ctx.strokeStyle = '#241810';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.ellipse(0, 1, 15.5, 9, -0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Horizontal chest barring
    ctx.strokeStyle = 'rgba(65, 42, 25, 0.55)';
    ctx.lineWidth = 1.2;
    for (let bx = -5; bx <= 7; bx += 4) {
      ctx.beginPath(); ctx.moveTo(bx, 3); ctx.lineTo(bx + 2, 8); ctx.stroke();
    }

    // Large rounded Owl head with prominent feathered ear tufts ('horns')
    ctx.fillStyle = '#6b4f3a';
    ctx.beginPath(); ctx.arc(13, -3.5, 8.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Ear tufts
    ctx.fillStyle = '#3d2b1f';
    ctx.beginPath(); ctx.moveTo(9, -10); ctx.lineTo(5, -17); ctx.lineTo(13, -11); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(15, -10); ctx.lineTo(19, -16); ctx.lineTo(18, -9); ctx.closePath(); ctx.fill(); ctx.stroke();

    // Cream facial disc + fierce piercing forward-facing golden-amber owl eye
    ctx.fillStyle = '#efe2d0';
    ctx.beginPath(); ctx.ellipse(15.5, -3.5, 5.2, 5.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(16.2, -4, 2.9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#090d16';
    ctx.beginPath(); ctx.arc(16.4, -4, 1.7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(15.7, -4.7, 0.7, 0, Math.PI * 2); ctx.fill();

    // Short hooked dark raptor beak
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.moveTo(20, -4); ctx.quadraticCurveTo(24.5, -3.5, 23.5, 0.8); ctx.lineTo(19.5, -1.5); ctx.closePath(); ctx.fill();

    // Broad rounded feathered near wing with scalloped primary tips
    const nTipY = -14 - flap * 16;
    const wGrad = ctx.createLinearGradient(0, nTipY, 0, 4);
    wGrad.addColorStop(0, '#3d2b1f');
    wGrad.addColorStop(0.55, '#6b4f3a');
    wGrad.addColorStop(1, '#a6866a');
    ctx.fillStyle = wGrad;
    ctx.strokeStyle = '#1f160f';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(4, -2);
    ctx.quadraticCurveTo(7, nTipY * 0.85, -20, nTipY);
    ctx.lineTo(-22, nTipY + 5);
    ctx.lineTo(-18, nTipY + 8);
    ctx.lineTo(-10, 4);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  // Stage 6 Enemy #2: Realistic Hunched & Fluffy Rooftop Raccoon (الراكون المتسلل)
  function drawRaccoon(ctx, rac, rx, ry, time) {
    ctx.save();
    ctx.translate(rx + rac.w / 2, ry + rac.h);
    ctx.scale(rac.facing, 1);
    const walk = time * 12 + rac.x * 0.08;
    const bob = Math.abs(Math.sin(walk)) * 1.3;
    const stepA = Math.sin(walk) * 4.5;
    const stepB = -stepA;

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.46)';
    ctx.beginPath(); ctx.ellipse(0, 0, 27, 5, 0, 0, Math.PI * 2); ctx.fill();

    // Long, thick, tapering ringed tail (6 alternating charcoal-black & silver-grey bands + black tip)
    const tailWave = Math.sin(time * 4.2 + rac.x) * 2.5;
    ctx.save();
    ctx.translate(-17, -18 - bob);
    ctx.rotate(-0.32 + tailWave * 0.035);
    for (let s = 0; s < 6; s++) {
      const rxOff = -s * 4.8;
      const ryOff = Math.sin(s * 0.5) * 1.8;
      const radX = 4.8 - s * 0.25;
      const radY = 6.8 - s * 0.48;
      ctx.fillStyle = s % 2 === 0 ? '#111827' : '#cbd5e1';
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(rxOff, ryOff, radX, radY, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();

    // Far shaded legs & 5-toed dark paws
    ctx.fillStyle = '#2d333d';
    ctx.beginPath(); ctx.roundRect(-14 + stepB * 0.6, -13, 7, 11, 3); ctx.fill();
    ctx.beginPath(); ctx.roundRect(5 + stepA * 0.6, -12, 6, 10, 3); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.ellipse(-10 + stepB * 0.6, -2, 5.2, 2.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(8 + stepA * 0.6, -2, 4.5, 2.0, 0, 0, Math.PI * 2); ctx.fill();

    // Classic hunched-back arched raccoon body (high rounded haunches, lowered shoulders)
    const furG = ctx.createLinearGradient(0, -34 - bob, 0, -4 - bob);
    furG.addColorStop(0, '#9ca3af');
    furG.addColorStop(0.45, '#6b7280');
    furG.addColorStop(1, '#374151');
    ctx.fillStyle = furG;
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-19, -12 - bob);
    ctx.quadraticCurveTo(-21, -28 - bob, -6, -32 - bob); // high arched rump
    ctx.quadraticCurveTo(6, -31 - bob, 13, -22 - bob);   // sloping shoulders
    ctx.quadraticCurveTo(15, -10 - bob, 6, -7 - bob);     // chest
    ctx.quadraticCurveTo(-8, -5 - bob, -19, -12 - bob);   // belly
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Salt-and-pepper shaggy fur texture strokes
    ctx.strokeStyle = 'rgba(241, 245, 249, 0.3)';
    ctx.lineWidth = 1.2;
    for (const [fx, fy] of [[-12, -26], [-5, -29], [2, -27], [-8, -19], [1, -18]]) {
      ctx.beginPath(); ctx.moveTo(fx, fy - bob); ctx.lineTo(fx - 3.5, fy - 2.5 - bob); ctx.stroke();
    }

    // Near articulated legs & nimble dark paws
    ctx.fillStyle = '#4b5563';
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.roundRect(-12 + stepA, -14, 7.5, 12, 3.5); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(4 + stepB, -13, 6.5, 11, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#090d16';
    ctx.beginPath(); ctx.ellipse(-8 + stepA, -2, 5.5, 2.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(8 + stepB, -2, 4.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();

    // Broad raccoon head with fluffy white cheek ruffs
    ctx.fillStyle = '#8b929e';
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(15, -19.5 - bob, 11, 9.5, 0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Small rounded upright ears with white fur rims
    for (const ex of [9, 17]) {
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath(); ctx.ellipse(ex, -28.5 - bob, 3.8, 4.6, 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#374151';
      ctx.beginPath(); ctx.ellipse(ex, -28 - bob, 2.2, 2.8, 0.1, 0, Math.PI * 2); ctx.fill();
    }

    // Wide fluffy white cheek tufts & short rounded muzzle
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.ellipse(16, -15 - bob, 9.5, 4.8, 0, 0, Math.PI * 2); ctx.fill();

    // Iconic broad black bandit mask + vertical dark forehead stripe
    ctx.fillStyle = '#090d16';
    ctx.beginPath(); ctx.ellipse(17.5, -19.5 - bob, 7.2, 3.8, -0.05, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#090d16'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(19, -20 - bob); ctx.lineTo(15, -26.5 - bob); ctx.stroke();

    // Crisp white eyebrow arcs above the mask
    ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 1.7;
    ctx.beginPath(); ctx.moveTo(11, -24 - bob); ctx.quadraticCurveTo(15, -25 - bob, 20, -23.5 - bob); ctx.stroke();

    // Bright glinting dark eye inside mask
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(19, -19.8 - bob, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#090d16';
    ctx.beginPath(); ctx.arc(19.3, -19.8 - bob, 0.9, 0, Math.PI * 2); ctx.fill();

    // Short round black nose & fine whiskers
    ctx.fillStyle = '#090d16';
    ctx.beginPath(); ctx.arc(24.8, -15.2 - bob, 2.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(241, 245, 249, 0.78)';
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(21.5, -15.2 - bob); ctx.lineTo(28.5, -16.8 - bob);
    ctx.moveTo(21.5, -14.2 - bob); ctx.lineTo(28.5, -12.6 - bob);
    ctx.stroke();

    ctx.restore();
  }

  // Stage 7 Enemy: Realistic Anatomical Nocturnal Subway Bat with Echolocation (خفاش الأنفاق)
  function drawBat(ctx, bat, bx, by, time) {
    ctx.save();
    ctx.translate(bx + bat.w / 2, by + bat.h / 2);
    ctx.scale(bat.facing, 1);
    const flap = Math.sin(time * 14 + bat.x * 0.05);
    const farFlap = Math.sin(time * 14 + bat.x * 0.05 - 0.35);

    // Subtle ultrasonic echolocation pulse wave ahead of bat
    const pulse = (time * 2.4 + bat.x * 0.01) % 1;
    ctx.strokeStyle = `rgba(125, 211, 252, ${0.38 * (1 - pulse)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(18 + pulse * 18, -1, 4 + pulse * 10, -0.55, 0.55);
    ctx.stroke();

    // Far scalloped leathery wing membrane
    const fTipY = -14 - farFlap * 14;
    ctx.fillStyle = '#1e162b';
    ctx.strokeStyle = '#09060e';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(1, -2);
    ctx.lineTo(7, fTipY * 0.72);
    ctx.lineTo(-19, fTipY);
    ctx.quadraticCurveTo(-15, fTipY + 7, -11, 2);
    ctx.quadraticCurveTo(-6, 0, -2, 3);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Hind claws & tail membrane (uropatagium)
    ctx.strokeStyle = '#3f3047'; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(-8, 2); ctx.lineTo(-15, 5); ctx.moveTo(-8, 4); ctx.lineTo(-14, 7); ctx.stroke();

    // Furry dark brown-charcoal bat torso & chest mane
    const bodyG = ctx.createLinearGradient(0, -6, 0, 7);
    bodyG.addColorStop(0, '#4c384e');
    bodyG.addColorStop(1, '#231926');
    ctx.fillStyle = bodyG;
    ctx.strokeStyle = '#0f0a12';
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.ellipse(1, 1, 10.5, 6.8, -0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Bat head with large ribbed ears, pink inner pinnae, leaf nose & fangs
    ctx.fillStyle = '#3b2b3d';
    ctx.beginPath(); ctx.arc(11, -2.2, 5.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Large pointed ears
    for (const [ex1, ey1, ex2] of [[6, -15, 10], [11, -15.5, 15]]) {
      ctx.fillStyle = '#2d2030';
      ctx.beginPath(); ctx.moveTo(ex1 + 1, -6); ctx.lineTo(ex1, ey1); ctx.lineTo(ex2, -6.5); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
      ctx.beginPath(); ctx.moveTo(ex1 + 1.5, -7); ctx.lineTo(ex1 + 0.5, ey1 + 2.5); ctx.lineTo(ex2 - 1, -7); ctx.closePath(); ctx.fill();
    }
    // Glowing amber-crimson eye + white fang
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(13, -3, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(14.5, 0.5); ctx.lineTo(15.5, 3.5); ctx.lineTo(16.5, 0.5); ctx.closePath(); ctx.fill();

    // Near articulated leathery bat wing with thumb claw, finger bones & scalloped webbing
    const wWristX = 7;
    const wWristY = -7 - flap * 11;
    const wTipX = -21;
    const wTipY = -13 - flap * 16;
    const wingG = ctx.createLinearGradient(0, wTipY, 0, 6);
    wingG.addColorStop(0, '#3b2842');
    wingG.addColorStop(1, '#1b1222');
    ctx.fillStyle = wingG;
    ctx.strokeStyle = '#09060e';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(3, 0);
    ctx.lineTo(wWristX, wWristY);
    ctx.lineTo(wTipX, wTipY);
    ctx.quadraticCurveTo(-15, wTipY + 6, -13, wTipY + 9);
    ctx.quadraticCurveTo(-8, wTipY + 6, -6, wTipY + 11);
    ctx.quadraticCurveTo(-3, 4, -2, 5);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Wing finger bone struts & thumb claw
    ctx.strokeStyle = 'rgba(168, 139, 186, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(wWristX, wWristY); ctx.lineTo(-13, wTipY + 9);
    ctx.moveTo(wWristX, wWristY); ctx.lineTo(-6, wTipY + 11);
    ctx.moveTo(wWristX, wWristY); ctx.lineTo(wWristX + 2.5, wWristY - 3);
    ctx.stroke();
    ctx.restore();
  }

  // Stage 8 Enemy: Sleek Tactical Site Security Patrol Drone with Gimbal Camera, Navigation LEDs & Laser Scanner
  function drawDrone(ctx, drone, dx, dy, time) {
    ctx.save();
    ctx.translate(dx + drone.w / 2, dy + drone.h / 2);

    // Sweeping Red Laser Scanner Cone + Animated Horizontal Scanline
    const scanG = ctx.createLinearGradient(0, 8, 0, 68);
    scanG.addColorStop(0, 'rgba(239, 68, 68, 0.36)');
    scanG.addColorStop(0.65, 'rgba(239, 68, 68, 0.10)');
    scanG.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = scanG;
    ctx.beginPath(); ctx.moveTo(-7, 8); ctx.lineTo(-28, 68); ctx.lineTo(28, 68); ctx.lineTo(7, 8); ctx.closePath(); ctx.fill();
    const scanY = 16 + ((time * 42) % 44);
    const scanW = 8 + (scanY - 8) * 0.32;
    ctx.strokeStyle = 'rgba(252, 165, 165, 0.55)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-scanW, scanY); ctx.lineTo(scanW, scanY); ctx.stroke();

    // Shock-absorbing carbon landing skids with rubber feet
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-12, 6); ctx.lineTo(-17, 14); ctx.lineTo(-21, 14);
    ctx.moveTo(12, 6); ctx.lineTo(17, 14); ctx.lineTo(21, 14);
    ctx.stroke();

    // Swept dual rotor arms with subtle anodized orange accent
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.moveTo(-10, -2); ctx.lineTo(-24, -8); ctx.moveTo(10, -2); ctx.lineTo(24, -8); ctx.stroke();
    ctx.strokeStyle = '#f97316'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-13, -3); ctx.lineTo(-21, -6.5); ctx.moveTo(13, -3); ctx.lineTo(21, -6.5); ctx.stroke();

    // Central armored carbon-fiber chassis + top dome + cooling vents
    const bodyG = ctx.createLinearGradient(0, -10, 0, 8);
    bodyG.addColorStop(0, '#334155');
    bodyG.addColorStop(0.5, '#1e293b');
    bodyG.addColorStop(1, '#090d16');
    ctx.fillStyle = bodyG; ctx.strokeStyle = '#020617'; ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-18, -3); ctx.lineTo(-11, -9); ctx.lineTo(11, -9); ctx.lineTo(18, -3);
    ctx.lineTo(15, 6); ctx.lineTo(-15, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Specular metallic highlight & cooling vents
    ctx.fillStyle = 'rgba(226, 232, 240, 0.25)'; ctx.fillRect(-8, -7.5, 16, 2);
    ctx.fillStyle = '#0f172a';
    for (const vx of [-6, -2, 2, 6]) ctx.fillRect(vx - 1, -2, 2, 4);

    // Articulated under-belly gimbal camera pod + glowing red lens
    ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(drone.facing * 5, 7, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(drone.facing * 7, 7, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fecaca';
    ctx.beginPath(); ctx.arc(drone.facing * 7 - 0.8, 6.2, 0.9, 0, Math.PI * 2); ctx.fill();

    // Rotor motor housings, prop guards, navigation LEDs & high-speed spinning blades
    for (const rx of [-24, 24]) {
      // Motor bell
      ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#090d16'; ctx.lineWidth = 1.2;
      ctx.fillRect(rx - 3.5, -12, 7, 6); ctx.strokeRect(rx - 3.5, -12, 7, 6);
      // Navigation LED (green starboard / red port)
      const ledOn = Math.sin(time * 8 + rx) > -0.2;
      if (ledOn) {
        ctx.fillStyle = rx > 0 ? '#22c55e' : '#ef4444';
        ctx.beginPath(); ctx.arc(rx, -6, 2.1, 0, Math.PI * 2); ctx.fill();
      }
      // Motion-blurred spinning rotor disc + blade tips
      const bladeW = 12 + Math.sin(time * 52 + rx) * 7;
      ctx.fillStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.beginPath(); ctx.ellipse(rx, -13, 18, 2.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(241, 245, 249, 0.9)'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(rx - bladeW, -13); ctx.lineTo(rx + bladeW, -13); ctx.stroke();
    }
    ctx.restore();
  }

  return {
    drawSkyAndFarCity,
    drawMidgroundCityBuildings,
    drawMarketMidgroundBuildings,
    drawParkSkyAndHorizon,
    drawParkMidground,
    drawHarborSkyAndSea,
    drawHarborMidground,
    drawRooftopSkyAndHorizon,
    drawRooftopMidground,
    drawSubwaySkyAndHorizon,
    drawSubwayMidground,
    drawConstructionSkyAndHorizon,
    drawConstructionMidground,
    drawStartCardboardScene,
    drawStreetlamps,
    drawPlatform,
    drawDog,
    drawHedgehog,
    drawCrow,
    drawCrab,
    drawSeagull,
    drawRat,
    drawFalcon,
    drawRaccoon,
    drawBat,
    drawDrone,
    drawPuddle,
    drawCheckpoint,
    drawMarketFestoonLanterns,
    drawMarketGate,
  };
})();
