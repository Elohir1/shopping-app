// src/components/ui/_tests_/ListItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListItem from '../ListItem';

const mockList = {
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
  list: mockList,
  onUpdate: jest.fn(),
  onDelete: jest.fn(),
  onAddItem: jest.fn(),
  onToggleItem: jest.fn(),
  onToggleArchive: jest.fn(),
};

const renderListItem = (props = {}) => {
  return render(
    <BrowserRouter>
      <ListItem {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe('ListItem', () => {
    test('renders list name and members count', () => {
      renderListItem();
      expect(screen.getByText(mockList.nazev)).toBeInTheDocument();
      expect(screen.getByText('1 člen')).toBeInTheDocument();
    });
  
    test('renders progress bar', () => {
      renderListItem();
      const progressText = screen.getByText('1 z 2 splněno');
      expect(progressText).toBeInTheDocument();
    });
  
    test('can edit list name', () => {
      renderListItem();
      const nameHeading = screen.getByText(mockList.nazev);
      fireEvent.click(nameHeading);
      
      const input = screen.getByDisplayValue(mockList.nazev);
      fireEvent.change(input, { target: { value: 'Nový název' } });
      fireEvent.blur(input);
  
      expect(defaultProps.onUpdate).toHaveBeenCalledWith(1, { nazev: 'Nový název' });
    });
  
    test('can add new item when not archived', () => {
      renderListItem();
      const input = screen.getByPlaceholderText('Nová položka');
      fireEvent.change(input, { target: { value: 'Nová položka' } });
      
      const form = input.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
  
      expect(defaultProps.onAddItem).toHaveBeenCalledWith(1, 'Nová položka');
    });
  
    test('shows archive controls', () => {
      renderListItem();
      expect(screen.getByTitle('Archivovat')).toBeInTheDocument();
      
      // Test pro archivovaný seznam
      renderListItem({
        list: { ...mockList, archivovano: true }
      });
      expect(screen.getByTitle('Obnovit')).toBeInTheDocument();
    });
  
    test('can toggle items', () => {
      renderListItem();
      const items = screen.getAllByRole('button').filter(
        button => button.classList.contains('rounded-full')
      );
      fireEvent.click(items[0]);
      expect(defaultProps.onToggleItem).toHaveBeenCalledWith(1, 0);
    });
  });