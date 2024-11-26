
require('dotenv').config();
const express = require('express');
const { json, urlencoded } = require('express');
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors');
const router = require('./routes/index');
const { setupSession, setupPassport, setupAuthRoutes } = require('./auth/googleAuth');

const app = express();

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

// Dynamic CORS settings based on environment
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: process.env.CLIENT_URL_PROD, credentials: true }
  : { origin: process.env.CLIENT_URL_DEV, credentials: true };

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));

// Setup sessions and authentication
setupSession(app);
setupPassport(app);
setupAuthRoutes(app);

// API routes
app.use('/api', router);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API!', version: '1.0.0' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Server initialization
const PORT = process.env.PORT || 7888;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


// // Розкоментувати на продакшні
// app.use(express.static(__dirname));
// app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));

// // Розкоментувати на продакшні
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`Server running at :${PORT}/`);
// });

// // Розкоментувати на продакшні

// // Запустити сервер
// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/.../privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/.../fullchain.pem')
// };

// // Розкоментувати на продакшні
// https.createServer(options, app).listen(443, () => {
//   console.log('Server running at :443/');
// });
