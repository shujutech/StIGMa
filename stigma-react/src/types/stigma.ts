export type StigmaFieldType =
  | 'date'
  | 'datetime'
  | 'html'
  | 'telephone'
  | 'mobilephone'
  | 'money'
  | 'boolean'
  | 'country'
  | 'state'
  | 'city'
  | 'base64'
  | 'upload'
  | 'integer'
  | 'encrypt';

export type StigmaPrimitive = string | number | boolean | null;

export interface StigmaField {
  data: StigmaPrimitive | StigmaObject | Record<string, StigmaField>;
  type?: StigmaFieldType;
  size?: number;
  mask?: string;
  lookup?: boolean;
  editable?: boolean;
  option?: Record<string, unknown>;
  currencies?: Record<string, string>;
  changeable?: boolean | string;
  isKeyField?: boolean;
  dontDisplay?: boolean;
  clasz?: string;
  updateable?: boolean;
  uifomaster?: boolean;
  uifobchild?: boolean;
  dataset?: StigmaObject[];
  delete?: boolean;
}

export interface StigmaObject {
  objectId?: string | number;
  clasz?: string;
  data: Record<string, StigmaField>;
  dataset?: StigmaObject[];
  delete?: boolean;
}

export interface StigmaMeta {
  desc?: string;
  childName?: string;
  ParentClass?: string;
  ParentOid?: string;
}

export interface StigmaEnvelope {
  meta?: StigmaMeta;
  dataset: StigmaObject[];
}

export const SYSTEM_FIELDS = new Set(['objectId', 'clasz', 'uifomaster']);

export function isStigmaObjectLike(
  v: StigmaField['data'],
): v is StigmaObject | Record<string, StigmaField> {
  return typeof v === 'object' && v !== null;
}

export function isStigmaObject(v: unknown): v is StigmaObject {
  return (
    typeof v === 'object' &&
    v !== null &&
    'data' in (v as Record<string, unknown>) &&
    typeof (v as StigmaObject).data === 'object'
  );
}
