//profile Icon
//Star element
//read only if not in edit mode
//reviwer Name
//text dispaly
//Read only if not in edit mode
//date added
//date modified.

import React from 'react'
import { Typography, Box, Paper, Rating, TextField, Button, ButtonGroup } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { NewReview, Review } from '../../interfaces'

export interface ReviewProps {
    data?: Review,
    startInEditMode?: boolean
    listingID: string
    onDeleteReview: (listing_review_id: string) => void | null
    onCreateReview: (review: NewReview) => void
    onModifyReview: (review: Review) => void | null
    onCancelCreateReview: () => void
}

const ReviewCard: React.FC<ReviewProps> = ({ data, startInEditMode, listingID, onDeleteReview, onCreateReview, onModifyReview, onCancelCreateReview }) => {
    const [listing_review_id, setListingReviewId] = React.useState<string>(data?.listing_review_id ?? 'new-review');
    const [reviewerName, setReviewerName] = React.useState<string>(data?.reviewerName ?? localStorage.getItem('username') ?? "Unknown");
    const [stars, setStars] = React.useState<number>(data?.stars ?? 0);
    const [comment, setComment] = React.useState<string>(data?.comment ?? '');
    const [userID, setUserID] = React.useState<string>(data?.userID ?? '');
    const [dateCreated, setDateCreated] = React.useState<string>(data?.dateCreated ?? '');
    const [dateModified, setDateModified] = React.useState<string>(data?.dateModified ?? '');
    const [editMode, setEditMode] = React.useState<boolean>(startInEditMode ?? false);
    const [hasChanges, setHasChanges] = React.useState<boolean>(false);
    const [isOwningUser, setIsOwningUser] = React.useState<boolean>(data == null || data?.userID == localStorage.getItem('userID'));

    const handleSubmit = () => {
        if (listing_review_id == 'new-review') {
            const newReview: NewReview = {
                stars: stars,
                comment: comment,
                listingID: listingID,
            }
            onCreateReview(newReview);
        } else {
            const review: Review = {
                listing_review_id: listing_review_id,
                reviewerName: reviewerName,
                stars: stars,
                comment: comment,
                userID: userID,
                listingID: listingID,
                dateCreated: dateCreated,
                dateModified: dateModified,
            }
            onModifyReview(review);
        }
    }
    const handleDelete = () => { onDeleteReview(listing_review_id) };
    const handleEdit = () => {
        console.log(listing_review_id)
        if (listing_review_id == 'new-review') {
            onCancelCreateReview();
        } else {
            console.log("reset")
            setStars(data?.stars ?? 0);
            setComment(data?.comment ?? '');
            setEditMode(!editMode)
        }
    };
    //need to add edit button.
    return (
        <div className="Review-Card">
            <form data-testid={listing_review_id + "-review-form"}>
                <Paper sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px',
                    flexGrow: 1,
                }}>
                    <Box
                        sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                            gridColumnGap: 1,
                            flexGrow: 1,
                            padding: '10px',
                        }}
                    >
                        <Rating
                            data-testid={listing_review_id + "-rating"}
                            value={stars}
                            readOnly={!editMode}
                            onChange={(event, newValue) => {
                                if (newValue == data?.stars && comment == data?.comment) { setHasChanges(false) } else { setHasChanges(true) };
                                setStars(newValue ?? 0);
                            }}
                        />
                        <Typography variant="subtitle2" data-testid={listing_review_id + "-reviewer-name"}>{reviewerName}</Typography>
                    </Box>
                    {editMode ? <TextField
                        data-testid={listing_review_id + "-comment"}
                        value={comment}
                        onChange={(e) => {
                            if (e.target.value == data?.comment && data?.stars == stars) { setHasChanges(false) } else { setHasChanges(true) };
                            setComment(e.target.value)
                        }}
                        multiline
                        required
                    /> : <Typography data-testid={listing_review_id + "-comment"}>{comment}</Typography>}
                    <Box
                        sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                            gridColumnGap: 1,
                            flexGrow: 1,
                            paddingTop: '5px',
                        }}>
                        {isOwningUser ?
                            <ButtonGroup data-testid={listing_review_id + "-button-group"}>
                                {editMode ?
                                    <Button
                                        data-testid={listing_review_id + "-save-button"}
                                        disabled={!hasChanges}
                                        onClick={handleSubmit}>
                                        <CheckCircleIcon />
                                    </Button> :
                                    <Button
                                        data-testid={listing_review_id + "-edit-button"}
                                        onClick={handleEdit}>
                                        <CreateIcon />
                                    </Button>}
                                {editMode ?
                                    <Button
                                        data-testid={listing_review_id + "-cancel-button"}
                                        onClick={handleEdit}>
                                        <CancelIcon />
                                    </Button> :
                                    <Button
                                        data-testid={listing_review_id + "-delete-button"}
                                        onClick={handleDelete}>
                                        <DeleteForeverIcon />
                                    </Button>}
                            </ButtonGroup> : null}
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'left',
                                ml: '20px',
                            }}
                        >
                            <Typography variant="caption" data-testid={listing_review_id + "-date-added"}>Added: {dateCreated}</Typography>
                            <Typography variant="caption" data-testid={listing_review_id + "-date-modified"}>Last Modified: {dateModified}</Typography>
                        </Box>
                    </Box>
                </Paper>
            </form>
        </div >
    )
}

export default ReviewCard
