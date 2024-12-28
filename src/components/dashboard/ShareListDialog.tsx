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
import { useIntl } from 'react-intl';

// Definice typů pro členy seznamu
interface Member {
  id: string;
  email: string;
  isOwner: boolean;
}

// Props komponenty
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
  // Lokální state pro správu nového emailu a chyb
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const intl = useIntl();

  // Handler pro přidání nového člena
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validace emailu
    if (!newMemberEmail.trim()) {
      setError(intl.formatMessage({ id: 'error.emailRequired' }));
      return;
    }

    if (!newMemberEmail.includes('@')) {
      setError(intl.formatMessage({ id: 'error.emailInvalid' }));
      return;
    }

    if (seznam?.members?.some(member => member.email === newMemberEmail)) {
      setError(intl.formatMessage({ id: 'error.memberExists' }));
      return;
    }

    // Pokud validace prošla, přidáme člena
    if (seznam) {
      onAddMember(seznam.id, newMemberEmail);
      setNewMemberEmail("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Dialog wrapper s responzivní šířkou a paddingem */}
      <DialogContent className="w-[95vw] max-w-lg mx-auto bg-[#f3f8e8] dark:bg-[#1a2412] border-[#7d9b69] dark:border-[#4e6a4d] p-4 sm:p-6">
        <DialogHeader>
          {/* Nadpis dialogu s responzivní velikostí písma */}
          <DialogTitle className="text-base sm:text-lg font-bold text-[#2d3e23] dark:text-[#e8f3e8]">
            {intl.formatMessage({ id: 'dialog.share.title' })}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-[#4e6a4d] dark:text-[#7d9b69]">
            {intl.formatMessage(
              { id: 'dialog.share.description' },
              { name: seznam?.nazev }
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Formulář pro přidání nového člena */}
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-sm sm:text-base font-medium text-[#2d3e23] dark:text-[#e8f3e8]"
              >
                {intl.formatMessage({ id: 'dialog.share.newMember' })}
                </Label>
              {/* Responzivní layout pro input a tlačítko */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="email"
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'dialog.share.emailPlaceholder' })}
                  className="flex-1 min-w-0 min-h-[44px]"
                />
                <Button 
                  type="submit"
                  className="w-full sm:w-auto min-h-[44px] bg-[#7d9b69] text-white hover:bg-[#4e6a4d]"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {intl.formatMessage({ id: 'dialog.share.add' })}
                </Button>
              </div>
              {/* Zobrazení chyby */}
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>
          </form>

           {/* Seznam členů */}
           <div className="space-y-4">
            <h4 className="text-sm sm:text-base font-semibold text-[#2d3e23] dark:text-[#e8f3e8]">
              {intl.formatMessage({ id: 'dialog.share.members' })}
            </h4>
            <div className="space-y-3">
              {seznam?.members?.map((member) => (
                <div 
                  key={member.id}
                  className="p-3 sm:p-4 rounded-lg bg-white dark:bg-[#2d3e23] border border-[#7d9b69] dark:border-[#4e6a4d]"
                >
                  {/* Informace o členovi */}
                  <div className="flex items-center gap-2 mb-2 sm:mb-0">
                    {member.isOwner ? (
                      <Crown className="w-4 h-4 text-[#7d9b69]" />
                    ) : (
                      <User className="w-4 h-4 text-[#7d9b69]" />
                    )}
                    <span className={`text-sm sm:text-base text-[#4e6a4d] ${
                      member.email === currentUserEmail ? 'font-medium' : ''
                    }`}>
                      {member.email}
                      {member.email === currentUserEmail && (
                        <span className="text-sm text-[#4e6a4d] dark:text-[#7d9b69] ml-2">
                          {intl.formatMessage({ id: 'dialog.share.youIndicator' })}
                        </span>
                      )}
                    </span>
                  </div>
                    {/* Akce pro člena (jen pro vlastníka) */}
                  {member.email !== currentUserEmail && 
                   seznam?.members?.some(m => m.email === currentUserEmail && m.isOwner) && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => seznam && onUpdateMemberRole(seznam.id, member.id, !member.isOwner)}
                        className="w-full sm:w-auto text-white bg-[#7d9b69] hover:bg-[#4e6a4d] min-h-[44px]"
                      >
                        {member.isOwner 
                          ? intl.formatMessage({ id: 'dialog.share.removeOwner' })
                          : intl.formatMessage({ id: 'dialog.share.addOwner' })
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => seznam && onRemoveMember(seznam.id, member.id)}
                        className="w-full sm:w-auto text-white bg-red-500 hover:bg-red-600 min-h-[44px]"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}