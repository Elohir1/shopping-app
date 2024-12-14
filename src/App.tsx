import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/dashboard/Dashboard';
import { ShoppingListDetail } from './components/shopping-lists/ShoppingListDetail';
import { ApiService } from './api/apiService';
import { Alert, AlertDescription } from "./components/ui/alert";
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorMessage from './components/ui/ErrorMessage';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Načtení seznamů při startu aplikace
  useEffect(() => {
    loadSeznamyData();
  }, []);

  // Funkce pro načtení dat ze serveru
  const loadSeznamyData = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllLists();
      setSeznamyState(data);
      setError(null);
    } catch (err) {
      setError('Nepodařilo se načíst seznamy');
      console.error('Error loading lists:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handler pro označení položky jako splněné/nesplněné
  const handleToggleItem = async (seznamId: number, polozkaIndex: number) => {
    try {
      await ApiService.toggleItem(seznamId, polozkaIndex);
      // Aktualizace lokálního stavu
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
    } catch (err) {
      setError('Nepodařilo se změnit stav položky');
      console.error('Error toggling item:', err);
    }
  };

  // Handler pro vytvoření nového seznamu
  const handleCreateList = async (name: string) => {
    try {
      const newList = await ApiService.createList(name);
      setSeznamyState(prev => [...prev, newList]);
    } catch (err) {
      setError('Nepodařilo se vytvořit nový seznam');
      console.error('Error creating list:', err);
    }
  };

  // Handler pro smazání seznamu
  const handleDeleteList = async (id: number) => {
    try {
      await ApiService.deleteList(id);
      setSeznamyState(prev => prev.filter(seznam => seznam.id !== id));
    } catch (err) {
      setError('Nepodařilo se smazat seznam');
      console.error('Error deleting list:', err);
    }
  };

  // Handler pro aktualizaci seznamu
  const handleUpdateList = async (id: number, updates: Partial<Seznam>) => {
    try {
      await ApiService.updateList(id, updates);
      setSeznamyState(prev => 
        prev.map(seznam => 
          seznam.id === id ? { ...seznam, ...updates } : seznam
        )
      );
    } catch (err) {
      setError('Nepodařilo se aktualizovat seznam');
      console.error('Error updating list:', err);
    }
  };

  // Handler pro archivaci seznamu
  const handleArchiveList = async (id: number) => {
    try {
      await ApiService.toggleArchive(id);
      setSeznamyState(prev =>
        prev.map(seznam =>
          seznam.id === id ? { ...seznam, archivovano: true } : seznam
        )
      );
    } catch (err) {
      setError('Nepodařilo se archivovat seznam');
      console.error('Error archiving list:', err);
    }
  };

  // Handler pro zrušení archivace seznamu
  const handleUnarchiveList = async (id: number) => {
    try {
      await ApiService.toggleArchive(id);
      setSeznamyState(prev =>
        prev.map(seznam =>
          seznam.id === id ? { ...seznam, archivovano: false } : seznam
        )
      );
    } catch (err) {
      setError('Nepodařilo se zrušit archivaci seznamu');
      console.error('Error unarchiving list:', err);
    }
  };

  // Handler pro přidání položky
  const handleAddItem = async (seznamId: number, nazev: string) => {
    try {
      await ApiService.addItem(seznamId, nazev);
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
    } catch (err) {
      setError('Nepodařilo se přidat položku');
      console.error('Error adding item:', err);
    }
  };

  // Handler pro smazání položky
  const handleDeleteItem = async (seznamId: number, polozkaIndex: number) => {
    try {
      await ApiService.deleteItem(seznamId, polozkaIndex);
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
    } catch (err) {
      setError('Nepodařilo se smazat položku');
      console.error('Error deleting item:', err);
    }
  };

  // Handler pro opuštění seznamu
  const handleLeaveList = async (seznamId: number) => {
    try {
      await ApiService.removeMember(seznamId, 'current-user-id'); // V reálné aplikaci byste použili skutečné ID uživatele
      setSeznamyState(prev => 
        prev.filter(seznam => seznam.id !== seznamId)
      );
    } catch (err) {
      setError('Nepodařilo se opustit seznam');
      console.error('Error leaving list:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-[#4e6a4d]">Načítání...</p>
    </div>;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {loading ? (
          <LoadingSpinner size="large" message="Načítám seznamy..." />
        ) : (
          <>
            {error && (
              <ErrorMessage
                message={error}
                variant="destructive"
                onRetry={loadSeznamyData}
              />
            )}
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={
                  <Dashboard 
                    seznamy={seznamy}
                    currentUserEmail={currentUserEmail}
                    onDeleteList={handleDeleteList}
                    onArchiveList={handleArchiveList}
                    onUnarchiveList={handleUnarchiveList}
                    onCreateList={handleCreateList}
                    onUpdateList={handleUpdateList}
                    onAddItem={handleAddItem}
                    onDeleteItem={handleDeleteItem}
                    onToggleItem={handleToggleItem}
                    onLeaveList={handleLeaveList}
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
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;