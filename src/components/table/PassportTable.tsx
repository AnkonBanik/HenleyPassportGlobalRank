import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { CountryHistoricalStats } from '../../types';
import { Download, ArrowUpDown, ChevronLeft, ChevronRight, Bookmark, Check } from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import { usePassportData } from '../../context/DataContext';

interface PassportTableProps {
  data: CountryHistoricalStats[];
  onSelectCountry?: (countryName: string) => void;
}

export function PassportTable({ data, onSelectCountry }: PassportTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'currentRank', desc: false }]);
  const { toggleCountrySelection, filters, bookmarks, toggleBookmark } = usePassportData();

  const columns: ColumnDef<CountryHistoricalStats>[] = [
    {
      id: 'bookmark',
      header: '',
      cell: ({ row }) => {
        const country = row.original.country;
        const isBookmarked = bookmarks.includes(country);
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(country);
            }}
            className={`p-1 hover:scale-110 transition-transform ${isBookmarked ? 'text-amber-500 dark:text-amber-400' : 'text-gray-400 dark:text-slate-600 hover:text-gray-600 dark:hover:text-slate-400'}`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        );
      },
    },
    {
      accessorKey: 'country',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-bold text-gray-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Country
          <ArrowUpDown className="w-3 h-3 ml-1" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-slate-100">
          <span className="text-lg">{row.original.flagEmoji}</span>
          <span>{row.original.country}</span>
          <span className="text-[10px] text-gray-400 dark:text-slate-400 font-mono">({row.original.iso3})</span>
        </div>
      ),
    },
    {
      accessorKey: 'currentRank',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-bold text-gray-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rank ({filters.selectedYear})
          <ArrowUpDown className="w-3 h-3 ml-1" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          #{row.original.currentRank}
        </span>
      ),
    },
    {
      accessorKey: 'currentAccess',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-bold text-gray-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Access Destinations
          <ArrowUpDown className="w-3 h-3 ml-1" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-gray-800 dark:text-slate-200">
          {row.original.currentAccess} countries
        </span>
      ),
    },
    {
      accessorKey: 'continent',
      header: 'Continent',
      cell: ({ row }) => (
        <span className="text-xs text-gray-500 dark:text-slate-400">{row.original.continent}</span>
      ),
    },
    {
      accessorKey: 'historicalBestRank',
      header: 'Best (Year)',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          #{row.original.historicalBestRank} ({row.original.historicalBestYear})
        </span>
      ),
    },
    {
      accessorKey: 'historicalWorstRank',
      header: 'Worst (Year)',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
          #{row.original.historicalWorstRank} ({row.original.historicalWorstYear})
        </span>
      ),
    },
    {
      accessorKey: 'volatilityScore',
      header: 'Volatility Index',
      cell: ({ row }) => (
        <span className="text-xs font-mono text-gray-700 dark:text-slate-300">
          {row.original.volatilityScore}
        </span>
      ),
    },
    {
      id: 'compare',
      header: 'Compare',
      cell: ({ row }) => {
        const country = row.original.country;
        const isSelected = filters.selectedCountries.includes(country);
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCountrySelection(country);
            }}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition-all ${
              isSelected
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            {isSelected ? <Check className="w-3 h-3" /> : '+'}
            <span>{isSelected ? 'Selected' : 'Compare'}</span>
          </button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const exportExcel = () => {
    const exportData = data.map((d) => ({
      Country: d.country,
      ISO3: d.iso3,
      Capital: d.capital,
      Continent: d.continent,
      UN_Region: d.unRegion,
      Current_Rank: d.currentRank,
      Current_Access: d.currentAccess,
      Best_Rank: d.historicalBestRank,
      Best_Year: d.historicalBestYear,
      Worst_Rank: d.historicalWorstRank,
      Worst_Year: d.historicalWorstYear,
      Volatility_Index: d.volatilityScore,
    }));

    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Henley Passport Index');
    writeFile(workbook, `Henley_Passport_Index_${filters.selectedYear}.xlsx`);
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4 transition-colors duration-200">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Passport Index Master Grid</h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Interactive table with multi-column sorting, pagination, and Excel exporter
          </p>
        </div>

        <button
          onClick={exportExcel}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-slate-700 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel / CSV</span>
        </button>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs text-gray-700 dark:text-slate-300">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800/60">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onSelectCountry && onSelectCountry(row.original.country)}
                className="hover:bg-gray-100/60 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 dark:text-slate-400 pt-2">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded px-2 py-1 text-gray-800 dark:text-slate-200"
          >
            {[10, 15, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
