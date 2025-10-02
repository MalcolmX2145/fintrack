const FMP = 'https://financialmodelingprep.com/api/v3'
const key = process.env.NEXT_PUBLIC_FMP_KEY!

export async function fetchEtfList(limit = 50) {
  const url = `${FMP}/etf/list?apikey=${key}`
  const res = await fetch(url, { next: { revalidate: 600 } })
  if (!res.ok) {
    console.error('FMP etf/list error', res.status, await safeText(res))
    return [] as Array<{ symbol: string; name: string }>
  }
  const data = await res.json()
  return (Array.isArray(data) ? data.slice(0, limit) : []) as Array<{ symbol: string; name: string }>
}

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

async function safeText(res: Response) {
  try { return await res.text() } catch { return '' }
}


