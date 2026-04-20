import { useMemo, useState } from 'react';
import type { StigmaField } from '../../types/stigma';
import { FieldLabel } from './FieldLabel';

export interface ComboBoxFieldProps {
  label: string;
  field: StigmaField;
  fqn: string;
  disabled?: boolean;
  onChange: (fqn: string, selectedDescription: string) => void;
}

const BASE_SELECT = [
  'form-control',
  'bg-transparent',
  'border',
  'border-gray-300',
  'rounded',
  'px-2',
  'py-1',
  'text-sm',
  'min-w-[170px]',
  'st-combo-box',
  'disabled:bg-gray-100 disabled:text-gray-500',
].join(' ');

function extractCurrentDescription(field: StigmaField): string {
  const data = field.data;
  if (typeof data === 'object' && data !== null) {
    const descr = (data as Record<string, StigmaField>).Descr;
    if (descr && typeof descr.data === 'string') return descr.data;
    const anyDescr = (data as Record<string, unknown>).descr;
    if (typeof anyDescr === 'string') return anyDescr;
  }
  if (typeof data === 'string') return data;
  return '';
}

export function ComboBoxField({ label, field, fqn, disabled, onChange }: ComboBoxFieldProps) {
  const options = useMemo(() => {
    const opt = field.option ?? {};
    return Object.entries(opt).map(([key, val]) => ({
      key,
      display: typeof val === 'string' ? val : key,
    }));
  }, [field.option]);

  const current = extractCurrentDescription(field);
  const editable = field.editable === true;
  const [freeText, setFreeText] = useState('');

  if (editable) {
    return (
      <FieldLabel label={label}>
        <div className="st-select-editable relative inline-block">
          <select
            className={BASE_SELECT}
            value={current}
            disabled={disabled}
            onChange={(e) => {
              setFreeText('');
              onChange(fqn, e.target.value);
            }}
          >
            <option value="">&nbsp;</option>
            {options.map((o) => (
              <option key={o.key} value={o.display}>
                {o.display}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="absolute top-0 left-0 border-none px-2 py-1 text-sm h-full min-w-[170px] bg-transparent"
            value={freeText}
            disabled={disabled}
            onChange={(e) => {
              setFreeText(e.target.value);
              onChange(fqn, e.target.value);
            }}
          />
        </div>
      </FieldLabel>
    );
  }

  return (
    <FieldLabel label={label}>
      <select
        className={BASE_SELECT}
        value={current}
        disabled={disabled}
        onChange={(e) => onChange(fqn, e.target.value)}
      >
        <option value="">&nbsp;</option>
        {options.map((o) => (
          <option key={o.key} value={o.display}>
            {o.display}
          </option>
        ))}
      </select>
    </FieldLabel>
  );
}
