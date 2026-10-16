/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { BudgetHub } from './components/BudgetHub.tsx';
import { EventHub } from './components/EventHub.tsx';
import { GuestHub } from './components/GuestHub.tsx';
import { VendorHub } from './components/VendorHub.tsx';
import { FashionHub } from './components/FashionHub.tsx';
import { DayOfCommandHub } from './components/DayOfCommandHub.tsx';
import { PrintMasterPlanModal } from './components/PrintMasterPlanModal.tsx';
import {
  HubTab,
  WeddingMeta,
  BudgetConfig,
  CeremonyEvent,
  GuestRecord,
  RoomAllocation,
  ShuttleSchedule,
  VendorCategoryComparison,
  ContractChecklistItem,
  WeddingThemePreset,
  CeremonyPalette,
  EmergencyKitItem,
  KeyContact,
  OutfitColorRole,
} from './types/wedding.ts';
import {
  ExpenseRecord,
  calculateDaysRemaining,
  calculatePaymentLedgerSummary,
  calculateChecklistProgress,
} from './utils/weddingCalculations.ts';
import {
  INITIAL_WEDDING_META,
  INITIAL_BUDGET_CONFIGS,
  INITIAL_EXPENSES,
  INITIAL_CEREMONIES,
  INITIAL_GUESTS,
  INITIAL_ROOMS,
  INITIAL_SHUTTLES,
  INITIAL_VENDOR_COMPARISONS,
  INITIAL_CONTRACT_CHECKLIST,
  WEDDING_THEME_PRESETS,
  INITIAL_CEREMONY_PALETTES,
  INITIAL_EMERGENCY_KIT,
  INITIAL_KEY_CONTACTS,
} from './data/initialWeddingData.ts';

const STORAGE_KEY = 'shubh_bandhan_wedding_suite_v1';

