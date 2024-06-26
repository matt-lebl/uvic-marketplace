import * as React from 'react'
import { Paper, IconButton, InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { SxProps } from '@mui/material'
import { useState } from 'react'
import { ChangeEvent, FormEvent } from 'react'
import DropdownMenu from './DropdownMenu'

interface Props {
  id: string
  placeholder?: string | undefined
  sx?: SxProps | undefined
  submit: (out: string) => void
}

const Searchbox: React.FC<Props> = ({ placeholder, sx, id, submit }) => {
  const [input, setInput] = useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit(input)
  }

  const handleClick = () => {
    submit(input)
  }
  return (
    <Paper component="form" sx={sx} id={id} onSubmit={handleSubmit}>
      <InputBase
        id="Search Field"
        placeholder={placeholder}
        sx={{ ml: 1, flex: 1 }}
        onChange={handleChange}
      />
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
          <Button variant="contained" {...bindTrigger(popupState)}>
        Dashboard
      </Button>
      <Menu {...bindMenu(popupState)}>
        <MenuItem onClick={popupState.close}>Profile</MenuItem>
        <MenuItem onClick={popupState.close}>My account</MenuItem>
        <MenuItem onClick={popupState.close}>Logout</MenuItem>
      </Menu>
    </React.Fragment>
  )}
</PopupState>
      
      <IconButton
        type="button"
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={handleClick}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

export default Searchbox
