/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Printer, X, Sparkles, MapPin, Calendar, Phone, CheckCircle2 } from 'lucide-react';
import {
  WeddingMeta,
  CeremonyEvent,
  KeyContact,
  GuestRecord,
  RoomAllocation,
  EmergencyKitItem,
} from '../types/wedding.ts';
import {
  ExpenseRecord,
  formatINR,
  formatINRCompact,
  calculatePaymentLedgerSummary,
  calculateGuestLogistics,
} from '../utils/weddingCalculations.ts';

interface PrintMasterPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: WeddingMeta;
  totalBudget: number;
  expenses: ExpenseRecord[];
  ceremonies: CeremonyEvent[];
  contacts: KeyContact[];
  guests: GuestRecord[];
  rooms: RoomAllocation[];
  emergencyKit: EmergencyKitItem[];
}

export const PrintMasterPlanModal: React.FC<PrintMasterPlanModalProps> = ({
  isOpen,
  onClose,
  meta,
  totalBudget,
  expenses,
  ceremonies,
  contacts,
  guests,
  rooms,
  emergencyKit,
}) => {
  if (!isOpen) return null;

  const ledgerSummary = calculatePaymentLedgerSummary(expenses);
  const confirmedGuests = guests.filter((g) => g.rsvpStatus === 'Confirmed');
  const totalConfirmedPax = confirmedGuests.reduce((s, g) => s + g.pax, 0);
  const weddingCeremony = ceremonies.find((c) => c.id === 'wedding') || ceremonies[0];
  const packedKitCount = emergencyKit.filter((k) => k.isPacked).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 no-print-bg">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 my-auto text-stone-900">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 no-print">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Printable Master Wedding Run-Sheet & Summary Report
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#800020] hover:bg-[#66001A] text-amber-200 px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CONTENT AREA */}
        <div className="space-y-6 print-ready">
          {/* Header */}
          <div className="text-center border-b-2 border-[#800020] pb-5">
            <div className="text-xs uppercase tracking-widest font-serif font-bold text-[#800020]">
              ॐ श्री गणेशाय नमः • शुभ विवाह परिणयोत्सव
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {meta.brideName} & {meta.groomName}
            </h1>
            <p className="text-xs text-stone-600 mt-1 flex flex-wrap items-center justify-center gap-2 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                {meta.weddingDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                {meta.cityVenue}
              </span>
              <span>•</span>
              <span className="text-[#800020] font-semibold">{meta.auspiciousTithi}</span>
            </p>
          </div>

          {/* KPI Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="text-stone-400 font-bold uppercase text-[9px]">Total Budget Cap</div>
              <div className="text-base font-extrabold text-[#800020]">
                {formatINR(totalBudget)}
              </div>
              <div className="text-[10px] text-stone-500">
                Spent: {formatINRCompact(ledgerSummary.totalPaid)}
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="text-stone-400 font-bold uppercase text-[9px]">Committed Agreements</div>
              <div className="text-base font-extrabold text-stone-900">
                {formatINR(ledgerSummary.totalAgreed)}
              </div>
              <div className="text-[10px] text-amber-700 font-semibold">
                Pending: {formatINRCompact(ledgerSummary.totalPending)}
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="text-stone-400 font-bold uppercase text-[9px]">Confirmed Guests</div>
              <div className="text-base font-bold font-serif text-emerald-800">
                {totalConfirmedPax} Pax
              </div>
              <div className="text-[10px] text-stone-500">
                {guests.filter((g) => g.dietary === 'Jain').reduce((s, g) => s + g.pax, 0)} Jain
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="text-stone-400 font-bold uppercase text-[9px]">Emergency Kit</div>
              <div className="text-base font-bold font-serif text-stone-900">
                {packedKitCount} / {emergencyKit.length} Packed
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">Ready for Day-Of</div>
            </div>
          </div>

          {/* Day-Of Wedding Timetable */}
          {weddingCeremony && (
            <div className="space-y-2">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#800020] border-b border-stone-200 pb-1">
                Auspicious Wedding Timetable ({weddingCeremony.title})
              </h3>
              <table className="w-full text-xs text-left border border-stone-200 border-collapse">
                <thead className="bg-stone-100 font-semibold text-stone-700">
                  <tr>
                    <th className="p-2 w-28">Time Slot</th>
                    <th className="p-2">Ceremony / Ritual</th>
                    <th className="p-2 w-44">Lead Coordinator</th>
                    <th className="p-2">Special Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {weddingCeremony.timeline.map((slot) => (
                    <tr key={slot.id} className="hover:bg-stone-50">
                      <td className="p-2 font-bold text-[#800020] whitespace-nowrap">{slot.time}</td>
                      <td className="p-2 font-semibold text-stone-800">{slot.activity}</td>
                      <td className="p-2 text-stone-600">{slot.leadCoordinator}</td>
                      <td className="p-2 text-stone-500 italic">{slot.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Key Contacts Matrix */}
          <div className="space-y-2">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#800020] border-b border-stone-200 pb-1">
              Emergency & Day-Of Key Contacts Directory
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {contacts.map((c) => (
                <div key={c.id} className="p-2.5 rounded border border-stone-200 bg-stone-50/50">
                  <div className="font-bold text-stone-900">{c.name}</div>
                  <div className="text-[10px] font-semibold text-amber-800">{c.role}</div>
                  <div className="text-[11px] text-[#800020] font-bold mt-0.5">{c.phone}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Allocation Overview */}
          <div className="space-y-2">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#800020] border-b border-stone-200 pb-1">
              Guest Room Allocations Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {rooms.map((r) => (
                <div key={r.id} className="p-2 rounded border border-stone-200 bg-stone-50/50">
                  <div className="font-bold text-stone-800">{r.roomNumber} ({r.hotelWing})</div>
                  <div className="text-[10px] text-stone-600 truncate">
                    {r.assignedGuestNames.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-3 border-t border-stone-200 text-[10px] text-stone-400">
            Shubh Bandhan Wedding Suite • Generated for {meta.brideName} & {meta.groomName} • All rights reserved
          </div>
        </div>
      </div>
    </div>
  );
};
