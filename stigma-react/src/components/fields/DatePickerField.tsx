import { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import type { StigmaField } from '../../types/stigma';
import { FieldLabel } from './FieldLabel';
import {
  dateForDisplay,
  dateTimeForDisplay,
  displayDateToDate,
  padZero,
  mthAbbrv,
  mthNum,
} from '../../utils/formatting';

export interface DatePickerFieldProps {
  label: string;
  field: StigmaField;
  fqn: string;
  disabled?: boolean;
  showTime: boolean;
  onChange: (fqn: string, formattedDate: string) => void;
}

const INPUT_BASE =
  'form-control bg-transparent border border-gray-300 rounded px-2 py-1 text-sm text-center';

interface Parts {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  second: string;
}

function strToParts(strDate: string | null | undefined, showTime: boolean): Parts {
  const empty: Parts = { day: '', month: '', year: '', hour: '', minute: '', second: '' };
  if (!strDate) return empty;
  const [d, t] = String(strDate).split(' ');
  const [day, monthAbbrv, year] = d.split('-');
  const parts: Parts = {
    day: day ?? '',
    month: monthAbbrv ? padZero(mthNum(monthAbbrv), 2) : '',
    year: year ?? '',
    hour: '',
    minute: '',
    second: '',
  };
  if (showTime && t) {
    const [hh, mm, ss] = t.split(':');
    parts.hour = hh ?? '';
    parts.minute = mm ?? '';
    parts.second = ss ?? '';
  }
  return parts;
}

function partsToDate(parts: Parts): Date | null {
  if (!parts.day || !parts.month || !parts.year) return null;
  const d = parseInt(parts.day, 10);
  const m = parseInt(parts.month, 10) - 1;
  const y = parseInt(parts.year, 10);
  if ([d, m, y].some(Number.isNaN)) return null;
  const date = new Date(y, m, d);
  if (parts.hour) date.setHours(parseInt(parts.hour, 10) || 0);
  if (parts.minute) date.setMinutes(parseInt(parts.minute, 10) || 0);
  if (parts.second) date.setSeconds(parseInt(parts.second, 10) || 0);
  return date;
}

function dateToStr(date: Date, showTime: boolean): string {
  return showTime ? dateTimeForDisplay(date) : dateForDisplay(date);
}

export function DatePickerField({
  label,
  field,
  fqn,
  disabled,
  showTime,
  onChange,
}: DatePickerFieldProps) {
  const strDate = typeof field.data === 'string' ? field.data : '';
  const [parts, setParts] = useState<Parts>(() => strToParts(strDate, showTime));
  const selected = useMemo(() => partsToDate(parts) ?? (strDate ? displayDateToDate(strDate) : null), [parts, strDate]);

  function commit(next: Parts) {
    setParts(next);
    const d = partsToDate(next);
    if (d) onChange(fqn, dateToStr(d, showTime));
  }

  function handlePartChange<K extends keyof Parts>(k: K, v: string) {
    commit({ ...parts, [k]: v });
  }

  function handlePickerChange(d: Date | null) {
    if (!d) return;
    const next: Parts = {
      day: padZero(d.getDate(), 2),
      month: padZero(d.getMonth() + 1, 2),
      year: String(d.getFullYear()),
      hour: showTime ? padZero(d.getHours(), 2) : parts.hour,
      minute: showTime ? padZero(d.getMinutes(), 2) : parts.minute,
      second: showTime ? padZero(d.getSeconds(), 2) : parts.second,
    };
    commit(next);
  }

  const fullLabel = showTime
    ? `${label} (DD/MM/YYYY HOUR/MIN/SEC +timezone)`
    : `${label} (DD/MM/YYYY)`;

  return (
    <FieldLabel label={fullLabel}>
      <div className="st-date-picker flex flex-wrap items-center gap-1">
        <input
          className={`${INPUT_BASE} w-12 min-w-0`}
          value={parts.day}
          size={2}
          disabled={disabled}
          onChange={(e) => handlePartChange('day', e.target.value.replace(/\D/g, '').slice(0, 2))}
        />
        <span>/</span>
        <input
          className={`${INPUT_BASE} w-12 min-w-0`}
          value={parts.month}
          size={2}
          disabled={disabled}
          onChange={(e) => handlePartChange('month', e.target.value.replace(/\D/g, '').slice(0, 2))}
        />
        <span>/</span>
        <input
          className={`${INPUT_BASE} w-16 min-w-0`}
          value={parts.year}
          size={4}
          disabled={disabled}
          onChange={(e) => handlePartChange('year', e.target.value.replace(/\D/g, '').slice(0, 4))}
        />
        {showTime ? (
          <>
            <span className="ml-2">/</span>
            <input
              className={`${INPUT_BASE} w-12 min-w-0`}
              value={parts.hour}
              size={2}
              disabled={disabled}
              onChange={(e) =>
                handlePartChange('hour', e.target.value.replace(/\D/g, '').slice(0, 2))
              }
            />
            <span>:</span>
            <input
              className={`${INPUT_BASE} w-12 min-w-0`}
              value={parts.minute}
              size={2}
              disabled={disabled}
              onChange={(e) =>
                handlePartChange('minute', e.target.value.replace(/\D/g, '').slice(0, 2))
              }
            />
            <span>:</span>
            <input
              className={`${INPUT_BASE} w-12 min-w-0`}
              value={parts.second}
              size={2}
              disabled={disabled}
              onChange={(e) =>
                handlePartChange('second', e.target.value.replace(/\D/g, '').slice(0, 2))
              }
            />
          </>
        ) : null}
        <DatePicker
          selected={selected}
          disabled={disabled}
          onChange={handlePickerChange}
          showTimeSelect={showTime}
          dateFormat={showTime ? 'dd-MMM-yyyy HH:mm:ss' : 'dd-MMM-yyyy'}
          className="hidden"
          customInput={
            <button
              type="button"
              className="ml-1 px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
              aria-label="Open calendar"
            >
              📅
            </button>
          }
        />
        {selected ? (
          <span className="text-xs text-gray-500 ml-2">
            {padZero(selected.getDate(), 2)}-{mthAbbrv(selected.getMonth())}-{selected.getFullYear()}
          </span>
        ) : null}
      </div>
    </FieldLabel>
  );
}
