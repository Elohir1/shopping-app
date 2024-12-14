import React, { useState, ChangeEvent } from "react";

// Definice typů
interface Member {
  id: string;
  name: string;
  isOwner: boolean;
}

interface ShoppingItem {
  id: number;
  name: string;
  checked: boolean;
}

interface ShoppingListDetailProps {
  id?: string;
}

// Hlavní komponenta
const ShoppingListDetail: React.FC<ShoppingListDetailProps> = ({ id }) => {
  console.log("Aktuální ID seznamu:", id);

  const [listName, setListName] = useState<string>("Jezdecké vybavení");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newItemText, setNewItemText] = useState<string>("");
  const [showResolved, setShowResolved] = useState<boolean>(true);
  const [newMemberEmail, setNewMemberEmail] = useState<string>("");
  const [showMemberDialog, setShowMemberDialog] = useState<boolean>(false);
  
  // State pro členy a položky
  const [currentUser] = useState<Member>({
    id: "1",
    name: "Current User",
    isOwner: true
  });
  
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Current User", isOwner: true },
    { id: "2", name: "John Doe", isOwner: false },
    { id: "3", name: "Jane Smith", isOwner: false }
  ]);

  const [items, setItems] = useState<ShoppingItem[]>([
    { id: 1, name: "Jezdecká helma", checked: false },
    { id: 2, name: "Jezdecké boty", checked: false },
    { id: 3, name: "Jezdecké kalhoty", checked: true },
    { id: 4, name: "Sedlo", checked: false },
    { id: 5, name: "Uzda", checked: false },
    { id: 6, name: "Čištění na koně", checked: true },
    { id: 7, name: "Pamlsky pro koně", checked: false },
  ]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (currentUser.isOwner) {
      setListName(e.target.value);
    }
  };

  const handleSave = (): void => {
    if (currentUser.isOwner) {
      setIsEditing(false);
      console.log("Název seznamu změněn na:", listName);
    }
  };

  const handleCheckboxChange = (id: number): void => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddItem = (e: React.FormEvent): void => {
    e.preventDefault();
    if (newItemText.trim()) {
      const newItem: ShoppingItem = {
        id: items.length + 1,
        name: newItemText.trim(),
        checked: false,
      };
      setItems([...items, newItem]);
      setNewItemText("");
    }
  };

  const handleDeleteItem = (id: number): void => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAddMember = (e: React.FormEvent): void => {
    e.preventDefault();
    if (newMemberEmail.trim() && currentUser.isOwner) {
      const newMember: Member = {
        id: (members.length + 1).toString(),
        name: newMemberEmail.trim(),
        isOwner: false
      };
      setMembers([...members, newMember]);
      setNewMemberEmail("");
      setShowMemberDialog(false);
    }
  };

  const handleRemoveMember = (memberId: string): void => {
    if (currentUser.isOwner && memberId !== currentUser.id) {
      setMembers(members.filter(member => member.id !== memberId));
    }
  };

  const handleLeaveList = (): void => {
    if (!currentUser.isOwner) {
      console.log("Uživatel opustil seznam");
    }
  };

  const filteredItems = showResolved 
    ? items 
    : items.filter(item => !item.checked);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <button className="text-blue-600 hover:text-blue-800 flex items-center">
          <span className="mr-2">←</span> Zpět na seznamy
        </button>
        {currentUser.isOwner ? (
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowMemberDialog(true)}
          >
            Sdílet
          </button>
        ) : (
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleLeaveList}
          >
            Opustit seznam
          </button>
        )}
      </div>

      <div className="mb-6">
        {isEditing && currentUser.isOwner ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={listName}
              onChange={handleNameChange}
              placeholder="Zadejte nový název seznamu"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button 
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Uložit název
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{listName}</h1>
            {currentUser.isOwner && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                Upravit název
              </button>
            )}
          </div>
        )}
      </div>

      {showMemberDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Přidat člena</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Email nového člena"
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Přidat
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowMemberDialog(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Zrušit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-bold mb-2">Členové seznamu:</h3>
        <ul className="space-y-2">
          {members.map((member) => (
            <li key={member.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span>
                {member.name}
                {member.isOwner && (
                  <span className="text-sm text-gray-500 ml-2">(vlastník)</span>
                )}
              </span>
              {currentUser.isOwner && !member.isOwner && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Odebrat
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Přidat novou položku..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Přidat
        </button>
      </form>

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={() => setShowResolved(!showResolved)}
            className="w-4 h-4"
          />
          <span>Zobrazit vyřešené položky</span>
        </label>
      </div>

      <ul className="space-y-2">
        {filteredItems.map((item) => (
          <li 
            key={item.id} 
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheckboxChange(item.id)}
                className="w-4 h-4"
              />
              <span className={item.checked ? "line-through text-gray-500" : ""}>
                {item.name}
              </span>
            </div>
            <button 
              onClick={() => handleDeleteItem(item.id)}
              className="text-red-500 hover:text-red-700 text-xl"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingListDetail;