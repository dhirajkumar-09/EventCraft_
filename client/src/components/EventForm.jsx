import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Utensils,
  Palette,
  Heart,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { calculateDaysRemaining, SAMPLE_PRESETS, getFutureDate } from '../utils/sampleData.js';
import { useEvent } from '../context/EventContext.jsx';

const EVENT_TYPES = [
  'Wedding',
  'Birthday',
  'Anniversary',
  'Baby Shower',
  'Community/Festival event',
  'Corporate'
];

const VENUE_TYPES = [
  { value: 'banquet', label: 'Banquet Hall / Hotel Ballroom' },
  { value: 'outdoor', label: 'Outdoor Lawn / Beach / Farmhouse' },
  { value: 'indoor', label: 'Indoor Lounge / Restaurant' },
  { value: 'home', label: 'Private Home / Terrace' }
];

const CUISINE_DIETS = [
  { value: 'veg', label: 'Pure Vegetarian' },
  { value: 'non-veg', label: 'Non-Vegetarian & Halal' },
  { value: 'jain', label: 'Jain (No Root Veg / Onion / Garlic)' },
  { value: 'mixed', label: 'Mixed (Veg & Non-Veg Multi-Cuisine)' }
];

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'AED', symbol: 'AED', label: 'AED (AED)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)' }
];

