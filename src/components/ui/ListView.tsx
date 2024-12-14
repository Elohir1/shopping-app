import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ListItem from './ListItem';
import { Seznam } from '../../types';

interface ListViewProps {
  lists: Seznam[];
  onCreateList: (name: string) => Promise<void>;
  onUpdateList: (id: number, updates: Partial<Seznam>) => Promise<void>;
  onDeleteList: (id: number) => Promise<void>;
  onAddItem: (listId: number, itemName: string) => Promise<void>;
  onToggleItem: (listId: number, itemIndex: number) => Promise<void>;
  onToggleArchive: (listId: number) => Promise<void>;
}

const ListView = ({
  lists,
  onCreateList,
  onUpdateList,
  onDeleteList,
  onAddItem,
  onToggleItem,
  onToggleArchive
}: ListViewProps) => {
  const [newListName, setNewListName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      await onCreateList(newListName);
      setNewListName('');
    }
  };

  const activeLists = lists.filter(list => !list.archivovano);
  const archivedLists = lists.filter(list => list.archivovano);

  return (
    <div className="space-y-6">
      {/* Formulář pro vytvoření nového seznamu */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Název nového seznamu"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!newListName.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Vytvořit seznam
        </button>
      </form>

      {/* Aktivní seznamy */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Aktivní seznamy</h2>
        {activeLists.length === 0 ? (
          <p className="text-gray-500">Žádné aktivní seznamy</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeLists.map(list => (
              <ListItem
                key={list.id}
                list={list}
                onUpdate={onUpdateList}
                onDelete={onDeleteList}
                onAddItem={onAddItem}
                onToggleItem={onToggleItem}
                onToggleArchive={onToggleArchive}
              />
            ))}
          </div>
        )}
      </div>

      {/* Archivované seznamy */}
      {archivedLists.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">Archivované seznamy</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {archivedLists.map(list => (
              <ListItem
                key={list.id}
                list={list}
                onUpdate={onUpdateList}
                onDelete={onDeleteList}
                onAddItem={onAddItem}
                onToggleItem={onToggleItem}
                onToggleArchive={onToggleArchive}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListView;