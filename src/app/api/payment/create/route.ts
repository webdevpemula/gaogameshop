// src/app/api/payment/create/route.ts
// Buat transaksi Midtrans Snap

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { snap } from '@/lib/midtrans/client'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Cek auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { items, payment_method, game_target_id, game_target_server, notes } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 })
    }

    // Ambil profile user
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile tidak ditemukan' }, { status: 404 })

    // Hitung total
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0)
    const total = subtotal

    // Cek saldo jika bayar pakai saldo
    if (payment_method === 'saldo') {
      if (profile.saldo < total) {
        return NextResponse.json({ error: 'Saldo tidak mencukupi' }, { status: 400 })
      }
    }

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Buat order di database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        status: 'pending',
        payment_status: 'unpaid',
        subtotal,
        total,
        payment_method,
        game_target_id: game_target_id || null,
        game_target_server: game_target_server || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Gagal membuat order' }, { status: 500 })
    }

    // Buat order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_image: item.image_url || null,
      qty: item.qty,
      price: item.price,
      subtotal: item.price * item.qty,
    }))

    await supabase.from('order_items').insert(orderItems)

    // ── BAYAR DENGAN SALDO ──────────────────────────────────
    if (payment_method === 'saldo') {
      const balanceBefore = profile.saldo
      const balanceAfter = profile.saldo - total

      // Debit saldo
      await supabase
        .from('profiles')
        .update({ saldo: balanceAfter })
        .eq('id', user.id)

      // Catat transaksi
      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'debit',
        amount: total,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        ref_id: order.id,
        description: `Pembayaran order ${orderNumber}`,
        status: 'success',
      })

      // Update order jadi paid
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', order.id)

      return NextResponse.json({
        success: true,
        payment_method: 'saldo',
        order_id: order.id,
        order_number: orderNumber,
      })
    }

    // ── BAYAR DENGAN MIDTRANS ───────────────────────────────
    const midtransOrderId = `${orderNumber}-${Date.now()}`

    const parameter = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: total,
      },
      item_details: items.map((item: any) => ({
        id: item.id,
        price: item.price,
        quantity: item.qty,
        name: item.name.substring(0, 50),
      })),
      customer_details: {
        first_name: profile.full_name || 'User',
        email: user.email,
        phone: profile.phone || '',
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/${order.id}`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/${order.id}?status=error`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/${order.id}?status=pending`,
      },
    }

    const snapTransaction = await snap.createTransaction(parameter)

    // Simpan midtrans token ke order
    await supabase
      .from('orders')
      .update({
        midtrans_order_id: midtransOrderId,
        midtrans_token: snapTransaction.token,
      })
      .eq('id', order.id)

    return NextResponse.json({
      success: true,
      payment_method: 'midtrans',
      order_id: order.id,
      order_number: orderNumber,
      snap_token: snapTransaction.token,
      redirect_url: snapTransaction.redirect_url,
    })

  } catch (error: any) {
    console.error('Payment create error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
