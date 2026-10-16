/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  Sparkles,
  Printer,
  RotateCcw,
  Wallet,
  Clock,
  Users,
  Briefcase,
  Shirt,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { WeddingMeta, HubTab } from '../types/wedding.ts';
import { formatINRCompact } from '../utils/weddingCalculations.ts';

interface HeaderProps {
  meta: WeddingMeta;
  activeTab: HubTab;
  onTabChange: (tab: HubTab) => void;
  daysRemaining: number;
  totalBudget: number;
  totalCommitted: number;
  totalGuestsConfirmed: number;
  emergencyProgressPercent: number;
  onOpenPrintModal: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  meta,
  activeTab,
  onTabChange,
  daysRemaining,
  totalBudget,
  totalCommitted,
  totalGuestsConfirmed,
  emergencyProgressPercent,
  onOpenPrintModal,
  onResetData,
}) => {
  const tabs: Array<{ id: HubTab; label: string; hindiLabel: string; icon: React.ReactNode; badge?: string }> = [
    {
      id: 'budget',
      label: 'Financial & Budget',
      hindiLabel: 'बजट एवं खर्च',
      icon: <Wallet className="w-4 h-4" />,
      badge: `${Math.round((totalCommitted / (totalBudget || 1)) * 100)}% Spent`,
    },
    {
      id: 'events',
      label: 'Events & Rituals',
      hindiLabel: 'विवाह कार्यक्रम',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'guests',
      label: 'Guests & Logistics',
      hindiLabel: 'अतिथि एवं आवास',
      icon: <Users className="w-4 h-4" />,
      badge: `${totalGuestsConfirmed} Confirmed`,
    },
    {
      id: 'vendors',
      label: 'Vendors & Contracts',
      hindiLabel: 'वेंडर प्रबंधन',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'fashion',
      label: 'Fashion & Palettes',
      hindiLabel: 'पोशाक व रंग',
      icon: <Shirt className="w-4 h-4" />,
    },
    {
      id: 'dayOf',
      label: 'Day-Of Command',
      hindiLabel: 'शुभ दिवस केंद्र',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: `${emergencyProgressPercent}% Ready`,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#4A0011]/95 text-amber-50 backdrop-blur-md border-b border-amber-500/30 shadow-lg no-print transition-all">
      {/* Auspicious top ribbon */}
      <div className="bg-gradient-to-r from-[#38000C] via-[#800020] to-[#38000C] text-amber-200/90 text-xs py-1 px-4 border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-semibold">ॐ श्री गणेशाय नमः</span>
          <span className="hidden sm:inline text-amber-300/40">•</span>
          <span className="hidden sm:inline text-amber-200/80">{meta.auspiciousTithi}</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-amber-100">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[200px] sm:max-w-none">{meta.cityVenue}</span>
          </div>
          <button
            onClick={onResetData}
            title="Reset to default authentic wedding sample plan"
            className="flex items-center gap-1 text-amber-300/70 hover:text-amber-200 transition-colors cursor-pointer text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main branding & summary bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Brand & Couple */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#4A0011] rounded-[10px] flex items-center justify-center text-amber-300">
              <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c-1.5 2-3 4.5-3 7a3 3 0 0 0 6 0c0-2.5-1.5-5-3-7z" fill="#D4AF37" stroke="#D4AF37"/>
                <path d="M5 14c2-1 4.5-1.5 7-1.5s5 .5 7 1.5"/>
                <path d="M4 18c2.5-1.5 5-2 8-2s5.5.5 8 2"/>
                <circle cx="12" cy="18" r="1.5" fill="#D4AF37"/>
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                SHUBH BANDHAN
                <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Suite
                </span>
              </h1>
            </div>
            <p className="text-xs text-amber-200/80 flex items-center gap-2 mt-0.5">
              <span className="font-medium text-amber-100">{meta.brideName}</span>
              <span className="text-amber-400 font-serif">weds</span>
              <span className="font-medium text-amber-100">{meta.groomName}</span>
              <span className="text-amber-300/40">•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" />
                {meta.weddingDate}
              </span>
            </p>
          </div>
        </div>

        {/* Quick HUD Metrics & Print Action */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Days Countdown */}
          <div className="bg-[#66001A]/80 border border-amber-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2.5 shadow-inner">
            <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-300/80 font-medium">Muhurtham</div>
              <div className="text-sm sm:text-base font-bold text-white font-serif">
                {daysRemaining > 0 ? `${daysRemaining} Days` : 'Auspicious Day!'}
              </div>
            </div>
          </div>

          {/* Budget Gauge */}
          <div className="bg-[#66001A]/80 border border-amber-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2.5 shadow-inner">
            <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-300">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-300/80 font-medium">Committed / Budget</div>
              <div className="text-sm sm:text-base font-bold text-white">
                <span className="text-amber-300">{formatINRCompact(totalCommitted)}</span>
                <span className="text-white/60 text-xs"> / {formatINRCompact(totalBudget)}</span>
              </div>
            </div>
          </div>

          {/* Print Master Plan Action */}
          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer ml-auto sm:ml-0"
          >
            <Printer className="w-4 h-4" />
            <span>Master Plan PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 pt-1 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 border-amber-300 font-semibold shadow-md'
                    : 'text-amber-100/80 hover:text-white hover:bg-white/10 border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isActive ? 'bg-stone-900/15 text-stone-900' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
