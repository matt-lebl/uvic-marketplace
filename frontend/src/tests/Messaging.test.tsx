import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Messaging from '../pages/Messaging';
import { APIGet, APIPost } from '../APIlink';

jest.mock('../APIlink', () => ({
  APIGet: jest.fn(),
  APIPost: jest.fn(),
}));

const mockThreads = [
  {
    listing_id: 'listing-1',
    other_participant: { user_id: 'user-2', name: 'User Two', profilePicture: '' },
    last_message: { content: 'Hello', sent_at: Date.now() },
  },
];

const mockMessages = [
  { sender_id: 'user-1', receiver_id: 'user-2', content: 'Hi', sent_at: Date.now() },
];

describe('Messaging Component', () => {
  beforeEach(() => {
    (APIGet as jest.Mock).mockImplementation((url) => {
      if (url === '/api/messages/overview') {
        return Promise.resolve(mockThreads);
      }
      if (url.startsWith('/api/messages/thread')) {
        return Promise.resolve(mockMessages);
      }
      if (url.startsWith('/api/user')) {
        return Promise.resolve({ userID: 'user-3', name: 'User Three', profileUrl: '' });
      }
      return Promise.resolve([]);
    });
  });

  test('renders without crashing', async () => {
    render(<Messaging />);
    await waitFor(() => expect(APIGet).toHaveBeenCalledWith('/api/messages/overview'));
    expect(screen.getAllByText('User Two')[0]).toBeInTheDocument();
  });

  test('fetches and displays messages', async () => {
    render(<Messaging />);
    await waitFor(() => expect(APIGet).toHaveBeenCalledWith('/api/messages/overview'));
    expect(screen.getAllByText('User Two')[0]).toBeInTheDocument();
    await waitFor(() => expect(APIGet).toHaveBeenCalledWith('/api/messages/thread/listing-1/user-1'));
    expect(screen.getAllByText('Hi')[0]).toBeInTheDocument();
  });

  test('handles sending a new message', async () => {
    (APIPost as jest.Mock).mockResolvedValueOnce({});

    render(<Messaging />);
    await waitFor(() => expect(APIGet).toHaveBeenCalledWith('/api/messages/overview'));

    const input = screen.getByPlaceholderText('Write a message');
    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(screen.getByLabelText('send message'));

    await waitFor(() => expect(APIPost).toHaveBeenCalledWith(
      '/api/messages/thread/listing-1/user-1',
      expect.objectContaining({ content: 'New message' })
    ));
    expect(screen.getAllByText('New message')[0]).toBeInTheDocument();
  });

  test('handles creating a new conversation', async () => {
    (APIPost as jest.Mock).mockResolvedValueOnce({});

    render(<Messaging />);

    fireEvent.click(screen.getByTestId('create-message-button'));
    fireEvent.change(screen.getByLabelText('Participant Name'), { target: { value: 'user-3' } });
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => expect(APIGet).toHaveBeenCalledWith('/api/user/user-3'));
    await waitFor(() => expect(APIPost).toHaveBeenCalledWith(
      '/messages/',
      expect.objectContaining({ content: 'Start of conversation with User Three' })
    ));
    
    const userThreeElements = screen.getAllByText('User Three');
    expect(userThreeElements).toHaveLength(2); 
    expect(userThreeElements[0]).toBeInTheDocument();
  });
});
