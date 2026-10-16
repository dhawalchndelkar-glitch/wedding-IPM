/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Briefcase,
  Star,
  CheckCircle,
  Phone,
  FileText,
  AlertCircle,
  Plus,
  CheckSquare,
  Square,
  Sparkles,
  Camera,
  Utensils,
  Music,
} from 'lucide-react';
import {
  VendorCategoryComparison,
  VendorCandidate,
  ContractChecklistItem,
} from '../types/wedding.ts';
import { formatINR } from '../utils/weddingCalculations.ts';

interface VendorHubProps {
  categories: VendorCategoryComparison[];
  onSelectWinningVendor: (categoryId: string, candidateId: string) => void;
  contractChecklist: ContractChecklistItem[];
  onToggleContractItem: (id: string) => void;
  onUpdateContractNotes: (id: string, notes: string) => void;
}

export const VendorHub: React.FC<VendorHubProps> = ({
  categories,
  onSelectWinningVendor,
  contractChecklist,
  onToggleContractItem,
  onUpdateContractNotes,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || 'vc-photo');
  const [activeTab, setActiveTab] = useState<'matrix' | 'contract'>('matrix');

  const currentCategory =
    categories.find((c) => c.id === selectedCatId) || categories[0];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera':
        return <Camera className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4" />;
      case 'Music':
        return <Music className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  const criticalPendingCount = contractChecklist.filter(
    (item) => item.importance === 'Critical' && !item.isChecked
  ).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Pillar 4 • Vendor Management & Comparison Matrix
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Side-by-Side Scorecards & Fine Print Checklist
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl">
              Compare 3-4 shortlisted vendors per category on quote, rating, and inclusions, backed by essential contract negotiation questions (DJ cutoff, DG backup, overtime rates).
            </p>
          </div>

          {/* Toggle View */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Comparison Scorecards
            </button>
            <button
              onClick={() => setActiveTab('contract')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'contract'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Contract Fine Print</span>
              {criticalPendingCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {criticalPendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Switcher */}
        {activeTab === 'matrix' && (
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 border-t border-amber-100 pt-4 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCatId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    isSelected
                      ? 'bg-[#800020] text-amber-200 border-[#800020] shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-amber-50 border-stone-200'
                  }`}
                >
                  {getCategoryIcon(cat.iconName)}
                  <span>{cat.categoryName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* View 1: Comparison Matrix */}
      {activeTab === 'matrix' && currentCategory && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {currentCategory.categoryName} Evaluation
              </h3>
              <p className="text-xs text-stone-500">
                Target Category Budget Cap:{' '}
                <strong className="text-stone-800">{formatINR(currentCategory.budgetCapTarget)}</strong>
              </p>
            </div>
            <div className="text-xs text-stone-500">
              Showing {currentCategory.candidates.length} vetted candidates
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategory.candidates.map((candidate) => {
              const isHired = candidate.status === 'Selected / Hired';
              const isUnderCap = candidate.quoteAmount <= currentCategory.budgetCapTarget;

              return (
                <div
                  key={candidate.id}
                  className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm ${
                    isHired
                      ? 'bg-gradient-to-b from-amber-50/60 to-white border-amber-500 ring-2 ring-amber-400/50 shadow-md'
                      : 'bg-white border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="p-5 border-b border-stone-100 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isHired
                              ? 'bg-emerald-600 text-white'
                              : candidate.status === 'Shortlisted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {candidate.status}
                        </span>

                        <div className="flex items-center gap-1 bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded-md text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{candidate.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <h4 className="font-serif text-lg font-bold text-stone-900">
                        {candidate.name}
                      </h4>

                      <div className="pt-2 flex items-baseline justify-between">
                        <div>
                          <div className="text-[10px] text-stone-400 font-semibold uppercase">
                            Quoted Price
                          </div>
                          <div className="text-xl font-extrabold text-[#800020]">
                            {formatINR(candidate.quoteAmount)}
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              isUnderCap
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {isUnderCap
                              ? `Within Cap (-${formatINR(
                                  currentCategory.budgetCapTarget - candidate.quoteAmount
                                )})`
                              : `Exceeds Cap (+${formatINR(
                                  candidate.quoteAmount - currentCategory.budgetCapTarget
                                )})`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="p-5 space-y-4 text-xs">
                      <div>
                        <div className="font-bold text-stone-800 mb-2 uppercase text-[10px] tracking-wider">
                          Package Inclusions & Deliverables:
                        </div>
                        <ul className="space-y-1.5 text-stone-600">
                          {candidate.deliverables.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pros & Cons */}
                      <div className="space-y-2 pt-2 border-t border-stone-100">
                        <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                          <span className="font-bold text-emerald-900 text-[11px]">Advantage: </span>
                          <span className="text-emerald-800 text-[11px]">{candidate.pros}</span>
                        </div>

                        {candidate.cons && (
                          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                            <span className="font-bold text-stone-700 text-[11px]">Keep in Mind: </span>
                            <span className="text-stone-600 text-[11px]">{candidate.cons}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer & Action */}
                  <div className="p-5 bg-stone-50/70 border-t border-stone-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <span className="font-medium text-stone-800">{candidate.contactPerson}</span>
                      <a
                        href={`tel:${candidate.phone}`}
                        className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </div>

                    <button
                      onClick={() => onSelectWinningVendor(currentCategory.id, candidate.id)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                        isHired
                          ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                          : 'bg-[#800020] text-amber-200 hover:bg-[#66001A]'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isHired ? 'Selected Vendor (Confirmed)' : 'Hire / Lock This Vendor'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Contract Checklist */}
      {activeTab === 'contract' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Critical Negotiation & Fine Print Checklist
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Protect your wedding from sudden blackout penalties, police sound curfews, or exorbitant overtime charges.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {contractChecklist.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.isChecked
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : item.importance === 'Critical'
                    ? 'bg-amber-50/30 border-amber-200'
                    : 'bg-stone-50/50 border-stone-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleContractItem(item.id)}
                    className="mt-0.5 text-stone-400 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
                  >
                    {item.isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-300" />
                    )}
                  </button>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4
                        className={`text-sm font-bold ${
                          item.isChecked ? 'line-through text-stone-400' : 'text-stone-900'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                          item.importance === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {item.importance}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">{item.details}</p>

                    {/* Saved Notes Field */}
                    <div className="pt-2">
                      <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                        Contract Clause Agreement / Vendor Notes:
                      </label>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => onUpdateContractNotes(item.id, e.target.value)}
                        placeholder="Write down vendor response or clause agreement..."
                        className="w-full text-xs border border-stone-300 rounded-lg px-3 py-1.5 bg-white text-stone-800 focus:border-amber-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
