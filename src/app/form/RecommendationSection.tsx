import React, { useState, useEffect } from 'react';

interface RecommendationProps {
  value: string;
  onChange: (value: string) => void;
}

export const RecommendationSection: React.FC<RecommendationProps> = ({ value, onChange }) => {
  // This effect will run when the component mounts or the `value` prop changes
  // It applies the visual styles based on the selected radio button
  useEffect(() => {
    const updateVisuals = () => {
      // Remove previous styles from all options
      document.querySelectorAll('.bottom-line-option').forEach(option => {
        option.classList.remove('ring-2', 'ring-offset-2', 'scale-105', 'shadow-lg', 'border-blue-500');
        option.classList.add('hover:shadow-md');
      });

      // Apply styles to the currently selected option
      const selectedOptionElement = document.querySelector(`.bottom-line-option input[value="${value}"]`)?.closest('.bottom-line-option');
      if (selectedOptionElement) {
        selectedOptionElement.classList.add('ring-2', 'ring-offset-2', 'scale-105', 'shadow-lg', 'border-blue-500');
        selectedOptionElement.classList.remove('hover:shadow-md');
      }
    };

    updateVisuals();
  }, [value]);

  return (
    <section className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mt-8">
      <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b pb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-yellow-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Bottom Line Recommendation
      </h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center shadow-inner">
        <h3 className="text-lg font-semibold text-yellow-800 mb-5">What's your final call?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bottom-line-option relative p-1.5 bg-white border border-slate-200 rounded-xl transition-all duration-200 ease-in-out cursor-pointer flex items-center justify-center min-h-[100px] text-center" onClick={() => onChange('approve')}>
            <input type="radio" id="approve" name="recommendation" value="approve" className="sr-only" checked={value === "approve"} onChange={e => onChange(e.target.value)} />
            <label htmlFor="approve" className="flex flex-col items-center justify-center p-3 w-full h-full">
              <span className="block text-2xl font-extrabold text-green-600">APPROVE</span>
              <span className="block text-sm text-green-700 mt-1">Looks good!</span>
            </label>
          </div>
          <div className="bottom-line-option relative p-1.5 bg-white border border-slate-200 rounded-xl transition-all duration-200 ease-in-out cursor-pointer flex items-center justify-center min-h-[100px] text-center" onClick={() => onChange('maybe')}>
            <input type="radio" id="maybe" name="recommendation" value="maybe" className="sr-only" checked={value === "maybe"} onChange={e => onChange(e.target.value)} />
            <label htmlFor="maybe" className="flex flex-col items-center justify-center p-3 w-full h-full">
              <span className="block text-2xl font-extrabold text-yellow-600">MAYBE</span>
              <span className="block text-sm text-yellow-700 mt-1">Proceed with caution.</span>
            </label>
          </div>
          <div className="bottom-line-option relative p-1.5 bg-white border border-slate-200 rounded-xl transition-all duration-200 ease-in-out cursor-pointer flex items-center justify-center min-h-[100px] text-center" onClick={() => onChange('hell-no')}>
            <input type="radio" id="hell-no" name="recommendation" value="hell-no" className="sr-only" checked={value === "hell-no"} onChange={e => onChange(e.target.value)} />
            <label htmlFor="hell-no" className="flex flex-col items-center justify-center p-3 w-full h-full">
              <span className="block text-2xl font-extrabold text-red-600">HELL NO</span>
              <span className="block text-sm text-red-700 mt-1">Significant concerns.</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}; 