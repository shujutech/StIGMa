import type { StigmaField } from '../../types/stigma';

export interface CheckboxFieldProps {
  label: string;
  field: StigmaField;
  fqn: string;
  disabled?: boolean;
  onChange: (fqn: string, value: string) => void;
}

export function CheckboxField({ label, field, fqn, disabled, onChange }: CheckboxFieldProps) {
  const raw = field.data;
  const checked = raw === true || raw === 'true';
  return (
    <div className="st-eachfield st-row inline-block w-full md:w-auto mt-6 mr-0 md:mr-10">
      <div className="st-input-area float-left">
        <input
          type="checkbox"
          className="st-checkbox min-w-[15px] min-h-[15px]"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(fqn, String(e.target.checked))}
        />
      </div>
      <div className="st-label-area float-left ml-2.5">
        <label className="font-bold mb-0">{label}</label>
      </div>
    </div>
  );
}
