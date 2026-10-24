/**
 * High-Fidelity Intelligent Fallback Generator
 * Generates rich, culturally sensitive, locally nuanced event plans
 * matching the exact JSON schema and strict budget math.
 */

import { validateAndNormalizeBudget } from '../utils/budgetValidator.js';

export function generateMockEventPlan(input) {
  const {
    eventType = 'Wedding',
    eventDate,
    city = 'Mumbai',
    venueType = 'banquet',
    guestCount = 150,
    totalBudget = 1000000,
    currency = 'INR',
    currencySymbol = '₹',
    cuisineDiet = 'mixed',
    themePreference = 'Royal Elegance',
    traditions = 'Traditional Indian with modern fusion',
    ageGroup = 'All ages (families, kids & elders)',
    specialRequests = ''
  } = input;

  const numericBudget = Math.max(1000, Math.round(Number(totalBudget) || 1000000));
  const guests = Math.max(10, Math.round(Number(guestCount) || 100));

  // Calculate days remaining
  let daysRemaining = 60;
  if (eventDate) {
    const target = new Date(eventDate);
    const today = new Date();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    if (!isNaN(diff) && diff > 0) daysRemaining = diff;
  }

  // City-specific nuances
  const cityLower = (city || '').toLowerCase();
  const isMumbai = cityLower.includes('mumbai') || cityLower.includes('bombay');
  const isDelhi = cityLower.includes('delhi') || cityLower.includes('ncr');
  const isJaipur = cityLower.includes('jaipur') || cityLower.includes('rajasthan');
  const isBangalore = cityLower.includes('bangalore') || cityLower.includes('bengaluru');

  // Palette generation based on event type & theme
  let palette = [
    { name: 'Royal Gold', hex: '#D4AF37' },
    { name: 'Crimson Rose', hex: '#BE123C' },
    { name: 'Champagne Silk', hex: '#FDF6E2' },
    { name: 'Deep Emerald', hex: '#064E3B' },
    { name: 'Warm Terracotta', hex: '#C2410C' }
  ];

  if (eventType.toLowerCase().includes('birthday')) {
    palette = [
      { name: 'Celebration Coral', hex: '#F97316' },
      { name: 'Electric Berry', hex: '#EC4899' },
      { name: 'Golden Spark', hex: '#EAB308' },
      { name: 'Teal Dream', hex: '#14B8A6' },
      { name: 'Midnight Navy', hex: '#1E1B4B' }
    ];
  } else if (eventType.toLowerCase().includes('corporate')) {
    palette = [
      { name: 'Sapphire Navy', hex: '#1E3A8A' },
      { name: 'Executive Platinum', hex: '#94A3B8' },
      { name: 'Luxe Champagne', hex: '#E2E8F0' },
      { name: 'Teal Accent', hex: '#0D9488' }
    ];
  }

  // Suggested Theme
  let themeTitle = `${themePreference || 'Celebratory'} Soirée`;
  if (eventType.toLowerCase().includes('wedding')) {
    themeTitle = isJaipur ? 'Royal Rajputana Heritage Vivah' : 
                 isMumbai ? 'Coastal Luxe Bollywood Glamour' : 
                 'Eternal Blooms & Golden Twilight';
  } else if (eventType.toLowerCase().includes('birthday')) {
    themeTitle = 'Gilded Jubilee & Carnival of Lights';
  } else if (eventType.toLowerCase().includes('baby')) {
    themeTitle = 'Pastel Clouds & Starlight Blessing';
  }

  // Budget calculations
  const rawCategories = [
    {
      category: 'Venue & Infrastructure',
      amount: Math.round(numericBudget * 0.24),
      percentage: 24,
      note: `${venueType.toUpperCase()} venue rental in prime ${city}, including security and AC generator backup`
    },
    {
      category: 'Catering & Beverages',
      amount: Math.round(numericBudget * 0.28),
      percentage: 28,
      note: `Full multi-course ${cuisineDiet} buffet with live specialty counters for ~${guests} guests (~${currencySymbol}${Math.round((numericBudget * 0.28) / guests)}/guest)`
    },
    {
      category: 'Decor, Florals & Lighting',
      amount: Math.round(numericBudget * 0.14),
      percentage: 14,
      note: `Themed entrance arch, stage backdrop, fairy light canopies and fresh seasonal floral arrangements`
    },
    {
      category: 'Photography & Videography',
      amount: Math.round(numericBudget * 0.10),
      percentage: 10,
      note: `2 Candid photographers + 1 traditional cinematic videographer + teaser reel within 48h`
    },
    {
      category: 'Entertainment & Music',
      amount: Math.round(numericBudget * 0.06),
      percentage: 6,
      note: `Professional live DJ/Emcee, sound console, wireless mics, and ambient uplighting`
    },
    {
      category: 'Attire, Hair & Makeup',
      amount: Math.round(numericBudget * 0.04),
      percentage: 4,
      note: `Stylist, professional makeup artist, and coordinating celebratory wardrobe`
    },
    {
      category: 'Invitations & Digital Stationery',
      amount: Math.round(numericBudget * 0.02),
      percentage: 2,
      note: `Animated WhatsApp digital invites, personalized RSVP portal, and printed welcome board`
    },
    {
      category: 'Guest Transport & Logistics',
      amount: Math.round(numericBudget * 0.02),
      percentage: 2,
      note: `Designated concierge, airport/station transfer support, and valet parking coordination`
    },
    {
      category: 'Emergency Contingency (10%)',
      amount: Math.round(numericBudget * 0.10),
      percentage: 10,
      note: `Vital 10% reserve for last-minute guest additions, overtime charges, or weather adaptions`
    }
  ];

  const budgetResult = validateAndNormalizeBudget(rawCategories, numericBudget, currency, currencySymbol);

  // Timeline countdown adapted to days remaining
  const timeline = generateAdaptiveTimeline(daysRemaining, eventType);

  // Vendor Checklist
  const vendorChecklist = [
    {
      id: 'v-1',
      vendorType: 'Venue Manager',
      whatToAskOrNegotiate: 'Clarify curfew timing, loud-music permissions, sound decibel limits, and outside vendor corkage fees.',
      estimatedCostRange: `${currencySymbol}${Math.round(numericBudget * 0.20).toLocaleString()} - ${currencySymbol}${Math.round(numericBudget * 0.26).toLocaleString()}`,
      bookingDeadline: daysRemaining > 45 ? 'T-45 Days' : 'Immediate (Within 48h)'
    },
    {
      id: 'v-2',
      vendorType: 'Caterer & Beverage Service',
      whatToAskOrNegotiate: `Request mandatory menu tasting for ${cuisineDiet} cuisine, staff-to-guest ratio (minimum 1:12), and mineral water provisions.`,
      estimatedCostRange: `${currencySymbol}${Math.round(numericBudget * 0.24).toLocaleString()} - ${currencySymbol}${Math.round(numericBudget * 0.30).toLocaleString()}`,
      bookingDeadline: daysRemaining > 30 ? 'T-30 Days' : 'This Week'
    },
    {
      id: 'v-3',
      vendorType: 'Themed Decor & Floral Designer',
      whatToAskOrNegotiate: 'Ask for 3D render sketch of stage/entrance, check if exotic flowers are local vs imported to avoid heat wilt, verify cleanup SLA.',
      estimatedCostRange: `${currencySymbol}${Math.round(numericBudget * 0.12).toLocaleString()} - ${currencySymbol}${Math.round(numericBudget * 0.16).toLocaleString()}`,
      bookingDeadline: daysRemaining > 30 ? 'T-30 Days' : 'Next 5 Days'
    },
    {
      id: 'v-4',
      vendorType: 'Candid Photographer & Videographer',
      whatToAskOrNegotiate: 'Verify raw footage ownership, turnaround time for 60-second teaser reel, and equipment redundancy (backup cameras/drones).',
      estimatedCostRange: `${currencySymbol}${Math.round(numericBudget * 0.08).toLocaleString()} - ${currencySymbol}${Math.round(numericBudget * 0.12).toLocaleString()}`,
      bookingDeadline: daysRemaining > 20 ? 'T-20 Days' : 'Immediate'
    },
    {
      id: 'v-5',
      vendorType: 'DJ, Emcee & Sound Engineer',
      whatToAskOrNegotiate: 'Submit a strict "Do Not Play" list, verify backup microphones, lapel mic for vows/toasts, and PPL/IPRS license coverage.',
      estimatedCostRange: `${currencySymbol}${Math.round(numericBudget * 0.05).toLocaleString()} - ${currencySymbol}${Math.round(numericBudget * 0.08).toLocaleString()}`,
      bookingDeadline: daysRemaining > 15 ? 'T-15 Days' : 'This Week'
    },
    {
      id: 'v-6',
      vendorType: 'Hair, Makeup & Draping Artist',
      whatToAskOrNegotiate: 'Book a prior trial session, confirm airbrush vs HD products, and ask about touch-up kit availability on event day.',
      estimatedCostRange: `${currencySymbol}${Math.round(numericBudget * 0.03).toLocaleString()} - ${currencySymbol}${Math.round(numericBudget * 0.05).toLocaleString()}`,
      bookingDeadline: daysRemaining > 15 ? 'T-14 Days' : 'Within 3 Days'
    }
  ];

  // Personalized Ideas
  const personalizedIdeas = {
    decor: [
      `Fairy-lit canopy entrance adorned with cascading marigolds and tuberose (rajnigandha) for welcoming aromatics.`,
      `Customized photobooth backdrop featuring illuminated 3D neon initials with artisanal brass lanterns.`,
      `Table centerpieces with floating candles in brass urli bowls sprinkled with rose petals and warm fairy lights.`,
      `Sustainable fabric drapes in ${palette[0].name} and ${palette[1].name} replacing single-use plastic signage.`
    ],
    menu: [
      {
        course: 'Welcome Beverages & Coolers',
        items: [
          'Chilled Kokum & Mint Spiced Spritzer',
          'Saffron-Infused Badam Kesar Thandai (Dairy/Oat Milk)',
          'Zesty Lemongrass Ginger Fizz'
        ]
      },
      {
        course: 'Live Interactive Food Stations',
        items: [
          'Artisanal Chaat Counter (Palak Patta & Nitro Sev Puri)',
          'Tandoori & Dim Sum Live Griddle (Truffle Paneer / Herb Skewers)',
          'Woodfired Pizza & Mezze Platter'
        ]
      },
      {
        course: 'Lavish Main Course Feast',
        items: [
          cuisineDiet.toLowerCase().includes('veg') ? 'Paneer Lababdar & Dum Aloo Kashmiri' : 'Awadhi Murgh Biryani & Dal Bukhara',
          'Slow-Cooked Dal Makhani with Garlic Naan & Kulcha',
          'Subz Nizami Handi with Saffron Basmati Pilaf'
        ]
      },
      {
        course: 'Decadent Desserts & Mithai',
        items: [
          'Warm Baked Jalebi with Saffron Rabri mousse',
          'Nitro Ice Cream live station with pistachio crunch',
          'Assorted Belgian Chocolate Paan bites'
        ]
      }
    ],
    gamesOrActivities: [
      `"Memory Lane Trivia": Interactive live smartphone quiz about the host family with humorous rapid-fire rounds.`,
      `"Flash Mob / Surprise Choreography": Coordinated high-energy 3-minute dance mashup with close friends and family.`,
      `"Audio Guestbook Phone": A vintage rotary telephone where guests pick up and record heart-warming voice notes.`,
      `"Henna / Temporary Glitter Tattoo Bar": Express bespoke motifs for guests of all ages.`
    ],
    music: [
      `Sunset arrival: Acoustic instrumental sitar & flute lounge covers of modern classics.`,
      `Dinner hour: Warm jazz & soulful retro Bollywood melodies at conversational decibels.`,
      `Celebration peak: High-energy Bollywood, Punjabi dhol beats, and international top-40 club anthems.`
    ],
    returnGifts: [
      `Hand-crafted brass diya / scented soy candle in customized silk potli bags with dried organic petals.`,
      `Artisanal honey jars from local Himalayan apiaries with personalized calligraphy thank-you tags.`,
      `Eco-friendly plantable seed paper notebook with engraved wooden pen.`
    ],
    wowMoments: [
      {
        title: 'Grand Entrance with Cold-Pyro & Rose-Petal Canons',
        description: 'Synchronized low-smoke dry ice fog rolling across the floor accompanied by sparkular cold fireworks and a shower of 50kg fresh rose petals.',
        executionTip: 'Test cold-pyro controllers 2 hours prior to ensure zero smoke alarms and optimal photo lighting.'
      },
      {
        title: 'Surprise Cinematic Same-Day Video Teaser on Giant LED',
        description: 'A 90-second high-production drone and candid highlight reel edited live by the video team and projected just before dessert.',
        executionTip: 'Designate a dedicated editor room with high-speed SSD rendering so the reel is primed by 8:30 PM.'
      },
      {
        title: 'Midnight Lantern or Sparkler Send-Off Tunnel',
        description: 'All guests form a glowing archway with 3-foot smokeless sparklers as celebratory music swells for an unforgettable finale photo.',
        executionTip: 'Distribute sparklers with long safety lighters 10 minutes prior and instruct the DJ to announce the countdown.'
      }
    ]
  };

  // Run Sheet
  const runSheet = [
    {
      id: 'rs-1',
      time: '02:00 PM - 03:30 PM',
      activity: 'Venue Access & Structural Decor Setup',
      owner: 'Event Planner & Decor Team',
      notes: 'Confirm stage trussing, air conditioning check, generator backup test, and florist arrival.'
    },
    {
      id: 'rs-2',
      time: '03:30 PM - 04:30 PM',
      activity: 'AV Sound Check, DJ Console & Lighting Alignment',
      owner: 'Sound Engineer & Emcee',
      notes: 'Sound check wireless mics, test presentation LED display, cue entrance music track.'
    },
    {
      id: 'rs-3',
      time: '04:30 PM - 05:30 PM',
      activity: 'Host Family Arrival & Pre-Event Golden Hour Portraits',
      owner: 'Lead Photographer & Stylist',
      notes: 'Capture solo and immediate family candid portraits before guests arrive; check hair and attire touch-ups.'
    },
    {
      id: 'rs-4',
      time: '05:30 PM - 06:30 PM',
      activity: 'Guest Arrival, Welcome Drinks & Live Acoustic Melodies',
      owner: 'Hospitality Concierge',
      notes: 'Guest check-in, gift desk management, servers circulating kokum coolers and finger appetizers.'
    },
    {
      id: 'rs-5',
      time: '06:30 PM - 07:15 PM',
      activity: 'The Grand Entrance & Opening Celebration Ceremony',
      owner: 'Emcee & Stage Coordinator',
      notes: 'Cold pyro cue, rose petal shower, welcoming speech by key hosts, celebratory cake cutting or lamp lighting.'
    },
    {
      id: 'rs-6',
      time: '07:15 PM - 08:30 PM',
      activity: 'Live Performances, Family Choreography & Interactive Games',
      owner: 'DJ & Choreographer',
      notes: 'Keep transitions brisk (under 5 mins); run the smartphone trivia game and family dance routines.'
    },
    {
      id: 'rs-7',
      time: '08:30 PM - 10:00 PM',
      activity: 'Grand Dinner Buffet Opens & Live Food Counters in Full Swing',
      owner: 'Catering Lead',
      notes: 'Ensure buffet lines flow smoothly; refill chaat stations; manage VIP table service.'
    },
    {
      id: 'rs-8',
      time: '10:00 PM - 11:30 PM',
      activity: 'Open Dance Floor & Midnight Sparkler Send-Off',
      owner: 'DJ & Event Coordinator',
      notes: 'Peak dance party, handover of return gifts at exit kiosk, wrap-up coordination.'
    }
  ];

  // Backup Plan
  const backupPlan = [
    {
      id: 'bp-1',
      risk: venueType === 'outdoor' ? 'Sudden Unseasonal Downpour or Heavy Wind' : 'Main Venue Air-Conditioning or Power Grid Failure',
      severity: 'High',
      triggerSigns: venueType === 'outdoor' ? 'Dark cloud build-up, sudden drop in barometric pressure 2h prior' : 'Flickering stage lights, breaker heat warning',
      mitigation: venueType === 'outdoor' 
        ? 'Contract an on-standby waterproof German hangar / pagoda tent structure with clear PVC sidewalls and elevated wooden subflooring ready within 45 mins.'
        : 'Station an independent 125 kVA silent diesel generator with automatic changeover switch (AMF panel) tested 3 hours before start.'
    },
    {
      id: 'bp-2',
      risk: 'Key Vendor No-Show or Transit Breakdown (DJ / Lead Photographer)',
      severity: 'High',
      triggerSigns: 'Vendor unresponsive to check-in call at T-4 hours or vehicle stuck in traffic',
      mitigation: 'Planner maintains pre-vetted Tier-1 backup roster on standby across city with duplicate master music USB and synced cloud playlists.'
    },
    {
      id: 'bp-3',
      risk: 'Unexpected 20%+ Guest Surge Exceeding Catering Capacity',
      severity: 'Medium',
      triggerSigns: 'Check-in desk registers 80% attendance within first 40 minutes',
      mitigation: 'Caterer contract includes 15% emergency ingredient reserve buffer; activate express live pasta/biryani rapid replenishment within 25 minutes.'
    }
  ];

  return {
    overview: {
      summary: `A magnificent ${eventType.toLowerCase()} celebration designed for ${guests} cherished guests in ${city}, uniting timeless ${traditions} with contemporary flair, exquisite ${cuisineDiet} gastronomy, and unforgettable hospitality.`,
      suggestedTheme: themeTitle,
      oneLineVibe: `An enchanting tapestry of golden warmth, joyful camaraderie, and cinematic celebrations.`,
      colorPalette: palette,
      keyHighlights: [
        `Curated bespoke ${cuisineDiet} dining experience with regional flair`,
        `Adaptive timeline designed specifically for ${daysRemaining} days remaining`,
        `100% budget-controlled strategy with built-in 10% contingency cushion`,
        `Memorable interactive wow-moments tailored for ${ageGroup}`
      ]
    },
    budget: {
      totalBudget: budgetResult.totalBudget,
      currency: budgetResult.currency,
      currencySymbol: budgetResult.currencySymbol,
      categories: budgetResult.categories,
      moneySavingTips: [
        `Book the venue on a Friday evening or Sunday brunch instead of Saturday night to negotiate up to 15-20% off rental charges.`,
        `Opt for seasonal local florals (marigolds, tuberoses, jasmine, bougainvillea) rather than imported Dutch hydrangeas to save up to 40% on decor costs while looking lush and fragrant.`,
        `Directly bundle sound, DJ and lighting with a single AV vendor rather than hiring them separately to eliminate double transport and technician surcharges.`
      ]
    },
    timeline,
    vendorChecklist,
    personalizedIdeas,
    runSheet,
    backupPlan
  };
}

