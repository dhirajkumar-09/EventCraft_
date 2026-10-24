/**
 * Mock Data Templates for Fallback Event Planning Engine
 */

export function getMockVendors(numericBudget, currencySymbol, daysRemaining, cuisineDiet) {
  return [
    {
      id: 'v-1',
      vendorType: 'Venue Manager',
      whatToAskOrNegotiate:
        'Clarify curfew timing, loud-music permissions, sound decibel limits, and outside vendor corkage fees.',
      estimatedCostRange: `${currencySymbol}${Math.round(numericBudget * 0.2).toLocaleString()} - ${currencySymbol}${Math.round(numericBudget * 0.26).toLocaleString()}`,
      bookingDeadline: daysRemaining > 45 ? 'T-45 Days' : 'Immediate (Within 48h)'
    },
    {
      id: 'v-2',
      vendorType: 'Caterer & Beverage Service',
      whatToAskOrNegotiate: `Request mandatory menu tasting for ${cuisineDiet} cuisine, staff-to-guest ratio (minimum 1:12), and mineral water provisions.`,
      estimatedCostRange: `${currencySymbol}${Math.round(numericBudget * 0.24).toLocaleString()} - ${currencySymbol}${Math.round(numericBudget * 0.3).toLocaleString()}`,
      bookingDeadline: daysRemaining > 30 ? 'T-30 Days' : 'This Week'
    },
    {
      id: 'v-3',
      vendorType: 'Floral & Thematic Decorator',
      whatToAskOrNegotiate:
        'Negotiate mock-up stage presentation, floral freshness guarantee, and generator backup for fairy lights.',
      estimatedCostRange: `${currencySymbol}${Math.round(numericBudget * 0.11).toLocaleString()} - ${currencySymbol}${Math.round(numericBudget * 0.16).toLocaleString()}`,
      bookingDeadline: daysRemaining > 30 ? 'T-25 Days' : 'Immediate'
    },
    {
      id: 'v-4',
      vendorType: 'Photographer & Cinematographer',
      whatToAskOrNegotiate:
        'Confirm exact camera models, drone flying permissions, deliverable timeline for raw cuts, and teaser reel commitment.',
      estimatedCostRange: `${currencySymbol}${Math.round(numericBudget * 0.08).toLocaleString()} - ${currencySymbol}${Math.round(numericBudget * 0.12).toLocaleString()}`,
      bookingDeadline: daysRemaining > 40 ? 'T-35 Days' : 'Urgent'
    },
    {
      id: 'v-5',
      vendorType: 'Live DJ & Sound Engineer',
      whatToAskOrNegotiate:
        'Check library of regional hits, dual wireless mics, sound console redundancy, and overtime hourly rates.',
      estimatedCostRange: `${currencySymbol}${Math.round(numericBudget * 0.04).toLocaleString()} - ${currencySymbol}${Math.round(numericBudget * 0.07).toLocaleString()}`,
      bookingDeadline: daysRemaining > 20 ? 'T-15 Days' : 'This Week'
    }
  ];
}

export function getMockPersonalizedIdeas(
  eventType,
  cuisineDiet,
  isJaipur,
  isMumbai,
  specialRequests
) {
  const decor = [
    `Grand entrance archway adorned with marigold cascades and brass lanterns (${isJaipur ? 'Rajasthani Jharokha motif' : 'Contemporary floral trellis'}).`,
    `Statement photo-opportunity backdrop with glowing neon celebration signage and fairylight curtaining.`,
    `Intimate lounge seating with low brass tables, velvet bolsters, and fragrant jasmine centerpieces.`
  ];

  if (specialRequests && specialRequests.trim()) {
    decor.push(
      `Bespoke celebration feature tailored to your request: "${specialRequests.trim()}".`
    );
  }

  return {
    decor,
    menu: [
      {
        course: 'Welcome Beverages & Street Eats',
        items: [
          isMumbai
            ? 'Spiced Kokum Fizz & Mumbai Cutting Chai'
            : 'Kesariya Thandai & Marigold Mojito',
          'Truffle Infused Paneer Tikka Pops',
          'Mini Palak Patta Chaat with Pomegranate Pearls'
        ]
      },
      {
        course: 'Signature Live Counters',
        items: [
          cuisineDiet === 'veg' || cuisineDiet === 'jain'
            ? 'Wood-Fired Dal Baati Counter & Ker Sangri'
            : 'Live Charcoal Tandoor & Galouti Kebabs',
          'Artisanal Pasta in Parmesan Wheel',
          'Crispy Lotus Stem in Sweet Chili Glaze'
        ]
      },
      {
        course: 'Celebration Grand Buffet',
        items: [
          'Royal Awadhi Dum Biryani (Fragrant Saffron & Spices)',
          'Slow-Cooked Dal Makhani with Garlic Naan',
          'Wild Mushroom & Baby Corn Medley'
        ]
      },
      {
        course: 'Decadent Desserts & Mithai',
        items: [
          'Live Hot Jalebi with Saffron Rabdi',
          'Pistachio Baklava with Rose Petal Ice Cream',
          'Filter Coffee Mousse Tartlets'
        ]
      }
    ],
    gamesOrActivities: [
      'Interactive Audio Guestbook: Vintage rotary phone where guests record heartfelt voice messages.',
      'Cultural Flashmob or Choreographed Surprise: Sangeet dance segment coordinated with core family members.',
      'Custom Trivia & Memory Wall: Rapid-fire couple/celebrant trivia quiz with customized celebration medals.'
    ],
    music: [
      'Acoustic Welcome Hour: Live Sitar or Saxophone renditions of timeless romantic and celebratory melodies.',
      'High-Tempo Sangeet/Party: Upbeat Bollywood, Punjabi pop, and global chartbusters curated for an electrifying dance floor.',
      'Soulful Wind-Down: Instrumental retro acoustic lounge sounds as guests enjoy late-night dessert.'
    ],
    returnGifts: [
      'Artisanal handcrafted brass diffusers paired with locally sourced organic saffron tea and wild forest honey.',
      'Eco-friendly plantable seed-paper celebration diary with a custom engraved wooden pen.',
      'Custom miniature sweet boxes containing silver-leaf artisanal pistachio laddoos.'
    ],
    wowMoments: [
      {
        title: 'Cold-Pyro & Holographic Entry Portal',
        description:
          'Synchronized sparkular cold-pyrotechnic fountain archways and dry-ice fog creating a magical entrance without smoke or heat.',
        executionTip:
          'Rehearse audio cue with DJ at least 2 hours before guest arrivals for exact timing with entry music.'
      },
      {
        title: 'Live Scent-Bar & Memory Memento',
        description:
          'An interactive perfumery counter where guests formulate their personalized roll-on celebration attar/scent to take home.',
        executionTip:
          'Position near the exit lounge so guests enjoy the experience during departures.'
      },
      {
        title: 'Midnight Fireworks & Sky Lantern Spectacle',
        description:
          'An eco-friendly low-noise aerial light celebration or unified candlelight moment set to emotional acoustic score.',
        executionTip: 'Pre-clear open-air clearance with local venue security.'
      }
    ]
  };
}

