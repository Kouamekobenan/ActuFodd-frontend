"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export default function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Sélectionnez une option",
  disabled = false,
  error = false,
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-2.5 sm:py-3 border-2 rounded-xl text-sm sm:text-base transition-all outline-none bg-white ${
          disabled
            ? "opacity-60 cursor-not-allowed border-gray-200"
            : error
            ? "border-red-500 bg-red-50"
            : open
            ? "border-orange-500 ring-4 ring-orange-100"
            : "border-gray-200 hover:border-orange-400 cursor-pointer"
        }`}
      >
        <span className={selected ? "text-gray-900 font-medium" : "text-gray-400"}>
          {disabled ? "Chargement..." : selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
          {/* Placeholder option */}
          <button
            type="button"
            onClick={() => { onChange(""); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-50 transition-colors text-left"
          >
            <span className="flex-1">{placeholder}</span>
          </button>

          {options.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400 text-center">Aucune option disponible</p>
          ) : (
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                  opt.value === value
                    ? "bg-orange-50 text-orange-700 font-semibold"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span className="flex-1">{opt.label}</span>
                {opt.value === value && <Check className="w-4 h-4 text-orange-600 flex-shrink-0" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
