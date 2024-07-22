import { render, screen, fireEvent } from '@testing-library/react';
import ReviewCard from '../../pages/Components/ReviewCard';
import { NewReview, Review } from '../../interfaces';
import exp from 'constants';
import { act } from 'react';

describe('ReviewCard', () => {
    const mockData = {
        listing_review_id: '1',
        reviewerName: 'John Doe',
        stars: 4,
        comment: 'Great product!',
        userID: '123',
        listingID: '456',
        dateCreated: '2022-01-01',
        dateModified: '2022-01-02',
    };

    const mockProps = {
        data: mockData,
        startInEditMode: false,
        listingID: '456',
        onDeleteReview: jest.fn(),
        onCreateReview: jest.fn(),
        onModifyReview: jest.fn(),
        onCancelCreateReview: jest.fn(),
    };

    const mockNewReviewProps = {
        data: undefined,
        startInEditMode: true,
        listingID: '456',
        onDeleteReview: jest.fn(),
        onCreateReview: jest.fn(),
        onModifyReview: jest.fn(),
        onCancelCreateReview: jest.fn(),
    };

    test('renders other user review', () => {
        localStorage.setItem('userID', '789');
        render(<ReviewCard {...mockProps} />);

        const reviewerRatingElement = screen.getByTestId(`${mockData.listing_review_id}-rating`) as HTMLElement;
        expect(reviewerRatingElement).toHaveAttribute("aria-label", `${mockData.stars} Stars`);
        expect(reviewerRatingElement).toHaveClass('MuiRating-readOnly');

        const reviewerNameElement = screen.getByTestId(`${mockData.listing_review_id}-reviewer-name`);
        expect(reviewerNameElement).toHaveTextContent(mockData.reviewerName);

        const commentElement = screen.getByTestId(`${mockData.listing_review_id}-comment`);
        expect(commentElement).toHaveTextContent(mockData.comment);
        expect(commentElement).toHaveClass('MuiTypography-root');

        const dateAddedElement = screen.getByTestId(`${mockData.listing_review_id}-date-added`);
        expect(dateAddedElement).toHaveTextContent(`Added: ${mockData.dateCreated}`);

        const dateModifiedElement = screen.getByTestId(`${mockData.listing_review_id}-date-modified`);
        expect(dateModifiedElement).toHaveTextContent(`Last Modified: ${mockData.dateModified}`);

        const editButtons = screen.queryAllByTestId(`${mockData.listing_review_id}-button-group`);
        expect(editButtons).toStrictEqual([]);
    });


    test('renders own user review', () => {
        localStorage.setItem('userID', mockData.userID);
        render(<ReviewCard {...mockProps} />);

        const reviewerRatingElement = screen.getByTestId(`${mockData.listing_review_id}-rating`);
        expect(reviewerRatingElement).toHaveAttribute("aria-label", `${mockData.stars} Stars`);
        expect(reviewerRatingElement).toHaveClass('MuiRating-readOnly');

        const reviewerNameElement = screen.getByTestId(`${mockData.listing_review_id}-reviewer-name`);
        expect(reviewerNameElement).toHaveTextContent(mockData.reviewerName);

        const commentElement = screen.getByTestId(`${mockData.listing_review_id}-comment`);
        expect(commentElement).toHaveTextContent(mockData.comment);
        expect(commentElement).toHaveClass('MuiTypography-root');

        const dateAddedElement = screen.getByTestId(`${mockData.listing_review_id}-date-added`);
        expect(dateAddedElement).toHaveTextContent(`Added: ${mockData.dateCreated}`);

        const dateModifiedElement = screen.getByTestId(`${mockData.listing_review_id}-date-modified`);
        expect(dateModifiedElement).toHaveTextContent(`Last Modified: ${mockData.dateModified}`);

        const editButtons = screen.getByTestId(`${mockData.listing_review_id}-button-group`);
        expect(editButtons).toBeInTheDocument();

        const editButton = screen.getByTestId(`${mockData.listing_review_id}-edit-button`);
        expect(editButton).toBeInTheDocument();

        const deleteButton = screen.getByTestId(`${mockData.listing_review_id}-delete-button`);
        expect(deleteButton).toBeInTheDocument();

        const saveButton = screen.queryAllByTestId(`${mockData.listing_review_id}-save-button`);
        expect(saveButton).toStrictEqual([]);

        const cancelButton = screen.queryAllByTestId(`${mockData.listing_review_id}-cancel-button`);
        expect(cancelButton).toStrictEqual([]);
    });

    test('Test edit button', () => {
        localStorage.setItem('userID', mockData.userID);
        render(<ReviewCard {...mockProps} />);

        const editButton = screen.getByTestId(`${mockData.listing_review_id}-edit-button`);
        expect(editButton).toBeInTheDocument();
        act(() => {
            fireEvent.click(editButton);
        });
        const reviewerRatingElement = screen.queryAllByRole('radio');
        reviewerRatingElement.forEach((element) => {
            if (element.getAttribute('value') == mockData.stars.toString()) {
                expect(element).toBeChecked()
            }
            else {
                expect(element).not.toBeChecked()
            }
        });

        const commentElement = screen.getByDisplayValue(mockData.comment);
        expect(commentElement.tagName).toBe('TEXTAREA');

        const saveButton = screen.getByTestId(`${mockData.listing_review_id}-save-button`);
        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeDisabled();

        const cancelButton = screen.getByTestId(`${mockData.listing_review_id}-cancel-button`);
        expect(cancelButton).toBeInTheDocument();
        expect(cancelButton).not.toBeDisabled();

        const deleteButton = screen.queryAllByTestId(`${mockData.listing_review_id}-delete-button`);
        expect(deleteButton).toStrictEqual([]);

        let editButtonPostClick = screen.queryAllByTestId(`${mockData.listing_review_id}-edit-button`);
        expect(editButtonPostClick).toStrictEqual([]);
    });

    test('test modifying review', () => {
        localStorage.setItem('userID', mockData.userID);
        render(<ReviewCard {...mockProps} />);

        const editButton = screen.getByTestId(`${mockData.listing_review_id}-edit-button`);
        act(() => {
            fireEvent.click(editButton);
        });
        const reviewerRatingElement = screen.queryAllByRole('radio');
        const commentElement = screen.getByDisplayValue(mockData.comment);

        const saveButton = screen.getByTestId(`${mockData.listing_review_id}-save-button`);
        expect(saveButton).toBeDisabled();

        //Rating modification
        reviewerRatingElement.forEach((element) => {
            if (element.getAttribute('value') == mockData.stars.toString()) {
                expect(element).toBeChecked()
            }
            else {
                expect(element).not.toBeChecked()
            }
        });
        act(() => {
            fireEvent.click(reviewerRatingElement.filter((element) => element.getAttribute('value') == "5")[0]);
        });
        reviewerRatingElement.forEach((element) => {
            if (element.getAttribute('value') == "5") {
                expect(element).toBeChecked()
            }
            else {
                expect(element).not.toBeChecked()
            }
        });
        expect(saveButton).not.toBeDisabled();

        act(() => {
            fireEvent.click(saveButton);
        });

        const ratingReview: Review = {
            listing_review_id: mockData.listing_review_id,
            reviewerName: mockData.reviewerName,
            stars: 5,
            comment: mockData.comment,
            userID: mockData.userID,
            listingID: mockData.listingID,
            dateCreated: mockData.dateCreated,
            dateModified: mockData.dateModified,
        }

        expect(mockProps.onModifyReview).toBeCalledWith(ratingReview);
        act(() => {
            fireEvent.click(reviewerRatingElement.filter((element) => element.getAttribute('value') == mockData.stars.toString())[0]);
        });
        reviewerRatingElement.forEach((element) => {
            if (element.getAttribute('value') == mockData.stars.toString()) {
                expect(element).toBeChecked()
            }
            else {
                expect(element).not.toBeChecked()
            }
        });
        expect(saveButton).toBeDisabled();


        //Comment modification
        expect(commentElement).toHaveTextContent(mockData.comment);
        fireEvent.change(commentElement, { target: { value: 'New comment' } });
        expect(commentElement).toHaveTextContent('New comment');
        expect(saveButton).not.toBeDisabled();
        act(() => {
            fireEvent.click(saveButton);
        });
        const commentReview: Review = {
            listing_review_id: mockData.listing_review_id,
            reviewerName: mockData.reviewerName,
            stars: mockData.stars,
            comment: 'New comment',
            userID: mockData.userID,
            listingID: mockData.listingID,
            dateCreated: mockData.dateCreated,
            dateModified: mockData.dateModified,
        }

        expect(mockProps.onModifyReview).toBeCalledWith(commentReview);

        fireEvent.change(commentElement, { target: { value: mockData.comment } });
        expect(commentElement).toHaveValue(mockData.comment);
        expect(saveButton).toBeDisabled();

        //Rating and comment modification
        act(() => {
            fireEvent.click(reviewerRatingElement.filter((element) => element.getAttribute('value') == "5")[0]);
        });
        reviewerRatingElement.forEach((element) => {
            if (element.getAttribute('value') == "5") {
                expect(element).toBeChecked()
            }
            else {
                expect(element).not.toBeChecked()
            }
        });
        expect(saveButton).not.toBeDisabled();

        fireEvent.change(commentElement, { target: { value: 'New comment' } });
        expect(commentElement).toHaveValue('New comment');
        expect(saveButton).not.toBeDisabled();
        act(() => {
            fireEvent.click(saveButton);
        });
        const commentAndRatingReview: Review = {
            listing_review_id: mockData.listing_review_id,
            reviewerName: mockData.reviewerName,
            stars: 5,
            comment: 'New comment',
            userID: mockData.userID,
            listingID: mockData.listingID,
            dateCreated: mockData.dateCreated,
            dateModified: mockData.dateModified,
        }

        expect(mockProps.onModifyReview).toBeCalledWith(commentAndRatingReview);
        act(() => {
            fireEvent.click(reviewerRatingElement.filter((element) => element.getAttribute('value') == mockData.stars.toString())[0]);
        });
        reviewerRatingElement.forEach((element) => {
            if (element.getAttribute('value') == mockData.stars.toString()) {
                expect(element).toBeChecked()
            }
            else {
                expect(element).not.toBeChecked()
            }
        });
        expect(saveButton).not.toBeDisabled();

        fireEvent.change(commentElement, { target: { value: mockData.comment } });
        expect(commentElement).toHaveValue(mockData.comment);
        expect(saveButton).toBeDisabled();
    });

    test('Test cancel button on modify existing review', () => {
        localStorage.setItem('userID', mockData.userID);
        render(<ReviewCard {...mockProps} />);

        let reviewerRatingElementRadio = screen.queryAllByRole('radio');
        expect(reviewerRatingElementRadio).toStrictEqual([]);

        const editButton = screen.getByTestId(`${mockData.listing_review_id}-edit-button`);
        act(() => {
            fireEvent.click(editButton);
        });

        reviewerRatingElementRadio = screen.queryAllByRole('radio');
        let commentElement = screen.getByTestId(`${mockData.listing_review_id}-comment`);

        act(() => {
            fireEvent.click(reviewerRatingElementRadio.filter((element) => element.getAttribute('value') == "5")[0]);
        });
        reviewerRatingElementRadio.forEach((element) => {
            if (element.getAttribute('value') == "5") {
                expect(element).toBeChecked()
            }
            else {
                expect(element).not.toBeChecked()
            }
        });

        commentElement.textContent = 'New comment';

        const cancelButton = screen.getByTestId(`${mockData.listing_review_id}-cancel-button`);
        fireEvent.click(cancelButton);

        const saveButton = screen.queryAllByTestId(`${mockData.listing_review_id}-save-button`);
        expect(saveButton).toStrictEqual([]);

        const deleteButton = screen.getByTestId(`${mockData.listing_review_id}-delete-button`);
        expect(deleteButton).toBeInTheDocument();

        const editButtonPostCancel = screen.getByTestId(`${mockData.listing_review_id}-edit-button`);
        const cancelButtonPostCancel = screen.queryAllByTestId(`${mockData.listing_review_id}-cancel-button`);

        expect(editButtonPostCancel).toBeInTheDocument();
        expect(cancelButtonPostCancel).toStrictEqual([]);

        let reviewerRatingElement = screen.getByTestId(`${mockData.listing_review_id}-rating`);
        expect(reviewerRatingElement).toHaveAttribute("aria-label", `${mockData.stars} Stars`);
        expect(reviewerRatingElement).toHaveClass('MuiRating-readOnly');

        reviewerRatingElementRadio = screen.queryAllByRole('radio');
        expect(reviewerRatingElementRadio).toStrictEqual([]);

        commentElement = screen.getByTestId(`${mockData.listing_review_id}-comment`);
        expect(commentElement).toHaveTextContent(mockData.comment);
        expect(commentElement).toHaveClass('MuiTypography-root');


    });

    test('calls onDeleteReview when delete button is clicked', () => {
        localStorage.setItem('userID', mockData.userID);
        render(<ReviewCard {...mockProps} />);

        const deleteButton = screen.getByTestId(`${mockData.listing_review_id}-delete-button`);
        fireEvent.click(deleteButton);
        expect(mockProps.onDeleteReview).toHaveBeenCalledWith(mockData.listing_review_id);
    });


    test('test create review', () => {
        localStorage.setItem('userID', mockData.userID);
        localStorage.setItem('username', 'Jane Smith');
        render(<ReviewCard {...mockNewReviewProps} />);

        const reviewerRatingElement = screen.queryAllByRole('radio');
        reviewerRatingElement.forEach((element) => {
            if (element.getAttribute('value') == "0") {
                expect(element).toBeChecked()
            }
            else {
                expect(element).not.toBeChecked()
            }
        });

        act(() => {
            fireEvent.click(reviewerRatingElement.filter((element) => element.getAttribute('value') == "5")[0]);
        });
        reviewerRatingElement.forEach((element) => {
            if (element.getAttribute('value') == "5") {
                expect(element).toBeChecked()
            }
            else {
                expect(element).not.toBeChecked()
            }
        });
        const reviewerNameElement = screen.getByTestId(`new-review-reviewer-name`);
        expect(reviewerNameElement).toHaveTextContent('Jane Smith');

        const commentElement = screen.getByRole("textbox");
        expect(commentElement.tagName).toBe('TEXTAREA');
        fireEvent.change(commentElement, { target: { value: 'New comment' } });

        const dateAddedElement = screen.getByTestId(`new-review-date-added`);
        expect(dateAddedElement).toHaveTextContent(`Added:`);

        const dateModifiedElement = screen.getByTestId(`new-review-date-modified`);
        expect(dateModifiedElement).toHaveTextContent(`Last Modified:`);

        const editButtons = screen.getByTestId(`new-review-button-group`);
        expect(editButtons).toBeInTheDocument();

        const editButton = screen.queryAllByTestId(`new-review-edit-button`);
        expect(editButton).toStrictEqual([]);

        const deleteButton = screen.queryAllByTestId(`new-review-delete-button`);
        expect(deleteButton).toStrictEqual([]);

        const cancelButton = screen.getByTestId(`new-review-cancel-button`);
        expect(cancelButton).toBeInTheDocument();
        act(() => {
            fireEvent.click(cancelButton);
        });
        expect(mockNewReviewProps.onCancelCreateReview).toHaveBeenCalled();

        const saveButton = screen.getByTestId(`new-review-save-button`);
        expect(saveButton).toBeInTheDocument();
        act(() => {
            fireEvent.click(saveButton);
        });
        const newReview: NewReview = {
            stars: 5,
            comment: 'New comment',
            listingID: mockNewReviewProps.listingID,
        }

        expect(mockNewReviewProps.onCreateReview).toHaveBeenCalledWith(newReview);
    });
});