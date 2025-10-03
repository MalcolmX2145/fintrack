"use client"
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Row = {
  id: string
  rank?: number
  name: string
  symbol: string
  price: number | null
  change1d?: number | null
  change1h?: number | null
  change7d?: number | null
  marketCap?: number | null
  volume: number | null
}

function Pct({ value }: { value: number | null }) {
  if (value == null) return <span>-</span>
  const isPos = value >= 0
  return <span className={isPos ? 'text-green-600' : 'text-red-600'}>{value.toFixed(2)}%</span>
}

export function StocksTable({ rows }: { rows: Row[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">24h %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.rank ?? ''}</TableCell>
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell className="uppercase text-muted-foreground">{r.symbol}</TableCell>
            <TableCell className="text-right">{r.price != null ? `$${r.price.toLocaleString()}` : '-'}</TableCell>
            <TableCell className="text-right"><Pct value={r.change1d ?? null} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


