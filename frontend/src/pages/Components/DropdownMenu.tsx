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
  return <></>
}

export default DropdownMenu
