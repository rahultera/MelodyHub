import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventDetails from '../pages/EventDetails';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
}));

test('renders Event Details page with expected content', () => {
  render(
    <BrowserRouter>
      <EventDetails />
    </BrowserRouter>
  );
  
  expect(screen.getByText(/Event Name/i)).toBeInTheDocument();
  expect(screen.getByText(/Description/i)).toBeInTheDocument();
});
