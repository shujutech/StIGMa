export function notUndefineNotNull(v: unknown): boolean {
  return v !== undefined && v !== null && v !== 'undefined';
}

export function notUndefineNotNullNotBlank(v: unknown): boolean {
  if (!notUndefineNotNull(v)) return false;
  if (typeof v === 'string') return v.trim().length !== 0;
  return true;
}

export function isUndefineOrNull(v: unknown): boolean {
  return !notUndefineNotNull(v);
}

export function isUndefineOrNullOrBlank(v: unknown): boolean {
  return !notUndefineNotNullNotBlank(v);
}

export function isEmptyObject(v: unknown): boolean {
  if (typeof v !== 'object' || v === null) return true;
  return Object.keys(v as Record<string, unknown>).length === 0;
}

export function validateEmail(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
