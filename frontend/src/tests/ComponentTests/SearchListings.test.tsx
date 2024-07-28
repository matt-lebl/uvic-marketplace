import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { DataProvider } from '../../DataContext';
import { ListingSummary, SearchRequest, Sort } from '../../interfaces';
import SearchListings from '../../pages/Components/SearchListings';
import { promises } from 'dns';

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
        charityID: 'charity-1',
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
        charityID: 'charity-2',
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
        charityID: 'charity-3',
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
        charityID: 'charity-4',
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
        charityID: 'charity-5',
    },
];

const mockOnSearch = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('SearchListings Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders SearchListings component', async () => {
        render(
            <DataProvider>
                <SearchListings searchRequest={{
                    query: '',
                    minPrice: undefined,
                    maxPrice: undefined,
                    status: undefined,
                    searchType: undefined,
                    latitude: 0,
                    longitude: 0,
                    sort: Sort.RELEVANCE,
                    page: 1,
                    limit: 20,
                } as SearchRequest} onSearch={mockOnSearch.mockImplementation((value: SearchRequest) => {
                    return {
                        totalItems: 5,
                        items: mockListings,
                    }
                })} />
            </DataProvider>
        );

        expect(screen.getByText(/Listings Found/i)).toBeInTheDocument();
        await waitFor(() => expect(mockOnSearch).toBeCalledTimes(1));
        mockListings.forEach((listing) => {
            expect(screen.getByText(listing.title)).toBeInTheDocument();
        });
    });

    // test('handles pagination', async () => {
    //     render(
    //         <DataProvider>
    //             <SearchListings onSearch={mockOnSearch.mockImplementation((value: SearchRequest) => {
    //                 return {
    //                     totalItems: 5,
    //                     items: mockListings,
    //                 }
    //             })} />
    //         </DataProvider>
    //     );

    //     const blankSearchRequestInitial: SearchRequest = {
    //         query: '',
    //         minPrice: undefined,
    //         maxPrice: undefined,
    //         status: undefined,
    //         searchType: undefined,
    //         latitude: 0,
    //         longitude: 0,
    //         sort: Sort.RELEVANCE,
    //         page: 1,
    //         limit: 20,
    //     }

    //     const blankSearchRequestFinal: SearchRequest = {
    //         query: '',
    //         minPrice: undefined,
    //         maxPrice: undefined,
    //         status: undefined,
    //         searchType: undefined,
    //         latitude: 0,
    //         longitude: 0,
    //         sort: Sort.RELEVANCE,
    //         page: 2,
    //         limit: 20,
    //     }

    //     await waitFor(() => expect(mockOnSearch).toHaveBeenCalled());
    //     const nextPageButton = screen.getByRole('button', { name: /next/i });
    //     expect(nextPageButton).toBeInTheDocument();
    //     fireEvent.click(nextPageButton);
    //     await waitFor(() => {
    //         expect(mockOnSearch).toHaveBeenCalledTimes(2);
    //         expect(mockOnSearch).toBeCalledWith(blankSearchRequestInitial);
    //         expect(mockOnSearch).lastCalledWith(blankSearchRequestFinal);
    //     });
    // });

    // test('handles sorting change', async () => {
    //     render(
    //         <DataProvider>
    //             <SearchListings onSearch={mockOnSearch.mockImplementation((value: SearchRequest) => {
    //                 return {
    //                     totalItems: 5,
    //                     items: mockListings,
    //                 }
    //             })} />
    //         </DataProvider>
    //     );

    //     await waitFor(() => expect(mockOnSearch).toHaveBeenCalled());
    //     const selectInput = screen.getByTestId('Sort-simple-select');
    //     expect(selectInput).toBeInTheDocument();
    //     fireEvent.mouseDown(selectInput.firstElementChild!);
    //     expect(screen.getByText(Sort.DISTANCE_DESC)).toBeInTheDocument();
    //     fireEvent.click(screen.getByText(Sort.DISTANCE_DESC));
    //     await waitFor(() => expect(mockOnSearch).toHaveBeenCalledTimes(2));
    // });
});
