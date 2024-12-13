// src/api/__tests__/apiService.test.ts
import { ApiService } from '../apiService';
import { API_CONFIG } from '../config';

describe('ApiService', () => {
  beforeEach(() => {
    API_CONFIG.USE_MOCKS = true;
  });

  describe('Lists', () => {
    test('getAllLists returns mock data', async () => {
      const lists = await ApiService.getAllLists();
      expect(Array.isArray(lists)).toBe(true);
      expect(lists.length).toBeGreaterThan(0);
      expect(lists[0]).toHaveProperty('nazev');
    });

    test('createList adds new list', async () => {
      const name = "Test List";
      const newList = await ApiService.createList(name);
      expect(newList.nazev).toBe(name);
      expect(newList.polozky).toHaveLength(0);
    });

    test('updateList modifies existing list', async () => {
      // Nejprve vytvoříme seznam
      const newList = await ApiService.createList("Original Name");
      
      // Pak ho upravíme
      const updatedList = await ApiService.updateList(newList.id, {
        nazev: "Updated Name"
      });
      
      expect(updatedList.nazev).toBe("Updated Name");
    });

    test('deleteList removes list', async () => {
      // Vytvoříme seznam
      const newList = await ApiService.createList("To Delete");
      
      // Smažeme ho
      await ApiService.deleteList(newList.id);
      
      // Získáme všechny seznamy
      const lists = await ApiService.getAllLists();
      expect(lists.find(l => l.id === newList.id)).toBeUndefined();
    });
  });

  describe('Items', () => {
    test('addItem adds item to list', async () => {
      // Vytvoříme nový seznam
      const newList = await ApiService.createList("Test List");
      
      // Přidáme položku
      await ApiService.addItem(newList.id, "Test Item");
      
      // Zkontrolujeme, že položka byla přidána
      const lists = await ApiService.getAllLists();
      const updatedList = lists.find(l => l.id === newList.id);
      expect(updatedList?.polozky).toContainEqual(
        expect.objectContaining({ nazev: "Test Item", splneno: false })
      );
    });

    test('toggleItem changes item status', async () => {
      // Vytvoříme seznam s položkou
      const newList = await ApiService.createList("Test List");
      await ApiService.addItem(newList.id, "Test Item");
      
      // Označíme položku jako splněnou
      await ApiService.toggleItem(newList.id, 0);
      
      // Zkontrolujeme změnu stavu
      const lists = await ApiService.getAllLists();
      const updatedList = lists.find(l => l.id === newList.id);
      expect(updatedList?.polozky[0].splneno).toBe(true);
    });
  });

  describe('Error handling', () => {
    test('throws error for non-existent list operations', async () => {
      const nonExistentId = 999999;
      
      // Update neexistujícího seznamu
      await expect(
        ApiService.updateList(nonExistentId, { nazev: "Test" })
      ).rejects.toThrow('Seznam nenalezen');
      
      // Přidání položky do neexistujícího seznamu
      await expect(
        ApiService.addItem(nonExistentId, "Test Item")
      ).rejects.toThrow('Seznam nenalezen');
    });
  });
});