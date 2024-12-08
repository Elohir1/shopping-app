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

interface NewListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateList: (name: string) => void;
}

export function NewListDialog({ isOpen, onClose, onCreateList }: NewListDialogProps) {
  const [name, setName] = useState("");

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
      <DialogContent className="bg-white sm:max-w-[425px] p-6 rounded-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">Nový nákupní seznam</DialogTitle>
          <DialogDescription>
            Zadejte název pro nový nákupní seznam.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Název seznamu"
            className="w-full border-[#7d9b69] focus-visible:ring-[#4e6a4d]"
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-[#4e6a4d] hover:bg-[#f3f8e8]"
            >
              Zrušit
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="bg-[#7d9b69] text-white hover:bg-[#4e6a4d]"
            >
              Vytvořit seznam
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}