import jestOpenAPI from 'jest-openapi'
import axios, { AxiosStatic, AxiosRequestConfig } from 'axios'

import APIError, {
  APIPost,
  APIGet,
  baseUrl,
  APIPatch,
  APIDelete,
  SetAxios,
} from '../APIlink'
import ErrorResponse, {
  ListingRequest,
  ListingResponse,
  NewReview,
  Review,
  NewUserReq,
  NewUser,
  EmailRequest,
  LoginRequest,
  User,
  EmailConfirmationRequest,
  SearchResultsResponse,
  ListingEntity,
  ListingSummary,
  SearchHistoryResponse,
  UserProfile,
  MessageThread,
  Message,
  ListingPatchRequest,
  ItemStatus,
  UpdateUser,
} from '../interfaces'
import YAML from 'yaml'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
const unmockedAxios: AxiosStatic = jest.requireActual('axios')

// Write your test
describe('POST', () => {
  // Load your OpenAPI spec from a web endpoint
  beforeAll(async () => {
    const response = await unmockedAxios.get(
      'http://market.lebl.ca/openapi.yaml'
    )
    const openApiSpec = response.data
    jestOpenAPI(YAML.parse(openApiSpec))

    await SetAxios(mockedAxios)
  })

  it('/api/listing should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/listing'
    const testRequest: ListingRequest = {
      listing: {
        title: 'Used Calculus Textbook',
        description: 'No wear and tear, drop-off available.',
        price: 50,
        location: {
          latitude: 34.23551,
          longitude: -104.54451,
        },
        images: [
          {
            url: 'https://example.com/image',
          },
        ],
      },
    }
    const testResponse: ListingResponse = {
      listing: {
        listingID: 'A23F29039B23',
        title: 'Used Calculus Textbook',
        seller_profile: {
          userID: 'A12334B345',
          username: 'hubert123',
          name: 'Bartholomew Hubert',
          bio: 'I love stuff',
          profilePictureUrl: 'https://example.com/image.png',
        },
        description: 'No wear and tear, drop-off available.',
        price: 50,
        location: {
          latitude: 34.23551,
          longitude: -104.54451,
        },
        status: 'AVAILABLE',
        dateCreated: '2024-05-23T15:30:00Z',
        dateModified: '2024-05-23T15:30:00Z',
        reviews: [
          {
            listing_review_id: 'A23F29039B23',
            reviewerName: 'John Doe',
            stars: 5,
            comment:
              'Great seller, the item was exactly as described and in perfect condition.',
            userID: 'A23434B090934',
            listingID: 'A23F29039B23',
            dateCreated: '2024-05-23T15:30:00Z',
            dateModified: '2024-05-23T15:30:00Z',
          },
        ],
        images: [
          {
            url: 'https://example.com/image',
          },
        ],
        distance: 4.2,
      },
    }
    mockedAxios.post.mockResolvedValueOnce({ status: 201, data: testResponse })

    const res = await APIPost<ListingResponse, ListingRequest>(
      testURL,
      testRequest
    )
    // // expect(res.status).toEqual(200);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      baseUrl + testURL,
      testRequest
    )
    expect(testRequest.listing).toSatisfySchemaInApiSpec('NewListing')
    expect(res?.listing).toSatisfySchemaInApiSpec('Listing')
  })

  it('/api/review should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/review'
    const testRequest: NewReview = {
      listing_rating_id: 'A23F29039B23',
      stars: 5,
      comment:
        'Great seller, the item was exactly as described and in perfect condition.',
      listingID: 'A23F29039B23',
    }
    const testResponse: Review = {
      listing_review_id: 'A23F29039B23',
      reviewerName: 'John Doe',
      stars: 5,
      comment:
        'Great seller, the item was exactly as described and in perfect condition.',
      userID: 'A23434B090934',
      listingID: 'A23F29039B23',
      dateCreated: '2024-05-23T15:30:00Z',
      dateModified: '2024-05-23T15:30:00Z',
    }
    mockedAxios.post.mockResolvedValueOnce({ status: 201, data: testResponse })
    const res = await APIPost<Review, NewReview>(testURL, testRequest)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      baseUrl + testURL,
      testRequest
    )
    expect(testRequest).toSatisfySchemaInApiSpec('NewReview')
    expect(res).toSatisfySchemaInApiSpec('Review')
  })

  it('/api/recommendations/stop should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/recommendations/stop'
    const testID: string = '/A23F29039B23'
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: null })
    const res = await APIPost(testURL + testID)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      baseUrl + testURL + testID,
      undefined
    )
    expect(res).toEqual(null)
  })

  it('/api/user should satisfy OpenAPI spec', async () => {
    const testURL: string = '/api/user'
    const testRequest: NewUserReq = {
      username: 'hubert123',
      name: 'Bartholomew Hubert',
      email: 'A23434B090934',
      password: 'securepassword123',
    }
    const testResponse: NewUser = {
      userID: 'A12334B345',
      username: 'hubert123',
      name: 'Bartholomew Hubert',
      bio: "I wish my parents didn't name me Bartholomew Hubert",
      profileUrl: 'https://example.com/image.png',
      email: 'A23434B090934',
      totp_secret: '60b725f10c9c85c70d97880dfe8191b3',
      totp_uri: '60b725f10c9c85c70d97880dfe8191b3',
    }
    mockedAxios.post.mockResolvedValueOnce({ status: 201, data: testResponse })
    const res = await APIPost<NewUser, NewUserReq>(testURL, testRequest)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      baseUrl + testURL,
      testRequest
    )
    expect(testRequest).toSatisfySchemaInApiSpec('NewUserReq')
    expect(res).toSatisfySchemaInApiSpec('NewUser')
  })

  it('/api/user/reset-password should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/user/reset-password'
    const testRequest: EmailRequest = {
      email: 'hubert@gmail.com',
    }
    mockedAxios.post.mockResolvedValueOnce({ status: 201, data: null })
    const res = await APIPost<undefined, EmailRequest>(testURL, testRequest)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      baseUrl + testURL,
      testRequest
    )
    expect(res).toEqual(null)
  })

  it('/api/user/login should satisfy OpenAPI spec', async () => {
    const testURL: string = '/api/user/login'
    const testRequest: LoginRequest = {
      email: 'hubert@gmail.com',
      password: 'securepassword123',
      totp_code: '123456',
    }
    const testResponse: User = {
      userID: 'A12334B345',
      username: 'hubert123',
      name: 'Bartholomew Hubert',
      bio: "I wish my parents didn't name me Bartholomew Hubert",
      profileUrl: 'https://example.com/image.png',
      email: 'A23434B090934',
    }
    mockedAxios.post.mockResolvedValueOnce({ status: 201, data: testResponse })
    const res = await APIPost<User, LoginRequest>(testURL, testRequest)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      baseUrl + testURL,
      testRequest
    )
    expect(testRequest).toSatisfySchemaInApiSpec('LoginRequest')
    expect(res).toSatisfySchemaInApiSpec('User')
  })

  it('/api/user/logout should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/user/logout'
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: null })
    const res = await APIPost(testURL)
    expect(mockedAxios.post).toHaveBeenCalledWith(baseUrl + testURL, undefined)
    expect(res).toEqual(null)
  })

  it('/api/user/send-confirmation-email should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/user/send-confirmation-email'
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: null })
    const res = await APIPost(testURL)
    expect(mockedAxios.post).toHaveBeenCalledWith(baseUrl + testURL, undefined)
    expect(res).toEqual(null)
  })

  it('/api/user/confirm-email should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/user/confirm-email'
    const testRequest: EmailConfirmationRequest = {
      code: 'ABKJAHSD87837e987adsSAD',
    }
    mockedAxios.post.mockResolvedValueOnce({ status: 201, data: null })
    const res = await APIPost<undefined, EmailConfirmationRequest>(
      testURL,
      testRequest
    )
    expect(mockedAxios.post).toHaveBeenCalledWith(
      baseUrl + testURL,
      testRequest
    )
    expect(res).toEqual(null)
  })
})

