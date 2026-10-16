/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BudgetCategoryAllocation {
  id: string;
  name: string;
  defaultPercent: number; // e.g. 30
  currentPercent: number; // e.g. 30
  targetAmount: number;
  spentAmount: number;
  balance: number;
  isOverBudget: boolean;
  overAmount: number;
  color: string;
}

export interface ExpenseRecord {
  id: string;
  vendorName: string;
  category: string;
  totalAgreed: number;
  depositPaid: number;
  dueDate: string;
  status: 'Advance Paid' | 'Fully Paid' | 'Due Soon' | 'Pending';
  notes?: string;
}

/**
 * Formats a number in Indian Rupee format (Lakhs and Crores formatting)
 * e.g., 5000000 -> "₹50,00,000"
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  const isNegative = amount < 0;
  const absVal = Math.round(Math.abs(amount));
  const str = absVal.toString();

  if (str.length <= 3) {
    return `${isNegative ? '-' : ''}₹${str}`;
  }

  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${isNegative ? '-' : ''}₹${formattedOther},${lastThree}`;
}

/**
 * Compact Indian currency format (e.g., "₹50.0L", "₹1.25Cr")
 */
export function formatINRCompact(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10000000) {
    const cr = parseFloat((abs / 10000000).toFixed(2));
    return `${sign}₹${cr} Cr`;
  }
  if (abs >= 100000) {
    const lk = parseFloat((abs / 100000).toFixed(2));
    return `${sign}₹${lk} L`;
  }
  if (abs >= 1000) {
    const k = parseFloat((abs / 1000).toFixed(1));
    return `${sign}₹${k} k`;
  }
  return `${sign}₹${abs}`;
}

/**
 * Computes category-wise target caps, actual expenditures, and over-budget alerts.
 */
export function calculateBudgetAllocations(
  totalBudget: number,
  categoryConfigs: Array<{ id: string; name: string; percent: number; color: string }>,
  expenses: Array<{ category: string; totalAgreed: number }>
): BudgetCategoryAllocation[] {
  return categoryConfigs.map((cfg) => {
    const targetAmount = Math.round((totalBudget * cfg.percent) / 100);
    const spentAmount = expenses
      .filter((e) => e.category.toLowerCase() === cfg.id.toLowerCase() || e.category.toLowerCase() === cfg.name.toLowerCase())
      .reduce((sum, item) => sum + (item.totalAgreed || 0), 0);

    const isOverBudget = spentAmount > targetAmount;
    const overAmount = isOverBudget ? spentAmount - targetAmount : 0;
    const balance = targetAmount - spentAmount;

    return {
      id: cfg.id,
      name: cfg.name,
      defaultPercent: cfg.percent,
      currentPercent: cfg.percent,
      targetAmount,
      spentAmount,
      balance,
      isOverBudget,
      overAmount,
      color: cfg.color,
    };
  });
}

/**
 * Aggregates vendor payment ledger summaries
 */
export function calculatePaymentLedgerSummary(expenses: ExpenseRecord[]): {
  totalAgreed: number;
  totalPaid: number;
  totalPending: number;
  fullyPaidCount: number;
  pendingCount: number;
} {
  let totalAgreed = 0;
  let totalPaid = 0;
  let fullyPaidCount = 0;
  let pendingCount = 0;

  for (const item of expenses) {
    const agreed = item.totalAgreed || 0;
    const paid = item.depositPaid || 0;
    totalAgreed += agreed;
    totalPaid += paid;
    if (paid >= agreed && agreed > 0) {
      fullyPaidCount++;
    } else {
      pendingCount++;
    }
  }

  const totalPending = Math.max(0, totalAgreed - totalPaid);
  return {
    totalAgreed,
    totalPaid,
    totalPending,
    fullyPaidCount,
    pendingCount,
  };
}

/**
 * Calculates guest accommodations, catering plates (+10% safety buffer), and return gift hampers
 */
export function calculateGuestLogistics(
  totalGuests: number,
  outstationPercent: number = 40,
  occupancyPerRoom: number = 2,
  cateringSafetyBufferPercent: number = 10,
  giftBufferPercent: number = 5
): {
  outstationGuestsCount: number;
  hotelRoomsNeeded: number;
  cateringPlateCount: number;
  returnGiftsCount: number;
} {
  const safeGuests = Math.max(0, Math.round(totalGuests || 0));
  const outstationGuestsCount = Math.round((safeGuests * Math.max(0, Math.min(100, outstationPercent))) / 100);
  const hotelRoomsNeeded = outstationGuestsCount > 0 ? Math.ceil(outstationGuestsCount / Math.max(1, occupancyPerRoom)) : 0;
  const cateringPlateCount = Math.ceil(safeGuests * (1 + Math.max(0, cateringSafetyBufferPercent) / 100));
  const returnGiftsCount = Math.ceil(safeGuests * (1 + Math.max(0, giftBufferPercent) / 100));

  return {
    outstationGuestsCount,
    hotelRoomsNeeded,
    cateringPlateCount,
    returnGiftsCount,
  };
}

/**
 * Calculates remaining days until wedding date.
 */
export function calculateDaysRemaining(targetDateStr: string, referenceDateStr?: string): number {
  const target = new Date(targetDateStr);
  const ref = referenceDateStr ? new Date(referenceDateStr) : new Date();

  // Reset hours to start of day
  const targetUTC = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const refUTC = Date.UTC(ref.getFullYear(), ref.getMonth(), ref.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.round((targetUTC - refUTC) / msPerDay));
}

/**
 * Emergency kit packing progress
 */
export function calculateChecklistProgress(items: Array<{ isPacked?: boolean; isCompleted?: boolean }>): {
  total: number;
  completed: number;
  percent: number;
} {
  const total = items.length;
  if (total === 0) return { total: 0, completed: 0, percent: 100 };
  const completed = items.filter((i) => i.isPacked || i.isCompleted).length;
  const percent = Math.round((completed / total) * 100);
  return { total, completed, percent };
}
