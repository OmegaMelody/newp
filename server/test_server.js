
const request = require('supertest');
const app = require('../server/index'); // Assuming the main server file is named 'index.js'


describe('API Routes', () => {
    // Root route test
    it('should respond with 200 on GET /', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Welcome to the API!');
    });

    // Example of testing auth route
    it('should redirect to Google OAuth2 on GET /auth/google', async () => {
        const response = await request(app).get('/auth/google');
        expect(response.statusCode).toBe(302); // Redirection
        expect(response.headers.location).toContain('accounts.google.com');
    });

    // Test for a valid /api/places route
    it('should respond with 200 on GET /api/places', async () => {
        const response = await request(app).get('/api/places');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });

    // Invalid route test
    it('should handle invalid routes with 404', async () => {
        const response = await request(app).get('/invalid-route');
        expect(response.statusCode).toBe(404);
    });
});

describe('Error Handling', () => {
    it('should return 500 for server errors', async () => {
        // Simulate server error for a specific route
        const response = await request(app).get('/api/simulate-error');
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
});
