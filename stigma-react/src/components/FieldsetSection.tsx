import { Fragment } from 'react';
import type { StigmaField, StigmaObject } from '../types/stigma';
import { SYSTEM_FIELDS } from '../types/stigma';
import { camelCaseToTitleCase, getJsonPath } from '../utils/jsonPath';
import { FieldRenderer } from './FieldRenderer';
import { ArraySlider } from './ArraySlider';

export interface FieldsetSectionProps {
  obj: StigmaObject;
  parentFqn: string;
  sectionNumber: string;
  title?: string;
  forPrint?: boolean;
  onFieldChange: (fqn: string, value: unknown) => void;
  onNewChild?: (fqn: string, clasz: string | undefined) => void;
  onDeleteChild?: (fqn: string, index: number) => void;
  /** When true, we render this section's fields inline (no wrapping fieldset). */
  inline?: boolean;
}

function isSystemField(name: string): boolean {
  return SYSTEM_FIELDS.has(name);
}

function plusOne(seq: string): string {
  if (!seq) return '1';
  const parts = seq.split('.');
  const last = parts.pop() ?? '0';
  const n = parseInt(last, 10);
  parts.push(String((Number.isNaN(n) ? 0 : n) + 1));
  return parts.join('.');
}

function nextLevel(seq: string): string {
  if (!seq) return '1';
  return `${seq}.0`;
}

function hasDataset(f: StigmaField): f is StigmaField & { dataset: StigmaObject[] } {
  return Array.isArray(f.dataset);
}

function isAtomicField(f: StigmaField): boolean {
  if (hasDataset(f)) return false;
  if (f.lookup === true) return true;
  if (typeof f.data === 'object' && f.data !== null && f.type === undefined) return false;
  return true;
}

interface InnerRenderProps
  extends Omit<FieldsetSectionProps, 'obj' | 'title' | 'sectionNumber' | 'inline'> {
  obj: StigmaObject;
  sectionNumber: string;
}

interface PreparedItem {
  kind: 'dataset' | 'object' | 'atomic';
  fieldName: string;
  field: StigmaField;
  label: string;
  fqn: string;
  sectionTitle?: string;
  childSeq?: string;
}

function prepareItems(obj: StigmaObject, parentFqn: string, baseSeq: string): PreparedItem[] {
  const data = obj.data ?? {};
  const out: PreparedItem[] = [];
  let seq = baseSeq;
  for (const [fieldName, rawField] of Object.entries(data)) {
    if (isSystemField(fieldName)) continue;
    const field = rawField as StigmaField;
    if (field.dontDisplay) continue;
    const label = camelCaseToTitleCase(fieldName);
    const fqn = getJsonPath(parentFqn, fieldName);
    if (hasDataset(field)) {
      seq = plusOne(seq);
      out.push({ kind: 'dataset', fieldName, field, label, fqn, sectionTitle: `${seq}. ${label}`, childSeq: seq });
      continue;
    }
    if (!isAtomicField(field)) {
      seq = plusOne(seq);
      out.push({ kind: 'object', fieldName, field, label, fqn, sectionTitle: `${seq}. ${label}`, childSeq: seq });
      continue;
    }
    out.push({ kind: 'atomic', fieldName, field, label, fqn });
  }
  return out;
}

function Body({
  obj,
  parentFqn,
  sectionNumber,
  forPrint,
  onFieldChange,
  onNewChild,
  onDeleteChild,
}: InnerRenderProps) {
  const items = prepareItems(obj, parentFqn, sectionNumber);

  return (
    <>
      {items.map((item) => {
        if (item.kind === 'dataset') {
          const field = item.field as StigmaField & { dataset: StigmaObject[] };
          const clasz = field.clasz;
          const changeableFlag = field.changeable !== false && field.changeable !== 'false';
          return (
            <Fragment key={item.fqn}>
              <fieldset className="st-fieldset pb-6 md:pb-10 pl-2 md:pl-4 border border-gray-300 float-left w-full my-2 bg-white/30 rounded-md">
                <legend className="st-legend font-bold text-base md:text-lg px-2.5 w-auto">
                  {item.sectionTitle}
                </legend>
                <ArraySlider
                  title={item.label}
                  dataset={field.dataset}
                  changeable={field.changeable}
                  onNew={onNewChild && changeableFlag ? () => onNewChild(item.fqn, clasz) : undefined}
                  onDelete={
                    onDeleteChild && changeableFlag
                      ? (idx) => onDeleteChild(item.fqn, idx)
                      : undefined
                  }
                  renderItem={(child, idx) => (
                    <FieldsetSection
                      obj={child}
                      parentFqn={`${item.fqn}[${idx}]`}
                      sectionNumber={nextLevel(item.childSeq ?? sectionNumber)}
                      forPrint={forPrint}
                      onFieldChange={onFieldChange}
                      onNewChild={onNewChild}
                      onDeleteChild={onDeleteChild}
                      inline
                    />
                  )}
                />
              </fieldset>
            </Fragment>
          );
        }
        if (item.kind === 'object') {
          const nested = (item.field.data as unknown as StigmaObject) ?? { data: {} };
          return (
            <Fragment key={item.fqn}>
              <fieldset className="st-fieldset pb-6 md:pb-10 pl-2 md:pl-4 border border-gray-300 float-left w-full my-2 bg-white/30 rounded-md">
                <legend className="st-legend font-bold text-base md:text-lg px-2.5 w-auto">
                  {item.sectionTitle}
                </legend>
                <FieldsetSection
                  obj={nested}
                  parentFqn={item.fqn}
                  sectionNumber={nextLevel(item.childSeq ?? sectionNumber)}
                  forPrint={forPrint}
                  onFieldChange={onFieldChange}
                  onNewChild={onNewChild}
                  onDeleteChild={onDeleteChild}
                  inline
                />
              </fieldset>
            </Fragment>
          );
        }
        return (
          <FieldRenderer
            key={item.fqn}
            label={item.label}
            field={item.field}
            fqn={item.fqn}
            disabled={
              forPrint ||
              item.field.changeable === false ||
              item.field.changeable === 'false' ||
              item.field.updateable === false
            }
            onChange={onFieldChange}
          />
        );
      })}
    </>
  );
}

export function FieldsetSection(props: FieldsetSectionProps) {
  const { inline, title, sectionNumber, ...rest } = props;
  if (inline) {
    return <Body {...rest} sectionNumber={sectionNumber} />;
  }
  const heading = title ? `${sectionNumber}. ${title}` : undefined;
  return (
    <fieldset className="st-fieldset pb-6 md:pb-10 pl-2 md:pl-4 border border-gray-300 float-left w-full my-2 bg-white/40 rounded-md">
      {heading ? (
        <legend className="st-legend font-bold text-base md:text-lg px-2.5 w-auto">{heading}</legend>
      ) : null}
      <Body {...rest} sectionNumber={sectionNumber} />
    </fieldset>
  );
}
