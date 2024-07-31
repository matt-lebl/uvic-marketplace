import { useNavigate, useSearchParams } from 'react-router-dom'
import { APIGet, APIPost } from '../../APIlink'
import { Formik, FormikHelpers, FormikErrors } from 'formik'
import {
  FormControl,
  TextField,
  FormHelperText,
  Box,
  Typography,
  Button,
} from '@mui/material'

export default function ValidateEmailComponent() {
  const navigate = useNavigate()
  const handleVerifyEmail = async () => {
    try {
      const verifyEmailURL = '/api/user/send-confirmation-email'
      const verifyEmailResponse = await APIPost<string, null>(
        verifyEmailURL,
        null
      )
      if (verifyEmailResponse) {
        alert('Verification link sent to your email. Please check your inbox.')
      } else {
        alert('Verification link failed to send.')
      }
    } catch (error) {
      debugger
      console.error("Error sending validation Email")
      navigate('/error')
    }
  }

  const handleVerificationCode = async (verificationCode: string) => {
    try {
      const verifyEmailURL = '/api/user/confirm-email'
      const verifyEmailResponse = await APIPost<string, { code: string }>(
        verifyEmailURL,
        { code: verificationCode }
      )
      if (verifyEmailResponse) {
        console.log(verifyEmailResponse)
        alert('Email verified successfully!')
      }
    } catch (error) {
      debugger
      console.error('An error occurred when verifying email')
      navigate('/error')
    }
  }

  return (
    <div className="ValidateEmail">
      <header className="App-header">
        <Box
          width={400}
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          alignItems="center"
          marginTop={0}
        >
          <Typography variant="h4" alignSelf="flex-start" marginBottom={5}>
            Verify Your Email
          </Typography>
          <Typography variant="h6" mt={2} mb={1}>
            1. Click the button below to send a verification code to your email.
          </Typography>
          <Button
            onClick={handleVerifyEmail}
            variant="contained"
            color="primary"
            sx={{ my: 2, alignSelf: 'flex-start' }}
          >
            Send Verification Code
          </Button>
          <Typography variant="h6" mt={2} mb={1}>
            2. Enter the code we sent you in the field below, and click
            "Verify".
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignSelf={'flex-start'}
          >
            <Formik
              initialValues={{ verificationCode: '' }}
              validate={(values) => {
                const errors: FormikErrors<{ verificationCode: string }> = {}
                if (!values.verificationCode) {
                  errors.verificationCode = 'Required'
                } else if (!/^[a-zA-Z0-9-]+$/.test(values.verificationCode)) {
                  errors.verificationCode = 'Invalid verification code'
                }
                return errors
              }}
              onSubmit={async (values, { setSubmitting }) => {
                await handleVerificationCode(values.verificationCode)
                setSubmitting(false)
              }}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit}>
                  <FormControl fullWidth>
                    <TextField
                      type="text"
                      name="verificationCode"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.verificationCode}
                      label="Verification Code"
                      margin="normal"
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    sx={{ my: 2 }}
                  >
                    Verify
                  </Button>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </header>
    </div>
  )
}
