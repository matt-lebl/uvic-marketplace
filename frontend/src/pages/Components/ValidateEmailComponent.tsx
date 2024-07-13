import { Typography, Box, Button } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { APIGet } from '../../APIlink'
import { useEffect, useState } from 'react'

export default function ValidateEmailCompnent() {
  const [searchParams] = useSearchParams()
  let response = undefined

  const email = searchParams.get('email')
  const code = searchParams.get('code')

  console.log('email:', email)
  console.log('code:', code)

  const [validated, setValidated] = useState(false)

  useEffect(() => {
    const validateEmail = async () => {
      try {
        const res = await APIGet<boolean>(`/api/user/validate-email/${code}/${email}`)
        setValidated(res)
      } catch (error) {
        console.log(error)
      }
    }
    validateEmail()
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
            {validated ? "Email validated" : "Validating email..."}
          </Typography>
          {validated ? (
            <Button href="/login" variant='contained' color='primary'>Login</Button>
          ) : null}
        </Box>
      </header>
    </div>
  )
}