import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  formatINRCompact,
  calculateBudgetAllocations,
  calculatePaymentLedgerSummary,
  calculateGuestLogistics,
  calculateDaysRemaining,
  calculateChecklistProgress,
} from './weddingCalculations.ts';

test('formatINR formats standard Indian numbering system correctly', () => {
  assert.equal(formatINR(5000000), '₹50,00,000');
  assert.equal(formatINR(125000), '₹1,25,000');
  assert.equal(formatINR(500), '₹500');
  assert.equal(formatINR(0), '₹0');
  assert.equal(formatINR(-25000), '-₹25,000');
});

test('formatINRCompact converts values to Lakhs and Crores', () => {
  assert.equal(formatINRCompact(5000000), '₹50 L');
  assert.equal(formatINRCompact(15000000), '₹1.5 Cr');
  assert.equal(formatINRCompact(75000), '₹75 k');
});

test('calculateBudgetAllocations tracks targets and over-budget status', () => {
  const configs = [
    { id: 'venue', name: 'Venue & Stay', percent: 30, color: '#800020' },
    { id: 'catering', name: 'Catering', percent: 25, color: '#D4AF37' },
  ];
  const expenses = [
    { category: 'venue', totalAgreed: 1400000 },
    { category: 'catering', totalAgreed: 1350000 }, // target is 12,50,000 -> over by 1,00,000
  ];
  const totalBudget = 5000000; // 50 Lakhs

  const allocations = calculateBudgetAllocations(totalBudget, configs, expenses);

  assert.equal(allocations[0].targetAmount, 1500000);
  assert.equal(allocations[0].spentAmount, 1400000);
  assert.equal(allocations[0].isOverBudget, false);
  assert.equal(allocations[0].balance, 100000);

  assert.equal(allocations[1].targetAmount, 1250000);
  assert.equal(allocations[1].spentAmount, 1350000);
  assert.equal(allocations[1].isOverBudget, true);
  assert.equal(allocations[1].overAmount, 100000);
});

test('calculatePaymentLedgerSummary computes committed, paid, and balance', () => {
  const ledger = [
    { id: '1', vendorName: 'Grand Palace', category: 'venue', totalAgreed: 1500000, depositPaid: 500000, dueDate: '2026-11-01', status: 'Advance Paid' as const },
    { id: '2', vendorName: 'Royal Decor', category: 'decor', totalAgreed: 700000, depositPaid: 700000, dueDate: '2026-10-20', status: 'Fully Paid' as const },
  ];

  const summary = calculatePaymentLedgerSummary(ledger);
  assert.equal(summary.totalAgreed, 2200000);
  assert.equal(summary.totalPaid, 1200000);
  assert.equal(summary.totalPending, 1000000);
  assert.equal(summary.fullyPaidCount, 1);
  assert.equal(summary.pendingCount, 1);
});

test('calculateGuestLogistics accurately calculates buffer and room counts', () => {
  // 500 guests, 40% outstation = 200 outstation guests -> 100 rooms needed
  // Catering buffer +10% -> 550 plates
  // Gift buffer +5% -> 525 gifts
  const result = calculateGuestLogistics(500, 40, 2, 10, 5);

  assert.equal(result.outstationGuestsCount, 200);
  assert.equal(result.hotelRoomsNeeded, 100);
  assert.equal(result.cateringPlateCount, 550);
  assert.equal(result.returnGiftsCount, 525);
});

test('calculateDaysRemaining calculates calendar differences accurately', () => {
  const days = calculateDaysRemaining('2026-12-15', '2026-12-10');
  assert.equal(days, 5);

  const past = calculateDaysRemaining('2026-10-01', '2026-10-15');
  assert.equal(past, 0);
});

test('calculateChecklistProgress computes percentage completed', () => {
  const items = [
    { isPacked: true },
    { isPacked: true },
    { isPacked: false },
    { isPacked: false },
  ];
  const progress = calculateChecklistProgress(items);
  assert.equal(progress.total, 4);
  assert.equal(progress.completed, 2);
  assert.equal(progress.percent, 50);
});
