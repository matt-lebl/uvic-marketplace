import React, { useState } from 'react'
import {
  FormControl,
  TextField,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material'
import { Button } from '@mui/material'
import { Formik, FormikHelpers, FormikErrors } from 'formik'
import { APIGet, APIPost } from '../../APIlink'
import { NewUserReq, NewUser } from '../../interfaces'
import QRCode from 'qrcode.react'

interface FormValues {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

const initialValues: FormValues = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const validate = (values: FormValues) => {
  const errors: FormikErrors<FormValues> = {}
  if (!values.firstName) {
    errors.firstName = 'Required'
  }
  if (!values.lastName) {
    errors.lastName = 'Required'
  }
  if (!values.username) {
    errors.username = 'Required'
  } else if (values.username.length < 6 || values.username.length > 20) {
    errors.username = 'Username must be between 6 and 20 characters'
  } else if (!/^[a-zA-Z0-9_@]*$/.test(values.username)) {
    errors.username = 'Username must be alphanumeric, and must not contain special characters other than @ and _'
  }
  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  } else if (!/^.*@uvic.ca$/.test(values.email)) {
    errors.email = 'Email must end with @uvic.ca'
  }
  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/.test(values.password)) {
    errors.password =
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Required'
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }
  return errors
}

export default function RegisterForm() {
  const [totpURI, setTotpURI] = useState<string | undefined>(undefined)
  const [showVerifyButton, setShowVerifyButton] = useState(false)
  const [showRegistrationForm, setShowRegistrationForm] = useState(true)
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined)

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setStatus }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true)

    const newUserRequest: NewUserReq = {
      email: values.email,
      password: values.password,
      username: values.username,
      name: `${values.firstName} ${values.lastName}`,
    }

    const loginURL: string = '/api/user/'

    try {
      const response = await APIPost<NewUser, NewUserReq>(
        loginURL,
        newUserRequest
      )
      if (response) {
        console.log(response)
        setTotpURI(response.totp_uri)
        setUserEmail(values.email)
        setShowVerifyButton(true)
        setShowRegistrationForm(false)
      } else {
        setStatus({ error: 'Response undefined' })
        setSubmitting(false)
      }
    } catch (error) {
      setStatus({ error: 'Registration failed ' + error })
      setSubmitting(false)
    }
  }

  const handleVerifyEmail = async () => {
    try {
      const verifyEmailURL = '/api/user/send-validation-link/' + userEmail
      const verifyEmailResponse = await APIGet<string>(verifyEmailURL)
      if (verifyEmailResponse) {
        alert('Verification link sent to your email. Please check your inbox.')
      } else {
        alert('Verification link failed to send.')
      }
    } catch (error) {
      alert(
        'An error occurred when sending validation email ' + error,
      )
    }
  }

  return (
    <div>
      {showRegistrationForm ? (
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldTouched,
            setFieldValue,
            validateField,
            status,
          }) => (
            <form onSubmit={handleSubmit} data-testid="register-form">
              <Box display="flex" justifyContent="space-between">
                <FormControl margin="normal" fullWidth sx={{ mr: 1 }}>
                  <TextField
                    type="text"
                    name="firstName"
                    onChange={(e) => {
                      handleChange(e)
                      setFieldValue('firstName', e.target.value)
                      setFieldTouched('firstName', true, false)
                      validateField('firstName')
                    }}
                    onBlur={(e) => {
                      handleBlur(e)
                      setFieldTouched('firstName', true, false)
                    }}
                    value={values.firstName}
                    label="First Name"
                    error={
                      Boolean(errors.firstName) && Boolean(touched.firstName)
                    }
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {touched.firstName && errors.firstName}
                  </FormHelperText>
                </FormControl>
                <FormControl margin="normal" fullWidth sx={{ ml: 1 }}>
                  <TextField
                    type="text"
                    name="lastName"
                    onChange={(e) => {
                      handleChange(e)
                      setFieldValue('lastName', e.target.value)
                      setFieldTouched('lastName', true, false)
                      validateField('lastName')
                    }}
                    onBlur={(e) => {
                      handleBlur(e)
                      setFieldTouched('lastName', true, false)
                    }}
                    value={values.lastName}
                    label="Last Name"
                    error={
                      Boolean(errors.lastName) && Boolean(touched.lastName)
                    }
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {touched.lastName && errors.lastName}
                  </FormHelperText>
                </FormControl>
              </Box>
              <FormControl fullWidth>
                <TextField
                  type="text"
                  name="username"
                  onChange={(e) => {
                    handleChange(e)
                    setFieldValue('username', e.target.value)
                    setFieldTouched('username', true, false)
                    validateField('username')
                  }}
                  onBlur={(e) => {
                    handleBlur(e)
                    setFieldTouched('username', true, false)
                  }}
                  value={values.username}
                  label="Username"
                  margin="normal"
                  error={Boolean(errors.username) && Boolean(touched.username)}
                />
                <FormHelperText style={{ color: 'red' }}>
                  {touched.username && errors.username}
                </FormHelperText>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  type="email"
                  name="email"
                  onChange={(e) => {
                    handleChange(e)
                    setFieldValue('email', e.target.value)
                    setFieldTouched('email', true, false)
                    validateField('email')
                  }}
                  onBlur={(e) => {
                    handleBlur(e)
                    setFieldTouched('email', true, false)
                  }}
                  value={values.email}
                  label="Email"
                  margin="normal"
                  error={Boolean(errors.email) && Boolean(touched.email)}
                />
                <FormHelperText style={{ color: 'red' }}>
                  {touched.email && errors.email}
                </FormHelperText>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  type="password"
                  name="password"
                  onChange={(e) => {
                    handleChange(e)
                    setFieldValue('password', e.target.value)
                    setFieldTouched('password', true, false)
                    validateField('password')
                  }}
                  onBlur={(e) => {
                    handleBlur(e)
                    setFieldTouched('password', true, false)
                  }}
                  value={values.password}
                  label="Password"
                  margin="normal"
                  error={Boolean(errors.password) && Boolean(touched.password)}
                />
                <FormHelperText style={{ color: 'red' }}>
                  {touched.password && errors.password}
                </FormHelperText>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  type="password"
                  name="confirmPassword"
                  onChange={(e) => {
                    handleChange(e)
                    setFieldValue('confirmPassword', e.target.value)
                    setFieldTouched('confirmPassword', true, false)
                    validateField('confirmPassword')
                  }}
                  onBlur={(e) => {
                    handleBlur(e)
                    setFieldTouched('confirmPassword', true, false)
                  }}
                  value={values.confirmPassword}
                  label="Confirm Password"
                  margin="normal"
                  error={
                    Boolean(errors.confirmPassword) &&
                    Boolean(touched.confirmPassword)
                  }
                />
                <FormHelperText style={{ color: 'red' }}>
                  {touched.confirmPassword && errors.confirmPassword}
                </FormHelperText>
              </FormControl>
              {status && status.error && (
                <Typography color="error">{status.error}</Typography>
              )}
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
      ) : (
        <div>
          <Typography variant="h5" mb={4}>
            Registration Successful!
          </Typography>
          <Typography variant="h6" mb={1}>
            1. Scan the QR code below with your authenticator app:
          </Typography>
          {totpURI && <QRCode value={totpURI} />}
          <Typography variant="h6" mt={2} mb={1}>
            2. Send a verification link to your email with the button below:
          </Typography>
          {showVerifyButton && (
            <Button
              onClick={() => handleVerifyEmail()}
              variant="contained"
              color="primary"
              sx={{ my: 2 }}
            >
              Send Verification Email
            </Button>
          )}
          <Typography variant="h6" mt={2} mb={1}>
            3. Click the link we sent you, and you're all set!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = '/login')}
            sx={{ mt: 2, mb: 15 }}
          >
            Return To Login
          </Button>
        </div>
      )}
    </div>
  )
}
