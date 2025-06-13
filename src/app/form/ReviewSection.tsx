import React from "react";
import { sectionsConfig } from "./sectionsConfig"; // Import sectionsConfig for review

interface ReviewSectionProps {
  basicInfo: {
    date: string;
    time: string;
    property: string;
    unit: string;
    agent: string;
    prospectName: string;
    prospectPhone: string;
    prospectEmail: string;
    propertyName?: string;
    unitNumber?: string;
  };
  sectionValues: Record<string, any>;
  voiceNoteUrl?: string | null;
  onEdit?: () => void;
  onConfirm?: () => void;
  submitting?: boolean;
  recommendation: string; // Add recommendation prop
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ basicInfo, sectionValues, voiceNoteUrl, onEdit, onConfirm, submitting, recommendation }) => {

  // Helper function to get checkbox labels for review summary
  const getCheckboxLabels = (namePrefix: string) => {
    const section = sectionsConfig.find(s => s.namePrefix === namePrefix);
    // Ensure section and checkboxes exist before filtering
    if (!section || !section.checkboxes) return [];

    const checkedValues = Array.isArray(sectionValues[namePrefix]) ? sectionValues[namePrefix] : [];
    return section.checkboxes
      .filter(cb => checkedValues.includes(cb.value))
      .map(cb => cb.label);
  };

  // Helper to create HTML for review categories
  const createReviewCategoryHTML = (title: string, items: string[], iconPath: string) => {
    const isEmpty = !items || items.length === 0 || (items.length === 1 && (items[0] === "No notes" || items[0] === ""));
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
        <h4 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d={iconPath} /></svg>
          {title}
        </h4>
        {isEmpty ? (
          <p className="text-sm text-slate-500 italic">No details provided.</p>
        ) : (
          <ul className="text-sm text-slate-700 space-y-1">
            {items.map((item, index) => <li key={index}>&bull; {item}</li>)}
          </ul>
        )}
      </div>
    );
  };

  const recommendationClasses = {
    'approve': 'bg-green-100 text-green-800 border-green-200',
    'maybe': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'hell-no': 'bg-red-100 text-red-800 border-red-200',
  }[recommendation] || 'bg-slate-100 text-slate-800 border-slate-200';

  const recommendationText = {
    'approve': 'APPROVE',
    'maybe': 'MAYBE',
    'hell-no': 'HELL NO',
  }[recommendation] || 'No Recommendation';

  return (
    <section className="bg-slate-50 p-8 rounded-2xl shadow-xl border border-slate-200 mt-8">
      <h3 className="text-3xl font-bold text-slate-800 mb-8 pb-4 border-b border-slate-200 text-center">Review Your Assessment</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <h4 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.02M10.5 19.5h3m-6.75-9.75h9.75M18 5.25H6a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 006 19.5h12a2.25 2.25 0 002.25-2.25V7.5A2.25 2.25 0 0018 5.25z" /></svg>
            Basic Information
          </h4>
          <ul className="text-sm text-slate-700 space-y-1.5">
            <li><strong>Date:</strong> <span className="font-medium">{basicInfo.date}</span></li>
            <li><strong>Time:</strong> <span className="font-medium">{basicInfo.time}</span></li>
            <li><strong>Property:</strong> <span className="font-medium">{basicInfo.propertyName || basicInfo.property}</span></li>
            <li><strong>Unit:</strong> <span className="font-medium">{basicInfo.unitNumber || basicInfo.unit}</span></li>
            <li><strong>Agent:</strong> <span className="font-medium">{basicInfo.agent}</span></li>
            <li><strong>Prospect Name:</strong> <span className="font-medium">{basicInfo.prospectName}</span></li>
            <li><strong>Phone Number:</strong> <span className="font-medium">{basicInfo.prospectPhone}</span></li>
            <li><strong>Email Address:</strong> <span className="font-medium">{basicInfo.prospectEmail || 'N/A'}</span></li>
          </ul>
        </div>

        {voiceNoteUrl && (
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center">
            <h4 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 1.5a6 6 0 01-6-6V6.75m6 7.5v3m-3.75-3.75h7.5M12 10.5a3 3 0 11-6 0v-1.5a3 3 0 116 0v1.5a3 3 0 01-3 3z" /></svg>
              Voice Note
            </h4>
            <audio controls src={voiceNoteUrl} className="w-full max-w-sm" />
          </div>
        )}

        {/* Dynamic Sections Summary */}
        {createReviewCategoryHTML("Positive Observations", getCheckboxLabels("positive_observations"), "M15 12a3 3 0 11-6 0 3 3 0 016 0z")}
        {createReviewCategoryHTML("Concerning Signs", getCheckboxLabels("concerning_signs"), "M12 9v3.75m-9.303 3.376c-.866 1.5.305 3.293 2.305 3.293h13.4c2.002 0 3.173-1.793 2.305-3.293L13.682 2.292a1.875 1.875 0 00-3.364 0L2.697 16.626zM12 15.75h.007v.008H12v-.008z")}
        {createReviewCategoryHTML("Housing Situation Notes", [sectionValues.housing_notes || ""], "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25")}
        {createReviewCategoryHTML("Housing Stability", getCheckboxLabels("housing_stability"), "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25")}
        {createReviewCategoryHTML("Kids/Pets Notes", [sectionValues.kids_pets_notes || ""], "M12 9v3.75m9.303-9.303A9.259 9.259 0 0012 2.25c-5.044 0-9.13 3.73-9.256 8.941l-.407 1.222c-.274.821.534 1.751 1.355 1.477l.407-.136a9.25 9.25 0 00.589-3.03l.355-.118a1.2 1.2 0 00-1.464-1.464l-.118.355a9.25 9.25 0 00-3.03.589l-.136.407c-.274.821.534 1.751 1.355 1.477l1.222-.407A9.259 9.259 0 002.25 12c0 5.044 3.73 9.13 8.941 9.256l1.222.407c.821.274 1.751-.534 1.477-1.355l-.136-.407a9.25 9.25 0 00-3.03-.589l-.118.355a1.2 1.2 0 00-1.464-1.464l.355-.118a9.25 9.25 0 00.589-3.03l.407-1.222A9.259 9.259 0 0012 21.75c5.044 0 9.13-3.73 9.256-8.941l.407-1.222c.274-.821-.534-1.751-1.355-1.477l-.407.136a9.25 9.25 0 00-.589 3.03l-.355.118a1.2 1.2 0 001.464 1.464l.118-.355a9.25 9.25 0 003.03-.589l.136-.407c.274-.821-.534-1.751-1.355-1.477l-1.222.407A9.259 9.259 0 0021.75 12z")}
        {createReviewCategoryHTML("Kids Assessment", getCheckboxLabels("kids_assessment"), "M12 9v3.75m9.303-9.303A9.259 9.259 0 0012 2.25c-5.044 0-9.13 3.73-9.256 8.941l-.407 1.222c-.274.821.534 1.751 1.355 1.477l.407-.136a9.25 9.25 0 00.589-3.03l.355-.118a1.2 1.2 0 00-1.464-1.464l-.118.355a9.25 9.25 0 00-3.03.589l-.136.407c-.274.821.534 1.751 1.355 1.477l1.222-.407A9.259 9.259 0 002.25 12c0 5.044 3.73 9.13 8.941 9.256l1.222.407c.821.274 1.751-.534 1.477-1.355l-.136-.407a9.25 9.25 0 00-3.03-.589l-.118.355a1.2 1.2 0 00-1.464-1.464l.355-.118a9.25 9.25 0 00.589-3.03l.407-1.222A9.259 9.259 0 0012 21.75c5.044 0 9.13-3.73 9.256-8.941l.407-1.222c.274-.821-.534-1.751-1.355-1.477l-.407.136a9.25 9.25 0 00-.589 3.03l-.355.118a1.2 1.2 0 001.464 1.464l.118-.355a9.25 9.25 0 003.03-.589l.136-.407c.274-.821-.534-1.751-1.355-1.477l-1.222.407A9.259 9.259 0 0021.75 12z")}
        {createReviewCategoryHTML("Employment / Payment Details", [sectionValues.employment_details || ""], "M2.25 8.25h19.5M2.25 9H12a2.25 2.25 0 012.25 2.25v2.879m-4.5 3.621H4.5a2.25 2.25 0 01-2.25-2.25V10.5m18.75-2.25H12a2.25 2.25 0 00-2.25 2.25v2.879m0 3.621h6.75a2.25 2.25 0 002.25-2.25V10.5M18.75 9H21c.621 0 1.125.504 1.125 1.125v4.374m-12 0V15a2.25 2.25 0 00-2.25-2.25H4.5M19.5 18H21a2.25 2.25 0 002.25-2.25V9.75")}
        {createReviewCategoryHTML("Payment Observations", getCheckboxLabels("payment_type_observations"), "M2.25 8.25h19.5M2.25 9H12a2.25 2.25 0 012.25 2.25v2.879m-4.5 3.621H4.5a2.25 2.25 0 01-2.25-2.25V10.5m18.75-2.25H12a2.25 2.25 0 00-2.25 2.25v2.879m0 3.621h6.75a2.25 2.25 0 002.25-2.25V10.5M18.75 9H21c.621 0 1.125.504 1.125 1.125v4.374m-12 0V15a2.25 2.25 0 00-2.25-2.25H4.5M19.5 18H21a2.25 2.25 0 002.25-2.25V9.75")}
        {createReviewCategoryHTML("Local Connections Notes", [sectionValues.local_connections_notes || ""], "M13.5 6.75a9.75 9.75 0 11-8.625 3.692c1.373 1.096 2.846 2.052 4.382 2.937.644.387 1.107 1.157 1.107 1.993v.75H18m-9.75-7.5l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zM19.5 6.75a9.75 9.75 0 10-8.625 3.692c1.373 1.096 2.846 2.052 4.382 2.937.644.387 1.107 1.157 1.107 1.993v.75H18m-9.75-7.5l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008z")}
        {createReviewCategoryHTML("Local Stability", getCheckboxLabels("local_stability"), "M13.5 6.75a9.75 9.75 0 11-8.625 3.692c1.373 1.096 2.846 2.052 4.382 2.937.644.387 1.107 1.157 1.107 1.993v.75H18m-9.75-7.5l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zM19.5 6.75a9.75 9.75 0 10-8.625 3.692c1.373 1.096 2.846 2.052 4.382 2.937.644.387 1.107 1.157 1.107 1.993v.75H18m-9.75-7.5l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008zm1.5 0l.008.008v.008h-.008v-.008z")}
        {createReviewCategoryHTML("Red Flags", getCheckboxLabels("red_flags_observations"), "M3 3.75V16.5M16.5 3.75V16.5M2.25 16.5L7.5 21.75M7.5 21.75L12.75 16.5M7.5 21.75V16.5M16.5 16.5L21.75 21.75M21.75 21.75L16.5 16.5M21.75 21.75V16.5")}
        {createReviewCategoryHTML("General Assessment Scores", getCheckboxLabels("assessment_scores"), "M9 12.75l3 3m0 0l3-3m-3 3v2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z")}
        {createReviewCategoryHTML("Additional Notes", [sectionValues.additional_notes || ""], "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14.25v4.75a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4.5")}
        {createReviewCategoryHTML("Maintenance Issues for Unit", [sectionValues.maintenance_issues || ""], "M11.42 1.023a.75.75 0 011.16 0L15.148 3.39c.07.151.213.267.382.327l2.583.961a.75.75 0 01.445.445l.961 2.583c.06.169.176.312.327.382l2.367 1.107a.75.75 0 010 1.16l-2.367 1.107a.75.75 0 01-.327.382l-.961 2.583a.75.75 0 01-.445.445l-2.583.961c-.169.06-.312.176-.382.327L12.58 22.977a.75.75 0 01-1.16 0L8.852 20.61c-.07-.151-.213-.267-.382-.327L5.887 19.322a.75.75 0 01-.445-.445l-.961-2.583c-.06-.169-.176-.312-.327-.382L2.097 14.81a.75.75 0 010-1.16l2.367-1.107a.75.75 0 01.327-.382l.961-2.583a.75.75 0 01.445-.445l2.583-.961c.169-.06.312-.176.382-.327L11.42 1.023zM12.75 12a.75.75 0 10-1.5 0 .75.75 0 001.5 0z")}

        <div className={`p-5 rounded-lg shadow-sm border ${recommendationClasses} md:col-span-2 flex items-center justify-between`}>
          <h4 className="text-base font-semibold">Final Recommendation:</h4>
          <p className="text-xl font-bold">{recommendationText}</p>
        </div>

      </div>
      <div className="mt-8 flex justify-end gap-3">
        {onEdit && (
          <button type="button" onClick={onEdit} className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-sm font-medium rounded-lg shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit Assessment
          </button>
        )}
        {onConfirm && (
          <button type="button" onClick={onConfirm} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150" disabled={submitting}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {submitting ? "Submitting..." : "Confirm & Submit"}
          </button>
        )}
      </div>
    </section>
  );
};
