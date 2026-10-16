/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  Building,
  Utensils,
  Gift,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Car,
  Phone,
  BedDouble,
  Trash2,
} from 'lucide-react';
import { GuestRecord, RoomAllocation, ShuttleSchedule } from '../types/wedding.ts';
import { calculateGuestLogistics } from '../utils/weddingCalculations.ts';

interface GuestHubProps {
  guests: GuestRecord[];
  onAddGuest: (guest: Omit<GuestRecord, 'id'>) => void;
  onUpdateGuest: (guest: GuestRecord) => void;
  onDeleteGuest: (id: string) => void;
  rooms: RoomAllocation[];
  onAddRoom: (room: Omit<RoomAllocation, 'id'>) => void;
  onDeleteRoom: (id: string) => void;
  shuttles: ShuttleSchedule[];
  onAddShuttle: (shuttle: Omit<ShuttleSchedule, 'id'>) => void;
  onDeleteShuttle: (id: string) => void;
}

export const GuestHub: React.FC<GuestHubProps> = ({
  guests,
  onAddGuest,
  onUpdateGuest,
  onDeleteGuest,
  rooms,
  onAddRoom,
  onDeleteRoom,
  shuttles,
  onAddShuttle,
  onDeleteShuttle,
}) => {
  // Calculator inputs
  const [calculatorTotalGuests, setCalculatorTotalGuests] = useState<number>(350);
  const [calculatorOutstationPercent, setCalculatorOutstationPercent] = useState<number>(45);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const [rsvpFilter, setRsvpFilter] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'rsvp' | 'rooms' | 'shuttles'>('rsvp');

  // Modals
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddShuttleOpen, setIsAddShuttleOpen] = useState(false);

  // New guest form
  const [formGuestName, setFormGuestName] = useState('');
  const [formSide, setFormSide] = useState<GuestRecord['side']>('Bride');
  const [formPax, setFormPax] = useState('2');
  const [formDietary, setFormDietary] = useState<GuestRecord['dietary']>('Pure Veg');
  const [formRsvp, setFormRsvp] = useState<GuestRecord['rsvpStatus']>('Confirmed');
  const [formOutstation, setFormOutstation] = useState(true);
  const [formRoom, setFormRoom] = useState('');
  const [formShuttle, setFormShuttle] = useState(false);
  const [formPhone, setFormPhone] = useState('');

  // New room form
  const [formRoomNo, setFormRoomNo] = useState('');
  const [formWing, setFormWing] = useState('');
  const [formCapacity, setFormCapacity] = useState('2');
  const [formRoomGuests, setFormRoomGuests] = useState('');

  // New shuttle form
  const [formFlight, setFormFlight] = useState('');
  const [formPickupTime, setFormPickupTime] = useState('');
  const [formLocation, setFormLocation] = useState('Maharana Pratap Airport (UDR)');
  const [formDriver, setFormDriver] = useState('');
  const [formDriverPhone, setFormDriverPhone] = useState('');
  const [formVehicle, setFormVehicle] = useState('Toyota Innova Crysta');
  const [formShuttleGuests, setFormShuttleGuests] = useState('');

  // Logistics calculations
  const logistics = useMemo(() => {
    return calculateGuestLogistics(calculatorTotalGuests, calculatorOutstationPercent, 2, 10, 5);
  }, [calculatorTotalGuests, calculatorOutstationPercent]);

  // Actual guest aggregates
  const guestStats = useMemo(() => {
    const totalHeadcount = guests.reduce((sum, g) => sum + g.pax, 0);
    const confirmedHeadcount = guests
      .filter((g) => g.rsvpStatus === 'Confirmed')
      .reduce((sum, g) => sum + g.pax, 0);
    const pureVeg = guests
      .filter((g) => g.rsvpStatus === 'Confirmed' && g.dietary === 'Pure Veg')
      .reduce((sum, g) => sum + g.pax, 0);
    const jain = guests
      .filter((g) => g.rsvpStatus === 'Confirmed' && g.dietary === 'Jain')
      .reduce((sum, g) => sum + g.pax, 0);
    const nonVeg = guests
      .filter((g) => g.rsvpStatus === 'Confirmed' && g.dietary === 'Non-Veg')
      .reduce((sum, g) => sum + g.pax, 0);
    const outstation = guests
      .filter((g) => g.isOutstation)
      .reduce((sum, g) => sum + g.pax, 0);

    return {
      totalHeadcount,
      confirmedHeadcount,
      pureVeg,
      jain,
      nonVeg,
      outstation,
    };
  }, [guests]);

  // Filtered guest list
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchQuery =
        !searchQuery ||
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.contactNumber.includes(searchQuery);
      const matchSide = sideFilter === 'all' || g.side === sideFilter;
      const matchRsvp = rsvpFilter === 'all' || g.rsvpStatus === rsvpFilter;
      const matchDiet = dietaryFilter === 'all' || g.dietary === dietaryFilter;

      return matchQuery && matchSide && matchRsvp && matchDiet;
    });
  }, [guests, searchQuery, sideFilter, rsvpFilter, dietaryFilter]);

  const handleToggleRsvp = (guest: GuestRecord) => {
    const nextStatus: Record<GuestRecord['rsvpStatus'], GuestRecord['rsvpStatus']> = {
      Confirmed: 'Pending',
      Pending: 'Declined',
      Declined: 'Confirmed',
    };
    onUpdateGuest({
      ...guest,
      rsvpStatus: nextStatus[guest.rsvpStatus],
    });
  };

  const handleAddGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGuest({
      name: formGuestName,
      side: formSide,
      pax: parseInt(formPax) || 1,
      dietary: formDietary,
      rsvpStatus: formRsvp,
      isOutstation: formOutstation,
      assignedRoom: formRoom || undefined,
      needsShuttle: formShuttle,
      contactNumber: formPhone || '+91 98000 00000',
    });
    setFormGuestName('');
    setFormPhone('');
    setFormRoom('');
    setIsAddGuestOpen(false);
  };

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRoom({
      roomNumber: formRoomNo,
      hotelWing: formWing || 'Main Palace Wing',
      capacity: parseInt(formCapacity) || 2,
      assignedGuestNames: formRoomGuests.split(',').map((s) => s.trim()).filter(Boolean),
      checkInDate: '2026-12-10',
      checkOutDate: '2026-12-13',
    });
    setFormRoomNo('');
    setFormWing('');
    setFormRoomGuests('');
    setIsAddRoomOpen(false);
  };

  const handleAddShuttleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddShuttle({
      flightTrainNo: formFlight,
      pickupTime: formPickupTime,
      location: formLocation,
      driverName: formDriver || 'Assigned Chauffeur',
      driverPhone: formDriverPhone || '+91 94140 00000',
      guestNames: formShuttleGuests.split(',').map((s) => s.trim()).filter(Boolean),
      vehicleType: formVehicle,
    });
    setFormFlight('');
    setFormPickupTime('');
    setFormDriver('');
    setFormDriverPhone('');
    setFormShuttleGuests('');
    setIsAddShuttleOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Pillar 3 • Smart Guest & Accommodation Engine
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Guest Headcount, Safe Catering Buffer & Logistics
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl">
              Calculates hotel room requirements, catering plates (+10% safety buffer against Indian wedding rush), return gifts, dietary splits, and airport shuttles.
            </p>
          </div>
        </div>

        {/* Dynamic Calculator Cards */}
        <div className="mt-6 pt-5 border-t border-amber-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Sliders */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Total Expected Guests (Pax)</span>
                <span className="text-sm font-bold text-[#800020] font-serif">
                  {calculatorTotalGuests} Pax
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={calculatorTotalGuests}
                onChange={(e) => setCalculatorTotalGuests(parseInt(e.target.value) || 0)}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#800020]"
                aria-label="Total expected guests slider"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Outstation Guests Requiring Hotel Stays</span>
                <span className="text-sm font-bold text-amber-800">
                  {calculatorOutstationPercent}% ({logistics.outstationGuestsCount} Guests)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={calculatorOutstationPercent}
                onChange={(e) => setCalculatorOutstationPercent(parseInt(e.target.value) || 0)}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                aria-label="Outstation guests percentage slider"
              />
            </div>
          </div>

          {/* Computed Output Metrics */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs text-center">
              <BedDouble className="w-5 h-5 text-amber-700 mx-auto mb-1" />
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Hotel Rooms Needed
              </div>
              <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
                {logistics.hotelRoomsNeeded}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Based on 2 guests / room</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs text-center">
              <Utensils className="w-5 h-5 text-emerald-700 mx-auto mb-1" />
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Catering Plate Count
              </div>
              <div className="text-2xl font-bold font-serif text-emerald-800 mt-1">
                {logistics.cateringPlateCount}
              </div>
              <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                Includes +10% safety buffer
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs text-center">
              <Gift className="w-5 h-5 text-purple-700 mx-auto mb-1" />
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Return Gift Hampers
              </div>
              <div className="text-2xl font-bold font-serif text-purple-900 mt-1">
                {logistics.returnGiftsCount}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Includes +5% family buffer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Dietary & Headcount Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500">Recorded Headcount</div>
          <div className="text-xl font-bold font-serif text-stone-900 mt-1">
            {guestStats.totalHeadcount} Pax
          </div>
          <div className="text-[10px] text-stone-400">{guests.length} families</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="text-[11px] font-medium text-emerald-700">Confirmed RSVPs</div>
          <div className="text-xl font-bold font-serif text-emerald-800 mt-1">
            {guestStats.confirmedHeadcount} Pax
          </div>
          <div className="text-[10px] text-emerald-600">
            {Math.round((guestStats.confirmedHeadcount / (guestStats.totalHeadcount || 1)) * 100)}% attendance
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-600">Pure Veg</div>
          <div className="text-xl font-bold font-serif text-stone-900 mt-1">
            {guestStats.pureVeg} Pax
          </div>
          <div className="text-[10px] text-stone-400">Standard vegetarian</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-amber-700">Jain Veg (No Onion/Garlic)</div>
          <div className="text-xl font-bold font-serif text-amber-900 mt-1">
            {guestStats.jain} Pax
          </div>
          <div className="text-[10px] text-amber-600 font-medium">Dedicated kitchen</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-600">Non-Veg</div>
          <div className="text-xl font-bold font-serif text-stone-900 mt-1">
            {guestStats.nonVeg} Pax
          </div>
          <div className="text-[10px] text-stone-400">Cocktail & Sangeet</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-blue-700">Outstation Guests</div>
          <div className="text-xl font-bold font-serif text-blue-900 mt-1">
            {guestStats.outstation} Pax
          </div>
          <div className="text-[10px] text-blue-600 font-medium">Require lodging</div>
        </div>
      </div>

      {/* Sub-Tabs: RSVP List vs Hotel Room Allocations vs Shuttles */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('rsvp')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'rsvp'
                  ? 'bg-[#800020] text-amber-100 shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Guest & RSVP Directory ({guests.length})
            </button>
            <button
              onClick={() => setActiveSubTab('rooms')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'rooms'
                  ? 'bg-[#800020] text-amber-100 shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Room Allocations ({rooms.length})
            </button>
            <button
              onClick={() => setActiveSubTab('shuttles')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'shuttles'
                  ? 'bg-[#800020] text-amber-100 shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Airport & Shuttles ({shuttles.length})
            </button>
          </div>

          <div>
            {activeSubTab === 'rsvp' && (
              <button
                onClick={() => setIsAddGuestOpen(true)}
                className="flex items-center gap-1.5 bg-[#800020] hover:bg-[#66001A] text-amber-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Guest Family</span>
              </button>
            )}
            {activeSubTab === 'rooms' && (
              <button
                onClick={() => setIsAddRoomOpen(true)}
                className="flex items-center gap-1.5 bg-[#800020] hover:bg-[#66001A] text-amber-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Hotel Room</span>
              </button>
            )}
            {activeSubTab === 'shuttles' && (
              <button
                onClick={() => setIsAddShuttleOpen(true)}
                className="flex items-center gap-1.5 bg-[#800020] hover:bg-[#66001A] text-amber-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Shuttle</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tab 1: RSVP List */}
        {activeSubTab === 'rsvp' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search family name or mobile..."
                  className="w-full text-xs pl-9 pr-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <select
                value={sideFilter}
                onChange={(e) => setSideFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-3 py-2 bg-white"
                aria-label="Filter by family side"
              >
                <option value="all">All Sides (Bride & Groom)</option>
                <option value="Bride">Bride's Family & Friends</option>
                <option value="Groom">Groom's Family & Friends</option>
                <option value="Mutual">Mutual</option>
              </select>

              <select
                value={rsvpFilter}
                onChange={(e) => setRsvpFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-3 py-2 bg-white"
                aria-label="Filter by RSVP status"
              >
                <option value="all">All RSVP Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Declined">Declined</option>
              </select>

              <select
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-3 py-2 bg-white"
                aria-label="Filter by dietary preference"
              >
                <option value="all">All Dietary Preferences</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Jain">Jain (No Onion/Garlic)</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Vegan / Halal">Vegan / Halal</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-semibold bg-stone-50/70">
                    <th className="py-3 px-3">Guest / Family Unit</th>
                    <th className="py-3 px-3">Side</th>
                    <th className="py-3 px-3 text-center">Pax</th>
                    <th className="py-3 px-3">Dietary</th>
                    <th className="py-3 px-3">Room / Stay</th>
                    <th className="py-3 px-3 text-center">Airport Shuttle</th>
                    <th className="py-3 px-3 text-center">RSVP Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-stone-400">
                        No guests match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-stone-900">{guest.name}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{guest.contactNumber}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              guest.side === 'Bride'
                                ? 'bg-pink-100 text-pink-800'
                                : guest.side === 'Groom'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {guest.side}'s Side
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-stone-900">
                          {guest.pax}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                              guest.dietary === 'Jain'
                                ? 'bg-amber-100 text-amber-900 font-bold'
                                : guest.dietary === 'Pure Veg'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {guest.dietary}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          {guest.assignedRoom ? (
                            <span className="text-[11px] font-medium text-stone-800 flex items-center gap-1">
                              <Building className="w-3 h-3 text-amber-700" />
                              {guest.assignedRoom}
                            </span>
                          ) : guest.isOutstation ? (
                            <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                              Needs Room
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400">Local / Own Stay</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {guest.needsShuttle ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                              <Car className="w-3 h-3" />
                              Required
                            </span>
                          ) : (
                            <span className="text-stone-300">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => handleToggleRsvp(guest)}
                            title="Click to cycle status: Confirmed -> Pending -> Declined"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                              guest.rsvpStatus === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : guest.rsvpStatus === 'Pending'
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {guest.rsvpStatus === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                            {guest.rsvpStatus === 'Pending' && <Clock className="w-3 h-3" />}
                            {guest.rsvpStatus === 'Declined' && <XCircle className="w-3 h-3" />}
                            <span>{guest.rsvpStatus}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => onDeleteGuest(guest.id)}
                            className="text-stone-300 hover:text-red-500 p-1 cursor-pointer"
                            title="Remove Guest"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sub-Tab 2: Room Allocations */}
        {activeSubTab === 'rooms' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-amber-800" />
                      <h4 className="font-bold text-sm text-stone-900">{room.roomNumber}</h4>
                      <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                        {room.hotelWing}
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteRoom(room.id)}
                      className="text-stone-300 hover:text-red-500 p-1 cursor-pointer"
                      title="Delete Room"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-stone-600">
                    <div className="font-semibold text-stone-700 mb-1">
                      Assigned Guests ({room.assignedGuestNames.length}/{room.capacity}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {room.assignedGuestNames.map((name, i) => (
                        <span
                          key={i}
                          className="bg-white border border-stone-200 px-2 py-0.5 rounded text-[11px] font-medium text-stone-800"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-stone-400 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span>Check-in: {room.checkInDate}</span>
                    <span>Check-out: {room.checkOutDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-Tab 3: Airport & Train Shuttles */}
        {activeSubTab === 'shuttles' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shuttles.map((shuttle) => (
                <div
                  key={shuttle.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-700" />
                      <h4 className="font-bold text-sm text-stone-900">{shuttle.flightTrainNo}</h4>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {shuttle.vehicleType}
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Pickup Time:</span>
                      <strong className="text-stone-800">{shuttle.pickupTime}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Hub:</span>
                      <span className="font-medium text-stone-700">{shuttle.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Chauffeur:</span>
                      <a
                        href={`tel:${shuttle.driverPhone}`}
                        className="text-amber-800 font-bold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {shuttle.driverName} ({shuttle.driverPhone})
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-xs">
                    <div className="text-[10px] font-semibold text-stone-400 uppercase mb-1">
                      Passengers Onboard
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {shuttle.guestNames.map((g, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-stone-200 text-stone-800 text-[10px] px-2 py-0.5 rounded"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Guest Modal */}
      {isAddGuestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Add Guest Family Group</h3>
              <button
                onClick={() => setIsAddGuestOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGuestSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Guest / Family Name</label>
                <input
                  type="text"
                  required
                  value={formGuestName}
                  onChange={(e) => setFormGuestName(e.target.value)}
                  placeholder="e.g. Ramesh & Sunita Gupta"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Side</label>
                  <select
                    value={formSide}
                    onChange={(e) => setFormSide(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 bg-white"
                  >
                    <option value="Bride">Bride's Side</option>
                    <option value="Groom">Groom's Side</option>
                    <option value="Mutual">Mutual</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Headcount (Pax)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formPax}
                    onChange={(e) => setFormPax(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dietary</label>
                  <select
                    value={formDietary}
                    onChange={(e) => setFormDietary(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 bg-white"
                  >
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Jain">Jain (No Onion/Garlic)</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Vegan / Halal">Vegan / Halal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">RSVP Status</label>
                  <select
                    value={formRsvp}
                    onChange={(e) => setFormRsvp(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900 bg-white"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Mobile / WhatsApp</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+91 98200 12345"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formOutstation}
                    onChange={(e) => setFormOutstation(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Outstation Guest</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formShuttle}
                    onChange={(e) => setFormShuttle(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Airport Pickup Needed</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddGuestOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800020] text-amber-200 font-bold rounded-lg hover:bg-[#66001A]"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Assign Hotel Room</h3>
              <button
                onClick={() => setIsAddRoomOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRoomSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Room Number / Villa</label>
                <input
                  type="text"
                  required
                  value={formRoomNo}
                  onChange={(e) => setFormRoomNo(e.target.value)}
                  placeholder="e.g. Suite 305"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Hotel Wing</label>
                  <input
                    type="text"
                    value={formWing}
                    onChange={(e) => setFormWing(e.target.value)}
                    placeholder="e.g. West Lake Pavilion"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bed Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Assigned Guests (comma-separated)
                </label>
                <textarea
                  rows={2}
                  value={formRoomGuests}
                  onChange={(e) => setFormRoomGuests(e.target.value)}
                  placeholder="e.g. Rahul Sharma, Priya Sharma"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800020] text-amber-200 font-bold rounded-lg hover:bg-[#66001A]"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Shuttle Modal */}
      {isAddShuttleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Schedule Shuttle</h3>
              <button
                onClick={() => setIsAddShuttleOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddShuttleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Flight / Train No</label>
                <input
                  type="text"
                  required
                  value={formFlight}
                  onChange={(e) => setFormFlight(e.target.value)}
                  placeholder="e.g. IndiGo 6E-554 (DEL to UDR)"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Pickup Time</label>
                  <input
                    type="text"
                    required
                    value={formPickupTime}
                    onChange={(e) => setFormPickupTime(e.target.value)}
                    placeholder="e.g. 03:45 PM, Dec 11"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    placeholder="e.g. Toyota Innova / Urbania"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={formDriver}
                    onChange={(e) => setFormDriver(e.target.value)}
                    placeholder="Driver Name"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={formDriverPhone}
                    onChange={(e) => setFormDriverPhone(e.target.value)}
                    placeholder="+91 94140 12345"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Guest Passengers (comma-separated)
                </label>
                <textarea
                  rows={2}
                  value={formShuttleGuests}
                  onChange={(e) => setFormShuttleGuests(e.target.value)}
                  placeholder="e.g. Verma Family (3 pax), Ananya's cousins"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddShuttleOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800020] text-amber-200 font-bold rounded-lg hover:bg-[#66001A]"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
