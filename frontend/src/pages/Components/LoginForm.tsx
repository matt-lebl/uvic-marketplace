import { FormControl, TextField, FormHelperText } from '@mui/material'
import { Button } from '@mui/material'
import { Formik } from 'formik'

export default function LoginForm() {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
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
        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          // TODO: Implement login hook and redirect to home page on success
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
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
