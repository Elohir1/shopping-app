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

interface EditListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditList: (id: number, newName: string) => void;
  seznam: {
    id: number;
    nazev: string;
  } | null;
}

export function EditListDialog({ isOpen, onClose, onEditList, seznam }: EditListDialogProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (seznam) {
      setName(seznam.nazev);
    }
  }, [seznam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seznam && name.trim()) {
      onEditList(seznam.id, name.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upravit název seznamu</DialogTitle>
          <DialogDescription>
            Změňte název nákupního seznamu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Název seznamu</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-[#7d9b69] focus-visible:ring-[#4e6a4d]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#7d9b69] text-[#7d9b69] hover:bg-[#f3f8e8]"
            >
              Zrušit
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || name.trim() === seznam?.nazev}
              className="bg-[#7d9b69] text-white hover:bg-[#4e6a4d]"
            >
              Uložit změny
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}