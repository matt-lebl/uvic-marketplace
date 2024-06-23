export default interface ErrorResponse {
    error: string;
}

export interface ListingRequest {
    listing: {
        title: string;
        description: string;
        price: number;
        location: {
            latitude: number;
            longitude: number;
        };
        images: {
            url: string;
        }[];
    };
}

export interface ListingResponse {
    listing: {
        listingID: string;
        seller_profile: {
            userID: string;
            username: string;
            name: string;
            bio: string;
            profilePictureUrl: string;
        };
        title: string;
        description: string;
        price: number;
        location: {
            latitude: number;
            longitude: number;
        };
        status: string;
        dateCreated: string;
        dateModified: string;
        reviews: {
            listing_review_id: string;
            reviewerName: string;
            stars: number;
            comment: string;
            userID: string;
            listingID: string;
            dateCreated: string;
            dateModified: string;
        }[];
        images: {
            url: string;
        }[];
        distance: number;
    };
}

export interface ListingEntity{
    listingID: string;
        seller_profile: {
            userID: string;
            username: string;
            name: string;
            bio: string;
            profilePictureUrl: string;
        };
        title: string;
        description: string;
        price: number;
        location: {
            latitude: number;
            longitude: number;
        };
        status: string;
        dateCreated: string;
        dateModified: string;
        reviews: {
            listing_review_id: string;
            reviewerName: string;
            stars: number;
            comment: string;
            userID: string;
            listingID: string;
            dateCreated: string;
            dateModified: string;
        }[];
        images: {
            url: string;
        }[];
        distance: number;
}

export interface ReviewRequest {
    listing_rating_id: string;
    stars: number;
    comment: string;
    listingID: string;
}

export interface ReviewResponse {
    listing_review_id: string;
    reviewerName: string;
    stars: number;
    comment: string;
    userID: string;
    listingID: string;
    dateCreated: string;
    dateModified: string;
}

export interface UserRequest {
    username: string;
    name: string;
    email: string;
    password: string;
}

export interface UserResponse {
    userID: string;
    username: string;
    name: string;
    bio: string;
    profileUrl: string;
    email: string;
    totp_secret: string;
}

export interface EmailRequest{
    email: string;
}

export interface LoginRequest{
    email: string;
    password: string;
    totp_code: string;
}

export interface EmailConfirmationRequest{
    code: string;
}

export interface ListingSummary{
    listingID: string;
    sellerID: string;
    sellerName: string;
    title: string;
    description: string;
    price: number;
    dateCreated: string;
    imageUrl: string;
}

export interface SearchResultsResponse {
    items: ListingSummary[];
    totalItems: number;
}

export interface SearchHistoryResponse{
    searches: [
    {
      searchTerm: string,
      searchID: string
    }
  ]
}

export interface UserProfile {
    userID: string;
    username: string;
    name: string;
    bio: string;
    profilePictureUrl: string;
}

export interface MessageThread {
    listing_id: string;
    other_participant: {
        user_id: string;
        name: string;
        profilePicture: string;
    };
    last_message: {
        sender_id: string;
        receiver_id: string;
        listing_id: string;
        content: string;
        sent_at: number;
    };
}

export interface Message {
    sender_id: string;
    receiver_id: string;
    listing_id: string;
    content: string;
    sent_at: number;
}
      
