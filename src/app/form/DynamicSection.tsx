import React from "react";

export interface CheckboxOption {
  id: string;
  value: string;
  label: string;
}

export interface NotesConfig {
  id: string;
  placeholder: string;
  leadingQuestions?: string;
  fullWidth?: boolean;
}

export interface SectionConfig {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  namePrefix: string;
  checkboxes?: CheckboxOption[];
  notes?: NotesConfig;
}

interface DynamicSectionProps {
  config: SectionConfig;
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
}

export const DynamicSection: React.FC<DynamicSectionProps> = ({ config, values, onChange }) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mt-8 first:mt-0">
      <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b pb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-blue-500">
          <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
        </svg>
        {config.title}
      </h2>
      <p className="text-sm text-slate-500 mb-6 italic">{config.subtitle}</p>
      {config.checkboxes && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {config.checkboxes.map(cb => (
            <div key={cb.id} className="flex items-start p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-150 border border-slate-200">
              <input
                type="checkbox"
                id={cb.id}
                name={`${config.namePrefix}.${cb.id}`}
                value={cb.value}
                checked={Array.isArray(values[config.namePrefix]) ? values[config.namePrefix].includes(cb.value) : false}
                onChange={e => {
                  const arr = Array.isArray(values[config.namePrefix]) ? [...values[config.namePrefix]] : [];
                  if (e.target.checked) arr.push(cb.value);
                  else {
                    const idx = arr.indexOf(cb.value);
                    if (idx > -1) arr.splice(idx, 1);
                  }
                  onChange(config.namePrefix, arr);
                }}
                className="h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-0.5 cursor-pointer"
              />
              <label htmlFor={cb.id} className="ml-3 text-base text-slate-800 cursor-pointer flex-1">{cb.label}</label>
            </div>
          ))}
        </div>
      )}
      {config.notes && (
        <div className={`mt-8 ${config.notes.fullWidth ? "md:col-span-full" : ""}`}>
          {config.notes.leadingQuestions && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-blue-800">
              <h4 className="text-sm font-semibold mb-1">Leading Questions:</h4>
              <p className="text-sm italic">{config.notes.leadingQuestions}</p>
            </div>
          )}
          <label htmlFor={config.notes!.id} className="block text-sm font-medium text-slate-700 mb-2">Notes:</label>
          <textarea
            id={config.notes!.id}
            name={config.notes!.id}
            rows={4}
            placeholder={config.notes!.placeholder}
            className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-slate-50"
            value={values[config.notes!.id] || ""}
            onChange={e => onChange(config.notes!.id, e.target.value)}
          />
        </div>
      )}
    </section>
  );
};
