import { FormControl, TextField, FormHelperText } from '@mui/material'
import { Button } from '@mui/material'
import { Formik } from 'formik'
import { APIGet, APIPost } from '../../APIlink'
import { LoginRequest, UserProfile } from '../../interfaces'
import Login from '../Login'
import { Form } from 'react-router-dom'

export default function LoginForm() {
  return (
    <Formik
      initialValues={{ email: '', password: '', totp_code: '' }}
      validate={(values) => {
        const errors: Record<string, string> = {}
        if (!values.email) {
          errors.email = 'Required'
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address'
        }
        if (!values.password) {
          errors.password = 'Required'
        }
        if (!values.totp_code) {
          errors.totp_code = 'Required'
        } else if (!/^[0-9]{6}$/i.test(values.totp_code)) {
          errors.totp_code = 'Invalid TOTP code'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        const loginURL: string = '/api/user/login'
        let response: UserProfile | undefined
        setTimeout(async () => {
          setSubmitting(false)

          const loginRequest: LoginRequest = {
            email: values.email,
            password: values.password,
            totp_code: values.totp_code,
          }
          try {
            response = await APIPost(loginURL, loginRequest)

            if (response) {
              console.log('Response: ', response) // Remove later
              alert('Login successful.')
              localStorage.setItem('userID', response.userID)
              localStorage.setItem('userID', response.userID)
              localStorage.setItem('username', response.username)
              localStorage.setItem('name', response.name)
              localStorage.setItem('bio', response.bio)
              localStorage.setItem('profileUrl', response.profilePictureUrl)
              localStorage.setItem('email', loginRequest.email)
              window.location.href = '/'
            }
          } catch (error) {
            console.log('Response: ', response) // Remove later
            alert('Login failed: ' + error)
          }
        }, 1000)
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
        <form onSubmit={handleSubmit} data-testid="login-form">
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
          <FormControl fullWidth>
            <TextField
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              label="Password"
              margin="normal"
              error={Boolean(errors.password) && touched.password}
            />
            <FormHelperText style={{ color: 'red' }}>
              {errors.password}
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              type="text"
              name="totp_code"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.totp_code}
              label="TOTP Code"
              margin="normal"
              error={Boolean(errors.totp_code) && touched.totp_code}
            />
            <FormHelperText style={{ color: 'red' }}>
              {errors.totp_code}
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
      )}
    </Formik>
  )
}
