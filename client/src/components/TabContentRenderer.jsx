import React from 'react';
import OverviewTab from './sections/OverviewTab.jsx';
import BudgetTab from './sections/BudgetTab.jsx';
import TimelineTab from './sections/TimelineTab.jsx';
import VendorChecklistTab from './sections/VendorChecklistTab.jsx';
import PersonalizedIdeasTab from './sections/PersonalizedIdeasTab.jsx';
import RunSheetTab from './sections/RunSheetTab.jsx';
import BackupPlanTab from './sections/BackupPlanTab.jsx';

/**
 * Renders active tab component based on selected section ID
 */
export default function TabContentRenderer({ activeTab }) {
  switch (activeTab) {
    case 'overview':
      return <OverviewTab />;
    case 'budget':
      return <BudgetTab />;
    case 'timeline':
      return <TimelineTab />;
    case 'vendorChecklist':
      return <VendorChecklistTab />;
    case 'personalizedIdeas':
      return <PersonalizedIdeasTab />;
    case 'runSheet':
      return <RunSheetTab />;
    case 'backupPlan':
      return <BackupPlanTab />;
    default:
      return <OverviewTab />;
  }
}
