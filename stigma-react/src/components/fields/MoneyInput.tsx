import { useMemo } from 'react';
import { NumericFormat } from 'react-number-format';
import type { StigmaField } from '../../types/stigma';
import { FieldLabel } from './FieldLabel';
import { json2Money } from '../../utils/formatting';

export interface MoneyInputProps {
  label: string;
  field: StigmaField;
  fqn: string;
  disabled?: boolean;
  onChange: (fqn: string, value: string) => void;
}

const INPUT =
  'form-control bg-transparent border border-gray-300 rounded px-2 py-1 text-sm text-right';

export function MoneyInput({ label, field, fqn, disabled, onChange }: MoneyInputProps) {
  const parts = useMemo(() => json2Money(typeof field.data === 'string' ? field.data : ''), [
    field.data,
  ]);

  const currencies = field.currencies ?? {};
  const currencyOptions = Object.entries(currencies).map(([k, v]) => ({
    value: v ?? k,
    label: v ?? k,
  }));

  function commit(next: { currency?: string; dollar?: string; cent?: string }) {
    const merged = { ...parts, ...next };
    let dollar = (merged.dollar || '0').replace(/,/g, '');
    let cent = merged.cent || '00';
    if (!dollar) dollar = '0';
    if (cent.length === 1) cent = cent + '0';
    if (cent.length > 2) cent = cent.slice(0, 2);
    const joined = `${merged.currency || ''} ${dollar}.${cent}`.trim();
    onChange(fqn, joined);
  }

  return (
    <FieldLabel label={label}>
      <div className="flex items-center gap-1 flex-wrap">
        <select
          className={`${INPUT} min-w-[70px]`}
          style={{ minWidth: 70 }}
          value={parts.currency}
          disabled={disabled}
          onChange={(e) => commit({ currency: e.target.value })}
        >
          <option value="">&nbsp;</option>
          {currencyOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <NumericFormat
          className={`${INPUT} w-40`}
          value={parts.dollar}
          thousandSeparator=","
          allowNegative={false}
          decimalScale={0}
          disabled={disabled}
          onValueChange={(v) => commit({ dollar: v.value })}
        />
        <span>.</span>
        <input
          className={`${INPUT} w-10`}
          size={2}
          maxLength={2}
          value={parts.cent}
          disabled={disabled}
          onChange={(e) => commit({ cent: e.target.value.replace(/\D/g, '').slice(0, 2) })}
        />
      </div>
    </FieldLabel>
  );
}
