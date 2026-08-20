/**
 * Legal Office KPI Calculator
 * Metrics for law office performance monitoring
 */

export interface CaseData {
  id: string;
  type: string;
  area: string;
  status: 'active' | 'won' | 'lost' | 'settled' | 'archived';
  startDate: string;
  endDate?: string;
  causeValue?: number;
  recoveredValue?: number;
  costs?: number;
  attorney?: string;
  court?: string;
}

export interface OfficeKPIs {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  successRate: number;
  averageDurationDays: number;
  averageDurationMonths: number;
  totalRecovered: number;
  totalCosts: number;
  netResult: number;
  roi: number;
  costPerCase: number;
  revenuePerCase: number;
  casesByArea: Record<string, number>;
  casesByStatus: Record<string, number>;
  casesByCourt: Record<string, number>;
  monthlyClosures: MonthlyMetric[];
}

export interface MonthlyMetric {
  month: string;
  count: number;
  value?: number;
}

export interface AttorneyMetrics {
  attorney: string;
  totalCases: number;
  activeCases: number;
  successRate: number;
  averageDuration: number;
  totalRecovered: number;
  efficiency: number; // cases resolved per month
}

/**
 * Calculate office-wide KPIs from case data
 */
export function calculateOfficeKPIs(cases: CaseData[]): OfficeKPIs {
  const activeCases = cases.filter(c => c.status === 'active');
  const closedCases = cases.filter(c => c.status !== 'active');
  const successCases = cases.filter(c => c.status === 'won' || c.status === 'settled');

  // Success rate
  const successRate = closedCases.length > 0
    ? (successCases.length / closedCases.length) * 100
    : 0;

  // Average duration (closed cases)
  const durations = closedCases
    .filter(c => c.startDate && c.endDate)
    .map(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate!);
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    });
  const averageDurationDays = durations.length > 0
    ? durations.reduce((a, b) => a + b, 0) / durations.length
    : 0;

  // Financial metrics
  const totalRecovered = cases.reduce((sum, c) => sum + (c.recoveredValue || 0), 0);
  const totalCosts = cases.reduce((sum, c) => sum + (c.costs || 0), 0);
  const netResult = totalRecovered - totalCosts;
  const roi = totalCosts > 0 ? (netResult / totalCosts) * 100 : 0;
  const costPerCase = cases.length > 0 ? totalCosts / cases.length : 0;
  const revenuePerCase = closedCases.length > 0 ? totalRecovered / closedCases.length : 0;

  // Breakdowns
  const casesByArea: Record<string, number> = {};
  const casesByStatus: Record<string, number> = {};
  const casesByCourt: Record<string, number> = {};

  for (const c of cases) {
    casesByArea[c.area] = (casesByArea[c.area] || 0) + 1;
    casesByStatus[c.status] = (casesByStatus[c.status] || 0) + 1;
    if (c.court) casesByCourt[c.court] = (casesByCourt[c.court] || 0) + 1;
  }

  // Monthly closures (last 12 months)
  const monthlyClosures = calculateMonthlyClosures(closedCases);

  return {
    totalCases: cases.length,
    activeCases: activeCases.length,
    closedCases: closedCases.length,
    successRate: round2(successRate),
    averageDurationDays: Math.round(averageDurationDays),
    averageDurationMonths: round2(averageDurationDays / 30),
    totalRecovered: round2(totalRecovered),
    totalCosts: round2(totalCosts),
    netResult: round2(netResult),
    roi: round2(roi),
    costPerCase: round2(costPerCase),
    revenuePerCase: round2(revenuePerCase),
    casesByArea,
    casesByStatus,
    casesByCourt,
    monthlyClosures,
  };
}

/**
 * Calculate per-attorney metrics
 */
export function calculateAttorneyMetrics(cases: CaseData[]): AttorneyMetrics[] {
  const byAttorney: Record<string, CaseData[]> = {};

  for (const c of cases) {
    const attorney = c.attorney || 'Não atribuído';
    if (!byAttorney[attorney]) byAttorney[attorney] = [];
    byAttorney[attorney].push(c);
  }

  return Object.entries(byAttorney).map(([attorney, attorneyCases]) => {
    const closed = attorneyCases.filter(c => c.status !== 'active');
    const won = attorneyCases.filter(c => c.status === 'won' || c.status === 'settled');
    const successRate = closed.length > 0 ? (won.length / closed.length) * 100 : 0;

    const durations = closed
      .filter(c => c.startDate && c.endDate)
      .map(c => (new Date(c.endDate!).getTime() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

    const totalRecovered = attorneyCases.reduce((sum, c) => sum + (c.recoveredValue || 0), 0);

    // Efficiency: cases closed per month of activity
    const activeDays = attorneyCases.reduce((sum, c) => {
      const start = new Date(c.startDate);
      const end = c.endDate ? new Date(c.endDate) : new Date();
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    }, 0);
    const activeMonths = activeDays / 30;
    const efficiency = activeMonths > 0 ? closed.length / activeMonths : 0;

    return {
      attorney,
      totalCases: attorneyCases.length,
      activeCases: attorneyCases.filter(c => c.status === 'active').length,
      successRate: round2(successRate),
      averageDuration: Math.round(avgDuration),
      totalRecovered: round2(totalRecovered),
      efficiency: round2(efficiency),
    };
  });
}

function calculateMonthlyClosures(closedCases: CaseData[]): MonthlyMetric[] {
  const months: Record<string, { count: number; value: number }> = {};
  const now = new Date();

  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = { count: 0, value: 0 };
  }

  for (const c of closedCases) {
    if (c.endDate) {
      const d = new Date(c.endDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].count++;
        months[key].value += c.recoveredValue || 0;
      }
    }
  }

  return Object.entries(months).map(([month, data]) => ({
    month,
    count: data.count,
    value: round2(data.value),
  }));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
