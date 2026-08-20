import { NextRequest, NextResponse } from 'next/server';
import { getNationalHolidays, getCourtRecessDates } from '@/lib/deadlines';

/**
 * GET /api/deadlines/holidays?year=2026
 * Returns all national holidays and court recess for a given year
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get('year');
  const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

  if (isNaN(year) || year < 2000 || year > 2100) {
    return NextResponse.json(
      { error: 'Ano inválido. Informe um ano entre 2000 e 2100.' },
      { status: 400 }
    );
  }

  const holidays = getNationalHolidays(year);
  const recess = getCourtRecessDates(year);

  return NextResponse.json({
    data: {
      year,
      holidays: holidays.map(h => ({
        date: h.date.toISOString().split('T')[0],
        name: h.name,
        type: h.type,
      })),
      recess: {
        start: recess.start.toISOString().split('T')[0],
        end: recess.end.toISOString().split('T')[0],
        description: 'Recesso forense (CPC art. 220)',
      },
    },
  });
}
