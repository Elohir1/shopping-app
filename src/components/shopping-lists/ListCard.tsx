// src/components/shopping-lists/ListCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { MoreVertical, Edit2, Share, Archive, Trash2, ArchiveRestore } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

interface Member {
  id: string;
  email: string;
  isOwner: boolean;
}

interface Seznam {
  id: number;
  nazev: string;
  polozky: Array<{ nazev: string; splneno: boolean; }>;
  archivovano: boolean;
  members: Member[];
}

interface ListCardProps {
  seznam: Seznam;
  currentUserEmail: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onArchive: (id: number) => void;
  onUnarchive: (id: number) => void;
  onShare: (id: number) => void;
  onUpdateList: (id: number, updates: Partial<Seznam>) => void;
  onAddItem: (seznamId: number, nazev: string) => void;
  onDeleteItem: (seznamId: number, polozkaIndex: number) => void;
  onToggleItem: (seznamId: number, polozkaIndex: number) => void;
  onLeaveList: (seznamId: number) => void;
}

export const ListCard: React.FC<ListCardProps> = ({
  seznam,
  currentUserEmail,
  onDelete,
  onEdit,
  onArchive,
  onUnarchive,
  onShare,
}) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown-trigger')) {
      navigate(`/shopping-list/${seznam.id}`);
    }
  };

  const completedItems = seznam.polozky.filter(p => p.splneno).length;
  const totalItems = seznam.polozky.length;
  const currentUserMember = seznam.members.find(member => member.email === currentUserEmail);
  const isOwner = currentUserMember?.isOwner ?? false;

  return (
    <>
      <Card
        className={`bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow 
          ${seznam.archivovano ? 'opacity-75' : 'border-t-4'} 
          ${isOwner ? 'border-t-[#7d9b69]' : 'border-t-[#9ab68b]'}`}
        onClick={handleCardClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className={`text-lg ${seznam.archivovano ? 'text-gray-500' : 'text-[#2d3e23]'}`}>
              {seznam.nazev}
            </CardTitle>
            {isOwner && (
              <Badge variant="outline" className="bg-[#f3f8e8] text-[#4e6a4d] border-[#7d9b69]">
                Vlastník
              </Badge>
            )}
            {seznam.archivovano && (
              <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                Archivováno
              </Badge>
            )}
          </div>
          {currentUserMember && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-[#f3f8e8] dropdown-trigger"
                >
                  <span className="sr-only">Otevřít menu</span>
                  <MoreVertical className="h-4 w-4 text-[#4e6a4d]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[150px]">
                {isOwner && (
                  <>
                    <DropdownMenuItem 
                      onClick={() => onEdit(seznam.id)}
                      className="cursor-pointer hover:bg-[#f3f8e8]"
                    >
                      <Edit2 className="mr-2 h-4 w-4 text-[#4e6a4d]" />
                      <span>Upravit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onShare(seznam.id)}
                      className="cursor-pointer hover:bg-[#f3f8e8]"
                    >
                      <Share className="mr-2 h-4 w-4 text-[#4e6a4d]" />
                      <span>Sdílet</span>
                    </DropdownMenuItem>
                    {!seznam.archivovano ? (
                      <DropdownMenuItem 
                        onClick={() => setShowArchiveDialog(true)}
                        className="cursor-pointer hover:bg-[#f3f8e8]"
                      >
                        <Archive className="mr-2 h-4 w-4 text-[#4e6a4d]" />
                        <span>Archivovat</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        onClick={() => onUnarchive(seznam.id)}
                        className="cursor-pointer hover:bg-[#f3f8e8]"
                      >
                        <ArchiveRestore className="mr-2 h-4 w-4 text-[#4e6a4d]" />
                        <span>Obnovit</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="cursor-pointer hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Smazat</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1">
            <p className={`text-sm ${seznam.archivovano ? 'text-gray-400' : 'text-[#4e6a4d]'}`}>
              Počet položek: {totalItems}
              {totalItems > 0 && (
                <span className="ml-2">
                  (Splněno: {completedItems}/{totalItems})
                </span>
              )}
            </p>
            {totalItems > 0 && (
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#7d9b69] transition-all duration-300"
                  style={{ width: `${(completedItems / totalItems) * 100}%` }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete smazat tento seznam?</AlertDialogTitle>
            <AlertDialogDescription>
              Chystáte se smazat seznam "{seznam.nazev}". Tuto akci nelze vrátit zpět.
              {seznam.members.length > 1 && (
                <p className="mt-2 text-red-600">
                  Tento seznam je sdílen s dalšími členy. Smazáním seznamu odeberete přístup všem členům.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#7d9b69] text-[#7d9b69] hover:bg-[#f3f8e8]">
              Zrušit
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(seznam.id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Smazat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Archivovat seznam?</AlertDialogTitle>
            <AlertDialogDescription>
              Chystáte se archivovat seznam "{seznam.nazev}". 
              Archivované seznamy zůstanou přístupné, ale budou skryté z hlavního přehledu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#7d9b69] text-[#7d9b69] hover:bg-[#f3f8e8]">
              Zrušit
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onArchive(seznam.id);
                setShowArchiveDialog(false);
              }}
              className="bg-[#7d9b69] hover:bg-[#4e6a4d] text-white"
            >
              Archivovat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};