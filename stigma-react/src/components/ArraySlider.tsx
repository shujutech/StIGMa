import { useState, type ReactNode } from 'react';
import type { StigmaObject } from '../types/stigma';

export interface ArraySliderProps {
  title: string;
  dataset: StigmaObject[];
  renderItem: (item: StigmaObject, index: number) => ReactNode;
  onNew?: () => void;
  onDelete?: (index: number) => void;
  changeable?: boolean | string;
}

function isChangeable(v: boolean | string | undefined): boolean {
  if (v === false || v === 'false') return false;
  return true;
}

export function ArraySlider({
  title,
  dataset,
  renderItem,
  onNew,
  onDelete,
  changeable = true,
}: ArraySliderProps) {
  const visibleItems = dataset
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => !d.delete);
  const [slide, setSlide] = useState(0);
  const changeableFlag = isChangeable(changeable);

  const clamped = Math.min(slide, Math.max(0, visibleItems.length - 1));
  const current = visibleItems[clamped];

  function next() {
    if (visibleItems.length <= 1) return;
    setSlide((s) => (s + 1) % visibleItems.length);
  }

  function handleDelete() {
    if (!current || !onDelete) return;
    const confirmed = window.confirm(`Delete this ${title}?`);
    if (!confirmed) return;
    onDelete(current.i);
    setSlide((s) => Math.max(0, s - 1));
  }

  return (
    <div className="st-array-widget inline-block bg-transparent w-[99%] md:w-full mr-1">
      <div className="st-array-ctrl flex justify-end gap-2 text-sm text-blue-700">
        {visibleItems.length > 1 ? (
          <button
            type="button"
            className="st-array-btn cursor-pointer hover:underline min-h-[32px] px-2"
            onClick={next}
          >
            Next&gt;&gt;
          </button>
        ) : null}
        {changeableFlag && onDelete && visibleItems.length > 0 ? (
          <button
            type="button"
            className="st-array-btn cursor-pointer hover:underline min-h-[32px] px-2"
            onClick={handleDelete}
          >
            [Delete]
          </button>
        ) : null}
        {changeableFlag && onNew ? (
          <button
            type="button"
            className="st-array-btn cursor-pointer hover:underline min-h-[32px] px-2"
            onClick={onNew}
          >
            [New]
          </button>
        ) : null}
      </div>
      {current ? (
        <div className="st-slide" data-slide-index={current.i}>
          {renderItem(current.d, current.i)}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic px-2 py-4">
          No {title.toLowerCase()} yet — click [New] to add one.
        </div>
      )}
    </div>
  );
}
