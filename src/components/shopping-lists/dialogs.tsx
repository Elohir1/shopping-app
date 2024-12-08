import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

// Definice typů
export interface Seznam {
  id: number;
  nazev: string;
  polozky: Polozka[];
  archivovano: boolean;
}

export interface Polozka {
  nazev: string;
  splneno: boolean;
}

interface NewListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateList: (seznam: Seznam) => void;
}

export const NewListDialog = ({ isOpen, onClose, onCreateList }: NewListDialogProps) => {
  const [newListName, setNewListName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const novySeznam: Seznam = {
      id: Date.now(),
      nazev: newListName,
      polozky: [],
      archivovano: false
    }
    onCreateList(novySeznam)
    setNewListName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Vytvořit nový nákupní seznam</DialogTitle>
          <DialogDescription>
            Zadejte název pro váš nový nákupní seznam.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Název seznamu</Label>
              <Input
                id="name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="border-[#7d9b69]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-[#7d9b69] hover:bg-[#4e6a4d] text-white"
              disabled={!newListName.trim()}
            >
              Vytvořit seznam
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listName: string;
}

export const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  listName
}: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Opravdu chcete smazat tento seznam?</AlertDialogTitle>
          <AlertDialogDescription>
            Chystáte se smazat seznam "{listName}". Tuto akci nelze vrátit zpět.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zrušit</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Smazat</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}