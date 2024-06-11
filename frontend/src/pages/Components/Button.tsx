import React from 'react';
import ReactButton from '@mui/material/Button';

interface Props {
    id: string;
    label?: string;
}

const Button: React.FC<Props> = ({ id, label }) => {
    return <ReactButton 
        id={id}
        data-testid={id}
    >{label}</ReactButton>;
};

export default Button;
