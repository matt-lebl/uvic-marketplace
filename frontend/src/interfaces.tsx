export default interface ErrorResponse {
  error: string
}

export interface ListingRequest {
  listing: NewListing
}

export interface NewListing {
  title: string
  description: string
  price: number
  location: {
    latitude: number
    longitude: number
  }
  images: {
    url: string
  }[]
}

export interface PatchListing {
  listing: {
    title: string
    description: string
    price: number
    location: {
      latitude: number
      longitude: number
    }
    images: {
      url: string
    }[]
    markedForCharity: boolean
  }
  status : string
}

export interface ListingResponse {
  listing: ListingEntity
}

export interface ListingEntity {
  listingID: string
  seller_profile: {
    userID: string
    username: string
    name: string
    bio: string
    profilePictureUrl: string
  }
  title: string
  description: string
  price: number
  location: {
    latitude: number
    longitude: number
  }
  status: string
  dateCreated: string
  dateModified: string
  reviews: Review[]
  images: {
    url: string
  }[]
  distance: number
  charityId: string
}

export interface NewReview {
  listing_rating_id?: string
  stars: number
  comment: string
  listingID: string
}

export interface Review {
  listing_review_id: string
  reviewerName: string
  stars: number
  comment: string
  userID: string
  listingID: string
  dateCreated: string
  dateModified: string
}

export interface NewUserReq {
  username: string
  name: string
  email: string
  password: string
}

export interface NewUser {
  userID: string
  username: string
  name: string
  bio: string
  profileUrl: string
  email: string
  totp_secret: string
  totp_uri: string
}

export interface User {
  userID: string
  username: string
  name: string
  bio: string
  profileUrl: string
  email: string
}

export interface EmailRequest {
  email: string
}

export interface LoginRequest {
  email: string
  password: string
  totp_code: string
}

export interface EmailConfirmationRequest {
  code: string
}

export interface ListingSummary {
  listingID: string
  sellerID: string
  sellerName: string
  title: string
  description: string
  price: number
  dateCreated: string
  imageUrl: string
  charityID: string
}

export interface SearchResultsResponse {
  items: ListingSummary[]
  totalItems: number
}

export interface SearchHistoryResponse {
  searches: Search[]
}
export interface Search {
  searchTerm: string
  searchID: string
}

export interface UserProfile {
  userID: string
  username: string
  name: string
  bio: string
  profilePictureUrl: string
}

export interface MessageThread {
  listing_id: string
  other_participant: {
    user_id: string
    name: string
    profilePicture: string
  }
  last_message: Message
}

export interface Message {
  sender_id: string
  receiver_id: string
  listing_id: string
  content: string
  sent_at: number
}

export interface NewMessage {
  receiver_id: string
  listing_id: string
  content: string
}

export interface ListingPatchRequest {
  listing: NewListing
  status: ItemStatus
}

export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
}

export interface UpdateUser {
  username: string
  name: string
  password: string
  bio: string
  profilePictureUrl: string
}

export enum SearchType {
  USERS = 'USERS',
  LISTINGS = 'LISTINGS',
}

export enum Sort {
  RELEVANCE = 'RELEVANCE',
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DESC = 'PRICE_DESC',
  LISTED_TIME_ASC = 'LISTED_TIME_ASC',
  LISTED_TIME_DESC = 'LISTED_TIME_DESC',
  DISTANCE_ASC = 'DISTANCE_ASC',
  DISTANCE_DESC = 'DISTANCE_DESC',
}

export interface SearchRequest {
  query: string
  minPrice?: number
  maxPrice?: number
  status?: ItemStatus
  searchType?: SearchType
  latitude: number
  longitude: number
  sort?: Sort
  page?: number
  limit?: number
}
export interface CharityEntity {
  id: string
  name: string
  description: string
  startDate: any // need a date/time obj
  endDate: any
  imageUrl: string
  organizations: OrgEntity[]
  funds: number
  listingsCount: number
}

export interface OrgEntity {
  name: string
  logoUrl: string
  donated: number
  received: boolean
}
