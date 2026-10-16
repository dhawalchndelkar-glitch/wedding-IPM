/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BudgetCategoryAllocation, ExpenseRecord } from '../utils/weddingCalculations.ts';

export type HubTab = 'budget' | 'events' | 'guests' | 'vendors' | 'fashion' | 'dayOf';

export interface WeddingMeta {
  brideName: string;
  groomName: string;
  weddingDate: string; // YYYY-MM-DD
  cityVenue: string;
  auspiciousTithi: string;
}

export interface BudgetConfig {
  id: string;
  name: string;
  percent: number;
  color: string;
  description: string;
}

export interface ScheduleSlot {
  id: string;
  time: string; // e.g. "04:30 PM"
  activity: string;
  leadCoordinator: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface PoojaSamagriItem {
  id: string;
  name: string;
  hindiName?: string;
  quantity: string;
  isProcured: boolean;
  responsiblePerson: string;
  category: 'Rituals' | 'Garlands & Flowers' | 'Offerings & Prasad' | 'Shagun & Dakshina';
}

export interface CeremonyEvent {
  id: string;
  title: string;
  hindiTitle: string;
  date: string;
  timeRange: string;
  venue: string;
  dressTheme: string;
  description: string;
  timeline: ScheduleSlot[];
  samagriList: PoojaSamagriItem[];
}

export interface GuestRecord {
  id: string;
  name: string;
  side: 'Bride' | 'Groom' | 'Mutual';
  pax: number;
  dietary: 'Pure Veg' | 'Jain' | 'Non-Veg' | 'Vegan / Halal';
  rsvpStatus: 'Confirmed' | 'Pending' | 'Declined';
  isOutstation: boolean;
  assignedRoom?: string;
  needsShuttle: boolean;
  contactNumber: string;
}

export interface RoomAllocation {
  id: string;
  roomNumber: string;
  hotelWing: string;
  capacity: number;
  assignedGuestNames: string[];
  checkInDate: string;
  checkOutDate: string;
}

export interface ShuttleSchedule {
  id: string;
  flightTrainNo: string;
  pickupTime: string;
  location: string;
  driverName: string;
  driverPhone: string;
  guestNames: string[];
  vehicleType: string;
}

export interface VendorCandidate {
  id: string;
  name: string;
  rating: number; // e.g. 4.9
  quoteAmount: number;
  deliverables: string[];
  pros: string;
  cons?: string;
  contactPerson: string;
  phone: string;
  status: 'Shortlisted' | 'Selected / Hired' | 'Backup' | 'Declined';
}

export interface VendorCategoryComparison {
  id: string;
  categoryName: string;
  iconName: string;
  budgetCapTarget: number;
  candidates: VendorCandidate[];
}

export interface ContractChecklistItem {
  id: string;
  title: string;
  importance: 'Critical' | 'Important' | 'Good to Know';
  details: string;
  isChecked: boolean;
  notes: string;
}

export interface OutfitColorRole {
  role: 'Bride' | 'Groom' | 'Bride Family' | 'Groom Family' | 'Friends & Bridesmaids';
  colorName: string;
  hexCode: string;
  attireType: string; // e.g. "Raw Silk Sherwani", "Zardozi Lehenga"
  fabricTips: string;
}

export interface CeremonyPalette {
  ceremonyId: string;
  ceremonyName: string;
  decorBackdropColors: string[];
  backdropClashWarning?: string;
  roles: OutfitColorRole[];
}

export interface WeddingThemePreset {
  id: string;
  name: string;
  subtitle: string;
  accentColor: string;
  vibe: string;
  recommendedFabrics: string;
  primaryPalette: Array<{ name: string; hex: string }>;
}

export interface EmergencyKitItem {
  id: string;
  title: string;
  category: 'Wardrobe & Fixes' | 'Comfort & Footwear' | 'Beauty & Hair' | 'Medical & Wellness' | 'Rituals & Cash';
  isPacked: boolean;
  packedBy?: string;
  notes?: string;
}

export interface KeyContact {
  id: string;
  role: string;
  name: string;
  phone: string;
  whatsappMessage?: string;
  responsibilities: string;
  isPrimary?: boolean;
}
