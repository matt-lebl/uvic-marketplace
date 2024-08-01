import React, { useState } from 'react'
import '../App.css'
import { Typography, Box, Paper, Grid, Button } from '@mui/material'
import { APIDelete, APIPatch, APIPost } from '../../APIlink'
import { NewReview, Review } from '../../interfaces'
import ReviewCard, { ReviewProps } from './ReviewCard'

interface ReviewsProps {
    listingID: string
    initialReviews?: Review[]
}

const Reviews: React.FC<ReviewsProps> = ({ listingID, initialReviews }) => {
    const [userID, setUserID] = useState(localStorage.getItem('userID'))
    const [otherUserReviews, setOtherUserReviews] = useState<ReviewProps[]>((initialReviews?.filter((review) => review.userID !== userID)
        .map((review) => {
            return {
                data: review,
                startInEditMode: false,
                listingID: listingID,
            }
        }) ?? []) as ReviewProps[])

    const deleteReview = (listing_review_id: string) => {
        const func = async () => {
            try {
                const URL: string = `/api/review/${listing_review_id}`;
                await APIDelete(URL);
                setReviewData(otherUserReviews)
                setHasExistingReview(false)
            }
            catch (error) {
                console.log('Request Error', error)
            }
        }
        func()
    };

    const modifyReview = (review: Review) => {
        const func = async () => {
            try {
                const URL: string = `/api/review/${review.listing_review_id}`;
                const updatedReview: NewReview = {
                    stars: review.stars,
                    comment: review.comment,
                    listingID: review.listingID,
                };
                await APIPatch<Review, NewReview>(URL, updatedReview);
                review.dateModified = new Date().toISOString();
                setReviewData([
                    {
                        data: review,
                        startInEditMode: false,
                        listingID: listingID,
                        onDeleteReview: deleteReview,
                        onModifyReview: modifyReview,
                    },
                    ...otherUserReviews,
                ] as ReviewProps[]);
                return
            }
            catch (error) {
                console.log('Request Error', error)
            }
        }
        func()
    };

    const [reviewData, setReviewData] = useState<ReviewProps[]>([
        ...initialReviews?.filter((review) => review.userID === userID).map((review) => {
            return {
                data: review,
                startInEditMode: false,
                listingID: listingID,
                onDeleteReview: deleteReview,
                onModifyReview: modifyReview,
            }
        }) ?? [],
        ...otherUserReviews,
    ] as ReviewProps[])

    const cancelCreateReview = () => {
        setReviewData(otherUserReviews);
    };

    const postNewReview = (review: NewReview) => {
        const func = async () => {
            try {
                const URL: string = `/api/review`;
                const newReview = await APIPost<Review, NewReview>(URL, review);
                if (newReview) {
                    setReviewData([
                        {
                            data: newReview,
                            startInEditMode: false,
                            listingID: listingID,
                            onDeleteReview: deleteReview,
                            onModifyReview: modifyReview,
                        },
                        ...otherUserReviews,
                    ] as ReviewProps[])
                    setHasExistingReview(true)
                }
            }
            catch (error) {
                console.log('Request Error', error)
            }
        }
        func()
    };

    const createReview = () => {
        setReviewData([
            {
                data: {
                    listing_review_id: 'new-review',
                    reviewerName: localStorage.getItem('username') ?? "Unknown",
                    stars: 0,
                    comment: '',
                    userID: userID,
                    dateCreated: '',
                    dateModified: '',
                    listingID: listingID,
                } as Review,
                startInEditMode: true,
                listingID: listingID,
                onCreateReview: postNewReview,
                onCancelCreateReview: cancelCreateReview,
            },
            ...otherUserReviews,
        ]);
    };
    const [hasExistingReview, setHasExistingReview] = useState(!(initialReviews?.every((value) => value.userID !== userID)) ?? false)

    return (
        <div data-testid="Reviews">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '50px',
                    flexGrow: 1,
                }}>
                <Paper
                    sx={{
                        padding: '20px',
                        backgroundColor: '#ffffff',
                        flexGrow: 1,
                    }}>
                    <Box
                        sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                            flexGrow: 1,
                        }}
                    >
                        <Typography sx={{ fontWeight: '700' }}>Reviews</Typography>
                        {hasExistingReview ? null :
                            <Button
                                variant="contained"
                                onClick={createReview}
                                sx={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#25496A',
                                    color: '#B5DBFF',
                                    fontSize: '30px',
                                    borderRadius: '10px',
                                }}
                            >
                                +
                            </Button>
                        }
                    </Box>
                    < Grid border={'white'} bgcolor={'transparent'} width={'100%'}>
                        {reviewData.map((reviewProps, index) => {
                            return (
                                <Grid item sx={{ width: '100%', padding: '10px' }} key={reviewProps.data.listing_review_id}>
                                    <ReviewCard {...reviewProps} />
                                </Grid>
                            )
                        })}
                    </Grid >
                </Paper>
            </Box>
        </div>)
}

export default Reviews
