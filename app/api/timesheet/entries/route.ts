import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const start_date = searchParams.get('start_date')
    const end_date = searchParams.get('end_date')
    const status = searchParams.get('status')
    const project_id = searchParams.get('project_id')

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: 'start_date and end_date required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    let query = supabase
      .from('timesheets')
      .select('*')
      .gte('date', start_date)
      .lte('date', end_date)

    if (status) {
      query = query.eq('status', status)
    }
    if (project_id) {
      query = query.eq('project_id', project_id)
    }

    const { data: entries, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Calculate summary
    const summary = {
      total_hours: entries?.reduce((sum, e) => sum + e.hours_worked, 0) || 0,
      submitted_hours: entries?.filter(e => e.status === 'submitted').reduce((sum, e) => sum + e.hours_worked, 0) || 0,
      approved_hours: entries?.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.hours_worked, 0) || 0,
      draft_hours: entries?.filter(e => e.status === 'draft').reduce((sum, e) => sum + e.hours_worked, 0) || 0,
      period: `${start_date} to ${end_date}`,
    }

    return NextResponse.json({
      data: entries || [],
      summary,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
