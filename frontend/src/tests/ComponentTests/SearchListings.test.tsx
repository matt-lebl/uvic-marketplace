import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { DataProvider } from '../../DataContext';
import { ListingSummary, Sort } from '../../interfaces';
import SearchListings from '../../pages/Components/SearchListings';

// Mock Data
const mockListings: ListingSummary[] = [
    {
        listingID: 'listing-1',
        sellerID: 'seller-1',
        sellerName: 'Seller One',
        title: 'Listing Title 1',
        description: 'Description for listing 1',
        price: 100,
        dateCreated: '2024-01-01',
        imageUrl: 'https://example.com/image1.jpg',
    },
    {
        listingID: 'listing-2',
        sellerID: 'seller-2',
        sellerName: 'Seller Two',
        title: 'Listing Title 2',
        description: 'Description for listing 2',
        price: 200,
        dateCreated: '2024-01-02',
        imageUrl: 'https://example.com/image2.jpg',
    },
    {
        listingID: 'listing-3',
        sellerID: 'seller-3',
        sellerName: 'Seller Three',
        title: 'Listing Title 3',
        description: 'Description for listing 3',
        price: 300,
        dateCreated: '2024-01-03',
        imageUrl: 'https://example.com/image3.jpg',
    },
    {
        listingID: 'listing-4',
        sellerID: 'seller-4',
        sellerName: 'Seller Four',
        title: 'Listing Title 4',
        description: 'Description for listing 4',
        price: 400,
        dateCreated: '2024-01-04',
        imageUrl: 'https://example.com/image4.jpg',
    },
    {
        listingID: 'listing-5',
        sellerID: 'seller-5',
        sellerName: 'Seller Five',
        title: 'Listing Title 5',
        description: 'Description for listing 5',
        price: 500,
        dateCreated: '2024-01-05',
        imageUrl: 'https://example.com/image5.jpg',
    },
];

const mockOnSearch = jest.fn().mockResolvedValue({
    totalItems: 5,
    items: mockListings,
});

describe('SearchListings Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders SearchListings component', async () => {
        render(
            <DataProvider>
                <SearchListings onSearch={mockOnSearch} />
            </DataProvider>
        );

        expect(screen.getByText(/Listings Found/i)).toBeInTheDocument();
        await waitFor(() => expect(mockOnSearch).toHaveBeenCalled());
        mockListings.forEach((listing) => {
            expect(screen.getByText(listing.title)).toBeInTheDocument();
        });
    });

    test('handles pagination', async () => {
        render(
            <DataProvider>
                <SearchListings onSearch={mockOnSearch} />
            </DataProvider>
        );

        await waitFor(() => expect(mockOnSearch).toHaveBeenCalled());
        const nextPageButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextPageButton);
        await waitFor(() => expect(mockOnSearch).toHaveBeenCalledTimes(2));
    });

    test('handles sorting change', async () => {
        render(
            <DataProvider>
                <SearchListings onSearch={mockOnSearch} />
            </DataProvider>
        );

        await waitFor(() => expect(mockOnSearch).toHaveBeenCalled());
        const selectInput = screen.getByTestId('select-input');
        fireEvent.change(selectInput, { target: { value: Sort.RELEVANCE } });

        await waitFor(() => expect(mockOnSearch).toHaveBeenCalledTimes(2));
    });
});
