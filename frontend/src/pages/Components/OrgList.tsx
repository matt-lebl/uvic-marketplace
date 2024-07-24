import * as React from 'react'
import { OrgEntity } from '../../interfaces'
import { List, ListItem, Typography, Box } from '@mui/material'

interface Props {
  orgData: Array<OrgEntity>
  eventID: string
}

const OrgList: React.FC<Props> = ({ orgData, eventID }) => {
  return (
    <div className={'OrgList#' + eventID}>
      <List>
        {orgData.map((orgdata) => (
          <ListItem key={orgdata.name} sx={{ p: '0' }}>
            <Box display="flex" flexDirection="row">
              <Box width="80px">
                <img src={orgdata.logoUrl} />
              </Box>

              <Box display="flex" flexDirection="column" p="0px 10px">
                <Typography>{orgdata.name}</Typography>
                <Typography>Donated: ${orgdata.donated}</Typography>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default OrgList
