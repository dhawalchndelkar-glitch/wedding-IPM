/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Shirt,
  Flame,
  CheckSquare,
  Square,
} from 'lucide-react';
import { CeremonyEvent, ScheduleSlot, PoojaSamagriItem } from '../types/wedding.ts';
import { calculateChecklistProgress } from '../utils/weddingCalculations.ts';

interface EventHubProps {
  ceremonies: CeremonyEvent[];
  onUpdateCeremony: (ceremony: CeremonyEvent) => void;
}

export const EventHub: React.FC<EventHubProps> = ({ ceremonies, onUpdateCeremony }) => {
  const [selectedCeremonyId, setSelectedCeremonyId] = useState<string>(
    ceremonies[0]?.id || 'haldi'
  );
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [isAddSamagriOpen, setIsAddSamagriOpen] = useState(false);
  const [isSamagriExpanded, setIsSamagriExpanded] = useState(true);

  // Slot form
  const [slotTime, setSlotTime] = useState('');
  const [slotActivity, setSlotActivity] = useState('');
  const [slotLead, setSlotLead] = useState('');
  const [slotNotes, setSlotNotes] = useState('');

  // Samagri form
  const [samagriName, setSamagriName] = useState('');
  const [samagriHindi, setSamagriHindi] = useState('');
  const [samagriQty, setSamagriQty] = useState('');
  const [samagriResponsible, setSamagriResponsible] = useState('');
  const [samagriCategory, setSamagriCategory] = useState<PoojaSamagriItem['category']>('Rituals');

  const currentCeremony = ceremonies.find((c) => c.id === selectedCeremonyId) || ceremonies[0];

  // Progress calculations
  const scheduleProgress = calculateChecklistProgress(
    currentCeremony?.timeline.map((t) => ({ isCompleted: t.isCompleted })) || []
  );

  const samagriProgress = calculateChecklistProgress(
    currentCeremony?.samagriList.map((s) => ({ isCompleted: s.isProcured })) || []
  );

  // Toggle slot completion
  const handleToggleSlot = (slotId: string) => {
    if (!currentCeremony) return;
    const updatedTimeline = currentCeremony.timeline.map((slot) =>
      slot.id === slotId ? { ...slot, isCompleted: !slot.isCompleted } : slot
    );
    onUpdateCeremony({ ...currentCeremony, timeline: updatedTimeline });
  };

  // Delete slot
  const handleDeleteSlot = (slotId: string) => {
    if (!currentCeremony) return;
    const updatedTimeline = currentCeremony.timeline.filter((s) => s.id !== slotId);
    onUpdateCeremony({ ...currentCeremony, timeline: updatedTimeline });
  };

  // Add slot
  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCeremony) return;
    const newSlot: ScheduleSlot = {
      id: `slot-${Date.now()}`,
      time: slotTime || '12:00 PM',
      activity: slotActivity,
      leadCoordinator: slotLead || 'Coordinator',
      notes: slotNotes,
      isCompleted: false,
    };
    onUpdateCeremony({
      ...currentCeremony,
      timeline: [...currentCeremony.timeline, newSlot],
    });
    setSlotTime('');
    setSlotActivity('');
    setSlotLead('');
    setSlotNotes('');
    setIsAddSlotOpen(false);
  };

  // Toggle samagri procured
  const handleToggleSamagri = (samagriId: string) => {
    if (!currentCeremony) return;
    const updatedSamagri = currentCeremony.samagriList.map((item) =>
      item.id === samagriId ? { ...item, isProcured: !item.isProcured } : item
    );
    onUpdateCeremony({ ...currentCeremony, samagriList: updatedSamagri });
  };

  // Delete samagri
  const handleDeleteSamagri = (samagriId: string) => {
    if (!currentCeremony) return;
    const updatedSamagri = currentCeremony.samagriList.filter((s) => s.id !== samagriId);
    onUpdateCeremony({ ...currentCeremony, samagriList: updatedSamagri });
  };

  // Add samagri
  const handleAddSamagri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCeremony) return;
    const newItem: PoojaSamagriItem = {
      id: `samagri-${Date.now()}`,
      name: samagriName,
      hindiName: samagriHindi || undefined,
      quantity: samagriQty || '1 Unit',
      isProcured: false,
      responsiblePerson: samagriResponsible || 'Pandat-ji / Family',
      category: samagriCategory,
    };
    onUpdateCeremony({
      ...currentCeremony,
      samagriList: [...currentCeremony.samagriList, newItem],
    });
    setSamagriName('');
    setSamagriHindi('');
    setSamagriQty('');
    setSamagriResponsible('');
    setIsAddSamagriOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Pillar 2 • Multi-Day Event & Ritual Planner
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Ceremony Timelines & Pooja Samagri Guides
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl">
              Precision time-slotted run-sheets for Haldi, Mehendi, Sangeet, Muhurtham/Pheras, and Reception, backed by authentic Vedic ritual item checklists.
            </p>
          </div>
        </div>

        {/* Ceremony Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 border-b border-amber-200/60 no-scrollbar">
          {ceremonies.map((ceremony) => {
            const isSelected = selectedCeremonyId === ceremony.id;
            return (
              <button
                key={ceremony.id}
                onClick={() => setSelectedCeremonyId(ceremony.id)}
                className={`flex flex-col items-start px-4 py-2.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#800020] text-amber-100 border-[#800020] shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-amber-50 border-stone-200'
                }`}
              >
                <div className="text-xs font-bold font-serif">{ceremony.title}</div>
                <div
                  className={`text-[10px] font-medium ${
                    isSelected ? 'text-amber-300' : 'text-stone-500'
                  }`}
                >
                  {ceremony.hindiTitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {currentCeremony && (
        <div className="space-y-6">
          {/* Ceremony Quick Meta Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                    {currentCeremony.title}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-serif">
                    {currentCeremony.hindiTitle}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                  {currentCeremony.description}
                </p>
              </div>

              {/* Progress Gauges */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[11px] text-stone-500 font-medium">Timeline Execution</div>
                  <div className="text-sm font-bold text-stone-900">
                    {scheduleProgress.completed}/{scheduleProgress.total} Done ({scheduleProgress.percent}%)
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-stone-100 flex items-center justify-center font-bold text-xs text-amber-800 bg-amber-50">
                  {scheduleProgress.percent}%
                </div>
              </div>
            </div>

            {/* Event Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="flex items-center gap-2.5 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400">Date & Timing</div>
                  <div className="font-semibold text-stone-800">
                    {currentCeremony.date} • {currentCeremony.timeRange}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400">Venue Pavilion</div>
                  <div className="font-semibold text-stone-800">{currentCeremony.venue}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <Shirt className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400">Dress Code Theme</div>
                  <div className="font-semibold text-stone-800">{currentCeremony.dressTheme}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Schedule Builder */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  Chronological Run-Sheet & Schedule
                </h4>
                <p className="text-xs text-stone-500">
                  Assign leads to critical transitions: Baraat, Jaimala, Pheras, and Vidai
                </p>
              </div>

              <button
                onClick={() => setIsAddSlotOpen(true)}
                className="flex items-center gap-1.5 bg-[#800020] hover:bg-[#66001A] text-amber-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Time Slot</span>
              </button>
            </div>

            {/* Timeline Items List */}
            <div className="space-y-3">
              {currentCeremony.timeline.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No schedule slots added for this ceremony yet.
                </div>
              ) : (
                currentCeremony.timeline.map((slot, idx) => (
                  <div
                    key={slot.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      slot.isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-stone-50/50 hover:bg-white hover:border-amber-300 border-stone-200'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleSlot(slot.id)}
                      className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                      title={slot.isCompleted ? 'Mark Pending' : 'Mark Completed'}
                    >
                      {slot.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300" />
                      )}
                    </button>

                    {/* Time Badge */}
                    <div className="min-w-[85px] shrink-0 font-bold text-xs text-[#800020] bg-amber-100/70 border border-amber-200/80 px-2.5 py-1 rounded-lg text-center">
                      {slot.time}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div
                          className={`text-sm font-semibold ${
                            slot.isCompleted
                              ? 'line-through text-stone-400'
                              : 'text-stone-900'
                          }`}
                        >
                          {slot.activity}
                        </div>
                        <div className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md self-start sm:self-auto">
                          Lead: <strong className="text-stone-800">{slot.leadCoordinator}</strong>
                        </div>
                      </div>
                      {slot.notes && (
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                          {slot.notes}
                        </p>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="text-stone-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer shrink-0"
                      title="Remove Slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Collapsible Cultural Ritual & Pooja Samagri Guide */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div
              onClick={() => setIsSamagriExpanded(!isSamagriExpanded)}
              className="p-6 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/40 border-b border-stone-200 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    Vedic Pooja Samagri & Cultural Ritual Guide
                    <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      {samagriProgress.completed}/{samagriProgress.total} Procured
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Essential holy items, garlands, havan ingredients, and shagun tokens for {currentCeremony.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddSamagriOpen(true);
                  }}
                  className="hidden sm:flex items-center gap-1 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Samagri Item</span>
                </button>
                {isSamagriExpanded ? (
                  <ChevronUp className="w-5 h-5 text-stone-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-400" />
                )}
              </div>
            </div>

            {isSamagriExpanded && (
              <div className="p-6 space-y-4">
                <div className="sm:hidden flex justify-end">
                  <button
                    onClick={() => setIsAddSamagriOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Samagri</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentCeremony.samagriList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                        item.isProcured
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-stone-50/50 hover:bg-amber-50/30 border-stone-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleSamagri(item.id)}
                          className="mt-0.5 text-stone-400 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
                        >
                          {item.isProcured ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-300" />
                          )}
                        </button>
                        <div>
                          <div
                            className={`text-xs font-bold ${
                              item.isProcured ? 'line-through text-stone-400' : 'text-stone-900'
                            }`}
                          >
                            {item.name}
                          </div>
                          {item.hindiName && (
                            <div className="text-[11px] text-amber-800 font-medium">
                              {item.hindiName}
                            </div>
                          )}
                          <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-2">
                            <span className="font-semibold text-stone-700">{item.quantity}</span>
                            <span>•</span>
                            <span>Resp: {item.responsiblePerson}</span>
                            <span>•</span>
                            <span className="bg-stone-200/70 text-stone-700 px-1.5 py-0.2 rounded text-[9px]">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteSamagri(item.id)}
                        className="text-stone-300 hover:text-red-500 p-1 cursor-pointer"
                        title="Delete Samagri"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Add Timeline Time Slot
              </h3>
              <button
                onClick={() => setIsAddSlotOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Time (e.g. 05:30 PM)</label>
                <input
                  type="text"
                  required
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  placeholder="05:30 PM"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Ritual / Activity Name</label>
                <input
                  type="text"
                  required
                  value={slotActivity}
                  onChange={(e) => setSlotActivity(e.target.value)}
                  placeholder="e.g. Royal Baraat Procession & Dhol"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Lead Coordinator</label>
                <input
                  type="text"
                  value={slotLead}
                  onChange={(e) => setSlotLead(e.target.value)}
                  placeholder="e.g. Groom Brother & Dhol Lead"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Execution Notes</label>
                <textarea
                  rows={2}
                  value={slotNotes}
                  onChange={(e) => setSlotNotes(e.target.value)}
                  placeholder="Special instructions, cold firework trigger, stage cue"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800020] text-amber-200 font-bold rounded-lg hover:bg-[#66001A]"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Samagri Modal */}
      {isAddSamagriOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Add Pooja Samagri Item
              </h3>
              <button
                onClick={() => setIsAddSamagriOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSamagri} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Item Name (English)</label>
                <input
                  type="text"
                  required
                  value={samagriName}
                  onChange={(e) => setSamagriName(e.target.value)}
                  placeholder="e.g. Copper Kalash & Mango Leaves"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hindi / Sanskrit Title</label>
                <input
                  type="text"
                  value={samagriHindi}
                  onChange={(e) => setSamagriHindi(e.target.value)}
                  placeholder="e.g. तांबे का कलश व आम के पत्ते"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    value={samagriQty}
                    onChange={(e) => setSamagriQty(e.target.value)}
                    placeholder="e.g. 2 Units / 500g"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={samagriCategory}
                    onChange={(e) => setSamagriCategory(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 bg-white"
                  >
                    <option value="Rituals">Rituals</option>
                    <option value="Garlands & Flowers">Garlands & Flowers</option>
                    <option value="Offerings & Prasad">Offerings & Prasad</option>
                    <option value="Shagun & Dakshina">Shagun & Dakshina</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Responsible Person</label>
                <input
                  type="text"
                  value={samagriResponsible}
                  onChange={(e) => setSamagriResponsible(e.target.value)}
                  placeholder="e.g. Pandat-ji / Chachi Ji"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddSamagriOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800020] text-amber-200 font-bold rounded-lg hover:bg-[#66001A]"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
