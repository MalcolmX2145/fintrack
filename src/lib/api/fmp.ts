const FMP = 'https://financialmodelingprep.com/api/v3'
const key = process.env.NEXT_PUBLIC_FMP_KEY!

async function safeText(res: Response) {
  try { return await res.text() } catch { return '' }
}

/**
 * ✅ Fetch ETF list (free workaround)
 * Uses stock/list and filters ETFs by name
 */
export async function fetchEtfList(limit = 50) {
  if (!key) {
    console.warn('FMP key missing; set NEXT_PUBLIC_FMP_KEY')
    return []
  }

  const url = `${FMP}/stock/list?apikey=${key}`
  const res = await fetch(url, { next: { revalidate: 600 } })

  if (!res.ok) {
    console.error('FMP etf/list fallback error', res.status, await safeText(res))
    return [] as Array<{ symbol: string; name: string }>
  }

  const data = await res.json()

  const etfs = Array.isArray(data)
    ? data.filter((item: any) => item.name?.toLowerCase().includes('etf'))
    : []

  return etfs.slice(0, limit).map((item: any) => ({
    symbol: item.symbol,
    name: item.name
  })) as Array<{ symbol: string; name: string }>
}

/**
 * ✅ Fetch ETF or stock quote (works for both)
 */
export async function fetchEtfQuote(symbol: string) {
  const url = `${FMP}/quote/${encodeURIComponent(symbol)}?apikey=${key}`
  const res = await fetch(url, { next: { revalidate: 120 } })
  if (!res.ok) {
    console.error('FMP quote error', symbol, res.status, await safeText(res))
    return null
  }
  const json = await res.json()
  return Array.isArray(json) ? json[0] : null
}

/**
 * ✅ Fetch all tradable stock symbols (safe endpoint)
 */
export async function fetchStockList(limit = 200, exchange = 'NASDAQ') {
  if (!key) {
    console.warn('FMP key missing; set NEXT_PUBLIC_FMP_KEY')
    return []
  }

  const url = `${FMP}/stock/list?exchange=${exchange}&apikey=${key}`
  const res = await fetch(url, { next: { revalidate: 600 } })

  if (!res.ok) {
    console.error('FMP stock/list error', res.status, await safeText(res))
    return [] as Array<{ symbol: string; name: string }>
  }

  const data = await res.json()
  let symbols = Array.isArray(data) ? data : []

  return symbols.slice(0, limit).map((item: any) => ({
    symbol: item.symbol,
    name: item.name
  })) as Array<{ symbol: string; name: string }>
}

/**
 * ✅ Fetch multiple stock/ETF quotes in batch
 */
export async function fetchStockQuotesBatch(symbols: string[]) {
  if (symbols.length === 0) return [] as any[]

  const chunk = (arr: string[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    )

  const chunks = chunk(symbols, 25)
  const results: any[] = []

  for (const c of chunks) {
    const path = encodeURIComponent(c.join(','))
    const url = `${FMP}/quote/${path}?apikey=${key}`
    const res = await fetch(url, { next: { revalidate: 60 } })

    if (!res.ok) {
      console.error('FMP batch quote error', c.join(','), res.status, await safeText(res))
      continue
    }

    const json = await res.json()
    if (Array.isArray(json)) results.push(...json)
  }

  return results
}
