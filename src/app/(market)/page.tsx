'use client'
import { useEffect, useMemo, useState } from 'react'
import { MarketTable } from '@/components/market/market-table'
import { fetchTopCoins } from '@/lib/api/coingecko'
import { fetchStockQuote } from '@/lib/api/alphaVantage'
import { fetchEtfList, fetchEtfQuote } from '@/lib/api/fmp'

type TabKey = 'crypto' | 'stocks' | 'etfs'

const DEFAULT_STOCKS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'TSLA']

export default function MarketPage() {
  const [tab, setTab] = useState<TabKey>('crypto')
  const [loading, setLoading] = useState(false)
  const [cryptoRows, setCryptoRows] = useState<any[]>([])
  const [stockRows, setStockRows] = useState<any[]>([])
  const [etfRows, setEtfRows] = useState<any[]>([])

  useEffect(() => {
    setLoading(true)
    const run = async () => {
      try {
        const [coins, stocks, etfsList] = await Promise.all([
          fetchTopCoins('usd', 50),
          Promise.all(DEFAULT_STOCKS.map(async (s) => ({ s, q: await fetchStockQuote(s) }))),
          fetchEtfList(25),
        ])

        setCryptoRows(
          coins.map((c: any) => ({
            id: c.id,
            name: c.name,
            symbol: c.symbol,
            price: c.current_price,
            change24h: c.price_change_percentage_24h,
            marketCap: c.market_cap,
          }))
        )

        const stockMapped = stocks.map(({ s, q }) => {
          const price = parseFloat(q['05. price'] ?? '0') || null
          const changePercentStr = (q['10. change percent'] ?? '').replace('%', '')
          const changePercent = changePercentStr ? parseFloat(changePercentStr) : null
          return {
            id: s,
            name: s,
            symbol: s,
            price,
            change24h: changePercent,
            marketCap: null,
          }
        })
        setStockRows(stockMapped)

        // Fetch quotes for a subset of ETFs for price data
        const etfQuotes = await Promise.all(
          etfsList.slice(0, 20).map(async (e: any) => ({ e, q: await fetchEtfQuote(e.symbol) }))
        )
        setEtfRows(
          etfQuotes.map(({ e, q }) => ({
            id: e.symbol,
            name: e.name,
            symbol: e.symbol,
            price: q?.price ?? null,
            change24h: q?.changesPercentage ?? null,
            marketCap: q?.marketCap ?? null,
          }))
        )
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const rows = useMemo(() => {
    if (tab === 'crypto') return cryptoRows
    if (tab === 'stocks') return stockRows
    return etfRows
  }, [tab, cryptoRows, stockRows, etfRows])

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Market</h1>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setTab('crypto')} className={`rounded-md border px-3 py-1.5 text-sm ${tab==='crypto' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>Crypto</button>
        <button onClick={() => setTab('stocks')} className={`rounded-md border px-3 py-1.5 text-sm ${tab==='stocks' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>Stocks</button>
        <button onClick={() => setTab('etfs')} className={`rounded-md border px-3 py-1.5 text-sm ${tab==='etfs' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>ETFs</button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading market data…</div>
      ) : (
        <MarketTable rows={rows} />
      )}
    </div>
  )
}


