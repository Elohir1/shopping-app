import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ListCard } from '../ListCard';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const mockSeznam = {
  id: 1,
  nazev: "Testovací seznam",
  polozky: [
    { nazev: "Položka 1", splneno: false },
    { nazev: "Položka 2", splneno: true }
  ],
  archivovano: false,
  members: [
    { id: "1", email: "user@example.com", isOwner: true }
  ]
};

const mockHandlers = {
  onDelete: jest.fn(),
  onEdit: jest.fn(),
  onArchive: jest.fn(),
  onUnarchive: jest.fn(),
  onShare: jest.fn(),
  onUpdateList: jest.fn(),
  onAddItem: jest.fn(),
  onDeleteItem: jest.fn(),
  onToggleItem: jest.fn(),
  onLeaveList: jest.fn(),
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ListCard Component', () => {
  it('renders list name correctly', () => {
    renderWithRouter(
      <ListCard
        seznam={mockSeznam}
        currentUserEmail="user@example.com"
        {...mockHandlers}
      />
    );
    
    expect(screen.getByText("Testovací seznam")).toBeInTheDocument();
  });

  it('shows correct number of completed items', () => {
    renderWithRouter(
      <ListCard
        seznam={mockSeznam}
        currentUserEmail="user@example.com"
        {...mockHandlers}
      />
    );
    
    expect(screen.getByText("1/2 položek")).toBeInTheDocument();
  });

  it('shows archive badge when list is archived', () => {
    const archivedList = { ...mockSeznam, archivovano: true };
    renderWithRouter(
      <ListCard
        seznam={archivedList}
        currentUserEmail="user@example.com"
        {...mockHandlers}
      />
    );
    
    expect(screen.getByText("Archivováno")).toBeInTheDocument();
  });

  it('calls onDelete when delete is confirmed', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(
      <ListCard
        seznam={mockSeznam}
        currentUserEmail="user@example.com"
        {...mockHandlers}
      />
    )
    
    // Otevřít menu
    const menuButton = screen.getByTestId('menu-button');
    await user.click(menuButton);
    
    // Kliknout na "Smazat"
    const deleteButton = await screen.findByText('Smazat');
    await user.click(deleteButton);
    
    // Potvrdit smazání
    const confirmButton = await screen.findByRole('button', { name: /smazat/i });
  await user.click(confirmButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockSeznam.id);
  });

  it('shows share button only for owner', async () => {
    const user = userEvent.setup();
    const nonOwnerList = {
      ...mockSeznam,
      members: [{ id: "1", email: "user@example.com", isOwner: false }]
    };
    
    renderWithRouter(
      <ListCard
        seznam={nonOwnerList}
        currentUserEmail="user@example.com"
        {...mockHandlers}
      />
    );
    
    const menuButton = screen.getByTestId('menu-button');
    await user.click(menuButton);
    
    // Použít waitFor pro kontrolu, že se Sdílet neobjeví
    await waitFor(() => {
      expect(screen.queryByText('Sdílet')).not.toBeInTheDocument();
    });
  });  
});  