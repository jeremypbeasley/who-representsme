# Am I Represented?

A little web app that allows the user to input a zip code and shows them their local representatives (complete with twitter, photos, and contact info). Find out who represents you and tell ‘em what you think!

### Get started

Our app is built on `Node` (`6.9.1`). We use `npm` (`4.1.1`) to manage all dependencies. The whole app runs on a server executed from `app.js` using `Express`.

### Run the app

1. Install `Node` and `npm`
2. `npm install`.
3. `grunt` (we use this to compile `stylus` and our client side JavaScript)
4. Run the app with `npm run dev`
5. Open the app `http://localhost:7000`

### Data

We get all our representatives info from [Google’s Civic Information AP](Ihttps://developers.google.com/civic-information/). Data is easily the weakest part of our app. Images come back in varying shapes and sizes and contact information of each representative can be hit or miss. We're pursuing ways to fix this with a more distributed data model.

### Deployment

All code or branches merged to `master` automatically deploy to our `heroku` hosting within seconds. Needless to say, don't fuck with `master` without review.

### Issues?

This app is a work in progress. If you find a bug, report it! We'd love your help in making it better.

XO
