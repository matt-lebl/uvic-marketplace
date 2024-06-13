import React from 'react';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';

interface Props {
    id: string;
    name: string;
    imageSrc?: string;
    
}

const ProfileIcon: React.FC<Props> = ({ id, name }) => {
    return <div/>;
};

export default ProfileIcon;