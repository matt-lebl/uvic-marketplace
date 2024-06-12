import React from 'react';
import ReactButton from '@mui/material/Button';

interface Props {
    id: string;
    label?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const Button: React.FC<Props> = ({ id, label, onClick }) => {
    return <ReactButton 
        id={id}
        data-testid={id}
        onClick={onClick}
    >{label}</ReactButton>;
};

export default Button;
