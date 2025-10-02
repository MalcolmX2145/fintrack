'use client'
import { useEffect, useState } from 'react'
import { fetchTopCoins } from '@/lib/api/coingecko'
import { CryptoTable } from '@/components/market/crypto-table'

export default function CryptoMarketPage() {
  const [coins, setCoins] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchTopCoins('usd', 100, false)
      .then(setCoins)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Cryptocurrencies</h1>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <CryptoTable coins={coins} />
      )}
    </div>
  )
}


