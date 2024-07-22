import React, { useState, useEffect } from 'react'
import './App.css'
import { Typography, Box, Paper, Grid, Button } from '@mui/material'
import PhotoGallery from './Components/PhotoGallery'
import SellerCard from './Components/SellerCard'
import { useParams } from 'react-router-dom'
import { APIDelete, APIGet, APIPatch, APIPost } from '../APIlink'
import { ListingEntity, NewReview, Review } from '../interfaces'
import ReviewCard, { ReviewProps } from './Components/ReviewCard'

interface ListingProps {
  listingData?: ListingEntity
}

const Listing: React.FC<ListingProps> = ({ listingData: initialListingData, }) => {
  const { listingID } = useParams()
  const [listingData, setListingData] = useState<ListingEntity | undefined>(
    initialListingData
  )
  const [loading, setLoading] = useState(!initialListingData)
  const [reviewData, setReviewData] = useState<ReviewProps[]>([])
  const [hasExistingReview, setHasExistingReview] = useState(false)

  const createReview = () => {
    setReviewData([
      {
        data: undefined,
        startInEditMode: true,
        listingID: listingID ?? '', //should never actually be undefined
        onDeleteReview: deleteReview,
        onCreateReview: postNewReview,
        onModifyReview: modifyReview,
        onCancelCreateReview: cancelCreateReview,
      },
      ...reviewData,
    ]);
  };

  const postNewReview = (review: NewReview) => {
    setTimeout(async () => {
      try {
        const URL: string = `/api/review`;
        const newReview = await APIPost<Review, NewReview>(URL, review);
        if (newReview) {
          setReviewData([
            {
              data: newReview,
              startInEditMode: false,
              listingID: listingID ?? '', //should never actually be undefined
              onDeleteReview: deleteReview,
              onCreateReview: postNewReview,
              onModifyReview: modifyReview,
              onCancelCreateReview: cancelCreateReview,
            },
            ...(reviewData.filter((review) => review.data !== undefined)),
          ]
          )
          setHasExistingReview(true)
        }
      }
      catch (error) {
        console.log('Request Error', error)
      }
    }, 1000);
  };

  const modifyReview = (review: Review) => {
    setTimeout(async () => {
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
            listingID: listingID ?? '', //should never actually be undefined
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
    }, 1000);
  };

  const cancelCreateReview = () => {
    setReviewData(reviewData.filter((review) => review.data !== undefined));
  };

  const deleteReview = (listing_review_id: string) => {
    setTimeout(async () => {
      try {
        const URL: string = `/api/review/${listing_review_id}`;
        await APIDelete(URL);
        setReviewData(reviewData.filter((review) => review.data?.listing_review_id !== listing_review_id))
        setHasExistingReview(false)
      }
      catch (error) {
        console.log('Request Error', error)
      }
    }, 1000);
  };

  useEffect(() => {
    async function fetchListing() {
      if (!listingID || initialListingData) return

      const listingURL: string = `/api/listing/${listingID}`

      try {
        const response = (await APIGet(listingURL)) as ListingEntity
        if (response) {
          let userID = localStorage.getItem('userID')
          setListingData(response)
          setReviewData((response.reviews?.map((review) => {
            if (review.userID === userID) { setHasExistingReview(true) }
            return {
              data: review,
              startInEditMode: false,
              listingID: listingID ?? '', //should never actually be undefined
              onDeleteReview: deleteReview,
              onCreateReview: postNewReview,
              onModifyReview: modifyReview,
              onCancelCreateReview: cancelCreateReview,
            }
          }) ?? []) as ReviewProps[]);
        }
      } catch (error) {
        console.log('Request Error', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [listingID, initialListingData])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!listingData) {
    return <div>Listing not found</div>
  }

  return (
    <div className="Listing">
      <header className="App-header">
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Paper
            sx={{
              padding: '20px',
              height: '85vh',
              backgroundColor: '#ffffff',
            }}
          >
            <Typography sx={{ fontWeight: '700' }}>Photo Gallery</Typography>
            <PhotoGallery images={listingData.images} />
          </Paper>
          <Paper
            sx={{
              minWidth: '40vw',
              ml: 5,
              backgroundColor: '#656565',
              height: '85vh',
              overflow: 'auto',
            }}
          >
            <SellerCard data={listingData} />
          </Paper>
        </Box>
      </header>
      <Box sx={{ mt: 2, ml: 2 }}>
        <Typography variant="h4">{listingData.title}</Typography>
        <Typography variant="body1">{listingData.description}</Typography>
        <Typography variant="h6">${listingData.price}</Typography>
      </Box>
      {hasExistingReview ? null : <Button onClick={createReview}>Add Review</Button>}
      <Grid border={'white'} bgcolor={'transparent'} width={'100%'}>
        {reviewData.map((reviewProps, index) => (
          <Grid item sx={{ width: '100%' }} key={index}>
            <ReviewCard {...reviewProps} />
          </Grid>
        ))}
      </Grid>
    </div >
  )
}

export default Listing
