import { NextRequest, NextResponse } from 'next/server';
import { calculateDeadline, calculateMultipleDeadlines, getAvailableDeadlineTypes } from '@/lib/deadlines';

/**
 * POST /api/deadlines/calculate
 * Calculate procedural deadline(s) per CPC/2015
 *
 * Body:
 * - startDate: string (ISO date, e.g. "2026-08-19")
 * - deadlineType?: string (ID from deadline types catalog)
 * - customDays?: number (override with custom business days)
 * - includeRecess?: boolean (default: true)
 * - doubleDeadline?: boolean (Fazenda, MP, Defensoria)
 * - court?: string
 * - multiple?: string[] (array of deadline type IDs for batch calculation)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startDate, deadlineType, customDays, includeRecess, doubleDeadline, court, multiple } = body;

    if (!startDate) {
      return NextResponse.json(
        { error: 'startDate é obrigatório (formato ISO: YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    if (!deadlineType && !customDays && !multiple) {
      return NextResponse.json(
        { error: 'Informe deadlineType, customDays ou multiple' },
        { status: 400 }
      );
    }

    // Batch calculation
    if (multiple && Array.isArray(multiple)) {
      const results = calculateMultipleDeadlines(startDate, multiple, {
        includeRecess,
        doubleDeadline,
        court,
      });

      // Return without full breakdown for batch (too verbose)
      const summary = results.map(r => ({
        deadlineType: r.deadlineType?.name,
        legalBasis: r.legalBasis,
        intimationDate: r.intimationDate.toISOString().split('T')[0],
        countStartDate: r.countStartDate.toISOString().split('T')[0],
        dueDate: r.dueDate.toISOString().split('T')[0],
        businessDays: r.businessDays,
        calendarDays: r.calendarDays,
        recessAffected: r.recessAffected,
        holidaysEncountered: r.holidaysEncountered.map(h => ({
          date: h.date.toISOString().split('T')[0],
          name: h.name,
        })),
      }));

      return NextResponse.json({ data: summary });
    }

    // Single calculation
    const result = calculateDeadline({
      startDate,
      deadlineType,
      customDays,
      includeRecess,
      doubleDeadline,
      court,
    });

    return NextResponse.json({
      data: {
        intimationDate: result.intimationDate.toISOString().split('T')[0],
        countStartDate: result.countStartDate.toISOString().split('T')[0],
        dueDate: result.dueDate.toISOString().split('T')[0],
        businessDays: result.businessDays,
        calendarDays: result.calendarDays,
        legalBasis: result.legalBasis,
        deadlineType: result.deadlineType,
        doubleDeadlineApplied: result.doubleDeadlineApplied,
        recessAffected: result.recessAffected,
        recessDaysSuspended: result.recessDaysSuspended,
        holidaysEncountered: result.holidaysEncountered.map(h => ({
          date: h.date.toISOString().split('T')[0],
          name: h.name,
          type: h.type,
        })),
        breakdown: result.breakdown.map(d => ({
          date: d.date.toISOString().split('T')[0],
          dayNumber: d.dayNumber,
          isBusinessDay: d.isBusinessDay,
          note: d.note,
        })),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao calcular prazo';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * GET /api/deadlines/calculate
 * Returns available deadline types catalog
 */
export async function GET() {
  const types = getAvailableDeadlineTypes();
  return NextResponse.json({ data: types });
}
