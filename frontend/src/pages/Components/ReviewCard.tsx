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
    data: Review,
    startInEditMode?: boolean
    listingID: string
    onDeleteReview?: (listing_review_id: string) => void | null
    onCreateReview?: (review: NewReview) => void
    onModifyReview?: (review: Review) => void | null
    onCancelCreateReview?: () => void
}

const ReviewCard: React.FC<ReviewProps> = ({ data, startInEditMode, listingID, onDeleteReview, onCreateReview, onModifyReview, onCancelCreateReview }) => {
    const [review, setReview] = React.useState<Review>(data)
    const [stars, setStars] = React.useState<number>(data.stars);
    const [comment, setComment] = React.useState<string>(data?.comment);
    const [editMode, setEditMode] = React.useState<boolean>(startInEditMode ?? false);
    const [hasChanges, setHasChanges] = React.useState<boolean>(false);
    const [isOwningUser, setIsOwningUser] = React.useState<boolean>(data.userID === localStorage.getItem('userID'));
    const [confirmDelete, setConfirmDelete] = React.useState<boolean>(false);

    const handleSubmit = () => {
        if (review.listing_review_id === 'new-review') {
            const newReview: NewReview = {
                stars: stars,
                comment: comment,
                listingID: listingID,
            }
            if (onCreateReview) {
                onCreateReview(newReview);
            }
        } else if (onModifyReview) {
            onModifyReview({ ...review, stars: stars, comment: comment });
        }
        setEditMode(!editMode)
    }

    const handleDelete = () => { if (onDeleteReview) onDeleteReview(review.listing_review_id) };
    const handleEdit = () => {
        if (review.listing_review_id === 'new-review') {
            if (onCancelCreateReview) onCancelCreateReview();
        } else {
            setStars(review.stars);
            setComment(review.comment);
            setEditMode(!editMode)
        }
    };
    //need to add edit button.
    return (
        <div className="Review-Card" id={`${review.listing_review_id}-review`} >
            <form data-testid={review.listing_review_id + "-review-form"}>
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
                            data-testid={review.listing_review_id + "-rating"}
                            value={stars}
                            readOnly={!editMode}
                            onChange={(event, newValue) => {
                                if (newValue === data?.stars && comment === data?.comment) { setHasChanges(false) } else { setHasChanges(true) };
                                setStars(newValue ?? 0);
                            }}
                        />
                        <Typography variant="subtitle2" data-testid={review.listing_review_id + "-reviewer-name"}>{review.reviewerName}</Typography>
                    </Box>
                    {editMode ? <TextField
                        data-testid={review.listing_review_id + "-comment"}
                        value={comment}
                        onChange={(e) => {
                            if (e.target.value === data?.comment && data?.stars === stars) { setHasChanges(false) } else { setHasChanges(true) };
                            setComment(e.target.value)
                        }}
                        multiline
                        required
                    /> : <Typography marginLeft="5px" data-testid={review.listing_review_id + "-comment"}>{comment}</Typography>}
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
                            <ButtonGroup data-testid={review.listing_review_id + "-button-group"}>
                                {editMode ?
                                    <Button
                                        data-testid={review.listing_review_id + "-save-button"}
                                        disabled={!hasChanges}
                                        onClick={handleSubmit}>
                                        <CheckCircleIcon />
                                    </Button> : confirmDelete ?
                                        <Button
                                            data-testid={review.listing_review_id + "-confirm-delete-button"}
                                            onClick={handleDelete}>
                                            Confirm Delete
                                        </Button>
                                        :
                                        <Button
                                            data-testid={review.listing_review_id + "-edit-button"}
                                            onClick={handleEdit}>
                                            <CreateIcon />
                                        </Button>}
                                {editMode ?
                                    <Button
                                        data-testid={review.listing_review_id + "-cancel-button"}
                                        onClick={handleEdit}>
                                        <CancelIcon />
                                    </Button> : confirmDelete ?
                                        <Button
                                            data-testid={review.listing_review_id + "-cancel-delete-button"}
                                            onClick={() => setConfirmDelete(false)}>
                                            Cancel Delete
                                        </Button>
                                        :
                                        <Button
                                            data-testid={review.listing_review_id + "-delete-button"}
                                            onClick={() => setConfirmDelete(true)}>
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
                            <Typography variant="caption" data-testid={review.listing_review_id + "-date-added"}>Added: {review.dateCreated !== '' ? new Date(review.dateCreated).toLocaleString() : ''}</Typography>
                            <Typography variant="caption" data-testid={review.listing_review_id + "-date-modified"}>Last Modified: {review.dateModified !== '' ? new Date(review.dateModified).toLocaleString() : ''}</Typography>
                        </Box>
                    </Box>
                </Paper>
            </form>
        </div >
    )
}

export default ReviewCard
