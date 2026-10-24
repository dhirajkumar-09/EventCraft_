/**
 * Test Fixture Factory for EventCraft Client Tests
 */

export const mockPlanFixture = Object.freeze({
  overview: {
    summary: 'A magnificent, culturally rich Wedding celebration in Jaipur for 250 guests.',
    suggestedTheme: 'Royal Rajputana Heritage Vivah',
    oneLineVibe: 'Exquisite Jaipur hospitality uniting joyous family traditions.',
    colorPalette: [
      { name: 'Royal Gold', hex: '#b45309' },
      { name: 'Amber Glow', hex: '#d97706' },
      { name: 'Warm Saffron', hex: '#f59e0b' },
      { name: 'Sunlight Brass', hex: '#fbbf24' },
      { name: 'Silk Cream', hex: '#fef3c7' }
    ],
    keyHighlights: [
      'Curated multi-course veg culinary experience',
      'Thematic immersion with royal decor',
      'Strict adherence to budget with 10% contingency'
    ]
  },
  budget: {
    totalBudget: 1500000,
    currency: 'INR',
    currencySymbol: '₹',
    categories: [
      { name: 'Venue & Infrastructure', amount: 360000, percentage: 24, note: 'Palace rental' },
      { name: 'Catering & Beverages', amount: 420000, percentage: 28, note: 'Royal Rajasthani banquet' },
      { name: 'Decor, Florals & Lighting', amount: 210000, percentage: 14, note: 'Marigold cascades' },
      { name: 'Photography & Videography', amount: 150000, percentage: 10, note: 'Candid & cinematic' },
      { name: 'Entertainment & Music', amount: 90000, percentage: 6, note: 'Live Sitar & DJ' },
      { name: 'Attire, Hair & Makeup', amount: 60000, percentage: 4, note: 'Styling' },
      { name: 'Invitations & Digital Stationery', amount: 30000, percentage: 2, note: 'Digital invites' },
      { name: 'Guest Transport & Logistics', amount: 30000, percentage: 2, note: 'Transfers' },
      { name: 'Emergency Contingency (10%)', amount: 150000, percentage: 10, note: 'Safety reserve' }
    ],
    moneySavingTips: [
      'Book weekday slots to save 15%',
      'Choose local seasonal florals',
      'Use interactive digital invites'
    ]
  },
  timeline: [
    {
      id: 't-1',
      phase: 'Foundation & Vision',
      timeframe: 'T-90 to T-60 Days',
      tasks: [
        { id: 'tk-1', title: 'Confirm Venue Booking', priority: 'High', description: 'Lock legal agreement' },
        { id: 'tk-2', title: 'Curate Caterer Tasting', priority: 'Medium', description: 'Sample signature dishes' }
      ]
    },
    {
      id: 't-2',
      phase: 'Celebration Day',
      timeframe: 'Event Day',
      tasks: [
        { id: 'tk-3', title: 'Early Makeup & Portraits', priority: 'High', description: 'Complete photography' }
      ]
    }
  ],
  vendorChecklist: [
    {
      id: 'v-1',
      vendorType: 'Palace Venue',
      estimatedCostRange: '₹3,00,000 - ₹4,00,000',
      bookingDeadline: 'T-60 Days',
      whatToAskOrNegotiate: 'Check generator backup'
    },
    {
      id: 'v-2',
      vendorType: 'Royal Caterer',
      estimatedCostRange: '₹3,50,000 - ₹4,50,000',
      bookingDeadline: 'T-45 Days',
      whatToAskOrNegotiate: 'Ensure live counters included'
    }
  ],
  personalizedIdeas: {
    decor: ['Marigold entrance archway', 'Neon hashtag backdrop'],
    menu: [
      {
        course: 'Welcome Beverages',
        items: ['Kesariya Thandai', 'Marigold Mojito']
      }
    ],
    gamesOrActivities: ['Interactive Audio Guestbook'],
    music: ['Live Sitar Welcome'],
    returnGifts: ['Artisanal brass diffusers'],
    wowMoments: [
      {
        title: 'Cold-Pyro Entry Portal',
        description: 'Sparkular cold-pyrotechnic fountain archways.',
        executionTip: 'Rehearse audio cue with DJ.'
      }
    ]
  },
  runSheet: [
    { time: '10:00 AM', activity: 'Vendor Setup', owner: 'Lead Planner', notes: 'Check sound setup' },
    { time: '06:00 PM', activity: 'Guest Arrivals', owner: 'Hospitality Lead', notes: 'Serve welcome drinks' }
  ],
  backupPlan: [
    {
      risk: 'Unseasonal Rain / Weather Disruptions',
      severity: 'High',
      triggerSigns: 'Dark cloud cover or sudden wind gusts 3 hours before start',
      mitigation: 'Activate pre-reserved waterproof canopy and shift electronics to indoor banquet wing.'
    }
  ]
});

export const mockMetaFixture = Object.freeze({
  eventType: 'Wedding',
  eventDate: '2026-12-15',
  city: 'Jaipur',
  venueType: 'palace',
  guestCount: 250,
  totalBudget: 1500000,
  currency: 'INR',
  currencySymbol: '₹',
  cuisineDiet: 'veg'
});
