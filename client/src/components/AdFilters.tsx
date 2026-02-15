import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface AdFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  language: string;
}

export interface FilterOptions {
  region?: string;
  visitorType?: string;
  timeSlot?: string;
  category?: string;
}

export default function AdFilters({ onFilterChange, language }: AdFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedVisitorType, setSelectedVisitorType] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const texts = {
    pt: {
      filters: "Filtros Avançados",
      region: "Região",
      visitorType: "Tipo de Visitante",
      timeSlot: "Horário",
      category: "Categoria",
      apply: "Aplicar Filtros",
      clear: "Limpar",
      allRegions: "Todas as Regiões",
      allVisitorTypes: "Todos os Tipos",
      allTimeSlots: "Todos os Horários",
      allCategories: "Todas as Categorias",
      morning: "Manhã (6h-12h)",
      afternoon: "Tarde (12h-18h)",
      evening: "Noite (18h-00h)",
      night: "Madrugada (00h-6h)",
      residential: "Residencial",
      commercial: "Comercial",
      shopping: "Shopping Center",
      airport: "Aeroporto",
      hospital: "Hospital",
    },
    en: {
      filters: "Advanced Filters",
      region: "Region",
      visitorType: "Visitor Type",
      timeSlot: "Time Slot",
      category: "Category",
      apply: "Apply Filters",
      clear: "Clear",
      allRegions: "All Regions",
      allVisitorTypes: "All Types",
      allTimeSlots: "All Time Slots",
      allCategories: "All Categories",
      morning: "Morning (6am-12pm)",
      afternoon: "Afternoon (12pm-6pm)",
      evening: "Evening (6pm-12am)",
      night: "Night (12am-6am)",
      residential: "Residential",
      commercial: "Commercial",
      shopping: "Shopping Center",
      airport: "Airport",
      hospital: "Hospital",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.pt;

  const regions = ["north", "northeast", "midwest", "southeast", "south"];
  const visitorTypes = ["residential", "commercial", "shopping", "airport", "hospital"];
  const timeSlots = ["morning", "afternoon", "evening", "night"];
  const categories = ["beverages", "hygiene", "electronics", "food", "cleaning", "frozen"];

  const handleApplyFilters = () => {
    onFilterChange({
      region: selectedRegion,
      visitorType: selectedVisitorType,
      timeSlot: selectedTimeSlot,
      category: selectedCategory,
    });
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedRegion("");
    setSelectedVisitorType("");
    setSelectedTimeSlot("");
    setSelectedCategory("");
    onFilterChange({});
  };

  const activeFiltersCount = [
    selectedRegion,
    selectedVisitorType,
    selectedTimeSlot,
    selectedCategory,
  ].filter(Boolean).length;

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{t.filters}</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <Card className="mt-4 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">{t.filters}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Region Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                {t.region}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedRegion("")}
                  className={`p-2 rounded text-sm font-medium transition-colors ${
                    selectedRegion === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-foreground hover:bg-gray-200"
                  }`}
                >
                  {t.allRegions}
                </button>
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`p-2 rounded text-sm font-medium transition-colors capitalize ${
                      selectedRegion === region
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-foreground hover:bg-gray-200"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Visitor Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                {t.visitorType}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedVisitorType("")}
                  className={`p-2 rounded text-sm font-medium transition-colors ${
                    selectedVisitorType === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-foreground hover:bg-gray-200"
                  }`}
                >
                  {t.allVisitorTypes}
                </button>
                {visitorTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedVisitorType(type)}
                    className={`p-2 rounded text-sm font-medium transition-colors capitalize ${
                      selectedVisitorType === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-foreground hover:bg-gray-200"
                    }`}
                  >
                    {t[type as keyof typeof t] || type}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                {t.timeSlot}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTimeSlot("")}
                  className={`p-2 rounded text-sm font-medium transition-colors ${
                    selectedTimeSlot === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-foreground hover:bg-gray-200"
                  }`}
                >
                  {t.allTimeSlots}
                </button>
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-2 rounded text-sm font-medium transition-colors capitalize ${
                      selectedTimeSlot === slot
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-foreground hover:bg-gray-200"
                    }`}
                  >
                    {t[slot as keyof typeof t] || slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                {t.category}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`p-2 rounded text-sm font-medium transition-colors ${
                    selectedCategory === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-foreground hover:bg-gray-200"
                  }`}
                >
                  {t.allCategories}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-2 rounded text-sm font-medium transition-colors capitalize ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-foreground hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleApplyFilters}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t.apply}
              </Button>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="flex-1"
              >
                {t.clear}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