export default function App() {
  // Active Tab
  const [activeTab, setActiveTab] = useState<HubTab>('budget');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Core Persistent State
  const [meta, setMeta] = useState<WeddingMeta>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_meta`);
    return saved ? JSON.parse(saved) : INITIAL_WEDDING_META;
  });

  const [totalBudget, setTotalBudget] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_budget`);
    return saved ? JSON.parse(saved) : 5000000; // 50 Lakhs default
  });

  const [budgetConfigs, setBudgetConfigs] = useState<BudgetConfig[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_budgetConfigs`);
    return saved ? JSON.parse(saved) : INITIAL_BUDGET_CONFIGS;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [ceremonies, setCeremonies] = useState<CeremonyEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ceremonies`);
    return saved ? JSON.parse(saved) : INITIAL_CEREMONIES;
  });

  const [guests, setGuests] = useState<GuestRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_guests`);
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [rooms, setRooms] = useState<RoomAllocation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_rooms`);
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [shuttles, setShuttles] = useState<ShuttleSchedule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_shuttles`);
    return saved ? JSON.parse(saved) : INITIAL_SHUTTLES;
  });

  const [vendorCategories, setVendorCategories] = useState<VendorCategoryComparison[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_vendors`);
    return saved ? JSON.parse(saved) : INITIAL_VENDOR_COMPARISONS;
  });

  const [contractChecklist, setContractChecklist] = useState<ContractChecklistItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_contract`);
    return saved ? JSON.parse(saved) : INITIAL_CONTRACT_CHECKLIST;
  });

  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_themeId`);
    return saved ? JSON.parse(saved) : 'royal-heritage';
  });

  const [ceremonyPalettes, setCeremonyPalettes] = useState<CeremonyPalette[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_palettes`);
    return saved ? JSON.parse(saved) : INITIAL_CEREMONY_PALETTES;
  });

  const [emergencyKit, setEmergencyKit] = useState<EmergencyKitItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_emergency`);
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_KIT;
  });

  const [contacts, setContacts] = useState<KeyContact[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_contacts`);
    return saved ? JSON.parse(saved) : INITIAL_KEY_CONTACTS;
  });

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_meta`, JSON.stringify(meta));
  }, [meta]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_budget`, JSON.stringify(totalBudget));
  }, [totalBudget]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_budgetConfigs`, JSON.stringify(budgetConfigs));
  }, [budgetConfigs]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ceremonies`, JSON.stringify(ceremonies));
  }, [ceremonies]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_guests`, JSON.stringify(guests));
  }, [guests]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_rooms`, JSON.stringify(rooms));
  }, [rooms]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_shuttles`, JSON.stringify(shuttles));
  }, [shuttles]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_vendors`, JSON.stringify(vendorCategories));
  }, [vendorCategories]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_contract`, JSON.stringify(contractChecklist));
  }, [contractChecklist]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_themeId`, JSON.stringify(selectedThemeId));
  }, [selectedThemeId]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_palettes`, JSON.stringify(ceremonyPalettes));
  }, [ceremonyPalettes]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_emergency`, JSON.stringify(emergencyKit));
  }, [emergencyKit]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_contacts`, JSON.stringify(contacts));
  }, [contacts]);

  // Derived calculations
  const daysRemaining = useMemo(() => {
    return calculateDaysRemaining(meta.weddingDate);
  }, [meta.weddingDate]);

  const ledgerSummary = useMemo(() => {
    return calculatePaymentLedgerSummary(expenses);
  }, [expenses]);

  const totalGuestsConfirmed = useMemo(() => {
    return guests
      .filter((g) => g.rsvpStatus === 'Confirmed')
      .reduce((sum, g) => sum + g.pax, 0);
  }, [guests]);

  const emergencyProgress = useMemo(() => {
    return calculateChecklistProgress(emergencyKit.map((i) => ({ isPacked: i.isPacked })));
  }, [emergencyKit]);

  // Reset to default sample
  const handleResetData = () => {
    if (
      window.confirm(
        'Reset all wedding plans, budget allocations, guest lists, and checklists to default authentic Rajasthani palace wedding demo?'
      )
    ) {
      setMeta(INITIAL_WEDDING_META);
      setTotalBudget(5000000);
      setBudgetConfigs(INITIAL_BUDGET_CONFIGS);
      setExpenses(INITIAL_EXPENSES);
      setCeremonies(INITIAL_CEREMONIES);
      setGuests(INITIAL_GUESTS);
      setRooms(INITIAL_ROOMS);
      setShuttles(INITIAL_SHUTTLES);
      setVendorCategories(INITIAL_VENDOR_COMPARISONS);
      setContractChecklist(INITIAL_CONTRACT_CHECKLIST);
      setSelectedThemeId('royal-heritage');
      setCeremonyPalettes(INITIAL_CEREMONY_PALETTES);
      setEmergencyKit(INITIAL_EMERGENCY_KIT);
      setContacts(INITIAL_KEY_CONTACTS);
      localStorage.clear();
    }
  };

  // Expense handlers
  const handleAddExpense = (exp: Omit<ExpenseRecord, 'id'>) => {
    const newRecord: ExpenseRecord = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newRecord, ...prev]);
  };

  const handleUpdateExpense = (updated: ExpenseRecord) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Ceremony handler
  const handleUpdateCeremony = (updated: CeremonyEvent) => {
    setCeremonies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  // Guest handlers
  const handleAddGuest = (guest: Omit<GuestRecord, 'id'>) => {
    const newGuest: GuestRecord = {
      ...guest,
      id: `g-${Date.now()}`,
    };
    setGuests((prev) => [newGuest, ...prev]);
  };

  const handleUpdateGuest = (updated: GuestRecord) => {
    setGuests((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  };

  const handleDeleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  // Room handlers
  const handleAddRoom = (room: Omit<RoomAllocation, 'id'>) => {
    const newRoom: RoomAllocation = {
      ...room,
      id: `r-${Date.now()}`,
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  const handleDeleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  // Shuttle handlers
  const handleAddShuttle = (shuttle: Omit<ShuttleSchedule, 'id'>) => {
    const newShuttle: ShuttleSchedule = {
      ...shuttle,
      id: `sh-${Date.now()}`,
    };
    setShuttles((prev) => [...prev, newShuttle]);
  };

  const handleDeleteShuttle = (id: string) => {
    setShuttles((prev) => prev.filter((s) => s.id !== id));
  };

  // Vendor handlers
  const handleSelectWinningVendor = (categoryId: string, candidateId: string) => {
    setVendorCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          candidates: cat.candidates.map((cand) => ({
            ...cand,
            status: cand.id === candidateId ? 'Selected / Hired' : 'Shortlisted',
          })),
        };
      })
    );
  };

  const handleToggleContractItem = (id: string) => {
    setContractChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isChecked: !c.isChecked } : c))
    );
  };

  const handleUpdateContractNotes = (id: string, notes: string) => {
    setContractChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes } : c))
    );
  };

  // Fashion handlers
  const handleUpdateRoleColor = (
    ceremonyId: string,
    roleName: OutfitColorRole['role'],
    newHex: string,
    newColorName: string
  ) => {
    setCeremonyPalettes((prev) =>
      prev.map((cp) => {
        if (cp.ceremonyId !== ceremonyId) return cp;
        return {
          ...cp,
          roles: cp.roles.map((r) =>
            r.role === roleName ? { ...r, hexCode: newHex, colorName: newColorName } : r
          ),
        };
      })
    );
  };

  // Emergency Kit handlers
  const handleToggleEmergencyItem = (id: string) => {
    setEmergencyKit((prev) =>
      prev.map((k) => (k.id === id ? { ...k, isPacked: !k.isPacked } : k))
    );
  };

  const handleAddEmergencyItem = (item: Omit<EmergencyKitItem, 'id'>) => {
    const newItem: EmergencyKitItem = {
      ...item,
      id: `ek-${Date.now()}`,
    };
    setEmergencyKit((prev) => [newItem, ...prev]);
  };

  const handleDeleteEmergencyItem = (id: string) => {
    setEmergencyKit((prev) => prev.filter((k) => k.id !== id));
  };

  // Contact handlers
  const handleAddContact = (contact: Omit<KeyContact, 'id'>) => {
    const newContact: KeyContact = {
      ...contact,
      id: `kc-${Date.now()}`,
    };
    setContacts((prev) => [...prev, newContact]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Sticky Festive Navigation Header */}
      <Header
        meta={meta}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        daysRemaining={daysRemaining}
        totalBudget={totalBudget}
        totalCommitted={ledgerSummary.totalAgreed}
        totalGuestsConfirmed={totalGuestsConfirmed}
        emergencyProgressPercent={emergencyProgress.percent}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Container View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'budget' && (
          <BudgetHub
            totalBudget={totalBudget}
            onUpdateTotalBudget={setTotalBudget}
            budgetConfigs={budgetConfigs}
            onUpdateBudgetConfigs={setBudgetConfigs}
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'events' && (
          <EventHub
            ceremonies={ceremonies}
            onUpdateCeremony={handleUpdateCeremony}
          />
        )}

        {activeTab === 'guests' && (
          <GuestHub
            guests={guests}
            onAddGuest={handleAddGuest}
            onUpdateGuest={handleUpdateGuest}
            onDeleteGuest={handleDeleteGuest}
            rooms={rooms}
            onAddRoom={handleAddRoom}
            onDeleteRoom={handleDeleteRoom}
            shuttles={shuttles}
            onAddShuttle={handleAddShuttle}
            onDeleteShuttle={handleDeleteShuttle}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorHub
            categories={vendorCategories}
            onSelectWinningVendor={handleSelectWinningVendor}
            contractChecklist={contractChecklist}
            onToggleContractItem={handleToggleContractItem}
            onUpdateContractNotes={handleUpdateContractNotes}
          />
        )}

        {activeTab === 'fashion' && (
          <FashionHub
            themePresets={WEDDING_THEME_PRESETS}
            selectedThemeId={selectedThemeId}
            onSelectTheme={setSelectedThemeId}
            ceremonyPalettes={ceremonyPalettes}
            onUpdateRoleColor={handleUpdateRoleColor}
          />
        )}

        {activeTab === 'dayOf' && (
          <DayOfCommandHub
            emergencyKit={emergencyKit}
            onToggleEmergencyItem={handleToggleEmergencyItem}
            onAddEmergencyItem={handleAddEmergencyItem}
            onDeleteEmergencyItem={handleDeleteEmergencyItem}
            contacts={contacts}
            onAddContact={handleAddContact}
            onDeleteContact={handleDeleteContact}
            weddingCeremony={ceremonies.find((c) => c.id === 'wedding')}
          />
        )}
      </main>

      {/* Auspicious Footer */}
      <footer className="mt-16 bg-[#4A0011] text-amber-150 border-t border-amber-500/30 py-8 px-4 text-xs no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-900 font-bold font-serif text-sm">
              शुभ
            </div>
            <div>
              <div className="font-serif text-sm font-bold text-white">
                SHUBH BANDHAN WEDDING SUITE
              </div>
              <div className="text-[11px] text-amber-300/70">
                The All-in-One Digital Command Center for Indian Weddings
              </div>
            </div>
          </div>

          <div className="text-amber-200/80 text-[11px] max-w-md">
            “माङ्गल्यं तन्तुनानेन लोकधारणहेतुना। कण्ठे बध्नामि शुभगे त्वं जीव शरदः शतम्॥”
            <div className="text-[10px] text-amber-400/60 mt-0.5">
              Wishing an eternal lifetime of prosperity, love, and harmonious union.
            </div>
          </div>

          <div className="text-amber-300/70 text-[11px]">
            {meta.brideName} & {meta.groomName} • {meta.weddingDate}
          </div>
        </div>
      </footer>

      {/* Printable Master Plan Modal */}
      <PrintMasterPlanModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        meta={meta}
        totalBudget={totalBudget}
        expenses={expenses}
        ceremonies={ceremonies}
        contacts={contacts}
        guests={guests}
        rooms={rooms}
        emergencyKit={emergencyKit}
      />
    </div>
  );
}
