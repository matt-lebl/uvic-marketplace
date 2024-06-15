import * as React from 'react'
import { InputBase, SxProps } from '@mui/material'

interface Props {
  id: string
  label?: string
  sx?: SxProps | undefined
  submit?: React.FormEventHandler<HTMLDivElement> | undefined
}

const TextInput: React.FC<Props> = ({ label, sx, id, submit }) => {
  return (
    <InputBase
      sx={sx}
      placeholder={label}
      id={id}
      inputProps={{ 'aria-label': label }}
      onSubmit={submit}
    />
  )
}

export default TextInput
