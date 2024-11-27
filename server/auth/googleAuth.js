// googleAuth.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const { pool } = require('../db/database');
require('dotenv').config();

function setupSession(app) {
  app.use(session({
    secret: process.env.SESSION_SECRET, // зчитуємо секрет з .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 604800000, // 7 days in milliseconds
    },
  }));
}
//



function setupPassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // зчитуємо clientID з .env
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // зчитуємо clientSecret з .env
    callbackURL: process.env.GOOGLE_CALLBACK_URL, // зчитуємо callback URL з .env
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
      const userData = req.user;
      const existingUser = await findOrCreateUser(userData);
      req.session.user = existingUser;
      
      const clientUrl = process.env.NODE_ENV === 'production'
          ? process.env.CLIENT_URL_PROD
          : process.env.CLIENT_URL_DEV;
    
      res.redirect(`${clientUrl}/`);
    }
  );
}

function setupAuthRoutes(app) {
  app.get('/auth/user', (req, res) => {
    res.send(req.session.user);
  });

  app.get('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
      });
    });
  });

  app.get('/api/protected/data', (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({ message: 'You are authorized!' });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  });
}

async function findOrCreateUser(userData) {
  const query = 'SELECT * FROM users WHERE google_id = $1';
  const values = [userData.id];
  const result = await pool.query(query, values);

  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    const insertQuery = 'INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3) RETURNING *';
    const insertValues = [userData.id, userData.displayName, userData.emails[0].value];
    const insertResult = await pool.query(insertQuery, insertValues);
    return insertResult.rows[0];
  }
}

module.exports = {
  setupSession,
  setupPassport,
  setupAuthRoutes
};
