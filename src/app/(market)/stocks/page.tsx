'use client'
import { useEffect, useState } from 'react'
import { StocksTable } from '@/components/market/stocks-table'
import { fetchStockList, fetchStockQuotesBatch } from '@/lib/api/finnhub'
import { Pagination } from '@/components/ui/pagination'

export default function StocksPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      try {
        // Fetch a large list then batch quotes
        const list = await fetchStockList(100)
        if (!list.length) {
          setError('Stock data unavailable or API key missing/invalid. Please check your Finnhub API key and rate limits.')
          setRows([])
          return
        }
        const nameMap = new Map(list.map(l => [l.symbol, l.name]))
        const symbols = list.map(l => l.symbol).filter(Boolean)
        const quotes = await fetchStockQuotesBatch(symbols)
        const mapped = quotes.map((q: any, idx: number) => ({
          id: q.symbol,
          rank: idx + 1,
          name: nameMap.get(q.symbol) ?? q.symbol,
          symbol: q.symbol,
          price: q.price ?? null,
          change1d: q.changesPercentage ?? null,
          marketCap: q.marketCap ?? null,
          volume: q.volume ?? null,
        }))
        // Sort by price descending (most valuable proxy)
        mapped.sort((a, b) => (b.price || 0) - (a.price || 0))
        // Reassign ranks
        mapped.forEach((r, idx) => r.rank = idx + 1)
        setRows(mapped)
      } catch (e: any) {
        console.error(e)
        setError('Failed to load stocks. Please try again later.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const totalPages = Math.ceil(rows.length / pageSize)
  const paginatedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="mx-auto max-w-7xl p-6 pt-24">
      <h1 className="text-2xl font-semibold mb-4">Stocks</h1>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : error ? (
        <div className="text-sm text-destructive">{error}</div>
      ) : (
        <>
          <StocksTable rows={paginatedRows} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  )
}


