import countryData from "country-telephone-data";
import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";
import { Search, X, ChevronDown } from "lucide-react";
import { getExampleNumber, AsYouType, CountryCode } from "libphonenumber-js";
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

interface CountryData {
  iso2: string;
  dialCode: string;
  name: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  onDigitsChange,
  className = "",
}) => {
  const getPhoneNumberLength = (iso2: string) => {
    try {
      const countryCode = iso2.toUpperCase() as CountryCode;
      const example = getExampleNumber(countryCode, examples);
      if (!example) return null;
      return new AsYouType().input(example.number.toString()).replace(/\D/g, "").length;
    } catch {
      return null;
    }
  };

  const countryCodes: CountryOption[] = useMemo(() => {
    return countryData.allCountries.map((c: CountryData) => {
      const phoneLength = getPhoneNumberLength(c.iso2);
      return {
        code: "+" + c.dialCode,
        name: c.name,
        iso2: c.iso2.toLowerCase(),
        digits: phoneLength ? phoneLength - c.dialCode.length : null,
      };
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countryCodes;
    const query = searchQuery.toLowerCase();
    return countryCodes.filter(
      (country) =>
        country.name.toLowerCase().includes(query) || 
        country.code.toLowerCase().includes(query) ||
        country.iso2.toLowerCase().includes(query)
    );
  }, [searchQuery, countryCodes]);

  const selectedCountry = countryCodes.find((c) => c.code === value);

  const handleCountrySelect = (country: CountryOption) => {
    onChange(country.code);
    if (country.digits) onDigitsChange(country.digits);
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery("");
      setHighlightedIndex(-1);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
          handleCountrySelect(filteredCountries[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
        break;
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setHighlightedIndex(-1);
    searchInputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlighted index when filtered countries change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredCountries]);

  return (
    <div ref={containerRef} className={`relative w-[180px] ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggleDropdown}
        onKeyDown={handleKeyDown}
        className="w-full h-12 px-4 py-3 bg-black text-white border border-gray-700 rounded-md flex items-center justify-between hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 flex-1">
          {selectedCountry ? (
            <>
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
              <span className="text-sm">{selectedCountry.code}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm">Select country</span>
          )}
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-black border border-gray-700 rounded-md shadow-lg z-50 max-h-[380px] flex flex-col w-[380px]"
        >
          {/* Search Input */}
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search country or code..."
                className="w-full pl-10 pr-10 py-2 text-sm bg-gray-900 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Countries List */}
          <div className="flex-1 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              <div role="listbox">
                {filteredCountries.map((country, index) => (
                  <button
                    key={`${country.iso2}-${country.code}`}
                    type="button"
                    role="option"
                    aria-selected={country.code === value}
                    onClick={() => handleCountrySelect(country)}
                                         className={`w-full px-4 py-3 text-left hover:bg-gray-800 focus:bg-gray-800 focus:outline-none transition-colors ${
                       index === highlightedIndex ? "bg-gray-800" : ""
                     } ${country.code === value ? "bg-gray-700" : ""}`}
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
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {country.name}
                        </div>
                        {country.digits && (
                          <div className="text-xs text-gray-400">
                            {country.digits} digits
                          </div>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm font-mono">
                        {country.code}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
                             <div className="py-8 text-center text-sm text-gray-400">
                 No countries found for &quot;{searchQuery}&quot;
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
