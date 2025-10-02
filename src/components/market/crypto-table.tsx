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

type CoinRow = {
  id: string
  market_cap_rank: number
  name: string
  symbol: string
  image: string
  current_price: number
  price_change_percentage_1h_in_currency?: number | null
  price_change_percentage_24h_in_currency?: number | null
  price_change_percentage_7d_in_currency?: number | null
  market_cap?: number | null
  total_volume?: number | null
  circulating_supply?: number | null
  sparkline_in_7d?: { price: number[] }
}

function Pct({ value }: { value: number | null | undefined }) {
  if (value == null) return <span>-</span>
  const isPos = value >= 0
  return (
    <span className={isPos ? 'text-green-600' : 'text-red-600'}>
      {value.toFixed(2)}%
    </span>
  )
}

export function CryptoTable({ coins }: { coins: CoinRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">1h %</TableHead>
          <TableHead className="text-right">24h %</TableHead>
          <TableHead className="text-right">7d %</TableHead>
          <TableHead className="text-right">Market Cap</TableHead>
          <TableHead className="text-right">Volume(24h)</TableHead>
          <TableHead className="text-right">Circulating Supply</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coins.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.market_cap_rank}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <img src={c.image} alt={c.symbol} className="size-5 rounded-full" />
                <span className="font-medium">{c.name}</span>
                <span className="text-muted-foreground uppercase">{c.symbol}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">${c.current_price.toLocaleString()}</TableCell>
            <TableCell className="text-right"><Pct value={c.price_change_percentage_1h_in_currency} /></TableCell>
            <TableCell className="text-right"><Pct value={c.price_change_percentage_24h_in_currency} /></TableCell>
            <TableCell className="text-right"><Pct value={c.price_change_percentage_7d_in_currency} /></TableCell>
            <TableCell className="text-right">{c.market_cap ? `$${c.market_cap.toLocaleString()}` : '-'}</TableCell>
            <TableCell className="text-right">{c.total_volume ? `$${c.total_volume.toLocaleString()}` : '-'}</TableCell>
            <TableCell className="text-right">{c.circulating_supply ? `${c.circulating_supply.toLocaleString()} ${c.symbol.toUpperCase()}` : '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