describe('GET', () => {
  // Load your OpenAPI spec from a web endpoint
  beforeAll(async () => {
    const response = await unmockedAxios.get(
      'http://market.lebl.ca/openapi.yaml'
    )
    const openApiSpec = response.data
    jestOpenAPI(YAML.parse(openApiSpec))

    await SetAxios(mockedAxios)
  })

  it('/api/listing should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/listing'
    const testID: string = '/A23F29039B23'
    const testResponse: ListingEntity = {
      listingID: 'A23F29039B23',
      title: 'Used Calculus Textbook',
      seller_profile: {
        userID: 'A12334B345',
        username: 'hubert123',
        name: 'Bartholomew Hubert',
        bio: 'I love stuff',
        profilePictureUrl: 'https://example.com/image.png',
      },
      description: 'No wear and tear, drop-off available.',
      price: 50,
      location: {
        latitude: 34.23551,
        longitude: -104.54451,
      },
      status: 'AVAILABLE',
      dateCreated: '2024-05-23T15:30:00Z',
      dateModified: '2024-05-23T15:30:00Z',
      reviews: [
        {
          listing_review_id: 'A23F29039B23',
          reviewerName: 'John Doe',
          stars: 5,
          comment:
            'Great seller, the item was exactly as described and in perfect condition.',
          userID: 'A23434B090934',
          listingID: 'A23F29039B23',
          dateCreated: '2024-05-23T15:30:00Z',
          dateModified: '2024-05-23T15:30:00Z',
        },
      ],
      images: [
        {
          url: 'https://example.com/image',
        },
      ],
      distance: 4.2,
    }
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: testResponse })

    const res = await APIGet<ListingEntity>(testURL + testID)
    expect(mockedAxios.get).toHaveBeenCalledWith(baseUrl + testURL + testID)
    expect(res).toSatisfySchemaInApiSpec('Listing')
  })

  it('/api/search should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/search'
    const queryParams: [string, string | number][] = [
      ['query', 'textbook'],
      ['minPricez', 0],
    ]
    const testResponse: SearchResultsResponse = {
      items: [
        {
          listingID: 'A23F29039B23',
          sellerID: 'A23F29039B23',
          sellerName: 'A23F29039B23',
          title: 'Used Calculus Textbook',
          description: 'No wear and tear, drop-off available.',
          price: 50,
          dateCreated: '2024-05-23T15:30:00Z',
          imageUrl: 'image URL for first Image',
          charityID: '1',
        },
      ],
      totalItems: 1,
    }
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: testResponse })
    const res = await APIGet<SearchResultsResponse>(testURL, queryParams)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      baseUrl + testURL + '?query=textbook&minPricez=0'
    )
    expect(res?.items[0]).toSatisfySchemaInApiSpec('ListingSummary')
    expect(res?.totalItems).toEqual(res?.items.length)
  })

  it('/api/recommendations should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/recommendations'
    const queryParams: [string, string | number][] = [
      ['page', 1],
      ['limit', 1],
    ]
    const testResponse: ListingSummary[] = [
      {
        listingID: 'A23F29039B23',
        sellerID: 'A23F29039B23',
        sellerName: 'A23F29039B23',
        title: 'Used Calculus Textbook',
        description: 'No wear and tear, drop-off available.',
        price: 50,
        dateCreated: '2024-05-23T15:30:00Z',
        imageUrl: 'image URL for first Image',
        charityID: '1',
      },
    ]

    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: testResponse })
    const res = await APIGet<ListingSummary[]>(testURL, queryParams)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      baseUrl + testURL + '?page=1&limit=1'
    )
    expect(res[0]).toSatisfySchemaInApiSpec('ListingSummary')
  })

  it('/api/user/search-history should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/user/search-history'
    const testResponse: SearchHistoryResponse = {
      searches: [
        {
          searchTerm: 'athletic shorts',
          searchID: 'A12334B345',
        },
      ],
    }
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: testResponse })
    const res = await APIGet<SearchHistoryResponse>(testURL)
    expect(mockedAxios.get).toHaveBeenCalledWith(baseUrl + testURL)
    expect(testResponse).toSatisfySchemaInApiSpec('SearchHistory')
  })

  it('/api/user/reset-password should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/user'
    const testID: string = '/A23F29039B23'
    const testResponse: UserProfile = {
      userID: 'A12334B345',
      username: 'hubert123',
      name: 'Bartholomew Hubert',
      bio: 'I love stuff',
      profilePictureUrl: 'https://example.com/image.png',
    }
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: testResponse })
    const res = await APIGet<UserProfile>(testURL + testID)
    expect(mockedAxios.get).toHaveBeenCalledWith(baseUrl + testURL + testID)
    expect(res).toSatisfySchemaInApiSpec('UserProfile')
  })

  it('/api/messages/overview should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/messages/overview'
    const queryParams: [string, string | number][] = [
      ['num_items', 1],
      ['offset', 1],
    ]
    const testResponse: MessageThread[] = [
      {
        listing_id: 'L23434B090934',
        other_participant: {
          user_id: 'A23434B090934',
          name: 'John Doe',
          profilePicture: 'https://example.com/image.png',
        },
        last_message: {
          sender_id: 'A23434B090934',
          receiver_id: 'A23434B090936',
          listing_id: 'L23434B090934',
          content: 'Hello, is this still available?',
          sent_at: 1625247600,
        },
      },
    ]

    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: testResponse })
    const res = await APIGet<MessageThread[]>(testURL, queryParams)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      baseUrl + testURL + '?num_items=1&offset=1'
    )
    expect(res[0]).toSatisfySchemaInApiSpec('MessageThread')
  })

  it('/api/messages/overview should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/messages/overview'
    const testListingID: string = '/A23F29039B23'
    const testReciverID: string = '/A23F29039B23'
    const queryParams: [string, string | number][] = [
      ['num_items', 1],
      ['offset', 1],
    ]
    const testResponse: Message[] = [
      {
        sender_id: 'A23434B090934',
        receiver_id: 'A23434B090936',
        listing_id: 'L23434B090934',
        content: 'Hello, is this still available?',
        sent_at: 1625247600,
      },
    ]

    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: testResponse })
    const res = await APIGet<Message[]>(
      testURL + testListingID + testReciverID,
      queryParams
    )
    expect(mockedAxios.get).toHaveBeenCalledWith(
      baseUrl +
        testURL +
        testListingID +
        testReciverID +
        '?num_items=1&offset=1'
    )
    expect(res[0]).toSatisfySchemaInApiSpec('Message')
  })

  //Need to figure out how the GET /api/messages/connect works
})

