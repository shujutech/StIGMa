import type { StigmaEnvelope, StigmaField, StigmaObject } from '../types/stigma';

/**
 * Port of `UiGrid.Flatten2Relational` (UiGrid.js lines 390-532).
 *
 * Recursively flattens a StIGMa envelope into relational rows — the same
 * value may be repeated across multiple rows when there are nested datasets.
 * Each row is a flat `{ columnFqn: value }` map.
 */
export type FlatRow = Record<string, unknown>;

function isPrimitive(v: unknown): v is string | number | boolean | null {
  const t = typeof v;
  return v === null || t === 'string' || t === 'number' || t === 'boolean';
}

function flattenObject(
  obj: StigmaObject,
  prefix: string,
  baseRow: FlatRow,
): FlatRow[] {
  let rows: FlatRow[] = [{ ...baseRow }];
  if (obj.objectId !== undefined) {
    const key = prefix ? `${prefix}.objectId` : 'objectId';
    rows.forEach((r) => {
      r[key] = obj.objectId;
    });
  }

  const data = obj.data ?? {};
  const nestedKeys: string[] = [];

  for (const key of Object.keys(data)) {
    const field = data[key] as StigmaField;
    if (field.dontDisplay) continue;

    const fqn = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(field.dataset)) {
      nestedKeys.push(key);
    } else if (typeof field.data === 'object' && field.data !== null) {
      const nested = flattenObject(field.data as unknown as StigmaObject, fqn, {});
      rows = rows.flatMap((r) => nested.map((n) => ({ ...r, ...n })));
    } else if (isPrimitive(field.data)) {
      rows.forEach((r) => {
        r[fqn] = field.data;
      });
    }
  }

  for (const key of nestedKeys) {
    const field = data[key];
    const ds = field.dataset ?? [];
    if (ds.length === 0) continue;
    const fqn = prefix ? `${prefix}.${key}` : key;
    const subRows: FlatRow[] = [];
    ds.forEach((child, i) => {
      if (child.delete) return;
      const childRows = flattenObject(child, `${fqn}[${i}]`, {});
      subRows.push(...childRows);
    });
    if (subRows.length === 0) continue;
    rows = rows.flatMap((r) => subRows.map((s) => ({ ...r, ...s })));
  }

  return rows;
}

export function flatten2Relational(envelope: StigmaEnvelope): FlatRow[] {
  const out: FlatRow[] = [];
  for (const obj of envelope.dataset ?? []) {
    if (obj.delete) continue;
    out.push(...flattenObject(obj, '', {}));
  }
  return out;
}
