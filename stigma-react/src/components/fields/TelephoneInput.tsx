import { useMemo } from 'react';
import type { StigmaField } from '../../types/stigma';
import { FieldLabel } from './FieldLabel';

export interface TelephoneInputProps {
  label: string;
  field: StigmaField;
  fqn: string;
  disabled?: boolean;
  onChange: (fqn: string, value: string) => void;
}

const INPUT =
  'form-control bg-transparent border border-gray-300 rounded px-2 py-1 text-sm min-w-0';

interface Parts {
  country: string;
  area: string;
  number: string;
}

function parseTelephone(raw: string): Parts {
  if (!raw) return { country: '', area: '', number: '' };
  const match = raw.match(/^\+?(\d{1,4})[- ]?(\d{1,4})[- ]?(.+)$/);
  if (match) return { country: match[1], area: match[2], number: match[3] };
  return { country: '', area: '', number: raw };
}

function joinTelephone(p: Parts): string {
  const parts = [p.country, p.area, p.number].filter((s) => s && s.length > 0);
  return parts.join('-');
}

export function TelephoneInput({ label, field, fqn, disabled, onChange }: TelephoneInputProps) {
  const value = typeof field.data === 'string' ? field.data : '';
  const parts = useMemo(() => parseTelephone(value), [value]);

  function patch(next: Partial<Parts>) {
    const merged = { ...parts, ...next };
    onChange(fqn, joinTelephone(merged));
  }

  return (
    <FieldLabel label={label}>
      <div className="flex items-center gap-1 flex-wrap">
        <input
          className={`${INPUT} w-16`}
          placeholder="+CC"
          value={parts.country}
          disabled={disabled}
          onChange={(e) => patch({ country: e.target.value.replace(/\D/g, '').slice(0, 4) })}
        />
        <input
          className={`${INPUT} w-20`}
          placeholder="Area"
          value={parts.area}
          disabled={disabled}
          onChange={(e) => patch({ area: e.target.value.replace(/\D/g, '').slice(0, 4) })}
        />
        <input
          className={`${INPUT} flex-1 min-w-[120px]`}
          placeholder="Number"
          value={parts.number}
          disabled={disabled}
          onChange={(e) => patch({ number: e.target.value })}
        />
      </div>
    </FieldLabel>
  );
}
