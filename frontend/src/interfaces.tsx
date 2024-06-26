export default interface APIInterface {
}

export interface ErrorResponse extends APIInterface {
    error: string;
}

export interface ListingRequest extends APIInterface {
    listing: NewListing;
}

export interface NewListing extends APIInterface {
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
}

export interface ListingResponse extends APIInterface {
    listing: ListingEntity;
}

export interface ListingEntity extends APIInterface{
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

export interface NewReview extends APIInterface {
    listing_rating_id: string;
    stars: number;
    comment: string;
    listingID: string;
}

export interface Review extends APIInterface{
    listing_review_id: string;
    reviewerName: string;
    stars: number;
    comment: string;
    userID: string;
    listingID: string;
    dateCreated: string;
    dateModified: string;
}

export interface NewUserReq extends APIInterface {
    username: string;
    name: string;
    email: string;
    password: string;
}

export interface NewUser extends APIInterface {
    userID: string;
    username: string;
    name: string;
    bio: string;
    profileUrl: string;
    email: string;
    totp_secret: string;
}

export interface User extends APIInterface {
    userID: string;
    username: string;
    name: string;
    bio: string;
    profileUrl: string;
    email: string;
}

export interface EmailRequest extends APIInterface{
    email: string;
}

export interface LoginRequest extends APIInterface{
    email: string;
    password: string;
    totp_code: string;
}

export interface EmailConfirmationRequest extends APIInterface{
    code: string;
}

export interface ListingSummary extends APIInterface{
    listingID: string;
    sellerID: string;
    sellerName: string;
    title: string;
    description: string;
    price: number;
    dateCreated: string;
    imageUrl: string;
}

export interface SearchResultsResponse extends APIInterface{
    items: ListingSummary[];
    totalItems: number;
}

export interface SearchHistoryResponse extends APIInterface{
    searches: [
    {
      searchTerm: string,
      searchID: string
    }
  ]
}

export interface UserProfile extends APIInterface{
    userID: string;
    username: string;
    name: string;
    bio: string;
    profilePictureUrl: string;
}

export interface MessageThread extends APIInterface{
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

export interface Message extends APIInterface {
    sender_id: string;
    receiver_id: string;
    listing_id: string;
    content: string;
    sent_at: number;
}

export interface ListingPatchRequest extends APIInterface{
    listing: NewListing;
    status: ItemStatus;
}

export enum ItemStatus {
    AVAILABLE = "AVAILABLE",
    SOLD = "SOLD",
}
      
export interface UpdateUser extends APIInterface{
    username: string;
    name: string;
    password: string;
    bio: string;
    profilePictureUrl: string;
}