PR for adding the cypress tests that have been implemented thus far. In the uvic-marketplace directory, run:
1) `npm install cypress otplib cypress-file-upload`
2) Create cypress.env.json file in the root of uvic-marketplace and add the following with a valid and registered set of credentials:
```
{
    "e2e_email": "valid_email",
    "e2e_password": "valid_password",
    "totp_secret": "valid_totp_secret"
} 
```
3) `npx cypress open`
4) When the Cypress UI launches, follow the prompts by clicking E2E tests and opening with a browser.