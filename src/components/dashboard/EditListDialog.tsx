import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useIntl } from 'react-intl';

// Props interface pro komponentu
interface EditListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditList: (id: number, newName: string) => void;
  seznam: {
    id: number;
    nazev: string;
  } | null;
}

export function EditListDialog({ 
  isOpen, 
  onClose, 
  onEditList, 
  seznam 
}: EditListDialogProps) {
  // Hooks pro překlad a state
  const intl = useIntl();
  const [name, setName] = useState("");

  // Efekt pro nastavení jména při otevření dialogu
  useEffect(() => {
    if (seznam) {
      setName(seznam.nazev);
    }
  }, [seznam]);

  // Handler pro odeslání formuláře
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seznam && name.trim()) {
      onEditList(seznam.id, name.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Responzivní dialog s přizpůsobenou šířkou a paddingem */}
      <DialogContent className="w-[95vw] sm:max-w-[425px] mx-auto bg-[#f3f8e8] dark:bg-[#1a2412] border-[#7d9b69] dark:border-[#4e6a4d] p-4 sm:p-6">
        <DialogHeader className="space-y-3">
          {/* Nadpis dialogu s responzivní velikostí písma */}
          <DialogTitle className="text-base sm:text-lg font-bold text-[#2d3e23] dark:text-[#e8f3e8]">
            {intl.formatMessage({ id: 'dialog.edit.title' })}
          </DialogTitle>
          {/* Popis dialogu s responzivní velikostí písma */}
          <DialogDescription className="text-sm sm:text-base text-[#4e6a4d] dark:text-[#7d9b69]">
            {intl.formatMessage({ id: 'dialog.edit.description' })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              {/* Label pro input s responzivní velikostí písma */}
              <Label 
                htmlFor="name" 
                className="text-sm sm:text-base font-medium text-[#2d3e23] dark:text-[#e8f3e8]"
              >
                {intl.formatMessage({ id: 'dialog.edit.nameLabel' })}
              </Label>
              {/* Input s dostatečnou výškou pro mobilní zařízení */}
              <Input
                id="name"
                type="text"
                value={name}
                placeholder={intl.formatMessage({ id: 'dialog.edit.namePlaceholder' })}
                onChange={(e) => setName(e.target.value)}
                className="min-h-[44px] border-[#7d9b69] dark:border-[#4e6a4d] bg-white dark:bg-[#2d3e23] dark:text-white focus-visible:ring-[#4e6a4d]"
                autoFocus
              />
            </div>
          </div>

          {/* Footer s responzivním layoutem tlačítek */}
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
            {/* Tlačítko pro zrušení s dostatečnou výškou pro mobilní zařízení */}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto min-h-[44px] border-[#7d9b69] text-[#4e6a4d] hover:bg-[#e2ebd3] hover:text-[#2d3e23]"
            >
              {intl.formatMessage({ id: 'dialog.cancel' })}
            </Button>
            {/* Tlačítko pro uložení s dostatečnou výškou pro mobilní zařízení */}
            <Button 
              type="submit" 
              disabled={!name.trim() || name.trim() === seznam?.nazev}
              className="w-full sm:w-auto min-h-[44px] bg-[#7d9b69] text-white hover:bg-[#4e6a4d]"
            >
              {intl.formatMessage({ id: 'dialog.edit.save' })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}