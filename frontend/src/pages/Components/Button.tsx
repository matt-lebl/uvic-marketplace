import React from 'react';
import ReactButton from '@mui/material/Button';
import '../App.css';

interface Props {
    id: string;
    label?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const Button: React.FC<Props> = ({ id, label, className, onClick }) => {
    return <ReactButton 
        id={id}
        data-testid={id}
        className={className}
        onClick={onClick}
    >{label}</ReactButton>;
};

export default Button;
