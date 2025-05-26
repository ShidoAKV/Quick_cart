import { headers } from 'next/headers'
import { Webhook } from 'svix'
import connectDB from '@/config/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  const payload = await req.text()
  const headerList = headers()

  const svixHeaders = {
    'svix-id': headerList.get('svix-id'),
    'svix-timestamp': headerList.get('svix-timestamp'),
    'svix-signature': headerList.get('svix-signature'),
  }

  const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET)

  let evt
  try {
    evt = wh.verify(payload, svixHeaders)
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const eventType = evt.type
  const userData = evt.data
  console.log(eventType, userData)

  await connectDB()

  try {
    if (eventType === 'user.created') {
      await User.create({
        _id: userData.id,
        name: `${userData.first_name} ${userData.last_name}`.trim() || 'Unknown',
        email: userData.email_addresses[0]?.email_address || '',
        imageUrl: userData.image_url || '',
        cartItems: {},
      })
    } else if (eventType === 'user.updated') {
      await User.findByIdAndUpdate(userData.id, {
        name: `${userData.first_name} ${userData.last_name}`.trim() || 'Unknown',
        email: userData.email_addresses[0]?.email_address || '',
        imageUrl: userData.image_url || '',
      })
    } else if (eventType === 'user.deleted') {
      await User.findByIdAndDelete(userData.id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DB operation error:', err)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
