import * as React from 'react'
import { Button, Box } from '@mui/material'

export default function PhotoGallery() {
  return (
    <div className="Photo-Previews">
      <Box>
        <input type="file"></input>
        <Button variant="contained" sx={{ ml: '20px' }}>
          Remove All
        </Button>
      </Box>
    </div>
  )
}
