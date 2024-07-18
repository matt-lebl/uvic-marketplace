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
  reviews: {
    listing_review_id: string
    reviewerName: string
    stars: number
    comment: string
    userID: string
    listingID: string
    dateCreated: string
    dateModified: string
  }[]
  images: {
    url: string
  }[]
  distance: number
}

export interface NewReview {
  listing_rating_id: string
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
}

export interface SearchResultsResponse {
  items: ListingSummary[]
  totalItems: number
}

export interface SearchHistoryResponse {
  searches: [
    {
      searchTerm: string
      searchID: string
    },
  ]
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
  last_message: {
    sender_id: string
    receiver_id: string
    listing_id: string
    content: string
    sent_at: number
  }
}

export interface Message {
  sender_id: string
  receiver_id: string
  listing_id: string
  content: string
  sent_at: number
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

export interface CharityEntity {
  id: string,
  name: string,
  description: string,
  startDate: any, // need a date/time obj
  endDate: any,
  imageUrl: string,
  organizations: {
    name: string,
    logoUrl: string,
    donated: number,
    received: number
  }[],
  funds:number,
  listingsCount:number
}