import jestOpenAPI from 'jest-openapi';
import axios, { AxiosStatic } from 'axios';
import { APIPost } from '../APIlink';
import {ErrorResponse, ListingRequest, ListingResponse, ReviewRequest, ReviewResponse} from '../interfaces';
import YAML from 'yaml';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const unmockedAxios: AxiosStatic = jest.requireActual('axios') ;


// Write your test
describe('POST', () => {
    // Load your OpenAPI spec from a web endpoint
    beforeAll(async () => {
        const response = await unmockedAxios.get('http://market.lebl.ca/openapi.yaml');
        const openApiSpec = response.data;
        jestOpenAPI(YAML.parse(openApiSpec));
    });


    it('/api/listing should satisfy OpenAPI spec', async () => {
        const testURL:string ='/api/listing';
        const testRequest:ListingRequest = {
            listing: {
                title: "Used Calculus Textbook",
                description: "No wear and tear, drop-off available.",
                price: 50,
                location: {
                    latitude: 34.23551,
                    longitude: -104.54451
                },
                images: [
                    {
                      url: "https://example.com/image"
                    }
                  ]
                }
        };
        const testResponse:ListingResponse = {
            listing: {
              listingID: "A23F29039B23",
              title: "Used Calculus Textbook",
              seller_profile: {
                userID: "A12334B345",
                username: "hubert123",
                name: "Bartholomew Hubert",
                bio: "I love stuff",
                profilePictureUrl: "https://example.com/image.png"
              },
              description: "No wear and tear, drop-off available.",
              price: 50,
              location: {
                latitude: 34.23551,
                longitude: -104.54451
              },
              status: "AVAILABLE",
              dateCreated: "2024-05-23T15:30:00Z",
              dateModified: "2024-05-23T15:30:00Z",
              reviews: [
                {
                  listing_review_id: "A23F29039B23",
                  reviewerName: "John Doe",
                  stars: 5,
                  comment: "Great seller, the item was exactly as described and in perfect condition.",
                  userID: "A23434B090934",
                  listingID: "A23F29039B23",
                  dateCreated: "2024-05-23T15:30:00Z",
                  dateModified: "2024-05-23T15:30:00Z"
                }
              ],
              images: [
                {
                  url: "https://example.com/image"
                }
              ],
              distance: 4.2
            }
        };
        mockedAxios.post.mockResolvedValueOnce({ status:201, data: testResponse });

        const res = await APIPost<ListingResponse, ListingRequest>(testURL,testRequest);
        // // expect(res.status).toEqual(200);
        expect(mockedAxios.post).toHaveBeenCalledWith(testURL, testRequest);
        expect(testRequest.listing).toSatisfySchemaInApiSpec('NewListing');
        expect(res?.listing).toSatisfySchemaInApiSpec('Listing');
    });

    it('/api/REVIEW should satisfy OpenAPI spec', async () => {
      const testURL:string ='/api/listing';
      const testRequest:ReviewRequest = {
        listing_rating_id: "A23F29039B23",
        stars: 5,
        comment: "Great seller, the item was exactly as described and in perfect condition.",
        listingID: "A23F29039B23"
      };
      const testResponse:ReviewResponse = {
            listing_review_id: "A23F29039B23",
            reviewerName: "John Doe",
            stars: 5,
            comment: "Great seller, the item was exactly as described and in perfect condition.",
            userID: "A23434B090934",
            listingID: "A23F29039B23",
            dateCreated: "2024-05-23T15:30:00Z",
            dateModified: "2024-05-23T15:30:00Z"
      };
      mockedAxios.post.mockResolvedValueOnce({ status:201, data: testResponse });
      const res = await APIPost<ReviewResponse, ReviewRequest>(testURL, testRequest);
      expect(mockedAxios.post).toHaveBeenCalledWith(testURL, testRequest);
      expect(testRequest).toSatisfySchemaInApiSpec('NewReview');
      expect(res).toSatisfySchemaInApiSpec('Review');
  });
});