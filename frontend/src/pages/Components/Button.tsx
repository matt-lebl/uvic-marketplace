import React from 'react';
import ReactButton from '@mui/material/Button';
import '../App.css';

interface Props {
    id: string;
    label?: string;
    className?: string;
}

const Button: React.FC<Props> = ({ id, label, className }) => {
    return <ReactButton 
        id={id}
        data-testid={id}
        className={className}
    >{label}</ReactButton>;
};

export default Button;