describe('PATCH', () => {
  // Load your OpenAPI spec from a web endpoint
  beforeAll(async () => {
    const response = await unmockedAxios.get(
      'http://market.lebl.ca/openapi.yaml'
    )
    const openApiSpec = response.data
    jestOpenAPI(YAML.parse(openApiSpec))

    await SetAxios(mockedAxios)
  })

  it('/api/listing should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/listing'
    const testID: string = '/A23F29039B23'
    const testRequest: ListingPatchRequest = {
      listing: {
        title: 'Used Calculus Textbook',
        description: 'No wear and tear, drop-off available.',
        price: 50,
        location: {
          latitude: 34.23551,
          longitude: -104.54451,
        },
        images: [
          {
            url: 'https://example.com/image',
          },
        ],
      },
      status: ItemStatus.AVAILABLE,
    }

    mockedAxios.patch.mockResolvedValueOnce({ status: 200, data: null })
    const res = await APIPatch<undefined, ListingPatchRequest>(
      testURL + testID,
      testRequest
    )
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      baseUrl + testURL + testID,
      testRequest
    )
    expect(testRequest?.listing).toSatisfySchemaInApiSpec('NewListing')
    expect(testRequest?.status).toSatisfySchemaInApiSpec('ItemStatus')
    expect(res).toEqual(null)
  })

  it('/api/review should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/review'
    const testID: string = '/A23F29039B23'
    const testRequest: NewReview = {
      listing_rating_id: 'A23F29039B23',
      stars: 5,
      comment:
        'Great seller, the item was exactly as described and in perfect condition.',
      listingID: 'A23F29039B23',
    }
    const testResponse: Review = {
      listing_review_id: 'A23F29039B23',
      reviewerName: 'John Doe',
      stars: 5,
      comment:
        'Great seller, the item was exactly as described and in perfect condition.',
      userID: 'A23434B090934',
      listingID: 'A23F29039B23',
      dateCreated: '2024-05-23T15:30:00Z',
      dateModified: '2024-05-23T15:30:00Z',
    }
    mockedAxios.patch.mockResolvedValueOnce({ status: 200, data: testResponse })
    const res = await APIPatch<Review, NewReview>(testURL + testID, testRequest)
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      baseUrl + testURL + testID,
      testRequest
    )
    expect(testRequest).toSatisfySchemaInApiSpec('NewReview')
    expect(res).toSatisfySchemaInApiSpec('Review')
  })

  it('/api/user should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/user'
    const testID: string = '/A23F29039B23'
    const testRequest: UpdateUser = {
      username: 'hubert123',
      name: 'Bartholomew Hubert',
      password: 'securepassword123',
      bio: 'I love stuff',
      profilePictureUrl: 'https://example.com/image.png',
    }
    const testResponse: User = {
      userID: 'A12334B345',
      username: 'hubert123',
      name: 'Bartholomew Hubert',
      bio: "I wish my parents didn't name me Bartholomew Hubert",
      profileUrl: 'https://example.com/image.png',
      email: 'A23434B090934',
    }
    mockedAxios.patch.mockResolvedValueOnce({ status: 200, data: testResponse })
    const res = await APIPatch<User, UpdateUser>(testURL + testID, testRequest)
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      baseUrl + testURL + testID,
      testRequest
    )
    expect(testRequest).toSatisfySchemaInApiSpec('UpdateUser')
    expect(res).toSatisfySchemaInApiSpec('User')
  })
})

