import { Select, InputLabel, MenuItem, SelectChangeEvent, Box } from '@mui/material'
import React, { useState } from 'react'

interface props {
  label: string
  defaultVal: string
  onChange: (value: string | undefined) => void
  options: string[]
}

const SelectInput: React.FC<props> = ({
  label,
  defaultVal,
  onChange,
  options,
}) => {
  const [value, setValue] = useState<string | undefined>(defaultVal)

  const handleChange = (event: SelectChangeEvent<string | undefined>) => {
    const newValue = event.target.value
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <Box
      sx={{
        marginTop: 1,
        width: '90%',
      }}
    >
      <InputLabel
        id={label + '-select-label'}
        data-testid={label + '-select-label'}
      >
        {label}
      </InputLabel>
      <Select
        labelId={label + '-select-label'}
        data-testid={label + '-simple-select'}
        id={label + '-simple-select'}
        value={value}
        label={label}
        onChange={handleChange}
        sx={{
          bgcolor: '#B5DBFF',
          color: 'white',
        }}
      >
        {options.map((statusValue) => (
          <MenuItem key={statusValue} value={statusValue}>
            {statusValue.replace('_', ' ')}
          </MenuItem>
        ))}
      </Select>
    </Box >
  )
}
export default SelectInput
