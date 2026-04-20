import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table';
import type { StigmaEnvelope } from '../types/stigma';
import { flatten2Relational, type FlatRow } from '../utils/flatten';

export interface StigmaGridProps<TRow extends FlatRow = FlatRow> {
  data: StigmaEnvelope;
  columns?: ColumnDef<TRow, unknown>[];
  hideRepeatCells?: boolean;
  onRowSelect?: (rows: TRow[]) => void;
  onEdit?: (row: TRow) => void;
  onDelete?: (rows: TRow[]) => void;
}

function deriveColumns<TRow extends FlatRow>(rows: TRow[]): ColumnDef<TRow, unknown>[] {
  if (rows.length === 0) return [];
  const keys = new Set<string>();
  for (const r of rows) {
    for (const k of Object.keys(r)) keys.add(k);
  }
  return Array.from(keys).map<ColumnDef<TRow, unknown>>((key) => ({
    id: key,
    accessorKey: key,
    header: key,
    cell: (info) => {
      const v = info.getValue();
      if (v === null || v === undefined) return '';
      if (typeof v === 'object') return JSON.stringify(v);
      return String(v);
    },
  }));
}

function hideRepeatCellsValue<TRow extends FlatRow>(
  rows: TRow[],
  columnId: keyof TRow,
  rowIndex: number,
): boolean {
  if (rowIndex === 0) return false;
  const prev = rows[rowIndex - 1];
  return prev != null && prev[columnId] === rows[rowIndex][columnId];
}

export function StigmaGrid<TRow extends FlatRow = FlatRow>({
  data,
  columns,
  hideRepeatCells = true,
  onRowSelect,
  onEdit,
  onDelete,
}: StigmaGridProps<TRow>) {
  const rows = useMemo(() => flatten2Relational(data) as TRow[], [data]);
  const resolvedColumns = useMemo(
    () => columns ?? deriveColumns<TRow>(rows),
    [columns, rows],
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: rows,
    columns: resolvedColumns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(next);
      if (onRowSelect) {
        const selectedRows = rows.filter((_, i) => next[String(i)]);
        onRowSelect(selectedRows);
      }
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRowsList = rows.filter((_, i) => rowSelection[String(i)]);

  return (
    <div className="stigma-grid w-full">
      {(onEdit || onDelete) && (
        <div className="flex gap-2 mb-2">
          {onEdit ? (
            <button
              type="button"
              className="px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
              disabled={selectedRowsList.length !== 1}
              onClick={() => selectedRowsList[0] && onEdit(selectedRowsList[0])}
            >
              Edit
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              className="px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
              disabled={selectedRowsList.length === 0}
              onClick={() => onDelete(selectedRowsList)}
            >
              Delete
            </button>
          ) : null}
        </div>
      )}
      <div className="overflow-x-auto max-h-[300px] overflow-y-auto border border-[#CCB]">
        <table className="stdGrid border-collapse w-full text-base">
          <thead className="bg-[#CECECF] text-left text-sm sticky top-0">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                <th className="px-2 py-1 border border-[#CCB] w-8">
                  <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    ref={(el) => {
                      if (el) el.indeterminate = table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
                    }}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                </th>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-2 py-1 border border-[#CCB] font-semibold">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="font-mono font-normal">
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className="hover:bg-[#E5E5E5] cursor-pointer"
                data-selected={row.getIsSelected() ? 'true' : 'false'}
              >
                <td className="px-2 py-1 border border-[#CCB]">
                  <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                </td>
                {row.getVisibleCells().map((cell) => {
                  const hide =
                    hideRepeatCells && hideRepeatCellsValue(rows, cell.column.id as keyof TRow, rowIndex);
                  return (
                    <td key={cell.id} className="px-2 py-1 border border-[#CCB]">
                      {hide ? '' : flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={resolvedColumns.length + 1}
                  className="px-2 py-4 text-center text-sm text-gray-500 italic"
                >
                  No data
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
