import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Seznam } from '../../App';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Card, CardHeader, CardContent } from "../ui/card";
import { ArrowLeft, X, Edit2, Share, LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useIntl } from 'react-intl';

interface ShoppingListDetailProps {
  seznamy: Seznam[];
  currentUserEmail: string;
  onUpdateList: (id: number, updates: Partial<Seznam>) => void;
  onAddItem: (seznamId: number, nazev: string) => void;
  onDeleteItem: (seznamId: number, polozkaIndex: number) => void;
  onToggleItem: (seznamId: number, polozkaIndex: number) => void;
  onLeaveList?: (seznamId: number) => void;
}

export const ShoppingListDetail: React.FC<ShoppingListDetailProps> = ({
  seznamy,
  currentUserEmail,
  onUpdateList,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onLeaveList,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [seznam, setSeznam] = useState<Seznam | null>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [showResolved, setShowResolved] = useState(true);
  const [editedName, setEditedName] = useState("");

  // Načtení seznamu podle ID z URL
  useEffect(() => {
    if (id) {
      const foundSeznam = seznamy.find(s => s.id === Number(id));
      if (foundSeznam) {
        setSeznam(foundSeznam);
        setEditedName(foundSeznam.nazev);
      } else {
        navigate('/');
      }
    }
  }, [id, seznamy, navigate]);

  if (!seznam) return null;

  // Kontrola práv uživatele
  const currentUserRole = seznam.members.find(member => member.email === currentUserEmail);
  const isOwner = currentUserRole?.isOwner ?? false;

  const handleNameSave = () => {
    if (isOwner && editedName.trim() !== seznam.nazev) {
      onUpdateList(seznam.id, { nazev: editedName.trim() });
    }
    setIsEditing(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      onAddItem(seznam.id, newItemText.trim());
      setNewItemText("");
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberEmail.trim() && isOwner) {
      const newMember = {
        id: (seznam.members.length + 1).toString(),
        email: newMemberEmail.trim(),
        isOwner: false
      };
      onUpdateList(seznam.id, {
        members: [...seznam.members, newMember]
      });
      setNewMemberEmail("");
      setShowMemberDialog(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (isOwner && memberId !== currentUserRole?.id) {
      onUpdateList(seznam.id, {
        members: seznam.members.filter(member => member.id !== memberId)
      });
    }
  };

  const handleLeave = () => {
    if (!isOwner && onLeaveList) {
      onLeaveList(seznam.id);
      navigate('/');
    }
  };

  const filteredItems = showResolved 
    ? seznam.polozky 
    : seznam.polozky.filter(item => !item.splneno);

    const intl = useIntl();

    return (
      <div className="min-h-screen bg-[#f3f8e8] dark:bg-[#1a2412] p-6">
        <Card className="max-w-4xl mx-auto bg-white dark:bg-[#2d3e23] border-[#7d9b69] dark:border-[#4e6a4d]">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-[#4e6a4d] dark:text-[#7d9b69] hover:text-[#2d3e23] dark:hover:text-[#e8f3e8] hover:bg-[#f3f8e8] dark:hover:bg-[#1a2412]"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {intl.formatMessage({ id: 'detail.backToLists' })}
              </Button>
              {seznam.archivovano && isOwner && (
                <Button 
                  onClick={() => onUpdateList(seznam.id, { archivovano: false })}
                  className="bg-[#7d9b69] dark:bg-[#4e6a4d] text-white hover:bg-[#4e6a4d] dark:hover:bg-[#2d3e23]"
                >
                  <X className="w-4 h-4 mr-2" />
                  {intl.formatMessage({ id: 'detail.unarchive' })}
                </Button>
              )}
            </div>
            {currentUserRole && (
              isOwner ? (
                <Button
                  variant="outline"
                  onClick={() => setShowMemberDialog(true)}
                  className="bg-[#7d9b69] dark:bg-[#4e6a4d] text-white hover:bg-[#4e6a4d] dark:hover:bg-[#2d3e23] border-none"
                >
                  <Share className="w-4 h-4 mr-2" />
                  {intl.formatMessage({ id: 'detail.share' })}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={handleLeave}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {intl.formatMessage({ id: 'detail.leaveList' })}
                </Button>
              )
            )}
          </CardHeader>
    
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              {isEditing && isOwner ? (
                <div className="flex gap-2 w-full">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder={intl.formatMessage({ id: 'detail.listNamePlaceholder' })}
                    className="border-[#7d9b69] dark:border-[#4e6a4d] bg-white dark:bg-[#2d3e23] dark:text-white focus-visible:ring-[#4e6a4d]"
                  />
                  <Button
                    onClick={handleNameSave}
                    className="bg-[#7d9b69] dark:bg-[#4e6a4d] text-white hover:bg-[#4e6a4d] dark:hover:bg-[#2d3e23]"
                  >
                    {intl.formatMessage({ id: 'detail.saveName' })}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-2xl font-bold text-[#2d3e23] dark:text-white">{seznam.nazev}</h2>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="text-[#4e6a4d] dark:text-[#7d9b69] hover:text-[#2d3e23] dark:hover:text-white"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {intl.formatMessage({ id: 'detail.editName' })}
                    </Button>
                  )}
                </div>
              )}
            </div>
    
            <div>
              <h3 className="font-bold mb-2 text-[#2d3e23] dark:text-white">
                {intl.formatMessage({ id: 'detail.members' })}
              </h3>
              <ul className="space-y-2">
                {seznam.members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between bg-[#f3f8e8] dark:bg-[#1a2412] p-2 rounded"
                  >
                    <span className="dark:text-white">
                      {member.email}
                      {member.isOwner && (
                        <span className="text-sm text-[#4e6a4d] dark:text-[#7d9b69] ml-2">
                          {intl.formatMessage({ id: 'detail.owner' })}
                        </span>
                      )}
                      {member.email === currentUserEmail && (
                        <span className="text-sm text-[#4e6a4d] dark:text-[#7d9b69] ml-2">
                          {intl.formatMessage({ id: 'detail.you' })}
                        </span>
                      )}
                    </span>
                    {isOwner && !member.isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
    
            <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
              <DialogContent className="bg-[#f3f8e8] dark:bg-[#1a2412] border-[#7d9b69] dark:border-[#4e6a4d]">
                <DialogHeader>
                  <DialogTitle className="text-[#2d3e23] dark:text-[#e8f3e8] text-lg font-bold">
                    {intl.formatMessage({ id: 'dialog.addMember.title' })}
                  </DialogTitle>
                  <DialogDescription className="text-[#4e6a4d] dark:text-[#7d9b69] text-base">
                    {intl.formatMessage({ id: 'dialog.addMember.description' })}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMember}>
                  <div className="space-y-4 py-4">
                    <Input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder={intl.formatMessage({ id: 'dialog.addMember.emailPlaceholder' })}  // Zde je změna
                      className="border-[#7d9b69] dark:border-[#4e6a4d] bg-white dark:bg-[#2d3e23] dark:text-white focus-visible:ring-[#4e6a4d]"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMemberDialog(false)}
                      className="border-[#7d9b69] dark:border-[#4e6a4d] text-[#7d9b69] dark:text-[#7d9b69] hover:bg-[#f3f8e8] dark:hover:bg-[#1a2412]"
                    >
                      {intl.formatMessage({ id: 'dialog.cancel' })}
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#7d9b69] dark:bg-[#4e6a4d] text-white hover:bg-[#4e6a4d] dark:hover:bg-[#2d3e23]"
                    >
                      {intl.formatMessage({ id: 'dialog.addMember.add' })}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
    
            <form onSubmit={handleAddItem} className="flex gap-2">
              <Input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder={intl.formatMessage({ id: 'detail.addNewItem' })}
                className="border-[#7d9b69] dark:border-[#4e6a4d] bg-white dark:bg-[#2d3e23] dark:text-white focus-visible:ring-[#4e6a4d]"
              />
              <Button
                type="submit"
                className="bg-[#7d9b69] dark:bg-[#4e6a4d] text-white hover:bg-[#4e6a4d] dark:hover:bg-[#2d3e23]"
              >
                {intl.formatMessage({ id: 'detail.add' })}
              </Button>
            </form>
    
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-resolved"
                checked={showResolved}
                onCheckedChange={() => setShowResolved(!showResolved)}
              />
              <label
                htmlFor="show-resolved"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
              >
                {intl.formatMessage({ id: 'detail.showCompleted' })}
              </label>
            </div>
    
            <ul className="space-y-2">
              {filteredItems.map((polozka, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-[#f3f8e8] dark:bg-[#1a2412] rounded"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`item-${index}`}
                      checked={polozka.splneno}
                      onCheckedChange={() => onToggleItem(seznam.id, index)}
                    />
                    <label
                      htmlFor={`item-${index}`}
                      className={`${
                        polozka.splneno 
                          ? 'line-through text-[#4e6a4d] dark:text-[#7d9b69]' 
                          : 'text-[#2d3e23] dark:text-white'
                      }`}
                    >
                      {polozka.nazev}
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteItem(seznam.id, index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
   };