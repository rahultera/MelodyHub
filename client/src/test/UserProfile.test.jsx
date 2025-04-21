jest.mock('axios', () => ({
    get: jest.fn()
  }));

const axios = require('axios');

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import UserProfile from '../pages/UserProfile';
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

describe('UserProfile Page', () => {
  const mockUser = { name: 'Test User' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays user name correctly', async () => {
    axios.get.mockResolvedValue({ data: [] });
  
    render(
      <MemoryRouter>
        <UserProfile user={{ name: 'Test User' }} />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText(/Welcome Test User/i)).toBeInTheDocument();
    });
  });
  
  
  test('displays "User" if no user name provided', () => {
    axios.get.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <UserProfile user={{}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome User/i)).toBeInTheDocument();
  });

  test('fetches and displays comments and bookmarks', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: [
          { id: 1, text: 'Nice event!', event: { id: 101, title: 'Event 1' } },
          { id: 2, text: 'Loved it!', event: { id: 102, title: 'Event 2' } }
        ]
      }) 
      .mockResolvedValueOnce({
        data: [
          { id: 1, event: { id: 201, title: 'Bookmark 1' } },
          { id: 2, event: { id: 202, title: 'Bookmark 2' } }
        ]
      });

    render(
      <MemoryRouter>
        <UserProfile user={mockUser} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Event 1:')).toBeInTheDocument();
      expect(screen.getByText('Event 2:')).toBeInTheDocument();
      expect(screen.getByText('Bookmark 1')).toBeInTheDocument();
      expect(screen.getByText('Bookmark 2')).toBeInTheDocument();
    });
  });

  test('displays only top 5 comments and bookmarks', async () => {
    const comments = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      text: `Comment ${i}`,
      event: { id: i + 100, title: `Event ${i}` }
    }));

    const bookmarks = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      event: { id: i + 200, title: `Bookmark ${i}` }
    }));

    axios.get
      .mockResolvedValueOnce({ data: comments })
      .mockResolvedValueOnce({ data: bookmarks });

    render(
      <MemoryRouter>
        <UserProfile user={mockUser} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Event 0:')).toBeInTheDocument();
      expect(screen.queryByText('Event 5:')).not.toBeInTheDocument();
      expect(screen.queryByText('Bookmark 0')).toBeInTheDocument();
      expect(screen.queryByText('Bookmark 5')).not.toBeInTheDocument();
    });
  });

  test('clicking a comment navigates to event page', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: [
          { id: 1, text: 'Awesome!', event: { id: 111, title: 'Event 111' } }
        ]
      })
      .mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <UserProfile user={mockUser} />
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Event 111:'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/events/111');
  });

  test('clicking a bookmark navigates to event page', async () => {
    axios.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [
          { id: 1, event: { id: 222, title: 'Bookmark Event' } }
        ]
      });

    render(
      <MemoryRouter>
        <UserProfile user={mockUser} />
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Bookmark Event'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/events/222');
  });

  test('displays no comments message if none found', async () => {
    axios.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <UserProfile user={mockUser} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No comments found.')).toBeInTheDocument();
      expect(screen.getByText('No bookmarks found.')).toBeInTheDocument();
    });
  });

  test('shows alert when failing to fetch comments', async () => {
    axios.get
      .mockRejectedValueOnce(new Error('Failed to fetch comments'))
      .mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <UserProfile user={mockUser} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to load comments.');
    });
  });

  test('shows alert when failing to fetch bookmarks', async () => {
    axios.get
      .mockResolvedValueOnce({ data: [] })
      .mockRejectedValueOnce(new Error('Failed to fetch bookmarks'));

    render(
      <MemoryRouter>
        <UserProfile user={mockUser} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to load bookmarks.');
    });
  });

  test('renders "View all comments" link correctly', () => {
    axios.get.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <UserProfile user={mockUser} />
      </MemoryRouter>
    );

    const commentsLink = screen.getByText(/view all comments/i);
    expect(commentsLink).toHaveAttribute('href', '/user/comments');
  });

  test('renders "View all bookmarks" link correctly', () => {
    axios.get.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <UserProfile user={mockUser} />
      </MemoryRouter>
    );

    const bookmarksLink = screen.getByText(/view all bookmarks/i);
    expect(bookmarksLink).toHaveAttribute('href', '/user/bookmarks');
  });
});



