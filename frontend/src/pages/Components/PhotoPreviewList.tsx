import * as React from 'react'
import { Button, Box, List, ListItem } from '@mui/material'
import { useState, useRef } from 'react'
import { KeyObject } from 'crypto'

interface Props {
  imageNames? : Array<string>
}

const PhotoGallery: React.FC<Props> = ({imageNames}) => {
  return (
    <div className="Photo-Previews">
      <Box >
        <List>
          {imageNames?.map((name) => (
            <ListItem key={name}>
              {name}
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  )
}

export default PhotoGallery
