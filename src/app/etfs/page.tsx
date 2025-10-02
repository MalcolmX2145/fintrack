'use client'
import { useEffect, useState } from 'react'
import { EtfsTable } from '@/components/market/etfs-table'
import { fetchEtfList, fetchEtfQuote } from '@/lib/api/fmp'

export default function EtfsPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchEtfList(25)
      .then(async (list) => {
        const quotes = await Promise.all(list.slice(0, 20).map(async (e: any) => ({ e, q: await fetchEtfQuote(e.symbol) })))
        setRows(quotes.map(({ e, q }) => ({
          id: e.symbol,
          name: e.name,
          symbol: e.symbol,
          price: q?.price ?? null,
          changePercent: q?.changesPercentage ?? null,
          marketCap: q?.marketCap ?? null,
        })))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-semibold mb-4">ETFs</h1>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <EtfsTable rows={rows} />
      )}
    </div>
  )
}


