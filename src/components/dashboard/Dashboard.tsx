import React, { useState } from 'react';
import { PlusCircle, Archive, User, Search, ArchiveX } from 'lucide-react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { NewListDialog } from './NewListDialog';
import { ListCard } from '../shopping-lists/ListCard';
import { EditListDialog } from './EditListDialog';
import { ShareListDialog } from './ShareListDialog';
import { ThemeToggle } from "../ui/ThemeToggle";
import { useIntl } from 'react-intl';
import { Seznam } from '../../types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

// Typ pro podporované jazyky v aplikaci
type SupportedLocale = 'cs' | 'en' | 'it';

// Props interface pro Dashboard komponentu
interface DashboardProps {
  seznamy: Seznam[];                    // Seznam všech nákupních seznamů
  currentUserEmail: string;             // Email přihlášeného uživatele
  locale: SupportedLocale;             // Aktuální jazyk
  onLanguageChange: (locale: SupportedLocale) => void;  // Handler pro změnu jazyka
  onDeleteList: (id: number) => void;   // Handler pro smazání seznamu
  onArchiveList: (id: number) => void;
  onUnarchiveList: (id: number) => void;
  onCreateList: (name: string) => void;
  onUpdateList: (id: number, updates: Partial<Seznam>) => void;
  onAddItem: (seznamId: number, nazev: string) => void;
  onDeleteItem: (seznamId: number, polozkaIndex: number) => void;
  onToggleItem: (seznamId: number, polozkaIndex: number) => void;
  onLeaveList: (seznamId: number) => void;
}

