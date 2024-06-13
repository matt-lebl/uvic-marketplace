import React from 'react'
import { Tabs, Tab, Box, SxProps } from '@mui/material'

interface TabOption {
  label: string
  value: string
}

interface Props {
  id: string
  value: string
  onChange: (event: React.SyntheticEvent, newValue: string) => void
  options: TabOption[]
  containerSx?: SxProps
}

function accessibilityProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const TabMenu: React.FC<Props> = ({
  id,
  value,
  onChange,
  options,
  containerSx,
}) => {
  return (
    <Box sx={containerSx}>
      <Tabs
        value={value}
        onChange={onChange}
        aria-label={`${id}-tabs`}
        data-testid={id}
      >
        {options.map((option, index) => (
          <Tab
            key={option.value}
            label={option.label}
            value={option.value}
            {...accessibilityProps(index)}
          />
        ))}
      </Tabs>
    </Box>
  )
}

export default TabMenu
