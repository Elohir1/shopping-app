'use client'

import { useState } from 'react'
import { PlusCircle, Archive, User, Search, ArchiveX } from 'lucide-react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { NewListDialog } from './NewListDialog'
import { ListCard } from '../shopping-lists/ListCard'
import { EditListDialog } from './EditListDialog'
import { ShareListDialog } from './ShareListDialog'

interface Member {
  id: string;
  email: string;
  isOwner: boolean;
}

interface Seznam {
  id: number;
  nazev: string;
  polozky: { nazev: string; splneno: boolean; }[];
  archivovano: boolean;
  members: Member[];
}

interface DashboardProps {
  seznamy: Seznam[];
  currentUserEmail: string;
  setSeznamyState: React.Dispatch<React.SetStateAction<Seznam[]>>;
  handleUpdateList: (id: number, updates: Partial<Seznam>) => void;
  handleAddItem: (seznamId: number, nazev: string) => void;
  handleDeleteItem: (seznamId: number, polozkaIndex: number) => void;
  handleToggleItem: (seznamId: number, polozkaIndex: number) => void;
  handleLeaveList: (seznamId: number) => void;
}

export default function Dashboard({ 
  seznamy, 
  setSeznamyState, 
  currentUserEmail,
  handleUpdateList,
  handleAddItem,
  handleDeleteItem,
  handleToggleItem,
  handleLeaveList
}: DashboardProps) {

  const handleAddMember = (seznamId: number, email: string) => {
    setSeznamyState(prev =>
      prev.map(seznam =>
        seznam.id === seznamId
          ? {
              ...seznam,
              members: [
                ...seznam.members,
                { id: Date.now().toString(), email, isOwner: false }
              ]
            }
          : seznam
      )
    )
  }
  
  const handleRemoveMember = (seznamId: number, memberId: string) => {
    setSeznamyState(prev =>
      prev.map(seznam =>
        seznam.id === seznamId
          ? {
              ...seznam,
              members: seznam.members.filter(member => member.id !== memberId)
            }
          : seznam
      )
    )
  }
  
  const handleUpdateMemberRole = (seznamId: number, memberId: string, isOwner: boolean) => {
    setSeznamyState(prev =>
      prev.map(seznam =>
        seznam.id === seznamId
          ? {
              ...seznam,
              members: seznam.members.map(member =>
                member.id === memberId
                  ? { ...member, isOwner }
                  : member
              )
            }
          : seznam
      )
    )
  }
  // Aktualizace seznamu (název, členové, atd.)
// const handleUpdateList = (id: number, updates: Partial<Seznam>) => {
//   setSeznamyState(prev =>
//     prev.map(seznam =>
//       seznam.id === id ? { ...seznam, ...updates } : seznam
//     )
//   );
// };

// // Přidání nové položky do seznamu
// const handleAddItem = (seznamId: number, nazev: string) => {
//   setSeznamyState(prev =>
//     prev.map(seznam =>
//       seznam.id === seznamId
//         ? {
//             ...seznam,
//             polozky: [...seznam.polozky, { nazev, splneno: false }]
//           }
//         : seznam
//     )
//   );
// };

// // Smazání položky ze seznamu
// const handleDeleteItem = (seznamId: number, polozkaIndex: number) => {
//   setSeznamyState(prev =>
//     prev.map(seznam =>
//       seznam.id === seznamId
//         ? {
//             ...seznam,
//             polozky: seznam.polozky.filter((_, index) => index !== polozkaIndex)
//           }
//         : seznam
//     )
//   );
// };

// // Změna stavu položky (splněno/nesplněno)
// const handleToggleItem = (seznamId: number, polozkaIndex: number) => {
//   setSeznamyState(prev =>
//     prev.map(seznam =>
//       seznam.id === seznamId
//         ? {
//             ...seznam,
//             polozky: seznam.polozky.map((polozka, index) =>
//               index === polozkaIndex
//                 ? { ...polozka, splneno: !polozka.splneno }
//                 : polozka
//             )
//           }
//         : seznam
//     )
//   );
// };

// // Opuštění seznamu
// const handleLeaveList = (seznamId: number) => {
//   setSeznamyState(prev =>
//     prev.map(seznam =>
//       seznam.id === seznamId
//         ? {
//             ...seznam,
//             members: seznam.members.filter(member => member.email !== currentUserEmail)
//           }
//         : seznam
//     )
//   );
// };

   // State pro modální okna
   const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
   const [showArchived, setShowArchived] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
   const [editedList, setEditedList] = useState<Seznam | null>(null);
   const [isShareModalOpen, setIsShareModalOpen] = useState(false);
   const [sharedList, setSharedList] = useState<Seznam | null>(null);
 
   const handleCreateList = (name: string) => {
     const newList: Seznam = {
       id: Date.now(),
       nazev: name,
       polozky: [],
       archivovano: false,
       members: [
         { id: "1", email: currentUserEmail, isOwner: true }
       ]
     };
     setSeznamyState(prev => [...prev, newList]);
   };

  const handleArchive = (id: number) => {
    setSeznamyState(prev =>
      prev.map(seznam =>
        seznam.id === id ? { ...seznam, archivovano: true } : seznam
      )
    )
  }

  const handleUnarchive = (id: number) => {
    setSeznamyState(prev =>
      prev.map(seznam =>
        seznam.id === id ? { ...seznam, archivovano: false } : seznam
      )
    )
  }

  const handleDelete = (id: number) => {
    setSeznamyState(prev => prev.filter(seznam => seznam.id !== id))
  }

  const handleEdit = (id: number) => {
    const seznam = seznamy.find(s => s.id === id)
    if (seznam) {
      setEditedList(seznam)
      setIsEditListModalOpen(true)
    }
  }

  const handleEditSave = (id: number, newName: string) => {
    setSeznamyState(prev =>
      prev.map(seznam =>
        seznam.id === id
          ? { ...seznam, nazev: newName }
          : seznam
      )
    )
  }

  const handleShare = (id: number) => {
    const seznam = seznamy.find(s => s.id === id)
    if (seznam) {
      setSharedList(seznam)
      setIsShareModalOpen(true)
    }
  }

  const filteredSeznamyState = seznamy
    .filter(seznam => showArchived ? true : !seznam.archivovano)
    .filter(seznam => 
      seznam.nazev.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const archivedCount = seznamy.filter(seznam => seznam.archivovano).length
  const activeCount = seznamy.filter(seznam => !seznam.archivovano).length

  return (
    <div className="min-h-screen bg-[#f3f8e8]">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-[#2d3e23]">Nákupní seznamy</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-[#c3d5ae] text-[#2d3e23] hover:bg-[#7d9b69] hover:text-white"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4e6a4d]" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text" 
                placeholder="Hledat seznamy..." 
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-full bg-white border-[#7d9b69] focus-visible:ring-[#4e6a4d]"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsNewListModalOpen(true)}
              className="rounded-full bg-[#7d9b69] text-white hover:bg-[#4e6a4d] border-none"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Nový
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
                  Aktivní ({activeCount})
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 mr-2" />
                  Archiv ({archivedCount})
                </>
              )}
            </Button>
          </div>
        </header>

        {filteredSeznamyState.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4e6a4d] text-lg">
              {searchQuery 
                ? "Nenalezeny žádné seznamy odpovídající vašemu hledání" 
                : showArchived
                  ? "Žádné archivované seznamy"
                  : "Zatím nemáte žádné nákupní seznamy"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredSeznamyState.map((seznam) => (
    <ListCard
      key={seznam.id}
      seznam={seznam}
      currentUserEmail={currentUserEmail}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onArchive={handleArchive}
      onUnarchive={handleUnarchive}
      onShare={handleShare}
      onUpdateList={handleUpdateList}
      onAddItem={handleAddItem}
      onDeleteItem={handleDeleteItem}
      onToggleItem={handleToggleItem}
      onLeaveList={handleLeaveList}
    />
  ))}
</div>
        )}

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
  )
}