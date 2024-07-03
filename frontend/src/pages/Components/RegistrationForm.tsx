import React from 'react'
import {
  FormControl,
  TextField,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material'
import { Button } from '@mui/material'
import { Formik, FormikHelpers } from 'formik'
import { APIPost } from '../../APIlink'
import { NewUserReq } from '../../interfaces'

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
  const errors: Record<string, string> = {}
  if (!values.firstName) {
    errors.firstName = 'Required'
  }
  if (!values.lastName) {
    errors.lastName = 'Required'
  }
  if (!values.username) {
    errors.username = 'Required'
  }
  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (!values.password) {
    errors.password = 'Required'
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Required'
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }
  return errors
}

const handleSubmit = async (
  values: FormValues,
  { setSubmitting, setStatus }: FormikHelpers<FormValues>
) => {
  setSubmitting(true)

  const newUserRequest: NewUserReq = {
    username: values.username,
    name: `${values.firstName} ${values.lastName}`,
    email: values.email,
    password: values.password,
  }

  const loginURL: string = '/api/user/'

  try {
    const response = await APIPost(loginURL, newUserRequest)
    localStorage.setItem('user', JSON.stringify(response))
  } catch (error) {
    console.error(error)
    setStatus({ error: 'Registration failed' })
  } finally {
    setSubmitting(false)
  }
}

export default function RegisterForm() {
  return (
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
        status,
      }) => (
        <form onSubmit={handleSubmit} data-testid="register-form">
          <Box display="flex" justifyContent="space-between">
            <FormControl margin="normal" fullWidth sx={{ mr: 1 }}>
              <TextField
                type="text"
                name="firstName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
                label="First Name"
                error={Boolean(errors.firstName) && touched.firstName}
              />
              <FormHelperText style={{ color: 'red' }}>
                {errors.firstName}
              </FormHelperText>
            </FormControl>
            <FormControl margin="normal" fullWidth sx={{ ml: 1 }}>
              <TextField
                type="text"
                name="lastName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
                label="Last Name"
                error={Boolean(errors.lastName) && touched.lastName}
              />
              <FormHelperText style={{ color: 'red' }}>
                {errors.lastName}
              </FormHelperText>
            </FormControl>
          </Box>
          <FormControl fullWidth>
            <TextField
              type="text"
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              label="Username"
              margin="normal"
              error={Boolean(errors.username) && touched.username}
            />
            <FormHelperText style={{ color: 'red' }}>
              {errors.username}
            </FormHelperText>
          </FormControl>
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
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirmPassword}
              label="Confirm Password"
              margin="normal"
              error={Boolean(errors.confirmPassword) && touched.confirmPassword}
            />
            <FormHelperText style={{ color: 'red' }}>
              {errors.confirmPassword}
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
  )
}
