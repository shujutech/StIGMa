import type { ReactNode } from 'react';

export interface FieldLabelProps {
  label: string;
  children: ReactNode;
  className?: string;
  errorMsg?: string;
}

/**
 * Label + input wrapper matching the legacy `st-eachfield st-row` layout
 * (UiUtil.CreateTextFieldWithLabel, UiUtil.js lines 2204-2242).
 */
export function FieldLabel({ label, children, className = '', errorMsg }: FieldLabelProps) {
  return (
    <div className={`st-eachfield st-row inline-block w-full md:w-auto mt-6 mr-0 md:mr-10 ${className}`}>
      <div className="st-label-area mr-1">
        <label className="st-label-txt font-bold float-left mb-0">{label}</label>
        {errorMsg ? <span className="st-error-msg text-red-600 text-xs ml-1">{errorMsg}</span> : null}
      </div>
      <div className="st-input-area">{children}</div>
    </div>
  );
}
