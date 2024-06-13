import React from 'react'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Box,
  SxProps,
} from '@mui/material'

interface Props {
  id: string
  value: string
  onChange: (event: SelectChangeEvent) => void
  options: { value: string; label: string }[]
  label?: string
  containerSx?: SxProps | undefined
}

const DropdownMenu: React.FC<Props> = ({
  id,
  value,
  onChange,
  options,
  label,
  containerSx,
}) => {
  return (
    <Box sx={containerSx}>
      <FormControl fullWidth>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          id={id}
          labelId={`${id}-label`}
          value={value}
          onChange={onChange}
          label={label}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default DropdownMenu
