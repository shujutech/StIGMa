import { useCallback, useMemo, useState } from 'react';
import type { StigmaEnvelope, StigmaObject } from '../types/stigma';
import { jsonAssignment } from '../utils/jsonPath';

export interface FormStateApi {
  formData: StigmaObject;
  originalData: StigmaObject;
  updateField: (fqn: string, value: unknown) => void;
  replaceFormData: (next: StigmaObject) => void;
  isEdited: () => boolean;
  isDirty: boolean;
  resetToOriginal: () => void;
  bumpVersion: () => void;
  version: number;
}

function cloneDeep<T>(value: T): T {
  if (typeof globalThis.structuredClone === 'function') {
    return globalThis.structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export function useFormState(initial: StigmaEnvelope): FormStateApi {
  const originalData = useMemo<StigmaObject>(
    () => cloneDeep(initial.dataset[0] ?? ({ data: {} } as StigmaObject)),
    [initial],
  );
  const [formData, setFormData] = useState<StigmaObject>(() => cloneDeep(originalData));
  const [version, setVersion] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  const bumpVersion = useCallback(() => setVersion((v) => v + 1), []);

  const updateField = useCallback(
    (fqn: string, value: unknown) => {
      setFormData((prev) => {
        const next = cloneDeep(prev);
        jsonAssignment(next, fqn, value);
        return next;
      });
      setIsDirty(true);
      bumpVersion();
    },
    [bumpVersion],
  );

  const replaceFormData = useCallback(
    (next: StigmaObject) => {
      setFormData(cloneDeep(next));
      setIsDirty(true);
      bumpVersion();
    },
    [bumpVersion],
  );

  const isEdited = useCallback(
    () => JSON.stringify(formData) !== JSON.stringify(originalData),
    [formData, originalData],
  );

  const resetToOriginal = useCallback(() => {
    setFormData(cloneDeep(originalData));
    setIsDirty(false);
    bumpVersion();
  }, [bumpVersion, originalData]);

  return {
    formData,
    originalData,
    updateField,
    replaceFormData,
    isEdited,
    isDirty,
    resetToOriginal,
    bumpVersion,
    version,
  };
}
