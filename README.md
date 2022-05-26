# Interview Scheduler
Interview Scheduler is a simple and lightweight appointment scheduling tool developed for educational purposes. It is a responsive single-page web app developed using React. No user registration is available but all information is stored in a separate database and information is updated for concurrent users using WebSockets.

## Screenshots

!["Screenshot of home page"](https://github.com/charlesvngo/scheduler/blob/master/docs/Homepage.png?raw=true)

!["Screenshot of form element"](https://github.com/charlesvngo/scheduler/blob/master/docs/Create%20Form.png?raw=true)

!["Gif of creating and deleting an appointment"](https://github.com/charlesvngo/scheduler/blob/master/docs/Create%20and%20Delete.gif?raw=true)

## Dependencies
- react
- react-dom
- react-scripts
- axios
- classnames
- normalize.css

## Development Dependencies
- react-test-renderer
- prop-types
- node-sass
- cypress
- eslint-plugin-cypress

## Setup

Download the server at https://github.com/charlesvngo/scheduler-api and follow the install instructions there.
Install dependencies with `npm install`.
Create a .env.development file containing the following:

```sh
REACT_APP_WEBSOCKET_URL=ws://localhost:8001
PORT=8000
CHOKIDAR_USEPOLLING=false
```

Connect to the server by going to http://localhost:8000 on your browser.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Running Cypress Testing

```sh
npm run cypress
```
