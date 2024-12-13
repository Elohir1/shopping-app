// src/api/apiService.ts
import { API_CONFIG } from './config';
import { mockData } from './mockData';
import { Seznam } from '../App';

export class ApiService {
  // Pomocná metoda pro simulaci zpoždění
  private static async mockDelay() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  // Metody pro práci se seznamy
  static async getAllLists(): Promise<Seznam[]> {
    if (API_CONFIG.USE_MOCKS) {
      await this.mockDelay();
      return mockData.seznamy;
    }
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/lists`);
    if (!response.ok) {
      throw new Error('Nepodařilo se načíst seznamy');
    }
    return response.json();
  }

  static async createList(name: string): Promise<Seznam> {
    if (API_CONFIG.USE_MOCKS) {
      await this.mockDelay();
      const newList = {
        id: mockData.seznamy.length + 1,
        nazev: name,
        polozky: [],
        archivovano: false,
        members: [{ id: "1", email: "user@example.com", isOwner: true }]
      };
      mockData.seznamy.push(newList);
      return newList;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nazev: name })
    });
    
    if (!response.ok) {
      throw new Error('Nepodařilo se vytvořit seznam');
    }
    return response.json();
  }

  static async updateList(id: number, updates: Partial<Seznam>): Promise<Seznam> {
    if (API_CONFIG.USE_MOCKS) {
      await this.mockDelay();
      const index = mockData.seznamy.findIndex(list => list.id === id);
      if (index === -1) throw new Error('Seznam nenalezen');
      
      mockData.seznamy[index] = { ...mockData.seznamy[index], ...updates };
      return mockData.seznamy[index];
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/lists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Nepodařilo se aktualizovat seznam');
    }
    return response.json();
  }

  static async deleteList(id: number): Promise<void> {
    if (API_CONFIG.USE_MOCKS) {
      await this.mockDelay();
      const index = mockData.seznamy.findIndex(list => list.id === id);
      if (index === -1) throw new Error('Seznam nenalezen');
      mockData.seznamy.splice(index, 1);
      return;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/lists/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Nepodařilo se smazat seznam');
    }
  }

  // Metody pro práci s položkami
  static async addItem(seznamId: number, nazev: string): Promise<void> {
    if (API_CONFIG.USE_MOCKS) {
      await this.mockDelay();
      const seznam = mockData.seznamy.find(s => s.id === seznamId);
      if (!seznam) throw new Error('Seznam nenalezen');
      
      seznam.polozky.push({ nazev, splneno: false });
      return;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/lists/${seznamId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nazev })
    });

    if (!response.ok) {
      throw new Error('Nepodařilo se přidat položku');
    }
  }

  static async toggleItem(seznamId: number, polozkaIndex: number): Promise<void> {
    if (API_CONFIG.USE_MOCKS) {
      await this.mockDelay();
      const seznam = mockData.seznamy.find(s => s.id === seznamId);
      if (!seznam) throw new Error('Seznam nenalezen');
      
      seznam.polozky[polozkaIndex].splneno = !seznam.polozky[polozkaIndex].splneno;
      return;
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/lists/${seznamId}/items/${polozkaIndex}/toggle`,
      { method: 'PUT' }
    );

    if (!response.ok) {
      throw new Error('Nepodařilo se změnit stav položky');
    }
  }

  static async deleteItem(seznamId: number, polozkaIndex: number): Promise<void> {
    if (API_CONFIG.USE_MOCKS) {
      await this.mockDelay();
      const seznam = mockData.seznamy.find(s => s.id === seznamId);
      if (!seznam) throw new Error('Seznam nenalezen');
      
      seznam.polozky.splice(polozkaIndex, 1);
      return;
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/lists/${seznamId}/items/${polozkaIndex}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Nepodařilo se smazat položku');
    }
  }

  // Metody pro práci s členy
  static async addMember(seznamId: number, email: string): Promise<void> {
    if (API_CONFIG.USE_MOCKS) {
      await this.mockDelay();
      const seznam = mockData.seznamy.find(s => s.id === seznamId);
      if (!seznam) throw new Error('Seznam nenalezen');
      
      seznam.members.push({
        id: Date.now().toString(),
        email,
        isOwner: false
      });
      return;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/lists/${seznamId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Nepodařilo se přidat člena');
    }
  }

  static async removeMember(seznamId: number, memberId: string): Promise<void> {
    if (API_CONFIG.USE_MOCKS) {
      await this.mockDelay();
      const seznam = mockData.seznamy.find(s => s.id === seznamId);
      if (!seznam) throw new Error('Seznam nenalezen');
      
      seznam.members = seznam.members.filter(m => m.id !== memberId);
      return;
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/lists/${seznamId}/members/${memberId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Nepodařilo se odebrat člena');
    }
  }

  static async toggleArchive(seznamId: number): Promise<void> {
    if (API_CONFIG.USE_MOCKS) {
      await this.mockDelay();
      const seznam = mockData.seznamy.find(s => s.id === seznamId);
      if (!seznam) throw new Error('Seznam nenalezen');
      
      seznam.archivovano = !seznam.archivovano;
      return;
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/lists/${seznamId}/archive`,
      { method: 'PUT' }
    );

    if (!response.ok) {
      throw new Error('Nepodařilo se změnit stav archivace');
    }
  }
}