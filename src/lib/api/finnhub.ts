// src/lib/api/finnhub.ts

const BASE = "https://finnhub.io/api/v1"
const key = process.env.NEXT_PUBLIC_FINNHUB_KEY!

// ✅ Get list of US stocks
export async function fetchStockList(limit = 100) {
  if (!key) {
    console.warn("Finnhub key missing; set NEXT_PUBLIC_FINNHUB_KEY")
    return [] as Array<{ symbol: string; name: string }>
  }

  const url = `${BASE}/stock/symbol?exchange=US&token=${key}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) {
    console.error("Finnhub stock/symbol error", res.status, await safeText(res))
    return []
  }
  const data = await res.json()
  return (Array.isArray(data) ? data.slice(0, limit) : []).map((d: any) => ({
    symbol: d.symbol,
    name: d.description,
  }))
}

// ✅ Get quotes for a batch of symbols (fetch each individually)
export async function fetchStockQuotesBatch(symbols: string[]) {
  if (!key) {
    console.warn("Finnhub key missing; set NEXT_PUBLIC_FINNHUB_KEY")
    return []
  }

  const results: any[] = []
  // Limit batch size to avoid rate limits (free tier = 60 calls/min)
  const limited = symbols.slice(0, 50)

  for (const symbol of limited) {
    try {
      const url = `${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`
      const res = await fetch(url, { next: { revalidate: 60 } })
      if (!res.ok) {
        console.error("Finnhub quote error", symbol, res.status, await safeText(res))
        continue
      }
      const q = await res.json()
      results.push({
        symbol,
        price: q.c ?? null, // current price
        changesPercentage: q.pc ? ((q.c - q.pc) / q.pc) * 100 : null, // % change
        marketCap: null, // not available on this endpoint
        volume: q.v ?? null,
      })
    } catch (err) {
      console.error("Finnhub fetch error", symbol, err)
    }
  }

  return results
}

async function safeText(res: Response) {
  try {
    return await res.text()
  } catch {
    return ""
  }
}
