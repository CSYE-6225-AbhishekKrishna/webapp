const request = require('supertest');
const app = require('../app'); // Import your Express app

describe('Integration Test: /healthz Endpoint', () => {
  it('should return status code 200', async () => {
    const response = await request(app).use('/healthz');
    expect(response.status).toBe(200);
  });
});