/**
 * Creates dynamic countdown milestone phases based on how many days are left
 */
function generateAdaptiveTimeline(daysRemaining, eventType) {
  const isClose = daysRemaining <= 14;
  const isMedium = daysRemaining > 14 && daysRemaining <= 45;

  if (isClose) {
    return [
      {
        phase: `T-${daysRemaining}: Express Kickoff`,
        timeframe: 'Immediate Next 24-48 Hours',
        tasks: [
          { id: 't-1', title: 'Lock Venue & Deposit', description: 'Confirm venue booking and ensure noise permissions are approved.', priority: 'High' },
          { id: 't-2', title: 'Send Urgent WhatsApp Save-the-Dates', description: 'Broadcast digital invite with RSVP link to all guests immediately.', priority: 'High' },
          { id: 't-3', title: 'Confirm Catering Headcount', description: 'Lock in guest guarantees and final dietary preferences with caterer.', priority: 'High' }
        ]
      },
      {
        phase: 'T-7: Final Vendor Alignment',
        timeframe: '1 Week Before',
        tasks: [
          { id: 't-4', title: 'Finalize Run Sheet', description: 'Distribute printed hour-by-hour schedule to key family and vendors.', priority: 'High' },
          { id: 't-5', title: 'Assemble Return Favors', description: 'Pack and tag gift boxes or potli bags for guest departures.', priority: 'Medium' },
          { id: 't-6', title: 'Wardrobe Fitting Check', description: 'Do final fitting of celebratory outfits with matching accessories.', priority: 'Medium' }
        ]
      },
      {
        phase: 'T-1: Eve of Celebration',
        timeframe: '24 Hours Before',
        tasks: [
          { id: 't-7', title: 'AV & Decor Venue Walkthrough', description: 'Inspect stage backdrop, lighting angles, and mic levels in person.', priority: 'High' },
          { id: 't-8', title: 'Emergency Kit Bag', description: 'Prepare safety pins, stain remover, mints, power banks, and cash buffer.', priority: 'Medium' }
        ]
      },
      {
        phase: 'Event Day: The Grand Celebration',
        timeframe: 'Day Of Event',
        tasks: [
          { id: 't-9', title: 'Decor & Florals Handover', description: 'Receive venue at least 3 hours before start; inspect fresh flowers.', priority: 'High' },
          { id: 't-10', title: 'Welcome Desk Ready', description: 'Set up welcome drinks, guestbook, and digital photo displays.', priority: 'High' },
          { id: 't-11', title: 'Soak in Every Moment', description: 'Delegate all logistical troubleshooting to your event coordinator and celebrate!', priority: 'High' }
        ]
      },
      {
        phase: 'Post-Event: Gratitude & Wrap-up',
        timeframe: 'Next 3-5 Days',
        tasks: [
          { id: 't-12', title: 'Vendor Balance Settlement', description: 'Review final overtime invoices and disburse vendor tips/balances.', priority: 'Medium' },
          { id: 't-13', title: 'Broadcast Thank You Photos', description: 'Send digital thank-you photo album link to attendees.', priority: 'Medium' }
        ]
      }
    ];
  }

  // Standard / long timeline
  return [
    {
      phase: daysRemaining >= 90 ? 'T-90: Foundation & Vision' : `T-${daysRemaining}: Vision & Bookings`,
      timeframe: daysRemaining >= 90 ? '3 Months Before' : 'Initial Phase',
      tasks: [
        { id: 't-1', title: 'Lock Venue & Contract Terms', description: 'Negotiate hall rental, catering permissions, and parking arrangements.', priority: 'High' },
        { id: 't-2', title: 'Draft Master Guest List', description: 'Collect addresses, phone numbers, and dietary requirements in spreadsheet.', priority: 'High' },
        { id: 't-3', title: 'Select Theme & Color Palette', description: 'Align with decorators on floral palettes, fabric drapery, and lighting concepts.', priority: 'Medium' }
      ]
    },
    {
      phase: 'T-60: Core Vendors & Creative Details',
      timeframe: '2 Months Before',
      tasks: [
        { id: 't-4', title: 'Book Photographer & Videographer', description: 'Secure candid team and review pre-event portrait schedule.', priority: 'High' },
        { id: 't-5', title: 'Conduct Food Tasting Session', description: 'Taste appetizers and main curries with the head chef to calibrate spices.', priority: 'High' },
        { id: 't-6', title: 'Design Digital Stationery', description: 'Create animated video invitations and WhatsApp RSVP cards.', priority: 'Medium' }
      ]
    },
    {
      phase: 'T-30: Invitations & Logistics',
      timeframe: '1 Month Before',
      tasks: [
        { id: 't-7', title: 'Dispatch Digital Invites', description: 'Broadcast personalized invites via WhatsApp and monitor RSVPs.', priority: 'High' },
        { id: 't-8', title: 'Hire DJ & Plan Music Playlists', description: 'Share must-play entrance songs and family dance performance tracks.', priority: 'Medium' },
        { id: 't-9', title: 'Order Customized Return Gifts', description: 'Finalize packaging, personalized cards, and eco-friendly favor bags.', priority: 'Medium' }
      ]
    },
    {
      phase: 'T-7: Final Rehearsals & Countdowns',
      timeframe: '1 Week Before',
      tasks: [
        { id: 't-10', title: 'Submit Final Headcount to Caterer', description: 'Lock in guest guarantee with 10% safety cushion.', priority: 'High' },
        { id: 't-11', title: 'Distribute Hour-by-Hour Run Sheet', description: 'Brief emcee, photographer, and key family members on timeline cues.', priority: 'High' },
        { id: 't-12', title: 'Pack Emergency Essentials Bag', description: 'Pack stain removal pens, sewing kit, band-aids, phone chargers, and cash.', priority: 'Low' }
      ]
    },
    {
      phase: 'T-1: Eve of Celebration',
      timeframe: 'Day Before',
      tasks: [
        { id: 't-13', title: 'Venue Walkthrough & Sound Check', description: 'Inspect early setup, backdrop lighting, and wireless microphone batteries.', priority: 'High' },
        { id: 't-14', title: 'Early Rest & Hydration', description: 'Ensure key hosts get quality sleep before the big day.', priority: 'Medium' }
      ]
    },
    {
      phase: 'Event Day: The Grand Celebration',
      timeframe: 'Day Of Celebration',
      tasks: [
        { id: 't-15', title: 'Morning Decor Verification', description: 'Inspect stage floristry and welcome arches 3 hours prior to guest arrival.', priority: 'High' },
        { id: 't-16', title: 'Coordinate Wow Moments', description: 'Cue the cold fireworks and rose petal shower during the grand entrance.', priority: 'High' },
        { id: 't-17', title: 'Live the Moment Joyfully', description: 'Trust the run-sheet, cherish loved ones, and make lifelong memories.', priority: 'High' }
      ]
    },
    {
      phase: 'Post-Event: Gratitude & Settlement',
      timeframe: 'Next 3-5 Days',
      tasks: [
        { id: 't-18', title: 'Settle Vendor Overtime & Balances', description: 'Audit extra hours, tips, and obtain final receipts.', priority: 'Medium' },
        { id: 't-19', title: 'Send Gratitude Broadcast', description: 'Share photographer teaser video with heartfelt WhatsApp thank-you notes.', priority: 'Medium' }
      ]
    }
  ];
}
