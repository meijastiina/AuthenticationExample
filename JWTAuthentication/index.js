const express = require('express')
const app = express()
const port = 3000

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt;

const jwt = require('jsonwebtoken');

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

));
// Define options for JWTStrategy
const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: "MySecretKey"
}
passport.use(new JWTStrategy( options, function(jwtPayload, done) {
    console.log(jwtPayload);
    done(null, jwtPayload);
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Profile page - authentication required
app.post('/login', passport.authenticate('basic', { session: false }), (req, res) => {
    const payload =  {
        user: {
            id: req.user.id,
            username: req.user.username
        }
    };
    const options = {
        expiresIn: '1d'
    }
    const secretKey = "MySecretKey";
    // Generate JSON Web Token
    const generatedJWT = jwt.sign(payload, secretKey, options);
    res.json({ jwt: generatedJWT });
  })

app.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send("Hello " + req.user.user.username);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})