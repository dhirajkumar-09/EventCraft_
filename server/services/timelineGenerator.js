/**
 * Adaptive Timeline Generator for EventCraft AI
 * Computes milestones and task checklists dynamically based on days remaining until celebration
 */

/**
 * Generates countdown timeline phases and actionable tasks
 * @param {number} daysRemaining - Days left until event date
 * @param {string} [eventType='Wedding'] - Celebration type
 * @returns {Array<Object>} Timeline milestone phases
 */
export function generateAdaptiveTimeline(daysRemaining, eventType = 'Wedding') {
  const isWedding = eventType.toLowerCase().includes('wedding');

  if (daysRemaining > 60) {
    return [
      {
        id: 't-90',
        phase: 'Foundation & Vision',
        timeframe: 'T-90 to T-60 Days',
        tasks: [
          { id: 'tk-1', title: 'Confirm Venue Booking & Deposit', priority: 'High', description: 'Lock legal agreement and reserve sound/curfew permits.' },
          { id: 'tk-2', title: 'Curate Caterer Tasting Session', priority: 'High', description: 'Sample signature dishes and define per-plate rates.' },
          { id: 'tk-3', title: 'Finalize Master Guest List', priority: 'Medium', description: 'Collate telephone numbers and address books for digital RSVPs.' }
        ]
      },
      {
        id: 't-30',
        phase: 'Design & Vendor Locking',
        timeframe: 'T-60 to T-30 Days',
        tasks: [
          { id: 'tk-4', title: 'Sign Photographer & DJ Contracts', priority: 'High', description: 'Confirm deliverable schedule and music playlists.' },
          { id: 'tk-5', title: 'Finalize Decor Stage Mockup', priority: 'Medium', description: 'Approve entrance arch, lighting plot, and floral palette.' },
          { id: 'tk-6', title: 'Dispatch Digital Invitations', priority: 'High', description: 'Send digital WhatsApp invites with venue Google Maps link.' }
        ]
      },
      {
        id: 't-7',
        phase: 'Logistics & Rehearsals',
        timeframe: 'T-30 to T-7 Days',
        tasks: [
          { id: 'tk-7', title: 'RSVP Headcount Reconciliation', priority: 'High', description: 'Give confirmed guest count to caterer for food ordering.' },
          { id: 'tk-8', title: isWedding ? 'Sangeet / Performance Rehearsal' : 'Entertainment & Speeches Rehearsal', priority: 'Medium', description: 'Run sound check with performers.' },
          { id: 'tk-9', title: 'Order Return Gifts & Favors', priority: 'Low', description: 'Pack custom favor boxes and arrange delivery.' }
        ]
      },
      {
        id: 't-1',
        phase: 'Final Briefing',
        timeframe: 'T-1 Day',
        tasks: [
          { id: 'tk-10', title: 'Venue Walkthrough with Vendor Leads', priority: 'High', description: 'Check generator backup and inspect stage load-in.' },
          { id: 'tk-11', title: 'Distribute Emergency Contacts Sheet', priority: 'High', description: 'Share master run sheet with core family coordinators.' }
        ]
      },
      {
        id: 't-day',
        phase: 'Celebration Day',
        timeframe: 'Event Day',
        tasks: [
          { id: 'tk-12', title: 'Early Makeup & Staged Portraits', priority: 'High', description: 'Complete photography before guest arrival.' },
          { id: 'tk-13', title: 'Oversee Catering & Live Counters', priority: 'High', description: 'Ensure prompt welcoming refreshments.' }
        ]
      },
      {
        id: 't-post',
        phase: 'Post-Event Wrap Up',
        timeframe: 'T+1 to T+7 Days',
        tasks: [
          { id: 'tk-14', title: 'Final Vendor Settlement & Gratuity', priority: 'High', description: 'Settle remaining balances against delivery slips.' },
          { id: 'tk-15', title: 'Send Thank You Message to Guests', priority: 'Medium', description: 'Share link to photo gallery teaser reel.' }
        ]
      }
    ];
  }

  // Under 60 days
  return [
    {
      id: 't-rapid-1',
      phase: 'Urgent Foundations',
      timeframe: 'Next 48 Hours',
      tasks: [
        { id: 'tk-r1', title: 'Immediate Venue & Caterer Booking', priority: 'High', description: 'Lock in venue contract and catering deposit immediately.' },
        { id: 'tk-r2', title: 'Dispatch Digital Save-the-Dates', priority: 'High', description: 'Send digital WhatsApp announcement so guests reserve date.' }
      ]
    },
    {
      id: 't-rapid-2',
      phase: 'Fast-Track Vendors',
      timeframe: 'Days 3 to 10',
      tasks: [
        { id: 'tk-r3', title: 'Lock Core Photo & Decor Team', priority: 'High', description: 'Prioritize experienced local vendors with turnkey capability.' },
        { id: 'tk-r4', title: 'Finalize Menu Selections', priority: 'High', description: 'Select signature counters and lock in serving staffing ratio.' }
      ]
    },
    {
      id: 't-rapid-3',
      phase: 'Logistics & Rehearsals',
      timeframe: 'T-14 to T-7 Days',
      tasks: [
        { id: 'tk-r5', title: 'RSVP Headcount Reconciliation', priority: 'High', description: 'Give confirmed guest count to caterer for food ordering.' },
        { id: 'tk-r6', title: isWedding ? 'Sangeet / Performance Rehearsal' : 'Entertainment & Speeches Rehearsal', priority: 'Medium', description: 'Run sound check with performers.' }
      ]
    },
    {
      id: 't-rapid-4',
      phase: 'Final Briefing & Readiness',
      timeframe: 'T-3 to T-1 Day',
      tasks: [
        { id: 'tk-r7', title: 'Venue Walkthrough with Vendor Leads', priority: 'High', description: 'Check generator backup and inspect stage load-in.' },
        { id: 'tk-r8', title: 'Distribute Emergency Contacts Sheet', priority: 'High', description: 'Share master run sheet with core family coordinators.' }
      ]
    },
    {
      id: 't-rapid-5',
      phase: 'Celebration Day',
      timeframe: 'Event Day',
      tasks: [
        { id: 'tk-r9', title: 'Early Makeup & Staged Portraits', priority: 'High', description: 'Complete photography before guest arrival.' },
        { id: 'tk-r10', title: 'Oversee Catering & Live Counters', priority: 'High', description: 'Ensure prompt welcoming refreshments.' }
      ]
    },
    {
      id: 't-rapid-6',
      phase: 'Post-Event Wrap Up',
      timeframe: 'T+1 to T+7 Days',
      tasks: [
        { id: 'tk-r11', title: 'Final Vendor Settlement & Gratuity', priority: 'High', description: 'Settle remaining balances against delivery slips.' },
        { id: 'tk-r12', title: 'Send Thank You Message to Guests', priority: 'Medium', description: 'Share link to photo gallery teaser reel.' }
      ]
    }
  ];
}
