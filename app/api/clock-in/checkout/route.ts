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
    const { location_lat, location_lng, notes } = body

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

    // Find active clock-in record
    const { data: activeSession } = await supabase
      .from('clock_in_records')
      .select('*')
      .is('clock_out_time', null)
      .limit(1)

    if (!activeSession || activeSession.length === 0) {
      return NextResponse.json(
        { error: 'Not currently clocked in' },
        { status: 409 }
      )
    }

    const session = activeSession[0]
    const clockOutTime = new Date().toISOString()
    const clockInTime = new Date(session.clock_in_time)
    const totalHours = (new Date(clockOutTime).getTime() - clockInTime.getTime()) / (1000 * 60 * 60)

    // Update with clock-out
    const { data, error } = await supabase
      .from('clock_in_records')
      .update({
        clock_out_time: clockOutTime,
        total_hours: parseFloat(totalHours.toFixed(2)),
        status: 'completed',
        location_lat,
        location_lng,
        notes: notes || null,
      })
      .eq('id', session.id)
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data?.[0], { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
