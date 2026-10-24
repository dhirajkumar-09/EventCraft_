/**
 * Realistic Sample Presets for EventCraft AI
 * Enables instant one-click demonstration for diverse celebrations
 */

export const SAMPLE_PRESETS = [
  {
    name: 'Royal Heritage Wedding (Jaipur)',
    badge: 'Wedding 💍',
    data: {
      eventType: 'Wedding',
      eventDate: getFutureDate(75),
      city: 'Jaipur',
      venueType: 'banquet',
      guestCount: 250,
      totalBudget: 1500000,
      currency: 'INR',
      currencySymbol: '₹',
      cuisineDiet: 'veg',
      themePreference: 'Royal Rajputana Heritage with Marigold & Gilded Brass',
      traditions: 'Traditional North Indian Vivah with Sangeet, Haldi & Baraat',
      ageGroup: 'Multi-generational (families, seniors & youth)',
      specialRequests:
        'Must feature authentic Rajasthani Dal Baati Churma counter, cold-pyro grand entrance, and sitar acoustic welcome.'
    }
  },
  {
    name: '1st Birthday Extravaganza (Mumbai)',
    badge: 'Birthday 🎂',
    data: {
      eventType: 'Birthday',
      eventDate: getFutureDate(30),
      city: 'Mumbai',
      venueType: 'indoor',
      guestCount: 80,
      totalBudget: 350000,
      currency: 'INR',
      currencySymbol: '₹',
      cuisineDiet: 'mixed',
      themePreference: 'Pastel Safari & Starlight Carnival',
      traditions: 'Contemporary family birthday celebration with cake smash & audio guestbook',
      ageGroup: 'Toddlers, kids (3-10 yrs) and young parents',
      specialRequests:
        'Dedicated soft-play ball pit area for toddlers, balloon twisting artist, and kid-friendly finger food.'
    }
  },
  {
    name: 'Silver 25th Anniversary (Goa)',
    badge: 'Anniversary 🥂',
    data: {
      eventType: 'Anniversary',
      eventDate: getFutureDate(60),
      city: 'Goa',
      venueType: 'outdoor',
      guestCount: 100,
      totalBudget: 750000,
      currency: 'INR',
      currencySymbol: '₹',
      cuisineDiet: 'mixed',
      themePreference: 'Coastal Sunset Glamour & Champagne Jazz',
      traditions:
        'Vow renewal ceremony followed by sunset cocktail reception & live retro acoustic band',
      ageGroup: 'Adults (30-65 yrs)',
      specialRequests:
        'Outdoor beachfront lighting with fairylight canopy, customized signature cocktail bar, and vintage dance floor.'
    }
  },
  {
    name: 'Diwali Community Gala (Bengaluru)',
    badge: 'Community 🪔',
    data: {
      eventType: 'Community/Festival event',
      eventDate: getFutureDate(45),
      city: 'Bengaluru',
      venueType: 'outdoor',
      guestCount: 300,
      totalBudget: 500000,
      currency: 'INR',
      currencySymbol: '₹',
      cuisineDiet: 'jain',
      themePreference: 'Festival of Lights & Traditional Rangoli Soirée',
      traditions: 'Diwali pooja followed by Dandiya/Garba dance and community grand buffet',
      ageGroup: 'All age groups (families, neighborhood residents, children)',
      specialRequests:
        'Eco-friendly clay diya illumination, live jalebi counter, Dandiya stick distribution for all guests.'
    }
  }
];

export function getFutureDate(daysAhead = 60) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export function calculateDaysRemaining(dateString) {
  if (!dateString) return null;
  const target = new Date(dateString);
  const today = new Date();
  // Strip time component for accurate calendar day count
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
