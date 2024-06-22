import React from 'react'
import Avatar from '@mui/material/Avatar'
import ButtonBase from '@mui/material/ButtonBase'

interface Props {
  id: string
  name: string
  imageSrc?: string
  onClick?: () => void
}

const ProfileIcon: React.FC<Props> = ({ id, name, imageSrc, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Navigate to a specific page
      //history.push('/specific-page');
    }
  }
  const getInitials = (name: string) => {
    const words = name.split(' ')
    const initials = words.map((word) => word.charAt(0).toUpperCase()).join('')
    return initials
  }

  return (
    <ButtonBase id={id} data-testid={id} onClick={handleClick}>
      <Avatar alt={name} src={imageSrc}>
        {getInitials(name)}
      </Avatar>
    </ButtonBase>
  )
}

export default ProfileIcon
