export interface ErrorResponse{
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