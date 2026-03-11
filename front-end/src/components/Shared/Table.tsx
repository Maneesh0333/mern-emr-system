import React from "react";

type TableProps<T extends { _id: string }> = {
  headers: string[];
  data: T[];
  colSpan: number;
  emptyMessage?: string;
  renderRow: (item: T) => React.ReactNode;
};

export default function Table<T extends { _id: string }>({
  headers,
  data,
  colSpan,
  emptyMessage = "No data found",
  renderRow,
}: TableProps<T>) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border-1)] overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="text-left px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="text-center py-6 text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => renderRow(item))
          )}
        </tbody>
      </table>
    </div>
  );
}