export function getMockRunSheet() {
  return [
    {
      id: 'rs-1',
      time: '03:00 PM - 04:30 PM',
      activity: 'Vendor Production & Decor Load-In Inspection',
      owner: 'Production Lead & Decorator',
      notes:
        'Test power generator backup, verify sound consoles, check floral freshness and table linens.'
    },
    {
      id: 'rs-2',
      time: '05:00 PM - 06:00 PM',
      activity: 'Sound Check & Family Portrait Photography',
      owner: 'Cinematographer & Lead Coordinator',
      notes:
        'Capture staged family portraits and couple aesthetics prior to guest arrival while makeup is pristine.'
    },
    {
      id: 'rs-3',
      time: '06:30 PM - 07:30 PM',
      activity: 'Guest Welcome, Red Carpet Entry & Signature Cocktails',
      owner: 'Hospitality Host & Beverage Manager',
      notes: 'Acoustic sitar/sax music live, welcome drinks circulated, audio guestbook active.'
    },
    {
      id: 'rs-4',
      time: '07:45 PM - 08:30 PM',
      activity: 'Grand Ceremonial Entry & Stage Speeches / Rituals',
      owner: 'Master of Ceremonies & Planner',
      notes: 'Trigger cold-pyro fountain cues on exact music drop. Emcee welcomes gathering.'
    },
    {
      id: 'rs-5',
      time: '08:30 PM - 10:30 PM',
      activity: 'Gourmet Dinner Buffet & Electrifying Dance Floor',
      owner: 'DJ & Executive Chef',
      notes:
        'Ensure all live counters are staffed; transition soundscape to high-energy dance party.'
    },
    {
      id: 'rs-6',
      time: '10:30 PM - 11:30 PM',
      activity: 'Midnight Finale, Return Favor Distribution & Farewells',
      owner: 'Hospitality Lead',
      notes: 'Gift counters open; coordinate guest valet retrieval and transport assistance.'
    }
  ];
}

export function getMockBackupPlan() {
  return [
    {
      id: 'bp-1',
      risk: 'Unseasonal Rain / Weather Disruptions',
      severity: 'High',
      triggerSigns: 'Barometer drop or dark clouds 4 hours prior; humidity spikes above 85%.',
      mitigation:
        'Pre-contract waterproof German hanger canopy and prepare indoor banquet hall as immediate seamless secondary backup.'
    },
    {
      id: 'bp-2',
      risk: 'Primary Power Grid or Generator Interruption',
      severity: 'High',
      triggerSigns: 'Flickering stage lights or sound console brownout.',
      mitigation:
        'Mandate dual silent diesel generators (250 KVA) connected on automatic changeover switch (AMF panel) with dedicated technician onsite.'
    },
    {
      id: 'bp-3',
      risk: 'Key Vendor Delay or No-Show (DJ / Host / Makeup)',
      severity: 'Medium',
      triggerSigns: 'Vendor not checked in 90 minutes before their designated call time.',
      mitigation:
        'Maintain pre-briefed backup vendor roster on standby with emergency contacts programmed into lead coordinator phone.'
    }
  ];
}
