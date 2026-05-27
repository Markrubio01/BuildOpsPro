import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { location_lat, location_lng, biometric_verified, biometric_type, notes } = body

    if (location_lat === undefined || location_lng === undefined) {
      return NextResponse.json(
        { error: 'Location coordinates required' },
        { status: 400 }
      )
    }

    // Validate location coordinates
    if (location_lat < -90 || location_lat > 90 || location_lng < -180 || location_lng > 180) {
      return NextResponse.json(
        { error: 'Invalid location coordinates' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Check if already clocked in
    const { data: existingSession } = await supabase
      .from('clock_in_records')
      .select('*')
      .is('clock_out_time', null)
      .limit(1)

    if (existingSession && existingSession.length > 0) {
      return NextResponse.json(
        { error: 'Already clocked in' },
        { status: 409 }
      )
    }

    const now = new Date().toISOString()

    // Insert clock-in record
    const { data, error } = await supabase
      .from('clock_in_records')
      .insert({
        clock_in_time: now,
        location_lat,
        location_lng,
        biometric_verified: biometric_verified || false,
        biometric_type: biometric_type || null,
        status: 'active',
        notes: notes || null,
      })
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data?.[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
