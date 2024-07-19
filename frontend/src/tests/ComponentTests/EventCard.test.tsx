import React from 'react';
import { render, screen } from '@testing-library/react';
import EventCard from '../../pages/Components/EventCard';
import { CharityEntity } from '../../interfaces';

// Mock data for testing
const eventDataMock: CharityEntity = {
  id: '1',
  name: 'Sample Event',
  funds: 10000,
  startDate: '2024-07-15',
  endDate: '2024-07-20',
  imageUrl: 'sample_image_url',
  description: 'Sample event description.',
  organizations: [],
  listingsCount: 1
};

describe('EventCard component', () => {
  it('renders event data correctly', () => {
    render(<EventCard eventData={eventDataMock} />);

    expect(screen.getByText(eventDataMock.name)).toBeInTheDocument();

    expect(screen.getByText('Funding: $10000')).toBeInTheDocument();

    expect(screen.getByText(eventDataMock.startDate)).toBeInTheDocument();
    expect(screen.getByText(eventDataMock.endDate)).toBeInTheDocument();

    expect(screen.getByAltText(eventDataMock.imageUrl)).toBeInTheDocument();
    
    expect(screen.getByText(eventDataMock.description)).toBeInTheDocument();
  });
});
