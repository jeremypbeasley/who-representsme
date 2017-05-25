# Am I Represented?

A little web app that allows the user to input a zip code and shows them their local representatives (complete with twitter, photos, and contact info). Find out who represents you and tell ‘em what you think!

### Data

We get all our representatives info from the [Google Civic Information API](https://developers.google.com/civic-information/). Data is easily the weakest part of our app. Images come back in varying shapes and sizes and contact information of each representative can be hit or miss. We're pursuing ways to fix this with a more distributed data model.

### Get started

Our app is built on `Node` (`6.9.1`). We use `npm` (`4.1.1`) to manage all dependencies. The whole app runs on a server executed from `app.js` using `Express`.

### Run the app

1. Clone the repo.
2. Set up your environment (instructions below).
3. Install `Node` and `npm`
4. `npm install`.
5. `grunt` (we use this to compile `stylus` and our client side JavaScript)
6. Run the app with `npm run start`
7. Open the app `http://localhost:7000`

### Local environment

Everyone has their secrets. Our's is a key we use to call the [Google Civic Information API](https://developers.google.com/civic-information/). This key is stored in a file that you must create in the root of the repo, titled `.env`.

It should look like so: `GOOGLE_API_KEY=KEYGOESHERE`. We can't share ours but it's quite easy to set up yourself [here](https://developers.google.com/civic-information/docs/using_api). Once this is set up, `dotenv` will know to look for it there and use it as a variable in `app.js`.

### Deployment

All code or branches merged to `master` automatically deploy to our `heroku` hosting within seconds. Needless to say, don't fuck with `master` without review.

### Issues?

This app is a work in progress. If you find a bug, report it! We'd love your help in making it better.

XO
