# [Tiny API](https://tiny-api.dev) - A Tiny API To Make Tiny APIs
![Website Preview](https://github.com/cameronhh/tiny-api-client/blob/master/.github/repo-image.png)

- *Quickly prototyping some front-end code and need a couple of endpoints to return some static JSON?*
- *Perhaps you're integrating a front-end with a back-end that doesn't have a test server?*
- ***Make an endpoint that returns static JSON in seconds with [Tiny API](https://tiny-api.dev)***


This repo is the front end code for [tiny-api.dev](https://tiny-api.dev). The Tiny API website was created with [Create React App](https://github.com/facebook/create-react-app).
<!-- The code for the server can be found [here](https://github.com/cameronhh/tiny-api). It's not a public repo yet! -->

## Setting up the development environment

### 1. Install dependencies

Run `npm i` or `yarn install`

### 2. Set environment variables

The package scripts have been adjusted and assume you have a `.env` file in the root directory.

Create a `.env` file with the following variables:

```
REACT_APP_API_URL=http://localhost:8080
PORT=3000
```

### 3. Run the development server

To run the server, run `npm run start` or `yarn start`
