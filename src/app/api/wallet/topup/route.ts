// src/app/api/wallet/topup/route.ts
// Top up saldo via Midtrans

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { snap } from '@/lib/midtrans/client'

const TOPUP_AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000]

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { amount } = await req.json()

    if (!TOPUP_AMOUNTS.includes(amount)) {
      return NextResponse.json({ error: 'Nominal top up tidak valid' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile tidak ditemukan' }, { status: 404 })

    const topupOrderId = `TOPUP-${user.id.slice(0, 8)}-${Date.now()}`

    const parameter = {
      transaction_details: {
        order_id: topupOrderId,
        gross_amount: amount,
      },
      item_details: [{
        id: 'SALDO_TOPUP',
        price: amount,
        quantity: 1,
        name: `Top Up Saldo Rp ${amount.toLocaleString('id-ID')}`,
      }],
      customer_details: {
        first_name: profile.full_name || 'User',
        email: user.email,
        phone: profile.phone || '',
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/account/wallet?topup=success`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/account/wallet?topup=error`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/account/wallet?topup=pending`,
      },
    }

    const snapTransaction = await snap.createTransaction(parameter)

    // Simpan transaksi pending
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'topup',
      amount,
      balance_before: profile.saldo,
      balance_after: profile.saldo + amount,
      ref_id: topupOrderId,
      description: `Top up saldo Rp ${amount.toLocaleString('id-ID')}`,
      status: 'pending',
    })

    return NextResponse.json({
      success: true,
      snap_token: snapTransaction.token,
      redirect_url: snapTransaction.redirect_url,
      topup_order_id: topupOrderId,
    })

  } catch (error: any) {
    console.error('Topup error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
