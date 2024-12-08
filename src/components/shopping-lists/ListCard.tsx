import React, { useState } from 'react';
import { Archive, Edit2, MoreVertical, Share, Trash2, X } from 'lucide-react';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
import { Badge } from "../ui/badge";
import { Seznam } from '../../App';

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
  onUpdateList,
  onAddItem,
  onDeleteItem,
  onToggleItem,
  onLeaveList
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const isOwner = seznam.members.some(
    member => member.email === currentUserEmail && member.isOwner
  );

  const completedItems = seznam.polozky.filter(item => item.splneno).length;
  const totalItems = seznam.polozky.length;

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete(seznam.id);
  };

  const handleArchive = () => {
    setShowArchiveDialog(false);
    onArchive(seznam.id);
  };

  return (
    <>
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[#2d3e23]">
              {seznam.nazev}
            </h3>
            {seznam.members.length > 1 && (
              <p className="text-sm text-[#4e6a4d]">
                Sdíleno s {seznam.members.length - 1} uživateli
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-[#f3f8e8] text-[#4e6a4d] hover:text-[#2d3e23]"
              >
                <span className="sr-only">Otevřít menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-white border border-[#7d9b69] shadow-lg"
            >
              {isOwner && !seznam.archivovano && (
                <>
                  <DropdownMenuItem 
                    onClick={() => onEdit(seznam.id)}
                    className="flex items-center px-3 py-2 text-white bg-[#7d9b69] hover:bg-[#4e6a4d] cursor-pointer"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Upravit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onShare(seznam.id)}
                    className="flex items-center px-3 py-2 text-white bg-[#7d9b69] hover:bg-[#4e6a4d] cursor-pointer mt-1"
                  >
                    <Share className="mr-2 h-4 w-4" />
                    Sdílet
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowArchiveDialog(true)}
                    className="flex items-center px-3 py-2 text-white bg-[#7d9b69] hover:bg-[#4e6a4d] cursor-pointer mt-1"
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archivovat
                  </DropdownMenuItem>
                </>
              )}
              {isOwner && seznam.archivovano && (
                <DropdownMenuItem 
                  onClick={() => onUnarchive(seznam.id)}
                  className="flex items-center px-3 py-2 text-white bg-[#7d9b69] hover:bg-[#4e6a4d] cursor-pointer"
                >
                  <X className="mr-2 h-4 w-4" />
                  Zrušit archivaci
                </DropdownMenuItem>
              )}
              {isOwner && (
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center px-3 py-2 text-white bg-red-500 hover:bg-red-600 cursor-pointer mt-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Smazat
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Badge variant="secondary">
                {completedItems}/{totalItems} položek
              </Badge>
              {seznam.archivovano && (
                <Badge variant="default" className="bg-[#4e6a4d]">
                  Archivováno
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#f3f8e8] border-[#7d9b69]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#2d3e23] text-lg font-bold">Smazat seznam</AlertDialogTitle>
            <AlertDialogDescription className="text-[#4e6a4d] text-base">
              Opravdu si přejete seznam smazat? Tuto akci nelze vrátit zpět.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#7d9b69] text-[#4e6a4d] hover:bg-[#e2ebd3] hover:text-[#2d3e23]">
              Zrušit
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              Smazat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent className="bg-[#f3f8e8] border-[#7d9b69]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#2d3e23] text-lg font-bold">Archivovat seznam</AlertDialogTitle>
            <AlertDialogDescription className="text-[#4e6a4d] text-base">
              Opravdu si přejete seznam archivovat?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#7d9b69] text-[#4e6a4d] hover:bg-[#e2ebd3] hover:text-[#2d3e23]">
              Zrušit
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className="bg-[#7d9b69] hover:bg-[#4e6a4d] text-white font-semibold"
            >
              Archivovat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};