export default function Dashboard({ 
  seznamy, 
  currentUserEmail,
  locale,
  onLanguageChange,
  onDeleteList,
  onArchiveList,
  onUnarchiveList,
  onCreateList,
  onUpdateList,
  onAddItem,
  onDeleteItem,
  onToggleItem,
  onLeaveList
}: DashboardProps) {
     // State pro modální okna
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // State pro filtrování a editaci
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editedList, setEditedList] = useState<Seznam | null>(null);
  const [sharedList, setSharedList] = useState<Seznam | null>(null);

  const intl = useIntl();

   // Konfigurace jazykových možností s vlajkami a popisky
  const languageOptions: Record<SupportedLocale, { label: string; flag: string }> = {
  cs: { label: 'Čeština', flag: '🇨🇿' },  // Unicode: \uD83C\uDDE8\uD83C\uDDFF
  en: { label: 'English', flag: '🇬🇧' },  // Unicode: \uD83C\uDDEC\uD83C\uDDE7
  it: { label: 'Italiano', flag: '🇮🇹' }  // Unicode: \uD83C\uDDEE\uD83C\uDDF9
};

   // Handler pro vytvoření nového seznamu
   const handleCreateList = (name: string) => {
    onCreateList(name);
    setIsNewListModalOpen(false);
  };

  const handleEdit = (id: number) => {
    const seznam = seznamy.find(s => s.id === id);
    if (seznam) {
      setEditedList(seznam);
      setIsEditListModalOpen(true);
    }
  };

  const handleEditSave = (id: number, newName: string) => {
    onUpdateList(id, { nazev: newName });
    setIsEditListModalOpen(false);
    setEditedList(null);
  };

  const handleShare = (id: number) => {
    const seznam = seznamy.find(s => s.id === id);
    if (seznam) {
      setSharedList(seznam);
      setIsShareModalOpen(true);
    }
  };

  const handleAddMember = (seznamId: number, email: string) => {
    const seznam = seznamy.find(s => s.id === seznamId);
    if (seznam) {
      const newMember = {
        id: Date.now().toString(),
        email,
        isOwner: false
      };
      onUpdateList(seznamId, {
        members: [...seznam.members, newMember]
      });
    }
  };

  const handleRemoveMember = (seznamId: number, memberId: string) => {
    const seznam = seznamy.find(s => s.id === seznamId);
    if (seznam) {
      onUpdateList(seznamId, {
        members: seznam.members.filter(member => member.id !== memberId)
      });
    }
  };

  const handleUpdateMemberRole = (seznamId: number, memberId: string, isOwner: boolean) => {
    const seznam = seznamy.find(s => s.id === seznamId);
    if (seznam) {
      onUpdateList(seznamId, {
        members: seznam.members.map(member =>
          member.id === memberId ? { ...member, isOwner } : member
        )
      });
    }
  };

  // Filtrace seznamů podle archivace a vyhledávání
  const filteredSeznamyState = seznamy
    .filter(seznam => showArchived ? true : !seznam.archivovano)
    .filter(seznam => 
      seznam.nazev.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const archivedCount = seznamy.filter(seznam => seznam.archivovano).length;
  const activeCount = seznamy.filter(seznam => !seznam.archivovano).length;

  return (
    <div className="min-h-screen bg-[#f3f8e8] dark:bg-[#1a2412]">
      {/* Vylepšení UI: Přidat max-width pro lepší čitelnost na velkých obrazovkách */}
      <div className="max-w-6xl mx-auto p-6 dark:text-white">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-[#2d3e23] dark:text-[#e8f3e8]">
              {intl.formatMessage({ id: 'app.title' })}
            </h1>
            <div className="flex space-x-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="rounded-full bg-[#c3d5ae] dark:bg-[#2d3e23] text-[#2d3e23] dark:text-white"
                  >
                    {languageOptions[locale].flag}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-white dark:bg-[#2d3e23] border-[#7d9b69] dark:border-[#4e6a4d]"
                >
                  {Object.entries(languageOptions).map(([key, { label, flag }]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => onLanguageChange(key as SupportedLocale)}
                      className={`text-[#2d3e23] dark:text-white
                        ${locale === key 
                          ? 'bg-[#e2ebd3] dark:bg-[#4e6a4d]' 
                          : 'hover:bg-[#f3f8e8] dark:hover:bg-[#1a2412]'
                        }`}
                    >
                      <span className="mr-2">{flag}</span>
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4e6a4d]" />
              <Input 
                data-testid="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text" 
                placeholder={intl.formatMessage({ id: 'app.searchPlaceholder' })}
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-full bg-white border-[#7d9b69] focus-visible:ring-[#4e6a4d]"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsNewListModalOpen(true)}
              className="rounded-full bg-[#7d9b69] text-white hover:bg-[#4e6a4d] border-none"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {intl.formatMessage({ id: 'app.button.new' })}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowArchived(!showArchived)}
              className={`rounded-full border-none ${
                showArchived 
                  ? 'bg-[#4e6a4d] hover:bg-[#2d3e23]' 
                  : 'bg-[#7d9b69] hover:bg-[#4e6a4d]'
              } text-white`}
            >
              {showArchived ? (
                <>
                  <ArchiveX className="w-4 h-4 mr-2" />
                  {intl.formatMessage({ id: 'app.button.active' })} ({activeCount})
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 mr-2" />
                  {intl.formatMessage({ id: 'app.button.archive' })} ({archivedCount})
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Vylepšení UI: Přidat animaci pro prázdný stav */}
        {filteredSeznamyState.length === 0 ? (
          <div className="text-center py-12 animate-fadeIn">
            <p className="text-[#4e6a4d] text-lg">
              {searchQuery 
                ? intl.formatMessage({ id: 'app.empty.noSearchResults' })
                : showArchived
                  ? intl.formatMessage({ id: 'app.empty.noArchived' })
                  : intl.formatMessage({ id: 'app.empty.noLists' })
              }
            </p>
          </div>
        ) : (
          // Vylepšení UI: Přidat animaci pro grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fadeIn">
            {filteredSeznamyState.map((seznam) => (
              <ListCard
                key={seznam.id}
                seznam={seznam}
                currentUserEmail={currentUserEmail}
                onDelete={onDeleteList}
                onEdit={handleEdit}
                onArchive={onArchiveList}
                onUnarchive={onUnarchiveList}
                onShare={handleShare}
                onUpdateList={onUpdateList}
                onAddItem={onAddItem}
                onDeleteItem={onDeleteItem}
                onToggleItem={onToggleItem}
                onLeaveList={onLeaveList}
              />
            ))}
          </div>
        )}

        {/* Modální okna */}
        <NewListDialog
          isOpen={isNewListModalOpen}
          onClose={() => setIsNewListModalOpen(false)}
          onCreateList={handleCreateList}
        />
        
        <EditListDialog
          isOpen={isEditListModalOpen}
          onClose={() => {
            setIsEditListModalOpen(false)
            setEditedList(null)
          }}
          onEditList={handleEditSave}
          seznam={editedList}
        />

        <ShareListDialog
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false)
            setSharedList(null)
          }}
          seznam={sharedList}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onUpdateMemberRole={handleUpdateMemberRole}
          currentUserEmail={currentUserEmail}
        />
      </div>
    </div>
  );
}