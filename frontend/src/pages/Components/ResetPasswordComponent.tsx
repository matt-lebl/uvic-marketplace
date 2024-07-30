import { useSearchParams } from 'react-router-dom'
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

export default function ResetPasswordComponent() {
  const handleResetPassword = async (email: string) => {
    try {
      const resetPasswordURL = '/api/user/reset-password'
      const resetPasswordResponse = await APIPost<string, { email: string }>(
        resetPasswordURL,
        { email: email }
      )
      if (resetPasswordResponse) {
        console.log(resetPasswordResponse)
        alert('Your password has been reset and emailed to you.')
        window.location.reload()
      }
    } catch (error) {
      alert('An error occurred when resetting your password: ' + error)
    }
  }

  return (
    <Formik
      initialValues={{ email: '' }}
      validate={(values) => {
        const errors: Record<string, string> = {}
        if (!values.email) {
          errors.email = 'Required'
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address'
        }
        return errors
      }}
      onSubmit={async (values, { setSubmitting }) => {
        await handleResetPassword(values.email)
        setSubmitting(false)
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Box width={400} marginBottom={3}>
          <form onSubmit={handleSubmit} data-testid="reset-password-form">
            <FormControl fullWidth>
              <TextField
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                label="Email"
                margin="normal"
                error={Boolean(errors.email) && touched.email}
              />
              <FormHelperText style={{ color: 'red' }}>
                {errors.email}
              </FormHelperText>
            </FormControl>
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                sx={{ my: 2 }}
              >
                Submit
              </Button>
            </div>
          </form>
        </Box>
      )}
    </Formik>
  )
}
