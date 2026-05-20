'use client'
// src/app/(admin)/admin/transactions/page.tsx

import { useEffect, useState } from 'react'
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Transaction } from '@/types/database'

// 1. Definisikan tipe union khusus untuk tipe transaksi
type TransactionType = 'topup' | 'debit' | 'refund';

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  topup:  { label: 'Top Up',  color: 'text-green-400', bg: 'bg-green-400/10', icon: ArrowDownLeft },
  debit:  { label: 'Debit',   color: 'text-red-400',   bg: 'bg-red-400/10',   icon: ArrowUpRight },
  refund: { label: 'Refund',  color: 'text-blue-400',  bg: 'bg-blue-400/10',  icon: RefreshCw },
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  
  // 2. Berikan tipe pada state filterType
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all')
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      const supabase = createClient()
      let query = supabase.from('transactions').select('*').order('created_at', { ascending: false })
      
      // 3. Tambahkan jaminan tipe (as TransactionType) saat query
      if (filterType !== 'all') {
        query = query.eq('type', filterType as TransactionType)
      }
      
      const { data } = await query.limit(100)
      setTransactions((data as any) ?? [])

      // Hitung total revenue dari debit (pembayaran)
      const revenue = (data ?? [])
        .filter(t => (t as any).type === 'debit' && (t as any).status === 'success')
        .reduce((sum, t) => sum + ((t as any).amount || 0), 0)
      
      setTotalRevenue(revenue)
      setLoading(false)
    }
    fetchTransactions()
  }, [filterType])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-white">Transaksi</h1>
        <p className="text-white/40 text-sm mt-1">{transactions.length} transaksi</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Debit', value: formatCurrency(transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)), color: 'text-red-400' },
          { label: 'Total Top Up', value: formatCurrency(transactions.filter(t => t.type === 'topup').reduce((s, t) => s + t.amount, 0)), color: 'text-green-400' },
          { label: 'Total Refund', value: formatCurrency(transactions.filter(t => t.type === 'refund').reduce((s, t) => s + t.amount, 0)), color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl bg-[#141821] border border-white/5">
            <p className="text-xs text-white/40 mb-1">{s.label}</p>
            <p className={`font-display font-bold text-xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'topup', 'debit', 'refund'].map(t => (
          <button key={t} onClick={() => setFilterType(t as TransactionType | 'all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              filterType === t ? 'bg-[var(--gold)] text-[#080b11] font-bold' : 'bg-[#141821] text-white/50 border border-white/5 hover:text-white'
            }`}>
            {t === 'all' ? 'Semua' : typeConfig[t]?.label ?? t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#141821] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Tipe', 'Deskripsi', 'Jumlah', 'Saldo Sesudah', 'Status', 'Tanggal'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-white/30 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-4 rounded animate-shimmer w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-white/30 text-sm">Tidak ada transaksi</td></tr>
              ) : (
                transactions.map(tx => {
                  const cfg = typeConfig[tx.type] ?? typeConfig.debit
                  const Icon = cfg.icon
                  return (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/2 transition-all">
                      <td className="px-5 py-3">
                        <div className={`flex items-center gap-2 w-fit px-2.5 py-1 rounded-lg ${cfg.bg}`}>
                          <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                          <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-white/60 max-w-[200px] truncate">{tx.description ?? '—'}</td>
                      <td className="px-5 py-3 text-sm font-display font-bold text-white">{formatCurrency(tx.amount)}</td>
                      <td className="px-5 py-3 text-sm text-white/40">{formatCurrency(tx.balance_after)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                          tx.status === 'success' ? 'bg-green-400/10 text-green-400' :
                          tx.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                          'bg-red-400/10 text-red-400'
                        }`}>{tx.status}</span>
                      </td>
                      <td className="px-5 py-3 text-xs text-white/30 whitespace-nowrap">{formatDate(tx.created_at)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}