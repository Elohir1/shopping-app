import React from 'react';
import { Button } from "./button";
import { useIntl } from 'react-intl';

interface LanguageToggleProps {
  onLanguageChange: (locale: string) => void;
  currentLocale: string;
}

export function LanguageToggle({ onLanguageChange, currentLocale }: LanguageToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onLanguageChange(currentLocale === 'cs' ? 'en' : 'cs')}
      className="rounded-full bg-[#c3d5ae] dark:bg-[#2d3e23] text-[#2d3e23] dark:text-white hover:bg-[#7d9b69] dark:hover:bg-[#4e6a4d]"
    >
      {currentLocale === 'cs' ? 'EN' : 'CZ'}
    </Button>
  );
}