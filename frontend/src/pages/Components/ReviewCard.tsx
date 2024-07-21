//profile Icon
//Star element
//read only if not in edit mode
//reviwer Name
//text dispaly
//Read only if not in edit mode
//date added
//date modified.

import React from 'react'
import { Typography, Box, Paper, Rating } from '@mui/material'
import ProfileIcon from './ProfileIcon'
import { Review } from '../../interfaces'

interface Props {
    data?: Review,
    startInEditMode?: boolean
    listingID: string
}

const ReviewCard: React.FC<Props> = ({ data, startInEditMode, listingID }) => {
    const [listing_review_id, setListingReviewId] = React.useState<string>(data?.listing_review_id ?? 'new-review');
    const [reviewerName, setReviewerName] = React.useState<string>(data?.reviewerName ?? localStorage.getItem('username') ?? "Unknown");
    const [stars, setStars] = React.useState<number>(data?.stars || 0);
    const [comment, setComment] = React.useState<string>(data?.comment || '');
    const [userID, setUserID] = React.useState<string>(data?.userID || '');
    const [dateCreated, setDateCreated] = React.useState<string>(data?.dateCreated || '');
    const [dateModified, setDateModified] = React.useState<string>(data?.dateModified || '');
    const [editMode, setEditMode] = React.useState<boolean>(startInEditMode || false);

    //need to add edit button.
    return (
        <div className="Review-Card">
            <form onSubmit={handleSubmit} data-testid={listing_review_id + "-review-form"}>
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '50px',
                            flexGrow: 1,
                        }}>
                        <Paper sx={{ flexGrow: 1, ml: '30px' }}>
                            <Rating
                                name="simple-controlled"
                                value={stars}
                                readOnly={!editMode}
                                onChange={(event, newValue) => {
                                    setStars(newValue ?? 0);
                                }}
                            />
                            <Typography sx={{ m: '30px' }}>{reviewerName}</Typography>
                            <Typography sx={{ m: '30px' }}>{comment}</Typography>
                        </Paper>
                    </Box>
                    <Paper
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            p: '20px',
                            m: '10px 50px 10px 50px',
                        }}
                    >
                        <Typography>Added: {dateCreated}</Typography>
                        <Typography>Last Modified:{dateModified}</Typography>
                    </Paper>
                </Box>
            </form>
        </div>
    )
}

export default ReviewCard