export default function EventForm({ presetData, onClearPreset }) {
  const { generatePlan, isLoading } = useEvent();

  // Clean empty state by default so any user can enter their own event details
  const [formData, setFormData] = useState({
    eventType: '',
    eventDate: '',
    city: '',
    venueType: '',
    guestCount: '',
    totalBudget: '',
    currency: 'INR',
    currencySymbol: '₹',
    cuisineDiet: '',
    themePreference: '',
    traditions: '',
    ageGroup: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync external preset if triggered from Hero
  useEffect(() => {
    if (presetData) {
      setFormData(presetData);
      setErrors({});
      if (onClearPreset) onClearPreset();
    }
  }, [presetData, onClearPreset]);

  // Realtime days remaining calculation
  const daysRemaining = calculateDaysRemaining(formData.eventDate);

  // Field validator
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'eventType':
        if (!value) error = 'Please select an event type';
        break;
      case 'eventDate':
        if (!value) {
          error = 'Event date is required';
        } else {
          const days = calculateDaysRemaining(value);
          if (days !== null && days < 0) {
            error = 'Event date cannot be in the past';
          }
        }
        break;
      case 'city':
        if (!value || value.trim().length < 2) {
          error = 'Please specify a city for realistic local pricing';
        }
        break;
      case 'venueType':
        if (!value) error = 'Please choose a venue type';
        break;
      case 'guestCount':
        const g = Number(value);
        if (!g || g < 1) error = 'Enter at least 1 guest';
        else if (g > 50000) error = 'Max 50,000 guests supported';
        break;
      case 'totalBudget':
        const b = Number(value);
        if (!b || b < 100) error = 'Budget must be at least 100';
        break;
      case 'cuisineDiet':
        if (!value) error = 'Please select cuisine and diet';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === 'guestCount' || name === 'totalBudget') {
      nextValue = value === '' ? '' : Math.max(0, Number(value));
    }

    if (name === 'currency') {
      const match = CURRENCIES.find((c) => c.code === value);
      setFormData((prev) => ({
        ...prev,
        currency: value,
        currencySymbol: match ? match.symbol : '₹'
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue
    }));

    if (touched[name]) {
      const error = validateField(name, nextValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setTouched(
      Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErr = document.querySelector('[data-error="true"]');
      if (firstErr) {
        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    generatePlan(formData);
  };

  const loadRandomSample = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_PRESETS.length);
    setFormData(SAMPLE_PRESETS[randomIndex].data);
    setErrors({});
  };

  const handleClearForm = () => {
    setFormData({
      eventType: '',
      eventDate: '',
      city: '',
      venueType: '',
      guestCount: '',
      totalBudget: '',
      currency: 'INR',
      currencySymbol: '₹',
      cuisineDiet: '',
      themePreference: '',
      traditions: '',
      ageGroup: '',
      specialRequests: ''
    });
    setErrors({});
    setTouched({});
  };

  const hasEnteredData = Object.values(formData).some((v) => v !== '' && v !== 'INR' && v !== '₹');

  return (
    <div className="card-glass rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-amber-500/5 mb-12">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-200/60 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>✨ Event Details & Preferences</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Provide your event vision. Gemini 2.5 Flash will construct a tailored plan with locally grounded costs.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-2 shrink-0">
          {hasEnteredData && (
            <button
              type="button"
              onClick={handleClearForm}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-all cursor-pointer"
            >
              <span>Clear Form</span>
            </button>
          )}

          <button
            type="button"
            onClick={loadRandomSample}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Fill Sample Data</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
        
        {/* ROW 1: Event Type & Event Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Type */}
          <div data-error={Boolean(errors.eventType)}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Event Type <span className="text-rose-500">*</span>
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm font-medium"
            >
              <option value="">-- Choose Celebration Type (e.g. Wedding, Birthday...) --</option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.eventType && (
              <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.eventType}
              </p>
            )}
          </div>

          {/* Event Date with Live Days Remaining Counter */}
          <div data-error={Boolean(errors.eventDate)}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Event Date <span className="text-rose-500">*</span>
              </label>
              {daysRemaining !== null && (
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  daysRemaining >= 0 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                }`}>
                  <Clock className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                  {daysRemaining > 0 
                    ? `${daysRemaining} days remaining` 
                    : daysRemaining === 0 
                    ? 'Today is Event Day! 🎉' 
                    : `${Math.abs(daysRemaining)} days passed`}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm font-medium"
              />
            </div>
            {errors.eventDate && (
              <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.eventDate}
              </p>
            )}
          </div>
        </div>

        {/* ROW 2: City & Venue Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City */}
          <div data-error={Boolean(errors.city)}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              City / Location <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Mumbai, Jaipur, Delhi, New York, London"
                aria-required="true"
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm font-medium"
              />
            </div>
            {errors.city && (
              <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.city}
              </p>
            )}
          </div>

          {/* Venue Type */}
          <div data-error={Boolean(errors.venueType)}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Venue Type <span className="text-rose-500">*</span>
            </label>
            <select
              name="venueType"
              value={formData.venueType}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm font-medium"
            >
              <option value="">-- Choose Venue Setting (Banquet, Outdoor, Home...) --</option>
              {VENUE_TYPES.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
            {errors.venueType && (
              <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.venueType}
              </p>
            )}
          </div>
        </div>

        {/* ROW 3: Guest Count & Budget with Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guest Count */}
          <div data-error={Boolean(errors.guestCount)}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Estimated Guest Count <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="number"
                name="guestCount"
                min="1"
                max="50000"
                value={formData.guestCount}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. 150"
                aria-required="true"
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm font-medium"
              />
            </div>
            {errors.guestCount && (
              <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.guestCount}
              </p>
            )}
          </div>

          {/* Budget + Currency */}
          <div data-error={Boolean(errors.totalBudget)}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Total Budget & Currency <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-28 shrink-0 px-3 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm font-bold"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>

              <div className="relative w-full">
                <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">
                  {formData.currencySymbol}
                </span>
                <input
                  type="number"
                  name="totalBudget"
                  min="100"
                  step="1000"
                  value={formData.totalBudget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 1000000"
                  aria-required="true"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm font-semibold"
                />
              </div>
            </div>
            {errors.totalBudget && (
              <p className="flex items-center gap-1 text-xs text-rose-500 font-medium mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.totalBudget}
              </p>
            )}
          </div>
        </div>

        {/* ROW 4: Cuisine & Diet */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Cuisine & Dietary Preference <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CUISINE_DIETS.map((diet) => (
              <label
                key={diet.value}
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.cuisineDiet === diet.value
                    ? 'bg-amber-100/70 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs'
                    : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                <input
                  type="radio"
                  name="cuisineDiet"
                  value={diet.value}
                  checked={formData.cuisineDiet === diet.value}
                  onChange={handleChange}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-xs font-semibold">{diet.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ROW 5: Theme, Traditions & Age Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Theme Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Theme / Style Preference
            </label>
            <input
              type="text"
              name="themePreference"
              value={formData.themePreference}
              onChange={handleChange}
              placeholder="e.g. Boho Chic, Royal Marigold, Pastel Minimalist"
              className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs font-medium"
            />
          </div>

          {/* Traditions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Traditions & Rituals
            </label>
            <input
              type="text"
              name="traditions"
              value={formData.traditions}
              onChange={handleChange}
              placeholder="e.g. Sangeet & Haldi, Mehndi, Western Vows, Garba"
              className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs font-medium"
            />
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Audience / Age Group
            </label>
            <input
              type="text"
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              placeholder="e.g. Kids & toddlers, young adults, elders"
              className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs font-medium"
            />
          </div>
        </div>

        {/* ROW 6: Special Requests */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Special Requests / Must-Haves
          </label>
          <textarea
            name="specialRequests"
            rows="2"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="e.g. Cold pyro entry, surprise flash mob dance, audio guestbook, sustainable seed paper gifts..."
            className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs font-medium"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:from-amber-700 hover:via-rose-700 hover:to-purple-700 shadow-xl shadow-amber-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Crafting Your Celebration with Gemini 2.5 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Master Event Plan</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
