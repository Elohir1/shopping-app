import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders loading state initially', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const loadingElement = screen.getByText(/načítání/i);
  expect(loadingElement).toBeInTheDocument();
});