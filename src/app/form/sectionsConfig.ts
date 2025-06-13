import { SectionConfig } from "./DynamicSection";

export const sectionsConfig: SectionConfig[] = [
  {
    id: "quick-observations",
    title: "Quick Observations",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    subtitle: "Initial impressions.",
    namePrefix: "positive_observations",
    checkboxes: [
      { id: "arrived-responsibly", value: "Arrived responsibly", label: "Arrived responsibly (own car, family dropped off)" },
      { id: "appropriate-people", value: "Came with appropriate people", label: "Came with appropriate people" },
      { id: "asked-questions", value: "Asked good questions", label: "Asked good questions about the place" },
    ],
  },
  {
    id: "concerning-signs",
    title: "Concerning Signs",
    icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.305 3.293 2.305 3.293h13.4c2.002 0 3.173-1.793 2.305-3.293L13.682 2.292a1.875 1.875 0 00-3.364 0L2.697 16.626zM12 15.75h.007v.008H12v-.008z",
    subtitle: "Immediate red flags.",
    namePrefix: "concerning_signs",
    checkboxes: [
      { id: "sketchy-arrival", value: "Sketchy arrival", label: "Sketchy arrival" },
      { id: "impaired", value: "Seemed impaired", label: "Seemed impaired or fidgety" },
    ],
  },
  {
    id: "housing-situation",
    title: "Housing Situation",
    icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
    subtitle: "Current living arrangements.",
    namePrefix: "housing_stability",
    checkboxes: [
      { id: "stable-housing", value: "Stable current housing", label: "Stable current housing, planning ahead" },
      { id: "reasonable-move", value: "Reasonable explanation for move", label: "Reasonable explanation for moving" },
      { id: "normal-landlord", value: "Normal landlord relations", label: "Speaks normally about current landlord" },
    ],
    notes: {
      id: "housing_notes",
      placeholder: "Their responses and impressions...",
      leadingQuestions: '"Where living now?" "Lease end?" "Landlord relationship?"',
    },
  },
  {
    id: "kids-pets",
    title: "Kids & Pets",
    icon: "M12 9v3.75m9.303-9.303A9.259 9.259 0 0012 2.25c-5.044 0-9.13 3.73-9.256 8.941l-.407 1.222c-.274.821.534 1.751 1.355 1.477l.407-.136a9.25 9.25 0 00.589-3.03l.355-.118a1.2 1.2 0 00-1.464-1.464l-.118.355a9.25 9.25 0 00-3.03.589l-.136.407c-.274.821.534 1.751 1.355 1.477l1.222-.407A9.259 9.259 0 002.25 12c0 5.044 3.73 9.13 8.941 9.256l1.222.407c.821.274 1.751-.534 1.477-1.355l-.136-.407a9.25 9.25 0 00-3.03-.589l-.118.355a1.2 1.2 0 00-1.464-1.464l.355-.118a9.25 9.25 0 00.589-3.03l.407-1.222A9.259 9.259 0 0012 21.75c5.044 0 9.13-3.73 9.256-8.941l.407-1.222c.274-.821-.534-1.751-1.355-1.477l-.407.136a9.25 9.25 0 00-.589 3.03l-.355.118a1.2 1.2 0 001.464 1.464l.118-.355a9.25 9.25 0 003.03-.589l.136-.407c.274-.821-.534-1.751-1.355-1.477l-1.222.407A9.259 9.259 0 0021.75 12z",
    subtitle: "Children or animals.",
    namePrefix: "kids_assessment",
    checkboxes: [
      { id: "well-behaved-kids", value: "Well-behaved kids", label: "Kids well-behaved (if present)" },
      { id: "appropriate-size-occ", value: "Appropriate occupants", label: "Appropriate # occupants for unit" },
    ],
    notes: {
      id: "kids_pets_notes",
      placeholder: "Number, ages, behavior, pets type/size...",
      leadingQuestions: '"Any children?" "Any pets?"',
    },
  },
  {
    id: "payment-method",
    title: "Payment & Employment",
    icon: "M2.25 8.25h19.5M2.25 9H12a2.25 2.25 0 012.25 2.25v2.879m-4.5 3.621H4.5a2.25 2.25 0 01-2.25-2.25V10.5m18.75-2.25H12a2.25 2.25 0 00-2.25 2.25v2.879m0 3.621h6.75a2.25 2.25 0 002.25-2.25V10.5M18.75 9H21c.621 0 1.125.504 1.125 1.125v4.374m-12 0V15a2.25 2.25 0 00-2.25-2.25H4.5M19.5 18H21a2.25 2.25 0 002.25-2.25V9.75",
    subtitle: "Rent payment plans & employment.",
    namePrefix: "payment_type_observations",
    checkboxes: [
      { id: "section8-obs", value: "Section 8 / Voucher", label: "Section 8 / Housing Voucher" },
      { id: "private-pay-obs", value: "Private pay", label: "Private pay" },
      { id: "employed-obs", value: "Currently employed", label: "Currently employed" },
    ],
    notes: {
      id: "employment_details",
      placeholder: "Work type, employer, stability, income...",
      leadingQuestions: '"How cover rent?" "Working? Where?" "Voucher?"',
    },
  },
  {
    id: "local-connections",
    title: "Local Connections",
    icon: "M13.5 6.75a9.75 9.75 0 11-8.625 3.692c1.373 1.096 2.846 2.052 4.382 2.937.644.387 1.107 1.157 1.107 1.993v.75H18m-9.75-7.5l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zM19.5 6.75a9.75 9.75 0 10-8.625 3.692c1.373 1.096 2.846 2.052 4.382 2.937.644.387 1.107 1.157 1.107 1.993v.75H18m-9.75-7.5l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008z",
    subtitle: "Ties to local area.",
    namePrefix: "local_stability",
    checkboxes: [
      { id: "local-family-support", value: "Local family/support", label: "Has local family/support" },
      { id: "established-area-conn", value: "Established in area", label: "Established in area" },
    ],
    notes: {
      id: "local_connections_notes",
      placeholder: "Family, time in area, reasons for location...",
      leadingQuestions: '"Family in area?" "How long around?" "Why this area?"',
    },
  },
  {
    id: "red-flags-detailed",
    title: "Deeper Red Flags",
    icon: "M3 3.75V16.5M16.5 3.75V16.5M2.25 16.5L7.5 21.75M7.5 21.75L12.75 16.5M7.5 21.75V16.5M16.5 16.5L21.75 21.75M21.75 21.75L16.5 16.5M21.75 21.75V16.5",
    subtitle: "Subtle warning signs.",
    namePrefix: "red_flags_observations",
    checkboxes: [
      { id: "badmouth-landlord-flag", value: "Badmouths landlord", label: "Badmouths landlord (victim language)" },
      { id: "vague-history-flag", value: "Vague history", label: "Vague about housing/employment history" },
      { id: "desperate-timeline-flag", value: "Desperate timeline", label: "Desperate timeline (getting kicked out)" },
    ],
  },
  {
    id: "overall-assessment",
    title: "Overall Agent Assessment",
    icon: "M9 12.75l3 3m0 0l3-3m-3 3v2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    subtitle: "Gut feeling & judgment.",
    namePrefix: "assessment_scores",
    checkboxes: [
      { id: "good-neighbor-score", value: "Good neighbor potential", label: "Would be good neighbor" },
      { id: "care-property-score", value: "Would care for property", label: "Would take care of property" },
    ],
  },
  {
    id: "additional-notes-section",
    title: "General Additional Notes",
    icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14.25v4.75a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4.5",
    subtitle: "Other important details.",
    namePrefix: "additional_notes",
    notes: {
      id: "additional_notes",
      placeholder: "Other crucial observations...",
      fullWidth: true,
    },
  },
  {
    id: "maintenance-issues-section",
    title: "Maintenance Issues for Unit",
    icon: "M11.42 1.023a.75.75 0 011.16 0L15.148 3.39c.07.151.213.267.382.327l2.583.961a.75.75 0 01.445.445l.961 2.583c.06.169.176.312.327.382l2.367 1.107a.75.75 0 010 1.16l-2.367 1.107a.75.75 0 01-.327.382l-.961 2.583a.75.75 0 01-.445.445l-2.583.961c-.169.06-.312.176-.382.327L12.58 22.977a.75.75 0 01-1.16 0L8.852 20.61c-.07-.151-.213-.267-.382-.327L5.887 19.322a.75.75 0 01-.445-.445l-.961-2.583c-.06-.169-.176-.312-.327-.382L2.097 14.81a.75.75 0 010-1.16l2.367-1.107a.75.75 0 01.327-.382l.961-2.583a.75.75 0 01.445-.445l2.583-.961c.169-.06.312-.176.382-.327L11.42 1.023zM12.75 12a.75.75 0 10-1.5 0 .75.75 0 001.5 0z",
    subtitle: "Log unit issues.",
    namePrefix: "maintenance_issues",
    notes: {
      id: "maintenance_issues",
      placeholder: "Leaky faucet, broken tile...",
      fullWidth: true,
    },
  },
];
