import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationSelectorProps {
  country: string;
  province: string;
  onCountryChange: (country: string) => void;
  onProvinceChange: (province: string) => void;
  disabled?: boolean;
}

const countries = [
  "Argentina", // temporalmente solo este visible
  // "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", ...
];

const provinces: Record<string, string[]> = {
  "Argentina": ["Salta"], // temporalmente solo Salta
};

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  country,
  province,
  onCountryChange,
  onProvinceChange,
  disabled = false
}) => {
  const handleCountryChange = (newCountry: string) => {
    onCountryChange(newCountry);
    onProvinceChange("");
  };

  const availableProvinces = country ? provinces[country] ?? [] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* PAÍS */}
      <div>
        <label className="block text-sm font-medium mb-1">
          País <span className="text-red-500">*</span>
        </label>

        <Select value={country} onValueChange={handleCountryChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu país" />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            {countries.map((countryOption) => (
              <SelectItem key={countryOption} value={countryOption}>
                {countryOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* PROVINCIA */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Provincia/Estado <span className="text-red-500">*</span>
        </label>

        <Select
          value={province}
          onValueChange={onProvinceChange}
          disabled={disabled || !country || availableProvinces.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu provincia/estado" />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            {availableProvinces.map((provinceOption) => (
              <SelectItem key={provinceOption} value={provinceOption}>
                {provinceOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};



