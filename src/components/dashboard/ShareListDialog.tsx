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
import { Label } from "../ui/label";
import { X, UserPlus, Crown, User } from 'lucide-react';

interface Member {
  id: string;
  email: string;
  isOwner: boolean;
}

interface ShareListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  seznam: {
    id: number;
    nazev: string;
    members?: Member[];
  } | null;
  onAddMember: (seznamId: number, email: string) => void;
  onRemoveMember: (seznamId: number, memberId: string) => void;
  onUpdateMemberRole: (seznamId: number, memberId: string, isOwner: boolean) => void;
  currentUserEmail: string;
}

export function ShareListDialog({
  isOpen,
  onClose,
  seznam,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
  currentUserEmail
}: ShareListDialogProps) {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newMemberEmail.trim()) {
      setError("Zadejte emailovou adresu");
      return;
    }

    if (!newMemberEmail.includes('@')) {
      setError("Zadejte platnou emailovou adresu");
      return;
    }

    if (seznam?.members?.some(member => member.email === newMemberEmail)) {
      setError("Tento uživatel už má přístup k seznamu");
      return;
    }

    if (seznam) {
      onAddMember(seznam.id, newMemberEmail);
      setNewMemberEmail("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Sdílení seznamu</DialogTitle>
          <DialogDescription>
            Seznam "{seznam?.nazev}" je sdílen s následujícími uživateli:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="email">Email nového člena</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="email"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="flex-1 border-[#7d9b69] focus-visible:ring-[#4e6a4d]"
                  />
                  <Button 
                    type="submit"
                    className="bg-[#7d9b69] text-white hover:bg-[#4e6a4d]"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Přidat
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>
            </div>
          </form>

          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-medium text-gray-500">Členové seznamu</h4>
            <div className="space-y-2">
              {seznam?.members?.map((member) => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#f3f8e8]"
                >
                  <div className="flex items-center gap-2">
                    {member.isOwner ? (
                      <Crown className="w-4 h-4 text-[#7d9b69]" />
                    ) : (
                      <User className="w-4 h-4 text-[#7d9b69]" />
                    )}
                    <span className={member.email === currentUserEmail ? 'font-medium' : ''}>
                      {member.email}
                      {member.email === currentUserEmail && ' (vy)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.email !== currentUserEmail && seznam?.members?.some(m => m.email === currentUserEmail && m.isOwner) && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => seznam && onUpdateMemberRole(seznam.id, member.id, !member.isOwner)}
                          className="text-[#4e6a4d] hover:text-[#2d3e23] hover:bg-[#c3d5ae]"
                        >
                          {member.isOwner ? 'Odebrat práva vlastníka' : 'Přidat práva vlastníka'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => seznam && onRemoveMember(seznam.id, member.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}