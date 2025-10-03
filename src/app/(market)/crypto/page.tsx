'use client'
import { useEffect, useState } from 'react'
import { fetchTopCoins } from '@/lib/api/coingecko'
import { CryptoTable } from '@/components/market/crypto-table'
import { Pagination } from '@/components/ui/pagination'

export default function CryptoMarketPage() {
  const [coins, setCoins] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    setLoading(true)
    fetchTopCoins('usd', 100, false)
      .then(setCoins)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalPages = Math.ceil(coins.length / pageSize)
  const paginatedCoins = coins.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Cryptocurrencies</h1>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <>
          <CryptoTable coins={paginatedCoins} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  )
}


