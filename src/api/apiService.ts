// src/api/apiService.ts
import { API_CONFIG } from './config';
import { mockData } from './mockData';
import { Seznam } from '../App';

export class ApiService {
  //pro simulaci zpoždění
  private static async mockDelay() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
  private static handleNetworkError(error: unknown): never {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Nelze se připojit k serveru. Zkontrolujte své internetové připojení a zkuste to znovu.');
    }
    if (error instanceof Error) {
      throw error; // Přímo přeposíláme Error instance
    }
    throw error;
  }

  // Metody pro práci se seznamy
  static async getAllLists(): Promise<Seznam[]> {
    try {
      if (API_CONFIG.USE_MOCKS) {
        await this.mockDelay();
        return mockData.seznamy;
      }
    
     
      const response = await fetch(`${API_CONFIG.BASE_URL}/lists`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Nebyla nalezena žádná data. Zkuste obnovit stránku nebo vytvořit nový seznam.');
        } else if (response.status === 403) {
          throw new Error('Nemáte oprávnění pro zobrazení seznamů. Kontaktujte prosím vlastníka seznamu.');
        } else if (response.status === 500) {
          throw new Error('Server je momentálně nedostupný. Zkuste to prosím později nebo kontaktujte podporu.');
        } else if (response.status === 429) {
          throw new Error('Příliš mnoho požadavků. Prosím počkejte chvíli před dalším pokusem.');
        }
        throw new Error('Nepodařilo se načíst seznamy. Zkontrolujte připojení k internetu a zkuste to znovu.');
      }
      return response.json();
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }
  static async createList(name: string): Promise<Seznam> {
    try {
      if (!name.trim()) {
        throw new Error('Název seznamu nemůže být prázdný.');
      }

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
        if (response.status === 400) {
          throw new Error('Neplatný název seznamu. Název musí obsahovat 1-100 znaků.');
        } else if (response.status === 403) {
          throw new Error('Nemáte oprávnění vytvářet nové seznamy. Kontaktujte administrátora.');
        } else if (response.status === 429) {
          throw new Error('Překročili jste limit pro vytváření seznamů. Zkuste to prosím později.');
        }
        throw new Error('Nepodařilo se vytvořit seznam. Zkuste to prosím znovu.');
      }
      return response.json();
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  static async updateList(id: number, updates: Partial<Seznam>): Promise<Seznam> {
    try {
      if (API_CONFIG.USE_MOCKS) {
        await this.mockDelay();
        const index = mockData.seznamy.findIndex(list => list.id === id);
        // Zde změníme hlášku
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
        if (response.status === 404) {
          throw new Error('Seznam nebyl nalezen. Mohl být smazán nebo k němu nemáte přístup.');
        } else if (response.status === 403) {
          throw new Error('Nemáte oprávnění upravovat tento seznam. Pouze vlastník může provádět změny.');
        } else if (response.status === 400) {
          throw new Error('Neplatné údaje pro aktualizaci. Zkontrolujte zadané hodnoty.');
        }
        throw new Error('Nepodařilo se aktualizovat seznam. Zkuste to prosím znovu.');
      }
      return response.json();
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  static async deleteList(id: number): Promise<void> {
    try {
      if (API_CONFIG.USE_MOCKS) {
        await this.mockDelay();
        const index = mockData.seznamy.findIndex(list => list.id === id);
        if (index === -1) throw new Error('Seznam nebyl nalezen. Možná již byl smazán.');
        mockData.seznamy.splice(index, 1);
        return;
      }

    const response = await fetch(`${API_CONFIG.BASE_URL}/lists/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Seznam nebyl nalezen. Možná již byl smazán.');
      } else if (response.status === 403) {
        throw new Error('Nemáte oprávnění smazat tento seznam. Pouze vlastník může seznam smazat.');
      } else if (response.status === 409) {
        throw new Error('Seznam nelze smazat, protože je používán jinými uživateli.');
      }
      throw new Error('Nepodařilo se smazat seznam. Zkuste to prosím znovu.');
    }
  } catch (error) {
    return this.handleNetworkError(error);
  }
}

  // Metody pro práci s položkami
  static async addItem(seznamId: number, nazev: string): Promise<void> {
    try {
      if (!nazev.trim()) {
        throw new Error('Název položky nemůže být prázdný.');
      }

      if (API_CONFIG.USE_MOCKS) {
        await this.mockDelay();
        const seznam = mockData.seznamy.find(s => s.id === seznamId);
        if (!seznam) throw new Error('Seznam nenalezen');
        
        if (seznam.archivovano) {
          throw new Error('Nelze přidat položku do archivovaného seznamu.');
        }
        
        seznam.polozky.push({ nazev, splneno: false });
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/lists/${seznamId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nazev })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Seznam nebyl nalezen. Možná byl smazán nebo k němu nemáte přístup.');
        } else if (response.status === 403) {
          throw new Error('Nemáte oprávnění přidat položku do tohoto seznamu.');
        } else if (response.status === 400) {
          throw new Error('Neplatný název položky. Název musí obsahovat 1-100 znaků.');
        }
        throw new Error('Nepodařilo se přidat položku. Zkuste to prosím znovu.');
      }
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  static async toggleItem(seznamId: number, polozkaIndex: number): Promise<void> {
    try {
      if (API_CONFIG.USE_MOCKS) {
        await this.mockDelay();
        const seznam = mockData.seznamy.find(s => s.id === seznamId);
        if (!seznam) throw new Error('Seznam nebyl nalezen. Možná byl smazán nebo k němu nemáte přístup.');
        
        if (seznam.archivovano) {
          throw new Error('Nelze upravovat položky v archivovaném seznamu.');
        }

        if (polozkaIndex < 0 || polozkaIndex >= seznam.polozky.length) {
          throw new Error('Položka nebyla nalezena v seznamu.');
        }
        
        seznam.polozky[polozkaIndex].splneno = !seznam.polozky[polozkaIndex].splneno;
        return;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/lists/${seznamId}/items/${polozkaIndex}/toggle`,
        { method: 'PUT' }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Položka nebyla nalezena. Možná byla smazána.');
        } else if (response.status === 403) {
          throw new Error('Nemáte oprávnění upravovat položky v tomto seznamu.');
        }
        throw new Error('Nepodařilo se změnit stav položky. Zkuste to prosím znovu.');
      }
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  static async deleteItem(seznamId: number, polozkaIndex: number): Promise<void> {
    try {
      if (API_CONFIG.USE_MOCKS) {
        await this.mockDelay();
        const seznam = mockData.seznamy.find(s => s.id === seznamId);
        if (!seznam) throw new Error('Seznam nebyl nalezen. Možná byl smazán nebo k němu nemáte přístup.');
        
        if (seznam.archivovano) {
          throw new Error('Nelze mazat položky z archivovaného seznamu.');
        }

        if (polozkaIndex < 0 || polozkaIndex >= seznam.polozky.length) {
          throw new Error('Položka nebyla nalezena v seznamu.');
        }
        
        seznam.polozky.splice(polozkaIndex, 1);
        return;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/lists/${seznamId}/items/${polozkaIndex}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Položka nebyla nalezena. Možná již byla smazána.');
        } else if (response.status === 403) {
          throw new Error('Nemáte oprávnění mazat položky z tohoto seznamu.');
        }
        throw new Error('Nepodařilo se smazat položku. Zkuste to prosím znovu.');
      }
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  // Metody pro práci s členy
  static async addMember(seznamId: number, email: string): Promise<void> {
    try {
      if (!email.includes('@')) {
        throw new Error('Neplatná emailová adresa.');
      }

      if (API_CONFIG.USE_MOCKS) {
        await this.mockDelay();
        const seznam = mockData.seznamy.find(s => s.id === seznamId);
        if (!seznam) throw new Error('Seznam nebyl nalezen. Možná byl smazán nebo k němu nemáte přístup.');
        
        if (seznam.members.some(m => m.email === email)) {
          throw new Error('Tento uživatel již má přístup k seznamu.');
        }
        
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
        if (response.status === 404) {
          throw new Error('Seznam nebyl nalezen. Možná byl smazán nebo k němu nemáte přístup.');
        } else if (response.status === 403) {
          throw new Error('Nemáte oprávnění přidat členy do tohoto seznamu.');
        } else if (response.status === 409) {
          throw new Error('Tento uživatel již má přístup k seznamu.');
        }
        throw new Error('Nepodařilo se přidat člena. Zkuste to prosím znovu.');
      }
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }
  static async removeMember(seznamId: number, memberId: string): Promise<void> {
    try {
      if (API_CONFIG.USE_MOCKS) {
        await this.mockDelay();
        const seznam = mockData.seznamy.find(s => s.id === seznamId);
        if (!seznam) throw new Error('Seznam nebyl nalezen. Možná byl smazán nebo k němu nemáte přístup.');
        
        const member = seznam.members.find(m => m.id === memberId);
        if (!member) {
          throw new Error('Člen nebyl nalezen v seznamu.');
        }
        if (member.isOwner) {
          throw new Error('Nelze odebrat vlastníka seznamu.');
        }
        
        seznam.members = seznam.members.filter(m => m.id !== memberId);
        return;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/lists/${seznamId}/members/${memberId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Člen nebyl nalezen. Možná již byl odebrán.');
        } else if (response.status === 403) {
          throw new Error('Nemáte oprávnění odebrat členy z tohoto seznamu.');
        } else if (response.status === 400) {
          throw new Error('Nelze odebrat vlastníka seznamu.');
        }
        throw new Error('Nepodařilo se odebrat člena. Zkuste to prosím znovu.');
      }
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  static async toggleArchive(seznamId: number): Promise<void> {
    try {
      if (API_CONFIG.USE_MOCKS) {
        await this.mockDelay();
        const seznam = mockData.seznamy.find(s => s.id === seznamId);
        if (!seznam) throw new Error('Seznam nebyl nalezen. Možná byl smazán nebo k němu nemáte přístup.');
        
        seznam.archivovano = !seznam.archivovano;
        return;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/lists/${seznamId}/archive`,
        { method: 'PUT' }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Seznam nebyl nalezen. Možná byl smazán nebo k němu nemáte přístup.');
        } else if (response.status === 403) {
          throw new Error('Nemáte oprávnění archivovat tento seznam. Pouze vlastník může archivovat seznam.');
        }
        throw new Error('Nepodařilo se změnit stav archivace. Zkuste to prosím znovu.');
      }
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }
}