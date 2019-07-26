const axios = require('axios');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./routes-model.js")

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  let user = req.body
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash

  if (user.username && user.password) {
    Users.findBy({ username: user.username })
      .then(foundUser => {
        if (foundUser) {
          res.status(409).json({ message: "Username already exists" })
        } else {
          Users.add(user)
            .then(saved => {
              res.status(201).json(saved)
            })
            .catch(err => {
              res.status(500).json(err)
            })
        }
      })
  }


}

function login(req, res) {
  // implement user login
  let { username, password } = req.body

  Users.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)

        res.status(200).json({
          message: "Login successful, token generated",
          token
        })
      } else {
        res.status(401).json({ message: "Username/Password incorrect"})
      }
    })
    .catch(err => {
      res.status(500),json(err)
    })
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

function generateToken(user) {
  const jwtPayload = {
      subject: user.id,
      username: user.username,
    };
  
    const jwtOptions = {
      expiresIn: '1d',
    };
    return jwt.sign(jwtPayload, secrets.jwtSecret, jwtOptions);
}
