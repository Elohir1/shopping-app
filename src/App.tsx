import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/dashboard/Dashboard';
import { ShoppingListDetail } from './components/shopping-lists/ShoppingListDetail';

export interface Seznam {
  id: number;
  nazev: string;
  polozky: { nazev: string; splneno: boolean; }[];
  archivovano: boolean;
  members: Array<{
    id: string;
    email: string;
    isOwner: boolean;
  }>;
}

function App() {
  const currentUserEmail = "user@example.com";
  const [seznamy, setSeznamyState] = useState<Seznam[]>([]);

  // Přidán handler pro přepínání položek
  const handleToggleItem = (seznamId: number, polozkaIndex: number) => {
    setSeznamyState(prev => 
      prev.map(seznam => {
        if (seznam.id === seznamId) {
          const newPolozky = [...seznam.polozky];
          newPolozky[polozkaIndex] = {
            ...newPolozky[polozkaIndex],
            splneno: !newPolozky[polozkaIndex].splneno
          };
          return { ...seznam, polozky: newPolozky };
        }
        return seznam;
      })
    );
  };

  const handleCreateList = (name: string) => {
    const newList: Seznam = {
      id: Date.now(),
      nazev: name,
      polozky: [],
      archivovano: false,
      members: [{ id: '1', email: currentUserEmail, isOwner: true }]
    };
    setSeznamyState(prev => [...prev, newList]);
  };

  const handleDeleteList = (id: number) => {
    const seznam = seznamy.find(s => s.id === id);
    const userIsMember = seznam?.members.find(m => m.email === currentUserEmail);
    const userIsOwner = userIsMember?.isOwner;
  
    if (userIsOwner) {
      setSeznamyState(prev => prev.filter(seznam => seznam.id !== id));
    }
  };

  const handleUpdateList = (id: number, updates: Partial<Seznam>) => {
    setSeznamyState(prev => 
      prev.map(seznam => 
        seznam.id === id ? { ...seznam, ...updates } : seznam
      )
    );
  };

  const handleArchiveList = (id: number) => {
    setSeznamyState(prev =>
      prev.map(seznam =>
        seznam.id === id ? { ...seznam, archivovano: true } : seznam
      )
    );
  };

  const handleUnarchiveList = (id: number) => {
    setSeznamyState(prev =>
      prev.map(seznam =>
        seznam.id === id ? { ...seznam, archivovano: false } : seznam
      )
    );
  };

  const handleAddItem = (seznamId: number, nazev: string) => {
    setSeznamyState(prev => 
      prev.map(seznam => {
        if (seznam.id === seznamId) {
          return {
            ...seznam,
            polozky: [...seznam.polozky, { nazev, splneno: false }]
          };
        }
        return seznam;
      })
    );
  };

  const handleDeleteItem = (seznamId: number, polozkaIndex: number) => {
    setSeznamyState(prev => 
      prev.map(seznam => {
        if (seznam.id === seznamId) {
          return {
            ...seznam,
            polozky: seznam.polozky.filter((_, index) => index !== polozkaIndex)
          };
        }
        return seznam;
      })
    );
  };

  // Přidán handler pro opuštění seznamu
  const handleLeaveList = (seznamId: number) => {
    setSeznamyState(prev => 
      prev.map(seznam => {
        if (seznam.id === seznamId) {
          return {
            ...seznam,
            members: seznam.members.filter(member => member.email !== currentUserEmail)
          };
        }
        return seznam;
      })
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <Dashboard 
            seznamy={seznamy}
            currentUserEmail={currentUserEmail}
            setSeznamyState={setSeznamyState}
            handleUpdateList={handleUpdateList}
            handleAddItem={handleAddItem}
            handleDeleteItem={handleDeleteItem}
            handleToggleItem={handleToggleItem}
            handleLeaveList={handleLeaveList}
          />
        } />
        <Route 
          path="/shopping-list/:id" 
          element={
            <ShoppingListDetail 
              seznamy={seznamy}
              currentUserEmail={currentUserEmail}
              onUpdateList={handleUpdateList}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onToggleItem={handleToggleItem}
              onLeaveList={handleLeaveList}
            />
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;