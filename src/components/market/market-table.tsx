"use client"
import React from 'react'

type Row = {
  id: string
  name: string
  symbol: string
  price: number | null
  change24h?: number | null
  marketCap?: number | null
}

export function MarketTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Symbol</th>
            <th className="p-3 text-right">Price</th>
            <th className="p-3 text-right">24h %</th>
            <th className="p-3 text-right">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.name}</td>
              <td className="p-3 uppercase text-muted-foreground">{r.symbol}</td>
              <td className="p-3 text-right">{r.price != null ? `$${r.price.toLocaleString()}` : '-'}</td>
              <td className={`p-3 text-right ${r.change24h != null && r.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {r.change24h != null ? `${r.change24h.toFixed(2)}%` : '-'}
              </td>
              <td className="p-3 text-right">{r.marketCap != null ? `$${r.marketCap.toLocaleString()}` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


