"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SettingsFieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsField({ label, description, children, className }: SettingsFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          {label}
        </label>
        {description && (
          <p className="text-sm text-neutral-400 mb-3">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

interface SettingsTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  className?: string;
}

export function SettingsTextarea({ 
  placeholder, 
  value, 
  onChange, 
  rows = 4,
  className 
}: SettingsTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5",
        "text-white placeholder-neutral-500 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        "resize-none",
        className
      )}
    />
  );
}

interface SettingsSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>;
  className?: string;
}

export function SettingsSelect({ value, onChange, options, className }: SettingsSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5",
          "text-white text-sm appearance-none cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          className
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

interface SettingsInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SettingsInput({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  className 
}: SettingsInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5",
        "text-white placeholder-neutral-500 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        className
      )}
    />
  );
}