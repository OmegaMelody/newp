const { pool } = require('../db/database');



const googleAuth = (req, res) => {
    // Редирект на URL авторизації Google
    const googleAuthUrl = '';
    const clientId = '';
    const redirectUri = 'http://localhost:5000/auth/google/callback';
    const scope = 'profile email';

    const authUrl = `${googleAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

    res.redirect(authUrl);
  };


module.exports = {
    googleAuth,
}