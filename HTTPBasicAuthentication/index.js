const express = require('express')
const app = express()
const port = 3000

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

// Hard coded array of users
const users = [
    {
        id: 1,
        username: "John",
        password: "password"
    },
    {
        id: 2,
        username: "Jane",
        password: "SecretPassword"
    }
];

passport.use(new BasicStrategy(
    function(username, password, done) {
        // Check credentials
        // Find user from users array
        const user = users.find( user => user.username === username );
        // If the user exists
        if ( user != null && user.password === password ) {
            // login ok
            done(null, user);
        } else {
            // else Reject request
            done(null, false);
        }
            
    }

))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Profile page - authentication required
app.get('/profile', passport.authenticate('basic', { session: false }), (req, res) => {
    res.send('Profile page');
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})