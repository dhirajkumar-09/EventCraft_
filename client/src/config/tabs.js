/**
 * Tab Navigation Definitions for EventCraft AI
 */
import {
  Sparkles,
  PieChart,
  CalendarDays,
  CheckSquare,
  Gift,
  Clock,
  ShieldAlert
} from 'lucide-react';

export const NAVIGATION_TABS = Object.freeze([
  { id: 'overview', label: 'Overview', icon: Sparkles, badge: 'Theme & Vibe' },
  { id: 'budget', label: 'Budget', icon: PieChart, badge: 'Strict 100%' },
  { id: 'timeline', label: 'Timeline', icon: CalendarDays, badge: 'Countdown' },
  { id: 'vendorChecklist', label: 'Vendors', icon: CheckSquare, badge: 'Negotiation' },
  { id: 'personalizedIdeas', label: 'Ideas & Wow', icon: Gift, badge: 'Unique' },
  { id: 'runSheet', label: 'Run Sheet', icon: Clock, badge: 'Hour-by-Hour' },
  { id: 'backupPlan', label: 'Backup Plan', icon: ShieldAlert, badge: 'Mitigation' }
]);