describe('DELETE', () => {
  // Load your OpenAPI spec from a web endpoint
  beforeAll(async () => {
    const response = await unmockedAxios.get(
      'http://market.lebl.ca/openapi.yaml'
    )
    const openApiSpec = response.data
    jestOpenAPI(YAML.parse(openApiSpec))

    await SetAxios(mockedAxios)
  })

  it('/api/listing should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/listing'
    const testID: string = '/A23F29039B23'
    mockedAxios.delete.mockResolvedValueOnce({ status: 200, data: null })
    const res = await APIDelete(testURL + testID)
    expect(mockedAxios.delete).toHaveBeenCalledWith(baseUrl + testURL + testID)
    expect(res).toEqual(undefined)
  })

  it('/api/review should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/review'
    const testID: string = '/A23F29039B23'
    mockedAxios.delete.mockResolvedValueOnce({ status: 200, data: null })
    const res = await APIDelete(testURL + testID)
    expect(mockedAxios.delete).toHaveBeenCalledWith(baseUrl + testURL + testID)
    expect(res).toEqual(undefined)
  })

  it('/api/user/search-history should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/user/search-history'
    const queryParams: [string, string | number][] = [
      ['searchID', 'A23F29039B23'],
    ]

    mockedAxios.delete.mockResolvedValueOnce({ status: 200, data: null })
    const res = await APIDelete(testURL, queryParams)
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      baseUrl + testURL + '?searchID=A23F29039B23'
    )
    expect(res).toEqual(undefined)
  })

  it('/api/user should satisfy OpenAPI spec', async () => {
    const testURL: string = 'api/user/search-history'
    mockedAxios.delete.mockResolvedValueOnce({ status: 200, data: null })
    const res = await APIDelete(testURL)
    expect(mockedAxios.delete).toHaveBeenCalledWith(baseUrl + testURL)
    expect(res).toEqual(undefined)
  })
})
