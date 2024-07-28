
import { render, screen, fireEvent } from '@testing-library/react';
import NumericInput from '../../pages/Components/NumericOnlyInput';

describe('NumericInput Component', () => {
    const setup = (initialValue: string | undefined, onChange: jest.Mock, onError: jest.Mock) => {
        render(
            <NumericInput
                label="Test Input"
                placeholder={initialValue}
                errorMsg="Please enter a valid number (int or float)"
                onChange={onChange}
                onError={onError}
            />
        );
    };

    test('renders with a valid initial value', () => {
        const handleChange = jest.fn();
        const handleError = jest.fn();
        setup('123', handleChange, handleError);

        const input = screen.getByLabelText('Test Input') as HTMLInputElement;
        expect(input.value).toBe('123');
        expect(handleError).not.toHaveBeenCalled();
        expect(handleChange).not.toHaveBeenCalled();
    });

    test('changed to a valid  value', () => {
        const handleChange = jest.fn();
        const handleError = jest.fn();
        setup('123', handleChange, handleError);

        const input = screen.getByLabelText('Test Input') as HTMLInputElement;
        fireEvent.change(input, { target: { value: '321' } });
        expect(input.value).toBe('321');
        expect(handleError).not.toHaveBeenCalled();
        expect(handleChange).toHaveBeenCalledWith('321');
    });

    test('shows error on invalid input', () => {
        const handleChange = jest.fn();
        const handleError = jest.fn();
        setup('', handleChange, handleError);

        const input = screen.getByLabelText('Test Input') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'abc' } });

        expect(screen.getByText('Please enter a valid number (int or float)')).toBeInTheDocument();
        expect(handleError).toHaveBeenCalledWith(true);
        expect(handleChange).not.toHaveBeenCalled();
    });

    test('validates changing invalid input to valid input', () => {
        const handleChange = jest.fn();
        const handleError = jest.fn();
        setup('', handleChange, handleError);

        const input = screen.getByLabelText('Test Input') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'abc' } });

        expect(screen.getByText('Please enter a valid number (int or float)')).toBeInTheDocument();
        expect(handleError).toHaveBeenCalledWith(true);

        fireEvent.change(input, { target: { value: '123' } });

        expect(screen.queryByText('Please enter a valid number (int or float)')).not.toBeInTheDocument();
        expect(handleError).toHaveBeenCalledWith(false);
        expect(handleChange).toHaveBeenCalledWith('123');
    });
});
