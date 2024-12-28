import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useIntl } from 'react-intl';

// Props interface pro NewListDialog komponentu
interface NewListDialogProps {
  isOpen: boolean;        // Stav otevření dialogu
  onClose: () => void;    // Handler pro zavření dialogu
  onCreateList: (name: string) => void; // Handler pro vytvoření seznamu
}

export function NewListDialog({ isOpen, onClose, onCreateList }: NewListDialogProps) {
  const intl = useIntl();
    // State pro název nového seznamu
  const [name, setName] = useState("");

  // Handler pro odeslání formuláře
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateList(name.trim());
      setName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Vylepšení UI: Přidat responzivní šířku a animaci */}
      <DialogContent 
        className="w-[95vw] sm:max-w-[425px] mx-auto bg-[#f3f8e8] dark:bg-[#1a2412] border-[#7d9b69] dark:border-[#4e6a4d] animate-dialogShow"
        role="dialog"
        aria-labelledby="dialog-title"
      >
        {/* Vylepšení UI: Responzivní velikost písma */}
        <DialogHeader>
          <DialogTitle 
            id="dialog-title"
            className="text-base sm:text-lg font-bold text-[#2d3e23] dark:text-[#e8f3e8]"
          >
            {intl.formatMessage({ id: 'dialog.newList.title' })}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-[#4e6a4d] dark:text-[#7d9b69]">
            {intl.formatMessage({ id: 'dialog.newList.description' })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vylepšení UI: Přidat minimální výšku pro lepší dotykové ovládání */}
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={intl.formatMessage({ id: 'dialog.newList.placeholder' })}
            className="w-full min-h-[44px] border-[#7d9b69] dark:border-[#4e6a4d] bg-white dark:bg-[#2d3e23] dark:text-white focus-visible:ring-[#4e6a4d]"
            autoFocus
            aria-label={intl.formatMessage({ id: 'dialog.newList.title' })}
            required
          />
          
          {/* Vylepšení UI: Responzivní layout tlačítek */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full sm:w-auto min-h-[44px] text-[#4e6a4d] hover:bg-[#f3f8e8]"
            >
              {intl.formatMessage({ id: 'dialog.cancel' })}
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="w-full sm:w-auto min-h-[44px] bg-[#7d9b69] text-white hover:bg-[#4e6a4d]"
            >
              {intl.formatMessage({ id: 'dialog.newList.create' })}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}