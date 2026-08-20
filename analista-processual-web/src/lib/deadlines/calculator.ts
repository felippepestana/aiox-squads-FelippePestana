/**
 * CPC Deadline Calculator
 * Implements art. 219 (business days) and art. 224 (start rules)
 *
 * Rules:
 * - Art. 219: Deadlines counted in business days only
 * - Art. 224, §1º: Start date is first business day after intimation
 * - Art. 224, §2º: End date pushed to next business day if falls on non-working day
 * - Art. 220: Suspended during court recess (Dec 20 - Jan 20)
 * - Art. 229: Double deadline for Fazenda Pública, MP, and Defensoria
 */

import { isNonWorkingDay, getNationalHolidays, isCourtRecess, Holiday } from './holidays';
import { DeadlineType, getDeadlineType, DEADLINE_TYPES } from './types';

export interface CalculationInput {
  /** Start date (intimation/publication date) */
  startDate: string | Date;
  /** Deadline type ID or custom business days count */
  deadlineType?: string;
  /** Custom number of business days (overrides deadlineType) */
  customDays?: number;
  /** Whether to include court recess suspension (default: true) */
  includeRecess?: boolean;
  /** Whether to apply double deadline (Fazenda, MP, Defensoria) */
  doubleDeadline?: boolean;
  /** Court/tribunal code for specific suspensions */
  court?: string;
}

export interface CalculationResult {
  /** Original intimation date */
  intimationDate: Date;
  /** First business day after intimation (start of count) */
  countStartDate: Date;
  /** Calculated due date */
  dueDate: Date;
  /** Number of business days used */
  businessDays: number;
  /** Number of calendar days elapsed */
  calendarDays: number;
  /** Legal basis */
  legalBasis: string;
  /** Deadline type info */
  deadlineType?: DeadlineType;
  /** Whether double deadline was applied */
  doubleDeadlineApplied: boolean;
  /** Whether court recess affected the calculation */
  recessAffected: boolean;
  /** Days suspended due to recess */
  recessDaysSuspended: number;
  /** Holidays encountered during the period */
  holidaysEncountered: Holiday[];
  /** Step-by-step breakdown of the calculation */
  breakdown: DayBreakdown[];
}

export interface DayBreakdown {
  date: Date;
  dayNumber: number;
  isBusinessDay: boolean;
  isHoliday: boolean;
  isWeekend: boolean;
  isRecess: boolean;
  note?: string;
}

/**
 * Calculate procedural deadline per CPC/2015
 */
export function calculateDeadline(input: CalculationInput): CalculationResult {
  const startDate = typeof input.startDate === 'string' ? new Date(input.startDate + 'T12:00:00') : new Date(input.startDate);
  const includeRecess = input.includeRecess !== false;

  // Determine number of business days
  let businessDaysTarget: number;
  let deadlineTypeInfo: DeadlineType | undefined;
  let legalBasis: string;

  if (input.customDays) {
    businessDaysTarget = input.customDays;
    legalBasis = 'Prazo personalizado';
  } else if (input.deadlineType) {
    deadlineTypeInfo = getDeadlineType(input.deadlineType);
    if (!deadlineTypeInfo) {
      throw new Error(`Tipo de prazo desconhecido: ${input.deadlineType}`);
    }
    businessDaysTarget = deadlineTypeInfo.businessDays;
    legalBasis = deadlineTypeInfo.legalBasis;
  } else {
    throw new Error('Informe deadlineType ou customDays');
  }

  // Apply double deadline if applicable (art. 229 CPC)
  const doubleDeadlineApplied = input.doubleDeadline === true;
  if (doubleDeadlineApplied) {
    businessDaysTarget *= 2;
    legalBasis += ' c/c art. 229 CPC (prazo em dobro)';
  }

  // Art. 224, §1º: Count starts on first business day AFTER intimation
  let countStart = new Date(startDate);
  countStart.setDate(countStart.getDate() + 1);
  while (isNonWorkingDay(countStart, includeRecess)) {
    countStart.setDate(countStart.getDate() + 1);
  }

  // Count business days
  let businessDaysCounted = 0;
  let currentDate = new Date(countStart);
  let recessDaysSuspended = 0;
  let recessAffected = false;
  const holidaysEncountered: Holiday[] = [];
  const breakdown: DayBreakdown[] = [];
  const allHolidays = new Map<string, Holiday>();

  // Preload holidays for relevant years
  const startYear = startDate.getFullYear();
  for (let y = startYear; y <= startYear + 1; y++) {
    for (const h of getNationalHolidays(y)) {
      allHolidays.set(h.date.toISOString().split('T')[0], h);
    }
  }

  while (businessDaysCounted < businessDaysTarget) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const isHoliday = allHolidays.has(dateStr);
    const isRecess = includeRecess && isCourtRecess(currentDate);
    const isWorkingDay = !isWeekend && !isHoliday && !isRecess;

    if (isWorkingDay) {
      businessDaysCounted++;
    }

    if (isRecess && !isWeekend) {
      recessDaysSuspended++;
      recessAffected = true;
    }

    if (isHoliday) {
      const holiday = allHolidays.get(dateStr)!;
      if (!holidaysEncountered.find(h => h.date.toISOString().split('T')[0] === dateStr)) {
        holidaysEncountered.push(holiday);
      }
    }

    breakdown.push({
      date: new Date(currentDate),
      dayNumber: businessDaysCounted,
      isBusinessDay: isWorkingDay,
      isHoliday,
      isWeekend,
      isRecess,
      note: isWorkingDay
        ? `${businessDaysCounted}º dia útil`
        : isRecess
          ? 'Recesso forense (suspenso)'
          : isHoliday
            ? `Feriado: ${allHolidays.get(dateStr)?.name}`
            : isWeekend
              ? currentDate.getDay() === 0 ? 'Domingo' : 'Sábado'
              : undefined,
    });

    if (businessDaysCounted < businessDaysTarget) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // The due date is the last counted business day
  const dueDate = new Date(currentDate);

  // Calendar days elapsed
  const calendarDays = Math.round((dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return {
    intimationDate: startDate,
    countStartDate: countStart,
    dueDate,
    businessDays: businessDaysTarget,
    calendarDays,
    legalBasis,
    deadlineType: deadlineTypeInfo,
    doubleDeadlineApplied,
    recessAffected,
    recessDaysSuspended,
    holidaysEncountered,
    breakdown,
  };
}

/**
 * Get all available deadline types
 */
export function getAvailableDeadlineTypes(): DeadlineType[] {
  return DEADLINE_TYPES;
}

/**
 * Calculate multiple deadlines from the same start date
 * Useful for showing all relevant deadlines after a judicial notification
 */
export function calculateMultipleDeadlines(
  startDate: string | Date,
  deadlineTypeIds: string[],
  options?: { includeRecess?: boolean; doubleDeadline?: boolean; court?: string }
): CalculationResult[] {
  return deadlineTypeIds.map(typeId =>
    calculateDeadline({
      startDate,
      deadlineType: typeId,
      ...options,
    })
  );
}
