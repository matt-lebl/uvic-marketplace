import { Typography, Box, Button } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { APIGet } from '../../APIlink'
import { useEffect, useState } from 'react'

export default function ValidateEmailCompnent() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const code = searchParams.get('code')

  console.log('email:', email)
  console.log('code:', code)

  const [validated, setValidated] = useState(false)

  useEffect(() => {
    setTimeout(async () => {
      await APIGet<boolean>(`/api/user/validate-email/${code}/${email}`)
        .catch((error) => {
          debugger;
          console.error('Failed to validate email')
          alert('Failed to validate email')
        })
        .then((res) => setValidated(res ?? false))
    }, 1000);
  }, [])

  return (
    <div className="Registration">
      <header className="App-header">
        <Box
          width={400}
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          alignItems="center"
          marginTop={12}
        >
          <Typography variant="h4" marginBottom={5}>
            {validated ? 'Email validated' : 'Validating email...'}
          </Typography>
          {validated ? (
            <Button href="/login" variant="contained" color="primary">
              Login
            </Button>
          ) : null}
        </Box>
      </header>
    </div>
  )
}
