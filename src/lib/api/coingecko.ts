const CG = 'https://api.coingecko.com/api/v3'

export async function fetchTopCoins(vs = 'usd', perPage = 50, sparkline = false) {
  const url = `${CG}/coins/markets?vs_currency=${vs}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=${sparkline}&price_change_percentage=1h,24h,7d`
  const res = await fetch(url, { next: { revalidate: 120 } })
  if (!res.ok) throw new Error('CoinGecko error')
  return res.json()
}

export async function fetchCoinMarketChart(id: string, days = 30, vs = 'usd') {
  const url = `${CG}/coins/${id}/market_chart?vs_currency=${vs}&days=${days}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error('CoinGecko error')
  return res.json()
}


