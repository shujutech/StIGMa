import type { StigmaField, StigmaObject } from '../types/stigma';
import {
  isUndefineOrNullOrBlank,
  notUndefineNotNull,
  notUndefineNotNullNotBlank,
} from './validation';

/** Builds a dot-separated field path (GetJsonPath). */
export function getJsonPath(basePath: string, fieldName: string): string {
  let result = basePath;
  if (result !== '' && fieldName !== '') {
    result += '.';
  }
  result += fieldName;
  return result;
}

/** CamelCaseToTitleCase — inserts spaces before capitals. */
export function camelCaseToTitleCase(camelCase: string): string {
  if (camelCase == null || camelCase === '') return camelCase;
  const s = camelCase.trim();
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (/[A-Z]/.test(s[i]) && i !== 0 && /[a-z]/.test(s[i - 1])) {
      out += ' ';
    }
    if (i === 0 && /[a-z]/.test(s[i])) {
      out += s[i].toUpperCase();
    } else {
      out += s[i];
    }
  }
  return out;
}

/** TitleCaseToCamelCase — removes spaces and lowercases first char. */
export function titleCaseToCamelCase(titleCase: string): string {
  const noSpace = titleCase.replace(/ /g, '');
  return noSpace.charAt(0).toLowerCase() + noSpace.slice(1);
}

/** Replace special chars with safe placeholders for DOM ids. */
export function specialCharReplace(name: string): string {
  return name
    .replace(/ /g, '_')
    .replace(/\[/g, 'bracketo')
    .replace(/\]/g, 'bracketc')
    .replace(/\./g, 'dot');
}

/** Restore replaced special chars. */
export function specialCharUnplace(name: string): string {
  return name
    .replace(/bracketo/g, '[')
    .replace(/bracketc/g, ']')
    .replace(/dot/g, '.');
}

/** Build an element id from an FQN and optional prefix/form-id. */
export function genElementId(
  oneElementId: string | undefined,
  fieldFqn: string | undefined,
  prefix: string | undefined,
  formId: string | undefined,
): string {
  const safePrefix = prefix ?? '';
  const safeFqn = fieldFqn ? specialCharReplace(fieldFqn) : '';
  const safeForm = formId ? specialCharReplace(formId) : '';
  if (oneElementId) {
    return `${safePrefix}${oneElementId}`;
  }
  const parts = [safePrefix, safeForm, safeFqn].filter(Boolean);
  return parts.join('_');
}

type WalkTarget = StigmaField | StigmaObject | Record<string, unknown> | undefined;

function hasOwn(obj: unknown, key: string): boolean {
  return typeof obj === 'object' && obj !== null && Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Traverse a StIGMa envelope by FQN. Supports `foo.bar[0].baz` notation.
 */
export function getVarByJsonPath(root: WalkTarget, fqn: string): WalkTarget {
  const pthAry = fqn.split('.');
  let result: WalkTarget = root;
  for (let i = 0; i < pthAry.length; i++) {
    if (result === undefined || result === null) return undefined;
    const key = pthAry[i];
    if (key.indexOf('[') === -1) {
      const r = result as Record<string, unknown>;
      if (hasOwn(r, key)) {
        result = r[key] as WalkTarget;
      } else if (notUndefineNotNullNotBlank((r as { data?: unknown }).data)) {
        const data = (r as { data: Record<string, unknown> }).data;
        if (hasOwn(data, key)) {
          result = data[key] as WalkTarget;
        } else {
          return undefined;
        }
      } else if (notUndefineNotNullNotBlank((r as { dataset?: unknown }).dataset)) {
        const ds = (r as { dataset: unknown[] }).dataset;
        const idx = Number(key);
        if (Number.isFinite(idx) && ds[idx] !== undefined) {
          result = ds[idx] as WalkTarget;
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    } else {
      const idxMatches = key.match(/\[(.*?)\]/g);
      if (!idxMatches) return undefined;
      const nmePt = key.substring(0, key.indexOf(idxMatches[0]));
      const idxPt = parseInt(idxMatches[0].slice(1, -1), 10);
      const data = (result as { data?: Record<string, StigmaField> }).data;
      if (!data || !data[nmePt]?.dataset) return undefined;
      result = data[nmePt].dataset[idxPt] as unknown as WalkTarget;
      if (!result) return undefined;
    }
  }
  return result;
}

/** Assign a new `data` value at the given FQN path (mutates in place). */
export function jsonAssignment(root: WalkTarget, fqn: string, newValue: unknown): WalkTarget {
  const node = getVarByJsonPath(root, fqn);
  if (node && typeof node === 'object') {
    (node as { data: unknown }).data = newValue;
  }
  return node;
}

/** Read the `.data` (or raw value) at an FQN path. */
export function getValueByJsonPath(root: WalkTarget, fqn: string): unknown {
  if (fqn === 'objectId') return (root as StigmaObject)?.objectId;
  if (fqn === 'clasz') return (root as StigmaObject)?.clasz;
  if (fqn === 'delete') return (root as StigmaObject)?.delete;
  const node = getVarByJsonPath(root, fqn);
  if (typeof node === 'object' && node !== null) {
    if (hasOwn(node, 'data')) return (node as { data: unknown }).data;
    if (hasOwn(node, 'dataset')) return (node as { dataset: unknown }).dataset;
    return undefined;
  }
  return node;
}

/** Return the `dataset` array at an FQN. */
export function getAryByJsonPath(
  root: WalkTarget,
  fqn: string,
): StigmaObject[] | undefined {
  let result = root;
  if (notUndefineNotNullNotBlank(fqn)) {
    result = getVarByJsonPath(root, fqn);
  }
  if (isUndefineOrNullOrBlank(result)) return undefined;
  return (result as StigmaField).dataset;
}

/** Marks whether a value is a scalar data cell (not object/dataset). */
export function isAtomic(field: StigmaField): boolean {
  if (field.dataset !== undefined) return false;
  if (field.lookup === true) return true;
  return field.data === undefined || typeof field.data !== 'object' || field.data === null;
}

export { notUndefineNotNull };
