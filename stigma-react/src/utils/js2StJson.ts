import { camelCaseToTitleCase } from './jsonPath';
import type { StigmaField, StigmaObject } from '../types/stigma';
import { notUndefineNotNull } from './validation';

/**
 * Port of Js2StJson.js `Obj2StJson`. Converts a plain JS object into a
 * StIGMa envelope (`{ data: { ... } }`). Primitive values become
 * `{ data: value }`; nested objects are recursed into.
 */
export function obj2StJson(obj: Record<string, unknown>): StigmaObject {
  function recurse(o: Record<string, unknown>): Record<string, StigmaField> {
    const result: Record<string, StigmaField> = {};
    for (const key in o) {
      if (!Object.prototype.hasOwnProperty.call(o, key)) continue;
      const newKey = camelCaseToTitleCase(key);
      const value = o[key];
      if (typeof value !== 'object' || value === null) {
        result[newKey] = { data: notUndefineNotNull(value) ? (value as string | number | boolean) : '' };
      } else {
        result[newKey] = notUndefineNotNull(value)
          ? ({ data: recurse(value as Record<string, unknown>) } as unknown as StigmaField)
          : { data: '' };
      }
    }
    return result;
  }
  return { data: recurse(obj) } as StigmaObject;
}
