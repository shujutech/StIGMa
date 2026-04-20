import { useCallback } from 'react';
import type { StigmaEnvelope, StigmaField, StigmaObject } from '../types/stigma';
import { useFormState } from '../hooks/useFormState';
import { FieldsetSection } from './FieldsetSection';
import { getVarByJsonPath } from '../utils/jsonPath';

export interface StigmaFormProps {
  data: StigmaEnvelope;
  title?: string;
  baseUrl?: string;
  forPrint?: boolean;
  onSave?: (data: StigmaObject) => void;
  onCancel?: () => void;
}

const BTN_PRIMARY = [
  'min-w-[120px]',
  'text-[11.5px]',
  'font-semibold',
  'tracking-wider',
  'leading-[3.75em]',
  'text-gray-600',
  'rounded',
  'border-0',
  'bg-gray-300',
  'hover:enabled:bg-gray-500',
  'hover:enabled:text-white',
  'cursor-pointer',
  'px-9',
  'inline-block',
  'disabled:bg-gray-200',
  'disabled:text-gray-400',
  'disabled:cursor-default',
  'transition-colors',
].join(' ');

function cloneObj<T>(v: T): T {
  if (typeof globalThis.structuredClone === 'function') return globalThis.structuredClone(v);
  return JSON.parse(JSON.stringify(v)) as T;
}

function freshSkeletonFor(clasz?: string): StigmaObject {
  return {
    objectId: -1,
    clasz,
    data: {},
  };
}

export function StigmaForm({ data, title, forPrint, onSave, onCancel }: StigmaFormProps) {
  const state = useFormState(data);
  const resolvedTitle = title ?? data.meta?.childName ?? data.meta?.desc ?? '';

  const handleNewChild = useCallback(
    (fqn: string, clasz: string | undefined) => {
      const node = getVarByJsonPath(state.formData, fqn);
      if (!node || typeof node !== 'object') return;
      const field = node as StigmaField;
      if (!Array.isArray(field.dataset)) return;
      // Mutate a copy of formData to append a new empty sibling. We model
      // the "blank template" by cloning the first existing entry (shape only).
      const next = cloneObj(state.formData);
      const refField = getVarByJsonPath(next, fqn) as StigmaField | undefined;
      if (!refField || !Array.isArray(refField.dataset)) return;
      const template = refField.dataset[0] ? cloneObj(refField.dataset[0]) : freshSkeletonFor(clasz);
      template.objectId = -1;
      template.delete = false;
      if (clasz) template.clasz = clasz;
      // Reset primitive values in the template so the user starts fresh.
      const resetPrimitives = (obj: StigmaObject) => {
        for (const key of Object.keys(obj.data ?? {})) {
          const f = obj.data[key];
          if (!f) continue;
          if (Array.isArray(f.dataset)) {
            f.dataset = [];
            continue;
          }
          if (typeof f.data === 'object' && f.data !== null) {
            resetPrimitives(f.data as unknown as StigmaObject);
          } else {
            f.data = '';
          }
        }
      };
      resetPrimitives(template);
      refField.dataset.push(template);
      state.replaceFormData(next);
    },
    [state],
  );

  const handleDeleteChild = useCallback(
    (fqn: string, index: number) => {
      const next = cloneObj(state.formData);
      const field = getVarByJsonPath(next, fqn) as StigmaField | undefined;
      if (!field || !Array.isArray(field.dataset)) return;
      const item = field.dataset[index];
      if (!item) return;
      if (item.objectId === -1 || item.objectId === undefined) {
        field.dataset.splice(index, 1);
      } else {
        item.delete = true;
      }
      state.replaceFormData(next);
    },
    [state],
  );

  const handleCancel = () => {
    if (state.isEdited()) {
      const ok = window.confirm('You have made changes, confirm to cancel?');
      if (!ok) return;
    }
    state.resetToOriginal();
    onCancel?.();
  };

  const handleSave = () => {
    onSave?.(state.formData);
  };

  return (
    <div className="stigma-form w-full px-3 md:px-6 py-4 text-gray-700 font-semibold text-sm">
      <div className="stigma-form-actions w-full flex flex-col md:flex-row md:justify-end gap-2 md:gap-3 mb-3">
        <button type="button" className={BTN_PRIMARY} onClick={handleCancel} disabled={forPrint}>
          Cancel
        </button>
        <button type="button" className={BTN_PRIMARY} onClick={handleSave} disabled={forPrint}>
          Save
        </button>
      </div>
      <FieldsetSection
        obj={state.formData}
        parentFqn=""
        sectionNumber="1"
        title={resolvedTitle}
        forPrint={forPrint}
        onFieldChange={state.updateField}
        onNewChild={handleNewChild}
        onDeleteChild={handleDeleteChild}
      />
      <div className="stigma-form-actions w-full flex flex-col md:flex-row md:justify-end gap-2 md:gap-3 mt-3 clear-both">
        <button type="button" className={BTN_PRIMARY} onClick={handleCancel} disabled={forPrint}>
          Cancel
        </button>
        <button type="button" className={BTN_PRIMARY} onClick={handleSave} disabled={forPrint}>
          Save
        </button>
      </div>
    </div>
  );
}
