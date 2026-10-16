/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  TrendingUp,
  Percent,
  Receipt,
  Trash2,
  Edit2,
  DollarSign,
} from 'lucide-react';
import { BudgetConfig } from '../types/wedding.ts';
import {
  ExpenseRecord,
  formatINR,
  formatINRCompact,
  calculateBudgetAllocations,
  calculatePaymentLedgerSummary,
} from '../utils/weddingCalculations.ts';

interface BudgetHubProps {
  totalBudget: number;
  onUpdateTotalBudget: (newBudget: number) => void;
  budgetConfigs: BudgetConfig[];
  onUpdateBudgetConfigs: (configs: BudgetConfig[]) => void;
  expenses: ExpenseRecord[];
  onAddExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  onUpdateExpense: (expense: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
}

export const BudgetHub: React.FC<BudgetHubProps> = ({
  totalBudget,
  onUpdateTotalBudget,
  budgetConfigs,
  onUpdateBudgetConfigs,
  expenses,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  // Budget presets
  const presets = [
    { label: '₹20 Lakhs', value: 2000000, desc: 'Intimate Elegant' },
    { label: '₹50 Lakhs', value: 5000000, desc: 'Grand Palace' },
    { label: '₹1.00 Crore', value: 10000000, desc: 'Royal Destination' },
    { label: '₹2.50 Crores', value: 25000000, desc: 'Ultra Luxury' },
  ];

  // Modals / Form states
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [activeDonutHover, setActiveDonutHover] = useState<string | null>(null);

  // New expense form state
  const [formVendor, setFormVendor] = useState('');
  const [formCategory, setFormCategory] = useState(budgetConfigs[0]?.id || 'venue');
  const [formAgreed, setFormAgreed] = useState('');
  const [formPaid, setFormPaid] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Computations
  const categoryAllocations = useMemo(
    () => calculateBudgetAllocations(totalBudget, budgetConfigs, expenses),
    [totalBudget, budgetConfigs, expenses]
  );

  const ledgerSummary = useMemo(
    () => calculatePaymentLedgerSummary(expenses),
    [expenses]
  );

  // Check for over-budget categories
  const overBudgetCategories = useMemo(
    () => categoryAllocations.filter((cat) => cat.isOverBudget),
    [categoryAllocations]
  );

  // Filtered expense ledger
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchCat =
        selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
      const matchStatus =
        selectedStatusFilter === 'all' || item.status === selectedStatusFilter;
      return matchCat && matchStatus;
    });
  }, [expenses, selectedCategoryFilter, selectedStatusFilter]);

  // Handle slider change for allocation percentage
  const handleSliderChange = (catId: string, newPercent: number) => {
    const updated = budgetConfigs.map((c) =>
      c.id === catId ? { ...c, percent: newPercent } : c
    );
    onUpdateBudgetConfigs(updated);
  };

  // Submit expense
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const agreedNum = parseFloat(formAgreed) || 0;
    const paidNum = parseFloat(formPaid) || 0;

    let computedStatus: ExpenseRecord['status'] = 'Pending';
    if (paidNum >= agreedNum && agreedNum > 0) {
      computedStatus = 'Fully Paid';
    } else if (paidNum > 0) {
      computedStatus = 'Advance Paid';
    }

    if (editingExpense) {
      onUpdateExpense({
        ...editingExpense,
        vendorName: formVendor,
        category: formCategory,
        totalAgreed: agreedNum,
        depositPaid: paidNum,
        dueDate: formDueDate || editingExpense.dueDate,
        status: computedStatus,
        notes: formNotes,
      });
      setEditingExpense(null);
    } else {
      onAddExpense({
        vendorName: formVendor || 'Unnamed Vendor',
        category: formCategory,
        totalAgreed: agreedNum,
        depositPaid: paidNum,
        dueDate: formDueDate || new Date().toISOString().split('T')[0],
        status: computedStatus,
        notes: formNotes,
      });
    }

    // Reset form
    setFormVendor('');
    setFormAgreed('');
    setFormPaid('');
    setFormNotes('');
    setIsAddExpenseOpen(false);
  };

  const handleStartEdit = (exp: ExpenseRecord) => {
    setEditingExpense(exp);
    setFormVendor(exp.vendorName);
    setFormCategory(exp.category);
    setFormAgreed(exp.totalAgreed.toString());
    setFormPaid(exp.depositPaid.toString());
    setFormDueDate(exp.dueDate);
    setFormNotes(exp.notes || '');
    setIsAddExpenseOpen(true);
  };

  // Quick record payment on an expense
  const handleQuickAddPayment = (exp: ExpenseRecord) => {
    const remaining = Math.max(0, exp.totalAgreed - exp.depositPaid);
    if (remaining <= 0) return;
    const promptAmount = window.prompt(
      `Enter payment amount for ${exp.vendorName} (Remaining balance: ${formatINR(remaining)}):`,
      remaining.toString()
    );
    if (!promptAmount) return;
    const amt = parseFloat(promptAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newDeposit = Math.min(exp.totalAgreed, exp.depositPaid + amt);
    onUpdateExpense({
      ...exp,
      depositPaid: newDeposit,
      status: newDeposit >= exp.totalAgreed ? 'Fully Paid' : 'Advance Paid',
    });
  };

  // Interactive SVG Donut geometry
  const totalAllocatedPercent = budgetConfigs.reduce((sum, c) => sum + c.percent, 0);
  const donutRadius = 80;
  const donutStrokeWidth = 32;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedAngle = 0;

  const donutSegments = categoryAllocations.map((cat) => {
    const fraction = totalAllocatedPercent > 0 ? cat.currentPercent / totalAllocatedPercent : 0;
    const strokeDasharray = `${fraction * donutCircumference} ${donutCircumference}`;
    const strokeDashoffset = -accumulatedAngle * donutCircumference;
    accumulatedAngle += fraction;

    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Pillar Header & Introduction */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Pillar 1 • Financial & Budget Hub
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Dynamic Budget Allocator & Vendor Ledger
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl">
              Real-time expense caps, automated Indian wedding splits, advance deposit tracking, and milestone payment reminders.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-stone-500 mr-1">Presets:</span>
            {presets.map((p) => (
              <button
                key={p.value}
                onClick={() => onUpdateTotalBudget(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  totalBudget === p.value
                    ? 'bg-[#800020] text-amber-200 border-[#800020] shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-amber-50 border-stone-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Budget Input Bar */}
        <div className="mt-6 pt-5 border-t border-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex-1 max-w-md">
            <label htmlFor="custom-budget-input" className="block text-xs font-semibold text-stone-700 mb-1.5">
              Total Wedding Budget (₹ INR)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-500 font-bold">
                ₹
              </div>
              <input
                id="custom-budget-input"
                type="number"
                value={totalBudget}
                onChange={(e) => onUpdateTotalBudget(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-8 pr-4 text-stone-900 font-bold text-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                placeholder="5000000"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-stone-500 font-medium">Indian Standard Format</div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#800020]">
                {formatINR(totalBudget)}
              </div>
            </div>
            <div className="border-l border-amber-200 pl-6 hidden sm:block">
              <div className="text-xs text-stone-500 font-medium">Committed vs Cap</div>
              <div className="text-lg font-bold text-stone-800">
                {formatINRCompact(ledgerSummary.totalAgreed)} / {formatINRCompact(totalBudget)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Over-Budget Alert Banners */}
      {overBudgetCategories.length > 0 && (
        <div className="space-y-3">
          {overBudgetCategories.map((overCat) => (
            <div
              key={overCat.id}
              className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl flex items-start justify-between shadow-sm"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">
                    Budget Cap Exceeded: {overCat.name}
                  </h4>
                  <p className="text-xs text-red-700 mt-0.5">
                    Total committed agreements for {overCat.name} stand at{' '}
                    <span className="font-semibold">{formatINR(overCat.spentAmount)}</span>, exceeding the allocated cap of{' '}
                    <span className="font-semibold">{formatINR(overCat.targetAmount)}</span> by{' '}
                    <span className="font-bold underline">{formatINR(overCat.overAmount)}</span>.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold bg-red-150 text-red-800 px-2.5 py-1 rounded-full uppercase shrink-0">
                Action Required
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Total Agreed with Vendors</span>
            <Receipt className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 mt-2">
            {formatINR(ledgerSummary.totalAgreed)}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {expenses.length} contract lines recorded
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-medium">
            <span>Advance Deposits Paid</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 mt-2">
            {formatINR(ledgerSummary.totalPaid)}
          </div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">
            {ledgerSummary.fullyPaidCount} vendors settled in full
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 text-xs font-medium">
            <span>Remaining Milestone Balance</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-800 mt-2">
            {formatINR(ledgerSummary.totalPending)}
          </div>
          <div className="text-xs text-amber-600 mt-1 font-medium">
            {ledgerSummary.pendingCount} milestones due prior to Pheras
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Unallocated Budget Buffer</span>
            <TrendingUp className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 mt-2">
            {formatINR(Math.max(0, totalBudget - ledgerSummary.totalAgreed))}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {Math.max(0, Math.round(((totalBudget - ledgerSummary.totalAgreed) / (totalBudget || 1)) * 100))}% free reserve
          </div>
        </div>
      </div>

      {/* Main Budget Grid: Interactive Chart + Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Donut Chart & Category Legend */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Visual Allocation Breakdown
              </h3>
              <p className="text-xs text-stone-500">Standard Indian wedding category distribution</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
              Total {totalAllocatedPercent}%
            </span>
          </div>

          {/* SVG Donut */}
          <div className="relative flex items-center justify-center py-4">
            <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 200 200">
              {donutSegments.map((seg) => (
                <circle
                  key={seg.id}
                  cx="100"
                  cy="100"
                  r={donutRadius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={donutStrokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                  onMouseEnter={() => setActiveDonutHover(seg.id)}
                  onMouseLeave={() => setActiveDonutHover(null)}
                />
              ))}
            </svg>

            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                {activeDonutHover
                  ? categoryAllocations.find((c) => c.id === activeDonutHover)?.name
                  : 'Total Budget'}
              </span>
              <span className="text-xl font-extrabold text-stone-900 tracking-tight">
                {activeDonutHover
                  ? formatINRCompact(
                      categoryAllocations.find((c) => c.id === activeDonutHover)?.targetAmount || 0
                    )
                  : formatINRCompact(totalBudget)}
              </span>
              <span className="text-[10px] text-amber-700 font-medium">
                {activeDonutHover
                  ? `${categoryAllocations.find((c) => c.id === activeDonutHover)?.currentPercent}% allocated`
                  : '100% Comprehensive'}
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            {categoryAllocations.map((cat) => (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveDonutHover(cat.id)}
                onMouseLeave={() => setActiveDonutHover(null)}
                className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  activeDonutHover === cat.id ? 'bg-amber-50' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-md shrink-0 shadow-xs"
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  <span className="font-medium text-stone-800">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-stone-900">{formatINR(cat.targetAmount)}</span>
                  <span className="text-stone-400 font-medium w-8 text-right">{cat.currentPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dynamic Category Sliders & Live Caps */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Category Sliders & Real-Time Caps
              </h3>
              <p className="text-xs text-stone-500">
                Adjust percentages to recalculate expense thresholds dynamically
              </p>
            </div>
            <button
              onClick={() => {
                // Reset to standard Indian split
                const defaults = [
                  { id: 'venue', percent: 30 },
                  { id: 'catering', percent: 25 },
                  { id: 'decor', percent: 15 },
                  { id: 'photo', percent: 10 },
                  { id: 'outfits', percent: 10 },
                  { id: 'entertainment', percent: 5 },
                  { id: 'buffer', percent: 5 },
                ];
                const updated = budgetConfigs.map((c) => {
                  const match = defaults.find((d) => d.id === c.id);
                  return match ? { ...c, percent: match.percent } : c;
                });
                onUpdateBudgetConfigs(updated);
              }}
              className="text-xs text-amber-800 hover:text-amber-900 font-medium underline cursor-pointer"
            >
              Reset to Standard Splits
            </button>
          </div>

          <div className="space-y-4">
            {categoryAllocations.map((cat) => {
              const percentUsed =
                cat.targetAmount > 0 ? Math.round((cat.spentAmount / cat.targetAmount) * 100) : 0;

              return (
                <div
                  key={cat.id}
                  className={`p-4 rounded-xl border transition-all ${
                    cat.isOverBudget
                      ? 'border-red-300 bg-red-50/40'
                      : 'border-stone-200 hover:border-amber-300 bg-stone-50/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      ></span>
                      <h4 className="font-semibold text-sm text-stone-900">{cat.name}</h4>
                      {cat.isOverBudget && (
                        <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                          + {formatINR(cat.overAmount)} OVER
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-600 flex items-center gap-3">
                      <span>
                        Cap: <strong className="text-stone-900">{formatINR(cat.targetAmount)}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Spent:{' '}
                        <strong className={cat.isOverBudget ? 'text-red-700' : 'text-stone-900'}>
                          {formatINR(cat.spentAmount)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Percentage Slider */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={cat.currentPercent}
                      onChange={(e) => handleSliderChange(cat.id, parseInt(e.target.value) || 0)}
                      className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#800020]"
                      aria-label={`${cat.name} percentage allocation`}
                    />
                    <div className="w-12 text-right text-xs font-bold text-stone-800">
                      {cat.currentPercent}%
                    </div>
                  </div>

                  {/* Spent vs Cap Progress Bar */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          cat.isOverBudget ? 'bg-red-600' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(100, percentUsed)}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-stone-500 whitespace-nowrap">
                      {percentUsed}% spent
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vendor Payment Ledger & Milestone Tracker */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Vendor Payment Ledger & Milestone Due Dates
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Tracks agreed contract values, advance token deposits, balance due dates, and settlement status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Category */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-white text-stone-700"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {budgetConfigs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-white text-stone-700"
              aria-label="Filter by payment status"
            >
              <option value="all">All Statuses</option>
              <option value="Advance Paid">Advance Paid</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Fully Paid">Fully Paid</option>
              <option value="Pending">Pending</option>
            </select>

            <button
              onClick={() => {
                setEditingExpense(null);
                setFormVendor('');
                setFormCategory(budgetConfigs[0]?.id || 'venue');
                setFormAgreed('');
                setFormPaid('');
                setFormDueDate('');
                setFormNotes('');
                setIsAddExpenseOpen(true);
              }}
              className="flex items-center gap-1.5 bg-[#800020] hover:bg-[#66001A] text-amber-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Vendor Bill</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-semibold bg-stone-50/70">
                <th className="py-3 px-3">Vendor / Service</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Total Agreed</th>
                <th className="py-3 px-3 text-right">Advance Paid</th>
                <th className="py-3 px-3 text-right">Remaining Balance</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    No vendor payment records found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const balance = Math.max(0, exp.totalAgreed - exp.depositPaid);
                  const isSettled = balance === 0 && exp.totalAgreed > 0;

                  return (
                    <tr key={exp.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-stone-900">{exp.vendorName}</div>
                        {exp.notes && (
                          <div className="text-[11px] text-stone-500 truncate max-w-xs">{exp.notes}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                          {budgetConfigs.find((c) => c.id === exp.category)?.name || exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-stone-900">
                        {formatINR(exp.totalAgreed)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold text-emerald-700">
                        {formatINR(exp.depositPaid)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-amber-900">
                        {formatINR(balance)}
                      </td>
                      <td className="py-3.5 px-3 text-stone-600 font-medium whitespace-nowrap">
                        {exp.dueDate || 'Upon Pheras'}
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isSettled
                              ? 'bg-emerald-100 text-emerald-800'
                              : exp.status === 'Due Soon'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isSettled ? 'Fully Paid' : exp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {!isSettled && (
                            <button
                              onClick={() => handleQuickAddPayment(exp)}
                              title="Add Payment Installment"
                              className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-[11px] border border-amber-200 cursor-pointer"
                            >
                              + Pay
                            </button>
                          )}
                          <button
                            onClick={() => handleStartEdit(exp)}
                            title="Edit Record"
                            className="p-1 rounded text-stone-500 hover:text-stone-800 hover:bg-stone-100 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteExpense(exp.id)}
                            title="Delete Record"
                            className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filteredExpenses.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-stone-200 bg-stone-50 font-bold text-stone-900">
                  <td className="py-3 px-3">Total Subtotal</td>
                  <td className="py-3 px-3"></td>
                  <td className="py-3 px-3 text-right">
                    {formatINR(filteredExpenses.reduce((s, i) => s + (i.totalAgreed || 0), 0))}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-700">
                    {formatINR(filteredExpenses.reduce((s, i) => s + (i.depositPaid || 0), 0))}
                  </td>
                  <td className="py-3 px-3 text-right text-amber-900">
                    {formatINR(
                      filteredExpenses.reduce(
                        (s, i) => s + Math.max(0, (i.totalAgreed || 0) - (i.depositPaid || 0)),
                        0
                      )
                    )}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingExpense ? 'Edit Vendor Contract' : 'Record New Vendor Bill'}
              </h3>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Vendor / Firm Name</label>
                <input
                  type="text"
                  required
                  value={formVendor}
                  onChange={(e) => setFormVendor(e.target.value)}
                  placeholder="e.g., Shahi Dawat Royal Caterers"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 bg-white"
                  >
                    {budgetConfigs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Total Contract Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formAgreed}
                    onChange={(e) => setFormAgreed(e.target.value)}
                    placeholder="1200000"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Advance / Deposit Paid (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formPaid}
                    onChange={(e) => setFormPaid(e.target.value)}
                    placeholder="400000"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Deliverables & Milestone Notes
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g., 50% advance upon contract signing, remaining 50% post-Vidai"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#800020] hover:bg-[#66001A] text-amber-200 font-bold shadow-md cursor-pointer"
                >
                  {editingExpense ? 'Save Changes' : 'Record Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
