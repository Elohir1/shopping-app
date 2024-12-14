import React, { useState } from 'react';
import { Trash2, Archive, Check, Plus, MoreVertical, Users } from 'lucide-react';
import { Seznam } from '../../types';

interface ListItemProps {
  list: Seznam;
  onUpdate: (id: number, updates: Partial<Seznam>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onAddItem: (listId: number, itemName: string) => Promise<void>;
  onToggleItem: (listId: number, itemIndex: number) => Promise<void>;
  onToggleArchive: (listId: number) => Promise<void>;
}

const ListItem = ({
  list,
  onUpdate,
  onDelete,
  onAddItem,
  onToggleItem,
  onToggleArchive
}: ListItemProps) => {
  const [newItemName, setNewItemName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(list.nazev);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      await onAddItem(list.id, newItemName);
      setNewItemName('');
    }
  };

  const handleUpdateName = async () => {
    if (editedName.trim() && editedName !== list.nazev) {
      await onUpdate(list.id, { nazev: editedName });
      setIsEditing(false);
    }
  };

  const completedItems = list.polozky.filter(item => item.splneno).length;
  const totalItems = list.polozky.length;

  return (
    <div className={`p-4 rounded-lg border ${list.archivovano ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleUpdateName}
              onKeyPress={(e) => e.key === 'Enter' && handleUpdateName()}
              className="w-full px-2 py-1 border rounded"
              autoFocus
            />
          ) : (
            <h3
              className="text-lg font-semibold cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >
              {list.nazev}
            </h3>
          )}
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Users size={16} className="mr-1" />
            {list.members.length} {list.members.length === 1 ? 'člen' : 'členů'}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            data-testid="archive-button"
            onClick={() => onToggleArchive(list.id)}
            className="p-1 text-gray-500 hover:text-blue-600"
            title={list.archivovano ? 'Obnovit' : 'Archivovat'}
          >
            <Archive size={20} />
          </button>
          <button
            onClick={() => onDelete(list.id)}
            className="p-1 text-gray-500 hover:text-red-600"
            title="Smazat seznam"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{
              width: totalItems ? `${(completedItems / totalItems) * 100}%` : '0%'
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {completedItems} z {totalItems} splněno
        </p>
      </div>

      <ul className="space-y-2 mb-4">
        {list.polozky.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded"
          >
            <div className="flex items-center">
              <button
                onClick={() => onToggleItem(list.id, index)}
                className={`p-1 rounded-full border mr-2 ${
                  item.splneno
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300'
                }`}
              >
                {item.splneno && <Check size={16} />}
              </button>
              <span className={item.splneno ? 'line-through text-gray-500' : ''}>
                {item.nazev}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {!list.archivovano && (
        <form onSubmit={handleAddItem} className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Nová položka"
            className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newItemName.trim()}
            className="p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
          >
            <Plus size={20} />
          </button>
        </form>
      )}
    </div>
  );
};

export default ListItem;