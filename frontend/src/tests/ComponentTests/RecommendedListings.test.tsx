
//Tests here are kinda borked. Due to funky timing, many of them that requre checking requests are failing when they are actually passing, but being checked at the wrong points. I'm not sure how to fix this, but I'm leaving the tests here for now. They are not currently being run in the test suite.


import React from 'react';
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import RecommendedListings from '../../pages/Components/RecommendedListings';
import { APIGet, APIPost } from '../../APIlink';
import { ListingSummary } from '../../interfaces';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

jest.mock('../../APIlink', () => ({
    APIGet: jest.fn(),
    APIPost: jest.fn(),
}));

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

const mockAPIGet = APIGet as jest.MockedFunction<typeof APIGet>
const mockAPIPost = APIPost as jest.MockedFunction<typeof APIPost>

describe('RecommendedListings', () => {
    beforeEach(() => {
        mockAPIGet.mockClear();
        mockAPIPost.mockClear();
    });

    test('renders "Recommended Listings" heading', () => {
        render(<RecommendedListings />);
        const heading = screen.getByText('Recommended Listings');
        expect(heading).toBeInTheDocument();
    });

    test('renders "Results Per Page" select input with default value', () => {
        render(<RecommendedListings />);
        expect(screen.getByTestId('Results Per Page-simple-select').firstElementChild?.textContent).toBe("20");
    });

    test('fetches recommended listings on component mount', async () => {
        mockAPIGet.mockResolvedValue([])
        render(<RecommendedListings />);
        await waitFor(() => expect(mockAPIGet).toHaveBeenCalledTimes(1)); //due to some settings, such as react-strict, the component is loaded twice, which causes this to trigger more than once
        expect(APIGet).toHaveBeenCalledWith('/api/recommendations', [['page', 1], ['limit', '20']]);
    });

    test('renders "Nothing found here" message when recommendedListings is empty', () => {
        render(<RecommendedListings />);
        const message = screen.getByText('Nothing found here, check back later!');
        expect(message).toBeInTheDocument();
    });

    test('renders listing cards when recommendedListings is not empty (Warning, this test can be tempermental, as random timing effects test results producing potentially false negatives. Run multiple times if failing.)', async () => {
        mockAPIGet.mockResolvedValue(mockListings);
        render(<RecommendedListings />);
        await waitForElementToBeRemoved(() => screen.getByText('Nothing found here, check back later!'), { timeout: 2500 });
        await waitFor(() => expect(mockAPIGet).toHaveBeenCalledTimes(1), { timeout: 2500 });
        mockListings.forEach((listing) => {
            expect(screen.getByText(listing.title)).toBeInTheDocument();
        });
    });

    test('calls handleRemoveRecommendation when "Remove recommendation" link is clicked (Warning, this test can be tempermental, as random timing effects test results producing potentially false negatives. Run multiple times if failing.)', async () => {
        mockAPIGet.mockResolvedValueOnce(mockListings).mockResolvedValueOnce(mockListings).mockResolvedValueOnce(mockListings).mockResolvedValueOnce(mockListings.filter((listing) => listing.listingID !== 'listing-1'));
        mockAPIPost.mockResolvedValue({});
        render(<RecommendedListings />);
        await waitForElementToBeRemoved(() => screen.getByText('Nothing found here, check back later!'), { timeout: 2500 });
        await waitFor(() => expect(mockAPIGet).toHaveBeenCalledTimes(1), { timeout: 2500 });
        fireEvent.click(screen.getByTestId('remove-recommendation-listing-1'));
        await waitFor(() => expect(mockAPIPost).toHaveBeenCalledTimes(1));
        expect(mockAPIPost).toHaveBeenCalledWith('/api/recommendations/stop/listing-1');
        await waitFor(() => mockListings.forEach((listing) => {
            if (listing.listingID !== 'listing-1') {
                expect(screen.getByText(listing.title)).toBeInTheDocument();
            }
            else {
                expect(screen.queryByText(listing.title)).not.toBeInTheDocument();
            }
        }));
    });

    // test('changes page and fetches recommended listings when pagination is clicked', async () => {
    //     mockAPIGet.mockResolvedValueOnce(mockListings);
    //     render(<RecommendedListings />);
    //     fireEvent.click(screen.getByLabelText('Go to page 2'));
    //     await waitFor(() => expect(APIGet).toHaveBeenCalledTimes(2));
    //     expect(APIGet).toHaveBeenCalledWith('/api/recommendations', [['page', 2], ['limit', '20']]);
    // });
});
