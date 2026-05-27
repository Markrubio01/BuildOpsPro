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
    const project_id = searchParams.get('project_id')
    const period_start = searchParams.get('period_start')
    const period_end = searchParams.get('period_end')

    if (!project_id || !period_start || !period_end) {
      return NextResponse.json(
        { error: 'project_id, period_start, and period_end required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Get timesheets for the period
    const { data: timesheets } = await supabase
      .from('timesheets')
      .select('*')
      .eq('project_id', project_id)
      .gte('date', period_start)
      .lte('date', period_end)
      .eq('status', 'approved')

    // Get payroll records
    const { data: payrolls, error } = await supabase
      .from('payroll')
      .select('*')
      .eq('project_id', project_id)
      .gte('period_start', period_start)
      .lte('period_end', period_end)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Calculate totals
    const totalExpenses = payrolls?.reduce((sum, p) => sum + (p.total_amount || 0), 0) || 0

    return NextResponse.json({
      data: payrolls || [],
      period: {
        start: period_start,
        end: period_end,
      },
      summary: {
        total_expenses: totalExpenses,
        total_employees: payrolls?.length || 0,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const { project_id, period_start, period_end, changes } = body

    if (!project_id || !period_start || !period_end) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Apply changes to payroll records
    const { data, error } = await supabase
      .from('payroll')
      .upsert(
        changes.map((change: any) => ({
          ...change,
          project_id,
          period_start,
          period_end,
          updated_at: new Date().toISOString(),
        }))
      )
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data,
      message: 'Payroll records updated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
