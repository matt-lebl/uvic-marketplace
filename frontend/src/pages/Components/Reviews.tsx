import React, { useState, useEffect } from 'react'
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
    const [reviewData, setReviewData] = useState<ReviewProps[]>((initialReviews?.map((review) => {
        return {
            data: review,
            startInEditMode: false,
            listingID: listingID,
            onDeleteReview: review.userID == userID ? deleteReview : null,
            onCreateReview: postNewReview,
            onModifyReview: review.userID == userID ? modifyReview : null,
            onCancelCreateReview: cancelCreateReview,
        }
    }) ?? []) as ReviewProps[])
    const [hasExistingReview, setHasExistingReview] = useState(!(initialReviews?.every((value) => value.userID != userID)) ?? false)


    const createReview = () => {
        setReviewData([
            {
                data: undefined,
                startInEditMode: true,
                listingID: listingID,
                onDeleteReview: deleteReview,
                onCreateReview: postNewReview,
                onModifyReview: modifyReview,
                onCancelCreateReview: cancelCreateReview,
            },
            ...reviewData,
        ]);
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
                            onCreateReview: postNewReview,
                            onModifyReview: modifyReview,
                            onCancelCreateReview: cancelCreateReview,
                        },
                        ...(reviewData.filter((review) => review.data !== undefined)),
                    ])
                    setHasExistingReview(true)
                }
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
                        onCreateReview: postNewReview,
                        onModifyReview: modifyReview,
                        onCancelCreateReview: cancelCreateReview,
                    },
                    ...(reviewData.filter((r) => r.data?.listing_review_id !== review.listing_review_id)),
                ]);
            }
            catch (error) {
                console.log('Request Error', error)
            }
        }
        func()
    };

    const cancelCreateReview = () => {
        setReviewData(reviewData.filter((review) => review.data !== undefined));
    };

    const deleteReview = (listing_review_id: string) => {
        const func = async () => {
            try {
                const URL: string = `/api/review/${listing_review_id}`;
                await APIDelete(URL);
                setReviewData(reviewData.filter((review) => review.data?.listing_review_id !== listing_review_id))
                setHasExistingReview(false)
            }
            catch (error) {
                console.log('Request Error', error)
            }
        }
        func()
    };
    /*
                            padding: '0px',
    */
    return (
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
                < Grid border={'white'} bgcolor={'transparent'} width={'100%'} >
                    {
                        reviewData.map((reviewProps, index) => (
                            <Grid item sx={{ width: '100%', padding: '10px' }} key={index}>
                                <ReviewCard {...reviewProps} />
                            </Grid>
                        ))
                    }
                </Grid >
            </Paper>
        </Box>)
}

export default Reviews
