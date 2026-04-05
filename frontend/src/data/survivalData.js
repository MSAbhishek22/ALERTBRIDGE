export const SURVIVAL_CATEGORIES = [
  { id: 'first_aid', label: 'FIRST AID', emoji: '🚑' },
  { id: 'water', label: 'WATER', emoji: '💧' },
  { id: 'shelter', label: 'SHELTER', emoji: '🏕️' },
  { id: 'protect', label: 'PROTECT', emoji: '🛡️' },
  { id: 'signal', label: 'SIGNAL', emoji: '🆘' },
];

export const SURVIVAL_GUIDES = {
  first_aid: [
    {
      icon: '❤️', title: 'CPR — Someone Stopped Breathing',
      steps: [
        'Lay them on their back on flat ground',
        'Tilt head back, lift chin — open airway',
        'Pinch nose shut, give 2 slow breaths into mouth',
        'Push chest hard and fast — 30 times (center of chest)',
        'Repeat: 2 breaths + 30 pushes until help arrives',
      ],
    },
    {
      icon: '🩸', title: 'Stop Heavy Bleeding',
      steps: [
        'Press hard on wound with clean cloth or shirt',
        'Do NOT remove cloth — add more on top if soaked',
        'Elevate the injured limb above heart level',
        'Keep pressing — minimum 10 minutes without checking',
        'If arm/leg: tie cloth tightly above wound',
      ],
    },
    {
      icon: '🔥', title: 'Treat Burns',
      steps: [
        'Cool burn immediately with cold (not ice) running water — 20 minutes',
        'Do NOT use butter, toothpaste, or ice',
        'Cover loosely with clean dry cloth',
        'Do NOT pop any blisters',
        'Get medical help if burn is larger than palm',
      ],
    },
    {
      icon: '🦴', title: 'Broken Bone',
      steps: [
        'Do NOT try to straighten the bone',
        'Immobilize with sticks/boards on both sides',
        'Tie gently with cloth — not too tight',
        'Check fingers/toes for circulation every 10 min',
        'Keep person still, keep them warm',
      ],
    },
  ],

  water: [
    {
      icon: '💧', title: 'Boiling Water',
      steps: [
        'Collect water in any container',
        'Bring to FULL ROLLING BOIL (big bubbles)',
        'Boil for minimum 1 minute',
        'At high altitude (mountain areas): boil 3 minutes',
        'Let cool covered, store in clean closed vessel',
      ],
    },
    {
      icon: '☀️', title: 'SODIS (Solar Purification)',
      steps: [
        'Fill clear plastic PET bottle with water',
        'Shake for 30 seconds (adds oxygen)',
        'Place in direct sunlight on reflective surface',
        'Leave for 6 hours (full sun) or 2 days (cloudy)',
        'Water is safe to drink — free, zero fuel needed',
      ],
    },
    {
      icon: '🧊', title: 'Improvised Filter',
      desc: 'Layer in bottle from top to bottom:',
      steps: [
        'Layer 1: Grass or cloth (catches large debris)',
        'Layer 2: Fine sand (filters particles)',
        'Layer 3: Coarse sand (pre-filter)',
        'Layer 4: Small stones or charcoal (improves taste)',
        '⚠️ This removes particles — STILL boil after filtering',
      ],
    },
    {
      icon: '⚠️', title: 'Signs of Unsafe Water',
      desc: 'DO NOT drink water that is:',
      steps: [
        'Smells bad or unusual',
        'Has oil film or rainbow sheen on surface',
        'Is warm or hot from ground',
        'Has dead fish or animals nearby',
        'Looks brown/grey after flooding',
      ],
    },
  ],

  shelter: [
    {
      icon: '⛺', title: 'Emergency Camp Setup',
      steps: [
        'Find high ground, away from flood water, trees, cliffs',
        'Look for natural windbreak (hill, rock face)',
        'Make ground sheet FIRST — plastic sheet, leaves, anything dry',
        'Build walls from sticks — lean-to style against wind direction',
        'Cover roof with leaves/plastic, weigh down edges with rocks',
      ],
    },
    {
      icon: '🌡️', title: 'Stay Warm Without Fire',
      steps: [
        'Dry clothes are priority #1 — wet = dangerous cold',
        'Layer: newspaper/dry leaves between two cloth layers = insulation',
        'Cover head — 40% body heat lost through head',
        'Huddle with others — body heat shared',
        'Eat if you have food — digestion generates heat',
        'Keep moving arms and legs — prevents hypothermia',
      ],
    },
    {
      icon: '🔥', title: 'Build a Safe Fire',
      steps: [
        'Clear 3-foot circle of all dry material (fire safety ring)',
        'Build in wind-sheltered spot but with ventilation above',
        'Tinder layer: dry grass, paper, thin twigs',
        'Kindling layer: finger-thick sticks in crisscross pattern',
        'Fuel: thicker logs once fire is established',
        'NEVER leave unattended. Have water/dirt ready to extinguish',
      ],
    },
  ],

  protect: [
    {
      icon: '🌀', title: 'Cyclone — What To Do',
      desc: 'BEFORE storm arrives:',
      steps: [
        'Move to strongest room (no windows) — interior bathroom or hallway',
        'Lie flat on floor if no strong room available',
        'Stay AWAY from windows, glass, exterior walls',
        'If outside: lie flat in ditch or low ground, hold on. Never shelter under trees.',
        'Wait for ALL CLEAR — eye of storm = false safety',
        'After: watch for downed power lines',
      ],
    },
    {
      icon: '🌊', title: 'Flash Flood Survival',
      steps: [
        'Move to HIGH GROUND immediately — never wait',
        '15cm (6 inches) of moving water can knock you down',
        '60cm (2 feet) can float a car',
        'If caught in water: float on back, feet forward',
        'Do NOT try to walk/drive through moving floodwater',
        'After flood: assume all water is contaminated',
      ],
    },
    {
      icon: '⚡', title: 'Lightning Safety',
      desc: 'If outdoors when lightning starts:',
      steps: [
        '30-30 rule: if gap between lightning and thunder < 30 sec → take cover',
        'Avoid: trees, poles, open fields, hilltops, water',
        'In open field: crouch low, feet together, hands on ears, do NOT lie flat',
        'In car: safe — stay inside, don\'t touch metal',
        'Indoors: away from windows, unplug electronics',
      ],
    },
    {
      icon: '🏔️', title: 'Landslide Warning Signs',
      desc: 'Watch for these BEFORE a landslide:',
      steps: [
        'Cracks appearing in ground or walls',
        'Tilting trees, poles, fences',
        'Rumbling sounds from hillside',
        'Sudden change in stream colour (becomes muddy)',
        'Doors and windows sticking suddenly',
        'If you see ANY of these → move away from slope immediately',
      ],
    },
  ],

  signal: [
    {
      icon: '🪞', title: 'Signal Mirror (Sunlight)',
      steps: [
        'Any shiny surface works: phone screen, metal, foil',
        'Hold at arm\'s length, tilt to catch sunlight',
        'Aim reflection toward rescue aircraft/boat',
        'Flash in groups of 3 (SOS pattern)',
        'Visible up to 10 miles in clear conditions',
      ],
    },
    {
      icon: '✈️', title: 'Ground to Air Signals',
      desc: 'If in open area, make large symbols with rocks/logs:',
      steps: [
        'V = Need Help',
        'X = Need Medical Aid',
        '→ = Traveling this direction',
        '✓ = All OK',
        'Minimum 10 metres long — must be visible from air. Use high contrast materials.',
      ],
    },
    {
      icon: '📣', title: 'Sound Signals',
      desc: 'International distress signal: 3 of anything',
      steps: [
        '3 whistle blasts — pause — repeat',
        '3 horn honks — pause — repeat',
        '3 gunshots — pause — repeat',
        '3 fires in a triangle (visible from air)',
        'Sound carries farther at dawn and dusk. In jungle: signal from open area.',
      ],
    },
    {
      icon: '🔥', title: 'Signal Fire',
      steps: [
        'Location: highest visible open ground',
        'Daytime: add GREEN leaves, rubber, plastic → creates dark smoke',
        'Night: bright flames visible — keep dry wood ready',
        '3 fires in triangle = international distress',
        'Once rescue sighted: wave with bright cloth, maintain fire',
      ],
    },
  ],
};
