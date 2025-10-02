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
  name: string
  symbol: string
  price: number | null
  changePercent: number | null
  marketCap: number | null
}

function Pct({ value }: { value: number | null }) {
  if (value == null) return <span>-</span>
  const isPos = value >= 0
  return <span className={isPos ? 'text-green-600' : 'text-red-600'}>{value.toFixed(2)}%</span>
}

export function EtfsTable({ rows }: { rows: Row[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Change %</TableHead>
          <TableHead className="text-right">Market Cap</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell className="uppercase text-muted-foreground">{r.symbol}</TableCell>
            <TableCell className="text-right">{r.price != null ? `$${r.price.toLocaleString()}` : '-'}</TableCell>
            <TableCell className="text-right"><Pct value={r.changePercent} /></TableCell>
            <TableCell className="text-right">{r.marketCap != null ? `$${r.marketCap.toLocaleString()}` : '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


