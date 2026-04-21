/**
 * HeatMapNavigation Component
 * Reusable Heat Map visualization with period and shift filters
 * Used in both Picking and Smart Layout pages
 */

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeatMapNavigationProps {
  title?: string;
  description?: string;
  showLegend?: boolean;
  showPeriodInfo?: boolean;
  compact?: boolean;
}

export default function HeatMapNavigation({
  title,
  description,
  showLegend = true,
  showPeriodInfo = true,
  compact = false,
}: HeatMapNavigationProps) {
  const { language } = useLanguage();
  const [selectedShift, setSelectedShift] = useState('morning');
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [heatMapOpacity, setHeatMapOpacity] = useState(0.7);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);

  // Update opacity based on selected shift
  useEffect(() => {
    if (selectedShift === 'morning') {
      setHeatMapOpacity(0.5);
      setOverlayOpacity(0.4);
    } else if (selectedShift === 'afternoon') {
      setHeatMapOpacity(0.7);
      setOverlayOpacity(0.5);
    } else {
      setHeatMapOpacity(0.6);
      setOverlayOpacity(0.45);
    }
  }, [selectedShift]);

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {/* Title and Description */}
      {(title || description) && (
        <div>
          {title && (
            <h3 className={compact ? "text-lg font-semibold text-foreground mb-2" : "text-2xl font-bold text-foreground mb-4"}>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Period Selector */}
      <div className="space-y-4">
        {/* Shift Selector */}
        <div className="flex flex-wrap gap-2">
          {['morning', 'afternoon', 'night'].map((shift) => (
            <button
              key={shift}
              onClick={() => setSelectedShift(shift)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedShift === shift
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {language === 'pt'
                ? shift === 'morning' ? '🌅 Manhã' : shift === 'afternoon' ? '☀️ Tarde' : '🌙 Noite'
                : shift === 'morning' ? '🌅 Morning' : shift === 'afternoon' ? '☀️ Afternoon' : '🌙 Night'}
            </button>
          ))}
        </div>

        {/* Time Period Selector */}
        <div className="flex flex-wrap gap-2">
          {['day', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedPeriod === period
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {language === 'pt'
                ? period === 'day' ? '📅 Dia' : period === 'week' ? '📊 Semana' : '📈 Mês'
                : period === 'day' ? '📅 Day' : period === 'week' ? '📊 Week' : '📈 Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Heat Map Visualization */}
      <div className="relative w-full rounded-lg overflow-hidden border border-border shadow-lg bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-4 transition-all duration-500">
        {/* SVG Heat Map Grid with Dynamic Opacity */}
        <svg className="w-full h-auto relative z-10 transition-opacity duration-500" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" style={{ opacity: heatMapOpacity }}>
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="heatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.3}} />
              <stop offset="25%" style={{stopColor: '#10b981', stopOpacity: 0.3}} />
              <stop offset="50%" style={{stopColor: '#f59e0b', stopOpacity: 0.3}} />
              <stop offset="75%" style={{stopColor: '#ef4444', stopOpacity: 0.3}} />
              <stop offset="100%" style={{stopColor: '#dc2626', stopOpacity: 0.4}} />
            </linearGradient>
          </defs>

          {/* Heat map zones */}
          <circle cx="200" cy="150" r="120" fill="#3b82f6" opacity="0.15" />
          <circle cx="500" cy="200" r="150" fill="#10b981" opacity="0.15" />
          <circle cx="800" cy="180" r="140" fill="#f59e0b" opacity="0.15" />
          <circle cx="350" cy="400" r="130" fill="#ef4444" opacity="0.15" />
          <circle cx="650" cy="420" r="120" fill="#dc2626" opacity="0.2" />
          <circle cx="500" cy="500" r="100" fill="#f59e0b" opacity="0.15" />

          {/* Grid lines */}
          <line x1="0" y1="0" x2="1000" y2="0" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="0" y1="150" x2="1000" y2="150" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="300" x2="1000" y2="300" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="450" x2="1000" y2="450" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="600" x2="1000" y2="600" stroke="#e5e7eb" strokeWidth="1" />

          <line x1="0" y1="0" x2="0" y2="600" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="250" y1="0" x2="250" y2="600" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
          <line x1="500" y1="0" x2="500" y2="600" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
          <line x1="750" y1="0" x2="750" y2="600" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
          <line x1="1000" y1="0" x2="1000" y2="600" stroke="#e5e7eb" strokeWidth="1" />

          {/* Labels */}
          <text x="50" y="30" fontSize="14" fill="#6b7280" fontWeight="bold">{language === 'pt' ? 'Entrada' : 'Entrance'}</text>
          <text x="850" y="30" fontSize="14" fill="#6b7280" fontWeight="bold">{language === 'pt' ? 'Caixas' : 'Checkouts'}</text>
          <text x="450" y="570" fontSize="14" fill="#6b7280" fontWeight="bold">{language === 'pt' ? 'Zona de Alto Fluxo' : 'High Traffic Zone'}</text>
        </svg>

        {/* Overlay Image with Dynamic Transparency */}
        <div className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500" style={{ opacity: overlayOpacity }}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/plantabaixadesupermercados-exemploII_ed476e79.png"
            alt={language === 'pt' ? 'Layout de Supermercado' : 'Supermarket Layout'}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Period Info Display */}
      {showPeriodInfo && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            {language === 'pt'
              ? `Exibindo fluxo de: ${selectedShift === 'morning' ? 'Manhã (6h-12h)' : selectedShift === 'afternoon' ? 'Tarde (12h-18h)' : 'Noite (18h-23h)'} | Período: ${selectedPeriod === 'day' ? 'Hoje' : selectedPeriod === 'week' ? 'Esta semana' : 'Este mês'}`
              : `Showing flow for: ${selectedShift === 'morning' ? 'Morning (6am-12pm)' : selectedShift === 'afternoon' ? 'Afternoon (12pm-6pm)' : 'Night (6pm-11pm)'} | Period: ${selectedPeriod === 'day' ? 'Today' : selectedPeriod === 'week' ? 'This week' : 'This month'}`}
          </p>
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className={compact ? "grid grid-cols-2 md:grid-cols-4 gap-4" : "grid grid-cols-1 md:grid-cols-4 gap-6"}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-400 opacity-40"></div>
            <span className="text-sm text-muted-foreground">{language === 'pt' ? 'Baixo fluxo' : 'Low traffic'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-400 opacity-40"></div>
            <span className="text-sm text-muted-foreground">{language === 'pt' ? 'Fluxo moderado' : 'Moderate traffic'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-400 opacity-40"></div>
            <span className="text-sm text-muted-foreground">{language === 'pt' ? 'Fluxo alto' : 'High traffic'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-red-500 opacity-50"></div>
            <span className="text-sm text-muted-foreground">{language === 'pt' ? 'Fluxo muito alto' : 'Very high traffic'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
