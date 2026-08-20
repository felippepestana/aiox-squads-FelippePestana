/**
 * Brazilian National Holidays Calculator
 * Includes fixed holidays and mobile holidays (Easter-based)
 * CPC art. 216: courts do not function on holidays
 */

export interface Holiday {
  date: Date;
  name: string;
  type: 'fixed' | 'mobile' | 'recess';
}

/**
 * Calculate Easter date using the Anonymous Gregorian algorithm
 */
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get all Brazilian national holidays for a given year
 */
export function getNationalHolidays(year: number): Holiday[] {
  const easter = calculateEaster(year);

  const fixed: Holiday[] = [
    { date: new Date(year, 0, 1), name: 'Confraternização Universal', type: 'fixed' },
    { date: new Date(year, 3, 21), name: 'Tiradentes', type: 'fixed' },
    { date: new Date(year, 4, 1), name: 'Dia do Trabalho', type: 'fixed' },
    { date: new Date(year, 8, 7), name: 'Independência do Brasil', type: 'fixed' },
    { date: new Date(year, 9, 12), name: 'Nossa Senhora Aparecida', type: 'fixed' },
    { date: new Date(year, 10, 2), name: 'Finados', type: 'fixed' },
    { date: new Date(year, 10, 15), name: 'Proclamação da República', type: 'fixed' },
    { date: new Date(year, 10, 20), name: 'Dia da Consciência Negra', type: 'fixed' },
    { date: new Date(year, 11, 25), name: 'Natal', type: 'fixed' },
  ];

  const mobile: Holiday[] = [
    { date: addDays(easter, -48), name: 'Segunda-feira de Carnaval', type: 'mobile' },
    { date: addDays(easter, -47), name: 'Terça-feira de Carnaval', type: 'mobile' },
    { date: addDays(easter, -46), name: 'Quarta-feira de Cinzas (até 12h)', type: 'mobile' },
    { date: addDays(easter, -2), name: 'Sexta-feira Santa', type: 'mobile' },
    { date: easter, name: 'Páscoa', type: 'mobile' },
    { date: addDays(easter, 60), name: 'Corpus Christi', type: 'mobile' },
  ];

  return [...fixed, ...mobile].sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Check if a date falls within court recess (recesso forense)
 * Art. 220 CPC: Dec 20 to Jan 20 (inclusive)
 */
export function isCourtRecess(date: Date): boolean {
  const month = date.getMonth();
  const day = date.getDate();

  // December 20-31
  if (month === 11 && day >= 20) return true;
  // January 1-20
  if (month === 0 && day <= 20) return true;

  return false;
}

/**
 * Get court recess dates for a given year (Dec 20 of year to Jan 20 of year+1)
 */
export function getCourtRecessDates(year: number): { start: Date; end: Date } {
  return {
    start: new Date(year, 11, 20),
    end: new Date(year + 1, 0, 20),
  };
}

/**
 * Check if a specific date is a national holiday
 */
export function isNationalHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const holidays = getNationalHolidays(year);
  const dateStr = date.toISOString().split('T')[0];
  return holidays.some(h => h.date.toISOString().split('T')[0] === dateStr);
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Check if a date is a non-working day (weekend, holiday, or recess)
 */
export function isNonWorkingDay(date: Date, includeRecess: boolean = true): boolean {
  if (isWeekend(date)) return true;
  if (isNationalHoliday(date)) return true;
  if (includeRecess && isCourtRecess(date)) return true;
  return false;
}
