import { PatternFormat, NumericFormat } from 'react-number-format';
import type { StigmaField } from '../../types/stigma';
import { FieldLabel } from './FieldLabel';

export interface TextInputProps {
  label: string;
  field: StigmaField;
  fqn: string;
  disabled?: boolean;
  onChange: (fqn: string, value: string) => void;
}

const BASE_INPUT = [
  'form-control',
  'bg-transparent',
  'border',
  'border-gray-300',
  'rounded',
  'px-2',
  'py-1',
  'text-sm',
  'w-full md:w-auto',
  'min-w-[170px]',
  'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-default',
].join(' ');

export function TextInput({ label, field, fqn, disabled, onChange }: TextInputProps) {
  const value = field.data == null ? '' : String(field.data);
  const size = field.size;

  if (field.type === 'encrypt') {
    return (
      <FieldLabel label={label}>
        <input
          type="password"
          className={BASE_INPUT}
          size={size}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(fqn, e.target.value)}
        />
      </FieldLabel>
    );
  }

  if (field.type === 'integer') {
    return (
      <FieldLabel label={label}>
        <NumericFormat
          className={BASE_INPUT}
          value={value}
          thousandSeparator
          allowNegative={false}
          decimalScale={0}
          disabled={disabled}
          onValueChange={(v) => onChange(fqn, v.value)}
        />
      </FieldLabel>
    );
  }

  if (field.mask) {
    const pattern = field.mask.replace(/0/g, '#');
    return (
      <FieldLabel label={label}>
        <PatternFormat
          className={BASE_INPUT}
          format={pattern}
          value={value}
          mask=" "
          disabled={disabled}
          onValueChange={(v) => onChange(fqn, v.value)}
        />
      </FieldLabel>
    );
  }

  return (
    <FieldLabel label={label}>
      <input
        type="text"
        className={BASE_INPUT}
        size={size}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(fqn, e.target.value)}
      />
    </FieldLabel>
  );
}
