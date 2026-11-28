/* ============================================================================
   STAGE 29 ART ENGINE: INTERNATIONAL AIRPORT (المطار الدولي • صالة المسافرين ومدرج الطائرات)
   SEAMLESS INDOOR-TERMINAL TO ACTIVE-TARMAC ARCHITECTURAL SPECTACLE (60FPS BAKED):
     • Part 1 (x = 0 .. 9650 — INSIDE GRAND AIRPORT TERMINAL):
       - Vaulted Curved Steel-and-Glass Skylight Roof Trusses, Panoramic Curtain-Wall
         Windows Showing Outside Airliners & Control Tower, Live Split-Flap Flight
         Departure Boards (FIDS), Check-In Counters, Duty-Free Boutiques & Wayfinding
       - Gleaming Terrazzo Marble Concourse Floors, Mezzanine Glass Balconies,
         Moving Rubber Luggage Conveyors, Security Laser Scanners, Bellhop Suitcase
         Bounce Carts & VIP Flight-Attendant Lounge Kiosk (+1 💜)
     • Transition Threshold (x = 9650 — AIRSIDE APRON EXIT PORTAL):
       - 1:1 Pixel-Locked Architectural Split from Indoor Concourse to Open-Air Sky!
     • Part 2 (x = 9650 .. 20400 — ACTIVE AIRCRAFT APRON & RUNWAY TARMAC):
       - Sunlit Aviation Sky, Rotating-Radar Air Traffic Control Tower, Climbing &
         Landing Wide-Body Jets with Contrails, Telescopic Jetways, Parked Airliners,
         Follow-Me Cars, Windsocks, Grooved Concrete Apron Slabs & Inset LEDs
       - Baggage Tug Shuttles, Hydraulic Cargo Scissor Lifts & Jet-Blast Test Pods
     • Grand Goal Gate (x = 19860):
       - Open Yellow Airport Baggage Cart Loaded with World-Tour Suitcases Parked at
         an Animated Inclined Belt-Loader Directly in Front of a Colossal Parked
         Passenger Airliner with Its Lower-Deck Cargo Hold Door Wide Open!
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};
  const Art = window.Game.Art;
  if (!Art) return;

  const prevDrawPlatform = Art.drawPlatform;
  const prevDrawCheckpoint = Art.drawCheckpoint;

  const TERMINAL_EXIT_WORLD_X = 9650;
  const VIEW_ZOOM = 1.3;

  let airportCloudSprite = null;
  let airportIndoorCache = null;
  let airportTarmacHorizonCache = null;
  let airportTarmacMidCache = null;

  function makeOffscreen(w, h, fn) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const cctx = c.getContext('2d');
    fn(cctx, w, h);
    return c;
  }

  function drawAirportCloud(ctx, cx, cy, sx, sy, alpha) {
    if (!airportCloudSprite && typeof document !== 'undefined' && document.createElement) {
      airportCloudSprite = makeOffscreen(196, 92, (cctx) => {
        cctx.translate(98, 54);
        cctx.fillStyle = '#93c5fd';
        cctx.beginPath();
        cctx.ellipse(0, 14, 82, 16, 0, 0, Math.PI * 2);
        cctx.ellipse(-42, 11, 48, 13, 0, 0, Math.PI * 2);
        cctx.ellipse(44, 11, 50, 13, 0, 0, Math.PI * 2);
        cctx.fill();
        cctx.fillStyle = '#e0f2fe';
        cctx.beginPath();
        cctx.arc(-44, 1, 26, 0, Math.PI * 2);
        cctx.arc(-15, -10, 34, 0, Math.PI * 2);
        cctx.arc(20, -12, 36, 0, Math.PI * 2);
        cctx.arc(48, 2, 25, 0, Math.PI * 2);
        cctx.ellipse(0, 5, 72, 16, 0, 0, Math.PI * 2);
        cctx.fill();
        cctx.fillStyle = '#ffffff';
        cctx.beginPath();
        cctx.arc(-42, -3, 21, 0, Math.PI * 2);
        cctx.arc(-15, -14, 29, 0, Math.PI * 2);
        cctx.arc(18, -16, 31, 0, Math.PI * 2);
        cctx.arc(45, -2, 20, 0, Math.PI * 2);
        cctx.ellipse(0, -1, 60, 13, 0, 0, Math.PI * 2);
        cctx.fill();
      });
    }
    if (airportCloudSprite) {
      const dw = 196 * sx;
      const dh = 92 * sy;
      const dx = cx - 98 * sx;
      if (dx + dw < -20 || dx > 1320) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(airportCloudSprite, dx, cy - 54 * sy, dw, dh);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(sx, sy);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, 74, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Helper: Draw distant flying commercial jet silhouette with contrails
  function drawDistantJet(ctx, x, y, scale, pitchRad, dir, showContrail) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir * scale, scale);
    ctx.rotate(pitchRad);

    if (showContrail) {
      const cg = ctx.createLinearGradient(-150, 4, -22, 4);
      cg.addColorStop(0, 'rgba(255, 255, 255, 0)');
      cg.addColorStop(1, 'rgba(255, 255, 255, 0.58)');
      ctx.strokeStyle = cg;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(-150, 5);
      ctx.lineTo(-18, 4);
      ctx.stroke();
    }

    // Tail fin
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-26, 0);
    ctx.lineTo(-37, -15);
    ctx.lineTo(-30, -15);
    ctx.lineTo(-17, 0);
    ctx.closePath();
    ctx.fill();

    // Far wing
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(-2, -1);
    ctx.lineTo(-14, -9);
    ctx.lineTo(-8, -9);
    ctx.lineTo(7, -1);
    ctx.closePath();
    ctx.fill();

    // Sleek white fuselage + azure cheatline
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-32, -1.5);
    ctx.quadraticCurveTo(0, -5.5, 28, -1.5);
    ctx.quadraticCurveTo(36, 1.0, 27, 3.8);
    ctx.quadraticCurveTo(0, 5.2, -31, 1.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-26, 0.6);
    ctx.lineTo(25, 0.6);
    ctx.stroke();

    // Cockpit window
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(24, -2.0);
    ctx.lineTo(29, -0.8);
    ctx.lineTo(25, 0.2);
    ctx.closePath();
    ctx.fill();

    // Swept near wing + under-wing turbofan nacelle
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-4, 1.5);
    ctx.lineTo(-19, 12);
    ctx.lineTo(-12, 12);
    ctx.lineTo(9, 2.0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(-2, 6.2, 5.0, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Helper: Draw a parked wide-body passenger airliner in the tarmac midground
  function drawMidgroundParkedAirliner(ctx, x, groundY, scale, tailColor) {
    ctx.save();
    ctx.translate(x, groundY);
    ctx.scale(scale, scale);

    // Apron shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.24)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 128, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Landing gear struts & twin tires
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-18, -18); ctx.lineTo(-18, -3);
    ctx.moveTo(76, -16); ctx.lineTo(76, -3);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    for (const wx of [-22, -14, 74, 79]) {
      ctx.beginPath(); ctx.arc(wx, -3.5, 4.0, 0, Math.PI * 2); ctx.fill();
    }

    // Tall vertical stabilizer tail fin with airline emblem
    const tG = ctx.createLinearGradient(-115, -78, -75, -24);
    tG.addColorStop(0, tailColor || '#0284c7');
    tG.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = tG;
    ctx.beginPath();
    ctx.moveTo(-102, -26);
    ctx.lineTo(-126, -78);
    ctx.lineTo(-106, -78);
    ctx.lineTo(-68, -28);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(-104, -54, 9, -0.6, 1.8);
    ctx.stroke();

    // Fuselage
    const fG = ctx.createLinearGradient(0, -44, 0, -14);
    fG.addColorStop(0.0, '#ffffff');
    fG.addColorStop(0.65, '#f1f5f9');
    fG.addColorStop(1.0, '#cbd5e1');
    ctx.fillStyle = fG;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-112, -28);
    ctx.quadraticCurveTo(-84, -42, -35, -42);
    ctx.lineTo(68, -42);
    ctx.bezierCurveTo(96, -42, 118, -30, 122, -22);
    ctx.bezierCurveTo(118, -15, 96, -14, 68, -14);
    ctx.lineTo(-42, -14);
    ctx.quadraticCurveTo(-88, -15, -112, -25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Livery cheatline & cabin windows
    ctx.fillStyle = tailColor || '#0284c7';
    ctx.fillRect(-78, -26, 168, 3.2);
    ctx.fillStyle = '#334155';
    for (let wx = -68; wx <= 72; wx += 8) {
      ctx.fillRect(wx, -32.5, 3.2, 4.4);
    }
    // Cockpit windshield
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(96, -35);
    ctx.lineTo(109, -29);
    ctx.lineTo(108, -26);
    ctx.lineTo(95, -28);
    ctx.closePath();
    ctx.fill();

    // Swept wing + turbofan engine
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(12, -22);
    ctx.lineTo(-44, -9);
    ctx.lineTo(-28, -8);
    ctx.lineTo(34, -20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = tailColor || '#0284c7';
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-2, -16, 22, 10, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(17, -15.5, 3.5, 9);

    ctx.restore();
  }

  // =========================================================================
  // 1. SKY & HORIZON (SEAMLESS SPLIT: INDOOR TERMINAL VAULT <-> OUTDOOR SKY)
  // =========================================================================
  function drawOutdoorAviationSky(ctx, camX, w, h, time) {
    // Crisp sunlit international airport sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.82);
    sky.addColorStop(0.00, '#0369a1');
    sky.addColorStop(0.28, '#0284c7');
    sky.addColorStop(0.58, '#38bdf8');
    sky.addColorStop(0.84, '#bae6fd');
    sky.addColorStop(1.00, '#f0f9ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Bright morning aviation sun
    const sunX = 980 - ((camX * 0.01) % 240);
    const sunY = 88;
    const halo = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 175);
    halo.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
    halo.addColorStop(0.35, 'rgba(224, 242, 254, 0.50)');
    halo.addColorStop(1.0, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 175, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 28, 0, Math.PI * 2);
    ctx.fill();

    // Volumetric Cumulus Clouds
    const cSpan = w + 460;
    for (let i = 0; i < 8; i++) {
      const cx0 = (((i * 215 - camX * 0.02 + time * 6.0) % cSpan) + cSpan) % cSpan - 230;
      const cy0 = 66 + (i % 3) * 34;
      drawAirportCloud(ctx, cx0, cy0, 0.92 + (i % 3) * 0.18, 0.72 + (i % 2) * 0.14, 0.86);
    }

    // Live Ascending Airliner Climbing Into the Sky + Descending Airliner on Approach!
    const takeOffSpan = w + 520;
    const jet1X = (((time * 54 - camX * 0.03) % takeOffSpan) + takeOffSpan) % takeOffSpan - 220;
    const jet1Y = 235 - ((jet1X + 220) / takeOffSpan) * 125;
    drawDistantJet(ctx, jet1X, jet1Y, 0.95, -0.18, 1, true);

    const jet2X = w + 220 - ((((time * 38 + 420 + camX * 0.02) % takeOffSpan) + takeOffSpan) % takeOffSpan);
    const jet2Y = 148 + ((w + 220 - jet2X) / takeOffSpan) * 65;
    drawDistantJet(ctx, jet2X, jet2Y, 0.68, 0.06, -1, false);

    // Baked Distant Airport Horizon: Air Traffic Control Tower, Hangars & Distant Terminal Wing
    if (!airportTarmacHorizonCache && typeof document !== 'undefined' && document.createElement) {
      airportTarmacHorizonCache = makeOffscreen(1520, 320, (hCtx) => {
        hCtx.translate(0, -170);
        // Distant misty city/hills silhouette
        const dG = hCtx.createLinearGradient(0, 360, 0, 480);
        dG.addColorStop(0, '#94a3b8');
        dG.addColorStop(1, '#64748b');
        hCtx.fillStyle = dG;
        hCtx.beginPath();
        hCtx.moveTo(0, 485);
        hCtx.bezierCurveTo(280, 398, 560, 412, 860, 392);
        hCtx.bezierCurveTo(1160, 376, 1340, 405, 1520, 485);
        hCtx.closePath();
        hCtx.fill();

        // Wide Curved Steel Maintenance Hangars
        for (const hx of [190, 1140]) {
          const hg = hCtx.createLinearGradient(hx, 388, hx, 465);
          hg.addColorStop(0, '#f8fafc');
          hg.addColorStop(0.5, '#cbd5e1');
          hg.addColorStop(1, '#475569');
          hCtx.fillStyle = hg;
          hCtx.strokeStyle = '#334155';
          hCtx.lineWidth = 1.2;
          hCtx.beginPath();
          hCtx.moveTo(hx - 125, 465);
          hCtx.quadraticCurveTo(hx, 382, hx + 125, 465);
          hCtx.closePath();
          hCtx.fill();
          hCtx.stroke();
          hCtx.fillStyle = '#1e293b';
          hCtx.fillRect(hx - 82, 426, 164, 39);
          hCtx.strokeStyle = '#38bdf8';
          hCtx.lineWidth = 1.5;
          hCtx.strokeRect(hx - 82, 426, 164, 39);
        }

        // Iconic International Air Traffic Control Tower (برج المراقبة الجوية)
        const tx = 720;
        const shG = hCtx.createLinearGradient(tx - 18, 220, tx + 18, 465);
        shG.addColorStop(0, '#f8fafc');
        shG.addColorStop(0.55, '#cbd5e1');
        shG.addColorStop(1, '#64748b');
        hCtx.fillStyle = shG;
        hCtx.strokeStyle = '#334155';
        hCtx.lineWidth = 1.3;
        // Flared sculptural tower shaft
        hCtx.beginPath();
        hCtx.moveTo(tx - 22, 465);
        hCtx.quadraticCurveTo(tx - 12, 340, tx - 16, 252);
        hCtx.lineTo(tx + 16, 252);
        hCtx.quadraticCurveTo(tx + 12, 340, tx + 22, 465);
        hCtx.closePath();
        hCtx.fill();
        hCtx.stroke();

        // Lower technical observation pod
        hCtx.fillStyle = '#475569';
        hCtx.beginPath();
        hCtx.moveTo(tx - 32, 252);
        hCtx.lineTo(tx + 32, 252);
        hCtx.lineTo(tx + 22, 268);
        hCtx.lineTo(tx - 22, 268);
        hCtx.closePath();
        hCtx.fill();

        // 360-degree slanted tinted-glass ATC control cab
        const cabG = hCtx.createLinearGradient(tx - 38, 218, tx + 38, 250);
        cabG.addColorStop(0, '#7dd3fc');
        cabG.addColorStop(0.45, '#0284c7');
        cabG.addColorStop(1, '#0c4a6e');
        hCtx.fillStyle = cabG;
        hCtx.beginPath();
        hCtx.moveTo(tx - 40, 222);
        hCtx.lineTo(tx + 40, 222);
        hCtx.lineTo(tx + 31, 252);
        hCtx.lineTo(tx - 31, 252);
        hCtx.closePath();
        hCtx.fill();
        hCtx.stroke();
        // Slanted window mullions
        hCtx.strokeStyle = '#e2e8f0';
        hCtx.lineWidth = 1.2;
        for (let m = -3; m <= 3; m++) {
          hCtx.beginPath();
          hCtx.moveTo(tx + m * 10.5, 222);
          hCtx.lineTo(tx + m * 8.2, 252);
          hCtx.stroke();
        }
        // White tower roof cap + communication mast
        hCtx.fillStyle = '#f8fafc';
        hCtx.fillRect(tx - 43, 215, 86, 7);
        hCtx.strokeRect(tx - 43, 215, 86, 7);
        hCtx.strokeStyle = '#475569';
        hCtx.lineWidth = 2.0;
        hCtx.beginPath();
        hCtx.moveTo(tx, 215);
        hCtx.lineTo(tx, 182);
        hCtx.stroke();
      });
    }

    const hOff = -(((camX * 0.09) % 1520) + 1520) % 1520;
    for (let hx = hOff - 1520; hx < w + 1520; hx += 1520) {
      if (hx + 1520 < 0 || hx > w) continue;
      if (airportTarmacHorizonCache) {
        ctx.drawImage(airportTarmacHorizonCache, hx, 170);
      }
      // Live rotating ATC radar dish + flashing red aviation obstruction beacon on top of tower!
      const tx = hx + 720;
      const radarW = Math.max(3, Math.abs(Math.cos(time * 2.8)) * 18);
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.ellipse(tx, 204, radarW, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (Math.sin(time * 6.0) > 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(tx, 180, 3.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawAirportSkyAndHorizon(ctx, camX, w, h, time) {
    // Screen X where Indoor Terminal (left) meets Outdoor Tarmac (right)
    const splitScreenX = (TERMINAL_EXIT_WORLD_X - camX) * VIEW_ZOOM;

    // Always draw crisp outdoor sky behind (visible through indoor panoramic glass windows AND outdoors!)
    drawOutdoorAviationSky(ctx, camX, w, h, time);

    // If any part of the Indoor Terminal is on screen, render the Vaulted Steel-and-Glass Terminal Ceiling!
    if (splitScreenX > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, Math.min(w, splitScreenX), h);
      ctx.clip();

      // Tinted panoramic glass curtain-wall cool daylight glaze over the outside sky
      ctx.fillStyle = 'rgba(15, 23, 42, 0.16)';
      ctx.fillRect(0, 0, Math.min(w, splitScreenX), h);

      // Soaring Architectural Vaulted Airport Ceiling Canopy (top 168px)
      const ceilG = ctx.createLinearGradient(0, 0, 0, 172);
      ceilG.addColorStop(0.00, '#1e293b');
      ceilG.addColorStop(0.48, '#334155');
      ceilG.addColorStop(0.85, '#64748b');
      ceilG.addColorStop(1.00, '#cbd5e1');
      ctx.fillStyle = ceilG;
      ctx.fillRect(0, 0, Math.min(w, splitScreenX), 158);

      // Recessed warm-white LED skylight bays & curved steel roof ribs (0.18x parallax)
      const ribStep = 180;
      const ribOff = -(((camX * 0.18) % ribStep) + ribStep) % ribStep;
      for (let rx = ribOff - ribStep; rx < Math.min(w, splitScreenX) + ribStep; rx += ribStep) {
        // Glowing skylight strip
        const skG = ctx.createLinearGradient(rx + 28, 14, rx + ribStep - 28, 128);
        skG.addColorStop(0, 'rgba(224, 242, 254, 0.85)');
        skG.addColorStop(1, 'rgba(254, 249, 195, 0.55)');
        ctx.fillStyle = skG;
        ctx.beginPath();
        ctx.roundRect(rx + 34, 18, ribStep - 68, 96, 8);
        ctx.fill();

        // Sweeping tubular white-steel roof arch truss
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        ctx.moveTo(rx, 0);
        ctx.quadraticCurveTo(rx + 18, 92, rx, 165);
        ctx.stroke();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(rx + 4, 0);
        ctx.quadraticCurveTo(rx + 22, 92, rx + 4, 165);
        ctx.stroke();
      }

      // Brushed-aluminum curtain-wall fascia beam below ceiling
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 156, Math.min(w, splitScreenX), 10);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, 163, Math.min(w, splitScreenX), 2.2);

      ctx.restore();
    }
  }

  // =========================================================================
  // 2. MIDGROUND (SEAMLESS SPLIT: INDOOR TERMINAL HALL <-> ACTIVE TARMAC APRON)
  // =========================================================================
  function ensureIndoorCache() {
    if (airportIndoorCache || typeof document === 'undefined' || !document.createElement) return;
    const span = 1440;
    airportIndoorCache = makeOffscreen(span, 700, (ctx) => {
      // 1. Tall Curtain-Wall Structural Glass Mullions & Transoms (letting the sky & jets shine through!)
      for (let gx = 0; gx < span; gx += 180) {
        // Vertical steel-grey structural column
        const colG = ctx.createLinearGradient(gx - 8, 160, gx + 8, 160);
        colG.addColorStop(0, '#64748b');
        colG.addColorStop(0.5, '#cbd5e1');
        colG.addColorStop(1, '#334155');
        ctx.fillStyle = colG;
        ctx.fillRect(gx - 7, 160, 14, 380);
      }
      // Horizontal glass curtain-wall transoms + subtle diagonal glass reflection sheen
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 265, span, 5);
      ctx.fillRect(0, 368, span, 5);

      // 2. Lower Indoor Concourse Wall, Duty-Free Boutiques, Check-In Desks & Gate Lounges (y = 435 .. 660)
      const wallG = ctx.createLinearGradient(0, 432, 0, 650);
      wallG.addColorStop(0.0, '#f8fafc');
      wallG.addColorStop(0.5, '#e2e8f0');
      wallG.addColorStop(1.0, '#cbd5e1');
      ctx.fillStyle = wallG;
      ctx.fillRect(0, 436, span, 230);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 436, span, 5);

      // A) Luxury Duty-Free Storefront (x = 70 .. 390)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(75, 456, 305, 118);
      const dfGlow = ctx.createLinearGradient(85, 476, 370, 570);
      dfGlow.addColorStop(0, '#fef3c7');
      dfGlow.addColorStop(0.5, '#fde68a');
      dfGlow.addColorStop(1, '#f59e0b');
      ctx.fillStyle = dfGlow;
      ctx.fillRect(88, 480, 279, 90);
      // Display shelves with perfume & Swiss chocolate boxes
      ctx.fillStyle = '#78350f';
      for (const sy of [508, 536, 562]) ctx.fillRect(96, sy, 262, 4);
      for (let bx = 108; bx < 345; bx += 26) {
        ctx.fillStyle = bx % 52 === 108 % 52 ? '#e11d48' : '#0284c7';
        ctx.fillRect(bx, 495, 12, 13);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(bx + 2, 522, 14, 14);
      }
      // Illuminated DUTY FREE header fascia
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(75, 454, 305, 25);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ DUTY FREE • السوق الحرة ✦', 227, 471);

      // B) Giant Flight Information Departure Board (FIDS — لوحة الرحلات والمغادرة, x = 470 .. 790)
      ctx.fillStyle = '#334155';
      ctx.fillRect(515, 166, 6, 48);
      ctx.fillRect(745, 166, 6, 48);
      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.roundRect(468, 208, 330, 128, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#eab308';
      ctx.fillRect(472, 212, 322, 22);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('✈ DEPARTURES • المغادرون', 484, 227);
      const flights = [
        ['WY 707', 'CAIRO / HOME', 'A12', 'BOARDING', '#4ade80'],
        ['TK 271', 'ISTANBUL', 'B04', 'ON TIME', '#fde047'],
        ['LX 280', 'ZURICH', 'C09', 'LANDED', '#38bdf8'],
        ['RJ 260', 'JERUSALEM', 'A03', 'ON TIME', '#fde047'],
      ];
      ctx.font = 'bold 10.5px monospace';
      flights.forEach((fl, idx) => {
        const ry = 250 + idx * 21;
        ctx.fillStyle = idx % 2 === 0 ? '#111827' : '#1e293b';
        ctx.fillRect(476, ry - 13, 314, 18);
        ctx.fillStyle = '#fef08a';
        ctx.fillText(fl[0], 482, ry);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(fl[1], 536, ry);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(fl[2], 652, ry);
        ctx.fillStyle = fl[4];
        ctx.fillText(fl[3], 694, ry);
      });

      // C) Check-In & Bag-Drop Counters below FIDS (x = 465 .. 805)
      for (let c = 0; c < 3; c++) {
        const cx0 = 478 + c * 108;
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cx0, 468, 88, 22);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BAG DROP ' + (c + 1), cx0 + 44, 483);
        // Agent screen & counter desk
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx0 + 30, 512, 26, 18);
        const dG = ctx.createLinearGradient(cx0, 528, cx0, 574);
        dG.addColorStop(0, '#f8fafc');
        dG.addColorStop(1, '#94a3b8');
        ctx.fillStyle = dG;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.2;
        ctx.fillRect(cx0 + 4, 528, 80, 46);
        ctx.strokeRect(cx0 + 4, 528, 80, 46);
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(cx0 + 4, 536, 80, 6);
      }

      // D) Overhead Yellow-and-Slate Airport Wayfinding Sign & Boarding Gate Lounge (x = 900 .. 1360)
      ctx.fillStyle = '#334155';
      ctx.fillRect(960, 166, 4, 34);
      ctx.fillRect(1240, 166, 4, 34);
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(920, 198, 360, 34, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.fillRect(926, 203, 128, 24);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✈ GATES A1–A9 ➡', 990, 219);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('🧳 BAGGAGE • صالة الطائرات', 1168, 219);

      // Gate Portal & Blue Ergonomic Terminal Waiting Chairs + Indoor Palm Planters
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(935, 458, 145, 116);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(935, 458, 145, 24);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('GATE A7 • بوابة', 1007, 474);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.fillRect(945, 486, 125, 86);

      // Row of airport waiting seats
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(1125, 566); ctx.lineTo(1315, 566);
      ctx.moveTo(1150, 566); ctx.lineTo(1150, 576);
      ctx.moveTo(1290, 566); ctx.lineTo(1290, 576);
      ctx.stroke();
      for (let s = 0; s < 5; s++) {
        const sx0 = 1130 + s * 37;
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(sx0, 540, 28, 24, 4);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(sx0 + 3, 543, 22, 8);
      }

      //Lush indoor airport planter pots
      for (const px0 of [36, 855, 1385]) {
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(px0 - 16, 546);
        ctx.lineTo(px0 + 16, 546);
        ctx.lineTo(px0 + 12, 576);
        ctx.lineTo(px0 - 12, 576);
        ctx.closePath();
        ctx.fill();
        for (let lf = -2; lf <= 2; lf++) {
          ctx.strokeStyle = lf % 2 === 0 ? '#16a34a' : '#22c55e';
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.moveTo(px0, 546);
          ctx.quadraticCurveTo(px0 + lf * 9, 518, px0 + lf * 16, 506 + Math.abs(lf) * 5);
          ctx.stroke();
        }
      }
    });
  }

  function ensureTarmacMidCache() {
    if (airportTarmacMidCache || typeof document === 'undefined' || !document.createElement) return;
    const span = 1560;
    airportTarmacMidCache = makeOffscreen(span, 700, (ctx) => {
      // 1. Wide Concrete & Asphalt International Apron Horizon (y = 456 .. 680)
      const apG = ctx.createLinearGradient(0, 456, 0, 660);
      apG.addColorStop(0.00, '#cbd5e1');
      apG.addColorStop(0.26, '#94a3b8');
      apG.addColorStop(0.65, '#64748b');
      apG.addColorStop(1.00, '#475569');
      ctx.fillStyle = apG;
      ctx.fillRect(0, 456, span, 240);

      // Green grass runway infield strip along far horizon
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, 452, span, 9);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(0, 458, span, 4);

      // Yellow taxiway guideline & red/white apron safety stripe
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(0, 528);
      ctx.lineTo(span, 528);
      ctx.stroke();

      for (let rx = 0; rx < span; rx += 36) {
        ctx.fillStyle = rx % 72 === 0 ? '#ef4444' : '#ffffff';
        ctx.fillRect(rx, 558, 36, 4);
      }

      // 2. Telescopic Passenger Boarding Jetways (خراطيم الطائرات) & Parked Wide-Body Airliners!
      // Jetway #1 + Parked Blue-Gold Airliner
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.fillRect(90, 434, 155, 22);
      ctx.strokeRect(90, 434, 155, 22);
      ctx.fillStyle = '#38bdf8';
      for (let wx = 102; wx < 232; wx += 22) ctx.fillRect(wx, 439, 14, 10);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(216, 456, 8, 52);
      drawMidgroundParkedAirliner(ctx, 350, 512, 1.05, '#0284c7');

      // Jetway #2 + Parked Crimson-Silver Swiss/Turkish Style Airliner
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(880, 436, 148, 20);
      ctx.strokeRect(880, 436, 148, 20);
      ctx.fillStyle = '#38bdf8';
      for (let wx = 892; wx < 1014; wx += 22) ctx.fillRect(wx, 441, 14, 9);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(1002, 456, 8, 50);
      drawMidgroundParkedAirliner(ctx, 1135, 510, 1.02, '#e11d48');

      // Tall Apron Floodlight Masts
      for (const mx of [640, 1430]) {
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(mx, 495);
        ctx.lineTo(mx, 368);
        ctx.stroke();
        ctx.fillStyle = '#334155';
        ctx.fillRect(mx - 18, 362, 36, 8);
        ctx.fillStyle = '#fef08a';
        for (const lx of [-12, 0, 12]) {
          ctx.beginPath(); ctx.arc(mx + lx, 368, 3.0, 0, Math.PI * 2); ctx.fill();
        }
      }
    });
  }

  function drawAirportMidground(mainCtx, camX, w, h, time) {
    ensureIndoorCache();
    ensureTarmacMidCache();

    const splitScreenX = (TERMINAL_EXIT_WORLD_X - camX) * VIEW_ZOOM;

    // --- PART A: INDOOR TERMINAL CONCOURSE (left of splitScreenX) ---
    if (splitScreenX > 0 && airportIndoorCache) {
      mainCtx.save();
      mainCtx.beginPath();
      mainCtx.rect(0, 0, Math.min(w, splitScreenX), h);
      mainCtx.clip();

      const span = 1440;
      const off = -(((camX * 0.36) % span) + span) % span;
      for (let bx = off - span; bx < Math.min(w, splitScreenX) + span; bx += span) {
        if (bx + span < 0 || bx > w) continue;
        mainCtx.drawImage(airportIndoorCache, bx, 0);

        // Live blinking green "BOARDING" status dot on FIDS board
        if (Math.sin(time * 5.5) > -0.2) {
          mainCtx.fillStyle = '#4ade80';
          mainCtx.beginPath();
          mainCtx.arc(bx + 782, 246, 3.2, 0, Math.PI * 2);
          mainCtx.fill();
        }
      }

      // Live Distant Silhouette Travelers Walking with Rolling Carry-On Suitcases!
      const travSpan = 620;
      for (let t = 0; t < 3; t++) {
        const dir = t % 2 === 0 ? 1 : -1;
        const tx = (((t * 240 + dir * time * 32 - camX * 0.38) % (w + 200)) + (w + 200)) % (w + 200) - 100;
        if (tx > splitScreenX - 24) continue;
        const ty = 574;
        const step = Math.sin(time * 6.5 + t * 2) * 4;
        mainCtx.save();
        mainCtx.translate(tx, ty);
        mainCtx.scale(dir, 1);
        mainCtx.fillStyle = 'rgba(30, 41, 59, 0.52)';
        // Head & Coat
        mainCtx.beginPath();
        mainCtx.arc(0, -36, 4.5, 0, Math.PI * 2);
        mainCtx.fill();
        mainCtx.beginPath();
        mainCtx.roundRect(-5, -30, 10, 18, 3);
        mainCtx.fill();
        // Walking legs
        mainCtx.strokeStyle = 'rgba(30, 41, 59, 0.58)';
        mainCtx.lineWidth = 2.6;
        mainCtx.beginPath();
        mainCtx.moveTo(-2, -12); mainCtx.lineTo(-2 + step, 0);
        mainCtx.moveTo(2, -12); mainCtx.lineTo(2 - step, 0);
        // Trailing carry-on spinner suitcase
        mainCtx.moveTo(-4, -20); mainCtx.lineTo(-14, -12);
        mainCtx.stroke();
        mainCtx.fillStyle = t === 1 ? '#0284c7' : '#e11d48';
        mainCtx.fillRect(-20, -13, 8, 12);
        mainCtx.restore();
      }
      mainCtx.restore();
    }

    // --- PART B: OUTDOOR ACTIVE TARMAC APRON (right of splitScreenX) ---
    if (splitScreenX < w && airportTarmacMidCache) {
      mainCtx.save();
      const clipL = Math.max(0, splitScreenX);
      mainCtx.beginPath();
      mainCtx.rect(clipL, 0, w - clipL, h);
      mainCtx.clip();

      const span = 1560;
      const off = -(((camX * 0.38) % span) + span) % span;
      for (let bx = off - span; bx < w + span; bx += span) {
        if (bx + span < clipL || bx > w) continue;
        mainCtx.drawImage(airportTarmacMidCache, bx, 0);

        // Live Fluttering Orange-and-White Airport Windsock (كمّ الرياح)
        const wx = bx + 755, wy = 478;
        mainCtx.strokeStyle = '#475569';
        mainCtx.lineWidth = 2.0;
        mainCtx.beginPath();
        mainCtx.moveTo(wx, wy + 28);
        mainCtx.lineTo(wx, wy - 10);
        mainCtx.stroke();
        const wave = Math.sin(time * 6.5) * 2.5;
        for (let seg = 0; seg < 5; seg++) {
          mainCtx.fillStyle = seg % 2 === 0 ? '#f97316' : '#ffffff';
          const x0 = wx + seg * 5.2;
          const y0 = wy - 8 + seg * 0.5 + Math.sin(time * 6.5 + seg * 0.7) * 1.4;
          const h0 = 7.0 - seg * 0.85;
          mainCtx.fillRect(x0, y0 + wave * 0.12 * seg, 5.4, h0);
        }
      }

      // Live Yellow "FOLLOW ME" Airport Checkered Guide Car & Baggage Train Driving on Apron!
      const vehSpan = w + 380;
      const carX = (((time * 58 - camX * 0.42) % vehSpan) + vehSpan) % vehSpan - 180;
      if (carX > clipL - 40) {
        const cy = 542;
        mainCtx.save();
        mainCtx.translate(carX, cy);
        mainCtx.fillStyle = '#facc15';
        mainCtx.strokeStyle = '#1e293b';
        mainCtx.lineWidth = 1.1;
        mainCtx.beginPath();
        mainCtx.roundRect(-18, -11, 36, 10, 3);
        mainCtx.fill();
        mainCtx.stroke();
        mainCtx.fillStyle = '#0ea5e9';
        mainCtx.beginPath();
        mainCtx.roundRect(-10, -17, 19, 7, [3, 3, 0, 0]);
        mainCtx.fill();
        // Flashing amber roof beacon
        if (Math.sin(time * 12) > 0) {
          mainCtx.fillStyle = '#f59e0b';
          mainCtx.beginPath();
          mainCtx.arc(0, -19.5, 3.2, 0, Math.PI * 2);
          mainCtx.fill();
        }
        mainCtx.fillStyle = '#0f172a';
        mainCtx.beginPath();
        mainCtx.arc(-10, -1, 3.5, 0, Math.PI * 2);
        mainCtx.arc(10, -1, 3.5, 0, Math.PI * 2);
        mainCtx.fill();
        mainCtx.restore();
      }

      mainCtx.restore();
    }
  }

  // =========================================================================
  // 3. FOREGROUND TARMAC SERVICE TRENCH & CHECK-IN KIOSK CHECKPOINT
  // =========================================================================
  function drawAirportTarmacHazard(ctx, px, py, w, h, time) {
    const viewW = ctx._viewW || 1024;
    if (px + w < -40 || px > viewW + 40) return;

    ctx.save();
    // Recessed concrete apron drainage/fuel trench with yellow-and-black hazard curbing
    const trG = ctx.createLinearGradient(px, py, px, py + h);
    trG.addColorStop(0.0, '#0284c7');
    trG.addColorStop(0.45, '#0369a1');
    trG.addColorStop(1.0, '#0f172a');
    ctx.fillStyle = trG;
    ctx.fillRect(px, py, w, h);

    // Shimmering electric-cyan & amber runway reflection waves
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.78)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 18) {
      const wy = py + 5 + Math.sin(time * 4.5 + (px + x) * 0.05) * 2.8;
      if (x === 0) ctx.moveTo(px + x, wy);
      else ctx.lineTo(px + x, wy);
    }
    ctx.stroke();

    // Yellow/black diagonal hazard curb along top rim of trench
    const stripeStep = 24;
    for (let sx = 0; sx < w; sx += stripeStep) {
      if (px + sx + stripeStep < -20 || px + sx > viewW + 20) continue;
      ctx.fillStyle = (Math.floor(sx / stripeStep) % 2 === 0) ? '#facc15' : '#1e293b';
      ctx.fillRect(px + sx, py - 4, Math.min(stripeStep, w - sx), 4.5);
    }
    ctx.restore();
  }

  function drawAirportCheckpoint(ctx, cp, cx, cy, time) {
    const lit = !!cp.activated;
    const baseY = cy + (cp.h || 32);
    ctx.save();
    ctx.translate(cx + 22, baseY);

    // Floor shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 1, 26, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    if (lit) {
      const halo = ctx.createRadialGradient(0, -42, 4, 0, -42, 54);
      halo.addColorStop(0, 'rgba(74, 222, 128, 0.58)');
      halo.addColorStop(0.6, 'rgba(56, 189, 248, 0.22)');
      halo.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, -42, 54, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sleek Self-Boarding Gate Kiosk Pedestal & Glowing Pass Scanner Arch!
    const bodyG = ctx.createLinearGradient(-15, -72, 15, 0);
    bodyG.addColorStop(0, '#f8fafc');
    bodyG.addColorStop(0.55, '#cbd5e1');
    bodyG.addColorStop(1, '#475569');
    ctx.fillStyle = bodyG;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-14, -68, 28, 68, [6, 6, 2, 2]);
    ctx.fill();
    ctx.stroke();

    // Touchscreen Display
    ctx.fillStyle = lit ? '#064e3b' : '#0f172a';
    ctx.strokeStyle = lit ? '#4ade80' : '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-10, -60, 20, 26, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = lit ? '#4ade80' : '#fde047';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(lit ? '✈✓' : '✈', 0, -43);

    // Printed Boarding Pass Ticket Slot
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-7, -27, 14, 3);
    if (lit) {
      const slide = Math.min(8, ((time * 12) % 10));
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-5, -25, 10, 5 + slide * 0.3);
    }

    // Top LED Status Beacon
    ctx.fillStyle = lit ? '#22c55e' : '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(-9, -73, 18, 5, 2.5);
    ctx.fill();

    ctx.restore();
  }

  // =========================================================================
  // 4. SHOWSTOPPING GOAL GATE: BAGGAGE CART AT OPEN AIRLINER CARGO HOLD!
  //    (عربة الحقائب أمام مخزن الطائرة المفتوح وسير رفع الأمتعة!)
  // =========================================================================
  function drawAirportBaggageGoalGate(ctx, g, gx, gy, time, label) {
    const cartX = gx;
    const cartY = gy;
    const cartW = g.w || 136;
    const cartH = g.h || 90;
    const tarmacY = cartY + cartH;

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // =======================================================================
    // A. COLOSSAL PARKED WIDE-BODY PASSENGER AIRLINER BEHIND THE CART!
    //    With Lower-Forward Cargo Hold Door Wide Open & Warm Lit Hold Interior!
    // =======================================================================
    const planeNoseX = cartX + 435;
    const planeTailX = cartX - 230;
    const bellyY = tarmacY - 56;
    const crownY = tarmacY - 196;

    // 1. Wide tarmac shadow beneath fuselage & wing
    ctx.fillStyle = 'rgba(15, 23, 42, 0.34)';
    ctx.beginPath();
    ctx.ellipse(cartX + 120, tarmacY - 1, 315, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Heavy Multi-Wheel Hydraulic Main & Nose Landing Gear + Yellow Wheel Chocks!
    const drawGear = (strutX, numWheels) => {
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.6;
      ctx.fillRect(strutX - 5, bellyY - 6, 10, tarmacY - bellyY - 10);
      ctx.strokeRect(strutX - 5, bellyY - 6, 10, tarmacY - bellyY - 10);
      // Hydraulic chrome oleo piston
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(strutX - 3, tarmacY - 34, 6, 18);
      for (let wIdx = 0; wIdx < numWheels; wIdx++) {
        const wx = strutX + (wIdx - (numWheels - 1) * 0.5) * 18;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(wx, tarmacY - 13, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(wx, tarmacY - 13, 5.8, 0, Math.PI * 2);
        ctx.fill();
        // Yellow rubber safety wheel chocks on tarmac!
        ctx.fillStyle = '#facc15';
        ctx.fillRect(wx - 15, tarmacY - 5, 7, 5);
        ctx.fillRect(wx + 8, tarmacY - 5, 7, 5);
      }
    };
    drawGear(cartX - 65, 2);
    drawGear(cartX + 325, 2);

    // 3. Soaring Swept Tail Fin (Vertical Stabilizer) Rising on the Left
    const finG = ctx.createLinearGradient(planeTailX - 45, crownY - 125, planeTailX + 85, crownY);
    finG.addColorStop(0.0, '#0284c7');
    finG.addColorStop(0.55, '#0369a1');
    finG.addColorStop(1.0, '#1e3a8a');
    ctx.fillStyle = finG;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(planeTailX + 20, crownY + 14);
    ctx.lineTo(planeTailX - 52, crownY - 118);
    ctx.lineTo(planeTailX - 8, crownY - 118);
    ctx.lineTo(planeTailX + 112, crownY + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Golden winged globe airline crest on tail fin
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.arc(planeTailX + 16, crownY - 56, 20, -0.5, 2.1);
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(planeTailX + 16, crownY - 56, 7, 0, Math.PI * 2);
    ctx.fill();

    // 4. Sculpted 3D Cylindrical Wide-Body Fuselage (Pearl-White, Silver Belly & Royal-Azure Ribbon!)
    const fuseG = ctx.createLinearGradient(0, crownY, 0, bellyY);
    fuseG.addColorStop(0.00, '#ffffff');
    fuseG.addColorStop(0.52, '#f8fafc');
    fuseG.addColorStop(0.76, '#cbd5e1');
    fuseG.addColorStop(1.00, '#64748b');
    ctx.fillStyle = fuseG;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(planeTailX - 24, bellyY - 46);
    ctx.quadraticCurveTo(planeTailX + 35, crownY, planeTailX + 135, crownY);
    ctx.lineTo(planeNoseX - 135, crownY);
    // Aerodynamic Boeing 787 / A350 nose radome curve!
    ctx.bezierCurveTo(planeNoseX - 55, crownY + 4, planeNoseX - 5, bellyY - 82, planeNoseX + 14, bellyY - 42);
    ctx.bezierCurveTo(planeNoseX + 8, bellyY - 8, planeNoseX - 48, bellyY, planeNoseX - 115, bellyY);
    ctx.lineTo(planeTailX + 95, bellyY);
    ctx.quadraticCurveTo(planeTailX + 20, bellyY - 6, planeTailX - 24, bellyY - 46);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Royal-Azure & Gold Airline Cheatline Stripe
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(planeTailX + 65, crownY + 68, planeNoseX - planeTailX - 145, 9);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(planeTailX + 65, crownY + 77, planeNoseX - planeTailX - 145, 3);

    // Airline Title & Oval Illuminated Passenger Cabin Windows
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ROYAL WINGS • رحلة العودة ✈', cartX + 42, crownY + 34);

    for (let wx = planeTailX + 88; wx < planeNoseX - 122; wx += 22) {
      // Skip window over forward passenger door
      if (Math.abs(wx - (planeNoseX - 150)) < 18) continue;
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(wx, crownY + 44, 10, 14, 5);
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.roundRect(wx + 1.5, crownY + 45.5, 7, 11, 3.5);
      ctx.fill();
    }

    // Tinted 3D Cockpit Windshields + Subtle Pilot Silhouette
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(planeNoseX - 88, crownY + 38);
    ctx.lineTo(planeNoseX - 42, crownY + 52);
    ctx.lineTo(planeNoseX - 46, crownY + 67);
    ctx.lineTo(planeNoseX - 92, crownY + 62);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
    ctx.beginPath();
    ctx.moveTo(planeNoseX - 66, crownY + 44);
    ctx.lineTo(planeNoseX - 68, crownY + 64);
    ctx.stroke();

    // =======================================================================
    // B. WIDE-OPEN AIRCRAFT CARGO HOLD BAY IN THE FUSELAGE BELLY!
    //    (مكان تخزين الحقائب المفتوح في الطائرة + إضاءة داخلية وحاويات شحن!)
    // =======================================================================
    const holdX = cartX + 128;
    const holdY = bellyY - 62;
    const holdW = 112;
    const holdH = 60;

    // 1. Recessed Warm-Illuminated Cargo Hold Interior Bay
    const holdG = ctx.createLinearGradient(holdX, holdY, holdX, holdY + holdH);
    holdG.addColorStop(0.0, '#451a03');
    holdG.addColorStop(0.35, '#92400e');
    holdG.addColorStop(1.0, '#1e293b');
    ctx.fillStyle = holdG;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(holdX, holdY, holdW, holdH, 5);
    ctx.fill();
    ctx.stroke();

    // Warm golden cargo-bay ceiling floodlights & light cone
    const bayLight = ctx.createRadialGradient(holdX + holdW * 0.5, holdY + 6, 4, holdX + holdW * 0.5, holdY + 32, 72);
    bayLight.addColorStop(0, 'rgba(254, 249, 195, 0.85)');
    bayLight.addColorStop(0.6, 'rgba(251, 191, 36, 0.28)');
    bayLight.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = bayLight;
    ctx.fillRect(holdX + 2, holdY + 2, holdW - 4, holdH - 4);

    // Interior cargo structural ribs & already-loaded suitcases/ULD container inside the airplane belly!
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.4;
    for (let rx = holdX + 18; rx < holdX + holdW - 10; rx += 22) {
      ctx.beginPath();
      ctx.moveTo(rx, holdY + 3);
      ctx.lineTo(rx, holdY + holdH - 4);
      ctx.stroke();
    }
    // Stacked suitcases visible INSIDE the open airplane cargo hold!
    ctx.fillStyle = '#0ea5e9';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.1;
    ctx.fillRect(holdX + 62, holdY + 28, 36, 26);
    ctx.strokeRect(holdX + 62, holdY + 28, 36, 26);
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(holdX + 66, holdY + 14, 28, 14);
    ctx.strokeRect(holdX + 66, holdY + 14, 28, 14);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(holdX + 34, holdY + 34, 26, 20);
    ctx.strokeRect(holdX + 34, holdY + 34, 26, 20);

    // Yellow/black hazard threshold sill along bottom of open cargo hold
    for (let sx = holdX; sx < holdX + holdW; sx += 14) {
      ctx.fillStyle = ((sx - holdX) / 14) % 2 === 0 ? '#facc15' : '#0f172a';
      ctx.fillRect(sx, holdY + holdH - 5, Math.min(14, holdX + holdW - sx), 5);
    }

    // 2. Upward-Swung Hydraulic Fuselage Cargo Door + Twin Chrome Actuator Struts!
    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(holdX - 2, holdY + 2);
    ctx.lineTo(holdX + holdW + 2, holdY + 2);
    ctx.lineTo(holdX + holdW + 10, holdY - 24);
    ctx.lineTo(holdX + 6, holdY - 24);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(holdX + 6, holdY - 24, holdW + 4, 3.2);
    // Hydraulic door struts
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(holdX + 10, holdY + 14); ctx.lineTo(holdX + 14, holdY - 20);
    ctx.moveTo(holdX + holdW - 8, holdY + 14); ctx.lineTo(holdX + holdW + 2, holdY - 20);
    ctx.stroke();

    // 3. Swept Airliner Wing + Massive Under-Wing Turbofan Jet Engine (to the left of the cargo hold!)
    const wingX = cartX - 38;
    const wingY = bellyY - 28;
    const wG = ctx.createLinearGradient(wingX - 110, wingY, wingX + 60, wingY + 24);
    wG.addColorStop(0, '#f8fafc');
    wG.addColorStop(1, '#94a3b8');
    ctx.fillStyle = wG;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(wingX + 58, wingY - 8);
    ctx.lineTo(wingX - 128, wingY + 22);
    ctx.lineTo(wingX - 102, wingY + 27);
    ctx.lineTo(wingX + 72, wingY + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Red/Green wingtip nav strobe
    if (Math.sin(time * 8) > 0) {
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(wingX - 122, wingY + 23, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sculpted Turbofan Jet Engine Cowling & Gently Windmilling Titanium Fan Blades
    const engX = wingX - 12, engY = bellyY - 4;
    const nacG = ctx.createLinearGradient(engX, engY - 24, engX, engY + 24);
    nacG.addColorStop(0, '#0ea5e9');
    nacG.addColorStop(0.5, '#0284c7');
    nacG.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = nacG;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(engX - 34, engY - 20, 62, 38, 10);
    ctx.fill();
    ctx.stroke();
    // Chrome intake lip & spinning fan disc
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(engX + 26, engY - 1, 9, 18.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(engX + 25, engY - 1, 6.5, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.1;
    for (let b = 0; b < 6; b++) {
      const a = time * 2.2 + (b * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(engX + 25, engY - 1);
      ctx.lineTo(engX + 25 + Math.cos(a) * 5.2, engY - 1 + Math.sin(a) * 13.5);
      ctx.stroke();
    }

    // =======================================================================
    // C. INCLINED MOTORIZED BELT-LOADER RAMP FEEDING INTO THE CARGO HOLD!
    // =======================================================================
    const rampBotX = cartX + cartW - 14;
    const rampBotY = tarmacY - 38;
    const rampTopX = holdX + 26;
    const rampTopY = holdY + holdH - 4;

    // White belt-loader support vehicle under ramp
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(rampBotX + 8, tarmacY - 26, 66, 18, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(rampBotX + 22, tarmacY - 7, 7, 0, Math.PI * 2);
    ctx.arc(rampBotX + 60, tarmacY - 7, 7, 0, Math.PI * 2);
    ctx.fill();

    // Inclined conveyor boom + animated climbing rubber cleats + suitcase riding up into plane!
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(rampBotX, rampBotY);
    ctx.lineTo(rampTopX, rampTopY);
    ctx.stroke();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(rampBotX, rampBotY + 5);
    ctx.lineTo(rampTopX, rampTopY + 5);
    ctx.stroke();

    // Animated conveyor cleats & a suitcase gliding up the belt into the cargo hold!
    const beltU = (time * 0.42) % 1;
    for (let k = 0; k < 5; k++) {
      const u = (beltU + k * 0.2) % 1;
      const cxK = rampBotX + (rampTopX - rampBotX) * u;
      const cyK = rampBotY + (rampTopY - rampBotY) * u;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(cxK, cyK - 3, 2.0, 0, Math.PI * 2);
      ctx.fill();
    }
    const bagU = (time * 0.26) % 1;
    const bagX = rampBotX + (rampTopX - rampBotX) * bagU;
    const bagY = rampBotY + (rampTopY - rampBotY) * bagU;
    const rampAng = Math.atan2(rampTopY - rampBotY, rampTopX - rampBotX);
    ctx.save();
    ctx.translate(bagX, bagY - 7);
    ctx.rotate(rampAng);
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-11, -12, 22, 13, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-3, -12, 6, 13);
    ctx.restore();

    // =======================================================================
    // D. THE GOAL GATE ITSELF: OPEN YELLOW AIRPORT BAGGAGE DOLLY CART!
    //    (عربة الحقائب المضيئة — البوابة النهائية التي يقفز إليها مشمشة!)
    // =======================================================================
    // Radiant golden boarding aura welcoming Mashmasha into the baggage cart!
    const aura = ctx.createRadialGradient(
      cartX + cartW * 0.5, cartY + cartH * 0.48, 8,
      cartX + cartW * 0.5, cartY + cartH * 0.48, 92
    );
    aura.addColorStop(0.0, 'rgba(254, 240, 138, 0.72)');
    aura.addColorStop(0.55, 'rgba(56, 189, 248, 0.28)');
    aura.addColorStop(1.0, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cartX + cartW * 0.5, cartY + cartH * 0.48, 92, 0, Math.PI * 2);
    ctx.fill();

    // Tow-bar coupling connecting cart to belt-loader
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4.0;
    ctx.beginPath();
    ctx.moveTo(cartX + cartW - 4, tarmacY - 16);
    ctx.lineTo(rampBotX + 12, tarmacY - 14);
    ctx.stroke();

    // Back steel cage frame of the baggage cart
    ctx.fillStyle = 'rgba(30, 41, 59, 0.58)';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(cartX + 6, cartY + 8, cartW - 12, cartH - 26, 5);
    ctx.fill();
    ctx.stroke();

    // Colorful World-Journey Suitcases Stacked Inside the Cart (leaving a cozy cushioned spot for Mashmasha!)
    // 1) Vintage Cognac-Leather Steamer Trunk with Travel Stickers
    const trkG = ctx.createLinearGradient(cartX + 16, cartY + 34, cartX + 68, cartY + 68);
    trkG.addColorStop(0, '#d97706');
    trkG.addColorStop(1, '#78350f');
    ctx.fillStyle = trkG;
    ctx.strokeStyle = '#291509';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(cartX + 16, cartY + 38, 52, 30, 4);
    ctx.fill();
    ctx.stroke();
    // Brass straps & world stickers (Swiss Red Cross, Blue Eye, Gold Pyramid)
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(cartX + 26, cartY + 38, 4, 30);
    ctx.fillRect(cartX + 54, cartY + 38, 4, 30);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cartX + 35, cartY + 45, 8, 8);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cartX + 48, cartY + 56, 4, 0, Math.PI * 2);
    ctx.fill();

    // 2) Upright Crimson Hard-Shell Spinner Suitcase + Cozy Plush Blanket Nest!
    ctx.fillStyle = '#e11d48';
    ctx.strokeStyle = '#4c0519';
    ctx.beginPath();
    ctx.roundRect(cartX + 88, cartY + 26, 34, 42, 5);
    ctx.fill();
    ctx.stroke();
    // Cozy glowing golden-cream travel cushion right in the middle for Mashmasha!
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cartX + 68, cartY + 62, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rolled-up blue weather tarpaulin curtains at top & sides of baggage cart
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#0c4a6e';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(cartX + 3, cartY + 4, cartW - 6, 11, 5);
    ctx.fill();
    ctx.stroke();
    // Yellow/black high-visibility Airport Baggage Dolly Bed Chassis
    const bedG = ctx.createLinearGradient(cartX, tarmacY - 24, cartX, tarmacY - 11);
    bedG.addColorStop(0, '#facc15');
    bedG.addColorStop(1, '#ca8a04');
    ctx.fillStyle = bedG;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(cartX + 2, tarmacY - 23, cartW - 4, 12, 3);
    ctx.fill();
    ctx.stroke();
    // Reflective red/white safety tape along chassis
    for (let rx = cartX + 10; rx < cartX + cartW - 14; rx += 18) {
      ctx.fillStyle = ((rx - cartX) % 36 < 18) ? '#ef4444' : '#ffffff';
      ctx.fillRect(rx, tarmacY - 19, 10, 4);
    }

    // Heavy-duty dolly wheels on tarmac
    for (const wx of [cartX + 26, cartX + cartW - 26]) {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(wx, tarmacY - 8.5, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(wx, tarmacY - 8.5, 3.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Animated Floating Boarding Call Banner Above the Cart!
    const isEn = window.Game.I18n && window.Game.I18n.isEn();
    const text = isEn ? '🧳 BAGGAGE CART → CARGO HOLD ✈' : (label || '🧳 عربة الحقائب ← إلى مخزن الطائرة ✈');
    const bob = Math.sin(time * 3.0) * 3.5;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    const tw = Math.max(216, ctx.measureText(text).width + 32);
    const bx = cartX + cartW * 0.5 - tw * 0.5;
    const by = cartY - 34 + bob;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.roundRect(bx, by, tw, 24, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.fillText(text, cartX + cartW * 0.5, by + 16);

    ctx.restore();
  }

  // =========================================================================
  // 5. FOREGROUND PLATFORMS & INTERACTIVE AIRPORT MECHANICS
  // =========================================================================
  function drawAirportPlatform(ctx, p, px, py, nv, time) {
    const viewW = ctx._viewW || 1024;
    const visMinX = Math.max(-48, -px - 48);
    const visMaxX = Math.min(p.w + 48, viewW - px + 48);

    // 1. INDOOR GLEAMING TERRAZZO MARBLE CONCOURSE FLOOR (أرضية صالة المطار الرخامية اللامعة)
    if (p.type === 'airport_terminal_floor') {
      ctx.save();
      ctx.translate(px, py);

      // Sleek glass & chrome terminal balustrade running behind open sections
      if (p.w >= 320) {
        const postStep = 72;
        const pStart = Math.max(24, Math.floor(visMinX / postStep) * postStep + 24);
        const pEnd = Math.min(p.w - 24, Math.ceil(visMaxX / postStep) * postStep + 24);
        if (pEnd > pStart) {
          ctx.fillStyle = 'rgba(125, 211, 252, 0.22)';
          ctx.fillRect(pStart, -22, pEnd - pStart, 22);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(pStart, -22);
          ctx.lineTo(pEnd, -22);
          ctx.stroke();
          ctx.fillStyle = '#94a3b8';
          for (let x0 = pStart; x0 <= pEnd; x0 += postStep) {
            ctx.fillRect(x0 - 2, -23, 4, 23);
          }
        }
      }

      // Main polished Calacatta/Terrazzo floor slab
      const flG = ctx.createLinearGradient(0, 0, 0, p.h);
      flG.addColorStop(0.00, '#ffffff');
      flG.addColorStop(0.14, '#e2e8f0');
      flG.addColorStop(0.45, '#94a3b8');
      flG.addColorStop(1.00, '#1e293b');
      ctx.fillStyle = flG;
      ctx.beginPath();
      ctx.roundRect(0, 0, p.w, p.h, [4, 4, 6, 6]);
      ctx.fill();

      // Tactile yellow airport guidance strip & sky-blue LED concourse trim
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(2, 11, p.w - 4, 2.5);
      ctx.fillStyle = '#facc15';
      const tileStep = 48;
      const tStart = Math.max(12, Math.floor(visMinX / tileStep) * tileStep + 12);
      const tEnd = Math.min(p.w - 16, Math.ceil(visMaxX / tileStep) * tileStep + 12);
      for (let tx = tStart; tx <= tEnd; tx += tileStep) {
        ctx.fillRect(tx, 4, 30, 3.2);
        // Brushed-steel floor tile expansion seam
        ctx.fillStyle = 'rgba(71, 85, 105, 0.32)';
        ctx.fillRect(tx - 6, 14, 1.4, p.h - 16);
        // Specular ceiling reflection sheen on terrazzo slab
        ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.beginPath();
        ctx.moveTo(tx + 4, 16);
        ctx.lineTo(tx + 22, 16);
        ctx.lineTo(tx + 12, p.h - 10);
        ctx.lineTo(tx - 4, p.h - 10);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#facc15';
      }

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
      return true;
    }

    // 2. ELEVATED TERMINAL MEZZANINE BALCONY & OUTDOOR JETWAY GANTRY DECK
    if (p.type === 'airport_mezzanine_deck' || p.type === 'airport_jetway_deck') {
      const isOutdoor = p.type === 'airport_jetway_deck';
      ctx.save();
      ctx.translate(px, py);

      // Top safety handrail behind walkway
      ctx.fillStyle = isOutdoor ? 'rgba(250, 204, 21, 0.16)' : 'rgba(56, 189, 248, 0.24)';
      ctx.fillRect(4, -16, p.w - 8, 16);
      ctx.strokeStyle = isOutdoor ? '#facc15' : '#e2e8f0';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(4, -16);
      ctx.lineTo(p.w - 4, -16);
      for (let rx = 12; rx <= p.w - 12; rx += 46) {
        if (rx < visMinX || rx > visMaxX) continue;
        ctx.moveTo(rx, -16);
        ctx.lineTo(rx, 0);
      }
      ctx.stroke();

      // Cantilevered steel deck beam
      const dG = ctx.createLinearGradient(0, 0, 0, p.h);
      dG.addColorStop(0, isOutdoor ? '#cbd5e1' : '#f8fafc');
      dG.addColorStop(0.5, isOutdoor ? '#64748b' : '#94a3b8');
      dG.addColorStop(1, '#1e293b');
      ctx.fillStyle = dG;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(0, 0, p.w, p.h, 4);
      ctx.fill();
      ctx.stroke();

      // Under-deck LED strip or yellow hazard stripe
      ctx.fillStyle = isOutdoor ? '#facc15' : '#38bdf8';
      ctx.fillRect(6, p.h - 4.5, p.w - 12, 2.5);

      ctx.restore();
      return true;
    }

    // 3. ARCHITECTURAL TERMINAL-TO-TARMAC EXIT PORTAL (بوابة الخروج من صالة المطار إلى المدرج!)
    if (p.type === 'airport_exit_portal') {
      ctx.save();
      ctx.translate(px, py);
      const pw = p.w || 130;
      const ph = p.h || 240;

      // Monumental Brushed-Steel & Tinted-Glass Airside Threshold Archway
      const archG = ctx.createLinearGradient(0, 0, pw, 0);
      archG.addColorStop(0, '#f8fafc');
      archG.addColorStop(0.5, '#94a3b8');
      archG.addColorStop(1, '#334155');
      ctx.fillStyle = archG;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.0;
      // Overhead lintel + vertical structural column extending up to ceiling!
      ctx.fillRect(pw * 0.5 - 14, -360, 28, 365);
      ctx.fillRect(0, 0, pw, 44);
      ctx.strokeRect(0, 0, pw, 44);
      // Side jamb pillars leaving wide open automatic doorway below
      ctx.fillRect(0, 44, 18, ph - 44);
      ctx.strokeRect(0, 44, 18, ph - 44);
      ctx.fillRect(pw - 18, 44, 18, ph - 44);
      ctx.strokeRect(pw - 18, 44, 18, ph - 44);

      // Open sliding automatic glass door panels
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1.4;
      ctx.fillRect(18, 46, 18, ph - 48);
      ctx.strokeRect(18, 46, 18, ph - 48);
      ctx.fillRect(pw - 36, 46, 18, ph - 48);
      ctx.strokeRect(pw - 36, 46, 18, ph - 48);

      // Illuminated "AIRSIDE TARMAC ➡" Header Sign + Flashing Amber Apron Beacon!
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(6, 7, pw - 12, 30);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✈ TARMAC • المدرج ➡', pw * 0.5, 26);

      if (Math.sin(time * 8.0) > 0) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(pw - 14, -8, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return true;
    }

    // 4. OUTDOOR HEAVY-DUTY GROOVED CONCRETE & ASPHALT RUNWAY TARMAC (أرضية مدرج وساحة الطائرات)
    if (p.type === 'airport_tarmac_deck') {
      ctx.save();
      ctx.translate(px, py);

      // Yellow/black steel apron safety bollards along back edge
      if (p.w >= 340) {
        const bolStep = 140;
        const bStart = Math.max(36, Math.floor(visMinX / bolStep) * bolStep + 36);
        const bEnd = Math.min(p.w - 36, Math.ceil(visMaxX / bolStep) * bolStep + 36);
        for (let bx = bStart; bx <= bEnd; bx += bolStep) {
          ctx.fillStyle = '#facc15';
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.2;
          ctx.fillRect(bx - 3.5, -18, 7, 19);
          ctx.strokeRect(bx - 3.5, -18, 7, 19);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(bx - 3.5, -13, 7, 4);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(bx - 2.5, -17, 5, 2.5);
        }
      }

      // Heavy-duty airfield concrete & dark asphalt body
      const tmG = ctx.createLinearGradient(0, 0, 0, p.h);
      tmG.addColorStop(0.00, '#94a3b8');
      tmG.addColorStop(0.14, '#64748b');
      tmG.addColorStop(0.45, '#334155');
      tmG.addColorStop(1.00, '#0f172a');
      ctx.fillStyle = tmG;
      ctx.beginPath();
      ctx.roundRect(0, 0, p.w, p.h, 4);
      ctx.fill();

      // Continuous yellow taxiway edge line
      ctx.fillStyle = '#facc15';
      ctx.fillRect(4, 5, p.w - 8, 4);

      // Concrete slab tar joints, red/white apron safety chevrons & glowing green inset taxiway lights!
      const slabStep = 96;
      const sStart = Math.max(24, Math.floor(visMinX / slabStep) * slabStep + 24);
      const sEnd = Math.min(p.w - 24, Math.ceil(visMaxX / slabStep) * slabStep + 24);
      for (let sx = sStart; sx <= sEnd; sx += slabStep) {
        // Tar expansion joint
        ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
        ctx.fillRect(sx, 10, 2, p.h - 12);

        // Glowing green/amber inset runway centerline light
        const pulse = 0.65 + 0.35 * Math.sin(time * 4.5 + sx * 0.04);
        ctx.fillStyle = `rgba(74, 222, 128, ${pulse.toFixed(2)})`;
        ctx.beginPath();
        ctx.ellipse(sx + 48, 3.2, 5.5, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Red/white apron edge block
        ctx.fillStyle = ((sx / slabStep) % 2 === 0) ? '#ef4444' : '#f8fafc';
        ctx.fillRect(sx + 10, 12, 24, 4);
      }

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
      return true;
    }

    // 5. MOVING BAGGAGE CAROUSEL / CONVEYOR BELT (سير الحقائب المتحرك)
    if (p.type === 'airport_conveyor_belt') {
      const dir = p.beltDir || 1;
      const spd = p.beltSpeed || 95;
      ctx.save();
      ctx.translate(px, py);

      // Stainless-steel side housing
      const stG = ctx.createLinearGradient(0, 0, 0, p.h);
      stG.addColorStop(0, '#334155');
      stG.addColorStop(0.45, '#e2e8f0');
      stG.addColorStop(1, '#475569');
      ctx.fillStyle = stG;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(0, 0, p.w, p.h, 10);
      ctx.fill();
      ctx.stroke();

      // Moving black ribbed rubber belt track on top
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(10, 1, p.w - 20, 7);

      const slatStep = 22;
      const shift = (((time * spd * dir) % slatStep) + slatStep) % slatStep;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let lx = 14 + shift; lx < p.w - 16; lx += slatStep) {
        if (lx < visMinX || lx > visMaxX) continue;
        ctx.moveTo(lx - dir * 4, 2);
        ctx.lineTo(lx + dir * 3, 4.5);
        ctx.lineTo(lx - dir * 4, 7);
      }
      ctx.stroke();

      // End rollers
      for (const rx of [11, p.w - 11]) {
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        ctx.arc(rx, p.h * 0.5, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return true;
    }

    // 6. AIRPORT SECURITY X-RAY / LASER ARCHWAY (بوابة التفتيش الليزري في المطار)
    if (p.type === 'airport_security_scanner') {
      const floorY = py + p.h;
      const cleared = (p.clearTimer || 0) > 0;
      const warn = !!p.scanWarn;
      const firing = !!p.scanActive && !cleared;

      ctx.save();
      // Archway pillars & header
      const frG = ctx.createLinearGradient(px, py, px + p.w, py);
      frG.addColorStop(0, '#f8fafc');
      frG.addColorStop(0.5, '#cbd5e1');
      frG.addColorStop(1, '#64748b');
      ctx.fillStyle = frG;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.6;
      ctx.fillRect(px, py, p.w, 22);
      ctx.strokeRect(px, py, p.w, 22);
      ctx.fillRect(px, py + 22, 11, p.h - 22);
      ctx.strokeRect(px, py + 22, 11, p.h - 22);
      ctx.fillRect(px + p.w - 11, py + 22, 11, p.h - 22);
      ctx.strokeRect(px + p.w - 11, py + 22, 11, p.h - 22);

      // Digital LED status bar on arch header
      const ledCol = cleared ? '#22c55e' : firing ? '#ef4444' : warn ? '#f59e0b' : '#38bdf8';
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 8, py + 4, p.w - 16, 14);
      ctx.fillStyle = ledCol;
      ctx.font = 'bold 9.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cleared ? 'VIP CLEAR ✓' : firing ? 'SCANNING!' : warn ? 'WAIT...' : 'SECURITY', px + p.w * 0.5, py + 14.5);

      // Warning dashed pre-beam or Active Laser Curtain
      if (warn && !cleared) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(px + p.w * 0.5, py + 22);
        ctx.lineTo(px + p.w * 0.5, floorY - 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (firing) {
        const beamG = ctx.createLinearGradient(px + 12, 0, px + p.w - 12, 0);
        beamG.addColorStop(0, 'rgba(239, 68, 68, 0.18)');
        beamG.addColorStop(0.5, 'rgba(239, 68, 68, 0.65)');
        beamG.addColorStop(1, 'rgba(239, 68, 68, 0.18)');
        ctx.fillStyle = beamG;
        ctx.fillRect(px + 12, py + 22, p.w - 24, p.h - 24);
        ctx.strokeStyle = '#fecaca';
        ctx.lineWidth = 2.2;
        const sweepY = py + 28 + ((Math.sin(time * 11) * 0.5 + 0.5) * (p.h - 38));
        ctx.beginPath();
        ctx.moveTo(px + 12, sweepY);
        ctx.lineTo(px + p.w - 12, sweepY);
        ctx.stroke();
      }
      ctx.restore();
      return true;
    }

    // 7. BELLHOP LUGGAGE TROLLEY SUITCASE BOUNCE PAD (عربة الحقائب النابضة القافزة!)
    if (p.type === 'airport_suitcase_bounce') {
      const comp = (p.bounceAnim || 0) * 7;
      ctx.save();
      ctx.translate(px, py);

      // Golden brass bellhop birdcage arch & red velvet base platform
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(10, p.h + 32);
      ctx.lineTo(10, -18 + comp * 0.4);
      ctx.arc(p.w * 0.5, -18 + comp * 0.4, p.w * 0.5 - 10, Math.PI, 0);
      ctx.lineTo(p.w - 10, p.h + 32);
      ctx.stroke();

      // Base deck & caster wheels on ground (p.h + 32 -> grounded at 615!)
      ctx.fillStyle = '#b91c1c';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.roundRect(4, p.h + 26, p.w - 8, 8, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1e293b';
      for (const wx of [18, p.w - 18]) {
        ctx.beginPath(); ctx.arc(wx, p.h + 37, 5.5, 0, Math.PI * 2); ctx.fill();
      }

      // Stacked cushioned suitcases compressing elastically on bounce!
      // Bottom trunk
      ctx.fillStyle = '#0284c7';
      ctx.strokeStyle = '#0c4a6e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(14, 12 + comp * 0.6, p.w - 28, 16 - comp * 0.3, 4);
      ctx.fill();
      ctx.stroke();
      // Top bouncy leather suitcase (aligned with walkable top y = 0!)
      const topG = ctx.createLinearGradient(0, comp, 0, 14 + comp * 0.6);
      topG.addColorStop(0, '#fbbf24');
      topG.addColorStop(1, '#d97706');
      ctx.fillStyle = topG;
      ctx.strokeStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(18, comp, p.w - 36, 13, 4);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
      return true;
    }

    // 8. MOVING TARMAC BAGGAGE SHUTTLE & HYDRAULIC CARGO SCISSOR LIFT
    if (p.type === 'airport_baggage_shuttle' || p.type === 'airport_cargo_scissor_lift') {
      const isScissor = p.type === 'airport_cargo_scissor_lift';
      ctx.save();
      ctx.translate(px, py);

      if (isScissor) {
        // Hydraulic X-Scissor arms extending down toward tarmac base
        const baseScreenY = (p.endY !== undefined ? Math.max(p.startY || p.y, p.endY) : p.y + 110) - (p.y) + 46;
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 4.2;
        ctx.beginPath();
        ctx.moveTo(18, p.h); ctx.lineTo(p.w - 18, baseScreenY);
        ctx.moveTo(p.w - 18, p.h); ctx.lineTo(18, baseScreenY);
        ctx.stroke();
        ctx.fillStyle = '#334155';
        ctx.fillRect(10, baseScreenY, p.w - 20, 8);
      }

      // Walkable yellow/steel airport shuttle platform deck
      const shG = ctx.createLinearGradient(0, 0, 0, p.h);
      shG.addColorStop(0, '#fde047');
      shG.addColorStop(0.55, '#eab308');
      shG.addColorStop(1, '#854d0e');
      ctx.fillStyle = shG;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(0, 0, p.w, p.h, 5);
      ctx.fill();
      ctx.stroke();

      // Anti-slip rubber tread & side reflective chevrons
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(8, 0.5, p.w - 16, 3.5);
      for (let sx = 12; sx < p.w - 16; sx += 22) {
        ctx.fillStyle = (sx % 44 < 22) ? '#1e293b' : '#ef4444';
        ctx.fillRect(sx, p.h - 7, 11, 4);
      }

      if (!isScissor) {
        // Subtle electric hover/rail rollers underneath shuttle
        ctx.fillStyle = '#38bdf8';
        for (const wx of [22, p.w * 0.5, p.w - 22]) {
          ctx.beginPath(); ctx.arc(wx, p.h + 3, 4.5, 0, Math.PI * 2); ctx.fill();
        }
      }

      ctx.restore();
      return true;
    }

    // 9. TARMAC JET-BLAST ENGINE TEST POD (توربين نفاث على المدرج بنفث حراري متقطع!)
    if (p.type === 'airport_jet_blast') {
      const dir = p.blastDir || -1;
      const baffled = (p.baffleTimer || 0) > 0;
      const warn = !!p.jetWarn && !baffled;
      const firing = !!p.jetFiring && !baffled;
      const cx = px + p.w * 0.5;
      const floorY = py + p.h;

      ctx.save();
      ctx.translate(cx, floorY);
      ctx.scale(dir, 1);

      // Heavy steel test pylon anchored to tarmac
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-16, -24, 32, 24);
      ctx.strokeRect(-16, -24, 32, 24);

      // Sculpted Turbofan Test Nacelle (nozzle pointing +X in local scaled space!)
      const podG = ctx.createLinearGradient(0, -58, 0, -20);
      podG.addColorStop(0, '#f8fafc');
      podG.addColorStop(0.55, '#cbd5e1');
      podG.addColorStop(1, '#475569');
      ctx.fillStyle = podG;
      ctx.beginPath();
      ctx.roundRect(-28, -56, 56, 34, 9);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-24, -42, 48, 6);

      // Exhaust nozzle cone
      ctx.fillStyle = firing ? '#f97316' : '#1e293b';
      ctx.beginPath();
      ctx.moveTo(26, -52);
      ctx.lineTo(36, -46);
      ctx.lineTo(36, -32);
      ctx.lineTo(26, -26);
      ctx.closePath();
      ctx.fill();

      // Top beacon light
      ctx.fillStyle = baffled ? '#22c55e' : (firing || warn) ? '#ef4444' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, -60, 4.5, 0, Math.PI * 2);
      ctx.fill();

      if (baffled) {
        // Raised yellow blast-deflector safety shield when Meowed!
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#0f172a';
        ctx.fillRect(38, -60, 7, 58);
        ctx.strokeRect(38, -60, 7, 58);
      } else if (warn) {
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.75)';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(38, -39);
        ctx.lineTo(152, -39);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (firing) {
        const len = 148 + Math.sin(time * 28) * 10;
        const jG = ctx.createLinearGradient(36, -39, 36 + len, -39);
        jG.addColorStop(0.0, 'rgba(56, 189, 248, 0.92)');
        jG.addColorStop(0.35, 'rgba(251, 191, 36, 0.80)');
        jG.addColorStop(1.0, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = jG;
        ctx.beginPath();
        ctx.moveTo(36, -47);
        ctx.lineTo(36 + len, -56);
        ctx.lineTo(36 + len, -22);
        ctx.lineTo(36, -31);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
      return true;
    }

    // 10. FIRST-CLASS VIP LOUNGE & FRIENDLY FLIGHT ATTENDANT KIOSK (+1 💜 & +30 🪙!)
    if (p.type === 'airport_coffee_kiosk') {
      const gifted = !!p.giftedHeart;
      ctx.save();
      ctx.translate(px + p.w * 0.5, py + p.h);

      // Marble & royal-blue VIP First-Class Lounge Counter + Friendly Flight Attendant!
      ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 52, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Smiling Flight Attendant in Navy Suit, Gold Wings Pin & Red Silk Scarf behind counter
      const bobA = Math.sin(time * 2.5) * 1.2;
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.roundRect(-10, -64 + bobA, 20, 26, 5);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-4, -63 + bobA); ctx.lineTo(4, -63 + bobA); ctx.lineTo(7, -54 + bobA); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(0, -73 + bobA, 8.5, 0, Math.PI * 2);
      ctx.fill();
      // Flight attendant pillbox cap with gold wing badge!
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.roundRect(-8.5, -83 + bobA, 17, 6.5, 3);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-3, -81 + bobA, 6, 2);

      // Curved white-marble & gold VIP counter front
      const cG = ctx.createLinearGradient(-44, -40, 44, 0);
      cG.addColorStop(0, '#ffffff');
      cG.addColorStop(0.55, '#e2e8f0');
      cG.addColorStop(1, '#94a3b8');
      ctx.fillStyle = cG;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-42, -38, 84, 38, [8, 8, 2, 2]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-42, -22, 84, 8);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 9.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ VIP LOUNGE ✦', 0, -15);

      if (!gifted) {
        const bob = Math.sin(time * 3.2) * 3;
        ctx.fillStyle = 'rgba(2, 132, 199, 0.94)';
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-30, -104 + bob, 60, 17, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9.5px sans-serif';
        ctx.fillText('🎫 +💜 🪙', 0, -92 + bob);
      }

      ctx.restore();
      return true;
    }

    return false;
  }

  // Register Stage 29 cache eviction so switching stages frees 100% of Airport bitmaps!
  const prevPurgeAirport = Art.purgeInactiveStageCaches;
  Art.purgeInactiveStageCaches = function (activeTheme) {
    if (typeof prevPurgeAirport === 'function') prevPurgeAirport(activeTheme);
    if (activeTheme !== 'airport') {
      for (const c of [airportCloudSprite, airportIndoorCache, airportTarmacHorizonCache, airportTarmacMidCache]) {
        if (c) { c.width = 0; c.height = 0; }
      }
      airportCloudSprite = null;
      airportIndoorCache = null;
      airportTarmacHorizonCache = null;
      airportTarmacMidCache = null;
    }
  };

  Art.drawAirportSkyAndHorizon = drawAirportSkyAndHorizon;
  Art.drawAirportMidground = drawAirportMidground;
  Art.drawAirportTarmacHazard = drawAirportTarmacHazard;
  Art.drawAirportBaggageGoalGate = drawAirportBaggageGoalGate;

  Art.drawPlatform = function (ctx, p, px, py, nv, time) {
    if (p && p.type && p.type.startsWith('airport_')) {
      if (drawAirportPlatform(ctx, p, px, py, nv, time)) return;
    }
    return prevDrawPlatform(ctx, p, px, py, nv, time);
  };

  Art.drawCheckpoint = function (ctx, cp, cx, cy, time, theme, stageNum) {
    if (theme === 'airport' || stageNum === 29) {
      drawAirportCheckpoint(ctx, cp, cx, cy, time);
      return;
    }
    return prevDrawCheckpoint(ctx, cp, cx, cy, time, theme, stageNum);
  };
})();
