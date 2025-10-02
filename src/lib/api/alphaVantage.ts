const AV = 'https://www.alphavantage.co/query'
const key = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY!

type AvGlobalQuote = {
  '01. symbol': string
  '05. price': string
  '06. volume': string
  '07. latest trading day': string
  '08. previous close': string
  '09. change': string
  '10. change percent': string
}

export async function fetchStockQuote(symbol: string) {
  const url = `${AV}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${key}`
  const res = await fetch(url, { next: { revalidate: 120 } })
  if (!res.ok) throw new Error('Alpha Vantage error')
  const json = await res.json()
  return (json['Global Quote'] ?? {}) as AvGlobalQuote
}

export async function fetchStockOverview(symbol: string) {
  const url = `${AV}?function=OVERVIEW&symbol=${encodeURIComponent(symbol)}&apikey=${key}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Alpha Vantage error')
  return res.json()
}


