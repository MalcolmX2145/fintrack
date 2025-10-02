'use client'
import { useEffect, useState } from 'react'
import { StocksTable } from '@/components/market/stocks-table'
import { fetchStockQuote } from '@/lib/api/alphaVantage'

const DEFAULT_STOCKS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'TSLA']

export default function StocksPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all(DEFAULT_STOCKS.map(async (s) => ({ s, q: await fetchStockQuote(s) })))
      .then(results => {
        setRows(results.map(({ s, q }) => {
          const price = parseFloat(q['05. price'] ?? '0') || null
          const changePercentStr = (q['10. change percent'] ?? '').replace('%', '')
          const changePercent = changePercentStr ? parseFloat(changePercentStr) : null
          const volume = q['06. volume'] ? parseFloat(q['06. volume']) : null
          return { id: s, name: s, symbol: s, price, changePercent, volume }
        }))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Stocks</h1>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <StocksTable rows={rows} />
      )}
    </div>
  )
}


