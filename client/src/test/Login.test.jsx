jest.mock('axios', () => ({
  post: jest.fn()
}));

const axios = require('axios');

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((message) => {
    if (
      message.includes('React Router Future Flag Warning') ||
      message.includes('Relative route resolution')
    ) {
      return;
    }
    console.warn(message);
  });
});

window.alert = jest.fn();

describe('Login Page', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <Login onLogin={mockOnLogin} />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
  });

  test('allows typing into form fields', () => {
    render(
      <MemoryRouter>
        <Login onLogin={mockOnLogin} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });

    expect(screen.getByPlaceholderText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText(/password/i)).toHaveValue('password123');
  });


  test('successful login calls onLogin and navigates to home', async () => {
    axios.post.mockResolvedValueOnce({ data: { name: 'Test User' } });

    render(
      <MemoryRouter>
        <Login onLogin={mockOnLogin} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'https://melodyhub-icod.onrender.com/login',
        { email: 'test@example.com', password: 'password123' },
        { withCredentials: true }
      );
      expect(mockOnLogin).toHaveBeenCalledWith({ name: 'Test User' });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows alert when login fails', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: { error: 'Invalid credentials' }
      }
    });

    render(
      <MemoryRouter>
        <Login onLogin={mockOnLogin} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
    });
  });


  test('has link to Register page', () => {
    render(
      <MemoryRouter>
        <Login onLogin={mockOnLogin} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /sign up now/i });
    expect(link).toHaveAttribute('href', '/Register');
  });
});
