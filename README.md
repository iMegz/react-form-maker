# Forms Chief

**Forms Chief** is a web application that allows you to create forms and share it with the ability to use different types of questions

## Tech Stack

- **Client**: TypeScript (React)
- **Server**: NodeJS (Express)
- **Database**: MongoDB
- **Authentication**: Auth0
- **State Management**: React Query
- **Schema Validation**: Zod
- **Payment Processing**: Stripe

## Features

- Responsive design
- Supports 7 Question types, with the ease of adding new question types or add more configrations to existing types

## Run Locally

### Server

[GitHub Repo](https://github.com/iMegz/express-form-maker)

#### Installation

```bash
git clone https://github.com/iMegz/express-form-maker
cd .\express-form-maker
npm install
npm start
```

#### Environment variables

- **AUTH0_DOMAIN :** Auth0 Domain prefixed with `https://`
- **AUTH0_API_ID :** Auth0 API identifier
- **AUTH0_CLIENT_ID :** Auth0 Machine to Machine Client ID
- **AUTH0_CLIENT_SECRET :** Auth0 Machine to Machine client secret
- **MONGODB_URI :** MongoDB URI
- **STRIPE_SECRET_KEY :** Stripe secret key
- **ENDPOINT_SECRET :** Stripe webhook endpoint secret
- **DEV_MGMT_TOKEN :** _(optional)_ Managment API token for development

### Client

[GitHub Repo](https://github.com/iMegz/react-form-maker)

#### Installation

```bash
git clone https://github.com/iMegz/react-form-maker
cd .\react-form-maker
npm install
npm run dev
```

#### Environment variables

- **VITE_AUTH0_DOMAIN :** Auth0 Domain **NOT** prefixed with `https://`
- **VITE_AUTH0_CLIENT_ID :** Auth0 SPA client id
- **VITE_AUTH0_API_IDENTIFIER :** Auth0 SPA identifier
- **VITE_API :** `"http://localhost:8080/api"`
- **VITE_ORIGIN :** `"http://localhost:3000"`

## TODO

- **Do some overall code cleaning**
- **Optimize `Form` component** (Not fully satisfied with it 🙄)
- **Add backend validation** (I know it is very necessary but I was mainly practicing React with the newly learned tools 😅)
- **Optimize stats route**

## Authors

- [Ahmed Magdi](https://github.com/imegz)
