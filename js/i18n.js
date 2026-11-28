window.Game = window.Game || {};

window.Game.I18n = (function () {
  const LANG_KEY = 'theWayHome_lang';
  let currentLang = 'ar';
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'ar') currentLang = saved;
  } catch (e) {}

  const DICT = {
    ar: {
      page_title: 'رحلة العودة: سبعة أرواح | The Way Home',
      menu_title: 'رحلة العودة',
      menu_sub: 'سبعة أرواح • 29 مرحلة',
      menu_shop: 'المتجر',
      menu_quick_play: 'العب المرحلة {n} ▶',
      menu_stars_title: 'النجوم المجمّعة',
      menu_coins_title: 'رصيد العملات',
      menu_grid_aria: 'اختيار المرحلة',
      chapter_1_title: '🏠 القصة الأولى • رحلة المدينة (1 – 15)',
      chapter_2_title: '🌍 القصة الثانية • رحلة حول العالم (16 – 29)',
      lang_btn_short: 'EN',
      lang_btn_title: 'Switch to English',
      lang_label_full: 'اللغة',
      lang_tile_label: 'English',

      hud_shield_title: 'درع الحماية نشط',
      hud_treats_title: 'الأسماك',
      hud_coins_title: 'العملات الذهبية',
      hud_nv_title: 'الرؤية الليلية (E)',
      hud_meow_title: 'المواء المشتت (Q)',
      hud_pause_title: 'إيقاف مؤقت (P)',

      touch_left: 'يسار',
      touch_right: 'يمين',
      touch_stealth: 'تسلل',
      touch_night: 'ليل',
      touch_meow: 'مواء',
      touch_jump: 'قفز',

      skip_video: 'تخطي ⏭',
      rotate_hint: '🔄 أدر الهاتف أفقياً لأفضل تجربة لعب',

      gameover_revive: '❤️ متابعة ({cost} 🪙)',
      gameover_restart: 'إعادة المرحلة ↻',
      gameover_menu: 'المراحل ⊞',

      stage_n: 'المرحلة {n}',
      pause_title: 'إيقاف مؤقت',
      pause_resume: '▶ متابعة اللعب',
      pause_refill: '❤️ استعادة كل الأرواح ({cost} 🪙)',
      pause_restart: '↻ إعادة',
      pause_shop: '🛒 المتجر',
      pause_menu: '⊞ المراحل',
      tuner_aria: 'إعدادات أزرار التحكم',
      tuner_size: '🎮 حجم الأزرار',
      tuner_small: 'صغير',
      tuner_large: 'كبير',
      tuner_opacity: '✨ شفافية الأزرار',
      tuner_transparent: 'شفاف',
      tuner_clear: 'واضح',
      tuner_cat_mode: '🐱 مظهر القطة',
      cat_mode_sprite: 'صورة أصلية',
      cat_mode_proc: 'رسم برمجي',
      toggle_music: 'الموسيقى',
      toggle_sfx: 'المؤثرات',
      toggle_dim: 'التعتيم',
      toggle_guide: 'الدليل',

      shop_title: '🛒 متجر مشمشة',
      shop_subtitle: 'طوّر قدراتك وافتح الأزياء والمراحل بالعملات',
      shop_tab_upgrades: '⚡ التطويرات',
      shop_tab_skins: '✨ الأزياء',
      shop_tab_boosts: '🎟️ المزايا',
      shop_maxed: '✓ مكتمل',
      shop_equipped: '✓ مُجهّز',
      shop_equip: 'تجهيز',
      shop_unlock_cost: 'فتح • {cost}',
      shop_daily_title: 'هدية اليوم المجانية',
      shop_daily_desc: 'احصل على {amount} عملة ذهبية مجانية كل يوم',
      shop_daily_claimed: '✓ تم الاستلام',
      shop_unlock_all: 'جميع المراحل مفتوحة!',
      shop_unlock_next: 'فتح المرحلة {n} فوراً',
      shop_unlock_desc: 'تذكرة فتح المرحلة التالية مباشرة بدون انتظار',
      shop_unlocked_badge: '✓ مفتوحة',
      shop_refill_title: 'جرعة استعادة الأرواح',
      shop_refill_desc: 'تملأ جميع أرواح مشمشة والدرع فوراً في المرحلة الحالية',
      shop_refill_full: '✓ ممتلئة',
      close_aria: 'إغلاق',

      guide_title: '📖 دليل اللعب',
      guide_goal_h: '🎯 الهدف',
      guide_goal_p: 'ساعد <strong>مشمشة</strong> على الوصول إلى البوابة في نهاية كل مرحلة (29 مرحلة متنوعة)، واجمع <strong>العملات الذهبية 🪙</strong> لتطوير قدراتك وفتح الأزياء، واجمع <strong>3 أسماك 🐟</strong> في كل مرحلة لتحقيق <strong>3 نجوم ★</strong>.',
      guide_ctrl_h: '🎮 التحكم والمهارات المحدّثة',
      guide_move: '<strong>الحركة (A / D):</strong> الجري يميناً ويساراً والتنقل فوق المنصات والعجلات الدوارة',
      guide_jump: '<strong>القفز وتسلق الجدار (Space / W):</strong> القفز العادي، وعند الجدران المميزة بلوحة <strong>«⬆ تسلق الجدار»</strong> يمكنك التشبث والقفز المتبادل بين الجدران للصعود',
      guide_stealth: '<strong>التسلل والنظر للأسفل (Shift / S):</strong> يقلل مدى رؤية الكلاب والدوبرمان، ويثبّت توازنك على الحبال وفي الرياح، <strong>وعند الاستمرار بالضغط عليه في مكان مرتفع تنزل الكاميرا للأسفل لكشف ما تحتك!</strong>',
      guide_meow: '<strong>المواء الطارد للأعداء (Q):</strong> يدفع ويبعد <strong>جميع الأعداء القريبين</strong> (الكلاب، الدوبرمان، الراكون، الثعالب، القنافذ، والطيور) للخلف ويغلق النباتات المفترسة مؤقتاً',
      guide_nv: '<strong>الرؤية الليلية (E):</strong> تكشف المنصات والأسماك السرية وتوضح مخاريط رؤية الكلاب والدوبرمان',
      guide_cp: '<strong>نقاط الحفظ والبيئة:</strong> بيوت الحفظ آمنة تماماً ولا يصلها أي خطر (مع قفل لحظي للحركة عند العودة إليها)، والفطر الإسفنجي والزهور البنفسجية ونوافير المياه تقذفك للأعلى',
      guide_pause: '<strong>الإيقاف المؤقت والإعدادات (P / Esc):</strong> لضبط <strong>حجم وشفافية أزرار التحكم</strong>، تبديل اللغة، الصوت، أو المتجر',

      end_stage_done: 'المرحلة {n} مكتملة',
      end_final_badge: 'المرحلة {n} • نهاية الرحلة',
      end_title_win: 'مرحلة رائعة! 🎉',
      end_title_final: 'عادت مشمشة إلى المنزل! 🏠🏆',
      end_title_world_final: 'اكتملت رحلة حول العالم! 🌍🏆',
      end_next_stage: 'المرحلة {n} ▶',
      end_stats_html: 'الوقت: <strong>{time} ث</strong> • الأرواح: <strong>{lives}/{maxLives} ❤️</strong> • الأسماك: <strong>{treats}/3 🐟</strong><br/><span class="end-coin-highlight">+{total} 🪙 ({earned} جُمعت + {bonus} مكافأة)</span>',
      end_out_of_lives: 'انتهت الأرواح',
      end_try_again: 'حاول مرة أخرى! 🐱',
      end_fail_tip: 'استخدم <strong>المواء</strong> لتشتيت الكلاب وطوّر قدراتك من <strong>المتجر 🛒</strong>.',

      toast_mode_proc: 'تم التبديل إلى الرسم البرمجي 🐱✨',
      toast_mode_sprite: 'تم التبديل إلى الصورة الأصلية 🐱',
      toast_lang_switched: 'تم التبديل إلى اللغة العربية 🇸🇦',
      toast_stage_locked: 'أكمل المرحلة السابقة أو افتحها من المتجر 🛒',
      toast_upgraded: 'تم تطوير {name} إلى المستوى {lv}! ⚡',
      toast_skin_bought: 'تم فتح {name}! ✨',
      toast_skin_equipped: 'تم تجهيز {name}',
      toast_daily_claimed: 'تمت إضافة +{amount} عملة ذهبية! 🎁',
      toast_stage_unlocked: 'تم فتح المرحلة {n}! 🔓',
      toast_lives_refilled: 'تمت استعادة جميع الأرواح! ❤️',
      toast_no_coins: 'عملات غير كافية! 🪙',

      popup_meow: 'مواء!',
      popup_repel: '💨 ابتعد!',
      popup_checkpoint: 'نقطة حفظ ✓',
      popup_revive: '❤️ عودة للحياة!',
      popup_shield_ready: '🛡️ درع جاهز!',
      popup_shield_blocked: '🛡️ صدّ الدرع!',

      sign_wall_climb: 'تسلق الجدار',
      sign_metro: 'محطة الأنفاق المركزية',
      gate_default: 'بوابة الخروج ←',
    },

    en: {
      page_title: 'The Way Home: Seven Lives',
      menu_title: 'The Way Home',
      menu_sub: 'Seven Lives • 29 Stages',
      menu_shop: 'Shop',
      menu_quick_play: 'Play Stage {n} ▶',
      menu_stars_title: 'Collected Stars',
      menu_coins_title: 'Gold Coins',
      menu_grid_aria: 'Select Stage',
      chapter_1_title: '🏠 Story 1 • The City Journey (1–15)',
      chapter_2_title: '🌍 Story 2 • Around the World (16–29)',
      lang_btn_short: 'عربي',
      lang_btn_title: 'التبديل إلى العربية',
      lang_label_full: 'Language',
      lang_tile_label: 'عربي',

      hud_shield_title: 'Guardian Shield Active',
      hud_treats_title: 'Fish Treats',
      hud_coins_title: 'Gold Coins',
      hud_nv_title: 'Night Vision (E)',
      hud_meow_title: 'Repelling Meow (Q)',
      hud_pause_title: 'Pause (P)',

      touch_left: 'Left',
      touch_right: 'Right',
      touch_stealth: 'Sneak',
      touch_night: 'Night',
      touch_meow: 'Meow',
      touch_jump: 'Jump',

      skip_video: 'Skip ⏭',
      rotate_hint: '🔄 Rotate your phone to landscape for the best experience',

      gameover_revive: '❤️ Continue ({cost} 🪙)',
      gameover_restart: 'Retry Stage ↻',
      gameover_menu: 'Stages ⊞',

      stage_n: 'Stage {n}',
      pause_title: 'Paused',
      pause_resume: '▶ Resume Game',
      pause_refill: '❤️ Restore All Lives ({cost} 🪙)',
      pause_restart: '↻ Restart',
      pause_shop: '🛒 Shop',
      pause_menu: '⊞ Stages',
      tuner_aria: 'Touch Control Settings',
      tuner_size: '🎮 Button Size',
      tuner_small: 'Small',
      tuner_large: 'Large',
      tuner_opacity: '✨ Opacity',
      tuner_transparent: 'Light',
      tuner_clear: 'Solid',
      tuner_cat_mode: '🐱 Cat Style',
      cat_mode_sprite: 'Original Art',
      cat_mode_proc: 'Code Vector',
      toggle_music: 'Music',
      toggle_sfx: 'SFX',
      toggle_dim: 'Dim BG',
      toggle_guide: 'Guide',

      shop_title: '🛒 Mashmasha Shop',
      shop_subtitle: 'Upgrade abilities & unlock outfits and stages with coins',
      shop_tab_upgrades: '⚡ Upgrades',
      shop_tab_skins: '✨ Outfits',
      shop_tab_boosts: '🎟️ Perks',
      shop_maxed: '✓ Maxed',
      shop_equipped: '✓ Equipped',
      shop_equip: 'Equip',
      shop_unlock_cost: 'Unlock • {cost}',
      shop_daily_title: 'Free Daily Gift',
      shop_daily_desc: 'Claim {amount} free gold coins every single day',
      shop_daily_claimed: '✓ Claimed',
      shop_unlock_all: 'All Stages Unlocked!',
      shop_unlock_next: 'Unlock Stage {n} Now',
      shop_unlock_desc: 'Instant ticket to unlock the next stage right away',
      shop_unlocked_badge: '✓ Open',
      shop_refill_title: 'Full Lives Potion',
      shop_refill_desc: 'Restores all lives and Guardian Shield in the current stage',
      shop_refill_full: '✓ Full',
      close_aria: 'Close',

      guide_title: '📖 How to Play',
      guide_goal_h: '🎯 Goal',
      guide_goal_p: 'Help <strong>Mashmasha</strong> reach the exit gate in all 29 handcrafted stages. Collect <strong>Gold Coins 🪙</strong> to upgrade skills and unlock outfits, and find all <strong>3 Fish Treats 🐟</strong> per stage to earn <strong>3 Stars ★</strong>.',
      guide_ctrl_h: '🎮 Controls & Skills',
      guide_move: '<strong>Move (A / D):</strong> Run left & right across rooftops, ropes, and moving platforms',
      guide_jump: '<strong>Jump & Wall Climb (Space / W):</strong> Jump normally, and on walls marked <strong>"⬆ Wall Climb"</strong> cling and wall-jump upward to climb high ledges',
      guide_stealth: '<strong>Sneak & Look Down (Shift / S):</strong> Shrinks guard dog sight cones, stabilizes balance on ropes/wind, and <strong>holding it on high platforms pans the camera down to peek below!</strong>',
      guide_meow: '<strong>Repelling Meow (Q):</strong> Pushes back <strong>all nearby enemies</strong> (dogs, dobermans, raccoons, foxes, hedgehogs, birds) and temporarily closes snapping plants',
      guide_nv: '<strong>Night Vision (E):</strong> Reveals secret platforms & fish treats and highlights guard dog vision cones',
      guide_cp: '<strong>Checkpoints & World:</strong> Save houses are 100% safe zones, and bouncy mushrooms, purple flowers & water jets launch you skyward',
      guide_pause: '<strong>Pause & Settings (P / Esc):</strong> Adjust <strong>button size & opacity</strong>, switch language, audio, or open the Shop',

      end_stage_done: 'Stage {n} Complete',
      end_final_badge: 'Stage {n} • Journey Complete',
      end_title_win: 'Awesome Stage! 🎉',
      end_title_final: 'Mashmasha Made It Home! 🏠🏆',
      end_title_world_final: 'Around the World Complete! 🌍🏆',
      end_next_stage: 'Stage {n} ▶',
      end_stats_html: 'Time: <strong>{time}s</strong> • Lives: <strong>{lives}/{maxLives} ❤️</strong> • Fish: <strong>{treats}/3 🐟</strong><br/><span class="end-coin-highlight">+{total} 🪙 ({earned} collected + {bonus} bonus)</span>',
      end_out_of_lives: 'Out of Lives',
      end_try_again: 'Try Again! 🐱',
      end_fail_tip: 'Use <strong>Meow</strong> to repel enemies and upgrade your abilities in the <strong>Shop 🛒</strong>.',

      toast_mode_proc: 'Switched to Code Vector Cat 🐱✨',
      toast_mode_sprite: 'Switched to Original Sprite Cat 🐱',
      toast_lang_switched: 'Switched to English 🇬🇧',
      toast_stage_locked: 'Complete the previous stage or unlock it in the Shop 🛒',
      toast_upgraded: 'Upgraded {name} to Level {lv}! ⚡',
      toast_skin_bought: 'Unlocked {name}! ✨',
      toast_skin_equipped: 'Equipped {name}',
      toast_daily_claimed: 'Added +{amount} gold coins! 🎁',
      toast_stage_unlocked: 'Unlocked Stage {n}! 🔓',
      toast_lives_refilled: 'All lives restored! ❤️',
      toast_no_coins: 'Not enough coins! 🪙',

      popup_meow: 'Meow!',
      popup_repel: '💨 Back off!',
      popup_checkpoint: 'Checkpoint ✓',
      popup_revive: '❤️ Revived!',
      popup_shield_ready: '🛡️ Shield Ready!',
      popup_shield_blocked: '🛡️ Shield Blocked!',

      sign_wall_climb: 'Wall Climb',
      sign_metro: 'Central Metro Station',
      gate_default: 'Exit Gate →',
    },
  };

  // Shop English translations keyed by upgrade/skin id
  const SHOP_EN = {
    upgrades: {
      lives: {
        name: 'Extra Lives',
        desc: 'Increases Mashmasha’s maximum lives in every stage',
        effectLabels: ['6/7 Lives', '7/7 Lives', '8/8 Lives', '9/9 Lives'],
      },
      agility: {
        name: 'Nimble Leap',
        desc: 'Smoothly boosts running speed and jump height',
        effectLabels: ['Standard', '+6% Speed & Jump', '+11% Speed & Jump', '+16% Speed & Jump'],
      },
      shield: {
        name: 'Guardian Shield',
        desc: 'Absorbs a full hit without losing a life and auto-recharges',
        effectLabels: ['Inactive', 'Recharges 35s', 'Recharges 24s', 'Recharges 16s'],
      },
      magnet: {
        name: 'Coin Magnet',
        desc: 'Automatically pulls nearby gold coins toward Mashmasha',
        effectLabels: ['Inactive', '105px Range', '165px Range', '235px Range'],
      },
      lucky: {
        name: 'Lucky Bell & Meow',
        desc: 'Multiplies coin value and shortens Meow cooldown',
        effectLabels: ['x1 Coins • 2.4s', 'x1.5 Coins • 1.8s', 'x2 Coins • 1.4s', 'x2.5 Coins • 1.0s'],
      },
    },
    skins: {
      classic: { name: 'Classic Mashmasha', perk: 'The beloved classic tabby look' },
      crown: { name: 'Royal Crown', perk: 'Shining golden crown with warm sparkle trail' },
      scarf: { name: 'Ninja Scarf', perk: 'Flowing crimson scarf waving in the wind' },
      starlight: { name: 'Starlight Halo', perk: 'Glowing golden stars smoothly trailing behind' },
      cyber: { name: 'Cyber Visor', perk: 'Futuristic holographic cyan HUD visor' },
      wings: { name: 'Angel Wings', perk: 'Radiant wings + gentle glide when holding Jump' },
    },
  };

  // Dynamic Arabic -> English mapping for hit reasons & stage gate labels
  const DYNAMIC_EN = {
    'عضّة كلب! -1 ❤️': 'Dog Bite! -1 ❤️',
    'عضّة جرذ! -1 ❤️': 'Rat Bite! -1 ❤️',
    'أشواك القنفذ! -1 ❤️': 'Hedgehog Spikes! -1 ❤️',
    'هجوم غراب! -1 ❤️': 'Crow Attack! -1 ❤️',
    'كماشة سرطان! -1 ❤️': 'Crab Pinch! -1 ❤️',
    'هجوم نورس! -1 ❤️': 'Seagull Swoop! -1 ❤️',
    'هجوم راكون! -1 ❤️': 'Raccoon Attack! -1 ❤️',
    'انقضاض بومة! -1 ❤️': 'Owl Dive! -1 ❤️',
    'خفاش النفق! -1 ❤️': 'Tunnel Bat! -1 ❤️',
    'طائرة مراقبة! -1 ❤️': 'Security Drone! -1 ❤️',
    'صعقة كهربائية! -1 ❤️': 'Electric Shock! -1 ❤️',
    'شعاع ليزر! -1 ❤️': 'Laser Beam! -1 ❤️',
    'شرارة لحام! -1 ❤️': 'Welding Spark! -1 ❤️',
    'ماء عميق! -1 ❤️': 'Deep Water! -1 ❤️',
    'سقوط! -1 ❤️': 'Fell Down! -1 ❤️',
    'روبوت الحراسة! -1 ❤️': 'Guard Bot! -1 ❤️',
    'كاشف الليزر! -1 ❤️': 'Laser Detector! -1 ❤️',
    'انقضاض البجع! -1 ❤️': 'Pelican Swoop! -1 ❤️',
    'الثعلب الماكر! -1 ❤️': 'Sly Fox! -1 ❤️',
    'خنفساء الساعة! -1 ❤️': 'Clockwork Beetle! -1 ❤️',
    'الظربان الليلي! -1 ❤️': 'Night Skunk! -1 ❤️',
    'سحابة الظربان! -1 ❤️': 'Skunk Cloud! -1 ❤️',
    'ثعبان البحر الكهربائي! -1 ❤️': 'Electric Eel! -1 ❤️',
    'ذراع الأخطبوط! -1 ❤️': 'Octopus Tentacle! -1 ❤️',
    'عضّة نبتة فينوس! -1 ❤️': 'Venus Trap Bite! -1 ❤️',
    'فراشة القمر السامة! -1 ❤️': 'Toxic Moon Moth! -1 ❤️',
    'لسعة نحلة! -1 ❤️': 'Bee Sting! -1 ❤️',
    'العنكبوت الآلي! -1 ❤️': 'Cyber Spider! -1 ❤️',
    'قرص البلازما! -1 ❤️': 'Plasma Saw! -1 ❤️',
    'هجوم الغرير! -1 ❤️': 'Badger Attack! -1 ❤️',
    'انقضاض الصقر! -1 ❤️': 'Hawk Dive! -1 ❤️',
    'عربة صيانة الجسر! -1 ❤️': 'Bridge Rover! -1 ❤️',
    'عضّة كلب الدوبرمان! -1 ❤️': 'Doberman Bite! -1 ❤️',
    'انزلاق البطريق! -1 ❤️': 'Penguin Slide! -1 ❤️',
    'هجوم الفقمة! -1 ❤️': 'Seal Attack! -1 ❤️',
    'سقوط رقاقة جليد! -1 ❤️': 'Falling Icicle! -1 ❤️',
    'كرة ثلج عملاقة! -1 ❤️': 'Giant Snowball! -1 ❤️',
    'قرد الدراجة الأحادية! -1 ❤️': 'Unicycle Monkey! -1 ❤️',
    'المهرج الآلي! -1 ❤️': 'Jester Automaton! -1 ❤️',
    'حلقة النار! -1 ❤️': 'Ring of Fire! -1 ❤️',
    'زئير الأسد! -1 ❤️': 'Circus Lion! -1 ❤️',
    'لدغة العقرب! -1 ❤️': 'Scorpion Sting! -1 ❤️',
    'أفعى الرمال! -1 ❤️': 'Sand Viper! -1 ❤️',
    'صقر الصحراء! -1 ❤️': 'Desert Falcon! -1 ❤️',
    'إعصار الرمال! -1 ❤️': 'Dust Devil! -1 ❤️',
    'الراكون المشاغب! -1 ❤️': 'Tanuki Rascal! -1 ❤️',
    'حارس شيبا! -1 ❤️': 'Shiba Guard! -1 ❤️',
    'غراب الساموراي! -1 ❤️': 'Samurai Crow! -1 ❤️',
    'دمية داروما! -1 ❤️': 'Daruma Roller! -1 ❤️',
    'مفتش القطار! -1 ❤️': 'Rail Inspector! -1 ❤️',
    'بومة البريد! -1 ❤️': 'Mail Owl! -1 ❤️',
    'جمرة الفحم! -1 ❤️': 'Coal Spark! -1 ❤️',
    'مهرج كرنفال البندقية! -1 ❤️': 'Venice Carnival Jester! -1 ❤️',
    'سرطان القناة! -1 ❤️': 'Canal Crab! -1 ❤️',
    'نورس البندقية! -1 ❤️': 'Venice Gull! -1 ❤️',
    'جرس البندقية المتأرجح! -1 ❤️': 'Swinging Venice Bell! -1 ❤️',
    'بودل باريس! -1 ❤️': 'Paris Poodle! -1 ❤️',
    'خباز باريس! -1 ❤️': 'Paris Baker! -1 ❤️',
    'حمامة باريس! -1 ❤️': 'Paris Pigeon! -1 ❤️',
    'قرد أطلس المشاغب! -1 ❤️': 'Atlas Macaque! -1 ❤️',
    'تاجر سوق مراكش! -1 ❤️': 'Marrakech Merchant! -1 ❤️',
    'لقلق القصبة! -1 ❤️': 'Kasbah White Stork! -1 ❤️',
    'نمر اليوكاتان! -1 ❤️': 'Yucatán Jaguar! -1 ❤️',
    'حارس معبد المايا! -1 ❤️': 'Mayan Temple Guardian! -1 ❤️',
    'طائر الكيتزال! -1 ❤️': 'Resplendent Quetzal! -1 ❤️',
    'سهم الأوبسيديان! -1 ❤️': 'Obsidian Blowgun Dart! -1 ❤️',
    'أشواك الغابة! -1 ❤️': 'Jungle Briar Thorns! -1 ❤️',
    'ماعز سانتوريني الجبلي! -1 ❤️': 'Santorini Mountain Goat! -1 ❤️',
    'حارس الأكروبوليس الإغريقي! -1 ❤️': 'Greek Hoplite Guard! -1 ❤️',
    'بومة أثينا الحكيمة! -1 ❤️': 'Owl of Athena! -1 ❤️',
    'نظرة ميدوسا المتحجرة! أشِح بنظرك أو انحنِ -1 ❤️': 'Medusa’s Petrifying Gaze! Look away or crouch -1 ❤️',
    'القرص الأولمبي المرتدّ! -1 ❤️': 'Boomerang Olympic Discus! -1 ❤️',
    'صاعقة زيوس السماوية! -1 ❤️': 'Zeus’s Sky Thunderbolt! -1 ❤️',
    'معبد الأكروبوليس • اليونان': 'ACROPOLIS • GREECE',
    'أشواك النيص البري في بتّير! -1 ❤️': 'Battir Crested Porcupine! -1 ❤️',
    'الخنزير البري في وادي المخرور! -1 ❤️': 'Wadi al-Makhrour Wild Boar! -1 ❤️',
    'طائر الهدهد البري المتوّج! -1 ❤️': 'Crowned Palestinian Hoopoe! -1 ❤️',
    'عقرب صخور قلعة بتّير! -1 ❤️': 'Battir Cliff Scorpion! -1 ❤️',
    'جمر فرن الطابون المشتعل! انتظر أو موء لإغلاق الغطاء -1 ❤️': 'Blazing Taboon Oven Embers! Wait or Meow -1 ❤️',
    'أشواك الصبر الفلسطيني! اقفز من فوقها أو موء لقطف الثمر -1 ❤️': 'Prickly-Pear Cactus Spines! Jump or Meow for fruit -1 ❤️',
    'شلال قنطرة المعدود المتدفق! اعبر وقت الهدوء أو موء -1 ❤️': 'Rushing Roman Aqueduct Cascade! Dash between surges or Meow -1 ❤️',
    'قطار القدس–يافا ١٨٩٢ السريع! اعبر من الجسر الحجري العلوي -1 ❤️': '1892 Jerusalem–Jaffa Express! Use the stone footbridge -1 ❤️',
    'رواق عين البلد • بتّير': 'AIN AL-BALAD • BATTIR',
    'الوبر الصخري على السلاسل الحجرية! -1 ❤️': 'Battir Cliff Rock Hyrax! -1 ❤️',
    'صقر العوسق فوق وادي بتّير! -1 ❤️': 'Wadi al-Makhrour Falcon! -1 ❤️',
    'حجر معصرة الزيتون في بتّير! -1 ❤️': 'Battir Olive-Press Millstone! -1 ❤️',
    'حجر معصرة الزيتون! انتبه لهبوط الثقل -1 ❤️': 'Olive-Press Counterweight! Watch the slam -1 ❤️',
    'بخار قاطرة بتّير ١٨٩٢! انحنِ خلف السنسلة أو موء للإشارة -1 ❤️': '1892 Locomotive Steam! Crouch behind wall or Meow -1 ❤️',
    'موجة سقي قناة المعدود! اقفز فوق الموجة -1 ❤️': 'Ma’dud Irrigation Wave! Jump over the crest -1 ❤️',
    '💧 ارتفع ماء البركة الرومانية!': '💧 Roman Pool Water Raised!',
    '💧 انخفض ماء البركة!': '💧 Roman Pool Water Lowered!',
    '🫒 ارتفعت سلة معصرة الزيتون!': '🫒 Olive Basket Hoisted!',
    'قنطرة عين البلد • بتّير': 'AIN AL-BALAD • BATTIR',
    '🌿 بوابة عين البلد في بتّير!': '🌿 Ain al-Balad Heritage Gate!',
    'كلب كانغال التركي! -1 ❤️': 'Turkish Kangal Dog! -1 ❤️',
    'تاجر البازار الكبير! -1 ❤️': 'Grand Bazaar Merchant! -1 ❤️',
    'نورس البوسفور! -1 ❤️': 'Bosphorus Seagull! -1 ❤️',
    'حارس قصر توبكابي العثماني! -1 ❤️': 'Topkapı Palace Janissary Guard! -1 ❤️',
    'مقلب عصا بوظة مرعش! اقفز فوقها أو موء لتحويلها لوسادة قفز -1 ❤️': 'Maraş Ice-Cream Trick Paddle! Jump or Meow for a spring pad -1 ❤️',
    'جمر الكستناء المشوية المتطاير! انتظر أو موء لإغلاق الغطاء -1 ❤️': 'Popping Roasted Chestnut Embers! Wait or Meow to close lid -1 ❤️',
    'ترام شارع الاستقلال السريع! اعبر من المظلة العلوية أو انتظر -1 ❤️': 'Speeding Istiklal Streetcar! Take the upper awning or wait -1 ❤️',
    'لهب مشواة رصيف البوسفور! انتظر هدوء الجمر أو موء للتهدئة -1 ❤️': 'Bosphorus Grill Flames! Wait or Meow to close lid -1 ❤️',
    'موجة صهريج ميدوسا الأثري! اقفز فوق الموجة أو موء لكسر السحر -1 ❤️': 'Basilica Cistern Medusa Surge! Jump or Meow -1 ❤️',
    'مبخرة البازار النحاسية المتأرجحة! احسب التوقيت بدقة -1 ❤️': 'Swinging Grand Bazaar Censer! Time your dash -1 ❤️',
    'بخار باخرة مضيق البوسفور! اقفز من طرف الجسر المائل -1 ❤️': 'Bosphorus Steamer Funnel! Leap from the bascule ramp -1 ❤️',
    'بوابة برج غلطة • إسطنبول': 'GALATA PALACE GATE • ISTANBUL',
    'برج غلطة • إسطنبول': 'GALATA TOWER • ISTANBUL',
    'وعل جبال الألب السويسرية! -1 ❤️': 'Swiss Alpine Ibex! -1 ❤️',
    'مرموط المروج الجبلية! -1 ❤️': 'Alpine Meadow Marmot! -1 ❤️',
    'النسر الذهبي السويسري! -1 ❤️': 'Swiss Golden Eagle! -1 ❤️',
    'حارس كسارة البندق الآلي! -1 ❤️': 'Clockwork Nutcracker Guard! -1 ❤️',
    'قرص جبن الإمنتال المتدحرج! اقفز فوقه أو موء لتثبيته -1 ❤️': 'Rolling Emmental Cheese Wheel! Jump or Meow to wedge it -1 ❤️',
    'بندول ساعة الوقواق السويسرية! انتظر أو موء لإخراج العصفور -1 ❤️': 'Swiss Cuckoo Clock Pendulum! Time it or Meow for the perch -1 ❤️',
    'قدر الفوندو السويسري الفوّار! موء لتحويله لجسر جبن -1 ❤️': 'Boiling Swiss Fondue Cauldron! Meow to chill it into a cheese bridge -1 ❤️',
    'انهيار ثلجي من جرس الألب! انحنِ للمرور بهدوء -1 ❤️': 'Alpine Cowbell Avalanche! Crouch to sneak quietly -1 ❤️',
    'ثعلب جبال الألب الثلجي القافز! -1 ❤️': 'Leaping Alpine Snow Fox! -1 ❤️',
    'بومة الساعات السويسرية الميكانيكية! -1 ❤️': 'Swiss Clockwork Brass Owl! -1 ❤️',
    'ترس بومة الساعات السويسرية! -1 ❤️': 'Swiss Clockwork Gear Boomerang! -1 ❤️',
    'محطة غريندلفالد • جبال الألب': 'GRINDELWALD STATION • SWISS ALPS',
    'روبوت أمن المطار! -1 ❤️': 'Airport Security Rover! -1 ❤️',
    'حقيبة سفر ذكية مندفعة! -1 ❤️': 'Runaway Smart-Suitcase! -1 ❤️',
    'كلب التفتيش الجمركي! تسلل أو موء -1 ❤️': 'Customs K9 Dog! Sneak or Meow -1 ❤️',
    'درون فحص المدرج! -1 ❤️': 'Tarmac Inspection Drone! -1 ❤️',
    'عصي توجيه الطائرات! -1 ❤️': 'Aircraft Marshaller Wands! -1 ❤️',
    'ليزر بوابة التفتيش! انتظر الأخضر أو موء -1 ❤️': 'Security Scanner Laser! Wait for green or Meow -1 ❤️',
    'نفث محرك الطائرة النفاث! اقفز فوق الممر العلوي أو موء -1 ❤️': 'Jet Engine Blast! Take the upper catwalk or Meow -1 ❤️',
    '🧳 عربة الحقائب ← إلى مخزن الطائرة ✈': '🧳 BAGGAGE CART → CARGO HOLD ✈',

    'بوابة الخروج ←': 'Exit Gate →',
    'بوابة السوق ←': 'Market Gate →',
    'بوابة الحديقة ←': 'Park Gate →',
    'بوابة البيت 🏡': 'Home Gate 🏡',
    'بوابة الميناء ⚓': 'Harbor Gate ⚓',
    'بوابة القمة 🏙️': 'Summit Gate 🏙️',
    'بوابة المحطة 🚇': 'Station Gate 🚇',
    'بوابة المتحف 🏛️': 'Museum Gate 🏛️',
    'بوابة الجسر 🌉': 'Bridge Gate 🌉',
    'الحي القديم 🕰️': 'Old Town 🕰️',
    'الميناء العاصف ⛈️': 'Storm Harbor ⛈️',
    'البيت الزجاجي 🌿': 'Greenhouse 🌿',
    'أبراج النيون 🌆': 'Neon Towers 🌆',
    'شارع المنزل 🌅': 'Home Street 🌅',
    'شرفة المنزل 🏠': 'Home Balcony 🏠',
    'القلعة الثلجية ❄️': 'Snow Castle ❄️',
    'خيمة العرض الكبرى 🎪': 'Grand Big-Top Tent 🎪',
    'واحة الصحراء الذهبية 🏜️': 'Golden Sahara Oasis 🏜️',
    'بوابة كيوتو الشعبية ⛩️': 'Kyoto Old Town Gate ⛩️',
  };

  // Synchronized translation captions for all 4 cutscene videos
  const VIDEO_CAPTIONS = {
    intro: {
      en: [
        { start: 0.0, end: 2.3, text: 'Mashmasha playfully reaches for a golden butterfly on the balcony…' },
        { start: 2.3, end: 7.4, text: 'Oh no! She slips off the railing and tumbles into the alley below!' },
        { start: 7.4, end: 12.0, text: 'Lives: 6/7 — Seven Lives: The Return Journey' },
      ],
      ar: [],
    },
    gameover: {
      en: [
        { start: 0.0, end: 2.5, text: 'Lives: 0 / 7…' },
        { start: 2.5, end: 15.0, text: 'Mashmasha ran out of lives — It’s okay, try again!' },
      ],
      ar: [],
    },
    win1: {
      en: [
        { start: 0.4, end: 4.1, text: 'After a long journey, Mashmasha finally reaches the front door…' },
        { start: 4.2, end: 11.0, text: 'The door opens to a warm golden welcome home!' },
      ],
      ar: [],
    },
    win2: {
      en: [
        { start: 1.4, end: 15.0, text: 'You won and completed the mission! Mashmasha is safely home.' },
      ],
      ar: [],
    },
  };

  function getLang() {
    return currentLang;
  }

  function isEn() {
    return currentLang === 'en';
  }

  function t(key, vars) {
    const table = DICT[currentLang] || DICT.ar;
    let str = table[key] !== undefined ? table[key] : (DICT.ar[key] !== undefined ? DICT.ar[key] : key);
    if (vars && typeof str === 'string') {
      Object.keys(vars).forEach((k) => {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), String(vars[k]));
      });
    }
    return str;
  }

  function translateDynamic(arText) {
    if (!arText || currentLang !== 'en') return arText;
    return DYNAMIC_EN[arText] || arText;
  }

  function getShopUpgrade(u) {
    if (currentLang !== 'en' || !SHOP_EN.upgrades[u.id]) return u;
    return { ...u, ...SHOP_EN.upgrades[u.id] };
  }

  function getShopSkin(s) {
    if (currentLang !== 'en' || !SHOP_EN.skins[s.id]) return s;
    return { ...s, ...SHOP_EN.skins[s.id] };
  }

  function getVideoCaption(videoKey, timeSec) {
    const cues = VIDEO_CAPTIONS[videoKey] && VIDEO_CAPTIONS[videoKey][currentLang];
    if (!cues || !cues.length) return '';
    for (let i = 0; i < cues.length; i++) {
      if (timeSec >= cues[i].start && timeSec <= cues[i].end) {
        return cues[i].text;
      }
    }
    return '';
  }

  function applyDom() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'en' ? 'ltr' : 'rtl';
    document.title = t('page_title');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
  }

  function setLang(lang) {
    if (lang !== 'ar' && lang !== 'en') return;
    currentLang = lang;
    try {
      localStorage.setItem(LANG_KEY, currentLang);
    } catch (e) {}
    applyDom();
  }

  return {
    getLang,
    isEn,
    setLang,
    t,
    translateDynamic,
    getShopUpgrade,
    getShopSkin,
    getVideoCaption,
    applyDom,
  };
})();
