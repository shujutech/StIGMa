import { isUndefineOrNullOrBlank, notUndefineNotNullNotBlank } from './validation';

export const Months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function padZero(num: number | string, size: number): string {
  let s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}

export function isNum(s: unknown): boolean {
  const str = typeof s === 'string' ? s : String(s);
  return /^\d+$/.test(str);
}

export function decimalPlace(aNum: unknown): string {
  if (aNum == null || aNum === '') return '';
  const n = Number(aNum);
  if (Number.isNaN(n)) return '';
  return n.toFixed(2);
}

export function str2Num(aStr: string | number | null | undefined): number {
  if (aStr == null || aStr === '') return 0;
  const cleaned = String(aStr).replace(/[^0-9.-]/g, '');
  const n = Number(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

export function numberWithComma(aNum: unknown): string {
  if (isUndefineOrNullOrBlank(aNum)) return '';
  return String(aNum).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function numberWithCommaCents(aNum: unknown): string {
  if (!notUndefineNotNullNotBlank(aNum)) return '';
  const parts = String(aNum).split('.');
  const dollar = numberWithComma(parts[0]);
  let cents = parts[1] ?? '00';
  if (cents.length === 0) cents = '00';
  else if (cents.length === 1) cents += '0';
  else if (cents.length > 2) cents = cents.substring(0, 2);
  return `${dollar}.${cents}`;
}

export function handleMoney(aStr: string | number | null | undefined): string {
  if (!notUndefineNotNullNotBlank(aStr)) return '';
  const raw = String(aStr).replace(/[^0-9.]/g, '');
  if (!notUndefineNotNullNotBlank(raw)) return '';
  const dot = raw.indexOf('.');
  if (dot < 0) return numberWithComma(raw);
  let partDollar = raw.substring(0, dot).replace(/\D/g, '');
  let partCent = raw.substring(dot + 1).replace(/\D/g, '');
  if (partCent.length > 2) partCent = partCent.substring(0, 2);
  partDollar = numberWithComma(partDollar);
  return `${partDollar}.${partCent}`;
}

export function formatMoney(aStr: string | undefined): string {
  if (aStr === undefined) return '';
  const parts = aStr.split(/\s+/);
  const currency = parts[0];
  const amount = parts[1];
  if (!notUndefineNotNullNotBlank(amount)) return '<Error>';
  return `${currency} ${numberWithComma(decimalPlace(amount))}`;
}

export function mthAbbrv(aDgtMth: number | string): string {
  if (!isNum(aDgtMth)) return '';
  const n = parseInt(String(aDgtMth), 10);
  if (n < 0 || n > 11) return '';
  return Months[n].substring(0, 3);
}

export function mthNum(aStrMth: string): number {
  for (let i = 0; i < Months.length; i++) {
    if (Months[i].substring(0, 3) === aStrMth) return i + 1;
  }
  return 0;
}

export function dateForDisplay(aDate?: Date | null): string {
  const d = aDate ?? new Date();
  const day = d.getDate();
  const mth = d.getMonth();
  const yr = d.getFullYear();
  return `${padZero(day, 2)}-${mthAbbrv(mth)}-${yr}`;
}

export function timeForDisplay(aDate?: Date | null): string {
  const d = aDate ?? new Date();
  return `${padZero(d.getHours(), 2)}:${padZero(d.getMinutes(), 2)}:${padZero(
    d.getSeconds(),
    2,
  )}`;
}

export function dateTimeForDisplay(aDate?: Date | null): string {
  return `${dateForDisplay(aDate)} ${timeForDisplay(aDate)}`;
}

/** Parse StIGMa display dates like "13-Jun-2020" or "13-Jun-2020 12:34:56". */
export function displayDateToDate(aStrDate: string | null | undefined): Date {
  if (!notUndefineNotNullNotBlank(aStrDate)) return new Date();
  const [datePart, timePart] = String(aStrDate).split(' ');
  const parts = datePart.split('-');
  if (parts.length < 3) return new Date();
  const day = parseInt(parts[0], 10);
  const mth = mthNum(parts[1]);
  let yer = parts[2];
  if (yer.length > 4) yer = yer.substring(0, 4);
  const year = parseInt(yer, 10);
  const iso = `${year}-${padZero(mth, 2)}-${padZero(day, 2)}${timePart ? 'T' + timePart : ''}`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export function dateMonthStart(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
export function dateMonthEnd(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
export function dateMinusDay(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() - n);
  return out;
}
export function datePlusDay(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}
export function dateDiffInDays(aStart: Date, aEnd: Date): number {
  let diff = aEnd.getTime() - aStart.getTime();
  if (diff < 0) diff = -diff;
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
export function dateInRange(aRangeStart: Date, aRangeEnd: Date, aStart: Date, aEnd: Date): boolean {
  const rs = new Date(aRangeStart.toDateString()).getTime();
  const re = new Date(aRangeEnd.toDateString()).getTime();
  const ss = new Date(aStart.toDateString()).getTime();
  const ee = new Date(aEnd.toDateString()).getTime();
  return (ss >= rs && ss <= re) || (rs >= ss && rs <= ee);
}
export function dateAddDays(d: Date, days: number): Date {
  const copy = new Date(d.getTime());
  copy.setDate(d.getDate() + days);
  return copy;
}

/** Build a byte-wise mask pattern used by jQuery Mask legacy widgets. */
export function maskNumberWithWidth(aSize = 15): string {
  const digits = Math.max(1, Math.floor(aSize));
  return '0'.repeat(digits);
}

export interface MoneyParts {
  currency: string;
  dollar: string;
  cent: string;
}

export function json2Money(strValue: string | undefined | null): MoneyParts {
  const out: MoneyParts = { currency: '', dollar: '', cent: '' };
  if (!notUndefineNotNullNotBlank(strValue)) return out;
  const arr = String(strValue).split(' ');
  out.currency = arr[0] ?? '';
  if (arr[1] !== undefined) {
    const dolcent = arr[1].split('.');
    out.dollar = dolcent[0] ?? '';
    if (dolcent[1] !== undefined) out.cent = dolcent[1];
  }
  return out;
}

export function getDisplayDate(d: Date): string {
  return dateForDisplay(d);
}

/** Used by the datepicker widget to populate DD/MM/YYYY pieces. */
export function setDatePickerPartsFromStrDate(strDate: string | null | undefined): {
  day: string;
  month: string;
  year: string;
  hour: string;
  min: string;
  sec: string;
} {
  const empty = { day: '', month: '', year: '', hour: '', min: '', sec: '' };
  if (!notUndefineNotNullNotBlank(strDate)) return empty;
  const [datePart, timePart] = String(strDate).split(' ');
  const parts = datePart.split('-');
  if (parts.length < 3) return empty;
  const [day, mthStr, yr] = parts;
  const mNum = mthNum(mthStr);
  const [hh = '', mm = '', ss = ''] = (timePart ?? '').split(':');
  return {
    day: padZero(day, 2),
    month: padZero(mNum, 2),
    year: yr,
    hour: hh,
    min: mm,
    sec: ss,
  };
}
