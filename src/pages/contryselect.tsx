import countryData from "country-telephone-data";
import React, { useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ReactCountryFlag from "react-country-flag";
import { Search, X } from "lucide-react";
import { getExampleNumber, AsYouType } from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

interface CountryOption {
  code: string;
  name: string;
  iso2: string;
  digits: number | null;
}

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  onDigitsChange: (digits: number) => void;
  className?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  onDigitsChange,
  className = "",
}) => {
  const getPhoneNumberLength = (iso2: string) => {
    try {
      const example = getExampleNumber(iso2.toUpperCase(), examples);
      if (!example) return null;
      return new AsYouType().input(example.number.toString()).replace(/\D/g, "").length;
    } catch (e) {
      return null;
    }
  };
  const countryCodes: CountryOption[] = countryData.allCountries.map((c) => {
    const phoneLength = getPhoneNumberLength(c.iso2);
    return {
      code: "+" + c.dialCode,
      name: c.name,
      iso2: c.iso2.toLowerCase(),
      digits: phoneLength ? phoneLength - c.dialCode.length : null,
    };
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countryCodes;
    const query = searchQuery.toLowerCase();
    return countryCodes.filter(
      (country) =>
        country.name.toLowerCase().includes(query) || country.code.toLowerCase().includes(query)
    );
  }, [searchQuery, countryCodes]);

  const selectedCountry = countryCodes.find((c) => c.code === value);

  const handleCountrySelect = (code: string) => {
    onChange(code);
    const country = countryCodes.find((c) => c.code === code);
    if (country && country.digits) onDigitsChange(country.digits);
    setOpen(false);
    setSearchQuery("");
  };

  const clearSearch = () => setSearchQuery("");

  return (
    <Select open={open} onOpenChange={setOpen} value={value} onValueChange={handleCountrySelect}>
      <SelectTrigger className={`w-[180px] bg-black text-white border-gray-700 ${className}`}>
        <SelectValue>
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={selectedCountry.iso2}
                svg
                style={{
                  width: "20px",
                  height: "15px",
                  borderRadius: "2px",
                }}
                aria-label={selectedCountry.name}
              />
              <span>{selectedCountry.code}</span>
            </div>
          ) : (
            <span>Select country</span>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="bg-black text-white border-gray-700 hover:text-white">
        <div className="sticky top-0 z-10 bg-black p-2 border-b border-gray-700 text-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country or code"
              className="w-full pl-8 pr-8 py-1.5 text-sm bg-gray-900 text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto text-white">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <SelectItem
                key={`${country.iso2}-${country.code}`}
                value={country.code}
                className="hover:bg-gray-800 focus:bg-gray-800 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <ReactCountryFlag
                    countryCode={country.iso2}
                    svg
                    style={{
                      width: "20px",
                      height: "15px",
                      borderRadius: "2px",
                    }}
                    aria-label={country.name}
                  />
                  <div className="flex-1 flex flex-col text-white">
                    <span>{country.name}</span>
                    {country.digits && (
                      <span className="text-xs text-gray-400">{country.digits} digits</span>
                    )}
                  </div>
                  <span className="text-gray-400">{country.code}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="py-4 text-center text-sm text-gray-400">No countries found</div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;
