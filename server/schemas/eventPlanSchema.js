/**
 * Gemini Structured JSON Response Schema for EventCraft AI
 */

export const eventPlanJsonSchema = {
  type: 'object',
  properties: {
    overview: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
          description: 'Comprehensive 2-3 sentence executive summary of the celebration'
        },
        suggestedTheme: {
          type: 'string',
          description: "Catchy, evocative theme title (e.g. 'Royal Rajasthani Marigold Soirée')"
        },
        oneLineVibe: {
          type: 'string',
          description: 'A punchy one-liner capturing the emotional aesthetic and vibe'
        },
        colorPalette: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              hex: { type: 'string' }
            },
            required: ['name', 'hex']
          },
          description: '4-5 harmonious hex colors suited to the theme and traditions'
        },
        keyHighlights: {
          type: 'array',
          items: { type: 'string' },
          description: '4 quick bullet highlights of what makes this celebration memorable'
        }
      },
      required: ['summary', 'suggestedTheme', 'oneLineVibe', 'colorPalette', 'keyHighlights']
    },
    budget: {
      type: 'object',
      properties: {
        totalBudget: {
          type: 'number',
          description: "Strictly matching the user's total budget input"
        },
        currency: { type: 'string' },
        currencySymbol: { type: 'string' },
        categories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description:
                  'e.g. Venue, Catering, Decor, Photography, Entertainment, Attire, Invitations, Transport, Contingency (10%)'
              },
              amount: { type: 'number', description: 'Allocated currency amount' },
              percentage: { type: 'number', description: 'Percentage of total budget' },
              note: { type: 'string', description: 'Specific local advice or what is included' }
            },
            required: ['category', 'amount', 'percentage', 'note']
          },
          description:
            'Must contain Venue, Catering, Decor, Photography, Entertainment, Attire, Invitations, Transport, and Contingency 10%'
        },
        moneySavingTips: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Exactly 3 actionable, highly realistic insider money-saving tips for this event'
        }
      },
      required: ['totalBudget', 'currency', 'currencySymbol', 'categories', 'moneySavingTips']
    },
    timeline: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          phase: {
            type: 'string',
            description: 'Milestone label, e.g. T-90, T-60, T-30, T-7, T-1, Event Day, Post-Event'
          },
          timeframe: {
            type: 'string',
            description: "Human friendly timeframe description, e.g. '3 Months Before'"
          },
          tasks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                priority: { type: 'string', enum: ['High', 'Medium', 'Low'] }
              },
              required: ['id', 'title', 'description', 'priority']
            }
          }
        },
        required: ['phase', 'timeframe', 'tasks']
      },
      description: 'Countdown milestones customized to days remaining until the event'
    },
    vendorChecklist: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          vendorType: {
            type: 'string',
            description:
              'e.g. Caterer, Venue Manager, Decorator, Candid Photographer, DJ/Band, Mehndi/Makeup'
          },
          whatToAskOrNegotiate: {
            type: 'string',
            description: 'Key negotiation tips, contract clauses, or tasting questions to ask'
          },
          estimatedCostRange: {
            type: 'string',
            description: 'Locally realistic price range in currency'
          },
          bookingDeadline: { type: 'string', description: 'When this vendor must be finalized' }
        },
        required: [
          'id',
          'vendorType',
          'whatToAskOrNegotiate',
          'estimatedCostRange',
          'bookingDeadline'
        ]
      },
      description: 'Tickable checklist of core vendors'
    },
    personalizedIdeas: {
      type: 'object',
      properties: {
        decor: {
          type: 'array',
          items: { type: 'string' },
          description: '3-5 themed decor concepts suited to the venue type and budget'
        },
        menu: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              course: {
                type: 'string',
                description: 'e.g. Welcome Drinks, Live Counters, Mains, Desserts'
              },
              items: { type: 'array', items: { type: 'string' } }
            },
            required: ['course', 'items']
          },
          description: 'Menu curated strictly for the requested cuisine & diet'
        },
        gamesOrActivities: {
          type: 'array',
          items: { type: 'string' },
          description: 'Engaging interactive games or cultural activities suited to the age group'
        },
        music: {
          type: 'array',
          items: { type: 'string' },
          description: 'Curated playlist vibes and sound cues'
        },
        returnGifts: {
          type: 'array',
          items: { type: 'string' },
          description: 'Thoughtful, memorable favors or return gifts fitting the theme'
        },
        wowMoments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              executionTip: { type: 'string' }
            },
            required: ['title', 'description', 'executionTip']
          },
          description: "Exactly 3 unique, unforgettable 'wow moments'"
        }
      },
      required: ['decor', 'menu', 'gamesOrActivities', 'music', 'returnGifts', 'wowMoments']
    },
    runSheet: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          time: { type: 'string', description: 'Time slot, e.g. 10:00 AM - 11:30 AM' },
          activity: { type: 'string', description: 'What happens' },
          owner: {
            type: 'string',
            description: 'Who is responsible (e.g. Emcee, Venue Mgr, Host)'
          },
          notes: { type: 'string', description: 'Key cue or transition note' }
        },
        required: ['id', 'time', 'activity', 'owner', 'notes']
      },
      description: 'Hour-by-hour day-of event run sheet'
    },
    backupPlan: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          risk: {
            type: 'string',
            description: 'Risk scenario (e.g. sudden monsoon downpour, power trip, caterer delay)'
          },
          severity: { type: 'string', enum: ['High', 'Medium'] },
          triggerSigns: { type: 'string', description: 'Early warning signs' },
          mitigation: { type: 'string', description: 'Immediate concrete mitigation plan' }
        },
        required: ['id', 'risk', 'severity', 'triggerSigns', 'mitigation']
      },
      description: 'Top 3 realistic celebration risks with actionable contingencies'
    }
  },
  required: [
    'overview',
    'budget',
    'timeline',
    'vendorChecklist',
    'personalizedIdeas',
    'runSheet',
    'backupPlan'
  ]
};
