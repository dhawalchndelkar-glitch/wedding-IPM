/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Phone,
  MessageCircle,
  Plus,
  CheckSquare,
  Square,
  Trash2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { EmergencyKitItem, KeyContact, CeremonyEvent } from '../types/wedding.ts';
import { calculateChecklistProgress } from '../utils/weddingCalculations.ts';

interface DayOfCommandHubProps {
  emergencyKit: EmergencyKitItem[];
  onToggleEmergencyItem: (id: string) => void;
  onAddEmergencyItem: (item: Omit<EmergencyKitItem, 'id'>) => void;
  onDeleteEmergencyItem: (id: string) => void;
  contacts: KeyContact[];
  onAddContact: (contact: Omit<KeyContact, 'id'>) => void;
  onDeleteContact: (id: string) => void;
  weddingCeremony: CeremonyEvent | undefined;
}

export const DayOfCommandHub: React.FC<DayOfCommandHubProps> = ({
  emergencyKit,
  onToggleEmergencyItem,
  onAddEmergencyItem,
  onDeleteEmergencyItem,
  contacts,
  onAddContact,
  onDeleteContact,
  weddingCeremony,
}) => {
  const [selectedKitCategory, setSelectedKitCategory] = useState<string>('all');
  const [isAddKitOpen, setIsAddKitOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  // New kit item form
  const [formKitTitle, setFormKitTitle] = useState('');
  const [formKitCategory, setFormKitCategory] = useState<EmergencyKitItem['category']>('Wardrobe & Fixes');
  const [formKitPackedBy, setFormKitPackedBy] = useState('');
  const [formKitNotes, setFormKitNotes] = useState('');

  // New contact form
  const [formContactRole, setFormContactRole] = useState('');
  const [formContactName, setFormContactName] = useState('');
  const [formContactPhone, setFormContactPhone] = useState('');
  const [formContactResp, setFormContactResp] = useState('');

  // Progress
  const progress = calculateChecklistProgress(
    emergencyKit.map((item) => ({ isPacked: item.isPacked }))
  );

  const filteredKit = emergencyKit.filter((item) => {
    return selectedKitCategory === 'all' || item.category === selectedKitCategory;
  });

  const handleAddKitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEmergencyItem({
      title: formKitTitle,
      category: formKitCategory,
      isPacked: false,
      packedBy: formKitPackedBy || 'Family Member',
      notes: formKitNotes,
    });
    setFormKitTitle('');
    setFormKitPackedBy('');
    setFormKitNotes('');
    setIsAddKitOpen(false);
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddContact({
      role: formContactRole,
      name: formContactName,
      phone: formContactPhone,
      responsibilities: formContactResp,
      isPrimary: false,
    });
    setFormContactRole('');
    setFormContactName('');
    setFormContactPhone('');
    setFormContactResp('');
    setIsAddContactOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Pillar 6 • "Day-of-Wedding" Command Center
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Emergency Bag Checklist & Tap-to-Call Contact Matrix
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl">
              Zero-panic day-of execution. Verify safety pins, extra footwear, emergency cash envelopes, and instantly reach Pandat-ji, Venue GM, or the bridal handlers.
            </p>
          </div>

          {/* Readiness gauge */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 border-2 border-emerald-300 flex items-center justify-center font-bold text-sm">
              {progress.percent}%
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400">Kit Readiness</div>
              <div className="text-xs font-bold text-stone-800">
                {progress.completed} of {progress.total} Packed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Key Contacts Directory (Tap to call) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Key Contacts Matrix (Tap-to-Call)
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Instant one-tap phone calls and direct WhatsApp messaging for critical coordinators.
            </p>
          </div>

          <button
            onClick={() => setIsAddContactOpen(true)}
            className="flex items-center gap-1.5 bg-[#800020] hover:bg-[#66001A] text-amber-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Key Contact</span>
          </button>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => {
            const cleanNumber = contact.phone.replace(/[^0-9]/g, '');

            return (
              <div
                key={contact.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                      {contact.role}
                    </span>
                    <h4 className="font-serif text-base font-bold text-stone-900 mt-1">
                      {contact.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => onDeleteContact(contact.id)}
                    className="text-stone-300 hover:text-red-500 p-1 cursor-pointer"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {contact.responsibilities}
                </p>

                <div className="pt-2 border-t border-stone-200/60 flex items-center gap-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex-1 py-1.5 bg-[#800020] hover:bg-[#66001A] text-amber-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={`https://wa.me/${cleanNumber}?text=Namaste%20${encodeURIComponent(
                      contact.name
                    )},%20regarding%20the%20wedding%20timeline:`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Emergency Bag Interactive Checklist */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Bridal & Groom Emergency Bag Checklist
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Wardrobe fixes, comfort footwear, blister relief, cash envelopes, and touch-up makeup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedKitCategory}
              onChange={(e) => setSelectedKitCategory(e.target.value)}
              className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-white text-stone-700"
              aria-label="Filter emergency kit category"
            >
              <option value="all">All Kit Categories</option>
              <option value="Wardrobe & Fixes">Wardrobe & Fixes</option>
              <option value="Comfort & Footwear">Comfort & Footwear</option>
              <option value="Beauty & Hair">Beauty & Hair</option>
              <option value="Medical & Wellness">Medical & Wellness</option>
              <option value="Rituals & Cash">Rituals & Cash</option>
            </select>

            <button
              onClick={() => setIsAddKitOpen(true)}
              className="flex items-center gap-1.5 bg-[#800020] hover:bg-[#66001A] text-amber-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Kit Item</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
            <span>Overall Emergency Kit Packing Progress</span>
            <span className="font-bold text-stone-900">{progress.percent}% Ready</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            ></div>
          </div>
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredKit.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                item.isPacked
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-stone-50/50 hover:bg-white hover:border-amber-300 border-stone-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleEmergencyItem(item.id)}
                  className="mt-0.5 text-stone-400 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
                >
                  {item.isPacked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-stone-300" />
                  )}
                </button>
                <div>
                  <div
                    className={`text-xs font-bold ${
                      item.isPacked ? 'line-through text-stone-400' : 'text-stone-900'
                    }`}
                  >
                    {item.title}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                    <span className="bg-stone-200/80 px-1.5 py-0.2 rounded font-medium text-stone-700">
                      {item.category}
                    </span>
                    {item.packedBy && <span>Assigned to: {item.packedBy}</span>}
                  </div>
                  {item.notes && (
                    <p className="text-[10px] text-stone-400 italic mt-0.5">{item.notes}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDeleteEmergencyItem(item.id)}
                className="text-stone-300 hover:text-red-500 p-1 cursor-pointer shrink-0"
                title="Delete item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Day-Of Ceremony Snapshot */}
      {weddingCeremony && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Wedding Day Live Timeline Snapshot
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
              {weddingCeremony.venue}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {weddingCeremony.timeline.map((slot) => (
              <div
                key={slot.id}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-start gap-2.5"
              >
                <span className="font-bold text-[#800020] bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0">
                  {slot.time}
                </span>
                <div>
                  <div className="font-semibold text-stone-800">{slot.activity}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Lead: {slot.leadCoordinator}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Emergency Item Modal */}
      {isAddKitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Add Emergency Kit Item
              </h3>
              <button
                onClick={() => setIsAddKitOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddKitSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={formKitTitle}
                  onChange={(e) => setFormKitTitle(e.target.value)}
                  placeholder="e.g. Safety pins assorted sizes"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category</label>
                <select
                  value={formKitCategory}
                  onChange={(e) => setFormKitCategory(e.target.value as any)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 bg-white"
                >
                  <option value="Wardrobe & Fixes">Wardrobe & Fixes</option>
                  <option value="Comfort & Footwear">Comfort & Footwear</option>
                  <option value="Beauty & Hair">Beauty & Hair</option>
                  <option value="Medical & Wellness">Medical & Wellness</option>
                  <option value="Rituals & Cash">Rituals & Cash</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Packed By / Assigned</label>
                <input
                  type="text"
                  value={formKitPackedBy}
                  onChange={(e) => setFormKitPackedBy(e.target.value)}
                  placeholder="e.g. Maid of Honor / Chacha Ji"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Location Notes</label>
                <input
                  type="text"
                  value={formKitNotes}
                  onChange={(e) => setFormKitNotes(e.target.value)}
                  placeholder="e.g. In bridal vanity bag"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddKitOpen(false)}
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

      {/* Add Contact Modal */}
      {isAddContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Add Key Contact
              </h3>
              <button
                onClick={() => setIsAddContactOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddContactSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  value={formContactRole}
                  onChange={(e) => setFormContactRole(e.target.value)}
                  placeholder="e.g. Head Priest (Pandat-ji)"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formContactName}
                  onChange={(e) => setFormContactName(e.target.value)}
                  placeholder="e.g. Pt. Radheshyam Shastri"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formContactPhone}
                  onChange={(e) => setFormContactPhone(e.target.value)}
                  placeholder="+91 98290 12345"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Responsibilities</label>
                <textarea
                  rows={2}
                  value={formContactResp}
                  onChange={(e) => setFormContactResp(e.target.value)}
                  placeholder="e.g. Muhurtham timing, Mandap pooja samagri verification"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddContactOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800020] text-amber-200 font-bold rounded-lg hover:bg-[#66001A]"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
