import React, { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../api/apiService';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';
import ListView from './ui/ListView';
import { Seznam } from '../types';

const ListContainer = () => {
  const [lists, setLists] = useState<Seznam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ApiService.getAllLists();
      setLists(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Nastala neočekávaná chyba'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const handleCreateList = async (name: string) => {
    try {
      setError(null);
      const newList = await ApiService.createList(name);
      setLists(prev => [...prev, newList]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Nepodařilo se vytvořit seznam'));
    }
  };

  const handleUpdateList = async (id: number, updates: Partial<Seznam>) => {
    try {
      setError(null);
      const updatedList = await ApiService.updateList(id, updates);
      setLists(prev => prev.map(list => 
        list.id === id ? updatedList : list
      ));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Nepodařilo se aktualizovat seznam'));
    }
  };

  const handleDeleteList = async (id: number) => {
    try {
      setError(null);
      await ApiService.deleteList(id);
      setLists(prev => prev.filter(list => list.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Nepodařilo se smazat seznam'));
    }
  };

  const handleAddItem = async (listId: number, itemName: string) => {
    try {
      setError(null);
      await ApiService.addItem(listId, itemName);
      // Znovu načteme seznamy pro získání aktuálních dat
      await loadLists();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Nepodařilo se přidat položku'));
    }
  };

  const handleToggleItem = async (listId: number, itemIndex: number) => {
    try {
      setError(null);
      await ApiService.toggleItem(listId, itemIndex);
      await loadLists();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Nepodařilo se změnit stav položky'));
    }
  };

  const handleToggleArchive = async (listId: number) => {
    try {
      setError(null);
      await ApiService.toggleArchive(listId);
      await loadLists();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Nepodařilo se změnit stav archivace'));
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" message="Načítám seznamy..." />;
  }

  return (
    <div className="container mx-auto p-4">
      {error && (
        <ErrorMessage
          message={error.message}
          onRetry={loadLists}
        />
      )}
      <ListView
        lists={lists}
        onCreateList={handleCreateList}
        onUpdateList={handleUpdateList}
        onDeleteList={handleDeleteList}
        onAddItem={handleAddItem}
        onToggleItem={handleToggleItem}
        onToggleArchive={handleToggleArchive}
      />
    </div>
  );
};

export default ListContainer;