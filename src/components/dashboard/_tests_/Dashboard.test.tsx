import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

const mockSeznam = {
  id: 1,
  nazev: "Testovací seznam",
  polozky: [
    { nazev: "Položka 1", splneno: false },
    { nazev: "Položka 2", splneno: true }
  ],
  archivovano: false,
  members: [
    { id: "1", email: "test@example.com", isOwner: true }
  ]
};

const defaultProps = {
  seznamy: [mockSeznam],
  currentUserEmail: "test@example.com",
  onDeleteList: jest.fn(),
  onArchiveList: jest.fn(),
  onUnarchiveList: jest.fn(),
  onCreateList: jest.fn(),
  onUpdateList: jest.fn(),
  onAddItem: jest.fn(),
  onDeleteItem: jest.fn(),
  onToggleItem: jest.fn(),
  onLeaveList: jest.fn()
};

const renderDashboard = (props = {}) => {
  return render(
    <BrowserRouter>
      <Dashboard {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe('Dashboard', () => {
    test('renders empty state when no lists', () => {
      renderDashboard({ seznamy: [] });
      expect(screen.getByText(/zatím nemáte žádné nákupní seznamy/i)).toBeInTheDocument();
    });
  
    test('renders list name', () => {
      renderDashboard();
      expect(screen.getByText('Testovací seznam')).toBeInTheDocument();
    });
  
    test('opens new list dialog', () => {
      renderDashboard();
      const newButton = screen.getByText('Nový');
      fireEvent.click(newButton);
      // NewListDialog by se měl otevřít
    });
  
    test('can toggle archive view', () => {
      renderDashboard();
      const archiveButton = screen.getByText(/archiv/i);
      fireEvent.click(archiveButton);
      expect(screen.getByText(/aktivní/i)).toBeInTheDocument();
    });
  
    test('can search lists', () => {
      renderDashboard();
      const searchInput = screen.getByPlaceholderText(/hledat seznamy/i);
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(screen.getByText('Testovací seznam')).toBeInTheDocument();
    });
  });