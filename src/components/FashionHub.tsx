/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shirt,
  Sparkles,
  Palette,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  WeddingThemePreset,
  CeremonyPalette,
  OutfitColorRole,
} from '../types/wedding.ts';

interface FashionHubProps {
  themePresets: WeddingThemePreset[];
  selectedThemeId: string;
  onSelectTheme: (id: string) => void;
  ceremonyPalettes: CeremonyPalette[];
  onUpdateRoleColor: (
    ceremonyId: string,
    roleName: OutfitColorRole['role'],
    newHex: string,
    newColorName: string
  ) => void;
}

export const FashionHub: React.FC<FashionHubProps> = ({
  themePresets,
  selectedThemeId,
  onSelectTheme,
  ceremonyPalettes,
  onUpdateRoleColor,
}) => {
  const [selectedCeremonyId, setSelectedCeremonyId] = useState<string>(
    ceremonyPalettes[0]?.ceremonyId || 'haldi'
  );

  const activeTheme =
    themePresets.find((t) => t.id === selectedThemeId) || themePresets[0];

  const currentCeremonyPalette =
    ceremonyPalettes.find((p) => p.ceremonyId === selectedCeremonyId) ||
    ceremonyPalettes[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Pillar 5 • Fashion & Style Hub
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Family & Bridal Party Outfit Color Matrix
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl">
              Harmonize dress codes across ceremonies so bride, groom, immediate family, and close friends complement each other without clashing against mandap and stage backdrops.
            </p>
          </div>
        </div>

        {/* Theme Moodboards Switcher */}
        <div className="mt-6 pt-5 border-t border-amber-100">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-700" />
            <span>Select Wedding Aesthetic Moodboard</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {themePresets.map((theme) => {
              const isSelected = selectedThemeId === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#800020] bg-amber-50/50 ring-2 ring-amber-400/30 shadow-md'
                      : 'border-stone-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-stone-900">
                        {theme.name}
                      </h4>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#800020]" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                      {theme.subtitle}
                    </p>
                  </div>

                  {/* Swatches preview */}
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 mb-2">
                      {theme.primaryPalette.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-5 h-5 rounded-full shadow-xs border border-white"
                          style={{ backgroundColor: color.hex }}
                          title={`${color.name} (${color.hex})`}
                        ></span>
                      ))}
                    </div>
                    <div className="text-[10px] text-stone-400 font-medium">
                      Fabrics: {theme.recommendedFabrics.split(',')[0]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Theme Spotlight Card */}
      {activeTheme && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
                Active Aesthetic Palette
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {activeTheme.name}
              </h3>
            </div>
            <div className="text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
              <strong>Signature Fabrics:</strong> {activeTheme.recommendedFabrics}
            </div>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">{activeTheme.vibe}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {activeTheme.primaryPalette.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200"
              >
                <span
                  className="w-4 h-4 rounded-full border border-stone-300"
                  style={{ backgroundColor: item.hex }}
                ></span>
                <span className="text-xs font-semibold text-stone-800">{item.name}</span>
                <span className="text-[10px] font-mono text-stone-400">{item.hex}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ceremony-Wise Outfit Matrix */}
      {currentCeremonyPalette && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Role-by-Role Coordination Matrix
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Ensure each group shines with distinct color swatches that synchronize seamlessly.
              </p>
            </div>

            {/* Ceremony Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {ceremonyPalettes.map((cp) => (
                <button
                  key={cp.ceremonyId}
                  onClick={() => setSelectedCeremonyId(cp.ceremonyId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCeremonyId === cp.ceremonyId
                      ? 'bg-[#800020] text-amber-100 shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cp.ceremonyName}
                </button>
              ))}
            </div>
          </div>

          {/* Decor Backdrop Clash Alert */}
          {currentCeremonyPalette.backdropClashWarning && (
            <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Backdrop & Decor Clash Warning
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {currentCeremonyPalette.backdropClashWarning}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-amber-900">
                    Stage Backdrop Colors:
                  </span>
                  {currentCeremonyPalette.decorBackdropColors.map((hex, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-md border border-amber-300 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentCeremonyPalette.roles.map((roleObj, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-amber-300 transition-all space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                    {roleObj.role}
                  </span>

                  {/* Interactive Swatch & Color Picker */}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <span
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md block"
                      style={{ backgroundColor: roleObj.hexCode }}
                    ></span>
                    <input
                      type="color"
                      value={roleObj.hexCode}
                      onChange={(e) =>
                        onUpdateRoleColor(
                          currentCeremonyPalette.ceremonyId,
                          roleObj.role,
                          e.target.value,
                          roleObj.colorName
                        )
                      }
                      className="sr-only"
                    />
                    <span className="text-[10px] text-stone-400 font-mono">
                      {roleObj.hexCode}
                    </span>
                  </label>
                </div>

                <div>
                  <h4 className="font-serif text-base font-bold text-stone-900">
                    {roleObj.colorName}
                  </h4>
                  <div className="text-xs font-semibold text-stone-700 mt-0.5">
                    {roleObj.attireType}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/60 text-xs text-stone-500">
                  <span className="font-semibold text-stone-700">Styling & Fabric Advice: </span>
                  {roleObj.fabricTips}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
