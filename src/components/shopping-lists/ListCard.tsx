import React, { useState } from 'react';
import { Archive, Edit2, MoreVertical, Share, Trash2, X } from 'lucide-react';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import { Seznam } from '../../App';
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const isOwner = seznam.members.some(
    member => member.email === currentUserEmail && member.isOwner
  );

  const completedItems = seznam.polozky.filter(item => item.splneno).length;
  const totalItems = seznam.polozky.length;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(seznam.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting list:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchive = async () => {
    try {
      setIsArchiving(true);
      await onArchive(seznam.id);
      setShowArchiveDialog(false);
    } catch (error) {
      console.error('Error archiving list:', error);
    } finally {
      setIsArchiving(false);
    }
  };

  const intl = useIntl(); 

  return (
    <>
      <Card className="bg-white dark:bg-[#2d3e23]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Link 
            to={`/shopping-list/${seznam.id}`}
            className="flex-1 cursor-pointer"
          >
            <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[#2d3e23] dark:text-white">
                {seznam.nazev}
              </h3>
              {seznam.members.length > 1 && (
              <p className="text-sm text-[#4e6a4d] dark:text-[#c3d5ae]">
                {intl.formatMessage(
                  { id: 'list.sharedWith' }, 
                  { count: seznam.members.length - 1 }
                )}
              </p>
            )}
            </div>
          </Link>

          <div className="menu-area">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-[#f3f8e8] dark:hover:bg-[#4e6a4d] text-[#4e6a4d] dark:text-white hover:text-[#2d3e23] dark:hover:text-white"
                data-testid="menu-button"
                >
                  <span className="sr-only">Otevřít menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#2d3e23] border-[#7d9b69] dark:border-[#4e6a4d]">
              {isOwner && !seznam.archivovano && (
                <>
                  <DropdownMenuItem 
                    onClick={() => onEdit(seznam.id)} 
                    className="flex items-center px-3 py-2 text-white bg-[#7d9b69] hover:bg-[#4e6a4d]"
                    disabled={isEditing}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    {intl.formatMessage({ id: 'list.edit' })}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onShare(seznam.id)} 
                    className="flex items-center px-3 py-2 text-white bg-[#7d9b69] hover:bg-[#4e6a4d] mt-1"
                    disabled={isSharing}
                  >
                    <Share className="mr-2 h-4 w-4" />
                    {intl.formatMessage({ id: 'list.share' })}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowArchiveDialog(true)} 
                    className="flex items-center px-3 py-2 text-white bg-[#7d9b69] hover:bg-[#4e6a4d] mt-1"
                    disabled={isArchiving}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    {intl.formatMessage({ id: 'list.archive' })}
                  </DropdownMenuItem>
                </>
                )}
                {isOwner && seznam.archivovano && (
                  <DropdownMenuItem 
                    onClick={() => onUnarchive(seznam.id)} 
                    className="flex items-center px-3 py-2 text-white bg-[#7d9b69] hover:bg-[#4e6a4d]"
                    disabled={isArchiving}
                  >
                    <X className="mr-2 h-4 w-4" />
                    {intl.formatMessage({ id: 'list.unarchive' })}
                  </DropdownMenuItem>
                )}
                {isOwner && (
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)} 
                    className="flex items-center px-3 py-2 text-white bg-red-500 hover:bg-red-600 mt-1"
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {intl.formatMessage({ id: 'list.delete' })}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
        <Link to={`/shopping-list/${seznam.id}`}>
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Badge variant="secondary">
                {`${completedItems}/${totalItems} ${intl.formatMessage({ id: 'list.items' })}`}
              </Badge>
              {seznam.archivovano && (
                <Badge variant="default" className="bg-[#4e6a4d]">
                  {intl.formatMessage({ id: 'list.archived' })}
                </Badge>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#f3f8e8] dark:bg-[#2d3e23] border-[#7d9b69] dark:border-[#4e6a4d]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#2d3e23] dark:text-white text-lg font-bold">
              {intl.formatMessage({ id: 'dialog.delete.title' })}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#4e6a4d] dark:text-[#c3d5ae] text-base">
              {intl.formatMessage({ id: 'dialog.delete.description' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {intl.formatMessage({ id: 'dialog.cancel' })}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting 
                ? intl.formatMessage({ id: 'dialog.delete.inProgress' })
                : intl.formatMessage({ id: 'dialog.delete.confirm' })
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent className="bg-[#f3f8e8] dark:bg-[#1a2412] border-[#7d9b69] dark:border-[#4e6a4d]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#2d3e23] dark:text-[#e8f3e8] text-lg font-bold">
              {intl.formatMessage({ id: 'dialog.archive.title' })}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#4e6a4d] dark:text-[#7d9b69]">
              {intl.formatMessage({ id: 'dialog.archive.description' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isArchiving}>
              {intl.formatMessage({ id: 'dialog.cancel' })}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              disabled={isArchiving}
              className="bg-[#7d9b69] hover:bg-[#4e6a4d] text-white"
            >
              {isArchiving 
                ? intl.formatMessage({ id: 'dialog.archive.inProgress' })
                : intl.formatMessage({ id: 'dialog.archive.confirm' })
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};