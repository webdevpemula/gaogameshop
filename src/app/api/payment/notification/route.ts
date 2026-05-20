// src/app/api/payment/notification/route.ts
// Webhook Midtrans — dipanggil otomatis oleh Midtrans saat status berubah

import { NextRequest, NextResponse } from 'next/server'
import { coreApi } from '@/lib/midtrans/client'
import { createAdminClient } from '@/lib/supabase/server'

// 1. Definisikan tipe status yang sesuai dengan skema ketat Supabase Anda
type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';
type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 2. Gunakan tipe data 'any' khusus pada coreApi untuk melewati validasi SDK yang kurang lengkap
    const statusResponse = await (coreApi as any).transaction.notification(body)
    const {
      order_id: midtransOrderId,
      transaction_status: txStatus,
      fraud_status: fStatus,
    } = statusResponse

    const supabase = await createAdminClient()

    // Cari order berdasarkan midtrans_order_id
    const { data: orderData } = await supabase
      .from('orders')
      .select('*, profiles(*)')
      .eq('midtrans_order_id', midtransOrderId)
      .single()

    if (!orderData) {
      console.error('Order tidak ditemukan:', midtransOrderId)
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    const order = orderData as any;

    // 3. Set tipe data status awal dengan proteksi literal type
    let orderStatus: OrderStatus = order.status as OrderStatus
    let paymentStatus: PaymentStatus = order.payment_status as PaymentStatus
    let paidAt: string | null = null

    // Tentukan status berdasarkan response Midtrans
    if (txStatus === 'capture') {
      if (fStatus === 'challenge') {
        orderStatus = 'pending'
        paymentStatus = 'unpaid'
      } else if (fStatus === 'accept') {
        orderStatus = 'paid'
        paymentStatus = 'paid'
        paidAt = new Date().toISOString()
      }
    } else if (txStatus === 'settlement') {
      orderStatus = 'paid'
      paymentStatus = 'paid'
      paidAt = new Date().toISOString()
    } else if (txStatus === 'cancel' || txStatus === 'deny' || txStatus === 'expire') {
      orderStatus = 'cancelled'
      paymentStatus = 'failed'
    } else if (txStatus === 'pending') {
      orderStatus = 'pending'
      paymentStatus = 'unpaid'
    } else if (txStatus === 'refund') {
      paymentStatus = 'refunded'
    }

    // Update order dengan mematuhi skema tipe data database
    const updateData: { status: OrderStatus; payment_status: PaymentStatus; paid_at?: string } = { 
      status: orderStatus, 
      payment_status: paymentStatus 
    }
    if (paidAt) updateData.paid_at = paidAt

    await supabase.from('orders').update(updateData as any).eq('id', order.id)

    // Catat transaksi saldo jika pembayaran sukses (untuk refund tracking)
    if (paymentStatus === 'paid' && order.payment_status !== 'paid') {
      await supabase.from('transactions').insert({
        user_id: order.user_id,
        type: 'debit',
        amount: order.total,
        balance_before: 0,
        balance_after: 0,
        ref_id: order.id,
        description: `Pembayaran order ${order.order_number} via Midtrans`,
        status: 'success',
      })
    }

    return NextResponse.json({ message: 'OK' })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}