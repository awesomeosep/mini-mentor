'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SkillSelector } from '@/components/SkillSelector';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

interface Listing {
  listing_id: string;
  name: string;
  description?: string;
  status: 'OPEN' | 'PAUSED' | 'FULL' | 'CLOSED';
  primary_skill_name?: string;
}

export default function ListingBrowserPage() {
  const router = useRouter();
  const [data, setData] = React.useState<Listing[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<string>('all');
  const [skill, setSkill] = React.useState<string | null>(null);
  const [matchAvailability, setMatchAvailability] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const fetchListings = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listings/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: search,
          status,
          skill_id: skill || undefined,
          matchAvailability,
          limit: 50,
        }),
      });
      const json = await res.json();
      setData(json.listings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, status, skill, matchAvailability]);

  React.useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const columns = React.useMemo<ColumnDef<Listing>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
      },
      {
        accessorKey: 'primary_skill_name',
        header: 'Skill',
        cell: ({ row }) => row.original.primary_skill_name ?? '—',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge>{row.original.status}</Badge>,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <p className="max-w-md truncate">{row.original.description}</p>,
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <Card className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">Your Matches</h1>
          <Input
            placeholder="Search name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="PAUSED">Paused</SelectItem>
              <SelectItem value="FULL">Full</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
          <SkillSelector value={skill ?? ''} onChange={setSkill} />
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={matchAvailability}
              onCheckedChange={(v) => setMatchAvailability(!!v)}
            />
            Match My Availability
          </label>
          <Button onClick={fetchListings} disabled={loading}>
            {loading ? 'Loading…' : 'Filter'}
          </Button>
        </div>

        {/* Table unchanged */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer select-none"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc'
                        ? ' ▲'
                        : header.column.getIsSorted() === 'desc'
                          ? ' ▼'
                          : null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow onClick={() => router.push(`/listings/${row.original.listing_id}`)} key={row.id}>
                    {/* <Link href={`/listings/${row.original.listing_id}`} className="contents"> */}
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    {/* </Link> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    {loading ? 'Loading…' : 'No results.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
